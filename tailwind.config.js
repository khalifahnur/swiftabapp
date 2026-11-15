/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  // The app has one (light) look; "class" stops the web preview following the browser's theme.
  darkMode: "class",
  theme: {
    extend: {
      // Mirrors constants/theme.ts.
      colors: {
        pine: { DEFAULT: "#0B3B36", soft: "#14524B" },
        brand: { DEFAULT: "#008080", dark: "#006B6B", tint: "#E6F4F3" },
        mint: "#CFEDE6",
        canvas: "#F5F7F6",
        line: "#E7ECEA",
        ink: "#0F1F1D",
        body: "#44524F",
        muted: "#7B8885",
        faint: "#A9B4B1",
        amber: { DEFAULT: "#F5A623", tint: "#FFF4DD" },
        danger: { DEFAULT: "#D64545", tint: "#FDECEC" },
        success: { DEFAULT: "#1E9E6A", tint: "#E3F6EE" },
        info: { DEFAULT: "#2A78D6", tint: "#E6F0FC" },
      },
      fontFamily: {
        regular: ["Jakarta-Regular", "sans-serif"],
        medium: ["Jakarta-Medium", "sans-serif"],
        semibold: ["Jakarta-SemiBold", "sans-serif"],
        bold: ["Jakarta-Bold", "sans-serif"],
        extrabold: ["Jakarta-ExtraBold", "sans-serif"],
      },
    },
  },
  plugins: [],
};
