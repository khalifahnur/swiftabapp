import Constants from "expo-constants";
import * as Device from "expo-device";
import * as Notifications from "expo-notifications";
import { Platform } from "react-native";

import { registerPushToken, removePushToken } from "@/api/api";
import { palette } from "@/constants/theme";
import { useInbox } from "@/store/useInbox";

import { formatClock, fromApi } from "./time";

/**
 * Everything to do with notifications: showing them while the app is open,
 * Android channels, the push token the restaurant's updates are sent to, and
 * the local reminders set before a booking.
 */

const native = Platform.OS !== "web";

// Show notifications while the app is in the foreground too.
if (native) {
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowBanner: true,
      shouldShowList: true,
      shouldPlaySound: true,
      shouldSetBadge: false,
    }),
  });
}

export const CHANNELS = {
  orders: "orders",
  reservations: "reservations",
  reminders: "reservation-reminders",
} as const;

let channelsReady: Promise<void> | null = null;

/** Android needs channels before anything can be shown or a token issued. */
export function ensureChannels(): Promise<void> {
  if (Platform.OS !== "android") return Promise.resolve();
  if (!channelsReady) {
    const make = (id: string, name: string, description: string) =>
      Notifications.setNotificationChannelAsync(id, {
        name,
        description,
        importance: Notifications.AndroidImportance.HIGH,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: palette.brand,
        sound: "default",
      });
    channelsReady = Promise.all([
      make("default", "General", "News and offers from Swiftab"),
      make(CHANNELS.orders, "Orders", "Updates on food you have ordered"),
      make(CHANNELS.reservations, "Reservations", "Changes to your bookings"),
      make(CHANNELS.reminders, "Reservation reminders", "A nudge before your table is due"),
    ]).then(() => undefined);
  }
  return channelsReady;
}

/** Whether notifications may be shown, asking the person if they have not decided. */
export async function ensurePermission(ask = true): Promise<boolean> {
  if (!native) return false;
  await ensureChannels();
  const current = await Notifications.getPermissionsAsync();
  if (current.granted) return true;
  if (!ask || !current.canAskAgain) return false;
  const next = await Notifications.requestPermissionsAsync();
  return next.granted;
}

let registeredToken: string | null = null;

/**
 * Gets this device's Expo push token and gives it to the API, so the
 * restaurant's updates (order served, table ready) reach the phone.
 * Returns null on simulators, on web, or when permission is refused.
 */
export async function registerForPush(userId: string): Promise<string | null> {
  if (!native || !Device.isDevice) return null;
  try {
    if (!(await ensurePermission(true))) return null;
    const projectId = Constants.expoConfig?.extra?.eas?.projectId ?? Constants.easConfig?.projectId;
    if (!projectId) return null;
    const token = (await Notifications.getExpoPushTokenAsync({ projectId })).data;
    if (token && token !== registeredToken) {
      await registerPushToken(userId, token);
      registeredToken = token;
    }
    return token;
  } catch {
    // Push is optional: the app still shows updates by refreshing.
    return null;
  }
}

/** Stops updates to this device, for sign-out or when push is switched off. */
export async function unregisterPush(userId: string): Promise<void> {
  if (!native || !Device.isDevice) return;
  try {
    const projectId = Constants.expoConfig?.extra?.eas?.projectId ?? Constants.easConfig?.projectId;
    const token = registeredToken ?? (projectId ? (await Notifications.getExpoPushTokenAsync({ projectId })).data : null);
    if (token) await removePushToken(userId, token);
  } catch {
    // Nothing to undo if the token was never registered.
  } finally {
    registeredToken = null;
  }
}

// --- Booking reminders -------------------------------------------------------

const reminderId = (reservationId: string) => `reminder-${reservationId}`;

export async function hasReminder(reservationId: string): Promise<boolean> {
  if (!native) return false;
  const scheduled = await Notifications.getAllScheduledNotificationsAsync();
  return scheduled.some((n) => n.identifier === reminderId(reservationId));
}

export type ReminderResult = "scheduled" | "denied" | "too-late";

/**
 * Sets a local reminder ahead of a booking. If the booking is closer than the
 * lead time, the reminder fires in a few seconds instead.
 */
