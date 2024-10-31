/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: ["app/**/*.{js,jsx,ts,tsx}", "components/**/*.{js,jsx,ts,tsx}"],
  plugins: [],
  theme:{
    extend: {
      fontFamily: {
        figtree: ['Figtree_400Regular', 'Figtree_700Bold']
      },
      colors: {
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
        'xxs': '4px',   // Extra Extra Small
        'xs': '8px',    // Extra Small
        'sm': '14px',   // Small
        'md': '16px',   // Medium
        'lg': '24px',   // Large
        'xl': '32px',   // Extra Large
        '2xl': '40px',  // 2X Extra Large
      },
    }
  }
};
