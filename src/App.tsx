import { useState, useRef, useEffect } from "react";
import { Navbar } from "./components/shared/Navbar";
import { SideBar } from "./components/shared/SideBar";
import { ThemeProvider } from "./components/theme-provider";
import { Button } from "./components/ui/button";
import { Textarea } from "./components/ui/textarea";

interface Message {
  id: number;
  role: "user" | "assistant";
  content: string;
}

function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [messages, setMessages] = useState<Message[]>([
    { id: 1, role: "assistant", content: "Hello! How can I help you today?" }
  ]);
  const [inputValue, setInputValue] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = () => {
    if (!inputValue.trim()) return;

    const newMessage: Message = {
      id: messages.length + 1,
      role: "user",
      content: inputValue
    };

    setMessages([...messages, newMessage]);
    setInputValue("");

    // Simulate AI response (replace with actual API call)
    setTimeout(() => {
      const aiResponse: Message = {
        id: messages.length + 2,
        role: "assistant",
        content: "This is a simulated response. Connect to an AI API to get real responses."
      };
      setMessages(prev => [...prev, aiResponse]);
    }, 1000);
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <div className="flex h-screen w-screen overflow-x-hidden">
        <SideBar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />
        <div className="flex-1 flex flex-col h-10000">
          <Navbar />
          <div className="flex-1 overflow-y-auto p-6">
            {/* Chat Messages */}
            <div className="max-w-4xl mx-auto space-y-4 mb-6">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`rounded-lg px-4 py-3 max-w-[80%] ${
                      message.role === "user"
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted"
                    }`}
                  >
                    <p className="whitespace-pre-wrap">{message.content}</p>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
          </div>

          {/* Chat Input */}
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
        </div>
      </div>
    </ThemeProvider>
  );
}

export default App;
