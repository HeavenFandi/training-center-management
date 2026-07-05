import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";


export default defineConfig({
  plugins: [react()],
  server: {
    host: "0.0.0.0",
    port: 5000,
    allowedHosts: true,
    proxy: {
      "/api": {
        target:
          "https://training-center-api-evd9fjc5dkh8ayaw.germanywestcentral-01.azurewebsites.net",
        changeOrigin: true,
        secure: false,
      },
    },
  },
});