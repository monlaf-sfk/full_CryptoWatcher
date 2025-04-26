/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{html,js}",
    "./src/**/*.{js,jsx,ts,tsx}",
    "./index.html",
    "./public/index.html",
    "./public/**/*.html",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
  corePlugins: {
    preflight: false // Disable Tailwind's base styles
  }
}

