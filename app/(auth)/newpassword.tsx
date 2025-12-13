import { color } from "@/constants/Colors";
import { useNewPassword } from "@/hooks/authhooks/authhooks";
import { useLocalSearchParams } from "expo-router";
import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const NewPsswdScreen = () => {
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const newPassword = useNewPassword()

  const params = useLocalSearchParams();
    const email = Array.isArray(params.email) ? params.email[0] : params.email;

  const handleResetPsswd = () => {
    if (email && password) {
      newPassword.mutate({ email, newPassword: password });
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Reset Password</Text>
      <View style={styles.inputContainer}>
        <Text style={{textAlign:'center'}}>Please enter your new password</Text>
        <View>
          <Text style={styles.labelTxt}>Password</Text>
          <View style={styles.passwordContainer}>
            <TextInput
              placeholder="Must be 8 characters"
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPassword}
              style={styles.passwordInput}
            />
            <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
              <Text style={styles.eyeIcon}>{showPassword ? "👁" : "👁‍🗨"}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      <TouchableOpacity style={styles.loginButton} onPress={handleResetPsswd}>
        <Text style={styles.loginButtonText}>Reset Password</Text>
      </TouchableOpacity>

    </SafeAreaView>
  );
};

export default NewPsswdScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "transparent",
    padding: 24,
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
    marginTop:25,
  },
  labelTxt:{
    fontSize:14,
    fontWeight:'500',
    paddingVertical:10,
  },
  inputContainer: {
    marginBottom: 16,
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
    padding: 16,
  },
  eyeIcon: {
    paddingRight: 16,
    fontSize: 20,
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
});
