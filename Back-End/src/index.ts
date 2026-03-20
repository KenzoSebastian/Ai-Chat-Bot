import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { cors } from "hono/cors";
import { ENV } from "./config/env.js";
import chatHistoryRoute from "./route/chatHistory.js";

const app = new Hono();

const routes = app
  .use(cors())
  .get("/", (c) => c.json({ message: "Hello, World!" }))
  .route("/chat-history", chatHistoryRoute)
  .get("/health", (c) => c.json({ status: "ok" }));

ENV.NODE_ENV !== "production" &&
  serve({ fetch: app.fetch, port: 3000 }, (info) => {
    console.log(`🚀 Server running in development mode on http://localhost:${info.port}`);
  });

export type AppType = typeof routes;
export default app;
