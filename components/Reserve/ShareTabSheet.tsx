import React, { useState } from "react";
import { ActivityIndicator, Platform, Share, View } from "react-native";

import { errorMessage } from "@/api/client";
import { Button } from "@/components/ui/Button";
import { Icon, type IconName } from "@/components/ui/Icon";
import { QrCode } from "@/components/ui/QrCode";
import { Sheet } from "@/components/ui/Sheet";
import { Txt } from "@/components/ui/Txt";
import { palette, radius } from "@/constants/theme";
import { useShareTab, useTab } from "@/hooks/queries";
import { formatKes } from "@/lib/format";
import { useToast } from "@/lib/ToastContext";

const STEPS: { icon: IconName; title: string; text: string }[] = [
  { icon: "share-social-outline", title: "Send the link", text: "by WhatsApp or SMS, or let friends at the table scan it." },
  { icon: "restaurant-outline", title: "They pick their dishes", text: "and enter their name. No app or account needed." },
  { icon: "shield-checkmark-outline", title: "You stay in control", text: "see who ordered what, and stop sharing any time." },
];

/**
 * Lets the person who booked share the restaurant's menu: friends open the
 * link, add their name and order, and the dishes go on this booking's bill.
 */
export default function ShareTabSheet({
  visible,
  onClose,
  reservationId,
  restaurantName,
}: {
  visible: boolean;
  onClose: () => void;
  reservationId: string;
  restaurantName: string;
}) {
  const { showToast } = useToast();
  const tab = useTab(reservationId, visible);
  const change = useShareTab(reservationId);
  const [confirmStop, setConfirmStop] = useState(false);

  const info = tab.data;
  const shared = Boolean(info?.open && info.url);

  const close = () => {
    setConfirmStop(false);
    onClose();
  };

  const toggle = (open: boolean) =>
    change.mutate(open, {
      onSuccess: () => {
        setConfirmStop(false);
        if (!open) showToast("success", "Sharing stopped. The old link no longer works.");
      },
      onError: (err) => showToast("error", errorMessage(err, "That did not work. Please try again.")),
    });

  const send = async () => {
    if (!info?.url) return;
    const message = `Join my table at ${restaurantName} on Swiftab and order whatever you like. It goes on my tab: ${info.url}`;
    try {
      if (Platform.OS === "web") {
        const nav = navigator as Navigator & { share?: (data: ShareData) => Promise<void> };
        if (nav.share) await nav.share({ text: message });
        else {
          await navigator.clipboard?.writeText(info.url);
          showToast("success", "Link copied.");
        }
        return;
      }
      await Share.share({ message }, { dialogTitle: "Share your tab" });
    } catch {
      // Closing the share sheet is not an error.
    }
  };

  return (
    <Sheet
      visible={visible}
      onClose={close}
      title={shared ? "Your tab is shared" : "Share the menu"}
      subtitle="Friends open the link, add their name and order. Everything goes on your bill, marked with who ordered it."
    >
      {tab.isLoading ? (
        <View style={{ paddingVertical: 40, alignItems: "center" }}>
          <ActivityIndicator color={palette.brand} />
        </View>
      ) : tab.isError && !info ? (
        <View style={{ paddingVertical: 20, alignItems: "center", gap: 12 }}>
          <Txt size={13.5} color={palette.body} style={{ textAlign: "center" }}>
            {errorMessage(tab.error, "We could not load your tab.")}
          </Txt>
          <Button label="Try again" size="md" variant="soft" onPress={() => tab.refetch()} />
        </View>
      ) : shared && info ? (
        <View style={{ gap: 16 }} testID="tab-shared">
          <View style={{ flexDirection: "row", alignItems: "center", gap: 14, padding: 14, borderRadius: radius.lg, backgroundColor: palette.canvas }}>
            <View style={{ padding: 8, borderRadius: 14, backgroundColor: palette.surface }}>
              <QrCode value={info.url!} size={96} color={palette.pine} />
            </View>
            <View style={{ flex: 1 }}>
              <Txt w="semibold" size={13.5}>
                At the same table?
              </Txt>
              <Txt size={12.5} color={palette.muted} style={{ marginTop: 2 }}>
                Friends can scan this with their phone camera.
              </Txt>
              <View style={{ flexDirection: "row", alignItems: "center", gap: 5, marginTop: 8 }}>
                <Icon name="link-outline" size={14} color={palette.brandDark} />
                <Txt w="medium" size={12} color={palette.brandDark} numberOfLines={1} style={{ flex: 1 }} selectable testID="tab-url">
                  {info.url!.replace(/^https?:\/\//, "")}
                </Txt>
              </View>
            </View>
          </View>

          <Button label="Send link" icon="share-social-outline" onPress={send} testID="tab-send" />

          <View>
            <Txt w="semibold" size={13.5} color={palette.body}>
              Joined · {info.guests.length}
              <Txt size={13.5} color={palette.faint}>
                {" "}
                of {info.maxGuests}
              </Txt>
            </Txt>
            {info.guests.length === 0 ? (
              <View style={{ marginTop: 8, padding: 14, borderRadius: radius.md, borderWidth: 1, borderStyle: "dashed", borderColor: palette.line }}>
                <Txt size={12.5} color={palette.muted}>
                  No one has joined yet. You will see each friend here with what they ordered.
                </Txt>
              </View>
            ) : (
              <View style={{ marginTop: 8, borderRadius: radius.md, borderWidth: 1, borderColor: palette.line }}>
                {info.guests.map((g, i) => (
                  <View
                    key={g.id}
                    style={{ flexDirection: "row", alignItems: "center", gap: 12, paddingHorizontal: 14, paddingVertical: 11, borderTopWidth: i ? 1 : 0, borderColor: palette.line }}
                  >
                    <View style={{ width: 34, height: 34, borderRadius: 17, backgroundColor: palette.brandTint, alignItems: "center", justifyContent: "center" }}>
                      <Txt w="bold" size={12} color={palette.brandDark}>
                        {g.name.slice(0, 2).toUpperCase()}
                      </Txt>
                    </View>
                    <View style={{ flex: 1 }}>
                      <Txt w="semibold" size={13.5} numberOfLines={1}>
                        {g.name}
                      </Txt>
                      <Txt size={12} color={palette.muted}>
                        {g.items ? `${g.items} item${g.items === 1 ? "" : "s"}` : "Browsing the menu"}
                      </Txt>
                    </View>
                    {g.total ? (
                      <Txt w="semibold" size={13.5}>
                        {formatKes(g.total)}
                      </Txt>
                    ) : null}
                  </View>
                ))}
              </View>
            )}
          </View>

          {confirmStop ? (
            <View style={{ padding: 14, borderRadius: radius.md, backgroundColor: palette.dangerTint, gap: 12 }}>
              <Txt size={13} color={palette.danger}>
                Stop sharing? Friends can no longer add anything. What they already ordered stays on your bill.
              </Txt>
              <View style={{ flexDirection: "row", gap: 10 }}>
                <Button label="Keep sharing" size="md" variant="outline" style={{ flex: 1 }} onPress={() => setConfirmStop(false)} />
                <Button label="Stop sharing" size="md" variant="danger" style={{ flex: 1 }} loading={change.isPending} onPress={() => toggle(false)} testID="tab-stop-confirm" />
              </View>
            </View>
          ) : (
            <Button label="Stop sharing" variant="ghost" size="md" onPress={() => setConfirmStop(true)} testID="tab-stop" />
          )}
        </View>
      ) : (
        <View style={{ gap: 14 }}>
          {STEPS.map((s) => (
            <View key={s.title} style={{ flexDirection: "row", gap: 12, alignItems: "flex-start" }}>
              <View style={{ width: 36, height: 36, borderRadius: 18, backgroundColor: palette.brandTint, alignItems: "center", justifyContent: "center" }}>
                <Icon name={s.icon} size={17} color={palette.brandDark} />
              </View>
              <Txt size={13.5} color={palette.body} style={{ flex: 1, paddingTop: 2 }}>
                <Txt w="semibold" size={13.5}>
                  {s.title}
                </Txt>{" "}
                {s.text}
              </Txt>
            </View>
          ))}
          <Button
            label={info?.canShare === false ? "This booking has ended" : "Create share link"}
            icon="link-outline"
            disabled={info?.canShare === false}
            loading={change.isPending}
            onPress={() => toggle(true)}
            style={{ marginTop: 6 }}
            testID="tab-create"
          />
        </View>
      )}
    </Sheet>
  );
}
