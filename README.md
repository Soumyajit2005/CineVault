# CineReview - Movie Review Blog

A modern, full-featured movie review blog built with Next.js 16, Sanity CMS, and Tailwind CSS 4.

![CineReview](https://img.shields.io/badge/Next.js-16-black) ![Sanity](https://img.shields.io/badge/Sanity-CMS-red) ![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)

## Features

### Core Features
- **Beautiful UI**: Modern, responsive design with smooth animations and purple-pink gradients
- **Content Management**: Powerful Sanity Studio for managing movies, reviews, authors, and categories
- **Dynamic Pages**:
  - Homepage with featured and recent reviews
  - All reviews page with grid layout
  - Detailed review pages with rich content
  - Movie database with posters and ratings
  - Individual movie pages with all reviews
  - "Movies Like X" recommendation articles
  - Genre/category landing pages
- **Rich Content**: Support for images, formatting, pros/cons, ratings, and more
- **Type Safe**: Full TypeScript support

### Advanced SEO Features ⭐
- ✅ **Comprehensive Schema Markup**: Movie, Review, Article, and Breadcrumb schemas for rich snippets
- ✅ **"Movies Like X" System**: High-converting recommendation content targeting popular searches
- ✅ **Genre Landing Pages**: SEO-optimized category pages with custom branding
- ✅ **Social Sharing**: Multi-platform sharing (Twitter, Facebook, Reddit) with Open Graph tags
- ✅ **Related Content Widgets**: Intelligent movie recommendations based on categories and directors
- ✅ **Newsletter Integration**: Email capture with multiple placement options
- ✅ **Freshness Indicators**: Content update dates to signal current information
- ✅ **SEO-Optimized URLs**: Clean, keyword-rich URL structure following industry best practices
- ✅ **Enhanced Meta Tags**: Optimized titles, descriptions, and keywords for each page type
- ✅ **Internal Linking**: Automated related content suggestions
- ✅ **Performance Optimized**: ISR for fast page loads, CDN-ready images

**See [SEO_IMPLEMENTATION_GUIDE.md](SEO_IMPLEMENTATION_GUIDE.md) for complete SEO documentation**

## Getting Started

### Prerequisites

- Node.js 18+ installed
- A Sanity account (free at [sanity.io](https://sanity.io))

### Installation

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Environment Variables**

   Your `.env.local` file contains:
   ```env
   NEXT_PUBLIC_SANITY_PROJECT_ID=h44n4yvt
   NEXT_PUBLIC_SANITY_DATASET=production
   NEXT_PUBLIC_SANITY_API_VERSION=2024-01-01
   ```

3. **Run the development server**
   ```bash
   npm run dev
   ```

4. **Access the application**
   - Website: http://localhost:3000
   - Sanity Studio: http://localhost:3000/studio

## Content Management

### Adding Content in Sanity Studio

1. **Create an Author** (You!)
   - Go to http://localhost:3000/studio
   - Click "Authors" → "Create"
   - Add your name, image, and bio
   - Generate a slug from your name

2. **Create Categories**
   - Add categories like "Action", "Drama", "Comedy", "Thriller", etc.
   - Assign hex colors for visual distinction (e.g., #FF6B6B for action, #4ECDC4 for drama)

3. **Add Movies**
   - Upload movie posters (recommended: 2:3 aspect ratio, ~400x600px)
   - Add backdrop images for detail pages (recommended: 16:9 aspect ratio, ~1920x1080px)
   - Fill in details: title, director, cast, synopsis, trailer URL, runtime
   - Link to categories
   - Generate slug from title

4. **Write Reviews**
   - Create a new review
   - Link to a movie and author
   - Rate the movie (1-10)
   - Write your review content with rich text formatting
   - Add pros and cons
   - Write a verdict
   - Toggle "Featured" to show on homepage
   - Generate slug from review title

## Project Structure

```
movie-review-blog/
├── app/
│   ├── layout.tsx           # Main layout with navigation & footer
│   ├── page.tsx             # Homepage with hero & featured reviews
│   ├── reviews/
│   │   ├── page.tsx         # All reviews grid
│   │   └── [slug]/
│   │       └── page.tsx     # Review detail page
│   ├── movies/
│   │   ├── page.tsx         # All movies database
│   │   └── [slug]/
│   │       └── page.tsx     # Movie detail with reviews
│   └── studio/
│       └── [[...tool]]/
│           └── page.tsx     # Sanity Studio
├── sanity/
│   ├── lib/
│   │   ├── client.ts        # Sanity client configuration
│   │   ├── image.ts         # Image URL builder
│   │   └── queries.ts       # GROQ queries
│   └── schemaTypes/
│       ├── movie.ts         # Movie schema
│       ├── review.ts        # Review schema
│       ├── category.ts      # Category schema
│       ├── author.ts        # Author schema
│       └── index.ts         # Schema exports
└── sanity.config.ts         # Sanity Studio configuration
```

## Customization

### Changing Colors

The theme uses a purple-to-pink gradient by default. To customize:

1. Edit gradient classes in components:
   - `from-purple-600 to-pink-600` (default)
   - Replace with your colors: `from-blue-600 to-cyan-600`

2. Update Tailwind config for custom colors if needed

### Changing Fonts

Current fonts:
- **Headings**: Playfair Display (serif, elegant)
- **Body**: Inter (sans-serif, modern)

To change, edit `app/layout.tsx`:
```typescript
import { YourFont } from "next/font/google"
```

### Brand Name

To change "CineReview":
1. Edit `app/layout.tsx` - Update navigation and footer
2. Edit metadata titles in page files
3. Update this README

## Deployment

### Deploy to Vercel

1. **Push to GitHub**
   ```bash
   git add .
   git commit -m "Initial commit"
   git push origin main
   ```

2. **Deploy to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Import your repository
   - Add environment variables from `.env.local`
   - Deploy!

3. **Update CORS in Sanity**
   - Go to [sanity.io/manage](https://sanity.io/manage)
   - Select your project
   - Go to "API" → "CORS Origins"
   - Add your Vercel domain (e.g., `https://your-site.vercel.app`)

## Technologies Used

- **Next.js 16** - React framework with App Router
- **Sanity CMS** - Headless CMS for content management
- **Tailwind CSS 4** - Utility-first CSS framework
- **TypeScript** - Type safety
- **Portable Text** - Rich text rendering
- **next-sanity** - Sanity integration for Next.js

## Features Breakdown

### Homepage
- Gradient hero section with call-to-action
- Featured reviews grid (up to 6 movies)
- Recent reviews list (5 most recent)
- Community engagement section

### Reviews
- Beautiful grid layout with movie posters
- Rating badges and featured indicators
- Author avatars and publish dates
- Detailed pages with:
  - Movie backdrop hero
  - Rich text content with images
  - Pros and cons sections
  - Final verdict highlight
  - Author bio

### Movies
- Poster grid with hover effects and info
- Average ratings from all reviews
- Statistics dashboard
- Detailed pages with:
  - Full movie information
  - Cast and crew details
  - Categories with custom colors
  - All reviews aggregated
  - Trailer links

## Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [Sanity Documentation](https://www.sanity.io/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)

## License

This project is open source and available under the MIT License.

## Credits

Built with passion for cinema and film criticism.
