import NextAuth from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import { PrismaAdapter } from "@auth/prisma-adapter"
import { prisma } from "@/lib/prisma"

const handler = NextAuth({
  debug: true,
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      authorization: {
        params: {
          prompt: "select_account",
          access_type: "offline",
          response_type: "code",
          include_granted_scopes: "true",
          scope: "openid email profile"
        }
      }
    }),
  ],
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  pages: {
    signIn: '/',
    error: '/auth/error',
  },
  callbacks: {
    async signIn({ user, account, profile, email, credentials }) {
      console.log("🔍 SignIn Callback Called")
      console.log("User:", JSON.stringify(user, null, 2))
      console.log("Account:", JSON.stringify(account, null, 2))
      console.log("Profile:", JSON.stringify(profile, null, 2))
      console.log('Prepared statements disabled?', process.env.PRISMA_DISABLE_PREPARED_STATEMENTS);
      console.log('Database URL:', process.env.DATABASE_URL || process.env.PRISMA_DATABASE_URL);
      return true
    },
    async session({ session, token }) {
      console.log("🔍 Session Callback Called")
      console.log("Session:", JSON.stringify(session, null, 2))
      console.log("Token:", JSON.stringify(token, null, 2))
      
      if (token && session.user) {
        session.user.id = token.id as string
        session.user.name = token.name as string
        session.user.email = token.email as string
        session.user.image = token.picture as string
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
        token.picture = user.image
      }
      return token
    },
    async redirect({ url, baseUrl }) {
      // Prevent any loading state during redirects
      if (url.startsWith(baseUrl)) {
        return url
      }
      return baseUrl
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
  secret: process.env.NEXTAUTH_SECRET,
})

export { handler as GET, handler as POST } 