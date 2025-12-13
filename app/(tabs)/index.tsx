import { fetchAllRes } from "@/api/api";
import Container from "@/components/Home/Container";
import { color } from "@/constants/Colors";
import { Restaurant } from "@/types";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useQuery } from "@tanstack/react-query";
//import { StatusBar } from "expo-status-bar";
import LottieView from "lottie-react-native";
import { useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";

interface UserData {
  email: string;
  name: string;
  phoneNumber: string;
  userId: string;
}

export default function HomeScreen() {
  const [refreshing, setRefreshing] = useState(false);
  const [userData, setUserData] = useState<UserData>({} as UserData);
  const insets = useSafeAreaInsets();

  useEffect(() => {
    const FetchData = async () => {
      const userObj = JSON.parse(
        (await AsyncStorage.getItem("userObj")) || "{}"
      );
      setUserData(userObj.user);
    };
    FetchData();
  }, []);


  const {
    data: restaurantsData,
    isLoading: isRestaurantsLoading,
    isError: isRestaurantsError,
    error: restaurantsError,
    refetch: refetchRestaurants,
  } = useQuery<{ message: string; restaurants: Restaurant[] }>({
    queryKey: ["restaurants"],
    queryFn: fetchAllRes,
    staleTime: 10 * 60 * 1000,
  });

  

  const onRefresh = async () => {
    setRefreshing(true);
    try {
      await Promise.all([refetchRestaurants()]);
    } catch (error) {
      console.error("Error during refresh:", error);
    } finally {
      setRefreshing(false);
    }
  };

  useEffect(() => {
    if (!restaurantsData ) {
      refetchRestaurants();
      
    }
  }, [restaurantsData,  refetchRestaurants]);

  // Handle errors
  if (isRestaurantsError ) {
    return (
      <View>
        <Text>Error: {restaurantsError?.message }</Text>
      </View>
    );
  }

  // Transform data for all restaurants
  const transformedRestaurants = Array.isArray(restaurantsData?.restaurants)
  ? restaurantsData.restaurants.map((item) => ({
      restaurantId: item._id,
      title: item.title,
      data:
        Array.isArray(item.data) && item.data.length > 0
          ? item.data.map((entry, index) => ({
              ...entry,
              _id: entry._id || `${item._id}-${index}`,
              restaurantId: item._id,
            }))
          : [],
    }))
  : [];

  // Transform data for recently viewed restaurants
  // const transformedRecentlyViewed = Array.isArray(recentlyViewedData?.restaurants)
  //   ? recentlyViewedData.restaurants.map((item) => ({
  //       restaurantId: item._id,
  //       title: item.title,
  //       data:
  //         Array.isArray(item.data) && item.data.length > 0
  //           ? item.data.map((entry) => ({
  //               ...entry,
  //               restaurantId: item._id,
  //             }))
  //           : [],
  //     }))
  //   : [];

  // Show loading state
  if (isRestaurantsLoading ) {
    return (
      <View
        style={{
          justifyContent: "center",
          alignItems: "center",
          flex: 1,
        }}
      >
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
    <SafeAreaView style={styles.container}>
      <Container
        allRestaurants={transformedRestaurants}
        //recentlyViewed={recentlyViewedData}
        refreshing={refreshing}
        onRefresh={onRefresh}
        isLoading={isRestaurantsLoading }
      />
      {/* <View style={styles.footer} /> */}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: color.white,
  },
  footer: {
    backgroundColor: color.green,
    height: 60,
  },
});