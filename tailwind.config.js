/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {
      fontFamily: {
        'rubik': ['Rubik', 'sans-serif'],
        'poppins': ['Poppins', 'sans-serif'],
        'inter': ['Inter', 'sans-serif'],
        'helvetica': ['Helvetica Neue', 'sans-serif'],
        'neue-regrade': ['Neue Regrade', 'sans-serif'],
        'pp': ['"PP Neue Montreal"', 'sans-serif'],
    },
    
    },
  },
  plugins: [
    require('tailwind-scrollbar')({ nocompatible: true }),
  ]
}