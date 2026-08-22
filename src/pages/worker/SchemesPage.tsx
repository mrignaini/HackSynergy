import React, { useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import {
  Landmark, ShieldCheck, ArrowLeft, ExternalLink, Bookmark, BookmarkCheck,
  Search, ChevronRight, X, FileText, CheckCircle2, User,
} from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { useAuth } from '../../context/AuthContext';
import { useSafetyNet } from '../../context/SafetyNetContext';
import { verifiedSchemes, getSchemeMatchReason, type VerifiedScheme, type SchemeCategory } from '../../data/safetyNetData';
import { WorkerBottomNav } from '../../components/navigation/WorkerBottomNav';

export const SchemesPage: React.FC = () => {
  const { language } = useLanguage();
  const { auth } = useAuth();
  const { saveScheme, unsaveScheme, isSchemeSaved } = useSafetyNet();
  const workerSkill = auth.workerProfile?.skills?.[0] || 'Mason / राजमिस्त्री';
  const workerCity = auth.workerProfile?.city || 'Ghaziabad';
  const [searchParams] = useSearchParams();
  const preSelectedId = searchParams.get('id');

  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<SchemeCategory | 'All'>('All');
  const [detailScheme, setDetailScheme] = useState<VerifiedScheme | null>(
    preSelectedId ? verifiedSchemes.find((s) => s.id === preSelectedId) || null : null
  );

  const categories: (SchemeCategory | 'All')[] = [
    'All', 'Worker Welfare', 'Health', 'Pension', 'Housing', 'Education', 'Financial Support', 'Skill Development', 'Accident Protection',
  ];

  const filtered = verifiedSchemes
    .filter((s) => s.active)
    .filter((s) => selectedCategory === 'All' || s.category === selectedCategory)
    .filter((s) => {
      if (!search.trim()) return true;
      const q = search.toLowerCase();
      return s.name.toLowerCase().includes(q) || s.nameHi.includes(q) || s.matchKeywords.some((k) => k.includes(q));
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
            <Landmark className="w-6 h-6 text-amber-400" />
            <h1 className="text-2xl sm:text-3xl font-black text-white font-sans">
              {language === 'hi' ? '🏛 सरकारी योजनाएं' : '🏛 Government Schemes'}
            </h1>
          </div>
          <p className="text-xs text-slate-300">
            {language === 'hi' ? 'आपके लिए प्रासंगिक कल्याणकारी योजनाएं खोजें।' : 'Find welfare schemes relevant to you.'}
          </p>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={language === 'hi' ? 'योजना खोजें...' : 'Search schemes...'}
            className="w-full pl-11 pr-4 py-3.5 rounded-2xl bg-white border border-slate-200 text-xs font-semibold text-slate-900 focus:ring-2 focus:ring-amber-500 focus:outline-none shadow-card"
          />
        </div>

        {/* Category Chips */}
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setSelectedCategory(cat)}
              className={`shrink-0 px-4 py-2 rounded-2xl text-xs font-bold border transition-all ${
                selectedCategory === cat
                  ? 'bg-[#0B132B] text-amber-400 border-[#0B132B]'
                  : 'bg-white text-slate-700 border-slate-200 hover:border-amber-300'
              }`}
            >
              {cat === 'All' ? (language === 'hi' ? 'सभी' : 'All') : cat}
            </button>
          ))}
        </div>

        {/* Scheme Cards */}
        <div className="space-y-4">
          {filtered.length > 0 ? (
            filtered.map((scheme) => (
              <div
                key={scheme.id}
                className="p-5 rounded-[24px] bg-white border border-slate-200/90 shadow-card hover:shadow-card-hover transition-all space-y-3"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900 text-[10px] font-bold border border-amber-200">
                      {scheme.category}
                    </span>
                    <h3 className="text-sm font-extrabold text-[#0B132B] mt-2 leading-snug">
                      {language === 'hi' ? scheme.nameHi : scheme.name}
                    </h3>
                  </div>

                  <button
                    type="button"
                    onClick={() => isSchemeSaved(scheme.id) ? unsaveScheme(scheme.id) : saveScheme(scheme.id)}
                    className={`p-2 rounded-xl border ${
                      isSchemeSaved(scheme.id) ? 'bg-amber-100 text-amber-800 border-amber-300' : 'bg-slate-50 text-slate-500 border-slate-200'
                    }`}
                  >
                    {isSchemeSaved(scheme.id) ? <BookmarkCheck className="w-4 h-4" /> : <Bookmark className="w-4 h-4" />}
                  </button>
                </div>

                <p className="text-xs text-slate-600 line-clamp-2">
                  {language === 'hi' ? scheme.descriptionHi : scheme.description}
                </p>

                {/* Why this may match you */}
                <div className="flex items-center gap-1.5 text-[10px] text-violet-700 font-bold bg-violet-50 border border-violet-200 px-2.5 py-1.5 rounded-xl w-fit">
                  <User className="w-3 h-3 text-violet-600 shrink-0" />
                  <span>{language === 'hi' ? 'आपसे मिलान: ' : 'Why this may match: '}{getSchemeMatchReason(scheme, workerSkill, workerCity, language)}</span>
                </div>

                <div className="flex items-center justify-between pt-1">
                  <div className="flex items-center gap-1 text-[10px] text-emerald-700 font-bold">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                    <span>✓ Verified • {scheme.verifiedAt}</span>
                  </div>

                  <button
                    type="button"
                    onClick={() => setDetailScheme(scheme)}
                    className="px-3.5 py-2 rounded-xl bg-[#0B132B] hover:bg-slate-800 text-amber-400 text-xs font-bold transition-all flex items-center gap-1"
                  >
                    <span>{language === 'hi' ? 'विवरण देखें' : 'View Details'}</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-12 bg-white rounded-[28px] border border-slate-200 space-y-2">
              <Landmark className="w-10 h-10 text-slate-300 mx-auto" />
              <p className="text-xs text-slate-500 font-bold">
                {language === 'hi' ? 'कोई सत्यापित योजना नहीं मिली।' : 'No verified schemes matched your current profile.'}
              </p>
            </div>
          )}
        </div>

      </div>

      {/* Scheme Details Modal */}
      {detailScheme && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="relative w-full max-w-lg bg-white rounded-[32px] border border-slate-200 p-6 shadow-2xl space-y-5 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <span className="text-[10px] font-bold text-amber-800 uppercase">{detailScheme.category}</span>
                <h3 className="text-base font-black text-[#0B132B]">{language === 'hi' ? detailScheme.nameHi : detailScheme.name}</h3>
              </div>
              <button onClick={() => setDetailScheme(null)} className="p-1.5 rounded-full bg-slate-100 text-slate-500">
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-slate-700 leading-relaxed">{language === 'hi' ? detailScheme.descriptionHi : detailScheme.description}</p>

            {/* What it provides */}
            <div>
              <h4 className="text-xs font-black text-slate-900 mb-2">{language === 'hi' ? 'लाभ (Benefits)' : 'Benefits'}</h4>
              <ul className="space-y-1.5">
                {(language === 'hi' ? detailScheme.benefitsHi : detailScheme.benefits).map((b, i) => (
                  <li key={i} className="flex items-start gap-2 text-xs text-slate-700">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                    <span>{b}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Who may qualify */}
            <div>
              <h4 className="text-xs font-black text-slate-900 mb-2">{language === 'hi' ? 'पात्रता (Eligibility)' : 'Eligibility'}</h4>
              <ul className="space-y-1.5">
                {(language === 'hi' ? detailScheme.eligibilityHi : detailScheme.eligibility).map((e, i) => (
                  <li key={i} className="flex items-start gap-2 text-xs text-slate-600">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0 mt-1.5" />
                    <span>{e}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Documents */}
            <div>
              <h4 className="text-xs font-black text-slate-900 mb-2">{language === 'hi' ? 'आवश्यक दस्तावेज' : 'Required Documents'}</h4>
              <div className="flex flex-wrap gap-2">
                {detailScheme.requiredDocuments.map((d, i) => (
                  <span key={i} className="px-2.5 py-1 rounded-xl bg-slate-100 text-slate-700 text-[10px] font-bold border border-slate-200">{d}</span>
                ))}
              </div>
            </div>

            {/* How to apply */}
            <div>
              <h4 className="text-xs font-black text-slate-900 mb-2">{language === 'hi' ? 'आवेदन कैसे करें' : 'How to Apply'}</h4>
              <ol className="space-y-1.5">
                {detailScheme.applicationSteps.map((s, i) => (
                  <li key={i} className="flex items-start gap-2 text-xs text-slate-700">
                    <span className="w-5 h-5 rounded-full bg-[#0B132B] text-amber-400 flex items-center justify-center text-[10px] font-bold shrink-0">{i + 1}</span>
                    <span>{s}</span>
                  </li>
                ))}
              </ol>
            </div>

            {/* Official Source */}
            <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 space-y-1">
              <div className="text-[10px] text-emerald-900 font-bold uppercase">Official Source</div>
              {detailScheme.officialSource ? (
                <a
                  href={detailScheme.officialSource}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-emerald-800 font-bold underline flex items-center gap-1"
                >
                  {detailScheme.officialSourceLabel} <ExternalLink className="w-3 h-3" />
                </a>
              ) : (
                <span className="text-xs text-slate-500">Official source unavailable</span>
              )}
              <div className="text-[10px] text-emerald-600">✓ Last verified: {detailScheme.verifiedAt}</div>
            </div>

            {/* Disclaimer */}
            <p className="text-[10px] text-slate-400 text-center">
              {language === 'hi'
                ? 'आप पात्रता मानदंड के अनुसार योग्य हो सकते हैं। कृपया आवेदन से पहले आधिकारिक पात्रता की जांच करें।'
                : 'You may be eligible based on the available information. Please verify the official eligibility criteria before applying.'}
            </p>

            {/* Save Button */}
            <button
              type="button"
              onClick={() => isSchemeSaved(detailScheme.id) ? unsaveScheme(detailScheme.id) : saveScheme(detailScheme.id)}
              className={`w-full py-3.5 rounded-2xl font-black text-xs transition-all flex items-center justify-center gap-2 ${
                isSchemeSaved(detailScheme.id)
                  ? 'bg-amber-100 text-amber-900 border border-amber-300'
                  : 'bg-[#0B132B] text-amber-400 shadow-md hover:bg-slate-800'
              }`}
            >
              {isSchemeSaved(detailScheme.id) ? <BookmarkCheck className="w-4 h-4" /> : <Bookmark className="w-4 h-4" />}
              <span>{isSchemeSaved(detailScheme.id) ? (language === 'hi' ? '✓ सहेजा गया (Saved)' : '✓ Saved') : (language === 'hi' ? 'योजना सहेजें (Save Scheme)' : 'Save Scheme')}</span>
            </button>
          </div>
        </div>
      )}

      <WorkerBottomNav />
    </div>
  );
};
