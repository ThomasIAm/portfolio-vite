#!/usr/bin/env node
/**
 * OpenAPI Schema Generator for Cloudflare Pages Functions
 * 
 * This script generates an OpenAPI 3.0.3 schema from the functions directory.
 * Run with: node scripts/generate-openapi.mjs
 * 
 * The generated schema is written to public/openapi.json
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(__dirname, '..');

// Base schema template
const baseSchema = {
  openapi: '3.0.3',
  info: {
    title: 'TvdN.me API',
    description: 'Cloudflare Pages Functions API for tvdn.me personal website',
    version: '1.0.0',
    contact: {
      name: 'Thomas van den Nieuwenhoff',
      url: 'https://tvdn.me'
    }
  },
  servers: [
    {
      url: 'https://tvdn.me',
      description: 'Production'
    }
  ],
  paths: {},
  components: {
    schemas: {}
  },
  tags: []
};

// Function definitions - add new functions here
const functionDefinitions = [
  {
    path: '/api/og-metadata',
    file: 'functions/api/og-metadata.ts',
    tag: 'Metadata',
    tagDescription: 'Open Graph metadata fetching for link previews',
    operations: {
      get: {
        operationId: 'getOgMetadata',
        summary: 'Fetch Open Graph metadata',
        description: 'Fetches Open Graph and Twitter Card metadata from an external URL for link previews',
        parameters: [
          {
            name: 'url',
            in: 'query',
            required: true,
            description: 'The URL to fetch metadata from',
            schema: { type: 'string', format: 'uri', example: 'https://example.com' }
          }
        ],
        responses: {
          200: {
            description: 'Successfully retrieved metadata',
            headers: {
              'Cache-Control': {
                description: 'Caching directive',
                schema: { type: 'string', example: 'public, max-age=86400' }
              }
            },
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/OGMetadata' }
              }
            }
          },
          400: {
            description: 'Bad request - URL parameter missing',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Error' },
                example: { error: 'URL parameter is required' }
              }
            }
          },
          500: {
            description: 'Server error - Failed to fetch metadata',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/MetadataError' }
              }
            }
          }
        }
      },
      options: {
        operationId: 'ogMetadataPreflight',
        summary: 'CORS preflight for OG metadata endpoint',
        responses: {
          200: {
            description: 'CORS preflight response',
            headers: {
              'Access-Control-Allow-Origin': { schema: { type: 'string', example: '*' } },
              'Access-Control-Allow-Methods': { schema: { type: 'string', example: 'GET, POST, OPTIONS' } },
              'Access-Control-Allow-Headers': { schema: { type: 'string', example: 'Content-Type' } }
            }
          }
        }
      }
    }
  },
  {
    path: '/og/{route}',
    file: 'functions/og/[[route]].tsx',
    tag: 'Images',
    tagDescription: 'Dynamic image generation',
    operations: {
      get: {
        operationId: 'generateOgImage',
        summary: 'Generate Open Graph image',
        description: 'Dynamically generates an Open Graph image (1200x630) for social media sharing',
        parameters: [
          {
            name: 'route',
            in: 'path',
            required: true,
            description: 'Route path (catch-all)',
            schema: { type: 'string', example: 'blog/my-post' }
          },
          {
            name: 'title',
            in: 'query',
            required: false,
            description: 'Title to display on the image',
            schema: { type: 'string', default: 'Thomas van den Nieuwenhoff', example: 'My Blog Post Title' }
          },
          {
            name: 'description',
            in: 'query',
            required: false,
            description: 'Description to display on the image',
            schema: { type: 'string', default: 'Lead Cyber Security Consultant', example: 'A brief description of the content' }
          },
          {
            name: 'type',
            in: 'query',
            required: false,
            description: 'Content type - affects image styling',
            schema: { type: 'string', enum: ['website', 'article'], default: 'website', example: 'article' }
          }
        ],
        responses: {
          200: {
            description: 'Generated Open Graph image',
            content: {
              'image/png': {
                schema: { type: 'string', format: 'binary' }
              }
            }
          }
        }
      }
    }
  },
  {
    path: '/sitemap.xml',
    file: 'functions/sitemap.xml.ts',
    tag: 'SEO',
    tagDescription: 'Search engine optimization endpoints',
    operations: {
      get: {
        operationId: 'getSitemap',
        summary: 'Get XML sitemap',
        description: 'Returns an XML sitemap including static routes and dynamically fetched blog posts from Contentful',
        responses: {
          200: {
            description: 'XML sitemap',
            headers: {
              'Cache-Control': {
                description: 'Caching directive',
                schema: { type: 'string', example: 'public, max-age=3600' }
              }
            },
            content: {
              'application/xml': {
                schema: {
                  type: 'string',
                  example: '<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">...</urlset>'
                }
              }
            }
          }
        }
      }
    }
  }
];

// Reusable schemas
const componentSchemas = {
  OGMetadata: {
    type: 'object',
    description: 'Open Graph metadata extracted from a URL',
    properties: {
      title: {
        type: 'string',
        description: 'Page title from og:title or <title> tag',
        example: 'Example Domain'
      },
      description: {
        type: 'string',
        description: 'Page description from og:description or meta description',
        example: 'This domain is for use in illustrative examples.'
      },
      image: {
        type: 'string',
        format: 'uri',
        description: 'Absolute URL to the og:image',
        example: 'https://example.com/image.png'
      },
      siteName: {
        type: 'string',
        description: 'Site name from og:site_name or hostname',
        example: 'Example'
      },
      url: {
        type: 'string',
        format: 'uri',
        description: 'The original URL that was fetched',
        example: 'https://example.com'
      }
    }
  },
  Error: {
    type: 'object',
    required: ['error'],
    properties: {
      error: {
        type: 'string',
        description: 'Error message',
        example: 'URL parameter is required'
      }
    }
  },
  MetadataError: {
    type: 'object',
    required: ['error', 'url'],
    properties: {
      error: {
        type: 'string',
        description: 'Error message',
        example: 'Failed to fetch metadata'
      },
      url: {
        type: 'string',
        format: 'uri',
        description: 'The URL that failed to fetch',
        example: 'https://example.com'
      }
    }
  }
};

function generateSchema() {
  const schema = { ...baseSchema };
  const tags = new Map();

  // Process each function definition
  for (const func of functionDefinitions) {
    // Check if file exists
    const filePath = path.join(projectRoot, func.file);
    if (!fs.existsSync(filePath)) {
      console.warn(`Warning: ${func.file} not found, skipping...`);
      continue;
    }

    // Add tag if not exists
    if (!tags.has(func.tag)) {
      tags.set(func.tag, {
        name: func.tag,
        description: func.tagDescription
      });
    }

    // Build path operations
    const pathOperations = {};
    for (const [method, operation] of Object.entries(func.operations)) {
      pathOperations[method] = {
        ...operation,
        tags: [func.tag]
      };
    }

    schema.paths[func.path] = pathOperations;
  }

  // Add tags
  schema.tags = Array.from(tags.values());

  // Add component schemas
  schema.components.schemas = componentSchemas;

  return schema;
}

function main() {
  console.log('Generating OpenAPI schema...');
  
  const schema = generateSchema();
  const outputPath = path.join(projectRoot, 'public', 'openapi.json');
  
  fs.writeFileSync(outputPath, JSON.stringify(schema, null, 2));
  
  console.log(`OpenAPI schema written to ${outputPath}`);
  console.log(`Documented ${Object.keys(schema.paths).length} endpoints`);
}

main();
