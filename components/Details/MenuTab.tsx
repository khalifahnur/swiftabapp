import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import { ScrollView, View } from "react-native";

import { Chip, EmptyState, Picture, Skeleton } from "@/components/ui/Bits";
import { Txt } from "@/components/ui/Txt";
import { palette, radius } from "@/constants/theme";
import { useMenuSections } from "@/hooks/queries";
import { formatKes } from "@/lib/format";
import type { MenuItem } from "@/types";

export function DishRow({ item, right }: { item: MenuItem; right?: React.ReactNode }) {
  const unavailable = item.available === false;
  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        padding: 10,
        borderRadius: radius.lg,
        borderWidth: 1,
        borderColor: palette.line,
        backgroundColor: palette.surface,
        opacity: unavailable ? 0.55 : 1,
      }}
    >
      <Picture uri={item.image} icon="fast-food-outline" style={{ width: 76, height: 76, borderRadius: 14 }} />
      <View style={{ flex: 1, marginLeft: 12 }}>
        <Txt w="bold" size={14.5} numberOfLines={1}>
          {item.name}
        </Txt>
        {item.description ? (
          <Txt size={12.5} color={palette.muted} numberOfLines={2} style={{ marginTop: 2 }}>
            {item.description}
          </Txt>
        ) : null}
        <View style={{ flexDirection: "row", alignItems: "center", flexWrap: "wrap", gap: 8, marginTop: 6 }}>
          <Txt w="bold" size={14} color={palette.brandDark}>
            {formatKes(item.cost)}
          </Txt>
          {unavailable ? (
            <Txt w="semibold" size={11.5} color={palette.danger}>
              Sold out
            </Txt>
          ) : item.prepTime ? (
            <View style={{ flexDirection: "row", alignItems: "center", gap: 3 }}>
              <Ionicons name="time-outline" size={12} color={palette.muted} />
              <Txt size={11.5} color={palette.muted}>
                {item.prepTime} min
              </Txt>
            </View>
          ) : null}
          {item.tags?.slice(0, 2).map((tag) => (
            <View key={tag} style={{ paddingHorizontal: 7, paddingVertical: 2, borderRadius: 999, backgroundColor: palette.brandTint }}>
              <Txt w="medium" size={10.5} color={palette.brandDark} style={{ lineHeight: 14 }}>
                {tag}
              </Txt>
            </View>
          ))}
        </View>
      </View>
      {right}
    </View>
  );
}

/** The restaurant's menu, one category at a time. */
export default function MenuTab({ restaurantId }: { restaurantId: string }) {
  const { data: sections, isLoading } = useMenuSections(restaurantId);
  const [active, setActive] = useState<string | null>(null);

  if (isLoading) {
    return (
      <View style={{ gap: 12 }}>
        <Skeleton height={96} />
        <Skeleton height={96} />
        <Skeleton height={96} />
      </View>
    );
  }

  const filled = (sections ?? []).filter((s) => s.items.length > 0);
  if (filled.length === 0) {
    return <EmptyState icon="restaurant-outline" title="Menu coming soon" message="This restaurant has not published its dishes yet." />;
  }
  const current = filled.find((s) => s.key === active) ?? filled[0];

  return (
    <View>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8, paddingBottom: 14 }}>
        {filled.map((section) => (
          <Chip
            key={section.key}
            label={`${section.label} · ${section.items.length}`}
            selected={section.key === current.key}
            onPress={() => setActive(section.key)}
          />
        ))}
      </ScrollView>
      <View style={{ gap: 10 }}>
        {current.items.map((item) => (
          <DishRow key={item._id} item={item} />
        ))}
      </View>
      <View style={{ flexDirection: "row", gap: 8, alignItems: "center", marginTop: 16, padding: 12, borderRadius: radius.md, backgroundColor: palette.brandTint }}>
        <Ionicons name="information-circle-outline" size={18} color={palette.brandDark} />
        <Txt size={12.5} color={palette.brandDark} style={{ flex: 1 }}>
          Book a table first, then order ahead from your booking so food is ready when you sit down.
        </Txt>
      </View>
    </View>
  );
}
