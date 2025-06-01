import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '../../config/supabaseClient';
import { useAuth } from '../../hooks/useAuth';

// Importation directe des icônes
import { loanStatusMap, loanTypeLabels } from '../../utils/constants';
import {
  ClockIcon,
  CheckCircleIcon,
  ExclamationCircleIcon,
} from '@heroicons/react/24/outline';
import StatusBadge from '../../components/common/StatusBadge';

const statusIcons = Object.fromEntries(
  Object.entries(loanStatusMap).map(([k, v]) => [k, v.icon])
);
const statusLabels = Object.fromEntries(
  Object.entries(loanStatusMap).map(([k, v]) => [k, v.label])
);
const LoanDetails = () => {
  const { loanId } = useParams();
  const { user } = useAuth();

  const [loan, setLoan] = useState(null);
  const [documents, setDocuments] = useState([]);
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchLoanDetails = async () => {
      try {
        setLoading(true);

        // Récupérer les détails du prêt
        const { data: loanData, error: loanError } = await supabase
        .from('loan_requests')
          .select('*')
          .eq('id', loanId)
          .eq('user_id', user.id)
          .single();

        if (loanError) throw loanError;

        if (!loanData) {
          setError('Prêt non trouvé ou vous n&apos;avez pas les permissions nécessaires');
          return;
        }

        setLoan(loanData);

        // Récupérer les documents associés
        const { data: docsData, error: docsError } = await supabase
          .from('documents')
          .select('*')
          .eq('loan_id', loanId)
          .order('created_at', { ascending: false });

        if (docsError) throw docsError;

        setDocuments(docsData || []);

        // Récupérer l'historique des activités
        const { data: activityData, error: activityError } = await supabase
          .from('loan_activities')
          .select('*')
          .eq('loan_id', loanId)
          .order('created_at', { ascending: false });

        if (activityError) throw activityError;

        setActivities(activityData || []);

      } catch (error) {
        console.error('Erreur lors du chargement des détails du prêt:', error);
        setError('Impossible de charger les détails du prêt');
      } finally {
        setLoading(false);
      }
    };

    if (user && loanId) {
      fetchLoanDetails();
    }
  }, [loanId, user]);
  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-md bg-red-50 p-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <ExclamationCircleIcon className="h-5 w-5 text-red-400" aria-hidden="true" />
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-red-800">{error}</h3>
            <div className="mt-4">
              <div className="flex">
                <Link
                  to="/client"
                  className="rounded-md bg-red-50 px-2 py-1.5 text-sm font-medium text-red-800 hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-red-600 focus:ring-offset-2 focus:ring-offset-red-50"
                >
                  Retour au tableau de bord
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!loan) {
    return (
      <div className="rounded-md bg-yellow-50 p-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <ExclamationCircleIcon className="h-5 w-5 text-yellow-400" aria-hidden="true" />
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-yellow-800">Aucun prêt trouvé</h3>
            <div className="mt-4">
              <div className="flex">
                <Link
                  to="/client"
                  className="rounded-md bg-yellow-50 px-2 py-1.5 text-sm font-medium text-yellow-800 hover:bg-yellow-100 focus:outline-none focus:ring-2 focus:ring-yellow-600 focus:ring-offset-2 focus:ring-offset-yellow-50"
                >
                  Retour au tableau de bord
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
  // Formatage des données
  const StatusIcon = statusIcons[loan.status] || ClockIcon;
  const formattedAmount = new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'XOF' }).format(loan.amount);
  const formattedDate = new Date(loan.created_at).toLocaleDateString('fr-FR');
  const loanTypeLabel = loanTypeLabels[loan.loan_type] || loan.loan_type;

  return (
    <div className="py-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Détails du prêt</h1>
          <p className="mt-1 text-sm text-gray-500">
            Demande soumise le {formattedDate}
          </p>
        </div>
        <Link
          to="/client"
          className="inline-flex items-center rounded-md border border-gray-300 bg-white px-3 py-2 text-sm font-medium leading-4 text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
        >
          Retour
        </Link>
      </div>

      {/* Status banner */}
      <div className={`mt-6 rounded-md p-4 ${loan.status === 'approved' ? 'bg-green-50' : loan.status === 'rejected' ? 'bg-red-50' : 'bg-yellow-50'}`}>
        <div className="flex">
          <div className="flex-shrink-0">
            <StatusIcon
              className={`h-5 w-5 ${loan.status === 'approved' ? 'text-green-400' : loan.status === 'rejected' ? 'text-red-400' : 'text-yellow-400'}`}
              aria-hidden="true"
            />
          </div>
          <div className="ml-3">
            <h3 className={`text-sm font-medium ${loan.status === 'approved' ? 'text-green-800' : loan.status === 'rejected' ? 'text-red-800' : 'text-yellow-800'}`}>
              {loan.status === 'approved' && 'Demande approuvée'}
              {loan.status === 'rejected' && 'Demande refusée'}
              {loan.status === 'pending' && 'Demande en cours d&apos;examen'}
              {loan.status === 'completed' && 'Prêt complété'}
            </h3>
            <div className="mt-2 text-sm">
              <p className={`${loan.status === 'approved' ? 'text-green-700' : loan.status === 'rejected' ? 'text-red-700' : 'text-yellow-700'}`}>
                {loan.status === 'approved' && 'Votre demande de prêt a été approuvée. Un conseiller vous contactera prochainement pour finaliser la procédure.'}
                {loan.status === 'rejected' && (loan.rejection_reason || 'Votre demande de prêt a été refusée. Pour plus d&apos;informations, veuillez contacter notre service client.')}
                {loan.status === 'pending' && 'Votre demande est en cours d&apos;examen par notre équipe. Nous vous contacterons dès que possible.'}
                {loan.status === 'completed' && 'Le prêt a été entièrement remboursé. Nous vous remercions pour votre confiance.'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Loan details */}
      <div className="mt-6 bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="px-4 py-5 sm:px-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900">Informations sur le prêt</h3>
          <p className="mt-1 max-w-2xl text-sm text-gray-500">Détails de votre demande de prêt.</p>
        </div>
        <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
          <dl className="grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-2">
            <div className="sm:col-span-1">
              <dt className="text-sm font-medium text-gray-500">Type de prêt</dt>
              <dd className="mt-1 text-sm text-gray-900">{loanTypeLabel}</dd>
            </div>
            <div className="sm:col-span-1">
              <dt className="text-sm font-medium text-gray-500">Montant demandé</dt>
              <dd className="mt-1 text-sm text-gray-900">{formattedAmount}</dd>
            </div>
            <div className="sm:col-span-1">
              <dt className="text-sm font-medium text-gray-500">Durée (mois)</dt>
              <dd className="mt-1 text-sm text-gray-900">{loan.duration}</dd>
            </div>
            <div className="sm:col-span-1">
              <dt className="text-sm font-medium text-gray-500">Statut</dt>
              <dd className="mt-1 text-sm">
                <StatusBadge status={loan.status} />
              </dd>
            </div>
            <div className="sm:col-span-2">
              <dt className="text-sm font-medium text-gray-500">Objet du prêt</dt>
              <dd className="mt-1 text-sm text-gray-900">{loan.purpose}</dd>
            </div>
            {loan.approved_amount && (
              <div className="sm:col-span-1">
                <dt className="text-sm font-medium text-gray-500">Montant approuvé</dt>
                <dd className="mt-1 text-sm text-gray-900">
                  {new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'XOF' }).format(loan.approved_amount)}
                </dd>
              </div>
            )}
            {loan.interest_rate && (
              <div className="sm:col-span-1">
                <dt className="text-sm font-medium text-gray-500">Taux d&apos;intérêt</dt>
                <dd className="mt-1 text-sm text-gray-900">{loan.interest_rate}%</dd>
              </div>
            )}
            {loan.monthly_payment && (
              <div className="sm:col-span-1">
                <dt className="text-sm font-medium text-gray-500">Mensualité</dt>
                <dd className="mt-1 text-sm text-gray-900">
                  {new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'XOF' }).format(loan.monthly_payment)}
                </dd>
              </div>
            )}
          </dl>
        </div>
      </div>

      {/* Documents */}
      <div className="mt-8">
        <h2 className="text-lg font-medium text-gray-900">Documents associés</h2>
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
                    Date d&apos;ajout
                  </th>
                  <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                    <span className="sr-only">Voir</span>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {documents.map((document) => (
                  <tr key={document.id}>
                    <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900">
                      {document.file_name}
                    </td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                      {document.category}
                    </td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                      {new Date(document.uploaded_at).toLocaleDateString('fr-FR')}
                    </td>
                    <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                      <a
                        href={document.file_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary hover:text-primary-dark"
                      >
                        Voir
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="text-center py-6 bg-white">
              <p className="text-gray-500">Aucun document associé à ce prêt.</p>
            </div>
          )}
        </div>
      </div>

      {/* Activity history */}
      <div className="mt-8">
        <h2 className="text-lg font-medium text-gray-900">Historique</h2>
        <div className="mt-4 bg-white shadow overflow-hidden sm:rounded-lg">
          <ul className="divide-y divide-gray-200">
            {activities.length > 0 ? (
              activities.map((activity) => (
                <li key={activity.id} className="px-4 py-4 sm:px-6">
                  <div className="flex items-start">
                    <div className="flex-shrink-0">
                      {activity.type === 'status_change' && (
                        <div className={`h-8 w-8 rounded-full flex items-center justify-center ${
                          activity.new_value === 'approved' ? 'bg-green-100' :
                          activity.new_value === 'rejected' ? 'bg-red-100' : 'bg-blue-100'
                        }`}>
                          {activity.new_value === 'approved' && <CheckCircleIcon className="h-5 w-5 text-green-500" />}
                          {activity.new_value === 'rejected' && <ExclamationCircleIcon className="h-5 w-5 text-red-500" />}
                          {activity.new_value !== 'approved' && activity.new_value !== 'rejected' && <ClockIcon className="h-5 w-5 text-blue-500" />}
                        </div>
                      )}
                      {activity.type === 'comment' && (
                        <div className="h-8 w-8 rounded-full bg-gray-100 flex items-center justify-center">
                          <svg className="h-5 w-5 text-gray-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                          </svg>
                        </div>
                      )}
                      {activity.type === 'document_added' && (
                        <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
                          <svg className="h-5 w-5 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                          </svg>
                        </div>
                      )}
                    </div>
                    <div className="ml-3 flex-1">
                      <p className="text-sm text-gray-900">
                        {activity.type === 'status_change' && (
                          <>
                            Statut changé de <span className="font-medium">{statusLabels[activity.old_value] || activity.old_value}</span> à <span className="font-medium">{statusLabels[activity.new_value] || activity.new_value}</span>
                          </>
                        )}
                        {activity.type === 'comment' && activity.comment}
                        {activity.type === 'document_added' && <>Document ajouté: {activity.document_name || 'Sans nom'}</>}
                      </p>
                      <p className="mt-1 text-sm text-gray-500">
                        {new Date(activity.created_at).toLocaleString('fr-FR')}
                      </p>
                    </div>
                  </div>
                </li>
              ))
            ) : (
              <li className="px-4 py-6 sm:px-6 text-center">
                <p className="text-gray-500">Aucune activité enregistrée pour ce prêt.</p>
              </li>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default LoanDetails;
