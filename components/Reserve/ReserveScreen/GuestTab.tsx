import { color } from "@/constants/Colors";
import useStore from "@/store/useStore";
import { AntDesign } from "@expo/vector-icons";
import React from "react";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function GuestTab() {
  const { guestCount, setGuestCount } = useStore();

  const handleAdd = () => setGuestCount(guestCount + 1);
  const handleSub = () =>
    setGuestCount(guestCount > 1 ? guestCount - 1 : guestCount);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Total Guests</Text>
      <View style={styles.subContainer}>
        <TouchableOpacity
          style={[
            styles.minBtn,
            { backgroundColor: guestCount > 1 ? color.green : color.gray },
          ]}
          activeOpacity={0.5}
          onPress={handleSub}
        >
          <AntDesign
            name="minus"
            size={20}
            color={guestCount > 1 ? color.white : color.gray}
          />
        </TouchableOpacity>
        <View style={styles.holder}>
          <Text style={styles.txt}>{guestCount}</Text>
        </View>

        <TouchableOpacity
          style={styles.addBtn}
          activeOpacity={0.5}
          onPress={handleAdd}
        >
          <AntDesign name="plus" size={20} color={"#fff"} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 10,
    marginTop: 5,

  },
  subContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  minBtn: {
    padding: 10,
    borderRadius: 4,
  },
  addBtn: {
    backgroundColor: color.green,
    padding: 10,
    borderRadius: 4,
  },
  holder: {
    backgroundColor: color.gray,
    padding: 10,
    borderRadius: 4,
    width: "50%",
  },
  txt: {
    textAlign: "center",
    fontSize: 15,
    fontWeight: "500",
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 4,
  },
});
