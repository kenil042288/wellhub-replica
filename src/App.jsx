import { useEffect, useMemo, useState } from 'react';
import { user, usage, checkInHistory, initialBookings, getClass } from './data/mock.js';
import { PinIcon, SearchIcon, PersonIcon } from './components/Icons.jsx';
import CheckInScreen from './screens/CheckInScreen.jsx';
import ExploreScreen from './screens/ExploreScreen.jsx';
import ProfileScreen, { SettingsPage, PlansPage } from './screens/ProfileScreen.jsx';
import PartnerDetail from './screens/PartnerDetail.jsx';
import CheckedInModal, { HistoryPage } from './screens/CheckedInModal.jsx';
import WellhubLockup from './components/WellhubLockup.jsx';

// Launch screen: flat magenta with the centered white lockup, held
// briefly on cold start, then faded out (matches the real app).
function Splash() {
  const [phase, setPhase] = useState('show'); // show -> fade -> gone
  useEffect(() => {
    const t1 = setTimeout(() => setPhase('fade'), 1300);
    const t2 = setTimeout(() => setPhase('gone'), 1700);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, []);
  if (phase === 'gone') return null;
  return (
    <div className={`splash ${phase === 'fade' ? 'splash-fade' : ''}`} aria-hidden="true">
      <div className="splash-logo">
        <WellhubLockup width={198} color="#ffffff" />
      </div>
    </div>
  );
}

const TABS = [
  { id: 'checkin', label: 'Check in', Icon: PinIcon },
  { id: 'explore', label: 'Explore', Icon: SearchIcon },
  { id: 'profile', label: 'Profile', Icon: PersonIcon },
];

const clockNow = () => {
  const d = new Date();
  return `${d.getHours() % 12 || 12}:${String(d.getMinutes()).padStart(2, '0')}`;
};

function StatusBar() {
  const [time, setTime] = useState(clockNow);
  useEffect(() => {
    const id = setInterval(() => setTime(clockNow()), 15000);
    return () => clearInterval(id);
  }, []);
  return (
    <div className="status-bar">
      <span className="status-time">{time}</span>
      <span className="status-glyphs">
        <svg width="17" height="11" viewBox="0 0 17 11" fill="currentColor">
          <rect x="0" y="7" width="3" height="4" rx="0.8" />
          <rect x="4.5" y="5" width="3" height="6" rx="0.8" />
          <rect x="9" y="2.5" width="3" height="8.5" rx="0.8" />
          <rect x="13.5" y="0" width="3" height="11" rx="0.8" />
        </svg>
        <svg width="16" height="11" viewBox="0 0 16 11" fill="currentColor">
          <path d="M8 9.2a1.4 1.4 0 1 1 0 2.8 1.4 1.4 0 0 1 0-2.8ZM8 5.5c1.7 0 3.2.7 4.3 1.8l-1.5 1.5A3.9 3.9 0 0 0 8 7.6c-1.1 0-2 .4-2.8 1.2L3.7 7.3A6 6 0 0 1 8 5.5ZM8 1.5c2.8 0 5.3 1.1 7.1 2.9l-1.5 1.5A7.9 7.9 0 0 0 8 3.6c-2.2 0-4.2.9-5.6 2.3L.9 4.4A10 10 0 0 1 8 1.5Z" />
        </svg>
        <svg width="25" height="12" viewBox="0 0 25 12" fill="none" stroke="currentColor">
          <rect x="0.5" y="0.5" width="21" height="11" rx="3.5" opacity="0.4" />
          <rect x="2" y="2" width="15" height="8" rx="2" fill="currentColor" stroke="none" />
          <path d="M23 4v4a2 2 0 0 0 0-4Z" fill="currentColor" stroke="none" opacity="0.4" />
        </svg>
      </span>
    </div>
  );
}

function TabBar({ tab, onSelect }) {
  return (
    <nav className="tab-bar">
      {TABS.map(({ id, label, Icon }) => {
        const active = tab === id;
        return (
          <button
            key={id}
            className={`tab-item ${active ? 'tab-active' : ''}`}
            onClick={() => onSelect(id)}
          >
            <Icon size={24} filled={active} />
            <span>{label}</span>
          </button>
        );
      })}
    </nav>
  );
}

export default function App() {
  const [tab, setTab] = useState('checkin');
  const [exploreFilter, setExploreFilter] = useState('all');
  const [overlays, setOverlays] = useState([]);
  const [bookings, setBookings] = useState(initialBookings);
  const [history, setHistory] = useState(checkInHistory);
  const [favorites, setFavorites] = useState(() => new Set(['corepower']));

  const push = (overlay) => setOverlays((s) => [...s, overlay]);
  const pop = () => setOverlays((s) => s.slice(0, -1));

  const app = useMemo(
    () => ({
      user,
      usage,
      tab,
      exploreFilter,
      bookings,
      history,
      favorites,
      actions: {
        setTab,
        push,
        pop,
        goExplore(filter = 'all') {
          setExploreFilter(filter);
          setOverlays([]);
          setTab('explore');
        },
        setExploreFilter,
        openPartner(partnerId) {
          push({ type: 'partner', partnerId });
        },
        openHistory() {
          push({ type: 'history' });
        },
        openSettings() {
          push({ type: 'settings' });
        },
        openPlans() {
          push({ type: 'plans' });
        },
        checkIn(venue, activity) {
          setHistory((h) => [
            {
              id: `h-${h.length + 1}-${venue.id}`,
              partner: venue.name,
              activity,
              date: 'Today',
              time: 'Just now',
              status: 'Pending',
              rated: false,
            },
            ...h,
          ]);
          push({ type: 'checkedin', venue, activity });
        },
        bookClass(classId) {
          setBookings((b) => (b.includes(classId) ? b : [...b, classId]));
        },
        cancelBooking(classId) {
          setBookings((b) => b.filter((id) => id !== classId));
        },
        toggleFavorite(partnerId) {
          setFavorites((f) => {
            const next = new Set(f);
            next.has(partnerId) ? next.delete(partnerId) : next.add(partnerId);
            return next;
          });
        },
      },
    }),
    [tab, exploreFilter, bookings, history, favorites]
  );

  const bookedClasses = bookings.map(getClass).filter(Boolean);

  return (
    <div className="phone-stage">
      <div className="phone">
        <Splash />
        <StatusBar />
        <div className="screen">
          {tab === 'checkin' && <CheckInScreen app={app} bookedClasses={bookedClasses} />}
          {tab === 'explore' && <ExploreScreen app={app} />}
          {tab === 'profile' && <ProfileScreen app={app} bookedClasses={bookedClasses} />}
        </div>
        <TabBar
          tab={tab}
          onSelect={(id) => {
            setOverlays([]);
            setTab(id);
          }}
        />

        {overlays.map((ov, i) => {
          const key = `${ov.type}-${i}`;
          switch (ov.type) {
            case 'partner':
              return <PartnerDetail key={key} app={app} partnerId={ov.partnerId} />;
            case 'checkedin':
              return <CheckedInModal key={key} app={app} venue={ov.venue} activity={ov.activity} />;
            case 'history':
              return <HistoryPage key={key} app={app} />;
            case 'settings':
              return <SettingsPage key={key} app={app} />;
            case 'plans':
              return <PlansPage key={key} app={app} />;
            default:
              return null;
          }
        })}
      </div>
    </div>
  );
}
