import { Routes, Route, Navigate } from 'react-router-dom';
import { Suspense } from 'react';
import { useAuth } from '../hooks/useAuth';

// Layouts
import Layout from '../components/layout/Layout';
import AdminLayout from '../components/layout/AdminLayout';
import ClientLayout from '../components/layout/ClientLayout';

// Public Pages
import Home from '../pages/public/Home';
import About from '../pages/public/About';
import Services from '../pages/public/Services';
import Contact from '../pages/public/Contact';
import NotFound from '../pages/public/NotFound';

// Auth Pages
import Login from '../pages/auth/Login';
import Register from '../pages/auth/Register';
import ResetPassword from '../pages/auth/ResetPassword';

// Client Pages
import ClientDashboard from '../pages/client/Dashboard';
import NewLoanRequest from '../pages/client/NewLoanRequest';
import Documents from '../pages/client/Documents';
import Profile from '../pages/client/Profile';
import LoanDetails from '../pages/client/LoanDetails';

// Admin Pages
import AdminDashboard from '../pages/admin/Dashboard';
import AdminLoans from '../pages/admin/Loans';
import AdminClients from '../pages/admin/Clients';
import AdminSettings from '../pages/admin/Settings';
import AdminLoanDetails from '../pages/admin/LoanDetails';
import AdminClientDetails from '../pages/admin/ClientDetails';

// Components
import Loader from '../components/common/Loader';

export const AppRoutes = () => {
  const { user, loading, isAdmin } = useAuth();

  if (loading) {
    return <Loader />;
  }

  return (
    <Suspense fallback={<Loader />}>
      <Routes>
        {/* Routes publiques */}
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="a-propos" element={<About />} />
          <Route path="services" element={<Services />} />
          <Route path="contact" element={<Contact />} />
          <Route path="*" element={<NotFound />} />
        </Route>

        {/* Routes d'authentification */}
        <Route path="/auth" element={<Layout />}>
          <Route path="login" element={!user ? <Login /> : <Navigate to={isAdmin ? "/admin" : "/client"} />} />
          <Route path="register" element={!user ? <Register /> : <Navigate to={isAdmin ? "/admin" : "/client"} />} />
          <Route path="reset-password" element={<ResetPassword />} />
        </Route>

        {/* Routes Client */}
        <Route
          path="/client"
          element={user && !isAdmin ? <ClientLayout /> : <Navigate to={user ? (isAdmin ? "/admin" : "/") : "/auth/login"} />}
        >
          <Route index element={<ClientDashboard />} />
          <Route path="demande-pret" element={<NewLoanRequest />} />
          <Route path="prets/:loanId" element={<LoanDetails />} />
          <Route path="documents" element={<Documents />} />
          <Route path="profil" element={<Profile />} />
        </Route>

        {/* Routes Admin */}
        <Route
          path="/admin"
          element={user && isAdmin ? <AdminLayout /> : <Navigate to={user ? (isAdmin ? "/" : "/client") : "/auth/login"} />}
        >
          <Route index element={<AdminDashboard />} />
          <Route path="prets" element={<AdminLoans />} />
          <Route path="prets/:loanId" element={<AdminLoanDetails />} />
          <Route path="clients" element={<AdminClients />} />
          <Route path="clients/:clientId" element={<AdminClientDetails />} />
          <Route path="parametres" element={<AdminSettings />} />
        </Route>
      </Routes>
    </Suspense>
  );
};
