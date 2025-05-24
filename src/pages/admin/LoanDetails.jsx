import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useLoans } from '../../hooks/useLoans';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Alert from '../../components/common/Alert';
import Loader from '../../components/common/Loader';
import Modal from '../../components/common/Modal';
import { formatCurrency, formatDate } from '../../utils/formatters';
import { loanStatusMap } from '../../utils/constants';
import StatusBadge from '../../components/common/StatusBadge';

const statusLabels = loanStatusMap;

const formatFileSize = (bytes) => {
  if (bytes < 1024) return bytes + ' octets';
  else if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' Ko';
  else return (bytes / 1048576).toFixed(1) + ' Mo';
};

const LoanDetails = () => {
  const { loanId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { getLoanById, updateLoanStatus, assignLoan, addNote, getLoanNotes, loading } = useLoans();
  const [loan, setLoan] = useState(null);
  const [documents, setDocuments] = useState([]);
  const [notes, setNotes] = useState([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [isNoteModalOpen, setIsNoteModalOpen] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState('');
  const [assignedTo, setAssignedTo] = useState('');
  const [noteText, setNoteText] = useState('');
  const [isSubmittingStatus, setIsSubmittingStatus] = useState(false);
  const [isSubmittingAssign, setIsSubmittingAssign] = useState(false);
  const [isSubmittingNote, setIsSubmittingNote] = useState(false);

  useEffect(() => {
    const fetchLoanData = async () => {
      if (user && loanId) {
        const { data, error } = await getLoanById(loanId);
        if (error) {
          setError(`Erreur lors du chargement des données: ${error}`);
          return;
        }
        
        if (data) {
          setLoan(data);
          if (data.documents) {
            setDocuments(data.documents);
          }
        }
        
        // Charger les notes
        const { data: notesData, error: notesError } = await getLoanNotes(loanId);
        if (notesError) {
          console.error('Erreur lors du chargement des notes:', notesError);
        } else if (notesData) {
          setNotes(notesData);
        }
      }
    };
    
    fetchLoanData();
  }, [loanId, user, getLoanById, getLoanNotes]);

  const handleStatusUpdate = async () => {
    try {
      setIsSubmittingStatus(true);
      setError('');
      
      const { data, error } = await updateLoanStatus(loanId, selectedStatus);
      
      if (error) {
        setError(`Erreur lors de la mise à jour du statut: ${error}`);
        return;
      }
      
      setLoan({ ...loan, status: selectedStatus });
      setSuccess(`Le statut de la demande a été mis à jour avec succès à "${statusLabels[selectedStatus].label}"`);
      setIsStatusModalOpen(false);
      
    } catch (err) {
      setError('Une erreur est survenue lors de la mise à jour du statut.');
      console.error('Erreur de mise à jour du statut:', err);
    } finally {
      setIsSubmittingStatus(false);
    }
  };

  const handleAssign = async () => {
    try {
      setIsSubmittingAssign(true);
      setError('');
      
      const { data, error } = await assignLoan(loanId, assignedTo || null);
      
      if (error) {
        setError(`Erreur lors de l'attribution: ${error}`);
        return;
      }
      
      // Rafraîchir les données
      const { data: refreshedData } = await getLoanById(loanId);
      if (refreshedData) {
        setLoan(refreshedData);
      }
      
      setSuccess('La demande a été attribuée avec succès');
      setIsAssignModalOpen(false);
      
    } catch (err) {
      setError('Une erreur est survenue lors de l\'attribution.');
      console.error('Erreur d\'attribution:', err);
    } finally {
      setIsSubmittingAssign(false);
    }
  };

  const handleAddNote = async () => {
    try {
      if (!noteText.trim()) {
        setError('Veuillez entrer une note');
        return;
      }
      
      setIsSubmittingNote(true);
      setError('');
      
      const { data, error } = await addNote(loanId, noteText, user.id);
      
      if (error) {
        setError(`Erreur lors de l'ajout de la note: ${error}`);
        return;
      }
      
      // Rafraîchir les notes
      const { data: notesData } = await getLoanNotes(loanId);
      if (notesData) {
        setNotes(notesData);
      }
      
      setSuccess('Note ajoutée avec succès');
      setIsNoteModalOpen(false);
      setNoteText('');
      
    } catch (err) {
      setError('Une erreur est survenue lors de l\'ajout de la note.');
      console.error('Erreur d\'ajout de note:', err);
    } finally {
      setIsSubmittingNote(false);
    }
  };

  if (loading && !loan) {
    return <Loader />;
  }

  if (!loan) {
    return (
      <div className="text-center py-8">
        <p>Aucune information disponible pour cette demande de prêt.</p>
        <Button 
          variant="primary"
          onClick={() => navigate('/admin/prets')}
          className="mt-4"
        >
          Retour à la liste
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">
          Demande de prêt #{loanId.toString().padStart(5, '0')}
        </h1>
        <Button
          variant="outline"
          onClick={() => navigate('/admin/prets')}
        >
          Retour
        </Button>
      </div>
      
      {error && (
        <Alert 
          type="error" 
          message={error} 
          dismissible={true}
          onClose={() => setError('')}
        />
      )}
      
      {success && (
        <Alert 
          type="success" 
          message={success} 
          dismissible={true}
          onClose={() => setSuccess('')}
        />
      )}
      
      {/* Actions */}
      <div className="flex flex-wrap gap-2">
        <Button 
          variant={loan.status === 'en_attente' ? 'primary' : 'outline'}
          onClick={() => {
            setSelectedStatus('en_cours');
            setIsStatusModalOpen(true);
          }}
          disabled={loan.status === 'approuve' || loan.status === 'rejete'}
        >
          Mettre en cours
        </Button>
        <Button 
          variant="outline"
          className="bg-green-50 text-green-700 border-green-300 hover:bg-green-100"
          onClick={() => {
            setSelectedStatus('approuve');
            setIsStatusModalOpen(true);
          }}
          disabled={loan.status === 'approuve' || loan.status === 'rejete'}
        >
          Approuver
        </Button>
        <Button 
          variant="outline"
          className="bg-red-50 text-red-700 border-red-300 hover:bg-red-100"
          onClick={() => {
            setSelectedStatus('rejete');
            setIsStatusModalOpen(true);
          }}
          disabled={loan.status === 'approuve' || loan.status === 'rejete'}
        >
          Rejeter
        </Button>
        <Button 
          variant="outline"
          onClick={() => {
            setAssignedTo(loan.assigned_to || '');
            setIsAssignModalOpen(true);
          }}
        >
          {loan.assigned_to ? 'Réassigner' : 'Assigner'}
        </Button>
        <Button 
          variant="outline"
          onClick={() => {
            setNoteText('');
            setIsNoteModalOpen(true);
          }}
        >
          Ajouter une note
        </Button>
      </div>
      
      {/* Informations de la demande */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card title="Informations de la demande">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <p className="text-sm font-medium text-gray-500">Montant</p>
                <p className="mt-1 text-lg font-semibold">{formatCurrency(loan.amount)}</p>
              </div>
              
              <div>
                <p className="text-sm font-medium text-gray-500">Statut</p>
                <p className="mt-1">
                  <StatusBadge status={loan.status} />
                </p>
              </div>
              
              <div>
                <p className="text-sm font-medium text-gray-500">Objet du prêt</p>
                <p className="mt-1">{loan.purpose}</p>
              </div>
              
              <div>
                <p className="text-sm font-medium text-gray-500">Date de soumission</p>
                <p className="mt-1">{formatDate(loan.created_at)}</p>
              </div>
              
              <div>
                <p className="text-sm font-medium text-gray-500">Durée</p>
                <p className="mt-1">{loan.duration_months} mois</p>
              </div>
              
              <div>
                <p className="text-sm font-medium text-gray-500">Revenus mensuels</p>
                <p className="mt-1">{formatCurrency(loan.monthly_income)}</p>
              </div>
            </div>
            
            <div className="mt-6">
              <p className="text-sm font-medium text-gray-500">Description</p>
              <p className="mt-1 whitespace-pre-wrap">{loan.description}</p>
            </div>
          </Card>
          
          {/* Documents */}
          <Card title="Documents">
            {documents && documents.length > 0 ? (
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
                        Taille
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
                          {doc.category === 'identite' && 'Pièce d\'identité'}
                          {doc.category === 'revenu' && 'Justificatif de revenu'}
                          {doc.category === 'domicile' && 'Justificatif de domicile'}
                          {doc.category === 'professionnel' && 'Document professionnel'}
                          {doc.category === 'autre' && 'Autre document'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {doc.file_type.toUpperCase()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {formatFileSize(doc.file_size)}
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
                <p className="text-gray-500">Aucun document téléversé pour cette demande.</p>
              </div>
            )}
          </Card>
          
          {/* Notes */}
          <Card 
            title="Notes" 
            headerAction={
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => {
                  setNoteText('');
                  setIsNoteModalOpen(true);
                }}
              >
                Ajouter
              </Button>
            }
          >
            {notes && notes.length > 0 ? (
              <div className="space-y-4">
                {notes.map((note) => (
                  <div key={note.id} className="p-4 bg-gray-50 rounded-lg">
                    <div className="flex justify-between items-start">
                      <div className="flex items-start">
                        <div className="mr-2">
                          <div className="h-8 w-8 flex items-center justify-center rounded-full bg-primary/20 text-primary">
                            {note.profiles.first_name.charAt(0)}{note.profiles.last_name.charAt(0)}
                          </div>
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">
                            {note.profiles.first_name} {note.profiles.last_name}
                            <span className="text-xs text-gray-500 ml-2">
                              {note.profiles.role === 'admin' ? '(Admin)' : '(Client)'}
                            </span>
                          </p>
                          <p className="text-sm text-gray-500">{formatDate(note.created_at)}</p>
                        </div>
                      </div>
                    </div>
                    <div className="mt-2 whitespace-pre-wrap">{note.note}</div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-4">
                <p className="text-gray-500">Aucune note pour cette demande.</p>
              </div>
            )}
          </Card>
        </div>
        
        {/* Informations Client */}
        <div className="space-y-6">
          <Card title="Informations du client">
            <div className="flex items-center mb-4">
              <div className="h-12 w-12 flex items-center justify-center rounded-full bg-primary/20 text-primary text-xl font-semibold">
                {loan.profiles.first_name.charAt(0)}{loan.profiles.last_name.charAt(0)}
              </div>
              <div className="ml-3">
                <p className="text-lg font-semibold text-gray-900">{loan.profiles.first_name} {loan.profiles.last_name}</p>
                <p className="text-sm text-gray-500">{loan.profiles.email}</p>
              </div>
            </div>
            
            <div className="space-y-4">
              <div>
                <p className="text-sm font-medium text-gray-500">Téléphone</p>
                <p className="mt-1">{loan.profiles.phone || 'Non renseigné'}</p>
              </div>
              
              <div>
                <p className="text-sm font-medium text-gray-500">Adresse</p>
                <p className="mt-1">{loan.profiles.address || 'Non renseignée'}</p>
              </div>
              
              <div className="pt-2">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => navigate(`/admin/clients/${loan.user_id}`)}
                  fullWidth
                >
                  Voir le profil complet
                </Button>
              </div>
            </div>
          </Card>
          
          <Card title="Assignation">
            {loan.assigned_to ? (
              <div>
                <div className="flex items-center mb-4">
                  <div className="h-10 w-10 flex items-center justify-center rounded-full bg-primary/20 text-primary">
                    {loan.assignee.first_name.charAt(0)}{loan.assignee.last_name.charAt(0)}
                  </div>
                  <div className="ml-3">
                    <p className="font-semibold text-gray-900">{loan.assignee.first_name} {loan.assignee.last_name}</p>
                    <p className="text-sm text-gray-500">{loan.assignee.email}</p>
                  </div>
                </div>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => {
                    setAssignedTo(loan.assigned_to);
                    setIsAssignModalOpen(true);
                  }}
                  fullWidth
                >
                  Modifier l'assignation
                </Button>
              </div>
            ) : (
              <div>
                <p className="text-center text-gray-500 mb-4">Cette demande n'est pas encore assignée</p>
                <Button 
                  variant="primary" 
                  size="sm"
                  onClick={() => {
                    setAssignedTo('');
                    setIsAssignModalOpen(true);
                  }}
                  fullWidth
                >
                  Assigner la demande
                </Button>
              </div>
            )}
          </Card>
          
          <Card title="Résumé">
            <div className="space-y-4">
              <div>
                <p className="text-sm font-medium text-gray-500">Status actuel</p>
                <p className="mt-1">
                  <StatusBadge status={loan.status} />
                </p>
              </div>
              
              <div>
                <p className="text-sm font-medium text-gray-500">Montant demandé</p>
                <p className="mt-1 font-semibold">{formatCurrency(loan.amount)}</p>
              </div>
              
              <div>
                <p className="text-sm font-medium text-gray-500">Durée</p>
                <p className="mt-1">{loan.duration_months} mois</p>
              </div>
              
              <div>
                <p className="text-sm font-medium text-gray-500">Documents</p>
                <p className="mt-1">{documents ? documents.length : 0} fichiers</p>
              </div>
            </div>
          </Card>
        </div>
      </div>
      
      {/* Modal de changement de statut */}
      <Modal
        isOpen={isStatusModalOpen}
        onClose={() => setIsStatusModalOpen(false)}
        title="Changer le statut de la demande"
        footer={(
          <>
            <Button
              variant="outline"
              onClick={() => setIsStatusModalOpen(false)}
            >
              Annuler
            </Button>
            <Button
              variant="primary"
              onClick={handleStatusUpdate}
              isLoading={isSubmittingStatus}
            >
              Confirmer
            </Button>
          </>
        )}
      >
        <p>Vous êtes sur le point de changer le statut de la demande à :</p>
        <p className="mt-2 font-medium">
          {selectedStatus === 'en_cours' && 'En cours'}
          {selectedStatus === 'approuve' && 'Approuvé'}
          {selectedStatus === 'rejete' && 'Rejeté'}
        </p>
        <p className="mt-4 text-sm text-gray-500">
          Cette action sera enregistrée et le client en sera informé.
        </p>
      </Modal>
      
      {/* Modal d'assignation */}
      <Modal
        isOpen={isAssignModalOpen}
        onClose={() => setIsAssignModalOpen(false)}
        title={loan.assigned_to ? "Réassigner la demande" : "Assigner la demande"}
        footer={(
          <>
            <Button
              variant="outline"
              onClick={() => setIsAssignModalOpen(false)}
            >
              Annuler
            </Button>
            <Button
              variant="primary"
              onClick={handleAssign}
              isLoading={isSubmittingAssign}
            >
              {loan.assigned_to ? "Réassigner" : "Assigner"}
            </Button>
          </>
        )}
      >
        <div>
          <label htmlFor="assignTo" className="block text-sm font-medium text-gray-700 mb-1">
            Assigner à
          </label>
          <select
            id="assignTo"
            className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm rounded-md"
            value={assignedTo || ''}
            onChange={(e) => setAssignedTo(e.target.value)}
          >
            <option value="">Sélectionnez un collaborateur</option>
            <option value="1">John Doe (Admin)</option>
            <option value="2">Jane Smith (Admin)</option>
            <option value="3">Robert Johnson (Agent)</option>
          </select>
        </div>
        <div className="flex items-center mt-4">
          <input
            id="remove-assignation"
            name="remove-assignation"
            type="checkbox"
            className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
            checked={assignedTo === ''}
            onChange={() => setAssignedTo(assignedTo ? '' : loan.assigned_to || '')}
          />
          <label htmlFor="remove-assignation" className="ml-2 block text-sm text-gray-900">
            Retirer l'assignation actuelle
          </label>
        </div>
      </Modal>
      
      {/* Modal d'ajout de note */}
      <Modal
        isOpen={isNoteModalOpen}
        onClose={() => setIsNoteModalOpen(false)}
        title="Ajouter une note"
        footer={(
          <>
            <Button
              variant="outline"
              onClick={() => setIsNoteModalOpen(false)}
            >
              Annuler
            </Button>
            <Button
              variant="primary"
              onClick={handleAddNote}
              isLoading={isSubmittingNote}
            >
              Ajouter
            </Button>
          </>
        )}
      >
        <div>
          <label htmlFor="note" className="block text-sm font-medium text-gray-700 mb-1">
            Note
          </label>
          <textarea
            id="note"
            rows="4"
            className="block w-full rounded-md border border-gray-300 focus:ring-primary focus:border-primary shadow-sm px-3 py-2"
            placeholder="Entrez votre note ici..."
            value={noteText}
            onChange={(e) => setNoteText(e.target.value)}
          ></textarea>
        </div>
      </Modal>
    </div>
  );
};

export default LoanDetails;
