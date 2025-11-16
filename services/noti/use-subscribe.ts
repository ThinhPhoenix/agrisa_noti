import { useCallback } from "react";
import http from "@/libs/axios-instance";
import { endpoints } from "@/services/endpoints";

export const useSubscribe = (user_id?: string) => {
  const subscribeWeb = useCallback(
    async (endpoint: string, p256dh: string, auth: string) => {
      if (!endpoint) throw new Error("Missing subscription endpoint");
      const { data } = await http.post(endpoints.pushed_noti.subscribe_web, {
        user_id,
        endpoint,
        keys: { p256dh, auth },
      });
      return data;
    },
    [user_id]
  );

  return {
    subscribeWeb,
  };
};

export default useSubscribe;
