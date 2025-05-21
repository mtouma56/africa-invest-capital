import { Link, useLocation } from 'react-router-dom';
import XMarkIcon from '@heroicons/react/24/outline/XMarkIcon';
import HomeIcon from '@heroicons/react/24/outline/HomeIcon';
import DocumentTextIcon from '@heroicons/react/24/outline/DocumentTextIcon';
import UserIcon from '@heroicons/react/24/outline/UserIcon';
import UsersIcon from '@heroicons/react/24/outline/UsersIcon';
import CurrencyDollarIcon from '@heroicons/react/24/outline/CurrencyDollarIcon';
import Cog6ToothIcon from '@heroicons/react/24/outline/Cog6ToothIcon';

const Sidebar = ({ isAdmin, isOpen, toggleSidebar }) => {
  const location = useLocation();
  
  // Navigation pour l'espace client
  const clientNavigation = [
    { name: 'Tableau de bord', href: '/client', icon: HomeIcon },
    { name: 'Demander un prêt', href: '/client/demande-pret', icon: CurrencyDollarIcon },
    { name: 'Mes documents', href: '/client/documents', icon: DocumentTextIcon },
    { name: 'Mon profil', href: '/client/profil', icon: UserIcon }
  ];
  
  // Navigation pour l'espace admin
  const adminNavigation = [
    { name: 'Tableau de bord', href: '/admin', icon: HomeIcon },
    { name: 'Demandes de prêts', href: '/admin/prets', icon: CurrencyDollarIcon },
    { name: 'Clients', href: '/admin/clients', icon: UsersIcon },
    { name: 'Paramètres', href: '/admin/parametres', icon: Cog6ToothIcon }
  ];
  
  const navigation = isAdmin ? adminNavigation : clientNavigation;

  return (
    <div 
      className={`lg:flex lg:flex-shrink-0 ${isOpen ? 'block' : 'hidden'}`}
    >
      <div className="flex flex-col w-64">
        <div className="flex flex-col h-0 flex-1 bg-white border-r border-gray-200">
          <div className="flex items-center h-16 flex-shrink-0 px-4 bg-secondary shadow-md lg:shadow-none">
            <Link to={isAdmin ? "/admin" : "/client"} className="flex items-center">
              <img
                className="h-8 w-auto"
                src="https://i.ibb.co/k65RGW5j/logoaic.png"
                alt="Africa Invest Capital"
              />
              <span className="ml-2 text-lg font-bold text-primary">AIC</span>
            </Link>
            <button
              type="button"
              className="ml-auto lg:hidden text-primary"
              onClick={toggleSidebar}
            >
              <span className="sr-only">Fermer le menu</span>
              <XMarkIcon className="h-6 w-6" aria-hidden="true" />
            </button>
          </div>
          <div className="flex-1 flex flex-col overflow-y-auto">
            <nav className="flex-1 px-2 py-4 space-y-1">
              {navigation.map((item) => {
                const isActive = location.pathname === item.href || 
                                (item.href !== (isAdmin ? '/admin' : '/client') && 
                                 location.pathname.startsWith(item.href));
                
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`${
                      isActive
                        ? 'bg-primary text-white'
                        : 'text-gray-600 hover:bg-gray-100'
                    } group flex items-center px-2 py-2 text-sm font-medium rounded-md`}
                  >
                    <item.icon
                      className={`${
                        isActive ? 'text-white' : 'text-gray-400 group-hover:text-gray-500'
                      } mr-3 flex-shrink-0 h-6 w-6`}
                      aria-hidden="true"
                    />
                    {item.name}
                  </Link>
                );
              })}
            </nav>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
