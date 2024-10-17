import { defineConfig } from "vite";
import { resolve } from "node:path";
import dts from "vite-plugin-dts";

export default defineConfig({
  resolve: {
    alias: {
      "@": resolve(__dirname, "src"),
    },
  },
  build: {
    rollupOptions: {
      preserveEntrySignatures: true,
      input: {
        client: resolve(__dirname, "src/index.js"),
        server: resolve(__dirname, "src/server.js"),
      },
      output: [
        {
          format: "es",
          preserveModules: true,
          entryFileNames: "[name].js",
        },
      ],
    },
  },
  plugins: [dts()],
});
