import { Ionicons } from "@expo/vector-icons";
import moment from "moment";
import React, { useEffect, useMemo } from "react";
import { Pressable, View } from "react-native";
import { Calendar } from "react-native-calendars";

import { Card, Chip, Stepper } from "@/components/ui/Bits";
import { tapFeedback } from "@/components/ui/Button";
import { Txt } from "@/components/ui/Txt";
import { fonts, palette, radius } from "@/constants/theme";
import { hoursOnDate } from "@/lib/restaurant";
import { DURATIONS, partOfDay, slotsFor } from "@/lib/slots";
import { nowInBusinessTz, prettyClock } from "@/lib/time";
import { useBooking } from "@/store/useBooking";
import type { Restaurant } from "@/types";

const DAY_INDEX: Record<string, number> = { Sunday: 0, Monday: 1, Tuesday: 2, Wednesday: 3, Thursday: 4, Friday: 5, Saturday: 6 };
const BOOK_AHEAD_DAYS = 60;
const MAX_GUESTS = 20;

function Heading({ icon, title, value }: { icon: keyof typeof Ionicons.glyphMap; title: string; value?: string }) {
  return (
    <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 14 }}>
      <View style={{ width: 34, height: 34, borderRadius: 17, backgroundColor: palette.brandTint, alignItems: "center", justifyContent: "center" }}>
        <Ionicons name={icon} size={17} color={palette.pine} />
      </View>
      <Txt w="bold" size={16} style={{ marginLeft: 10, flex: 1 }}>
        {title}
      </Txt>
      {value ? (
        <Txt w="semibold" size={13.5} color={palette.brandDark}>
          {value}
        </Txt>
      ) : null}
    </View>
  );
}

