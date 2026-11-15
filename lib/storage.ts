import AsyncStorage from "@react-native-async-storage/async-storage";
import * as SecureStore from "expo-secure-store";
import { Platform } from "react-native";
import { createJSONStorage, StateStorage } from "zustand/middleware";

/**
 * Encrypted storage for the session. The keychain is not available on web,
 * where the browser's own storage stands in for it.
 */
const secure: StateStorage =
  Platform.OS === "web"
    ? {
        getItem: (name) => globalThis.localStorage?.getItem(name) ?? null,
        setItem: (name, value) => globalThis.localStorage?.setItem(name, value),
        removeItem: (name) => globalThis.localStorage?.removeItem(name),
      }
    : {
        getItem: (name) => SecureStore.getItem(name),
        setItem: (name, value) => SecureStore.setItem(name, value),
        removeItem: (name) => SecureStore.deleteItemAsync(name),
      };

export const secureStorage = createJSONStorage(() => secure);

/** Plain device storage for things that are not secret (cart, saved places). */
export const deviceStorage = createJSONStorage(() => AsyncStorage);
