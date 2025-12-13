import { color } from "@/constants/Colors";
import { FontAwesome6 } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import moment from "moment";
import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from "react-native";


export default function Header() {
  const [greeting, setGreeting] = useState<string>("");
  const [userData, setUserData] = useState({});

  const route = useRouter();

  useEffect(() => {
    const FetchData = async () => {
      const userObj = JSON.parse(
        (await AsyncStorage.getItem("userObj")) || "{}"
      );
      setUserData(userObj.user);
    };
    FetchData();
  }, []);

  useEffect(() => {
    const hour = moment().hour();
    let greetingText = "";
    if (hour >= 5 && hour < 12) {
      greetingText = "Good Morning";
    } else if (hour >= 12 && hour < 17) {
      greetingText = "Good Afternoon";
    } else {
      greetingText = "Good Evening";
    }

    setGreeting(greetingText);
  }, []);
  return (
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>{greeting},</Text>
          <Text style={styles.username}>{userData?.name}</Text>
        </View>
        <TouchableOpacity
          style={styles.cartButton}
          onPress={() => route.replace("/settings")}
        >
          <FontAwesome6 name="user" size={20} color="black" />
          
        </TouchableOpacity>
      </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },

  
  header: {
    backgroundColor: color.green,
    padding: 20,
    paddingTop: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  greeting: {
    color: color.black,
    fontSize: 16,
  },
  username: {
    color: color.black,
    fontSize: 20,
    fontWeight: "bold",
  },
  cartButton: {
    backgroundColor: "rgba(255,255,255,0.2)",
    padding: 12,
    borderRadius: 50,
  },
});
