import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../../config/supabaseClient';
import Card from '../../components/common/Card';
import Input from '../../components/common/Input';
import Loader from '../../components/common/Loader';

const formatDate = (dateString) => {
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  return new Date(dateString).toLocaleDateString('fr-FR', options);
};

const Clients = () => {
  const [clients, setClients] = useState([]);
  const [filteredClients, setFilteredClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchClients = async () => {
      try {
        setLoading(true);
        
        const { data, error } = await supabase
          .from('profiles')
          .select(`
            *,
            loan_requests:loan_requests(count)
          `)
          .eq('role', 'client')
          .order('created_at', { ascending: false });
        
        if (error) {
          throw error;
        }
        
        setClients(data || []);
        setFilteredClients(data || []);
        
      } catch (err) {
        console.error('Erreur lors du chargement des clients:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    
    fetchClients();
  }, []);
  
  useEffect(() => {
    if (searchTerm) {
      const filtered = clients.filter(client => 
        client.first_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        client.last_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        client.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        client.phone?.includes(searchTerm)
      );
      setFilteredClients(filtered);
    } else {
      setFilteredClients(clients);
    }
  }, [searchTerm, clients]);

  if (loading) {
    return <Loader />;
  }

  if (error) {
    return <div className="text-center text-red-500 py-8">{error}</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Clients</h1>
      </div>
      
      {/* Filtre */}
      <Card>
        <Input
          label="Rechercher un client"
          placeholder="Nom, email, téléphone..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </Card>
      
      {/* Liste des clients */}
      <Card title={`Clients (${filteredClients.length})`}>
        {filteredClients.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Nom
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Email
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Téléphone
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date d&apos;inscription
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Demandes
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredClients.map((client) => (
                  <tr key={client.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-10 w-10 flex-shrink-0 mr-3 flex items-center justify-center rounded-full bg-primary/10 text-primary">
                          {client.first_name?.charAt(0)}{client.last_name?.charAt(0)}
                        </div>
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {client.first_name} {client.last_name}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {client.email}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {client.phone || '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {client.created_at ? formatDate(client.created_at) : '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {client.loan_requests[0]?.count || 0}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <Link to={`/admin/clients/${client.id}`} className="text-primary hover:text-primary-dark">
                        Détails
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-6">
            <p className="text-gray-500">Aucun client trouvé.</p>
          </div>
        )}
      </Card>
    </div>
  );
};

export default Clients;