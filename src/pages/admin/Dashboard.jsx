import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../../config/supabaseClient';
import { useAuth } from '../../hooks/useAuth';

// Importation directe des icônes
import UsersIcon from '@heroicons/react/24/outline/UsersIcon';
import CurrencyDollarIcon from '@heroicons/react/24/outline/CurrencyDollarIcon';
import DocumentTextIcon from '@heroicons/react/24/outline/DocumentTextIcon';
import ClockIcon from '@heroicons/react/24/outline/ClockIcon';
import CheckCircleIcon from '@heroicons/react/24/outline/CheckCircleIcon';
import ExclamationCircleIcon from '@heroicons/react/24/outline/ExclamationCircleIcon';

const statusColors = {
  pending: 'bg-yellow-100 text-yellow-800',
  approved: 'bg-green-100 text-green-800',
  rejected: 'bg-red-100 text-red-800',
  completed: 'bg-blue-100 text-blue-800',
};

const statusIcons = {
  pending: ClockIcon,
  approved: CheckCircleIcon,
  rejected: ExclamationCircleIcon,
  completed: CheckCircleIcon,
};
const AdminDashboard = () => {
  const { user } = useAuth();
  
  const [stats, setStats] = useState({
    totalLoans: 0,
    totalClients: 0,
    pendingLoans: 0,
    approvedLoans: 0,
    totalAmount: 0
  });
  
  const [recentLoans, setRecentLoans] = useState([]);
  const [recentClients, setRecentClients] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        
        // Récupération des statistiques
        const [
          loansResult, 
          clientsResult, 
          pendingLoansResult, 
          approvedLoansResult, 
          totalAmountResult,
          recentLoansResult,
          recentClientsResult
        ] = await Promise.all([
          // Nombre total de prêts
          supabase
          .from('loan_requests')
            .select('id', { count: 'exact', head: true }),
          
          // Nombre total de clients
          supabase
            .from('profiles')
            .select('id', { count: 'exact', head: true })
            .eq('role', 'client'),
          
          // Nombre de prêts en attente
          supabase
          .from('loan_requests')
            .select('id', { count: 'exact', head: true })
            .eq('status', 'pending'),
          
          // Nombre de prêts approuvés
          supabase
            .from('loans')
            .select('id', { count: 'exact', head: true })
            .eq('status', 'approved'),
          
          // Montant total des prêts approuvés
          supabase
          .from('loan_requests')
            .select('amount')
            .eq('status', 'approved'),
          
          // Prêts récents
          supabase
          .from('loan_requests')
            .select(`
              *,
              profiles:user_id (
                email,
                first_name,
                last_name
              )
            `)
            .order('created_at', { ascending: false })
            .limit(5),
          
          // Clients récents
          supabase
            .from('profiles')
            .select('*')
            .eq('role', 'client')
            .order('created_at', { ascending: false })
            .limit(5)
        ]);
        
        // Calcul du montant total
        const totalAmount = totalAmountResult.data ? 
          totalAmountResult.data.reduce((sum, loan) => sum + loan.amount, 0) : 0;
        
        setStats({
          totalLoans: loansResult.count || 0,
          totalClients: clientsResult.count || 0,
          pendingLoans: pendingLoansResult.count || 0,
          approvedLoans: approvedLoansResult.count || 0,
          totalAmount
        });
        
        setRecentLoans(recentLoansResult.data || []);
        setRecentClients(recentClientsResult.data || []);
        
      } catch (error) {
        console.error('Erreur lors du chargement des données du dashboard:', error);
      } finally {
        setLoading(false);
      }
    };
    
    if (user) {
      fetchDashboardData();
    }
  }, [user]);
  return (
    <div className="py-6">
      <h1 className="text-2xl font-semibold text-gray-900">Tableau de bord administrateur</h1>
      <p className="mt-1 text-sm text-gray-500">
        Vue d&apos;ensemble des activit&eacute;s et statistiques.
      </p>

      {/* Stats cards */}
      <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {/* Total Clients */}
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-blue-500 rounded-md p-3">
                <UsersIcon className="h-6 w-6 text-white" aria-hidden="true" />
              </div>
              <div className="ml-5">
                <p className="text-sm font-medium text-gray-500 truncate">Total clients</p>
                <p className="mt-1 text-3xl font-semibold text-gray-900">
                  {loading ? '...' : stats.totalClients}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-gray-50 px-5 py-3">
            <div className="text-sm">
              <Link to="/admin/clients" className="font-medium text-primary hover:text-primary-dark">
                Voir tous les clients
              </Link>
            </div>
          </div>
        </div>
        
        {/* Total Loans */}
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-green-500 rounded-md p-3">
                <DocumentTextIcon className="h-6 w-6 text-white" aria-hidden="true" />
              </div>
              <div className="ml-5">
                <p className="text-sm font-medium text-gray-500 truncate">Total demandes</p>
                <p className="mt-1 text-3xl font-semibold text-gray-900">
                  {loading ? '...' : stats.totalLoans}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-gray-50 px-5 py-3">
            <div className="text-sm">
              <Link to="/admin/prets" className="font-medium text-primary hover:text-primary-dark">
                Voir toutes les demandes
              </Link>
            </div>
          </div>
        </div>
        
        {/* Pending Loans */}
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-yellow-500 rounded-md p-3">
                <ClockIcon className="h-6 w-6 text-white" aria-hidden="true" />
              </div>
              <div className="ml-5">
                <p className="text-sm font-medium text-gray-500 truncate">En attente</p>
                <p className="mt-1 text-3xl font-semibold text-gray-900">
                  {loading ? '...' : stats.pendingLoans}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-gray-50 px-5 py-3">
            <div className="text-sm">
              <Link to="/admin/prets?status=pending" className="font-medium text-primary hover:text-primary-dark">
                Voir les demandes en attente
              </Link>
            </div>
          </div>
        </div>
        
        {/* Total Amount */}
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-purple-500 rounded-md p-3">
                <CurrencyDollarIcon className="h-6 w-6 text-white" aria-hidden="true" />
              </div>
              <div className="ml-5">
                <p className="text-sm font-medium text-gray-500 truncate">Montant total</p>
                <p className="mt-1 text-3xl font-semibold text-gray-900">
                  {loading 
                    ? '...' 
                    : new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'XOF' })
                        .format(stats.totalAmount)
                        .replace(/\s/g, ' ')
                  }
                </p>
              </div>
            </div>
          </div>
          <div className="bg-gray-50 px-5 py-3">
            <div className="text-sm">
              <Link to="/admin/prets" className="font-medium text-primary hover:text-primary-dark">
                Voir les détails
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Loans */}
      <div className="mt-8">
        <h2 className="text-lg font-medium text-gray-900">Demandes de prêts récentes</h2>
        <div className="mt-4 overflow-hidden shadow ring-1 ring-black ring-opacity-5 sm:rounded-lg">
          {recentLoans.length > 0 ? (
            <table className="min-w-full divide-y divide-gray-300">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900">
                    Client
                  </th>
                  <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                    Type
                  </th>
                  <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                    Montant
                  </th>
                  <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                    Date
                  </th>
                  <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                    Statut
                  </th>
                  <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                    <span className="sr-only">Voir</span>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {recentLoans.map((loan) => {
                  const StatusIcon = statusIcons[loan.status];
                  const clientName = loan.profiles ? 
                    `${loan.profiles.first_name || ''} ${loan.profiles.last_name || ''}`.trim() || 
                    loan.profiles.email : 
                    'Client inconnu';
                    
                  return (
                    <tr key={loan.id}>
                      <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900">
                        <Link to={`/admin/clients/${loan.user_id}`} className="hover:text-primary">
                          {clientName}
                        </Link>
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        {loan.loan_type === 'business' && 'Pr&ecirc;t entreprise'}
                        {loan.loan_type === 'mortgage' && 'Pr&ecirc;t immobilier'}
                        {loan.loan_type === 'personal' && 'Pr&ecirc;t personnel'}
                        {loan.loan_type === 'education' && 'Pr&ecirc;t &eacute;ducation'}
                        {loan.loan_type === 'auto' && 'Pr&ecirc;t automobile'}
                        {!['business', 'mortgage', 'personal', 'education', 'auto'].includes(loan.loan_type) && loan.loan_type}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        {new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'XOF' }).format(loan.amount)}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        {new Date(loan.created_at).toLocaleDateString('fr-FR')}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusColors[loan.status] || 'bg-gray-100 text-gray-800'}`}>
                          {StatusIcon && <StatusIcon className="mr-1.5 h-4 w-4" />}
                          {loan.status === 'pending' && 'En attente'}
                          {loan.status === 'approved' && 'Approuv&eacute;'}
                          {loan.status === 'rejected' && 'Refus&eacute;'}
                          {loan.status === 'completed' && 'Compl&eacute;t&eacute;'}
                          {!['pending', 'approved', 'rejected', 'completed'].includes(loan.status) && loan.status}
                        </span>
                      </td>
                      <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                        <Link to={`/admin/prets/${loan.id}`} className="text-primary hover:text-primary-dark">
                          Détails
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          ) : (
            <div className="text-center py-6 bg-white">
              <p className="text-gray-500">{loading ? 'Chargement...' : 'Aucune demande de prêt trouvée.'}</p>
            </div>
          )}
        </div>
        {recentLoans.length > 0 && (
          <div className="mt-4 text-right">
            <Link to="/admin/prets" className="text-sm font-medium text-primary hover:text-primary-dark">
              Voir toutes les demandes <span aria-hidden="true">&rarr;</span>
            </Link>
          </div>
        )}
      </div>
      {/* Recent Clients */}
      <div className="mt-8">
        <h2 className="text-lg font-medium text-gray-900">Clients récents</h2>
        <div className="mt-4 overflow-hidden shadow ring-1 ring-black ring-opacity-5 sm:rounded-lg">
          {recentClients.length > 0 ? (
            <table className="min-w-full divide-y divide-gray-300">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900">
                    Nom
                  </th>
                  <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                    Email
                  </th>
                  <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                    T&eacute;l&eacute;phone
                  </th>
                  <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                    Date d&apos;inscription
                  </th>
                  <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                    <span className="sr-only">Voir</span>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {recentClients.map((client) => {
                  const clientName = `${client.first_name || ''} ${client.last_name || ''}`.trim() || 'N/A';
                  
                  return (
                    <tr key={client.id}>
                      <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900">
                        {clientName}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        {client.email}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        {client.phone || 'N/A'}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        {new Date(client.created_at).toLocaleDateString('fr-FR')}
                      </td>
                      <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                        <Link to={`/admin/clients/${client.id}`} className="text-primary hover:text-primary-dark">
                          Détails
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          ) : (
            <div className="text-center py-6 bg-white">
              <p className="text-gray-500">{loading ? 'Chargement...' : 'Aucun client trouvé.'}</p>
            </div>
          )}
        </div>
        {recentClients.length > 0 && (
          <div className="mt-4 text-right">
            <Link to="/admin/clients" className="text-sm font-medium text-primary hover:text-primary-dark">
              Voir tous les clients <span aria-hidden="true">&rarr;</span>
            </Link>
          </div>
        )}
      </div>

      {/* Quick actions */}
      <div className="mt-8">
        <h2 className="text-lg font-medium text-gray-900">Actions rapides</h2>
        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <Link
            to="/admin/prets?status=pending"
            className="bg-white p-6 rounded-lg border border-gray-200 hover:border-primary hover:shadow-md transition duration-200"
          >
            <div className="flex items-center">
              <div className="flex-shrink-0 h-10 w-10 rounded-md bg-yellow-100 flex items-center justify-center">
                <ClockIcon className="h-6 w-6 text-yellow-600" />
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-medium text-gray-900">Demandes en attente</h3>
                <p className="text-sm text-gray-500">
                  Examiner les demandes de prêt en attente de validation.
                </p>
              </div>
            </div>
          </Link>

          <Link
            to="/admin/clients"
            className="bg-white p-6 rounded-lg border border-gray-200 hover:border-primary hover:shadow-md transition duration-200"
          >
            <div className="flex items-center">
              <div className="flex-shrink-0 h-10 w-10 rounded-md bg-blue-100 flex items-center justify-center">
                <UsersIcon className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-medium text-gray-900">Gestion des clients</h3>
                <p className="text-sm text-gray-500">
                  Consulter et g&eacute;rer les profils clients.
                </p>
              </div>
            </div>
          </Link>

          <Link
            to="/admin/parametres"
            className="bg-white p-6 rounded-lg border border-gray-200 hover:border-primary hover:shadow-md transition duration-200"
          >
            <div className="flex items-center">
              <div className="flex-shrink-0 h-10 w-10 rounded-md bg-purple-100 flex items-center justify-center">
                <svg className="h-6 w-6 text-purple-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-medium text-gray-900">Paramètres</h3>
                <p className="text-sm text-gray-500">
                  Configurer les param&egrave;tres de l&apos;application.
                </p>
              </div>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
