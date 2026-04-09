import { color } from "@/constants/Colors";
import { usePaymentHook } from "@/hooks/paymenthooks/paymenthook";
import { AntDesign } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Checkbox from "expo-checkbox";
import React, { useEffect, useState } from "react";
import {
  Image,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

export default function Mpesa({ visibilityModal, totalAmount }) {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [useKnownNumber, setUseKnownNumber] = useState(false);
  const [userData, setUserData] = useState({
    email: "",
    name: "",
    phoneNumber: "",
    userId: "",
  });
  const [isLoading, setIsLoading] = useState(false);

  const initiatepayment = usePaymentHook();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userObj = JSON.parse(
          (await AsyncStorage.getItem("userObj")) || "{}",
        );
        setUserData(userObj.user || {});
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (useKnownNumber && userData.phoneNumber) {
      setPhoneNumber(`+254${userData.phoneNumber}`);
    } else if (!useKnownNumber) {
      setPhoneNumber("");
    }
  }, [useKnownNumber, userData]);

  const handlePay = () => {
    const { email, phoneNumber: userPhone } = userData;
    const amount = parseInt(totalAmount);

    let phone = phoneNumber || userPhone;

    if (!phone || !amount || !email) {
      console.error("Missing required fields: phone, amount, or email");
      return;
    }

    if (!phone.startsWith("+")) {
      phone = `+254${phone}`;
    }

    setIsLoading(true);
    initiatepayment.mutate({ phone, amount, email });
    if (initiatepayment.isSuccess) {
      setTimeout(() => {
        setIsLoading(false);
        visibilityModal();
      }, 2000);
    } else {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.mpesaContainer}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      {/* Header with Logo */}
      <View style={styles.mpesaHeader}>
        <Image
          source={{ uri: "https://img.icons8.com/color/48/mpesa.png" }}
          style={styles.mpesaLogo}
          resizeMode="contain"
        />
        <Pressable style={styles.closeButton} onPress={visibilityModal}>
          <AntDesign name="close" size={20} color="#FF6B6B" />
        </Pressable>
      </View>

      {/* Title */}
      <Text style={styles.mpesaTitle}>M-Pesa Payment</Text>
      <Text style={styles.mpesaSubtitle}>
        Amount: KSh {totalAmount.toLocaleString()}
      </Text>

      {/* Input Field with Label */}
      <View style={styles.inputContainer}>
        <Text style={styles.inputLabel}>Enter M-Pesa Number</Text>
        <TextInput
          style={styles.mpesaInput}
          placeholder="e.g. 7XXXXXXXX"
          value={phoneNumber}
          onChangeText={setPhoneNumber}
          keyboardType="phone-pad"
          editable={!useKnownNumber}
        />
      </View>

      {/* Checkbox Option */}
      {userData.phoneNumber && (
        <View style={styles.checkboxOption}>
          <Checkbox
            value={useKnownNumber}
            onValueChange={setUseKnownNumber}
            color={useKnownNumber ? color.green : undefined}
          />
          <Text style={styles.optionText}>
            Use saved number: +254{userData.phoneNumber}
          </Text>
        </View>
      )}
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  mpesaContainer: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
  },
  mpesaHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  mpesaLogo: {
    width: 48,
    height: 48,
  },
  closeButton: {
    backgroundColor: color.gray,
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  mpesaTitle: {
    fontSize: 22,
    fontWeight: "600",
    textAlign: "center",
    color: "#333",
  },
  mpesaSubtitle: {
    fontSize: 16,
    textAlign: "center",
    color: "#666",
    marginBottom: 25,
  },
  inputContainer: {
    marginBottom: 15,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: "500",
    color: "#333",
    marginBottom: 8,
  },
  mpesaInput: {
    height: 56,
    borderColor: "#ddd",
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 15,
    fontSize: 16,
    backgroundColor: "#f9f9f9",
  },
  checkboxOption: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 25,
  },
  optionText: {
    marginLeft: 10,
    fontSize: 15,
    color: "#333",
  },
  instructionsContainer: {
    backgroundColor: "#f9f9f9",
    padding: 15,
    borderRadius: 10,
    marginTop: 10,
    marginBottom: 25,
  },
  instructionsTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 10,
    color: "#333",
  },
  instructionItem: {
    flexDirection: "row",
    marginBottom: 8,
    alignItems: "flex-start",
  },
  instructionNumber: {
    backgroundColor: color.green,
    color: "#fff",
    width: 24,
    height: 24,
    borderRadius: 12,
    textAlign: "center",
    lineHeight: 24,
    marginRight: 10,
    fontWeight: "600",
  },
  instructionText: {
    flex: 1,
    fontSize: 15,
    color: "#555",
  },
  mpesaPayButton: {
    backgroundColor: color.green,
    paddingVertical: 16,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    marginTop: "auto",
  },
  disabledPayButton: {
    backgroundColor: color.gray,
  },
  payButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#fff",
  },
});
