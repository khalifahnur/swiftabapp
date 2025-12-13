import { color } from "@/constants/Colors";
import {
  FontAwesome5,
  Ionicons,
  MaterialCommunityIcons,
} from "@expo/vector-icons";
import { Link, router } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  Animated,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import ProfileImage from "./ProfileImage";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { SafeAreaView } from "react-native-safe-area-context";

interface UserData {
  email: string;
  name: string;
  phoneNumber: string;
  userId: string;
}

const ProfileContainer = ({ totalOrders }) => {
  const [animation] = useState(new Animated.Value(0));
  const [userData, setUserData] = useState<UserData>({} as UserData);
  const [isLoading, setIsLoading] = useState(true);

  const { name, email } = userData;

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

  // Animate crown icon on component mount
  React.useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(animation, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(animation, {
          toValue: 0,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  const crownAnimation = {
    transform: [
      {
        translateY: animation.interpolate({
          inputRange: [0, 1],
          outputRange: [0, -5],
        }),
      },
    ],
  };

  if (isLoading) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={color.green} />
        <Text style={styles.loadingText}>Loading account details...</Text>
      </SafeAreaView>
    );
  }
  return (
    <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
      <View style={styles.container}>
        <LinearGradient
          colors={[color.green, color.green]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.profileHeader}
        >
          <View style={styles.profileContent}>
            <View style={styles.profileImageWrapper}>
              <ProfileImage />
            </View>

            <View style={styles.profileInfo}>
              <Text style={styles.profileName}>{name}</Text>
              <View style={styles.verifiedBadge}>
                <MaterialCommunityIcons
                  name="check-decagram"
                  size={14}
                  color="#4A55A2"
                />
                <Text style={styles.verifiedText}>Verified</Text>
              </View>
              <Text style={styles.profileContact}>{email}</Text>
            </View>
          </View>

          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>
                {totalOrders ? totalOrders : 0}
              </Text>
              <Text style={styles.statLabel}>Orders</Text>
            </View>
            <View style={[styles.statItem, styles.statDivider]}>
              <Text style={styles.statNumber}>0</Text>
              <Text style={styles.statLabel}>Reviews</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>Ksh.0</Text>
              <Text style={styles.statLabel}>Savings</Text>
            </View>
          </View>
        </LinearGradient>

        {/* Premium Banner Card */}
        <TouchableOpacity
          style={styles.premiumBanner}
          activeOpacity={0.9}
          onPress={() => router.push("/screens/premium")}
        >
          <LinearGradient
            colors={["#FFB347", "#FFCC33"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.premiumGradient}
          >
            <Animated.View
              style={[styles.premiumIconContainer, crownAnimation]}
            >
              <FontAwesome5 name="crown" size={20} color="#fff" />
            </Animated.View>

            <View style={styles.premiumTextContainer}>
              <Text style={styles.premiumTitle}>Upgrade to Premium</Text>
              <Text style={styles.premiumSubtitle}>
                Unlock exclusive benefits and features
              </Text>
            </View>

            <TouchableOpacity style={styles.premiumButton}>
              <Text style={styles.premiumButtonText}>Upgrade</Text>
            </TouchableOpacity>
          </LinearGradient>
        </TouchableOpacity>

        {/* Menu Options */}
        <View style={styles.menuContainer}>
          <Text style={styles.menuSectionTitle}>Account</Text>

          {menuItems.slice(0, 2).map((item, index) => (
            <TouchableOpacity
              key={item.title}
              style={[styles.menuItem, index === 2 && styles.lastItem]}
              onPress={() => router.push(item.url)}
            >
              <View
                style={[
                  styles.menuIconContainer,
                  { backgroundColor: item.bgColor },
                ]}
              >
                <Ionicons name={item.icon} size={18} color={item.iconColor} />
              </View>
              <Text style={styles.menuTitle}>{item.title}</Text>
              <MaterialCommunityIcons
                name="chevron-right"
                size={22}
                color="#B0B7C1"
              />
            </TouchableOpacity>
          ))}

          <Text style={styles.menuSectionTitle}>Preferences</Text>

          {menuItems.slice(2).map((item, index) => (
            <TouchableOpacity
              key={item.title}
              style={[
                styles.menuItem,
                index === menuItems.slice(3).length - 1 && styles.lastItem,
              ]}
              onPress={() => router.push(item.url)}
            >
              <View
                style={[
                  styles.menuIconContainer,
                  { backgroundColor: item.bgColor },
                ]}
              >
                <Ionicons name={item.icon} size={18} color={item.iconColor} />
              </View>
              <Text style={styles.menuTitle}>{item.title}</Text>
              <MaterialCommunityIcons
                name="chevron-right"
                size={22}
                color="#B0B7C1"
              />
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity style={styles.aboutButton}>
          <Link href="/screens/PolicyScreen?type=about">
            <MaterialCommunityIcons
              name="information-outline"
              size={20}
              color="#e0e0e0"
            />
            <Text style={styles.aboutText}>About</Text>
            <Text style={styles.aboutText}>V1.1.0.0</Text>
          </Link>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const menuItems = [
  {
    title: "Account Details",
    icon: "person-outline",
    url: "/screens/account",
    bgColor: "rgba(74, 85, 162, 0.1)",
    iconColor: "#4A55A2",
  },
  {
    title: "My Orders",
    icon: "receipt-outline",
    url: "/screens/orders",
    bgColor: "rgba(76, 175, 80, 0.1)",
    iconColor: "#4CAF50",
  },
  // {
  //   title: 'Payment Methods',
  //   icon: 'card-outline',
  //   url: '/screens/payment',
  //   bgColor: 'rgba(255, 152, 0, 0.1)',
  //   iconColor: '#FF9800'
  // },
  {
    title: "Settings",
    icon: "settings-outline",
    url: "/screens/setting",
    bgColor: "rgba(158, 158, 158, 0.1)",
    iconColor: "#616161",
  },
  {
    title: "Help Center",
    icon: "help-circle-outline",
    url: "/screens/help",
    bgColor: "rgba(3, 169, 244, 0.1)",
    iconColor: "#03A9F4",
  },
  {
    title: "Invite Friends",
    icon: "people-outline",
    url: "/screens/invite",
    bgColor: "rgba(156, 39, 176, 0.1)",
    iconColor: "#9C27B0",
  },
];

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  container: {
    flex: 1,
    marginBottom: 80,
  },
  profileHeader: {
    paddingTop: 30,
    paddingBottom: 20,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  profileContent: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  profileImageWrapper: {
    position: "relative",
  },
  editIconContainer: {
    position: "absolute",
    bottom: 0,
    right: 0,
  },
  editButton: {
    backgroundColor: "#4A55A2",
    width: 26,
    height: 26,
    borderRadius: 13,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#fff",
  },
  profileInfo: {
    marginLeft: 15,
  },
  profileName: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 4,
  },
  verifiedBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
    alignSelf: "flex-start",
    marginBottom: 6,
  },
  verifiedText: {
    color: "#4A55A2",
    fontSize: 12,
    fontWeight: "600",
    marginLeft: 3,
  },
  profileContact: {
    color: "rgba(255, 255, 255, 0.9)",
    fontSize: 14,
  },
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    marginTop: 20,
    marginHorizontal: 20,
    borderRadius: 16,
    padding: 15,
  },
  statItem: {
    flex: 1,
    alignItems: "center",
  },
  statDivider: {
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.2)",
  },
  statNumber: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  statLabel: {
    color: "rgba(255, 255, 255, 0.8)",
    fontSize: 12,
    marginTop: 3,
  },
  premiumBanner: {
    margin: 20,
    borderRadius: 16,
    elevation: 5,
    shadowColor: "#FFB347",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
  },
  premiumGradient: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 16,
    padding: 16,
  },
  premiumIconContainer: {
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    width: 42,
    height: 42,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 12,
  },
  premiumTextContainer: {
    flex: 1,
    marginLeft: 15,
  },
  premiumTitle: {
    color: "#fff",
    fontSize: 17,
    fontWeight: "bold",
  },
  premiumSubtitle: {
    color: "rgba(255, 255, 255, 0.9)",
    fontSize: 12,
    marginTop: 3,
  },
  premiumButton: {
    backgroundColor: "#fff",
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 12,
  },
  premiumButtonText: {
    color: "#FF9800",
    fontWeight: "600",
    fontSize: 12,
  },
  menuContainer: {
    marginHorizontal: 20,
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
  },
  menuSectionTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#7895CB",
    marginLeft: 10,
    marginTop: 12,
    marginBottom: 8,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    marginHorizontal: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  lastItem: {
    borderBottomWidth: 0,
    marginBottom: 8,
  },
  menuIconContainer: {
    width: 36,
    height: 36,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
    marginRight: 12,
  },
  menuTitle: {
    flex: 1,
    fontSize: 15,
    color: "#333",
    fontWeight: "500",
  },
  aboutButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: 20,
    marginTop: 20,
    backgroundColor: "#fff",
    padding: 14,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#FFDFDF",
  },
  aboutText: {
    marginLeft: 8,
    color: "#e0e0e0",
    fontSize: 15,
    fontWeight: "600",
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
});

export default ProfileContainer;
