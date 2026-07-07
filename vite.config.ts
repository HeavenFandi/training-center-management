import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    host: "localhost",
    port: 5174,
    strictPort: false,
    allowedHosts: true,
    proxy: {
      "/api": {
        target: "https://training-center-management-k4dp.onrender.com",
        changeOrigin: true,
        secure: false,
      },
    },
  },
});
