/** Decorative scatter plot with a fitted trend line — "data into intelligence". */
const PTS: [number, number][] = [
  [28, 168], [44, 150], [52, 172], [66, 140], [78, 152], [90, 128], [104, 136], [112, 116], [126, 124], [138, 104],
  [150, 112], [162, 92], [176, 100], [186, 82], [200, 88], [212, 70], [226, 76], [238, 58], [252, 64], [266, 48],
  [60, 120], [140, 150], [220, 110], [96, 96],
];

export default function HeroArt() {
  return (
    <figure className="hero-art" aria-hidden="true" style={{ margin: 0 }}>
      <svg viewBox="0 0 300 200" role="presentation">
        <defs>
          <linearGradient id="band" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0" stopColor="var(--accent)" stopOpacity="0.18" />
            <stop offset="1" stopColor="var(--accent)" stopOpacity="0.02" />
          </linearGradient>
        </defs>
        {[40, 80, 120, 160].map((y) => <line key={y} x1="16" x2="290" y1={y} y2={y} stroke="var(--line)" strokeWidth="1" strokeDasharray="2 4" />)}
        <line x1="16" x2="290" y1="186" y2="186" stroke="var(--ink-2)" strokeWidth="1" />
        <line x1="16" x2="16" y1="14" y2="186" stroke="var(--ink-2)" strokeWidth="1" />
        <path d="M20 160 L280 34 L280 64 L20 190 Z" fill="url(#band)" />
        {PTS.map(([x, y], i) => (
          <circle key={i} cx={x} cy={y} r={i > 19 ? 3 : 3.6} fill={i > 19 ? "var(--signal)" : "var(--ink)"} opacity={i > 19 ? 0.9 : 0.75} />
        ))}
        <line x1="20" y1="176" x2="280" y2="48" stroke="var(--accent)" strokeWidth="2.5" strokeLinecap="round" />
      </svg>
      <figcaption><span>ŷ = β₀ + β₁x</span><span>signal &gt; noise</span></figcaption>
    </figure>
  );
}
