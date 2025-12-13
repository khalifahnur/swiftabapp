import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React from "react";
import { Ionicons } from "@expo/vector-icons";
import { formatDate, getPaymentColor, getStatusColor } from "@/lib/helpers";
import NewSubHeader from "@/components/Home/NewSubHeader";

export default function OrderDetailHeader({ selectedOrder, setIsViewingDetails }) {
  if (!selectedOrder) return null; // Ensure selectedOrder is valid

  return (
    <>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => setIsViewingDetails(false)}
        >
          <Ionicons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <NewSubHeader headerTitle="Order Details" />
        <View>
          <Text style={styles.headerTitle}>{selectedOrder.orderId}</Text>
        </View>
      </View>

      <View style={styles.detailCard}>
        <View style={styles.orderInfoRow}>
          <View style={styles.orderInfoItem}>
            <Text style={styles.label}>Reservation</Text>
            <Text style={styles.value}>{selectedOrder.reservationId}</Text>
          </View>
          <View style={styles.orderInfoItem}>
            <Text style={styles.label}>Table</Text>
            <Text style={styles.value}>{selectedOrder.tableNumber}</Text>
          </View>
        </View>

        <View style={styles.orderInfoRow}>
          <View style={styles.orderInfoItem}>
            <Text style={styles.label}>Date</Text>
            <Text style={styles.value}>
              {formatDate(selectedOrder.createdAt)}
            </Text>
          </View>
        </View>

        <View style={styles.statusRow}>
          <View
            style={[
              styles.statusBadge,
              { backgroundColor: getStatusColor(selectedOrder.status) },
            ]}
          >
            <Ionicons
              name={selectedOrder.status === "Served" ? "checkmark-circle" : "time-outline"}
              size={16}
              color="#fff"
            />
            <Text style={styles.statusText}>{selectedOrder.status}</Text>
          </View>
          <View
            style={[
              styles.statusBadge,
              { backgroundColor: getPaymentColor(selectedOrder.paid) },
            ]}
          >
            <Ionicons
              name={selectedOrder.paid === "Paid" ? "wallet-outline" : "time-outline"}
              size={16}
              color="#fff"
            />
            <Text style={styles.statusText}>{selectedOrder.paid}</Text>
          </View>
        </View>
      </View>

      <Text style={styles.sectionTitle}>Order Items</Text>
    </>
  );
}


const styles = StyleSheet.create({
  header: {
    padding: 16,
    paddingTop: 20,
    backgroundColor: "#fff",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  headerSmallText: {
    fontSize: 14,
    color: "#6c757d",
  },
  headerTitle: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#212529",
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#f0f0f0",
    justifyContent: "center",
    alignItems: "center",
  },
  // Order Card Styles (main list)
  orderCard: {
    backgroundColor: "#fff",
    margin: 16,
    marginBottom: 12,
    borderRadius: 16,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  orderCardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  orderCardId: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#212529",
  },
  orderCardDate: {
    fontSize: 14,
    color: "#6c757d",
  },
  orderCardInfo: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  orderCardInfoLabel: {
    fontSize: 12,
    color: "#6c757d",
    marginBottom: 4,
  },
  orderCardInfoValue: {
    fontSize: 15,
    fontWeight: "600",
    color: "#212529",
  },
  orderCardStatus: {
    flexDirection: "row",
  },
  detailCard: {
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
  orderInfoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  orderInfoItem: {
    flex: 1,
  },
  label: {
    fontSize: 12,
    color: "#6c757d",
    marginBottom: 4,
  },
  value: {
    fontSize: 15,
    color: "#212529",
    fontWeight: "600",
  },
  statusRow: {
    flexDirection: "row",
    marginTop: 8,
  },
  statusBadge: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
    marginRight: 8,
    flexDirection: "row",
    alignItems: "center",
  },
  statusText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 12,
    marginLeft: 4,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#212529",
    marginTop: 8,
    marginBottom: 12,
    paddingHorizontal: 16,
  },
  menuItem: {
    flexDirection: "row",
    backgroundColor: "#fff",
    padding: 16,
    marginHorizontal: 16,
    marginBottom: 12,
    borderRadius: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
  },
  menuImage: {
    width: 80,
    height: 80,
    borderRadius: 12,
    backgroundColor: "#f0f0f0",
  },
  menuItemInfo: {
    flex: 1,
    marginLeft: 16,
    justifyContent: "space-between",
  },
  menuItemName: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#212529",
    marginBottom: 4,
  },
  menuItemDescription: {
    fontSize: 14,
    color: "#6c757d",
    marginBottom: 8,
  },
  priceRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  quantityContainer: {
    backgroundColor: "#f0f0f0",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  quantityText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#212529",
  },
  menuItemTotal: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#212529",
  },
});
