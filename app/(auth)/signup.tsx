import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { Formik } from "formik";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Keyboard,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Toast from "react-native-toast-message";

import PhoneNumberInp from "@/components/Auth/PhoneNumberInp";
import { useSignUp } from "@/hooks/authhooks/authhooks";
import { signUpSchema } from "@/validation/auth/ValidationSchema";

const SignUpScreen = () => {
  const [keyboardStatus, setKeyboardStatus] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const router = useRouter();
  const signUpMutation = useSignUp();

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      "keyboardDidShow",
      () => setKeyboardStatus(true),
    );
    const keyboardDidHideListener = Keyboard.addListener(
      "keyboardDidHide",
      () => setKeyboardStatus(false),
    );
    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, []);

  useEffect(() => {
    if (signUpMutation.isSuccess) {
      Toast.show({
        type: "success",
        text1: "Sign-up Successful!",
        text2: "Welcome! Your account has been created successfully.",
      });

      setTimeout(() => {
        router.navigate("/(auth)");
      }, 500);
    } else if (signUpMutation.isError) {
      Toast.show({
        type: "error",
        text1: signUpMutation.error.message,
      });
    }
  }, [signUpMutation, router]);

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <SafeAreaView className="flex-1 bg-gray-50">
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ padding: 24, paddingBottom: 40 }}
        >
          <View className="flex-row items-center justify-center mb-8 mt-2">
            <Text className="text-2xl font-bold text-gray-900 tracking-tight">
              Create Account
            </Text>
          </View>

          <Formik
            initialValues={{
              name: "",
              email: "",
              phoneNumber: "",
              password: "",
              confirmPassword: "",
            }}
            validationSchema={signUpSchema}
            onSubmit={(values) => {
              signUpMutation.mutate(values);
            }}
          >
            {({
              handleChange,
              handleBlur,
              handleSubmit,
              values,
              errors,
              touched,
            }) => (
              <View className="space-y-4">
                <View>
                  <Text className="text-sm font-medium text-gray-700 mb-1.5">
                    Full Name
                  </Text>
                  <TextInput
                    placeholderTextColor="#9CA3AF"
                    value={values.name}
                    onChangeText={handleChange("name")}
                    onBlur={handleBlur("name")}
                    className={`bg-white border rounded-xl p-4 text-base text-gray-900 ${
                      errors.name && touched.name
                        ? "border-red-500"
                        : "border-gray-200"
                    }`}
                  />
                  {errors.name && touched.name && (
                    <Text className="text-red-500 text-xs mt-1.5 ml-1">
                      {errors.name}
                    </Text>
                  )}
                </View>
                <View>
                  <Text className="text-sm font-medium text-gray-700 mb-1.5">
                    Email
                  </Text>
                  <TextInput
                    placeholderTextColor="#9CA3AF"
                    value={values.email}
                    onChangeText={handleChange("email")}
                    onBlur={handleBlur("email")}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    className={`bg-white border rounded-xl p-4 text-base text-gray-900 ${
                      errors.email && touched.email
                        ? "border-red-500"
                        : "border-gray-200"
                    }`}
                  />
                  {errors.email && touched.email && (
                    <Text className="text-red-500 text-xs mt-1.5 ml-1">
                      {errors.email}
                    </Text>
                  )}
                </View>

                <View>
                  <Text className="text-sm font-medium text-gray-700 mb-1.5">
                    Phone Number
                  </Text>
                  <View
                    className={`bg-white border rounded-xl overflow-hidden ${
                      errors.phoneNumber && touched.phoneNumber
                        ? "border-red-500"
                        : "border-gray-200"
                    }`}
                  >
                    <PhoneNumberInp
                      onPhoneNumberChange={handleChange("phoneNumber")}
                    />
                  </View>
                  {errors.phoneNumber && touched.phoneNumber && (
                    <Text className="text-red-500 text-xs mt-1.5 ml-1">
                      {errors.phoneNumber}
                    </Text>
                  )}
                </View>

                <View>
                  <Text className="text-sm font-medium text-gray-700 mb-1.5">
                    Password
                  </Text>
                  <View
                    className={`flex-row items-center bg-white border rounded-xl pr-4 ${
                      errors.password && touched.password
                        ? "border-red-500"
                        : "border-gray-200"
                    }`}
                  >
                    <TextInput
                      placeholderTextColor="#9CA3AF"
                      value={values.password}
                      onChangeText={handleChange("password")}
                      onBlur={handleBlur("password")}
                      secureTextEntry={!showPassword}
                      className="flex-1 p-4 text-base text-gray-900"
                    />
                    <TouchableOpacity
                      onPress={() => setShowPassword(!showPassword)}
                      hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                    >
                      <Ionicons
                        name={showPassword ? "eye-outline" : "eye-off-outline"}
                        size={22}
                        color="#6B7280"
                      />
                    </TouchableOpacity>
                  </View>
                  {errors.password && touched.password && (
                    <Text className="text-red-500 text-xs mt-1.5 ml-1">
                      {errors.password}
                    </Text>
                  )}
                </View>
                <View>
                  <Text className="text-sm font-medium text-gray-700 mb-1.5">
                    Confirm Password
                  </Text>
                  <View
                    className={`flex-row items-center bg-white border rounded-xl pr-4 ${
                      errors.confirmPassword && touched.confirmPassword
                        ? "border-red-500"
                        : "border-gray-200"
                    }`}
                  >
                    <TextInput
                      placeholderTextColor="#9CA3AF"
                      value={values.confirmPassword}
                      onChangeText={handleChange("confirmPassword")}
                      onBlur={handleBlur("confirmPassword")}
                      secureTextEntry={!showConfirmPassword}
                      className="flex-1 p-4 text-base text-gray-900"
                    />
                    <TouchableOpacity
                      onPress={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                      hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                    >
                      <Ionicons
                        name={
                          showConfirmPassword
                            ? "eye-outline"
                            : "eye-off-outline"
                        }
                        size={22}
                        color="#6B7280"
                      />
                    </TouchableOpacity>
                  </View>
                  {errors.confirmPassword && touched.confirmPassword && (
                    <Text className="text-red-500 text-xs mt-1.5 ml-1">
                      {errors.confirmPassword}
                    </Text>
                  )}
                </View>

                {/* Updated Button to Teal */}
                <TouchableOpacity
                  className={`rounded-xl p-4 items-center mt-6 shadow-sm ${
                    signUpMutation.status === "pending"
                      ? "bg-teal-400"
                      : "bg-teal-600"
                  }`}
                  onPress={() => handleSubmit()}
                  disabled={signUpMutation.status === "pending"}
                >
                  {signUpMutation.status === "pending" ? (
                    <ActivityIndicator color="#FFF" />
                  ) : (
                    <Text className="text-white text-base font-semibold">
                      Create Account
                    </Text>
                  )}
                </TouchableOpacity>
              </View>
            )}
          </Formik>

          <View className="flex-row justify-center items-center mt-8 pb-6">
            <Text className="text-gray-600 font-medium text-base">
              Already have an account?{" "}
            </Text>
            <TouchableOpacity onPress={() => router.navigate("/(auth)")}>
              <Text className="text-teal-600 font-bold text-base">Log In</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
};

export default SignUpScreen;
