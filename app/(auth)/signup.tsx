import { useMutation } from "@tanstack/react-query";
import { useRouter } from "expo-router";
import { Formik } from "formik";
import React from "react";
import { Pressable, View } from "react-native";

import { loginUser, signUpUser } from "@/api/api";
import { errorMessage } from "@/api/client";
import AuthShell from "@/components/Auth/AuthShell";
import PhoneNumberInp from "@/components/Auth/PhoneNumberInp";
import { Button } from "@/components/ui/Button";
import { Field } from "@/components/ui/Field";
import { Txt } from "@/components/ui/Txt";
import { palette } from "@/constants/theme";
import { useAuthStore } from "@/lib/authStore";
import { useToast } from "@/lib/ToastContext";
import type { AuthData } from "@/types";
import { signUpSchema } from "@/validation/auth/ValidationSchema";

export default function SignUpScreen() {
  const router = useRouter();
  const { showToast } = useToast();
  const signIn = useAuthStore((s) => s.signIn);

  const signUp = useMutation({
    mutationFn: async (values: AuthData) => {
      await signUpUser(values);
      // Sign straight in so a new diner does not type everything twice.
      try {
        return await loginUser(values);
      } catch {
        return null;
      }
    },
    onSuccess: (session) => {
      if (session?.user?.userId) {
        signIn({ token: session.token, user: session.user });
        showToast("success", "Your account is ready. Welcome to Swiftab!");
      } else {
        showToast("success", "Account created. Sign in to continue.");
        router.replace("/(auth)");
      }
    },
    onError: (error) => showToast("error", errorMessage(error, "We could not create your account.")),
  });

  return (
    <AuthShell
      back
      title="Create your account"
      subtitle="It takes a minute, and your next table is a tap away."
      footer={
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <Txt color={palette.muted}>Already have an account? </Txt>
          <Pressable accessibilityRole="link" hitSlop={8} onPress={() => router.replace("/(auth)")}>
            <Txt w="bold" color={palette.brandDark}>
              Sign in
            </Txt>
          </Pressable>
        </View>
      }
    >
      <Formik
        initialValues={{ name: "", email: "", phoneNumber: "", password: "", confirmPassword: "" }}
        validationSchema={signUpSchema}
        onSubmit={({ name, email, phoneNumber, password }) =>
          signUp.mutate({ name, email, phoneNumber: phoneNumber.replace(/[\s-]/g, ""), password })
        }
      >
        {({ handleChange, handleBlur, handleSubmit, setFieldValue, setFieldTouched, values, errors, touched }) => (
          <View>
            <Field
              label="Full name"
              icon="person-outline"
              placeholder="Jane Wanjiru"
              value={values.name}
              onChangeText={handleChange("name")}
              onBlur={handleBlur("name")}
              autoCapitalize="words"
              autoComplete="name"
              textContentType="name"
              error={touched.name && errors.name}
              testID="signup-name"
            />
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
              error={touched.email && errors.email}
              testID="signup-email"
            />
            <Field label="Phone number" error={touched.phoneNumber && errors.phoneNumber} hint="The restaurant may call about your booking.">
              <PhoneNumberInp
                onPhoneNumberChange={(phone) => {
                  setFieldValue("phoneNumber", phone);
                  setFieldTouched("phoneNumber", true, false);
                }}
              />
            </Field>
            <Field
              label="Password"
              icon="lock-closed-outline"
              placeholder="At least 6 characters"
              value={values.password}
              onChangeText={handleChange("password")}
              onBlur={handleBlur("password")}
              password
              autoCapitalize="none"
              autoComplete="new-password"
              textContentType="newPassword"
              error={touched.password && errors.password}
              testID="signup-password"
            />
            <Field
              label="Confirm password"
              icon="lock-closed-outline"
              placeholder="Type it again"
              value={values.confirmPassword}
              onChangeText={handleChange("confirmPassword")}
              onBlur={handleBlur("confirmPassword")}
              password
              autoCapitalize="none"
              error={touched.confirmPassword && errors.confirmPassword}
              testID="signup-confirm"
            />
            <Button label="Create account" loading={signUp.isPending} onPress={() => handleSubmit()} style={{ marginTop: 6 }} testID="signup-submit" />
            <Txt size={12} color={palette.muted} center style={{ marginTop: 14 }}>
              By continuing you agree to the Swiftab terms and privacy policy.
            </Txt>
          </View>
        )}
      </Formik>
    </AuthShell>
  );
}
