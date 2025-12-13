import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  KeyboardAvoidingView,
} from "react-native";
import { AntDesign } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Checkbox from "expo-checkbox";
import { usePaymentHook } from "@/hooks/paymenthooks/paymenthook";
import { color } from "@/constants/Colors";

type BottomProps = {
  visibilityModal: () => void;
};

interface UserData {
  email: string;
  name: string;
  phoneNumber: string;
  userId: string;
}

const MpesaModal = ({ visibilityModal }: BottomProps) => {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [useKnownNumber, setUseKnownNumber] = useState(false);
  const [userData, setUserData] = useState<UserData>({} as UserData);

  const initiatepayment = usePaymentHook();

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

  useEffect(() => {
    if (useKnownNumber) {
      setPhoneNumber(`+254${userData.phoneNumber}`);
    }
  }, [useKnownNumber, userData]);

  const handlePay = () => {
    const { email, phoneNumber: userPhone } = userData;
    const amount = 50;

    let phone = phoneNumber || userPhone;

    if (!phone || !amount || !email) {
      console.error("Missing required fields: phone, amount, or email");
      return;
    }

    if (!phone.startsWith("+")) {
      phone = `+254${phone}`;
    }

    initiatepayment.mutate({ phone, amount, email });
  };

  return (
    <KeyboardAvoidingView style={styles.container} behavior="padding">
      {/* Close Button */}
      <Pressable style={styles.closeButton} onPress={visibilityModal}>
        <AntDesign name="close" size={20} color="#fff" />
      </Pressable>

      {/* Title */}
      <Text style={styles.title}>Enter M-Pesa Number</Text>

      {/* Input Field */}
      <TextInput
        style={styles.input}
        placeholder="Enter phone number"
        value={phoneNumber}
        onChangeText={setPhoneNumber}
        keyboardType="phone-pad"
        editable={!useKnownNumber}
      />

      {/* Checkbox Option */}
      <View style={styles.option}>
        <Checkbox
          value={useKnownNumber}
          onValueChange={setUseKnownNumber}
          color={useKnownNumber ? color.green : undefined}
        />
        <Text style={styles.optionText}>
          Use saved number: +254{userData.phoneNumber}
        </Text>
      </View>

      {/* Pay Button */}
      <Pressable
        style={[
          styles.payButton,
          !phoneNumber && styles.disabledPayButton,
        ]}
        onPress={handlePay}
        disabled={!phoneNumber}
      >
        <Text style={styles.payButtonText}>PAY</Text>
      </Pressable>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
  },
  closeButton: {
    alignSelf: "flex-end",
    backgroundColor: color.gray,
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  title: {
    fontSize: 16,
    fontWeight: "600",
    textAlign: "center",
    marginBottom: 20,
    color: "#333",
  },
  input: {
    height: 50,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 15,
    marginBottom: 20,
    fontSize: 14,
    backgroundColor: "#f9f9f9",
  },
  option: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  optionText: {
    marginLeft: 10,
    fontSize: 14,
    color: "#333",
  },
  payButton: {
    backgroundColor: color.green,
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  disabledPayButton: {
    backgroundColor: color.gray,
  },
  payButtonText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#fff",
  },
});

export default MpesaModal;
