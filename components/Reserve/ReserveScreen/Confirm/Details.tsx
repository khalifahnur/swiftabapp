import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Platform, StyleSheet, Text, View } from "react-native";

type DetailProp = {
  bookingDate: string;
  formattedDateTime: string;
  guestCount: number;
  selectedTableId: string | null;
  selectedFloor: string;
  name: string;
  email: string;
  phoneNumber: string;
};

const InfoRow = ({
  label,
  value,
  isLast = false,
}: {
  label: string;
  value: string | number | null;
  isLast?: boolean;
}) => (
  <View style={[styles.infoRow, !isLast && styles.infoRowBorder]}>
    <Text style={styles.infoRowLabel}>{label}</Text>
    <Text style={styles.infoRowValue}>{value || "N/A"}</Text>
  </View>
);

export default function Details({
  formattedDateTime,
  guestCount,
  selectedTableId,
  selectedFloor,
  name,
  email,
  phoneNumber,
}: DetailProp) {
  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>Guest Details</Text>

      <View style={[styles.card, styles.marginBottomLarge]}>
        <InfoRow label="Name" value={name} />
        <InfoRow label="Phone" value={`+254 ${phoneNumber}`} />
        <InfoRow label="Email" value={email} isLast />
      </View>

      <Text style={styles.sectionTitle}>Reservation Info</Text>

      <View style={[styles.card, styles.marginBottomMedium]}>
        <View style={styles.dateTimeHeader}>
          <View style={styles.iconContainer}>
            <Ionicons name="calendar" size={18} color="#0d9488" />
          </View>
          <View>
            <Text style={styles.dateTimeLabel}>Date & Time</Text>
            <Text style={styles.dateTimeValue}>{formattedDateTime}</Text>
          </View>
        </View>

        <View style={styles.divider} />

        <InfoRow label="Guests" value={`${guestCount} People`} />
        <InfoRow label="Dining Area" value={selectedFloor} />
        <InfoRow label="Table Number" value={selectedTableId} isLast />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 8,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#9CA3AF",
    textTransform: "uppercase",
    letterSpacing: 0.5,
    marginBottom: 8,
    marginLeft: 4,
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 10,
    padding: 20,
    borderWidth: 1,
    borderColor: "#F3F4F6",
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  marginBottomLarge: {
    marginBottom: 24,
  },
  marginBottomMedium: {
    marginBottom: 16,
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
  },
  infoRowBorder: {
    borderBottomWidth: 1,
    borderBottomColor: "#F9FAFB",
  },
  infoRowLabel: {
    color: "#6B7280",
    fontWeight: "500",
    fontSize: 14,
  },
  infoRowValue: {
    color: "#111827",
    fontWeight: "bold",
    fontSize: 14,
  },
  dateTimeHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  iconContainer: {
    width: 40,
    height: 40,
    backgroundColor: "#F0FDFA",
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  dateTimeLabel: {
    fontSize: 12,
    color: "#6B7280",
    fontWeight: "500",
  },
  dateTimeValue: {
    color: "#0F766E",
    fontWeight: "bold",
    fontSize: 14,
  },
  divider: {
    height: 1,
    backgroundColor: "#F9FAFB",
    width: "100%",
    marginBottom: 4,
  },
});
