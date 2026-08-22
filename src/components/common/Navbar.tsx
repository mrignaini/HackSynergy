import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { HardHat, User, Settings, Menu, X } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { LanguageSelector } from './LanguageSelector';

export const Navbar: React.FC = () => {
  const { t, language } = useLanguage();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { name: t('navHome'), path: '/' },
    { name: t('navFindWork'), path: '/find-work' },
    { name: t('navHireWorkers'), path: '/hire-workers' },
    { name: t('navHowItWorks'), path: '/how-it-works' },
    { name: t('navAboutUs'), path: '/about' },
    { name: t('navAiSaathi'), path: '/ai-saathi' },
  ];

  const isActive = (path: string) => {
    if (path === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(path);
  };

  return (
    <header className="sticky top-0 z-40 bg-[#FAF9F6]/95 backdrop-blur-md border-b border-slate-200/70 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Brand Logo */}
          <Link to="/" className="flex items-center gap-3 group focus:outline-none">
            <div className="relative flex items-center justify-center w-11 h-11 rounded-xl bg-gradient-to-br from-[#0B132B] to-[#1E293B] shadow-md border border-slate-700/50 group-hover:scale-105 transition-transform duration-200">
              {/* Construction Hardhat & Tools Graphic */}
              <div className="relative flex items-center justify-center">
                <HardHat className="w-6 h-6 text-amber-400 stroke-[2.2]" />
                <div className="absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full bg-emerald-500 border-2 border-[#0B132B] flex items-center justify-center">
                  <div className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                </div>
              </div>
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-1.5">
                <span className="text-2xl font-extrabold tracking-tight text-[#0B132B] font-sans">
                  SHRAMIKK
                </span>
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-amber-100 text-amber-800 tracking-wider">
                  श्रमिक
                </span>
              </div>
              <span className="text-[10px] text-slate-500 font-medium tracking-tight -mt-0.5">
                {language === 'hi' ? 'लेबर चौक से डिजिटल पहचान तक' : 'From Labour Chowk to Digital Identity'}
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center space-x-7">
            {navLinks.map((link) => {
              const active = isActive(link.path);
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`relative py-2 text-[15px] font-medium transition-colors duration-150 ${
                    active
                      ? 'text-amber-600 font-semibold'
                      : 'text-slate-700 hover:text-slate-900'
                  }`}
                >
                  {link.name}
                  {active && (
                    <span className="absolute bottom-0 left-0 right-0 h-[2.5px] bg-amber-500 rounded-full animate-in fade-in" />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Right Action Items */}
          <div className="hidden sm:flex items-center space-x-3.5">
            {/* Language Selector */}
            <LanguageSelector />

            {/* Admin Link */}
            <Link
              to="/admin"
              className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium text-slate-600 hover:text-slate-900 transition-colors"
            >
              <span>{t('navAdmin')}</span>
              <Settings className="w-3.5 h-3.5 text-slate-400" />
            </Link>

            {/* Login / Register CTA */}
            <Link
              to="/login"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#0B132B] text-white text-sm font-semibold hover:bg-[#15224D] shadow-sm hover:shadow transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0"
            >
              <User className="w-4 h-4 text-slate-300" />
              <span>{t('navLoginRegister')}</span>
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center gap-2 lg:hidden">
            <LanguageSelector />
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-700 hover:bg-slate-100 focus:outline-none"
              aria-label="Toggle Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-200 bg-white/95 px-4 pt-3 pb-6 space-y-2 shadow-lg animate-in slide-in-from-top-2 duration-150">
          {navLinks.map((link) => {
            const active = isActive(link.path);
            return (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setMobileMenuOpen(false)}
                className={`block px-3 py-2 rounded-lg text-base font-medium ${
                  active
                    ? 'bg-amber-50 text-amber-700 font-semibold'
                    : 'text-slate-700 hover:bg-slate-50'
                }`}
              >
                {link.name}
              </Link>
            );
          })}
          <div className="pt-3 border-t border-slate-100 flex flex-col gap-2.5">
            <Link
              to="/admin"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-between px-3 py-2 text-sm text-slate-600 hover:bg-slate-50 rounded-lg"
            >
              <span>{t('navAdmin')}</span>
              <Settings className="w-4 h-4 text-slate-400" />
            </Link>
            <Link
              to="/login"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-full bg-[#0B132B] text-white text-sm font-semibold shadow-sm"
            >
              <User className="w-4 h-4 text-slate-300" />
              <span>{t('navLoginRegister')}</span>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};
