module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        irish: ["'Irish Grover'", "cursive"],
        esteban: ["'Esteban'", "serif"],
        Instrument_Serif: ["'Instrument Serif'", "serif"],
        Labrada: ["'Labrada'", "serif"],
      },
      colors: {
        gold: "#c4af27",
        bloodRed: "#d72638",
      },
    },
  },
  plugins: [],
};
