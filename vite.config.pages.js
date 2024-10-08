import { defineConfig } from "vite";
import { resolve } from "path";

export default defineConfig({
  base: "/squircle/",
  root: resolve(__dirname, "pages"),
  resolve: {
    alias: {
      "@": resolve(__dirname, "src"),
      pages: resolve(__dirname, "pages", "src"),
    },
  },
  build: {
    outDir: resolve(__dirname, "dist"),
  }
});
