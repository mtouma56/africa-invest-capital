import React from 'react';
import { Outlet } from 'react-router-dom';

const SimpleLayout = () => {
  return (
    <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
      <header style={{ padding: '20px 0', borderBottom: '1px solid #eee' }}>
        <h1>Africa Invest Capital</h1>
        <nav style={{ marginTop: '15px' }}>
          <a href="/" style={{ marginRight: '15px', textDecoration: 'none' }}>Accueil</a>
          <a href="/a-propos" style={{ marginRight: '15px', textDecoration: 'none' }}>À propos</a>
          <a href="/services" style={{ marginRight: '15px', textDecoration: 'none' }}>Services</a>
          <a href="/contact" style={{ textDecoration: 'none' }}>Contact</a>
        </nav>
      </header>
      
      <main style={{ padding: '20px 0' }}>
        {/* C'est ici que le contenu des routes sera injecté */}
        <Outlet />
      </main>
      
      <footer style={{ padding: '20px 0', borderTop: '1px solid #eee', marginTop: '30px' }}>
        <p>© 2025 Africa Invest Capital. Tous droits réservés.</p>
      </footer>
    </div>
  );
};

export default SimpleLayout;
