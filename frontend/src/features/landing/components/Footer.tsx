import { Landmark } from 'lucide-react';
import { FOOTER, NAVBAR } from '../constants/content';

export default function Footer() {
  return (
    <footer className="bg-slate-950 border-t border-slate-900 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 pb-8 border-b border-slate-900">
          {/* Logo / Brand */}
          <div className="flex items-center space-x-2 text-blue-400">
            <Landmark className="h-5 w-5" />
            <span className="font-bold text-white tracking-tight">{NAVBAR.brand}</span>
          </div>

          {/* Quick links */}
          <div className="flex space-x-6">
            {NAVBAR.links.map((link, idx) => (
              <a
                key={idx}
                href={link.href}
                className="text-slate-500 hover:text-slate-300 text-sm font-medium transition-colors"
              >
                {link.label}
              </a>
            ))}
          </div>
        </div>

        <div className="flex flex-col md:flex-row items-center justify-between gap-4 pt-8 text-center md:text-left">
          <p className="text-slate-600 text-xs sm:text-sm">
            {FOOTER.copyright}
          </p>
          <p className="text-slate-600 text-xs max-w-md leading-relaxed md:text-right">
            {FOOTER.disclaimer}
          </p>
        </div>
      </div>
    </footer>
  );
}
