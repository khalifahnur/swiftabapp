import React, { useEffect, useLayoutEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Platform,
} from "react-native";
import useStore from "@/store/useStore";
import { useNavigation } from "@react-navigation/native";
import moment from "moment";
import "moment-timezone";
import Header from "@/components/Details/Header";
import { color } from "@/constants/Colors";
import Details from "./Details";
import { useLocalSearchParams } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useCreateReservation } from "@/hooks/reservationhooks/reservehook";
import { Reservation, ReservationResponse } from "@/types";
import SuccessModal from "./SuccessfulModal";

interface UserData {
  email: string;
  name: string;
  phoneNumber: string;
  userId: string;
}

const ReviewSummary: React.FC = () => {
  const param = useLocalSearchParams();
  const navigate = useNavigation();
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
  const [reservationDetails, setReservationDetails] = useState<ReservationResponse | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

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
    // Reset store state after modal closes
    setSelectedDate('');
    setGuestCount(0);
    setSelectedStartTime('');
    setSelectedEndTime('');
    setSelectedFloorTxt('');
    setSelectedTable('')
  };

  const image = Array.isArray(param.image) ? param.image[0] : param.image;
  const location = Array.isArray(param.location) ? param.location[0] : param.location;
  const rate = Array.isArray(param.rate) ? param.rate[0] : param.rate;
  const restaurantName = Array.isArray(param.restaurantName) ? param.restaurantName[0] : param.restaurantName;
  const restaurantId = Array.isArray(param.restaurantId) ? param.restaurantId[0] : param.restaurantId;
  const longitude = Array.isArray(param.longitude) ? param.longitude[0] : param.longitude;
  const latitude = Array.isArray(param.latitude) ? param.latitude[0] : param.latitude;

  useEffect(() => {
    const FetchData = async () => {
      try {
        const userObj = JSON.parse(
          (await AsyncStorage.getItem("userObj")) || "{}"
        );
        const fcmToken = await AsyncStorage.getItem("expoPushToken");
        setUserData(userObj.user);
        setFcmToken(fcmToken);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };
    FetchData();
  }, []);

  const dateTimeString = `${selectedDate}T${selectedStartTime}:00`;
  const dateTime = moment.tz(dateTimeString, "Africa/Nairobi");
  const formattedDateTime = dateTime.format("MMM Do, YYYY | HH:mm A");
  const normalizeStartTime = dateTime.toDate();

  const fullEndTime = moment.tz(
    `${selectedDate}T${selectedEndTime}:00`,
    "Africa/Nairobi"
  ).toDate();

  const nowInNairobi = moment.tz("Africa/Nairobi").format("MMM Do, YYYY | HH:mm A");

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
      restaurantInfo: {
        restaurantId,
        restaurantName,
        image,
        location,
        longitude,
        latitude,
        rate,
      },
      reservationInfo: {
        userId,
        name,
        email,
        phoneNumber,
        bookingDate: normalizeStartTime,
        bookingFor: normalizeStartTime,
        endTime: fullEndTime,
        guest: guestCount,
        tableNumber: selectedTableId,
        diningArea: selectedFloorTxt,
      },
    };

    reserveMutation.mutate({
      restaurantId,
      userId,
      fcmToken,
      data: reservationData,
    });
  };

  useLayoutEffect(() => {
    navigate.setOptions({
      headerShown: false,
    });
  }, [navigate]);

  return (
    <View style={styles.screenContainer}>
      <Header headerText="Reservation Summary" />
      <View style={styles.container}>
        <View style={styles.header}>
          <Image 
            source={{ uri: image }} 
            style={styles.restaurantImage} 
            //loadingIndicatorSource={require('@/assets/placeholder-image.png')}
          />
          <View style={styles.restaurantInfo}>
            <Text style={styles.restaurantName} numberOfLines={1}>
              {restaurantName}
            </Text>
            <Text style={styles.restaurantDetails}>
              15 min • Italian Cuisine
            </Text>
            <Text style={styles.restaurantAddress} numberOfLines={2}>
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
      </View>
      <View style={styles.footer}>
        <TouchableOpacity 
          style={[
            styles.button, 
            isSubmitting && styles.buttonDisabled
          ]} 
          onPress={handleReservation}
          disabled={isSubmitting}
        >
          <Text style={styles.buttonText}>
            {isSubmitting ? "Confirming..." : "Confirm Booking"}
          </Text>
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

const styles = StyleSheet.create({
  screenContainer: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#F7F7F7',
  },
  header: {
    flexDirection: "row",
    marginBottom: 20,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 15,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  restaurantImage: {
    width: 90,
    height: 90,
    borderRadius: 12,
  },
  restaurantInfo: {
    marginLeft: 15,
    justifyContent: "center",
    flex: 1,
  },
  restaurantName: {
    fontSize: 18,
    fontWeight: "700",
    color: '#2C3E50',
  },
  restaurantDetails: {
    fontSize: 14,
    color: '#7F8C8D',
    marginVertical: 5,
  },
  restaurantAddress: {
    fontSize: 12,
    color: '#95A5A6',
  },
  footer: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 20,
    paddingVertical: 10,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 5,
      },
    }),
  },
  button: {
    backgroundColor: color.green,
    paddingVertical: 15,
    borderRadius: 12,
    alignItems: "center",
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default ReviewSummary;