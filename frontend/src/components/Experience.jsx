import React, { useEffect, useRef, useState } from "react";
import { Reveal } from "./Reveal";

export default function Experience({ cv }) {
  const wrapRef = useRef(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const onScroll = () => {
      const rect = el.getBoundingClientRect();
      const vh = window.innerHeight;
      const start = vh * 0.6;
      const end = -rect.height + vh * 0.3;
      const total = start - end;
      const p = Math.max(0, Math.min(1, (start - rect.top) / total));
      setProgress(p * 100);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <section id="experience" data-testid="experience-section" style={{ padding: "120px 0", position: "relative" }}>
      <div className="container-wide">
        <Reveal>
          <div className="font-mono" style={{ fontSize: 11, color: "var(--text-1)", marginBottom: 12, letterSpacing: "0.2em" }}>
            [04] — JOURNEY
          </div>
        </Reveal>
        <Reveal delay={80}>
          <h2 className="font-display" style={{ fontSize: "clamp(40px, 6vw, 88px)", lineHeight: 1, margin: "0 0 80px", fontWeight: 500 }}>
            The <em style={{ color: "var(--neon)", fontStyle: "italic" }}>resume,</em> animated.
          </h2>
        </Reveal>

        <div ref={wrapRef} style={{ position: "relative", paddingLeft: 64 }}>
          <div className="timeline-line" style={{ "--progress": `${progress}%` }} />

          {cv.experience.map((job, idx) => (
            <Reveal key={job.company} delay={idx * 100}>
              <div style={{ position: "relative", marginBottom: 64 }} data-testid={`experience-${idx}`}>
                <div className="timeline-node" style={{ top: 8 }} />
                <div style={{ display: "flex", alignItems: "baseline", gap: 16, flexWrap: "wrap", marginBottom: 6 }}>
                  <h3 className="font-display" style={{ fontSize: "clamp(24px, 2.4vw, 36px)", margin: 0, fontWeight: 500 }}>
                    {job.role}
                  </h3>
                  <span className="font-mono" style={{ fontSize: 11, color: "var(--neon)", textTransform: "uppercase", letterSpacing: "0.18em" }}>
                    @ {job.company}
                  </span>
                </div>
                <div className="font-mono" style={{ fontSize: 11, color: "var(--text-2)", marginBottom: 20, textTransform: "uppercase", letterSpacing: "0.18em" }}>
                  {job.start} — {job.end} · {job.location}
                </div>
                <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "grid", gap: 12, maxWidth: 720 }}>
                  {job.bullets.map((b, i) => (
                    <li key={i} style={{ position: "relative", paddingLeft: 22, color: "var(--text-1)", lineHeight: 1.65 }}>
                      <span style={{ position: "absolute", left: 0, top: 10, width: 10, height: 1, background: "var(--neon)" }} />
                      {b}
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          ))}

          <Reveal>
            <div style={{ position: "relative", marginBottom: 24 }}>
              <div className="timeline-node" style={{ top: 8 }} />
              <h3 className="font-display" style={{ fontSize: "clamp(20px, 2vw, 28px)", margin: "0 0 8px", fontWeight: 500 }}>
                Education
              </h3>
              <div style={{ display: "grid", gap: 16, maxWidth: 720 }}>
                {cv.education.map((e) => (
                  <div key={e.school} className="hairline" style={{ padding: "16px 20px" }}>
                    <div style={{ color: "var(--text-0)", fontSize: 16 }}>{e.degree}</div>
                    <div className="font-mono" style={{ fontSize: 11, color: "var(--text-1)", marginTop: 4, letterSpacing: "0.18em", textTransform: "uppercase" }}>
                      {e.school} · {e.dates}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
