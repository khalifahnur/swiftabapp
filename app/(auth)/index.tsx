import { color } from "@/constants/Colors";
import { useLogin } from "@/hooks/authhooks/authhooks";
import { loginSchema } from "@/validation/auth/ValidationSchema";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { Formik } from "formik";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Toast from "react-native-toast-message";

const LoginScreen = () => {
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();
  const signInMutation = useLogin();

  useEffect(() => {
    if (signInMutation.isSuccess) {
      Toast.show({
        type: "success",
        text1: "Sign-in Successful!",
        text2: "Welcome! Login successfully.",
      });

      const handleLogin = async () => {
        if (signInMutation.data) {
          await AsyncStorage.setItem("userObj", JSON.stringify(signInMutation.data));
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
  }, [signInMutation.isSuccess, signInMutation.isError]);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Log In</Text>
      </View>
      <Formik
        initialValues={{ email: "", password: "" }}
        validationSchema={loginSchema}
        onSubmit={(values) => {
          signInMutation.mutate(values);
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
                <Text style={styles.labelTxt}>Email</Text>
                <TextInput
                  placeholder="example@gmail.com"
                  value={values.email}
                  onChangeText={handleChange("email")}
                  style={styles.input}
                />
                {errors.email && touched.email && (
                  <Text style={styles.errorText}>{errors.email}</Text>
                )}
              </View>
              <View>
                <Text style={styles.labelTxt}>Password</Text>
                <View style={styles.passwordContainer}>
                  <TextInput
                    placeholder="Must be 8 characters"
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
            </View>
            <TouchableOpacity
              onPress={() => router.push("/(auth)/forgotpassword")}
            >
              <Text style={styles.forgotPassword}>Forgot password?</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.loginButton}
              onPress={() => handleSubmit()}
              disabled={signInMutation.isPending}
            >
              {signInMutation.isPending ? (
                <ActivityIndicator color="#FFF" />
              ) : (
                <Text style={styles.loginButtonText}>Log in</Text>
              )}
            </TouchableOpacity>
          </>
        )}
      </Formik>
      <View style={styles.separatorContainer}>
        <View style={styles.separator} />
        <Text style={styles.separatorText}>Or Login with</Text>
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
            source={{ uri: "https://img.icons8.com/ios-filled/50/mac-os.png" }}
            style={styles.socialIcon}
          />
        </TouchableOpacity>
      </View>

      <View style={styles.signUpContainer}>
        <Text style={styles.signUpText}>Don't have an account? </Text>
        <TouchableOpacity onPress={() => router.navigate("/(auth)/signup")}>
          <Text style={styles.signUpLink}>Sign up</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default LoginScreen;


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor:color.graywhite,
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
  backText: {
    fontSize: 24,
    color: "#000",             
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
    flex: 1,                   
    textAlign: "center",   
    color: "#000",            
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
    padding: 10,
    marginBottom: 8,
    color:'#000'
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
    color:'#000'
  },
  eyeIcon: {
    paddingRight: 16,
    fontSize: 20,
  },
  forgotPassword: {
    textAlign: "right",
    color: "#2563EB",
    marginBottom: 24,
  },
  loginButton: {
    backgroundColor: color.green,
    borderRadius: 8,
    padding: 16,
    alignItems: "center",
  },
  loginButtonText: {
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
  signUpContainer: {
    flexDirection: "row",
    justifyContent: "center",
  },
  signUpText: {
    color: "#6B7280",
  },
  signUpLink: {
    color: "#2563EB",
  },
  errorText: {
    color: "red",
    fontSize: 12,
    marginTop: 4,
  },
});
