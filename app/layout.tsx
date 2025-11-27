import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import Link from "next/link";
import { Providers } from "./providers";
import Navigation from "@/components/Navigation";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
});

export const metadata: Metadata = {
  title: {
    default: "CineReview - Entertainment News, Reviews & Features",
    template: "%s | CineReview",
  },
  description: "Your source for the latest entertainment news, in-depth movie and TV reviews, exclusive interviews, and video content.",
  keywords: ["entertainment news", "movie reviews", "tv reviews", "film news", "celebrity interviews", "video reviews"],
  authors: [{ name: "CineReview Team" }],
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://cinereview.com",
    siteName: "CineReview",
    title: "CineReview - Entertainment News, Reviews & Features",
    description: "Your source for the latest entertainment news, movie and TV reviews, and exclusive content.",
  },
  twitter: {
    card: "summary_large_image",
    title: "CineReview",
    description: "Entertainment news, reviews & features",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  const theme = localStorage.getItem('theme') ||
                    (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
                  document.documentElement.classList.toggle('dark', theme === 'dark');
                } catch (e) {}
              })();
            `,
          }}
        />
      </head>
      <body
        className={`${inter.variable} ${playfair.variable} font-sans antialiased bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 transition-colors`}
        suppressHydrationWarning
      >
        <Providers>
          <div className="min-h-screen flex flex-col">
            <Navigation />

            <main className="flex-1">
              {children}
            </main>

            <footer className="bg-gray-900 dark:bg-black text-white">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                  {/* Brand */}
                  <div className="space-y-4">
                    <div className="flex items-center gap-2">
                      <div className="w-10 h-10 bg-gradient-to-br from-red-600 to-red-800 rounded flex items-center justify-center">
                        <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M2 6a2 2 0 012-2h6a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V6zM14.553 7.106A1 1 0 0014 8v4a1 1 0 00.553.894l2 1A1 1 0 0018 13V7a1 1 0 00-1.447-.894l-2 1z" />
                        </svg>
                      </div>
                      <span className="text-xl font-bold">CineReview</span>
                    </div>
                    <p className="text-sm text-gray-400">
                      Your source for entertainment news, reviews, and exclusive content.
                    </p>
                  </div>

                  {/* Content */}
                  <div>
                    <h4 className="font-semibold mb-4 text-white">Content</h4>
                    <ul className="space-y-2 text-sm">
                      <li>
                        <Link href="/news" className="text-gray-400 hover:text-white transition-colors">News</Link>
                      </li>
                      <li>
                        <Link href="/features" className="text-gray-400 hover:text-white transition-colors">Features</Link>
                      </li>
                      <li>
                        <Link href="/reviews" className="text-gray-400 hover:text-white transition-colors">Reviews</Link>
                      </li>
                      <li>
                        <Link href="/videos" className="text-gray-400 hover:text-white transition-colors">Videos</Link>
                      </li>
                    </ul>
                  </div>

                  {/* Explore */}
                  <div>
                    <h4 className="font-semibold mb-4 text-white">Explore</h4>
                    <ul className="space-y-2 text-sm">
                      <li>
                        <Link href="/movies" className="text-gray-400 hover:text-white transition-colors">Movies</Link>
                      </li>
                      <li>
                        <Link href="/tv" className="text-gray-400 hover:text-white transition-colors">TV Series</Link>
                      </li>
                      <li>
                        <Link href="/categories" className="text-gray-400 hover:text-white transition-colors">Categories</Link>
                      </li>
                      <li>
                        <Link href="/authors" className="text-gray-400 hover:text-white transition-colors">Authors</Link>
                      </li>
                    </ul>
                  </div>

                  {/* Follow */}
                  <div>
                    <h4 className="font-semibold mb-4 text-white">Follow Us</h4>
                    <div className="flex gap-4 mb-4">
                      <Link href="https://twitter.com" target="_blank" className="text-gray-400 hover:text-white transition-colors">
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                        </svg>
                      </Link>
                      <Link href="https://facebook.com" target="_blank" className="text-gray-400 hover:text-white transition-colors">
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                        </svg>
                      </Link>
                      <Link href="https://youtube.com" target="_blank" className="text-gray-400 hover:text-white transition-colors">
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                        </svg>
                      </Link>
                    </div>
                    <ul className="space-y-2 text-sm">
                      <li>
                        <Link href="/contact" className="text-gray-400 hover:text-white transition-colors">Contact</Link>
                      </li>
                      <li>
                        <Link href="/studio" className="text-gray-400 hover:text-white transition-colors">Studio</Link>
                      </li>
                    </ul>
                  </div>
                </div>

                {/* Bottom Bar */}
                <div className="mt-12 pt-8 border-t border-gray-800 flex flex-col sm:flex-row justify-between items-center gap-4 text-sm text-gray-400">
                  <p>&copy; 2024 CineReview. All rights reserved.</p>
                  <div className="flex gap-6">
                    <Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
                    <Link href="/terms" className="hover:text-white transition-colors">Terms of Service</Link>
                  </div>
                </div>
              </div>
            </footer>
          </div>
        </Providers>
      </body>
    </html>
  );
}
