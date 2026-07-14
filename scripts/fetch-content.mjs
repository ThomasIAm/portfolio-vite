#!/usr/bin/env node

import { createClient } from 'contentful';
import { writeFileSync, mkdirSync, copyFileSync, existsSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const envPath = join(__dirname, '..', '.env');
if (existsSync(envPath) && typeof process.loadEnvFile === 'function') {
  // Load repo-local .env without overriding vars already set by the host
  // (Cloudflare Pages, CI, or the sandbox shell take precedence).
  try { process.loadEnvFile(envPath); } catch { /* ignore */ }
}
const dataDir = join(__dirname, '..', 'src', 'data');
const outputPath = join(dataDir, 'blog-posts.json');
const samplePath = join(dataDir, 'blog-posts.sample.json');

const spaceId = process.env.CONTENTFUL_SPACE_ID;
const accessToken = process.env.CONTENTFUL_ACCESS_TOKEN;
const previewToken = process.env.CONTENTFUL_PREVIEW_TOKEN;
const useSampleContent = process.env.USE_SAMPLE_CONTENT === 'true';

function useSampleData(reason) {
  console.log(`📦 ${reason}, using sample data`);
  mkdirSync(dataDir, { recursive: true });
  if (!existsSync(samplePath)) {
    throw new Error(`Sample data not found at ${samplePath}`);
  }
  copyFileSync(samplePath, outputPath);
  console.log('📝 Copied blog-posts.sample.json to blog-posts.json');
}

// Explicit opt-in via env flag to use sample content (default in local .env).
// In Cloudflare this variable is unset/false so real Contentful content is fetched.
if (useSampleContent) {
  useSampleData('USE_SAMPLE_CONTENT=true');
  process.exit(0);
}

if (!spaceId || (!accessToken && !previewToken)) {
  console.error('❌ Contentful credentials missing. Set CONTENTFUL_SPACE_ID and CONTENTFUL_ACCESS_TOKEN (or CONTENTFUL_PREVIEW_TOKEN), or set USE_SAMPLE_CONTENT=true to use sample data.');
  process.exit(1);
}

const usePreviewApi = !!previewToken;

const client = createClient({
  space: spaceId,
  accessToken: usePreviewApi ? previewToken : accessToken,
  host: usePreviewApi ? 'preview.contentful.com' : 'cdn.contentful.com',
});

function isValidBlogPost(item) {
  const fields = item?.fields;
  return !!(
    item?.sys?.id &&
    fields?.title &&
    fields?.slug &&
    fields?.excerpt &&
    fields?.content &&
    fields?.publishedDate
  );
}

async function fetchBlogPosts() {
  console.log(`📡 Fetching blog posts from Contentful (${usePreviewApi ? 'Preview' : 'Delivery'} API)...`);
  
  const response = await client.getEntries({
    content_type: 'blogPost',
    order: ['-sys.createdAt'],
    include: 2,
  });

  const posts = response.items.filter(isValidBlogPost);
  console.log(`✅ Found ${posts.length} valid blog posts`);
  
  return posts;
}

async function main() {
  try {
    const posts = await fetchBlogPosts();
    mkdirSync(dataDir, { recursive: true });
    writeFileSync(outputPath, JSON.stringify(posts, null, 2));
    console.log(`📝 Wrote ${posts.length} posts to ${outputPath}`);
    console.log('✨ Content fetch complete!');
  } catch (error) {
    console.error('❌ Failed to fetch content from Contentful:', error.message);
    console.error('   Set USE_SAMPLE_CONTENT=true to build with sample data instead.');
    process.exit(1);
  }
}

main();
