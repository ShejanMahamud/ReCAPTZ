import react from "@vitejs/plugin-react";
import { resolve } from "path";
import { defineConfig } from "vite";
import dts from "vite-plugin-dts";
import tailwindcss from '@tailwindcss/postcss'
import cssInjectedByJsPlugin from "vite-plugin-css-injected-by-js";
export default defineConfig({
  plugins: [
    react(),

    dts({
      insertTypesEntry: true,
    }),
    cssInjectedByJsPlugin(),
  ],
  css: {
    postcss: {
      plugins: [tailwindcss()],
    },
  },
  build: {
    lib: {
      entry: resolve(__dirname, "src/index.ts"),
      name: "ReCAPTZ",
      formats: ["es", "umd"],
      fileName: (format) => `recaptz.${format}.js`,
    },
    rollupOptions: {
      external: ["react", "react-dom"],
      output: {
        globals: {
          react: "React",
          "react-dom": "ReactDOM",
        },
      },
    },
  },
});
