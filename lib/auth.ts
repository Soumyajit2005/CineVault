import { NextAuthOptions } from "next-auth"
import { PrismaAdapter } from "@next-auth/prisma-adapter"
import { prisma } from "@/lib/prisma"
import GithubProvider from "next-auth/providers/github"
import GoogleProvider from "next-auth/providers/google"
import EmailProvider from "next-auth/providers/email"

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_ID || "",
      clientSecret: process.env.GITHUB_SECRET || "",
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_ID || "",
      clientSecret: process.env.GOOGLE_SECRET || "",
    }),
    EmailProvider({
      server: process.env.EMAIL_SERVER || "",
      from: process.env.EMAIL_FROM || "noreply@example.com",
    }),
  ],
  callbacks: {
    async session({ session, user }) {
      if (session?.user) {
        session.user.id = user.id
        // Check if user email is in admin list
        const adminEmails = process.env.ADMIN_EMAILS?.split(',').map(e => e.trim()) || []
        session.user.isAdmin = user.email ? adminEmails.includes(user.email) : false
      }
      return session
    },
  },
  events: {
    async createUser({ user }) {
      // Set admin status based on email
      if (user.email) {
        const adminEmails = process.env.ADMIN_EMAILS?.split(',').map(e => e.trim()) || []
        const isAdmin = adminEmails.includes(user.email)

        if (isAdmin) {
          await prisma.user.update({
            where: { id: user.id },
            data: { isAdmin: true },
          })
        }
      }
    },
  },
  pages: {
    signIn: "/auth/signin",
  },
  secret: process.env.NEXTAUTH_SECRET,
}

declare module "next-auth" {
  interface Session {
    user: {
      id: string
      name?: string | null
      email?: string | null
      image?: string | null
      isAdmin: boolean
    }
  }

  interface User {
    isAdmin: boolean
  }
}
