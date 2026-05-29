import React, { useEffect, useState } from "react";

export default function TypeCycle({ words = [], pause = 1600, speed = 70, className = "" }) {
  const [idx, setIdx] = useState(0);
  const [sub, setSub] = useState("");
  const [erasing, setErasing] = useState(false);

  useEffect(() => {
    if (!words.length) return;
    const cur = words[idx % words.length];
    let t;
    if (!erasing) {
      if (sub.length < cur.length) {
        t = setTimeout(() => setSub(cur.slice(0, sub.length + 1)), speed);
      } else {
        t = setTimeout(() => setErasing(true), pause);
      }
    } else {
      if (sub.length > 0) {
        t = setTimeout(() => setSub(cur.slice(0, sub.length - 1)), speed / 1.8);
      } else {
        setErasing(false);
        setIdx((i) => i + 1);
      }
    }
    return () => clearTimeout(t);
  }, [sub, erasing, idx, words, pause, speed]);

  return (
    <span className={className}>
      {sub}
      <span style={{ borderLeft: "2px solid var(--neon)", marginLeft: 4, animation: "blink 1s steps(1) infinite" }}>&nbsp;</span>
      <style>{`@keyframes blink { 50% { opacity: 0; } }`}</style>
    </span>
  );
}
