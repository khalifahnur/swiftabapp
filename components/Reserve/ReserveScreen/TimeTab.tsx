import React from "react";
import { StyleSheet, Text, View } from "react-native";
import TimeExample from "./TimeExample";

export default function TimeTab() {
  return (
    <View style={styles.timeSlots}>
      <Text style={styles.title}>Select Time</Text>
      {/* {timeSlots.map((slot, index) => (
        <View key={index} style={styles.timeGroup}>
          <Text style={styles.groupTitle}>{slot.title}</Text>
          <View style={styles.timeRow}>
            {slot.times.map((time, timeIndex) => (
              <Pressable
                key={timeIndex}
                onPress={() => handleTimeSelect(time)}
                style={[
                  styles.timeButton,
                  selectedStartTime === time && styles.timeStartSelected,
                  selectedEndTime === time && styles.timeEndSelected,
                ]}
              >
                <Text
                  style={
                    selectedStartTime === time || selectedEndTime === time
                      ? styles.timeTextSelected
                      : styles.timeText
                  }
                >
                  {time}
                </Text>
              </Pressable>
            ))}
          </View>
        </View>
      ))} */}
      <TimeExample />
    </View>
  );
}

const styles = StyleSheet.create({
  timeSlots: {
    marginBottom:10
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 10,
  },
});
