import { execSync, spawn } from 'child_process';
import type { Plugin } from 'vite';

export function contentfulPlugin(): Plugin {
  let watcher: ReturnType<typeof spawn> | null = null;

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
    },

    closeBundle() {
      if (watcher) {
        watcher.kill();
        watcher = null;
      }
    }
  };
}
