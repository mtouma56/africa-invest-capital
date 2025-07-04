# Africa Invest Capital

Application web complète pour Africa Invest Capital, une société financière basée en Côte d'Ivoire. Cette application permet la gestion des demandes de prêts, l'intermédiation financière et le conseil en investissement.

## 🚀 Fonctionnalités

### Site vitrine public
- Page d'accueil
- Page À propos
- Page Services (intermédiation de prêts, investissements, conseil)
- Page Contact

### Portail client sécurisé
- Connexion / Inscription
- Tableau de bord client
- Demandes de crédit
- Uploads de documents
- Utilisation de la caméra sur mobile

### Dashboard administrateur
- Liste et gestion des demandes
- Visualisation des informations clients
- Gestion des documents
- Attribution des demandes aux collaborateurs

## 🛠️ Technologies utilisées
- **Frontend**: React avec Vite
- **UI**: Tailwind CSS
- **Backend**: Supabase
- **Authentification**: Supabase Auth
- **Stockage**: Supabase Storage
- **Base de données**: PostgreSQL (Supabase)

## 📦 Installation

### Prérequis
- Node.js 16+
- npm ou yarn

### Installation locale

1. Cloner le repository
```bash
git clone https://github.com/votre-username/africa-invest-capital.git
cd africa-invest-capital
npm install
# ⚠️ Ne pas ajouter manuellement la dépendance `signal-exit` dans `package.json`. Elle est installée automatiquement par les outils qui en ont besoin et son ajout explicite provoque des conflits de build, notamment sur Vercel.

# Copier les fichiers d'exemple et renseigner vos variables
cp .env.example .env
cp .env.local.example .env.local
# Éditez ensuite `.env` et `.env.local` avec vos identifiants Supabase.
# Le fichier `.env.local` doit contenir au moins `SUPABASE_SERVICE_ROLE_KEY`.
# Ne commitez jamais vos vraies clés ; utilisez des variables d'environnement
# sur votre plateforme de déploiement (ex. Vercel).
```

## ♿ Accessibilité

- Utiliser `aria-label` ou `aria-describedby` pour décrire les champs de formulaire.
- Ajouter `aria-hidden="true"` aux icônes purement décoratives.
- Vérifier que chaque combinaison de couleurs respecte un ratio de contraste d'au moins 4.5:1.
- Les couleurs dorées ont été ajustées (`#FFD700`) pour un meilleur contraste sur fond sombre.
- Construire les grilles avec les classes réactives de Tailwind (`sm:`, `md:`, `lg:`) afin d'assurer une mise en page 100% responsive.

## API

- `GET /api/ping` renvoie `{ "message": "pong" }` pour tester la connectivité du backend.
- `POST /api/register` crée un nouvel utilisateur via Supabase.

Pour tester ces endpoints en local, lancez :

```bash
npm run dev
```

Les routes seront alors disponibles sur [http://localhost:4000](http://localhost:4000) (ou le port suivant) : `http://localhost:4000/api/ping` et `http://localhost:4000/api/register`.

## Preview deployments

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`

After saving these variables, redeploy your preview branch from the Vercel dashboard. Once the deployment is finished, registration should succeed without the "Server misconfigured" error.

For production, add the variables via the Vercel CLI then trigger a redeploy:

```bash
vercel env add NEXT_PUBLIC_SUPABASE_URL production
vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY production
vercel env add SUPABASE_SERVICE_ROLE_KEY production
vercel redeploy
```

