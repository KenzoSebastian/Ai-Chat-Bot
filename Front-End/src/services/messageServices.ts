import { api } from "@/lib/api";

export const fetchMessageByChatHistoryId = async (chatHistoryId: string) => {
const response = await api.message[":id"].$get({param: {id: chatHistoryId}});

  if (!response.ok) throw new Error("Gagal!");

  return await response.json();
};

export const createMessage = async ({
  chatHistoryId,
  role,
  content,
}: {
  chatHistoryId: string;
  role: "USER" | "ASSISTANT";
  content: string;
}) => {
  const response = await api.message.$post({
    json: {
      chatHistoryId,
      role,
      content
    },
  });

  if (!response.ok) throw new Error("Gagal!")

  return await response.json();
};
