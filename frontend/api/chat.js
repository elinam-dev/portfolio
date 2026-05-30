import Anthropic from "@anthropic-ai/sdk";
import { CV_CONTEXT, MODEL, setCors, readJson } from "./_shared.js";

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
    const history = Array.isArray(body.history) ? body.history.slice(-12) : [];
    const message = (body.message || "").toString().trim();
    const referrer = body.referrer || "";
    if (!message) return res.status(400).json({ error: "message required" });

    const system =
      CV_CONTEXT +
      (referrer ? `\n[Visitor context]: They arrived via "${referrer}". Personalize if relevant.\n` : "");

    const messages = [
      ...history
        .filter((m) => m && m.role && m.content)
        .map((m) => ({ role: m.role === "user" ? "user" : "assistant", content: m.content })),
      { role: "user", content: message },
    ];

    const resp = await client.messages.create({
      model: MODEL,
      max_tokens: 600,
      system,
      messages,
    });

    const reply = (resp.content || []).map((c) => c.text || "").join("").trim();
    return res.status(200).json({ reply });
  } catch (e) {
    console.error("chat error:", e);
    return res.status(500).json({ error: e.message || "Chat failed" });
  }
}
