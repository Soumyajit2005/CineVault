# How to Access Sanity Admin Panel

## Method 1: Through Your Next.js App (Recommended)

1. **Start your development server:**
   ```bash
   npm run dev
   ```

2. **Navigate to the Studio route:**
   Open your browser and go to:
   ```
   http://localhost:3000/studio
   ```

3. **Sign in:**
   - Use your Sanity account credentials
   - If you haven't created one, you'll be prompted to sign up

---

## Method 2: Standalone Sanity Studio

If you have a separate Sanity Studio installation:

1. **Navigate to the Sanity directory:**
   ```bash
   cd sanity
   ```

2. **Start Sanity Studio:**
   ```bash
   npx sanity dev
   ```

3. **Access the studio:**
   Open browser to:
   ```
   http://localhost:3333
   ```

---

## Creating Your First Content

### 1. Create Categories
1. Click on **"Categories"** in the left sidebar
2. Click **"Create new"**
3. Fill in:
   - **Title**: e.g., "Marvel", "DC", "Horror", "Sci-Fi"
   - **Slug**: Auto-generated from title
   - **Type**: Select "Topic" for news categories
   - **Color**: Choose a color (e.g., #8b5cf6 for purple)
   - **Icon**: Add an emoji (e.g., 🦸 for Marvel)
   - **Featured**: Check this to show on homepage
   - **Order**: Number for sorting (1, 2, 3...)
4. Click **"Publish"**

### 2. Create Authors
1. Click on **"Authors"** in the sidebar
2. Click **"Create new"**
3. Fill in:
   - **Name**: Your name or author name
   - **Slug**: Auto-generated
   - **Image**: Upload a profile photo
   - **Bio**: Write a short bio
   - **Email**: Contact email
   - **Role**: Select role (Staff Writer, Editor, etc.)
   - **Expertise**: Add areas of expertise (e.g., "Marvel", "Horror")
   - **Featured**: Check if featured author
4. Click **"Publish"**

### 3. Create News Articles
1. Click on **"News Articles"** in the sidebar
2. Click **"Create new"**
3. Fill in:
   - **Title**: Article headline
   - **Slug**: Auto-generated from title
   - **Headline**: Optional alternative headline
   - **Excerpt**: Short summary (2-3 sentences)
   - **Featured Image**: Upload main image
   - **Content**: Write your article
     - Use the toolbar to add:
       - Images
       - Videos (YouTube/Vimeo URLs)
       - Pull quotes
       - Text formatting
   - **Category**: Select from created categories
   - **Tags**: Add relevant tags
   - **Author**: Select from created authors
   - **Published At**: Set publication date/time
   - **Breaking**: Check for breaking news banner
   - **Featured**: Check for homepage hero
   - **Trending**: Check for trending sidebar
4. Click **"Publish"**

### 4. Create Video Content
1. Click on **"Video Content"** in the sidebar
2. Click **"Create new"**
3. Fill in:
   - **Title**: Video title
   - **Slug**: Auto-generated
   - **Thumbnail**: Upload video thumbnail
   - **Video URL**: YouTube or Vimeo URL
   - **Video Type**: Select YouTube/Vimeo
   - **Duration**: e.g., "15:30" (MM:SS format)
   - **Description**: Video description
   - **Category**: Select category
   - **Video Category**: Select type (review, interview, etc.)
   - **Host**: Select author as host
   - **Featured**: Check to show on homepage
4. Click **"Publish"**

---

## Common Tasks

### Edit Content
1. Find the content in the sidebar
2. Click on the item
3. Make your changes
4. Click **"Publish"** to save

### Unpublish Content
1. Open the content
2. Click the **"..."** menu (three dots)
3. Select **"Unpublish"**

### Delete Content
1. Open the content
2. Click the **"..."** menu
3. Select **"Delete"**
4. Confirm deletion

### Manage Media
1. Click **"Media"** in the sidebar
2. Upload images/videos
3. Search and organize media files

---

## Tips for Best Results

### For Homepage Display:

1. **Breaking News Banner:**
   - Create a news article
   - Check "Breaking" checkbox
   - Only the most recent breaking article shows

2. **Hero Section:**
   - Create a news or feature article
   - Check "Featured" checkbox
   - Add a high-quality featured image
   - Only the most recent featured article shows

3. **Trending Sidebar:**
   - Create articles
   - Check "Trending" checkbox
   - Top 5 trending articles show (sorted by view count)

4. **Category Sections:**
   - Create categories
   - Check "Featured" checkbox
   - Add articles to those categories
   - Top 3 featured categories show on homepage

5. **Featured Videos:**
   - Create video content
   - Check "Featured" checkbox
   - Top 6 featured videos show on homepage

### Image Optimization:
- **Featured Images**: 1200x675px (16:9 ratio)
- **Thumbnails**: 600x400px
- **Author Photos**: 400x400px (square)
- **Format**: JPG or PNG
- **Size**: Keep under 500KB for faster loading

### SEO Best Practices:
- Fill in "SEO Title" (max 60 characters)
- Fill in "SEO Description" (max 160 characters)
- Use descriptive slugs
- Add relevant tags
- Use alt text for images

---

## Troubleshooting

### Can't Access Studio?
1. Check that dev server is running (`npm run dev`)
2. Verify you're logged into Sanity
3. Check your internet connection
4. Clear browser cache

### Changes Not Showing?
1. Make sure you clicked "Publish"
2. Wait 60 seconds (ISR revalidation)
3. Hard refresh browser (Ctrl+Shift+R)
4. Check if content meets display criteria (featured, published date, etc.)

### Images Not Loading?
1. Verify image was uploaded successfully
2. Check Sanity project ID in `.env.local`
3. Ensure image has proper dimensions
4. Try re-uploading the image

---

## Need Help?

- **Sanity Docs**: https://www.sanity.io/docs
- **Sanity Community**: https://slack.sanity.io
- **Next.js Docs**: https://nextjs.org/docs

Enjoy managing your content! 🎬✨
