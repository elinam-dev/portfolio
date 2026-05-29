import React, { useEffect, useState } from "react";
import { Sun, Moon, List, X } from "@phosphor-icons/react";

const links = [
  { id: "about", label: "About" },
  { id: "skills", label: "Skills" },
  { id: "experience", label: "Experience" },
  { id: "projects", label: "Work" },
  { id: "contact", label: "Contact" },
];

export default function Nav({ theme, onToggleTheme }) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 30);
    window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, []);

  const go = (id) => {
    setOpen(false);
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <nav
      data-testid="primary-nav"
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 50,
        padding: "20px 0",
        transition: "all .3s ease",
        background: scrolled ? "rgba(3,3,5,0.6)" : "transparent",
        backdropFilter: scrolled ? "blur(18px)" : "none",
        borderBottom: scrolled ? "1px solid var(--line)" : "1px solid transparent",
      }}
    >
      <div className="container-wide" style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <button
          onClick={() => go("hero")}
          data-testid="nav-logo"
          style={{ background: "transparent", border: "none", color: "var(--text-0)" }}
          className="font-mono"
        >
          <span style={{ color: "var(--neon)" }}>K.</span>ELINAM
          <span style={{ color: "var(--text-2)", marginLeft: 8 }}>// dev</span>
        </button>

        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <ul style={{ display: "none", gap: 4, listStyle: "none", margin: 0, padding: 0 }} className="md:!flex">
            {links.map((l) => (
              <li key={l.id}>
                <button
                  onClick={() => go(l.id)}
                  data-testid={`nav-link-${l.id}`}
                  className="font-mono"
                  style={{
                    background: "transparent",
                    border: "none",
                    color: "var(--text-1)",
                    padding: "10px 14px",
                    fontSize: 11,
                    textTransform: "uppercase",
                    letterSpacing: "0.18em",
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = "var(--neon)")}
                  onMouseLeave={(e) => (e.currentTarget.style.color = "var(--text-1)")}
                >
                  {l.label}
                </button>
              </li>
            ))}
          </ul>

          <button
            onClick={onToggleTheme}
            data-testid="theme-toggle"
            aria-label="Toggle theme"
            style={{
              width: 42,
              height: 42,
              display: "grid",
              placeItems: "center",
              border: "1px solid var(--line)",
              background: "transparent",
              color: "var(--text-0)",
            }}
          >
            {theme === "dark" ? <Sun size={16} /> : <Moon size={16} />}
          </button>

          <button
            data-testid="mobile-menu-toggle"
            onClick={() => setOpen((v) => !v)}
            style={{
              width: 42,
              height: 42,
              display: "grid",
              placeItems: "center",
              border: "1px solid var(--line)",
              background: "transparent",
              color: "var(--text-0)",
            }}
            className="md:!hidden"
          >
            {open ? <X size={16} /> : <List size={16} />}
          </button>
        </div>
      </div>

      {open && (
        <div
          className="md:!hidden"
          style={{
            background: "rgba(3,3,5,0.96)",
            borderTop: "1px solid var(--line)",
            padding: "20px 0",
          }}
        >
          <div className="container-wide" style={{ display: "grid", gap: 6 }}>
            {links.map((l) => (
              <button
                key={l.id}
                onClick={() => go(l.id)}
                data-testid={`mobile-nav-link-${l.id}`}
                className="font-mono"
                style={{
                  background: "transparent",
                  border: "none",
                  color: "var(--text-0)",
                  padding: "14px 0",
                  textAlign: "left",
                  fontSize: 14,
                  textTransform: "uppercase",
                  letterSpacing: "0.18em",
                }}
              >
                {l.label}
              </button>
            ))}
          </div>
        </div>
      )}
      <style>{`
        @media (min-width: 768px) {
          .md\\:\\!flex { display: flex !important; }
          .md\\:\\!hidden { display: none !important; }
        }
      `}</style>
    </nav>
  );
}
