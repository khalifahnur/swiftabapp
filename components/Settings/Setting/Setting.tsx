import { useAuthStore } from "@/lib/authStore";
import {
  Entypo,
  FontAwesome5,
  Ionicons,
  MaterialCommunityIcons,
  MaterialIcons,
} from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import { Link, useRouter } from "expo-router";
import LottieView from "lottie-react-native";
import React, { useEffect, useLayoutEffect, useState } from "react";
import {
  BackHandler,
  Image,
  Modal,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import BottomModal from "./BottomModal";
import BottomPayment from "./BottomPayment";
import MpesaModal from "./MpesaModal";

interface UserData {
  email: string;
  name: string;
  phoneNumber: string;
  userId: string;
}

export default function Setting() {
  const router = useRouter();
  const navigation = useNavigation();
  const [userData, setUserData] = useState<UserData>({} as UserData);

  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [notOff, setNotOff] = useState(false);
  const [paymentModal, setPaymentModal] = useState(false);
  const [mpesaModal, setMpesaModal] = useState<boolean>(false);
  const { logOut } = useAuthStore();

  const LogOutHandler = async () => {
    try {
      setLoading(true);
      logOut();
      await AsyncStorage.clear();

      setTimeout(() => {
        router.replace({
          pathname: "/(auth)",
        });
      }, 1500);

      const backAction = () => {
        BackHandler.exitApp();
        return true;
      };

      const subscribe = BackHandler.addEventListener(
        "hardwareBackPress",
        backAction
      );

      return () => subscribe.remove();
    } catch (error) {
      setLoading(false);
      console.error("Logout failed:", error);
    }
  };

  const handleVisible = () => {
    setPaymentModal(false);
    setMpesaModal(true);
  };

  const handleVisibleMpesaModal = () => {
    setMpesaModal(false);
  };

  const { name, email } = userData;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userObj = JSON.parse(
          (await AsyncStorage.getItem("userObj")) || "{}"
        );
        setUserData(userObj.user);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };
    fetchData();
  }, []);

  useLayoutEffect(() => {
    navigation.setOptions({ headerShown: false });
  }, [navigation]);

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <LottieView
          source={require("@/assets/images/lottie/loader.json")}
          autoPlay
          loop
          style={{ width: 120, height: 120 }}
        />
        <Text style={styles.loadingText}>Logging out...</Text>
      </View>
    );
  }

  return (
    <>
      <StatusBar barStyle="dark-content" backgroundColor="#f8f9fa" />
      <SafeAreaView style={styles.safeArea}>
        <LinearGradient
          colors={["#f8f9fa", "#ffffff"]}
          style={styles.container}
        >
          <View style={styles.profileSection}>
            <View style={styles.profileImageContainer}>
              <Image
                source={require("@/assets/images/user.jpeg")}
                style={styles.profileImage}
                defaultSource={require("@/assets/images/user.jpeg")}
              />
            </View>
            <Text style={styles.profileName}>{name}</Text>
            <Text style={styles.profileEmail}>{email}</Text>
          </View>

          <Text style={styles.sectionTitle}>Preferences</Text>
          <TouchableOpacity
            style={styles.card}
            onPress={() => setNotOff(!notOff)}
          >
            <View style={styles.detailRow}>
              <View
                style={[
                  styles.iconContainer,
                  { backgroundColor: "rgba(82, 113, 255, 0.1)" },
                ]}
              >
                <Ionicons name="notifications" size={22} color="#4A55A2" />
              </View>
              <Text style={styles.detailText}>Notifications</Text>
              <FontAwesome5
                name={notOff ? "toggle-on" : "toggle-off"}
                size={22}
                color={notOff ? "#4A55A2" : "#C8C8C8"}
                style={styles.toggleIcon}
              />
            </View>
          </TouchableOpacity>

          {/* Payment */}
          {/* <TouchableOpacity
            style={styles.card}
            onPress={() => setPaymentModal(true)}
          >
            <View style={styles.detailRow}>
              <View
                style={[
                  styles.iconContainer,
                  { backgroundColor: "rgba(255, 172, 28, 0.1)" },
                ]}
              >
                <MaterialIcons name="payment" size={22} color="#FFAC1C" />
              </View>
              <Text style={styles.detailText}>Payment Methods</Text>
              <Entypo name="chevron-right" size={22} color="#C8C8C8" />
            </View>
          </TouchableOpacity> */}

          <Text style={styles.sectionTitle}>Help Center</Text>

          <TouchableOpacity style={styles.card}>
            <Link href="/screens/help">
              <View style={styles.detailRow}>
                <View
                  style={[
                    styles.iconContainer,
                    { backgroundColor: "rgba(76, 175, 80, 0.1)" },
                  ]}
                >
                  <MaterialCommunityIcons
                    name="help-circle-outline"
                    size={22}
                    color="#4CAF50"
                  />
                </View>
                <Text style={styles.detailText}>Help Center</Text>
                <Entypo name="chevron-right" size={22} color="#C8C8C8" />
              </View>
            </Link>
          </TouchableOpacity>

          <TouchableOpacity style={styles.card}>
            <Link href="/screens/PolicyScreen?type=privacy">
              <View style={styles.detailRow}>
                <View
                  style={[
                    styles.iconContainer,
                    { backgroundColor: "rgba(3, 169, 244, 0.1)" },
                  ]}
                >
                  <MaterialIcons name="gavel" size={22} color="#03A9F4" />
                </View>
                <Text style={styles.detailText}>Privacy</Text>
                <Entypo name="chevron-right" size={22} color="#C8C8C8" />
              </View>
            </Link>
          </TouchableOpacity>

          <TouchableOpacity style={styles.card}>
            <Link href="/screens/PolicyScreen?type=terms">
              <View style={styles.detailRow}>
                <View
                  style={[
                    styles.iconContainer,
                    { backgroundColor: "rgba(3, 169, 244, 0.1)" },
                  ]}
                >
                  <MaterialIcons name="gavel" size={22} color="#03A9F4" />
                </View>
                <Text style={styles.detailText}>Terms & Conditions</Text>
                <Entypo name="chevron-right" size={22} color="#C8C8C8" />
              </View>
            </Link>
          </TouchableOpacity>

          <TouchableOpacity style={styles.card}>
            <Link href="/screens/PolicyScreen?type=about">
              <View style={styles.detailRow}>
                <View
                  style={[
                    styles.iconContainer,
                    { backgroundColor: "rgba(3, 169, 244, 0.1)" },
                  ]}
                >
                  <MaterialCommunityIcons
                    name="information-outline"
                    size={20}
                    color="#e0e0e0"
                  />
                </View>
                <Text style={styles.detailText}>About</Text>
                <Entypo name="chevron-right" size={22} color="#C8C8C8" />
              </View>
            </Link>
          </TouchableOpacity>

          <TouchableOpacity style={styles.logoutButton} onPress={LogOutHandler}>
            <MaterialIcons name="logout" size={20} color="#FFFFFF" />
            <Text style={styles.logoutText}>Log Out</Text>
          </TouchableOpacity>
        </LinearGradient>
      </SafeAreaView>

      {modalVisible && <BottomModal logOutHandle={LogOutHandler} />}
      {paymentModal && (
        <BottomPayment
          visibleModal={handleVisible}
          closeModal={() => setPaymentModal(false)}
        />
      )}

      <Modal animationType="slide" visible={mpesaModal}>
        <MpesaModal visibilityModal={handleVisibleMpesaModal} />
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  container: {
    flex: 1,
    paddingHorizontal: 20,
  },

  profileSection: {
    alignItems: "center",
    marginBottom: 30,
    marginTop: 10,
  },
  profileImageContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "#E1E5F2",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  profileImage: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: "#E1E5F2",
  },
  profileName: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 5,
    color: "#333333",
  },
  profileEmail: {
    fontSize: 14,
    color: "#666666",
    marginBottom: 5,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginTop: 20,
    marginBottom: 10,
    paddingLeft: 5,
    color: "#666666",
  },
  card: {
    marginBottom: 14,
    padding: 10,
    backgroundColor: "#FFFFFF",
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2.5,
    elevation: 2,
  },
  detailRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 15,
  },
  detailText: {
    flex: 1,
    fontSize: 16,
    color: "#333333",
    fontWeight: "500",
  },
  toggleIcon: {
    transform: [{ scaleX: 1.5 }, { scaleY: 1.5 }],
  },
  logoutButton: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FF5C5C",
    borderRadius: 12,
    padding: 15,
    marginTop: 30,
    shadowColor: "#FF5C5C",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 4,
  },
  logoutText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 10,
  },
  loaderContainer: {
    justifyContent: "center",
    alignItems: "center",
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: "#666666",
  },
});
