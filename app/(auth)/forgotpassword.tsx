import { color } from "@/constants/Colors";
import { useForgotPassword } from "@/hooks/authhooks/authhooks";
import { useToast } from "@/lib/ToastContext";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const ForgotScreen = () => {
  const [email, setEmail] = useState("");

  const router = useRouter();
  const [isDisabled, setIsDisabled] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [error, setError] = useState("");
  const { showToast } = useToast();

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);

      return () => clearTimeout(timer);
    } else {
      setIsDisabled(false);
    }
  }, [countdown]);

  const forgotPsswdMutation = useForgotPassword();

  const handleForgotPassword = async (email: string) => {
    if (isDisabled) return;

    // Validate email
    if (!email || email.trim() === "") {
      setError("Email is required");
      return;
    }

    try {
      setIsDisabled(true);
      setCountdown(10);

      await forgotPsswdMutation.mutateAsync(email);

      showToast(
        "success",
        "Please check your email for the verification code.",
      );
      router.push({ pathname: "/(auth)/codeverify", params: { email } });
    } catch (error) {
      showToast("error", "Failed to Send Verification Code");
      setIsDisabled(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Forgot Password?</Text>
      <Text style={styles.subTitle}>
        Please enter email associated with your account.
      </Text>
      <View style={styles.inputContainer}>
        <View>
          <Text style={styles.labelTxt}>Email</Text>
          <TextInput
            placeholder="example@gmail.com"
            value={email}
            onChangeText={setEmail}
            style={styles.input}
          />
          {error && <Text style={styles.errorText}>{error}</Text>}
        </View>
      </View>

      <TouchableOpacity
        style={styles.loginButton}
        onPress={() => handleForgotPassword(email)}
        disabled={isDisabled}
      >
        <Text style={styles.loginButtonText}>
          {isDisabled ? `Resend in ${countdown}s` : "Send Code"}
        </Text>
      </TouchableOpacity>

      <View style={styles.signinContainer}>
        <Text style={styles.signinText}>Rembered password? </Text>
        <TouchableOpacity onPress={() => router.navigate("/(auth)")}>
          <Text style={styles.signinLink}>Log in</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default ForgotScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F9FA",
    padding: 24,
  },
  title: {
    marginVertical: 24,
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
  },
  subTitle: {
    fontSize: 14,
    fontWeight: "400",
    textAlign: "center",
    marginBottom: 24,
  },
  labelTxt: {
    fontSize: 14,
    fontWeight: "500",
    paddingVertical: 10,
  },
  inputContainer: {
    marginBottom: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: "#D1D5DB",
    borderRadius: 8,
    padding: 16,
    marginBottom: 8,
  },
  loginButton: {
    backgroundColor: color.green,
    borderRadius: 8,
    padding: 16,
    alignItems: "center",
  },
  resendButton: {
    borderRadius: 8,
    padding: 16,
    alignItems: "center",
    borderColor: "#D1D5DB",
    borderWidth: 1,
    marginTop: 10,
  },
  loginButtonText: {
    color: "#FFF",
    fontWeight: "600",
  },
  resendBtnTxt: {
    color: "#000",
    fontWeight: "600",
  },

  signinContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 20,
  },
  signinText: {
    color: "#6B7280",
  },
  signinLink: {
    color: "#2563EB",
  },
  errorText: {
    color: "red",
    fontSize: 12,
    marginTop: 4,
  },
});
