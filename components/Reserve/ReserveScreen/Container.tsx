import { Ionicons } from "@expo/vector-icons";
import { useQuery } from "@tanstack/react-query";
import { useLocalSearchParams, useRouter } from "expo-router";
import LottieView from "lottie-react-native";
import moment from "moment";
import React, { useState } from "react";
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Toast from "react-native-toast-message";

import { fetchResTable } from "@/api/api";
import { useFetchActiveTableMutation } from "@/hooks/tablehooks/fetchactivetable";
import useStore from "@/store/useStore";
import DateTab from "./DateTab";
import TableTab from "./TableTab";

export default function Container() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const params = useLocalSearchParams();

  const restaurantInfo = params.data ? JSON.parse(params.data as string) : {};
  const restaurantId = restaurantInfo?.restaurantId || restaurantInfo?._id;

  const fetchActiveTableMutation = useFetchActiveTableMutation();
  const { selectedDate, selectedStartTime, selectedEndTime, selectedTableId } =
    useStore();

  const startDateTime =
    selectedDate && selectedStartTime
      ? moment(`${selectedDate}T${selectedStartTime}`).format()
      : null;
  const endDateTime =
    selectedDate && selectedEndTime
      ? moment(`${selectedDate}T${selectedEndTime}`).format()
      : null;

  const [selectedTab, setSelectedTab] = useState("Date");
  const tabs = ["Date", "Table"];

  const { data, isLoading } = useQuery({
    queryKey: ["tables", restaurantId],
    queryFn: () => fetchResTable(restaurantId),
    select: (data) =>
      data?.restaurantLayoutData
        ? {
            diningAreas: data.restaurantLayoutData.diningAreas,
            tablePosition: data.restaurantLayoutData.tablePosition,
          }
        : { diningAreas: [], tablePosition: [] },
  });

  const handleNext = () => {
    if (!selectedDate || !selectedStartTime || !selectedEndTime) {
      Toast.show({
        type: "error",
        text2: "Please select a date, start time, and end time.",
      });
      return;
    }

    fetchActiveTableMutation.mutate(
      { restaurantId, bookingFor: startDateTime, endTime: endDateTime },
      {
        onSuccess: () => setSelectedTab("Table"),
        onError: () =>
          Alert.alert(
            "Error",
            "Failed to fetch available tables. Please try again.",
          ),
      },
    );
  };

  if (isLoading || fetchActiveTableMutation.isPending) {
    return (
      <View className="flex-1 justify-center items-center bg-gray-50">
        <LottieView
          source={require("@/assets/images/lottie/loader.json")}
          autoPlay
          loop
          style={{ width: 120, height: 120 }}
        />
        <Text className="text-gray-500 font-medium mt-2">
          Checking availability...
        </Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-gray-50">
      {/* Header */}
      <View className="flex-row items-center px-6 py-4 bg-gray-50 z-10">
        <TouchableOpacity
          onPress={() => router.back()}
          className="w-10 h-10 bg-white rounded-full items-center justify-center shadow-sm border border-gray-200"
        >
          <Ionicons name="arrow-back" size={20} color="#111827" />
        </TouchableOpacity>
        <Text className="flex-1 text-center font-bold text-xl text-gray-900 mr-10">
          Book a Table
        </Text>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 120 }}
      >
        <View className="flex-row bg-gray-200/60 p-1 rounded-2xl mx-6 mb-6 mt-2">
          {tabs.map((tab) => (
            <TouchableOpacity
              key={tab}
              style={[
                styles.tabBase,
                selectedTab === tab ? styles.tabActive : styles.tabInactive,
              ]}
              onPress={() =>
                tab === "Date" ? setSelectedTab("Date") : handleNext()
              }
            >
              <Text
                className={`font-bold ${selectedTab === tab ? "text-teal-600" : "text-gray-500"}`}
              >
                {tab}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {selectedTab === "Date" ? (
          <DateTab />
        ) : (
          <TableTab
            availableTables={fetchActiveTableMutation.data}
            diningAreas={data?.diningAreas || []}
            tablePosition={data?.tablePosition || []}
          />
        )}
      </ScrollView>

      <View
        className="absolute bottom-0 w-full bg-white border-t border-gray-100 px-6 pt-4 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]"
        style={{ paddingBottom: Math.max(insets.bottom, 20) }}
      >
        {selectedTab === "Table" ? (
          <View className="flex-row gap-3">
            <TouchableOpacity
              className="flex-1 bg-gray-100 py-4 rounded-xl items-center"
              onPress={() => setSelectedTab("Date")}
            >
              <Text className="text-gray-900 font-bold text-base">Back</Text>
            </TouchableOpacity>
            <TouchableOpacity
              className={`flex-1 py-4 rounded-xl items-center ${selectedTableId ? "bg-teal-600" : "bg-teal-600/50"}`}
              disabled={!selectedTableId}
              onPress={() =>
                router.replace({
                  pathname: "/screens/confirm",
                  params: restaurantInfo,
                })
              }
            >
              <Text className="text-white font-bold text-base">Confirm</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <TouchableOpacity
            className="w-full bg-teal-600 py-4 rounded-xl items-center flex-row justify-center"
            onPress={handleNext}
          >
            <Text className="text-white font-bold text-lg mr-2">
              Find Tables
            </Text>
            <Ionicons name="arrow-forward" size={20} color="white" />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  tabBase: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: "center",
  },
  tabActive: {
    backgroundColor: "#FFFFFF",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  tabInactive: {
    backgroundColor: "transparent",
  },
});
