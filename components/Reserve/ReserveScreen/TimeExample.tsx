import { color } from "@/constants/Colors";
import useStore from "@/store/useStore";
import React, { useCallback, useState } from "react";
import { Alert, Button, StyleSheet, Text, View } from "react-native";
import DateTimePickerModal from "react-native-modal-datetime-picker";

const PICKER_MODE = {
  START: "start",
  END: "end",
};

const formatTime = (isoString) => {
  if (!isoString) return "--:--";
  const date = new Date(isoString);
  const hours = date.getHours().toString().padStart(2, "0");
  const minutes = date.getMinutes().toString().padStart(2, "0");
  return `${hours}:${minutes}`;
};

const getTimeOnly = (date) => {
  return date.getHours() * 60 + date.getMinutes();
};

const TimeExample = () => {
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [pickerMode, setPickerMode] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const {
    selectedStartTime,
    setSelectedStartTime,
    selectedEndTime,
    setSelectedEndTime,
  } = useStore();

  const showDatePicker = useCallback((mode) => {
    setPickerMode(mode);
    setDatePickerVisibility(true);
  }, []);

  const hideDatePicker = useCallback(() => {
    setDatePickerVisibility(false);
  }, []);

  const handleConfirm = useCallback(
    (time) => {
      const newTime = time.toISOString();
      const newTimeMinutes = getTimeOnly(time);
      
      if (pickerMode === PICKER_MODE.START) {
        const endTimeMinutes = endTime ? getTimeOnly(new Date(endTime)) : null;
        if (endTime && newTimeMinutes >= endTimeMinutes) {
          Alert.alert("Invalid Time", "Start time must be before end time.");
          hideDatePicker();
          return;
        }
        setStartTime(newTime);
        setSelectedStartTime(formatTime(newTime));
      } else {
        const startTimeMinutes = startTime ? getTimeOnly(new Date(startTime)) : null;
        if (startTime && newTimeMinutes <= startTimeMinutes) {
          Alert.alert("Invalid Time", "End time must be after start time.");
          hideDatePicker();
          return;
        }
        setEndTime(newTime);
        setSelectedEndTime(formatTime(newTime));
      }
      hideDatePicker();
    },
    [pickerMode, startTime, endTime, setSelectedStartTime, setSelectedEndTime, hideDatePicker]
  );

  const clearTimes = useCallback(() => {
    setStartTime(null);
    setEndTime(null);
    setSelectedStartTime(null);
    setSelectedEndTime(null);
  }, [setSelectedStartTime, setSelectedEndTime]);

  return (
    <View style={styles.container}>
      <View style={styles.buttonContainer}>
        <Button
          title="Pick Start Time"
          onPress={() => showDatePicker(PICKER_MODE.START)}
          accessibilityLabel="Pick start time"
          color={color.green}
        />
        <Button
          title="Pick End Time"
          onPress={() => showDatePicker(PICKER_MODE.END)}
          accessibilityLabel="Pick end time"
          color={color.green}
        />
      </View>
      <View style={{flexDirection:'row',justifyContent:'space-between',gap:8}}>
        <Text style={styles.text}>Start Time: {selectedStartTime}</Text>
        <Text style={styles.text}>End Time: {selectedEndTime}</Text>
      </View>
      <Button
        title="Clear Times"
        onPress={clearTimes}
        accessibilityLabel="Clear selected times"
        color={color.gray}
      />
      <DateTimePickerModal
        isVisible={isDatePickerVisible}
        mode="time"
        onConfirm={handleConfirm}
        onCancel={hideDatePicker}
        is24Hour={true}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
    
  },
  buttonContainer: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 4,
  },
  text: {
    marginVertical: 10,
    fontSize: 14,
    fontWeight:'500'
  },
});

export default TimeExample;