import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Notifications from "expo-notifications";
import { useRouter } from "expo-router";
import moment from "moment";
import React, { useEffect, useState } from "react";
import {
  Alert,
  Image,
  Platform,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { userCancellationReservation } from "@/hooks/reservationhooks/reservehook";

interface Props {
  items: {
    date: string;
    time: string;
    location: string;
    rate: string;
    image: string;
    restaurantName: string;
    restaurantId: string;
    reservationId: string;
    id: string;
    table: string;
  };
}

export default function ReservationCard({ items }: Props) {
  const [isRemind, setIsRemind] = useState(false);
  const [userData, setUserData] = useState<any>({});

  const handleCancelMutate = userCancellationReservation();
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userObjStr = await AsyncStorage.getItem("userObj");
        const userObj = JSON.parse(userObjStr || "{}");
        setUserData(userObj.user || {});
      } catch (error) {
        console.error("Failed to load user data", error);
      }
    };
    fetchData();

    const checkExistingReminders = async () => {
      const scheduled = await Notifications.getAllScheduledNotificationsAsync();
      const isScheduled = scheduled.some(
        (notif) => notif.identifier === items.reservationId,
      );
      setIsRemind(isScheduled);
    };
    checkExistingReminders();
  }, [items.reservationId]);

  if (!items) return null;

  const userId = userData?.userId || "";

  const dateTimeString = `${items.date} ${items.time}`;
  const reservationTime = moment(dateTimeString, [
    "YYYY-MM-DD HH:mm",
    "YYYY-MM-DD hh:mm A",
  ]);

  const formattedTime = reservationTime.format("MMM DD, YYYY • hh:mm A");
  const reserveTimeStr = reservationTime.format("hh:mm A");

  const handleCancel = () => {
    handleCancelMutate.mutate({
      id: items.id,
      userId,
      restaurantId: items.restaurantId,
      reservationId: items.reservationId,
    });
  };

  const setupNotificationChannel = async () => {
    if (Platform.OS === "android") {
      await Notifications.setNotificationChannelAsync("reservation-reminders", {
        name: "Reservation Reminders",
        importance: Notifications.AndroidImportance.HIGH,
        sound: "default",
        vibrationPattern: [0, 250, 250, 250],
        lightColor: "#0d9488",
      });
    }
  };

  const scheduleReminderNotification = async () => {
    try {
      const { status: existingStatus } =
        await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;

      if (existingStatus !== "granted") {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }

      if (finalStatus !== "granted") {
        Alert.alert(
          "Permission Denied",
          "Please enable notifications in your phone settings to receive reminders.",
        );
        setIsRemind(false);
        return;
      }

      await setupNotificationChannel();

      const now = moment();
      const minutesUntilReservation = reservationTime.diff(now, "minutes");

      if (minutesUntilReservation <= 0) {
        Alert.alert(
          "Too Late",
          "This reservation has already started or passed.",
        );
        setIsRemind(false);
        return;
      }

      await Notifications.cancelScheduledNotificationAsync(items.reservationId);

      let triggerConfig: Notifications.NotificationTriggerInput;
      let notificationBody = "";

      if (minutesUntilReservation <= 30) {
        triggerConfig = { seconds: 1, channelId: "reservation-reminders" };
        notificationBody = `Hurry! Your table at ${items.restaurantName} is ready in ${minutesUntilReservation} minutes (${reserveTimeStr}).`;
      } else {
        const reminderTime = reservationTime.clone().subtract(30, "minutes");
        triggerConfig = {
          date: reminderTime.toDate(),
          channelId: "reservation-reminders",
        };
        notificationBody = `Your table at ${items.restaurantName} will be ready in at ${reserveTimeStr}.`;
      }

      await Notifications.scheduleNotificationAsync({
        identifier: items.reservationId,
        content: {
          title: `⏳ Upcoming Reservation`,
          body: notificationBody,
          sound: "default",
          data: { reservationId: items.reservationId },
        },
        trigger: triggerConfig,
      });
    } catch (error) {
      console.error("Error scheduling reminder:", error);
      setIsRemind(false);
    }
  };

  const handleReminderToggle = async (value: boolean) => {
    setIsRemind(value);
    if (value) {
      await scheduleReminderNotification();
    } else {
      await Notifications.cancelScheduledNotificationAsync(items.reservationId);
    }
  };

  return (
    <View className="bg-white mx-6 mb-4 rounded-3xl p-4 shadow-sm border border-gray-100">
      <View className="flex-row justify-between items-center mb-3">
        <Text className="text-gray-900 font-bold text-sm">{formattedTime}</Text>
        <View className="flex-row items-center bg-gray-50 px-3 py-1 rounded-full border border-gray-100">
          <Text className="text-gray-500 font-medium text-xs mr-2">
            Remind me
          </Text>
          <Switch
            value={isRemind}
            onValueChange={handleReminderToggle}
            trackColor={{ false: "#E5E7EB", true: "#0d9488" }}
            thumbColor="#fff"
            style={{ transform: [{ scaleX: 0.8 }, { scaleY: 0.8 }] }}
          />
        </View>
      </View>

      <View className="h-px bg-gray-100 w-full mb-3" />

      <View className="flex-row mb-4">
        <Image
          source={{ uri: items.image }}
          className="w-20 h-20 rounded-2xl bg-gray-100 mr-4"
        />
        <View className="flex-1 justify-center">
          <View className="flex-row justify-between items-center mb-1">
            <Text
              className="font-bold text-gray-900 text-base"
              numberOfLines={1}
            >
              {items.restaurantName}
            </Text>
            <View className="flex-row items-center bg-teal-50 px-2 py-0.5 rounded-md">
              <Ionicons name="star" size={12} color="#f5a623" />
              <Text className="text-teal-700 font-bold text-xs ml-1">
                {items.rate}
              </Text>
            </View>
          </View>

          <View className="flex-row items-center mb-1">
            <Ionicons name="location" size={14} color="#0d9488" />
            <Text
              className="text-gray-500 font-medium text-xs ml-1"
              numberOfLines={1}
            >
              {items.location}
            </Text>
          </View>
          <View className="flex-row items-center">
            <Ionicons name="restaurant" size={14} color="#9CA3AF" />
            <Text className="text-gray-400 font-medium text-xs ml-1">
              {items.table}
            </Text>
          </View>
        </View>
      </View>

      <View className="flex-row gap-3">
        <TouchableOpacity
          className="flex-1 bg-teal-600 py-3 rounded-lg items-center"
          onPress={() =>
            router.push({
              pathname: "/modal",
              params: {
                resturantName: items.restaurantName,
                restaurantId: items.restaurantId,
                userId,
                reservationId: items.reservationId,
                tableNumber: items.table,
              },
            })
          }
          disabled={!userId}
        >
          <Text className="text-white font-bold text-sm">Pre-Order Food</Text>
        </TouchableOpacity>

        <TouchableOpacity
          className="flex-1 bg-red-50 border border-red-100 py-3 rounded-lg items-center"
          onPress={handleCancel}
          disabled={!userId}
        >
          <Text className="text-red-500 font-bold text-sm">Cancel</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
