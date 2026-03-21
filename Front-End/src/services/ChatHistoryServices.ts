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

export const createNewChat = async (title: string) => {
  const response = await api["chat-history"].$post({
    json: {
      title,
    },
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));

    throw {
      status: response.status,
      message: errorData || "Something went wrong while creating new chat.",
    };
  }
  return await response.json();
};

export const deleteChatHistory = async (id: string) => {
  const response = await api["chat-history"].$delete({
    json: {
      id,
    },
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));

    throw {
      status: response.status,
      message: errorData || "Something went wrong while deleting chat history.",
    };
  }
  return await response.json();
};
