import NextAuth from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import { PrismaAdapter } from "@auth/prisma-adapter"
import { PrismaClient } from "@/generated/prisma"

const prisma = new PrismaClient()

const handler = NextAuth({
  debug: true,
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code"
        }
      }
    }),
  ],
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  callbacks: {
    async signIn({ user, account, profile, email, credentials }) {
      console.log("🔍 SignIn Callback Called")
      console.log("User:", JSON.stringify(user, null, 2))
      console.log("Account:", JSON.stringify(account, null, 2))
      console.log("Profile:", JSON.stringify(profile, null, 2))
      return true
    },
    async session({ session, token }) {
      console.log("🔍 Session Callback Called")
      console.log("Session:", JSON.stringify(session, null, 2))
      console.log("Token:", JSON.stringify(token, null, 2))
      
      if (session.user) {
        session.user.id = token.sub || ""
        session.user.email = token.email || null
        session.user.name = token.name || null
      }
      return session
    },
    async jwt({ token, user, account, profile }) {
      console.log("🔍 JWT Callback Called")
      console.log("Token:", JSON.stringify(token, null, 2))
      console.log("User:", JSON.stringify(user, null, 2))
      console.log("Account:", JSON.stringify(account, null, 2))
      
      if (user) {
        token.id = user.id
        token.email = user.email
        token.name = user.name
      }
      return token
    },
    async redirect({ url, baseUrl }) {
      return url.startsWith(baseUrl) ? url : baseUrl
    }
  },
  events: {
    async createUser(message) {
      console.log("🎉 New User Created:", JSON.stringify(message, null, 2))
    },
    async linkAccount(message) {
      console.log("🔗 Account Linked:", JSON.stringify(message, null, 2))
    },
    async session(message) {
      console.log("📍 Session Event:", JSON.stringify(message, null, 2))
    }
  },
  pages: {
    signIn: '/',
    error: '/auth/error',
  },
  secret: process.env.NEXTAUTH_SECRET,
})

export { handler as GET, handler as POST } 