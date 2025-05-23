import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';
import { useAuth } from '../../hooks/useAuth';

const AdminLayout = () => {
  const { user } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only absolute left-2 top-2 z-50 rounded bg-or px-4 py-2 text-noir"
      >
        Aller au contenu principal
      </a>
      {/* Sidebar pour mobile */}
      <div className={`fixed inset-0 z-20 transition-opacity bg-black opacity-50 lg:hidden ${
        sidebarOpen ? 'block' : 'hidden'
      }`}
      onClick={() => setSidebarOpen(false)}
      />

      <Sidebar 
        isAdmin={true}
        isOpen={sidebarOpen}
        toggleSidebar={toggleSidebar}
      />

      <div className="flex flex-col flex-1 overflow-hidden">
        <Header 
          isAdmin={true}
          toggleSidebar={toggleSidebar}
          user={user}
        />

        <main id="main-content" className="flex-1 overflow-y-auto bg-gray-100 p-4 focus:outline-none">
          <div className="max-w-7xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
