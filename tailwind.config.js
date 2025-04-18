/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#00a3a3', // turquoise-500
          50: '#e6f6f6',
          100: '#b0e2e2',
          200: '#8ad5d5',
          300: '#54c1c1',
          400: '#33b5b5',
          500: '#00a3a3', // Main brand color
          600: '#009494', // Active
          700: '#007474',
          800: '#005a5a',
          900: '#004444',
        },
        secondary: {
          DEFAULT: '#003f54', // blue-500
          50: '#e6ecee',
          100: '#b0c3ca',
          200: '#8aa7b0',
          300: '#547e8c',
          400: '#336576',
          500: '#003f54', // Used for headings and footers
          600: '#00394c', // Active
          700: '#002d3c',
          800: '#00232e',
          900: '#001a23',
        },
        accent: {
          DEFAULT: '#ffd35f', // sunlit-yellow-500
          50: '#fffdef',
          100: '#fff1cd',
          200: '#ffebb5',
          300: '#ffe294',
          400: '#ffdc7f',
          500: '#ffd35f', // Used for important buttons, links, warnings
          600: '#e8c056', // Active
          700: '#b59643',
          800: '#8c7434',
          900: '#6b5928',
        },
        neutral: {
          DEFAULT: '#878786', // Seawall Gray-500 (muted text)
          50: '#fefefe',
          100: '#fcfcfc',
          200: '#fbfbfa',
          300: '#f9f9f8',
          400: '#f8f8f6',
          500: '#878786', // Used for UI dividers, muted text
          600: '#6b6b6a',
          700: '#4a4a4a',
          800: '#373737',
          900: '#272716',
        },
        background: {
          DEFAULT: '#fefefe', // Sand White-50
          50: '#fefefe',
          100: '#fcfcfc',
          200: '#fbfbfa',
        },
        text: {
          DEFAULT: '#564b43', // Mangrove Bark-500
          50: '#fefefe',
          100: '#f6f3f2',
          200: '#e8e0db',
          300: '#d7c5ba',
          400: '#b8a08a',
          500: '#564b43', // Used for body text
          600: '#463d38',
          700: '#2f2825',
          800: '#272716',
          900: '#221d1b',
        },
      },
    },
  },
  plugins: [],
};