import React, { useMemo, useState } from "react";
import { LayoutChangeEvent, ScrollView, View } from "react-native";
import Svg, { Circle, G, Rect, Text as SvgText } from "react-native-svg";

import { IconButton } from "@/components/ui/Button";
import { Txt } from "@/components/ui/Txt";
import { fonts, palette } from "@/constants/theme";
import { floorBounds, seatPositions } from "@/lib/floor";
import type { FloorTable } from "@/types";

export type TableState = "available" | "selected" | "taken" | "small";

const LOOK: Record<TableState, { fill: string; stroke: string; chair: string; text: string; dashed?: boolean }> = {
  available: { fill: "#FFFFFF", stroke: palette.brand, chair: "#8FD0C8", text: palette.ink },
  selected: { fill: palette.pine, stroke: palette.pine, chair: palette.pine, text: "#FFFFFF" },
  taken: { fill: "#E9EEEC", stroke: "#D5DDDA", chair: "#D5DDDA", text: palette.faint },
  small: { fill: "#FFFFFF", stroke: "#C9D2CF", chair: "#DDE4E1", text: palette.faint, dashed: true },
};

/** Zoom steps. The first shows the whole floor; the others enlarge it and let it scroll. */
const ZOOMS = [1, 1.6, 2.4];
/** A small floor is not blown up beyond this. */
const MAX_FIT_SCALE = 0.95;

/**
 * Draws one floor of a restaurant: every table at the position, size and
 * angle the restaurant gave it, with one chair per seat. Tables are tappable.
 */
