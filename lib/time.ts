import moment from "moment-timezone";

/** Restaurants keep Kenyan time, whatever the phone is set to. */
export const BUSINESS_TZ = "Africa/Nairobi";

export const nowInBusinessTz = () => moment.tz(BUSINESS_TZ);

/** A restaurant-local date ("YYYY-MM-DD") and time ("HH:mm") as a moment. */
export const businessMoment = (date: string, time: string) =>
  moment.tz(`${date} ${time}`, "YYYY-MM-DD HH:mm", BUSINESS_TZ);

/** An ISO timestamp from the API, shown in restaurant time. */
export const fromApi = (iso: string) => moment.tz(iso, BUSINESS_TZ);

export const formatDay = (iso: string) => fromApi(iso).format("ddd, D MMM YYYY");
export const formatClock = (iso: string) => fromApi(iso).format("h:mm A");
export const formatDayTime = (iso: string) => fromApi(iso).format("ddd, D MMM • h:mm A");

/** "in 2 h 15 min", "in 3 days", "now". */
export function untilLabel(iso: string): string {
  const minutes = fromApi(iso).diff(moment(), "minutes");
  if (minutes <= 0) return "now";
  if (minutes < 60) return `in ${minutes} min`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) {
    const rest = minutes % 60;
    return rest ? `in ${hours} h ${rest} min` : `in ${hours} h`;
  }
  const days = Math.floor(hours / 24);
  return days === 1 ? "tomorrow" : `in ${days} days`;
}

/** "HH:mm" → "h:mm A". */
export const prettyClock = (clock: string) => moment(clock, "HH:mm").format("h:mm A");

export const greeting = () => {
  const hour = moment().hour();
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
};
