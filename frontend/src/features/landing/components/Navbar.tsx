import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Landmark, Globe, ChevronDown } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export default function Navbar() {
  const { language, setLanguage, t } = useLanguage();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const languages = [
    { code: 'en', label: 'English' },
    { code: 'hi', label: 'Hindi (हिन्दी)' },
    { code: 'ta', label: 'Tamil (தமிழ்)' },
    { code: 'kn', label: 'Kannada (ಕನ್ನಡ)' }
  ];

  const currentLangLabel = languages.find(l => l.code === language)?.label || 'English';

  const selectLanguage = (code: string) => {
    setLanguage(code);
    setDropdownOpen(false);
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-[#FAF9F6]/80 backdrop-blur-md border-b border-slate-200/80 transition-all duration-300 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          
          {/* Logo / Brand */}
          <Link to="/" className="flex items-center space-x-2.5 text-slate-900 hover:text-slate-700 transition-colors">
            <Landmark className="h-5 w-5 text-slate-950" />
            <span className="font-black text-slate-950 uppercase tracking-wider text-sm sm:text-base">
              {t('brandName')}
            </span>
          </Link>

          {/* Nav Links (Desktop) */}
          <div className="hidden md:flex items-center space-x-8 text-xs font-bold uppercase tracking-wider">
            <a href="#home" className="text-slate-600 hover:text-slate-950 transition-colors">
              {t('navHome')}
            </a>
            <a href="#how-it-works" className="text-slate-600 hover:text-slate-950 transition-colors">
              {t('navHowItWorks')}
            </a>
            <a href="#features" className="text-slate-600 hover:text-slate-950 transition-colors">
              {t('navFeatures')}
            </a>
            <Link to="/dashboard" className="text-slate-600 hover:text-slate-950 transition-colors">
              {t('navDashboard')}
            </Link>
          </div>

          {/* Action Area (Language Selector & CTA) */}
          <div className="flex items-center gap-4">
            
            {/* Custom Language Dropdown Selector */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 hover:text-slate-900 text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer"
              >
                <Globe className="h-3.5 w-3.5 text-slate-500" />
                <span>{currentLangLabel}</span>
                <ChevronDown className={`h-3 w-3 text-slate-400 transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 rounded-2xl bg-white border border-slate-200 shadow-xl py-2 z-50 animate-fadeIn text-xs font-semibold">
                  {languages.map((lang) => (
                    <button
                      key={lang.code}
                      type="button"
                      onClick={() => selectLanguage(lang.code)}
                      className={`w-full text-left px-4 py-2.5 hover:bg-slate-55 transition-colors cursor-pointer ${
                        language === lang.code ? 'text-slate-950 font-bold bg-slate-50' : 'text-slate-600'
                      }`}
                    >
                      {lang.label}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* CTA Button */}
            <Link
              to="/submit"
              className="inline-flex items-center justify-center px-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider text-white bg-slate-950 hover:bg-slate-800 transition-colors shadow-md hover:scale-[1.02]"
            >
              {t('navReportIssue')}
            </Link>
          </div>

        </div>
      </div>
    </nav>
  );
}
