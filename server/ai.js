const OpenAI = require("openai");

const groq = new OpenAI({
  apiKey: process.env.GROQ_API_KEY,
  baseURL: "https://api.groq.com/openai/v1",
});

async function generateSummary(messages) {
  const chatText = messages
    .map((message) => `${message.nickname}: ${message.text}`)
    .join("\n");

  const response = await groq.responses.create({
    model: "openai/gpt-oss-20b",
    input: `You are a helpful assistant. Summarize the following chat conversation in a short, clear paragraph.
     Focus on key topics, decisions, and questions raised.\n\nChat:\n${chatText}\n\nSummary:`, 
  });

  console.log(response);
  return response.output_text;
}
async function searchMessages(query, messages) {
  const chatText = messages
    .map((message) => `${message.nickname}: ${message.text}`)
    .join("\n");

  const response = await groq.responses.create({
    model: "openai/gpt-oss-20b",
    input: `Chat:\n${chatText}\n\nQuestion: ${query}\n\nAnswer the question using only the chat.`,
  });

  return response.output_text;
}

module.exports = {
  generateSummary,
  searchMessages,
};