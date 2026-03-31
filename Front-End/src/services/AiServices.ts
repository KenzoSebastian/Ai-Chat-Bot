import { api } from "@/lib/api";
import { Message } from "@/lib/type";

export const streamChatResponse = async (
  messages: Message,
  onChunk: (text: string) => void,
) => {
  if (!messages) return;
  
  const messageFiltered = messages.map((msg) => ({
    role: msg.role === "USER" ? "user" : "assistant",
    content: msg.content,
  }));

  console.log(messages);

  const response = await api["ai-chat-bot"].$post({
    json: messageFiltered,
  });

  if (!response.ok) throw new Error("Gagal!");

  const reader = response.body?.getReader();
  const decoder = new TextDecoder();
  let fullText = "";

  if (!reader) return;

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    const chunk = decoder.decode(value, { stream: true });
    fullText += chunk;

    onChunk(fullText);
  }

  return fullText;
};
