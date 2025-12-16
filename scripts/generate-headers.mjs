// Generate public/_headers from security config
// IMPORTANT: Keep CSP_DIRECTIVES in sync with src/config/security-headers.ts
import { writeFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));

// Mirror the CSP directives from src/config/security-headers.ts
const CSP_DIRECTIVES = {
  "default-src": ["'self'"],
  "script-src": ["'self'", "'unsafe-inline'"],
  "style-src": ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
  "font-src": ["'self'", "https://fonts.gstatic.com"],
  "img-src": ["'self'", "https:", "data:"],
  "connect-src": ["'self'", "https://cdn.contentful.com", "https://images.ctfassets.net"],
  "frame-ancestors": ["'none'"],
  "base-uri": ["'self'"],
  "form-action": ["'self'"],
};

function buildCSPHeader() {
  return Object.entries(CSP_DIRECTIVES)
    .map(([directive, values]) => `${directive} ${values.join(' ')}`)
    .join('; ');
}

const headersContent = `/*
  Content-Security-Policy: ${buildCSPHeader()}
`;

const outputPath = join(__dirname, '../public/_headers');
writeFileSync(outputPath, headersContent);
console.log('✅ Generated public/_headers');
