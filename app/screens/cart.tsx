import { pushOnce } from "@/lib/nav";
import { Icon } from "@/components/ui/Icon";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, TextInput, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { errorMessage } from "@/api/client";
import { Card, EmptyState, Picture, ScreenHeader, Stepper } from "@/components/ui/Bits";
import { Button } from "@/components/ui/Button";
import { ConfirmDialog } from "@/components/ui/Sheet";
import { Txt } from "@/components/ui/Txt";
import { fonts, palette, radius, shadow } from "@/constants/theme";
import { useCreateOrder } from "@/hooks/queries";
import { useUser } from "@/lib/authStore";
import { formatKes } from "@/lib/format";
import { useToast } from "@/lib/ToastContext";
import { cartCount, cartTotal, useCart } from "@/store/useCart";

export default function CartScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { showToast } = useToast();
  const user = useUser();
  const { context, items, add, decrease, remove, setNote, clear } = useCart();
  const create = useCreateOrder();
  const [noteFor, setNoteFor] = useState<string | null>(null);
  const [emptying, setEmptying] = useState(false);

  const total = cartTotal(items);
  const count = cartCount(items);

  const placeOrder = () => {
    if (!user || !context) {
      showToast("error", "Open the menu from one of your bookings to order.");
      return;
    }
    create.mutate(
      {
        userId: user.userId,
        restaurantId: context.restaurantId,
        reservationId: context.reservationId,
        tableNumber: context.tableNumber,
        restaurantName: context.restaurantName,
        menu: items.map((i) => ({ _id: i._id, quantity: i.quantity, note: i.note?.trim() || undefined })),
      },
      {
        onSuccess: () => {
          clear();
          showToast("success", "Order sent to the kitchen. Follow it here.");
          router.dismissAll();
          pushOnce(router, "/Order");
        },
        onError: (error) => showToast("error", errorMessage(error, "We could not place your order.")),
      },
    );
  };

  if (items.length === 0) {
    return (
      <View style={{ flex: 1, backgroundColor: palette.canvas }}>
        <ScreenHeader title="Your cart" />
        <EmptyState
          icon="cart-outline"
          title="Your cart is empty"
          message="Add a few dishes from the menu and they will show up here."
          action={<Button label="Back to the menu" onPress={() => router.back()} />}
        />
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: palette.canvas }}>
      <ScreenHeader
        title="Your cart"
        right={
          <Pressable accessibilityRole="button" accessibilityLabel="Empty the cart" hitSlop={8} onPress={() => setEmptying(true)}>
            <Txt w="semibold" size={13} color={palette.danger}>
              Clear
            </Txt>
          </Pressable>
        }
      />
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined} style={{ flex: 1 }}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={{ paddingHorizontal: 20, paddingTop: 4, paddingBottom: insets.bottom + 190, gap: 12 }}
        >
          {context && (
            <View style={{ flexDirection: "row", alignItems: "center", gap: 10, padding: 12, borderRadius: radius.md, backgroundColor: palette.brandTint }}>
              <Icon name="restaurant" size={18} color={palette.pine} />
              <Txt w="semibold" size={13.5} color={palette.pine} style={{ flex: 1 }} numberOfLines={1}>
                {context.restaurantName} · Table {context.tableNumber}
              </Txt>
            </View>
          )}

          {items.map((item) => (
            <Card key={item._id} style={{ padding: 12 }}>
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <Picture uri={item.image} icon="fast-food-outline" style={{ width: 64, height: 64, borderRadius: 14 }} />
                <View style={{ flex: 1, marginLeft: 12 }}>
                  <Txt w="bold" size={14.5} numberOfLines={1}>
                    {item.name}
                  </Txt>
                  <Txt w="semibold" size={13.5} color={palette.brandDark} style={{ marginTop: 2 }}>
                    {formatKes(item.cost * item.quantity)}
                  </Txt>
                  <Txt size={11.5} color={palette.muted}>
                    {formatKes(item.cost)} each
                  </Txt>
                </View>
                <Stepper compact value={item.quantity} onMinus={() => decrease(item._id)} onPlus={() => add({ ...item, name: item.name })} />
              </View>

              {noteFor === item._id || item.note ? (
                <TextInput
                  testID={`note-${item._id}`}
                  value={item.note ?? ""}
                  onChangeText={(text) => setNote(item._id, text.slice(0, 140))}
                  onBlur={() => setNoteFor(null)}
                  autoFocus={noteFor === item._id}
                  placeholder="No onions, extra spicy…"
                  placeholderTextColor={palette.faint}
                  style={{
                    marginTop: 10,
                    height: 42,
                    borderRadius: radius.sm,
                    backgroundColor: palette.canvas,
                    paddingHorizontal: 12,
                    fontFamily: fonts.medium,
                    fontSize: 13.5,
                    color: palette.ink,
                  }}
                />
              ) : null}

              <View style={{ flexDirection: "row", justifyContent: "space-between", marginTop: 10 }}>
                <Pressable accessibilityRole="button" hitSlop={8} onPress={() => setNoteFor(item._id)} style={{ flexDirection: "row", alignItems: "center", gap: 5 }}>
                  <Icon name="create-outline" size={14} color={palette.brandDark} />
                  <Txt w="semibold" size={12.5} color={palette.brandDark}>
                    {item.note ? "Edit note" : "Add a note"}
                  </Txt>
                </Pressable>
                <Pressable accessibilityRole="button" accessibilityLabel={`Remove ${item.name}`} hitSlop={8} onPress={() => remove(item._id)} style={{ flexDirection: "row", alignItems: "center", gap: 5 }}>
                  <Icon name="trash-outline" size={14} color={palette.danger} />
                  <Txt w="semibold" size={12.5} color={palette.danger}>
                    Remove
                  </Txt>
                </Pressable>
              </View>
            </Card>
          ))}

          <Pressable accessibilityRole="button" onPress={() => router.back()} style={{ flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 6, paddingVertical: 10 }}>
            <Icon name="add-circle-outline" size={18} color={palette.brandDark} />
            <Txt w="semibold" size={14} color={palette.brandDark}>
              Add more dishes
            </Txt>
          </Pressable>
        </ScrollView>
      </KeyboardAvoidingView>

      <View
        style={[
          shadow.raised,
          {
            position: "absolute",
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: palette.surface,
            borderTopLeftRadius: 26,
            borderTopRightRadius: 26,
            paddingHorizontal: 20,
            paddingTop: 16,
            paddingBottom: Math.max(insets.bottom, 16) + 6,
          },
        ]}
      >
        <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "baseline" }}>
          <Txt size={13.5} color={palette.muted}>
            {count} {count === 1 ? "item" : "items"}
          </Txt>
          <Txt w="extrabold" size={22} testID="cart-total">
            {formatKes(total)}
          </Txt>
        </View>
        <Txt size={11.5} color={palette.muted} style={{ marginTop: 2, marginBottom: 12 }}>
          You pay at the table. The restaurant confirms the final total.
        </Txt>
        <Button label="Place order" icon="checkmark-circle-outline" loading={create.isPending} onPress={placeOrder} testID="place-order" />
      </View>

      <ConfirmDialog
        visible={emptying}
        title="Empty the cart?"
        message="Every dish you have added will be removed."
        confirmLabel="Empty cart"
        destructive
        onConfirm={() => {
          clear();
          setEmptying(false);
        }}
        onCancel={() => setEmptying(false)}
      />
    </View>
  );
}
