import { PrismaClient } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'

// Reuse the client across hot reloads / serverless invocations so we don't
// exhaust the database's connection limit.
const globalForPrisma = globalThis

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL })

export const prisma = globalForPrisma.prisma ?? new PrismaClient({ adapter })

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma
}
