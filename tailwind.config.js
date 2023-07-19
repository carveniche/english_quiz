/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        "header-black": "#292929",
        BDBDBD: "#BDBDBD",
        F2F2F2: "#F2F2F2",
      },
    },
  },
  plugins: [],
};
