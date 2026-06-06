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

import PhoneNumberInp from "@/components/Auth/PhoneNumberInp";
import { useSignUp } from "@/hooks/authhooks/authhooks";
import { useToast } from "@/lib/ToastContext";
import { signUpSchema } from "@/validation/auth/ValidationSchema";

const SignUpScreen = () => {
  const [keyboardStatus, setKeyboardStatus] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const router = useRouter();
  const signUpMutation = useSignUp();
  const { showToast } = useToast();

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
      showToast(
        "success",
        "Welcome! Your account has been created successfully.",
      );
      setTimeout(() => {
        router.navigate("/(auth)");
      }, 500);
    } else if (signUpMutation.isError) {
      showToast("error", signUpMutation.error.message);
    }
  }, [signUpMutation, router]);

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <SafeAreaView className="flex-1 bg-white">
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            paddingHorizontal: 24,
            paddingTop: 20,
            flexGrow: 1,
          }}
        >
          {/* Header Section */}
          <View className="mb-8 items-center mt-4">
            <Text className="text-3xl font-bold text-gray-900 tracking-tight mb-2">
              Create Account
            </Text>
            <Text className="text-sm text-gray-500 font-medium">
              Join us to start exploring amazing restaurants
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
                {/* Full Name */}
                <View>
                  <Text className="text-sm font-semibold text-gray-800 mb-2">
                    Full Name
                  </Text>
                  <TextInput
                    placeholder="John Doe"
                    placeholderTextColor="#9CA3AF"
                    value={values.name}
                    onChangeText={handleChange("name")}
                    onBlur={handleBlur("name")}
                    className={`bg-gray-100 rounded-2xl px-4 h-14 text-base text-gray-900 border ${
                      errors.name && touched.name
                        ? "border-red-500"
                        : "border-transparent"
                    }`}
                  />
                  {errors.name && touched.name && (
                    <Text className="text-red-500 text-xs mt-1.5 ml-1">
                      {errors.name}
                    </Text>
                  )}
                </View>

                {/* Email */}
                <View>
                  <Text className="text-sm font-semibold text-gray-800 mb-2">
                    Email
                  </Text>
                  <TextInput
                    placeholder="example@gmail.com"
                    placeholderTextColor="#9CA3AF"
                    value={values.email}
                    onChangeText={handleChange("email")}
                    onBlur={handleBlur("email")}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    className={`bg-gray-100 rounded-2xl px-4 h-14 text-base text-gray-900 border ${
                      errors.email && touched.email
                        ? "border-red-500"
                        : "border-transparent"
                    }`}
                  />
                  {errors.email && touched.email && (
                    <Text className="text-red-500 text-xs mt-1.5 ml-1">
                      {errors.email}
                    </Text>
                  )}
                </View>

                {/* Phone Number */}
                <View>
                  <Text className="text-sm font-semibold text-gray-800 mb-2">
                    Phone Number
                  </Text>
                  <View
                    className={`bg-gray-100 rounded-2xl overflow-hidden h-14 justify-center border ${
                      errors.phoneNumber && touched.phoneNumber
                        ? "border-red-500"
                        : "border-transparent"
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

                {/* Password */}
                <View>
                  <Text className="text-sm font-semibold text-gray-800 mb-2">
                    Password
                  </Text>
                  <View
                    className={`flex-row items-center bg-gray-100 rounded-2xl pr-4 h-14 border ${
                      errors.password && touched.password
                        ? "border-red-500"
                        : "border-transparent"
                    }`}
                  >
                    <TextInput
                      placeholder="••••••••••••••••"
                      placeholderTextColor="#9CA3AF"
                      value={values.password}
                      onChangeText={handleChange("password")}
                      onBlur={handleBlur("password")}
                      secureTextEntry={!showPassword}
                      className="flex-1 px-4 h-full text-base text-gray-900"
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

                {/* Confirm Password */}
                <View>
                  <Text className="text-sm font-semibold text-gray-800 mb-2">
                    Confirm Password
                  </Text>
                  <View
                    className={`flex-row items-center bg-gray-100 rounded-2xl pr-4 h-14 border ${
                      errors.confirmPassword && touched.confirmPassword
                        ? "border-red-500"
                        : "border-transparent"
                    }`}
                  >
                    <TextInput
                      placeholder="••••••••••••••••"
                      placeholderTextColor="#9CA3AF"
                      value={values.confirmPassword}
                      onChangeText={handleChange("confirmPassword")}
                      onBlur={handleBlur("confirmPassword")}
                      secureTextEntry={!showConfirmPassword}
                      className="flex-1 px-4 h-full text-base text-gray-900"
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

                {/* Submit Button */}
                <TouchableOpacity
                  className={`rounded-full h-14 justify-center items-center shadow-sm mt-6 ${
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
                    <Text className="text-white text-lg font-semibold">
                      Create Account
                    </Text>
                  )}
                </TouchableOpacity>
              </View>
            )}
          </Formik>

          {/* Bottom Log In Link */}
          <View className="flex-row justify-center items-center mt-auto pb-8 pt-6">
            <Text className="text-gray-600 font-medium text-sm">
              Already have an account?{" "}
            </Text>
            <TouchableOpacity onPress={() => router.navigate("/(auth)")}>
              <Text className="text-teal-600 font-bold text-sm underline">
                Log In
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
};

export default SignUpScreen;
