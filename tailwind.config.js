/** @type {import('tailwindcss').Config} */
module.exports = {
  // Update this to include the paths to all of your component files.
  // Since you use Expo Router, the "app" folder is crucial here.
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      fontFamily: {
        regular: ["Jakarta-Regular", "sans-serif"],
        medium: ["Jakarta-Medium", "sans-serif"],
        semibold: ["Jakarta-SemiBold", "sans-serif"],
        bold: ["Jakarta-Bold", "sans-serif"],
      },
    },
  },
  plugins: [],
};
