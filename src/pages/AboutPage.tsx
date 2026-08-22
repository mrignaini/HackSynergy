import React from 'react';
import { HardHat, ShieldCheck, Award, Users, Target, Heart } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export const AboutPage: React.FC = () => {
  const { language } = useLanguage();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      {/* Hero Header */}
      <div className="rounded-[28px] bg-gradient-to-br from-[#0B132B] to-[#162758] text-white p-8 sm:p-12 mb-10 shadow-2xl relative overflow-hidden">
        <div className="max-w-3xl relative z-10">
          <div className="flex items-center gap-2 mb-3">
            <span className="w-3 h-3 rounded-full bg-amber-400" />
            <span className="text-xs font-bold uppercase tracking-wider text-amber-300">
              हमारा मिशन • Our Mission
            </span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white mb-4">
            {language === 'hi'
              ? 'असंगठित निर्माण क्षेत्र में पारदर्शिता और सम्मान'
              : 'Dignity & Transparency for Unorganized Construction Workers'}
          </h1>
          <p className="text-base sm:text-lg text-slate-300 leading-relaxed">
            {language === 'hi'
              ? 'SHRAMIKK का संकल्प भारत के 5 करोड़ से अधिक दैनिक वेतनभोगी निर्माण श्रमिकों को उनकी मेहनत का डिजिटल प्रमाण, सीधे काम के अवसर और सामाजिक सुरक्षा प्रदान करना है।'
              : 'SHRAMIKK empowers 50M+ daily wage construction workers with digital work history, direct employer matching, and social welfare security.'}
          </p>
        </div>
      </div>

      {/* 3 Pillars Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <div className="rounded-[24px] bg-white border border-slate-200/90 shadow-card p-6">
          <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center mb-4">
            <Target className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-[#0B132B] mb-2">बिचौलिया-मुक्त काम</h3>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            बिना किसी कमीशन या ठेकेदार शोषण के श्रमिकों को उचित दैनिक पारिश्रमिक सीधे उनके हाथ या खाते में।
          </p>
        </div>

        <div className="rounded-[24px] bg-white border border-slate-200/90 shadow-card p-6">
          <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center mb-4">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-[#0B132B] mb-2">डिजिटल पहचान व क्रेडिट</h3>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            बैंकों द्वारा मान्य दैनिक वेतन पर्ची और कार्य इतिहास, ताकि कामगारों को आसान ऋण और वित्तीय सुविधाएं मिल सकें।
          </p>
        </div>

        <div className="rounded-[24px] bg-white border border-slate-200/90 shadow-card p-6">
          <div className="w-12 h-12 rounded-2xl bg-yellow-100 text-yellow-800 flex items-center justify-center mb-4">
            <Award className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-[#0B132B] mb-2">सरकारी योजनाओं का सीधा लाभ</h3>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            BOCW कल्याण बोर्ड, ई-श्रम, प्रधानमंत्री सुरक्षा बीमा और मातृत्व सहायता का बिना भागदौड़ के सीधा फायदा।
          </p>
        </div>
      </div>
    </div>
  );
};
