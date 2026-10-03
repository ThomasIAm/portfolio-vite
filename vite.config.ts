import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "node:path";
import { componentTagger } from "lovable-tagger";
import { execFileSync } from "node:child_process";
import type { Plugin } from "vite";

// Styling (Tailwind + autoprefixer) is configured in postcss.config.js only,
// so Vite and the plugins never compare two different postcss type copies.

function contentfulPlugin(extraEnv: Record<string, string>): Plugin {
  const run = (stdio: "inherit" | "pipe") =>
    // Use the running Node binary instead of looking up "node" on PATH.
    execFileSync(process.execPath, ["scripts/fetch-content.mjs"], {
      stdio,
      env: { ...extraEnv, ...process.env },
    });

  return {
    name: "vite-contentful-plugin",

    // Run fetch before build starts
    buildStart() {
      console.log("📡 Fetching content from Contentful...");
      try {
        run("inherit");
      } catch (error) {
        console.error("❌ Failed to fetch content:", error);
        throw error;
      }
    },

    // Refresh content on every page load in development
    configureServer(server) {
      const fetchContent = () => {
        try {
          run("pipe");
          console.log("🔄 Content refreshed");
        } catch (error) {
          console.error("❌ Content refresh failed:", error);
        }
      };

      fetchContent();

      server.middlewares.use((req, _res, next) => {
        if (req.headers.accept?.includes("text/html")) {
          fetchContent();
        }
        next();
      });
    },
  };
}

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
    proxy: {
      "/api": {
        target: "https://localhost:8788",
        changeOrigin: true,
        secure: false,
      },
      "/og": {
        target: "https://localhost:8788",
        changeOrigin: true,
        secure: false,
      },
      "/sitemap.xml": {
        target: "https://localhost:8788",
        changeOrigin: true,
        secure: false,
      },
    },
  },
  build: {
    sourcemap: true,
  },
  plugins: [
    contentfulPlugin(loadEnv(mode, process.cwd(), "")),
    react(),
    mode === "development" && componentTagger(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  define: {
    "import.meta.env.VITE_CF_PAGES_URL": JSON.stringify(
      process.env.CF_PAGES_URL || "",
    ),
  },
}));
