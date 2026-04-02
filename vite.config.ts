import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

// We use default values so the build doesn't crash on GitHub
const port = Number(process.env.PORT) || 3000;
const basePath = process.env.BASE_PATH || "/";

export default defineConfig({
  base: "/haazimi-app/",
  plugins: [
    react(),
    // Replit-specific plugins (runtimeErrorOverlay, Cartographer, DevBanner) 
    // have been removed to prevent build failures.
  ],
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "src"),
    },
    dedupe: ["react", "react-dom"],
  },
  root: path.resolve(import.meta.dirname),
  build: {
    outDir: path.resolve(import.meta.dirname, "dist/public"),
    emptyOutDir: true,
  },
  server: {
    port,
    host: "0.0.0.0",
    allowedHosts: true,
    fs: {
      strict: true,
      deny: ["**/.*"],
    },
  },
  preview: {
    port,
    host: "0.0.0.0",
    allowedHosts: true,
  },
});


