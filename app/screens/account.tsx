import React, { useState } from "react";
import { KeyboardAvoidingView, Platform, ScrollView, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useRouter } from "expo-router";

import { errorMessage } from "@/api/client";
import { ScreenHeader } from "@/components/ui/Bits";
import { Button } from "@/components/ui/Button";
import { Field } from "@/components/ui/Field";
import { Txt } from "@/components/ui/Txt";
import { palette } from "@/constants/theme";
import { useUpdateProfile } from "@/hooks/queries";
import { useUser } from "@/lib/authStore";
import { initials } from "@/lib/format";
import { useToast } from "@/lib/ToastContext";

/** Edit the name and phone number restaurants see on a booking. */
export default function AccountScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { showToast } = useToast();
  const user = useUser();
  const update = useUpdateProfile();
  const [name, setName] = useState(user?.name ?? "");
  const [phone, setPhone] = useState(user?.phoneNumber ?? "");
  const [touched, setTouched] = useState(false);

  const nameError = name.trim().length < 2 ? "Enter your full name" : "";
  const phoneError = /^\+?\d{9,15}$/.test(phone.replace(/[\s-]/g, "")) ? "" : "Enter a valid phone number";
  const changed = name.trim() !== (user?.name ?? "") || phone.trim() !== (user?.phoneNumber ?? "");

  const save = () => {
    setTouched(true);
    if (nameError || phoneError) return;
    update.mutate(
      { name: name.trim(), phoneNumber: phone.replace(/[\s-]/g, "") },
      {
        onSuccess: () => {
          showToast("success", "Profile updated.");
          router.back();
        },
        onError: (error) => showToast("error", errorMessage(error, "We could not save your profile.")),
      },
    );
  };

  return (
    <View style={{ flex: 1, backgroundColor: palette.canvas }}>
      <ScreenHeader title="Edit profile" />
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined} style={{ flex: 1 }}>
        <ScrollView keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: insets.bottom + 32 }}>
          <View style={{ alignItems: "center", marginVertical: 18 }}>
            <View style={{ width: 88, height: 88, borderRadius: 44, backgroundColor: palette.pine, alignItems: "center", justifyContent: "center" }}>
              <Txt w="extrabold" size={30} color={palette.white}>
                {initials(name)}
              </Txt>
            </View>
          </View>

          <Field
            label="Full name"
            icon="person-outline"
            value={name}
            onChangeText={setName}
            autoCapitalize="words"
            autoComplete="name"
            error={touched && nameError}
            testID="profile-name"
          />
          <Field
            label="Phone number"
            icon="call-outline"
            value={phone}
            onChangeText={setPhone}
            keyboardType="phone-pad"
            autoComplete="tel"
            placeholder="+254712345678"
            error={touched && phoneError}
            hint="Restaurants use this if they need to reach you about a booking."
            testID="profile-phone"
          />
          <Field label="Email" icon="mail-outline" value={user?.email ?? ""} editable={false} hint="Your email is how you sign in and cannot be changed here." />

          <Button label="Save changes" loading={update.isPending} disabled={!changed} onPress={save} style={{ marginTop: 8 }} testID="profile-save" />
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}
