import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  StyleSheet,
  TouchableWithoutFeedback,
  Keyboard,
  ActivityIndicator,
  ScrollView,
} from "react-native";
import { useRouter } from "expo-router";
import PhoneNumberInp from "@/components/Auth/PhoneNumberInp";
import { color } from "@/constants/Colors";
import { Formik } from "formik";
import { signUpSchema } from "@/validation/auth/ValidationSchema";
import { useSignUp } from "@/hooks/authhooks/authhooks";
import Toast from "react-native-toast-message";
import { SafeAreaView } from "react-native-safe-area-context";

const SignUpScreen = () => {
  const [keyboardStatus, setKeyboardStatus] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const router = useRouter();

  const signUpMutation = useSignUp();

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      "keyboardDidShow",
      () => setKeyboardStatus(true)
    );
    const keyboardDidHideListener = Keyboard.addListener(
      "keyboardDidHide",
      () => setKeyboardStatus(false)
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
        router.navigate("/(auth)/signin");
      }, 2000);
    } else if (signUpMutation.isError) {
      Toast.show({
        type: "error",
        text1: signUpMutation.error.message,
      });
    } else return;
  }, [signUpMutation]);

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <SafeAreaView style={styles.container}>
        <ScrollView>
          <View style={styles.header}>
            {/* <TouchableOpacity
              onPress={() => router.back()}
              style={styles.backButton}
            >
              <Text style={styles.backText}>←</Text>
            </TouchableOpacity> */}

            <Text style={styles.title}>Sign Up</Text>
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
              console.log(values);
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
              <>
                <View style={styles.inputContainer}>
                  <View>
                    <View>
                      <Text style={styles.labelTxt}>Full Name</Text>
                      <TextInput
                        placeholder="full names"
                        value={values.name}
                        onChangeText={handleChange("name")}
                        style={styles.input}
                        keyboardType="default"
                      />
                      {errors.name && touched.name && (
                        <Text style={styles.errorText}>{errors.name}</Text>
                      )}
                    </View>

                    <View>
                      <Text style={styles.labelTxt}>Email</Text>
                      <TextInput
                        placeholder="example@gmail.com"
                        value={values.email}
                        onChangeText={handleChange("email")}
                        style={styles.input}
                        keyboardType="email-address"
                      />
                      {errors.email && touched.email && (
                        <Text style={styles.errorText}>{errors.email}</Text>
                      )}
                    </View>

                    <View>
                      <Text style={styles.labelTxt}>Phone number</Text>
                      <PhoneNumberInp
                        onPhoneNumberChange={handleChange("phoneNumber")}
                      />
                      {errors.phoneNumber && touched.phoneNumber && (
                        <Text style={styles.errorText}>
                          {errors.phoneNumber}
                        </Text>
                      )}
                    </View>

                    <View>
                      <Text style={styles.labelTxt}>Password</Text>
                      <View style={styles.passwordContainer}>
                        <TextInput
                          placeholder="must be 8 characters"
                          value={values.password}
                          onChangeText={handleChange("password")}
                          secureTextEntry={!showPassword}
                          style={styles.passwordInput}
                        />
                        <TouchableOpacity
                          onPress={() => setShowPassword(!showPassword)}
                        >
                          <Text style={styles.eyeIcon}>
                            {showPassword ? "👁" : "👁‍🗨"}
                          </Text>
                        </TouchableOpacity>
                      </View>
                      {errors.password && touched.password && (
                        <Text style={styles.errorText}>{errors.password}</Text>
                      )}
                    </View>

                    <View>
                      <Text style={styles.labelTxt}>Confirm Password</Text>
                      <View style={styles.passwordContainer}>
                        <TextInput
                          placeholder="confirm password"
                          value={values.confirmPassword}
                          onChangeText={handleChange("confirmPassword")}
                          secureTextEntry={!showConfirmPassword}
                          style={styles.passwordInput}
                        />
                        <TouchableOpacity
                          onPress={() =>
                            setShowConfirmPassword(!showConfirmPassword)
                          }
                        >
                          <Text style={styles.eyeIcon}>
                            {showConfirmPassword ? "👁" : "👁‍🗨"}
                          </Text>
                        </TouchableOpacity>
                      </View>
                      {errors.confirmPassword && touched.confirmPassword && (
                        <Text style={styles.errorText}>
                          {errors.confirmPassword}
                        </Text>
                      )}
                    </View>
                  </View>
                </View>
                <TouchableOpacity
                  style={styles.signupButton}
                  onPress={() => handleSubmit()}
                  disabled={signUpMutation.status === "pending"}
                >
                  {signUpMutation.status === "pending" ? (
                    <ActivityIndicator color="#FFF" />
                  ) : (
                    <Text style={styles.signupButtonText}>Sign up</Text>
                  )}
                </TouchableOpacity>
              </>
            )}
          </Formik>

          <View style={styles.separatorContainer}>
            <View style={styles.separator} />
            <Text style={styles.separatorText}>Or Register with</Text>
            <View style={styles.separator} />
          </View>

          <View style={styles.socialButtonsContainer}>
            <TouchableOpacity style={styles.socialButton}>
              <Image
                source={{
                  uri: "https://img.icons8.com/?size=100&id=118497&format=png&color=000000",
                }}
                style={styles.socialIcon}
              />
            </TouchableOpacity>
            <TouchableOpacity style={styles.socialButton}>
              <Image
                source={{
                  uri: "https://img.icons8.com/?size=100&id=17949&format=png&color=000000",
                }}
                style={styles.socialIcon}
              />
            </TouchableOpacity>
            <TouchableOpacity style={styles.socialButton}>
              <Image
                source={{
                  uri: "https://img.icons8.com/ios-filled/50/mac-os.png",
                }}
                style={styles.socialIcon}
              />
            </TouchableOpacity>
          </View>

          <View style={styles.signInContainer}>
            <Text style={styles.signInText}>Already have an account? </Text>
            <TouchableOpacity onPress={() => router.navigate("/(auth)/signin")}>
              <Text style={styles.signInLink}>Log In</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
};

