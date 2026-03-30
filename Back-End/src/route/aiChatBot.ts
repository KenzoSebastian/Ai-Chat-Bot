import { Hono } from "hono";
import { streamText } from "hono/streaming";
import { stepfun } from "../config/models.js";
import openRouter from "../config/openRouter.js";

const app = new Hono();

const aiChatBotRoute = app.post(async (c) => {
  const messages = await c.req.json();

  return streamText(c, async (stream) => {
    try {
      const chatStream = await openRouter.chat.send({
        chatGenerationParams: {
          model: stepfun,
          messages,
          stream: true,
        },
      });
      for await (const chunk of chatStream) {
        const content = chunk.choices[0]?.delta?.content;
        if (content) {
          await stream.write(content);
          process.stdout.write(content);
        }
      }
    } catch (e: any) {
      console.error("Streaming Error:", e);
      await stream.write(e.rawResponse.statusText || "An error occurred while streaming.");
    }
  });
});

export default aiChatBotRoute;
