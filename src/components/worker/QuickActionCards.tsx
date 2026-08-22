import React from 'react';
import { Link } from 'react-router-dom';
import { HardHat, Briefcase, Wallet, Sparkles, ArrowUpRight } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

export const QuickActionCards: React.FC = () => {
  const { t } = useLanguage();

  const cards = [
    {
      id: 'find-work',
      title: t('card1Title'),
      badge: t('card1Badge'),
      badgeColor: 'bg-amber-100/90 text-amber-900 border-amber-200/80',
      icon: <HardHat className="w-6 h-6 text-white stroke-[2.2]" />,
      iconBg: 'bg-[#EAA228]',
      cardBg: 'bg-amber-50/30 hover:bg-amber-50/60 border-amber-200/70',
      description: t('card1Desc'),
      linkText: t('card1Cta'),
      linkTo: '/find-work',
    },
    {
      id: 'my-work',
      title: t('card2Title'),
      badge: t('card2Badge'),
      badgeColor: 'bg-orange-100/90 text-orange-900 border-orange-200/80',
      icon: <Briefcase className="w-6 h-6 text-white stroke-[2.2]" />,
      iconBg: 'bg-[#EA580C]',
      cardBg: 'bg-orange-50/30 hover:bg-orange-50/60 border-orange-200/70',
      description: t('card2Desc'),
      linkText: t('card2Cta'),
      linkTo: '/worker/my-work',
    },
    {
      id: 'financial-hub',
      title: t('card3Title'),
      badge: t('card3Badge'),
      badgeColor: 'bg-emerald-100/90 text-emerald-900 border-emerald-200/80',
      icon: <Wallet className="w-6 h-6 text-white stroke-[2.2]" />,
      iconBg: 'bg-[#059669]',
      cardBg: 'bg-emerald-50/30 hover:bg-emerald-50/60 border-emerald-200/70',
      description: t('card3Desc'),
      linkText: t('card3Cta'),
      linkTo: '/worker/financial-hub',
    },
    {
      id: 'ai-saathi',
      title: t('card4Title'),
      badge: t('card4Badge'),
      badgeColor: 'bg-yellow-100/90 text-yellow-900 border-yellow-200/80',
      icon: <Sparkles className="w-6 h-6 text-white stroke-[2.2]" />,
      iconBg: 'bg-[#D97706]',
      cardBg: 'bg-yellow-50/30 hover:bg-yellow-50/60 border-yellow-200/70',
      description: t('card4Desc'),
      linkText: t('card4Cta'),
      linkTo: '/ai-saathi',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
      {cards.map((card) => (
        <Link
          key={card.id}
          to={card.linkTo}
          className={`group relative rounded-[26px] p-6 border transition-all duration-200 hover:-translate-y-1 hover:shadow-card-hover flex flex-col justify-between ${card.cardBg}`}
        >
          {/* Top Header with Icon & Badge */}
          <div>
            <div className="flex items-center justify-between mb-5">
              <div
                className={`w-12 h-12 rounded-2xl ${card.iconBg} flex items-center justify-center shadow-md shadow-slate-900/10 group-hover:scale-105 transition-transform`}
              >
                {card.icon}
              </div>
              <span
                className={`px-3 py-1 rounded-full text-xs font-bold tracking-tight border ${card.badgeColor}`}
              >
                {card.badge}
              </span>
            </div>

            {/* Title & Description */}
            <h3 className="text-xl font-extrabold text-[#0B132B] font-sans tracking-tight mb-2">
              {card.title}
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal mb-6">
              {card.description}
            </p>
          </div>

          {/* Bottom Action Link */}
          <div className="pt-2 flex items-center justify-between text-xs sm:text-sm font-bold text-slate-900 group-hover:text-amber-700 transition-colors">
            <span>{card.linkText}</span>
            <div className="w-7 h-7 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-700 group-hover:bg-slate-900 group-hover:text-white transition-all shadow-2xs">
              <ArrowUpRight className="w-4 h-4 stroke-[2.2]" />
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
};
