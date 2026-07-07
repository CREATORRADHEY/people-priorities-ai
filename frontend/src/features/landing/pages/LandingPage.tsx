import Navbar from '../components/Navbar';
import HeroSection from '../components/HeroSection';
import HowItWorks from '../components/HowItWorks';
import FeatureCard from '../components/FeatureCard';
import Footer from '../components/Footer';
import { useLanguage } from '../context/LanguageContext';

export default function LandingPage() {
  const { t } = useLanguage();

  const cards = [
    {
      title: t('featCard1Title'),
      description: t('featCard1Desc'),
      icon: "Globe"
    },
    {
      title: t('featCard2Title'),
      description: t('featCard2Desc'),
      icon: "Mic"
    },
    {
      title: t('featCard3Title'),
      description: t('featCard3Desc'),
      icon: "Camera"
    },
    {
      title: t('featCard4Title'),
      description: t('featCard4Desc'),
      icon: "MapPin"
    }
  ];

  return (
    <div className="min-h-screen bg-[#FAF9F6] text-slate-900 selection:bg-slate-900/10 selection:text-slate-950 font-sans">
      {/* Navigation */}
      <Navbar />

      {/* Hero Header */}
      <HeroSection />

      {/* How It Works */}
      <HowItWorks />

      {/* Features Grid */}
      <section id="features" className="bg-[#FAF9F6] py-20 md:py-28 border-b border-slate-200/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-4 max-w-3xl mx-auto mb-16 md:mb-24">
            <h2 className="text-3xl sm:text-5xl font-black text-slate-950 tracking-tighter uppercase">
              {t('featTitle')}
            </h2>
            <p className="text-slate-500 text-xs sm:text-sm max-w-2xl mx-auto leading-relaxed font-semibold uppercase tracking-wider">
              {t('featSubtitle')}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {cards.map((card, idx) => (
              <FeatureCard
                key={idx}
                title={card.title}
                description={card.description}
                iconName={card.icon}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
}
