import { completeOrder, createOrder } from "@/api/api";
import {
    CompleteOrder,
    CreateOrder,
    ErrorResponse,
    OrderResponse,
} from "@/types";
import { useMutation, UseMutationResult } from "@tanstack/react-query";
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

export function userCompleteOrder() {
  return useMutation({
    mutationFn: ({ data, orderId }: { data: CompleteOrder; orderId: string }) =>
      completeOrder({ data, orderId }),
    onSuccess: () => {
      Toast.show({
        type: "success",
        text1: "Order Completion",
      });
    },
    onError: () => {
      Toast.show({
        type: "error",
        text2: "Please try again.",
      });
    },
  });
}
