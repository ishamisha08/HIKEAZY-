/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'primary': "#FF4500",
      },
      gridTemplateColumns: {
        'auto': 'repeat(auto-fill, minmax(200px,1fr))',
      },
      scrollBehavior: {
        smooth: 'smooth',
      },
    },
  },
  plugins: [
    require('tailwind-scrollbar')({ nocompatible: true }), // Add the scrollbar plugin
  ],
}
