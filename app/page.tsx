export const dynamic = "force-dynamic";
export const revalidate = 0;

"use client";

import Assets from "@/assets";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";

function HomePage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [isIOS, setIsIOS] = useState<boolean | null>(null);
    const [userId, setUserId] = useState("");
    const [isChecking, setIsChecking] = useState(true);

    useEffect(() => {
        // Force client-side detection
        const checkDevice = () => {
            const userAgent = navigator.userAgent.toLowerCase();
            const iOS = /iphone|ipad|ipod/.test(userAgent);

            console.log("User Agent:", userAgent); // Debug
            console.log("Is iOS:", iOS); // Debug

            setIsIOS(iOS);
            setIsChecking(false);

            const user_id = searchParams.get("user_id") || "";
            setUserId(user_id);

            if (!iOS) {
                // Android: redirect to /noti
                setTimeout(() => {
                    router.replace(
                        user_id ? `/noti?user_id=${user_id}` : "/noti"
                    );
                }, 100);
            }
        };

        checkDevice();
    }, [router, searchParams]);

    const copyUserId = () => {
        navigator.clipboard.writeText(userId);
        alert("Đã copy User ID!");
    };

    // Đang kiểm tra device
    if (isChecking || isIOS === null) {
        return (
            <div className="flex items-center justify-center w-full min-h-screen text-center">
                Đang tải...
            </div>
        );
    }

    // Là Android, đang redirect
    if (!isIOS) {
        return (
            <div className="flex items-center justify-center w-full min-h-screen text-center">
                Đang chuyển hướng...
            </div>
        );
    }

    return (
        <div className="flex flex-col items-center w-full min-h-screen p-6 bg-gradient-to-b from-blue-50 to-white">
            <div className="w-full max-w-2xl">
                <h1 className="text-3xl font-bold mb-2 text-center text-gray-800">
                    Thiết lập thông báo iOS
                </h1>
                <p className="text-center text-gray-600 mb-8">
                    Làm theo hướng dẫn bên dưới để nhận thông báo
                </p>

                {/* User ID Card */}
                <div className="bg-white rounded-xl shadow-md p-6 mb-8">
                    <label className="block text-sm font-semibold text-gray-700 mb-3">
                        User ID của bạn:
                    </label>
                    <div className="flex gap-3">
                        <input
                            type="text"
                            value={userId}
                            readOnly
                            className="flex-1 px-4 py-3 border-2 border-gray-200 rounded-lg bg-gray-50 text-gray-800 font-mono"
                        />
                        <button
                            onClick={copyUserId}
                            className="px-6 py-3 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 transition-colors shadow-sm"
                        >
                            Copy
                        </button>
                    </div>
                </div>

                {/* Instructions */}
                <div className="bg-white rounded-xl shadow-md p-6">
                    <h2 className="text-xl font-bold mb-6 text-gray-800">
                        Hướng dẫn thêm vào màn hình chính
                    </h2>

                    <div className="space-y-8">
                        {/* Step 1 */}
                        <div className="flex gap-4">
                            <div className="flex-shrink-0 w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center font-bold">
                                1
                            </div>
                            <div className="flex-1">
                                <p className="text-gray-700 mb-3">
                                    Nhấn vào nút <strong>Share</strong> (biểu
                                    tượng chia sẻ) ở thanh công cụ Safari
                                </p>
                                <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                                    <Image
                                        src={Assets.ImagesStep1.src}
                                        alt="Step 1"
                                        width={300}
                                        height={200}
                                        className="w-full rounded"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Step 2 */}
                        <div className="flex gap-4">
                            <div className="flex-shrink-0 w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center font-bold">
                                2
                            </div>
                            <div className="flex-1">
                                <p className="text-gray-700 mb-3">
                                    Cuộn xuống và chọn{" "}
                                    <strong>"Add to Home Screen"</strong>
                                </p>
                                <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                                    <Image
                                        src={Assets.ImagesStep3.src}
                                        alt="Step 2"
                                        width={300}
                                        height={200}
                                        className="w-full rounded"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Step 3 */}
                        <div className="flex gap-4">
                            <div className="flex-shrink-0 w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center font-bold">
                                3
                            </div>
                            <div className="flex-1">
                                <p className="text-gray-700 mb-3">
                                    Đặt tên cho shortcut và nhấn{" "}
                                    <strong>"Add"</strong>
                                </p>
                                <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                                    <Image
                                        src={Assets.ImagesStep4.src}
                                        alt="Step 3"
                                        width={300}
                                        height={200}
                                        className="w-full rounded"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Step 4 */}
                        <div className="flex gap-4">
                            <div className="flex-shrink-0 w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center font-bold">
                                4
                            </div>
                            <div className="flex-1">
                                <p className="text-gray-700 mb-3">
                                    Mở app từ màn hình chính để nhận thông báo
                                </p>
                                <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                                    <Image
                                        src={Assets.ImagesStep5.src}
                                        alt="Step 4"
                                        width={300}
                                        height={200}
                                        className="w-full rounded"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="mt-6 text-center text-sm text-gray-500">
                    💡 Lưu ý: Bạn cần mở app từ màn hình chính, không phải từ
                    Safari
                </div>
            </div>
        </div>
    );
}

export default function Page() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <HomePage />
        </Suspense>
    );
}
