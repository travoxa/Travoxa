// tailwind.config.js
module.exports = {
  theme: {
    extend: {
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
