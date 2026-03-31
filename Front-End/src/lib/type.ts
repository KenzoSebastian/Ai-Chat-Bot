/* eslint-disable @typescript-eslint/no-explicit-any */
import { InferResponseType } from "hono/client";
import { api } from "./api";

type FetchMessagesResponse = InferResponseType<typeof api.message[":id"]["$get"]>;
export type Message = Extract<FetchMessagesResponse, { data: any }>["data"];
