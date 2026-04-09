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
import Toast from "react-native-toast-message";

import { useLogin } from "@/hooks/authhooks/authhooks";
import { loginSchema } from "@/validation/auth/ValidationSchema";

const LoginScreen = () => {
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();
  const signInMutation = useLogin();

  useEffect(() => {
    if (signInMutation.isSuccess) {
      Toast.show({
        type: "success",
        text1: "Sign-in Successful!",
        text2: "Welcome back to Swiftab.",
      });

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
      Toast.show({
        type: "error",
        text1: signInMutation.error.message,
      });
    }
  }, [
    signInMutation.isSuccess,
    signInMutation.isError,
    signInMutation.data,
    router,
  ]);

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <SafeAreaView className="flex-1 bg-gray-50">
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            padding: 24,
            flexGrow: 1,
            justifyContent: "center",
          }}
        >
          <View className="mb-10 mt-4">
            <Text className="text-3xl font-bold text-gray-900 tracking-tight text-center">
              Welcome Back
            </Text>
          </View>

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
              <View className="space-y-4">
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
                    autoCorrect={false}
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

                <TouchableOpacity
                  onPress={() => router.push("/(auth)/forgotpassword")}
                  className="mt-2"
                >
                  <Text className="text-right text-teal-600 font-medium text-sm">
                    Forgot password?
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  className={`rounded-xl p-4 items-center mt-4 shadow-sm ${
                    signInMutation.isPending ? "bg-teal-400" : "bg-teal-600"
                  }`}
                  onPress={() => handleSubmit()}
                  disabled={signInMutation.isPending}
                >
                  {signInMutation.isPending ? (
                    <ActivityIndicator color="#FFF" />
                  ) : (
                    <Text className="text-white text-base font-semibold">
                      Log in
                    </Text>
                  )}
                </TouchableOpacity>
              </View>
            )}
          </Formik>

          <View className="flex-row justify-center items-center mt-auto pb-6">
            <Text className="text-gray-600 font-medium text-base">
              Don't have an account?{" "}
            </Text>
            <TouchableOpacity onPress={() => router.navigate("/(auth)/signup")}>
              <Text className="text-teal-600 font-bold text-base">Sign up</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
};

export default LoginScreen;
