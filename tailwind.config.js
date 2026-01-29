/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#3a86ff',
        secondary: '#8338ec',
        accent: '#ff006e',
        dark: '#1a1a2e',
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
      },
       keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        cardIn: {
          '0%': {
            opacity: '0',
            transform: 'translateY(20px) scale(0.97)',
          },
          '100%': {
            opacity: '1',
            transform: 'translateY(0) scale(1)',
          },
        },
      },
      animation: {
        float: 'float 6s ease-in-out infinite',
        cardIn: 'cardIn 0.5s ease-out',
      },
    },
  },
  plugins: [],
};
