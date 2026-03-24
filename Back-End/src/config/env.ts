import dotenv from "dotenv";
dotenv.config();

export const ENV = {
  DATABASE_URL: process.env.DATABASE_URL || "",
  OPENROUTER_API_KEY: process.env.OPENROUTER_API_KEY || "",
  NODE_ENV: process.env.NODE_ENV || "development",
}