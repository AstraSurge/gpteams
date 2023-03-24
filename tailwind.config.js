/** @type {import('tailwindcss').Config} */
module.exports = {
  important: true,
  darkMode: 'class',
  content: [
    './index.html',
    './src/**/*.{vue,js,ts,jsx,tsx}',
  ],
  theme: {
    fontFamily: {
      roboto: ['Roboto', 'sans-serif'],
    },
    extend: {
      animation: {
        blink: 'blink 1.2s infinite steps(1, start)',
      },
      backgroundImage: {
        'sign-in-background': 'url(\'/images/sign-in-background.svg\')',
        'sign-in-background-dark': 'url(\'/images/sign-in-background-dark.svg\')',
      },
      keyframes: {
        blink: {
          '0%, 100%': { 'background-color': 'currentColor' },
          '50%': { 'background-color': 'transparent' },
        },
      },
    },
  },
  plugins: [],
}
