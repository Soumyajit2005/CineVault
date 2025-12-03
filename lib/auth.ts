import { NextAuthOptions } from "next-auth"
import { PrismaAdapter } from "@next-auth/prisma-adapter"
import { prisma } from "@/lib/prisma"
import GithubProvider from "next-auth/providers/github"
import GoogleProvider from "next-auth/providers/google"
import CredentialsProvider from "next-auth/providers/credentials"

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
    CredentialsProvider({
      id: 'email-code',
      name: 'Email Code',
      credentials: {
        email: { label: "Email", type: "email" },
        code: { label: "Code", type: "text" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.code) {
          throw new Error('Email and code are required')
        }

        // Find the verification code
        const verificationCode = await prisma.emailVerificationCode.findFirst({
          where: {
            email: credentials.email,
            code: credentials.code,
            expires: {
              gt: new Date()
            }
          }
        })

        if (!verificationCode) {
          throw new Error('Invalid or expired code')
        }

        // Delete the used code
        await prisma.emailVerificationCode.delete({
          where: {
            id: verificationCode.id
          }
        })

        // Find or create user
        let user = await prisma.user.findUnique({
          where: { email: credentials.email }
        })

        if (!user) {
          // Create new user
          const adminEmails = process.env.ADMIN_EMAILS?.split(',').map(e => e.trim()) || []
          const isAdmin = adminEmails.includes(credentials.email)

          user = await prisma.user.create({
            data: {
              email: credentials.email,
              emailVerified: new Date(),
              isAdmin,
            }
          })
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          image: user.image,
          isAdmin: user.isAdmin,
        }
      }
    }),
  ],
  session: {
    strategy: 'jwt',
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
        token.isAdmin = user.isAdmin
      }
      return token
    },
    async session({ session, token }) {
      if (session?.user) {
        session.user.id = token.id as string
        session.user.isAdmin = token.isAdmin as boolean
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
