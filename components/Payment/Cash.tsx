import { Pressable, StyleSheet, Text, View } from "react-native";
import React, { useState } from "react";
import { AntDesign, MaterialIcons } from "@expo/vector-icons";
import { color } from "@/constants/Colors";

export default function Cash({ visibilityModal, totalAmount, navigation }) {
  const [isProcessing, setIsProcessing] = useState(false);

  const handleConfirm = () => {
    setIsProcessing(true);
    // Simulate processing
    setTimeout(() => {
      setIsProcessing(false);
      visibilityModal();
      // Navigate to order confirmation
      navigation.navigate("OrderConfirmation", {
        paymentMethod: "cash",
        totalAmount,
        orderNumber: `ORD-${Math.floor(Math.random() * 10000)}`,
      });
    }, 1500);
  };

  return (
    <View style={styles.cashContainer}>
      {/* Close Button */}
      <Pressable style={styles.closeButton} onPress={visibilityModal}>
        <AntDesign name="close" size={20} color="#FF6B6B" />
      </Pressable>

      {/* Cash Icon */}
      <View style={styles.cashIconContainer}>
        <MaterialIcons name="attach-money" size={60} color={color.green} />
      </View>

      {/* Title */}
      <Text style={styles.cashTitle}>Cash Payment</Text>
      <Text style={styles.cashAmount}>KSh {totalAmount.toLocaleString()}</Text>

      {/* Instructions */}
      <View style={styles.cashInstructions}>
        <Text style={styles.cashInstructionsTitle}>Please Note:</Text>
        <Text style={styles.cashInstructionText}>
          • Pay the exact amount to the waiter
        </Text>
        <Text style={styles.cashInstructionText}>
          • Keep your receipt for reference
        </Text>
        <Text style={styles.cashInstructionText}>
          • Ask for change if needed
        </Text>
      </View>

      {/* Confirm Button */}
      <Pressable
        style={[
          styles.cashConfirmButton,
          isProcessing && styles.disabledPayButton,
        ]}
        onPress={handleConfirm}
        disabled={isProcessing}
      >
        {isProcessing ? (
          <Text style={styles.cashConfirmText}>PROCESSING...</Text>
        ) : (
          <Text style={styles.cashConfirmText}>CONFIRM ORDER</Text>
        )}
      </Pressable>
    </View>
  );
}
const styles = StyleSheet.create({
  cashContainer: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
    alignItems: "center",
  },
  closeButton: {
    backgroundColor: color.gray,
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    position:'absolute',
    top:10,
    right:10
  },
  cashIconContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "#f0fff0",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
    marginBottom: 20,
  },
  cashTitle: {
    fontSize: 24,
    fontWeight: "600",
    color: "#333",
    marginBottom: 10,
  },
  cashAmount: {
    fontSize: 28,
    fontWeight: "700",
    color: color.green,
    marginBottom: 30,
  },
  cashInstructions: {
    width: "100%",
    backgroundColor: "#f9f9f9",
    padding: 20,
    borderRadius: 12,
    marginBottom: 30,
  },
  cashInstructionsTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
    marginBottom: 15,
  },
  cashInstructionText: {
    fontSize: 16,
    color: "#555",
    marginBottom: 10,
    lineHeight: 22,
  },
  cashConfirmButton: {
    backgroundColor: color.green,
    paddingVertical: 16,
    paddingHorizontal: 30,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    marginTop: "auto",
  },
  cashConfirmText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#fff",
  },
  disabledPayButton: {
    backgroundColor: color.gray,
  },
});
