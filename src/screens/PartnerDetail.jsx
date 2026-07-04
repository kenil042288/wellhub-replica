// Partner detail overlay: venue profile, schedule, and booking flow.

import { useEffect, useRef, useState } from 'react';
import { getPartner, inPlan, classes, next7Days, dayInfo } from '../data/mock.js';
import { LogoTile, Stars } from '../components/ui.jsx';
import { Flywheel } from '../components/Logo.jsx';
import {
  BackIcon,
  ShareIcon,
  HeartIcon,
  PinIcon,
  PhoneIcon,
  GlobeIcon,
  ChevronRight,
  ChevronDown,
  CheckIcon,
  PersonIcon,
  ClockIcon,
  CalendarIcon,
} from '../components/Icons.jsx';
import './PartnerDetail.css';

const WEEKDAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

function spotsLabel(n) {
  if (n === 0) return 'Full';
  if (n <= 3) return `Only ${n} spot${n > 1 ? 's' : ''} left`;
  return `${n} spots left`;
}

export default function PartnerDetail({ app, partnerId }) {
  const p = getPartner(partnerId);
  const included = inPlan(p.minPlan);
  const partnerClasses = classes.filter((c) => c.partnerId === partnerId);
  const firstClassDay =
    next7Days.find((d) => partnerClasses.some((c) => c.dayOffset === d.offset))?.offset ?? 0;

  const [view, setView] = useState('main'); // 'main' | 'schedule'
  const [aboutOpen, setAboutOpen] = useState(false);
  const [hoursOpen, setHoursOpen] = useState(false);
  const [selectedDay, setSelectedDay] = useState(firstClassDay);
  const [notified, setNotified] = useState(() => new Set());
  const [sheet, setSheet] = useState(null); // { cls, stage: 'confirm' | 'success' }
  const [invited, setInvited] = useState(false);
  const [toast, setToast] = useState(null);
  const toastTimer = useRef(null);

  useEffect(() => () => clearTimeout(toastTimer.current), []);

  const showToast = (msg) => {
    clearTimeout(toastTimer.current);
    setToast(msg);
    toastTimer.current = setTimeout(() => setToast(null), 1500);
  };

  const phone = p.phone || `(415) 555-01${String(p.reviews % 100).padStart(2, '0')}`;
  const site = `${p.id}.com`;
  const dayClasses = partnerClasses.filter((c) => c.dayOffset === selectedDay);

  const closeSheet = () => {
    setSheet(null);
    setInvited(false);
  };

  const openSheet = (cls) => {
    setInvited(false);
    setSheet({ cls, stage: 'confirm' });
  };

  const confirmBooking = () => {
    app.actions.bookClass(sheet.cls.id);
    setSheet((s) => ({ ...s, stage: 'success' }));
  };

  return (
    <div className="overlay-page">
      {/* ---- top bar ---- */}
      <div className="pd-topbar">
        <button
          className="icon-btn"
          aria-label="Back"
          onClick={() => (view === 'schedule' ? setView('main') : app.actions.pop())}
        >
          <BackIcon size={20} />
        </button>
        <div className="pd-topbar-right">
          <button className="icon-btn" aria-label="Share" onClick={() => showToast('Link copied')}>
            <ShareIcon size={19} />
          </button>
          <button
            className="icon-btn"
            aria-label="Favorite"
            onClick={() => app.actions.toggleFavorite(partnerId)}
          >
            <HeartIcon size={19} filled={app.favorites.has(partnerId)} />
          </button>
        </div>
      </div>

      {view === 'main' ? (
        <>
          {/* ---- main scroll ---- */}
          <div className="pd-body">
            {/* photo gallery */}
            <div className="hscroll pd-gallery">
              {p.photos.map((pair, i) => (
                <div
                  key={i}
                  className="pd-photo"
                  style={{ background: `linear-gradient(135deg, ${pair[0]}, ${pair[1]})` }}
                >
                  {p.logo ? (
                    <span className="pd-photo-logo">
                      <img src={p.logo} alt={p.name} draggable={false} />
                    </span>
                  ) : (
                    <span className="pd-photo-initials">{p.short}</span>
                  )}
                  <span className="pd-photo-mark">
                    <Flywheel size={120} color="rgba(255,255,255,0.16)" />
                  </span>
                </div>
              ))}
            </div>

            {/* title block */}
            <div className="pd-title-block">
              <h1 className="headline pd-name">{p.name}</h1>
              <div className="pd-rating-row">
                <span className="pd-rating">{p.rating}</span>
                <Stars rating={p.rating} size={13} />
                <span className="pd-rating-gray">({p.reviews.toLocaleString()} reviews)</span>
                <span className="pd-rating-gray">· {p.type}</span>
              </div>
              {included ? (
                <span className="corner-tag pd-tag-lime">Included in your {app.user.plan} plan</span>
              ) : (
                <span className="corner-tag pd-tag-purple">Available from {p.minPlan}</span>
              )}
            </div>

            {/* utility rows */}
            <div className="card pd-util-card">
              <button className="pd-util-row" onClick={() => showToast('Address copied')}>
                <PinIcon size={18} className="pd-util-icon" />
                <span className="pd-util-text">{p.address}</span>
                <ChevronRight size={17} className="pd-util-chev" />
              </button>
              <button className="pd-util-row" onClick={() => showToast(`Calling ${phone}…`)}>
                <PhoneIcon size={18} className="pd-util-icon" />
                <span className="pd-util-text">{phone}</span>
                <ChevronRight size={17} className="pd-util-chev" />
              </button>
              <button className="pd-util-row" onClick={() => showToast(`Opening ${site}…`)}>
                <GlobeIcon size={18} className="pd-util-icon" />
                <span className="pd-util-text">{site}</span>
                <ChevronRight size={17} className="pd-util-chev" />
              </button>
            </div>

            {/* about */}
            <div className="pd-section">
              <h2 className="pd-h">About {p.name}</h2>
              <button className="pd-about" onClick={() => setAboutOpen((v) => !v)}>
                <p className={`pd-about-text ${aboutOpen ? '' : 'pd-clamp'}`}>{p.about}</p>
                <ChevronDown
                  size={18}
                  className={`pd-about-chev ${aboutOpen ? 'pd-flip' : ''}`}
                />
              </button>
            </div>

            {/* included in plan */}
            <div className="pd-section">
              {included ? (
                <>
                  <h2 className="pd-h">Included in your {app.user.plan} plan</h2>
                  <div className="card pd-included-card">
                    {p.included.map((item) => (
                      <div key={item} className="pd-included-row">
                        <CheckIcon size={18} className="pd-check-green" />
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                </>
              ) : (
                <div className="pd-upgrade-card">
                  <p>
                    This partner is available from the <strong>{p.minPlan}</strong> plan
                  </p>
                  <button className="btn btn-outline btn-small" onClick={app.actions.openPlans}>
                    See plans
                  </button>
                </div>
              )}
            </div>

            {/* hours */}
            <div className="pd-section">
              <button className="pd-hours-row" onClick={() => setHoursOpen((v) => !v)}>
                <span className={p.open ? 'pd-open' : 'pd-closed'}>
                  {p.open ? 'Open' : 'Closed'}
                </span>
                <span className="pd-hours-gray">
                  {p.closesAt === '24/7' ? '· Open 24 hours' : `· Closes at ${p.closesAt}`}
                </span>
                <ChevronDown size={17} className={`pd-hours-chev ${hoursOpen ? 'pd-flip' : ''}`} />
              </button>
              {hoursOpen && (
                <div className="card pd-hours-list">
                  {WEEKDAYS.map((day) => (
                    <div key={day} className="pd-hours-item">
                      <span>{day}</span>
                      <span className="pd-hours-val">{p.hours}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* activities */}
            <div className="pd-section">
              <h2 className="pd-h">Activities</h2>
              <div className="pd-chip-wrap">
                {p.activities.map((a) => (
                  <span key={a} className="pd-tag">
                    {a}
                  </span>
                ))}
              </div>
            </div>

            {/* amenities */}
            <div className="pd-section">
              <h2 className="pd-h">Amenities</h2>
              <div className="pd-chip-wrap">
                {p.amenities.map((a) => (
                  <span key={a} className="pd-tag">
                    <CheckIcon size={13} className="pd-check-green" />
                    {a}
                  </span>
                ))}
              </div>
            </div>

            <div className="pd-bottom-spacer" />
          </div>

          {/* ---- pinned CTA bar ---- */}
          {(included ? p.bookable || p.walkIn : true) && (
            <div className="pd-cta">
              {included ? (
                <>
                  {p.walkIn && (
                    <button
                      className="btn btn-outline"
                      onClick={() => app.actions.checkIn(p, p.activityLabel || p.included[0] || 'Gym access')}
                    >
                      Check in
                    </button>
                  )}
                  {p.bookable && (
                    <button className="btn btn-primary" onClick={() => setView('schedule')}>
                      View schedule
                    </button>
                  )}
                </>
              ) : (
                <button className="btn btn-primary btn-block" onClick={app.actions.openPlans}>
                  See {p.minPlan} plans
                </button>
              )}
            </div>
          )}
        </>
      ) : (
        /* ---- schedule view ---- */
        <div className="pd-body">
          <div className="pd-sched-head">
            <h1 className="headline pd-sched-title">Schedule</h1>
            <p className="pd-sched-sub">{p.name}</p>
          </div>

          <div className="pd-days">
            {next7Days.map((d) => {
              const sel = d.offset === selectedDay;
              return (
                <button
                  key={d.offset}
                  className={`pd-day ${sel ? 'pd-day-sel' : ''}`}
                  onClick={() => setSelectedDay(d.offset)}
                >
                  <span className="pd-day-dot" />
                  <span className="pd-day-num">{d.dayNum}</span>
                  <span className="pd-day-name">{d.dayName}</span>
                </button>
              );
            })}
          </div>

          <div className="pd-class-list">
            {dayClasses.length === 0 && (
              <div className="pd-empty">
                <CalendarIcon size={26} className="pd-empty-icon" />
                <p>No classes this day</p>
              </div>
            )}
            {dayClasses.map((c) => {
              const booked = app.bookings.includes(c.id);
              const full = c.spotsLeft === 0;
              const tappable = !booked && !full;
              const Row = tappable ? 'button' : 'div';
              return (
                <Row
                  key={c.id}
                  className={`card pd-class-row ${tappable ? 'pd-class-tap' : ''}`}
                  onClick={tappable ? () => openSheet(c) : undefined}
                >
                  <div className="pd-class-left">
                    <span className="corner-tag pd-tag-inperson">In-person</span>
                    <div className="pd-class-name">
                      {c.name} <span className="pd-class-dur">({c.duration})</span>
                    </div>
                    <div className="pd-class-meta">
                      <PersonIcon size={15} />
                      <span>{c.instructor}</span>
                    </div>
                    <div className="pd-class-meta">
                      <ClockIcon size={15} />
                      <span>
                        {c.start} - {c.end}
                      </span>
                    </div>
                    <div
                      className={`pd-class-spots ${
                        full ? 'pd-spots-full' : c.spotsLeft <= 3 ? 'pd-spots-low' : ''
                      }`}
                    >
                      {spotsLabel(c.spotsLeft)}
                    </div>
                  </div>
                  <div className="pd-class-right">
                    {booked ? (
                      <span className="pd-booked-tag">✓ Booked</span>
                    ) : full ? (
                      notified.has(c.id) ? (
                        <span className="pd-notified">✓ We&rsquo;ll notify you</span>
                      ) : (
                        <button
                          className="btn btn-outline btn-small"
                          onClick={() => setNotified((s) => new Set(s).add(c.id))}
                        >
                          Notify me
                        </button>
                      )
                    ) : (
                      <ChevronRight size={18} className="pd-class-chev" />
                    )}
                  </div>
                </Row>
              );
            })}
          </div>
          <div className="pd-bottom-spacer" />
        </div>
      )}

      {/* ---- booking sheet ---- */}
      {sheet && (
        <div className="sheet-backdrop" onClick={closeSheet}>
          <div className="sheet" onClick={(e) => e.stopPropagation()}>
            <div className="sheet-grabber" />
            {sheet.stage === 'confirm' ? (
              <>
                <h2 className="pd-sheet-title">Almost there</h2>
                <div className="pd-sheet-venue">
                  <LogoTile bg={p.iconBg} fg={p.iconFg} src={p.logo} label={p.short} size={44} />
                  <div>
                    <div className="pd-sheet-venue-name">{p.name}</div>
                    <div className="pd-sheet-venue-class">{sheet.cls.name}</div>
                  </div>
                </div>
                <div className="pd-sheet-rows">
                  <div className="pd-sheet-row">
                    <CalendarIcon size={17} />
                    <span>
                      {dayInfo(sheet.cls.dayOffset).label} • {sheet.cls.start} - {sheet.cls.end}
                    </span>
                  </div>
                  <div className="pd-sheet-row">
                    <PinIcon size={17} />
                    <span>{p.address}</span>
                  </div>
                  <div className="pd-sheet-row">
                    <PersonIcon size={17} />
                    <span>{sheet.cls.instructor}</span>
                  </div>
                </div>
                <p className="pd-sheet-spots">{sheet.cls.spotsLeft} spots left</p>
                <button className="btn btn-primary btn-block" onClick={confirmBooking}>
                  Confirm booking
                </button>
                <button className="text-link pd-sheet-link" onClick={closeSheet}>
                  Choose another time
                </button>
              </>
            ) : (
              <>
                <h2 className="pd-success-title">Let&rsquo;s do this! 🎉</h2>
                <p className="pd-success-summary">
                  {sheet.cls.name} at {p.name} — {dayInfo(sheet.cls.dayOffset).label} •{' '}
                  {sheet.cls.start} - {sheet.cls.end}
                </p>
                <button className="text-link pd-sheet-link" onClick={() => showToast('Added ✓')}>
                  Add to calendar
                </button>
                <p className="pd-success-note">
                  You can cancel until 2 hours before class without losing the check-in.
                </p>
                <div className="pd-success-banner">
                  <ClockIcon size={17} />
                  <span>Check-in opens 30 minutes before the class starts</span>
                </div>
                <button
                  className="btn btn-primary btn-block"
                  onClick={() => setInvited(true)}
                >
                  {invited ? 'Link copied ✓' : 'Invite a friend'}
                </button>
                <button className="text-link pd-sheet-link" onClick={closeSheet}>
                  Done
                </button>
              </>
            )}
          </div>
        </div>
      )}

      {/* ---- toast ---- */}
      {toast && <div className="pd-toast">{toast}</div>}
    </div>
  );
}
