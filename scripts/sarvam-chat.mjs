import { SarvamAIClient } from "sarvamai";

const apiKey = process.env.SARVAM_API_KEY;
if (!apiKey) {
  throw new Error("SARVAM_API_KEY is empty. Paste your key into .env and rerun.");
}

const client = new SarvamAIClient({ apiSubscriptionKey: apiKey });
const response = await client.chat.completions({
  model: "sarvam-105b-conversations",
  messages: [{ role: "user", content: "Reply with a short greeting." }],
});

console.log(response.choices[0].message.content);
