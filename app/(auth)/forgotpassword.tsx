import { pushOnce } from "@/lib/nav";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "expo-router";
import { Formik } from "formik";
import React from "react";
import { View } from "react-native";

import { forgotPassword } from "@/api/api";
import { errorMessage } from "@/api/client";
import AuthShell from "@/components/Auth/AuthShell";
import { Button } from "@/components/ui/Button";
import { Field } from "@/components/ui/Field";
import { useToast } from "@/lib/ToastContext";
import { emailSchema } from "@/validation/auth/ValidationSchema";

export default function ForgotPasswordScreen() {
  const router = useRouter();
  const { showToast } = useToast();

  const request = useMutation({
    mutationFn: forgotPassword,
    onSuccess: (data, email) => {
      showToast("success", "If that address has an account, a 6-digit code is on its way.");
      pushOnce(router, { pathname: "/(auth)/codeverify", params: { email: data?.email || email.trim() } });
    },
    onError: (error) => showToast("error", errorMessage(error, "We could not send the code.")),
  });

  return (
    <AuthShell back title="Reset your password" subtitle="Enter the email you signed up with and we will send you a code.">
      <Formik initialValues={{ email: "" }} validationSchema={emailSchema} onSubmit={({ email }) => request.mutate(email)}>
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
              returnKeyType="send"
              onSubmitEditing={() => handleSubmit()}
              error={touched.email && errors.email}
            />
            <Button label="Send code" loading={request.isPending} onPress={() => handleSubmit()} style={{ marginTop: 6 }} />
          </View>
        )}
      </Formik>
    </AuthShell>
  );
}
