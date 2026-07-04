// Explore tab — search & discovery: partner feed, map view,
// class schedule, and wellness apps, filtered by category chips.

import { useRef, useState } from 'react';
import {
  partners,
  plans,
  inPlan,
  wellnessApps,
  classes,
  classVenue,
  next7Days,
} from '../data/mock.js';
import { LogoTile, MapCanvas, PIN_SPOTS } from '../components/ui.jsx';
import { Flywheel } from '../components/Logo.jsx';
import {
  SearchIcon,
  PinIcon,
  CloseIcon,
  ChevronDown,
  PersonIcon,
  ClockIcon,
  PlayIcon,
  CheckIcon,
  CalendarIcon,
  StarIcon,
} from '../components/Icons.jsx';
import './ExploreScreen.css';

const CATEGORIES = [
  { id: 'classes', label: 'Classes' },
  { id: 'gyms', label: 'Gyms and studios' },
  { id: 'apps', label: 'Apps' },
];

const CARD_STRIDE = 312; // 300px map card + 12px gap

export default function ExploreScreen({ app }) {
  const { exploreFilter, actions, bookings } = app;

  const [search, setSearch] = useState('');
  const [viewPlan, setViewPlan] = useState(app.user.plan);
  const [planMenuOpen, setPlanMenuOpen] = useState(false);
  const [mapView, setMapView] = useState(false);
  const [selectedPin, setSelectedPin] = useState(partners[0].id);
  const [selectedDay, setSelectedDay] = useState(0);
  const [expandedClass, setExpandedClass] = useState(null);
  const [sheetApp, setSheetApp] = useState(null);
  const [activated, setActivated] = useState(() => new Set());
  const railRef = useRef(null);

  // ---------- search matching ----------

  const q = search.trim().toLowerCase();
  const partnerMatch = (p) =>
    !q ||
    p.name.toLowerCase().includes(q) ||
    p.type.toLowerCase().includes(q) ||
    p.tags.some((t) => t.toLowerCase().includes(q));
  const classMatch = (c) => {
    if (!q) return true;
    const venue = classVenue(c);
    return (
      c.name.toLowerCase().includes(q) ||
      c.activity.toLowerCase().includes(q) ||
      venue.name.toLowerCase().includes(q)
    );
  };
  const appMatch = (a) =>
    !q || a.name.toLowerCase().includes(q) || a.cats.some((c) => c.toLowerCase().includes(q));

  const filtersActive = exploreFilter !== 'all' || search !== '';
  const clearAll = () => {
    actions.setExploreFilter('all');
    setSearch('');
  };

  // ---------- data slices ----------

  const nearYou = partners.slice(0, 6).filter(partnerMatch);
  const recommended = [...partners]
    .filter((p) => p.bookable)
    .sort((a, b) => b.rating - a.rating)
    .filter(partnerMatch)
    .slice(0, 6);
  const allPartners = partners.filter(partnerMatch);

  const pinned = partners.slice(0, 9);
  const mapPins = pinned.map((p, i) => ({ id: p.id, label: p.name, ...PIN_SPOTS[i] }));

  const dayClasses = classes.filter((c) => c.dayOffset === selectedDay && classMatch(c));
  const appResults = wellnessApps.filter(appMatch);

  // ---------- map view helpers ----------

  const focusPin = (id) => {
    setSelectedPin(id);
    const idx = pinned.findIndex((p) => p.id === id);
    if (idx >= 0) railRef.current?.scrollTo({ left: idx * CARD_STRIDE, behavior: 'smooth' });
  };

  const onRailScroll = (e) => {
    const idx = Math.max(
      0,
      Math.min(pinned.length - 1, Math.round(e.currentTarget.scrollLeft / CARD_STRIDE))
    );
    if (pinned[idx].id !== selectedPin) setSelectedPin(pinned[idx].id);
  };

  const hoursLine = (p) => {
    if (!p.open) return `Closed · opens ${p.hours.split(' - ')[0]}`;
    return p.closesAt === '24/7' ? 'Open 24 hours' : `Open · closes ${p.closesAt}`;
  };

  // ---------- shared renderers ----------

  const partnerTile = (p) => (
    <button key={p.id} className="ex-tile" onClick={() => actions.openPartner(p.id)}>
      <LogoTile bg={p.iconBg} fg={p.iconFg} src={p.logo} label={p.short} size={96} />
      <span className="ex-tile-name">{p.name}</span>
      <span className="ex-tile-rating">
        <StarIcon size={12} filled />
        {p.rating.toFixed(2)}
      </span>
      <span className="ex-tile-dist">
        <PinIcon size={12} />
        {p.distance}
      </span>
    </button>
  );

  const partnerRow = (p, withStars) => (
    <button key={p.id} className="ex-row" onClick={() => actions.openPartner(p.id)}>
      <LogoTile bg={p.iconBg} fg={p.iconFg} src={p.logo} label={p.short} size={48} />
      <span className="ex-row-main">
        <span className="ex-row-name">{p.name}</span>
        <span className="ex-row-tags">{p.tags.join(' • ')}</span>
        {withStars && (
          <span className="ex-row-stars">
            <StarIcon size={12} filled />
            <b>{p.rating.toFixed(2)}</b> ({p.reviews.toLocaleString()})
          </span>
        )}
      </span>
      <span className="ex-row-side">
        <span className="ex-row-dist">
          <PinIcon size={12} />
          {p.distance}
        </span>
        {!inPlan(p.minPlan, viewPlan) && <span className="ex-row-plan">From {p.minPlan}</span>}
      </span>
    </button>
  );

  const spotsLabel = (c) => {
    if (c.spotsLeft === 0) return <span className="ex-class-spots">Full · Notify me</span>;
    if (c.spotsLeft <= 3)
      return (
        <span className="ex-class-spots ex-class-spots-low">
          Only {c.spotsLeft} spot{c.spotsLeft === 1 ? '' : 's'} left
        </span>
      );
    return <span className="ex-class-spots">{c.spotsLeft} spots left</span>;
  };

  // ---------- per-filter body ----------

  let body;

  if (exploreFilter === 'all' && mapView) {
    body = (
      <div className="ex-mapview">
        <MapCanvas height={420} pins={mapPins} selectedId={selectedPin} onPinClick={focusPin} />
        <button
          className="icon-btn ex-mapview-close"
          onClick={() => setMapView(false)}
          aria-label="Close map view"
        >
          <CloseIcon size={17} />
        </button>
        <div className="ex-map-cards" ref={railRef} onScroll={onRailScroll}>
          {pinned.map((p) => (
            <button key={p.id} className="ex-map-card" onClick={() => actions.openPartner(p.id)}>
              <LogoTile bg={p.iconBg} fg={p.iconFg} src={p.logo} label={p.short} size={46} />
              <span className="ex-map-card-main">
                <span className="ex-row-name">{p.name}</span>
                <span className={`ex-map-card-hours ${p.open ? 'ex-open' : 'ex-closed'}`}>
                  {hoursLine(p)}
                </span>
                <span className="ex-row-tags">{p.tags.join(' • ')}</span>
              </span>
            </button>
          ))}
        </div>
      </div>
    );
  } else if (exploreFilter === 'all') {
    body = (
      <>
        {nearYou.length > 0 && (
          <>
            <div className="section-header">
              <h2>Your next workout is nearby</h2>
              <button className="ex-seeall" onClick={() => actions.setExploreFilter('gyms')}>
                See all
              </button>
            </div>
            <div className="hscroll">{nearYou.map((p) => partnerTile(p))}</div>
          </>
        )}

        {!q && (
          <div className="ex-ai-banner">
            <span className="ex-ai-fly" aria-hidden="true">
              <Flywheel size={340} color="#ffffff" />
            </span>
            <p className="ex-ai-text">
              Chat to create a routine that fits your week, mood and goals.
            </p>
            <button className="ex-map-fab" onClick={() => setMapView(true)} aria-label="Open map view">
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M9 4 3.5 6v14L9 18l6 2 5.5-2V4L15 6 9 4Z" />
                <path d="M9 4v14M15 6v14" />
              </svg>
              Map
            </button>
          </div>
        )}

        {recommended.length > 0 && (
          <>
            <div className="section-header">
              <h2>Recommended</h2>
            </div>
            <div className="hscroll">{recommended.map((p) => partnerTile(p))}</div>
          </>
        )}

        {allPartners.length > 0 ? (
          <>
            <div className="section-header">
              <h2>All partners</h2>
            </div>
            <div className="ex-list hairline-top hairline-bottom">
              {allPartners.map((p) => partnerRow(p, false))}
            </div>
          </>
        ) : (
          <div className="ex-empty">
            <SearchIcon size={24} />
            <h3>No results for “{search.trim()}”</h3>
            <p>Try a different activity, studio, or gym name.</p>
          </div>
        )}
      </>
    );
  } else if (exploreFilter === 'gyms') {
    const list = partners.filter(partnerMatch);
    body = (
      <>
        <div className="ex-count">
          {list.length} {list.length === 1 ? 'partner' : 'partners'} near you
        </div>
        {list.length > 0 ? (
          <div className="ex-list hairline-top hairline-bottom">
            {list.map((p) => partnerRow(p, true))}
          </div>
        ) : (
          <div className="ex-empty">
            <SearchIcon size={24} />
            <h3>No results for “{search.trim()}”</h3>
            <p>Try a different activity, studio, or gym name.</p>
          </div>
        )}
      </>
    );
  } else if (exploreFilter === 'classes') {
    body = (
      <>
        <div className="hscroll ex-days">
          {next7Days.map((d) => (
            <button
              key={d.offset}
              className={`ex-day ${selectedDay === d.offset ? 'ex-day-selected' : ''}`}
              onClick={() => setSelectedDay(d.offset)}
            >
              <span className="ex-day-dot" />
              <span className="ex-day-num">{d.dayNum}</span>
              <span className="ex-day-name">{d.dayName}</span>
            </button>
          ))}
        </div>

        {dayClasses.length > 0 ? (
          <div className="ex-list hairline-top hairline-bottom">
            {dayClasses.map((c) => {
              const venue = classVenue(c);
              const booked = bookings.includes(c.id);
              const expanded = expandedClass === c.id;
              return (
                <div
                  key={c.id}
                  className="ex-row ex-class-row"
                  onClick={() =>
                    c.online
                      ? setExpandedClass(expanded ? null : c.id)
                      : actions.openPartner(c.partnerId)
                  }
                >
                  <LogoTile bg={venue.iconBg} fg={venue.iconFg} src={venue.logo} label={venue.short} size={48} />
                  <div className="ex-row-main">
                    <span className="ex-row-name">{venue.name}</span>
                    <span className="ex-row-tags">
                      {c.name} · {c.activity} · {c.duration}
                    </span>
                    <span className="ex-class-meta">
                      <PersonIcon size={13} />
                      {c.instructor}
                    </span>
                    <span className="ex-class-meta">
                      <ClockIcon size={13} />
                      {c.start} - {c.end}
                    </span>
                    {spotsLabel(c)}
                    {c.online && expanded && (
                      <div className="ex-book-zone">
                        {booked ? (
                          <span className="btn btn-small ex-booked">
                            <CheckIcon size={14} />
                            Booked
                          </span>
                        ) : (
                          <button
                            className="btn btn-primary btn-small"
                            onClick={(e) => {
                              e.stopPropagation();
                              actions.bookClass(c.id);
                            }}
                          >
                            Book
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                  {c.online && (
                    <span className="corner-tag ex-online-tag">
                      <PlayIcon size={10} />
                      Online
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          <div className="ex-empty">
            <CalendarIcon size={24} />
            <h3>{q ? 'No classes match your search' : 'No classes on this day'}</h3>
            <p>Try another day, or explore gyms and studios near you.</p>
          </div>
        )}
      </>
    );
  } else {
    // 'apps'
    body = (
      <>
        <div className="ex-count">
          {appResults.length} {appResults.length === 1 ? 'app' : 'apps'} included with your plan
        </div>
        {appResults.length > 0 ? (
          <div className="ex-list hairline-top hairline-bottom">
            {appResults.map((a) => (
              <button key={a.id} className="ex-row" onClick={() => setSheetApp(a)}>
                <LogoTile bg={a.iconBg} label={a.glyph} size={48} />
                <span className="ex-row-main">
                  <span className="ex-row-name">{a.name}</span>
                  <span className="ex-row-tags">{a.cats.join(' • ')}</span>
                </span>
                <span className="corner-tag ex-online-tag">
                  <PlayIcon size={10} />
                  Online
                </span>
              </button>
            ))}
          </div>
        ) : (
          <div className="ex-empty">
            <SearchIcon size={24} />
            <h3>No results for “{search.trim()}”</h3>
            <p>Try searching for sleep, nutrition, or meditation.</p>
          </div>
        )}
      </>
    );
  }

  // ---------- render ----------

  const sheetActivated = sheetApp ? activated.has(sheetApp.id) : false;

  return (
    <div className="ex-wrap">
      <div className="ex-search-row">
        <div className="ex-search">
          <SearchIcon size={18} />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Gyms, studios, activities"
            aria-label="Search gyms, studios, activities"
          />
        </div>
      </div>

      {planMenuOpen && <div className="ex-menu-backdrop" onClick={() => setPlanMenuOpen(false)} />}

      <div className="ex-chip-zone">
        <div className="hscroll ex-chips">
          {filtersActive && (
            <button className="ex-clear-btn" onClick={clearAll} aria-label="Clear filters">
              <CloseIcon size={15} />
            </button>
          )}
          <button className="chip chip-selected" onClick={() => setPlanMenuOpen((o) => !o)}>
            {viewPlan}
            <ChevronDown size={14} />
          </button>
          {CATEGORIES.map((c) => (
            <button
              key={c.id}
              className={`chip ${exploreFilter === c.id ? 'chip-selected' : ''}`}
              onClick={() => actions.setExploreFilter(exploreFilter === c.id ? 'all' : c.id)}
            >
              {c.label}
            </button>
          ))}
        </div>

        {planMenuOpen && (
          <div className="ex-plan-menu">
            <div className="ex-plan-menu-label">Preview a plan</div>
            {plans.map((pl) => (
              <button
                key={pl.name}
                className={`ex-plan-item ${pl.name === viewPlan ? 'ex-plan-active' : ''}`}
                onClick={() => {
                  setViewPlan(pl.name);
                  setPlanMenuOpen(false);
                }}
              >
                <span>
                  {pl.name}
                  {pl.name === app.user.plan && <span className="ex-plan-you"> · Your plan</span>}
                </span>
                <span className="ex-plan-price">${pl.price}/mo</span>
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="ex-loc hairline-top hairline-bottom">
        <PinIcon size={13} filled />
        Current location (19 mi radius)
        <ChevronDown size={13} />
      </div>

      <div className="ex-content">{body}</div>

      {sheetApp && (
        <div className="sheet-backdrop" onClick={() => setSheetApp(null)}>
          <div className="sheet" onClick={(e) => e.stopPropagation()}>
            <div className="sheet-grabber" />
            <div className="ex-sheet-head">
              <LogoTile bg={sheetApp.iconBg} label={sheetApp.glyph} size={56} />
              <div>
                <div className="ex-sheet-title">{sheetApp.name}</div>
                <div className="ex-sheet-cats">{sheetApp.cats.join(' • ')}</div>
              </div>
            </div>
            <p className="ex-sheet-blurb">{sheetApp.blurb}</p>
            <div className="ex-steps-title">How to activate this app</div>
            {[
              `Open the ${sheetApp.name} app — or download it from your app store.`,
              'Sign in with your Wellhub account to link your membership.',
              'Enjoy premium access — it’s included in your plan.',
            ].map((step, i) => (
              <div key={step} className="ex-step">
                <span className="ex-step-num">{i + 1}</span>
                <span className="ex-step-text">{step}</span>
              </div>
            ))}
            <button
              className={`btn btn-block ex-activate ${
                sheetActivated ? 'ex-activated' : 'btn-primary'
              }`}
              onClick={() => {
                if (!sheetActivated) setActivated((prev) => new Set(prev).add(sheetApp.id));
              }}
            >
              {sheetActivated ? (
                <>
                  <CheckIcon size={16} />
                  Activated
                </>
              ) : (
                'Activate'
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
