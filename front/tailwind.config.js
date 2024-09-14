// tailwind.config.js

/** @type {import('tailwindcss').Config} */
export default {
  purge: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  darkMode: true, // or 'media' or 'class'
  theme: {
    extend: {},
    colors: {
      dark: '#1f1f2c',
      'primary-dark': '#2c2c3d',
      primary: '565676',
      secondary: 'a76571',
      'secondary-light': 'c38d94',
      gray: 'aeadf0',
      'light-gray': 'd8dcff',
      light: 'ffffff',
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