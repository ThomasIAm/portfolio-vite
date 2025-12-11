import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [react(), mode === "development" && componentTagger()].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  define: {
    "import.meta.env.VITE_CF_PAGES_URL": JSON.stringify(process.env.CF_PAGES_URL || ""),
    "import.meta.env.VITE_CONTENTFUL_ACCESS_TOKEN": JSON.stringify(process.env.CONTENTFUL_ACCESS_TOKEN || ""),
    "import.meta.env.VITE_CONTENTFUL_SPACE_ID": JSON.stringify(process.env.CONTENTFUL_SPACE_ID || ""),
    "import.meta.env.VITE_CONTENTFUL_PREVIEW_TOKEN": JSON.stringify(process.env.CONTENTFUL_PREVIEW_TOKEN || ""),
  },
}));
