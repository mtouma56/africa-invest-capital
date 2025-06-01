import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div className="min-h-screen bg-[#181818] text-or-light">
      {/* HERO */}
      <section className="flex flex-col items-center justify-center text-center py-20 px-4">
        <h1 className="text-or font-extrabold text-4xl sm:text-5xl mb-4">
          Votre partenaire de confiance pour vos projets financiers
        </h1>
        <p className="text-or-light text-xl max-w-2xl mx-auto mb-8">
          Africa Invest Capital propose des solutions haut de gamme en financement, gestion de crédit, et accompagnement sur mesure pour particuliers et entreprises ambitieux.
        </p>
        <div className="flex flex-col sm:flex-row items-center gap-4 mb-10">
          <Link
            to="/auth/register"
            aria-label="Créer un compte"
            className="bg-noir text-or font-bold px-8 py-3 rounded-lg hover:bg-or hover:text-noir transition"
          >
            Créer un compte
          </Link>
          <Link
            to="/contact"
            aria-label="Nous contacter"
            className="bg-or text-noir font-bold px-8 py-3 rounded-lg hover:bg-noir hover:text-or transition"
          >
            Nous contacter
          </Link>
        </div>
        {/* Mini-stats */}
        <div className="flex flex-col sm:flex-row gap-6 justify-center mt-4">
        <div className="bg-gris-dark rounded-premium px-6 py-5 shadow-premium hover:scale-105 hover:shadow-[0_0_15px_#C8B06366] transition-transform duration-300">
            <span className="text-or text-2xl font-bold block">+1000</span>
            <span className="text-or-light text-base">Clients accompagnés</span>
          </div>
          <div className="bg-gris-dark rounded-premium px-6 py-5 shadow-premium hover:scale-105 hover:shadow-[0_0_15px_#C8B06366] transition-transform duration-300">
            <span className="text-or text-2xl font-bold block">2 500 000 000 FCFA</span>
            <span className="text-or-light text-base">Crédits octroyés</span>
          </div>
          <div className="bg-gris-dark rounded-premium px-6 py-5 shadow-premium hover:scale-105 hover:shadow-[0_0_15px_#C8B06366] transition-transform duration-300">
            <span className="text-or text-2xl font-bold block">4 pays</span>
            <span className="text-or-light text-base">Zone d&apos;intervention</span>
          </div>
        </div>
      </section>

      {/* VALEURS AJOUTÉES */}
      <section className="py-20 px-4 max-w-6xl mx-auto">
        <h2 className="text-or text-3xl font-bold text-center mb-12">Pourquoi choisir Africa Invest Capital ?</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
          <div className="bg-[#232323] rounded-lg p-6 hover:scale-105 hover:shadow-[0_0_20px_#FFD70033] transition">
            <h3 className="text-or font-bold mb-2">Expertise locale & internationale</h3>
            <p className="text-or-light">
              Une équipe expérimentée, un accompagnement sur-mesure pour chaque projet en Côte d&apos;Ivoire, en Afrique et à l&apos;international.
            </p>
          </div>
          <div className="bg-[#232323] rounded-lg p-6 hover:scale-105 hover:shadow-[0_0_20px_#FFD70033] transition">
            <h3 className="text-or font-bold mb-2">Solutions sur mesure</h3>
            <p className="text-or-light">
              Du crédit classique à l&apos;investissement, AIC vous construit un parcours adapté à vos besoins et à vos ambitions.
            </p>
          </div>
          <div className="bg-[#232323] rounded-lg p-6 hover:scale-105 hover:shadow-[0_0_20px_#FFD70033] transition">
            <h3 className="text-or font-bold mb-2">Process digitalisé</h3>
            <p className="text-or-light">
              Demandez, suivez et gérez vos financements en ligne sur une plateforme sécurisée et transparente.
            </p>
          </div>
        </div>
      </section>

      {/* APPEL À L&apos;ACTION FINAL */}
      <section className="bg-or-light py-20 px-4 text-center">
        <h2 className="text-noir text-3xl font-bold mb-4">Prêt à financer votre projet ?</h2>
        <p className="text-noir text-lg mb-8">
          Rejoignez les clients satisfaits d&apos;Africa Invest Capital et bénéficiez d&apos;un accompagnement premium.
        </p>
        <Link
          to="/auth/register"
          aria-label="Démarrer avec AIC"
          className="inline-block bg-noir text-or font-bold px-10 py-4 rounded-lg hover:bg-or hover:text-noir transition"
        >
          Démarrer avec AIC
        </Link>
      </section>
    </div>
  );
}