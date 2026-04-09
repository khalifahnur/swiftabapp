import useStore from "@/store/useStore";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

// Modern Brand Palette
const COLORS = {
  available: "#14b8a6", // teal-500
  selected: "#134e4a", // teal-900
  unavailable: "#e5e7eb", // gray-200
  textLight: "#ffffff",
  textDark: "#9ca3af", // gray-400
};

type Props = {
  id: string;
  isAvailable?: boolean;
  customStyle?: object;
};

export default function RecFour({ id, isAvailable, customStyle }: Props) {
  const { selectedTableId, setSelectedTable } = useStore();

  const isSelected = selectedTableId === id;
  const chairColor = isAvailable ? COLORS.available : COLORS.unavailable;
  const tableColor = isSelected
    ? COLORS.selected
    : isAvailable
      ? COLORS.available
      : COLORS.unavailable;
  const textColor =
    isSelected || isAvailable ? COLORS.textLight : COLORS.textDark;

  return (
    <View style={[styles.tableContainer, customStyle]}>
      <View style={styles.chairRow}>
        <View style={styles.emptySpace} />
        <View style={[styles.chairUp, { backgroundColor: chairColor }]} />
        <View style={styles.emptySpace} />
      </View>

      <View style={styles.chairRow}>
        <View style={[styles.chairLeft, { backgroundColor: chairColor }]} />

        <TouchableOpacity
          style={[styles.table, { backgroundColor: tableColor }]}
          onPress={() => setSelectedTable(id)}
          disabled={!isAvailable}
          activeOpacity={0.8}
        >
          <Text style={[styles.tableText, { color: textColor }]}>{id}</Text>
        </TouchableOpacity>

        <View style={[styles.chairRight, { backgroundColor: chairColor }]} />
      </View>

      <View style={styles.chairRow}>
        <View style={styles.emptySpace} />
        <View style={[styles.chairDown, { backgroundColor: chairColor }]} />
        <View style={styles.emptySpace} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  tableContainer: { alignItems: "center", margin: 10 },
  chairRow: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  chairDown: {
    width: 16,
    height: 12,
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
    margin: 4,
  },
  chairUp: {
    width: 16,
    height: 12,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    margin: 4,
  },
  chairLeft: {
    width: 12,
    height: 16,
    borderTopLeftRadius: 10,
    borderBottomLeftRadius: 10,
    margin: 4,
  },
  chairRight: {
    width: 12,
    height: 16,
    borderTopRightRadius: 10,
    borderBottomRightRadius: 10,
    margin: 4,
  },
  emptySpace: { width: 20, height: 20, margin: 4 },
  table: {
    width: 64,
    height: 40,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  tableText: { fontWeight: "bold", fontSize: 14 },
});
