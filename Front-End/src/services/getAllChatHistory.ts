import { api } from "@/lib/api";

export const getAllChatHistory = async () => {
  const response = await api["chat-history"].$get();

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));

    throw {
      status: response.status,
      message: errorData || "Something went wrong while fetching chat history.",
    };
  }
  return await response.json();
};
