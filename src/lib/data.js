
// Toutes les pages lisent ce fichier.
// Données : Supabase (si configuré), sinon valeurs locales ci-dessous.

const env = (k) =>
  (import.meta.env && import.meta.env[k]) ||
  (typeof process !== 'undefined' && process.env && process.env[k]) ||
  '';

const SB = env('PUBLIC_SUPABASE_URL');
const KEY = env('PUBLIC_SUPABASE_ANON_KEY');

const get = async (table, q = 'select=*') => {
  if (!SB) return [];

  try {
    const r = await fetch(`${SB}/rest/v1/${table}?${q}`, {
      headers: {
        apikey: KEY,
        Authorization: `Bearer ${KEY}`
      }
    });

    if (!r.ok) throw new Error(`${table} ${r.status}`);

    return await r.json();
  } catch (e) {
    console.warn('Supabase :', e.message);
    return [];
  }
};

// Contenus d'exemple
// Mettre PUBLIC_DEMO=false dans Vercel pour les retirer.
const DEMO = (env('PUBLIC_DEMO') || 'true') !== 'false';

const pick = (remote, local) =>
  remote && remote.length ? remote : local;

// ---- CLUB ----

export const club = {
  name: 'FC Vacresse',
  full: 'Royal Football Club Vacresse',
  season: '2026-2027',
  address: 'Rue Valère Letot 16 A, 7050 Herchies',
  email: 'direction@vacresse.be',
  rbfa: 'https://www.rbfa.be/fr/club/2396/equipes',
  shop: '#'
};

// ---- CONTACTS ----

export const contacts = [
  {
    title: 'Coordination',
    email: 'coordination@vacresse.be',
    text: "Inscriptions, école des jeunes et questions pratiques sur les équipes."
  },
  {
    title: 'Disciplinaire',
    email: 'disciplinaire@vacresse.be',
    text: 'Suspensions, cartons et dossiers disciplinaires.'
  },
  {
    title: 'Direction',
    email: 'direction@vacresse.be',
    text: 'Direction du club, partenariats et sponsoring.'
  }
];

// ---- NAVIGATION ----

export const nav = [
  ['/', 'Accueil'],
  ['/club', 'Le club'],
  ['/matchs', 'Matchs'],
  ['/equipes', 'Équipes'],
  ['/evenements', 'Événements'],
  ['/contact', 'Contact']
];

// ---- FORMATTAGE ----

const TZ = 'Europe/Brussels';

export const fmt = (d) =>
  new Date(d).toLocaleDateString('fr-BE', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    hour: '2-digit',
    minute: '2-digit',
    timeZone: TZ
  });

export const day = (d) =>
  new Date(d + 'T12:00:00').getDate();

export const month = (d) =>
  new Date(d + 'T12:00:00').toLocaleDateString('fr-BE', {
    month: 'long'
  });

// ---- ÉQUIPES LOCALES ----

const names = [
  ['Équipe première A', 'premiere-a'],
  ['Équipe première B', 'premiere-b'],
  ['Réserve', 'reserve'],
  ['U17 A', 'u17-a'],
  ['U17 B', 'u17-b'],
  ['U15', 'u15'],
  ['U14', 'u14'],
  ['U12', 'u12'],
  ['U11', 'u11'],
  ['U10', 'u10'],
  ['U9', 'u9'],
  ['U8 A', 'u8-a'],
  ['U8 B', 'u8-b'],
  ['U7', 'u7'],
  ['U6', 'u6']
];

const g = (day, time, place = 'Terrain principal') => ({
  day,
  time,
  place
});

const demoTrain = (slug) => {
  if (!DEMO) return [];

  if (['premiere-a', 'premiere-b', 'reserve'].includes(slug)) {
    return [
      g('Mardi', '19:30 – 21:00'),
      g('Jeudi', '19:30 – 21:00')
    ];
  }

  if (['u17-a', 'u17-b', 'u15', 'u14'].includes(slug)) {
    return [
      g('Mercredi', '18:00 – 19:30'),
      g('Vendredi', '18:00 – 19:30')
    ];
  }

  if (['u12', 'u11', 'u10'].includes(slug)) {
    return [
      g('Mercredi', '17:30 – 18:45', 'Terrain annexe'),
      g('Vendredi', '17:30 – 18:45', 'Terrain annexe')
    ];
  }

  return [
    g('Mercredi', '16:30 – 17:30', 'Terrain annexe'),
    g('Samedi', '09:30 – 10:30', 'Terrain annexe')
  ];
};

