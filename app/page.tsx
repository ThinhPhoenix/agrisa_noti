"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect } from "react";

function HomePage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    useEffect(() => {
        const user_id = searchParams.get("user_id");
        if (user_id) {
            router.replace(`/noti?user_id=${user_id}`);
        } else {
            // Redirect to /noti even without user_id, the page will handle it
            router.replace("/noti");
        }
    }, [router, searchParams]);
    return (
        <div className="flex items-center justify-center w-full min-h-screen text-center">
            Đang chuyển hướng...
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
