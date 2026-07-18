/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        cream: '#faf5ec',
        sidebar: '#f1ebdf',
        ink: '#2a211c',
        maroon: '#7a3327',
        terracotta: {
          DEFAULT: '#b54a33',
          dark: '#9c3e29',
        },
        coral: '#e08a6e',
        sage: '#93ad93',
        line: '#e4dacb',
        ebony: '#1c1712',
      },
      fontFamily: {
        display: ['"Space Grotesk"', 'sans-serif'],
        hand: ['"Caveat"', 'cursive'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      borderRadius: {
        pill: '999px',
      },
      boxShadow: {
        start: '0 10px 24px rgba(154, 60, 38, 0.25)',
        toast: '0 18px 40px rgba(0, 0, 0, 0.08)',
      },
    },
  },
  plugins: [],
}
