import Navbar from '../components/Navbar';
import HeroSection from '../components/HeroSection';
import HowItWorks from '../components/HowItWorks';
import FeatureCard from '../components/FeatureCard';
import Footer from '../components/Footer';
import { FEATURES } from '../constants/content';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-white selection:bg-blue-600/30 selection:text-blue-200">
      {/* Navigation */}
      <Navbar />

      {/* Hero Header */}
      <HeroSection />

      {/* How It Works */}
      <HowItWorks />

      {/* Features Grid */}
      <section id="features" className="bg-slate-950 py-20 md:py-28 border-t border-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-4 max-w-3xl mx-auto mb-16 md:mb-24">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              {FEATURES.title}
            </h2>
            <p className="text-slate-400 text-base sm:text-lg">
              {FEATURES.subtitle}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {FEATURES.cards.map((card, idx) => (
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
