import { useEffect, useRef, useState } from "react";
import Markdown from "react-markdown";
import { ChatInput } from "./components/shared/ChatInput";
import { Navbar } from "./components/shared/Navbar";
import { SideBar } from "./components/shared/SideBar";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { atomDark } from "react-syntax-highlighter/dist/esm/styles/prism";

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
  const messagesEndRef = useRef<HTMLDivElement>(null);

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
          <div className="max-w-4xl mx-auto space-y-4 mb-6">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`rounded-lg px-4 py-3 max-w-[80%] ${
                    message.role === "user" ? "bg-primary text-primary-foreground" : "bg-muted"
                  }`}
                >
                  <Markdown
                    components={{
                      // Tambahkan mb-4 (margin bottom) supaya antar paragraf ada jeda
                      p: ({ children }) => (
                        <p className="prose dark:prose-invert max-w-none mb-5 last:mb-0 leading-relaxed">
                          {children}
                        </p>
                      ),

                      code(props) {
                        const { children, className } = props;
                        const match = /language-(\w+)/.exec(className || "");

                        return match ? (
                          <SyntaxHighlighter
                            PreTag="div"
                            children={String(children).replace(/\n$/, "")}
                            language={match[1]}
                            style={atomDark}
                            customStyle={{
                              // Tambahkan margin vertikal (atas-bawah) di kotak kode
                              margin: "1.5rem 0",
                              borderRadius: "12px",
                              fontSize: "0.85rem",
                              lineHeight: "1.6",
                            }}
                          />
                        ) : (
                          <code className="bg-zinc-800 text-zinc-200 px-1.5 py-0.5 rounded-md font-mono text-sm mx-1">
                            {children}
                          </code>
                        );
                      },
                    }}
                  >
                    {message.content}
                  </Markdown>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
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
