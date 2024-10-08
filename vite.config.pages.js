import { defineConfig } from "vite";
import { resolve } from "path";

export default defineConfig({
  base: "/squircle/",
  root: resolve(__dirname, "pages"),
  resolve: {
    alias: {
      "@": resolve(__dirname, "src"),
    },
  },
});
