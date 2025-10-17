/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}"
  ],
  safelist: [
    { pattern: /bg-amber-(100|200|300|400|500|600|700|800|900)/ },
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}

