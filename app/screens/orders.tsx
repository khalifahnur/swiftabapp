import { StyleSheet, View } from "react-native";
import React, { useEffect, useState } from "react";
import Orders from "@/components/Settings/MyOrders/Orders";
import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import { fetchAllOrders } from "@/api/api";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { FetchOrder } from "@/types";
import LottieView from "lottie-react-native";
import { StatusBar } from "expo-status-bar";
import { color } from "@/constants/Colors";
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

  const { data: allOrders, isLoading: isLoadingAll, refetch } = useQuery<
    FetchOrder[],
    Error
  >({
    queryKey: ["allOrders", userId],
    queryFn: () => fetchAllOrders(userId),
    staleTime: 10 * 60 * 1000,
  } as UseQueryOptions<FetchOrder[], Error>);

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
        (await AsyncStorage.getItem("userObj")) || "{}"
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
  };
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor={color.green} />
      <Orders data={allOrders || []} refreshing={refreshing} onRefresh={onRefresh} />
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
