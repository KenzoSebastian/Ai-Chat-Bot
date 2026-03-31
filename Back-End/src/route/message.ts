import { Hono } from "hono";
import { prisma } from "../config/db.js";
import { Message } from "@prisma/client";
import { zValidator } from "@hono/zod-validator";
import { messageSchema } from "../types/messageType.js";

const app = new Hono();

const messageRoute = app
  .get("/:id", async (c) => {
    const chatHistoryId = c.req.param("id");
    try {
      const messages: Message[] = await prisma.message.findMany({
        where: { chatHistoryId },
        orderBy: { createdAt: "asc" },
      });
      return c.json({ message: "Messages fetched successfully", data: messages }, 200);
    } catch (error) {
      console.error("Error fetching messages:", error);
      return c.json({ error: "Failed to fetch messages" }, 500);
    }
  })
  .post("/", zValidator("json", messageSchema), async (c) => {
    const { chatHistoryId, role, content } = c.req.valid("json");
    try {
      const newMessage: Message = await prisma.message.create({
        data: {
          chatHistoryId,
          role,
          content,
        },
      });

      return c.json({ message: "Message created successfully", data: newMessage }, 201);
    } catch (error) {
      console.error("Error creating message:", error);
      return c.json({ error: "Failed to create message", message: error }, 500);
    }
  });

export default messageRoute;
