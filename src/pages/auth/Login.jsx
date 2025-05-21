import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { toast } from 'react-hot-toast';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast.error('Veuillez remplir tous les champs');
      return;
    }
    
    setLoading(true);
    
    try {
      const { error } = await login(email, password);
      
      if (error) {
        toast.error(error.message || 'Échec de la connexion');
      } else {
        toast.success('Connexion réussie !');
        // navigate('/client/dashboard'); // À activer si tu veux rediriger automatiquement après login
      }
    } catch (error) {
      toast.error('Une erreur s\'est produite');
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
        <h2 className="text-center text-4xl font-bold text-[#D4AF37] mb-6">Connexion à votre compte</h2>
        <p className="mb-6 text-sm text-[#E6C97A]">
          Ou{' '}
          <Link 
            to="/auth/register" 
            className="font-medium text-[#E6C97A] hover:text-[#D4AF37]" 
            aria-label="Créer un compte"
          >
            créez un compte si vous n'en avez pas encore
          </Link>
        </p>
      </div>

      <div className="mx-auto w-full max-w-md bg-[#232323] py-10 px-8 rounded-lg shadow-lg">
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-[#E6C97A] mb-2">
              Adresse e-mail
            </label>
            <div>
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
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-[#E6C97A] mb-2">
              Mot de passe
            </label>
            <div>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Votre mot de passe"
                className="appearance-none block w-full px-3 py-2 border border-[#D4AF37] rounded-md shadow-sm placeholder-[#E6C97A] focus:outline-none focus:ring-2 focus:ring-[#D4AF37] focus:border-[#D4AF37] text-[#E6C97A] bg-[#181818] sm:text-sm"
                aria-label="Mot de passe"
              />
            </div>
          </div>

          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                className="h-4 w-4 text-[#D4AF37] focus:ring-[#D4AF37] border-[#D4AF37] rounded bg-[#181818]"
                aria-label="Se souvenir de moi"
              />
              <label htmlFor="remember-me" className="ml-2 block text-sm text-[#E6C97A]">
                Se souvenir de moi
              </label>
            </div>

            <div className="text-sm">
              <Link 
                to="/auth/reset-password" 
                className="font-medium text-[#E6C97A] hover:text-[#D4AF37]" 
                aria-label="Mot de passe oublié"
              >
                Mot de passe oublié?
              </Link>
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              aria-label="Se connecter"
              className={`w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-bold text-black bg-[#D4AF37] hover:bg-black hover:text-[#D4AF37] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#D4AF37] transition-colors duration-300 ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
            >
              {loading ? (
                <svg className="animate-spin h-5 w-5 text-black" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" aria-hidden="true">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
                </svg>
              ) : (
                'Se connecter'
              )}
            </button>
          </div>
        </form>

        <div className="mt-10">
          <div className="relative">
            <div className="absolute inset-0 flex items-center" aria-hidden="true">
              <div className="w-full border-t border-[#E6C97A]" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-transparent text-[#E6C97A]">Ou continuer avec</span>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-1 gap-3">
            <button
              type="button"
              className="w-full inline-flex justify-center items-center py-2 px-4 border border-[#E6C97A] rounded-md shadow-sm bg-[#232323] text-[#D4AF37] hover:bg-black hover:text-[#D4AF37] transition-colors duration-300"
              aria-label="Continuer avec Twitter"
            >
              <svg className="w-5 h-5 mr-2 text-[#D4AF37]" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                <path d="M6.29 18.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0020 3.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.073 4.073 0 01.8 7.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 010 16.407a11.616 11.616 0 006.29 1.84" />
              </svg>
              <span>Continuer avec Twitter</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;