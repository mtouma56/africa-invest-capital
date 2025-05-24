import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { showSuccess, showError } from '../../utils/toast';
import { supabase } from '../../config/supabaseClient';
import { useAuth } from '../../hooks/useAuth';
import { loanTypeLabels } from '../../utils/constants';

const loanTypes = Object.entries(loanTypeLabels).map(([id, name]) => ({ id, name }));

const NewLoanRequest = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [loanType, setLoanType] = useState('');
  const [amount, setAmount] = useState('');
  const [duration, setDuration] = useState('');
  const [purpose, setPurpose] = useState('');
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);
  
  // État pour le téléchargement de fichiers
  const [idDocument, setIdDocument] = useState(null);
  const [proofOfIncome, setProofOfIncome] = useState(null);
  const [bankStatements, setBankStatements] = useState(null);
  
  // État pour suivre les téléchargements en cours
  const [uploading, setUploading] = useState({
    id: false,
    income: false,
    bank: false,
  });
  
  const handleFileUpload = async (event, type) => {
    const file = event.target.files[0];
    if (!file) return;
    
    // Mettre à jour l'état d'upload correspondant
    setUploading(prev => ({ ...prev, [type]: true }));
    
    try {
      // Générer un nom de fichier unique
      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}/${Date.now()}.${fileExt}`;
      const filePath = `documents/${fileName}`;
      
      // Télécharger le fichier dans le bucket "documents"
      const { error: uploadError } = await supabase.storage
        .from('uploads')
        .upload(filePath, file);
      
      if (uploadError) throw uploadError;
      
      // Obtenir l'URL du fichier
      const { data } = await supabase.storage
        .from('uploads')
        .getPublicUrl(filePath);
      
      const fileUrl = data.publicUrl;
      
      // Mettre à jour l'état correspondant
      switch (type) {
        case 'id':
          setIdDocument({
            file_name: file.name,
            file_type: file.type,
            file_size: file.size,
            file_url: fileUrl,
            file_path: filePath,
          });
          break;
        case 'income':
          setProofOfIncome({
            file_name: file.name,
            file_type: file.type,
            file_size: file.size,
            file_url: fileUrl,
            file_path: filePath,
          });
          break;
        case 'bank':
          setBankStatements({
            file_name: file.name,
            file_type: file.type,
            file_size: file.size,
            file_url: fileUrl,
            file_path: filePath,
          });
          break;
        default:
          break;
      }
      
      showSuccess(`${file.name} téléchargé avec succès`);
    } catch (error) {
      showError(`Erreur lors du téléchargement: ${error.message}`);
      console.error('Erreur de téléchargement:', error);
    } finally {
      // Réinitialiser l'état d'upload
      setUploading(prev => ({ ...prev, [type]: false }));
    }
  };
  
  const validateStep1 = () => {
    if (!loanType) {
      showError('Veuillez sélectionner un type de prêt');
      return false;
    }
    if (!amount || isNaN(amount) || amount <= 0) {
      showError('Veuillez entrer un montant valide');
      return false;
    }
    if (!duration || isNaN(duration) || duration <= 0) {
      showError('Veuillez entrer une durée valide');
      return false;
    }
    if (!purpose.trim()) {
      showError('Veuillez décrire l\'objet du prêt');
      return false;
    }
    return true;
  };
  
  const validateStep2 = () => {
    if (!idDocument) {
      showError('Veuillez télécharger une pièce d\'identité');
      return false;
    }
    if (!proofOfIncome) {
      showError('Veuillez télécharger un justificatif de revenu');
      return false;
    }
    if (!bankStatements) {
      showError('Veuillez télécharger vos relevés bancaires');
      return false;
    }
    return true;
  };
  
  const handleNextStep = () => {
    if (step === 1 && validateStep1()) {
      setStep(2);
    }
  };
  
  const handlePreviousStep = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateStep2()) return;
    
    setLoading(true);
    
    try {
      // Enregistrer la demande de prêt
      const { data, error } = await supabase
      .from('loan_requests')
        .insert([
          {
            user_id: user.id,
            loan_type: loanType,
            amount: parseFloat(amount),
            duration_months: parseInt(duration),
            purpose,
            status: 'pending',
            id_document_url: idDocument?.file_url,
            income_proof_url: proofOfIncome?.file_url,
            bank_statements_url: bankStatements?.file_url,
            created_at: new Date()
          }
        ])
        .select();
      
      if (error) throw error;
      
      // Créer des entrées dans la table documents pour chaque document
      const documents = [
        {
          user_id: user.id,
          loan_id: data[0].id,
          file_name: idDocument.file_name,
          file_type: idDocument.file_type,
          file_size: idDocument.file_size,
          file_url: idDocument.file_url,
          file_path: idDocument.file_path,
          category: 'identite',
          uploaded_at: new Date()
        },
        {
          user_id: user.id,
          loan_id: data[0].id,
          file_name: proofOfIncome.file_name,
          file_type: proofOfIncome.file_type,
          file_size: proofOfIncome.file_size,
          file_url: proofOfIncome.file_url,
          file_path: proofOfIncome.file_path,
          category: 'revenu',
          uploaded_at: new Date()
        },
        {
          user_id: user.id,
          loan_id: data[0].id,
          file_name: bankStatements.file_name,
          file_type: bankStatements.file_type,
          file_size: bankStatements.file_size,
          file_url: bankStatements.file_url,
          file_path: bankStatements.file_path,
          category: 'revenu',
          uploaded_at: new Date()
        }
      ];
      
      const { error: docsError } = await supabase
        .from('documents')
        .insert(documents);
      
      if (docsError) throw docsError;
      
      showSuccess('Demande de prêt soumise avec succès');
      navigate('/client');
      
        } catch (error) {
      showError(`Erreur lors de la soumission: ${error.message}`);
      console.error('Erreur de soumission:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="py-6">
      <h1 className="text-2xl font-semibold text-gray-900">Demande de prêt</h1>
      <p className="mt-1 text-sm text-gray-500">
        Remplissez le formulaire ci-dessous pour soumettre votre demande de prêt.
      </p>

      {/* Step indicator */}
      <div className="mt-8">
        <div className="relative">
          <div className="absolute inset-0 flex items-center" aria-hidden="true">
            <div className="w-full border-t border-gray-300" />
          </div>
          <div className="relative flex justify-between">
            <div className="flex items-center">
              <span
                className={`relative flex h-8 w-8 items-center justify-center rounded-full ${
                  step >= 1 ? 'bg-primary text-white' : 'bg-white border-2 border-primary text-primary'
                }`}
              >
                1
              </span>
              <span className="ml-2 text-sm font-medium text-gray-900">Informations de prêt</span>
            </div>
            <div className="flex items-center">
              <span
                className={`relative flex h-8 w-8 items-center justify-center rounded-full ${
                  step >= 2 ? 'bg-primary text-white' : 'bg-white border-2 border-gray-300 text-gray-500'
                }`}
              >
                2
              </span>
              <span className={`ml-2 text-sm font-medium ${step >= 2 ? 'text-gray-900' : 'text-gray-500'}`}>
                Documents requis
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Form steps */}
      <div className="mt-8 bg-white shadow overflow-hidden sm:rounded-md">
        <div className="px-4 py-5 sm:p-6">
          {step === 1 && (
            <div>
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div>
                  <label htmlFor="loanType" className="block text-sm font-medium text-gray-700">
                    Type de prêt *
                  </label>
                  <select
                    id="loanType"
                    name="loanType"
                    value={loanType}
                    onChange={(e) => setLoanType(e.target.value)}
                    className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm rounded-md"
                  >
                    <option value="">Sélectionnez un type de prêt</option>
                    {loanTypes.map((type) => (
                      <option key={type.id} value={type.id}>
                        {type.name}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label htmlFor="amount" className="block text-sm font-medium text-gray-700">
                    Montant (FCFA) *
                  </label>
                  <div className="mt-1">
                    <input
                      type="number"
                      name="amount"
                      id="amount"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      className="shadow-sm focus:ring-primary focus:border-primary block w-full sm:text-sm border-gray-300 rounded-md"
                      placeholder="Ex: 5000000"
                    />
                  </div>
                </div>
                
                <div>
                  <label htmlFor="duration" className="block text-sm font-medium text-gray-700">
                    Durée (mois) *
                  </label>
                  <div className="mt-1">
                    <input
                      type="number"
                      name="duration"
                      id="duration"
                      value={duration}
                      onChange={(e) => setDuration(e.target.value)}
                      className="shadow-sm focus:ring-primary focus:border-primary block w-full sm:text-sm border-gray-300 rounded-md"
                      placeholder="Ex: 36"
                    />
                  </div>
                </div>
                
                <div className="sm:col-span-2">
                  <label htmlFor="purpose" className="block text-sm font-medium text-gray-700">
                    Objet du prêt *
                  </label>
                  <div className="mt-1">
                    <textarea
                      id="purpose"
                      name="purpose"
                      rows={4}
                      value={purpose}
                      onChange={(e) => setPurpose(e.target.value)}
                      className="shadow-sm focus:ring-primary focus:border-primary block w-full sm:text-sm border border-gray-300 rounded-md"
                      placeholder="Décrivez l'objet de votre demande de prêt..."
                    />
                  </div>
                </div>
              </div>
              
              <div className="mt-5 flex justify-end">
                <button
                  type="button"
                  onClick={handleNextStep}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                >
                  Suivant
                </button>
              </div>
            </div>
          )}

          {step === 2 && (
            <form onSubmit={handleSubmit}>
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg leading-6 font-medium text-gray-900">Documents requis</h3>
                  <p className="mt-1 text-sm text-gray-500">
                    Veuillez télécharger les documents suivants pour compléter votre demande de prêt.
                  </p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700">Pièce d'identité *</label>
                  <div className="mt-1 flex items-center">
                    <div className="flex-grow">
                      {idDocument ? (
                        <div className="flex items-center text-sm text-gray-500">
                          <svg className="flex-shrink-0 mr-1.5 h-5 w-5 text-green-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                          <span>{idDocument.file_name}</span>
                        </div>
                      ) : (
                        <div className="max-w-lg flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                          <div className="space-y-1 text-center">
                            <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true">
                              <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                            <div className="flex text-sm text-gray-600">
                              <label htmlFor="id-upload" className="relative cursor-pointer bg-white rounded-md font-medium text-primary hover:text-primary-dark focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-primary">
                                <span>Télécharger un fichier</span>
                                <input id="id-upload" name="id-upload" type="file" className="sr-only" onChange={(e) => handleFileUpload(e, 'id')} disabled={uploading.id} />
                              </label>
                              <p className="pl-1">ou glisser-déposer</p>
                            </div>
                            <p className="text-xs text-gray-500">PNG, JPG, PDF jusqu'à 10MB</p>
                          </div>
                        </div>
                      )}
                    </div>
                    {idDocument && (
                      <button
                        type="button"
                        onClick={() => setIdDocument(null)}
                        className="ml-2 bg-white py-2 px-3 border border-gray-300 rounded-md shadow-sm text-sm leading-4 font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                      >
                        Changer
                      </button>
                    )}
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700">Justificatif de revenu *</label>
                  <div className="mt-1 flex items-center">
                    <div className="flex-grow">
                      {proofOfIncome ? (
                        <div className="flex items-center text-sm text-gray-500">
                          <svg className="flex-shrink-0 mr-1.5 h-5 w-5 text-green-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                          <span>{proofOfIncome.file_name}</span>
                        </div>
                      ) : (
                        <div className="max-w-lg flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                          <div className="space-y-1 text-center">
                            <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true">
                              <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                            <div className="flex text-sm text-gray-600">
                              <label htmlFor="income-upload" className="relative cursor-pointer bg-white rounded-md font-medium text-primary hover:text-primary-dark focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-primary">
                                <span>Télécharger un fichier</span>
                                <input id="income-upload" name="income-upload" type="file" className="sr-only" onChange={(e) => handleFileUpload(e, 'income')} disabled={uploading.income} />
                              </label>
                              <p className="pl-1">ou glisser-déposer</p>
                            </div>
                            <p className="text-xs text-gray-500">PNG, JPG, PDF jusqu'à 10MB</p>
                          </div>
                        </div>
                      )}
                    </div>
                    {proofOfIncome && (
                      <button
                        type="button"
                        onClick={() => setProofOfIncome(null)}
                        className="ml-2 bg-white py-2 px-3 border border-gray-300 rounded-md shadow-sm text-sm leading-4 font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                      >
                        Changer
                      </button>
                    )}
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700">Relevés bancaires (3 derniers mois) *</label>
                  <div className="mt-1 flex items-center">
                    <div className="flex-grow">
                      {bankStatements ? (
                        <div className="flex items-center text-sm text-gray-500">
                          <svg className="flex-shrink-0 mr-1.5 h-5 w-5 text-green-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                          <span>{bankStatements.file_name}</span>
                        </div>
                      ) : (
                        <div className="max-w-lg flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                          <div className="space-y-1 text-center">
                            <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true">
                              <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                            <div className="flex text-sm text-gray-600">
                              <label htmlFor="bank-upload" className="relative cursor-pointer bg-white rounded-md font-medium text-primary hover:text-primary-dark focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-primary">
                                <span>Télécharger un fichier</span>
                                <input id="bank-upload" name="bank-upload" type="file" className="sr-only" onChange={(e) => handleFileUpload(e, 'bank')} disabled={uploading.bank} />
                              </label>
                              <p className="pl-1">ou glisser-déposer</p>
                            </div>
                            <p className="text-xs text-gray-500">PNG, JPG, PDF jusqu'à 10MB</p>
                          </div>
                        </div>
                      )}
                    </div>
                    {bankStatements && (
                      <button
                        type="button"
                        onClick={() => setBankStatements(null)}
                        className="ml-2 bg-white py-2 px-3 border border-gray-300 rounded-md shadow-sm text-sm leading-4 font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                      >
                        Changer
                      </button>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="mt-8 flex justify-between">
                <button
                  type="button"
                  onClick={handlePreviousStep}
                  className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                >
                  Précédent
                </button>
                <button
                  type="submit"
                  disabled={loading || Object.values(uploading).some(Boolean)}
                  className={`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary ${
                    (loading || Object.values(uploading).some(Boolean)) ? 'opacity-70 cursor-not-allowed' : ''
                  }`}
                >
                  {loading ? 'Soumission en cours...' : 'Soumettre la demande'}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default NewLoanRequest;
