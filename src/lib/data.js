// Toutes les pages lisent ce fichier. Données : Supabase (si configuré), sinon valeurs locales ci-dessous.
const env = (k) => (import.meta.env && import.meta.env[k]) || (typeof process !== 'undefined' && process.env && process.env[k]) || '';
const SB = env('PUBLIC_SUPABASE_URL'), KEY = env('PUBLIC_SUPABASE_ANON_KEY');
const get = async (table, q = 'select=*') => {
  if (!SB) return [];
  try { const r = await fetch(`${SB}/rest/v1/${table}?${q}`, { headers: { apikey: KEY, Authorization: `Bearer ${KEY}` } }); if (!r.ok) throw new Error(`${table} ${r.status}`); return await r.json(); }
  catch (e) { console.warn('Supabase :', e.message); return []; }
};
const pick = (remote, local) => (remote && remote.length ? remote : local);

export const club = {
  name: 'FC Vacresse', full: 'Royal Football Club Vacresse', season: '2026-2027',
  address: 'Rue Valère Letot 16 A, 7050 Herchies', email: 'direction@vacresse.be',
  rbfa: 'https://www.rbfa.be/fr/club/2396/equipes', shop: '#' // lien de la boutique Jako à renseigner
};
export const contacts = [
  { title: 'Coordination', email: 'coordination@vacresse.be', text: '[À compléter : pour quelles demandes]' },
  { title: 'Disciplinaire', email: 'disciplinaire@vacresse.be', text: '[À compléter : pour quelles demandes]' },
  { title: 'Direction', email: 'direction@vacresse.be', text: '[À compléter : pour quelles demandes]' }
];
export const nav = [['/', 'Accueil'], ['/club', 'Le club'], ['/matchs', 'Matchs'], ['/equipes', 'Équipes'], ['/evenements', 'Événements'], ['/contact', 'Contact']];
export const teamName = (slug) => teams.find((t) => t.slug === slug)?.name ?? slug;
const TZ = 'Europe/Brussels';
export const fmt = (d) => new Date(d).toLocaleDateString('fr-BE', { weekday: 'long', day: 'numeric', month: 'long', hour: '2-digit', minute: '2-digit', timeZone: TZ });
export const day = (d) => new Date(d + 'T12:00:00').getDate();
export const month = (d) => new Date(d + 'T12:00:00').toLocaleDateString('fr-BE', { month: 'long' });

// ---- Valeurs locales de secours ----
const names = [['Équipe première A', 'premiere-a'], ['Équipe première B', 'premiere-b'], ['Réserve', 'reserve'], ['U17 A', 'u17-a'], ['U17 B', 'u17-b'], ['U15', 'u15'], ['U14', 'u14'], ['U12', 'u12'], ['U11', 'u11'], ['U10', 'u10'], ['U9', 'u9'], ['U8 A', 'u8-a'], ['U8 B', 'u8-b'], ['U7', 'u7'], ['U6', 'u6']];
const localTeams = names.map(([name, slug]) => ({ name, slug, staff: '', rbfa: '', trainings: [], players: [] }));
const localPeople = [
  { grp: 'president', name: '[Nom du président]', role: 'Président', phone: '[Téléphone]', photo: '' },
  { grp: 'coordinateur', name: '[Nom du coordinateur]', role: 'Coordinateur des jeunes', phone: '[Téléphone]', photo: '' },
  { grp: 'comite', name: '[Nom]', role: '[Fonction]', phone: '', photo: '' },
  { grp: 'coach', name: '[Nom]', role: '[Équipe]', phone: '', photo: '' }
];
const localEvents = [{ title: 'Souper annuel du club', date: '2026-11-21', time: '18:30', place: '[Lieu]', description: '[Description à compléter]', image: '', link: '' }];
const localSlides = [
  { img: '/equipe.jpg', title: 'Royal Football Club Vacresse', text: 'Un club familial et local.', link: '/equipes', cta: 'Nos équipes' },
  { img: '/terrain.jpg', title: 'Prochains matchs', text: 'Toutes les équipes, tous les week-ends.', link: '/matchs', cta: 'Voir les matchs' },
  { img: '/enfant.jpg', title: 'École des jeunes', text: 'Viens jouer avec nous.', link: '/contact', cta: 'Nous contacter' }
];
const localSponsors = ['Sponsor 1', 'Sponsor 2', 'Sponsor 3', 'Sponsor 4', 'Sponsor 5', 'Sponsor 6'].map((name) => ({ name, url: '', img: '' }));
export const faq = [
  { q: 'Comment inscrire mon enfant ?', a: '[À compléter]' },
  { q: 'Quel est le montant de la cotisation ?', a: '[À compléter]' },
  { q: 'Les photos de mon enfant seront-elles publiées ?', a: "Seulement avec l'accord des parents, demandé en début de saison." }
];

