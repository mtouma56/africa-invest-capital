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

## 🔌 Tester l'API

Deux points de terminaison sont disponibles pour vérifier rapidement le fonctionnement des fonctions serverless :

- **`/api/ping`** : renvoie toujours `{ ok: true }`.
- **`/api/register`** : crée un utilisateur lorsque `SUPABASE_SERVICE_ROLE_KEY` est configurée.

Exemples de requêtes :

```bash
# Test simple
curl https://<votre-domaine>/api/ping

# Inscription (remplacez les valeurs)
curl -X POST https://<votre-domaine>/api/register \
  -H 'Content-Type: application/json' \
  -d '{"fullName":"John Doe","email":"john@example.com","password":"Secret123"}'
```

La clé **SUPABASE_SERVICE_ROLE_KEY** se trouve dans Supabase → **Settings > API > Service Role Key**. Définissez‑la dans les variables d'environnement Vercel (Project Settings › Environment Variables) pour que ces routes fonctionnent en production.

Les appels à `/api/register` inscrivent une trace dans les logs Vercel grâce au `console.log` présent dans `api/register.js`.

### Tests Jest

Les tests unitaires utilisent Jest. Si vous obtenez une erreur liée à `signal-exit`, assurez‑vous d'installer la version 3 :

```bash
npm install signal-exit@3 --save-dev
```

Le fichier `package.json` force déjà cette version via la section `overrides`, ce qui règle le problème en CI ou en local après une nouvelle installation des dépendances.
