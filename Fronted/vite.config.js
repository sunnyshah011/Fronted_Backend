import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig({
  base: '/',
  // base: "/React_Project/",

  plugins: [tailwindcss(), react()],

  server: { port: 5173 },
});
// theme: {
//   extend: {
//     fontFamily: {
//       poppins: ['Poppins', 'sans-serif'],
//     },
//   },
// },
