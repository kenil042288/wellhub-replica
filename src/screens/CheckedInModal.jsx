// Checked-in confirmation modal (magenta over light split) + the
// Check-in history overlay page. Modal layout matches the user's
// real Crunch - Hoboken check-in screenshot.

import { useEffect, useRef, useState } from 'react';
import { Flywheel, Wordmark } from '../components/Logo.jsx';
import { LogoTile, FakeQR } from '../components/ui.jsx';
import { CloseIcon, BackIcon } from '../components/Icons.jsx';
import './CheckedInModal.css';

// Scan-frame glyph (corner brackets + bar) next to "Hide code".
const ScanGlyph = ({ size = 18 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.7"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M4 8V5.5A1.5 1.5 0 0 1 5.5 4H8" />
    <path d="M16 4h2.5A1.5 1.5 0 0 1 20 5.5V8" />
    <path d="M20 16v2.5a1.5 1.5 0 0 1-1.5 1.5H16" />
    <path d="M8 20H5.5A1.5 1.5 0 0 1 4 18.5V16" />
    <path d="M8 12h8" />
  </svg>
);

// Sparkle pair (big 4-point star + small one) on the Share button.
const SparkleGlyph = ({ size = 14 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M10 4c.6 3.6 2.4 5.4 6 6-3.6.6-5.4 2.4-6 6-.6-3.6-2.4-5.4-6-6 3.6-.6 5.4-2.4 6-6Z" />
    <path d="M18 13.5c.3 1.8 1.2 2.7 3 3-1.8.3-2.7 1.2-3 3-.3-1.8-1.2-2.7-3-3 1.8-.3 2.7-1.2 3-3Z" />
    <path d="M17.5 2c.2 1.2.8 1.8 2 2-1.2.2-1.8.8-2 2-.2-1.2-.8-1.8-2-2 1.2-.2 1.8-.8 2-2Z" />
  </svg>
);

export default function CheckedInModal({ app, venue, activity }) {
  const [codeOpen, setCodeOpen] = useState(true);
  const [copied, setCopied] = useState(false);
  const copyTimer = useRef(null);

  useEffect(() => () => clearTimeout(copyTimer.current), []);

  const handleShare = () => {
    setCopied(true);
    clearTimeout(copyTimer.current);
    copyTimer.current = setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="cm-modal">
      <div className="cm-scroll">
        <div className="cm-topbar">
          <span className="cm-logo">
            <Wordmark size={20} color="#ffffff" />
            <Flywheel size={22} color="#ffffff" />
          </span>
          <button className="cm-close" onClick={app.actions.pop} aria-label="Close">
            <CloseIcon size={20} />
          </button>
        </div>

        <div className="cm-head">
          <h1 className="headline cm-headline">Checked in</h1>
        </div>

        {/* venue card — straddles the magenta/light seam */}
        <div className="cm-card">
          <div className="cm-venue-row">
            <LogoTile bg={venue.iconBg} fg={venue.iconFg} src={venue.logo} label={venue.short} size={44} />
            <div>
              <div className="cm-venue-name">{venue.name}</div>
              <div className="cm-venue-activity">{activity}</div>
            </div>
          </div>
        </div>

        {/* collapsible code card */}
        <div className="cm-card cm-code-card">
          <button className="cm-code-head" onClick={() => setCodeOpen((o) => !o)}>
            <ScanGlyph size={18} />
            <span className="cm-code-title">{codeOpen ? 'Hide code' : 'Show code'}</span>
          </button>
          <div className={`cm-code-body ${codeOpen ? 'cm-open' : ''}`}>
            {venue.codeType === 'qr' ? (
              // QR only, no digits underneath (current Crunch check-in)
              <div className="cm-code-inner cm-code-qr-only">
                <FakeQR seed={app.user.wellhubId} size={108} />
              </div>
            ) : venue.codeType === 'number' ? (
              // some partners (e.g. Crunch) issue a plain numeric code
              <div className="cm-code-inner cm-code-number-only">
                <div className="cm-code-digits">{app.user.wellhubId}</div>
              </div>
            ) : (
              <div className="cm-code-inner">
                <FakeQR seed={venue.id} size={190} />
                <div className="cm-code-digits">{app.user.wellhubId}</div>
                <div className="cm-code-valid">Code valid for 30 minutes</div>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="cm-bottom">
        <button className="cm-share" onClick={handleShare}>
          <SparkleGlyph size={14} />
          <span>{copied ? 'Copied ✓' : 'Share'}</span>
        </button>
      </div>
    </div>
  );
}

// ---------------- Check-in history ----------------

const STATUS_CLASS = {
  Confirmed: 'hi-status-confirmed',
  Pending: 'hi-status-pending',
  Expired: 'hi-status-expired',
};

export function HistoryPage({ app }) {
  const [toast, setToast] = useState(false);
  const toastTimer = useRef(null);

  useEffect(() => () => clearTimeout(toastTimer.current), []);

  const showToast = () => {
    setToast(true);
    clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(false), 1500);
  };

  const stats = [app.usage.standard, app.usage.premium, app.usage.sessions];

  return (
    <div className="overlay-page">
      <div className="hi-topbar">
        <button className="icon-btn" onClick={app.actions.pop} aria-label="Back">
          <BackIcon size={20} />
        </button>
        <span className="hi-title">Check-in history</span>
      </div>

      <div className="hi-scroll">
        <div className="section-header">
          <h2>This month</h2>
        </div>
        <div className="card hi-summary-card">
          {stats.map((s) => (
            <div className="hi-stat" key={s.label}>
              <div className="hi-stat-num">
                {s.used}
                {s.cap ? <span className="hi-stat-cap">/{s.cap}</span> : null}
              </div>
              <div className="hi-stat-label">{s.label}</div>
              {s.cap ? (
                <div className="hi-bar">
                  <div
                    className="hi-bar-fill"
                    style={{ width: `${Math.min(100, (s.used / s.cap) * 100)}%` }}
                  />
                </div>
              ) : (
                <div className="hi-stat-detail">{s.detail}</div>
              )}
            </div>
          ))}
        </div>
        <div className="hi-reset-note">Counters reset on the 1st of each month.</div>

        <div className="section-header">
          <h2>History</h2>
        </div>
        <div className="card hi-list-card">
          {app.history.map((h) => (
            <div className="hi-row" key={h.id}>
              <div>
                <div className="hi-row-partner">{h.partner}</div>
                <div className="hi-row-meta">
                  {h.activity} &bull; {h.date}, {h.time}
                </div>
              </div>
              <span className={`hi-status ${STATUS_CLASS[h.status] || 'hi-status-expired'}`}>
                {h.status}
              </span>
            </div>
          ))}
        </div>

        <button className="text-link hi-statement" onClick={showToast}>
          Download monthly statement
        </button>
      </div>

      {toast && <div className="hi-toast">Not available in this demo</div>}
    </div>
  );
}
