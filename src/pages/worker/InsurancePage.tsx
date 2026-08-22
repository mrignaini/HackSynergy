import React, { useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import {
  Shield, ShieldCheck, ArrowLeft, ExternalLink, Bookmark, BookmarkCheck,
  Search, ChevronRight, X, CheckCircle2, AlertTriangle,
} from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { useSafetyNet } from '../../context/SafetyNetContext';
import { verifiedInsuranceOptions, type InsuranceOption, type InsuranceCategory } from '../../data/safetyNetData';
import { WorkerBottomNav } from '../../components/navigation/WorkerBottomNav';

export const InsurancePage: React.FC = () => {
  const { language } = useLanguage();
  const { saveInsurance, unsaveInsurance, isInsuranceSaved } = useSafetyNet();
  const [searchParams] = useSearchParams();
  const preSelectedId = searchParams.get('id');

  const [search, setSearch] = useState('');
  const [selectedCat, setSelectedCat] = useState<InsuranceCategory | 'All'>('All');
  const [detailIns, setDetailIns] = useState<InsuranceOption | null>(
    preSelectedId ? verifiedInsuranceOptions.find((i) => i.id === preSelectedId) || null : null
  );

  const categories: (InsuranceCategory | 'All')[] = ['All', 'Accident', 'Health', 'Life', 'Worker Protection'];

  const filtered = verifiedInsuranceOptions
    .filter((i) => i.active)
    .filter((i) => selectedCat === 'All' || i.category === selectedCat)
    .filter((i) => {
      if (!search.trim()) return true;
      const q = search.toLowerCase();
      return i.name.toLowerCase().includes(q) || i.nameHi.includes(q) || i.matchKeywords.some((k) => k.includes(q));
    });

  return (
    <div className="min-h-screen pb-24 md:pb-12 bg-[#FAF9F6]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">

        {/* Header */}
        <div className="rounded-[28px] bg-[#0B132B] text-white p-6 sm:p-8 shadow-xl space-y-2">
          <Link to="/worker/safety-net" className="inline-flex items-center gap-1 text-xs text-slate-300 hover:text-white mb-1">
            <ArrowLeft className="w-3.5 h-3.5" /> {language === 'hi' ? 'सुरक्षा जाल' : 'Safety Net'}
          </Link>
          <div className="flex items-center gap-2">
            <Shield className="w-6 h-6 text-emerald-400" />
            <h1 className="text-2xl sm:text-3xl font-black text-white font-sans">
              {language === 'hi' ? '🛡 बीमा एवं सुरक्षा' : '🛡 Insurance & Protection'}
            </h1>
          </div>
          <p className="text-xs text-slate-300">
            {language === 'hi' ? 'आपके काम के लिए प्रासंगिक सुरक्षा विकल्प खोजें।' : 'Explore protection options relevant to your work.'}
          </p>
        </div>

        {/* Disclaimer */}
        <div className="p-3 rounded-2xl bg-amber-50 border border-amber-200 flex items-start gap-2 text-[11px] text-amber-900">
          <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
          <span>
            {language === 'hi'
              ? 'SHRAMIKK आपको प्रासंगिक सुरक्षा विकल्प खोजने में मदद करता है। बीमा उत्पाद विनियमित भागीदारों और सरकारी योजनाओं द्वारा प्रदान किए जाते हैं।'
              : 'SHRAMIKK helps you discover relevant protection options. Insurance products are provided by regulated partners and government schemes.'}
          </span>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={language === 'hi' ? 'बीमा विकल्प खोजें...' : 'Search insurance...'}
            className="w-full pl-11 pr-4 py-3.5 rounded-2xl bg-white border border-slate-200 text-xs font-semibold text-slate-900 focus:ring-2 focus:ring-amber-500 focus:outline-none shadow-card"
          />
        </div>

        {/* Category Chips */}
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setSelectedCat(cat)}
              className={`shrink-0 px-4 py-2 rounded-2xl text-xs font-bold border transition-all ${
                selectedCat === cat ? 'bg-[#0B132B] text-amber-400 border-[#0B132B]' : 'bg-white text-slate-700 border-slate-200 hover:border-amber-300'
              }`}
            >
              {cat === 'All' ? (language === 'hi' ? 'सभी' : 'All') : cat}
            </button>
          ))}
        </div>

        {/* Insurance Cards */}
        <div className="space-y-4">
          {filtered.length > 0 ? (
            filtered.map((ins) => (
              <div key={ins.id} className="p-5 rounded-[24px] bg-white border border-slate-200/90 shadow-card hover:shadow-card-hover transition-all space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-900 text-[10px] font-bold border border-emerald-200">{ins.category}</span>
                    <h3 className="text-sm font-extrabold text-[#0B132B] mt-2">{language === 'hi' ? ins.nameHi : ins.name}</h3>
                    <p className="text-[11px] text-slate-500 mt-0.5">{ins.provider}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => isInsuranceSaved(ins.id) ? unsaveInsurance(ins.id) : saveInsurance(ins.id)}
                    className={`p-2 rounded-xl border ${isInsuranceSaved(ins.id) ? 'bg-amber-100 text-amber-800 border-amber-300' : 'bg-slate-50 text-slate-500 border-slate-200'}`}
                  >
                    {isInsuranceSaved(ins.id) ? <BookmarkCheck className="w-4 h-4" /> : <Bookmark className="w-4 h-4" />}
                  </button>
                </div>

                <p className="text-xs text-slate-600 line-clamp-2">{language === 'hi' ? ins.descriptionHi : ins.description}</p>

                <div className="flex items-center justify-between pt-1">
                  <div className="flex items-center gap-1 text-[10px] text-emerald-700 font-bold">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                    ✓ Verified • {ins.verifiedAt}
                  </div>
                  <button
                    type="button"
                    onClick={() => setDetailIns(ins)}
                    className="px-3.5 py-2 rounded-xl bg-[#0B132B] hover:bg-slate-800 text-amber-400 text-xs font-bold flex items-center gap-1"
                  >
                    {language === 'hi' ? 'विवरण देखें' : 'View Details'} <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-12 bg-white rounded-[28px] border border-slate-200 space-y-2">
              <Shield className="w-10 h-10 text-slate-300 mx-auto" />
              <p className="text-xs text-slate-500 font-bold">
                {language === 'hi' ? 'कोई सत्यापित सुरक्षा विकल्प नहीं मिला।' : 'No verified protection options found.'}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Detail Modal */}
      {detailIns && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="relative w-full max-w-lg bg-white rounded-[32px] border border-slate-200 p-6 shadow-2xl space-y-5 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <span className="text-[10px] font-bold text-emerald-800 uppercase">{detailIns.category} Protection</span>
                <h3 className="text-base font-black text-[#0B132B]">{language === 'hi' ? detailIns.nameHi : detailIns.name}</h3>
                <p className="text-[11px] text-slate-500">{detailIns.provider}</p>
              </div>
              <button onClick={() => setDetailIns(null)} className="p-1.5 rounded-full bg-slate-100 text-slate-500"><X className="w-4 h-4" /></button>
            </div>

            <p className="text-xs text-slate-700 leading-relaxed">{language === 'hi' ? detailIns.descriptionHi : detailIns.description}</p>

            <div>
              <h4 className="text-xs font-black text-slate-900 mb-2">{language === 'hi' ? 'कवरेज (Coverage)' : 'Coverage'}</h4>
              <ul className="space-y-1.5">
                {(language === 'hi' ? detailIns.coverageHi : detailIns.coverage).map((c, i) => (
                  <li key={i} className="flex items-start gap-2 text-xs text-slate-700">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />{c}
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="text-xs font-black text-slate-900 mb-2">{language === 'hi' ? 'पात्रता (Eligibility)' : 'Eligibility'}</h4>
              <ul className="space-y-1.5">
                {(language === 'hi' ? detailIns.eligibilityHi : detailIns.eligibility).map((e, i) => (
                  <li key={i} className="flex items-start gap-2 text-xs text-slate-600">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0 mt-1.5" />{e}
                  </li>
                ))}
              </ul>
            </div>

            {/* Official Source */}
            <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 space-y-1">
              <div className="text-[10px] text-emerald-900 font-bold uppercase">Official Source</div>
              {detailIns.officialSource ? (
                <a href={detailIns.officialSource} target="_blank" rel="noopener noreferrer" className="text-xs text-emerald-800 font-bold underline flex items-center gap-1">
                  {detailIns.officialSourceLabel} <ExternalLink className="w-3 h-3" />
                </a>
              ) : (
                <span className="text-xs text-slate-500">Official source unavailable</span>
              )}
              <div className="text-[10px] text-emerald-600">✓ Verified: {detailIns.verifiedAt}</div>
            </div>

            <p className="text-[10px] text-slate-400 text-center">{detailIns.disclaimer}</p>

            <button
              type="button"
              onClick={() => isInsuranceSaved(detailIns.id) ? unsaveInsurance(detailIns.id) : saveInsurance(detailIns.id)}
              className={`w-full py-3.5 rounded-2xl font-black text-xs transition-all flex items-center justify-center gap-2 ${
                isInsuranceSaved(detailIns.id) ? 'bg-amber-100 text-amber-900 border border-amber-300' : 'bg-[#0B132B] text-amber-400 shadow-md hover:bg-slate-800'
              }`}
            >
              {isInsuranceSaved(detailIns.id) ? <BookmarkCheck className="w-4 h-4" /> : <Bookmark className="w-4 h-4" />}
              <span>{isInsuranceSaved(detailIns.id) ? '✓ Saved' : (language === 'hi' ? 'सुरक्षा सहेजें (Save Protection)' : 'Save Protection')}</span>
            </button>
          </div>
        </div>
      )}

      <WorkerBottomNav />
    </div>
  );
};
