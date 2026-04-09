import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import {
  Image,
  Modal,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { ReservationResponse } from "@/types";
import DetailsTabs from "./DetailsTab";

type ModalLoaderProps = {
  modalVisible: boolean;
  data: {
    _id: string;
    image: string;
    cost: number;
    rate: number;
    description: string;
    name: string;
  };
  setModalVisible: (visible: boolean) => void;
  restaurantId: string;
  reservationData: ReservationResponse;
  userId: string;
};

export default function ModalScreen({
  modalVisible,
  setModalVisible,
  data,
}: ModalLoaderProps) {
  const [selectedValue, setSelectedValue] = useState<string>("Description");
  const [btnLoading, setBtnLoading] = useState(false);
  const insets = useSafeAreaInsets(); // To handle bottom padding on modern iPhones safely

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={modalVisible}
      statusBarTranslucent={true}
    >
      <View className="flex-1 bg-white">
        <ScrollView showsVerticalScrollIndicator={false} bounces={false}>
          <View className="relative w-full h-50 bg-gray-200">
            <Image
              source={{ uri: data?.image }}
              className="w-full h-full"
              resizeMode="cover"
            />
            <TouchableOpacity
              onPress={() => setModalVisible(false)}
              className="absolute top-14 left-6 w-10 h-10 bg-white/90 rounded-full items-center justify-center shadow-sm"
            >
              <Ionicons name="close" size={24} color="#111827" />
            </TouchableOpacity>
          </View>

          <View className="bg-white -mt-8 rounded-t-3xl px-6 pt-8 pb-32">
            <View className="flex-row justify-between items-start mb-6">
              <Text className="font-bold text-xl text-gray-900 flex-1 pr-4 leading-tight">
                {data?.name}
              </Text>
              <Text className="font-bold text-xl text-teal-600">
                Ksh.{data?.cost}
              </Text>
            </View>

            <DetailsTabs
              selectedTab={selectedValue}
              setSelectedTab={setSelectedValue}
              tabsName={["Description", "Reviews"]}
            >
              {selectedValue === "Description" ? (
                <Text className="font-regular text-gray-500 text-base leading-6 text-justify">
                  {data?.description}
                </Text>
              ) : (
                <View className="flex-row items-center space-x-2 mt-2">
                  <Ionicons name="star" size={20} color="#f5a623" />
                  <Text className="font-medium text-gray-700 text-lg">
                    {data?.rate} Rating
                  </Text>
                </View>
              )}
            </DetailsTabs>
          </View>
        </ScrollView>

        {/* <View
          className="absolute bottom-0 w-full bg-white border-t border-gray-100 px-6 pt-4"
          style={{ paddingBottom: Math.max(insets.bottom, 20) }}
        >
          <TouchableOpacity
            className="bg-teal-600 py-4 rounded-2xl items-center shadow-sm"
            onPress={() => console.log("Add to cart pressed")}
          >
            <Text className="font-bold text-white text-lg">Add to Order</Text>
          </TouchableOpacity>
        </View>

        {btnLoading && <ModalLoader loading={btnLoading} />} */}
      </View>
    </Modal>
  );
}
