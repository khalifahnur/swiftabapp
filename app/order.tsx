import { fetchAllOrders } from "@/api/api";
import Orders from "@/components/Settings/MyOrders/Orders";
import { color } from "@/constants/Colors";
import { FetchOrder } from "@/types";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import { router, Stack, useFocusEffect } from "expo-router";
import { StatusBar } from "expo-status-bar";
import LottieView from "lottie-react-native";
import React, { useCallback, useEffect, useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

interface UserData {
  email: string;
  name: string;
  phoneNumber: string;
  userId: string;
}

export default function orders() {
  const [userData, setUserData] = useState<UserData>({} as UserData);
  const [refreshing, setRefreshing] = useState(false);

  const { userId } = userData;

  const {
    data: allOrders,
    isLoading: isLoadingAll,
    refetch,
  } = useQuery<FetchOrder[], Error>({
    queryKey: ["allOrders", userId],
    queryFn: () => fetchAllOrders(userId),
    staleTime: 10 * 60 * 1000,
  } as UseQueryOptions<FetchOrder[], Error>);

  useFocusEffect(
    useCallback(() => {
      refetch();
    }, [refetch]),
  );

  const onRefresh = async () => {
    setRefreshing(true);
    try {
      await refetch();
    } catch (error) {
      console.error("Error during refresh:", error);
    } finally {
      setRefreshing(false);
    }
  };

  useEffect(() => {
    if (!allOrders) {
      refetch();
    }
  }, [allOrders, refetch]);

  useEffect(() => {
    const FetchData = async () => {
      const userObj = JSON.parse(
        (await AsyncStorage.getItem("userObj")) || "{}",
      );
      setUserData(userObj.user);
    };
    FetchData();
  }, []);

  const isLoading = isLoadingAll || refreshing;

  if (isLoading) {
    return (
      <View style={styles.lottieStyle}>
        <LottieView
          source={require("@/assets/images/lottie/loader.json")}
          autoPlay
          loop
          style={{ width: 100, height: 100 }}
        />
      </View>
    );
  }

  if (!allOrders) {
    return (
      <SafeAreaView className="flex-1 bg-gray-50" edges={["top"]}>
        <Stack.Screen options={{ headerShown: false }} />

        <View className="flex-row items-center px-6 py-4 bg-gray-50">
          <TouchableOpacity onPress={() => router.replace("/(tabs)")}>
            <View className="w-10 h-10 bg-white rounded-full items-center justify-center shadow-sm border border-gray-200">
              <Ionicons name="close" size={24} />
            </View>
          </TouchableOpacity>
        </View>

        <View className="flex-1 justify-center items-center px-6 pb-20">
          <LottieView
            source={require("@/assets/images/lottie/emptycart.json")}
            autoPlay
            loop
            style={{ width: 110, height: 110 }}
          />
          <Text className="text-xl font-bold text-gray-900 mt-2 mb-2">
            Your Order is Empty
          </Text>
          <Text className="text-base font-medium text-gray-500 text-center px-4 leading-6">
            Looks like you haven't added any delicious meals yet.
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor={color.green} />
      <Orders
        data={allOrders || []}
        refreshing={refreshing}
        onRefresh={onRefresh}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  lottieStyle: {
    justifyContent: "center",
    alignItems: "center",
    flex: 1,
  },
});
