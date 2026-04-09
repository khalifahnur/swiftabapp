import PaymentMethodScreen from "@/components/Payment/Payment";
import { color } from "@/constants/Colors";
import { useLocalSearchParams } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React from "react";
import { StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function paymentscreen() {
  const param = useLocalSearchParams();

  // Retrieve the subTotal value
  const orderTotal = param.subTotal;

  const navigateTo = (screenName, params) => {
    console.log(`Navigating to ${screenName} with params:`, params);
    // This would be replaced with your actual navigation logic
    // e.g. navigation.navigate(screenName, params);
  };

  const goBack = () => {
    console.log("Going back to previous screen");
    // This would be replaced with your actual back navigation
    // e.g. navigation.goBack();
  };

  // Mock route params to pass to the payment screen
  const routeParams = {
    params: {
      totalAmount: orderTotal,
    },
  };

  const navigationProps = {
    navigate: navigateTo,
    goBack: goBack,
  };
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor={color.green} />
      <PaymentMethodScreen navigation={navigationProps} route={routeParams} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
