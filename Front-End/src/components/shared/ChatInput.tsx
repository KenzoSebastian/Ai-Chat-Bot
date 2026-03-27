import { type Message } from "@/App";
import { queryClient } from "@/lib/query-client";
import { streamChatResponse } from "@/services/AiServices";
import { createNewChat } from "@/services/ChatHistoryServices";
import { useMutation } from "@tanstack/react-query";
import { useSearchParams } from "react-router-dom";
import { Button } from "../ui/button";
import { Textarea } from "../ui/textarea";

type ChatInputProps = {
  messages: Message[];
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>;
  inputValue: string;
  setInputValue: React.Dispatch<React.SetStateAction<string>>;
};

export const ChatInput = ({ messages, setMessages, inputValue, setInputValue }: ChatInputProps) => {
  const [searchParams, setSearchParams] = useSearchParams();

  const { mutate: createChat } = useMutation({
    mutationFn: createNewChat,
    onSuccess: (res) => {
      setSearchParams({ id: res.data.id });
      queryClient.invalidateQueries({ queryKey: ["chatHistories"] });
    },
  });

  const { mutate: stream } = useMutation({
    mutationFn: (msg: Message[]) =>
      streamChatResponse(msg, (text) => {
        setMessages((prev) => {
          // 1. Ambil semua pesan kecuali yang paling terakhir
          const otherMessages = prev.slice(0, -1);
          // 2. Ambil pesan terakhir (si asisten yang lagi ngetik)
          const lastMessage = prev[prev.length - 1];

          // 3. Return array baru dengan pesan terakhir yang diupdate kontennya
          return [...otherMessages, { ...lastMessage, content: text }];
        });
      }),
  });
  const handleSend = async () => {
    if (searchParams.get("id") === null) {
      createChat(inputValue.trim().substring(0, 30) || "New Chat");
      return;
    }
    if (inputValue.trim() === "") return;

    const userMsg: Message = { id: Date.now(), role: "user", content: inputValue };
    const aiMsg: Message = { id: Date.now() + 1, role: "assistant", content: "..." };

    // Tambahin user & wadah buat AI ke UI
    setMessages((prev) => [...prev, userMsg, aiMsg]);
    setInputValue("");

    // Baru jalankan streamingnya
    stream(messages);
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };
  return (
    <div className="p-4 sticky bottom-0 z-100 bg-background">
      <div className="max-w-4xl mx-auto flex flex-col gap-2 items-center border rounded-xl px-4 py-3">
        <Textarea
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyPress}
          placeholder="Type your message..."
          className="resize-none min-h-15 max-h-50 border-none focus:ring-0 focus-visible:ring-0 focus:outline-none w-full"
          rows={4}
        />
        <Button onClick={handleSend} className="self-end">
          Send
        </Button>
      </div>
    </div>
  );
};
