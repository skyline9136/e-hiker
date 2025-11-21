import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import { resolve } from "path";

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      "@": resolve(__dirname, "src"),
    },
  },
  assetsInclude: ["**/*.JPG", "**/*.jpg"],
  server: {
    port: 3000,
    open: true,
    watch: {
      ignored: ["**/db.json"],
    },
    proxy: {
      "/issuerApi": {
        target: "https://issuer-sandbox.wallet.gov.tw/api",
        changeOrigin: true,
        secure: true,
        rewrite: (path) => path.replace(/^\/issuerApi/, ""),
      },
      "/verifyApi": {
        target: "https://verifier-sandbox.wallet.gov.tw/api",
        changeOrigin: true,
        secure: true,
        rewrite: (path) => path.replace(/^\/verifyApi/, ""),
      },
    },
  },
});
