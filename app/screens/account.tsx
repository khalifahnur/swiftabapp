import { StyleSheet, View } from "react-native";
import React from "react";
import ProfileScreen from "@/components/Settings/Account/ProfileScreen";

export default function AcountScreen() {
  return (
    <View style={styles.container}>
      <ProfileScreen />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
