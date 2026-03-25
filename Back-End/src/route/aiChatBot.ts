import { Hono } from "hono";
import openRouter from "../config/openRouter.js";
import { streamText } from "hono/streaming";

const app = new Hono();

const aiChatBotRoute = app.post(async (c) => {
  const messages = await c.req.json();

  // Kita return fungsi streamText
  return streamText(c, async (stream) => {
    try {
      const chatStream = await openRouter.chat.send({
        chatGenerationParams: {
          model: "stepfun/step-3.5-flash:free",
          messages,
          stream: true,
        },
      });

      // Setiap ada potongan (chunk) dari AI, langsung kita "tembak" ke Frontend
      for await (const chunk of chatStream) {
        const content = chunk.choices[0]?.delta?.content;
        if (content) {
          await stream.write(content);
          // Tetap tampilkan di terminal biar kamu bisa pantau
          process.stdout.write(content);
        }
      }
    } catch (e: any) {
      console.error("Streaming Error:", e);
      await stream.write("Aduh, ada error pas streaming AI...");
    }
  });
});

export default aiChatBotRoute;
