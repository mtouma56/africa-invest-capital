import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { supabase } from '../../config/supabaseClient';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Loader from '../../components/common/Loader';
import { formatCurrency, formatDate } from '../../utils/formatters';
import StatusBadge from '../../components/common/StatusBadge';

const ClientDetails = () => {
  const { clientId } = useParams();
  const navigate = useNavigate();
  const [client, setClient] = useState(null);
  const [loans, setLoans] = useState([]);
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchClientDetails = async () => {
      try {
        setLoading(true);
        
        // Charger les informations du client
        const { data: clientData, error: clientError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', clientId)
          .single();
        
        if (clientError) {
          throw clientError;
        }
        
        setClient(clientData);
        
        // Charger les prêts du client
        const { data: loansData, error: loansError } = await supabase
          .from('loan_requests')
          .select(`
            *,
            profiles:assigned_to (
              first_name,
              last_name,
              email
            )
          `)
          .eq('user_id', clientId)
          .order('created_at', { ascending: false });
        
        if (loansError) {
          throw loansError;
        }
        
        setLoans(loansData || []);
        
        // Charger les documents du client
        const { data: documentsData, error: documentsError } = await supabase
          .from('documents')
          .select('*')
          .eq('user_id', clientId)
          .order('uploaded_at', { ascending: false });
        
        if (documentsError) {
          throw documentsError;
        }
        
        setDocuments(documentsData || []);
        
      } catch (err) {
        console.error('Erreur lors du chargement des détails du client:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    
    fetchClientDetails();
  }, [clientId]);

  if (loading) {
    return <Loader />;
  }

  if (error || !client) {
    return (
      <div className="text-center py-8">
        <p className="text-red-500">Erreur lors du chargement des détails du client.</p>
        <Button 
          variant="primary"
          onClick={() => navigate('/admin/clients')}
          className="mt-4"
        >
          Retour à la liste des clients
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">
          Détails du client
        </h1>
        <Button
          variant="outline"
          onClick={() => navigate('/admin/clients')}
        >
          Retour
        </Button>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Demandes de prêt */}
          <Card 
            title="Demandes de prêts" 
            subtitle={`${loans.length} demandes au total`}
          >
            {loans.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        ID
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Montant
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Objet
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Date
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Statut
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {loans.map((loan) => (
                      <tr key={loan.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          #{loan.id.toString().padStart(5, '0')}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {formatCurrency(loan.amount)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 max-w-xs truncate">
                          {loan.purpose}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {formatDate(loan.created_at)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                        <StatusBadge status={loan.status} />
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <Link to={`/admin/prets/${loan.id}`} className="text-primary hover:text-primary-dark">
                            Détails
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-4">
                <p className="text-gray-500">Aucune demande de prêt pour ce client.</p>
              </div>
            )}
          </Card>
          
          {/* Documents */}
          <Card title="Documents" subtitle={`${documents.length} documents au total`}>
            {documents.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Nom du fichier
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Catégorie
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Type
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Date
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {documents.map((doc) => (
                      <tr key={doc.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {doc.file_name}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {doc.category === 'identite' && 'Pièce d’identité'}
                          {doc.category === 'revenu' && 'Justificatif de revenu'}
                          {doc.category === 'banque' && 'Relevés bancaires'}
                          {doc.category === 'domicile' && 'Justificatif de domicile'}
                          {doc.category === 'professionnel' && 'Document professionnel'}
                          {doc.category === 'autre' && 'Autre document'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {doc.file_type.toUpperCase()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {formatDate(doc.uploaded_at)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <a 
                            href={doc.file_url} 
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
              </div>
            ) : (
              <div className="text-center py-4">
                <p className="text-gray-500">Aucun document pour ce client.</p>
              </div>
            )}
          </Card>
        </div>
        
        {/* Infos client */}
        <div>
          <Card title="Informations du client">
            <div className="flex items-center mb-6">
              <div className="h-16 w-16 flex items-center justify-center rounded-full bg-primary/20 text-primary text-xl font-semibold">
                {client.first_name?.charAt(0)}{client.last_name?.charAt(0)}
              </div>
              <div className="ml-3">
                <p className="text-xl font-semibold text-gray-900">{client.first_name} {client.last_name}</p>
                <p className="text-gray-500">{client.email}</p>
              </div>
            </div>
            
            <div className="space-y-4">
              <div>
                <p className="text-sm font-medium text-gray-500">Téléphone</p>
                <p className="mt-1 font-medium">{client.phone || 'Non renseigné'}</p>
              </div>
              
              <div>
                <p className="text-sm font-medium text-gray-500">Adresse</p>
                <p className="mt-1">{client.address || 'Non renseignée'}</p>
              </div>
              
              <div>
                <p className="text-sm font-medium text-gray-500">Date d’inscription</p>
                <p className="mt-1">{formatDate(client.created_at)}</p>
              </div>
            </div>
          </Card>
          
          <div className="mt-6">
            <Card title="Résumé">
              <div className="space-y-4">
                <div>
                  <p className="text-sm font-medium text-gray-500">Nombre total de demandes</p>
                  <p className="mt-1 text-lg font-semibold">{loans.length}</p>
                </div>
                
                <div>
                  <p className="text-sm font-medium text-gray-500">Montant total demandé</p>
                  <p className="mt-1 font-semibold">
                    {formatCurrency(loans.reduce((sum, loan) => sum + loan.amount, 0))}
                  </p>
                </div>
                
                <div>
                  <p className="text-sm font-medium text-gray-500">Demandes par statut</p>
                  <div className="mt-1 flex gap-2 flex-wrap">
                    <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
                      En attente: {loans.filter(loan => loan.status === 'en_attente').length}
                    </span>
                    <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                      En cours: {loans.filter(loan => loan.status === 'en_cours').length}
                    </span>
                    <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                      Approuvé: {loans.filter(loan => loan.status === 'approuve').length}
                    </span>
                    <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
                      Rejeté: {loans.filter(loan => loan.status === 'rejete').length}
                    </span>
                  </div>
                </div>
                
                <div>
                  <p className="text-sm font-medium text-gray-500">Documents téléversés</p>
                  <p className="mt-1">{documents.length} documents</p>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClientDetails;
