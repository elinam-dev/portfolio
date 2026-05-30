import React, { useEffect, useState } from "react";

const CHARS = "!<>-_\\/[]{}=+*^?#________ABCDEFGHIJKLMNOPQRSTUVWXYZ";

export default function Scramble({ text, duration = 1200, className = "" }) {
  const [display, setDisplay] = useState(text);

  useEffect(() => {
    const startMs = Date.now();
    const queue = text.split("").map((to, i) => {
      const startAt = Math.floor(Math.random() * 240);
      const endAt = startAt + 200 + Math.floor(Math.random() * 400);
      return { to, startAt, endAt, char: "" };
    });

    const STEP = 30;
    let id = setInterval(() => {
      const elapsed = Date.now() - startMs;
      let out = "";
      let done = 0;
      for (const q of queue) {
        if (elapsed >= q.endAt) {
          out += q.to;
          done++;
        } else if (elapsed >= q.startAt) {
          if (!q.char || Math.random() < 0.4)
            q.char = CHARS[Math.floor(Math.random() * CHARS.length)];
          out += `<span class="scramble-char is-scrambling">${q.char}</span>`;
        } else {
          out += " ";
        }
      }
      setDisplay(out);
      if (done >= queue.length || elapsed > duration + 600) {
        clearInterval(id);
        setDisplay(text);
      }
    }, STEP);

    // Safety net: always show clean text after 2.5s
    const safety = setTimeout(() => {
      clearInterval(id);
      setDisplay(text);
    }, 2500);

    return () => {
      clearInterval(id);
      clearTimeout(safety);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [text]);

  return <span className={className} dangerouslySetInnerHTML={{ __html: display }} />;
}
