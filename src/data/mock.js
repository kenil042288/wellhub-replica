// ============================================================
// Mock data for the Wellhub replica. Partner/app/plan names are
// real Wellhub network entries; venues are anchored to the
// Hoboken / Jersey City / NYC area like the user's real app.
// Only Crunch - Hoboken's address & phone are verified real;
// other street addresses are plausible stand-ins.
// ============================================================

export const user = {
  firstName: 'Kenil',
  lastName: 'Thakkar',
  plan: 'Gold',
  wellhubId: '1906462013399',
  company: 'Acme Corp',
  streakWeeks: 6,
  memberSince: 'March 2025',
};

// US plan tiers, ascending (list prices, mid-2026)
export const plans = [
  { name: 'Digital', price: 0, blurb: 'App-only: self-care, fitness and wellness apps. No gym access.' },
  { name: 'Starter', price: 11.99, blurb: 'Try out gyms, classes, and healthy activities.' },
  { name: 'Starter+', price: 26.99, blurb: 'Intro plan plus extra fitness and wellness options.' },
  { name: 'Basic', price: 37.99, blurb: 'More variety and new workouts to explore.' },
  { name: 'Bronze', price: 64.99, blurb: 'More in-network locations for habit-building.' },
  { name: 'Silver', price: 109.99, blurb: 'Boutique studios start appearing.' },
  { name: 'Titanium', price: 159.99, blurb: 'Premium classes at competitive prices.' },
  { name: 'Gold', price: 214.99, blurb: 'Endless options for fitness, wellness, and training.' },
  { name: 'Platinum', price: 289.99, blurb: 'More premium network options.' },
  { name: 'Diamond', price: 344.99, blurb: 'The most premium access in the network.' },
];

export const planRank = Object.fromEntries(plans.map((p, i) => [p.name, i]));

// Is a partner requiring `minPlan` included in the user's plan?
export const inPlan = (minPlan, userPlan = user.plan) =>
  planRank[minPlan] <= planRank[userPlan];

// ---------- partners (gyms & studios), sorted by distance ----------
// short/iconBg/iconFg drive the brand-styled wordmark tile (like the
// real app's logo squares); `logo` (when present) is a real asset.

