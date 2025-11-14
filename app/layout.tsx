import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import Link from "next/link";
import { ThemeProvider } from "@/contexts/ThemeContext";
import Header from "@/components/Header";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
});

export const metadata: Metadata = {
  title: "CineReview - Your Ultimate Movie Review Destination",
  description: "Discover honest, in-depth movie reviews, ratings, and recommendations from passionate film enthusiasts.",
  keywords: ["movie reviews", "film criticism", "movie ratings", "cinema", "film reviews"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth" suppressHydrationWarning>
      <body
        className={`${inter.variable} ${playfair.variable} font-sans antialiased bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 transition-colors`}
      >
        <ThemeProvider>
          <div className="min-h-screen flex flex-col">
            <Header />

            <main className="flex-1">
              {children}
            </main>

            <footer className="border-t border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 transition-colors">
              <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                  <div className="space-y-4">
                    <h3 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent font-[family-name:var(--font-playfair)]">
                      CineReview
                    </h3>
                    <p className="text-sm text-zinc-600 dark:text-zinc-400">
                      Your ultimate destination for honest movie reviews and film recommendations.
                    </p>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-4 text-zinc-900 dark:text-zinc-100">Quick Links</h4>
                    <ul className="space-y-2 text-sm">
                      <li>
                        <Link href="/" className="text-zinc-600 dark:text-zinc-400 hover:text-purple-600 dark:hover:text-purple-400">Home</Link>
                      </li>
                      <li>
                        <Link href="/movies" className="text-zinc-600 dark:text-zinc-400 hover:text-purple-600 dark:hover:text-purple-400">Movies</Link>
                      </li>
                      <li>
                        <Link href="/tv" className="text-zinc-600 dark:text-zinc-400 hover:text-purple-600 dark:hover:text-purple-400">TV Shows</Link>
                      </li>
                      <li>
                        <Link href="/reviews" className="text-zinc-600 dark:text-zinc-400 hover:text-purple-600 dark:hover:text-purple-400">Reviews</Link>
                      </li>
                    </ul>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-4 text-zinc-900 dark:text-zinc-100">Explore</h4>
                    <ul className="space-y-2 text-sm">
                      <li>
                        <Link href="/tags" className="text-zinc-600 dark:text-zinc-400 hover:text-purple-600 dark:hover:text-purple-400">Tags</Link>
                      </li>
                      <li>
                        <Link href="/lists" className="text-zinc-600 dark:text-zinc-400 hover:text-purple-600 dark:hover:text-purple-400">Recommendation Lists</Link>
                      </li>
                      <li>
                        <Link href="/contact" className="text-zinc-600 dark:text-zinc-400 hover:text-purple-600 dark:hover:text-purple-400">Contact</Link>
                      </li>
                      <li>
                        <Link href="/studio" className="text-zinc-600 dark:text-zinc-400 hover:text-purple-600 dark:hover:text-purple-400">Studio</Link>
                      </li>
                    </ul>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-4 text-zinc-900 dark:text-zinc-100">Connect</h4>
                    <p className="text-sm text-zinc-600 dark:text-zinc-400">
                      Follow us for the latest movie reviews and cinema news.
                    </p>
                  </div>
                </div>

                <div className="mt-12 pt-8 border-t border-zinc-200 dark:border-zinc-800 text-center text-sm text-zinc-600 dark:text-zinc-400">
                  <p>&copy; {new Date().getFullYear()} CineReview. All rights reserved.</p>
                </div>
              </div>
            </footer>
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
