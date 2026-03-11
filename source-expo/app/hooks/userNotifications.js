import { useEffect, useState } from "react";
import * as Notifications from "expo-notifications";
import { Platform } from "react-native";
import { registerForPushNotificationsAsync } from "@/services/notification.service";
import { registerDevice } from "@/apis/notificationApi";
import { startNotificationConnection, stopNotificationConnection } from "@/services/realtime.service";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export function useNotifications(token, userId) {
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    if (!token || !userId) {
      return;
    }

    let isMounted = true;

    async function init() {
      const pushToken = await registerForPushNotificationsAsync();

      if (pushToken) {
        await registerDevice(pushToken, Platform.OS, userId);
      }

      await startNotificationConnection(
        "http://192.168.1.118:5029",
        token,
        {
          onNotificationReceived: (notification) => {
            if (!isMounted) return;
            console.log("Notification geldi:", notification);
          },
          onUnreadCountChanged: (count) => {
            if (!isMounted) return;
            setUnreadCount(count);
          },
        }
      );
    }

    init().catch((error) => {
      console.log("init error:", error);
    });

    // PUSH BİLDİRİMİNE TIKLANINCA BURASI ÇALIŞIR
    const responseListener =
      Notifications.addNotificationResponseReceivedListener((response) => {
        const data = response.notification.request.content.data;
        console.log("Push tıklandı:", data);
      });

    // APP AÇIKKEN PUSH GELİRSE BURASI ÇALIŞIR
    const foregroundListener =
      Notifications.addNotificationReceivedListener((notification) => {
        console.log("Foreground push geldi:", notification);
      });

    return () => {
      isMounted = false;
      responseListener.remove();
      foregroundListener.remove();
      stopNotificationConnection();
    };
  }, [token, userId]);

  return { unreadCount };
}