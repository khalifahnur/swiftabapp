import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  Modal,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Mpesa from "./Mpesa";
import Cash from "./Cash";
import { router } from "expo-router";

const color = {
  green: "#4CAF50",
  gray: "#757575",
  lightGray: "#f0f0f0",
  white: "#FFFFFF",
  black: "#333333",
  blue: "#2196F3",
  red: "#F44336",
};

const usePaymentHook = () => {
  return {
    mutate: (data) => {
      console.log("Initiating payment with:", data);
      // In a real app, this would make an API call
      return new Promise((resolve) =>
        setTimeout(() => resolve({ success: true }), 1000)
      );
    },
  };
};

const PaymentMethodScreen = ({ navigation, route }) => {
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [showMpesaModal, setShowMpesaModal] = useState(false);
  const [showCashModal, setShowCashModal] = useState(false);
  const { totalAmount = 2450 } = route?.params || {};

  const paymentOptions = [
    {
      key: "cash",
      label: "Cash",
      icon: "https://img.icons8.com/color/48/cash.png",
    },
    {
      key: "mpesa",
      label: "M-Pesa",
      icon: "https://img.icons8.com/color/48/mpesa.png",
    },
    {
      key: "airtel",
      label: "Airtel",
      icon: "https://www.airtelkenya.com/favicon-16x16.png",
    },
    {
      key: "bank_card",
      label: "Bank Card",
      icon: "https://img.icons8.com/dusk/64/bank-cards.png",
    },
  ];

  const handlePaymentSelect = (key) => {
    setSelectedPayment(key);
  };

  const handleContinue = () => {
    if (!selectedPayment) return;
    if (selectedPayment === "mpesa") {
      setShowMpesaModal(true);
    } else if (selectedPayment === "cash") {
      setShowCashModal(true);
    } else {
      router.navigate("/screens/CardScreen");
    }
  };

  return (
    <View style={styles.safeArea}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Choose Payment Method</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.container}>
        <View style={styles.amountContainer}>
          <Text style={styles.amountLabel}>Total Amount</Text>
          <Text style={styles.amount}>KSh {totalAmount.toLocaleString()}</Text>
        </View>

        <View style={styles.optionsContainer}>
          <Text style={styles.sectionTitle}>Payment Methods</Text>

          {paymentOptions.map((option) => (
            <TouchableOpacity
              key={option.key}
              style={[
                styles.paymentOption,
                selectedPayment === option.key && styles.selectedOption,
              ]}
              onPress={() => handlePaymentSelect(option.key)}
            >
              <View style={styles.optionContent}>
                <Image
                  source={{ uri: option.icon }}
                  style={styles.optionIcon}
                  resizeMode="contain"
                />
                <Text style={styles.optionLabel}>{option.label}</Text>
              </View>
              <View style={styles.radioButton}>
                {selectedPayment === option.key && (
                  <View style={styles.radioButtonInner} />
                )}
              </View>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.infoContainer}>
          <Ionicons name="information-circle-outline" size={20} color="#666" />
          <Text style={styles.infoText}>
            Your payment will be processed securely. No additional fees apply.
          </Text>
        </View>
      </ScrollView>

      <View style={styles.bottomContainer}>
        <TouchableOpacity
          style={[
            styles.continueButton,
            !selectedPayment && styles.disabledButton,
          ]}
          onPress={handleContinue}
          disabled={!selectedPayment}
        >
          <Text style={styles.continueButtonText}>Continue</Text>
        </TouchableOpacity>
      </View>

      <Modal
        visible={showMpesaModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowMpesaModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.mpesaModalContainer}>
            <Mpesa
              visibilityModal={() => setShowMpesaModal(false)}
              totalAmount={totalAmount}
            />
          </View>
        </View>
      </Modal>

      <Modal
        visible={showCashModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowCashModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.cashModalContainer}>
            <Cash
              visibilityModal={() => setShowCashModal(false)}
              totalAmount={totalAmount}
              navigation={navigation}
            />
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#fff",
  },
  container: {
    flex: 1,
    padding: 16,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
  },
  placeholder: {
    width: 40,
  },
  amountContainer: {
    marginTop: 16,
    marginBottom: 24,
    padding: 20,
    backgroundColor: "#f8f9fa",
    borderRadius: 12,
    alignItems: "center",
  },
  amountLabel: {
    fontSize: 14,
    color: "#666",
    marginBottom: 4,
  },
  amount: {
    fontSize: 24,
    fontWeight: "700",
    color: "#333",
  },
  optionsContainer: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 12,
  },
  paymentOption: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
    backgroundColor: "#fff",
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#e0e0e0",
  },
  selectedOption: {
    borderColor: color.green,
    backgroundColor: "#f0fff0",
  },
  optionContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  optionIcon: {
    width: 32,
    height: 32,
    marginRight: 12,
  },
  optionLabel: {
    fontSize: 16,
    color: "#333",
  },
  radioButton: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: "#757575",
    justifyContent: "center",
    alignItems: "center",
  },
  radioButtonInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: color.green,
  },
  infoContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    backgroundColor: "#f0f7ff",
    borderRadius: 12,
    marginBottom: 24,
  },
  infoText: {
    fontSize: 14,
    color: "#555",
    marginLeft: 8,
    flex: 1,
  },
  bottomContainer: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: "#f0f0f0",
    backgroundColor: "#fff",
  },
  continueButton: {
    backgroundColor: color.green,
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: "center",
  },
  disabledButton: {
    backgroundColor: "#a0d8a2",
  },
  continueButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
  },
  mpesaModalContainer: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    height: "80%",
  },
  cashModalContainer: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    height: "70%",
  },
});

export default PaymentMethodScreen;
