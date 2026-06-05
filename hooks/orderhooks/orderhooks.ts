import { completeOrder, createOrder } from "@/api/api";
import {
  CompleteOrder,
  CreateOrder,
  ErrorResponse,
  OrderResponse,
} from "@/types";
import { useMutation, UseMutationResult } from "@tanstack/react-query";
import { useCallback } from "react";
import Toast from "react-native-toast-message";

export function useCreateOrder(): UseMutationResult<
  OrderResponse,
  ErrorResponse,
  CreateOrder
> {
  return useMutation<OrderResponse, ErrorResponse, CreateOrder>({
    mutationFn: createOrder,
  });
}

export function useCompleteOrder() {
  return useMutation({
    mutationFn: ({ data, orderId }: { data: CompleteOrder; orderId: string }) =>
      completeOrder({ data, orderId }),
    onSuccess: useCallback(() => {
      Toast.show({ type: "success", text1: "Order Completion" });
    }, []),
    onError: useCallback(() => {
      Toast.show({ type: "error", text2: "Please try again." });
    }, []),
  });
}
