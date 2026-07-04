// Profile tab + Settings overlay + Plans overlay.

import { useRef, useState } from 'react';
import './ProfileScreen.css';
import { classVenue, dayInfo, challenges, badges, plans } from '../data/mock.js';
import { LogoTile } from '../components/ui.jsx';
import {
  GearIcon,
  FlameIcon,
  SparkIcon,
  ChevronRight,
  CalendarIcon,
  BackIcon,
  CloseIcon,
  CheckIcon,
  StarIcon,
} from '../components/Icons.jsx';

// ---------- shared toast ----------

function useToast() {
  const [toast, setToast] = useState(null);
  const timer = useRef(null);
  const show = (msg) => {
    clearTimeout(timer.current);
    setToast({ msg, key: Date.now() });
    timer.current = setTimeout(() => setToast(null), 1600);
  };
  return [toast, show];
}

function Toast({ toast }) {
  if (!toast) return null;
  return (
    <div className="pr-toast" key={toast.key}>
      {toast.msg}
    </div>
  );
}

// ---------- profile screen ----------

const STATUS_CLASS = {
  Confirmed: 'pr-status-confirmed',
  Pending: 'pr-status-pending',
  Expired: 'pr-status-expired',
};

export default function ProfileScreen({ app, bookedClasses }) {
  const { user, history, actions } = app;

  const [copied, setCopied] = useState(false);
  const copyTimer = useRef(null);
  const [aiOpen, setAiOpen] = useState(false);
  const [sheetClass, setSheetClass] = useState(null);
  const [ratingFor, setRatingFor] = useState(null);
  const [thanksFor, setThanksFor] = useState(null);
  const [localRated, setLocalRated] = useState(() => new Set());
  const [localJoined, setLocalJoined] = useState(() => new Set());
  const [toast, showToast] = useToast();

  const share = () => {
    setCopied(true);
    clearTimeout(copyTimer.current);
    copyTimer.current = setTimeout(() => setCopied(false), 1500);
  };

  const pickStar = (id) => {
    setRatingFor(null);
    setThanksFor(id);
    setTimeout(() => {
      setThanksFor((cur) => (cur === id ? null : cur));
      setLocalRated((s) => new Set(s).add(id));
    }, 1500);
  };

  const joinChallenge = (id) => {
    setLocalJoined((s) => new Set(s).add(id));
  };

  const sheetVenue = sheetClass ? classVenue(sheetClass) : null;

  return (
    <div>
      {/* 1. header */}
      <div className="pr-header">
        <div>
          <h1 className="pr-name">
            {user.firstName} {user.lastName}
          </h1>
          <div className="pr-plan-row">
            <button className="pr-plan-pill" onClick={() => actions.openPlans()}>
              {user.plan} plan
            </button>
            <span className="pr-via">via {user.company}</span>
          </div>
          <div className="pr-wid">
            Wellhub ID<span className="pr-wid-num">{user.wellhubId}</span>
          </div>
        </div>
        <button className="icon-btn" aria-label="Settings" onClick={() => actions.openSettings()}>
          <GearIcon size={20} />
        </button>
      </div>

      {/* 2. streak card */}
      <div className="card pr-card pr-streak">
        <div className="pr-flame">
          <FlameIcon size={22} />
        </div>
        <div className="pr-streak-body">
          <div className="pr-streak-title">{user.streakWeeks}-week streak</div>
          <div className="pr-streak-sub">1 check-in a week keeps it alive</div>
        </div>
        <button className={`text-link ${copied ? 'pr-share-copied' : ''}`} onClick={share}>
          {copied ? 'Copied!' : 'Share'}
        </button>
      </div>

      {/* 3. Wellhub AI banner */}
      <div className="pr-ai">
        <button className="pr-ai-head" onClick={() => setAiOpen((v) => !v)}>
          <div className="pr-ai-spark">
            <SparkIcon size={22} />
          </div>
          <div className="pr-ai-body">
            <div className="pr-ai-title">Meet Wellhub AI</div>
            <div className="pr-ai-sub">Your wellbeing assistant, in beta</div>
          </div>
          <ChevronRight size={20} className={`pr-ai-chev ${aiOpen ? 'pr-ai-chev-open' : ''}`} />
        </button>
        {aiOpen && (
          <div className="pr-ai-chat">
            <div className="pr-bubble pr-bubble-user">Find me a yoga class this week</div>
            <div className="pr-bubble pr-bubble-ai">
              CorePower Yoga has Yoga Sculpt tomorrow 7:30 AM — want me to book it?
            </div>
            <div className="pr-ai-input">Message Wellhub AI…</div>
          </div>
        )}
      </div>

      {/* 4. schedule */}
      <div className="section-header">
        <h2>Schedule</h2>
      </div>
      {bookedClasses.length === 0 ? (
        <div className="card pr-history-card pr-empty">
          <span>No upcoming bookings</span>
          <button className="text-link" onClick={() => actions.goExplore('classes')}>
            Find a class
          </button>
        </div>
      ) : (
        bookedClasses.map((c) => {
          const venue = classVenue(c);
          return (
            <button key={c.id} className="card pr-sched-card" onClick={() => setSheetClass(c)}>
              <LogoTile bg={venue.iconBg} fg={venue.iconFg} src={venue.logo} label={venue.short} size={48} />
              <div className="pr-sched-body">
                <div className="pr-sched-name">{c.name}</div>
                <div className="pr-sched-venue">{venue.name}</div>
                <div className="pr-sched-meta">
                  <CalendarIcon size={14} />
                  <span>
                    {dayInfo(c.dayOffset).label} • {c.start} - {c.end}
                  </span>
                </div>
              </div>
              <ChevronRight size={18} className="pr-sched-chev" />
            </button>
          );
        })
      )}

      {/* 5. recent check-ins */}
      <div className="section-header">
        <h2>Recent check-ins</h2>
        <button className="text-link" onClick={() => actions.openHistory()}>
          See all
        </button>
      </div>
      <div className="card pr-history-card">
        {history.slice(0, 3).map((h) => {
          const canRate = h.status === 'Confirmed' && !h.rated && !localRated.has(h.id);
          return (
            <div key={h.id} className="pr-hist-row">
              <div className="pr-hist-top">
                <div style={{ minWidth: 0 }}>
                  <div className="pr-hist-partner">{h.partner}</div>
                  <div className="pr-hist-sub">
                    {h.activity} • {h.date}
                  </div>
                </div>
                <span className={`pr-status ${STATUS_CLASS[h.status]}`}>{h.status}</span>
              </div>
              {canRate &&
                (thanksFor === h.id ? (
                  <div className="pr-thanks">Thanks for the feedback!</div>
                ) : ratingFor === h.id ? (
                  <div className="pr-stars">
                    {[1, 2, 3, 4, 5].map((n) => (
                      <button
                        key={n}
                        className="pr-star-btn"
                        aria-label={`Rate ${n} star${n > 1 ? 's' : ''}`}
                        onClick={() => pickStar(h.id)}
                      >
                        <StarIcon size={24} filled={false} />
                      </button>
                    ))}
                  </div>
                ) : (
                  <button className="text-link pr-rate-link" onClick={() => setRatingFor(h.id)}>
                    Rate experience
                  </button>
                ))}
            </div>
          );
        })}
      </div>

      {/* 6. challenges */}
      <div className="section-header">
        <h2>Challenges</h2>
        <button
          className="btn btn-outline btn-small"
          onClick={() => showToast('Not available in this demo')}
        >
          Create
        </button>
      </div>
      {challenges.map((ch) => {
        const isJoined = ch.joined || localJoined.has(ch.id);
        return (
          <div key={ch.id} className="card pr-chal">
            <span className="pr-chal-bar" style={{ background: ch.color }} />
            <div className="pr-chal-body">
              <div className="pr-chal-title">{ch.title}</div>
              <div className="pr-chal-meta">
                by {ch.by} • {ch.participants.toLocaleString('en-US')} participants •{' '}
                {ch.daysLeft} days left
              </div>
            </div>
            {isJoined ? (
              <span className="pr-chal-pill">
                {ch.points ?? 0} pts · #{ch.rank ?? ch.participants + 1}
              </span>
            ) : (
              <button className="btn btn-primary btn-small" onClick={() => joinChallenge(ch.id)}>
                Join
              </button>
            )}
          </div>
        );
      })}

      {/* 7. badges */}
      <div className="section-header">
        <h2>Badges</h2>
      </div>
      <div className="pr-badges">
        {badges.map((b) => (
          <div key={b.id} className="pr-badge">
            <div className="pr-badge-circle">
              {b.earned ? <span>{b.emoji}</span> : <span className="pr-badge-locked">🔒</span>}
            </div>
            <div className="pr-badge-label">{b.label}</div>
          </div>
        ))}
      </div>

      {/* 8. footer */}
      <div className="pr-footer">
        Member since {user.memberSince} · Wellhub replica — demo only
      </div>

      {/* booking cancel sheet */}
      {sheetClass && (
        <div className="sheet-backdrop" onClick={() => setSheetClass(null)}>
          <div className="sheet" onClick={(e) => e.stopPropagation()}>
            <div className="sheet-grabber" />
            <div className="pr-sheet-row">
              <LogoTile
                bg={sheetVenue.iconBg}
                fg={sheetVenue.iconFg}
                src={sheetVenue.logo}
                label={sheetVenue.short}
                size={48}
              />
              <div>
                <div className="pr-sheet-name">{sheetClass.name}</div>
                <div className="pr-sheet-venue">
                  {sheetVenue.name} • {sheetClass.duration}
                </div>
                <div className="pr-sheet-time">
                  {dayInfo(sheetClass.dayOffset).label} • {sheetClass.start} - {sheetClass.end}
                </div>
              </div>
            </div>
            <p className="pr-sheet-note">
              You can cancel until 2 hours before class without losing the check-in.
            </p>
            <button
              className="btn btn-outline btn-block"
              onClick={() => {
                actions.cancelBooking(sheetClass.id);
                setSheetClass(null);
              }}
            >
              Cancel booking
            </button>
            <button className="text-link pr-sheet-keep" onClick={() => setSheetClass(null)}>
              Keep booking
            </button>
          </div>
        </div>
      )}

      <Toast toast={toast} />
    </div>
  );
}

