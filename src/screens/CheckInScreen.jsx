// "Check in" tab — the app's home screen.
// Top bar, greeting headline, today's upcoming class card,
// walk-in carousel over the light map, and the bookings list.

import { useRef, useState } from 'react';
import './CheckInScreen.css';
import { partners, inPlan, dayInfo, classVenue } from '../data/mock.js';
import { LogoTile, MapCanvas, PIN_SPOTS } from '../components/ui.jsx';
import { Flywheel } from '../components/Logo.jsx';
import {
  HistoryIcon,
  RefreshIcon,
  ClockIcon,
  LotusIcon,
  PlayIcon,
} from '../components/Icons.jsx';

const WALK_IN_PARTNERS = partners.filter((p) => p.walkIn);

// "5:30 PM" -> minutes since midnight, for sorting classes.
const toMinutes = (t) => {
  const [time, meridiem] = t.split(' ');
  const [h, m] = time.split(':').map(Number);
  let hh = h % 12;
  if (meridiem === 'PM') hh += 12;
  return hh * 60 + m;
};

const shuffled = (arr) => {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
};

// width (200) + gap (12) of a walk-in card, for scroll-index math
const CARD_STRIDE = 212;

function OnlineTag() {
  return (
    <span className="corner-tag ci-tag">
      <PlayIcon size={10} /> Online
    </span>
  );
}

export default function CheckInScreen({ app, bookedClasses }) {
  const [walkIns, setWalkIns] = useState(WALK_IN_PARTNERS);
  const [scrollIdx, setScrollIdx] = useState(0);
  const carouselRef = useRef(null);

  // next booked class happening today (earliest start wins)
  const todayClasses = bookedClasses
    .filter((c) => c.dayOffset === 0)
    .sort((a, b) => toMinutes(a.start) - toMinutes(b.start));
  const nextToday = todayClasses[0];
  const nextVenue = nextToday ? classVenue(nextToday) : null;

  // remaining bookings, soonest first
  const otherBookings = bookedClasses
    .filter((c) => c !== nextToday)
    .sort(
      (a, b) =>
        a.dayOffset - b.dayOffset || toMinutes(a.start) - toMinutes(b.start)
    );

  const pins = walkIns
    .slice(0, Math.min(6, PIN_SPOTS.length))
    .map((p, i) => ({ id: p.id, label: p.name, ...PIN_SPOTS[i] }));

  const reshuffle = () => {
    setWalkIns((w) => shuffled(w));
    setScrollIdx(0);
    if (carouselRef.current) {
      carouselRef.current.scrollTo({ left: 0, behavior: 'smooth' });
    }
  };

  const onCarouselScroll = (e) => {
    const idx = Math.round(e.currentTarget.scrollLeft / CARD_STRIDE);
    setScrollIdx(Math.max(0, Math.min(walkIns.length - 1, idx)));
  };

  return (
    <div className="ci-screen">
      {/* top bar */}
      <header className="ci-topbar">
        <Flywheel size={26} color="var(--ink)" />
        <button
          className="icon-btn ci-history-btn"
          aria-label="Check-in history"
          onClick={() => app.actions.openHistory()}
        >
          <HistoryIcon size={20} />
        </button>
      </header>

      {/* headline */}
      <h1 className="headline ci-headline">
        {nextToday ? 'Ready to feel good?' : 'Ready to check in?'}
      </h1>

      {/* upcoming class today */}
      {nextToday && (
        <div className="card ci-next-card">
          <div className="ci-next-top">
            <LogoTile
              bg={nextVenue.iconBg}
              fg={nextVenue.iconFg}
              src={nextVenue.logo}
              label={nextVenue.short}
              size={46}
            />
            <div className="ci-next-names">
              <div className="ci-next-venue">{nextVenue.name}</div>
              <div className="ci-next-class">
                {nextToday.name} &bull; {nextToday.activity}
              </div>
            </div>
            {nextToday.online ? (
              <OnlineTag />
            ) : (
              <span className="corner-tag ci-tag">in-person</span>
            )}
          </div>
          <div className="dashed-divider" />
          <div className="ci-sched">
            <ClockIcon size={16} />
            <span>
              <strong>{dayInfo(0).label}</strong> &bull; {nextToday.start} -{' '}
              {nextToday.end}
            </span>
          </div>
          <button
            className="btn btn-primary btn-block"
            onClick={() => app.actions.checkIn(nextVenue, nextToday.name)}
          >
            Check in
          </button>
        </div>
      )}

      {/* nearby gyms & studios */}
      <div className="section-header ci-band">
        <h2>Gyms and studios near you</h2>
        <button
          className="ci-refresh"
          aria-label="Shuffle walk-ins"
          onClick={reshuffle}
        >
          <RefreshIcon size={18} />
        </button>
      </div>

      <div className="ci-map-wrap">
        <MapCanvas
          height={300}
          pins={pins}
          onPinClick={(id) => app.actions.openPartner(id)}
        />
        <div
          className="hscroll ci-walkin-scroll"
          ref={carouselRef}
          onScroll={onCarouselScroll}
        >
          {walkIns.map((p) => (
            <div
              key={p.id}
              className="card ci-walkin-card"
              onClick={() => app.actions.openPartner(p.id)}
            >
              <div className="ci-walkin-top">
                <LogoTile bg={p.iconBg} fg={p.iconFg} src={p.logo} label={p.short} size={40} />
                <div className="ci-next-names">
                  <div className="ci-walkin-name">{p.name}</div>
                  <div className="ci-walkin-dist">{p.distance}</div>
                </div>
              </div>
              {inPlan(p.minPlan) ? (
                <button
                  className="btn btn-outline btn-small ci-walkin-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    app.actions.checkIn(p, p.activityLabel || 'Gym access');
                  }}
                >
                  Check in
                </button>
              ) : (
                <div className="ci-walkin-na">Not in your plan</div>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="ci-dots">
        {walkIns.map((p, i) => (
          <span
            key={p.id}
            className={`ci-dot ${i === scrollIdx ? 'ci-dot-active' : ''}`}
          />
        ))}
      </div>

      {/* bookings */}
      <div className="section-header ci-band">
        <h2>Bookings</h2>
      </div>

      {otherBookings.map((cls) => {
        const venue = classVenue(cls);
        return (
          <div key={cls.id} className="card ci-booking-card">
            <div className="ci-next-top">
              <LogoTile
                bg={venue.iconBg}
                fg={venue.iconFg}
                src={venue.logo}
                label={venue.short}
                size={44}
              />
              <div className="ci-next-names">
                <div className="ci-next-venue">{cls.name}</div>
                <div className="ci-next-class">{venue.name}</div>
              </div>
              {cls.online && <OnlineTag />}
            </div>
            <div className="dashed-divider" />
            <div className="ci-sched ci-booking-sched">
              <ClockIcon size={16} />
              <span>
                <strong>{dayInfo(cls.dayOffset).label}</strong> &bull;{' '}
                {cls.start}
              </span>
            </div>
          </div>
        );
      })}

      <div className="ci-empty-card">
        <div className="ci-empty-top">
          <span className="ci-lotus-circle">
            <LotusIcon size={24} />
          </span>
          <div className="ci-empty-title">Choose from 100+ activities!</div>
        </div>
        <div className="dashed-divider" />
        <div className="ci-empty-link-row">
          <button
            className="text-link"
            onClick={() => app.actions.goExplore('classes')}
          >
            Book a class
          </button>
        </div>
      </div>
    </div>
  );
}
