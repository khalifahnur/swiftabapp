import {
  AuthData,
  AuthResponse,
  MenuResponse,
  NearbyRestaurantsResponse,
  paymentVariables,
  Reservation,
  ReservationResponse,
  Restaurant,
  userCancelReservationParams,
} from "@/types";
import axios from "axios";

const api = axios.create({
  baseURL:"https://f40356e44346.ngrok-free.app/swiftab", //"https://server-production-2ee7.up.railway.app/swiftab",
  headers: {
    "Content-Type": "application/json",
  },
});

export const loginUser = async (data: AuthData): Promise<AuthResponse> => {
  try {
    const response = await api.post<AuthResponse>("/auth/user/SignIn", data);
    return response.data;
  } catch (error: any) {
    throw new Error(error?.response?.data?.message || "An error occurred");
  }
};

export const signUpUser = async (data: AuthData): Promise<AuthResponse> => {
  try {
    const response = await api.post<AuthResponse>("/auth/user/SignUp", data);
    return response.data;
  } catch (error: any) {
    if (error?.response) {
      console.error("Sign-up error details:", error.response);
      // Show a more specific error message
      const errorMessage =
        error?.response?.data?.message || "An error occurred during sign up.";
      throw new Error(errorMessage);
    } else {
      // response (network issues, etc.)
      console.error("Network error or no response:", error);
      throw new Error("Network error or no response from server.");
    }
  }
};

/**
 * forgot password
 * @returns verification code
 */

export const forgotPassword = async (email: string) => {
  try {
    const response = await api.post("/auth/user/forgot-password", { email });
    return response.data.message;
  } catch (error) {
    if (error) {
      console.error("forgot password error details:", error);
    } else {
      // response (network issues, etc.)
      console.error("Network error or no response:", error);
      throw new Error("Network error or no response from server.");
    }
  }
};

type VerifyCodeVariables = {
  email: string;
  verificationCode: string;
};

export const verifyCode = async ({
  email,
  verificationCode,
}: VerifyCodeVariables) => {
  try {
    const response = await api.post("/auth/user/verify-code", {
      email,
      verificationCode,
    });
    return response.data;
  } catch (error) {
    if (error) {
      console.error("Code verification error details:", error);
    } else {
      // response (network issues, etc.)
      console.error("Network error or no response:", error);
      throw new Error("Network error or no response from server.");
    }
  }
};

type newPasswdVariables = {
  email: string;
  newPassword: string;
};
export const newPassword = async ({
  email,
  newPassword,
}: newPasswdVariables) => {
  try {
    const response = await api.post("/auth/user/reset-password", {
      email,
      newPassword,
    });
    return response.data;
  } catch (error) {
    if (error) {
      console.error("reset psswd error details:", error);
    } else {
      // response (network issues, etc.)
      console.error("Network error or no response:", error);
      throw new Error("Network error or no response from server.");
    }
  }
};

export const fetchAllRes = async () => {
  try {
    const response = await api.get("/restaurant/fetch-all-restaurants");
    //console.log("fetched from server",response.data)
    return response.data;
  } catch (error: any) {
    if (error?.response) {
      console.error("Error fetching all restaurants:", error.response);
      const errorMessage =
        error?.response?.data?.message ||
        "An error occurred during fetching all res.";
      throw new Error(errorMessage);
    } else {
      // response (network issues, etc.)
      console.error("Network error or no response:", error);
      throw new Error("Network error or no response from server.");
    }
  }
};

export const fetchMenu = async (restaurantId: string): Promise<MenuResponse> => {
  try {
    const response = await api.get(`/restaurant/menu/${restaurantId}`);
    return response.data;
  } catch (error: any) {
    if (error?.response) {
      const errorMessage =
        error?.response?.data?.message ||
        "An error occurred during fetching menu.";
      throw new Error(errorMessage);
    } else {
      // response (network issues, etc.)
      throw new Error("Network error or no response from server.");
    }
  }
};

export const fetchRecentlyRes = async (userId: string): Promise<{ message: string; restaurants: Restaurant[] }> => {
  
  try {
    const response = await api.get(`/restaurant/fetch-recently-viewed-restaurants/${userId}`);
    return response.data; // Ensure the response matches the expected structure
  } catch (error: any) {
    if (error?.response) {
      console.error("Error fetching recently viewed restaurants:", error.response);
      const errorMessage =
        error?.response?.data?.message ||
        "An error occurred while fetching recently viewed restaurants.";
      throw new Error(errorMessage);
    } else {
      // Handle network errors or cases where there's no response
      console.error("Network error or no response:", error);
      throw new Error("Network error or no response from server.");
    }
  }
};

export const fetchNearMeRes = async (
  latitude: number,
  longitude: number
): Promise<NearbyRestaurantsResponse[]> => {
  try {
    const response = await api.post("/restaurant/fetch-restaurants-near-me", {
      latitude,
      longitude,
    });
    return response.data;
  } catch (error: any) {
    if (error?.response) {
      console.error("Error fetching nearby restaurants:", error.response);
      const errorMessage =
        error?.response?.data?.message ||
        "An error occurred while fetching nearby restaurants.";
      throw new Error(errorMessage);
    } else {
      console.error("Network error or no response:", error);
      throw new Error("Network error or no response from server.");
    }
  }
};

