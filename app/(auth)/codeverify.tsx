import { useMutation } from "@tanstack/react-query";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { Pressable, View } from "react-native";
import { CodeField, Cursor, useBlurOnFulfill, useClearByFocusCell } from "react-native-confirmation-code-field";

import { forgotPassword, verifyCode } from "@/api/api";
import { errorMessage } from "@/api/client";
import AuthShell from "@/components/Auth/AuthShell";
import { Button } from "@/components/ui/Button";
import { Txt } from "@/components/ui/Txt";
import { palette } from "@/constants/theme";
import { useToast } from "@/lib/ToastContext";

/** The API emails a six-digit code. */
const CELL_COUNT = 6;
const RESEND_AFTER = 45;

export default function CodeVerifyScreen() {
  const router = useRouter();
  const { showToast } = useToast();
  const { email } = useLocalSearchParams<{ email: string }>();
  const [value, setValue] = useState("");
  const [wait, setWait] = useState(RESEND_AFTER);
  const ref = useBlurOnFulfill({ value, cellCount: CELL_COUNT });
  const [props, getCellOnLayoutHandler] = useClearByFocusCell({ value, setValue });

  useEffect(() => {
    if (wait <= 0) return;
    const timer = setTimeout(() => setWait((seconds) => seconds - 1), 1000);
    return () => clearTimeout(timer);
  }, [wait]);

  const verify = useMutation({
    mutationFn: verifyCode,
    onSuccess: (data) => {
      router.replace({ pathname: "/(auth)/newpassword", params: { resetToken: data.resetToken } });
    },
    onError: (error) => {
      setValue("");
      showToast("error", errorMessage(error, "That code is incorrect or has expired."));
    },
  });

  const resend = useMutation({
    mutationFn: () => forgotPassword(email ?? ""),
    onSuccess: () => {
      setWait(RESEND_AFTER);
      showToast("success", "A new code has been sent.");
    },
    onError: (error) => showToast("error", errorMessage(error)),
  });

  const submit = (code: string) => {
    if (code.length === CELL_COUNT && email && !verify.isPending) {
      verify.mutate({ email, verificationCode: code });
    }
  };

  return (
    <AuthShell back title="Check your email" subtitle={`Enter the 6-digit code we sent to ${email ?? "your email"}.`}>
      <CodeField
        ref={ref}
        {...props}
        value={value}
        onChangeText={(text) => {
          const digits = text.replace(/\D/g, "");
          setValue(digits);
          submit(digits);
        }}
        cellCount={CELL_COUNT}
        keyboardType="number-pad"
        textContentType="oneTimeCode"
        autoComplete="one-time-code"
        autoFocus
        rootStyle={{ marginTop: 6, marginBottom: 26 }}
        renderCell={({ index, symbol, isFocused }) => (
          <View
            key={index}
            onLayout={getCellOnLayoutHandler(index)}
            style={{
              width: 46,
              height: 56,
              borderRadius: 14,
              backgroundColor: palette.surface,
              borderWidth: 1.5,
              borderColor: isFocused ? palette.brand : symbol ? palette.pine : palette.line,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Txt w="bold" size={22}>
              {symbol || (isFocused ? <Cursor /> : "")}
            </Txt>
          </View>
        )}
      />
      <Button label="Verify code" loading={verify.isPending} disabled={value.length !== CELL_COUNT} onPress={() => submit(value)} />
      <View style={{ flexDirection: "row", justifyContent: "center", marginTop: 20 }}>
        <Txt color={palette.muted}>Did not get it? </Txt>
        {wait > 0 ? (
          <Txt w="semibold" color={palette.muted}>
            Resend in {wait}s
          </Txt>
        ) : (
          <Pressable accessibilityRole="button" hitSlop={8} disabled={resend.isPending} onPress={() => resend.mutate()}>
            <Txt w="bold" color={palette.brandDark}>
              {resend.isPending ? "Sending…" : "Resend code"}
            </Txt>
          </Pressable>
        )}
      </View>
    </AuthShell>
  );
}
