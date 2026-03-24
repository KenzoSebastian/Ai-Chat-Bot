import { OpenRouter } from "@openrouter/sdk";
import { ENV } from "./env.js";

const openRouter = new OpenRouter({
  apiKey: ENV.OPENROUTER_API_KEY,
});

export default openRouter;