export const partners = [
  {
    id: 'crunch',
    name: 'Crunch - Hoboken',
    short: 'CRUNCH',
    logo: `${import.meta.env.BASE_URL}logos/crunch.svg`,
    codeType: 'qr', // QR only, no digits — per real app (Nov 2026 screenshot)
    activityLabel: 'Gym + Classes',
    type: 'Gym',
    tags: ['Gym access', 'Classes', 'Cardio'],
    distance: '0.3 mi',
    walkIn: true,
    bookable: true,
    minPlan: 'Basic',
    rating: 4.24,
    reviews: 1284,
    address: '113 River St, Hoboken, NJ 07030',
    phone: '(201) 656-9989',
    hours: '5:00 AM - 11:00 PM',
    open: true,
    closesAt: '11 PM',
    about:
      'No judgments here — a gym built around fun classes, serious equipment, and a community that cheers you on.',
    included: ['Gym access', 'Group classes', 'HIITZone', 'Cardio floor'],
    activities: ['Strength', 'HIIT', 'Zumba', 'Cardio', 'Cycling'],
    amenities: ['Changing room', 'Workout equipment', 'Air conditioning', 'Wi-Fi', 'Parking'],
    iconBg: '#322968',
    photos: [
      ['#5b4191', '#a880ff'],
      ['#1b1340', '#5b4191'],
      ['#a880ff', '#dcff79'],
    ],
  },
  {
    id: 'corepower',
    name: 'CorePower Yoga - Hoboken',
    short: 'CPY',
    type: 'Yoga studio',
    tags: ['Yoga', 'Meditation'],
    distance: '0.4 mi',
    walkIn: true,
    bookable: true,
    minPlan: 'Silver',
    rating: 4.78,
    reviews: 612,
    address: '210 14th St, Hoboken, NJ',
    hours: '6:00 AM - 9:30 PM',
    open: true,
    closesAt: '9:30 PM',
    about:
      'Heated, high-intensity yoga that builds strength as much as stillness. Mats, towels, and showers on site.',
    included: ['Yoga Sculpt', 'C2 classes', 'Meditation'],
    activities: ['Vinyasa', 'Yoga Sculpt', 'Hot Power Fusion', 'Meditation'],
    amenities: ['Changing room', 'Showers', 'Mat rental', 'Heating', 'Wi-Fi'],
    iconBg: '#ffffff',
    iconFg: '#0b3d33',
    photos: [
      ['#034036', '#dcff79'],
      ['#0e7a4a', '#f6eddf'],
      ['#dcff79', '#a880ff'],
    ],
  },
  {
    id: 'soulcycle',
    name: 'SoulCycle - Hoboken',
    short: 'SOUL',
    type: 'Indoor cycling',
    tags: ['Cycling', 'Cardio'],
    distance: '0.6 mi',
    walkIn: false,
    bookable: true,
    minPlan: 'Titanium',
    rating: 4.93,
    reviews: 958,
    address: '221 Washington St, Hoboken, NJ',
    hours: '6:00 AM - 9:00 PM',
    open: true,
    closesAt: '9 PM',
    about:
      'Candlelit beats-driven rides that feel more like a party than a workout. Shoes included with every ride.',
    included: ['Premium classes (4 visits/month)'],
    activities: ['Cycling', 'SoulBeat', 'Rhythm ride'],
    amenities: ['Changing room', 'Showers', 'Shoe rental', 'Towels', 'Wi-Fi'],
    iconBg: '#ffe000',
    iconFg: '#141414',
    photos: [
      ['#f5c518', '#1b1340'],
      ['#ffbbce', '#d8385e'],
      ['#1b1340', '#f5c518'],
    ],
  },
  {
    id: 'stretchlab',
    name: 'StretchLab - Hoboken',
    short: 'SL',
    type: 'Assisted stretching',
    tags: ['Stretching', 'Recovery'],
    distance: '0.7 mi',
    walkIn: false,
    bookable: true,
    minPlan: 'Platinum',
    rating: 4.77,
    reviews: 204,
    address: '622 Washington St, Hoboken, NJ',
    hours: '8:00 AM - 8:00 PM',
    open: true,
    closesAt: '8 PM',
    about:
      'One-on-one assisted stretching with trained flexologists to move better and recover faster.',
    included: ['Available from Platinum'],
    activities: ['Assisted stretching', 'Mobility'],
    amenities: ['Private benches', 'Air conditioning', 'Wi-Fi'],
    iconBg: '#0e7a4a',
    photos: [
      ['#0e7a4a', '#dcff79'],
      ['#034036', '#f6eddf'],
      ['#dcff79', '#0e7a4a'],
    ],
  },
  {
    id: 'ymca',
    name: 'The Y - Hoboken',
    short: 'the Y',
    type: 'Community fitness',
    tags: ['Gym access', 'Swimming', 'Classes'],
    distance: '0.8 mi',
    walkIn: true,
    bookable: true,
    minPlan: 'Basic',
    rating: 4.52,
    reviews: 1876,
    address: '1301 Washington St, Hoboken, NJ',
    hours: '5:30 AM - 10:00 PM',
    open: true,
    closesAt: '10 PM',
    about:
      'Pools, courts, weights, and classes for every age — your neighborhood hub for moving more.',
    included: ['Gym access', 'Lap swimming', 'Group classes'],
    activities: ['Swimming', 'Basketball', 'Strength', 'Yoga', 'Pickleball'],
    amenities: ['Pool', 'Changing room', 'Showers', 'Parking', 'Childcare'],
    iconBg: '#ffffff',
    iconFg: '#1b4298',
    photos: [
      ['#5b4191', '#dcff79'],
      ['#034036', '#a880ff'],
      ['#f6eddf', '#5b4191'],
    ],
  },
  {
    id: 'f45',
    name: 'F45 Training - Hoboken',
    short: 'F45',
    type: 'Functional training',
    tags: ['HIIT', 'Functional', 'Strength'],
    distance: '0.9 mi',
    walkIn: true,
    bookable: true,
    minPlan: 'Gold',
    rating: 4.81,
    reviews: 733,
    address: '720 Monroe St, Hoboken, NJ',
    hours: '5:00 AM - 8:00 PM',
    open: true,
    closesAt: '8 PM',
    about:
      '45 minutes, 27 stations, zero boredom. Functional team training with new circuits every single day.',
    included: ['Team training classes'],
    activities: ['HIIT', 'Functional', 'Strength', 'Cardio'],
    amenities: ['Changing room', 'Heart-rate tracking', 'Air conditioning', 'Wi-Fi'],
    iconBg: '#0d2b4a',
    photos: [
      ['#0b2740', '#dcff79'],
      ['#1b1340', '#a880ff'],
      ['#d8385e', '#0b2740'],
    ],
  },
  {
    id: 'solidcore',
    name: '[solidcore] - Hoboken',
    short: '[solidcore]',
    type: 'Pilates studio',
    tags: ['Pilates', 'Strength'],
    distance: '1.0 mi',
    walkIn: false,
    bookable: true,
    minPlan: 'Platinum',
    rating: 4.91,
    reviews: 421,
    address: '1300 Hudson St, Hoboken, NJ',
    hours: '6:00 AM - 8:00 PM',
    open: false,
    closesAt: '8 PM',
    about:
      '50 minutes of slow, controlled, full-body shaking on the megaformer. Low impact, high burn.',
    included: ['Available from Platinum'],
    activities: ['Pilates', 'Core', 'Full body'],
    amenities: ['Changing room', 'Grip socks', 'Water refill', 'Air conditioning'],
    iconBg: '#141414',
    photos: [
      ['#1d1d1f', '#a880ff'],
      ['#1b1340', '#ff809f'],
      ['#a880ff', '#1d1d1f'],
    ],
  },
  {
    id: 'barrys',
    name: "Barry's - Jersey City",
    short: 'BARRYS',
    type: 'HIIT bootcamp',
    tags: ['HIIT', 'Bootcamp', 'Strength'],
    distance: '1.4 mi',
    walkIn: false,
    bookable: true,
    minPlan: 'Gold',
    rating: 4.89,
    reviews: 2041,
    address: '331 Marin Blvd, Jersey City, NJ',
    hours: '5:30 AM - 8:30 PM',
    open: true,
    closesAt: '8:30 PM',
    about:
      'The original Red Room. 50 minutes of treadmill sprints and floor work led by world-class instructors.',
    included: ['Premium classes (4 visits/month)'],
    activities: ['HIIT', 'Run', 'Lift', 'Sculpt'],
    amenities: ['Changing room', 'Showers', 'Towels', 'Air conditioning', 'Fuel bar'],
    iconBg: '#141414',
    photos: [
      ['#d8385e', '#1b1340'],
      ['#f2496b', '#ff809f'],
      ['#1b1340', '#d8385e'],
    ],
  },
  {
    id: 'title',
    name: 'TITLE Boxing Club - Jersey City',
    short: 'TITLE',
    type: 'Boxing studio',
    tags: ['Boxing', 'Kickboxing', 'Cardio'],
    distance: '1.8 mi',
    walkIn: true,
    bookable: true,
    minPlan: 'Silver',
    rating: 4.66,
    reviews: 389,
    address: '389 Washington Blvd, Jersey City, NJ',
    hours: '6:00 AM - 9:00 PM',
    open: true,
    closesAt: '9 PM',
    about:
      'Wrap up, glove up, and hit something (a heavy bag, specifically) for the best hour of your day.',
    included: ['Boxing classes', 'Kickboxing classes'],
    activities: ['Boxing', 'Kickboxing', 'Core'],
    amenities: ['Changing room', 'Glove rental', 'Showers', 'Wi-Fi'],
    iconBg: '#b3123f',
    photos: [
      ['#c02c50', '#1b1340'],
      ['#d8385e', '#dcff79'],
      ['#1b1340', '#ff809f'],
    ],
  },
  {
    id: 'anytime',
    name: 'Anytime Fitness - Union City',
    short: 'AF',
    type: 'Gym',
    tags: ['Gym access', '24/7'],
    distance: '2.3 mi',
    walkIn: true,
    bookable: false,
    minPlan: 'Basic',
    rating: 4.41,
    reviews: 947,
    address: '3196 Kennedy Blvd, Union City, NJ',
    hours: 'Open 24 hours',
    open: true,
    closesAt: '24/7',
    about:
      'Your gym, any time — 24/7 access to weights, cardio, and coaching in a club that never closes.',
    included: ['Gym access'],
    activities: ['Strength', 'Cardio', 'Functional'],
    amenities: ['24/7 access', 'Changing room', 'Showers', 'Parking'],
    iconBg: '#5b2d8e',
    photos: [
      ['#6b3fa0', '#dcff79'],
      ['#1b1340', '#a880ff'],
      ['#a880ff', '#f6eddf'],
    ],
  },
  {
    id: 'rumble',
    name: 'Rumble Boxing - NYC',
    short: 'RUMBLE',
    type: 'Boxing studio',
    tags: ['Boxing', 'HIIT'],
    distance: '3.1 mi',
    walkIn: false,
    bookable: true,
    minPlan: 'Titanium',
    rating: 4.79,
    reviews: 517,
    address: '700 Broadway, New York, NY',
    hours: '6:00 AM - 9:00 PM',
    open: true,
    closesAt: '9 PM',
    about:
      '10 rounds. Water-filled bags. Neon lights and hip-hop beats. Boxing-inspired group fitness at its loudest.',
    included: ['Premium classes (4 visits/month)'],
    activities: ['Boxing', 'HIIT', 'Strength'],
    amenities: ['Changing room', 'Showers', 'Wraps included', 'Towels'],
    iconBg: '#141414',
    photos: [
      ['#1b1340', '#ff809f'],
      ['#d8385e', '#1b1340'],
      ['#ff809f', '#5b4191'],
    ],
  },
  {
    id: 'lifetime',
    name: 'Life Time - Hudson Yards',
    short: 'LIFE TIME',
    type: 'Athletic club',
    tags: ['Gym access', 'Pool', 'Classes'],
    distance: '3.4 mi',
    walkIn: true,
    bookable: true,
    minPlan: 'Titanium',
    rating: 4.68,
    reviews: 1103,
    address: '605 W 42nd St, New York, NY',
    hours: '4:00 AM - 11:00 PM',
    open: true,
    closesAt: '11 PM',
    about:
      'A resort-grade athletic country club: pools, pickleball, recovery lounges, and hundreds of weekly classes.',
    included: ['Gym access', 'Pool', 'Group classes'],
    activities: ['Strength', 'Swimming', 'Pickleball', 'Yoga', 'Cycling'],
    amenities: ['Pool', 'Sauna', 'Changing room', 'Cafe', 'Parking', 'Childcare'],
    iconBg: '#ffffff',
    iconFg: '#1d1d1f',
    photos: [
      ['#857f76', '#dcff79'],
      ['#034036', '#f6eddf'],
      ['#5b4191', '#f6eddf'],
    ],
  },
];

