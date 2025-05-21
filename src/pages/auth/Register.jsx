import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { toast } from 'react-hot-toast';

const Register = () => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [password2, setPassword2] = useState('');
  const [loading, setLoading] = useState(false);

  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!fullName || !email || !password || !password2) {
      toast.error('Veuillez remplir tous les champs');
      return;
    }
    if (password !== password2) {
      toast.error('Les mots de passe ne correspondent pas');
      return;
    }
    setLoading(true);

    try {
      // ⚠️ L’ordre des arguments est IMPORTANT !
      const { error } = await register(fullName, email, password);
      if (error) {
        toast.error(error.message || "Erreur lors de la création du compte");
      } else {
        toast.success('Compte créé avec succès ! Vous pouvez vous connecter.');
        navigate('/auth/login');
      }
    } catch (error) {
      toast.error("Une erreur s'est produite");
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
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="fullName" className="block text-sm font-medium text-[#E6C97A] mb-2">
              Nom complet
            </label>
            <input
              id="fullName"
              name="fullName"
              type="text"
              autoComplete="name"
              required
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Votre nom complet"
              className="appearance-none block w-full px-3 py-2 border border-[#D4AF37] rounded-md shadow-sm placeholder-[#E6C97A] focus:outline-none focus:ring-2 focus:ring-[#D4AF37] focus:border-[#D4AF37] text-[#E6C97A] bg-[#181818] sm:text-sm"
              aria-label="Nom complet"
            />
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-[#E6C97A] mb-2">
              Adresse e-mail
            </label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="votre.email@example.com"
              className="appearance-none block w-full px-3 py-2 border border-[#D4AF37] rounded-md shadow-sm placeholder-[#E6C97A] focus:outline-none focus:ring-2 focus:ring-[#D4AF37] focus:border-[#D4AF37] text-[#E6C97A] bg-[#181818] sm:text-sm"
              aria-label="Adresse e-mail"
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-[#E6C97A] mb-2">
              Mot de passe
            </label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="new-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Votre mot de passe"
              className="appearance-none block w-full px-3 py-2 border border-[#D4AF37] rounded-md shadow-sm placeholder-[#E6C97A] focus:outline-none focus:ring-2 focus:ring-[#D4AF37] focus:border-[#D4AF37] text-[#E6C97A] bg-[#181818] sm:text-sm"
              aria-label="Mot de passe"
            />
          </div>
          <div>
            <label htmlFor="password2" className="block text-sm font-medium text-[#E6C97A] mb-2">
              Confirmer le mot de passe
            </label>
            <input
              id="password2"
              name="password2"
              type="password"
              autoComplete="new-password"
              required
              value={password2}
              onChange={(e) => setPassword2(e.target.value)}
              placeholder="Confirmez le mot de passe"
              className="appearance-none block w-full px-3 py-2 border border-[#D4AF37] rounded-md shadow-sm placeholder-[#E6C97A] focus:outline-none focus:ring-2 focus:ring-[#D4AF37] focus:border-[#D4AF37] text-[#E6C97A] bg-[#181818] sm:text-sm"
              aria-label="Confirmer le mot de passe"
            />
          </div>
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