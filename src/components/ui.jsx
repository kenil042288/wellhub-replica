// Shared UI pieces used across screens.

import { StarIcon } from './Icons.jsx';

// Squircle logo tile for partners/apps/online studios.
// When `src` is set (a real brand logo asset), it renders the image
// on a white tile; otherwise it renders a styled text wordmark
// (brand-colored tile + brand-styled text, like the real app).
const isLight = (bg = '') => /^#f|^#e|white/i.test(String(bg).trim());

export function LogoTile({ bg, fg = '#fff', label = '', size = 48, fontSize, src }) {
  const len = String(label).length;
  const autoSize = size * (len <= 2 ? 0.34 : len <= 4 ? 0.24 : len <= 7 ? 0.17 : 0.12);
  const bordered = src || isLight(bg);
  return (
    <div
      className="logo-tile"
      style={{
        width: size,
        height: size,
        background: src ? '#fff' : bg,
        color: fg,
        fontSize: fontSize || Math.max(8, autoSize),
        letterSpacing: len > 2 ? '-0.02em' : '0',
        borderRadius: Math.max(10, size * 0.29),
        border: bordered ? '1px solid var(--hairline-cool)' : 'none',
        padding: len > 4 ? '0 4px' : 0,
        textAlign: 'center',
        lineHeight: 1.05,
      }}
    >
      {src ? (
        <img
          src={src}
          alt={label}
          style={{ width: '76%', height: '76%', objectFit: 'contain' }}
          draggable={false}
        />
      ) : (
        label
      )}
    </div>
  );
}

export function Stars({ rating, size = 13 }) {
  return (
    <span style={{ display: 'inline-flex', gap: 1, color: 'var(--ink)' }}>
      {[1, 2, 3, 4, 5].map((n) => (
        <StarIcon key={n} size={size} filled={n <= Math.round(rating)} />
      ))}
    </span>
  );
}

// Deterministic fake QR code from a seed string.
export function FakeQR({ seed = 'wellhub', size = 180 }) {
  const N = 21;
  let h = 2166136261;
  for (let i = 0; i < seed.length; i++) {
    h = Math.imul(h ^ seed.charCodeAt(i), 16777619);
  }
  const rand = (x, y) => {
    let v = h ^ Math.imul(x + 1, 374761393) ^ Math.imul(y + 1, 668265263);
    v = Math.imul(v ^ (v >>> 13), 1274126177);
    v ^= v >>> 16;
    return (v >>> 0) / 4294967296;
  };
  const inFinder = (x, y) =>
    (x < 7 && y < 7) || (x >= N - 7 && y < 7) || (x < 7 && y >= N - 7);
  const cells = [];
  for (let y = 0; y < N; y++) {
    for (let x = 0; x < N; x++) {
      if (!inFinder(x, y) && rand(x, y) > 0.52) {
        cells.push(<rect key={`${x}-${y}`} x={x} y={y} width="1" height="1" />);
      }
    }
  }
  const Finder = ({ tx, ty }) => (
    <g transform={`translate(${tx} ${ty})`}>
      <rect x="0" y="0" width="7" height="7" fill="none" stroke="currentColor" strokeWidth="1" />
      <rect x="2" y="2" width="3" height="3" />
    </g>
  );
  return (
    <svg width={size} height={size} viewBox={`-1 -1 ${N + 2} ${N + 2}`} fill="currentColor" shapeRendering="crispEdges">
      {cells}
      <Finder tx={0} ty={0} />
      <Finder tx={N - 7} ty={0} />
      <Finder tx={0} ty={N - 7} />
    </svg>
  );
}

// Stylized street-map canvas (no external tiles). Fills its
// container; pins are placed by percentage coordinates.
export function MapCanvas({ pins = [], selectedId, onPinClick, faded = false, height = 160 }) {
  return (
    <div
      style={{
        position: 'relative',
        height,
        overflow: 'hidden',
        background: '#eef0e4',
        opacity: faded ? 0.55 : 1,
      }}
    >
      <svg
        width="100%"
        height="100%"
        viewBox="0 0 400 240"
        preserveAspectRatio="xMidYMid slice"
        style={{ position: 'absolute', inset: 0 }}
      >
        <rect width="400" height="240" fill="#f7f4ec" />
        {/* park corner + water, pale like the real app map */}
        <path d="M400 170 L400 240 L290 240 Z" fill="#cfe0a8" />
        <ellipse cx="20" cy="225" rx="70" ry="38" fill="#dce9f2" />
        {/* wide pale streets, diagonal like the real map */}
        <g stroke="#e3dfd4" strokeLinecap="round" fill="none">
          <path d="M-20 40 L420 190" strokeWidth="16" />
          <path d="M-20 150 L300 -20" strokeWidth="14" />
          <path d="M60 260 L330 -20" strokeWidth="12" />
          <path d="M-20 220 L420 90" strokeWidth="9" />
          <path d="M140 260 L420 20" strokeWidth="7" />
          <path d="M0 100 H400" strokeWidth="6" />
        </g>
        <g stroke="#ffffff" strokeLinecap="round" fill="none" opacity="0.7">
          <path d="M-20 40 L420 190" strokeWidth="11" />
          <path d="M-20 150 L300 -20" strokeWidth="9" />
          <path d="M60 260 L330 -20" strokeWidth="8" />
        </g>
        {/* faint blocks */}
        <g fill="#ecdfd2" opacity="0.45">
          <rect x="95" y="75" width="34" height="24" rx="3" />
          <rect x="215" y="60" width="40" height="30" rx="3" />
          <rect x="230" y="170" width="30" height="22" rx="3" />
          <rect x="330" y="40" width="44" height="26" rx="3" />
          <rect x="60" y="170" width="26" height="26" rx="3" />
        </g>
        {/* user location dot */}
        <circle cx="150" cy="132" r="10" fill="#4a90d9" opacity="0.25" />
        <circle cx="150" cy="132" r="5" fill="#4a90d9" stroke="#fff" strokeWidth="2" />
      </svg>
      {pins.map((pin) => {
        const sel = pin.id === selectedId;
        return (
          <button
            key={pin.id}
            onClick={onPinClick ? () => onPinClick(pin.id) : undefined}
            style={{
              position: 'absolute',
              left: `${pin.x}%`,
              top: `${pin.y}%`,
              transform: 'translate(-50%, -90%)',
              zIndex: sel ? 2 : 1,
            }}
            aria-label={pin.label}
          >
            <svg width={sel ? 34 : 26} height={sel ? 34 : 26} viewBox="0 0 24 24">
              <path
                d="M12 22s-7.5-6-7.5-12a7.5 7.5 0 1 1 15 0C19.5 16 12 22 12 22Z"
                fill={sel ? 'var(--green-dark)' : '#1d1d1f'}
                stroke="#fff"
                strokeWidth="1.4"
              />
              <circle cx="12" cy="10" r="2.6" fill="#fff" />
            </svg>
          </button>
        );
      })}
    </div>
  );
}

// Fixed percentage positions for partner pins on MapCanvas,
// keyed by list order so maps look stable across screens.
export const PIN_SPOTS = [
  { x: 38, y: 38 }, { x: 62, y: 55 }, { x: 22, y: 62 }, { x: 55, y: 24 },
  { x: 78, y: 40 }, { x: 30, y: 22 }, { x: 70, y: 72 }, { x: 46, y: 70 },
  { x: 86, y: 60 }, { x: 14, y: 40 }, { x: 60, y: 86 }, { x: 25, y: 84 },
];