export const getPartner = (id) => partners.find((p) => p.id === id);

// ---------- wellness / partner apps ----------

export const wellnessApps = [
  { id: 'strava', name: 'Strava', cats: ['Running', 'Cycling', 'Tracking'], iconBg: '#fc4c02', glyph: 'S', blurb: 'Track every run and ride, join clubs, and chase segments with the largest sports community in the world.' },
  { id: 'headspace', name: 'Headspace', cats: ['Meditation', 'Mindfulness'], iconBg: '#f47d31', glyph: 'H', blurb: 'Guided meditations, sleepcasts, and focus music to make mindfulness a daily habit.' },
  { id: 'calm', name: 'Calm', cats: ['Sleep', 'Meditation', 'Relaxation'], iconBg: '#4a90d9', glyph: 'C', blurb: 'Sleep stories, breathing exercises, and soundscapes for less stress and better sleep.' },
  { id: 'mfp', name: 'MyFitnessPal', cats: ['Nutrition', 'Calorie tracking'], iconBg: '#0066ee', glyph: 'M', blurb: 'Log meals with the biggest food database on earth and hit your macros without guesswork.' },
  { id: 'sleepcycle', name: 'Sleep Cycle', cats: ['Sleep', 'Tracking'], iconBg: '#1b1340', glyph: 'Z', blurb: 'Smart alarm clock that analyzes your sleep and wakes you in your lightest phase.' },
  { id: 'freeletics', name: 'Freeletics', cats: ['Training', 'Bodyweight', 'HIIT'], iconBg: '#161616', glyph: 'F', blurb: 'AI-powered bodyweight workouts that adapt to your level — no equipment needed.' },
  { id: 'fabulous', name: 'Fabulous', cats: ['Habits', 'Self-care'], iconBg: '#5b4191', glyph: 'F', blurb: 'Science-based coaching to build tiny daily rituals that stick.' },
  { id: 'lifesum', name: 'Lifesum', cats: ['Diet', 'Nutrition', 'Food diary'], iconBg: '#0e7a4a', glyph: 'L', blurb: 'Meal plans, macro tracking, and healthy recipes tailored to your goals.' },
  { id: 'meditopia', name: 'Meditopia', cats: ['Meditation', 'Sleep'], iconBg: '#2e7d6e', glyph: 'M', blurb: 'Deep-dive meditations on anxiety, acceptance, and everything in between, in 12 languages.' },
  { id: 'bettersleep', name: 'BetterSleep', cats: ['Sleep', 'Sounds'], iconBg: '#22224f', glyph: 'B', blurb: 'Mix your own sleep sounds, follow sleep programs, and track how you actually rest.' },
  { id: 'zumba', name: 'Zumba', cats: ['Dance', 'Cardio'], iconBg: '#e0004d', glyph: 'Z', blurb: 'Dance-party workouts you can join from your living room, no rhythm required.' },
  { id: 'ifeel', name: 'iFeel', cats: ['Mental health', 'Wellbeing'], iconBg: '#7a5cc4', glyph: 'i', blurb: 'Emotional-wellbeing support with licensed therapists and daily mood tools.' },
];

