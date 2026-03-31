import { Hono } from "hono";
import { prisma } from "../config/db.js";
import { ChatHistory } from "@prisma/client";

const app = new Hono();

const chatHistoryRoute = app
  .get(async (c) => {
    try {
      const data: ChatHistory[] = await prisma.chatHistory.findMany({
        orderBy: { createdAt: "desc" },
      });
      return c.json({mesage: "Chat histories fetched successfully", data}, 200);
    } catch (error) {
      console.error("Error fetching chat histories:", error);
      return c.json({ error: "Failed to fetch chat histories" }, 500);
    }
  })
  .post(async (c) => {
    const { title } = await c.req.json();
    try {
      const newChatHistory: ChatHistory = await prisma.chatHistory.create({
        data: { title },
      });
      return c.json({message: "Chat history created successfully", data: newChatHistory}, 201);
    } catch (error) {
      console.error("Error creating chat history:", error);
      return c.json({ error: "Failed to create chat history", message: error }, 500);
    }
  })
  .patch(async (c) => {
    const { id, title } = await c.req.json();
    try {
      const updateChat: ChatHistory = await prisma.chatHistory.update({
        where: { id },
        data: { title },
      });
      return c.json({message: "Chat history updated successfully", data: updateChat}, 201);
    } catch (error) {
      console.error("Error updating chat history:", error);
      return c.json({ error: "Failed to update chat history", message: error }, 500);
    }
  })
  .delete(async (c) => {
    const { id } = await c.req.json();
    try {
      await prisma.chatHistory.delete({
        where: { id },
      });
      return c.json({ message: "Chat history deleted successfully" }, 200);
    } catch (error) {
      console.error("Error deleting chat history:", error);
      return c.json({ error: "Failed to delete chat history", message: error }, 500);
    }
  });

export default chatHistoryRoute;
