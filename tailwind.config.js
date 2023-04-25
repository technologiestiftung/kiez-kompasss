/** @type {import('tailwindcss').Config} */
module.exports = {
  important: true,
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",

    // Or if using `src` directory:
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    fontFamily: {
      sans: [
        'National',
        'Roboto',
        'sans-serif',
      ],
      bold: ['NationalBold']
    },
    colors: {
      blue: '#2F2FA2',
      lightblue: '#9f9fe3',
      magenta: '#F64C72',
      darkblue: '#393A60',
      white: '#FFFFFF'
     }
  },
    extend: {
      fontFamily: {
        "nationalbold": ['NationalBold']
      }
    },
  plugins: [],
};
