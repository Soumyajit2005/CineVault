# Authentication Setup Guide

This guide will help you set up the complete authentication system with GitHub, Google, and Email providers.

## Overview

Your movie blog now has a full authentication system with the following features:

- **Multiple Login Methods**: GitHub OAuth, Google OAuth, and Email Magic Links
- **Admin System**: First user to sign up becomes admin automatically
- **User Features**:
  - Comments on reviews, news, and recommendations
  - Save favorites
  - User profiles
- **Admin Features**:
  - Add/remove content
  - Manage users
  - Delete comments
  - Toggle featured content

## Environment Variables Setup

Create or update your `.env.local` file with the following variables:

```env
# Sanity CMS
NEXT_PUBLIC_SANITY_PROJECT_ID=h44n4yvt
NEXT_PUBLIC_SANITY_DATASET=production
NEXT_PUBLIC_SANITY_API_VERSION=2024-01-01
SANITY_API_READ_TOKEN=
SANITY_API_WRITE_TOKEN=your_sanity_write_token_here

# Site Configuration
NEXT_PUBLIC_SITE_URL=http://localhost:3000

# Database
DATABASE_URL=file:./dev.db

# NextAuth Configuration
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=generate_with_openssl_rand_base64_32

# GitHub OAuth (Required)
GITHUB_ID=your_github_client_id
GITHUB_SECRET=your_github_client_secret

# Google OAuth (Required)
GOOGLE_ID=your_google_client_id
GOOGLE_SECRET=your_google_client_secret

# Email Provider (Optional - for magic link login)
EMAIL_SERVER=smtp://username:password@smtp.example.com:587
EMAIL_FROM=noreply@yourdomain.com
```

## Step-by-Step Setup

### 1. Generate NextAuth Secret

Run this command to generate a secure secret:

```bash
openssl rand -base64 32
```

Copy the output and set it as `NEXTAUTH_SECRET` in `.env.local`

### 2. Set Up GitHub OAuth

