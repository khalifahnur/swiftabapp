import * as Location from "expo-location";
import * as Notifications from "expo-notifications";
import { useEffect, useState } from "react";
import { Platform } from "react-native";

export const useAppPermissions = () => {
  const [permissions, setPermissions] = useState({
    location: false,
    notifications: false,
  });

  useEffect(() => {
    const requestPermissions = async () => {
      try {
        // 1. Request Location Permission
        const locationStatus =
          await Location.requestForegroundPermissionsAsync();
        const hasLocationPermission = locationStatus.status === "granted";

        // 2. Request Local Notification Permissions
        const { status: existingStatus } =
          await Notifications.getPermissionsAsync();
        let finalStatus = existingStatus;

        if (existingStatus !== "granted") {
          const { status } = await Notifications.requestPermissionsAsync();
          finalStatus = status;
        }

        const hasNotificationPermission = finalStatus === "granted";

        setPermissions({
          location: hasLocationPermission,
          notifications: hasNotificationPermission,
        });

        if (!hasNotificationPermission) {
          console.warn("User denied local notifications.");
        }
      } catch (error) {
        console.error("Permission error:", error);
      }
    };

    requestPermissions();

    // 3. Set how notifications behave when the app is running in the foreground
    Notifications.setNotificationHandler({
      handleNotification: async () => ({
        shouldShowBanner: true,
        shouldShowList: true,
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: false,
      }),
    });

    // 4. Android requires a Notification Channel for local notifications to work
    if (Platform.OS === "android") {
      Notifications.setNotificationChannelAsync("default", {
        name: "Default Channel",
        importance: Notifications.AndroidImportance.HIGH,
        sound: "default",
      });
    }
  }, []);

  return permissions;
};
