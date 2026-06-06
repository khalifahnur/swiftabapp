import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
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

import { useLogin } from "@/hooks/authhooks/authhooks";
import { useToast } from "@/lib/ToastContext";
import { loginSchema } from "@/validation/auth/ValidationSchema";

const LoginScreen = () => {
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();
  const signInMutation = useLogin();
  const { showToast } = useToast();

  useEffect(() => {
    if (signInMutation.isSuccess) {
      showToast("success", "Successfully logged in!");

      const handleLogin = async () => {
        if (signInMutation.data) {
          await AsyncStorage.setItem(
            "userObj",
            JSON.stringify(signInMutation.data),
          );
          router.replace("/(tabs)");
        }
      };

      setTimeout(() => {
        handleLogin();
      }, 1000);
    } else if (signInMutation.isError) {
      showToast("error", signInMutation.error.message);
    }
  }, [
    signInMutation.isSuccess,
    signInMutation.isError,
    signInMutation.data,
    router,
  ]);

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <SafeAreaView className="flex-1 bg-white">
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            paddingHorizontal: 24,
            paddingTop: 40,
            flexGrow: 1,
          }}
        >
          {/* Header Section */}
          <View className="mb-10 items-center mt-8">
            <Text className="text-3xl font-bold text-gray-900 tracking-tight mb-3">
              Sign In
            </Text>
            <Text className="text-sm text-gray-500 font-medium">
              Hi! Welcome back, you've been missed
            </Text>
          </View>

          {/* Form Section */}
          <Formik
            initialValues={{ email: "", password: "" }}
            validationSchema={loginSchema}
            onSubmit={(values) => {
              signInMutation.mutate(values);
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
              <View className="space-y-5">
                {/* Email Input */}
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
                    autoCorrect={false}
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

                {/* Password Input */}
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

                {/* Forgot Password */}
                <TouchableOpacity
                  onPress={() => router.push("/(auth)/forgotpassword")}
                  className="mt-1 mb-2"
                >
                  <Text className="text-right text-teal-600 font-semibold text-sm underline">
                    Forgot Password?
                  </Text>
                </TouchableOpacity>

                {/* Submit Button */}
                <TouchableOpacity
                  className={`rounded-full h-14 justify-center items-center shadow-sm mt-2 ${
                    signInMutation.isPending ? "bg-teal-400" : "bg-teal-600"
                  }`}
                  onPress={() => handleSubmit()}
                  disabled={signInMutation.isPending}
                >
                  {signInMutation.isPending ? (
                    <ActivityIndicator color="#FFF" />
                  ) : (
                    <Text className="text-white text-lg font-semibold">
                      Sign In
                    </Text>
                  )}
                </TouchableOpacity>
              </View>
            )}
          </Formik>

          {/* Bottom Sign Up Link */}
          <View className="flex-row justify-center items-center mt-auto pb-8 pt-10">
            <Text className="text-gray-600 font-medium text-sm">
              Don't have an account?{" "}
            </Text>
            <TouchableOpacity onPress={() => router.navigate("/(auth)/signup")}>
              <Text className="text-teal-600 font-bold text-sm underline">
                Sign Up
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
};

export default LoginScreen;
