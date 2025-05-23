# Snippets d'amélioration du feedback utilisateur

## Loader dans les pages
```jsx
import Loader from '../components/common/Loader';

if (loading) {
  return (
    <div className="flex justify-center items-center h-64">
      <Loader />
    </div>
  );
}
```

## Utilisation unifiée des toasts
```jsx
import { showSuccess, showError } from '../utils/toast';

showSuccess('Opération réussie');
showError('Une erreur est survenue');
```

## État vide
```jsx
import EmptyState from '../components/common/EmptyState';
import { ExclamationCircleIcon } from '@heroicons/react/24/outline';

<EmptyState
  icon={ExclamationCircleIcon}
  message="Aucun élément à afficher"
  action={<button className="text-primary">Ajouter un élément</button>}
/>
```
