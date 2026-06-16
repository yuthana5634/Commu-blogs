// tailwind.config.js
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./components/**/*.{js,vue,ts}",
    "./layouts/**/*.vue",
    "./pages/**/*.vue",
    "./plugins/**/*.{js,ts}",
    "./app.vue",
    "./error.vue",
  ],
  theme: {
    extend: {
      fontFamily: {
        // 'Inter' คุมอังกฤษ และ 'Noto Sans Thai Looped' คุมไทย
        sans: ['Inter', 'Noto Sans Thai Looped', 'sans-serif'],
      },
    },
  },
  plugins: [],
}