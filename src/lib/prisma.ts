import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

export const prisma = globalForPrisma.prisma ?? new PrismaClient({
  log: ['error'],
  datasources: {
    db: {
      url: process.env.POSTGRES_PRISMA_URL
    }
  },
  // Disable prepared statements to avoid the "already exists" error
  // This is a workaround for the issue with connection pooling
  __internal: {
    engine: {
      preparedStatements: false
    }
  }
})

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma 