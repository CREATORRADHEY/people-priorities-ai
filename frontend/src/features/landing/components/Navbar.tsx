import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, Landmark } from 'lucide-react';
import { NAVBAR } from '../constants/content';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-slate-900/80 backdrop-blur-md border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo / Brand */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2 text-blue-400 hover:text-blue-300 transition-colors">
              <Landmark className="h-6 w-6" />
              <span className="font-bold text-lg text-white tracking-tight">{NAVBAR.brand}</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <div className="flex space-x-6">
              {NAVBAR.links.map((link, idx) => (
                <a
                  key={idx}
                  href={link.href}
                  className="text-slate-300 hover:text-blue-400 font-medium text-sm transition-colors"
                >
                  {link.label}
                </a>
              ))}
            </div>
            <Link
              to="/submit"
              className="inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-lg text-sm font-semibold text-white bg-blue-600 hover:bg-blue-500 transition-all shadow-md shadow-blue-900/30 hover:scale-105"
            >
              {NAVBAR.cta}
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              type="button"
              className="inline-flex items-center justify-center p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 focus:outline-none"
              aria-controls="mobile-menu"
              aria-expanded={isOpen}
            >
              <span className="sr-only">Open main menu</span>
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-slate-900 border-b border-slate-800 px-2 pt-2 pb-3 space-y-1 sm:px-3">
          {NAVBAR.links.map((link, idx) => (
            <a
              key={idx}
              href={link.href}
              onClick={() => setIsOpen(false)}
              className="block px-3 py-2 rounded-lg text-base font-medium text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
            >
              {link.label}
            </a>
          ))}
          <div className="pt-4 pb-2 border-t border-slate-800 px-3">
            <Link
              to="/submit"
              onClick={() => setIsOpen(false)}
              className="block w-full text-center px-4 py-2.5 rounded-lg text-base font-semibold text-white bg-blue-600 hover:bg-blue-500 transition-colors shadow-md"
            >
              {NAVBAR.cta}
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
