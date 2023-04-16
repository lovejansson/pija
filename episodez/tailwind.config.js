/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx}",
    "./src/components/**/*.{js,ts,jsx,tsx}",
    "./src/app/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      keyframes: {
        "slide-down": {
          "0%": { transform: "translateY(-100%)" },
          "100%": { transform: "translateY(0)" },
        },

        "fade-in": {
          "0%": { opacity: 0 },
          "100%": { opacity: 1 },
        },
      },

      animation: {
        expand: "slide-down 0.25s ease, fade-in  1s ease",
      },

      colors: {
        "background": "#06070b",
        "color-main": "#dee3ff",
        "color-error": "#E30B5D",
        "color-success": "#40ad80",
      },
    },
  },
  plugins: [],
};
