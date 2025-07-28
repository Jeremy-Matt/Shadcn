// vite.config.ts im Projekt‑Root (my-app/vite.config.ts)
import { defineConfig } from "vite";
import react         from "@vitejs/plugin-react";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  root: "app",                // ← hier angeben!
  publicDir: "../public",     // bleibt so, weil public eine Ebene höher liegt
  build: {
    outDir: "../build",       // speichert Build-artifacts eine Ebene höher
    emptyOutDir: true,
  },
  plugins: [react(), tsconfigPaths()],
  resolve: {
    alias: {
      "~": __dirname + "/app", // dein alias bleibt
    },
  },
  server: {
    fs: { allow: [".."] },    // damit Vite auch ../public lesen darf
  },
});
