import { queryClient } from "@/lib/query-client";
import { AiRequest } from "@/lib/type";
import { streamChatResponse } from "@/services/AiServices";
import { createNewChat } from "@/services/ChatHistoryServices";
import { createMessage } from "@/services/messageServices";
import { useMutation } from "@tanstack/react-query";
import { useSearchParams } from "react-router-dom";
import { Button } from "../ui/button";
import { Textarea } from "../ui/textarea";

type ChatInputProps = {
  aiRequest: AiRequest[];
  setAiRequest: React.Dispatch<React.SetStateAction<AiRequest[]>>;
  inputValue: string;
  setInputValue: React.Dispatch<React.SetStateAction<string>>;
  refetch: () => void;
};

export const ChatInput = ({
  aiRequest,
  setAiRequest,
  inputValue,
  setInputValue,
  refetch,
}: ChatInputProps) => {
  const [searchParams, setSearchParams] = useSearchParams();

  const { mutate: createChat } = useMutation({
    mutationFn: createNewChat,
    onSuccess: (res) => {
      setSearchParams({ id: res.data.id });
      queryClient.invalidateQueries({ queryKey: ["chatHistories"] });
    },
  });

  const { mutateAsync: mutateCreateMessage } = useMutation({
    mutationFn: createMessage,
  });

  const { mutateAsync: stream } = useMutation({
    mutationFn: (msg: AiRequest[]) =>
      streamChatResponse(msg, (text) => {
        setAiRequest((prev) => {
          const lastMsg = prev[prev.length - 1];
          const newMsg = { ...lastMsg, content: text };
          return [...prev.slice(0, -1), newMsg];
        });
      }),
  });

  const handleSend = async () => {
    if (searchParams.get("id") === null) {
      createChat(inputValue.trim().substring(0, 30) || "New Chat");
      return;
    }
    if (inputValue.trim() === "") return;

    const userMsg: AiRequest = { id: Date.now().toString(), role: "user", content: inputValue };
    const aiMsg: AiRequest = { id: (Date.now() + 1).toString(), role: "assistant", content: "thinking..." };

    const updatedHistoryRequest = [...aiRequest, userMsg];

    setAiRequest([...updatedHistoryRequest, aiMsg]);
    console.log(updatedHistoryRequest);
    setInputValue("");
    await mutateCreateMessage({
      chatHistoryId: searchParams.get("id")!,
      role: "USER",
      content: inputValue.trim(),
    });
    const aiResponse = await stream(updatedHistoryRequest);
    if (typeof aiResponse === "string") {
      await mutateCreateMessage({
        chatHistoryId: searchParams.get("id")!,
        role: "ASSISTANT",
        content: aiResponse,
      });
    }
    refetch();
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
