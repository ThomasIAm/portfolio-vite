import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";
import { execSync } from "child_process";
import type { Plugin } from "vite";

function contentfulPlugin(): Plugin {
  return {
    name: 'vite-contentful-plugin',
    
    // Run fetch before build starts
    buildStart() {
      console.log('📡 Fetching content from Contentful...');
      try {
        execSync('node scripts/fetch-content.mjs', { 
          stdio: 'inherit',
          env: process.env 
        });
      } catch (error) {
        console.error('❌ Failed to fetch content:', error);
        throw error;
      }
    },

    // Watch mode for development
    configureServer(server) {
      const POLL_INTERVAL = 60000; // Check every 60 seconds in dev
      
      console.log('👀 Content watch mode enabled (polling every 60s)');
      
      const fetchContent = () => {
        try {
          execSync('node scripts/fetch-content.mjs', { 
            stdio: 'pipe',
            env: process.env 
          });
          console.log('🔄 Content refreshed');
        } catch (error) {
          console.error('❌ Content refresh failed');
        }
      };

      // Initial fetch
      fetchContent();

      // Poll for updates
      const interval = setInterval(fetchContent, POLL_INTERVAL);

      server.httpServer?.on('close', () => {
        clearInterval(interval);
      });
    }
  };
}

// https://vitejs.dev/config/
const cspHeader = "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' https: data:; connect-src 'self' https://cdn.contentful.com https://images.ctfassets.net; frame-ancestors 'none'; base-uri 'self'; form-action 'self'";

export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
    headers: {
      'Content-Security-Policy': cspHeader,
    },
  },
  build: {
    sourcemap: true,
  },
  plugins: [
    contentfulPlugin(),
    react(), 
    mode === "development" && componentTagger()
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  define: {
    "import.meta.env.VITE_CF_PAGES_URL": JSON.stringify(process.env.CF_PAGES_URL || ""),
  },
}));