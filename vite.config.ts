import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";
import { execFileSync } from "node:child_process";
import type { Plugin } from "vite";

function contentfulPlugin(extraEnv: Record<string, string> = {}): Plugin {
  const childEnv = { ...process.env, ...extraEnv };
  return {
    name: "vite-contentful-plugin",

    // Run fetch before build starts
    buildStart() {
      console.log("📡 Fetching content from Contentful...");
      try {
        execFileSync(process.execPath, ["scripts/fetch-content.mjs"], {
          stdio: "inherit",
          env: childEnv,
        });
      } catch (error) {
        console.error("❌ Failed to fetch content:", error);
        throw error;
      }
    },

    // Refresh content on every page load in development
    configureServer(server) {
      const fetchContent = () => {
        try {
          execFileSync(process.execPath, ["scripts/fetch-content.mjs"], {
            stdio: "pipe",
            env: childEnv,
          });
          console.log("🔄 Content refreshed");
        } catch (error) {
          // Dev only: keep serving the last fetched content instead of crashing the dev server.
          console.error("❌ Content refresh failed:", error instanceof Error ? error.message : error);
        }
      };

      // Initial fetch
      fetchContent();

      // Refresh on HTML requests (page loads/refreshes)
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
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  return {
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
  // PostCSS (Tailwind + autoprefixer) is configured in postcss.config.js.
  plugins: [tailwindcss() as unknown as import("postcss").AcceptedPlugin, autoprefixer()],
    },
  },
  plugins: [
    contentfulPlugin(env),
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
  };
});
