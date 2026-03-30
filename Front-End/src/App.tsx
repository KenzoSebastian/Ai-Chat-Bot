import { useEffect, useRef, useState } from "react";
import { ChatInput } from "./components/shared/ChatInput";
import { Navbar } from "./components/shared/Navbar";
import { SideBar } from "./components/shared/SideBar";
import { ChatBubble } from "./components/shared/ChatBubble";

export type Message = {
  id: number;
  role: "user" | "assistant";
  content: string;
};

function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [messages, setMessages] = useState<Message[]>([
    { id: 1, role: "assistant", content: "Hello! How can I help you today?" },
  ]);
  const [inputValue, setInputValue] = useState("");
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return (
    <div className="flex h-screen w-screen overflow-x-hidden">
      <SideBar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />
      <div className="flex-1 flex flex-col">
        <Navbar />
        <div className="flex-1 overflow-y-auto p-6 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
          {/* Chat Messages */}
          <ChatBubble messages={messages} messagesEndRef={messagesEndRef} />
        </div>

        {/* Chat Input */}
        <ChatInput
          messages={messages}
          setMessages={setMessages}
          inputValue={inputValue}
          setInputValue={setInputValue}
        />
      </div>
    </div>
  );
}

export default App;
