import { Hono } from "hono";
import { prisma } from "../config/db.js";

const app = new Hono();

const chatHistoryRoute = app.get("/", async (c) => {
  try {
    const chatHistories = await prisma.chatHistory.findMany();
    return c.json(chatHistories);
  } catch (error) {
    console.error("Error fetching chat histories:", error);
    return c.json({ error: "Failed to fetch chat histories" }, 500);
  }
});

export default chatHistoryRoute;
