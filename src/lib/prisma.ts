import { PrismaClient } from '@prisma/client';

// PrismaClient wird als globale Variable deklariert, um Hot Reloading zu unterstützen
// https://www.prisma.io/docs/support/help-articles/nextjs-prisma-client-dev-practices

declare global {
  var prisma: PrismaClient | undefined;
}

const prisma = global.prisma || new PrismaClient();

if (process.env.NODE_ENV !== 'production') {
  global.prisma = prisma;
}

export default prisma;
