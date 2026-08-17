/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        coffee: {
          950: "#150E0A",
          900: "#1B120E",
          800: "#241914",
          700: "#33241C",
          600: "#4A3327",
        },
        cream: "#F4ECDD",
        gold: {
          DEFAULT: "#E8A33D",
          light: "#F2C572",
          dark: "#B87B22",
        },
        berbere: {
          DEFAULT: "#C1432E",
          dark: "#8E2E1F",
        },
        leaf: "#3F6B4F",
      },
      fontFamily: {
        display: ["var(--font-fraunces)", "serif"],
        body: ["var(--font-inter)", "sans-serif"],
      },
      backgroundImage: {
        grain: "radial-gradient(circle at 1px 1px, rgba(244,236,221,0.04) 1px, transparent 0)",
      },
    },
  },
  plugins: [],
};
