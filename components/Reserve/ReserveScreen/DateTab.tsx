import { color } from "@/constants/Colors";
import useStore from "@/store/useStore";
import moment from "moment";
import React from "react";
import { StyleSheet, Text } from "react-native";
import { Calendar } from "react-native-calendars";
import GuestTab from "./GuestTab";
import TimeTab from "./TimeTab";

export default function DateTab() {
  const { selectedDate, setSelectedDate } = useStore();
  const now = moment().format("YYYY-MM-DD");
  const nextthirtydays = moment().add(10, "days").format("YYYY-MM-DD");

  const handleDayPress = (day: { dateString: string }) => {
    setSelectedDate(day.dateString);
  };

  return (
    <>
      <Text style={styles.title}>Select Date</Text>
      <Calendar
        onDayPress={handleDayPress}
        disableArrowLeft={true}
        minDate={now}
        maxDate={nextthirtydays}
        theme={{
          backgroundColor: "#ffffff",
          calendarBackground: color.green,
          textSectionTitleColor: "#b6c1cd",
          selectedDayBackgroundColor: color.black,
          selectedDayTextColor: "#ffffff",
          todayTextColor: "#00adf5",
          dayTextColor: "#2d4150",
          textDisabledColor: color.graywhite,
        }}
        markedDates={{
          [selectedDate]: {
            selected: true,
            disableTouchEvent: true,
            selectedDotColor: "orange",
          },
        }}
        style={{
        borderRadius: 15,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
      }}
      />
      <TimeTab />
      <GuestTab />
    </>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 10,
  },
});
