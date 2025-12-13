import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import {
  Pressable,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from "react-native";

interface prop {
  headerText?:string
}
export default function Header({headerText}:prop) {
  const route = useRouter();
  const window = useWindowDimensions();
  const MAX_WIDTH = window.width;
  return (
    <View style={[styles.header, { gap: (MAX_WIDTH * 1) / 2 - 100 }]}>
      <Pressable
        onPress={() => route.back()}
        style={{ backgroundColor: "transparent", padding: 5, borderRadius: 30 ,borderWidth:1,borderColor:"#e8e8e8"}}
      >
        <Ionicons name="arrow-back-sharp" size={20} color="#000" />
      </Pressable>
      <Text
        style={{
          textAlign: "center",
          fontSize: 18,
          fontWeight:'400'
        }}
      >
        {headerText}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    marginTop: 5,
    paddingHorizontal: 20,
    alignItems: "center",
  },
});
