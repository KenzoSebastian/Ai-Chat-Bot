import { Hono } from "hono";
import { prisma } from "../config/db.js";
import { ChatHistory } from "@prisma/client";

const app = new Hono();

const chatHistoryRoute = app
  .get(async (c) => {
    try {
      const data: ChatHistory[] = await prisma.chatHistory.findMany();
      return c.json(data);
    } catch (error) {
      console.error("Error fetching chat histories:", error);
      return c.json({ error: "Failed to fetch chat histories" }, 500);
    }
  })
  .post(async (c) => {
    const body = await c.req.json();
    try {
      const newChat = await prisma.chatHistory.create({
        data: { title: body.title },
      });
      return c.json(newChat, 201);
    } catch (error) {
      return c.json({ error: "Failed to create chat history", message: error }, 500);
    }
  });

export default chatHistoryRoute;
