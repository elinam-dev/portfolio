import React from "react";
import Scramble from "./Scramble";
import TypeCycle from "./TypeCycle";
import ParticleMesh from "./ParticleMesh";
import { ArrowDown, DownloadSimple, Sparkle } from "@phosphor-icons/react";

export default function Hero({ cv, headline }) {
  const photo = "https://customer-assets.emergentagent.com/job_premium-dev-hub-15/artifacts/ux3ll6rb_photo_2026-05-13_02-19-51.jpg";

  return (
    <section id="hero" data-testid="hero-section" style={{ position: "relative", minHeight: "100vh", paddingTop: 120, paddingBottom: 60, overflow: "hidden" }}>
      <div style={{ position: "absolute", inset: 0, zIndex: 0 }}>
        <ParticleMesh />
        <div
          aria-hidden
          style={{
            position: "absolute", inset: 0,
            background: "radial-gradient(60% 50% at 70% 50%, rgba(0,240,255,0.12), transparent 70%)",
          }}
        />
      </div>

      <div className="container-wide" style={{ position: "relative", zIndex: 2 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 28 }}>
          <span style={{ width: 8, height: 8, borderRadius: 8, background: "#22c55e", boxShadow: "0 0 12px #22c55e" }} />
          <span className="font-mono" style={{ fontSize: 11, color: "var(--text-1)", textTransform: "uppercase" }} data-testid="availability-status">
            {headline}
          </span>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "minmax(0,1.4fr) minmax(0,1fr)", gap: 48, alignItems: "center" }} className="hero-grid">
          <div>
            <div className="font-mono" style={{ fontSize: 11, color: "var(--text-1)", marginBottom: 16 }}>
              [01] — INTRODUCING
            </div>
            <h1
              className="font-display"
              style={{ fontSize: "clamp(56px, 10vw, 168px)", lineHeight: 0.92, marginBottom: 24, fontWeight: 500 }}
              data-testid="hero-name"
            >
              <Scramble text="KATEY" />
              <br />
              <em style={{ fontStyle: "italic", color: "var(--neon)", fontWeight: 400 }}>
                <Scramble text="Elinam." duration={1700} />
              </em>
            </h1>

            <div
              className="font-mono"
              style={{
                fontSize: "clamp(14px, 1.6vw, 18px)",
                color: "var(--text-1)",
                marginBottom: 40,
                minHeight: "1.6em",
              }}
              data-testid="hero-roles"
            >
              <span style={{ color: "var(--text-2)" }}>&gt; role = </span>
              <span style={{ color: "var(--text-0)" }}>
                <TypeCycle words={cv.roles} />
              </span>
            </div>

            <p style={{ fontSize: "clamp(15px, 1.4vw, 18px)", color: "var(--text-1)", maxWidth: 620, lineHeight: 1.7, marginBottom: 40 }}>
              {cv.bio}
            </p>

            <div style={{ display: "flex", flexWrap: "wrap", gap: 16 }}>
              <button
                className="btn btn-primary"
                data-testid="cta-view-work"
                onClick={() => document.getElementById("projects")?.scrollIntoView({ behavior: "smooth" })}
              >
                <Sparkle size={14} weight="fill" /> View My Work
              </button>
              <a
                className="btn"
                data-testid="cta-download-cv"
                href="https://customer-assets.emergentagent.com/job_premium-dev-hub-15/artifacts/tnqwj4m2_CV.pdf"
                target="_blank"
                rel="noreferrer"
              >
                <DownloadSimple size={14} /> Download CV
              </a>
            </div>
          </div>

          <div style={{ position: "relative", aspectRatio: "3/4", maxWidth: 460, marginLeft: "auto", width: "100%" }} className="hero-photo-wrap">
            <div className="photo-mask" style={{ position: "absolute", inset: 0 }}>
              <img
                src={photo}
                alt="Katey Elinam"
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
                loading="eager"
                data-testid="hero-photo"
              />
            </div>
            <div
              aria-hidden
              style={{
                position: "absolute", left: -16, top: -16, width: 80, height: 80,
                border: "1px solid var(--neon)", boxShadow: "0 0 22px var(--neon-glow)",
              }}
            />
            <div
              aria-hidden
              style={{
                position: "absolute", right: -22, bottom: -22, width: 120, height: 120,
                border: "1px solid var(--line-strong)",
              }}
            />
            <div
              className="font-mono"
              style={{
                position: "absolute", right: -8, top: "50%", transform: "rotate(90deg) translateX(50%)", transformOrigin: "right top",
                fontSize: 10, color: "var(--text-2)",
              }}
            >
              03°35′N · 0°11′W — ACCRA, GH
            </div>
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 80, color: "var(--text-2)" }} className="font-mono" data-testid="scroll-indicator">
          <ArrowDown size={14} />
          <span style={{ fontSize: 11, textTransform: "uppercase" }}>scroll to explore</span>
        </div>
      </div>

      <style>{`
        @media (max-width: 900px) {
          .hero-grid { grid-template-columns: 1fr !important; }
          .hero-photo-wrap { max-width: 340px !important; margin: 0 auto !important; }
        }
      `}</style>
    </section>
  );
}
