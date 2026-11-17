/**
 * The one place colours, type and shape are defined. Screens read from here
 * (or the matching Tailwind names in tailwind.config.js) so the app stays
 * visually consistent.
 */
export const palette = {
  /** Deep green used for dark surfaces and primary actions. */
  pine: "#0B3B36",
  pineSoft: "#14524B",
  /** Swiftab teal: links, active states, accents. */
  brand: "#008080",
  brandDark: "#006B6B",
  brandTint: "#E6F4F3",
  mint: "#CFEDE6",
  /** Page background and surfaces. */
  canvas: "#F5F7F6",
  surface: "#FFFFFF",
  line: "#E7ECEA",
  /** Text. */
  ink: "#0F1F1D",
  body: "#44524F",
  muted: "#7B8885",
  faint: "#A9B4B1",
  /** Status. */
  amber: "#F5A623",
  amberTint: "#FFF4DD",
  danger: "#D64545",
  dangerTint: "#FDECEC",
  success: "#1E9E6A",
  successTint: "#E3F6EE",
  info: "#2A78D6",
  infoTint: "#E6F0FC",
  white: "#FFFFFF",
  black: "#000000",
} as const;

export const fonts = {
  regular: "Jakarta-Regular",
  medium: "Jakarta-Medium",
  semibold: "Jakarta-SemiBold",
  bold: "Jakarta-Bold",
  extrabold: "Jakarta-ExtraBold",
} as const;

export type FontWeight = keyof typeof fonts;

export const radius = { sm: 10, md: 14, lg: 20, xl: 28, pill: 999 } as const;

/** Soft card shadow that reads the same on iOS and Android. */
export const shadow = {
  card: {
    shadowColor: "#0B3B36",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.07,
    shadowRadius: 14,
    elevation: 3,
  },
  raised: {
    shadowColor: "#0B3B36",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.14,
    shadowRadius: 20,
    elevation: 10,
  },
} as const;

/** Height the floating tab bar takes at the bottom of tab screens. */
export const TAB_BAR_SPACE = 96;
