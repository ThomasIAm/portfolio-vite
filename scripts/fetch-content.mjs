#!/usr/bin/env node

import { createClient } from 'contentful';
import { writeFileSync, mkdirSync, copyFileSync, existsSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const dataDir = join(__dirname, '..', 'src', 'data');
const outputPath = join(dataDir, 'blog-posts.json');
const samplePath = join(dataDir, 'blog-posts.sample.json');

const spaceId = process.env.CONTENTFUL_SPACE_ID;
const accessToken = process.env.CONTENTFUL_ACCESS_TOKEN;
const previewToken = process.env.CONTENTFUL_PREVIEW_TOKEN;

// If credentials aren't configured, copy sample data to blog-posts.json
if (!spaceId || (!accessToken && !previewToken)) {
  console.log('⚠️ Contentful credentials not configured, using sample data');
  mkdirSync(dataDir, { recursive: true });
  if (existsSync(samplePath)) {
    copyFileSync(samplePath, outputPath);
    console.log('📝 Copied blog-posts.sample.json to blog-posts.json');
  }
  process.exit(0);
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
    
    // Ensure data directory exists
    mkdirSync(dataDir, { recursive: true });
    
    // Write posts to JSON file
    writeFileSync(outputPath, JSON.stringify(posts, null, 2));
    
    console.log(`📝 Wrote ${posts.length} posts to ${outputPath}`);
    console.log('✨ Content fetch complete!');
  } catch (error) {
    console.error('❌ Failed to fetch content:', error.message);
    process.exit(1);
  }
}

main();
