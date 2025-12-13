import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React from "react";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { color } from "@/constants/Colors";

type prop = {
  HeaderTitle:string;
  marginVertical?:number | 16;
}
export default function Header({HeaderTitle,marginVertical}:prop) {
  return (
    <View style={[styles.header,{marginVertical}]}>
      <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
        <Ionicons name="arrow-back" size={20} color={color.green} />
      </TouchableOpacity>
      <Text style={styles.title}>{HeaderTitle}</Text>
      <View style={styles.placeholder} />
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    zIndex:999
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333333",
  },
  placeholder: {
    width: 40,
  },
  backButton: {
    backgroundColor: "#EFEFEF",
    padding: 10,
    borderRadius: 12,
  },
});
