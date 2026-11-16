import React, { useEffect, useState } from "react";
import { Switch, View } from "react-native";

import { Chip } from "@/components/ui/Bits";
import { Button } from "@/components/ui/Button";
import { Sheet } from "@/components/ui/Sheet";
import { Txt } from "@/components/ui/Txt";
import { palette } from "@/constants/theme";
import { Filters, NO_FILTERS, SortKey } from "@/lib/filters";

const SORTS: { key: SortKey; label: string }[] = [
  { key: "recommended", label: "Recommended" },
  { key: "distance", label: "Nearest" },
  { key: "rating", label: "Top rated" },
  { key: "price", label: "Lowest price" },
];
const RATINGS = [0, 3.5, 4, 4.5];
const PRICES = ["$", "$$", "$$$", "$$$$"];

function Group({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <View style={{ marginBottom: 20 }}>
      <Txt w="bold" size={14} style={{ marginBottom: 10 }}>
        {title}
      </Txt>
      <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8 }}>{children}</View>
    </View>
  );
}

function Toggle({ label, hint, value, onChange }: { label: string; hint: string; value: boolean; onChange: (v: boolean) => void }) {
  return (
    <View style={{ flexDirection: "row", alignItems: "center", paddingVertical: 10 }}>
      <View style={{ flex: 1, paddingRight: 12 }}>
        <Txt w="semibold" size={14.5}>
          {label}
        </Txt>
        <Txt size={12.5} color={palette.muted}>
          {hint}
        </Txt>
      </View>
      <Switch value={value} onValueChange={onChange} trackColor={{ false: palette.line, true: palette.brand }} thumbColor={palette.white} />
    </View>
  );
}

export default function FilterSheet({
  visible,
  value,
  amenities,
  onApply,
  onClose,
}: {
  visible: boolean;
  value: Filters;
  /** Amenities offered by at least one restaurant. */
  amenities: string[];
  onApply: (filters: Filters) => void;
  onClose: () => void;
}) {
  const [draft, setDraft] = useState(value);
  useEffect(() => {
    if (visible) setDraft(value);
  }, [visible, value]);

  const toggleIn = (list: string[], item: string) => (list.includes(item) ? list.filter((i) => i !== item) : [...list, item]);

  return (
    <Sheet
      visible={visible}
      onClose={onClose}
      title="Filters"
      subtitle="Narrow the list to places that suit you."
      footer={
        <View style={{ flexDirection: "row", gap: 10 }}>
          <Button label="Reset" variant="outline" style={{ flex: 1 }} onPress={() => setDraft(NO_FILTERS)} />
          <Button
            label="Show results"
            style={{ flex: 1.6 }}
            onPress={() => {
              onApply(draft);
              onClose();
            }}
            testID="filters-apply"
          />
        </View>
      }
    >
      <Group title="Sort by">
        {SORTS.map((sort) => (
          <Chip key={sort.key} label={sort.label} selected={draft.sort === sort.key} onPress={() => setDraft({ ...draft, sort: sort.key })} />
        ))}
      </Group>

      <View style={{ marginBottom: 12, borderTopWidth: 1, borderBottomWidth: 1, borderColor: palette.line, paddingVertical: 4 }}>
        <Toggle label="Open now" hint="Hide places that are closed" value={draft.openNow} onChange={(openNow) => setDraft({ ...draft, openNow })} />
        <Toggle
          label="Taking reservations"
          hint="Only places you can book in the app"
          value={draft.bookable}
          onChange={(bookable) => setDraft({ ...draft, bookable })}
        />
      </View>

      <Group title="Rating">
        {RATINGS.map((rating) => (
          <Chip
            key={rating}
            label={rating === 0 ? "Any" : `${rating}+`}
            icon={rating === 0 ? undefined : "star"}
            selected={draft.minRating === rating}
            onPress={() => setDraft({ ...draft, minRating: rating })}
          />
        ))}
      </Group>

      <Group title="Price per person">
        {PRICES.map((price) => (
          <Chip key={price} label={price} selected={draft.prices.includes(price)} onPress={() => setDraft({ ...draft, prices: toggleIn(draft.prices, price) })} />
        ))}
      </Group>

      {amenities.length > 0 && (
        <Group title="Good to have">
          {amenities.map((amenity) => (
            <Chip
              key={amenity}
              label={amenity}
              selected={draft.amenities.includes(amenity)}
              onPress={() => setDraft({ ...draft, amenities: toggleIn(draft.amenities, amenity) })}
            />
          ))}
        </Group>
      )}
    </Sheet>
  );
}
