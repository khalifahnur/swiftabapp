import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Device from "expo-device";
import * as Location from "expo-location";
import * as Notifications from "expo-notifications";
import { useEffect, useState } from "react";
import { Platform } from "react-native";

export const useAppPermissions = () => {
  const [permissions, setPermissions] = useState({
    location: false,
   // camera: false,
    notifications: false,
    pushToken: null as string | null,
  });

  // Register for push notifications and get Expo token
  const registerForPushNotifications = async () => {
    if (!Device.isDevice) {
      console.warn("Must use a physical device for push notifications");
      return null;
    }

    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== "granted") {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    if (finalStatus !== "granted") {
      console.warn("Failed to get push notification permissions!");
      return null;
    }

    try {
      const { data: expoPushToken } = await Notifications.getExpoPushTokenAsync();
      console.log("Expo Push Token:", expoPushToken);
      await AsyncStorage.setItem("expoPushToken", expoPushToken);
      return expoPushToken;
    } catch (error) {
      console.error("Error fetching Expo push token:", error);
      return null;
    }
  };

  useEffect(() => {
    const requestPermissions = async () => {
      try {
        // Request location permission
        const locationStatus = await Location.requestForegroundPermissionsAsync();
        const hasLocationPermission = locationStatus.status === "granted";

        // Request camera permission
        // const cameraStatus = await Camera.getCameraPermissionStatus();
        // const hasCameraPermission =
        //   cameraStatus === "granted" ||
        //   (await Camera.requestCameraPermission()) === "granted";

        // Request notifications permissions
        const { status: notifStatus } = await Notifications.getPermissionsAsync();
        let hasNotificationPermission = notifStatus === "granted";

        if (!hasNotificationPermission) {
          const { status } = await Notifications.requestPermissionsAsync();
          hasNotificationPermission = status === "granted";
        }

        let pushToken = null;
        if (hasNotificationPermission) {
          pushToken = await registerForPushNotifications();
        }

        setPermissions((prev) => ({
          ...prev,
          location: hasLocationPermission,
          //camera: hasCameraPermission,
          notifications: hasNotificationPermission,
          pushToken,
        }));

        if (!hasNotificationPermission) {
          alert("Please enable notifications in settings!");
        }
      } catch (error) {
        console.error("Permission error:", error);
      }
    };

    requestPermissions();

    // Set up notification listeners
    const notificationReceivedListener =
      Notifications.addNotificationReceivedListener((notification) => {
        console.log("Notification received:", notification);
      });

    const notificationResponseListener =
      Notifications.addNotificationResponseReceivedListener((response) => {
        console.log("Notification response:", response);
      });

    // Set notification handler inside useEffect
    Notifications.setNotificationHandler({
      handleNotification: async () => ({
        shouldShowBanner: true,
        shouldShowList: true,
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: false,

      }),
    });

    // Android notification channel setup
    if (Platform.OS === "android") {
      Notifications.setNotificationChannelAsync("default", {
        name: "Default Channel",
        importance: Notifications.AndroidImportance.HIGH,
        sound: "default",
      });
    }

    return () => {
      notificationReceivedListener.remove();
      notificationResponseListener.remove();
    };
  }, []);

  return permissions;
};
