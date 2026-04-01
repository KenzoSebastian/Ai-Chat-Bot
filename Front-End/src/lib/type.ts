/* eslint-disable @typescript-eslint/no-explicit-any */
import { InferResponseType } from "hono/client";
import { api } from "./api";

type FetchMessagesResponse = InferResponseType<(typeof api.message)[":id"]["$get"]>;
export type Messages = Extract<FetchMessagesResponse, { data: any }>["data"];
export type dataMessage = Messages[number];
export type AiRequest = Omit<dataMessage, "createdAt" | "updatedAt" | "chatHistoryId" | "role"> & {
  role: "user" | "assistant";
};