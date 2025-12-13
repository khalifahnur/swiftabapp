import MenuScreen from "@/components/Modal/MenuModal";
import { useRestaurantMenu } from "@/hooks/reshooks/fetchres";
import { useLocalSearchParams } from "expo-router";
import LottieView from "lottie-react-native";
import { StyleSheet, Text, View } from "react-native";

export default function MenuModal() {
  const { restaurantId } = useLocalSearchParams<{ restaurantId: string }>();
  const { data: menu, isLoading, error } = useRestaurantMenu(restaurantId);

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

  if (!menu) {
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

  if (error) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>Failed to load menu.</Text>
        <Text>{error.message}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <MenuScreen menuData={menu} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1,  backgroundColor: "#fff" },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  errorText: { color: "red", marginBottom: 10 },
  lottieStyle: {
    justifyContent: "center",
    alignItems: "center",
    flex: 1,
  },
});
