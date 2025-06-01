import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import {
  Bars3Icon,
  UserCircleIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline';

const Header = ({ isAdmin, toggleSidebar, user }) => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const menuButtonRef = useRef(null);
  const firstMobileLinkRef = useRef(null);

  useEffect(() => {
    if (mobileMenuOpen) {
      firstMobileLinkRef.current?.focus();
    } else {
      menuButtonRef.current?.focus();
    }
  }, [mobileMenuOpen]);

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  // Navigation publique
  const publicNavigation = [
    { name: 'Accueil', href: '/' },
    { name: 'À propos', href: '/a-propos' },
    { name: 'Services', href: '/services' },
    { name: 'Contact', href: '/contact' },
  ];

  // Header connecté (admin/client)
  if (user) {
    return (
      <header className="bg-noir shadow-md z-10">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="flex h-20 justify-between items-center">
            <div className="flex items-center">
              <button
                type="button"
                className="text-or flex items-center lg:hidden"
                aria-label="Ouvrir le menu latéral"
                onClick={toggleSidebar}
              >
                <span className="sr-only">Ouvrir le menu</span>
                <Bars3Icon className="h-8 w-8" aria-hidden="true" />
              </button>
              <Link to={isAdmin ? "/admin" : "/client"} className="flex items-center ml-2 lg:ml-0">
                <img className="h-12 w-auto" src="https://i.ibb.co/k65RGW5j/logoaic.png" alt="Africa Invest Capital" />
                <span className="ml-2 text-2xl font-bold text-or hidden md:block">Africa Invest Capital</span>
              </Link>
            </div>
            <div className="flex items-center">
              <div className="relative">
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center text-or hover:text-or-light transition"
                >
                  <UserCircleIcon className="h-10 w-10 mr-2" />
                  <span className="hidden md:block font-medium">
                    {user?.profile?.first_name || user?.email}
                  </span>
                </button>
                {dropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-noir rounded-xl shadow-xl z-30 border border-or">
                    <Link
                      to={isAdmin ? "/admin/parametres" : "/client/profil"}
                      className="block px-6 py-3 text-lg text-or hover:bg-or-light hover:text-noir transition"
                      onClick={() => setDropdownOpen(false)}
                    >
                      Profil
                    </Link>
                    <button
                      onClick={() => {
                        setDropdownOpen(false);
                        handleLogout();
                      }}
                      className="block w-full text-left px-6 py-3 text-lg text-or hover:bg-or-light hover:text-noir transition"
                    >
                      Déconnexion
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </header>
    );
  }

  // Header public
  return (
    <header className="bg-noir shadow-lg">
      <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8" aria-label="Top">
        <div className="flex h-20 items-center justify-between">
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <img className="h-12 w-auto" src="https://i.ibb.co/k65RGW5j/logoaic.png" alt="Africa Invest Capital" />
              <span className="ml-4 text-2xl font-bold text-or hidden sm:block tracking-wide">Africa Invest Capital</span>
            </Link>
          </div>
          <div className="hidden md:flex md:items-center md:space-x-8">
            {publicNavigation.map((item) => {
              const isActive =
                location.pathname === item.href ||
                (item.href !== '/' && location.pathname.startsWith(item.href));
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  aria-current={isActive ? 'page' : undefined}
                  className={`${
                    isActive
                      ? 'border-b-2 border-or text-or-light'
                      : 'text-or hover:text-or-light'
                  } text-lg font-medium transition pb-1`}
                >
                  {item.name}
                </Link>
              );
            })}
            <Link
              to="/auth/login"
              className="ml-8 px-6 py-2 rounded-xl bg-or text-noir font-bold text-lg border border-or hover:bg-or-light hover:text-noir transition"
            >
              Connexion
            </Link>
          </div>
          <div className="md:hidden">
            <button
              type="button"
              ref={menuButtonRef}
              className="text-or"
aria-controls="mobile-menu"
aria-expanded={mobileMenuOpen}
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              <span className="sr-only">Ouvrir le menu</span>
              <Bars3Icon className="h-8 w-8" aria-hidden="true" />
            </button>
          </div>
        </div>
        {/* Menu mobile */}
        {mobileMenuOpen && (
          <div id="mobile-menu" className="md:hidden absolute top-0 inset-x-0 z-20 bg-noir shadow-2xl">
            <div className="px-4 pt-4 pb-4 flex flex-col">
              <div className="flex justify-between items-center border-b border-or pb-3">
                <Link to="/" className="flex items-center">
                  <img className="h-8 w-auto" src="https://i.ibb.co/k65RGW5j/logoaic.png" alt="Africa Invest Capital" />
                  <span className="ml-2 text-lg font-bold text-or">AIC</span>
                </Link>
                <button
                  type="button"
                  className="text-or"
                  aria-label="Fermer le menu"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <XMarkIcon className="h-8 w-8" aria-hidden="true" />
                </button>
              </div>
              {publicNavigation.map((item, idx) => {
                const isActive =
                  location.pathname === item.href ||
                  (item.href !== '/' && location.pathname.startsWith(item.href));
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    ref={idx === 0 ? firstMobileLinkRef : null}
                    aria-current={isActive ? 'page' : undefined}
                    className={`${
                      isActive
                        ? 'border-l-4 border-or pl-2 text-or-light'
                        : 'text-or hover:text-or-light'
                    } text-lg font-medium py-3 transition`}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {item.name}
                  </Link>
                );
              })}
              <Link
                to="/auth/login"
                className="mt-4 block rounded-xl bg-or px-6 py-3 text-center text-lg font-bold text-noir border border-or hover:bg-or-light hover:text-noir transition"
                onClick={() => setMobileMenuOpen(false)}
              >
                Connexion
              </Link>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
};

export default Header;
