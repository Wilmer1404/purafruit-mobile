/** @type {import('tailwindcss').Config} */
module.exports = {
  // Las carpetas donde Tailwind buscará tus clases
  content: ["./App.{js,jsx,ts,tsx}", "./src/**/*.{js,jsx,ts,tsx}"],
  
  // ¡ESTA ES LA LÍNEA MÁGICA QUE FALTA!
  presets: [require("nativewind/preset")],
  
  theme: {
    extend: {},
  },
  plugins: [],
}