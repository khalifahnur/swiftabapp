import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { TouchableOpacity } from "react-native";

type props={
    id?:number;
    isSelected?:boolean;
    handleTableSelect?:(id:number)=>void
}

export default function Two({ id, isSelected, handleTableSelect }:props) {
  return (
    <View key={id} style={styles.tableContainer}>
      {/* Top row of chairs */}
      <View style={styles.chairRow}>
        <View style={styles.emptySpace} />
        <View style={[styles.chairUp, styles.chairActive]} />
        <View style={styles.emptySpace} />
      </View>

      {/* Middle row with chairs and table */}
      <View style={styles.chairRow}>
        {/* <View style={[styles.chairLeft, styles.chairActive]} /> */}
        <TouchableOpacity
          style={[
            styles.tableRectangle,
            isSelected ? styles.tableSelected : styles.tableActive,
          ]}
          onPress={() => handleTableSelect(id)}
        >
          <Text style={styles.tableText}>{id}</Text>
        </TouchableOpacity>
        {/* <View style={[styles.chairRight, styles.chairActive]} /> */}
      </View>

      {/* Bottom row of chairs */}
      <View style={styles.chairRow}>
        <View style={styles.emptySpace} />
        <View style={[styles.chairDown, styles.chairActive]} />
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
    width: 20,
    height: 20,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    backgroundColor: "#2ecc71",
    margin: 5,
  },
  chairUp: {
    width: 20,
    height: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    backgroundColor: "#2ecc71",
    margin: 5,
  },
  emptySpace: {
    width: 20,
    height: 20,
    margin: 5,
  },
  tableRectangle: {
    width: 40,
    height: 40,
    borderRadius: 10, 
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#3498db",
  },
  tableActive: {
    backgroundColor: "#3498db",
  },
  tableSelected: {
    backgroundColor: "#f39c12", // Orange 
  },
  tableText: {
    color: "#fff",
    fontWeight: "bold",
  },
});
