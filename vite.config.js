import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// base ต้องตรงกับชื่อ Repository เพื่อให้ asset โหลดถูกต้องบน GitHub Pages
export default defineConfig({
  plugins: [react(), tailwindcss()],
  base: "/SamakkhiApp/",
});
