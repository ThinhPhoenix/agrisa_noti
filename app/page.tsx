"use client";

import { is_standalone } from "@/libs/utils";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";

export default function Page() {
  const router = useRouter();
  const searchParams = useSearchParams();
  useEffect(() => {
    const user_id = searchParams.get("user_id");
    if (user_id && is_standalone) {
      router.replace(`/noti?user_id=${user_id}`);
    }
  }, [router, searchParams]);
  return <div className="flex items-center justify-center w-full min-h-screen text-center">Bấm chia sẻ và thêm ứng dụng vào màn hình chính để nhận thông báo.</div>;
}
