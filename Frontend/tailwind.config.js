/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: ["app/**/*.{js,jsx,ts,tsx}", "components/**/*.{js,jsx,ts,tsx}"],
  plugins: [],
  theme: {
    extend: {
      fontFamily: {
        readexExtraLight: ["ReadexPro_200ExtraLight", "sans-serif"],
        readexLight: ["ReadexPro_300Light", "sans-serif"],
        readexRegular: ["ReadexPro_400Regular", "sans-serif"],
        readexMedium: ["ReadexPro_500Medium", "sans-serif"],
        readexSemiBold: ["ReadexPro_600SemiBold", "sans-serif"],
        readexBold: ["ReadexPro_700Bold", "sans-serif"],
      },
      boxShadow: {
        'custom-blue': '0 3px 4px rgba(47, 102, 246, 1)', // Adjusted to match the desired shadow color and opacity
      },
      fontWeight: {
        hairline: 100,
        "extra-light": 100,
        thin: 200,
        light: 300,
        normal: 400,
        medium: 500,
        semibold: 600,
        bold: 700,
        extrabold: 800,
        "extra-bold": 800,
        black: 900,
      },
      colors: {
        border: "#DFDFDF",
        background: "#F8F9FC",
        surface: "#FFFFFF",
        outline: "#D7D9E4",
        textColor: "#11183C",
        primary: "#2F66F6",
        primaryBtn: "#2F66F6",
        secondary: "#696F8C",
        error: "#CD0000",
        fall: "F7931A",
        success: "#098C26",
      },
      fontSize: {
        xxs: "4px", // Extra Extra Small
        xs: "12px", // Extra Small
        sm: "14px", // Small
        md: "16px", // Medium
        lg: "24px", // Large
        xl: "32px", // Extra Large
        "2xl": "40px", // 2X Extra Large
      },
    },
  },
};
