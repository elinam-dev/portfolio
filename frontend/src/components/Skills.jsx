import React, { useState } from "react";
import { Reveal } from "./Reveal";

export default function Skills({ cv }) {
  const cats = Object.keys(cv.skills);
  const [active, setActive] = useState(cats[0]);

  return (
    <section id="skills" data-testid="skills-section" style={{ padding: "120px 0", position: "relative", background: "var(--bg-1)" }}>
      <div className="container-wide">
        <Reveal>
          <div className="font-mono" style={{ fontSize: 11, color: "var(--text-1)", marginBottom: 12, letterSpacing: "0.2em" }}>
            [03] — STACK
          </div>
        </Reveal>
        <Reveal delay={80}>
          <h2 className="font-display" style={{ fontSize: "clamp(40px, 6vw, 88px)", lineHeight: 1, margin: "0 0 60px", fontWeight: 500 }}>
            Tools of the <em style={{ color: "var(--neon)", fontStyle: "italic" }}>trade.</em>
          </h2>
        </Reveal>

        <Reveal delay={120}>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 48 }}>
            {cats.map((c) => (
              <button
                key={c}
                onClick={() => setActive(c)}
                data-testid={`skill-tab-${c.toLowerCase()}`}
                className="font-mono"
                style={{
                  padding: "10px 18px",
                  border: "1px solid var(--line-strong)",
                  background: active === c ? "var(--neon)" : "transparent",
                  color: active === c ? "#000" : "var(--text-0)",
                  fontSize: 11,
                  letterSpacing: "0.18em",
                  textTransform: "uppercase",
                  transition: "all .2s",
                }}
              >
                {c}
              </button>
            ))}
          </div>
        </Reveal>

        <Reveal delay={160}>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 12 }}>
            {cv.skills[active].map((s, i) => (
              <span
                key={s}
                className="bubble"
                data-testid={`skill-${s.toLowerCase().replace(/[^a-z0-9]/g, "-")}`}
                style={{ animationDelay: `${i * 0.04}s` }}
              >
                <span style={{ width: 6, height: 6, borderRadius: 6, background: "var(--neon)", boxShadow: "0 0 8px var(--neon-glow)" }} />
                {s}
              </span>
            ))}
          </div>
        </Reveal>

        <Reveal delay={220}>
          <div
            style={{
              marginTop: 80,
              border: "1px solid var(--line)",
              padding: "32px 36px",
              display: "grid",
              gridTemplateColumns: "auto 1fr",
              gap: 32,
              alignItems: "center",
            }}
          >
            <div className="font-mono" style={{ fontSize: 11, color: "var(--neon)", textTransform: "uppercase", letterSpacing: "0.2em" }}>
              Certifications
            </div>
            <div className="marquee">
              {[...cv.certifications, ...cv.certifications].map((c, i) => (
                <span key={i} className="font-mono" style={{ fontSize: 12, color: "var(--text-1)", textTransform: "uppercase", letterSpacing: "0.18em" }}>
                  ◆ {c}
                </span>
              ))}
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
