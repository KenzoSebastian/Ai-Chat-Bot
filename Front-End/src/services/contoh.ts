const OPENROUTER_API_KEY = import.meta.env.VITE_OPENROUTER_API_KEY;

if (!OPENROUTER_API_KEY) {
  throw new Error("VITE_OPENROUTER_API_KEY is not set in .env file");
}

export interface ChatMessage {
  role: "user" | "assistant" | "system";
  content: string;
}

export const contoh = async (
  messages: ChatMessage[],
  onStream?: (chunk: string) => void
): Promise<string> => {
  try {
    console.log("Sending messages to OpenRouter:", messages);

    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${OPENROUTER_API_KEY}`,
        "HTTP-Referer": window.location.origin, // Optional: for openrouter analytics
        "X-Title": "AI Chat Bot", // Optional: app name
      },
      body: JSON.stringify({
        model: "stepfun/step-3.5-flash:free",
        messages: messages,
        stream: true,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        `OpenRouter API error ${response.status}: ${errorData?.error?.message || response.statusText}`
      );
    }

    const reader = response.body?.getReader();
    if (!reader) {
      throw new Error("No response body reader available");
    }

    const decoder = new TextDecoder();
    let fullResponse = "";

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      const chunk = decoder.decode(value);
      const lines = chunk.split("\n").filter((line) => line.trim() !== "");

      for (const line of lines) {
        if (line.startsWith("data: ")) {
          const data = line.slice(6);
          if (data === "[DONE]") {
            continue;
          }
          try {
            const parsed = JSON.parse(data);
            const content = parsed.choices[0]?.delta?.content;
            if (content) {
              fullResponse += content;
              if (onStream) {
                onStream(content);
              }
            }
          } catch (e) {
            // Skip invalid JSON lines
            console.warn("Failed to parse SSE chunk:", e);
          }
        }
      }
    }

    console.log("OpenRouter response received");
    return fullResponse;
  } catch (error) {
    console.error("OpenRouter API error:", error);
    throw error;
  }
};
