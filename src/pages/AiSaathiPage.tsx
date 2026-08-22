import React, { useState } from 'react';
import { Sparkles, Send, ShieldCheck, HeartPulse, GraduationCap, Home, CheckCircle2, Bot } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export const AiSaathiPage: React.FC = () => {
  const { language } = useLanguage();
  const [messages, setMessages] = useState([
    {
      sender: 'ai',
      text: language === 'hi'
        ? 'नमस्ते रमेश जी! मैं आपका श्रमिक साथी एआई हूँ। आप BOCW भवन निर्माण कल्याण कार्ड, दुर्घटना बीमा (₹2 लाख), बच्चों की छात्रवृत्ति या पेंशन योजना के बारे में कुछ भी पूछ सकते हैं।'
        : 'Hello Ramesh! I am your SHRAMIKK AI Saathi. Ask me anything about BOCW Welfare benefits, accident insurance, children scholarships, or pension schemes.',
    },
  ]);
  const [inputVal, setInputVal] = useState('');

  const handleSend = () => {
    if (!inputVal.trim()) return;
    const userMsg = inputVal;
    setMessages((prev) => [...prev, { sender: 'user', text: userMsg }]);
    setInputVal('');

    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          sender: 'ai',
          text: language === 'hi'
            ? `आपकी पूछताछ "${userMsg}" के संबंध में: आपके पास वैध Grade A कामगार प्रोफाइल है। आप BOCW के तहत ₹50,000 औजार सहायता एवं ₹5,000 मासिक पेंशन योजना के लिए पात्र हैं। क्या आप आवेदन फॉर्म का प्रारूप देखना चाहते हैं?`
            : `Regarding your query "${userMsg}": You are verified as Grade A Worker. You are eligible for BOCW tool assistance (up to ₹50,000) and pension benefits. Would you like to preview the claim form?`,
        },
      ]);
    }, 600);
  };

  const quickQuestions = [
    'BOCW कार्ड के क्या फायदे हैं?',
    'दुर्घटना बीमा का दावा कैसे करें?',
    'बच्चों की पढ़ाई के लिए छात्रवृत्ति?',
    '60 वर्ष बाद श्रमिक पेंशन योजना?',
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      {/* Header */}
      <div className="rounded-[28px] bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 p-6 sm:p-8 mb-8 shadow-xl relative overflow-hidden">
        <div className="relative z-10 flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-[#0B132B] text-amber-400 flex items-center justify-center shrink-0 shadow-lg">
            <Sparkles className="w-8 h-8 stroke-[2.2]" />
          </div>
          <div>
            <span className="px-2.5 py-0.5 rounded-md bg-slate-950/15 text-slate-950 text-xs font-black uppercase tracking-wider">
              BOCW Welfare • ई-श्रम एआई गाइड
            </span>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight mt-1">
              {language === 'hi' ? 'श्रमिक एआई साथी (AI Saathi)' : 'SHRAMIKK AI Welfare Assistant'}
            </h1>
            <p className="text-xs sm:text-sm text-slate-900 font-medium">
              {language === 'hi'
                ? 'सरकारी कल्याणकारी योजनाओं और श्रमिक अधिकारों की सरल व सीधी जानकारी अपनी भाषा में।'
                : 'Direct, simplified government scheme and worker rights guidance in your language.'}
            </p>
          </div>
        </div>
      </div>

      {/* Main Chat Container */}
      <div className="rounded-[28px] bg-white border border-slate-200/90 shadow-card flex flex-col h-[520px] overflow-hidden">
        
        {/* Messages Scroll Area */}
        <div className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-4 bg-slate-50/50">
          {messages.map((m, idx) => (
            <div
              key={idx}
              className={`flex gap-3 ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {m.sender === 'ai' && (
                <div className="w-8 h-8 rounded-full bg-amber-500 text-slate-950 flex items-center justify-center shrink-0 shadow-xs font-bold text-xs">
                  <Bot className="w-4 h-4" />
                </div>
              )}
              <div
                className={`max-w-[80%] rounded-2xl p-4 text-xs sm:text-sm leading-relaxed ${
                  m.sender === 'user'
                    ? 'bg-[#0B132B] text-white rounded-tr-xs'
                    : 'bg-white border border-slate-200 text-slate-800 shadow-2xs rounded-tl-xs'
                }`}
              >
                {m.text}
              </div>
            </div>
          ))}
        </div>

        {/* Quick Suggestion Pills */}
        <div className="p-3 border-t border-slate-100 bg-white flex items-center gap-2 overflow-x-auto">
          {quickQuestions.map((q, i) => (
            <button
              key={i}
              onClick={() => {
                setInputVal(q);
              }}
              className="px-3 py-1.5 rounded-full bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200 text-xs font-semibold whitespace-nowrap transition-colors"
            >
              {q}
            </button>
          ))}
        </div>

        {/* Input Bar */}
        <div className="p-3 sm:p-4 bg-white border-t border-slate-100 flex items-center gap-2">
          <input
            type="text"
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder={
              language === 'hi'
                ? 'सरकारी योजना या लाभ के बारे में पूछें...'
                : 'Ask anything about welfare schemes, insurance or claims...'
            }
            className="flex-1 px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 font-medium"
          />
          <button
            onClick={handleSend}
            className="p-3 rounded-xl bg-[#0B132B] hover:bg-slate-800 text-amber-400 flex items-center justify-center shadow-md transition-all"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
