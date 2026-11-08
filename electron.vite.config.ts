import { resolve } from "node:path";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "electron-vite";

// Le dipendenze di main e preload sono esternalizzate di default (build.externalizeDeps).
export default defineConfig({
  main: {},
  preload: {},
  renderer: {
    root: resolve(__dirname, "src/renderer"),
    plugins: [react(), tailwindcss()],
  },
});
