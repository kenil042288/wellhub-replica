// Wellhub "wellbeing flywheel" mark: 7 teardrop lobes swirling
// around an open center, plus the lowercase rounded wordmark.

export function Flywheel({ size = 28, color = 'var(--brand)' }) {
  const lobes = Array.from({ length: 7 }, (_, i) => (360 / 7) * i);
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" fill={color} aria-label="Wellhub flywheel">
      {lobes.map((deg) => (
        <path
          key={deg}
          transform={`rotate(${deg} 50 50)`}
          d="M50 6
             C 63 6, 72 16, 70 28
             C 68.5 38, 61 44, 53.5 46.5
             C 51 47.4, 48.5 45.6, 49 42.8
             C 50.5 33, 46 21, 41.5 14.5
             C 39 11, 43.5 6, 50 6 Z"
        />
      ))}
    </svg>
  );
}

export function Wordmark({ size = 22, color = 'var(--brand)' }) {
  return (
    <span
      style={{
        fontFamily: 'var(--font-logo)',
        fontWeight: 800,
        fontSize: size,
        letterSpacing: '-0.02em',
        color,
        lineHeight: 1,
        userSelect: 'none',
      }}
    >
      wellhub
    </span>
  );
}

export default function Logo({ size = 26, color = 'var(--brand)', withWordmark = false }) {
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
      <Flywheel size={size} color={color} />
      {withWordmark && <Wordmark size={size * 0.82} color={color} />}
    </span>
  );
}
