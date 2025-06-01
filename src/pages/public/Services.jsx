import { Link } from 'react-router-dom';

const Services = () => {
  return (
    <div className="bg-noir">
      {/* Header */}
      <div className="relative bg-noir">
        <div className="absolute inset-0">
          <img
            className="w-full h-full object-cover mix-blend-multiply opacity-25"
            src="https://images.unsplash.com/photo-1573164574572-cb89e39749b4?ixlib=rb-4.0.3&auto=format&fit=crop&w=1469&q=80"
            alt="Financial services"
          />
          <div className="absolute inset-0 bg-noir opacity-70"></div>
        </div>
        <div className="relative max-w-7xl mx-auto py-24 px-4 sm:py-32 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl font-extrabold tracking-tight text-or sm:text-6xl lg:text-7xl">Nos services</h1>
          <div className="mx-auto my-4 w-20 h-1 bg-or rounded-full"></div>
          <p className="mt-6 text-2xl text-or-light max-w-3xl mx-auto font-light">
            Découvrez notre gamme complète de solutions financières conçues pour répondre aux besoins des particuliers et des entreprises en Afrique.
          </p>
        </div>
      </div>

      {/* Main services section */}
      <div className="bg-[#181818] py-16 sm:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-extrabold text-or text-center">Solutions de financement</h2>
          <div className="mx-auto my-4 w-20 h-1 bg-or rounded-full"></div>
          <p className="mt-4 text-xl text-or-light text-center max-w-2xl mx-auto">
            Nous offrons une variété de solutions de financement adaptées aux besoins des particuliers et des entreprises.
          </p>

          <div className="mt-10">
            <div className="space-y-10 md:space-y-0 md:grid md:grid-cols-2 md:gap-x-8 md:gap-y-10">
              {/* Service 1 */}
              <div className="relative bg-[#181818] rounded-xl shadow-lg p-8 hover:shadow-[0_0_20px_#FFD70033] hover:scale-105 transition-transform duration-300">
                <div>
                  <span className="h-12 w-12 rounded-md flex items-center justify-center bg-or">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-noir" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                  </span>
                </div>
                <div className="mt-5">
                  <h3 className="text-lg uppercase tracking-wide font-bold text-or">Prêts immobiliers</h3>
                  <p className="mt-2 text-base text-or-light drop-shadow">
                    Financez l&apos;acquisition ou la construction de votre bien immobilier avec nos solutions de prêt immobilier adaptées à vos besoins. Taux compétitifs et durées flexibles.
                  </p>
                  <div className="mt-4">
                    <Link to="/auth/login" className="text-or hover:text-or-light font-bold hover:underline transition underline">
                      En savoir plus <span aria-hidden="true">&rarr;</span>
                    </Link>
                  </div>
                </div>
              </div>

              {/* Service 2 */}
              <div className="relative bg-[#181818] rounded-xl shadow-lg p-8 hover:shadow-[0_0_20px_#FFD70033] hover:scale-105 transition-transform duration-300">
                <div>
                  <span className="h-12 w-12 rounded-md flex items-center justify-center bg-or">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-noir" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                  </span>
                </div>
                <div className="mt-5">
                  <h3 className="text-lg uppercase tracking-wide font-bold text-or">Prêts aux entreprises</h3>
                  <p className="mt-2 text-base text-or-light drop-shadow">
                    Des solutions de financement pour les entreprises de toutes tailles, des startups aux grandes entreprises, pour soutenir la croissance, le fonds de roulement ou l&apos;investissement.
                  </p>
                  <div className="mt-4">
                    <Link to="/auth/login" className="text-or hover:text-or-light font-bold hover:underline transition underline">
                      En savoir plus <span aria-hidden="true">&rarr;</span>
                    </Link>
                  </div>
                </div>
              </div>

              {/* Service 3 */}
              <div className="relative bg-[#181818] rounded-xl shadow-lg p-8 hover:shadow-[0_0_20px_#FFD70033] hover:scale-105 transition-transform duration-300">
                <div>
                  <span className="h-12 w-12 rounded-md flex items-center justify-center bg-or">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-noir" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </span>
                </div>
                <div className="mt-5">
                  <h3 className="text-lg uppercase tracking-wide font-bold text-or">Microfinance</h3>
                  <p className="mt-2 text-base text-or-light drop-shadow">
                    Des solutions de microfinance pour les petits entrepreneurs et commerçants avec des conditions simplifiées et un accompagnement personnalisé.
                  </p>
                  <div className="mt-4">
                    <Link to="/auth/login" className="text-or hover:text-or-light font-bold hover:underline transition underline">
                      En savoir plus <span aria-hidden="true">&rarr;</span>
                    </Link>
                  </div>
                </div>
              </div>

              {/* Service 4 */}
              <div className="relative bg-[#181818] rounded-xl shadow-lg p-8 hover:shadow-[0_0_20px_#FFD70033] hover:scale-105 transition-transform duration-300">
                <div>
                  <span className="h-12 w-12 rounded-md flex items-center justify-center bg-or">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-noir" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                    </svg>
                  </span>
                </div>
                <div className="mt-5">
                  <h3 className="text-lg uppercase tracking-wide font-bold text-or">Prêts projet</h3>
                  <p className="mt-2 text-base text-or-light drop-shadow">
                    Financez vos projets personnels avec nos prêts projets : rénovation, éducation, mariage, voyage et autres besoins spécifiques.
                  </p>
                  <div className="mt-4">
                    <Link to="/auth/login" className="text-or hover:text-or-light font-bold hover:underline transition underline">
                      En savoir plus <span aria-hidden="true">&rarr;</span>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Advisory services */}
      <div className="bg-noir py-16 sm:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:text-center">
            <h2 className="text-base text-or font-semibold tracking-wide uppercase">Conseil et accompagnement</h2>
            <div className="mx-auto my-4 w-20 h-1 bg-or rounded-full"></div>
            <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-or sm:text-4xl">
              Des experts à votre service
            </p>
            <p className="mt-4 max-w-2xl text-xl text-or-light lg:mx-auto">
              Notre équipe d'experts est là pour vous accompagner dans tous vos projets financiers.
            </p>
          </div>

          <div className="mt-10">
            <div className="space-y-10 md:space-y-0 md:grid md:grid-cols-3 md:gap-x-8 md:gap-y-10">
              {/* Advisory 1 */}
              <div className="bg-[#181818] p-6 rounded-lg shadow-lg hover:shadow-[0_0_20px_#FFD70033] hover:scale-105 transition-transform duration-300">
                <div className="flex items-center justify-center h-12 w-12 rounded-md bg-or text-noir mx-auto">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="mt-5 text-center">
                  <h3 className="text-lg uppercase tracking-wide font-bold text-or">Conseil en investissement</h3>
                  <p className="mt-2 text-base text-or-light drop-shadow">
                    Nos experts vous guident dans vos choix d'investissement pour optimiser votre patrimoine.
                  </p>
                </div>
              </div>

              {/* Advisory 2 */}
              <div className="bg-[#181818] p-6 rounded-lg shadow-lg hover:shadow-[0_0_20px_#FFD70033] hover:scale-105 transition-transform duration-300">
                <div className="flex items-center justify-center h-12 w-12 rounded-md bg-or text-noir mx-auto">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <div className="mt-5 text-center">
                  <h3 className="text-lg uppercase tracking-wide font-bold text-or">Planification financière</h3>
                  <p className="mt-2 text-base text-or-light drop-shadow">
                    Élaborez un plan financier sur mesure pour atteindre vos objectifs personnels et professionnels.
                  </p>
                </div>
              </div>

              {/* Advisory 3 */}
              <div className="bg-[#181818] p-6 rounded-lg shadow-lg hover:shadow-[0_0_20px_#FFD70033] hover:scale-105 transition-transform duration-300">
                <div className="flex items-center justify-center h-12 w-12 rounded-md bg-or text-noir mx-auto">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                  </svg>
                </div>
                <div className="mt-5 text-center">
                  <h3 className="text-lg uppercase tracking-wide font-bold text-or">Accompagnement entreprises</h3>
                  <p className="mt-2 text-base text-or-light drop-shadow">
                    Solutions sur mesure pour les entreprises : financement, développement et stratégie financière.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA section */}
      <div className="bg-or">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:py-16 lg:px-8 lg:flex lg:items-center lg:justify-between">
          <h2 className="text-3xl font-extrabold tracking-tight text-noir sm:text-4xl">
            <span className="block">Prêt à concrétiser vos projets ?</span>
            <span className="block text-or-light">Créez un compte ou contactez-nous dès aujourd&apos;hui.</span>
          </h2>
          <div className="mt-8 flex lg:mt-0 lg:flex-shrink-0">
            <div className="inline-flex rounded-md shadow">
              <Link
                to="/auth/register"
                className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-bold rounded-md text-or bg-noir hover:bg-or-light hover:text-noir transition"
              >
                Créer un compte
              </Link>
            </div>
            <div className="ml-3 inline-flex rounded-md shadow">
              <Link
                to="/contact"
                className="inline-flex items-center justify-center px-5 py-3 border border-or text-base font-bold rounded-md text-noir bg-or hover:bg-or-light hover:text-noir transition"
              >
                Contactez-nous
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Services;