export async function scheduleReminder(input: {
  reservationId: string;
  restaurantName: string;
  bookingFor: string;
  leadMinutes: number;
}): Promise<ReminderResult> {
  if (!native) return "denied";
  const start = fromApi(input.bookingFor);
  const msUntil = start.valueOf() - Date.now();
  if (msUntil <= 60 * 1000) return "too-late";
  if (!(await ensurePermission(true))) return "denied";

  const fireAt = start.valueOf() - input.leadMinutes * 60 * 1000;
  const soon = fireAt <= Date.now() + 5000;
  const minutesLeft = Math.max(1, Math.round(msUntil / 60000));
  const clock = formatClock(input.bookingFor);

  await Notifications.cancelScheduledNotificationAsync(reminderId(input.reservationId)).catch(() => undefined);
  await Notifications.scheduleNotificationAsync({
    identifier: reminderId(input.reservationId),
    content: {
      title: soon ? "Your table is almost ready" : "Upcoming reservation",
      body: soon
        ? `${input.restaurantName} is expecting you in ${minutesLeft} min (${clock}).`
        : `Your table at ${input.restaurantName} is booked for ${clock}.`,
      sound: "default",
      data: { type: "reminder", reservationId: input.reservationId },
    },
    trigger: soon
      ? { type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL, seconds: 5, channelId: CHANNELS.reminders }
      : { type: Notifications.SchedulableTriggerInputTypes.DATE, date: new Date(fireAt), channelId: CHANNELS.reminders },
  });
  return "scheduled";
}

export async function cancelReminder(reservationId: string): Promise<void> {
  if (!native) return;
  await Notifications.cancelScheduledNotificationAsync(reminderId(reservationId)).catch(() => undefined);
}

/** Shows a notification straight away, for updates found while the app is open. */
export async function notifyNow(input: {
  title: string;
  body: string;
  channel?: string;
  data?: Record<string, string>;
}): Promise<void> {
  if (!native) return;
  try {
    if (!(await ensurePermission(false))) return;
    await Notifications.scheduleNotificationAsync({
      content: { title: input.title, body: input.body, sound: "default", data: input.data ?? {} },
      trigger: Platform.OS === "android" ? { channelId: input.channel ?? "default" } : null,
    });
  } catch {
    // The in-app toast has already told the person.
  }
}

// --- Receiving ---------------------------------------------------------------

export interface NotificationTarget {
  type: string;
  orderId?: string;
  reservationId?: string;
  status?: string;
}

const targetOf = (notification: Notifications.Notification): NotificationTarget => {
  const data = (notification.request.content.data ?? {}) as Record<string, unknown>;
  return {
    type: typeof data.type === "string" ? data.type : "",
    orderId: typeof data.orderId === "string" ? data.orderId : undefined,
    reservationId: typeof data.reservationId === "string" ? data.reservationId : undefined,
    status: typeof data.status === "string" ? data.status : undefined,
  };
};

function remember(notification: Notifications.Notification) {
  const { title, body } = notification.request.content;
  if (!title && !body) return;
  const target = targetOf(notification);
  useInbox.getState().add({
    // Order updates share an id with the in-app watcher, so each shows once.
    id:
      target.orderId && target.status
        ? `order-${target.orderId}-${target.status}`
        : notification.request.identifier,
    title: title ?? "Swiftab",
    body: body ?? "",
    kind: target.type || "general",
    orderId: target.orderId,
    reservationId: target.reservationId,
  });
}

/**
 * Listens for notifications. `onReceive` runs when one arrives while the app
 * is open; `onOpen` runs when the person taps one. Returns a cleanup function.
 */
export function listenForNotifications(handlers: {
  onReceive?: (target: NotificationTarget) => void;
  onOpen: (target: NotificationTarget) => void;
}): () => void {
  if (!native) return () => undefined;

  const received = Notifications.addNotificationReceivedListener((notification) => {
    remember(notification);
    handlers.onReceive?.(targetOf(notification));
  });
  const opened = Notifications.addNotificationResponseReceivedListener((response) => {
    remember(response.notification);
    handlers.onOpen(targetOf(response.notification));
    Notifications.clearLastNotificationResponse();
  });

  // The app may have been started by tapping a notification.
  const last = Notifications.getLastNotificationResponse();
  if (last?.notification) {
    remember(last.notification);
    handlers.onOpen(targetOf(last.notification));
    Notifications.clearLastNotificationResponse();
  }

  return () => {
    received.remove();
    opened.remove();
  };
}
