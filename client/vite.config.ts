/// <reference types="vitest" />
/// <reference types="vite/client" />

import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
// https://vitejs.dev/config/
export default defineConfig({
  server: {
    proxy: {
      "/api": "https://video-streaming-server-z2fg.onrender.com",
    },
  },
  plugins: [react()],
});