export default function FloorPlan({
  tables,
  stateOf,
  onSelect,
}: {
  tables: FloorTable[];
  stateOf: (table: FloorTable) => TableState;
  onSelect: (table: FloorTable) => void;
}) {
  const [frameWidth, setFrameWidth] = useState(0);
  const [zoom, setZoom] = useState(0);
  const bounds = useMemo(() => floorBounds(tables), [tables]);

  // Start with the whole floor in view, as the restaurant drew it.
  const fit = frameWidth > 0 ? Math.min(MAX_FIT_SCALE, frameWidth / bounds.width) : 0;
  const scale = fit * ZOOMS[zoom];
  const width = Math.max(frameWidth, bounds.width * scale);
  const height = bounds.height * scale;
  const seatTotal = tables.reduce((sum, t) => sum + t.chairs.length, 0);

  return (
    <View>
      <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 10 }}>
        <Txt size={12.5} color={palette.muted} style={{ flex: 1 }}>
          {tables.length} {tables.length === 1 ? "table" : "tables"} · {seatTotal} seats · tap a table to pick it
        </Txt>
        <View style={{ flexDirection: "row", gap: 8 }}>
          <IconButton icon="remove" label="Zoom out" size={34} bordered onPress={() => setZoom((z) => Math.max(0, z - 1))} />
          <IconButton icon="add" label="Zoom in" size={34} bordered onPress={() => setZoom((z) => Math.min(ZOOMS.length - 1, z + 1))} testID="zoom-in" />
        </View>
      </View>
    <View
      onLayout={(event: LayoutChangeEvent) => setFrameWidth(event.nativeEvent.layout.width)}
      style={{ borderRadius: 24, backgroundColor: "#EEF3F1", overflow: "hidden", borderWidth: 1, borderColor: palette.line }}
    >
      {frameWidth > 0 && (
        <ScrollView horizontal showsHorizontalScrollIndicator={false} bounces={false}>
          <ScrollView
            nestedScrollEnabled
            showsVerticalScrollIndicator={false}
            bounces={false}
            style={{ maxHeight: 440 }}
            contentContainerStyle={{ minHeight: Math.min(height, 440), justifyContent: "center" }}
          >
            <Svg
              width={width}
              height={height}
              viewBox={`${bounds.x - (width / scale - bounds.width) / 2} ${bounds.y} ${width / scale} ${bounds.height}`}
            >
              {tables.map((table) => {
                const state = stateOf(table);
                const look = LOOK[state];
                const { width: w, height: h } = table.size;
                const cx = w / 2;
                const cy = h / 2;
                const rotation = table.rotation ?? 0;
                const seats = table.chairs.length;
                // Aim for about 12px on screen, without outgrowing the table.
                const nameSize = Math.max(11, Math.min(12.5 / scale, Math.min(w, h) * 0.36));
                const captionSize = Math.max(9, Math.min(10 / scale, h * 0.2));
                const caption = state === "taken" ? "Booked" : `${seats} ${seats === 1 ? "seat" : "seats"}`;
                // Only where the caption fits inside the table, both ways.
                const roomForCaption =
                  seats > 0 && h * scale >= 46 && h >= nameSize + captionSize + 12 && caption.length * captionSize * 0.56 <= w - 12;
                const press = state === "taken" || state === "small" ? undefined : () => onSelect(table);
                return (
                  <G
                    key={table.id}
                    testID={`table-${table.name}`}
                    onPress={press}
                    transform={`translate(${table.position.x + cx} ${table.position.y + cy}) rotate(${rotation}) translate(${-cx} ${-cy})`}
                  >
                    {seatPositions(table).map((seat, index) => (
                      <Rect
                        key={index}
                        x={-12}
                        y={-7}
                        width={24}
                        height={14}
                        rx={6}
                        fill={look.chair}
                        transform={`translate(${seat.x} ${seat.y}) rotate(${seat.rotation})`}
                      />
                    ))}
                    {table.shape === "round" ? (
                      <Circle
                        cx={cx}
                        cy={cy}
                        r={cx}
                        fill={look.fill}
                        stroke={look.stroke}
                        strokeWidth={state === "selected" ? 3 : 2}
                        strokeDasharray={look.dashed ? "6 5" : undefined}
                      />
                    ) : (
                      <Rect
                        width={w}
                        height={h}
                        rx={12}
                        fill={look.fill}
                        stroke={look.stroke}
                        strokeWidth={state === "selected" ? 3 : 2}
                        strokeDasharray={look.dashed ? "6 5" : undefined}
                      />
                    )}
                    {/* Labels stay upright however the table is turned. */}
                    <G transform={`translate(${cx} ${cy}) rotate(${-rotation})`}>
                      <SvgText
                        x={0}
                        y={roomForCaption ? -2 : nameSize * 0.36}
                        textAnchor="middle"
                        fontFamily={fonts.bold}
                        fontSize={nameSize}
                        fill={look.text}
                      >
                        {table.name}
                      </SvgText>
                      {roomForCaption && (
                        <SvgText
                          x={0}
                          y={captionSize + 3}
                          textAnchor="middle"
                          fontFamily={fonts.medium}
                          fontSize={captionSize}
                          fill={look.text}
                          opacity={0.75}
                        >
                          {caption}
                        </SvgText>
                      )}
                    </G>
                  </G>
                );
              })}
            </Svg>
          </ScrollView>
        </ScrollView>
      )}

    </View>
    </View>
  );
}

export function Legend() {
  const items: { state: TableState; label: string }[] = [
    { state: "available", label: "Available" },
    { state: "selected", label: "Your pick" },
    { state: "taken", label: "Booked" },
    { state: "small", label: "Too small" },
  ];
  return (
    <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 14 }}>
      {items.map(({ state, label }) => (
        <View key={state} style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
          <View
            style={{
              width: 16,
              height: 16,
              borderRadius: 5,
              backgroundColor: LOOK[state].fill,
              borderWidth: 2,
              borderColor: LOOK[state].stroke,
              borderStyle: LOOK[state].dashed ? "dashed" : "solid",
            }}
          />
          <SmallLabel>{label}</SmallLabel>
        </View>
      ))}
    </View>
  );
}

function SmallLabel({ children }: { children: React.ReactNode }) {
  return (
    <Txt w="medium" size={12} color={palette.body}>
      {children}
    </Txt>
  );
}
