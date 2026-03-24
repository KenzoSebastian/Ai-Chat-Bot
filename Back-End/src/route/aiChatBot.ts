import { Hono } from "hono";
import openRouter from "../config/openRouter.js";

const app = new Hono();

const aiChatBotRoute = app.post(async (c) => {
  const messages = await c.req.json();
  try {
    const response = await openRouter.chat.send({
      chatGenerationParams: {
        model: "stepfun/step-3.5-flash:free",
        messages,
      },
    });

    console.log(response.choices[0]?.message?.content);

    return c.json({ response });
  } catch (e: any) {
    const error = e.rawValue.error;
    return c.json({ error: error || "Something went wrong" }, 500);
  }
});

export default aiChatBotRoute;
