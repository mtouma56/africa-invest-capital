import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useAuth } from '../../hooks/useAuth';
import Card from '../../components/common/Card';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import Alert from '../../components/common/Alert';

const Settings = () => {
  const { user, updateProfile, updatePassword } = useAuth();
  const { register: registerProfile, handleSubmit: handleProfileSubmit, formState: { errors: profileErrors } } = useForm({
    defaultValues: {
      firstName: user?.profile?.first_name || '',
      lastName: user?.profile?.last_name || '',
      phone: user?.profile?.phone || '',
    }
  });
  
  const { register: registerPassword, handleSubmit: handlePasswordSubmit, watch: watchPassword, formState: { errors: passwordErrors } } = useForm();
  
  const [profileStatus, setProfileStatus] = useState({ success: false, error: false, message: '' });
  const [passwordStatus, setPasswordStatus] = useState({ success: false, error: false, message: '' });
  const [isSubmittingProfile, setIsSubmittingProfile] = useState(false);
  const [isSubmittingPassword, setIsSubmittingPassword] = useState(false);
  
  const newPassword = watchPassword('newPassword', '');

  const onProfileSubmit = async (data) => {
    try {
      setIsSubmittingProfile(true);
      setProfileStatus({ success: false, error: false, message: '' });
      
      const { error } = await updateProfile({
        first_name: data.firstName,
        last_name: data.lastName,
        phone: data.phone,
        updated_at: new Date()
      });
      
      if (error) {
        setProfileStatus({
          success: false,
          error: true,
          message: `Erreur lors de la mise à jour du profil: ${error.message}`
        });
        return;
      }
      
      setProfileStatus({
        success: true,
        error: false,
        message: 'Votre profil a été mis à jour avec succès!'
      });
      
    } catch (err) {
      setProfileStatus({
        success: false,
        error: true,
        message: 'Une erreur est survenue. Veuillez réessayer plus tard.'
      });
      console.error('Erreur de mise à jour du profil:', err);
    } finally {
      setIsSubmittingProfile(false);
    }
  };

  const onPasswordSubmit = async (data) => {
    try {
      setIsSubmittingPassword(true);
      setPasswordStatus({ success: false, error: false, message: '' });
      
      const { error } = await updatePassword(data.newPassword);
      
      if (error) {
        setPasswordStatus({
          success: false,
          error: true,
          message: `Erreur lors de la mise à jour du mot de passe: ${error.message}`
        });
        return;
      }
      
      setPasswordStatus({
        success: true,
        error: false,
        message: 'Votre mot de passe a été mis à jour avec succès!'
      });
      
    } catch (err) {
      setPasswordStatus({
        success: false,
        error: true,
        message: 'Une erreur est survenue. Veuillez réessayer plus tard.'
      });
      console.error('Erreur de mise à jour du mot de passe:', err);
    } finally {
      setIsSubmittingPassword(false);
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Paramètres</h1>
      
      {/* Profil administrateur */}
      <Card title="Profil administrateur">
        {(profileStatus.success || profileStatus.error) && (
          <Alert 
            type={profileStatus.success ? 'success' : 'error'} 
            message={profileStatus.message}
            dismissible={true}
            onClose={() => setProfileStatus({ success: false, error: false, message: '' })}
            className="mb-4"
          />
        )}
        
        <form onSubmit={handleProfileSubmit(onProfileSubmit)} className="space-y-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Input
              label="Prénom"
              {...registerProfile('firstName', { required: 'Le prénom est obligatoire' })}
              error={profileErrors.firstName?.message}
            />
            
            <Input
              label="Nom"
              {...registerProfile('lastName', { required: 'Le nom est obligatoire' })}
              error={profileErrors.lastName?.message}
            />
          </div>
          
          <Input
            label="Email"
            value={user?.email || ''}
            disabled={true}
            className="bg-gray-100"
          />
          
          <Input
            label="Téléphone"
            type="tel"
            {...registerProfile('phone', {
              pattern: {
                value: /^[0-9+\-\s()]{8,15}$/,
                message: 'Numéro de téléphone invalide'
              }
            })}
            error={profileErrors.phone?.message}
            placeholder="Ex: +225 07 12 34 56 78"
          />
          
          <div className="flex justify-end">
            <Button
              type="submit"
              variant="primary"
              isLoading={isSubmittingProfile}
            >
              Mettre à jour le profil
            </Button>
          </div>
        </form>
      </Card>
      
      {/* Changement de mot de passe */}
      <Card title="Changer le mot de passe">
        {(passwordStatus.success || passwordStatus.error) && (
          <Alert 
            type={passwordStatus.success ? 'success' : 'error'} 
            message={passwordStatus.message}
            dismissible={true}
            onClose={() => setPasswordStatus({ success: false, error: false, message: '' })}
            className="mb-4"
          />
        )}
        
        <form onSubmit={handlePasswordSubmit(onPasswordSubmit)} className="space-y-4">
          <Input
            label="Nouveau mot de passe"
            type="password"
            {...registerPassword('newPassword', {
              required: 'Le nouveau mot de passe est obligatoire',
              minLength: {
                value: 6,
                message: 'Le mot de passe doit contenir au moins 6 caractères'
              }
            })}
            error={passwordErrors.newPassword?.message}
          />
          
          <Input
            label="Confirmer le nouveau mot de passe"
            type="password"
            {...registerPassword('confirmPassword', {
              required: 'Veuillez confirmer votre mot de passe',
              validate: value => 
                value === newPassword || 'Les mots de passe ne correspondent pas'
            })}
            error={passwordErrors.confirmPassword?.message}
          />
          
          <div className="flex justify-end">
            <Button
              type="submit"
              variant="primary"
              isLoading={isSubmittingPassword}
            >
              Changer le mot de passe
            </Button>
          </div>
        </form>
      </Card>
      
      {/* Paramètres du système */}
      <Card title="Paramètres du système">
        <p className="text-sm text-gray-500 mb-4">
          Cette section sera disponible dans une future mise à jour.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 opacity-50 pointer-events-none">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Devises acceptées
            </label>
            <select
              className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm rounded-md"
              disabled
            >
              <option>XOF (Franc CFA)</option>
              <option>EUR (Euro)</option>
              <option>USD (Dollar américain)</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Montant minimum de prêt
            </label>
            <input
              type="number"
              className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm rounded-md"
              disabled
              value="50000"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Montant maximum de prêt
            </label>
            <input
              type="number"
              className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm rounded-md"
              disabled
              value="50000000"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Durée maximum (mois)
            </label>
            <input
              type="number"
              className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm rounded-md"
              disabled
              value="60"
            />
          </div>
        </div>
      </Card>
    </div>
  );
};

export default Settings;