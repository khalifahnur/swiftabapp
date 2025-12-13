import { StyleSheet, Text, View } from "react-native";
import React from "react";

export default function Counter() {
  return (
    <View style={styles.container}>
      <View style={styles.counter}>
        <Text style={styles.txt}>Counter</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
  },
  counter: {
    alignItems: "center",
    width: 250,
    height: 70,
    borderColor: "#999",
    borderWidth: 1,
    borderBottomEndRadius: 50,
    borderBottomStartRadius: 50,
    backgroundColor:"#999"
  },
  txt: {
    textAlign: "center",
    fontSize: 15,
    fontWeight: "600",
    marginTop:20,
    color:'#fff'
  },
});
