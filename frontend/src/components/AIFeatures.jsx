import React from "react";
import { Reveal } from "./Reveal";
import { Spotlight } from "@/components/ui/spotlight";
import {
  ChatCircleDots,
  MagicWand,
  Sparkle,
  Eye,
  Brain,
  Lightning,
} from "@phosphor-icons/react";

const FEATURES = [
  {
    icon: ChatCircleDots,
    badge: "AI ASSISTANT · CLAUDE 4.5",
    title: "Ask anything about me",
    desc:
      "A live AI agent trained on my entire CV. Recruiters, clients, or curious devs can ask questions and get real, context-aware answers — 24/7.",
    cta: "Open the chat",
    onClick: () => document.querySelector('[data-testid="chat-fab"]')?.click(),
    accent: "linear-gradient(135deg, rgba(0,240,255,0.25), rgba(0,240,255,0.05))",
  },
  {
    icon: MagicWand,
    badge: "POLISH ENGINE",
    title: "AI-polished outreach",
    desc:
      "The contact form has a one-click ‘polish’ that rewrites your message into a clean, professional brief before you hit send. No more awkward intros.",
    cta: "Try it in the form",
    href: "#contact",
    accent: "linear-gradient(135deg, rgba(168,85,247,0.25), rgba(168,85,247,0.05))",
  },
  {
    icon: Sparkle,
    badge: "PROJECT SUMMARIZER",
    title: "2-sentence project recaps",
    desc:
      "Hover any project and hit ‘AI Summary’ — Claude reads the stack and context, then writes a punchy 2-sentence pitch on the fly.",
    cta: "See the projects",
    href: "#projects",
    accent: "linear-gradient(135deg, rgba(34,197,94,0.25), rgba(34,197,94,0.05))",
  },
  {
    icon: Eye,
    badge: "VISITOR INTELLIGENCE",
    title: "Personalized for you",
    desc:
      "I detect where you came from — LinkedIn, GitHub, a job board, or direct — and quietly tailor my pitch to match what matters to you.",
    accent: "linear-gradient(135deg, rgba(244,114,182,0.25), rgba(244,114,182,0.05))",
  },
  {
    icon: Brain,
    badge: "TRAINED ON MY CV",
    title: "Zero hallucinations",
    desc:
      "Every AI response is grounded in my actual resume. If it’s not in my work history, the assistant will tell you and route you to my inbox.",
    accent: "linear-gradient(135deg, rgba(251,191,36,0.25), rgba(251,191,36,0.05))",
  },
  {
    icon: Lightning,
    badge: "SHIP-READY STACK",
    title: "Built end-to-end",
    desc:
      "React · FastAPI · MongoDB · Claude Sonnet 4.5 · Resend. Every AI feature on this page is real, live, and battle-tested in production.",
    accent: "linear-gradient(135deg, rgba(0,240,255,0.18), rgba(0,240,255,0.02))",
  },
];

export default function AIFeatures() {
  return (
    <section
      id="ai"
      data-testid="ai-features-section"
      style={{
        position: "relative",
        padding: "140px 0 120px",
        overflow: "hidden",
        background: "var(--bg-0)",
      }}
    >
      <Spotlight className="-top-20 left-1/2 -translate-x-1/2" fill="#00f0ff" />

      <div className="container-wide" style={{ position: "relative", zIndex: 5 }}>
        <Reveal>
          <div
            className="font-mono"
            style={{ fontSize: 11, color: "var(--text-1)", marginBottom: 12, letterSpacing: "0.2em" }}
          >
            [AI] — INTELLIGENCE LAYER
          </div>
        </Reveal>
        <Reveal delay={80}>
          <div
            style={{
              display: "flex",
              alignItems: "flex-end",
              justifyContent: "space-between",
              flexWrap: "wrap",
              gap: 24,
              marginBottom: 64,
            }}
          >
            <h2
              className="font-display"
              style={{
                fontSize: "clamp(40px, 6vw, 96px)",
                lineHeight: 0.98,
                margin: 0,
                fontWeight: 500,
                maxWidth: 900,
              }}
            >
              This portfolio is <em style={{ color: "var(--neon)", fontStyle: "italic" }}>actually</em>{" "}
              powered by AI.
            </h2>
            <p style={{ color: "var(--text-1)", maxWidth: 360, lineHeight: 1.6, marginBottom: 8 }}>
              Not a marketing tagline. Six live AI features running on Claude Sonnet 4.5, end-to-end,
              right now on this page.
            </p>
          </div>
        </Reveal>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
            gap: 18,
          }}
        >
          {FEATURES.map((f, i) => {
            const Icon = f.icon;
            const inner = (
              <div
                className="ai-card"
                style={{
                  position: "relative",
                  height: "100%",
                  padding: 28,
                  border: "1px solid var(--line)",
                  background: "var(--bg-1)",
                  display: "flex",
                  flexDirection: "column",
                  gap: 16,
                  overflow: "hidden",
                  transition: "transform .35s ease, border-color .35s ease",
                  cursor: f.onClick || f.href ? "none" : "default",
                }}
                onClick={f.onClick}
              >
                <div
                  aria-hidden
                  style={{
                    position: "absolute",
                    inset: 0,
                    background: f.accent,
                    opacity: 0.45,
                    pointerEvents: "none",
                  }}
                />
                <div style={{ position: "relative", zIndex: 2 }}>
                  <div
                    style={{
                      display: "inline-grid",
                      placeItems: "center",
                      width: 48,
                      height: 48,
                      border: "1px solid var(--line-strong)",
                      background: "rgba(0,0,0,0.4)",
                      color: "var(--neon)",
                      marginBottom: 18,
                    }}
                  >
                    <Icon size={22} weight="duotone" />
                  </div>
                  <div
                    className="font-mono"
                    style={{
                      fontSize: 10,
                      color: "var(--neon)",
                      letterSpacing: "0.22em",
                      textTransform: "uppercase",
                      marginBottom: 10,
                    }}
                  >
                    {f.badge}
                  </div>
                  <h3
                    className="font-display"
                    style={{ fontSize: 24, margin: 0, fontWeight: 500, lineHeight: 1.2 }}
                  >
                    {f.title}
                  </h3>
                  <p
                    style={{
                      color: "var(--text-1)",
                      fontSize: 14.5,
                      lineHeight: 1.65,
                      marginTop: 12,
                      marginBottom: 0,
                    }}
                  >
                    {f.desc}
                  </p>
                  {f.cta && (
                    <div
                      className="font-mono"
                      style={{
                        marginTop: 20,
                        fontSize: 11,
                        color: "var(--text-0)",
                        letterSpacing: "0.18em",
                        textTransform: "uppercase",
                        display: "inline-flex",
                        alignItems: "center",
                        gap: 8,
                      }}
                    >
                      {f.cta} <span style={{ color: "var(--neon)" }}>↗</span>
                    </div>
                  )}
                </div>
              </div>
            );

            return (
              <Reveal key={f.title} delay={i * 50}>
                {f.href ? (
                  <a
                    href={f.href}
                    data-testid={`ai-feature-${i}`}
                    style={{ textDecoration: "none", color: "inherit", display: "block", height: "100%" }}
                  >
                    {inner}
                  </a>
                ) : (
                  <div data-testid={`ai-feature-${i}`} style={{ height: "100%" }}>
                    {inner}
                  </div>
                )}
              </Reveal>
            );
          })}
        </div>
      </div>

      <style>{`
        .ai-card:hover { transform: translateY(-4px); border-color: var(--neon) !important; }
      `}</style>
    </section>
  );
}
