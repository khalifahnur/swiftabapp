import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import { calculateTotal, formatCurrency, formatDate, getPaymentColor, getStatusColor } from '@/lib/helpers';
import { Ionicons } from '@expo/vector-icons';

export default function RenderMenu({ item, setSelectedOrder, setIsViewingDetails }) {
  if (!item) return null; // Prevent crashes if item is undefined

  const total = calculateTotal(item.menu || []); // Ensure menu is an array
  return (
    <TouchableOpacity
      style={styles.orderCard}
      onPress={() => {
        setSelectedOrder(item);
        setIsViewingDetails(true);
      }}
    >
      <View style={styles.orderCardHeader}>
        <Text style={styles.orderCardId}>{item.orderId}</Text>
        <Text style={styles.orderCardDate}>{formatDate(item.createdAt)}</Text>
      </View>

      <View style={styles.orderCardInfo}>
        <View>
          <Text style={styles.orderCardInfoLabel}>Table</Text>
          <Text style={styles.orderCardInfoValue}>{item.tableNumber}</Text>
        </View>
        <View>
          <Text style={styles.orderCardInfoLabel}>Items</Text>
          <Text style={styles.orderCardInfoValue}>{item.menu ? item.menu.length : 0}</Text>
        </View>
        <View>
          <Text style={styles.orderCardInfoLabel}>Total</Text>
          <Text style={styles.orderCardInfoValue}>{formatCurrency(total)}</Text>
        </View>
      </View>

      <View style={styles.orderCardStatus}>
        <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) }]}>
          <Ionicons
            name={item.status === "Served" ? "checkmark-circle" : "time-outline"}
            size={16}
            color="#fff"
          />
          <Text style={styles.statusText}>{item.status}</Text>
        </View>
        <View style={[styles.statusBadge, { backgroundColor: getPaymentColor(item.paid) }]}>
          <Ionicons
            name={item.paid === "Paid" ? "wallet-outline" : "time-outline"}
            size={16}
            color="#fff"
          />
          <Text style={styles.statusText}>{item.paid}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}


const styles = StyleSheet.create({
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
      
})