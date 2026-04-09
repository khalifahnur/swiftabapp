import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router, Stack, useLocalSearchParams } from "expo-router";
import moment from "moment";
import "moment-timezone";
import React, { useEffect, useState } from "react";
import {
  Alert,
  Image,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useCreateReservation } from "@/hooks/reservationhooks/reservehook";
import useStore from "@/store/useStore";
import { Reservation, ReservationResponse } from "@/types";
import Details from "./Details";
import SuccessModal from "./SuccessfulModal";

interface UserData {
  email: string;
  name: string;
  phoneNumber: string;
  userId: string;
}

const ReviewSummary: React.FC = () => {
  const param = useLocalSearchParams();
  const insets = useSafeAreaInsets();

  const {
    selectedDate,
    guestCount,
    selectedTableId,
    selectedStartTime,
    selectedEndTime,
    selectedFloorTxt,
    setSelectedDate,
    setGuestCount,
    setSelectedStartTime,
    setSelectedEndTime,
    setSelectedFloorTxt,
    setSelectedTable,
  } = useStore();

  const [userData, setUserData] = useState<UserData>({} as UserData);
  const [fcmToken, setFcmToken] = useState<string | null>();
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [reservationDetails, setReservationDetails] =
    useState<ReservationResponse | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const image = Array.isArray(param.image) ? param.image[0] : param.image;
  const location = Array.isArray(param.location)
    ? param.location[0]
    : param.location;
  const rate = Array.isArray(param.rate) ? param.rate[0] : param.rate;
  const restaurantName = Array.isArray(param.restaurantName)
    ? param.restaurantName[0]
    : param.restaurantName;
  const restaurantId = Array.isArray(param.restaurantId)
    ? param.restaurantId[0]
    : param.restaurantId;

  const reserveMutation = useCreateReservation({
    onSuccess: (data) => {
      setReservationDetails(data);
      setShowSuccessModal(true);
    },
    onError: (error) => {
      Alert.alert("Error", error.message);
      setIsSubmitting(false);
    },
  });

  const handleModalVisible = () => {
    setShowSuccessModal(false);
    setSelectedDate("");
    setGuestCount(0);
    setSelectedStartTime("");
    setSelectedEndTime("");
    setSelectedFloorTxt("");
    setSelectedTable("");
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userObj = JSON.parse(
          (await AsyncStorage.getItem("userObj")) || "{}",
        );
        const token = await AsyncStorage.getItem("expoPushToken");
        setUserData(userObj.user);
        setFcmToken(token);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };
    fetchData();
  }, []);

  const dateTimeString = `${selectedDate}T${selectedStartTime}:00`;
  const dateTime = moment.tz(dateTimeString, "Africa/Nairobi");
  const formattedDateTime = dateTime.format("MMM Do, YYYY | hh:mm A");
  const normalizeStartTime = dateTime.toDate();
  const fullEndTime = moment
    .tz(`${selectedDate}T${selectedEndTime}:00`, "Africa/Nairobi")
    .toDate();
  const nowInNairobi = moment
    .tz("Africa/Nairobi")
    .format("MMM Do, YYYY | hh:mm A");

  const { email, name, phoneNumber, userId } = userData;

  const handleReservation = () => {
    if (isSubmitting) return;
    setIsSubmitting(true);

    if (!userData || !restaurantId || !userId) {
      Alert.alert("Error", "Missing user or restaurant information");
      setIsSubmitting(false);
      return;
    }

    const reservationData: Reservation = {
      // restaurantInfo: {
      //   restaurantId,
      //   restaurantName,
      //   image,
      //   location,
      //   longitude: Number(param.longitude) || 0,
      //   latitude: Number(param.latitude) || 0,
      //   rate,
      // },
      reservationInfo: {
        userId,
        name,
        email,
        phoneNumber,
        // bookingDate: normalizeStartTime,
        // bookingFor: normalizeStartTime,
        // endTime: fullEndTime,
        bookingDate: new Date().toISOString(),
        bookingFor: normalizeStartTime.toISOString(),
        endTime: fullEndTime.toISOString(),
        guests: guestCount,
        tableNumber: selectedTableId,
        diningArea: selectedFloorTxt,
        restaurantName,
      },
    };

    reserveMutation.mutate({
      restaurantId,
      userId,
      data: reservationData,
    });
  };

  return (
    <View className="flex-1 bg-gray-50">
      <Stack.Screen options={{ headerShown: false }} />
      <View className="flex-row items-center px-6 py-4 bg-gray-50 pt-10">
        <TouchableOpacity
          onPress={() => router.back()}
          className="w-10 h-10 bg-white rounded-full items-center justify-center shadow-sm border border-gray-200"
        >
          <Ionicons name="arrow-back" size={20} color="#111827" />
        </TouchableOpacity>
        <Text className="flex-1 text-center font-bold text-xl text-gray-900 mr-10">
          Summary
        </Text>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 24, paddingBottom: 120 }}
      >
        <View className="flex-row bg-white rounded-3xl p-4 mb-6 shadow-sm border border-gray-100 items-center">
          <Image
            source={{ uri: image }}
            className="w-20 h-20 rounded-2xl bg-gray-100 mr-4"
          />
          <View className="flex-1 justify-center">
            <Text
              className="font-bold text-gray-900 text-lg mb-1"
              numberOfLines={1}
            >
              {restaurantName}
            </Text>
            <View className="flex-row items-center mb-1">
              <Ionicons name="restaurant" size={14} color="#0d9488" />
              <Text className="text-gray-500 font-medium text-xs ml-1">
                Table Reservation
              </Text>
            </View>
            <Text
              className="font-medium text-gray-400 text-xs"
              numberOfLines={1}
            >
              {location}
            </Text>
          </View>
        </View>

        <Details
          name={name}
          email={email}
          phoneNumber={phoneNumber}
          bookingDate={nowInNairobi}
          formattedDateTime={formattedDateTime}
          guestCount={guestCount}
          selectedTableId={selectedTableId}
          selectedFloor={selectedFloorTxt}
        />
      </ScrollView>
      <View
        className="absolute bottom-0 w-full bg-white border-t border-gray-100 px-6 pt-4 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]"
        style={{ paddingBottom: Math.max(insets.bottom, 20) }}
      >
        <TouchableOpacity
          className={`flex-row justify-center items-center py-4 rounded-xl shadow-sm gap-2 ${isSubmitting ? "bg-teal-600/60" : "bg-teal-600"}`}
          onPress={handleReservation}
          disabled={isSubmitting}
        >
          <Text className="text-white text-lg font-bold">
            {isSubmitting ? "Confirming..." : "Confirm Booking"}
          </Text>
          {!isSubmitting && (
            <Ionicons name="checkmark-circle" size={20} color="white" />
          )}
        </TouchableOpacity>
      </View>

      {reservationDetails && (
        <SuccessModal
          visible={showSuccessModal}
          handleModalVisible={handleModalVisible}
          reservationDetails={reservationDetails}
        />
      )}
    </View>
  );
};

export default ReviewSummary;
