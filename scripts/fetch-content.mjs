#!/usr/bin/env node

import { createClient } from 'contentful';
import { writeFileSync, mkdirSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

const spaceId = process.env.CONTENTFUL_SPACE_ID;
const accessToken = process.env.CONTENTFUL_ACCESS_TOKEN;
const previewToken = process.env.CONTENTFUL_PREVIEW_TOKEN;

// Skip fetching if credentials aren't configured
if (!spaceId || (!accessToken && !previewToken)) {
  console.log('⚠️ Contentful credentials not configured, using existing blog-posts.json');
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
    const dataDir = join(__dirname, '..', 'src', 'data');
    mkdirSync(dataDir, { recursive: true });
    
    // Write posts to JSON file
    const outputPath = join(dataDir, 'blog-posts.json');
    writeFileSync(outputPath, JSON.stringify(posts, null, 2));
    
    console.log(`📝 Wrote ${posts.length} posts to ${outputPath}`);
    console.log('✨ Content fetch complete!');
  } catch (error) {
    console.error('❌ Failed to fetch content:', error.message);
    process.exit(1);
  }
}

main();
