import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { supabase } from '../../config/supabaseClient';
import Loader from '../../components/common/Loader';
import EmptyState from '../../components/common/EmptyState';

// Importation directe des icônes
import DocumentTextIcon from '@heroicons/react/24/outline/DocumentTextIcon';
import CurrencyDollarIcon from '@heroicons/react/24/outline/CurrencyDollarIcon';
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

const Dashboard = () => {
  const { user } = useAuth();
  const [loans, setLoans] = useState([]);
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);

      try {
        // Récupération des prêts
        const { data: loansData, error: loansError } = await supabase
        .from('loan_requests')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });

        if (loansError) throw loansError;

        // Récupération des documents
        const { data: documentsData, error: documentsError } = await supabase
          .from('documents')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });

        if (documentsError) throw documentsError;

        setLoans(loansData || []);
        setDocuments(documentsData || []);
      } catch (error) {
        console.error('Erreur lors de la récupération des données:', error);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchData();
    }
  }, [user]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader />
      </div>
    );
  }

  return (
    <div className="py-6">
      <h1 className="text-2xl font-semibold text-gray-900">Tableau de bord</h1>
      <p className="mt-1 text-sm text-gray-500">
        Bienvenue, {user?.profile?.first_name || user?.email}! Voici un aperçu de votre compte.
      </p>

      {/* Quick Actions */}
      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Link
          to="/client/demande-pret"
          className="bg-white overflow-hidden shadow rounded-lg hover:shadow-md transition-shadow duration-300"
        >
          <div className="px-4 py-5 sm:p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-primary rounded-md p-3">
                <CurrencyDollarIcon className="h-6 w-6 text-white" />
              </div>
              <div className="ml-5">
                <h3 className="text-lg leading-6 font-medium text-gray-900">Demander un prêt</h3>
                <p className="mt-1 text-sm text-gray-500">
                  Soumettez une nouvelle demande de prêt en quelques clics.
                </p>
              </div>
            </div>
          </div>
        </Link>

        <Link
          to="/client/documents"
          className="bg-white overflow-hidden shadow rounded-lg hover:shadow-md transition-shadow duration-300"
        >
          <div className="px-4 py-5 sm:p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-primary rounded-md p-3">
                <DocumentTextIcon className="h-6 w-6 text-white" />
              </div>
              <div className="ml-5">
                <h3 className="text-lg leading-6 font-medium text-gray-900">Gérer mes documents</h3>
                <p className="mt-1 text-sm text-gray-500">
                  Téléchargez et gérez vos documents importants.
                </p>
              </div>
            </div>
          </div>
        </Link>
      </div>

      {/* Recent Loans */}
      <div className="mt-8">
        <h2 className="text-lg font-medium text-gray-900">Demandes de prêts récentes</h2>
        <div className="mt-4 overflow-hidden shadow ring-1 ring-black ring-opacity-5 sm:rounded-lg">
          {loans.length > 0 ? (
            <table className="min-w-full divide-y divide-gray-300">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900">
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
                    <span className="sr-only">Détails</span>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {loans.slice(0, 5).map((loan) => {
                  const StatusIcon = statusIcons[loan.status] || ClockIcon;
                  
                  return (
                    <tr key={loan.id}>
                      <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900">
                        {loan.loan_type}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        {new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'XOF' }).format(loan.amount)}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        {new Date(loan.created_at).toLocaleDateString('fr-FR')}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusColors[loan.status] || 'bg-gray-100 text-gray-800'}`}>
                          <StatusIcon className="mr-1.5 h-4 w-4" />
                          {loan.status === 'pending' && 'En attente'}
                          {loan.status === 'approved' && 'Approuvé'}
                          {loan.status === 'rejected' && 'Refusé'}
                          {loan.status === 'completed' && 'Complété'}
                        </span>
                      </td>
                      <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                        <Link to={`/client/prets/${loan.id}`} className="text-primary hover:text-primary-dark">
                          Détails
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          ) : (
            <EmptyState
              message="Vous n'avez encore aucune demande de prêt."
              action={
                <Link to="/client/demande-pret" className="mt-2 inline-flex text-primary hover:text-primary-dark">
                  Faire votre première demande
                </Link>
              }
            />
          )}
        </div>
        {loans.length > 5 && (
          <div className="mt-4 text-right">
            <Link to="/client/prets" className="text-sm font-medium text-primary hover:text-primary-dark">
              Voir tous les prêts <span aria-hidden="true">&rarr;</span>
            </Link>
          </div>
        )}
      </div>

      {/* Recent Documents */}
      <div className="mt-8">
        <h2 className="text-lg font-medium text-gray-900">Documents récents</h2>
        <div className="mt-4 overflow-hidden shadow ring-1 ring-black ring-opacity-5 sm:rounded-lg">
          {documents.length > 0 ? (
            <table className="min-w-full divide-y divide-gray-300">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900">
                    Nom
                  </th>
                  <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                    Type
                  </th>
                  <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                    Date d'ajout
                  </th>
                  <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                    <span className="sr-only">Télécharger</span>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {documents.slice(0, 5).map((document) => (
                  <tr key={document.id}>
                    <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900">
                      {document.name}
                    </td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                      {document.type}
                    </td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                      {new Date(document.created_at).toLocaleDateString('fr-FR')}
                    </td>
                    <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                      <a 
                        href={document.file_url} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="text-primary hover:text-primary-dark"
                      >
                        Télécharger
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <EmptyState
              message="Vous n'avez encore aucun document."
              action={
                <Link to="/client/documents" className="mt-2 inline-flex text-primary hover:text-primary-dark">
                  Ajouter vos documents
                </Link>
              }
            />
          )}
        </div>
        {documents.length > 5 && (
          <div className="mt-4 text-right">
            <Link to="/client/documents" className="text-sm font-medium text-primary hover:text-primary-dark">
              Voir tous les documents <span aria-hidden="true">&rarr;</span>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
