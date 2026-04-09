import { Ionicons } from "@expo/vector-icons";
import { router, Stack, useLocalSearchParams } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React, { useState } from "react";
import {
  Image,
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";

import Cash from "@/components/Payment/Cash";
import Mpesa from "@/components/Payment/Mpesa";

export default function PaymentScreen() {
  const insets = useSafeAreaInsets();
  const params = useLocalSearchParams();
  const totalAmount = Number(params.subTotal) || 0;

  const [selectedPayment, setSelectedPayment] = useState<string | null>(null);
  const [showMpesaModal, setShowMpesaModal] = useState(false);
  const [showCashModal, setShowCashModal] = useState(false);

  const paymentOptions = [
    {
      key: "mpesa",
      label: "M-Pesa",
      icon: "https://img.icons8.com/color/48/mpesa.png",
    },
    {
      key: "bank_card",
      label: "Credit / Debit Card",
      icon: "https://img.icons8.com/dusk/64/bank-cards.png",
    },
    {
      key: "airtel",
      label: "Airtel Money",
      icon: "https://www.airtelkenya.com/favicon-16x16.png",
    },
    {
      key: "cash",
      label: "Pay in Cash",
      icon: "https://img.icons8.com/color/48/cash.png",
    },
  ];

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
    <SafeAreaView style={styles.safeArea} edges={["top"]}>
      <StatusBar style="dark" />
      <Stack.Screen options={{ headerShown: false }} />

      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back" size={20} color="#111827" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Checkout</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView
        style={styles.container}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Premium Amount Card */}
        <View style={styles.amountCard}>
          <Text style={styles.amountLabel}>Total to Pay</Text>
          <Text style={styles.amountValue}>
            KSh {totalAmount.toLocaleString()}
          </Text>
        </View>

        <Text style={styles.sectionTitle}>Payment Method</Text>

        {/* Payment Options */}
        <View style={styles.optionsContainer}>
          {paymentOptions.map((option) => {
            const isSelected = selectedPayment === option.key;
            return (
              <TouchableOpacity
                key={option.key}
                activeOpacity={0.8}
                style={[
                  styles.paymentOption,
                  isSelected && styles.selectedOption,
                ]}
                onPress={() => setSelectedPayment(option.key)}
              >
                <View style={styles.optionContent}>
                  <View style={styles.iconWrapper}>
                    <Image
                      source={{ uri: option.icon }}
                      style={styles.optionIcon}
                      resizeMode="contain"
                    />
                  </View>
                  <Text
                    style={[
                      styles.optionLabel,
                      isSelected && styles.selectedOptionLabel,
                    ]}
                  >
                    {option.label}
                  </Text>
                </View>

                {/* Modern Radio Button */}
                <View
                  style={[
                    styles.radioOutline,
                    isSelected && styles.radioOutlineSelected,
                  ]}
                >
                  {isSelected && <View style={styles.radioInner} />}
                </View>
              </TouchableOpacity>
            );
          })}
        </View>

        <View style={styles.infoContainer}>
          <Ionicons name="shield-checkmark" size={20} color="#0d9488" />
          <Text style={styles.infoText}>
            Payments are secure and encrypted. No hidden fees apply.
          </Text>
        </View>
      </ScrollView>
      <View
        style={[styles.footer, { paddingBottom: Math.max(insets.bottom, 20) }]}
      >
        <TouchableOpacity
          style={[
            styles.continueButton,
            !selectedPayment && styles.disabledButton,
          ]}
          onPress={handleContinue}
          disabled={!selectedPayment}
          activeOpacity={0.8}
        >
          <Text style={styles.continueButtonText}>Confirm Payment</Text>
          <Ionicons name="arrow-forward" size={20} color="#fff" />
        </TouchableOpacity>
      </View>

      <Modal
        visible={showMpesaModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowMpesaModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
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
          <View style={styles.modalContainerSmall}>
            <Cash
              visibilityModal={() => setShowCashModal(false)}
              totalAmount={totalAmount}
            />
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#F9FAFB", // gray-50
  },
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingBottom: 120, // Leave room for sticky footer
    paddingTop: 10,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 24,
    paddingVertical: 16,
    backgroundColor: "#F9FAFB",
  },
  backButton: {
    width: 40,
    height: 40,
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#F3F4F6",
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
      },
      android: { elevation: 2 },
    }),
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#111827",
  },
  placeholder: {
    width: 40,
  },
  amountCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 24,
    padding: 24,
    alignItems: "center",
    marginBottom: 24,
    borderWidth: 1,
    borderColor: "#F3F4F6",
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
      },
      android: { elevation: 3 },
    }),
  },
  amountLabel: {
    fontSize: 14,
    color: "#6B7280", // gray-500
    fontWeight: "500",
    marginBottom: 8,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  amountValue: {
    fontSize: 32,
    fontWeight: "800",
    color: "#0F766E", // teal-700
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 16,
    marginLeft: 4,
  },
  optionsContainer: {
    marginBottom: 24,
  },
  paymentOption: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#E5E7EB", // gray-200
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.03,
        shadowRadius: 2,
      },
      android: { elevation: 1 },
    }),
  },
  selectedOption: {
    borderColor: "#0d9488", // teal-600
    backgroundColor: "#F0FDFA", // teal-50
  },
  optionContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  iconWrapper: {
    width: 40,
    height: 40,
    backgroundColor: "#F3F4F6",
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 16,
  },
  optionIcon: {
    width: 24,
    height: 24,
  },
  optionLabel: {
    fontSize: 16,
    fontWeight: "600",
    color: "#374151", // gray-700
  },
  selectedOptionLabel: {
    color: "#0F766E", // teal-700
  },
  radioOutline: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: "#D1D5DB", // gray-300
    justifyContent: "center",
    alignItems: "center",
  },
  radioOutlineSelected: {
    borderColor: "#0d9488", // teal-600
  },
  radioInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: "#0d9488", // teal-600
  },
  infoContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    backgroundColor: "#F0FDFA", // teal-50
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#CCFBF1", // teal-100
  },
  infoText: {
    fontSize: 13,
    color: "#0F766E", // teal-700
    marginLeft: 12,
    flex: 1,
    fontWeight: "500",
    lineHeight: 18,
  },
  footer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "#FFFFFF",
    borderTopWidth: 1,
    borderTopColor: "#F3F4F6",
    paddingHorizontal: 24,
    paddingTop: 16,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: -4 },
        shadowOpacity: 0.05,
        shadowRadius: 6,
      },
      android: { elevation: 10 },
    }),
  },
  continueButton: {
    backgroundColor: "#0d9488", // teal-600
    borderRadius: 16,
    paddingVertical: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  disabledButton: {
    backgroundColor: "#99F6E4", // teal-200
  },
  continueButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
  },
  modalContainer: {
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    height: "80%",
  },
  modalContainerSmall: {
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    height: "50%",
  },
});
