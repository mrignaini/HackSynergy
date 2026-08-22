import React from 'react';
import { HardHat, Users, ArrowRight, ShieldCheck, CheckCircle, Lock, Bell, Sparkles, TrendingUp } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { CTAButton } from '../common/CTAButton';

export const HeroSection: React.FC = () => {
  const { t, language } = useLanguage();

  return (
    <section className="relative overflow-hidden pt-8 pb-16 lg:pt-12 lg:pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Column - Main Copy & CTAs */}
          <div className="lg:col-span-7 space-y-8 text-left">
            
            {/* Tag Badge */}
            <div className="inline-flex items-center gap-2 px-1.5 py-1 rounded-full bg-amber-100/70 border border-amber-300/60 shadow-xs">
              <span className="px-3 py-1 rounded-full bg-[#EAA228] text-slate-950 text-xs font-bold tracking-tight shadow-xs">
                {t('heroBadge')}
              </span>
              <span className="flex items-center gap-1 text-xs font-semibold text-slate-800 pr-3">
                <ArrowRight className="w-3.5 h-3.5 text-slate-600 inline" />
                <span>{t('heroBadgeArrow')}</span>
              </span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-[54px] font-extrabold text-[#0B132B] tracking-tight leading-[1.15]">
              {language === 'hi' ? (
                <>
                  लेबर चौक से <br />
                  <span className="relative text-[#EAA228] inline-block mt-1">
                    डिजिटल पहचान तक
                    <span className="absolute -bottom-1 left-0 w-full h-[5px] bg-[#EAA228] rounded-full" />
                  </span>
                </>
              ) : (
                <>
                  From Labour Chowk to <br />
                  <span className="relative text-[#EAA228] inline-block mt-1">
                    Digital Identity
                    <span className="absolute -bottom-1 left-0 w-full h-[5px] bg-[#EAA228] rounded-full" />
                  </span>
                </>
              )}
            </h1>

            {/* Description Paragraph */}
            <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-2xl font-normal">
              {t('heroDescription')}
            </p>

            {/* Dual CTAs (Find Work & Hire Worker) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-xl pt-2">
              {/* Primary Amber Card Button: काम खोजें */}
              <CTAButton
                to="/find-work"
                variant="primary-amber"
                icon={<HardHat className="w-6 h-6 text-slate-900" />}
                title={t('findWorkCta')}
                subtext={t('findWorkSubtext')}
                className="w-full"
              />

              {/* Secondary White Card Button: कामगार को काम पर रखें */}
              <CTAButton
                to="/hire-workers"
                variant="secondary-white"
                icon={<Users className="w-6 h-6 text-slate-800" />}
                title={t('hireWorkerCta')}
                subtext={t('hireWorkerSubtext')}
                className="w-full"
              />
            </div>

            {/* Trust Badges */}
            <div className="flex flex-wrap items-center gap-y-3 gap-x-6 pt-4 text-xs sm:text-sm font-medium text-slate-700">
              <div className="inline-flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-emerald-600 stroke-[2.2]" />
                <span>{t('trustedPlatform')}</span>
              </div>
              <div className="inline-flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-emerald-600 stroke-[2.2]" />
                <span>{t('verifiedProfiles')}</span>
              </div>
              <div className="inline-flex items-center gap-2">
                <Lock className="w-5 h-5 text-slate-700 stroke-[2.2]" />
                <span>{t('secureSafe')}</span>
              </div>
            </div>

          </div>

          {/* Right Column - Visual Mockup Composition */}
          <div className="lg:col-span-5 relative">
            
            {/* Main Outer Container */}
            <div className="relative rounded-[32px] bg-gradient-to-b from-[#F5F3EF] to-[#EDE9E1] p-3.5 sm:p-5 border border-slate-200/90 shadow-2xl shadow-slate-900/10 overflow-hidden">
              
              {/* Top Verified Badge */}
              <div className="flex justify-start mb-3">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/90 backdrop-blur-xs border border-slate-200 text-xs font-semibold text-slate-800 shadow-2xs">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span>Verified Profiles • 100% सत्यापित प्रोफाइल</span>
                </div>
              </div>

              {/* Composition Stack */}
              <div className="relative min-h-[380px] sm:min-h-[420px] rounded-2xl overflow-hidden bg-gradient-to-br from-amber-50/70 via-orange-50/40 to-slate-100/80 p-3 sm:p-4 flex items-end">
                
                {/* Background Construction Workers & Site Graphic */}
                <div className="absolute inset-0 z-0">
                  {/* Subtle Construction Crane Lines */}
                  <svg className="absolute right-2 top-2 w-32 h-32 opacity-20 text-slate-400" viewBox="0 0 100 100" fill="none" stroke="currentColor">
                    <path d="M10 90 L50 20 L90 90 Z" strokeWidth="1.5" />
                    <line x1="50" y1="20" x2="95" y2="20" strokeWidth="2" />
                    <line x1="80" y1="20" x2="80" y2="60" strokeWidth="1.5" />
                    <circle cx="50" cy="20" r="3" fill="currentColor" />
                  </svg>

                  {/* High Quality Styled Worker Illustration Avatar Group */}
                  <div className="absolute right-0 top-6 bottom-0 w-3/5 flex flex-col items-center justify-center opacity-95 pointer-events-none">
                    <div className="relative w-full h-full flex items-center justify-center">
                      
                      {/* Secondary Worker in background */}
                      <div className="absolute right-2 top-10 flex flex-col items-center opacity-75 transform scale-90">
                        <div className="w-16 h-16 rounded-full bg-amber-200 border-2 border-white shadow-md flex items-center justify-center text-amber-800 text-xl font-bold">
                          👷🏽
                        </div>
                      </div>

                      {/* Primary Smiling Indian Construction Worker */}
                      <div className="relative z-10 flex flex-col items-center text-center">
                        <div className="relative">
                          <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-full bg-gradient-to-b from-amber-300 to-amber-500 border-4 border-white shadow-xl flex items-center justify-center text-5xl overflow-hidden">
                            <span className="transform translate-y-1 scale-110">👷🏽‍♂️</span>
                          </div>
                          {/* Verified Check Badge on Avatar */}
                          <div className="absolute bottom-1 right-1 w-7 h-7 rounded-full bg-emerald-500 border-2 border-white flex items-center justify-center text-white shadow-sm">
                            <CheckCircle className="w-4 h-4 stroke-[3]" />
                          </div>
                        </div>
                        <div className="mt-2 px-3 py-0.5 rounded-full bg-white/95 backdrop-blur-xs border border-amber-300 shadow-sm">
                          <span className="text-[11px] font-bold text-slate-900">रमेश (राजमिस्त्री)</span>
                        </div>
                      </div>

                    </div>
                  </div>
                </div>

                {/* Smartphone Mockup (Left overlay in composition) */}
                <div className="relative z-10 w-[62%] sm:w-[58%] rounded-2xl bg-white border border-slate-200/90 shadow-2xl p-2.5 sm:p-3 transform -rotate-1 hover:rotate-0 transition-transform duration-300">
                  
                  {/* Phone Header */}
                  <div className="flex items-center justify-between border-b border-slate-100 pb-2 mb-2">
                    <div>
                      <div className="text-[11px] font-extrabold text-slate-900 leading-tight">Namaste, Ramesh!</div>
                      <div className="text-[9px] text-slate-400">Good morning</div>
                    </div>
                    <div className="p-1 rounded-full bg-slate-50 text-slate-400">
                      <Bell className="w-3 h-3" />
                    </div>
                  </div>

                  {/* Digital Income Identity Pill */}
                  <div className="p-2 rounded-xl bg-gradient-to-r from-amber-50/90 to-amber-100/50 border border-amber-200/80 mb-2 flex items-center justify-between">
                    <div>
                      <div className="text-[10px] font-bold text-slate-900">Digital Income Identity</div>
                      <div className="text-[8px] text-slate-600">Build your identity. Grow your future.</div>
                    </div>
                    <div className="w-5 h-5 rounded-full bg-emerald-500 text-white flex items-center justify-center shadow-xs">
                      <ShieldCheck className="w-3 h-3 stroke-[2.5]" />
                    </div>
                  </div>

                  {/* 4 Quick Actions in Mini Phone */}
                  <div className="grid grid-cols-4 gap-1 mb-2 text-center">
                    <div className="p-1 rounded-lg bg-amber-50 flex flex-col items-center">
                      <HardHat className="w-3 h-3 text-amber-600" />
                      <span className="text-[7px] font-semibold text-slate-700 mt-0.5">Find Work</span>
                    </div>
                    <div className="p-1 rounded-lg bg-orange-50 flex flex-col items-center">
                      <span className="text-[10px]">💼</span>
                      <span className="text-[7px] font-semibold text-slate-700 mt-0.5">My Jobs</span>
                    </div>
                    <div className="p-1 rounded-lg bg-emerald-50 flex flex-col items-center">
                      <span className="text-[10px]">👛</span>
                      <span className="text-[7px] font-semibold text-slate-700 mt-0.5">Income</span>
                    </div>
                    <div className="p-1 rounded-lg bg-yellow-50 flex flex-col items-center">
                      <Sparkles className="w-3 h-3 text-amber-500" />
                      <span className="text-[7px] font-semibold text-slate-700 mt-0.5">AI Saathi</span>
                    </div>
                  </div>

                  {/* Mini Overview Card in Phone */}
                  <div className="p-2 rounded-xl bg-[#0B132B] text-white">
                    <div className="flex items-center justify-between text-[8px] text-slate-400 mb-0.5">
                      <span>Overview</span>
                      <span className="px-1 py-0.2 rounded bg-white/10 text-slate-300">This Month</span>
                    </div>
                    <div className="flex items-baseline justify-between">
                      <div>
                        <div className="text-sm font-extrabold text-white">₹18,500</div>
                        <div className="text-[7px] text-emerald-400 flex items-center gap-0.5">
                          <TrendingUp className="w-2 h-2" />
                          <span>+8.4% vs last month</span>
                        </div>
                      </div>
                      {/* Mini Sparkline Curve */}
                      <svg className="w-12 h-5" viewBox="0 0 50 20" fill="none">
                        <path d="M2 16 Q15 15, 25 8 T48 3" stroke="#10B981" strokeWidth="2" strokeLinecap="round" />
                      </svg>
                    </div>
                  </div>

                </div>

              </div>

              {/* Bottom Dark Navy Banner Overlay */}
              <div className="relative mt-2.5 rounded-2xl bg-[#0B132B] text-white p-3.5 sm:p-4 overflow-hidden border border-slate-800 shadow-lg">
                
                <div className="relative z-10 flex items-center justify-between pr-8">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-amber-500 text-slate-950 flex items-center justify-center font-bold shadow-md">
                      <HardHat className="w-5 h-5 stroke-[2.2]" />
                    </div>
                    <div>
                      <div className="text-xs sm:text-sm font-black tracking-wide uppercase text-white font-sans">
                        FROM LABOUR CHOWK → TO DIGITAL IDENTITY
                      </div>
                      <div className="text-[10px] text-amber-400/90 font-medium">
                        to Digital Identity
                      </div>
                    </div>
                  </div>
                </div>

                <div className="relative z-10 mt-2.5 flex items-center">
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-950 text-emerald-400 text-[11px] font-semibold border border-emerald-800/80">
                    <CheckCircle className="w-3 h-3 stroke-[2.5]" />
                    <span>सुरक्षित एवं भरोसेमंद</span>
                  </span>
                </div>

                {/* Diagonal Hazard Stripes in Bottom Right Corner matching screenshot */}
                <div className="absolute right-0 bottom-0 w-24 h-8 hazard-stripe-pattern transform rotate-12 translate-x-3 translate-y-2 opacity-90 rounded-sm" />
              </div>

            </div>

          </div>

        </div>
      </div>
    </section>
  );
};
