import useStore from "@/store/useStore";
import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import { Alert, Text, TouchableOpacity, View } from "react-native";
import DateTimePickerModal from "react-native-modal-datetime-picker";

const PICKER_MODE = { START: "start", END: "end" };

const formatTime = (date: Date) => {
  const hours = date.getHours().toString().padStart(2, "0");
  const minutes = date.getMinutes().toString().padStart(2, "0");
  return `${hours}:${minutes}`;
};

export default function TimeExample() {
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [pickerMode, setPickerMode] = useState("");
  const [startObj, setStartObj] = useState<Date | null>(null);

  const {
    selectedStartTime,
    setSelectedStartTime,
    selectedEndTime,
    setSelectedEndTime,
  } = useStore();

  const showDatePicker = (mode: string) => {
    setPickerMode(mode);
    setDatePickerVisibility(true);
  };

  const handleConfirm = (time: Date) => {
    if (pickerMode === PICKER_MODE.START) {
      setStartObj(time);
      setSelectedStartTime(formatTime(time));
      // Auto-clear end time if it's invalid now
      setSelectedEndTime("");
    } else {
      if (startObj && time <= startObj) {
        Alert.alert("Invalid Time", "End time must be after start time.");
        setDatePickerVisibility(false);
        return;
      }
      setSelectedEndTime(formatTime(time));
    }
    setDatePickerVisibility(false);
  };

  return (
    <View className="bg-white rounded-3xl p-5 shadow-sm border border-gray-100 mb-6">
      <View className="flex-row justify-between items-center mb-4">
        <Text className="text-lg font-bold text-gray-900">Time</Text>
        {(selectedStartTime || selectedEndTime) && (
          <TouchableOpacity
            onPress={() => {
              setSelectedStartTime("");
              setSelectedEndTime("");
              setStartObj(null);
            }}
          >
            <Text className="text-teal-600 font-medium text-sm">Clear</Text>
          </TouchableOpacity>
        )}
      </View>

      <View className="flex-row gap-4">
        <TouchableOpacity
          className={`flex-1 flex-row items-center justify-between p-4 rounded-2xl border ${selectedStartTime ? "border-teal-600 bg-teal-50" : "border-gray-200 bg-gray-50"}`}
          onPress={() => showDatePicker(PICKER_MODE.START)}
        >
          <View>
            <Text className="text-xs font-medium text-gray-500 mb-1">
              Start Time
            </Text>
            <Text
              className={`font-bold ${selectedStartTime ? "text-teal-700" : "text-gray-900"}`}
            >
              {selectedStartTime || "--:--"}
            </Text>
          </View>
          <Ionicons
            name="time-outline"
            size={20}
            color={selectedStartTime ? "#0d9488" : "#9CA3AF"}
          />
        </TouchableOpacity>

        <TouchableOpacity
          className={`flex-1 flex-row items-center justify-between p-4 rounded-2xl border ${selectedEndTime ? "border-teal-600 bg-teal-50" : "border-gray-200 bg-gray-50"}`}
          onPress={() => showDatePicker(PICKER_MODE.END)}
        >
          <View>
            <Text className="text-xs font-medium text-gray-500 mb-1">
              End Time
            </Text>
            <Text
              className={`font-bold ${selectedEndTime ? "text-teal-700" : "text-gray-900"}`}
            >
              {selectedEndTime || "--:--"}
            </Text>
          </View>
          <Ionicons
            name="time-outline"
            size={20}
            color={selectedEndTime ? "#0d9488" : "#9CA3AF"}
          />
        </TouchableOpacity>
      </View>

      <DateTimePickerModal
        isVisible={isDatePickerVisible}
        mode="time"
        onConfirm={handleConfirm}
        onCancel={() => setDatePickerVisibility(false)}
      />
    </View>
  );
}
