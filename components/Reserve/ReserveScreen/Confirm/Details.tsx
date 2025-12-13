import { StyleSheet, Text, View } from "react-native";
import React from "react";

type detailProp = {
  bookingDate: string;
  formattedDateTime: string;
  guestCount: number;
  selectedTableId: string | null;
  selectedFloor:string,
  name:string;
  email:string;
  phoneNumber:string;
};

export default function Details({
  bookingDate,
  formattedDateTime,
  guestCount,
  selectedTableId,
  selectedFloor,
  name,
  email,
  phoneNumber
}: detailProp) {

  return (
    // <Receipt>
      <View style={styles.summary}>
        <View style={styles.sections}>
          <Text style={styles.sectionTitle}>Name</Text>
          <Text style={styles.sectionContent}>{name}</Text>
        </View>
        <View style={styles.sections}>
          <Text style={styles.sectionTitle}>Email</Text>
          <Text style={styles.sectionContent}>{email}</Text>
        </View>

        <View style={styles.sections}>
          <Text style={styles.sectionTitle}>Phone Number</Text>
          <Text style={styles.sectionContent}>{`+254 ${phoneNumber}`}</Text>
        </View>

        <View style={styles.sections}>
          <Text style={styles.sectionTitle}>Booking Date</Text>
          <Text style={styles.sectionContent}>{bookingDate}</Text>
        </View>

        <View style={styles.sections}>
          <Text style={styles.sectionTitle}>Occasion</Text>
          <Text style={styles.sectionContent}>occasion</Text>
        </View>
        <View style={styles.divider} />
        <View style={styles.sections}>
          <Text style={styles.sectionTitle}>Booking for</Text>
          <Text style={styles.sectionContent}>{formattedDateTime}</Text>
        </View>

        <View style={styles.sections}>
          <Text style={styles.sectionTitle}>Number of Guests</Text>
          <Text style={styles.sectionContent}>{guestCount}</Text>
        </View>

        <View style={styles.sections}>
          <Text style={styles.sectionTitle}>Table Number</Text>
          <Text style={styles.sectionContent}>{selectedTableId}</Text>
        </View>

        <View style={styles.sections}>
          <Text style={styles.sectionTitle}>Dining Area</Text>
          <Text style={styles.sectionContent}>{selectedFloor}</Text>
        </View>
      </View>

  );
}

const styles = StyleSheet.create({
  summary: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 14,
    color: "#888888",
    marginTop: 15,
    textAlign:"center"
  },
  sectionContent: {
    fontSize: 14,
    fontWeight: "500",
    color: "#333333",
    textAlign:'center'
    //marginTop: 5,
  },
  sections: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  divider: {
    width: "100%",
    borderColor: "#000",
    borderWidth: 1,
    marginVertical: 10,
    borderStyle:'dashed'
  },
});