// ---------- classes (next 7 days) ----------
// dayOffset: 0 = today, 1 = tomorrow, ...

export const classes = [
  { id: 'c1', partnerId: 'corepower', name: 'Yoga Sculpt', duration: '60 Mins', activity: 'Yoga', instructor: 'Mark Brown', start: '7:30 AM', end: '8:30 AM', dayOffset: 0, spotsLeft: 17, online: false },
  { id: 'c2', partnerId: 'barrys', name: 'Run x Lift', duration: '50 Mins', activity: 'HIIT', instructor: 'Dana Cole', start: '12:00 PM', end: '12:50 PM', dayOffset: 0, spotsLeft: 1, online: false },
  { id: 'c3', partnerId: 'soulcycle', name: 'SoulBeat Ride', duration: '45 Mins', activity: 'Cycling', instructor: 'Alexis Tran', start: '5:30 PM', end: '6:15 PM', dayOffset: 0, spotsLeft: 6, online: false },
  { id: 'c4', partnerId: 'zoom-yoga', name: 'Evening Flow', duration: '45 Mins', activity: 'Yoga', instructor: 'Priya Nair', start: '7:00 PM', end: '7:45 PM', dayOffset: 0, spotsLeft: 42, online: true },
  { id: 'c5', partnerId: 'f45', name: 'Romans', duration: '45 Mins', activity: 'Functional', instructor: 'Jake Morales', start: '6:00 AM', end: '6:45 AM', dayOffset: 1, spotsLeft: 9, online: false },
  { id: 'c6', partnerId: 'title', name: 'Boxing Fundamentals', duration: '60 Mins', activity: 'Boxing', instructor: 'Renee Ortiz', start: '9:00 AM', end: '10:00 AM', dayOffset: 1, spotsLeft: 12, online: false },
  { id: 'c7', partnerId: 'corepower', name: 'C2 Power Flow', duration: '60 Mins', activity: 'Yoga', instructor: 'Sam Whitfield', start: '6:00 PM', end: '7:00 PM', dayOffset: 1, spotsLeft: 3, online: false },
  { id: 'c8', partnerId: 'rumble', name: '10 Rounds', duration: '45 Mins', activity: 'Boxing', instructor: 'Marcus Lee', start: '7:00 PM', end: '7:45 PM', dayOffset: 1, spotsLeft: 0, online: false },
  { id: 'c9', partnerId: 'ymca', name: 'Lap Swim (Reserved)', duration: '60 Mins', activity: 'Swimming', instructor: 'Open lanes', start: '7:00 AM', end: '8:00 AM', dayOffset: 2, spotsLeft: 8, online: false },
  { id: 'c10', partnerId: 'barrys', name: 'Sculpt', duration: '50 Mins', activity: 'Strength', instructor: 'Dana Cole', start: '8:00 AM', end: '8:50 AM', dayOffset: 2, spotsLeft: 5, online: false },
  { id: 'c11', partnerId: 'solidcore', name: 'Full Body Flow', duration: '50 Mins', activity: 'Pilates', instructor: 'Ivy Chen', start: '5:00 PM', end: '5:50 PM', dayOffset: 2, spotsLeft: 2, online: false },
  { id: 'c12', partnerId: 'zoom-meditate', name: 'Wind-Down Meditation', duration: '20 Mins', activity: 'Meditation', instructor: 'Ana Silva', start: '9:00 PM', end: '9:20 PM', dayOffset: 2, spotsLeft: 88, online: true },
  { id: 'c13', partnerId: 'f45', name: 'Panthers', duration: '45 Mins', activity: 'Cardio', instructor: 'Jake Morales', start: '12:15 PM', end: '1:00 PM', dayOffset: 3, spotsLeft: 14, online: false },
  { id: 'c14', partnerId: 'soulcycle', name: 'Rhythm Ride', duration: '45 Mins', activity: 'Cycling', instructor: 'Alexis Tran', start: '6:30 PM', end: '7:15 PM', dayOffset: 3, spotsLeft: 4, online: false },
  { id: 'c15', partnerId: 'stretchlab', name: 'Flexologist 1:1', duration: '50 Mins', activity: 'Stretching', instructor: 'Jordan Blake', start: '10:00 AM', end: '10:50 AM', dayOffset: 4, spotsLeft: 1, online: false },
  { id: 'c16', partnerId: 'title', name: 'Kickboxing Power Hour', duration: '60 Mins', activity: 'Kickboxing', instructor: 'Renee Ortiz', start: '6:00 PM', end: '7:00 PM', dayOffset: 4, spotsLeft: 10, online: false },
  { id: 'c17', partnerId: 'corepower', name: 'Hot Power Fusion', duration: '75 Mins', activity: 'Yoga', instructor: 'Mark Brown', start: '8:00 AM', end: '9:15 AM', dayOffset: 5, spotsLeft: 7, online: false },
  { id: 'c18', partnerId: 'lifetime', name: 'Ultra Fit', duration: '60 Mins', activity: 'HIIT', instructor: 'Coach Devon', start: '9:30 AM', end: '10:30 AM', dayOffset: 5, spotsLeft: 11, online: false },
  { id: 'c19', partnerId: 'rumble', name: '10 Rounds', duration: '45 Mins', activity: 'Boxing', instructor: 'Marcus Lee', start: '11:00 AM', end: '11:45 AM', dayOffset: 6, spotsLeft: 16, online: false },
  { id: 'c20', partnerId: 'barrys', name: 'Full Body', duration: '50 Mins', activity: 'HIIT', instructor: 'Sasha Kim', start: '4:00 PM', end: '4:50 PM', dayOffset: 6, spotsLeft: 2, online: false },
];