// ---------- settings overlay ----------

export function SettingsPage({ app }) {
  const [toast, showToast] = useToast();
  const demoTap = () => showToast('Not available in this demo');

  const groups = [
    {
      label: 'Account',
      rows: [
        { name: 'Name', value: 'Kenil Thakkar' },
        { name: 'Email', value: 'kenil@acme.com' },
        { name: 'Phone', value: '+1 ••• ••• 4821' },
      ],
    },
    {
      label: 'Subscriptions',
      rows: [
        { name: 'Manage plan', action: () => app.actions.openPlans() },
        { name: 'Pause plan' },
        { name: 'Family members' },
        { name: 'Activity and Billing Statement' },
      ],
    },
    {
      label: 'Payments',
      rows: [
        { name: 'Payment methods', value: 'Visa •• 4242' },
        { name: 'Billing history' },
        { name: 'Flexible benefit', value: '$25.00 credits' },
      ],
    },
    {
      label: 'Preferences',
      rows: [
        { name: 'Notifications' },
        { name: 'Communication preferences' },
        { name: 'Language', value: 'English US' },
      ],
    },
  ];

  return (
    <div className="overlay-page">
      <div className="pr-topbar">
        <button className="icon-btn" aria-label="Back" onClick={() => app.actions.pop()}>
          <BackIcon size={20} />
        </button>
        <span className="pr-topbar-title">Settings</span>
        <span className="pr-topbar-spacer" />
      </div>
      <div className="pr-scroll">
        {groups.map((g) => (
          <div key={g.label}>
            <div className="pr-group-label">{g.label}</div>
            <div className="card pr-group-card">
              {g.rows.map((r) => (
                <button key={r.name} className="pr-set-row" onClick={r.action || demoTap}>
                  <span className="pr-set-name">{r.name}</span>
                  {r.value && <span className="pr-set-value">{r.value}</span>}
                  <ChevronRight size={17} className="pr-set-chev" />
                </button>
              ))}
            </div>
          </div>
        ))}
        <button className="pr-delete" onClick={demoTap}>
          Delete account
        </button>
        <div className="pr-version">Version 10.57.13 (replica)</div>
      </div>
      <Toast toast={toast} />
    </div>
  );
}

