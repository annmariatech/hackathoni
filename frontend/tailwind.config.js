/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        kayal: {
          50: '#f0f9ff',
          100: '#e0f2fe',
          500: '#0284c7',
          800: '#075985',
          900: '#0c4a6e',
        },
        hyacinth: {
          500: '#8b5cf6',
          700: '#6d28d9',
        }
      }
    },
  },
  plugins: [],
}
