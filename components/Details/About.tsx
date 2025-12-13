import {
  Ionicons,
  MaterialCommunityIcons,
  MaterialIcons,
} from "@expo/vector-icons";
import React from "react";
import { StyleSheet, Text, View } from "react-native";
// import Location from "./Location";

export default function About({ data }) {
  return (
    <View>
      <View style={{ flexDirection: "row", gap: 5 }}>
        <MaterialIcons name="description" size={20} color="#000" />
        <View>
          <Text style={styles.subtitle}>Description</Text>
          <Text style={styles.txt}>
            {
              data.about.map((item)=>item.description)
            }
          </Text>
        </View>
      </View>
      <View style={{ flexDirection: "row", gap: 5, paddingTop: 10 }}>
        <MaterialCommunityIcons name="clock" size={20} color="#000" />
        <View>
          <Text style={styles.subtitle}>Hours of Operation</Text>
          <Text style={styles.txt}>
            {data.about.map((item) => item.hrsOfOperation)}
          </Text>
        </View>
      </View>

      <View style={{ flexDirection: "row", gap: 5, paddingTop: 10 }}>
        <MaterialIcons name="phone" size={20} color="#000" />
        <View>
          <Text style={styles.subtitle}>Phone</Text>
          <Text style={styles.txt}>{data.about.map((item) => item.phone)}</Text>
        </View>
      </View>

      <View style={{ flexDirection: "row", gap: 5, paddingTop: 10 }}>
        <MaterialIcons name="email" size={20} color="#000" />
        <View>
          <Text style={styles.subtitle}>Email</Text>
          <Text style={styles.txt}>{data.about.map((item) => item.email)}</Text>
        </View>
      </View>

      <View style={{ flexDirection: "row", gap: 5, paddingTop: 10 }}>
        <MaterialIcons name="local-parking" size={20} color="#000" />
        <View>
          <Text style={styles.subtitle}>Parking</Text>
          <Text style={styles.txt}>Available</Text>
        </View>
      </View>

      <View style={{ flexDirection: "row", gap: 5, paddingTop: 10 }}>
        <Ionicons name="location-sharp" size={20} color="#000" />
        <View>
          <Text style={styles.subtitle}>Location</Text>
          {/* <Location data={data} /> */}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  abouttitle: {
    color: "#000",
    fontSize: 20,
    fontWeight: "600",
    paddingBottom: 5,
  },
  subtitle: {
    color: "#000",
    fontSize: 15,
    fontWeight: "500",
  },
  txt: {
    color: "#000",
    fontSize: 14,
    fontWeight: "400",
  },
});
