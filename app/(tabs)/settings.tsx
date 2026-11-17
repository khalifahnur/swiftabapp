import { pushOnce } from "@/lib/nav";
import { Icon, type IconName } from "@/components/ui/Icon";
import { useQueryClient } from "@tanstack/react-query";
import Constants from "expo-constants";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { Platform, Pressable, ScrollView, Switch, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { Chip } from "@/components/ui/Bits";
import { Tap } from "@/components/ui/Tap";
import { Button } from "@/components/ui/Button";
import { ConfirmDialog } from "@/components/ui/Sheet";
import { Txt } from "@/components/ui/Txt";
import { palette, radius, TAB_BAR_SPACE } from "@/constants/theme";
import { useOrders, useReservations } from "@/hooks/queries";
import { useAuthStore } from "@/lib/authStore";
import { initials } from "@/lib/format";
import { ensurePermission, registerForPush, unregisterPush } from "@/lib/notifications";
import { useToast } from "@/lib/ToastContext";
import { useCart } from "@/store/useCart";
import { useInbox } from "@/store/useInbox";
import { REMINDER_LEADS, usePrefs } from "@/store/usePrefs";
import { useWishlist } from "@/store/useWishlist";

function Row({
  icon,
  title,
  subtitle,
  onPress,
  right,
  last,
  testID,
}: {
  icon: IconName;
  title: string;
  subtitle?: string;
  onPress?: () => void;
  right?: React.ReactNode;
  last?: boolean;
  testID?: string;
}) {
  return (
    <Tap
      testID={testID}
      accessibilityRole={onPress ? "button" : undefined}
      accessibilityLabel={title}
      disabled={!onPress}
      onPress={onPress}
      pressedStyle={{ opacity: 0.6 }}
      style={{
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: 11,
        borderBottomWidth: last ? 0 : 1,
        borderColor: palette.line,
      }}
    >
      <View style={{ width: 36, height: 36, borderRadius: 11, backgroundColor: palette.brandTint, alignItems: "center", justifyContent: "center" }}>
        <Icon name={icon} size={17} color={palette.pine} />
      </View>
      <View style={{ flex: 1, marginHorizontal: 12 }}>
        <Txt w="semibold" size={14.5}>
          {title}
        </Txt>
        {subtitle ? (
          <Txt size={12.5} color={palette.muted}>
            {subtitle}
          </Txt>
        ) : null}
      </View>
      {right ?? (onPress ? <Icon name="chevron-forward" size={18} color={palette.faint} /> : null)}
    </Tap>
  );
}

function Group({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <View style={{ marginTop: 22 }}>
      <Txt w="bold" size={12} color={palette.muted} style={{ textTransform: "uppercase", letterSpacing: 0.7, marginBottom: 8, marginLeft: 4 }}>
        {title}
      </Txt>
      <View style={{ backgroundColor: palette.surface, borderRadius: radius.lg, paddingHorizontal: 14, borderWidth: 1, borderColor: palette.line }}>{children}</View>
    </View>
  );
}

function Stat({ value, label }: { value: number; label: string }) {
  return (
    <View style={{ flex: 1, alignItems: "center" }}>
      <Txt w="extrabold" size={20} color={palette.white}>
        {value}
      </Txt>
      <Txt size={12} color="rgba(255,255,255,0.72)">
        {label}
      </Txt>
    </View>
  );
}

export default function ProfileScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const client = useQueryClient();
  const { showToast } = useToast();
  const user = useAuthStore((s) => s.user);
  const logOut = useAuthStore((s) => s.logOut);
  const prefs = usePrefs();
  const savedCount = useWishlist((s) => s.saved.length);
  const upcoming = useReservations("active");
  const past = useReservations("completed");
  const orders = useOrders();
  const [signingOut, setSigningOut] = useState(false);
  const [busy, setBusy] = useState(false);

  const togglePush = async (enabled: boolean) => {
    if (!user) return;
    if (enabled) {
      const allowed = await ensurePermission(true);
      if (!allowed) {
        showToast("error", "Allow notifications for Swiftab in your phone settings first.");
        return;
      }
      prefs.set({ pushEnabled: true });
      registerForPush(user.userId);
      showToast("success", "Order and booking updates are on.");
    } else {
      prefs.set({ pushEnabled: false });
      unregisterPush(user.userId);
      showToast("info", "Updates from restaurants are off. Reminders you set still work.");
    }
  };

  const signOut = async () => {
    setBusy(true);
    try {
      if (user) await unregisterPush(user.userId);
    } finally {
      // Nothing from this account should be left for the next person to sign in.
      useCart.getState().clear();
      useInbox.getState().clear();
      client.clear();
      setBusy(false);
      setSigningOut(false);
      logOut();
    }
  };

  const version = Constants.expoConfig?.version ?? "";

  return (
    <View style={{ flex: 1, backgroundColor: palette.canvas }}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: insets.bottom + TAB_BAR_SPACE }}>
        <View style={{ backgroundColor: palette.pine, paddingTop: insets.top + 18, paddingHorizontal: 20, paddingBottom: 22, borderBottomLeftRadius: 30, borderBottomRightRadius: 30 }}>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <View style={{ width: 64, height: 64, borderRadius: 32, backgroundColor: "rgba(255,255,255,0.16)", alignItems: "center", justifyContent: "center" }}>
              <Txt w="extrabold" size={22} color={palette.white}>
                {initials(user?.name)}
              </Txt>
            </View>
            <View style={{ flex: 1, marginLeft: 14 }}>
              <Txt w="extrabold" size={20} color={palette.white} numberOfLines={1}>
                {user?.name || "Swiftab diner"}
              </Txt>
              <Txt size={13} color="rgba(255,255,255,0.74)" numberOfLines={1}>
                {user?.email}
              </Txt>
            </View>
            <Pressable
              testID="edit-profile"
              accessibilityRole="button"
              accessibilityLabel="Edit profile"
              onPress={() => pushOnce(router, "/screens/account")}
              style={{ height: 38, paddingHorizontal: 14, borderRadius: 19, backgroundColor: "rgba(255,255,255,0.16)", justifyContent: "center" }}
            >
              <Txt w="semibold" size={13} color={palette.white}>
                Edit
              </Txt>
            </Pressable>
          </View>
          <View style={{ flexDirection: "row", marginTop: 20, paddingTop: 16, borderTopWidth: 1, borderColor: "rgba(255,255,255,0.14)" }}>
            <Stat value={upcoming.data?.length ?? 0} label="Upcoming" />
            <Stat value={past.data?.length ?? 0} label="Visits" />
            <Stat value={orders.data?.length ?? 0} label="Orders" />
            <Stat value={savedCount} label="Saved" />
          </View>
        </View>

        <View style={{ paddingHorizontal: 20 }}>
          <Group title="Activity">
            <Row icon="calendar-outline" title="My bookings" subtitle="Upcoming, past and cancelled" onPress={() => router.navigate("/(tabs)/bookings")} />
            <Row icon="receipt-outline" title="My orders" subtitle="Track food and see receipts" onPress={() => pushOnce(router, "/Order")} />
            <Row icon="notifications-outline" title="Notifications" subtitle="Updates you have received" onPress={() => pushOnce(router, "/screens/notifications")} last />
          </Group>

          {Platform.OS !== "web" && (
            <Group title="Notifications">
              <Row
                icon="megaphone-outline"
                title="Order and booking updates"
                subtitle="When food is served or a booking changes"
                right={<Switch testID="push-switch" value={prefs.pushEnabled} onValueChange={togglePush} trackColor={{ false: palette.line, true: palette.brand }} thumbColor={palette.white} />}
              />
              <Row
                icon="alarm-outline"
                title="Remind me before bookings"
                subtitle="Set a reminder each time you book"
                right={
                  <Switch
                    value={prefs.autoReminder}
                    onValueChange={(autoReminder) => prefs.set({ autoReminder })}
                    trackColor={{ false: palette.line, true: palette.brand }}
                    thumbColor={palette.white}
                  />
                }
              />
              <View style={{ paddingVertical: 13 }}>
                <Txt w="semibold" size={14.5} style={{ marginBottom: 10 }}>
                  How early to remind you
                </Txt>
                <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8 }}>
                  {REMINDER_LEADS.map((minutes) => (
                    <Chip
                      key={minutes}
                      label={minutes < 60 ? `${minutes} min` : `${minutes / 60} h`}
                      selected={prefs.reminderLeadMinutes === minutes}
                      onPress={() => prefs.set({ reminderLeadMinutes: minutes })}
                    />
                  ))}
                </View>
              </View>
            </Group>
          )}

          <Group title="Support">
            <Row icon="help-buoy-outline" title="Help centre" subtitle="Answers and ways to reach us" onPress={() => pushOnce(router, "/screens/help")} />
            <Row icon="shield-checkmark-outline" title="Privacy policy" onPress={() => pushOnce(router, { pathname: "/screens/PolicyScreen", params: { type: "privacy" } })} />
            <Row icon="document-text-outline" title="Terms & conditions" onPress={() => pushOnce(router, { pathname: "/screens/PolicyScreen", params: { type: "terms" } })} />
            <Row icon="information-circle-outline" title="About Swiftab" onPress={() => pushOnce(router, { pathname: "/screens/PolicyScreen", params: { type: "about" } })} last />
          </Group>

          <Button label="Sign out" variant="danger" icon="log-out-outline" style={{ marginTop: 26 }} onPress={() => setSigningOut(true)} testID="sign-out" />
          {version ? (
            <Txt size={12} color={palette.faint} center style={{ marginTop: 14 }}>
              Swiftab {version}
            </Txt>
          ) : null}
        </View>
      </ScrollView>

      <ConfirmDialog
        visible={signingOut}
        title="Sign out?"
        message="You will need your email and password to sign back in."
        confirmLabel="Sign out"
        cancelLabel="Stay"
        destructive
        busy={busy}
        onConfirm={signOut}
        onCancel={() => setSigningOut(false)}
      />
    </View>
  );
}
