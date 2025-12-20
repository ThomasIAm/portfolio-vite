# Thomas van den Nieuwenhoff - Portfolio

A modern, responsive portfolio website showcasing my work as a Lead Cyber Security Consultant.

## 🚀 Tech Stack

- **Framework:** React 18 with TypeScript
- **Build Tool:** Vite
- **Styling:** Tailwind CSS
- **UI Components:** shadcn/ui (Radix UI primitives)
- **Content Management:** Contentful CMS
- **Routing:** React Router
- **Data Fetching:** TanStack Query
- **Carousel:** Embla Carousel
- **Charts:** Recharts
- **Forms:** React Hook Form + Zod

## 📦 Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/ThomasIAm/portfolio-vite.git

# Navigate to the project
cd portfolio-vite

# Install dependencies
npm install

# Start the development server
npm run dev
```

### Environment Variables

Create a `.env` file based on `.env.example`:

```env
CONTENTFUL_SPACE_ID=your_space_id
CONTENTFUL_ACCESS_TOKEN=your_access_token
CONTENTFUL_PREVIEW_TOKEN=your_preview_token  # Optional: enables draft content
```

## 🏗️ Build

```bash
# Production build
npm run build

# Preview production build
npm run preview
```

## 🌐 Deploying to Cloudflare Pages

### Quick Deploy

1. Push your code to a GitHub repository
2. Go to [Cloudflare Pages](https://pages.cloudflare.com/) and create a new project
3. Connect your GitHub repository
4. Configure the build settings:
   - **Build command:** `npm run build`
   - **Build output directory:** `dist`
   - **Node.js version:** `18` (or higher)

### Environment Variables

Add these environment variables in Cloudflare Pages dashboard under **Settings → Environment Variables**:

| Variable | Description | Required |
|----------|-------------|----------|
| `CONTENTFUL_SPACE_ID` | Your Contentful space ID | Yes |
| `CONTENTFUL_ACCESS_TOKEN` | Contentful Delivery API token | Yes |
| `CONTENTFUL_PREVIEW_TOKEN` | Contentful Preview API token | No |

### Cloudflare Functions

This project uses Cloudflare Pages Functions for:
- Dynamic OG image generation (`functions/og/`)
- OG metadata fetching API (`functions/api/og-metadata.ts`)
- Dynamic sitemap generation (`functions/sitemap.xml.ts`)
- SEO middleware for meta tag injection (`functions/_middleware.ts`)

These are automatically deployed when you deploy to Cloudflare Pages.

### Custom Domain

1. In Cloudflare Pages, go to your project → **Custom domains**
2. Add your domain and follow the DNS configuration steps
3. SSL is automatically provisioned

## 📁 Project Structure
src/
├── assets/         # Static assets (images, etc.)
├── components/     # Reusable UI components
│   ├── blog/       # Blog-related components
│   ├── layout/     # Layout components (Navigation, Footer)
│   ├── seo/        # SEO components
│   └── ui/         # shadcn/ui components
├── config/         # Configuration files (SEO metadata)
├── data/           # Static data (blog posts JSON)
├── hooks/          # Custom React hooks
├── lib/            # Utility functions and API clients
├── pages/          # Page components
scripts/
└── fetch-content.mjs  # Build-time content fetching from Contentful
functions/
├── api/            # API endpoints (OG metadata fetching)
├── og/             # Dynamic OG image generation
├── _middleware.ts  # Cloudflare Pages middleware (SEO injection)
└── sitemap.xml.ts  # Dynamic sitemap generation
```

## 🔗 Routes

| Route | Description |
|-------|-------------|
| `/` | Home page |
| `/about` | About page with certifications |
| `/projects` | Projects showcase |
| `/blog` | Blog listing with featured carousel |
| `/blog/:slug` | Individual blog post |
| `/blog/series/:slug` | Blog series page |
| `/contact` | Contact page |
| `/privacy` | Privacy policy |
| `/cookies` | Cookie policy |
| `/notice` | Legal notice and attributions |

## 📄 License

All rights reserved.
