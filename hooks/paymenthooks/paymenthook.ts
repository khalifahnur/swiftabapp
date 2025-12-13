import { makePayment } from "@/api/api";
import { ErrorResponse } from "@/types";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "expo-router";
import Toast from "react-native-toast-message";

type paymentParams = {
  phone: string;
  amount: number;
  email: string;
};

type paymentResponse = {
  status: boolean;
  message?: string;
  data?: {
    reference: string;
    amount: number;
    currency: string;
    status: string;
  };
};

export function usePaymentHook() {
  const router = useRouter();
  return useMutation<paymentResponse, ErrorResponse, paymentParams>({
    mutationFn: makePayment,
    onSuccess: () => {
      Toast.show({
        type: "success",
        text1: "Wait for mpesa sdk push menu to enter M-pesa pin",
      });
      router.push("/(tabs)");
    },
    onError: (error) => {
      // Handle errors
      console.error("Failed to initiate payment:", error.message);
      Toast.show({
        type: "error",
        text2: "Payment initiation error : Please try again.",
      });
    },
  });
}
