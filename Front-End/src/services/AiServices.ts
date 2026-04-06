import { api } from "@/lib/api";
import { AiRequest } from "@/lib/type";

export const streamChatResponse = async (
  messages: AiRequest[],
  onChunk: (text: string) => void,
) => {
  if (!messages) return;

  const messageSlice = messages.slice(-30); // Ambil 30 pesan terakhir untuk konteks

  const response = await api["ai-chat-bot"].$post({
    json: messageSlice,
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
