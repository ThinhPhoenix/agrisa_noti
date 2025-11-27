"use client";
import Assets from "@/assets";
import Switch from "@/components/switch";
import TextType from "@/components/text-type";
import useSubscribe from "@/services/noti/use-subscribe";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { Suspense, useCallback, useEffect, useMemo, useState } from "react";

function NotiPage() {
    const searchParams = useSearchParams();
    const user_id_from_url = searchParams.get("user_id");
    const user_id = useMemo(() => {
        if (user_id_from_url) {
            localStorage.setItem("user_id", user_id_from_url);
            return user_id_from_url;
        } else {
            return localStorage.getItem("user_id");
        }
    }, [user_id_from_url]);
    const [isNotificationEnabled, setIsNotificationEnabled] = useState(false);
    const [permissionMessage, setPermissionMessage] = useState("");
    const [isIOSStandalone, setIsIOSStandalone] = useState(false);
    const [userIdInput, setUserIdInput] = useState("");

    console.log("User ID:", user_id);

    const checkNotificationPermission = () => {
        setIsIOSStandalone(false);
        if ("Notification" in window) {
            if (Notification.permission === "granted") {
                setIsNotificationEnabled(true);
                setPermissionMessage("Quyền thông báo đã được cấp.");
            } else if (Notification.permission === "denied") {
                setIsNotificationEnabled(false);
                setPermissionMessage("Quyền thông báo bị từ chối.");
            } else {
                setIsNotificationEnabled(false);
                setPermissionMessage("");
            }
        } else {
            setIsNotificationEnabled(false);
            setPermissionMessage("Trình duyệt không hỗ trợ thông báo.");
        }
    };

    const { subscribeWeb } = useSubscribe(user_id ?? undefined);

    const urlBase64ToUint8Array = (base64String: string) => {
        const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
        const base64 = (base64String + padding)
            .replace(/-/g, "+")
            .replace(/_/g, "/");
        const rawData = window.atob(base64);
        const outputArray = new Uint8Array(rawData.length);
        for (let i = 0; i < rawData.length; ++i) {
            outputArray[i] = rawData.charCodeAt(i);
        }
        return outputArray;
    };

    const arrayBufferToBase64 = (buffer: ArrayBuffer) => {
        const bytes = new Uint8Array(buffer);
        let binary = "";
        for (let i = 0; i < bytes.byteLength; i++) {
            binary += String.fromCharCode(bytes[i]);
        }
        return window.btoa(binary);
    };

    const subscribeWebPush = useCallback(async () => {
        console.log("Starting subscribeWebPush...");
        if ("serviceWorker" in navigator && "PushManager" in window) {
            try {
                console.log("Registering service worker...");
                const registration = await navigator.serviceWorker.register(
                    "/sw.js"
                );
                console.log("Service Worker registered");

                const vapidKey =
                    process.env.NEXT_PUBLIC_VAPID_KEY || "YOUR_VAPID_KEY"; // Add your VAPID key here
                console.log("VAPID Key:", vapidKey);
                const subscription = await registration.pushManager.subscribe({
                    userVisibleOnly: true,
                    applicationServerKey: urlBase64ToUint8Array(vapidKey),
                });
                console.log("Push subscription:", subscription);

                const { endpoint } = subscription;
                const p256dhKey = subscription.getKey("p256dh");
                const authKey = subscription.getKey("auth");
                const p256dh = p256dhKey ? arrayBufferToBase64(p256dhKey) : "";
                const auth = authKey ? arrayBufferToBase64(authKey) : "";
                console.log("Keys - p256dh:", p256dh, "auth:", auth);

                if (user_id) {
                    console.log(
                        "Sending subscription to backend for user_id:",
                        user_id
                    );
                    await subscribeWeb(endpoint, p256dh, auth);
                    console.log("Web push subscribed");
                } else {
                    console.log("No user_id found, skipping subscription");
                }
            } catch (error) {
                console.error("Error subscribing to web push:", error);
            }
        } else {
            console.log("Service Worker or PushManager not supported");
        }
    }, [user_id, subscribeWeb]);

    const requestNotificationPermission = async () => {
        setIsIOSStandalone(false);
        console.log("Requesting notification permission...");
        if ("Notification" in window) {
            const permission = await Notification.requestPermission();
            if (permission === "granted") {
                console.log("Quyền thông báo đã được cấp");
                setIsNotificationEnabled(true);
                setPermissionMessage("Quyền thông báo đã được cấp.");
                await subscribeWebPush();
            } else {
                console.log("Quyền thông báo bị từ chối");
                setIsNotificationEnabled(false);
                setPermissionMessage("Quyền thông báo bị từ chối.");
            }
        } else {
            console.log("Trình duyệt không hỗ trợ thông báo");
            setIsNotificationEnabled(false);
            setPermissionMessage("Trình duyệt không hỗ trợ thông báo.");
        }
    };

    const handleSwitchChange = async (checked: boolean) => {
        if (checked) {
            await requestNotificationPermission();
        } else {
            // Can't revoke permission programmatically, show browser alert
            if (Notification.permission === "granted") {
                alert(
                    "Không thể tắt quyền thông báo từ đây. Vui lòng vào cài đặt trình duyệt để tắt quyền thông báo cho trang web này."
                );
            } else {
                setIsNotificationEnabled(false);
                setPermissionMessage("");
            }
        }
    };

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        checkNotificationPermission();
    }, []);

    useEffect(() => {
        if (
            user_id &&
            "Notification" in window &&
            Notification.permission === "granted"
        ) {
            subscribeWebPush();
        }
    }, [user_id, subscribeWebPush]);

    const handleSaveUserId = () => {
        if (userIdInput.trim()) {
            localStorage.setItem("user_id", userIdInput.trim());
            window.location.href = `/noti?user_id=${userIdInput.trim()}`;
        }
    };

    // Show user_id input form if no user_id is available
    if (!user_id) {
        return (
            <div className="flex items-center justify-center min-h-screen flex-col p-4">
                <Image
                    src={Assets.ImagesNoti.src}
                    alt={""}
                    width={200}
                    height={200}
                    className="hue-rotate-220"
                />
                <Image
                    src={Assets.ImagesAgrisa.src}
                    alt={""}
                    width={80}
                    height={80}
                    className="fix absolute top-0 left-0 p-4"
                />
                <h2 className="text-xl font-semibold mb-4">
                    Vui lòng nhập User ID
                </h2>
                <p className="text-sm text-gray-600 mb-4 text-center max-w-md">
                    Để nhận thông báo, bạn cần cung cấp User ID của mình.
                </p>
                <div className="flex flex-col gap-3 w-full max-w-xs">
                    <input
                        type="text"
                        value={userIdInput}
                        onChange={(e) => setUserIdInput(e.target.value)}
                        placeholder="Nhập User ID"
                        className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        onKeyPress={(e) => {
                            if (e.key === "Enter") {
                                handleSaveUserId();
                            }
                        }}
                    />
                    <button
                        onClick={handleSaveUserId}
                        className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed"
                        disabled={!userIdInput.trim()}
                    >
                        Xác nhận
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="flex items-center justify-center min-h-screen flex-col">
            <Image
                src={Assets.ImagesNoti.src}
                alt={""}
                width={200}
                height={200}
                className="hue-rotate-220"
            />
            <Image
                src={Assets.ImagesAgrisa.src}
                alt={""}
                width={80}
                height={80}
                className="fix absolute top-0 left-0 p-4"
            />
            <TextType
                text={[
                    "Chào mừng đến với Agrisa!",
                    "Ứng dụng thông báo trên web.",
                    "Nhận thông báo quan trọng từ Agrisa.",
                    "Cảm ơn bạn đã sử dụng ứng dụng của chúng tôi!",
                ]}
            />
            <div className="flex items-center mt-20 bg-gray-100 px-4 py-2 rounded-md w-full max-w-xs justify-between">
                <span>Yêu cầu cấp quyền thông báo</span>
                <Switch
                    checked={isNotificationEnabled}
                    onChange={handleSwitchChange}
                    disabled={isIOSStandalone}
                />
            </div>
            {permissionMessage && (
                <p className="mt-4 text-sm text-gray-600">
                    {permissionMessage}
                </p>
            )}
        </div>
    );
}

export default function Home() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <NotiPage />
        </Suspense>
    );
}