// ---------- plans overlay ----------

const TIER_BULLETS = {
  Digital: [
    'All digital wellness apps included',
    'Live online classes every day',
    'Meditation, sleep and nutrition content',
  ],
  Starter: ['2,900+ gyms and studios', 'All digital wellness apps', '1 check-in per day'],
  'Starter+': [
    '4,800+ gyms and studios',
    'Group classes at select studios',
    '1 check-in per day',
  ],
  Basic: ['7,400+ gyms and studios', 'Group classes included', 'All digital wellness apps'],
  Bronze: [
    '9,200+ gyms and studios',
    'More locations for habit-building',
    'Group classes included',
  ],
  Silver: [
    '11,000+ gyms and studios',
    'Boutique studios start here',
    'Yoga, boxing and cycling classes',
  ],
  Titanium: [
    '13,500+ gyms and studios',
    'Premium studios: 4 visits/month',
    'Full class network access',
  ],
  Gold: [
    '15,000+ gyms and studios',
    'Premium studios: 4 visits/month',
    '2 private sessions per month',
  ],
  Platinum: [
    '16,500+ gyms and studios',
    'Premium and specialty studios',
    '2 private sessions per month',
  ],
  Diamond: [
    '18,000+ gyms and studios',
    'The full premium network',
    '4 private sessions per month',
  ],
};

