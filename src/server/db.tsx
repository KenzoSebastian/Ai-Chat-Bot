import { PrismaClient } from "@prisma/client";

// Menambahkan tipe prisma ke dalam global variable Node.js
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

// Gunakan instance yang sudah ada, atau buat baru jika belum ada
export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
  });

// Di development, simpan instance ke global variable supaya tidak kena reset saat Hot Reload
if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
