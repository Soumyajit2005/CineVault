# CineReview Setup Guide

## Installation Steps

### 1. Install Dependencies

```bash
npm install
```

This will install all required dependencies including:
- `@heroicons/react` - Icon library
- `@portabletext/react` - Render Sanity's Portable Text
- Next.js 16 and React 19
- Sanity CMS v4
- Tailwind CSS 4

### 2. Configure Sanity Studio

The Sanity schemas are already created in `sanity/schemaTypes/`. To start using them:

```bash
# Navigate to Sanity Studio (if in separate directory)
cd sanity

# Or access at /studio route in your Next.js app
```

### 3. Create Initial Content in Sanity

#### A. Create Categories
1. Go to Sanity Studio
2. Create categories (e.g., "Marvel", "DC", "Horror", "Sci-Fi")
3. Set category type (genre/topic/content-type)
4. Add colors and icons
5. Mark some as "featured"

#### B. Create Authors
1. Add author profiles with:
   - Name and bio
   - Profile image
   - Role (Staff Writer, Editor, etc.)
   - Expertise areas
   - Social links

#### C. Create News Articles
1. Write news articles with:
   - Title and featured image
   - Select category
   - Write content (supports images, videos, pull quotes)
   - Add tags
   - Mark as "breaking" or "featured" if needed

#### D. Create Videos
1. Add video content:
   - Upload thumbnail
   - Add YouTube/Vimeo URL
   - Set video category (review, interview, etc.)
   - Assign host/guests

### 4. Start Development Server

```bash
npm run dev
```

Visit `http://localhost:3000` to see your site!

## Key Features to Test

### Homepage
- **Breaking News Banner** - Create a news article, mark it as "breaking"
- **Hero Section** - Mark an article as "featured"
- **Latest News** - Will show your 9 most recent news articles
- **Trending Sidebar** - Mark articles as "trending"
- **Category Sections** - Mark categories as "featured"
- **Videos** - Mark videos as "featured"

### Navigation
- **Search** - Click search icon, search across all content
- **Mobile Menu** - Test on mobile/tablet
- **Dropdowns** - Hover over News, Features, Reviews, Videos

### Content Pages
- `/news` - All news articles
- `/news/[slug]` - Individual news article
- `/features/[slug]` - Feature articles
- `/videos` - All videos
- `/videos/[slug]` - Video player page
- `/category/[slug]` - Category archive
- `/author/[slug]` - Author profile + articles

## Environment Variables

Create `.env.local` in the root directory:

```env
NEXT_PUBLIC_SANITY_PROJECT_ID=your_project_id
NEXT_PUBLIC_SANITY_DATASET=production
NEXT_PUBLIC_SANITY_API_VERSION=2024-01-01
SANITY_API_TOKEN=your_token_here
```

## Customization

### Colors
Update in Tailwind config or use inline styles:
- Primary Red: `#ef4444`
- Dark backgrounds: `gray-900` to `black`

### Branding
Update in:
- `app/layout.tsx` - Site title and metadata
- `components/Navigation.tsx` - Logo and tagline
- `components/TopBar.tsx` - Social links

### SEO
Edit `lib/seo.ts` for:
- Schema.org structured data
- Open Graph tags
- Twitter Cards

## Troubleshooting

### Images Not Loading
- Check Sanity project ID and dataset in `.env.local`
- Ensure images are uploaded to Sanity
- Verify `urlFor` helper in `lib/sanity.ts`

### Dark Mode Not Working
- Clear browser localStorage
- Check ThemeContext initialization
- Ensure mounted state in Navigation

### Search Not Working
- Verify Sanity client configuration
- Check CORS settings in Sanity dashboard
- Ensure content exists in Sanity

## Production Deployment

### 1. Build for Production
```bash
npm run build
```

### 2. Deploy to Vercel
```bash
vercel deploy --prod
```

### 3. Configure Environment Variables
Add all `.env.local` variables to Vercel dashboard

### 4. Set Up Domain
Configure custom domain in Vercel settings

## Performance Optimization

- **ISR**: Pages revalidate every 60 seconds
- **Image Optimization**: Next.js Image component with sizes
- **Server Components**: Most components are Server Components
- **Code Splitting**: Automatic with Next.js App Router

## Analytics

Add Google Analytics in `app/layout.tsx`:
```tsx
<Script
  src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"
  strategy="afterInteractive"
/>
```

## Support

For issues or questions:
1. Check `TRANSFORMATION_SUMMARY.md` for complete feature list
2. Review Sanity schema files for data structure
3. Check Next.js 16 and Sanity v4 documentation

---

**Congratulations!** Your entertainment news platform is ready to launch! 🎉
