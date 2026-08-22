import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Bot, Send, ShieldCheck, AlertTriangle, Landmark, Shield, ArrowLeft,
  Sparkles, MessageSquare, X,
} from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { useAuth } from '../../context/AuthContext';
import { useSafetyNet } from '../../context/SafetyNetContext';
import { useJobs } from '../../context/JobContext';
import {
  detectIntent, retrieveSchemes, retrieveInsurance,
  type VerifiedScheme, type InsuranceOption,
} from '../../data/safetyNetData';
import { WorkerBottomNav } from '../../components/navigation/WorkerBottomNav';

interface ChatMessage {
  role: 'user' | 'ai';
  text: string;
  schemes?: VerifiedScheme[];
  insurance?: InsuranceOption[];
  isVerified: boolean;
}

export const AiSaathiChatPage: React.FC = () => {
  const { language } = useLanguage();
  const { auth } = useAuth();
  const { addAiMessage } = useSafetyNet();
  const { totalIncomeRecorded } = useJobs();

  const workerSkill = auth.workerProfile?.skills?.[0] || 'Mason / राजमिस्त्री';
  const workerCity = auth.workerProfile?.city || 'Ghaziabad';
  const workerName = auth.workerProfile?.fullName || 'रमेश कुमार';

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: 'ai',
      text: language === 'hi'
        ? `नमस्ते ${workerName.split('(')[0].trim()}! 🙏 मैं आपका AI साथी हूं। मैं आपको सरकारी योजनाओं, बीमा और कामगार सहायता के बारे में सत्यापित जानकारी ढूंढने में मदद कर सकता हूं।`
        : `Namaste ${workerName.split('(')[0].trim()}! 🙏 I'm your AI Saathi. I can help you find verified information about government schemes, insurance and worker support.`,
      isVerified: true,
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const quickActions = language === 'hi' ? [
    'सरकारी योजनाएं दिखाएं',
    'बीमा के बारे में बताएं',
    'मेरी आय सहायता',
    'मुझे मेरे लाभ समझने हैं',
    'मुझे क्या सहायता मिल सकती है?',
  ] : [
    'Find government schemes',
    'Find insurance',
    'My income support',
    'Help me understand my benefits',
    'What support can I get?',
  ];

  const handleSend = (q: string) => {
    if (!q.trim()) return;

    const userMsg: ChatMessage = { role: 'user', text: q, isVerified: true };
    setMessages((prev) => [...prev, userMsg]);
    addAiMessage('user', q);
    setInput('');
    setIsLoading(true);

    // Simulate retrieval delay
    setTimeout(() => {
      const intent = detectIntent(q);
      let aiMsg: ChatMessage;

      if (intent === 'scheme' || intent === 'general') {
        const schemes = retrieveSchemes(q, workerSkill, workerCity);
        const ins = intent === 'general' ? retrieveInsurance(q, workerSkill) : [];

        if (schemes.length > 0) {
          const txt = language === 'hi'
            ? `उपलब्ध सत्यापित जानकारी के आधार पर, मुझे ${schemes.length} योजनाएं मिलीं जो आपके प्रोफ़ाइल (${workerSkill.split('/')[0].trim()}, ${workerCity}) के लिए प्रासंगिक हो सकती हैं।\n\nकृपया पात्रता की आधिकारिक जांच अवश्य करें।`
            : `Based on available verified information, I found ${schemes.length} schemes that may be relevant to your profile (${workerSkill.split('/')[0].trim()}, ${workerCity}).\n\nPlease verify the official eligibility criteria before applying.`;
          aiMsg = { role: 'ai', text: txt, schemes, insurance: ins.length > 0 ? ins : undefined, isVerified: true };
        } else {
          aiMsg = {
            role: 'ai',
            text: language === 'hi'
              ? 'इस प्रश्न के लिए सत्यापित जानकारी नहीं मिली। कृपया सरकारी योजनाएं, बीमा या कामगार सहायता के बारे में पूछने का प्रयास करें।'
              : 'I couldn\'t find verified information for this question. Try asking about government schemes, insurance or worker support.',
            isVerified: false,
          };
        }
      } else if (intent === 'insurance') {
        const ins = retrieveInsurance(q, workerSkill);
        if (ins.length > 0) {
          const txt = language === 'hi'
            ? `मुझे ${ins.length} सत्यापित सुरक्षा विकल्प मिले जो निर्माण श्रमिकों के लिए प्रासंगिक हो सकते हैं।\n\nSHRAMIKK केवल जानकारी खोजने में मदद करता है। बीमा उत्पाद विनियमित भागीदारों द्वारा प्रदान किए जाते हैं।`
            : `I found ${ins.length} verified protection options that may be relevant to construction workers.\n\nSHRAMIKK helps you discover relevant protection options. Insurance products are provided by regulated partners.`;
          aiMsg = { role: 'ai', text: txt, insurance: ins, isVerified: true };
        } else {
          aiMsg = {
            role: 'ai',
            text: language === 'hi'
              ? 'कोई सत्यापित बीमा विकल्प नहीं मिला। कृपया दुर्घटना बीमा, स्वास्थ्य बीमा, या PMSBY के बारे में पूछें।'
              : 'No verified insurance matches found. Try asking about accident insurance, health insurance, or PMSBY.',
            isVerified: false,
          };
        }
      } else if (intent === 'income') {
        const txt = language === 'hi'
          ? `आपकी दर्ज आय: ₹${(242000 + totalIncomeRecorded).toLocaleString('en-IN')}\nकौशल: ${workerSkill}\nस्थान: ${workerCity}\n\nआय सहायता और सरकारी योजनाओं के लिए "आय सुरक्षा" पृष्ठ देखें या मुझसे योजनाओं के बारे में पूछें।`
          : `Your recorded income: ₹${(242000 + totalIncomeRecorded).toLocaleString('en-IN')}\nSkill: ${workerSkill}\nLocation: ${workerCity}\n\nVisit the Income Protection page for income support or ask me about relevant schemes.`;
        aiMsg = { role: 'ai', text: txt, isVerified: true };
      } else if (intent === 'benefits') {
        const schemes = retrieveSchemes(q + ' benefit welfare', workerSkill, workerCity);
        const ins = retrieveInsurance(q + ' insurance bima', workerSkill);
        if (schemes.length > 0 || ins.length > 0) {
          const txt = language === 'hi'
            ? `उपलब्ध सत्यापित जानकारी के आधार पर, आपके प्रोफ़ाइल (${workerSkill.split('/')[0].trim()}, ${workerCity}) के लिए कुछ लाभ उपलब्ध हो सकते हैं। कृपया आवेदन से पहले आधिकारिक पात्रता की जाँच अवश्य करें।`
            : `Based on available verified information, here are benefits that may be relevant to your profile (${workerSkill.split('/')[0].trim()}, ${workerCity}). Please verify the official eligibility criteria before applying.`;
          aiMsg = { role: 'ai', text: txt, schemes: schemes.length > 0 ? schemes : undefined, insurance: ins.length > 0 ? ins : undefined, isVerified: true };
        } else {
          aiMsg = {
            role: 'ai',
            text: language === 'hi'
              ? 'इस प्रश्न के लिए सत्यापित जानकारी नहीं मिली। कृपया सरकारी योजनाएं, बीमा या कामगार सहायता के बारे में पूछने का प्रयास करें।'
              : 'I couldn\'t find verified information for this question. Try asking about government schemes, insurance or worker support.',
            isVerified: false,
          };
        }
      } else {
        aiMsg = {
          role: 'ai',
          text: language === 'hi'
            ? 'इस प्रश्न के लिए सत्यापित जानकारी उपलब्ध नहीं है। कृपया निम्नलिखित के बारे में पूछें:\n• सरकारी योजनाएं\n• कामगार कल्याण\n• बीमा / सुरक्षा\n• आय सहायता'
            : 'I couldn\'t find verified information for this question. Try asking about:\n• Government schemes\n• Worker welfare\n• Insurance / protection\n• Income support',
          isVerified: false,
        };
      }

      addAiMessage('ai', aiMsg.text);
      setMessages((prev) => [...prev, aiMsg]);
      setIsLoading(false);
    }, 800);
  };

  return (
    <div className="min-h-screen pb-24 md:pb-12 bg-[#FAF9F6] flex flex-col">
      <div className="max-w-4xl mx-auto w-full flex flex-col flex-1 px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="rounded-b-[28px] bg-[#0B132B] text-white p-5 sm:p-6 shadow-xl space-y-1 -mx-4 sm:-mx-6 lg:-mx-8 px-6 sm:px-8">
          <div className="flex items-center gap-3">
            <Link to="/worker/safety-net" className="p-1.5 rounded-xl bg-white/10 text-white">
              <ArrowLeft className="w-4 h-4" />
            </Link>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <Bot className="w-5 h-5 text-amber-400" />
                <h1 className="text-lg font-black text-white font-sans">AI साथी (AI Saathi)</h1>
              </div>
              <p className="text-[11px] text-slate-300 mt-0.5">
                {language === 'hi'
                  ? 'योजनाओं, बीमा और कामगार सहायता के लिए आपका मार्गदर्शक'
                  : 'Your guide to schemes, insurance and worker support'}
              </p>
            </div>
            <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-bold border border-emerald-500/30">
              ✓ Verified AI
            </span>
          </div>
        </div>

        {/* Chat Area */}
        <div className="flex-1 overflow-y-auto py-4 space-y-4">
          {messages.map((msg, idx) => (
            <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div
                className={`max-w-[85%] p-4 rounded-[20px] text-xs space-y-2 ${
                  msg.role === 'user'
                    ? 'bg-[#0B132B] text-white rounded-br-md'
                    : 'bg-white border border-slate-200 text-slate-900 rounded-bl-md shadow-card'
                }`}
              >
                {msg.role === 'ai' && (
                  <div className="flex items-center gap-1 mb-1">
                    <Sparkles className="w-3 h-3 text-amber-500" />
                    <span className="text-[10px] font-bold text-amber-800">AI साथी</span>
                    <span className={`ml-1 text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
                      msg.isVerified
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-amber-100 text-amber-800'
                    }`}>
                      {msg.isVerified ? '✓ Verified' : '⚠ Limited Info'}
                    </span>
                  </div>
                )}

                <p className="whitespace-pre-line leading-relaxed">{msg.text}</p>

                {/* Inline Scheme Cards */}
                {msg.schemes && msg.schemes.length > 0 && (
                  <div className="space-y-2 pt-2 border-t border-slate-100">
                    {msg.schemes.map((s) => (
                      <Link
                        key={s.id}
                        to={`/worker/schemes?id=${s.id}`}
                        className="block p-3 rounded-2xl bg-amber-50 border border-amber-200 hover:border-amber-400 transition-all"
                      >
                        <div className="font-extrabold text-slate-900 text-xs">{language === 'hi' ? s.nameHi : s.name}</div>
                        <div className="text-[10px] text-slate-600 mt-0.5">{s.category} • {s.location}</div>
                        <div className="text-[10px] text-emerald-700 font-bold mt-1">✓ Verified • {s.officialSourceLabel}</div>
                      </Link>
                    ))}
                  </div>
                )}

                {/* Inline Insurance Cards */}
                {msg.insurance && msg.insurance.length > 0 && (
                  <div className="space-y-2 pt-2 border-t border-slate-100">
                    {msg.insurance.map((i) => (
                      <Link
                        key={i.id}
                        to={`/worker/insurance?id=${i.id}`}
                        className="block p-3 rounded-2xl bg-emerald-50 border border-emerald-200 hover:border-emerald-400 transition-all"
                      >
                        <div className="font-extrabold text-slate-900 text-xs">{language === 'hi' ? i.nameHi : i.name}</div>
                        <div className="text-[10px] text-slate-600 mt-0.5">{i.provider}</div>
                        <div className="text-[10px] text-emerald-700 font-bold mt-1">✓ Verified • {i.officialSourceLabel}</div>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="flex justify-start">
              <div className="p-4 rounded-[20px] bg-white border border-slate-200 rounded-bl-md shadow-card">
                <div className="flex items-center gap-2 text-xs text-slate-500">
                  <div className="flex gap-1">
                    <span className="w-2 h-2 rounded-full bg-amber-400 animate-bounce" style={{ animationDelay: '0ms' }} />
                    <span className="w-2 h-2 rounded-full bg-amber-400 animate-bounce" style={{ animationDelay: '150ms' }} />
                    <span className="w-2 h-2 rounded-full bg-amber-400 animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                  <span>{language === 'hi' ? 'सत्यापित जानकारी खोज रहा हूं...' : 'Searching verified records...'}</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Quick Actions */}
        {messages.length <= 1 && (
          <div className="py-3 space-y-2">
            <p className="text-xs font-bold text-slate-700">
              {language === 'hi' ? 'मैं कैसे मदद कर सकता हूं?' : 'How can I help?'}
            </p>
            <div className="flex flex-wrap gap-2">
              {quickActions.map((q) => (
                <button
                  key={q}
                  type="button"
                  onClick={() => handleSend(q)}
                  className="px-3.5 py-2 rounded-2xl bg-white border border-slate-200 text-xs font-bold text-slate-800 hover:bg-amber-50 hover:border-amber-300 transition-colors"
                >
                  {q}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Input Area */}
        <div className="sticky bottom-20 md:bottom-4 py-3 bg-[#FAF9F6]">
          <form
            onSubmit={(e) => { e.preventDefault(); handleSend(input); }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={language === 'hi' ? 'अपना सवाल यहां लिखें...' : 'Type your question here...'}
              className="flex-1 px-4 py-3.5 rounded-2xl bg-white border border-slate-200 text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500 shadow-card"
            />
            <button
              type="submit"
              disabled={!input.trim() || isLoading}
              className="p-3.5 rounded-2xl bg-[#0B132B] hover:bg-slate-800 text-amber-400 shadow-md transition-all disabled:opacity-50"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>

      </div>
      <WorkerBottomNav />
    </div>
  );
};
