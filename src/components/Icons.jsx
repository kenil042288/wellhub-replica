// Rounded line-icon set, 24x24 viewBox, 1.6 stroke — matches
// Wellhub's thin outline iconography.

const base = {
  width: 22,
  height: 22,
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.6,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
};

const I = ({ size, children, ...rest }) => (
  <svg {...base} {...(size ? { width: size, height: size } : {})} {...rest}>
    {children}
  </svg>
);

// Wellhub's "Check in" tab glyph: a pin with a checkmark inside.
export const PinIcon = ({ filled, ...p }) => (
  <I {...p} fill={filled ? 'currentColor' : 'none'}>
    <path d="M12 21s-7-5.5-7-11a7 7 0 1 1 14 0c0 5.5-7 11-7 11Z" />
    <path
      d="m9.3 10 1.9 1.9 3.5-3.5"
      fill="none"
      stroke={filled ? 'var(--white)' : 'currentColor'}
    />
  </I>
);

export const SearchIcon = ({ filled: _filled, ...p }) => (
  <I {...p}>
    <circle cx="11" cy="11" r="6.5" />
    <path d="m20 20-3.8-3.8" />
  </I>
);

export const PersonIcon = ({ filled, ...p }) => (
  <I {...p} fill={filled ? 'currentColor' : 'none'}>
    <circle cx="12" cy="8" r="3.6" />
    <path d="M5 20c.8-3.4 3.6-5.4 7-5.4s6.2 2 7 5.4" />
  </I>
);

export const HistoryIcon = (p) => (
  <I {...p}>
    <path d="M4.5 5v4h4" />
    <path d="M4.8 9A8 8 0 1 1 4 12" />
    <path d="M12 8v4.2l3 1.8" />
  </I>
);

export const GearIcon = (p) => (
  <I {...p}>
    <circle cx="12" cy="12" r="3" />
    <path d="M19 12a7 7 0 0 0-.14-1.4l2-1.55-2-3.46-2.36.95a7 7 0 0 0-2.42-1.4L13.7 2.6h-3.4l-.38 2.54a7 7 0 0 0-2.42 1.4l-2.36-.95-2 3.46 2 1.55A7 7 0 0 0 5 12c0 .48.05.94.14 1.4l-2 1.55 2 3.46 2.36-.95a7 7 0 0 0 2.42 1.4l.38 2.54h3.4l.38-2.54a7 7 0 0 0 2.42-1.4l2.36.95 2-3.46-2-1.55c.09-.46.14-.92.14-1.4Z" />
  </I>
);

export const HeartIcon = ({ filled, ...p }) => (
  <I {...p} fill={filled ? 'var(--cta)' : 'none'} stroke={filled ? 'var(--cta)' : 'currentColor'}>
    <path d="M12 20.3 4.9 13a4.7 4.7 0 0 1 6.6-6.6l.5.5.5-.5a4.7 4.7 0 0 1 6.6 6.6Z" />
  </I>
);

export const ShareIcon = (p) => (
  <I {...p}>
    <path d="M12 3v12" />
    <path d="m8 6.5 4-3.5 4 3.5" />
    <path d="M6 11H5a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-8a1 1 0 0 0-1-1h-1" />
  </I>
);

export const BackIcon = (p) => (
  <I {...p}>
    <path d="M15 5.5 8.5 12l6.5 6.5" />
  </I>
);

export const ChevronRight = (p) => (
  <I {...p}>
    <path d="m9.5 5.5 6.5 6.5-6.5 6.5" />
  </I>
);

export const ChevronDown = (p) => (
  <I {...p}>
    <path d="m6 9.5 6 6 6-6" />
  </I>
);

export const CloseIcon = (p) => (
  <I {...p}>
    <path d="m6 6 12 12M18 6 6 18" />
  </I>
);

export const StarIcon = ({ filled = true, ...p }) => (
  <I {...p} fill={filled ? 'currentColor' : 'none'}>
    <path d="m12 3.5 2.5 5.2 5.7.7-4.2 4 1.1 5.6L12 16.3 6.9 19l1.1-5.6-4.2-4 5.7-.7Z" />
  </I>
);

export const QrIcon = (p) => (
  <I {...p}>
    <rect x="4" y="4" width="6" height="6" rx="1" />
    <rect x="14" y="4" width="6" height="6" rx="1" />
    <rect x="4" y="14" width="6" height="6" rx="1" />
    <path d="M14 14h2.5v2.5H14zM17.5 17.5H20V20h-2.5z" />
  </I>
);

