import { Outlet } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';

const Layout = () => {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only absolute left-2 top-2 z-50 rounded bg-or px-4 py-2 text-noir"
      >
        Aller au contenu principal
      </a>
      <Header />
      <main id="main-content" className="flex-grow focus:outline-none">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default Layout;
