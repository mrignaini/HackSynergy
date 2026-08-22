import React, { useState, useRef, useEffect } from 'react';
import { Globe, ChevronDown, Check } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import type { Language } from '../../types';

export const LanguageSelector: React.FC = () => {
  const { language, setLanguage } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const languages: { code: Language; label: string; subLabel: string }[] = [
    { code: 'hi', label: 'हिंदी', subLabel: 'Hindi' },
    { code: 'en', label: 'English', subLabel: 'अंग्रेज़ी' },
  ];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full border border-slate-200 bg-white text-sm font-medium text-slate-700 hover:bg-slate-50 hover:border-slate-300 focus:outline-none transition-all shadow-xs"
        aria-expanded={isOpen}
      >
        <Globe className="w-4 h-4 text-slate-500" />
        <span>{language === 'hi' ? 'हिंदी' : 'English'}</span>
        <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-44 rounded-xl bg-white shadow-xl ring-1 ring-black/5 z-50 py-1.5 border border-slate-100 animate-in fade-in zoom-in-95 duration-100">
          <div className="px-3 py-1.5 text-xs font-semibold text-slate-400 border-b border-slate-100">
            भाषा चुनें / Select Language
          </div>
          {languages.map((item) => (
            <button
              key={item.code}
              onClick={() => {
                setLanguage(item.code);
                setIsOpen(false);
              }}
              className={`w-full text-left px-3.5 py-2 text-sm flex items-center justify-between transition-colors ${
                language === item.code
                  ? 'bg-amber-50/80 text-amber-900 font-semibold'
                  : 'text-slate-700 hover:bg-slate-50'
              }`}
            >
              <div>
                <span>{item.label}</span>
                <span className="text-xs text-slate-400 ml-1.5">({item.subLabel})</span>
              </div>
              {language === item.code && <Check className="w-4 h-4 text-amber-600" />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
