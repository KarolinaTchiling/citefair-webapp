/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{html,js,jsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Rubik', 'sans-serif'],
        logo: ['Libre Baskerville', 'serif']
      },
      colors: {
        white: '#F5F5F5',
        black: '#0F110C',
        blue: '#188FA7',
        indigo: '#1F2041',
        yellow: '#FFB100',
        red: '#912F40',
      },
    },
  },
  plugins: [],
}

