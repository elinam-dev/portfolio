import Anthropic from "@anthropic-ai/sdk";
import { MODEL, setCors, readJson } from "./_shared.js";

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

export default async function handler(req, res) {
  setCors(res);
  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  if (!process.env.ANTHROPIC_API_KEY) {
    return res.status(500).json({ error: "ANTHROPIC_API_KEY not configured" });
  }

  try {
    const body = await readJson(req);
    const text = (body.text || "").toString().trim();
    if (!text) return res.status(400).json({ error: "text required" });

    const system =
      "You are a writing assistant. Rewrite the user's message to be more professional, warm, and clear while preserving meaning, length within ~30%, and voice. Return ONLY the rewritten text — no preface, no quotes.";

    const resp = await client.messages.create({
      model: MODEL,
      max_tokens: 600,
      system,
      messages: [{ role: "user", content: text }],
    });

    const polished = (resp.content || []).map((c) => c.text || "").join("").trim();
    return res.status(200).json({ polished });
  } catch (e) {
    console.error("polish error:", e);
    return res.status(500).json({ error: e.message || "Polish failed" });
  }
}
