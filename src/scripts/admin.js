import { createClient } from '@supabase/supabase-js';
const SB_URL = import.meta.env.PUBLIC_SUPABASE_URL, SB_KEY = import.meta.env.PUBLIC_SUPABASE_ANON_KEY;
if (!SB_URL || !SB_KEY) {
  const c = document.getElementById('cfg'); c.hidden = false;
  c.innerHTML = '<b>Configuration manquante.</b> Ajoutez <code>PUBLIC_SUPABASE_URL</code> et <code>PUBLIC_SUPABASE_ANON_KEY</code> dans Vercel (Settings &gt; Environment Variables), puis <b>redéployez</b> : ces valeurs sont intégrées au site au moment de la construction.';
  document.getElementById('login').hidden = true;
  throw new Error('Supabase non configuré');
}
const sb = createClient(SB_URL, SB_KEY);
const HOOK = import.meta.env.PUBLIC_DEPLOY_HOOK || '';
const DAYS = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche'];
// type : t=texte, ta=zone de texte, d=date, dt=date+heure, n=nombre, b=oui/non, s=liste, r=équipe, i=image
const T = {
  events: { label: 'Événements', order: ['date', false], cols: ['date', 'title', 'place'], f: [['title', 'Titre', 't', 1], ['date', 'Date', 'd', 1], ['time', 'Heure (ex. 19:00)', 't'], ['place', 'Lieu', 't'], ['description', 'Description', 'ta'], ['image_url', 'Photo', 'i'], ['link_url', "Lien « Plus d'infos »", 't'], ['published', 'Publié', 'b', 0, true]] },
  matches: { label: 'Matchs', team: 1, order: ['starts_at', false], cols: ['starts_at', 'team_id', 'opponent', 'status'], f: [['team_id', 'Équipe', 'r', 1], ['opponent', 'Adversaire', 't', 1], ['starts_at', 'Date et heure', 'dt', 1], ['home', 'À domicile', 'b', 0, true], ['place', 'Adresse / lieu', 't'], ['status', 'Statut', 's', 0, 'À venir', ['À venir', 'Terminé', 'Reporté', 'Annulé']], ['score_us', 'Score FC Vacresse', 'n'], ['score_them', 'Score adversaire', 'n'], ['opponent_logo_url', "Logo de l'adversaire", 'i']] },
  players: { label: 'Joueurs', team: 1, order: ['last_name', true], cols: ['team_id', 'number', 'last_name', 'first_name'], f: [['team_id', 'Équipe', 'r', 1], ['first_name', 'Prénom', 't', 1], ['last_name', 'Nom', 't', 1], ['number', 'Numéro', 'n'], ['position', 'Poste ou fonction', 's', 0, '', ['', 'Gardien', 'Défenseur', 'Milieu', 'Attaquant', 'Entraîneur', 'Adjoint', 'Délégué', 'Staff']], ['photo_url', 'Photo (uniquement avec accord des parents)', 'i']] },
  trainings: { label: 'Entraînements', team: 1, order: ['day', true], cols: ['team_id', 'day', 'time', 'place'], f: [['team_id', 'Équipe', 'r', 1], ['day', 'Jour', 's', 1, 'Lundi', DAYS], ['time', 'Heure (ex. 18:30 – 20:00)', 't', 1], ['place', 'Lieu', 't']] },
  teams: { label: 'Équipes', order: ['sort_order', true], cols: ['sort_order', 'name', 'staff'], f: [['name', 'Nom', 't', 1], ['slug', 'Adresse (ex. u17-a)', 't', 1], ['sort_order', 'Ordre', 'n'], ['staff', 'Coach / délégué', 't'], ['rbfa_url', 'Lien du classement RBFA', 't']] },
  people: { label: 'Personnes du club', order: ['sort_order', true], cols: ['grp', 'name', 'role'], f: [['grp', 'Groupe', 's', 1, 'comite', ['president', 'coordinateur', 'comite', 'coach']], ['name', 'Nom', 't', 1], ['role', 'Fonction / équipe', 't'], ['phone', 'Téléphone (facultatif)', 't'], ['photo_url', 'Photo', 'i'], ['sort_order', 'Ordre', 'n']] },
  club_photos: { label: 'Photos du club', order: ['sort_order', true], cols: ['category', 'title'], f: [['image_url', 'Photo', 'i', 1], ['title', 'Légende', 't'], ['category', 'Catégorie', 's', 0, 'Installations', ['Buvette', 'Installations', 'Autre']], ['sort_order', 'Ordre', 'n']] },
  sponsors: { label: 'Sponsors', order: ['sort_order', true], cols: ['name'], f: [['name', 'Nom', 't', 1], ['logo_url', 'Logo', 'i'], ['url', 'Site web', 't'], ['sort_order', 'Ordre', 'n']] },
  slides: { label: "Diaporama d'accueil", order: ['sort_order', true], cols: ['title'], f: [['image_url', 'Photo (1920 px de large minimum)', 'i', 1], ['title', 'Titre', 't', 1], ['text', 'Phrase', 't'], ['link', 'Lien (ex. /matchs)', 't'], ['cta', 'Texte du bouton', 't'], ['sort_order', 'Ordre', 'n']] }
};
const $ = (s) => document.querySelector(s);
const esc = (v) => String(v ?? '').replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
let teams = [], cur = 'events', filt = '';
const tn = (id) => teams.find((t) => t.id === id)?.name || '';
const show = (id) => { $('#login').hidden = id !== 'login'; $('#app').hidden = id !== 'app'; };
const msg = (t, err) => { const m = $('#msg'); m.textContent = t; m.className = err ? 'err' : 'ok'; m.hidden = !t; if (t) setTimeout(() => (m.hidden = true), 4000); };

