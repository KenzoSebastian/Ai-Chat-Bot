import { Message } from "@/App";
import { api } from "@/lib/api";

export const streamChatResponse = async (
  messages: Message[],
  onChunk: (text: string) => void, // Callback untuk update UI tiap karakter muncul
) => {
  const response = await api["ai-chat-bot"].$post({
    json: messages,
  });

  if (!response.ok) throw new Error("Gagal!");

  // 1. Ambil body sebagai stream reader
  const reader = response.body?.getReader();
  const decoder = new TextDecoder();
  let fullText = "";

  if (!reader) return;

  // 2. Loop terus sampai aliran data habis (done: true)
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    // 3. Ubah biner (Uint8Array) jadi teks string
    const chunk = decoder.decode(value, { stream: true });
    fullText += chunk;

    // 4. Kirim potongan teks ke UI lewat callback
    onChunk(fullText);
  }

  return fullText; // Hasil akhir setelah selesai streaming
};
