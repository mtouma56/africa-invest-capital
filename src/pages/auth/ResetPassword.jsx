import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { showSuccess, showError } from '../../utils/toast';

const ResetPassword = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const { resetPassword } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email) {
      showError('Veuillez entrer votre adresse e-mail');
      return;
    }

    setLoading(true);

    try {
      const { error } = await resetPassword(email);

      if (error) {
        showError(error.message || "Échec de l'envoi du lien de réinitialisation");
      } else {
        setSubmitted(true);
        showSuccess('Lien de réinitialisation envoyé à votre adresse e-mail');
      }
    } catch (error) {
      showError("Une erreur s'est produite");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#181818] flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <img
          className="mx-auto h-14 w-auto rounded-md"
          src="https://i.ibb.co/k65RGW5j/logoaic.png"
          alt="Africa Invest Capital"
        />
        <h2 className="mt-6 text-center text-3xl font-extrabold text-or">Réinitialisez votre mot de passe</h2>
        <p className="mt-2 text-center text-sm text-or-light">
          Ou{' '}
          <Link to="/auth/login" className="font-medium text-or hover:text-or-light transition">
            retournez à la page de connexion
          </Link>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-[#232323] py-8 px-4 shadow sm:rounded-lg sm:px-10">
          {submitted ? (
            <div className="text-center">
              <svg
                className="mx-auto h-12 w-12 text-green-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
              <h3 className="mt-2 text-lg font-medium text-or">Lien de réinitialisation envoyé</h3>
              <p className="mt-1 text-sm text-or-light">
                Nous avons envoyé un e-mail à <span className="text-or font-semibold">{email}</span> contenant un lien pour réinitialiser votre mot de passe. Veuillez vérifier votre boîte de réception.
              </p>
              <div className="mt-6">
                <Link
                  to="/auth/login"
                  className="w-full flex justify-center py-2 px-4 border border-or rounded-md shadow-sm text-sm font-medium text-noir bg-or hover:bg-[#FFD580] hover:text-noir transition focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-or"
                  aria-label="Retour à la connexion"
                >
                  Retour à la connexion
                </Link>
              </div>
            </div>
          ) : (
            <form className="space-y-6" onSubmit={handleSubmit}>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-or-light">
                  Adresse e-mail
                </label>
                <div className="mt-1">
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="appearance-none block w-full px-3 py-2 border border-or rounded-md shadow-sm placeholder-or-light bg-[#181818] text-or-light focus:outline-none focus:ring-or focus:border-or sm:text-sm"
                    placeholder="Votre adresse e-mail"
                  />
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  disabled={loading}
                  className={`w-full flex justify-center py-2 px-4 border border-or rounded-md shadow-sm text-sm font-bold text-noir bg-or hover:bg-[#FFD580] hover:text-noir focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-or transition ${
                    loading ? 'opacity-70 cursor-not-allowed animate-pulse' : ''
                  }`}
                  aria-label="Envoyer le lien de réinitialisation"
                >
                  {loading ? 'Envoi en cours...' : 'Envoyer le lien de réinitialisation'}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;