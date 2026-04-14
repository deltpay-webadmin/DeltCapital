import { useState } from 'react';
import { ChevronLeft, ChevronRight, Calculator, TrendingUp, ArrowRight } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { PageHero } from './ui/PageHero';
import aboutImg1 from 'figma:asset/68f86b0d89444881cf06380344679174c53eeb19.png';
import aboutImg2 from 'figma:asset/d73b4dddaa745c3faa72080f1499fd21a9cf54e8.png';
import aboutImg3 from 'figma:asset/f5ccd74163d0490f9ca85ece7845b949e8675f69.png';
import aboutImg4 from 'figma:asset/618b03a51783dfb37dd9183d1327dc91ef869d9f.png';

interface AboutPageProps {
  onClose: () => void;
  onApplyClick: () => void;
  onCalculatorClick?: () => void;
  onReviewsClick?: () => void;
  onWinsClick?: () => void;
}

export function AboutPage({ onClose, onApplyClick, onCalculatorClick, onReviewsClick, onWinsClick }: AboutPageProps) {
  const { language } = useLanguage();
  const [activeSlide, setActiveSlide] = useState(0);

  const content = {
    en: {
      hero: {
        title: "Empower your business.",
        subtitle: "Grow with confidence.",
        accent: "Thrive."
      },
      whoWeAre: "Who We Are",
      slides: [
        {
          title: "We're one team",
          description: "We lead with empathy and treat others with respect. We play a team sport, and our success is dependent on all of us working together and lifting each other up. We help each other however we can, push each other to excel, and pick each other up when we fall."
        },
        {
          title: "We embrace an ownership mindset",
          description: "We each play a role in the success of Delt. We're decisive, we own the outcome, and when we see a problem, we jump in to help solve it. We seek frontline perspectives and consider the impact of our work beyond our direct team. We spend the company's finite resources on what matters the most."
        },
        {
          title: "We're driven by purpose and impact",
          description: "We get stuff done with agility, integrity, and a sense of urgency. We dive deep, regardless of our job or level, and understand the details. We create focus with clear goals aligned to our mission and purpose, and clarity on the path to achieve them."
        },
        {
          title: "We're all in customer success",
          description: "We seek to understand our customers' diverse needs and goals, deliver them exceptional products and services, and work hard to earn and keep their trust. Every interaction matters, and we're committed to helping businesses access the capital they need to grow and succeed."
        }
      ]
    },
    es: {
      hero: {
        title: "Empodera tu negocio.",
        subtitle: "Crece con confianza.",
        accent: "Prospera."
      },
      whoWeAre: "Quiénes Somos",
      slides: [
        {
          title: "Somos un equipo",
          description: "Lideramos con empatía y tratamos a los demás con respeto. Jugamos un deporte de equipo, y nuestro éxito depende de que todos trabajemos juntos y nos apoyemos mutuamente. Nos ayudamos de cualquier manera posible, nos impulsamos a sobresalir y nos levantamos cuando caemos."
        },
        {
          title: "Adoptamos una mentalidad de propiedad",
          description: "Cada uno juega un papel en el éxito de Delt. Somos decisivos, somos dueños del resultado, y cuando vemos un problema, saltamos para ayudar a resolverlo. Buscamos perspectivas de primera línea y consideramos el impacto de nuestro trabajo más allá de nuestro equipo directo."
        },
        {
          title: "Nos impulsa el propósito y el impacto",
          description: "Hacemos las cosas con agilidad, integridad y sentido de urgencia. Profundizamos, independientemente de nuestro trabajo o nivel, y entendemos los detalles. Creamos enfoque con objetivos claros alineados con nuestra misión y propósito."
        },
        {
          title: "Todos estamos en el éxito del cliente",
          description: "Buscamos comprender las diversas necesidades y objetivos de nuestros clientes, entregarles productos y servicios excepcionales, y trabajar duro para ganar y mantener su confianza. Cada interacción importa."
        }
      ]
    }
  };

  const t = content[language];

  const images = [
    aboutImg1,
    aboutImg2,
    aboutImg3,
    aboutImg4
  ];

  const nextSlide = () => {
    setActiveSlide((prev) => (prev + 1) % t.slides.length);
  };

  const prevSlide = () => {
    setActiveSlide((prev) => (prev - 1 + t.slides.length) % t.slides.length);
  };

  return (
    <div className="min-h-screen bg-white">
      <PageHero
        eyebrow="About Delt"
        lead={`${t.hero.title} ${t.hero.subtitle}`}
        accent={t.hero.accent}
      />

      {/* Who We Are Section */}
      <section className="py-24 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-[#041E42] dark:text-white mb-16">
            {t.whoWeAre}
          </h2>

          {/* Carousel Container */}
          <div className="relative max-w-6xl mx-auto">
            {/* Slide Content */}
            <div className="flex flex-col md:flex-row items-center gap-8 md:gap-12 mb-12">
              {/* Image */}
              <div className="w-full md:w-1/2">
                <img
                  src={images[activeSlide]}
                  alt={t.slides[activeSlide].title}
                  className="w-full h-[350px] object-cover rounded-2xl shadow-lg"
                />
              </div>

              {/* Text Content */}
              <div className="w-full md:w-1/2">
                <h3 className="text-xl md:text-2xl lg:text-3xl font-bold text-[#041E42] dark:text-white mb-6">
                  {t.slides[activeSlide].title}
                </h3>
                <p className="text-base md:text-lg lg:text-xl text-gray-700 dark:text-gray-300 leading-relaxed">
                  {t.slides[activeSlide].description}
                </p>
              </div>
            </div>

            {/* Navigation */}
            <div className="flex items-center justify-center gap-8">
              {/* Prev Button */}
              <button
                onClick={prevSlide}
                className="w-12 h-12 rounded-full bg-[#4945ff]/15 hover:bg-[#4945ff]/25 text-[#4945ff] flex items-center justify-center transition-all shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={activeSlide === 0}
              >
                <ChevronLeft className="w-6 h-6" />
              </button>

              {/* Dots */}
              <div className="flex gap-2">
                {t.slides.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setActiveSlide(index)}
                    className={`h-2 rounded-full transition-all ${
                      index === activeSlide
                        ? 'w-8 bg-[#041E42] dark:bg-white'
                        : 'w-2 bg-gray-300 dark:bg-gray-600'
                    }`}
                    aria-label={`Go to slide ${index + 1}`}
                  />
                ))}
              </div>

              {/* Next Button */}
              <button
                onClick={nextSlide}
                className="w-12 h-12 rounded-full bg-[#4945ff] hover:bg-[#3b38d9] text-white flex items-center justify-center transition-all shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={activeSlide === t.slides.length - 1}
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-4 bg-white text-center">
        <div className="max-w-4xl mx-auto">
          <h2
            className="text-4xl md:text-5xl font-bold text-[#041E42] mb-5 tracking-tight leading-[1.05]"
            style={{ fontFamily: '"Codec Pro", sans-serif' }}
          >
            Ready to <span className="serif-italic text-[#4945ff]">grow</span> your business?
          </h2>
          <p className="text-lg md:text-xl text-[#52606D] mb-10 max-w-2xl mx-auto">
            Join thousands of businesses that trust Delt Capital for fast, flexible funding solutions.
          </p>

          {/* Primary CTA */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={() => {
                onClose();
                setTimeout(() => onApplyClick(), 100);
              }}
              className="group inline-flex items-center gap-2 rounded-full px-7 py-3.5 text-white font-semibold transition-all hover:scale-[1.02] hover:shadow-[0_10px_30px_-10px_rgba(73,69,255,0.8)]"
              style={{
                background: 'linear-gradient(180deg, #5b57ff 0%, #4945ff 55%, #3e3add 100%)',
                boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.22), 0 8px 24px -10px rgba(73,69,255,0.6)',
              }}
            >
              Get your funding offer
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
            </button>
          </div>

          {/* Secondary Options */}
          <div className="grid md:grid-cols-2 gap-4 max-w-2xl mx-auto mt-10">
            {onCalculatorClick && (
              <button
                onClick={() => {
                  onClose();
                  setTimeout(() => onCalculatorClick(), 100);
                }}
                className="card-lift bg-white border border-[#E4E7EB] text-[#041E42] px-6 py-4 rounded-2xl font-semibold hover:border-[#4945ff]/40 transition-all flex items-center justify-center gap-2"
                style={{ boxShadow: 'var(--shadow-soft-1)' }}
              >
                <Calculator className="w-5 h-5 text-[#4945ff]" />
                Calculator
              </button>
            )}

            {onWinsClick && (
              <button
                onClick={() => {
                  onClose();
                  setTimeout(() => onWinsClick(), 100);
                }}
                className="card-lift bg-white border border-[#E4E7EB] text-[#041E42] px-6 py-4 rounded-2xl font-semibold hover:border-[#4945ff]/40 transition-all flex items-center justify-center gap-2"
                style={{ boxShadow: 'var(--shadow-soft-1)' }}
              >
                <TrendingUp className="w-5 h-5 text-[#4945ff]" />
                View Success Stories
              </button>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}