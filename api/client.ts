import axios, { AxiosError, isAxiosError } from "axios";

import { useAuthStore } from "@/lib/authStore";

/** Where the Swiftab API lives. Override with EXPO_PUBLIC_API_URL for a local server. */
export const API_BASE_URL = (
  process.env.EXPO_PUBLIC_API_URL || "https://api.swiftab.co.ke/api/v2"
).replace(/\/+$/, "");

export const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 20000,
  headers: { "Content-Type": "application/json" },
});

api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token;
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

/** Called when the API rejects the session, so the app can return to sign-in. */
let onSessionExpired: (() => void) | null = null;
export function setSessionExpiredHandler(handler: (() => void) | null) {
  onSessionExpired = handler;
}

/** An API failure with a message that is safe to show to a person. */
export class ApiError extends Error {
  status: number;
  data: unknown;
  constructor(message: string, status = 0, data: unknown = null) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.data = data;
  }
}

function toApiError(error: unknown): ApiError {
  if (error instanceof ApiError) return error;
  if (isAxiosError(error)) {
    const err = error as AxiosError<{ message?: string; error?: string }>;
    if (err.response) {
      const body = err.response.data;
      const message =
        (body && typeof body === "object" && (body.message || body.error)) ||
        (err.response.status >= 500
          ? "Something went wrong on our side. Please try again."
          : "That request could not be completed.");
      return new ApiError(String(message), err.response.status, body);
    }
    if (err.code === "ECONNABORTED") {
      return new ApiError("The connection is slow. Please try again.");
    }
    return new ApiError("You appear to be offline. Check your connection and try again.");
  }
  return new ApiError(error instanceof Error ? error.message : "Something went wrong.");
}

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const apiError = toApiError(error);
    // A rejected token (not a wrong password) ends the session.
    const hadToken = Boolean(error?.config?.headers?.Authorization);
    if (apiError.status === 401 && hadToken) onSessionExpired?.();
    return Promise.reject(apiError);
  },
);

export function errorMessage(error: unknown, fallback = "Something went wrong. Please try again."): string {
  if (error instanceof Error && error.message) return error.message;
  return fallback;
}
