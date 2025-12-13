import {
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams } from "expo-router";
import {
  CodeField,
  Cursor,
  useBlurOnFulfill,
  useClearByFocusCell,
} from "react-native-confirmation-code-field";
import { color } from "@/constants/Colors";
import { useVerifyCode } from "@/hooks/authhooks/authhooks";

const CELL_COUNT = 4;

export default function VerifyScreen() {
  const [value, setValue] = useState("");
  const ref = useBlurOnFulfill({ value, cellCount: CELL_COUNT });
  const [props, getCellOnLayoutHandler] = useClearByFocusCell({
    value,
    setValue,
  });

  const params = useLocalSearchParams();
  const email = Array.isArray(params.email) ? params.email[0] : params.email;

  const verifyCodeMutation = useVerifyCode();

  const handleVerifyCode = () => {
    if (email && value) {
      verifyCodeMutation.mutate({ email, verificationCode: value });
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.subheader}>
        <Text style={styles.headertxt}>Please check your email</Text>
        <Text style={styles.headersubtxt}>
          Verification code sent to
          <Text style={{ color: color.navy }}> {email}</Text>
        </Text>
      </View>
      <View style={styles.textinp}>
        <CodeField
          ref={ref}
          {...props}
          value={value}
          onChangeText={setValue}
          cellCount={CELL_COUNT}
          keyboardType="number-pad"
          textContentType="oneTimeCode"
          autoComplete={Platform.select({
            android: "sms-otp",
            default: "one-time-code",
          })}
          testID="my-code-input"
          renderCell={({ index, symbol, isFocused }) => (
            <Text
              key={index}
              style={[styles.cell, isFocused && styles.focusCell]}
              onLayout={getCellOnLayoutHandler(index)}
            >
              {symbol || (isFocused ? <Cursor /> : null)}
            </Text>
          )}
        />
      </View>

      <TouchableOpacity style={styles.resendButton} onPress={handleVerifyCode}>
        <Text style={styles.resendBtnTxt}>Verify</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F9FA",
    padding: 24,
  },
  subheader: {
    alignItems: "center",
    marginVertical: 24,
  },
  headersubtxt: {
    fontSize: 14,
    fontWeight: "400",
    marginTop: 5,
  },
  textinp: {
    margin: 20,
  },
  headertxt: {
    fontSize: 16,
    fontWeight: "600",
    color: "#000",
  },
  cell: {
    width: 40,
    height: 40,
    lineHeight: 38,
    fontSize: 24,
    borderWidth: 2,
    borderColor: "#00000030",
    textAlign: "center",
    borderRadius: 12,
  },
  focusCell: {
    borderColor: "#000",
  },
  resendButton: {
    borderRadius: 8,
    padding: 16,
    alignItems: "center",
    backgroundColor: color.green,
    marginTop: 10,
  },
  resendBtnTxt: {
    color: "#fff",
    fontWeight: "600",
  },
});