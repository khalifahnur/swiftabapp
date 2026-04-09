import {
  forgotPassword,
  loginUser,
  newPassword,
  signUpUser,
  verifyCode,
} from "@/api/api";
import { useAuthStore } from "@/lib/authStore";
import { AuthData, AuthResponse, ErrorResponse } from "@/types";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useMutation, UseMutationResult } from "@tanstack/react-query";
import { useRouter } from "expo-router";
import Toast from "react-native-toast-message";

export function useLogin(): UseMutationResult<
  AuthResponse,
  ErrorResponse,
  AuthData
> {
  const { logIn } = useAuthStore();
  return useMutation<AuthResponse, ErrorResponse, AuthData>({
    mutationFn: loginUser,
    onSuccess: (data: AuthResponse) => {
      logIn();
      AsyncStorage.setItem("userObj", JSON.stringify(data));
    },
  });
}

export function useSignUp(): UseMutationResult<
  AuthResponse,
  ErrorResponse,
  AuthData
> {
  return useMutation<AuthResponse, ErrorResponse, AuthData>({
    mutationFn: signUpUser,
  });
}

interface ForgotPasswordResponse {
  email: string;
  message?: string;
}

export function useForgotPassword() {
  return useMutation<ForgotPasswordResponse, ErrorResponse, string>({
    mutationFn: forgotPassword,
  });
}

type VerifyCodeVariables = {
  email: string;
  verificationCode: string;
};

type VerifyCodeResponse = {
  status: number;
  email: string;
  message?: string;
};

export function useVerifyCode() {
  const router = useRouter();
  return useMutation<VerifyCodeResponse, ErrorResponse, VerifyCodeVariables>({
    mutationFn: verifyCode,
    onSuccess: (data) => {
      Toast.show({
        type: "success",
        text1: "Verification Successful",
        text2: "You can now reset your password.",
      });
      router.push({
        pathname: "/(auth)/newpassword",
        params: { email: data.email },
      });
      // } else if (data.status === 400) {
      //   Toast.show({
      //     type: 'error',
      //     text1: 'Invalid or Expired Code',
      //     text2: 'Please check your verification code and try again.',
      //   });
      // }
    },
    onError: () => {
      Toast.show({
        type: "error",
        text1: "Verification Failed",
        text2: "An error occurred while verifying the code. Please try again.",
      });
    },
  });
}

type passwordParams = {
  email: string;
  newPassword: string;
};

type newPsswdResponse = {
  status: number;
  email: string;
  message?: string;
};

export function useNewPassword() {
  const router = useRouter();
  return useMutation<newPsswdResponse, ErrorResponse, passwordParams>({
    mutationFn: newPassword,
    onSuccess: () => {
      Toast.show({
        type: "success",
        text1: "Password Changed",
      });
      router.push("/(auth)");
    },
    onError: () => {
      Toast.show({
        type: "error",
        text2: "Password changed error : Please try again.",
      });
    },
  });
}