// online-only "venues" referenced by online classes
export const onlineStudios = {
  'zoom-yoga': { name: 'Yoga Life Online', iconBg: '#0e7a4a', short: 'YL' },
  'zoom-meditate': { name: 'Stillpoint Live', iconBg: '#4a90d9', short: 'SP' },
};

export const getClass = (id) => classes.find((c) => c.id === id);

export const classVenue = (cls) =>
  getPartner(cls.partnerId) || {
    ...onlineStudios[cls.partnerId],
    id: cls.partnerId,
    online: true,
  };

// ---------- pre-existing user state ----------

// one class is already booked so the Check in tab has a live card
export const initialBookings = ['c3'];

export const checkInHistory = [
  { id: 'h1', partner: 'Crunch - Hoboken', activity: 'Gym access', date: 'Jul 1', time: '6:12 PM', status: 'Confirmed', rated: false },
  { id: 'h2', partner: 'CorePower Yoga - Hoboken', activity: 'Yoga Sculpt', date: 'Jun 28', time: '7:24 AM', status: 'Confirmed', rated: true },
  { id: 'h3', partner: "Barry's - Jersey City", activity: 'Run x Lift', date: 'Jun 26', time: '12:01 PM', status: 'Confirmed', rated: true },
  { id: 'h4', partner: 'TITLE Boxing Club - Jersey City', activity: 'Boxing', date: 'Jun 22', time: '9:03 AM', status: 'Confirmed', rated: false },
  { id: 'h5', partner: 'Crunch - Hoboken', activity: 'Gym access', date: 'Jun 19', time: '5:47 PM', status: 'Expired', rated: false },
  { id: 'h6', partner: 'The Y - Hoboken', activity: 'Lap swimming', date: 'Jun 15', time: '7:15 AM', status: 'Confirmed', rated: true },
];

