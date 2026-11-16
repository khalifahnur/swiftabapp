# Swiftab — diner app

The Swiftab app for guests: find a restaurant, book the exact table you want,
order ahead, follow your order and ask for the bill. Built with Expo (SDK 54)
and Expo Router.

It talks to the Swiftab API (`swiftab-server`) — the same API the restaurant
dashboard and the waiter app use.

## Run it

```bash
npm install
```

```bash
npx expo start
```

Push notifications need a development or production build; they do not work
in Expo Go on Android.

### Configuration

| Variable | Default | Purpose |
| --- | --- | --- |
| `EXPO_PUBLIC_API_URL` | `https://api.swiftab.co.ke/api/v2` | Where the API lives. Point it at a local server while developing. |

Copy `.env.example` to `.env` to change it.

## Checks

```bash
npm run typecheck
```

```bash
npm run lint
```

## How it is organised

| Path | What lives there |
| --- | --- |
| `app/` | Screens (file-based routes). `(auth)` sign-in, `(tabs)` the four tabs, `screens/` everything pushed on top, `modal.tsx` the ordering menu, `Order.tsx` the orders list. |
| `api/` | `client.ts` (base URL, session token, readable errors) and `api.ts` (one function per endpoint). |
| `hooks/queries.ts` | All data fetching and writes, with cache keys in one place. |
| `lib/` | Session store, notifications and reminders, time and money formatting, opening hours, booking slots, and `floor.ts` — the chair layout rules shared with the dashboard. |
| `store/` | State kept on the phone: booking in progress, cart, saved places, notification inbox, preferences. |
| `components/ui/` | The shared building blocks (text, buttons, sheets, chips, fields). |
| `constants/theme.ts` | Colours, type and shape. `tailwind.config.js` mirrors the colour names. |

## Things worth knowing

- **Times are the restaurant's.** Bookings are made and shown in Kenyan time
  (`Africa/Nairobi`) whatever the phone is set to.
- **Floor plans** are drawn from the layout the restaurant saved in the
  dashboard: every floor, every table at its position, size and angle, one
  chair per seat. Tables that are booked for the chosen time, or too small for
  the party, cannot be picked.
- **Order tracking** refreshes on its own while an order is open and shows a
  toast when its status changes, so it works even with push switched off.
- **Reminders** are local notifications scheduled on the phone before a
  booking. Order and booking updates from the restaurant arrive as Expo push
  notifications, which need FCM (Android) and APNs (iOS) credentials set up in
  EAS.
