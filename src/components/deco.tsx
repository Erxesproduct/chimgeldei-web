/** Comic decorations: stars and starburst stickers. Visual only. */

export function Star({ size = 28, color = "var(--color-sun)", className = "", style }: { size?: number; color?: string; className?: string; style?: React.CSSProperties }) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" className={className} style={style} aria-hidden>
      <path d="M20 2.5 25 14l12.5 1.2-9.5 8.3 2.9 12.3L20 29.4 9.1 35.8 12 23.5 2.5 15.2 15 14z" fill={color} stroke="var(--color-ink)" strokeWidth="2.6" strokeLinejoin="round" />
    </svg>
  );
}

/** Starburst sticker with a word or two inside («ХИТ», «-20%»). */
export function Burst({ children, color = "var(--color-sun)", size = 84, className = "", rotate = -8 }: { children: React.ReactNode; color?: string; size?: number; className?: string; rotate?: number }) {
  return (
    <span className={`relative inline-grid shrink-0 place-items-center ${className}`} style={{ width: size, height: size, transform: `rotate(${rotate}deg)` }}>
      <span className="burst absolute inset-0 bg-ink" />
      <span className="burst absolute inset-[3px]" style={{ background: color }} />
      <span className="display relative text-center leading-none" style={{ fontSize: size * 0.2 }}>
        {children}
      </span>
    </span>
  );
}

/** Speed lines for a corner. */
export function Zoom({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 120 120" className={className} aria-hidden>
      {[0, 14, 28, 42, 56].map((a) => (
        <line key={a} x1="10" y1="110" x2={110 - a} y2={10 + a * 0.4} stroke="var(--color-ink)" strokeWidth="3" strokeLinecap="round" />
      ))}
    </svg>
  );
}

/** A few stars floating over a section. */
export function Stars() {
  const list: [string, string, number, string, number][] = [
    ["5%", "14%", 30, "var(--color-sun)", 0],
    ["90%", "10%", 22, "var(--color-pink)", 1.1],
    ["12%", "80%", 20, "#fff", 0.5],
    ["86%", "76%", 34, "var(--color-sun)", 1.8],
  ];
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
      {list.map(([left, top, size, color, delay], i) => (
        <span key={i} className="bob absolute" style={{ left, top, animationDelay: `${delay}s`, ["--r" as string]: `${i * 12 - 10}deg` }}>
          <Star size={size} color={color} />
        </span>
      ))}
    </div>
  );
}
