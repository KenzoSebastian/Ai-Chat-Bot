import { OpenRouter } from "@openrouter/sdk";

const openrouter = new OpenRouter({
  apiKey: "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"
});

// Stream the response to get reasoning tokens in usage
const stream = await openrouter.chat.send({
  model: "stepfun/step-3.5-flash:free",
  messages: [
    {
      role: "user",
      content: "How many r's are in the word 'strawberry'?"
    }
  ],
  stream: true
});

let response = "";
for await (const chunk of stream) {
  const content = chunk.choices[0]?.delta?.content;
  if (content) {
    response += content;
    process.stdout.write(content);
  }

  // Usage information comes in the final chunk
  if (chunk.usage) {
    console.log("\nReasoning tokens:", chunk.usage.reasoningTokens);
  }
}