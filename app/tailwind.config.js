module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    screens: {
      'xs': '475px',
      'sm': '640px',
      'md': '768px',
      'lg': '1024px',
      'xl': '1280px',
      '2xl': '1536px',
    },
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
