import { useMutation } from "@tanstack/react-query";
import { useRouter } from "expo-router";
import { Formik } from "formik";
import React from "react";
import { Pressable, View } from "react-native";

import { loginUser } from "@/api/api";
import { errorMessage } from "@/api/client";
import AuthShell from "@/components/Auth/AuthShell";
import { Button } from "@/components/ui/Button";
import { Field } from "@/components/ui/Field";
import { Txt } from "@/components/ui/Txt";
import { palette } from "@/constants/theme";
import { useAuthStore } from "@/lib/authStore";
import { firstName } from "@/lib/format";
import { useToast } from "@/lib/ToastContext";
import { loginSchema } from "@/validation/auth/ValidationSchema";

export default function LoginScreen() {
  const router = useRouter();
  const { showToast } = useToast();
  const signIn = useAuthStore((s) => s.signIn);

  const login = useMutation({
    mutationFn: loginUser,
    onSuccess: (data) => {
      if (!data?.user?.userId) {
        showToast("error", "We could not sign you in. Please try again.");
        return;
      }
      // The signed-in screens replace this one as soon as the session exists.
      signIn({ token: data.token, user: data.user });
      showToast("success", `Welcome back, ${firstName(data.user.name)}`);
    },
    onError: (error) => showToast("error", errorMessage(error, "We could not sign you in.")),
  });

  return (
    <AuthShell
      title={"Welcome back"}
      subtitle="Sign in to see your bookings and order ahead."
      footer={
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <Txt color={palette.muted}>New to Swiftab? </Txt>
          <Pressable accessibilityRole="link" hitSlop={8} onPress={() => router.push("/(auth)/signup")}>
            <Txt w="bold" color={palette.brandDark}>
              Create an account
            </Txt>
          </Pressable>
        </View>
      }
    >
      <Formik
        initialValues={{ email: "", password: "" }}
        validationSchema={loginSchema}
        onSubmit={(values) => login.mutate(values)}
      >
        {({ handleChange, handleBlur, handleSubmit, values, errors, touched }) => (
          <View>
            <Field
              label="Email"
              icon="mail-outline"
              placeholder="you@example.com"
              value={values.email}
              onChangeText={handleChange("email")}
              onBlur={handleBlur("email")}
              keyboardType="email-address"
              autoCapitalize="none"
              autoComplete="email"
              textContentType="emailAddress"
              returnKeyType="next"
              error={touched.email && errors.email}
              testID="login-email"
            />
            <Field
              label="Password"
              icon="lock-closed-outline"
              placeholder="Your password"
              value={values.password}
              onChangeText={handleChange("password")}
              onBlur={handleBlur("password")}
              password
              autoCapitalize="none"
              autoComplete="current-password"
              textContentType="password"
              returnKeyType="go"
              onSubmitEditing={() => handleSubmit()}
              error={touched.password && errors.password}
              testID="login-password"
            />
            <Pressable
              accessibilityRole="link"
              hitSlop={8}
              onPress={() => router.push("/(auth)/forgotpassword")}
              style={{ alignSelf: "flex-end", marginTop: -4, marginBottom: 22 }}
            >
              <Txt w="semibold" size={13} color={palette.brandDark}>
                Forgot password?
              </Txt>
            </Pressable>
            <Button label="Sign in" loading={login.isPending} onPress={() => handleSubmit()} testID="login-submit" />
          </View>
        )}
      </Formik>
    </AuthShell>
  );
}
