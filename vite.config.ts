import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { VitePWA } from "vite-plugin-pwa";
export default defineConfig({
  base: "/cod-archive/",
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      registerType: "prompt",
      includeAssets: ["icons/*.png", "covers/*.svg"],
      manifest: {
        id: "/cod-archive/",
        name: "COD Archive",
        short_name: "COD Archive",
        description: "Call of Duty Archive & Collection",
        lang: "th",
        start_url: "/cod-archive/",
        scope: "/cod-archive/",
        display: "standalone",
        background_color: "#0b0f12",
        theme_color: "#0b0f12",
        icons: [
          { src: "icons/icon-192.png", sizes: "192x192", type: "image/png" },
          { src: "icons/icon-512.png", sizes: "512x512", type: "image/png" },
          {
            src: "icons/maskable-512.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "maskable",
          },
        ],
      },
      workbox: {
        clientsClaim: true,
        globPatterns: ["**/*.{js,css,html,png,svg,woff2,ttf}"],
        cleanupOutdatedCaches: true,
      },
    }),
  ],
});
