import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useLocalSearchParams, useRouter } from "expo-router";
import LottieView from "lottie-react-native";
import React, { useEffect, useRef, useState } from "react";
import {
  Animated,
  Image,
  ScrollView,
  Text,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { MenuItem } from "@/types";
import ModalScreen from "./Modal";

interface UserData {
  email: string;
  name: string;
  phoneNumber: string;
  userId: string;
}

const MenuCard = ({
  item,
  onPress,
}: {
  item: MenuItem;
  onPress: () => void;
}) => {
  const scale = useRef(new Animated.Value(1)).current;

  const animateIn = () =>
    Animated.spring(scale, { toValue: 0.97, useNativeDriver: true }).start();
  const animateOut = () =>
    Animated.spring(scale, {
      toValue: 1,
      bounciness: 8,
      useNativeDriver: true,
    }).start();

  return (
    <TouchableWithoutFeedback
      onPressIn={animateIn}
      onPressOut={animateOut}
      onPress={onPress}
    >
      <Animated.View
        style={{ transform: [{ scale }] }}
        className="flex-row bg-white rounded-2xl p-3 mb-4 shadow-sm border border-gray-100 items-center"
      >
        <Image
          source={{ uri: item.image }}
          className="w-24 h-24 rounded-xl bg-gray-100"
          resizeMode="cover"
        />
        <View className="flex-1 ml-4 justify-center">
          <Text
            className="font-bold text-gray-900 text-lg mb-1"
            numberOfLines={1}
          >
            {item.name}
          </Text>
          <Text
            className="font-regular text-gray-500 text-sm leading-5"
            numberOfLines={2}
          >
            {item.description}
          </Text>
        </View>
      </Animated.View>
    </TouchableWithoutFeedback>
  );
};

export default function Container() {
  const params = useLocalSearchParams();
  const menuType = params.menuType as string;
  const router = useRouter();

  const [modalVisible, setModalVisible] = useState(false);
  const [modalData, setModalData] = useState<MenuItem>();
  const [data, setData] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [reservationData, setReservationData] = useState({});
  const [userData, setUserData] = useState<UserData>({} as UserData);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const dataString = Array.isArray(params.data)
          ? params.data[0]
          : params.data;
        const parsedData: MenuItem[] = dataString ? JSON.parse(dataString) : [];
        setData(parsedData);
        setLoading(false); // Simplified loading logic for UX speed
      } catch (error) {
        console.error("Error parsing data:", error);
        setLoading(false);
      }
    };
    fetchData();
  }, [params.data]);

  useEffect(() => {
    const fetchStorage = async () => {
      const resData = JSON.parse(
        (await AsyncStorage.getItem("reservationData")) || "{}",
      );
      setReservationData(resData);
      const userObj = JSON.parse(
        (await AsyncStorage.getItem("userObj")) || "{}",
      );
      setUserData(userObj.user);
    };
    fetchStorage();
  }, []);

  const handleModal = (item: MenuItem) => {
    setModalData(item);
    setModalVisible(true);
  };

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center bg-gray-50">
        <LottieView
          source={require("@/assets/images/lottie/loader.json")}
          autoPlay
          loop
          style={{ width: 100, height: 100 }}
        />
      </View>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-gray-50" edges={["top"]}>
      {/* Modern Header */}
      <View className="flex-row items-center px-6 py-4 bg-gray-50">
        <TouchableWithoutFeedback onPress={() => router.back()}>
          <View className="w-10 h-10 bg-white rounded-full items-center justify-center shadow-sm border border-gray-200">
            <Ionicons name="arrow-back" size={20} color="#111827" />
          </View>
        </TouchableWithoutFeedback>
        <Text className="flex-1 text-center font-bold text-xl text-gray-900 mr-10">
          {menuType
            ? menuType.charAt(0).toUpperCase() + menuType.slice(1).toLowerCase()
            : "Menu"}
        </Text>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingHorizontal: 24,
          paddingBottom: 40,
          paddingTop: 10,
        }}
      >
        {data?.map((item) => (
          <MenuCard
            key={item._id}
            item={item}
            onPress={() => handleModal(item)}
          />
        ))}
      </ScrollView>

      {/* Item Details Modal */}
      {modalData && (
        <ModalScreen
          modalVisible={modalVisible}
          data={modalData as any}
          restaurantId={params.restaurantId as string}
          setModalVisible={setModalVisible}
          reservationData={reservationData as any}
          userId={userData?.userId}
        />
      )}
    </SafeAreaView>
  );
}
