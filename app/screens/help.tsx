import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import { Linking, Pressable, ScrollView, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { ScreenHeader } from "@/components/ui/Bits";
import { tapFeedback } from "@/components/ui/Button";
import { Txt } from "@/components/ui/Txt";
import { palette, radius } from "@/constants/theme";
import { sendEmail } from "@/lib/links";

const FAQS = [
  {
    q: "How do I book a table?",
    a: "Open a restaurant and tap Book a Table. Choose the day, time and number of guests, then pick your table on the floor plan and confirm.",
  },
  {
    q: "Can I choose exactly where I sit?",
    a: "Yes. The floor plan shows every table with its chairs, floor by floor. Tables that are already booked for your time, or too small for your group, are greyed out.",
  },
  {
    q: "How do I cancel a booking?",
    a: "Go to Bookings, find the booking under Upcoming and tap Cancel. You can cancel any time before the restaurant seats you.",
  },
  {
    q: "How does ordering ahead work?",
    a: "From an upcoming booking tap Order ahead, add dishes to your cart and place the order. The kitchen receives it for your table, and you can follow it under My orders.",
  },
  {
    q: "How do I pay?",
    a: "When your food has been served, open the order and tap Request the bill. Choose M-Pesa, card or cash and your waiter completes the payment at the table.",
  },
  {
    q: "I am not getting notifications",
    a: "Check that notifications are allowed for Swiftab in your phone settings, then switch on Order and booking updates under Profile. Reminders for a booking can be turned on from the booking itself.",
  },
  {
    q: "How do I save a restaurant for later?",
    a: "Tap the heart on any restaurant. Saved places are listed under the Saved tab.",
  },
];

const CONTACTS: { icon: keyof typeof Ionicons.glyphMap; title: string; detail: string; open: () => void }[] = [
  { icon: "mail-outline", title: "Email support", detail: "support@swiftab.co.ke", open: () => sendEmail("support@swiftab.co.ke") },
  { icon: "globe-outline", title: "Website", detail: "www.swiftab.co.ke", open: () => Linking.openURL("https://www.swiftab.co.ke/").catch(() => undefined) },
];

export default function HelpScreen() {
  const insets = useSafeAreaInsets();
  const [open, setOpen] = useState<number | null>(0);

  return (
    <View style={{ flex: 1, backgroundColor: palette.canvas }}>
      <ScreenHeader title="Help centre" />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: insets.bottom + 32 }}>
        <Txt w="bold" size={17} style={{ marginBottom: 12 }}>
          Common questions
        </Txt>
        <View style={{ backgroundColor: palette.surface, borderRadius: radius.lg, borderWidth: 1, borderColor: palette.line, paddingHorizontal: 14 }}>
          {FAQS.map((faq, index) => {
            const expanded = open === index;
            return (
              <Pressable
                key={faq.q}
                accessibilityRole="button"
                accessibilityState={{ expanded }}
                onPress={() => {
                  tapFeedback();
                  setOpen(expanded ? null : index);
                }}
                style={{ paddingVertical: 14, borderTopWidth: index === 0 ? 0 : 1, borderColor: palette.line }}
              >
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  <Txt w="semibold" size={14.5} style={{ flex: 1, paddingRight: 10 }}>
                    {faq.q}
                  </Txt>
                  <Ionicons name={expanded ? "chevron-up" : "chevron-down"} size={18} color={palette.muted} />
                </View>
                {expanded && (
                  <Txt size={13.5} color={palette.body} style={{ marginTop: 8, lineHeight: 20 }}>
                    {faq.a}
                  </Txt>
                )}
              </Pressable>
            );
          })}
        </View>

        <Txt w="bold" size={17} style={{ marginTop: 26, marginBottom: 12 }}>
          Contact us
        </Txt>
        <View style={{ gap: 10 }}>
          {CONTACTS.map((contact) => (
            <Pressable
              key={contact.title}
              accessibilityRole="button"
              accessibilityLabel={`${contact.title}: ${contact.detail}`}
              onPress={contact.open}
              style={{ flexDirection: "row", alignItems: "center", padding: 14, borderRadius: radius.lg, backgroundColor: palette.surface, borderWidth: 1, borderColor: palette.line }}
            >
              <View style={{ width: 42, height: 42, borderRadius: 21, backgroundColor: palette.brandTint, alignItems: "center", justifyContent: "center" }}>
                <Ionicons name={contact.icon} size={19} color={palette.pine} />
              </View>
              <View style={{ flex: 1, marginLeft: 12 }}>
                <Txt w="semibold" size={14.5}>
                  {contact.title}
                </Txt>
                <Txt size={13} color={palette.muted}>
                  {contact.detail}
                </Txt>
              </View>
              <Ionicons name="open-outline" size={17} color={palette.faint} />
            </Pressable>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}
