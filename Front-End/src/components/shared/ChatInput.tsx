import { type Message } from "@/App";
import { Button } from "../ui/button";
import { Textarea } from "../ui/textarea";
import { api } from "@/lib/api";
import { useSearchParams } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { createNewChat } from "@/services/ChatHistoryServices";
import { queryClient } from "@/lib/query-client";

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
    onSuccess: (data) => {
      setSearchParams({ id: data.id });
      queryClient.invalidateQueries({ queryKey: ["chatHistories"] });
    },
  });
  const handleSend = async () => {
    if (searchParams.get("id") === null) {
      createChat(inputValue.trim().substring(0, 30) || "New Chat");
      return;
    }

    const newMessage: Message = {
      id: messages.length + 1,
      role: "user",
      content: inputValue,
    };

    setMessages([...messages, newMessage]);
    setInputValue("");

    const response = await api["chat-history"].$get();
    const data = await response.json();
    console.log(data);

    // Simulate AI response (replace with actual API call)
    setTimeout(() => {
      const aiResponse: Message = {
        id: messages.length + 2,
        role: "assistant",
        content: "This is a simulated response. Connect to an AI API to get real responses.",
      };
      setMessages((prev) => [...prev, aiResponse]);
    }, 1000);
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
