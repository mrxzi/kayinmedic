/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        medisy: {
          50: '#F0F7FF',
          100: '#E0EFFF',
          200: '#B8DCFF',
          300: '#7EC0FF',
          400: '#389DFF',
          500: '#0A7EE2',
          600: '#0077D7',
          700: '#005FB0',
          800: '#004C8C',
          900: '#003366',
        },
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'system-ui', '-apple-system', 'sans-serif'],
      },
      boxShadow: {
        'medisy-card': '0 4px 20px -2px rgba(0, 119, 215, 0.12), 0 2px 6px -1px rgba(0, 0, 0, 0.04)',
        'medisy-btn': '0 6px 16px -2px rgba(0, 119, 215, 0.35)',
        'soft': '0 2px 8px -1px rgba(0, 0, 0, 0.06)',
      }
    },
  },
  plugins: [],
}
