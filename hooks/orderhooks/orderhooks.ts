import { completeOrder, createOrder } from "@/api/api";
import { useToast } from "@/lib/ToastContext";
import {
  CompleteOrder,
  CreateOrder,
  ErrorResponse,
  OrderResponse,
} from "@/types";
import { useMutation, UseMutationResult } from "@tanstack/react-query";
import { useCallback } from "react";

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
  const { showToast } = useToast();
  return useMutation({
    mutationFn: ({ data, orderId }: { data: CompleteOrder; orderId: string }) =>
      completeOrder({ data, orderId }),
    onSuccess: useCallback(() => {
      showToast("success", "Order Completion.");
    }, []),
    onError: useCallback(() => {
      showToast("error", "Please try again.");
    }, []),
  });
}
