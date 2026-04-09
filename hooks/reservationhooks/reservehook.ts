import { createReservation, userCancelReservation } from "@/api/api";
import {
  Reservation,
  ReservationResponse,
  userCancelReservationParams,
} from "@/types";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useMutation } from "@tanstack/react-query";
import Toast from "react-native-toast-message";

interface ReservationParams {
  restaurantId: string;
  userId: string;
  data: Reservation;
}

interface UseCreateReservationOptions {
  onSuccess?: (data: ReservationResponse) => void;
  onError?: (error: Error) => void;
}

export const useCreateReservation = (options?: UseCreateReservationOptions) => {
  return useMutation({
    mutationFn: ({ userId, restaurantId, data }: ReservationParams) =>
      createReservation(userId, restaurantId, data),
    onSuccess: (data) => {
      // Call the success callback if provided
      if (options?.onSuccess) {
        options.onSuccess(data);
        AsyncStorage.setItem("reservationData", JSON.stringify(data));
      }
    },
    onError: (error: Error) => {
      if (options?.onError) {
        options.onError(error);
      }
    },
  });
};

export function userCancellationReservation() {
  return useMutation({
    mutationFn: ({
      id,
      userId,
      restaurantId,
      reservationId,
    }: userCancelReservationParams) =>
      userCancelReservation({ id, userId, restaurantId, reservationId }),
    onSuccess: () => {
      Toast.show({
        type: "success",
        text1: "Reservation cancelled",
      });
      AsyncStorage.removeItem("reservationData");
    },
    onError: () => {
      Toast.show({
        type: "error",
        text2: "Please try again.",
      });
    },
  });
}
