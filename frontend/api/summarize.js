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
    const name = (body.name || "").toString().trim();
    const description = (body.description || "").toString().trim();
    const stack = Array.isArray(body.tech_stack) ? body.tech_stack.join(", ") : "Modern web stack";
    if (!name) return res.status(400).json({ error: "name required" });

    const system =
      "You are an expert technical copywriter. Given a project name, stack, and description, write exactly 2 punchy sentences that highlight what was built and the impact. Plain text only, no markdown, no quotes.";

    const prompt = `Project: ${name}\nTech Stack: ${stack}\nContext: ${description}`;

    const resp = await client.messages.create({
      model: MODEL,
      max_tokens: 250,
      system,
      messages: [{ role: "user", content: prompt }],
    });

    const summary = (resp.content || []).map((c) => c.text || "").join("").trim();
    return res.status(200).json({ summary });
  } catch (e) {
    console.error("summarize error:", e);
    return res.status(500).json({ error: e.message || "Summarize failed" });
  }
}
