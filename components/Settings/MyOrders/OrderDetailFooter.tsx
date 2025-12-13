import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React from "react";
import { calculateTotal, formatCurrency } from "@/lib/helpers";
import { Ionicons } from "@expo/vector-icons";

export default function OrderDetailFooter({ selectedOrder }) {
  if (!selectedOrder) return null;

  const total = calculateTotal(selectedOrder.menu);
  const tax = total * 0.1;

  return (
    <>
      <View style={styles.divider} />

      <View style={styles.summaryCard}>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Subtotal</Text>
          <Text style={styles.summaryValue}>{formatCurrency(total)}</Text>
        </View>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Tax</Text>
          <Text style={styles.summaryValue}>{formatCurrency(tax)}</Text>
        </View>
        <View style={styles.summaryRow}>
          <Text style={styles.totalLabel}>Total</Text>
          <Text style={styles.totalAmount}>{formatCurrency(total + tax)}</Text>
        </View>

        {/* Only show the payment button if the order is unpaid */}
        {selectedOrder.paid === "Unpaid" && (
          <TouchableOpacity style={styles.payButton}>
            <Ionicons name="wallet-outline" size={20} color="#fff" />
            <Text style={styles.payButtonText}>Pay Now</Text>
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.footer} />
    </>
  );
}

const styles = StyleSheet.create({
  divider: {
    height: 1,
    backgroundColor: "#e1e4e8",
    marginHorizontal: 16,
    marginVertical: 16,
  },
  summaryCard: {
    backgroundColor: "#fff",
    margin: 16,
    borderRadius: 16,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  summaryLabel: {
    fontSize: 15,
    color: "#6c757d",
  },
  summaryValue: {
    fontSize: 15,
    color: "#212529",
    fontWeight: "500",
  },
  totalLabel: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#212529",
  },
  totalAmount: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#212529",
  },
  payButton: {
    backgroundColor: "#2196F3",
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 16,
    flexDirection: "row",
    justifyContent: "center",
  },
  payButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
    marginLeft: 8,
  },
  footer: {
    height: 40,
  },
});
