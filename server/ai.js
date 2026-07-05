const OpenAI = require("openai");

const groq = new OpenAI({
  apiKey: process.env.GROQ_API_KEY,
  baseURL: "https://api.groq.com/openai/v1",
});


async function generateSummary(messages) {
  const chatText = messages
    .map((m) => `${m.nickname}: ${m.text}`)
    .join("\n");

  const prompt = `You are a helpful assistant. Summarize the
   following chat conversation in a short, clear paragraph. 
   Focus on key topics, decisions, and questions raised.\n\nChat:\n${chatText}\n\nSummary:`;

  const response = await groq.chat.completions.create({
    model: "llama-3.3-70b-versatile",
    messages: [{ role: "user", content: prompt }],
    temperature: 0.4,
  });

  return response.choices[0].message.content.trim();
}


async function searchMessages(query, messages) {
  const chatText = messages
    .map((m, i) => `[${i}] ${m.nickname}: ${m.text}`)
    .join("\n");

  const prompt = `You are a search assistant for a chatroom. Given the chat history below, answer the user's question using only information found in the messages. If relevant, mention who said it. If nothing relevant is found, say so.\n\nChat history:\n${chatText}\n\nQuestion: ${query}\n\nAnswer:`;

  const response = await groq.chat.completions.create({
    model: "llama-3.3-70b-versatile",
    messages: [{ role: "user", content: prompt }],
    temperature: 0.3,
  });

  return response.choices[0].message.content.trim();
}

module.exports = { generateSummary, searchMessages };