import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Pressable,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { color } from "@/constants/Colors";
import Faq from "@/components/Settings/Help/Faq";
import ContactUs from "@/components/Settings/Help/ContactUs";
import { SafeAreaView } from "react-native-safe-area-context";

export default function HelpScreen() {
  const [selectedTab, setSelectedTab] = useState("FAQ");
  const route = useRouter();

  const tabs = ["FAQ", "Contact Us"];

  const DisplayComponents = () => {
    switch (selectedTab) {
      case "FAQ":
        return <Faq />;
      case "Contact Us":
        return <ContactUs />;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => route.back()}
          style={{ backgroundColor: "#e8e8e8", padding: 10, borderRadius: 20 }}
        >
          <Ionicons name="arrow-back" size={20} color="#000" />
        </TouchableOpacity>
        <Text style={styles.title}>Help Center</Text>
      </View>

      <TextInput placeholder="Search" style={styles.searchInput} />

      <View style={styles.tabs}>
        {tabs.map((tab, index) => (
          <Pressable
            key={index}
            onPress={() => setSelectedTab(tab)}
            style={[
              styles.tabButton,
              selectedTab === tab && styles.tabSelected,
            ]}
          >
            <Text
              style={
                selectedTab === tab ? styles.tabTextSelected : styles.tabText
              }
            >
              {tab}
            </Text>
          </Pressable>
        ))}
      </View>
      <View>
        <DisplayComponents />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingHorizontal: 16,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
    marginTop: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginLeft: 100,
  },
  searchInput: {
    backgroundColor: "#f1f1f1",
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 8,
    marginVertical: 10,
  },

  tabs: {
    flexDirection: "row",
  },
  tabButton: {
    flex: 1,
    padding: 12,
    alignItems: "center",
    borderBottomWidth: 2,
    borderBottomColor: "transparent",
  },
  tabSelected: {
    borderBottomWidth: 2,
    borderBottomColor: color.green,
  },
  tabText: {
    fontSize: 14,
    color: "#000",
  },
  tabTextSelected: {
    color: color.green,
    fontWeight: "bold",
  },
});
