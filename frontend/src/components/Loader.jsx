import React, { useEffect, useState } from "react";

export default function Loader({ onDone }) {
  const [p, setP] = useState(0);
  const [hide, setHide] = useState(false);

  useEffect(() => {
    const TOTAL = 900; // ms
    const STEP = 30;   // ms
    let elapsed = 0;
    let id = setInterval(() => {
      elapsed += STEP;
      const pct = Math.min(100, Math.round((elapsed / TOTAL) * 100));
      setP(pct);
      if (pct >= 100) {
        clearInterval(id);
        setTimeout(() => {
          setHide(true);
          if (onDone) onDone();
        }, 200);
      }
    }, STEP);

    // Safety net: always complete after 2s even if interval is throttled
    const safety = setTimeout(() => {
      clearInterval(id);
      setP(100);
      setHide(true);
      if (onDone) onDone();
    }, 2000);

    return () => {
      clearInterval(id);
      clearTimeout(safety);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div
      className="loader-overlay"
      data-testid="loader-overlay"
      style={{
        opacity: hide ? 0 : 1,
        pointerEvents: hide ? "none" : "auto",
        transform: hide ? "scale(1.02)" : "scale(1)",
      }}
    >
      <div style={{ width: "100%", maxWidth: 640, padding: "0 24px", textAlign: "left" }}>
        <div className="font-mono" style={{ fontSize: 12, color: "var(--text-1)", marginBottom: 24 }}>
          [SYS::INIT] booting portfolio.katey_elinam
        </div>
        <div
          className="font-display"
          style={{ fontSize: "clamp(36px, 6vw, 72px)", lineHeight: 1, marginBottom: 32 }}
        >
          Katey <span style={{ color: "var(--neon)" }}>Elinam</span>
        </div>
        <div className="loader-bar" style={{ "--p": `${p}%` }} aria-hidden />
        <div
          className="font-mono"
          style={{
            fontSize: 11,
            color: "var(--text-2)",
            marginTop: 16,
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          <span>loading.assets</span>
          <span>{p}%</span>
        </div>
      </div>
    </div>
  );
}
