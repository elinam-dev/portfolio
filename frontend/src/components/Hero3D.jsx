import React from "react";
import { Spotlight } from "@/components/ui/spotlight";
import { SplineScene } from "@/components/ui/splite";
import { Sparkle, ArrowDown, DownloadSimple, Lightning } from "@phosphor-icons/react";
import TypeCycle from "./TypeCycle";

/**
 * Premium Hero with Spline 3D scene + spotlight + glassmorphic info card overlay.
 */
export default function Hero3D({ cv, headline }) {
  return (
    <section
      id="hero"
      data-testid="hero-section"
      style={{
        position: "relative",
        minHeight: "100vh",
        paddingTop: 110,
        paddingBottom: 60,
        overflow: "hidden",
        background:
          "radial-gradient(120% 60% at 50% 0%, rgba(0,240,255,0.08), transparent 70%), var(--bg-0)",
      }}
    >
      <Spotlight className="-top-40 left-0 md:left-60 md:-top-20" fill="#00f0ff" />

      <div
        className="container-wide"
        style={{ position: "relative", zIndex: 5, paddingTop: 24 }}
      >
        {/* Status row */}
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 28 }}>
          <span
            style={{
              width: 8,
              height: 8,
              borderRadius: 8,
              background: "#22c55e",
              boxShadow: "0 0 12px #22c55e",
              animation: "pulse 1.6s ease-in-out infinite",
            }}
          />
          <span
            className="font-mono"
            style={{
              fontSize: 11,
              color: "var(--text-1)",
              textTransform: "uppercase",
              letterSpacing: "0.2em",
            }}
            data-testid="availability-status"
          >
            {headline}
          </span>
        </div>

        {/* Hero grid */}
        <div
          className="hero-3d-grid"
          style={{
            display: "grid",
            gridTemplateColumns: "minmax(0, 1.1fr) minmax(0, 1fr)",
            gap: 32,
            alignItems: "center",
          }}
        >
          {/* Left: content */}
          <div style={{ position: "relative", zIndex: 10 }}>
            <div
              className="font-mono"
              style={{ fontSize: 11, color: "var(--text-1)", marginBottom: 16, letterSpacing: "0.2em" }}
            >
              [01] — DEVELOPER · ENTREPRENEUR · BUILDER
            </div>

            <h1
              className="font-display"
              style={{
                fontSize: "clamp(56px, 9.2vw, 152px)",
                lineHeight: 0.92,
                marginBottom: 22,
                fontWeight: 500,
                letterSpacing: "-0.03em",
              }}
              data-testid="hero-name"
            >
              <span
                style={{
                  background: "linear-gradient(180deg, #ffffff 0%, #9ca3af 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                KATEY
              </span>
              <br />
              <em
                style={{
                  fontStyle: "italic",
                  color: "var(--neon)",
                  fontWeight: 400,
                  textShadow: "0 0 36px var(--neon-glow)",
                }}
              >
                Elinam.
              </em>
            </h1>

            <div
              className="font-mono"
              style={{
                fontSize: "clamp(13px, 1.4vw, 17px)",
                color: "var(--text-1)",
                marginBottom: 28,
                minHeight: "1.6em",
              }}
              data-testid="hero-roles"
            >
              <span style={{ color: "var(--text-2)" }}>&gt; building::</span>{" "}
              <span style={{ color: "var(--neon)" }}>
                <TypeCycle words={cv.roles} />
              </span>
            </div>

            <p
              style={{
                fontSize: "clamp(15px, 1.3vw, 18px)",
                color: "var(--text-1)",
                maxWidth: 540,
                lineHeight: 1.7,
                marginBottom: 36,
              }}
            >
              {cv.bio}
            </p>

            <div style={{ display: "flex", flexWrap: "wrap", gap: 14 }}>
              <button
                className="btn btn-primary"
                data-testid="cta-view-work"
                onClick={() =>
                  document.getElementById("projects")?.scrollIntoView({ behavior: "smooth" })
                }
              >
                <Sparkle size={14} weight="fill" /> View My Work
              </button>
              <button
                className="btn"
                data-testid="cta-contact"
                onClick={() =>
                  document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" })
                }
              >
                <Lightning size={14} weight="fill" /> Get In Touch
              </button>
              <a
                className="btn"
                data-testid="cta-download-cv"
                href="https://customer-assets.emergentagent.com/job_premium-dev-hub-15/artifacts/tnqwj4m2_CV.pdf"
                target="_blank"
                rel="noreferrer"
              >
                <DownloadSimple size={14} /> CV
              </a>
            </div>

            {/* Quick stats */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(3, 1fr)",
                gap: 24,
                marginTop: 56,
                paddingTop: 32,
                borderTop: "1px solid var(--line)",
                maxWidth: 540,
              }}
            >
              {[
            { v: "4+", l: "Years" },
            { v: "10+", l: "Projects" },
            { v: "25+", l: "Tools" },
          ].map((s) => (
                <div key={s.l}>
                  <div
                    className="font-display"
                    style={{ fontSize: 32, lineHeight: 1, color: "var(--neon)", fontWeight: 500 }}
                  >
                    {s.v}
                  </div>
                  <div
                    className="font-mono"
                    style={{
                      fontSize: 10,
                      color: "var(--text-2)",
                      textTransform: "uppercase",
                      letterSpacing: "0.2em",
                      marginTop: 6,
                    }}
                  >
                    {s.l}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right: 3D Spline scene (borderless, full-bleed) */}
          <div
            style={{
              position: "relative",
              height: "min(72vh, 640px)",
              minHeight: 420,
            }}
            data-testid="hero-spline"
          >
            <SplineScene
              scene="https://prod.spline.design/kZDDjO5HuC9GJUM2/scene.splinecode"
              className="w-full h-full"
            />
          </div>
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            marginTop: 56,
            color: "var(--text-2)",
          }}
          className="font-mono"
          data-testid="scroll-indicator"
        >
          <ArrowDown size={14} />
          <span style={{ fontSize: 11, textTransform: "uppercase" }}>scroll to explore</span>
        </div>
      </div>

      <style>{`
        @keyframes pulse { 50% { opacity: 0.4; } }
        @media (max-width: 980px) {
          .hero-3d-grid { grid-template-columns: 1fr !important; gap: 40px !important; }
        }
      `}</style>
    </section>
  );
}
