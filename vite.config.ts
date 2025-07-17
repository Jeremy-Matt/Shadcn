import { defineConfig } from "vite";
import react          from "@vitejs/plugin-react";
import tsconfigPaths  from "vite-tsconfig-paths";
import path           from "path";

export default defineConfig({
  root: "app",
  plugins: [
    react(),           // <-- hier
    tsconfigPaths(),   // optional, falls du Aliases in tsconfig nutzt
  ],
  resolve: {
    alias: {
      "~": path.resolve(__dirname, "app"),
    },
  },
  publicDir: "../public",
  build: {
    outDir: "../build",
  },
});
