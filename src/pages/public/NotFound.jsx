import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div className="min-h-full bg-noir text-or-light px-4 py-16 sm:px-6 sm:py-24 md:grid md:place-items-center lg:px-8">
      <div className="max-w-max mx-auto">
        <main className="sm:flex">
          <p className="text-4xl font-extrabold text-or sm:text-5xl">404</p>
          <div className="sm:ml-6">
            <div className="sm:border-l sm:border-gris-dark sm:pl-6">
              <h1 className="text-4xl font-extrabold text-or tracking-tight sm:text-5xl">Page non trouvée</h1>
              <p className="mt-1 text-base">Désolé, nous n&apos;avons pas pu trouver la page que vous recherchez.</p>
            </div>
            <div className="mt-10 flex space-x-3 sm:border-l sm:border-transparent sm:pl-6">
              <Link
                to="/"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-bold rounded-md bg-noir text-or hover:bg-or hover:text-noir transition"
              >
                Retour à l&apos;accueil
              </Link>
              <Link
                to="/contact"
                className="inline-flex items-center px-4 py-2 border border-or text-sm font-bold rounded-md bg-or text-noir hover:bg-noir hover:text-or transition"
              >
                Contactez-nous
              </Link>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default NotFound;