export const fetchResTable = async (restaurantId: string) => {
  try {
    const response = await api.get(
      `/table/fetch-restaurant-table/${restaurantId}`
    );
    return response.data;
  } catch (error: any) {
    if (error?.response) {
      console.error("Error fetching restaurant table:", error.response);
      const errorMessage =
        error?.response?.data?.message ||
        "An error occurred during fetching restaurant table.";
      throw new Error(errorMessage);
    } else {
      // response (network issues, etc.)
      console.error("Network error or no response:", error);
      throw new Error("Network error or no response from server.");
    }
  }
};

export const fetchActiveResTable = async (
  restaurantId: string,
  bookingFor: string | null,
  endTime: string | null
) => {
  try {
    const response = await api.post("/reservation/fetched-active", {
      restaurantId,
      bookingFor,
      endTime,
    });
    return response.data;
  } catch (error: any) {
    if (error?.response) {
      console.error("Error fetching restaurant active table:", error.response);
      const errorMessage =
        error?.response?.data?.message ||
        "An error occurred during fetching restaurant active table.";
      throw new Error(errorMessage);
    } else {
      console.error("Network error or no response:", error);
      throw new Error("Network error or no response from server.");
    }
  }
};

export const createReservation = async (
  userId: string,
  restaurantId: string,
  fcmToken:string,
  data: Reservation
): Promise<ReservationResponse> => {
  try {
    const response = await api.post<ReservationResponse>(
      `/reservation/${userId}/reserve/${restaurantId}/${fcmToken}`,
      { data }
    );
    return response.data;
  } catch (error: any) {
    if (error?.response) {
      console.error("Failed to create reservation:", error.response);
      const errorMessage =
        error?.response?.data?.message ||
        "An error occurred during reservation.";
      throw new Error(errorMessage);
    } else {
      console.error("Network error or no response:", error);
      throw new Error("Network error or no response from server.");
    }
  }
};

export const fetchActiveReservation = async (userId: string) => {
  try {
    const response = await api.get(`/reservation/${userId}/active`);
    return response.data;
  } catch (error: any) {
    if (error?.response) {
      console.error("Error fetching active reservation:", error.response);
      const errorMessage =
        error?.response?.data?.message ||
        "An error occurred during fetching active reservation.";
      throw new Error(errorMessage);
    } else {
      // response (network issues, etc.)
      console.error("Network error or no response:", error);
      throw new Error("Network error or no response from server.");
    }
  }
};

export const fetchCancelReservation = async (userId: string) => {
  try {
    const response = await api.get(`/reservation/${userId}/cancelled`);
    return response.data;
  } catch (error: any) {
    if (error?.response) {
      console.error("Error fetching cancelled reservation:", error.response);
      const errorMessage =
        error?.response?.data?.message ||
        "An error occurred during fetching cancelled reservation.";
      throw new Error(errorMessage);
    } else {
      // response (network issues, etc.)
      console.error("Network error or no response:", error);
      throw new Error("Network error or no response from server.");
    }
  }
};

export const fetchCompletedReservation = async (userId: string) => {
  try {
    const response = await api.get(`/reservation/${userId}/completed`);
    return response.data;
  } catch (error: any) {
    if (error?.response) {
      console.error("Error fetching completed reservation:", error.response);
      const errorMessage =
        error?.response?.data?.message ||
        "An error occurred during fetching completed reservation.";
      throw new Error(errorMessage);
    } else {
      // response (network issues, etc.)
      console.error("Network error or no response:", error);
      throw new Error("Network error or no response from server.");
    }
  }
};

/**
 * @ payment api
 */


export const makePayment = async ({
  phone,
  amount,
  email,
}: paymentVariables) => {
  try {
    const response = await api.post("/payment/initiate-payment", {
      phone,
      amount,
      email,
    });
    return response.data;
  } catch (error) {
    if (error) {
      console.error("Error initiating payment:", error);
    } else {
      // response (network issues, etc.)
      console.error("Network error or no response:", error);
      throw new Error("Network error or no response from server.");
    }
  }
};

/**
 * @api for cancellation
 * desc :user manually cancel reservation
 * @ response 200 
 */



export const userCancelReservation = async ({userId,restaurantId,reservationId,id}:userCancelReservationParams) => {
  try {
    const response = await api.patch(`/reservation/user-cancel-reservation/${userId}`,{id,restaurantId,reservationId});
    return response.data;
  } catch (error: any) {
    if (error?.response) {
      console.error("Error cancel reservation:", error.response);
      const errorMessage =
        error?.response?.data?.message ||
        "An error occurred during cancellation reservation.";
      throw new Error(errorMessage);
    } else {
      // response (network issues, etc.)
      console.error("Network error or no response:", error);
      throw new Error("Network error or no response from server.");
    }
  }
};

/**
 * fetch all user orders
 */
export const fetchAllOrders = async (userId: string) => {
  try {
    const response = await api.get(`/orders/fetch-all-user-order/${userId}`);
    return response.data;
  } catch (error: any) {
    if (error?.response) {
      console.error("Error fetch-all-order:", error.response);
      const errorMessage =
        error?.response?.data?.message ||
        "An error occurred during fetch-all-order.";
      throw new Error(errorMessage);
    } else {
      // response (network issues, etc.)
      console.error("Network error or no response:", error);
      throw new Error("Network error or no response from server.");
    }
  }
};

