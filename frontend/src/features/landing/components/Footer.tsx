import { Landmark } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export default function Footer() {
  const { t } = useLanguage();

  return (
    <footer className="bg-white border-t border-slate-200 py-12 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 pb-8 border-b border-slate-100">
          
          {/* Logo / Brand */}
          <div className="flex items-center space-x-2.5 text-slate-900">
            <Landmark className="h-5 w-5 text-slate-950" />
            <span className="font-black text-slate-950 tracking-tight uppercase text-xs sm:text-sm">{t('brandName')}</span>
          </div>

          {/* Quick links */}
          <div className="flex space-x-6 text-[10px] font-bold uppercase tracking-wider">
            <a href="#home" className="text-slate-500 hover:text-slate-950 transition-colors">
              {t('navHome')}
            </a>
            <a href="#how-it-works" className="text-slate-500 hover:text-slate-950 transition-colors">
              {t('navHowItWorks')}
            </a>
            <a href="#features" className="text-slate-500 hover:text-slate-950 transition-colors">
              {t('navFeatures')}
            </a>
          </div>
        </div>

        <div className="flex flex-col md:flex-row items-center justify-between gap-4 pt-8 text-center md:text-left text-[11px]">
          <p className="text-slate-500 font-bold uppercase tracking-wider">
            {t('footerCopyright')}
          </p>
          <p className="text-slate-500 max-w-lg leading-relaxed md:text-right font-medium">
            {t('footerDisclaimer')}
          </p>
        </div>
      </div>
    </footer>
  );
}
