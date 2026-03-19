import { withAccelerate } from "@prisma/extension-accelerate";
import { PrismaClient } from "@prisma/client";
import { ENV } from "./env.js";

const globalForPrisma = globalThis as unknown as {
  prisma: any;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    accelerateUrl: ENV.DATABASE_URL,
  }).$extends(withAccelerate());

if (ENV.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
