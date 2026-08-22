import React from 'react';
import { UserCheck, Search, ShieldCheck, CreditCard, Award, ArrowRight } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { Link } from 'react-router-dom';

export const HowItWorksPage: React.FC = () => {
  const { language } = useLanguage();

  const workerSteps = [
    {
      step: '01',
      titleHi: 'डिजिटल प्रोफाइल बनाएं',
      titleEn: 'Create Digital Profile',
      descHi: 'अपना आधार / ई-श्रम और प्राथमिक कौशल (राजमिस्त्री, पेंटर, प्लंबर) जोड़ें।',
      descEn: 'Link Aadhaar/e-Shram and select your primary craft trade.',
      icon: <UserCheck className="w-6 h-6 text-amber-600" />,
    },
    {
      step: '02',
      titleHi: 'नजदीकी काम खोजें',
      titleEn: 'Find Shifts Nearby',
      descHi: 'लेबर चौक पर इंतजार करने के बजाय ऐप से सीधे ठेकेदार से संपर्क करें।',
      descEn: 'Connect directly with site supervisors without middlemen.',
      icon: <Search className="w-6 h-6 text-amber-600" />,
    },
    {
      step: '03',
      titleHi: 'दैनिक उपस्थिति व वेतन पर्ची',
      titleEn: 'Digital Attendance & Wage Slip',
      descHi: 'काम पूरा होते ही सुपरवाइजर द्वारा प्रमाणित डिजिटल हाजिरी और पर्ची पाएं।',
      descEn: 'Get supervisor-verified daily work slips stored in your ledger.',
      icon: <CreditCard className="w-6 h-6 text-amber-600" />,
    },
    {
      step: '04',
      titleHi: 'क्रेडिट व सरकारी लाभ',
      titleEn: 'Bank Loans & Welfare',
      descHi: 'प्रमाणित आय रिकॉर्ड के आधार पर बैंक लोन और BOCW योजनाओं का लाभ लें।',
      descEn: 'Leverage verified earnings for micro-loans and BOCW benefits.',
      icon: <Award className="w-6 h-6 text-amber-600" />,
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      {/* Page Header */}
      <div className="text-center max-w-3xl mx-auto mb-12">
        <span className="px-3 py-1 rounded-full bg-amber-100 text-amber-900 border border-amber-300 text-xs font-extrabold uppercase tracking-wider">
          कार्यप्रणाली • How It Works
        </span>
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#0B132B] tracking-tight mt-3 mb-4">
          {language === 'hi' ? 'लेबर चौक से डिजिटल सशक्तिकरण का सफर' : 'From Labour Chowk to Digital Empowerment'}
        </h1>
        <p className="text-base text-slate-600">
          {language === 'hi'
            ? 'सरल 4 चरणों में श्रमिक और ठेकेदारों के बीच सीधा, पारदर्शी और सुरक्षित कार्य संबंध।'
            : 'A transparent, direct 4-step workflow connecting workers and employers seamlessly.'}
        </p>
      </div>

      {/* Steps Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        {workerSteps.map((s, idx) => (
          <div
            key={idx}
            className="rounded-[26px] bg-white border border-slate-200/90 shadow-card p-6 flex flex-col justify-between relative hover:border-amber-400 hover:shadow-card-hover transition-all"
          >
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-3xl font-black text-amber-500 font-sans">
                  {s.step}
                </span>
                <div className="w-12 h-12 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-center">
                  {s.icon}
                </div>
              </div>
              <h3 className="text-lg font-bold text-[#0B132B] mb-2">
                {language === 'hi' ? s.titleHi : s.titleEn}
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                {language === 'hi' ? s.descHi : s.descEn}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* CTA Box */}
      <div className="rounded-[28px] bg-[#0B132B] text-white p-8 sm:p-12 text-center shadow-xl">
        <h2 className="text-2xl sm:text-3xl font-extrabold mb-3">
          {language === 'hi' ? 'आज ही अपनी डिजिटल पहचान बनाएं' : 'Create Your Digital Identity Today'}
        </h2>
        <p className="text-slate-300 text-sm max-w-xl mx-auto mb-6">
          {language === 'hi'
            ? 'लाखों साथी कामगारों के साथ जुड़ें और अपनी दैनिक मेहनत का स्थायी रिकॉर्ड बनाएं।'
            : 'Join thousands of fellow craftsmen and build your verified permanent record.'}
        </p>
        <div className="flex justify-center gap-4 flex-wrap">
          <Link
            to="/register"
            className="px-6 py-3.5 rounded-full bg-amber-500 hover:bg-amber-600 text-slate-950 text-sm font-bold shadow-md transition-all flex items-center gap-2"
          >
            <span>निशुल्क रजिस्टर करें (Register Free)</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
};
