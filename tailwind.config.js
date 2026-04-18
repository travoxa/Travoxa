// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      fontFamily: {
        display: ['Montserrat', 'serif'],
        sans: ['Montserrat', 'sans-serif'],
      },
      keyframes: {
        loop: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-100%)" },
        },
      },
      animation: {
        loop: "loop 25s linear infinite",
      },
    }
  },
};
