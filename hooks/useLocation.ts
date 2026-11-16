import * as Location from "expo-location";
import { useEffect } from "react";
import { create } from "zustand";

interface LocationState {
  status: "idle" | "loading" | "ready" | "denied";
  coords: { latitude: number; longitude: number } | null;
  /** "Westlands, Nairobi". */
  label: string;
  load: (force?: boolean) => Promise<void>;
}

/** The diner's whereabouts, looked up once and shared by every screen. */
const useLocationStore = create<LocationState>((set, get) => ({
  status: "idle",
  coords: null,
  label: "",
  load: async (force) => {
    if (get().status === "loading" || (get().status === "ready" && !force)) return;
    set({ status: "loading" });
    try {
      const permission = await Location.requestForegroundPermissionsAsync();
      if (permission.status !== "granted") {
        set({ status: "denied" });
        return;
      }
      const last = await Location.getLastKnownPositionAsync();
      const position = last ?? (await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced }));
      const coords = { latitude: position.coords.latitude, longitude: position.coords.longitude };
      set({ status: "ready", coords });
      try {
        const [place] = await Location.reverseGeocodeAsync(coords);
        if (place) {
          const area = place.district || place.subregion || place.street || "";
          const city = place.city || place.region || "";
          set({ label: [area, city].filter((part, i, all) => part && all.indexOf(part) === i).join(", ") });
        }
      } catch {
        // The coordinates are enough to sort by distance.
      }
    } catch {
      set({ status: "denied" });
    }
  },
}));

export function useLocation() {
  const state = useLocationStore();
  const { status, load } = state;
  useEffect(() => {
    if (status === "idle") load();
  }, [status, load]);
  return state;
}
