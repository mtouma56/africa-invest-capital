import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast';
import { supabase } from '../../config/supabaseClient';
import Input from '../../components/common/Input';

const Contact = () => {
  const [loading, setLoading] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm();

  const onSubmit = async ({ name, email, phone, subject, message }) => {
    setLoading(true);
    try {
      const { error } = await supabase
        .from('contact_messages')
        .insert([
          {
            name,
            email,
            phone,
            subject,
            message,
            status: 'unread',
            created_at: new Date()
          }
        ]);
      if (error) throw error;
      toast.success('Votre message a été envoyé avec succès');
      reset();
    } catch (error) {
      toast.error('Une erreur s\'est produite. Veuillez réessayer.');
      console.error('Erreur lors de l\'envoi du message:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[#181818] text-or-light min-h-screen">
      {/* Nouveau Header Premium */}
      <div className="max-w-3xl mx-auto px-4">
        <div className="flex flex-col items-center justify-center mt-0 mb-4">
          <h1 className="text-or font-extrabold text-4xl sm:text-5xl text-center mt-4">Contactez-nous</h1>
          <p className="text-or-light text-xl text-center mt-4 mb-8">
            Notre équipe est à votre disposition pour répondre à toutes vos questions et vous accompagner dans vos projets.
          </p>
        </div>
      </div>

      {/* Formulaire de contact premium */}
      <div className="py-8 px-4 sm:px-6 lg:px-8 flex flex-col gap-16">
        <div className="bg-[#232323] p-8 rounded-xl shadow-lg max-w-2xl mx-auto w-full">
          <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 gap-y-6">
            <Input
              label="Nom complet *"
              placeholder="Votre nom complet"
              className="bg-[#232323] text-or-light border-or placeholder-or-light"
              {...register('name', { required: 'Le nom est obligatoire' })}
              error={errors.name?.message}
            />
            <Input
              label="E-mail *"
              type="email"
              placeholder="Votre adresse e-mail"
              className="bg-[#232323] text-or-light border-or placeholder-or-light"
              {...register('email', {
                required: 'Adresse e-mail obligatoire',
                pattern: {
                  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  message: 'Adresse e-mail invalide'
                }
              })}
              error={errors.email?.message}
            />
            <Input
              label="Téléphone"
              type="text"
              placeholder="Votre numéro de téléphone"
              className="bg-[#232323] text-or-light border-or placeholder-or-light"
              {...register('phone')}
              error={errors.phone?.message}
            />
            <Input
              label="Sujet"
              placeholder="Sujet du message"
              className="bg-[#232323] text-or-light border-or placeholder-or-light"
              {...register('subject')}
              error={errors.subject?.message}
            />
            <Input
              label="Message *"
              placeholder="Votre message"
              className="bg-[#232323] text-or-light border-or placeholder-or-light"
              {...register('message', { required: 'Le message est obligatoire' })}
              error={errors.message?.message}
              as="textarea"
              rows={4}
            />
            <div>
              <button
                type="submit"
                disabled={loading}
                className={`bg-noir text-or font-bold px-8 py-3 rounded-lg hover:bg-or hover:text-noir transition w-full ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
              >
                {loading ? 'Envoi en cours...' : 'Envoyer'}
              </button>
            </div>
          </form>
        </div>

        {/* Informations de contact premium */}
        <div className="bg-[#181818]">
          <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-lg mx-auto md:max-w-none md:grid md:grid-cols-3 md:gap-8">
              <div>
                <h3 className="text-lg font-bold text-or">Siège social</h3>
                <div className="mt-3">
                  <p className="text-base text-or-light">
                    123 Rue Principale<br />
                    Plateau, Abidjan<br />
                    Côte d'Ivoire
                  </p>
                </div>
                <div className="mt-6">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <svg className="h-6 w-6 text-or" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                    </div>
                    <div className="ml-3 text-base text-or-light">
                      <p>+225 27 22 123 456</p>
                    </div>
                  </div>
                  <div className="mt-3 flex">
                    <div className="flex-shrink-0">
                      <svg className="h-6 w-6 text-or" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <div className="ml-3 text-base text-or-light">
                      <p>contact@africainvestcapital.com</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="mt-12 md:mt-0">
                <h3 className="text-lg font-bold text-or">Bureau de Dakar</h3>
                <div className="mt-3">
                  <p className="text-base text-or-light">
                    456 Avenue de la République<br />
                    Dakar<br />
                    Sénégal
                  </p>
                </div>
                <div className="mt-6">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <svg className="h-6 w-6 text-or" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                    </div>
                    <div className="ml-3 text-base text-or-light">
                      <p>+221 33 456 789</p>
                    </div>
                  </div>
                  <div className="mt-3 flex">
                    <div className="flex-shrink-0">
                      <svg className="h-6 w-6 text-or" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <div className="ml-3 text-base text-or-light">
                      <p>dakar@africainvestcapital.com</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="mt-12 md:mt-0">
                <h3 className="text-lg font-bold text-or">Bureau de Lomé</h3>
                <div className="mt-3">
                  <p className="text-base text-or-light">
                    789 Boulevard de l'Indépendance<br />
                    Lomé<br />
                    Togo
                  </p>
                </div>
                <div className="mt-6">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <svg className="h-6 w-6 text-or" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                    </div>
                    <div className="ml-3 text-base text-or-light">
                      <p>+228 22 789 123</p>
                    </div>
                  </div>
                  <div className="mt-3 flex">
                    <div className="flex-shrink-0">
                      <svg className="h-6 w-6 text-or" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <div className="ml-3 text-base text-or-light">
                      <p>lome@africainvestcapital.com</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Carte Map premium */}
        <div className="bg-[#232323] rounded-xl shadow-lg max-w-4xl mx-auto mt-12 mb-16 p-8">
          <h2 className="text-center text-3xl font-extrabold text-or">Trouvez-nous</h2>
          <p className="mt-4 text-center text-lg text-or-light">
            Visitez l'un de nos bureaux en Afrique de l'Ouest
          </p>
          <div className="mt-10 h-96 rounded-lg overflow-hidden shadow-lg">
            <iframe
              width="100%"
              height="100%"
              title="map"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15888.792811040539!2d-4.024326722509766!3d5.321357900000001!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xfc1eb8b14f80403%3A0xf47fe3313deee7c1!2sPlateau%2C%20Abidjan!5e0!3m2!1sfr!2sci!4v1651767712343!5m2!1sfr!2sci"
              style={{ border: 0 }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;