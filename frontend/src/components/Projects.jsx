import React, { useRef } from "react";
import { Reveal } from "./Reveal";
import { ArrowUpRight, GithubLogo } from "@phosphor-icons/react";

function ProjectCard({ p, idx }) {
  const cardRef = useRef(null);

  const onMove = (e) => {
    const el = cardRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const x = e.clientX - r.left;
    const y = e.clientY - r.top;
    const rx = ((y - r.height / 2) / r.height) * -8;
    const ry = ((x - r.width / 2) / r.width) * 10;
    el.style.transform = `perspective(1000px) rotateX(${rx}deg) rotateY(${ry}deg)`;
    el.style.setProperty("--mx", `${x}px`);
    el.style.setProperty("--my", `${y}px`);
  };
  const onLeave = () => {
    const el = cardRef.current;
    if (!el) return;
    el.style.transform = `perspective(1000px) rotateX(0) rotateY(0)`;
  };

  return (
    <Reveal delay={idx * 60}>
      <div
        ref={cardRef}
        onMouseMove={onMove}
        onMouseLeave={onLeave}
        className="tilt-card"
        data-testid={`project-card-${idx}`}
        style={{
          position: "relative",
          border: "1px solid var(--line)",
          background: "var(--bg-1)",
          padding: 0,
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
          minHeight: 520,
        }}
      >
        <div className="tilt-glow" />
        <div style={{ position: "relative", aspectRatio: "16/10", overflow: "hidden", borderBottom: "1px solid var(--line)" }}>
          <img
            src={p.image}
            alt={p.name}
            loading="lazy"
            style={{ width: "100%", height: "100%", objectFit: "cover", transition: "transform .8s ease" }}
            onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.05)")}
            onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
          />
          <div style={{
            position: "absolute", left: 14, top: 14,
            padding: "4px 8px", fontSize: 10, fontFamily: "JetBrains Mono",
            background: "rgba(0,0,0,0.6)", color: "var(--neon)",
            border: "1px solid var(--neon)", letterSpacing: "0.18em", textTransform: "uppercase",
          }}>
            {p.date}
          </div>
        </div>

        <div style={{ padding: 28, display: "flex", flexDirection: "column", gap: 16, flex: 1 }}>
          <div className="font-mono" style={{ fontSize: 11, color: "var(--neon)", textTransform: "uppercase", letterSpacing: "0.2em" }}>
            {p.tagline}
          </div>
          <h3 className="font-display" style={{ fontSize: "clamp(22px, 2vw, 30px)", margin: 0, fontWeight: 500 }}>
            {p.name}
          </h3>
          <p style={{ color: "var(--text-1)", fontSize: 14.5, lineHeight: 1.65, margin: 0 }}>
            {p.description}
          </p>

          <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginTop: "auto" }}>
            {p.stack.map((s) => (
              <span key={s} className="font-mono" style={{
                fontSize: 10, padding: "4px 8px", border: "1px solid var(--line-strong)",
                color: "var(--text-1)", textTransform: "uppercase", letterSpacing: "0.16em",
              }}>{s}</span>
            ))}
          </div>

          <div style={{ display: "flex", gap: 8, marginTop: 8, alignItems: "center", flexWrap: "wrap" }}>
            {p.github && (
              <a
                href={p.github}
                target="_blank"
                rel="noreferrer"
                className="btn"
                data-testid={`project-github-${idx}`}
                style={{ padding: "12px 18px", fontSize: 10 }}
              >
                <GithubLogo size={14} /> GitHub
              </a>
            )}
            {p.live && (
              <a href={p.live} target="_blank" rel="noreferrer" className="btn btn-primary" style={{ padding: "12px 18px", fontSize: 10 }}>
                <ArrowUpRight size={14} /> Live
              </a>
            )}
          </div>
        </div>
      </div>
    </Reveal>
  );
}

export default function Projects({ cv }) {
  return (
    <section id="projects" data-testid="projects-section" style={{ padding: "120px 0", background: "var(--bg-1)" }}>
      <div className="container-wide">
        <Reveal>
          <div className="font-mono" style={{ fontSize: 11, color: "var(--text-1)", marginBottom: 12, letterSpacing: "0.2em" }}>
            [05] — SELECTED WORK
          </div>
        </Reveal>
        <Reveal delay={80}>
          <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", flexWrap: "wrap", gap: 24, marginBottom: 64 }}>
            <h2 className="font-display" style={{ fontSize: "clamp(40px, 6vw, 88px)", lineHeight: 1, margin: 0, fontWeight: 500, maxWidth: 880 }}>
              Things I've <em style={{ color: "var(--neon)", fontStyle: "italic" }}>actually shipped.</em>
            </h2>
            <p style={{ color: "var(--text-1)", maxWidth: 380, lineHeight: 1.6, marginBottom: 8 }}>
              Live, in-production builds for real clients in Ghana and beyond — each one running today.
            </p>
          </div>
        </Reveal>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(360px, 1fr))",
            gap: 24,
          }}
        >
          {cv.projects.map((p, i) => (
            <ProjectCard key={p.name} p={p} idx={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
