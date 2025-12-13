import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import React, { useEffect, useLayoutEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import { useRouter } from "expo-router";
import { color } from "@/constants/Colors";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";

interface UserData {
  email: string;
  name: string;
  phoneNumber: string;
  userId: string;
}
export default function AccountScreen() {
  const [userData, setUserData] = useState<UserData>({} as UserData);
  const [firstName, setFirstName] = useState("");
  const [secondName, setSecondName] = useState("");
  const [initials, setInitials] = useState("");
  const [initials2, setInitials2] = useState("");
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  const navigation = useNavigation();
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const userObj = JSON.parse(
          (await AsyncStorage.getItem("userObj")) || "{}"
        );
        setUserData(userObj.user);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching user data:", error);
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (userData && userData.name) {
      const fullName = userData.name;
      const nameParts = fullName.split(" ");
      const first = nameParts[0] || "";
      const second = nameParts[1] || "";
      
      setFirstName(first);
      setSecondName(second);
      setInitials(first.slice(0, 1).toUpperCase());
      setInitials2(second.slice(0, 1).toUpperCase());
      setEmail(userData.email);
    }
  }, [userData]);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, [navigation]);

  const AccountField = ({ label, value, showChange = false, onPress }) => (
    <TouchableOpacity
      style={styles.fieldContainer}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <Text style={styles.fieldLabel}>{label}</Text>
      <View style={styles.fieldValueContainer}>
        <Text style={styles.fieldValue}>{value}</Text>
        {showChange && (
          <Text style={styles.changeText}>Change</Text>
        )}
      </View>
    </TouchableOpacity>
  );

  if (isLoading) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={color.green} />
        <Text style={styles.loadingText}>Loading account details...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor={color.green} />
      
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
          activeOpacity={0.7}
        >
          <Ionicons name="arrow-back" size={20} color="#000" />
        </TouchableOpacity>
        
        <Text style={styles.screenTitle}>My Account</Text>
        
        <View style={styles.avatarContainer}>
          <Text style={styles.avatarText}>
            {initials}{initials2}
          </Text>
        </View>
      </View>

      <ScrollView 
        style={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.sectionContainer}>
          <View style={styles.sectionTitleContainer}>
            <MaterialIcons name="account-circle" size={20} color={color.green} />
            <Text style={styles.sectionTitle}>ACCOUNT DETAILS</Text>
          </View>
          
          <View style={styles.card}>
            <AccountField 
              label="Mobile Number" 
              value={userData?.phoneNumber || "Not provided"} 
              showChange={true}
              onPress={() => console.log("Change phone number")}
            />
          </View>
        </View>

        <View style={styles.sectionContainer}>
          <View style={styles.sectionTitleContainer}>
            <MaterialIcons name="person" size={20} color={color.green} />
            <Text style={styles.sectionTitle}>PERSONAL INFORMATION</Text>
          </View>
          
          <View style={styles.card}>
            <AccountField 
              label="First Name" 
              value={firstName} 
              onPress={() => console.log("Edit first name")}
            />
            <View style={styles.separator} />
            
            <AccountField 
              label="Last Name" 
              value={secondName} 
              onPress={() => console.log("Edit last name")}
            />
            <View style={styles.separator} />
            
            <AccountField 
              label="Email Address" 
              value={email || "Not provided"} 
              showChange={true}
              onPress={() => console.log("Change email")}
            />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: color.graywhite,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: color.graywhite,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: color.black,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  backButton: {
    backgroundColor: "#e8e8e8",
    padding: 10,
    borderRadius: 12,
  },
  screenTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: color.black,
  },
  avatarContainer: {
    width: 42,
    height: 42,
    backgroundColor: "#fff",
    borderRadius: 21,
    borderColor: color.green,
    borderWidth: 2,
    justifyContent: "center",
    alignItems: "center",
  },
  avatarText: {
    fontSize: 14,
    fontWeight: "600",
    color: color.black,
  },
  contentContainer: {
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  sectionContainer: {
    marginBottom: 24,
  },
  sectionTitleContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: "400",
    color: color.black,
    marginLeft: 8,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  fieldContainer: {
    padding: 16,
  },
  fieldLabel: {
    fontSize: 14,
    color: "gray",
    marginBottom: 6,
  },
  fieldValueContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  fieldValue: {
    fontSize: 16,
    color: color.black,
    fontWeight: "500",
  },
  changeText: {
    fontSize: 14,
    fontWeight: "500",
    color: color.green,
  },
  separator: {
    height: 1,
    backgroundColor: "#f0f0f0",
    marginHorizontal: 16,
  },
  logoutButton: {
    backgroundColor: "#ff3b30",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 14,
    borderRadius: 12,
  },
  logoutText: {
    color: "#fff",
    fontWeight: "600",
    marginLeft: 8,
    fontSize: 16,
  },
});