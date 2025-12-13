import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { TouchableOpacity } from "react-native";
import useStore from "@/store/useStore";

type props = {
  id: string;
  isSelected?: boolean;
  isAvailable?: boolean;
  handleTableSelect?: (id: string) => void;
  customStyle?: object;
};

export default function RecFour({
  id,
  isSelected,
  isAvailable,
  handleTableSelect,
  customStyle,
}: props) {
  const { selectedTableId, setSelectedTable } = useStore();

  return (
    <View style={[styles.tableContainer, customStyle]}>
      <View style={styles.chairRow}>
        <View style={styles.emptySpace} />
        <View
          style={[
            styles.chairUp,
            isAvailable ? styles.chairActive : styles.chairInactive,
          ]}
        />
        <View style={styles.emptySpace} />
      </View>

      <View style={styles.chairRow}>
        <View
          style={[
            styles.chairLeft,
            isAvailable ? styles.chairActive : styles.chairInactive,
          ]}
        />
        <TouchableOpacity
          style={[
            styles.table,
            selectedTableId === id
              ? styles.tableSelected
              : isAvailable
              ? styles.tableActive
              : styles.tableInactive,
          ]}
          onPress={() => setSelectedTable(id)}
          disabled={!isAvailable}
        >
          <Text style={styles.tableText}>{id}</Text>
        </TouchableOpacity>

        <View
          style={[
            styles.chairRight,
            isAvailable ? styles.chairActive : styles.chairInactive,
          ]}
        />
      </View>

      <View style={styles.chairRow}>
        <View style={styles.emptySpace} />
        <View
          style={[
            styles.chairDown,
            isAvailable ? styles.chairActive : styles.chairInactive,
          ]}
        />
        <View style={styles.emptySpace} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  tableContainer: {
    alignItems: "center",
  },
  chairRow: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  chairDown: {
    width: 15,
    height: 15,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    backgroundColor: "#2ecc71",
    margin: 5,
  },
  chairUp: {
    width: 15,
    height: 15,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    backgroundColor: "#2ecc71",
    margin: 5,
  },
  chairLeft: {
    width: 15,
    height: 15,
    borderTopLeftRadius: 20,
    borderBottomLeftRadius: 20,
    backgroundColor: "#2ecc71",
    margin: 5,
  },
  chairRight: {
    width: 15,
    height: 15,
    borderTopRightRadius: 20,
    borderBottomRightRadius: 20,
    backgroundColor: "#2ecc71",
    margin: 5,
  },
  emptySpace: {
    width: 20,
    height: 20,
    margin: 5,
  },
  table: {
    width: 60,
    height: 30,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#3498db",
  },
  tableActive: {
    backgroundColor: "#3ce747",
  },
  tableSelected: {
    backgroundColor: "blue",
  },
  tableText: {
    color: "#fff",
    fontWeight: "bold",
  },
  chairActive: {
    backgroundColor: "#3ce747",
  },
  chairInactive: {
    backgroundColor: "#e74c3c",
  },
  tableInactive: {
    backgroundColor: "#e74c3c",
  },
});
