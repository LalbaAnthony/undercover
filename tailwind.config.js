// tailwind.config.js

/** @type {import('tailwindcss').Config} */
export default {
  purge: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  darkMode: true, // or 'media' or 'class'
  theme: {
    extend: {},
    colors: {
      primary: '#FE2E6B',
      secondary: '#1F85E1',
      'secondary-light': '#03F6FA',
      terciary: '#FB4813',
      'terciary-light': '#FEA81E',
      light: '#EAEDF1',
      gray: '#9CA3AF',
      'dark-gray': '#2A2F55',
      'light-dark': '#171E4C',
      dark: '#0E133C',
      'light-success': '#34d399',
      success: '#10b981',
      'dark-success': '#047857',
      'light-warning': '#fbbf24',
      warning: '#f59e0b',
      'dark-warning': '#d97706',
      'light-danger': '#ef4444',
      danger: '#dc2626',
      'dark-danger': '#991b1b',
    },
  },
  plugins: [],
}