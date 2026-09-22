import { PrismaClient } from '@prisma/client'

// Reuse the client across hot reloads / serverless invocations so we don't
// exhaust the database's connection limit.
const globalForPrisma = globalThis

export const prisma = globalForPrisma.prisma ?? new PrismaClient()

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma
}
