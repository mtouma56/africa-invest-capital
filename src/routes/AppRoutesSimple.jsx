import { Routes, Route } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

export const AppRoutesSimple = () => {
  const { user, loading, isAdmin } = useAuth();
  
  // Ajoutons une condition simple basée sur l'état de chargement
  if (loading) {
    return <div><p>Chargement...</p></div>;
  }
  
  return (
    <Routes>
      <Route 
        path="/" 
        element={
          <div>
            <h1>Page d&apos;accueil</h1>
            <p>Version simplifiée sans composants externes</p>
            {user ? <p>Bienvenue, utilisateur connecté!</p> : <p>Bienvenue, visiteur!</p>}
          </div>
        } 
      />
      <Route 
        path="*" 
        element={<div><h1>Page non trouvée</h1></div>} 
      />
    </Routes>
  );
};