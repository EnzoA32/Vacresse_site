import { defineType, defineField } from 'sanity';
const f = defineField;
const slug = (src = 'name') => f({ name: 'slug', title: 'Adresse (slug)', type: 'slug', options: { source: src }, validation: r => r.required() });

const season = defineType({ name: 'season', title: 'Saison', type: 'document', fields: [
  f({ name: 'title', title: 'Titre (ex. 2026-2027)', type: 'string', validation: r => r.required() }),
  f({ name: 'current', title: 'Saison en cours', type: 'boolean', initialValue: false })
], preview: { select: { title: 'title', subtitle: 'current' }, prepare: ({ title, subtitle }) => ({ title, subtitle: subtitle ? 'En cours' : '' }) } });

const team = defineType({ name: 'team', title: 'Équipe', type: 'document', fields: [
  f({ name: 'name', title: 'Nom (ex. U17 A)', type: 'string', validation: r => r.required() }), slug(),
  f({ name: 'season', title: 'Saison', type: 'reference', to: [{ type: 'season' }], validation: r => r.required() }),
  f({ name: 'order', title: "Ordre d'affichage", type: 'number' }),
  f({ name: 'staff', title: 'Entraîneur(s) et délégué(s)', type: 'string' }),
  f({ name: 'trainings', title: 'Entraînements', type: 'array', of: [{ type: 'object', fields: [
    f({ name: 'day', title: 'Jour', type: 'string' }), f({ name: 'time', title: 'Heure', type: 'string' }), f({ name: 'place', title: 'Lieu', type: 'string' })] }] })
], preview: { select: { title: 'name', subtitle: 'season.title' } } });

const event = defineType({ name: 'event', title: 'Match / entraînement', type: 'document', fields: [
  f({ name: 'type', title: 'Type', type: 'string', options: { list: [{ title: 'Match', value: 'match' }, { title: 'Entraînement', value: 'entrainement' }], layout: 'radio' }, initialValue: 'match' }),
  f({ name: 'team', title: 'Équipe', type: 'reference', to: [{ type: 'team' }], validation: r => r.required() }),
  f({ name: 'title', title: 'Titre (ex. FC Vacresse — Club X)', type: 'string', validation: r => r.required() }),
  f({ name: 'date', title: 'Date et heure', type: 'datetime', validation: r => r.required() }),
  f({ name: 'place', title: 'Lieu', type: 'string' }),
  f({ name: 'score', title: 'Score (ex. 3 – 1), à remplir après le match', type: 'string' })
], orderings: [{ title: 'Date', name: 'd', by: [{ field: 'date', direction: 'desc' }] }], preview: { select: { title: 'title', subtitle: 'date' } } });

const article = defineType({ name: 'article', title: 'Actualité', type: 'document', fields: [
  f({ name: 'title', title: 'Titre', type: 'string', validation: r => r.required() }), slug('title'),
  f({ name: 'category', title: 'Catégorie', type: 'string', options: { list: ['Actualité', 'Résumé de match', 'Vie du club', 'Événement', 'Annonce', 'Jeunes', 'Équipe première', 'Communiqué', 'Autre'] } }),
  f({ name: 'image', title: 'Image principale', type: 'image', options: { hotspot: true } }),
  f({ name: 'publishedAt', title: 'Date de publication', type: 'datetime', initialValue: () => new Date().toISOString() }),
  f({ name: 'author', title: 'Auteur', type: 'string' }),
  f({ name: 'body', title: 'Contenu', type: 'array', of: [{ type: 'block' }, { type: 'image', options: { hotspot: true } }] })
], preview: { select: { title: 'title', media: 'image' } } });

const album = defineType({ name: 'album', title: 'Album photos', type: 'document', fields: [
  f({ name: 'title', title: 'Titre', type: 'string', validation: r => r.required() }), slug('title'),
  f({ name: 'date', title: 'Date', type: 'date' }),
  f({ name: 'team', title: 'Équipe (facultatif)', type: 'reference', to: [{ type: 'team' }] }),
  f({ name: 'photos', title: 'Photos', type: 'array', of: [{ type: 'image', options: { hotspot: true } }], options: { layout: 'grid' } })
] });

const slide = defineType({ name: 'slide', title: "Diapositive d'accueil", type: 'document', fields: [
  f({ name: 'image', title: 'Photo (1920 px de large minimum)', type: 'image', options: { hotspot: true }, validation: r => r.required() }),
  f({ name: 'title', title: 'Titre', type: 'string', validation: r => r.required() }),
  f({ name: 'text', title: 'Phrase', type: 'string' }),
  f({ name: 'link', title: 'Lien (ex. /calendrier)', type: 'string' }),
  f({ name: 'cta', title: 'Texte du bouton', type: 'string' }),
  f({ name: 'order', title: 'Ordre', type: 'number' })
], preview: { select: { title: 'title', media: 'image' } } });

const faqItem = defineType({ name: 'faqItem', title: 'Question FAQ', type: 'document', fields: [
  f({ name: 'question', title: 'Question', type: 'string', validation: r => r.required() }),
  f({ name: 'answer', title: 'Réponse', type: 'text', validation: r => r.required() }),
  f({ name: 'order', title: 'Ordre', type: 'number' })
] });

const sponsor = defineType({ name: 'sponsor', title: 'Sponsor', type: 'document', fields: [
  f({ name: 'name', title: 'Nom', type: 'string', validation: r => r.required() }),
  f({ name: 'logo', title: 'Logo', type: 'image' }),
  f({ name: 'url', title: 'Site web', type: 'url' }),
  f({ name: 'order', title: 'Ordre', type: 'number' })
], preview: { select: { title: 'name', media: 'logo' } } });

export const schemaTypes = [sponsor, season, team, event, article, album, slide, faqItem];
