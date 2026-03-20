import { InferRequestType, InferResponseType } from "hono/client";
import { api } from "./api";

export type ChatHistoryResponse = InferResponseType<(typeof api)["chat-history"]["$get"]>;

// export type CreateChatRequest = InferRequestType<(typeof api)["chat-history"]["$post"]>["json"];
