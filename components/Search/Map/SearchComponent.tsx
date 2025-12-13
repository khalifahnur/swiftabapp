import {
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  StatusBar,
  Platform,
} from "react-native";
import React from "react";
import { useRouter } from "expo-router";
import { color, primary } from "@/constants/Colors";
import { EvilIcons, Ionicons, MaterialIcons } from "@expo/vector-icons";
import { BlurView } from "expo-blur";

type SearchProps = {
  placeholderTxt?: string;
  onFilterPress?: () => void;
};

export default function SearchComponent({ placeholderTxt, onFilterPress }: SearchProps) {
  const router = useRouter();

  const handleBack = () => {
    router.navigate('/(tabs)');
  };

  return (
    <BlurView intensity={80} tint="light" style={styles.blurContainer}>
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity
            onPress={handleBack}
            style={styles.backButton}
          >
            <Ionicons name="arrow-back" size={18} color={color.green} />
          </TouchableOpacity>
          <Text style={styles.title}>Find Restaurants</Text>
          <TouchableOpacity style={styles.filterButton} onPress={onFilterPress}>
            <MaterialIcons name="tune" size={18} color={color.green} />
          </TouchableOpacity>
        </View>
        <Pressable
          style={styles.search}
          onPress={() => router.push("/screens/availableres")}
        >
          <View style={styles.innerSearch}>
            <EvilIcons name="search" size={24} color={color.navy} />
            <Text style={styles.placeHolderTxt}>
              {placeholderTxt || "Search for places nearby"}
            </Text>
          </View>
        </Pressable>
      </View>
    </BlurView>
  );
}

const styles = StyleSheet.create({
  blurContainer: {
    width: "100%",
    borderRadius: 16,
    overflow: "hidden",
    paddingTop: Platform.OS === 'ios' ? StatusBar.currentHeight || 0 : 0,
  },
  container: {
    width: "100%",
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "rgba(255, 255, 255, 0.5)",
  },
  search: {
    marginTop: 12,
    width: "100%",
    borderWidth: 1,
    borderColor: "rgba(224, 224, 224, 0.7)",
    borderRadius: 12,
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  innerSearch: {
    flexDirection: "row",
    gap: 10,
    padding: 12,
    alignItems: "center",
  },
  placeHolderTxt: {
    color: "#757575",
    fontSize: 15,
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 4,
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333333",
  },
  backButton: {
    backgroundColor: "rgba(239, 239, 239, 0.8)",
    padding: 10,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "rgba(224, 224, 224, 0.5)",
  },
  filterButton: {
    backgroundColor: "rgba(239, 239, 239, 0.8)",
    padding: 10,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "rgba(224, 224, 224, 0.5)",
  },
});