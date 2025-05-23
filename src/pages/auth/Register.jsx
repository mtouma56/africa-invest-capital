import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { showSuccess, showError } from '../../utils/toast';
import Input from '../../components/common/Input';

const Register = () => {
  const [loading, setLoading] = useState(false);
  const {
    register: registerForm,
    handleSubmit,
    watch,
    formState: { errors }
  } = useForm();

  const { register, login } = useAuth();
  const navigate = useNavigate();

  const onSubmit = async ({ fullName, email, password, password2 }) => {
    if (!fullName || !email || !password || !password2) {
      showError('Veuillez remplir tous les champs');
      return;
    }
    if (password !== password2) {
      showError('Les mots de passe ne correspondent pas');
      return;
    }
    setLoading(true);

    try {
      // ⚠️ L’ordre des arguments est IMPORTANT !
      const { error } = await register(fullName, email, password);
      if (error) {
        showError(error.message || "Erreur lors de la création du compte");
      } else {
        showSuccess('Compte créé avec succès !');
        // Connexion automatique puis redirection vers le tableau de bord
        await login(email, password);
        navigate('/client');
      }
    } catch (error) {
      if (error.message === 'Failed to fetch') {
        showError('Erreur réseau. Veuillez vérifier votre connexion.');
      } else {
        showError("Une erreur s'est produite");
      }
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center py-10 px-6 sm:px-10 bg-[#181818] font-sans">
      <div className="mx-auto w-full max-w-md text-center">
        <img
          className="mx-auto mb-6 h-16 w-auto"
          src="https://i.ibb.co/k65RGW5j/logoaic.png"
          alt="Africa Invest Capital"
        />
        <h2 className="text-center text-4xl font-bold text-[#D4AF37] mb-6">
          Créer un compte
        </h2>
        <p className="mb-6 text-sm text-[#E6C97A]">
          Déjà inscrit ?{' '}
          <Link
            to="/auth/login"
            className="font-medium text-[#E6C97A] hover:text-[#D4AF37]"
            aria-label="Retour à la connexion"
          >
            Connectez-vous ici
          </Link>
        </p>
      </div>

      <div className="mx-auto w-full max-w-md bg-[#232323] py-10 px-8 rounded-lg shadow-lg">
        <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
          <Input
            label="Nom complet"
            placeholder="Votre nom complet"
            className="bg-[#181818] text-[#E6C97A] placeholder-[#E6C97A] border-[#D4AF37]"
            {...registerForm('fullName', { required: 'Nom complet requis' })}
            error={errors.fullName?.message}
          />
          <Input
            label="Adresse e-mail"
            type="email"
            placeholder="votre.email@example.com"
            className="bg-[#181818] text-[#E6C97A] placeholder-[#E6C97A] border-[#D4AF37]"
            {...registerForm('email', {
              required: 'Adresse e-mail requise',
              pattern: {
                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                message: 'Adresse e-mail invalide'
              }
            })}
            error={errors.email?.message}
          />
          <Input
            label="Mot de passe"
            type="password"
            placeholder="Votre mot de passe"
            className="bg-[#181818] text-[#E6C97A] placeholder-[#E6C97A] border-[#D4AF37]"
            {...registerForm('password', {
              required: 'Mot de passe requis',
              minLength: { value: 6, message: 'Minimum 6 caractères' }
            })}
            error={errors.password?.message}
          />
          <Input
            label="Confirmer le mot de passe"
            type="password"
            placeholder="Confirmez le mot de passe"
            className="bg-[#181818] text-[#E6C97A] placeholder-[#E6C97A] border-[#D4AF37]"
            {...registerForm('password2', {
              required: 'Confirmation requise',
              validate: value => value === watch('password') || 'Les mots de passe ne correspondent pas'
            })}
            error={errors.password2?.message}
          />
          <div>
            <button
              type="submit"
              disabled={loading}
              aria-label="Créer un compte"
              className={`w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-bold text-black bg-[#D4AF37] hover:bg-black hover:text-[#D4AF37] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#D4AF37] transition-colors duration-300 ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
            >
              {loading ? (
                <svg className="animate-spin h-5 w-5 text-black" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" aria-hidden="true">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
                </svg>
              ) : (
                'Créer un compte'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;