export const RefreshIcon = (p) => (
  <I {...p}>
    <path d="M19.5 9.5v-4m0 4h-4m4 0A8 8 0 1 0 20 12" />
  </I>
);

export const CalendarIcon = (p) => (
  <I {...p}>
    <rect x="4" y="5.5" width="16" height="15" rx="2.5" />
    <path d="M4 10h16M8.5 3.5v3.5M15.5 3.5v3.5" />
  </I>
);

export const ClockIcon = (p) => (
  <I {...p}>
    <circle cx="12" cy="12" r="8.5" />
    <path d="M12 7.5V12l3 2" />
  </I>
);

export const PlayIcon = (p) => (
  <I {...p} fill="currentColor" stroke="none">
    <path d="M8 5.8v12.4a.6.6 0 0 0 .92.5l9.4-6.2a.6.6 0 0 0 0-1L8.92 5.3a.6.6 0 0 0-.92.5Z" />
  </I>
);

export const CheckIcon = (p) => (
  <I {...p}>
    <path d="m5 12.5 4.5 4.5L19 7.5" />
  </I>
);

export const LocateIcon = (p) => (
  <I {...p}>
    <circle cx="12" cy="12" r="3" />
    <path d="M12 3v3M12 18v3M3 12h3M18 12h3" />
  </I>
);

export const ListIcon = (p) => (
  <I {...p}>
    <path d="M8 6.5h12M8 12h12M8 17.5h12" />
    <path d="M4 6.5h.01M4 12h.01M4 17.5h.01" strokeWidth="2.4" />
  </I>
);

export const LotusIcon = (p) => (
  <I {...p}>
    <path d="M12 4c1.6 1.8 2.4 3.7 2.4 5.7S13.6 13.4 12 15c-1.6-1.6-2.4-3.3-2.4-5.3S10.4 5.8 12 4Z" />
    <path d="M4.5 10c2.3.3 4.1 1.2 5.4 2.6 1.3 1.4 2 3.2 2.1 5.4-2.3-.3-4.1-1.2-5.4-2.6C5.3 14 4.6 12.2 4.5 10Z" />
    <path d="M19.5 10c-2.3.3-4.1 1.2-5.4 2.6-1.3 1.4-2 3.2-2.1 5.4 2.3-.3 4.1-1.2 5.4-2.6 1.3-1.4 2-3.2 2.1-5.4Z" />
  </I>
);

export const TrophyIcon = (p) => (
  <I {...p}>
    <path d="M8 4h8v6a4 4 0 0 1-8 0Z" />
    <path d="M8 5.5H5a3 3 0 0 0 3 4M16 5.5h3a3 3 0 0 1-3 4" />
    <path d="M12 14v3M8.5 20h7M10 17h4v3h-4z" />
  </I>
);

export const FlameIcon = (p) => (
  <I {...p}>
    <path d="M12 21c-3.6 0-6-2.3-6-5.6 0-2.4 1.5-4.3 2.8-5.9.4.9 1 1.6 1.9 2 .1-3 1.2-6 3.7-7.5-.3 1.9.5 3.3 1.7 4.7 1.2 1.5 2.4 3.3 2.4 6C18.5 18.4 15.6 21 12 21Z" />
  </I>
);

export const BellIcon = (p) => (
  <I {...p}>
    <path d="M6 10a6 6 0 1 1 12 0c0 4 1.5 5.5 1.5 5.5h-15S6 14 6 10Z" />
    <path d="M10.3 19a2 2 0 0 0 3.4 0" />
  </I>
);

export const SparkIcon = (p) => (
  <I {...p} fill="currentColor" stroke="none">
    <path d="M12 3l1.7 5.4L19 10l-5.3 1.6L12 17l-1.7-5.4L5 10l5.3-1.6Z" />
  </I>
);

export const PhoneIcon = (p) => (
  <I {...p}>
    <path d="M7 3.5h3l1.2 4.2-2 1.3a12 12 0 0 0 5.8 5.8l1.3-2 4.2 1.2v3a2 2 0 0 1-2.2 2A16.5 16.5 0 0 1 5 5.7 2 2 0 0 1 7 3.5Z" />
  </I>
);

export const GlobeIcon = (p) => (
  <I {...p}>
    <circle cx="12" cy="12" r="8.5" />
    <path d="M3.5 12h17M12 3.5c2.3 2.2 3.5 5 3.5 8.5s-1.2 6.3-3.5 8.5c-2.3-2.2-3.5-5-3.5-8.5s1.2-6.3 3.5-8.5Z" />
  </I>
);
