import { Link } from "react-router-dom";

export default function About() {
  return (
    <div className="min-h-screen bg-[#181818] text-or-light py-20 px-4">
      {/* Titre principal */}
      <h1 className="text-or font-extrabold text-4xl sm:text-5xl text-center mb-6 tracking-tight">
        À propos d&apos;Africa Invest Capital
      </h1>
      {/* Accroche */}
      <p className="text-or-light text-xl text-center max-w-2xl mx-auto mb-10 font-medium">
        Votre partenaire financier de confiance, au service de la croissance africaine et de vos ambitions.
        Excellence, innovation et accompagnement sur-mesure pour chaque client.
      </p>

      {/* Séparateur design */}
      <div className="w-20 mx-auto border-t border-or mb-10 opacity-60"></div>

      {/* Mission / Valeurs / Engagements */}
      <section className="max-w-4xl mx-auto mb-10">
        <h2 className="text-or font-bold text-2xl mb-4 flex items-center gap-2">
          <span className="material-icons text-or-light text-xl align-middle" aria-hidden="true">flag</span>
          Notre mission
        </h2>
        <p className="text-or-light text-lg mb-4 leading-relaxed">
          Notre mission est d&apos;accélérer la réussite de nos clients en Afrique et à l&apos;international,
          grâce à des solutions financières innovantes, responsables et personnalisées.
          Notre ambition : instaurer la confiance, bâtir des leaders économiques et ouvrir de nouveaux horizons.
        </p>
        <div className="border-t border-[#232323] my-8"></div>
        <h2 className="text-or font-bold text-2xl mb-4 mt-8 flex items-center gap-2">
          <span className="material-icons text-or-light text-xl align-middle" aria-hidden="true">favorite</span>
          Nos valeurs
        </h2>
        <ul className="list-disc list-inside text-or-light text-lg space-y-2">
          <li>
            Excellence &amp; intégrité : Engagement total pour la qualité et l&apos;éthique.
          </li>
          <li>
            Confiance &amp; transparence : Relations fondées sur la clarté et le respect.
          </li>
          <li>
            Accompagnement premium &amp; sur-mesure : Solutions adaptées à chaque ambition.
          </li>
          <li>
            Innovation &amp; performance durable : Progresser tout en garantissant un impact positif et pérenne.
          </li>
        </ul>

        <div className="border-t border-[#232323] my-8"></div>
        <h2 className="text-or font-bold text-2xl mb-4 mt-8 flex items-center gap-2">
          <span className="material-icons text-or-light text-xl align-middle" aria-hidden="true">verified_user</span>
          Engagements responsables
        </h2>
        <ul className="list-disc list-inside text-or-light text-lg space-y-2">
          <li>
            Respect des normes internationales : Conformité rigoureuse et standards éthiques.
          </li>
          <li>
            Transparence et responsabilité : Gouvernance irréprochable, engagement citoyen.
          </li>
          <li>
            Développement durable : Favoriser un impact économique, social et environnemental positif.
          </li>
        </ul>
      </section>

      {/* Timeline : Notre Histoire */}
      <section className="max-w-4xl mx-auto mb-16">
        <h2 className="text-or font-bold text-2xl mb-6 flex items-center gap-2">
          <span className="material-icons text-or-light text-xl align-middle" aria-hidden="true">timeline</span>
          Notre histoire
        </h2>
        <ul className="space-y-2 text-or-light text-lg">
          <li><span className="font-bold text-or">2012</span> — Fondation d&apos;AIC à Abidjan</li>
          <li><span className="font-bold text-or">2015</span> — 1er milliard FCFA de crédits octroyés</li>
          <li><span className="font-bold text-or">2018</span> — Déploiement international (4 pays)</li>
          <li><span className="font-bold text-or">2023</span> — Lancement de l&apos;IA financière AIC</li>
          <li><span className="font-bold text-or">2025</span> — +57,5 Mds FCFA financés, 1200 clients accompagnés</li>
        </ul>
      </section>

      {/* Notre Différence (USP) */}
      <section className="max-w-4xl mx-auto mb-16">
        <h2 className="text-or font-bold text-2xl mb-6 flex items-center gap-2">
          <span className="material-icons text-or-light text-xl align-middle" aria-hidden="true">stars</span>
          Notre différence
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="flex items-start gap-4">
            <span className="material-icons text-or text-3xl" aria-hidden="true">rocket_launch</span>
            <div>
              <div className="font-bold text-or">Réactivité</div>
              <div className="text-or-light">Décisions en moins de 48h pour les projets qualifiés.</div>
            </div>
          </div>
          <div className="flex items-start gap-4">
            <span className="material-icons text-or text-3xl" aria-hidden="true">person_search</span>
            <div>
              <div className="font-bold text-or">Accompagnement sur-mesure</div>
              <div className="text-or-light">Un expert dédié pour chaque client.</div>
            </div>
          </div>
          <div className="flex items-start gap-4">
            <span className="material-icons text-or text-3xl" aria-hidden="true">lock</span>
            <div>
              <div className="font-bold text-or">Sécurité &amp; Confidentialité</div>
              <div className="text-or-light">Conformité bancaire internationale.</div>
            </div>
          </div>
          <div className="flex items-start gap-4">
            <span className="material-icons text-or text-3xl" aria-hidden="true">eco</span>
            <div>
              <div className="font-bold text-or">Impact positif</div>
              <div className="text-or-light">Stratégie d&apos;investissement durable.</div>
            </div>
          </div>
        </div>
        {/* CTA Contactez-nous */}
        <div className="text-center mt-10">
          <Link
            to="/contact"
            className="inline-block bg-or text-noir font-bold px-10 py-4 rounded-xl text-lg shadow-lg hover:bg-[#FFD580] hover:scale-110 hover:text-noir transition-all duration-200 border-2 border-or animate-pulse"
          >
            Contactez-nous
          </Link>
        </div>
      </section>

      {/* Séparateur doré avant équipe dirigeante */}
      <div className="w-full border-t-4 border-or mb-10"></div>

      {/* Equipe */}
      <section className="max-w-4xl mx-auto mb-16">
        <h2 className="text-or font-bold text-2xl mb-6 flex items-center gap-2">
          <span className="material-icons text-or-light text-xl align-middle" aria-hidden="true">groups</span>
          Équipe dirigeante
        </h2>
        <p className="text-or-light mb-4 text-lg">Des experts reconnus à votre service.</p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
          <div className="bg-[#232323] rounded-xl p-6 shadow-lg flex flex-col items-center transition-transform duration-200 hover:scale-105 hover:shadow-2xl">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-or to-[#FFD580] flex items-center justify-center mb-3">
              <span className="material-icons text-noir text-3xl" aria-label="Avatar dirigeant">account_circle</span>
            </div>
            <h3 className="text-or font-bold text-xl mb-1 flex items-center">
              M. A. K.
              <a href="https://www.linkedin.com/" className="ml-2 text-or-light hover:text-or" aria-label="LinkedIn de M. A. K." target="_blank" rel="noopener noreferrer">
                <span className="material-icons text-base align-middle">linkedin</span>
              </a>
            </h3>
            <p className="text-or-light mb-1 font-medium">Président &amp; Fondateur</p>
            <p className="text-or-light text-sm text-center">
              18 ans d&apos;expérience – Spécialiste financement structuré et projets panafricains.
            </p>
            <span className="text-or text-xs mt-2">Engagé pour le développement responsable de l&apos;Afrique.</span>
          </div>
          <div className="bg-[#232323] rounded-xl p-6 shadow-lg flex flex-col items-center transition-transform duration-200 hover:scale-105 hover:shadow-2xl">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-or to-[#FFD580] flex items-center justify-center mb-3">
              <span className="material-icons text-noir text-3xl" aria-label="Avatar dirigeante">account_circle</span>
            </div>
            <h3 className="text-or font-bold text-xl mb-1 flex items-center">
              Mme S. D.
              <a href="https://www.linkedin.com/" className="ml-2 text-or-light hover:text-or" aria-label="LinkedIn de Mme S. D." target="_blank" rel="noopener noreferrer">
                <span className="material-icons text-base align-middle">linkedin</span>
              </a>
            </h3>
            <p className="text-or-light mb-1 font-medium">Directrice des Opérations</p>
            <p className="text-or-light text-sm text-center">
              15 ans d&apos;expérience – Innovation financière, management de projets Afrique.
            </p>
            <span className="text-or text-xs mt-2">Excellence opérationnelle, solutions sur-mesure.</span>
          </div>
          <div className="bg-[#232323] rounded-xl p-6 shadow-lg flex flex-col items-center transition-transform duration-200 hover:scale-105 hover:shadow-2xl">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-or to-[#FFD580] flex items-center justify-center mb-3">
              <span className="material-icons text-noir text-3xl" aria-label="Avatar dirigeant">account_circle</span>
            </div>
            <h3 className="text-or font-bold text-xl mb-1 flex items-center">
              M. J. T.
              <a href="https://www.linkedin.com/" className="ml-2 text-or-light hover:text-or" aria-label="LinkedIn de M. J. T." target="_blank" rel="noopener noreferrer">
                <span className="material-icons text-base align-middle">linkedin</span>
              </a>
            </h3>
            <p className="text-or-light mb-1 font-medium">Directeur Risques &amp; Conformité</p>
            <p className="text-or-light text-sm text-center">
              15 ans d&apos;expertise – Gestion des risques, conformité financière Afrique.
            </p>
            <span className="text-or text-xs mt-2">Sécurité, exigence et confiance pour nos clients.</span>
          </div>
        </div>
      </section>

      {/* Séparateur doré avant chiffres clés */}
      <div className="w-full border-t-4 border-or mb-10"></div>

      {/* Chiffres clés */}
      <section className="max-w-4xl mx-auto mb-20">
        <h2 className="text-or font-bold text-2xl mb-6 flex items-center gap-2">
          <span className="material-icons text-or-light text-xl align-middle" aria-hidden="true">bar_chart</span>
          Chiffres clés
        </h2>
        <div className="flex flex-col sm:grid sm:grid-cols-4 gap-8 justify-center">
          <div className="bg-[#232323] rounded-xl px-6 py-5 shadow-lg text-center flex-1 transition-transform duration-200 hover:scale-105 hover:shadow-2xl">
            <span className="material-icons text-or text-3xl mb-1" aria-hidden="true">schedule</span>
            <span className="text-or text-2xl font-bold block">+15 ans</span>
            <span className="text-or-light text-base">d&apos;expérience cumulée</span>
          </div>
          <div className="bg-[#232323] rounded-xl px-6 py-5 shadow-lg text-center flex-1 transition-transform duration-200 hover:scale-105 hover:shadow-2xl">
            <span className="material-icons text-or text-3xl mb-1" aria-hidden="true">people_outline</span>
            <span className="text-or text-2xl font-bold block">+1200 clients</span>
            <span className="text-or-light text-base">accompagnés</span>
          </div>
          <div className="bg-[#232323] rounded-xl px-6 py-5 shadow-lg text-center flex-1 transition-transform duration-200 hover:scale-105 hover:shadow-2xl">
            <span className="material-icons text-or text-3xl mb-1" aria-hidden="true">attach_money</span>
            <span className="text-or text-2xl font-bold block">+57,5 Mds FCFA</span>
            <span className="text-or-light text-base">financés</span>
          </div>
          <div className="bg-[#232323] rounded-xl px-6 py-5 shadow-lg text-center flex-1 transition-transform duration-200 hover:scale-105 hover:shadow-2xl">
            <span className="material-icons text-or text-3xl mb-1" aria-hidden="true">public</span>
            <span className="text-or text-2xl font-bold block">4 pays</span>
            <span className="text-or-light text-base">d&apos;intervention</span>
          </div>
        </div>
        <div className="border-t border-[#232323] my-8"></div>
      </section>

      {/* Call to action */}
      <div className="text-center mt-14">
        <div className="mb-4 text-xl font-semibold text-or-light">
          Prêt à donner vie à vos ambitions ? Notre équipe d&apos;experts vous accompagne à chaque étape.
        </div>
        <Link
          to="/contact"
          className="inline-block bg-or text-noir font-bold px-14 py-5 rounded-xl text-xl shadow-lg hover:bg-[#FFD580] hover:scale-110 hover:text-noir transition-all duration-200 border-2 border-or animate-bounce"
        >
          Contactez-nous
        </Link>
      </div>
    </div>
  );
}
