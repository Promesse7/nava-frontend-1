/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [
    require('@tailwindcss/forms'),  // Add this line
  ],

  animations: {
    'spin-slow': 'spin 3s linear infinite',
    'expand': 'expandWidth 2s ease-in-out forwards',
  },
  keyframes: {
    expandWidth: {
      '0%': { width: '0%' },
      '100%': { width: '100%' }
    }
  }
};
