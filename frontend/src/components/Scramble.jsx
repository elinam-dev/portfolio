import React, { useEffect, useState } from "react";

const CHARS = "!<>-_\\/[]{}—=+*^?#________ABCDEFGHIJKLMNOPQRSTUVWXYZ";

export default function Scramble({ text, duration = 1400, className = "" }) {
  const [display, setDisplay] = useState("");

  useEffect(() => {
    let raf;
    const start = performance.now();
    const fromLen = display.length;
    const targetLen = text.length;
    const queue = [];
    for (let i = 0; i < Math.max(fromLen, targetLen); i++) {
      const from = display[i] || "";
      const to = text[i] || "";
      const startAt = Math.floor(Math.random() * 28);
      const endAt = startAt + Math.floor(Math.random() * 36) + 10;
      queue.push({ from, to, startAt, endAt, char: "" });
    }

    const tick = (now) => {
      const t = now - start;
      const frame = Math.floor(t / 18);
      let out = "";
      let done = 0;
      for (const q of queue) {
        if (frame >= q.endAt) {
          out += q.to;
          done++;
        } else if (frame >= q.startAt) {
          if (!q.char || Math.random() < 0.28) q.char = CHARS[Math.floor(Math.random() * CHARS.length)];
          out += `<span class="scramble-char is-scrambling">${q.char}</span>`;
        } else {
          out += q.from;
        }
      }
      setDisplay(out);
      if (done < queue.length && t < duration + 400) {
        raf = requestAnimationFrame(tick);
      } else {
        setDisplay(text);
      }
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [text]);

  return <span className={className} dangerouslySetInnerHTML={{ __html: display }} />;
}
