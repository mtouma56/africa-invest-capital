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
```

## ♿ Accessibilité

- Utiliser `aria-label` ou `aria-describedby` pour décrire les champs de formulaire.
- Ajouter `aria-hidden="true"` aux icônes purement décoratives.
- Vérifier que chaque combinaison de couleurs respecte un ratio de contraste d'au moins 4.5:1.
- Les couleurs dorées ont été ajustées (`#FFD700`) pour un meilleur contraste sur fond sombre.
- Construire les grilles avec les classes réactives de Tailwind (`sm:`, `md:`, `lg:`) afin d'assurer une mise en page 100% responsive.
