import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

// Log connection details (without sensitive info)
const dbUrl = process.env.POSTGRES_PRISMA_URL
console.log('Database URL configuration:', {
  hasPgbouncer: dbUrl?.includes('pgbouncer=true'),
  hasConnectionLimit: dbUrl?.includes('connection_limit'),
  hasPoolTimeout: dbUrl?.includes('pool_timeout'),
  isSupabase: dbUrl?.includes('supabase.co')
})

export const prisma = globalForPrisma.prisma ?? new PrismaClient({
  log: ['error'],
  datasources: {
    db: {
      url: process.env.POSTGRES_PRISMA_URL
    }
  }
})

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma 