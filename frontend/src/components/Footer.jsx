import React, { useEffect, useRef } from "react";

export default function Footer({ cv }) {
  const ref = useRef(null);

  useEffect(() => {
    const c = ref.current;
    if (!c) return;
    const ctx = c.getContext("2d");
    let raf, t = 0;
    const resize = () => {
      c.width = c.clientWidth * (window.devicePixelRatio || 1);
      c.height = c.clientHeight * (window.devicePixelRatio || 1);
      ctx.setTransform(window.devicePixelRatio || 1, 0, 0, window.devicePixelRatio || 1, 0, 0);
    };
    const tick = () => {
      const w = c.clientWidth, h = c.clientHeight;
      ctx.clearRect(0, 0, w, h);
      ctx.lineWidth = 1;
      for (let i = 0; i < 3; i++) {
        ctx.beginPath();
        for (let x = 0; x <= w; x += 6) {
          const y =
            h / 2 +
            Math.sin(x * 0.012 + t * 0.6 + i) * 18 +
            Math.sin(x * 0.04 + t * 0.4 + i * 0.7) * 6;
          if (x === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.strokeStyle = `rgba(0, 240, 255, ${0.25 - i * 0.07})`;
        ctx.stroke();
      }
      t += 0.018;
      raf = requestAnimationFrame(tick);
    };
    resize();
    tick();
    window.addEventListener("resize", resize);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <footer style={{ position: "relative", padding: "100px 0 32px", overflow: "hidden", borderTop: "1px solid var(--line)" }} data-testid="footer">
      <canvas ref={ref} className="wave" />
      <div className="container-wide" style={{ position: "relative", zIndex: 2 }}>
        <div className="font-display" style={{ fontSize: "clamp(80px, 14vw, 220px)", lineHeight: 0.9, letterSpacing: "-0.04em", margin: "0 0 60px", fontWeight: 500 }}>
          K. <em style={{ color: "var(--neon)", fontStyle: "italic" }}>Elinam</em>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 32, paddingTop: 32, borderTop: "1px solid var(--line)" }}>
          <div>
            <div className="font-mono" style={{ fontSize: 10, color: "var(--text-2)", letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: 12 }}>where</div>
            <div style={{ color: "var(--text-1)" }}>{cv.location}</div>
          </div>
          <div>
            <div className="font-mono" style={{ fontSize: 10, color: "var(--text-2)", letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: 12 }}>email</div>
            <a href={`mailto:${cv.email}`} style={{ color: "var(--text-1)", textDecoration: "none" }}>{cv.email}</a>
          </div>
          <div>
            <div className="font-mono" style={{ fontSize: 10, color: "var(--text-2)", letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: 12 }}>elsewhere</div>
            <div style={{ display: "grid", gap: 6 }}>
              <a href={cv.linkedin} target="_blank" rel="noreferrer" style={{ color: "var(--text-1)", textDecoration: "none" }}>LinkedIn ↗</a>
              <a href={cv.github} target="_blank" rel="noreferrer" style={{ color: "var(--text-1)", textDecoration: "none" }}>GitHub ↗</a>
            </div>
          </div>
          <div>
            <div className="font-mono" style={{ fontSize: 10, color: "var(--text-2)", letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: 12 }}>status</div>
            <div style={{ display: "flex", alignItems: "center", gap: 8, color: "var(--text-1)" }}>
              <span style={{ width: 8, height: 8, borderRadius: 8, background: "#22c55e", boxShadow: "0 0 10px #22c55e" }} />
              Available
            </div>
          </div>
        </div>

        <div style={{ marginTop: 48, paddingTop: 24, borderTop: "1px solid var(--line)", display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
          <div className="font-mono" style={{ fontSize: 10, color: "var(--text-2)", textTransform: "uppercase", letterSpacing: "0.2em" }}>
            © {new Date().getFullYear()} Katey Elinam — All rights reserved.
          </div>
          <div className="font-mono" style={{ fontSize: 10, color: "var(--text-2)", textTransform: "uppercase", letterSpacing: "0.2em" }}>
            Crafted in Accra · React · Vercel · Claude Sonnet 4.5
          </div>
        </div>
      </div>
    </footer>
  );
}