// ---- JOUEURS DE DÉMONSTRATION ----

const demoPlayers = !DEMO
  ? {}
  : {
      'premiere-a': Array.from({ length: 26 }, (_, i) => ({
        first: 'Joueur',
        last: String(i + 1).padStart(2, '0'),
        number: null,
        position: '',
        photo: `/effectif/premiere-a/${String(i + 1).padStart(2, '0')}.jpg`
      }))
    };

const localTeams = names.map(([name, slug]) => ({
  name,
  slug,
  staff: '',
  rbfa: '',
  trainings: demoTrain(slug),
  players: demoPlayers[slug] || []
}));

// ---- PERSONNES DU CLUB ----

const localPeople = [
  { grp: 'president', name: 'Michel Dumont', role: 'Président', phone: '0470 00 00 01', photo: '' },
  { grp: 'coordinateur', name: 'Julien Mercier', role: 'Coordinateur des jeunes', phone: '0470 00 00 02', photo: '' },
  { grp: 'comite', name: 'Nathalie Lefèvre', role: 'Secrétaire', phone: '', photo: '' },
  { grp: 'comite', name: 'Philippe Renard', role: 'Trésorier', phone: '', photo: '' },
  { grp: 'comite', name: 'Catherine Moreau', role: 'Responsable buvette', phone: '', photo: '' },
  { grp: 'comite', name: 'Alain Dupuis', role: 'Responsable du matériel', phone: '', photo: '' },
  { grp: 'comite', name: 'Sébastien Collin', role: 'Délégué sécurité', phone: '', photo: '' },
  { grp: 'comite', name: 'Isabelle Hénaut', role: 'Relations partenaires', phone: '', photo: '' },
  { grp: 'coach', name: 'Kevin Delvaux', role: 'Équipe première A', phone: '', photo: '' },
  { grp: 'coach', name: 'Maxime Petit', role: 'Équipe première B', phone: '', photo: '' },
  { grp: 'coach', name: 'Romain Gillet', role: 'Réserve', phone: '', photo: '' },
  { grp: 'coach', name: 'Antoine Dubois', role: 'U17', phone: '', photo: '' },
  { grp: 'coach', name: 'Laurent Marchal', role: 'U15', phone: '', photo: '' },
  { grp: 'coach', name: 'Pierre Fontaine', role: 'U12', phone: '', photo: '' },
  { grp: 'coach', name: 'David Leroy', role: 'U10', phone: '', photo: '' },
  { grp: 'coach', name: 'Sandrine Vasseur', role: 'U8', phone: '', photo: '' }
];

// ---- ÉVÉNEMENTS LOCAUX ----

const localEvents = [
  {
    title: 'Souper de rentrée',
    date: '2026-09-12',
    time: '19:00',
    place: 'Buvette du club',
    description: 'Un grand merci à tous les participants.',
    image: '/stade.jpg',
    link: ''
  },
  {
    title: 'Souper annuel du club',
    date: '2026-11-21',
    time: '18:30',
    place: 'Salle communale (à confirmer)',
    description: 'Repas, tombola et soirée dansante. Réservation auprès des membres du comité.',
    image: '',
    link: '/contact'
  },
  {
    title: 'Tombola de la Saint-Nicolas',
    date: '2026-12-05',
    time: '14:00',
    place: 'Buvette du club',
    description: 'Tirage de nombreux lots offerts par nos partenaires, et un goûter pour les enfants.',
    image: '/balle.jpg',
    link: ''
  },
  {
    title: "Journée portes ouvertes de l'école des jeunes",
    date: '2027-01-16',
    time: '10:00',
    place: 'Terrains du club',
    description: 'Les enfants de 5 à 12 ans sont invités à essayer le football avec nos entraîneurs.',
    image: '/enfant.jpg',
    link: '/contact'
  },
  {
    title: 'Réception des partenaires',
    date: '2027-02-13',
    time: '18:00',
    place: 'Château de Jurbise',
    description: 'Soirée de remerciement pour les sponsors et les partenaires du club.',
    image: '/chateau.jpg',
    link: ''
  },
  {
    title: 'Tournoi des jeunes',
    date: '2027-05-29',
    time: '09:00',
    place: 'Terrains du club',
    description: 'Une journée de matchs pour toutes les catégories de jeunes, avec buvette et barbecue.',
    image: '/herbe.jpg',
    link: ''
  }
];

// ---- DIAPORAMA ----

