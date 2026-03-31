import { z } from "zod";

export const messageSchema = z.object({
  chatHistoryId: z.string(),
  role: z.enum(["USER", "ASSISTANT"]),
  content: z.string(),
});