1. Go to [GitHub Developer Settings](https://github.com/settings/developers)
2. Click "New OAuth App"
3. Fill in the details:
   - Application name: `Movie Blog (Dev)`
   - Homepage URL: `http://localhost:3000`
   - Authorization callback URL: `http://localhost:3000/api/auth/callback/github`
4. Click "Register application"
5. Copy the **Client ID** to `GITHUB_ID`
6. Click "Generate a new client secret"
7. Copy the **Client Secret** to `GITHUB_SECRET`

### 3. Set Up Google OAuth

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable Google+ API:
   - Go to "APIs & Services" > "Library"
   - Search for "Google+ API"
   - Click "Enable"
4. Create OAuth 2.0 credentials:
   - Go to "APIs & Services" > "Credentials"
   - Click "Create Credentials" > "OAuth client ID"
   - Choose "Web application"
   - Add authorized redirect URI: `http://localhost:3000/api/auth/callback/google`
5. Copy the **Client ID** to `GOOGLE_ID`
6. Copy the **Client Secret** to `GOOGLE_SECRET`

### 4. Set Up Sanity Write Token (Required for Content Creation)

1. Go to [Sanity Manage](https://www.sanity.io/manage)
2. Select your project
3. Go to "API" > "Tokens"
4. Click "Add API token"
5. Name it "Write Token"
6. Set permissions to "Editor"
7. Copy the token to `SANITY_API_WRITE_TOKEN`

### 5. Set Up Email Provider (Optional)

If you want to enable email magic link login:

#### Option A: Using Gmail

```env
EMAIL_SERVER=smtp://your-email@gmail.com:your-app-password@smtp.gmail.com:587
EMAIL_FROM=your-email@gmail.com
```

**Note**: You'll need to generate an [App Password](https://support.google.com/accounts/answer/185833) for Gmail.

#### Option B: Using SendGrid

```env
EMAIL_SERVER=smtp://apikey:your-sendgrid-api-key@smtp.sendgrid.net:587
EMAIL_FROM=noreply@yourdomain.com
```

#### Option C: Using Resend (Recommended)

1. Sign up at [Resend](https://resend.com/)
2. Get your API key
3. Use this format:

```env
EMAIL_SERVER=smtp://resend:your-resend-api-key@smtp.resend.com:587
EMAIL_FROM=onboarding@resend.dev
```

### 6. Initialize Database

The database has already been created, but if you need to reset it:

```bash
# Reset database
npx prisma migrate reset

# Or create fresh
DATABASE_URL=file:./dev.db npx prisma migrate dev --name init
```

### 7. Start Development Server

```bash
npm run dev
```

Visit `http://localhost:3000` and try signing in!

## How It Works

### First User Becomes Admin

The first person to sign up automatically becomes an admin. This is handled in `lib/auth.ts`:

```typescript
events: {
  async createUser({ user }) {
    const userCount = await prisma.user.count()
    if (userCount === 1) {
      await prisma.user.update({
        where: { id: user.id },
        data: { isAdmin: true },
      })
    }
  },
}
```

### Admin vs Regular Users

**Regular Users Can:**
- Sign in with GitHub, Google, or Email
- View all content
- Leave comments
- Save favorites
- View their profile

**Admins Can:**
- Everything regular users can do
- Add/edit/delete content (reviews, recommendations, news)
- Toggle featured content
- Manage all users (view, promote to admin, delete)
- Delete any comment

### API Routes

**Public Routes:**
- `GET /api/comments?contentId=xxx` - Get comments for content

**Authenticated Routes:**
- `POST /api/comments` - Create comment
- `DELETE /api/comments?id=xxx` - Delete own comment
- `GET /api/favorites` - Get user's favorites
- `POST /api/favorites` - Add favorite
- `DELETE /api/favorites?contentId=xxx` - Remove favorite

**Admin Routes:**
- `POST /api/content` - Create content
- `POST /api/toggle-featured` - Toggle featured status
- `GET /api/admin/users` - List all users
- `PATCH /api/admin/users?id=xxx` - Toggle admin status
- `DELETE /api/admin/users?id=xxx` - Delete user

## Using the Features

### Adding Comments

Comments are automatically enabled on all content pages. To add the comment section to a page:

```tsx
import CommentSection from '@/components/CommentSection'

// In your page component
<CommentSection contentId={content._id} contentType={content._type} />
```

### Adding Favorite Button

To add a favorite button to any content:

```tsx
import FavoriteButton from '@/components/FavoriteButton'

// In your page component
<FavoriteButton contentId={content._id} contentType={content._type} />
```

### Checking Admin Status

```tsx
import { useSession } from 'next-auth/react'

function MyComponent() {
  const { data: session } = useSession()

  if (session?.user?.isAdmin) {
    return <AdminControls />
  }

  return <RegularContent />
}
```

## Production Deployment

### 1. Update Environment Variables

Replace development values with production ones:

```env
NEXTAUTH_URL=https://yourdomain.com
NEXT_PUBLIC_SITE_URL=https://yourdomain.com
DATABASE_URL=postgresql://user:password@host:5432/database
```

### 2. Update OAuth Callback URLs

Update your GitHub and Google OAuth apps with production URLs:

- GitHub: `https://yourdomain.com/api/auth/callback/github`
- Google: `https://yourdomain.com/api/auth/callback/google`

### 3. Use Production Database

Switch from SQLite to PostgreSQL or MySQL:

```env
# PostgreSQL
DATABASE_URL=postgresql://user:password@host:5432/database

# or MySQL
DATABASE_URL=mysql://user:password@host:3306/database
```

Then run migrations:

```bash
npx prisma migrate deploy
```

### 4. Update Email Provider

Use a production email service with proper from address:

```env
EMAIL_SERVER=smtp://apikey:production-key@smtp.sendgrid.net:587
EMAIL_FROM=noreply@yourdomain.com
```

## Troubleshooting

### "Email requires adapter" Error

✅ **Fixed!** The Prisma adapter is now configured. Make sure:
- Database is running
- `DATABASE_URL` is set correctly
- Prisma client is generated: `npx prisma generate`

### OAuth Errors

Common issues:
- **Redirect URI mismatch**: Make sure callback URLs match exactly
- **Invalid credentials**: Double-check your client ID and secret
- **Localhost not working**: Some providers don't allow localhost - use `127.0.0.1` instead

### Database Errors

- **Can't find DATABASE_URL**: Make sure `.env.local` exists and has the variable
- **Migration fails**: Try `npx prisma migrate reset` to start fresh
- **SQLite locked**: Close any database viewers and restart

### Email Not Working

- **SMTP connection refused**: Check your email server settings
- **Authentication failed**: Verify username/password or API key
- **Emails not sending**: Check spam folder and email provider logs

## Security Best Practices

1. **Never commit `.env.local`** - It's already in `.gitignore`
2. **Use strong NEXTAUTH_SECRET** - Regenerate for production
3. **Enable 2FA** on your OAuth apps
4. **Rate limit authentication endpoints** in production
5. **Use HTTPS** in production
6. **Keep dependencies updated**: `npm audit fix`

## Next Steps

- [ ] Set up your OAuth providers
- [ ] Sign in and become admin
- [ ] Test commenting on a review
- [ ] Save some favorites
- [ ] Invite friends to test
- [ ] Deploy to production

## Need Help?

- [NextAuth.js Docs](https://next-auth.js.org/)
- [Prisma Docs](https://www.prisma.io/docs)
- [GitHub OAuth Guide](https://docs.github.com/en/developers/apps/building-oauth-apps)
- [Google OAuth Guide](https://developers.google.com/identity/protocols/oauth2)
