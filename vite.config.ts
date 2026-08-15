import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    host: "localhost",
    port: 5173,
    // Ensure Vite fails if the port is in use so it doesn't silently switch
    strictPort: true,
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
