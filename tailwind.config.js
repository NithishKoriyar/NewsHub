/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      gridAutoRows: {
        masonry: 'minmax(100px, auto)', // Adjust min and max values as needed
      },
    },
  },
  plugins: [],
}

