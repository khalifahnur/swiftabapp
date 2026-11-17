import { pushOnce } from "@/lib/nav";
import { Icon, type IconName } from "@/components/ui/Icon";
import { useFocusEffect, useRouter } from "expo-router";
import moment from "moment";
import React, { useCallback } from "react";
import { FlatList, Pressable, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { EmptyState, ScreenHeader } from "@/components/ui/Bits";
import { Txt } from "@/components/ui/Txt";
import { palette, radius } from "@/constants/theme";
import { InboxItem, useInbox } from "@/store/useInbox";

const ICONS: Record<string, { icon: IconName; fg: string; bg: string }> = {
  order: { icon: "receipt-outline", fg: palette.info, bg: palette.infoTint },
  reservation: { icon: "calendar-outline", fg: palette.brandDark, bg: palette.brandTint },
  reminder: { icon: "alarm-outline", fg: "#B26A00", bg: palette.amberTint },
};
const FALLBACK = { icon: "notifications-outline" as const, fg: palette.body, bg: palette.line };

/** Everything the app has told the diner, newest first. */
export default function NotificationsScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { items, markAllRead, clear } = useInbox();

  // Opening the inbox counts as reading it; leave the dots visible until the screen is left.
  useFocusEffect(
    useCallback(() => {
      return () => markAllRead();
    }, [markAllRead]),
  );

  const open = (item: InboxItem) => {
    if (item.kind === "order" && item.orderId) pushOnce(router, { pathname: "/screens/order", params: { id: item.orderId } });
    else if (item.kind === "order") pushOnce(router, "/Order");
    else if (item.kind === "reservation" || item.kind === "reminder") router.navigate("/(tabs)/bookings");
  };

  return (
    <View style={{ flex: 1, backgroundColor: palette.canvas }}>
      <ScreenHeader
        title="Notifications"
        right={
          items.length ? (
            <Pressable accessibilityRole="button" accessibilityLabel="Clear all notifications" hitSlop={8} onPress={clear}>
              <Txt w="semibold" size={13} color={palette.brandDark}>
                Clear
              </Txt>
            </Pressable>
          ) : undefined
        }
      />
      <FlatList
        data={items}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: insets.bottom + 32, gap: 10, flexGrow: 1 }}
        renderItem={({ item }) => {
          const look = ICONS[item.kind] ?? FALLBACK;
          return (
            <Pressable
              accessibilityRole="button"
              accessibilityLabel={`${item.title}. ${item.body}`}
              onPress={() => open(item)}
              style={{
                flexDirection: "row",
                padding: 14,
                borderRadius: radius.lg,
                backgroundColor: palette.surface,
                borderWidth: 1,
                borderColor: item.read ? palette.line : palette.brand,
              }}
            >
              <View style={{ width: 42, height: 42, borderRadius: 21, backgroundColor: look.bg, alignItems: "center", justifyContent: "center" }}>
                <Icon name={look.icon} size={19} color={look.fg} />
              </View>
              <View style={{ flex: 1, marginLeft: 12 }}>
                <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
                  <Txt w="bold" size={14.5} style={{ flex: 1 }} numberOfLines={1}>
                    {item.title}
                  </Txt>
                  {!item.read && <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: palette.brand }} />}
                </View>
                <Txt size={13} color={palette.body} style={{ marginTop: 2 }}>
                  {item.body}
                </Txt>
                <Txt size={11.5} color={palette.muted} style={{ marginTop: 5 }}>
                  {moment(item.at).fromNow()}
                </Txt>
              </View>
            </Pressable>
          );
        }}
        ListEmptyComponent={
          <EmptyState
            icon="notifications-outline"
            title="You are all caught up"
            message="Booking confirmations, reminders and order updates will appear here."
          />
        }
      />
    </View>
  );
}
