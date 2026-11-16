import { useMutation } from "@tanstack/react-query";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Formik } from "formik";
import React from "react";
import { View } from "react-native";

import { resetPassword } from "@/api/api";
import { errorMessage } from "@/api/client";
import AuthShell from "@/components/Auth/AuthShell";
import { Button } from "@/components/ui/Button";
import { Field } from "@/components/ui/Field";
import { useToast } from "@/lib/ToastContext";
import { newPasswordSchema } from "@/validation/auth/ValidationSchema";

export default function NewPasswordScreen() {
  const router = useRouter();
  const { showToast } = useToast();
  const { resetToken } = useLocalSearchParams<{ resetToken: string }>();

  const reset = useMutation({
    mutationFn: resetPassword,
    onSuccess: () => {
      showToast("success", "Password changed. Sign in with your new password.");
      router.dismissTo("/(auth)");
    },
    onError: (error) => showToast("error", errorMessage(error, "We could not change your password.")),
  });

  return (
    <AuthShell back title="Choose a new password" subtitle="Pick something you have not used here before.">
      <Formik
        initialValues={{ password: "", confirmPassword: "" }}
        validationSchema={newPasswordSchema}
        onSubmit={({ password }) => {
          if (!resetToken) {
            showToast("error", "Your reset session has expired. Request a new code.");
            return;
          }
          reset.mutate({ resetToken, newPassword: password });
        }}
      >
        {({ handleChange, handleBlur, handleSubmit, values, errors, touched }) => (
          <View>
            <Field
              label="New password"
              icon="lock-closed-outline"
              placeholder="At least 6 characters"
              value={values.password}
              onChangeText={handleChange("password")}
              onBlur={handleBlur("password")}
              password
              autoCapitalize="none"
              autoComplete="new-password"
              error={touched.password && errors.password}
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
            />
            <Button label="Save password" loading={reset.isPending} onPress={() => handleSubmit()} style={{ marginTop: 6 }} />
          </View>
        )}
      </Formik>
    </AuthShell>
  );
}
