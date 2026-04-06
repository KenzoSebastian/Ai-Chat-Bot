/* eslint-disable react-hooks/set-state-in-effect */
import { useEffect, useRef, useState } from "react";
import { ChatInput } from "./components/shared/ChatInput";
import { Navbar } from "./components/shared/Navbar";
import { SideBar } from "./components/shared/SideBar";
import { ChatBubble } from "./components/shared/ChatBubble";
import { useQuery } from "@tanstack/react-query";
import { fetchMessageByChatHistoryId } from "./services/messageServices";
import { useSearchParams } from "react-router-dom";
import { AiRequest } from "./lib/type";

function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [searchParams] = useSearchParams();
  const [aiRequest, setAiRequest] = useState<AiRequest[]>([]);

  const [inputValue, setInputValue] = useState("");
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const { data: messages, refetch } = useQuery({
    queryKey: ["messages", searchParams.get("id")],
    queryFn: async () => {
      const id = searchParams.get("id");
      if (!id) return { message: "", data: [] };
      return fetchMessageByChatHistoryId(id);
    },
  });

  useEffect(() => {
    setAiRequest(
      messages?.data.map((msg) => ({
        id: msg.id,
        role: msg.role === "USER" ? "user" : "assistant",
        content: msg.content,
      })) || [],
    );
  }, [messages]);

  useEffect(() => {
    scrollToBottom();
  }, [aiRequest]);

  return (
    <div className="flex h-screen w-screen overflow-x-hidden">
      <SideBar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />
      <div className="flex-1 flex flex-col">
        <Navbar />
        {!!messages && (
          <div className="flex-1 overflow-y-auto p-6 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
            {/* Chat Messages */}
            <ChatBubble messages={aiRequest} messagesEndRef={messagesEndRef} />
          </div>
        )}

        {/* Chat Input */}
        {!!messages && (
          <ChatInput
            aiRequest={aiRequest}
            setAiRequest={setAiRequest}
            inputValue={inputValue}
            setInputValue={setInputValue}
            refetch={refetch}
          />
        )}
      </div>
    </div>
  );
}

export default App;
