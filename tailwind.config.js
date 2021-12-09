module.exports = {
  mode: "jit",
  purge: ["./src/**/*.{html,ts}"],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      fontFamily: {
        display: ["Cinzel Decorative", "cursive"],
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
};
