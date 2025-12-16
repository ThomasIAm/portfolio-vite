// Shared security headers configuration
// Used by vite.config.ts for development server
// IMPORTANT: Keep in sync with scripts/generate-headers.mjs

export const CSP_DIRECTIVES = {
  "default-src": ["'self'"],
  "script-src": ["'self'", "'unsafe-inline'"],
  "style-src": ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
  "font-src": ["'self'", "https://fonts.gstatic.com"],
  "img-src": ["'self'", "https:", "data:"],
  "connect-src": ["'self'", "https://cdn.contentful.com", "https://images.ctfassets.net"],
  "frame-ancestors": ["'none'"],
  "base-uri": ["'self'"],
  "form-action": ["'self'"],
} as const;

export function buildCSPHeader(): string {
  return Object.entries(CSP_DIRECTIVES)
    .map(([directive, values]) => `${directive} ${values.join(' ')}`)
    .join('; ');
}

export const SECURITY_HEADERS = {
  'Content-Security-Policy': buildCSPHeader(),
} as const;
