# FC Vacresse — site (Astro) + base Supabase

## Pages
Accueil · Le club · Matchs (iframe Foot24) · Équipes (entraînements / matchs / effectif) · Événements · Contact · Boutique (lien dans `src/lib/data.js`, `club.shop`) · /admin (interface d'encodage).

## 1. Créer la base (Supabase, formule gratuite)
1. supabase.com > New project (région Europe).
2. SQL Editor > coller `supabase/schema.sql` > Run.
3. Authentication > Users > Add user : e-mail + mot de passe pour chaque dirigeant.
4. SQL Editor : `insert into staff_users (email) values ('adresse@exemple.be');` pour chaque personne autorisée à modifier.
5. Project Settings > API : copier « Project URL » et la clé « anon public ».

## 2. Brancher le site (Vercel > Settings > Environment Variables)
- `PUBLIC_SUPABASE_URL` = Project URL
- `PUBLIC_SUPABASE_ANON_KEY` = clé anon public (publique par conception, la sécurité vient des règles de la base)
- (facultatif) `PUBLIC_DEPLOY_HOOK` = Deploy Hook Vercel : affiche un bouton « Mettre à jour le site » dans l'admin.
Puis redéployer. Sans ces variables, le site affiche des données d'exemple.

## 3. Mise à jour automatique
Le site est statique : il se reconstruit à chaque changement (environ 1 minute). Supabase > Database > Webhooks > Create : tables concernées, événements Insert/Update/Delete, méthode POST, URL = Deploy Hook Vercel (Settings > Git > Deploy Hooks).

## 4. Utilisation
`/admin` : connexion, puis onglets Événements, Matchs, Joueurs, Entraînements, Équipes, Personnes du club, Photos du club, Sponsors, Diaporama. Les photos sont redimensionnées avant envoi.
Données sur les mineurs : prénom, nom, numéro, poste. Photo seulement avec l'accord des parents.
Fichier local : `npm install` puis `npm run dev`.
