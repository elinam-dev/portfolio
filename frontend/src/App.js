import React, { useEffect, useMemo, useState } from "react";
import "@/index.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Cursor from "@/components/Cursor";
import Nav from "@/components/Nav";
import Hero3D from "@/components/Hero3D";
import About from "@/components/About";
import Skills from "@/components/Skills";
import AIFeatures from "@/components/AIFeatures";
import Experience from "@/components/Experience";
import Projects from "@/components/Projects";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import ChatWidget from "@/components/ChatWidget";
import cv from "@/data/cv";

function detectReferrer() {
  if (typeof document === "undefined") return { source: "direct", headline: "Open to opportunities" };
  const r = (document.referrer || "").toLowerCase();
  if (r.includes("linkedin")) return { source: "linkedin", headline: "Hi, LinkedIn — open to new roles" };
  if (r.includes("github")) return { source: "github", headline: "Hi, GitHub friend — see my latest builds" };
  if (
    r.includes("indeed") ||
    r.includes("glassdoor") ||
    r.includes("upwork") ||
    r.includes("fiverr") ||
    r.includes("jobs")
  )
    return { source: "jobs", headline: "Available for hire — full-time or freelance" };
  if (r.includes("twitter") || r.includes("x.com")) return { source: "twitter", headline: "Hey from X — let's build" };
  return { source: "direct", headline: "Available for freelance & full-time" };
}

function Portfolio() {
  const [theme, setTheme] = useState("dark");
  const referrer = useMemo(() => detectReferrer(), []);

  useEffect(() => {
    document.documentElement.classList.remove("dark", "light");
    document.documentElement.classList.add(theme);
  }, [theme]);

  useEffect(() => {
    document.title = "Katey Elinam — Full Stack Developer & Entrepreneur";
    const desc =
      "Katey Elinam is a full-stack web developer in Accra, Ghana — building React, Next.js, and AI-powered applications for real clients.";
    let m = document.querySelector('meta[name="description"]');
    if (!m) {
      m = document.createElement("meta");
      m.name = "description";
      document.head.appendChild(m);
    }
    m.content = desc;
  }, []);

  const toggleTheme = () => setTheme((t) => (t === "dark" ? "light" : "dark"));

  return (
    <div data-testid="app-root">
      <div className="grain" aria-hidden />
      <Cursor />
      <Nav theme={theme} onToggleTheme={toggleTheme} />
      <main>
        <Hero3D cv={cv} headline={referrer.headline} />
        <About cv={cv} />
        <Skills cv={cv} />
        <AIFeatures />
        <Experience cv={cv} />
        <Projects cv={cv} />
        <Contact cv={cv} />
        <Footer cv={cv} />
      </main>
      <ChatWidget referrer={referrer.source} />
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Portfolio />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
