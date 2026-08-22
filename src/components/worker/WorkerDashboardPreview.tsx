import React from 'react';
import { WorkerGreeting } from './WorkerGreeting';
import { QuickActionCards } from './QuickActionCards';
import { DigitalIdentityCard } from './DigitalIdentityCard';
import { EarningsCard } from './EarningsCard';
import { useLanguage } from '../../context/LanguageContext';

export const WorkerDashboardPreview: React.FC = () => {
  const { language } = useLanguage();

  return (
    <section className="py-8 sm:py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Section Header with Subtle Accent */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
            <h2 className="text-xl sm:text-2xl font-black text-[#0B132B] font-sans tracking-tight">
              {language === 'hi' ? 'श्रमिक लाइव डैशबोर्ड' : 'Worker Live Experience'}
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            {language === 'hi'
              ? 'सत्यापित कामगार रमेश का डिजिटल प्रोफाइल एवं दैनिक प्रबंधन हब'
              : 'Verified worker Ramesh\'s digital profile and daily shift management hub'}
          </p>
        </div>
      </div>

      {/* 1. Worker Greeting Banner */}
      <WorkerGreeting />

      {/* 2. Four Quick Action Hubs */}
      <QuickActionCards />

      {/* 3. Dual Analytics / Digital Identity Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        <div className="lg:col-span-5 h-full">
          <DigitalIdentityCard />
        </div>
        <div className="lg:col-span-7 h-full">
          <EarningsCard />
        </div>
      </div>
    </section>
  );
};
