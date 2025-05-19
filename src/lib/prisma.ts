import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

// Get the base URL from Supabase
const baseUrl = process.env.POSTGRES_PRISMA_URL || ''
// Add PgBouncer parameters if not present
const dbUrl = baseUrl.includes('pgbouncer=true') 
  ? baseUrl 
  : `${baseUrl}${baseUrl.includes('?') ? '&' : '?'}pgbouncer=true&connection_limit=1&pool_timeout=0`

console.log('Database URL configuration:', {
  hasPgbouncer: dbUrl.includes('pgbouncer=true'),
  hasConnectionLimit: dbUrl.includes('connection_limit'),
  hasPoolTimeout: dbUrl.includes('pool_timeout'),
  isSupabase: dbUrl.includes('supabase.co')
})

export const prisma = globalForPrisma.prisma ?? new PrismaClient({
  log: ['error'],
  datasources: {
    db: {
      url: dbUrl
    }
  }
})

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma 