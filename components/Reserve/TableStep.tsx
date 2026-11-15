import { Ionicons } from "@expo/vector-icons";
import React, { useEffect, useMemo, useState } from "react";
import { Pressable, ScrollView, View } from "react-native";

import { errorMessage } from "@/api/client";
import { Chip, EmptyState, ErrorState, Skeleton } from "@/components/ui/Bits";
import { tapFeedback } from "@/components/ui/Button";
import { Txt } from "@/components/ui/Txt";
import { palette, radius } from "@/constants/theme";
import { useAvailability, useLayout } from "@/hooks/queries";
import { callNumber } from "@/lib/links";
import { useBooking } from "@/store/useBooking";
import type { FloorTable, Restaurant } from "@/types";

import FloorPlan, { Legend, TableState } from "./FloorPlan";

/** Step two of booking: the restaurant's floors, with every table and its chairs. */
export default function TableStep({
  restaurant,
  bookingFor,
  endTime,
}: {
  restaurant: Restaurant;
  bookingFor: string;
  endTime: string;
}) {
  const { guests, tableName, set } = useBooking();
  const layout = useLayout(restaurant.id);
  const availability = useAvailability(restaurant.id, bookingFor, endTime);
  const [floorId, setFloorId] = useState<string | null>(null);

  const floors = useMemo(() => {
    const tables = layout.data?.tables ?? [];
    const named = layout.data?.floors ?? [];
    // Tables may sit on a floor the list does not name; show those too.
    const extra = [...new Set(tables.map((t) => t.floorId))]
      .filter((id) => id && !named.some((f) => f.id === id))
      .map((id) => ({ id, name: `Floor ${id}` }));
    return [...named, ...extra].filter((f) => tables.some((t) => t.floorId === f.id));
  }, [layout.data]);

  const takenNames = useMemo(
    () => new Set((availability.data ?? []).filter((a) => !a.isAvailable).map((a) => a.tableNumber)),
    [availability.data],
  );

  const stateOf = (table: FloorTable): TableState => {
    if (takenNames.has(table.name)) return "taken";
    if (table.chairs.length > 0 && table.chairs.length < guests) return "small";
    return table.name === tableName ? "selected" : "available";
  };

  const tables = layout.data?.tables ?? [];
  const freeOn = (id: string) => tables.filter((t) => t.floorId === id && (stateOf(t) === "available" || stateOf(t) === "selected")).length;

  // Open on the floor holding the chosen table, else the first floor with room.
  const activeFloor =
    floors.find((f) => f.id === floorId) ??
    floors.find((f) => tables.some((t) => t.floorId === f.id && t.name === tableName)) ??
    floors.find((f) => freeOn(f.id) > 0) ??
    floors[0];

  // If the chosen table was taken by someone else in the meantime, let go of it.
  const chosen = tables.find((t) => t.name === tableName);
  const chosenState = chosen ? stateOf(chosen) : null;
  useEffect(() => {
    if (tableName && availability.data && (!chosen || chosenState === "taken" || chosenState === "small")) {
      set({ tableName: null, floorId: null, floorName: "" });
    }
  }, [tableName, availability.data, chosen, chosenState, set]);

  if (layout.isLoading || (availability.isLoading && !availability.data)) {
    return (
      <View style={{ gap: 14 }}>
        <Skeleton height={40} width="70%" round={20} />
        <Skeleton height={320} round={24} />
      </View>
    );
  }
  if (layout.isError) return <ErrorState message={errorMessage(layout.error)} onRetry={() => layout.refetch()} />;

  if (!activeFloor) {
    const phone = restaurant.about?.[0]?.phone;
    return (
      <EmptyState
        icon="grid-outline"
        title="No floor plan yet"
        message="This restaurant has not added its tables to Swiftab, so it cannot be booked in the app yet."
        action={
          phone ? (
            <Pressable
              accessibilityRole="button"
              onPress={() => callNumber(phone)}
              style={{ alignSelf: "center", height: 46, paddingHorizontal: 22, borderRadius: 23, backgroundColor: palette.pine, justifyContent: "center" }}
            >
              <Txt w="semibold" color={palette.white}>
                Call the restaurant
              </Txt>
            </Pressable>
          ) : undefined
        }
      />
    );
  }

  const floorTables = tables.filter((t) => t.floorId === activeFloor.id);
  const pick = (table: FloorTable) => {
    tapFeedback();
    const same = table.name === tableName;
    set(same ? { tableName: null, floorId: null, floorName: "" } : { tableName: table.name, floorId: activeFloor.id, floorName: activeFloor.name });
  };
  const free = freeOn(activeFloor.id);

  return (
    <View>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8, paddingBottom: 14 }}>
        {floors.map((floor) => (
          <Chip
            key={floor.id}
            label={`${floor.name} · ${freeOn(floor.id)} free`}
            selected={floor.id === activeFloor.id}
            onPress={() => setFloorId(floor.id)}
          />
        ))}
      </ScrollView>

      <FloorPlan tables={floorTables} stateOf={stateOf} onSelect={pick} />

      <View style={{ marginTop: 14 }}>
        <Legend />
      </View>

      {availability.isError && (
        <View style={{ flexDirection: "row", gap: 8, alignItems: "center", marginTop: 14, padding: 12, borderRadius: radius.md, backgroundColor: palette.amberTint }}>
          <Ionicons name="warning-outline" size={18} color="#B26A00" />
          <Txt size={12.5} color="#7A4A00" style={{ flex: 1 }}>
            We could not check which tables are taken. You can still pick one; we will confirm when you book.
          </Txt>
        </View>
      )}

      <Txt w="bold" size={15} style={{ marginTop: 20, marginBottom: 10 }}>
        {free === 0 ? `No free tables on ${activeFloor.name} for ${guests}` : `Tables on ${activeFloor.name}`}
      </Txt>
      <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8 }}>
        {floorTables.map((table) => {
          const state = stateOf(table);
          const blocked = state === "taken" || state === "small";
          const selected = state === "selected";
          return (
            <Pressable
              key={table.id}
              testID={`pick-${table.name}`}
              accessibilityRole="button"
              accessibilityState={{ selected, disabled: blocked }}
              accessibilityLabel={`Table ${table.name}, ${table.chairs.length} seats, ${state === "taken" ? "booked" : state === "small" ? "too small" : "available"}`}
              disabled={blocked}
              onPress={() => pick(table)}
              style={{
                paddingHorizontal: 14,
                paddingVertical: 9,
                borderRadius: radius.md,
                backgroundColor: selected ? palette.pine : palette.surface,
                borderWidth: 1,
                borderColor: selected ? palette.pine : palette.line,
                opacity: blocked ? 0.5 : 1,
              }}
            >
              <Txt w="bold" size={13.5} color={selected ? palette.white : palette.ink}>
                {table.name}
              </Txt>
              <Txt size={11.5} color={selected ? "rgba(255,255,255,0.8)" : palette.muted}>
                {state === "taken" ? "Booked" : `${table.chairs.length} ${table.chairs.length === 1 ? "seat" : "seats"}`}
              </Txt>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}
