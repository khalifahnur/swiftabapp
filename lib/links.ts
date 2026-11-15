import { Linking, Platform, Share } from "react-native";

import { toast } from "./ToastContext";

async function open(url: string, failure: string) {
  try {
    await Linking.openURL(url);
  } catch {
    toast.error(failure);
  }
}

export const callNumber = (phone: string) => open(`tel:${phone.replace(/[^\d+]/g, "")}`, "This phone cannot make calls.");

export const sendEmail = (email: string) => open(`mailto:${email}`, "No email app is set up on this phone.");

/** Opens turn-by-turn directions in the phone's maps app. */
export function openDirections(place: { latitude?: number; longitude?: number; restaurantName?: string; location?: string }) {
  const hasPoint = Boolean(place.latitude && place.longitude);
  const destination = hasPoint
    ? `${place.latitude},${place.longitude}`
    : encodeURIComponent([place.restaurantName, place.location].filter(Boolean).join(", "));
  return open(`https://www.google.com/maps/dir/?api=1&destination=${destination}`, "We could not open maps.");
}

export async function shareRestaurant(place: { restaurantName: string; location: string }) {
  const message = `${place.restaurantName} — ${place.location}. Book a table on Swiftab: https://www.swiftab.co.ke`;
  try {
    if (Platform.OS === "web") {
      await (navigator as any)?.share?.({ text: message });
      return;
    }
    await Share.share({ message });
  } catch {
    // Closing the share sheet is not an error.
  }
}
