/** @type {import('tailwindcss').Config} */
export default {
    content: [
      "./index.html",
      "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
      extend: {
        colors: {
          or: {
            DEFAULT: '#C8B063',
            light: '#F7D774',
            dark: '#A8872A',
          },
          noir: {
            DEFAULT: '#181818',
            light: '#232323',
            dark: '#000000',
          },
          gris: {
            light: '#F5F5F5',
            DEFAULT: '#9CA3AF',
            dark: '#4B5563',
          },
          blanc: '#FFFFFF',
        },
        boxShadow: {
          premium: '0 8px 20px rgba(0,0,0,0.15)',
        },
        borderRadius: {
          premium: '1rem',
        },
        fontFamily: {
          sans: ['Poppins', 'sans-serif'],
          serif: ['Playfair Display', 'serif'],
        },
      },
    },
    plugins: [],
  }
  