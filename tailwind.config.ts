import type { Config } from "tailwindcss";

export default {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        'ocean-deep': '#071D2B',
        'ocean-midnight': '#061018',
        'ocean-turquoise': '#24C7CE',
        'ocean-emerald': '#167A52',
        'ocean-gold': '#F4C66A',
        'ocean-orange': '#F18445',
        'ocean-ivory': '#F4F0E7',
      },
      fontFamily: {
        orbitron: ['var(--font-orbitron)', 'sans-serif'],
        rajdhani: ['var(--font-rajdhani)', 'sans-serif'],
      },
    },
  },
  plugins: [],
} satisfies Config;
