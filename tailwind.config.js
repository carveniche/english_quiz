/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        "header-black-top": "#121212",
        "header-black": "#292929",
        "participant-animation-bar-main": "rgba(0, 0, 0, 0.50)",
        "participant-animation-bar": "rgba(79, 79, 79, 0.6)",
        BDBDBD: "#BDBDBD",
        F2F2F2: "#F2F2F2",
        black: "#000",
        callTechSupportLineConnect: "#27AE60",
        callTechSupportLine: "#4B4B4B",
      },
    },
  },
  plugins: [],
};