export function PlansPage({ app }) {
  const [demoFor, setDemoFor] = useState(null);

  return (
    <div className="overlay-page">
      <div className="pr-topbar">
        <button className="icon-btn" aria-label="Close" onClick={() => app.actions.pop()}>
          <CloseIcon size={20} />
        </button>
        <span className="pr-topbar-spacer" />
      </div>
      <div className="pr-scroll">
        <div className="pr-plans-head">
          <h1 className="headline" style={{ fontSize: 28 }}>
            Wellbeing your way
          </h1>
          <p className="pr-plans-sub">
            Plans through {app.user.company} — prices shown are list prices.
          </p>
        </div>
        {plans.map((p) => {
          const current = p.name === app.user.plan;
          const price = p.price === 0 ? 'Free' : `$${p.price.toFixed(2)}/mo`;
          return (
            <div key={p.name} className={`card pr-plan-card ${current ? 'pr-plan-current' : ''}`}>
              {current && <span className="corner-tag pr-plan-tag">Your plan</span>}
              <div className="pr-plan-top">
                <span className="pr-plan-name">{p.name}</span>
                <span className="pr-plan-price">{price}</span>
              </div>
              <p className="pr-plan-blurb">{p.blurb}</p>
              <div className="pr-plan-bullets">
                {(TIER_BULLETS[p.name] || []).map((b) => (
                  <div key={b} className="pr-bullet">
                    <CheckIcon size={16} className="pr-bullet-check" />
                    <span>{b}</span>
                  </div>
                ))}
              </div>
              {demoFor === p.name ? (
                <div className="pr-demo-row">Demo only — plan changes are disabled</div>
              ) : current ? (
                <button className="btn btn-outline btn-block" onClick={() => setDemoFor(p.name)}>
                  Manage
                </button>
              ) : (
                <button className="btn btn-primary btn-block" onClick={() => setDemoFor(p.name)}>
                  Get plan
                </button>
              )}
            </div>
          );
        })}
        <div className="pr-plans-pad" />
      </div>
    </div>
  );
}
