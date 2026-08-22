import React from 'react';
import { Link } from 'react-router-dom';
import {
  Bookmark, BookmarkCheck, ArrowLeft, Landmark, Shield, Bot,
  ChevronRight, MessageSquare, X, Trash2,
} from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { useSafetyNet } from '../../context/SafetyNetContext';
import { verifiedSchemes, verifiedInsuranceOptions } from '../../data/safetyNetData';
import { WorkerBottomNav } from '../../components/navigation/WorkerBottomNav';

export const MySupportPage: React.FC = () => {
  const { language } = useLanguage();
  const { state, unsaveScheme, unsaveInsurance, clearAiHistory } = useSafetyNet();

  const savedSchemes = verifiedSchemes.filter((s) => state.savedSchemeIds.includes(s.id));
  const savedInsurance = verifiedInsuranceOptions.filter((i) => state.savedInsuranceIds.includes(i.id));

  return (
    <div className="min-h-screen pb-24 md:pb-12 bg-[#FAF9F6]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">

        {/* Header */}
        <div className="rounded-[28px] bg-[#0B132B] text-white p-6 sm:p-8 shadow-xl space-y-2">
          <Link to="/worker/safety-net" className="inline-flex items-center gap-1 text-xs text-slate-300 hover:text-white mb-1">
            <ArrowLeft className="w-3.5 h-3.5" /> {language === 'hi' ? 'सुरक्षा जाल' : 'Safety Net'}
          </Link>
          <div className="flex items-center gap-2">
            <Bookmark className="w-6 h-6 text-amber-400" />
            <h1 className="text-2xl sm:text-3xl font-black text-white font-sans">
              {language === 'hi' ? 'मेरी सहायता (My Support)' : 'My Support'}
            </h1>
          </div>
          <p className="text-xs text-slate-300">
            {language === 'hi'
              ? 'सहेजी गई योजनाएं, बीमा विकल्प और AI साथी इतिहास'
              : 'Saved schemes, insurance options and AI Saathi history'}
          </p>
        </div>

        {/* Saved Schemes */}
        <div className="rounded-[24px] bg-white border border-slate-200/90 shadow-card p-5 sm:p-6 space-y-3">
          <div className="flex items-center gap-2">
            <Landmark className="w-4 h-4 text-amber-800" />
            <h3 className="text-sm font-extrabold text-[#0B132B]">
              {language === 'hi' ? 'सहेजी गई योजनाएं (Saved Schemes)' : 'Saved Schemes'}
            </h3>
            <span className="ml-auto text-xs font-bold text-slate-400">{savedSchemes.length}</span>
          </div>

          {savedSchemes.length > 0 ? (
            savedSchemes.map((s) => (
              <div key={s.id} className="flex items-center justify-between p-3.5 rounded-2xl bg-amber-50 border border-amber-200">
                <Link to={`/worker/schemes?id=${s.id}`} className="flex-1">
                  <div className="text-xs font-extrabold text-slate-900">{language === 'hi' ? s.nameHi : s.name}</div>
                  <div className="text-[10px] text-slate-500 mt-0.5">{s.category} • ✓ Verified</div>
                </Link>
                <button onClick={() => unsaveScheme(s.id)} className="p-1.5 rounded-xl bg-white border border-amber-300 text-amber-800">
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            ))
          ) : (
            <p className="text-xs text-slate-500 py-4 text-center">
              {language === 'hi' ? 'आपने अभी तक कोई योजना नहीं सहेजी है।' : 'No saved schemes yet.'}
            </p>
          )}
        </div>

        {/* Saved Insurance */}
        <div className="rounded-[24px] bg-white border border-slate-200/90 shadow-card p-5 sm:p-6 space-y-3">
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-emerald-800" />
            <h3 className="text-sm font-extrabold text-[#0B132B]">
              {language === 'hi' ? 'सहेजी गई सुरक्षा (Saved Protection)' : 'Saved Protection'}
            </h3>
            <span className="ml-auto text-xs font-bold text-slate-400">{savedInsurance.length}</span>
          </div>

          {savedInsurance.length > 0 ? (
            savedInsurance.map((i) => (
              <div key={i.id} className="flex items-center justify-between p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200">
                <Link to={`/worker/insurance?id=${i.id}`} className="flex-1">
                  <div className="text-xs font-extrabold text-slate-900">{language === 'hi' ? i.nameHi : i.name}</div>
                  <div className="text-[10px] text-slate-500 mt-0.5">{i.provider} • ✓ Verified</div>
                </Link>
                <button onClick={() => unsaveInsurance(i.id)} className="p-1.5 rounded-xl bg-white border border-emerald-300 text-emerald-800">
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            ))
          ) : (
            <p className="text-xs text-slate-500 py-4 text-center">
              {language === 'hi' ? 'आपने अभी तक कोई सुरक्षा विकल्प नहीं सहेजा है।' : 'No saved protection options yet.'}
            </p>
          )}
        </div>

        {/* AI Saathi History */}
        <div className="rounded-[24px] bg-white border border-slate-200/90 shadow-card p-5 sm:p-6 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Bot className="w-4 h-4 text-violet-800" />
              <h3 className="text-sm font-extrabold text-[#0B132B]">
                AI साथी इतिहास
              </h3>
              <span className="text-xs font-bold text-slate-400">{state.aiHistory.length} messages</span>
            </div>
            {state.aiHistory.length > 0 && (
              <button onClick={clearAiHistory} className="text-xs text-red-600 font-bold hover:underline flex items-center gap-1">
                <Trash2 className="w-3 h-3" /> Clear
              </button>
            )}
          </div>

          {state.aiHistory.length > 0 ? (
            <div className="space-y-2 max-h-60 overflow-y-auto">
              {state.aiHistory.slice(-10).map((msg, idx) => (
                <div key={idx} className={`p-2.5 rounded-xl text-xs ${msg.role === 'user' ? 'bg-[#0B132B] text-white' : 'bg-slate-50 border border-slate-200 text-slate-900'}`}>
                  <span className="text-[10px] font-bold opacity-60">{msg.role === 'user' ? 'You' : 'AI साथी'} • {msg.timestamp}</span>
                  <p className="mt-0.5 line-clamp-2">{msg.text}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-slate-500 py-4 text-center">
              {language === 'hi' ? 'कोई AI साथी इतिहास नहीं।' : 'No AI Saathi history yet.'}
            </p>
          )}

          <Link
            to="/worker/ai-saathi"
            className="block text-center py-3 rounded-2xl bg-[#0B132B] hover:bg-slate-800 text-amber-400 text-xs font-bold shadow-md transition-all"
          >
            AI साथी से बात करें →
          </Link>
        </div>

      </div>
      <WorkerBottomNav />
    </div>
  );
};
