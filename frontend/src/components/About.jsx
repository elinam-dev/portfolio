import React from "react";
import { Reveal, Counter } from "./Reveal";

export default function About({ cv }) {
  const photo = "https://customer-assets.emergentagent.com/job_premium-dev-hub-15/artifacts/ux3ll6rb_photo_2026-05-13_02-19-51.jpg";

  // Orbit badges around the photo
  const badges = ["React", "Next.js", "TypeScript", "Node.js", "Python", "Docker", "AI", "Tailwind"];

  return (
    <section id="about" data-testid="about-section" style={{ padding: "140px 0 100px", position: "relative" }}>
      <div className="container-wide">
        <Reveal>
          <div className="font-mono" style={{ fontSize: 11, color: "var(--text-1)", marginBottom: 12, letterSpacing: "0.2em" }}>
            [02] — ABOUT
          </div>
        </Reveal>
        <Reveal delay={80}>
          <h2 className="font-display" style={{ fontSize: "clamp(40px, 6vw, 88px)", lineHeight: 1, margin: "0 0 80px", maxWidth: 980, fontWeight: 500 }}>
            A builder, a seller, a <em style={{ color: "var(--neon)", fontStyle: "italic" }}>storyteller</em> in code.
          </h2>
        </Reveal>

        <div style={{ display: "grid", gridTemplateColumns: "minmax(0,1fr) minmax(0,1.2fr)", gap: 80, alignItems: "center" }} className="about-grid">
          <Reveal delay={120}>
            <div style={{ position: "relative", aspectRatio: "1/1", maxWidth: 480 }}>
              <div
                style={{
                  position: "absolute", inset: "10%",
                  background: `url(${photo}) center/cover`,
                  filter: "grayscale(.4) contrast(1.05)",
                  borderRadius: "50%",
                  border: "1px solid var(--line-strong)",
                  boxShadow: "0 0 80px rgba(0,240,255,0.15)",
                }}
                data-testid="about-photo"
              />
              {badges.map((b, i) => {
                const ang = (i / badges.length) * Math.PI * 2;
                const r = 48;
                return (
                  <div
                    key={b}
                    className="font-mono"
                    style={{
                      position: "absolute",
                      left: `${50 + Math.cos(ang) * r}%`,
                      top: `${50 + Math.sin(ang) * r}%`,
                      transform: "translate(-50%, -50%)",
                      fontSize: 10,
                      padding: "6px 10px",
                      border: "1px solid var(--line-strong)",
                      background: "var(--bg-1)",
                      color: "var(--text-0)",
                      textTransform: "uppercase",
                      letterSpacing: "0.18em",
                      animation: `floaty 6s ease-in-out ${i * 0.3}s infinite alternate`,
                    }}
                  >
                    {b}
                  </div>
                );
              })}
            </div>
          </Reveal>

          <Reveal delay={200}>
            <div>
              <p style={{ fontSize: "clamp(16px, 1.4vw, 19px)", lineHeight: 1.7, color: "var(--text-1)", marginBottom: 28 }}>
                I'm <strong style={{ color: "var(--text-0)" }}>Katey Elinam</strong> — a self-taught full stack web developer based in <strong style={{ color: "var(--text-0)" }}>Accra, Ghana</strong>. I build production-grade web apps using <span style={{ color: "var(--neon)" }}>React, Next.js, TypeScript</span>, and Python.
              </p>
              <p style={{ fontSize: "clamp(15px, 1.3vw, 17px)", lineHeight: 1.75, color: "var(--text-1)", marginBottom: 28 }}>
                Beyond code, I founded <strong style={{ color: "var(--text-0)" }}>Watch Hub</strong>, a retail business in Tema — proof I can ship and sell. I balance engineering with hands-on entrepreneurship and currently study Earth Science at the University of Ghana.
              </p>
              <p style={{ fontSize: "clamp(15px, 1.3vw, 17px)", lineHeight: 1.75, color: "var(--text-2)", marginBottom: 0, fontStyle: "italic" }}>
                "I build things people use. That's the whole pitch."
              </p>
            </div>
          </Reveal>
        </div>

        <div
          style={{
            marginTop: 100,
            display: "grid",
            gridTemplateColumns: "repeat(3, minmax(0,1fr))",
            gap: 32,
            borderTop: "1px solid var(--line)",
            paddingTop: 60,
          }}
          className="counter-row"
        >
          {[
            { n: 4, suffix: "+", label: "Years of experience" },
            { n: 4, suffix: "+", label: "Live projects shipped" },
            { n: 25, suffix: "+", label: "Technologies mastered" },
          ].map((c) => (
            <Reveal key={c.label}>
              <div data-testid={`counter-${c.label.replace(/\s/g, "-").toLowerCase()}`}>
                <div className="counter-num">
                  <Counter end={c.n} suffix={c.suffix} />
                </div>
                <div className="font-mono" style={{ fontSize: 11, color: "var(--text-1)", marginTop: 12, textTransform: "uppercase", letterSpacing: "0.2em" }}>
                  {c.label}
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>

      <style>{`
        @keyframes floaty { from { transform: translate(-50%, -50%) translateY(-4px); } to { transform: translate(-50%, -50%) translateY(4px); } }
        @media (max-width: 900px) {
          .about-grid { grid-template-columns: 1fr !important; gap: 48px !important; }
          .counter-row { grid-template-columns: 1fr !important; gap: 40px !important; }
        }
      `}</style>
    </section>
  );
}
