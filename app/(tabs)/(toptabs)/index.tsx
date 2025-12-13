import { StyleSheet, Text, View } from "react-native";
import React, { useEffect, useState } from "react";
import Container from "@/components/Reserve/Index/Container";
import { color } from "@/constants/Colors";
import LottieView from "lottie-react-native";
import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import { ActiveReservation } from "@/types";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { fetchActiveReservation } from "@/api/api";
import useStore from "@/store/useStore";

interface UserData {
  email: string;
  name: string;
  phoneNumber: string;
  userId: string;
}

export default function IndexTab() {
  const [userData, setUserData] = useState<UserData>({} as UserData);
  const [refreshing, setRefreshing] = useState(false);

  const { setHasActiveReservation } = useStore();

  const { userId } = userData;
  
  const { data, isLoading, isError, error, refetch } = useQuery<
    ActiveReservation[],
    Error
  >({
    queryKey: ["active", userId],
    queryFn: () => fetchActiveReservation(userId),
    staleTime: 10 * 60 * 1000,
    onSuccess: (data: any) => {
      setHasActiveReservation(data.length > 0);
    },
  } as UseQueryOptions<ActiveReservation[], Error>);

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
    if (!data) {
      refetch();
    }
  }, [data, refetch]);

  useEffect(() => {
    const FetchData = async () => {
      const userObj = JSON.parse(
        (await AsyncStorage.getItem("userObj")) || "{}"
      );
      setUserData(userObj.user);
    };
    FetchData();
  }, []);

  const isLoadingOrRefreshing = isLoading || refreshing;

  if (isLoadingOrRefreshing) {
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

  if (isError) {
    return (
      <View>
        <Text>Error: {error.message}</Text>
      </View>
    );
  }

  if (!data || data.length === 0) {
    return (
      <View style={styles.lottieStyle}>
        <LottieView
          source={require("@/assets/images/lottie/empty.json")}
          autoPlay
          loop
          style={{ width: 100, height: 100 }}
        />
        <Text>Empty</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Container data={data} refreshing={refreshing} onRefresh={onRefresh} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 10,
    backgroundColor: color.white,
  },
  lottieStyle: {
    justifyContent: "center",
    alignItems: "center",
    flex: 1,
  },
});
