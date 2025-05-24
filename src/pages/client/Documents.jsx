import { useState, useEffect } from 'react';
import { showSuccess, showError } from '../../utils/toast';
import { supabase } from '../../config/supabaseClient';
import { useAuth } from '../../hooks/useAuth';
import Loader from '../../components/common/Loader';
import EmptyState from '../../components/common/EmptyState';

const documentTypes = [
  { id: 'id', name: 'Pièce d\'identité' },
  { id: 'income', name: 'Justificatif de revenu' },
  { id: 'bank', name: 'Relevés bancaires' },
  { id: 'tax', name: 'Déclaration fiscale' },
  { id: 'other', name: 'Autre' },
];

const Documents = () => {
  const { user } = useAuth();
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  
  const [documentName, setDocumentName] = useState('');
  const [documentType, setDocumentType] = useState('');
  const [file, setFile] = useState(null);

  useEffect(() => {
    const fetchDocuments = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('documents')
          .select('*')
          .eq('user_id', user.id)
          .order('uploaded_at', { ascending: false });
        if (error) throw error;
        setDocuments(data || []);
      } catch (error) {
        console.error('Erreur lors du chargement des documents:', error);
        showError('Impossible de charger vos documents');
      } finally {
        setLoading(false);
      }
    };
    if (user) {
      fetchDocuments();
    }
  }, [user]);
  
  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    
    if (!documentName.trim()) {
      showError('Veuillez entrer un nom pour le document');
      return;
    }
    if (!documentType) {
      showError('Veuillez sélectionner un type de document');
      return;
    }
    if (!file) {
      showError('Veuillez sélectionner un fichier');
      return;
    }
    
    setUploading(true);
    
    try {
      // Générer un nom de fichier unique
      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}/${Date.now()}.${fileExt}`;
      const filePath = `documents/${fileName}`;
      // Télécharger le fichier
      const { error: uploadError } = await supabase.storage
        .from('documents')
        .upload(filePath, file);
      if (uploadError) throw uploadError;
      // Obtenir l'URL du fichier
      const { data } = await supabase.storage
        .from('documents')
        .getPublicUrl(filePath);
      const fileUrl = data.publicUrl;
      // Enregistrer le document dans la base de données
      const { error: insertError } = await supabase
        .from('documents')
        .insert([
          {
            user_id: user.id,
            file_name: documentName,
            file_type: file.type,
            file_size: file.size,
            file_url: fileUrl,
            file_path: filePath,
            category: documentType,
            uploaded_at: new Date()
          }
        ]);
      if (insertError) throw insertError;
      showSuccess('Document téléchargé avec succès');
      // Réinitialiser le formulaire
      setDocumentName('');
      setDocumentType('');
      setFile(null);
      // Recharger la liste des documents
      const { data: updatedDocs, error } = await supabase
        .from('documents')
        .select('*')
        .eq('user_id', user.id)
        .order('uploaded_at', { ascending: false });
      if (error) throw error;
      setDocuments(updatedDocs || []);
    } catch (error) {
      console.error('Erreur lors du téléchargement:', error);
      showError(`Erreur lors du téléchargement: ${error.message}`);
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id, storagePath) => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer ce document?')) {
      return;
    }
    try {
      // Supprimer le fichier du stockage
      if (storagePath) {
        await supabase.storage.from('documents').remove([storagePath]);
      }
      // Supprimer l'entrée de la base de données
      const { error } = await supabase
        .from('documents')
        .delete()
        .eq('id', id);
      if (error) throw error;
      // Mettre à jour la liste des documents
      setDocuments(documents.filter(doc => doc.id !== id));
      showSuccess('Document supprimé avec succès');
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
      showError(`Erreur lors de la suppression: ${error.message}`);
    }
  };

  return (
    <div className="py-6">
      <h1 className="text-2xl font-semibold text-gray-900">Mes documents</h1>
      <p className="mt-1 text-sm text-gray-500">
        Téléchargez et gérez vos documents importants.
      </p>

      <div className="mt-6 bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h2 className="text-lg leading-6 font-medium text-gray-900">Télécharger un document</h2>
          <form className="mt-5 space-y-6" onSubmit={handleUpload}>
            <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2">
              <div>
                <label htmlFor="documentName" className="block text-sm font-medium text-gray-700">
                  Nom du document *
                </label>
                <div className="mt-1">
                  <input
                    type="text"
                    name="documentName"
                    id="documentName"
                    value={documentName}
                    onChange={(e) => setDocumentName(e.target.value)}
                    required
                    className="shadow-sm focus:ring-primary focus:border-primary block w-full sm:text-sm border-gray-300 rounded-md"
                  />
                </div>
              </div>
              <div>
                <label htmlFor="documentType" className="block text-sm font-medium text-gray-700">
                  Type de document *
                </label>
                <div className="mt-1">
                  <select
                    id="documentType"
                    name="documentType"
                    value={documentType}
                    onChange={(e) => setDocumentType(e.target.value)}
                    required
                    className="shadow-sm focus:ring-primary focus:border-primary block w-full sm:text-sm border-gray-300 rounded-md"
                  >
                    <option value="">Sélectionner un type</option>
                    {documentTypes.map((type) => (
                      <option key={type.id} value={type.id}>
                        {type.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-gray-700">Fichier *</label>
                <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                  <div className="space-y-1 text-center">
                    <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true">
                      <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    <div className="flex text-sm text-gray-600">
                      <label htmlFor="file-upload" className="relative cursor-pointer bg-white rounded-md font-medium text-primary hover:text-primary-dark focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-primary">
                        <span>Télécharger un fichier</span>
                        <input id="file-upload" name="file-upload" type="file" className="sr-only" onChange={handleFileChange} />
                      </label>
                      <p className="pl-1">ou glisser-déposer</p>
                    </div>
                    <p className="text-xs text-gray-500">PNG, JPG, PDF jusqu'à 10MB</p>
                    {file && (
                      <p className="text-sm text-primary mt-2">
                        Fichier sélectionné: {file.name}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={uploading}
                className={`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary ${uploading ? 'opacity-70 cursor-not-allowed' : ''}`}
              >
                {uploading ? 'Téléchargement en cours...' : 'Télécharger'}
              </button>
            </div>
          </form>
        </div>
      </div>

      <div className="mt-8">
        <h2 className="text-lg font-medium text-gray-900">Documents téléchargés</h2>
        <div className="mt-4 overflow-hidden shadow ring-1 ring-black ring-opacity-5 sm:rounded-lg">
          {loading ? (
            <div className="text-center py-6 bg-white">
              <Loader size="small" />
              <p className="mt-2 text-sm text-gray-500">Chargement des documents...</p>
            </div>
          ) : documents.length > 0 ? (
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
                    <span className="sr-only">Actions</span>
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
                      {documentTypes.find(t => t.id === document.category)?.name || document.category}
                    </td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                      {new Date(document.uploaded_at).toLocaleDateString('fr-FR')}
                    </td>
                    <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                      <div className="flex justify-end space-x-3">
                        <a 
                          href={document.file_url} 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          className="text-primary hover:text-primary-dark"
                        >
                          Voir
                        </a>
                        <button
                          onClick={() => handleDelete(document.id, document.file_path)}
                          className="text-red-600 hover:text-red-900"
                          type="button"
                        >
                          Supprimer
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <EmptyState message="Vous n'avez encore aucun document." />
          )}
        </div>
      </div>
    </div>
  );
};

export default Documents;