/** Step one of booking: the day, the time, how long and how many people. */
export default function WhenStep({ restaurant }: { restaurant: Restaurant }) {
  const { date, startTime, durationMinutes, guests, set } = useBooking();

  const today = nowInBusinessTz().format("YYYY-MM-DD");
  const lastDay = nowInBusinessTz().add(BOOK_AHEAD_DAYS, "days").format("YYYY-MM-DD");
  const published = Boolean(restaurant.openingHours?.some((h) => h.open));
  const closedWeekdays = useMemo(
    () => (published ? (restaurant.openingHours ?? []).filter((h) => !h.open).map((h) => DAY_INDEX[h.day]).filter((d) => d !== undefined) : []),
    [published, restaurant.openingHours],
  );

  const dayHours = date ? hoursOnDate(restaurant.openingHours, date) : undefined;
  const slots = useMemo(() => slotsFor(date, dayHours, published), [date, dayHours, published]);

  // A time that is no longer offered (the day changed, or it has passed) is dropped.
  useEffect(() => {
    if (startTime && !slots.includes(startTime)) set({ startTime: "", tableName: null, floorId: null, floorName: "" });
  }, [slots, startTime, set]);

  const groups = (["Morning", "Afternoon", "Evening"] as const)
    .map((part) => ({ part, times: slots.filter((s) => partOfDay(s) === part) }))
    .filter((g) => g.times.length > 0);

  return (
    <View style={{ gap: 16 }}>
      <Card>
        <Heading icon="calendar-outline" title="Pick a day" value={date ? moment(date, "YYYY-MM-DD").format("ddd, D MMM") : undefined} />
        <Calendar
          testID="booking-calendar"
          current={date || today}
          minDate={today}
          maxDate={lastDay}
          firstDay={1}
          enableSwipeMonths
          hideExtraDays
          disabledByWeekDays={closedWeekdays}
          disableAllTouchEventsForDisabledDays
          onDayPress={(day) => {
            tapFeedback();
            set({ date: day.dateString, tableName: null, floorId: null, floorName: "" });
          }}
          markedDates={date ? { [date]: { selected: true, disableTouchEvent: true } } : {}}
          renderArrow={(direction) => (
            <View style={{ width: 34, height: 34, borderRadius: 17, borderWidth: 1, borderColor: palette.line, alignItems: "center", justifyContent: "center" }}>
              <Ionicons name={direction === "left" ? "chevron-back" : "chevron-forward"} size={16} color={palette.ink} />
            </View>
          )}
          theme={{
            calendarBackground: "transparent",
            textSectionTitleColor: palette.muted,
            selectedDayBackgroundColor: palette.pine,
            selectedDayTextColor: palette.white,
            todayTextColor: palette.brand,
            dayTextColor: palette.ink,
            textDisabledColor: "#C9D2CF",
            monthTextColor: palette.ink,
            textDayFontFamily: fonts.medium,
            textMonthFontFamily: fonts.bold,
            textDayHeaderFontFamily: fonts.semibold,
            textDayFontSize: 14.5,
            textMonthFontSize: 16,
            textDayHeaderFontSize: 12,
          }}
        />
      </Card>

      <Card>
        <Heading icon="time-outline" title="Pick a time" value={startTime ? prettyClock(startTime) : undefined} />
        {!date ? (
          <Txt size={13.5} color={palette.muted}>
            Choose a day first to see the times on offer.
          </Txt>
        ) : slots.length === 0 ? (
          <Txt size={13.5} color={palette.muted}>
            {published && !dayHours?.open ? "The restaurant is closed on this day." : "No more seatings on this day. Try another date."}
          </Txt>
        ) : (
          <View style={{ gap: 14 }}>
            {groups.map(({ part, times }) => (
              <View key={part}>
                <Txt w="semibold" size={12} color={palette.muted} style={{ marginBottom: 8, textTransform: "uppercase", letterSpacing: 0.6 }}>
                  {part}
                </Txt>
                <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8 }}>
                  {times.map((time) => {
                    const active = time === startTime;
                    return (
                      <Pressable
                        key={time}
                        testID={`slot-${time}`}
                        accessibilityRole="button"
                        accessibilityState={{ selected: active }}
                        accessibilityLabel={prettyClock(time)}
                        onPress={() => {
                          tapFeedback();
                          set({ startTime: time, tableName: null, floorId: null, floorName: "" });
                        }}
                        style={{
                          minWidth: 84,
                          height: 42,
                          paddingHorizontal: 12,
                          borderRadius: radius.md,
                          alignItems: "center",
                          justifyContent: "center",
                          backgroundColor: active ? palette.pine : palette.canvas,
                          borderWidth: 1,
                          borderColor: active ? palette.pine : palette.line,
                        }}
                      >
                        <Txt w="semibold" size={13.5} color={active ? palette.white : palette.ink}>
                          {prettyClock(time)}
                        </Txt>
                      </Pressable>
                    );
                  })}
                </View>
              </View>
            ))}
          </View>
        )}
      </Card>

      <Card>
        <Heading icon="hourglass-outline" title="How long?" />
        <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8 }}>
          {DURATIONS.map((option) => (
            <Chip
              key={option.minutes}
              label={option.label}
              selected={durationMinutes === option.minutes}
              onPress={() => set({ durationMinutes: option.minutes, tableName: null, floorId: null, floorName: "" })}
            />
          ))}
        </View>
      </Card>

      <Card>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <View style={{ width: 34, height: 34, borderRadius: 17, backgroundColor: palette.brandTint, alignItems: "center", justifyContent: "center" }}>
            <Ionicons name="people-outline" size={17} color={palette.pine} />
          </View>
          <View style={{ flex: 1, marginLeft: 10 }}>
            <Txt w="bold" size={16}>
              Guests
            </Txt>
            <Txt size={12.5} color={palette.muted}>
              Including you
            </Txt>
          </View>
          <Stepper
            value={guests}
            min={1}
            max={MAX_GUESTS}
            onMinus={() => set({ guests: Math.max(1, guests - 1), tableName: null, floorId: null, floorName: "" })}
            onPlus={() => set({ guests: Math.min(MAX_GUESTS, guests + 1), tableName: null, floorId: null, floorName: "" })}
          />
        </View>
      </Card>
    </View>
  );
}
