import { StyleSheet, Text, View } from "react-native";
import React, { useEffect, useState } from "react";
import LottieView from "lottie-react-native";
import {
  setupOnlineManager,
  useOnlineManager,
} from "@/hooks/tanhooks/useOnlineManager";

export default function NetworkStatus() {
  const [isOffline, setIsOffline] = useState(false);

  useEffect(() => {
    setupOnlineManager();
  }, []);

  const isOnline = useOnlineManager()
  
  useEffect(() => {
    setIsOffline(!isOnline);
  }, [isOnline]);

  if (!isOffline) return null;

  return (
    <View style={styles.container}>
      <LottieView
        source={require("@/assets/images/lottie/nowifi.json")}
        autoPlay
        loop
        style={styles.animation}
      />
      <Text style={styles.text}>No Internet Connection</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right:0,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 10,
    zIndex: 999,
  },
  animation: {
    width: 100,
    height: 100,
  },
  text: {
    marginTop: 10,
    color: "#d32f2f",
    fontWeight: "bold",
  },
});