export const usage = {
  standard: { label: 'Standard access', detail: '1 check-in per day', used: 14, cap: null },
  premium: { label: 'Premium classes', detail: 'Resets on the 1st', used: 1, cap: 4 },
  sessions: { label: 'Private sessions', detail: 'Resets on the 1st', used: 0, cap: 2 },
};

export const challenges = [
  { id: 'ch1', title: 'Acme Summer Move-a-thon', by: 'Acme Corp', participants: 148, daysLeft: 12, points: 320, rank: 9, joined: true, color: '#a880ff' },
  { id: 'ch2', title: '10K Steps a Day', by: 'Wellhub', participants: 23412, daysLeft: 4, points: 180, rank: 1204, joined: true, color: '#dcff79' },
  { id: 'ch3', title: 'July Yoga Streak', by: 'Maya R.', participants: 12, daysLeft: 27, points: 0, rank: null, joined: false, color: '#ff809f' },
];

export const badges = [
  { id: 'b1', label: '10 gym visits', emoji: '🏋️', earned: true },
  { id: 'b2', label: '5 classes', emoji: '🧘', earned: true },
  { id: 'b3', label: 'First check-in', emoji: '✨', earned: true },
  { id: 'b4', label: '4-week streak', emoji: '🔥', earned: true },
  { id: 'b5', label: '25 gym visits', emoji: '🏆', earned: false },
  { id: 'b6', label: 'First live class', emoji: '📺', earned: false },
];

// ---------- date helpers for the schedule strip ----------

const DAY_NAMES = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
const MONTH_NAMES = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

export const dayInfo = (offset) => {
  const d = new Date();
  d.setDate(d.getDate() + offset);
  return {
    offset,
    dayNum: d.getDate(),
    dayName: DAY_NAMES[d.getDay()],
    month: MONTH_NAMES[d.getMonth()],
    label: offset === 0 ? 'TODAY' : offset === 1 ? 'TOMORROW' : `${DAY_NAMES[d.getDay()]} ${d.getDate()}`,
  };
};

export const next7Days = Array.from({ length: 7 }, (_, i) => dayInfo(i));