const localSlides = [
  {
    img: '/equipe.jpg',
    title: 'Royal Football Club Vacresse',
    text: 'Un club familial et local.',
    link: '/equipes',
    cta: 'Nos équipes'
  },
  {
    img: '/herbe.jpg',
    title: 'Prochains matchs',
    text: 'Toutes les équipes, tous les week-ends.',
    link: '/matchs',
    cta: 'Voir les matchs'
  },
  {
    img: '/enfant.jpg',
    title: 'École des jeunes',
    text: 'Viens jouer avec nous.',
    link: '/contact',
    cta: 'Nous contacter'
  },
  {
    img: '/balle.jpg',
    title: 'La boutique du club',
    text: 'Équipez-vous aux couleurs du FC Vacresse.',
    link: club.shop,
    cta: 'Découvrir'
  }
];

// ---- PHOTOS ----

const localPhotos = [
  {
    img: '/terrains.jpg',
    title: 'Les terrains',
    category: 'Installations'
  },
  {
    img: '/stade.jpg',
    title: 'Le terrain en nocturne',
    category: 'Installations'
  }
];

// ---- DATES DES MATCHS ----

const brx = (ymd, hm) => {
  const [y, m, d] = ymd.split('-').map(Number);
  const t = new Date(Date.UTC(y, m - 1, d, 12));

  const off = Math.round(
    (
      new Date(t.toLocaleString('en-US', { timeZone: TZ })) -
      new Date(t.toLocaleString('en-US', { timeZone: 'UTC' }))
    ) / 36e5
  );

  return `${ymd}T${hm}:00${off < 0 ? '-' : '+'}${String(Math.abs(off)).padStart(2, '0')}:00`;
};

const nextDay = (dow, back = 0) => {
  const t = new Date();

  t.setUTCDate(
    t.getUTCDate() +
    ((dow - t.getUTCDay() + 7) % 7 || 7) -
    back
  );

  return t.toISOString().slice(0, 10);
};

const slots = {
  'premiere-a': [0, '15:00', 1],
  'premiere-b': [0, '12:30', 0],
  reserve: [6, '18:00', 1],
  'u17-a': [6, '15:00', 1],
  'u17-b': [6, '13:30', 0],
  u15: [6, '11:00', 1],
  u14: [6, '10:00', 0],
  u12: [6, '10:30', 1],
  u11: [6, '09:30', 0],
  u10: [6, '11:00', 1],
  u9: [6, '09:00', 1],
  'u8-a': [6, '10:00', 0],
  'u8-b': [6, '09:30', 1],
  u7: [6, '09:00', 0],
  u6: [6, '09:00', 1]
};

const opps = [
  'RFC Exemple',
  'US Démo',
  'FC Modèle',
  'Olympic Test',
  'Étoile Fictive'
];

const mk = (slug, date, o, home, status = 'À venir', score = null) => ({
  type: 'match',
  team: slug,
  date,
  opp: o,
  home,
  status,
  place: home ? club.address : '[Adresse du club adverse]',
  oppLogo: '',
  title: home ? `FC Vacresse — ${o}` : `${o} — FC Vacresse`,
  score
});

const demoMatches = () =>
  !DEMO
    ? []
    : [
        ...localTeams.map((t, i) => {
          const [dow, hm, home] = slots[t.slug];

          return mk(
            t.slug,
            brx(nextDay(dow), hm),
            opps[i % opps.length],
            !!home
          );
        }),
        mk('premiere-a', brx(nextDay(0, 7), '15:00'), 'Étoile Fictive', true, 'Terminé', '3 – 1'),
        mk('u17-a', brx(nextDay(6, 7), '15:00'), 'FC Modèle', false, 'Terminé', '1 – 2')
      ];

// ---- SPONSORS ----

const localSponsors = [
  'Sponsor 1',
  'Sponsor 2',
  'Sponsor 3',
  'Sponsor 4',
  'Sponsor 5',
  'Sponsor 6'
].map((name) => ({
  name,
  url: '',
  img: ''
}));

// ---- FAQ ----

export const faq = [
  {
    q: 'Comment inscrire mon enfant ?',
    a: '[À compléter]'
  },
  {
    q: 'Quel est le montant de la cotisation ?',
    a: '[À compléter]'
  },
  {
    q: 'Les photos de mon enfant seront-elles publiées ?',
    a: "Seulement avec l'accord des parents, demandé en début de saison."
  }
];

// ---- NETTOYAGE SI DEMO DÉSACTIVÉ ----

