# Thomas van den Nieuwenhoff - Portfolio

A modern, responsive portfolio website showcasing my work as a Lead Cyber Security Consultant.

## 🚀 Tech Stack

- **Framework:** React 18 with TypeScript
- **Build Tool:** Vite
- **Styling:** Tailwind CSS
- **UI Components:** shadcn/ui
- **Content Management:** Contentful CMS
- **Routing:** React Router

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

## 📁 Project Structure

```
src/
├── components/     # Reusable UI components
│   ├── layout/     # Layout components (Navigation, Footer)
│   ├── blog/       # Blog-related components
│   ├── seo/        # SEO components
│   └── ui/         # shadcn/ui components
├── hooks/          # Custom React hooks
├── lib/            # Utility functions and API clients
├── pages/          # Page components
└── assets/         # Static assets
```

## 📄 License

All rights reserved.