// ---- Lecture Supabase ----
const [rTeams, rTrain, rPlayers, rMatches, rEvents, rPeople, rPhotos, rSponsors, rSlides] = await Promise.all([
  get('teams', 'select=*&order=sort_order.asc'), get('trainings', 'select=*'), get('players', 'select=*&order=number.asc.nullslast'),
  get('matches', 'select=*&order=starts_at.asc'), get('events', 'select=*&published=eq.true&order=date.asc'),
  get('people', 'select=*&order=sort_order.asc'), get('club_photos', 'select=*&order=sort_order.asc'),
  get('sponsors', 'select=*&order=sort_order.asc'), get('slides', 'select=*&order=sort_order.asc')
]);
const dayOrder = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche'];
export const teams = pick(rTeams.map((t) => ({
  name: t.name, slug: t.slug, staff: t.staff || '', rbfa: t.rbfa_url || '',
  trainings: rTrain.filter((x) => x.team_id === t.id).sort((a, b) => dayOrder.indexOf(a.day) - dayOrder.indexOf(b.day)).map((x) => ({ day: x.day, time: x.time || '', place: x.place || '' })),
  players: rPlayers.filter((p) => p.team_id === t.id).map((p) => ({ first: p.first_name, last: p.last_name, number: p.number, position: p.position || '', photo: p.photo_url || '' }))
})), localTeams);
const byId = Object.fromEntries(rTeams.map((t) => [t.id, t.slug]));
export const events = rMatches.filter((m) => byId[m.team_id]).map((m) => {
  const done = m.status === 'Terminé' && m.score_us != null && m.score_them != null;
  return { type: 'match', team: byId[m.team_id], date: m.starts_at, opp: m.opponent, home: m.home, status: m.status || 'À venir', place: m.place || '', oppLogo: m.opponent_logo_url || '',
    title: m.home ? `FC Vacresse — ${m.opponent}` : `${m.opponent} — FC Vacresse`, score: done ? (m.home ? `${m.score_us} – ${m.score_them}` : `${m.score_them} – ${m.score_us}`) : null };
});
export const clubEvents = pick(rEvents.map((e) => ({ title: e.title, date: e.date, time: e.time || '', place: e.place || '', description: e.description || '', image: e.image_url || '', link: e.link_url || '' })), localEvents);
export const people = pick(rPeople.map((p) => ({ grp: p.grp, name: p.name, role: p.role || '', phone: p.phone || '', photo: p.photo_url || '' })), localPeople);
export const clubPhotos = rPhotos.map((p) => ({ title: p.title || '', category: p.category || '', img: p.image_url }));
export const slides = pick(rSlides.map((s) => ({ img: s.image_url, title: s.title, text: s.text || '', link: s.link || '/', cta: s.cta || 'Découvrir' })), localSlides);
export const sponsors = pick(rSponsors.map((s) => ({ name: s.name, url: s.url || '', img: s.logo_url || '' })), localSponsors);