if (!DEMO) {
  localPeople.length = 0;
  localEvents.length = 0;
  localPhotos.length = 0;
}

// ---- LECTURE SUPABASE ----

const [
  rTeams,
  rTrain,
  rPlayers,
  rMatches,
  rEvents,
  rPeople,
  rPhotos,
  rSponsors,
  rSlides
] = await Promise.all([
  get('teams', 'select=*&order=sort_order.asc'),
  get('trainings', 'select=*'),
  get('players', 'select=*&order=number.asc.nullslast'),
  get('matches', 'select=*&order=starts_at.asc'),
  get('events', 'select=*&published=eq.true&order=date.asc'),
  get('people', 'select=*&order=sort_order.asc'),
  get('club_photos', 'select=*&order=sort_order.asc'),
  get('sponsors', 'select=*&order=sort_order.asc'),
  get('slides', 'select=*&order=sort_order.asc')
]);

const dayOrder = [
  'Lundi',
  'Mardi',
  'Mercredi',
  'Jeudi',
  'Vendredi',
  'Samedi',
  'Dimanche'
];

// ---- ÉQUIPES ----

export const teams = pick(
  rTeams.map((t) => ({
    name: t.name,
    slug: t.slug,
    staff: t.staff || '',
    rbfa: t.rbfa_url || '',
    trainings: rTrain.some((x) => x.team_id === t.id)
      ? rTrain
          .filter((x) => x.team_id === t.id)
          .sort((a, b) => dayOrder.indexOf(a.day) - dayOrder.indexOf(b.day))
          .map((x) => ({
            day: x.day,
            time: x.time || '',
            place: x.place || ''
          }))
      : demoTrain(t.slug),
    players: rPlayers.some((p) => p.team_id === t.id)
      ? rPlayers
          .filter((p) => p.team_id === t.id)
          .map((p) => ({
            first: p.first_name,
            last: p.last_name,
            number: p.number,
            position: p.position || '',
            photo: p.photo_url || ''
          }))
      : (demoPlayers[t.slug] || [])
  })),
  localTeams
);

// ---- NOM DES ÉQUIPES ----

export const teamName = (slug) =>
  teams.find((t) => t.slug === slug)?.name ?? slug;

// ---- MATCHS ----

const byId = Object.fromEntries(
  rTeams.map((t) => [t.id, t.slug])
);

export const events = !rMatches.length
  ? demoMatches()
  : rMatches
      .filter((m) => byId[m.team_id])
      .map((m) => {
        const done =
          m.status === 'Terminé' &&
          m.score_us != null &&
          m.score_them != null;

        return {
          type: 'match',
          team: byId[m.team_id],
          date: m.starts_at,
          opp: m.opponent,
          home: m.home,
          status: m.status || 'À venir',
          place: m.place || '',
          oppLogo: m.opponent_logo_url || '',
          title: m.home
            ? `FC Vacresse — ${m.opponent}`
            : `${m.opponent} — FC Vacresse`,
          score: done
            ? (
                m.home
                  ? `${m.score_us} – ${m.score_them}`
                  : `${m.score_them} – ${m.score_us}`
              )
            : null
        };
      });

// ---- ÉVÉNEMENTS DU CLUB ----

export const clubEvents = pick(
  rEvents.map((e) => ({
    title: e.title,
    date: e.date,
    time: e.time || '',
    place: e.place || '',
    description: e.description || '',
    image: e.image_url || '',
    link: e.link_url || ''
  })),
  localEvents
);

// ---- PERSONNES ----

export const people = pick(
  rPeople.map((p) => ({
    grp: p.grp,
    name: p.name,
    role: p.role || '',
    phone: p.phone || '',
    photo: p.photo_url || ''
  })),
  localPeople
);

// ---- GALERIE ----

export const clubPhotos = pick(
  rPhotos.map((p) => ({
    title: p.title || '',
    category: p.category || '',
    img: p.image_url
  })),
  localPhotos
);

// Albums disponibles pour la page galerie.
// À compléter lorsque les albums seront configurés.
export const albums = [];

// ---- DIAPORAMA ----

export const slides = pick(
  rSlides.map((s) => ({
    img: s.image_url,
    title: s.title,
    text: s.text || '',
    link: s.link || '/',
    cta: s.cta || 'Découvrir'
  })),
  localSlides
);

// ---- SPONSORS ----

export const sponsors = pick(
  rSponsors.map((s) => ({
    name: s.name,
    url: s.url || '',
    img: s.logo_url || ''
  })),
  localSponsors
);
