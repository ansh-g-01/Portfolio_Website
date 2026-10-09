import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  // The lazy-loaded Three.js scene is one large chunk by design
  build: { chunkSizeWarningLimit: 900 },
});