async function resize(file) {
  const img = await createImageBitmap(file), k = Math.min(1, 1800 / Math.max(img.width, img.height));
  const c = document.createElement('canvas'); c.width = Math.round(img.width * k); c.height = Math.round(img.height * k);
  c.getContext('2d').drawImage(img, 0, 0, c.width, c.height);
  return new Promise((r) => c.toBlob(r, 'image/jpeg', 0.82));
}
async function upload(file) {
  const blob = await resize(file), path = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.jpg`;
  const { error } = await sb.storage.from('photos').upload(path, blob, { contentType: 'image/jpeg' });
  if (error) throw error; return sb.storage.from('photos').getPublicUrl(path).data.publicUrl;
}
const cell = (k, v) => k === 'team_id' ? esc(tn(v)) : k === 'starts_at' && v ? esc(new Date(v).toLocaleString('fr-BE', { dateStyle: 'short', timeStyle: 'short' })) : esc(v);
async function list() {
  const c = T[cur]; let q = sb.from(cur).select('*').order(c.order[0], { ascending: c.order[1] });
  if (c.team && filt) q = q.eq('team_id', filt);
  const { data, error } = await q; if (error) return msg(error.message, 1);
  $('#filter').hidden = !c.team;
  $('#rows').innerHTML = (data || []).map((r) => `<tr>${c.cols.map((k) => `<td>${cell(k, r[k])}</td>`).join('')}<td class="act"><button data-e="${r.id}">Modifier</button><button class="del" data-d="${r.id}">Supprimer</button></td></tr>`).join('') || '<tr><td colspan="9">Rien pour le moment.</td></tr>';
  $('#rows').querySelectorAll('[data-e]').forEach((b) => (b.onclick = () => form(data.find((r) => r.id === b.dataset.e))));
  $('#rows').querySelectorAll('[data-d]').forEach((b) => (b.onclick = async () => { if (!confirm('Supprimer définitivement ?')) return; const { error } = await sb.from(cur).delete().eq('id', b.dataset.d); error ? msg(error.message, 1) : (msg('Supprimé.'), list()); }));
  $('#head').innerHTML = c.cols.map((k) => `<th>${esc(c.f.find((f) => f[0] === k)?.[1] || k)}</th>`).join('') + '<th></th>';
}
function field([k, label, t, req, def, opts], row) {
  let v = row ? row[k] : def; const id = 'f_' + k, r = req ? ' required' : '';
  if (t === 'dt' && v) { const d = new Date(v), p = (n) => String(n).padStart(2, '0'); v = `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}T${p(d.getHours())}:${p(d.getMinutes())}`; }
  const h = { t: `<input id="${id}" value="${esc(v)}"${r}>`, ta: `<textarea id="${id}" rows="4">${esc(v)}</textarea>`, d: `<input id="${id}" type="date" value="${esc(v)}"${r}>`, dt: `<input id="${id}" type="datetime-local" value="${esc(v)}"${r}>`, n: `<input id="${id}" type="number" value="${esc(v)}">`,
    b: `<input id="${id}" type="checkbox" ${v ? 'checked' : ''}>`, s: `<select id="${id}">${(opts || []).map((o) => `<option ${o === v ? 'selected' : ''}>${esc(o)}</option>`).join('')}</select>`,
    r: `<select id="${id}"${r}><option value="">Choisir…</option>${teams.map((t) => `<option value="${t.id}" ${t.id === v ? 'selected' : ''}>${esc(t.name)}</option>`).join('')}</select>`,
    i: `${v ? `<img src="${esc(v)}" class="thumb">` : ''}<input id="${id}" type="file" accept="image/*"><input type="hidden" id="${id}_u" value="${esc(v)}">` }[t];
  return `<label>${esc(label)}${req ? ' *' : ''}${h}</label>`;
}
function form(row) {
  const c = T[cur]; const d = $('#dlg');
  d.innerHTML = `<form method="dialog" id="fm"><h2>${row ? 'Modifier' : 'Ajouter'} · ${esc(c.label)}</h2>${c.f.map((f) => field(f, row)).join('')}<div class="bar2"><button type="button" id="cancel">Annuler</button><button type="submit" class="pri">Enregistrer</button></div></form>`;
  d.showModal(); $('#cancel').onclick = () => d.close();
  $('#fm').onsubmit = async (e) => {
    e.preventDefault(); const o = {}, btn = e.submitter; btn.disabled = true;
    try {
      for (const [k, , t] of c.f) { const el = $('#f_' + k); let v;
        if (t === 'b') v = el.checked; else if (t === 'i') { const fl = el.files[0]; v = fl ? await upload(fl) : $('#f_' + k + '_u').value || null; }
        else if (t === 'n') v = el.value === '' ? null : Number(el.value); else if (t === 'dt') v = el.value ? new Date(el.value).toISOString() : null; else v = el.value === '' ? null : el.value;
        o[k] = v; }
      const { error } = row ? await sb.from(cur).update(o).eq('id', row.id) : await sb.from(cur).insert(o);
      if (error) throw error; d.close(); msg('Enregistré. Le site se met à jour dans environ une minute.'); list(); if (cur === 'teams') await loadTeams();
    } catch (er) { msg(er.message, 1); } finally { btn.disabled = false; }
  };
}
async function loadTeams() { const { data } = await sb.from('teams').select('id,name').order('sort_order'); teams = data || []; $('#filter').innerHTML = '<option value="">Toutes les équipes</option>' + teams.map((t) => `<option value="${t.id}">${esc(t.name)}</option>`).join(''); }
function tabs() { $('#tabs').innerHTML = Object.entries(T).map(([k, v]) => `<button data-t="${k}" class="${k === cur ? 'on' : ''}">${esc(v.label)}</button>`).join(''); $('#tabs').querySelectorAll('button').forEach((b) => (b.onclick = () => { cur = b.dataset.t; filt = ''; $('#filter').value = ''; tabs(); list(); })); }
async function start(session) {
  show('app'); $('#who').textContent = session.user.email;
  const { data } = await sb.from('staff_users').select('email').limit(1);
  if (!data || !data.length) { msg("Ce compte n'est pas autorisé à modifier le site. Demandez à l'administrateur de l'ajouter.", 1); }
  await loadTeams(); tabs(); list();
}
$('#lf').onsubmit = async (e) => { e.preventDefault(); const { data, error } = await sb.auth.signInWithPassword({ email: $('#em').value, password: $('#pw').value }); error ? ($('#lerr').textContent = 'Identifiants incorrects.') : start(data.session); };
$('#out').onclick = async () => { await sb.auth.signOut(); show('login'); };
$('#add').onclick = () => form(null);
$('#filter').onchange = (e) => { filt = e.target.value; list(); };
if (HOOK) { $('#pub').hidden = false; $('#pub').onclick = async () => { try { await fetch(HOOK, { method: 'POST' }); msg('Mise à jour lancée (environ 1 minute).'); } catch { msg('Échec du lancement.', 1); } }; }
sb.auth.getSession().then(({ data }) => (data.session ? start(data.session) : show('login')));
