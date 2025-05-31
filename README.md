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

# Copier le fichier d'exemple et renseigner vos variables
cp .env.example .env
# Éditez ensuite `.env` avec vos identifiants Supabase
# Ajoutez aussi `SUPABASE_SERVICE_ROLE_KEY=<votre_service_key>` dans `.env.local`
# Cette clé se trouve dans Supabase → Project Settings → API → Service Role Key.
# Cette variable doit être définie localement et en production (par exemple via les variables d'environnement Vercel).
# (ou dans les variables d'environnement de votre plateforme de déploiement,
# par exemple Vercel)
```

## ♿ Accessibilité

- Utiliser `aria-label` ou `aria-describedby` pour décrire les champs de formulaire.
- Ajouter `aria-hidden="true"` aux icônes purement décoratives.
- Vérifier que chaque combinaison de couleurs respecte un ratio de contraste d'au moins 4.5:1.
- Les couleurs dorées ont été ajustées (`#FFD700`) pour un meilleur contraste sur fond sombre.
- Construire les grilles avec les classes réactives de Tailwind (`sm:`, `md:`, `lg:`) afin d'assurer une mise en page 100% responsive.

## Preview deployments

To enable preview branches on Vercel to communicate with Supabase, add the following variables in **Preview** with the same values used in **Production**:

- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`

After saving these variables, redeploy your preview branch from the Vercel dashboard. Once the deployment is finished, registration should succeed without the "Server misconfigured" error.

