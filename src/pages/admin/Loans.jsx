import { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { supabase } from '../../config/supabaseClient';
import { useAuth } from '../../hooks/useAuth';
import { toast } from 'react-hot-toast';

// Importation directe des icônes
import ClockIcon from '@heroicons/react/24/outline/ClockIcon';
import CheckCircleIcon from '@heroicons/react/24/outline/CheckCircleIcon'; 
import ExclamationCircleIcon from '@heroicons/react/24/outline/ExclamationCircleIcon';
import FunnelIcon from '@heroicons/react/24/outline/FunnelIcon';
import ChevronDownIcon from '@heroicons/react/24/outline/ChevronDownIcon';

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

const loanTypes = {
  business: 'Prêt entreprise',
  mortgage: 'Prêt immobilier',
  personal: 'Prêt personnel',
  education: 'Prêt éducation',
  auto: 'Prêt automobile',
};

const statusLabels = {
  pending: 'En attente',
  approved: 'Approuvé',
  rejected: 'Refusé',
  completed: 'Complété',
};

const AdminLoans = () => {
  const { user } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  
  const [loans, setLoans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalCount, setTotalCount] = useState(0);
  
  // Filtres et pagination
  const [statusFilter, setStatusFilter] = useState(searchParams.get('status') || '');
  const [typeFilter, setTypeFilter] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  
  // États pour les actions en cours
  const [processingLoanId, setProcessingLoanId] = useState(null);
  const [showFilters, setShowFilters] = useState(false);
  
  useEffect(() => {
    const fetchLoans = async () => {
      try {
        setLoading(true);
        
        // Construire la requête de base
        let query = supabase
        .from('loan_requests')
          .select(`
            *,
            profiles:user_id (
              email,
              first_name,
              last_name
            )
          `, { count: 'exact' });
        
        // Appliquer les filtres
        if (statusFilter) {
          query = query.eq('status', statusFilter);
        }
        
        if (typeFilter) {
          query = query.eq('loan_type', typeFilter);
        }
        
        if (searchQuery) {
          query = query.or(`profiles.first_name.ilike.%${searchQuery}%,profiles.last_name.ilike.%${searchQuery}%,profiles.email.ilike.%${searchQuery}%`);
        }
        
        // Appliquer la pagination
        const from = (currentPage - 1) * itemsPerPage;
        const to = from + itemsPerPage - 1;
        
        // Exécuter la requête
        const { data, count, error } = await query
          .order('created_at', { ascending: false })
          .range(from, to);
        
        if (error) throw error;
        
        setLoans(data || []);
        setTotalCount(count || 0);
        
      } catch (error) {
        console.error('Erreur lors du chargement des prêts:', error);
        toast.error('Impossible de charger la liste des prêts');
      } finally {
        setLoading(false);
      }
    };
    
    if (user) {
      fetchLoans();
    }
  }, [user, statusFilter, typeFilter, searchQuery, currentPage]);
  
  const handleStatusChange = (id, newStatus) => {
    setProcessingLoanId(id);
    
    supabase
    .from('loan_requests')
      .update({ status: newStatus })
      .eq('id', id)
      .then(({ error }) => {
        if (error) {
          toast.error(`Erreur: ${error.message}`);
        } else {
          // Mise à jour du statut dans l'état local
          setLoans(loans.map(loan => 
            loan.id === id ? { ...loan, status: newStatus } : loan
          ));
          
          // Enregistrer l'activité
          supabase
            .from('loan_activities')
            .insert([
              {
                loan_id: id,
                type: 'status_change',
                old_value: loans.find(loan => loan.id === id)?.status || '',
                new_value: newStatus,
                created_by: user.id,
                created_at: new Date()
              }
            ])
            .then(({ error: activityError }) => {
              if (activityError) {
                console.error('Erreur lors de l\'enregistrement de l\'activité:', activityError);
              }
            });
          
          toast.success(`Statut mis à jour avec succès: ${statusLabels[newStatus] || newStatus}`);
        }
      })
      .finally(() => {
        setProcessingLoanId(null);
      });
  };
  
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };
  
  const applyFilters = () => {
    // Mettre à jour les paramètres d'URL
    const params = new URLSearchParams();
    if (statusFilter) params.set('status', statusFilter);
    setSearchParams(params);
    
    // Réinitialiser la pagination
    setCurrentPage(1);
  };
  
  const resetFilters = () => {
    setStatusFilter('');
    setTypeFilter('');
    setSearchQuery('');
    setSearchParams({});
    setCurrentPage(1);
  };
  
  return (
    <div className="py-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Gestion des demandes de prêts</h1>
          <p className="mt-1 text-sm text-gray-500">
            {totalCount} demande{totalCount !== 1 ? 's' : ''} au total
          </p>
        </div>
        <button
          type="button"
          onClick={() => setShowFilters(!showFilters)}
          className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
        >
          <FunnelIcon className="-ml-0.5 mr-2 h-4 w-4" aria-hidden="true" />
          Filtres
          <ChevronDownIcon className="ml-1 h-4 w-4" aria-hidden="true" />
        </button>
      </div>

      {/* Filtres */}
      {showFilters && (
        <div className="mt-4 bg-white p-4 shadow sm:rounded-lg">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Filtre par statut */}
            <div>
              <label htmlFor="statusFilter" className="block text-sm font-medium text-gray-700">
                Statut
              </label>
              <select
                id="statusFilter"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm rounded-md"
              >
                <option value="">Tous les statuts</option>
                <option value="pending">En attente</option>
                <option value="approved">Approuvé</option>
                <option value="rejected">Refusé</option>
                <option value="completed">Complété</option>
              </select>
            </div>
            
            {/* Filtre par type */}
            <div>
              <label htmlFor="typeFilter" className="block text-sm font-medium text-gray-700">
                Type de prêt
              </label>
              <select
                id="typeFilter"
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm rounded-md"
              >
                <option value="">Tous les types</option>
                <option value="business">Prêt entreprise</option>
                <option value="mortgage">Prêt immobilier</option>
                <option value="personal">Prêt personnel</option>
                <option value="education">Prêt éducation</option>
                <option value="auto">Prêt automobile</option>
              </select>
            </div>
            
            {/* Recherche */}
            <div>
              <label htmlFor="searchQuery" className="block text-sm font-medium text-gray-700">
                Recherche
              </label>
              <input
                type="text"
                id="searchQuery"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Nom du client, email..."
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm rounded-md"
              />
            </div>
          </div>
          
          <div className="mt-4 flex justify-end space-x-3">
            <button
              type="button"
              onClick={resetFilters}
              className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
            >
              Réinitialiser
            </button>
            <button
              type="button"
              onClick={applyFilters}
              className="inline-flex items-center px-3 py-2 border border-transparent shadow-sm text-sm leading-4 font-medium rounded-md text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
            >
              Appliquer
            </button>
          </div>
        </div>
      )}

      {/* Table */}
      <div className="mt-6 overflow-hidden shadow ring-1 ring-black ring-opacity-5 sm:rounded-lg">
        {loading ? (
          <div className="text-center py-12 bg-white">
            <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-primary mx-auto"></div>
            <p className="mt-3 text-sm text-gray-500">Chargement des demandes...</p>
          </div>
        ) : loans.length > 0 ? (
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
                  Date de demande
                </th>
                <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                  Statut
                </th>
                <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                  <span className="sr-only">Actions</span>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {loans.map((loan) => {
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
                      {loanTypes[loan.loan_type] || loan.loan_type}
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
                        {statusLabels[loan.status] || loan.status}
                      </span>
                    </td>
                    <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                      <div className="flex items-center justify-end space-x-3">
                        <Link to={`/admin/prets/${loan.id}`} className="text-primary hover:text-primary-dark">
                          Détails
                        </Link>
                        
                        {loan.status === 'pending' && (
                          <>
                            <button
                              type="button"
                              onClick={() => handleStatusChange(loan.id, 'approved')}
                              disabled={processingLoanId === loan.id}
                              className={`text-green-600 hover:text-green-900 ${processingLoanId === loan.id ? 'opacity-50 cursor-not-allowed' : ''}`}
                            >
                              Approuver
                            </button>
                            <button
                              type="button"
                              onClick={() => handleStatusChange(loan.id, 'rejected')}
                              disabled={processingLoanId === loan.id}
                              className={`text-red-600 hover:text-red-900 ${processingLoanId === loan.id ? 'opacity-50 cursor-not-allowed' : ''}`}
                            >
                              Refuser
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        ) : (
          <div className="text-center py-12 bg-white">
            <ExclamationCircleIcon className="h-10 w-10 text-gray-400 mx-auto" />
            <p className="mt-2 text-sm text-gray-500">Aucune demande de prêt trouvée.</p>
            {(statusFilter || typeFilter || searchQuery) && (
              <button
                onClick={resetFilters}
                className="mt-4 text-primary hover:text-primary-dark text-sm font-medium"
              >
                Réinitialiser les filtres
              </button>
            )}
          </div>
        )}
      </div>

      {/* Pagination */}
      {loans.length > 0 && totalCount > itemsPerPage && (
        <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6 mt-4">
          <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-gray-700">
                Affichage de <span className="font-medium">{(currentPage - 1) * itemsPerPage + 1}</span> à{' '}
                <span className="font-medium">
                  {Math.min(currentPage * itemsPerPage, totalCount)}
                </span>{' '}
                sur <span className="font-medium">{totalCount}</span> résultats
              </p>
            </div>
            <div>
              <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className={`relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 ${
                    currentPage === 1 ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                >
                  <span className="sr-only">Précédent</span>
                  <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </button>
                
                {Array.from({ length: Math.ceil(totalCount / itemsPerPage) }, (_, i) => i + 1)
                  .filter(page => {
                    // Afficher la première page, la dernière page, la page courante et les pages adjacentes
                    return (
                      page === 1 ||
                      page === Math.ceil(totalCount / itemsPerPage) ||
                      Math.abs(page - currentPage) <= 1
                    );
                  })
                  .map((page, index, array) => {
                    // Ajouter des ellipses si nécessaire
                    if (index > 0 && array[index - 1] !== page - 1) {
                      return (
                        <span key={`ellipsis-${page}`} className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700">
                          ...
                        </span>
                      );
                    }
                    
                    return (
                      <button
                        key={page}
                        onClick={() => handlePageChange(page)}
                        className={`relative inline-flex items-center px-4 py-2 border ${
                          currentPage === page
                            ? 'bg-primary text-white border-primary z-10'
                            : 'bg-white text-gray-500 hover:bg-gray-50 border-gray-300'
                        } text-sm font-medium`}
                      >
                        {page}
                      </button>
                    );
                  })}
                
                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage >= Math.ceil(totalCount / itemsPerPage)}
                  className={`relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 ${
                    currentPage >= Math.ceil(totalCount / itemsPerPage) ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                >
                  <span className="sr-only">Suivant</span>
                  <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                  </svg>
                </button>
              </nav>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminLoans;
