import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { HardHat, User, Settings, Menu, X, CreditCard, ShieldCheck } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { useAuth } from '../../context/AuthContext';
import { LanguageSelector } from './LanguageSelector';

export const Navbar: React.FC = () => {
  const { t, language } = useLanguage();
  const { auth } = useAuth();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const paymentPath = '/payments';

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
          <nav className="hidden xl:flex items-center space-x-5 2xl:space-x-7">
            {navLinks.map((link) => {
              const active = isActive(link.path);
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`relative py-2 text-[14.5px] font-medium transition-colors duration-150 whitespace-nowrap ${
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

          {/* Right Action Items — Perfectly Linear & Balanced */}
          <div className="hidden sm:flex items-center gap-2 lg:gap-2.5 shrink-0">
            {/* 1. Language Selector */}
            <LanguageSelector />

            {/* 2. Secure Payments ESCROW Pill Button */}
            <Link
              to={paymentPath}
              className={`inline-flex items-center gap-2 h-9 px-3.5 rounded-full text-xs font-bold border transition-all duration-200 shrink-0 whitespace-nowrap select-none shadow-2xs hover:shadow-xs ${
                location.pathname.includes('/payments')
                  ? 'bg-amber-100 text-amber-950 border-amber-400 ring-2 ring-amber-400/25 shadow-xs scale-[1.01]'
                  : 'bg-amber-50/70 hover:bg-amber-100/90 text-amber-950 border-amber-300 hover:border-amber-400 hover:scale-[1.01]'
              }`}
              title="SHRAMIKK Escrow & Secure Payments Demo"
            >
              <CreditCard className="w-3.5 h-3.5 text-amber-800 shrink-0 stroke-[2.2]" />
              <span className="font-extrabold tracking-tight text-amber-950 text-[12.5px]">
                Payments
              </span>
              <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[9.5px] font-black bg-amber-200/90 text-amber-950 border border-amber-300/80 tracking-wider uppercase">
                <ShieldCheck className="w-2.5 h-2.5 text-amber-800 stroke-[2.5]" />
                <span>ESCROW</span>
              </span>
            </Link>

            {/* 3. Admin Link */}
            <Link
              to="/admin"
              className="inline-flex items-center gap-1 h-9 px-3 rounded-full text-xs font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100 border border-transparent hover:border-slate-200 transition-all whitespace-nowrap"
            >
              <span>{t('navAdmin')}</span>
              <Settings className="w-3.5 h-3.5 text-slate-400" />
            </Link>

            {/* 4. Login / Register CTA */}
            <Link
              to="/login"
              className="inline-flex items-center gap-1.5 h-9 px-4.5 rounded-full bg-[#0B132B] text-white text-xs sm:text-sm font-semibold hover:bg-[#15224D] shadow-sm hover:shadow transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0 whitespace-nowrap"
            >
              <User className="w-3.5 h-3.5 text-slate-300" />
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
              to={paymentPath}
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-between px-3 py-2 text-sm font-semibold text-amber-900 bg-amber-50 rounded-lg border border-amber-200/60"
            >
              <div className="flex items-center gap-2">
                <CreditCard className="w-4 h-4 text-amber-700" />
                <span>Secure Payments (Demo)</span>
              </div>
              <ShieldCheck className="w-4 h-4 text-amber-600" />
            </Link>
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