export default SignUpScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F9FA",
    padding: 24,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 20,
    paddingHorizontal: 10,
  },
  backButton: {
    marginRight: 10,
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
    flex: 1,
    textAlign: "center",
    color: "#000",
  },
  inputContainer: {
    marginBottom: 10,
  },
  labelTxt: {
    fontSize: 14,
    fontWeight: "500",
    paddingVertical: 9,
  },
  input: {
    borderWidth: 1,
    borderColor: "#D1D5DB",
    borderRadius: 8,
    padding: 10,
    marginBottom: 4,
  },
  passwordContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#D1D5DB",
    borderRadius: 8,
  },
  passwordInput: {
    flex: 1,
    padding: 10,
  },
  eyeIcon: {
    paddingRight: 16,
    fontSize: 20,
  },
  checkboxContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 24,
  },
  checkboxText: {
    marginLeft: 8,
    color: "#6B7280",
  },
  signupButton: {
    backgroundColor: color.green,
    borderRadius: 8,
    padding: 16,
    alignItems: "center",
  },
  signupButtonText: {
    color: "#FFF",
    fontWeight: "600",
  },
  separatorContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 24,
  },
  separator: {
    flex: 1,
    height: 1,
    backgroundColor: "#E5E7EB",
  },
  separatorText: {
    marginHorizontal: 12,
    color: "#6B7280",
  },
  socialButtonsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 24,
  },
  socialButton: {
    borderWidth: 1,
    borderColor: "#D1D5DB",
    borderRadius: 8,
    padding: 12,
  },
  socialIcon: {
    width: 24,
    height: 24,
  },
  signInContainer: {
    flexDirection: "row",
    justifyContent: "center",
  },
  signInText: {
    color: "#6B7280",
  },
  signInLink: {
    color: "#2563EB",
  },
  errorText: {
    color: "red",
    fontSize: 12,
    marginTop: 4,
  },
});
