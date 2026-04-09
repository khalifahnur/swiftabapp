import useStore from "@/store/useStore";
import moment from "moment";
import React from "react";
import { Text, View } from "react-native";
import { Calendar } from "react-native-calendars";

import GuestTab from "./GuestTab";
import TimeExample from "./TimeExample";

export default function DateTab() {
  const { selectedDate, setSelectedDate } = useStore();
  const now = moment().format("YYYY-MM-DD");
  const nextThirtyDays = moment().add(30, "days").format("YYYY-MM-DD");

  return (
    <View className="px-6">
      <View className="bg-white rounded-3xl p-5 shadow-sm border border-gray-100 mb-6">
        <Text className="text-lg font-bold text-gray-900 mb-4">
          Select Date
        </Text>
        <Calendar
          onDayPress={(day: any) => setSelectedDate(day.dateString)}
          minDate={now}
          maxDate={nextThirtyDays}
          theme={{
            backgroundColor: "#ffffff",
            calendarBackground: "#ffffff",
            textSectionTitleColor: "#9CA3AF",
            selectedDayBackgroundColor: "#0d9488", // teal-600
            selectedDayTextColor: "#ffffff",
            todayTextColor: "#0d9488",
            dayTextColor: "#111827",
            textDisabledColor: "#E5E7EB",
            arrowColor: "#0d9488",
            monthTextColor: "#111827",
            textMonthFontWeight: "bold",
          }}
          markedDates={{
            [selectedDate]: {
              selected: true,
              disableTouchEvent: true,
            },
          }}
        />
      </View>

      <TimeExample />
      <GuestTab />
    </View>
  );
}
