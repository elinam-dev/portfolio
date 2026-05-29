import React, { useState } from "react";
import { Reveal } from "./Reveal";
import { polishText, sendContact } from "../lib/api";
import { Sparkle, PaperPlaneTilt, CircleNotch, CheckCircle, LinkedinLogo, GithubLogo, EnvelopeSimple } from "@phosphor-icons/react";

export default function Contact({ cv }) {
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [polishing, setPolishing] = useState(false);
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(null);
  const [err, setErr] = useState("");

  const upd = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const onPolish = async () => {
    if (!form.message.trim() || polishing) return;
    setPolishing(true);
    setErr("");
    try {
      const r = await polishText(form.message);
      setForm((f) => ({ ...f, message: r.polished }));
    } catch (e) {
      setErr("AI polish failed. Try again.");
    } finally {
      setPolishing(false);
    }
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setErr("");
    if (!form.name || !form.email || !form.subject || !form.message) {
      setErr("Please fill all fields.");
      return;
    }
    setSending(true);
    try {
      const r = await sendContact(form);
      setSent(r);
      setForm({ name: "", email: "", subject: "", message: "" });
    } catch (e) {
      setErr("Could not send. Please try again or email directly.");
    } finally {
      setSending(false);
    }
  };

  return (
    <section id="contact" data-testid="contact-section" style={{ padding: "140px 0 100px", position: "relative" }}>
      <div className="container-wide">
        <Reveal>
          <div className="font-mono" style={{ fontSize: 11, color: "var(--text-1)", marginBottom: 12, letterSpacing: "0.2em" }}>
            [06] — GET IN TOUCH
          </div>
        </Reveal>
        <Reveal delay={80}>
          <h2 className="font-display" style={{ fontSize: "clamp(48px, 9vw, 144px)", lineHeight: 0.95, margin: "0 0 60px", fontWeight: 500 }}>
            Let's build <em style={{ color: "var(--neon)", fontStyle: "italic" }}>something.</em>
          </h2>
        </Reveal>

        <div style={{ display: "grid", gridTemplateColumns: "minmax(0,1fr) minmax(0,1.6fr)", gap: 80 }} className="contact-grid">
          <Reveal delay={100}>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 28 }}>
                <span style={{ width: 8, height: 8, borderRadius: 8, background: "#22c55e", boxShadow: "0 0 12px #22c55e", animation: "pulse 1.6s ease-in-out infinite" }} />
                <span className="font-mono" style={{ fontSize: 11, color: "var(--text-0)", textTransform: "uppercase", letterSpacing: "0.2em" }}>
                  Currently available for work
                </span>
              </div>

              <div style={{ marginBottom: 28 }}>
                <div className="label" style={{ marginBottom: 6 }}>email</div>
                <a href={`mailto:${cv.email}`} className="font-display" style={{ fontSize: 22, color: "var(--text-0)", textDecoration: "none" }} data-testid="contact-email">
                  {cv.email}
                </a>
              </div>
              <div style={{ marginBottom: 28 }}>
                <div className="label" style={{ marginBottom: 6 }}>location</div>
                <div style={{ fontSize: 18, color: "var(--text-1)" }}>{cv.location}</div>
              </div>

              <div style={{ display: "flex", gap: 8, marginTop: 32 }}>
                <a href={cv.linkedin} target="_blank" rel="noreferrer" className="btn" data-testid="social-linkedin" style={{ padding: "12px 16px" }}>
                  <LinkedinLogo size={14} /> LinkedIn
                </a>
                <a href={cv.github} target="_blank" rel="noreferrer" className="btn" data-testid="social-github" style={{ padding: "12px 16px" }}>
                  <GithubLogo size={14} /> GitHub
                </a>
                <a href={`mailto:${cv.email}`} className="btn" data-testid="social-email" style={{ padding: "12px 16px" }}>
                  <EnvelopeSimple size={14} /> Email
                </a>
              </div>
            </div>
          </Reveal>

          <Reveal delay={160}>
            <form onSubmit={onSubmit} data-testid="contact-form">
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 32 }} className="form-grid">
                <div>
                  <div className="label">name</div>
                  <input className="input" data-testid="contact-name-input" value={form.name} onChange={upd("name")} placeholder="Your full name" />
                </div>
                <div>
                  <div className="label">email</div>
                  <input className="input" type="email" data-testid="contact-email-input" value={form.email} onChange={upd("email")} placeholder="you@company.com" />
                </div>
              </div>
              <div style={{ marginTop: 24 }}>
                <div className="label">subject</div>
                <input className="input" data-testid="contact-subject-input" value={form.subject} onChange={upd("subject")} placeholder="What's this about?" />
              </div>
              <div style={{ marginTop: 24 }}>
                <div className="label">message</div>
                <textarea
                  className="textarea"
                  data-testid="contact-message-input"
                  value={form.message}
                  onChange={upd("message")}
                  placeholder="Tell me a bit about the project, scope, and timeline..."
                />
              </div>

              <div style={{ marginTop: 28, display: "flex", flexWrap: "wrap", gap: 12, alignItems: "center" }}>
                <button
                  type="button"
                  className="btn"
                  onClick={onPolish}
                  disabled={polishing || !form.message.trim()}
                  data-testid="ai-polish-btn"
                >
                  {polishing ? <CircleNotch size={14} className="spin" /> : <Sparkle size={14} weight="fill" />}
                  {polishing ? "Polishing..." : "Let AI polish this"}
                </button>
                <button type="submit" className="btn btn-primary" disabled={sending} data-testid="contact-submit-btn">
                  {sending ? <CircleNotch size={14} className="spin" /> : <PaperPlaneTilt size={14} weight="fill" />}
                  {sending ? "Sending..." : "Send Message"}
                </button>
                {sent && (
                  <span style={{ display: "inline-flex", alignItems: "center", gap: 8, color: "#22c55e" }} data-testid="contact-success">
                    <CheckCircle size={18} weight="fill" />
                    <span className="font-mono" style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: "0.18em" }}>
                      {sent.delivered ? "Sent — talk soon" : "Received — talk soon"}
                    </span>
                  </span>
                )}
                {err && (
                  <span className="font-mono" style={{ fontSize: 11, color: "var(--hot)", textTransform: "uppercase", letterSpacing: "0.18em" }} data-testid="contact-error">
                    {err}
                  </span>
                )}
              </div>
            </form>
          </Reveal>
        </div>
      </div>
      <style>{`
        @keyframes pulse { 50% { opacity: 0.4; } }
        @media (max-width: 900px) {
          .contact-grid { grid-template-columns: 1fr !important; gap: 48px !important; }
          .form-grid { grid-template-columns: 1fr !important; gap: 24px !important; }
        }
      `}</style>
    </section>
  );
}
