import React, { useEffect, useRef, useState } from "react";
import { postChat } from "../lib/api";
import { ChatCircleDots, X, PaperPlaneTilt, CircleNotch, Sparkle } from "@phosphor-icons/react";

const SUGGESTIONS = [
  "What are Katey's top skills?",
  "Has he worked with React and Next.js?",
  "Is he available for hire?",
  "Tell me about his projects",
];

export default function ChatWidget({ referrer }) {
  const [open, setOpen] = useState(false);
  const [sessionId, setSessionId] = useState(null);
  const [messages, setMessages] = useState([
    { role: "assistant", text: "Hey 👋 I'm Katey's AI assistant. Ask me anything about his work, skills, or projects." },
  ]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => {
    if (bottomRef.current) bottomRef.current.scrollTop = bottomRef.current.scrollHeight;
  }, [messages, busy]);

  const ask = async (text) => {
    const q = (text ?? input).trim();
    if (!q || busy) return;
    setInput("");
    setMessages((m) => [...m, { role: "user", text: q }]);
    setBusy(true);
    try {
      const r = await postChat({ session_id: sessionId, message: q, referrer });
      setSessionId(r.session_id);
      setMessages((m) => [...m, { role: "assistant", text: r.reply }]);
    } catch (e) {
      setMessages((m) => [...m, { role: "assistant", text: "Hmm, I couldn't reach the brain. Please try again." }]);
    } finally {
      setBusy(false);
    }
  };

  return (
    <>
      <button
        onClick={() => setOpen((v) => !v)}
        className="chat-fab"
        data-testid="chat-fab"
        aria-label="Open AI chat assistant"
      >
        {open ? <X size={22} weight="bold" /> : <ChatCircleDots size={26} weight="fill" />}
      </button>

      {open && (
        <div className="chat-panel" data-testid="chat-panel">
          <div style={{ padding: "16px 20px", borderBottom: "1px solid var(--line)", display: "flex", alignItems: "center", gap: 10 }}>
            <Sparkle size={16} weight="fill" color="var(--neon)" />
            <div>
              <div className="font-mono" style={{ fontSize: 11, color: "var(--neon)", textTransform: "uppercase", letterSpacing: "0.2em" }}>
                Ask about Katey
              </div>
              <div className="font-mono" style={{ fontSize: 10, color: "var(--text-2)", textTransform: "uppercase", letterSpacing: "0.18em" }}>
                Powered by Claude Sonnet 4.5
              </div>
            </div>
          </div>

          <div
            ref={bottomRef}
            style={{ flex: 1, overflowY: "auto", padding: 16, display: "flex", flexDirection: "column", gap: 12 }}
          >
            {messages.map((m, i) => (
              <div key={i} className={m.role === "user" ? "chat-msg-user" : "chat-msg-bot"} data-testid={`chat-msg-${m.role}-${i}`}>
                {m.text}
              </div>
            ))}
            {busy && (
              <div className="chat-msg-bot" style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
                <CircleNotch size={14} className="spin" /> thinking...
              </div>
            )}
            {messages.length <= 1 && (
              <div style={{ marginTop: 8, display: "flex", flexDirection: "column", gap: 6 }}>
                {SUGGESTIONS.map((s) => (
                  <button
                    key={s}
                    onClick={() => ask(s)}
                    data-testid="chat-suggestion"
                    className="font-mono"
                    style={{
                      textAlign: "left",
                      padding: "10px 12px",
                      background: "transparent",
                      border: "1px dashed var(--line-strong)",
                      color: "var(--text-1)",
                      fontSize: 11,
                      textTransform: "uppercase",
                      letterSpacing: "0.15em",
                      cursor: "none",
                    }}
                  >
                    ▸ {s}
                  </button>
                ))}
              </div>
            )}
          </div>

          <form
            onSubmit={(e) => { e.preventDefault(); ask(); }}
            style={{ padding: 12, borderTop: "1px solid var(--line)", display: "flex", gap: 8 }}
          >
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask anything..."
              data-testid="chat-input"
              style={{
                flex: 1, background: "transparent", border: "1px solid var(--line)",
                color: "var(--text-0)", padding: "10px 12px", outline: "none",
                fontFamily: "Manrope", fontSize: 13,
              }}
            />
            <button
              type="submit"
              disabled={busy || !input.trim()}
              data-testid="chat-send"
              style={{
                background: "var(--neon)", color: "#000", border: "none",
                padding: "0 16px", display: "grid", placeItems: "center",
                cursor: "none",
              }}
            >
              <PaperPlaneTilt size={16} weight="fill" />
            </button>
          </form>
        </div>
      )}
    </>
  );
}
