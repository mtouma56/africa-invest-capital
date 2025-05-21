/** @type {import('tailwindcss').Config} */
export default {
    content: [
      "./index.html",
      "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
      extend: {
        colors: {
          primary: {
            DEFAULT: '#D4AF37', // or
            light: '#E6C76E',
            dark: '#B38D1D',
          },
          secondary: {
            DEFAULT: '#111111', // noir
            light: '#333333',
            dark: '#000000',
          },
          noir: "#101010",
          or: "#C8B063",
          "or-light": "#F7D774",
          "or-dark": "#FFD700",
          "texte-principal": "#F5F5F5",
        },
        fontFamily: {
          sans: ['Poppins', 'sans-serif'],
          serif: ['Playfair Display', 'serif'],
        },
      },
    },
    plugins: [],
  }
  