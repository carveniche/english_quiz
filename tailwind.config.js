/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        "header-black-top": "#121212",
        "header-black": "#292929",
        "participant-animation-bar-main": "rgba(0, 0, 0, 0.50)",
        "participant-animation-bar-main-otherScreen": "rgba(0, 0, 0, 0.80)",
        "participant-animation-bar": "rgba(79, 79, 79, 0.6)",
        "participant-animation-bar-hover": "#4F4F4F",
        BDBDBD: "#BDBDBD",
        F2F2F2: "#F2F2F2",
        F5F5F5: "#F5F5F5",
        black: "#000",
        "27AE60": "#27AE60", //green for mathzone
        828282: "#828282",
        F24A4A: "#F24A4A", //red for mathzone
        callTechSupportLineConnect: "#27AE60",
        callTechSupportLine: "#4B4B4B",
        speedMathGameSelectionModeYelloBg: "#fedd52",
        speedMathTextColor: "#233584",
      },
    },
  },
  plugins: [],
};
