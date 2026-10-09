import { useEffect, useRef, useState } from "react";

// A wavy line that draws itself down the page as you scroll, with a dot at its tip.
// It sits behind the content of <main> and spans from About to the end.

const SEGMENT_HEIGHT = 650;
// Where each bend lands, as a fraction of the page width
const BENDS = [0.12, 0.88, 0.18, 0.82, 0.1, 0.9, 0.2, 0.8];

export default function ScrollLine() {
  const svg = useRef<SVGSVGElement>(null);
  const path = useRef<SVGPathElement>(null);
  const dot = useRef<SVGCircleElement>(null);
  const [shape, setShape] = useState({ d: "", width: 0, height: 0 });

  // Build the curve to fit the page, and rebuild it whenever the page resizes
  useEffect(() => {
    const main = svg.current!.parentElement!;
    const build = () => {
      const width = main.clientWidth;
      const height = main.offsetHeight;
      const start = document.getElementById("about")?.offsetTop ?? 0;
      const end = height - 120;
      let x0 = width * 0.5;
      let y0 = start;
      let d = `M ${x0} ${y0}`;
      for (let i = 0; y0 < end; i++) {
        const y1 = Math.min(y0 + SEGMENT_HEIGHT, end);
        const x1 = width * BENDS[i % BENDS.length];
        const half = (y1 - y0) / 2;
        // Vertical control points give a smooth S-bend between stops
        d += ` C ${x0} ${y0 + half}, ${x1} ${y1 - half}, ${x1} ${y1}`;
        x0 = x1;
        y0 = y1;
      }
      setShape({ d, width, height });
    };
    build();
    const observer = new ResizeObserver(build);
    observer.observe(main);
    return () => observer.disconnect();
  }, []);

  // Reveal the line up to just below the middle of the screen
  useEffect(() => {
    const line = path.current;
    if (!line || !shape.d) return;
    const total = line.getTotalLength();
    // Sample the curve once so scrolling is only a lookup
    const samples = Array.from({ length: 400 }, (_, i) => {
      const length = (total * i) / 399;
      const point = line.getPointAtLength(length);
      return { length, x: point.x, y: point.y };
    });
    const showAll = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    line.style.strokeDasharray = String(total);

    let frame = 0;
    const update = () => {
      frame = 0;
      const top = svg.current!.getBoundingClientRect().top + window.scrollY;
      // Over the last screen of scrolling, push the tip down so the line
      // is complete when the page bottom is reached
      const remaining = document.documentElement.scrollHeight - (window.scrollY + window.innerHeight);
      const nearEnd = 1 - Math.min(1, Math.max(0, remaining / window.innerHeight));
      const target = window.scrollY + window.innerHeight * (0.6 + 0.4 * nearEnd) - top;
      const index = samples.findIndex((s) => s.y > target);
      const tip = showAll || index === -1 ? samples[samples.length - 1] : samples[Math.max(0, index - 1)];
      line.style.strokeDashoffset = String(total - tip.length);
      dot.current!.setAttribute("cx", String(tip.x));
      dot.current!.setAttribute("cy", String(tip.y));
      dot.current!.style.opacity = tip.length > 0 && !showAll ? "1" : "0";
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [shape]);

  return (
    <svg
      ref={svg}
      className="scroll-line"
      width={shape.width}
      height={shape.height}
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="scroll-line-gradient" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#2dd4bf" />
          <stop offset="100%" stopColor="#f5b14c" />
        </linearGradient>
      </defs>
      <path
        ref={path}
        d={shape.d}
        fill="none"
        stroke="url(#scroll-line-gradient)"
        strokeWidth={2}
        strokeLinecap="round"
      />
      <circle ref={dot} className="scroll-line-dot" r={5} />
    </svg>
  );
}
