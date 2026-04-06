import { AiRequest } from "@/lib/type";
import Markdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { atomDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import remarkGfm from "remark-gfm";

type ChatBubbleProps = {
  messages: AiRequest[];
  messagesEndRef: React.RefObject<HTMLDivElement | null>;
};

export const ChatBubble = ({ messages, messagesEndRef }: ChatBubbleProps) => {
  return (
    <div className="max-w-4xl mx-auto space-y-4 mb-6">
      {messages.map((message) => (
        <div key={message.id} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
          <div
            className={`rounded-lg px-4 py-3 max-w-[80%] ${
              message.role === "user" ? "bg-primary text-primary-foreground" : "bg-muted"
            }`}
          >
            <Markdown
            remarkPlugins={[remarkGfm]}
              components={{
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
  );
};
