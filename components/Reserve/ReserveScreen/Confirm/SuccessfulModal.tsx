import { useRouter } from "expo-router";
import LottieView from "lottie-react-native";
import React from "react";
import { Modal, Text, TouchableOpacity, View } from "react-native";

interface SuccessModalProps {
  visible: boolean;
  handleModalVisible: () => void;
  reservationDetails: any;
}

const SuccessModal: React.FC<SuccessModalProps> = ({
  visible,
  handleModalVisible,
  reservationDetails,
}) => {
  const router = useRouter();

  if (!reservationDetails) return null;
  const resData = reservationDetails.responseData;

  // const handleViewTicket = () => {
  //   handleModalVisible();
  //   router.replace({
  //     pathname: "/modal",
  //     params: { restaurantId: resData.restaurantId },
  //   });
  // };

  const handleViewBookings = () => {
    handleModalVisible();
    router.replace("/(tabs)/(toptabs)");
  };

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={visible}
      onRequestClose={handleModalVisible}
    >
      <View className="flex-1 justify-center items-center bg-black/60 px-4">
        <View className="w-full max-w-sm bg-white rounded-3xl p-6 items-center shadow-xl">
          {/* Success Animation */}
          <View className="w-32 h-32 mb-2">
            <LottieView
              source={require("@/assets/images/lottie/success.json")}
              autoPlay
              loop={false}
              style={{ width: "100%", height: "100%" }}
            />
          </View>

          <Text className="text-2xl font-bold text-gray-900 mb-2 text-center">
            Confirmed!
          </Text>
          <Text className="text-base text-gray-500 mb-6 text-center leading-5">
            Your table has been successfully reserved.
          </Text>

          <View className="w-full bg-gray-50 rounded-2xl p-4 mb-6 border border-gray-100">
            <View className="flex-row justify-between mb-2">
              <Text className="text-gray-500 font-medium text-xs">Date</Text>
              <Text className="text-gray-900 font-bold text-xs">
                {resData.date}
              </Text>
            </View>
            <View className="flex-row justify-between mb-2">
              <Text className="text-gray-500 font-medium text-xs">Time</Text>
              <Text className="text-gray-900 font-bold text-xs">
                {resData.time}
              </Text>
            </View>
            <View className="flex-row justify-between mb-2">
              <Text className="text-gray-500 font-medium text-xs">Guests</Text>
              <Text className="text-gray-900 font-bold text-xs">
                {resData.guest} People
              </Text>
            </View>
            <View className="flex-row justify-between">
              <Text className="text-gray-500 font-medium text-xs">Table</Text>
              <Text className="text-teal-700 font-bold text-xs">
                #{resData.tableNumber}
              </Text>
            </View>
          </View>
          <View className="w-full gap-3">
            {/* <TouchableOpacity
              className="w-full bg-teal-600 py-4 rounded-xl items-center"
              onPress={handleViewTicket}
            >
              <Text className="text-white text-base font-bold">
                Pre-Order Food
              </Text>
            </TouchableOpacity> */}

            <TouchableOpacity
              className="w-full bg-teal-50 border border-teal-100 py-4 rounded-xl items-center"
              onPress={handleViewBookings}
            >
              <Text className="text-teal-700 text-base font-bold">
                View My Bookings
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default SuccessModal;
