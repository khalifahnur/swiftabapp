import { Icon, type IconName } from "@/components/ui/Icon";
import React, { useState } from "react";
import { Pressable, View } from "react-native";

import MiniMap from "@/components/Map/MiniMap";
import { tapFeedback } from "@/components/ui/Button";
import { Tap } from "@/components/ui/Tap";
import { Txt } from "@/components/ui/Txt";
import { palette, radius } from "@/constants/theme";
import { paymentLabel } from "@/lib/format";
import { callNumber, openDirections, sendEmail, shareRestaurant } from "@/lib/links";
import { hasCoordinates } from "@/lib/restaurant";
import { fromApi, nowInBusinessTz, prettyClock } from "@/lib/time";
import type { Promotion, Restaurant } from "@/types";

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <View style={{ marginTop: 24 }}>
      <Txt w="bold" size={16} style={{ marginBottom: 10 }}>
        {title}
      </Txt>
      {children}
    </View>
  );
}

function Action({ icon, label, onPress }: { icon: IconName; label: string; onPress: () => void }) {
  return (
    <Tap
      accessibilityRole="button"
      accessibilityLabel={label}
      onPress={() => {
        tapFeedback();
        onPress();
      }}
      pressedStyle={{ opacity: 0.7 }}
      style={{ flex: 1, alignItems: "center" }}
    >
      <View style={{ width: 52, height: 52, borderRadius: 26, backgroundColor: palette.brandTint, alignItems: "center", justifyContent: "center" }}>
        <Icon name={icon} size={21} color={palette.pine} />
      </View>
      <Txt w="medium" size={12} color={palette.body} style={{ marginTop: 6 }}>
        {label}
      </Txt>
    </Tap>
  );
}

function Tags({ items }: { items: string[] }) {
  return (
    <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8 }}>
      {items.map((item) => (
        <View key={item} style={{ paddingHorizontal: 12, paddingVertical: 7, borderRadius: radius.pill, backgroundColor: palette.canvas, borderWidth: 1, borderColor: palette.line }}>
          <Txt w="medium" size={12.5} color={palette.body}>
            {item}
          </Txt>
        </View>
      ))}
    </View>
  );
}

export default function Overview({ restaurant, promotions }: { restaurant: Restaurant; promotions: Promotion[] }) {
  const [expanded, setExpanded] = useState(false);
  const about = restaurant.about?.[0];
  const description = about?.description?.trim() ?? "";
  const long = description.length > 190;
  const today = nowInBusinessTz().format("dddd");
  const hours = restaurant.openingHours?.some((h) => h.open) ? restaurant.openingHours : null;

  return (
    <View>
      {description ? (
        <View>
          <Txt size={14.5} color={palette.body} style={{ lineHeight: 22 }} numberOfLines={expanded || !long ? undefined : 4}>
            {description}
          </Txt>
          {long && (
            <Pressable accessibilityRole="button" hitSlop={8} onPress={() => setExpanded((v) => !v)} style={{ marginTop: 6 }}>
              <Txt w="semibold" size={13.5} color={palette.brandDark}>
                {expanded ? "Show less" : "Read more"}
              </Txt>
            </Pressable>
          )}
        </View>
      ) : null}

      <View style={{ flexDirection: "row", marginTop: 22 }}>
        {about?.phone ? <Action icon="call-outline" label="Call" onPress={() => callNumber(about.phone)} /> : null}
        <Action icon="navigate-outline" label="Directions" onPress={() => openDirections(restaurant)} />
        {about?.email ? <Action icon="mail-outline" label="Email" onPress={() => sendEmail(about.email)} /> : null}
        <Action icon="share-social-outline" label="Share" onPress={() => shareRestaurant(restaurant)} />
      </View>

      {promotions.length > 0 && (
        <Section title="Offers">
          <View style={{ gap: 10 }}>
            {promotions.map((promo) => (
              <View
                key={promo._id}
                style={{ flexDirection: "row", gap: 12, padding: 14, borderRadius: radius.lg, backgroundColor: palette.amberTint, alignItems: "center" }}
              >
                <View style={{ width: 42, height: 42, borderRadius: 21, backgroundColor: palette.amber, alignItems: "center", justifyContent: "center" }}>
                  <Icon name="pricetag" size={18} color={palette.ink} />
                </View>
                <View style={{ flex: 1 }}>
                  <Txt w="bold" size={14.5}>
                    {promo.discountPercentage ? `${Math.round(promo.discountPercentage)}% off · ` : ""}
                    {promo.title}
                  </Txt>
                  {promo.description ? (
                    <Txt size={12.5} color={palette.body} numberOfLines={2}>
                      {promo.description}
                    </Txt>
                  ) : null}
                  <Txt size={11.5} color={palette.muted} style={{ marginTop: 2 }}>
                    Until {fromApi(promo.endDate).format("D MMM YYYY")}
                    {promo.paymentMethod ? ` · Pay with ${paymentLabel(promo.paymentMethod)}` : ""}
                  </Txt>
                </View>
              </View>
            ))}
          </View>
        </Section>
      )}

      <Section title="Opening hours">
        {hours ? (
          <View style={{ borderRadius: radius.lg, borderWidth: 1, borderColor: palette.line, paddingHorizontal: 14, paddingVertical: 6 }}>
            {hours.map((day, i) => {
              const isToday = day.day === today;
              return (
                <View
                  key={day.day}
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    paddingVertical: 9,
                    borderTopWidth: i === 0 ? 0 : 1,
                    borderColor: palette.line,
                  }}
                >
                  <Txt w={isToday ? "bold" : "medium"} size={13.5} color={isToday ? palette.ink : palette.body}>
                    {day.day}
                    {isToday ? " · today" : ""}
                  </Txt>
                  <Txt w={isToday ? "bold" : "regular"} size={13.5} color={day.open ? (isToday ? palette.brandDark : palette.body) : palette.faint}>
                    {day.open ? `${prettyClock(day.from)} – ${prettyClock(day.to)}` : "Closed"}
                  </Txt>
                </View>
              );
            })}
          </View>
        ) : (
          <Txt size={14} color={palette.body}>
            {about?.hrsOfOperation || "Hours have not been published yet."}
          </Txt>
        )}
      </Section>

      {restaurant.amenities?.length ? (
        <Section title="Good to know">
          <Tags items={restaurant.amenities} />
        </Section>
      ) : null}

      {restaurant.paymentMethods?.length ? (
        <Section title="Ways to pay">
          <Tags items={restaurant.paymentMethods.map((m) => paymentLabel(m))} />
        </Section>
      ) : null}

      <Section title="Location">
        {hasCoordinates(restaurant) && (
          <MiniMap latitude={restaurant.latitude} longitude={restaurant.longitude} title={restaurant.restaurantName} />
        )}
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Get directions"
          onPress={() => openDirections(restaurant)}
          style={{ flexDirection: "row", alignItems: "center", gap: 10, marginTop: 12 }}
        >
          <Icon name="location-outline" size={18} color={palette.brand} />
          <Txt size={14} color={palette.body} style={{ flex: 1 }}>
            {restaurant.location}
          </Txt>
          <Txt w="semibold" size={13.5} color={palette.brandDark}>
            Directions
          </Txt>
        </Pressable>
      </Section>
    </View>
  );
}
