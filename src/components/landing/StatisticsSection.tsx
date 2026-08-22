import React from 'react';
import { HardHat, Briefcase, Star, ShieldCheck } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

export const StatisticsSection: React.FC = () => {
  const { t } = useLanguage();

  const stats = [
    {
      icon: <HardHat className="w-6 h-6 text-amber-700" />,
      iconBg: 'bg-amber-100/90',
      value: t('statsWorkers'),
      title: t('statsWorkersTitle'),
      subtitle: t('statsWorkersSub'),
    },
    {
      icon: <Briefcase className="w-6 h-6 text-emerald-700" />,
      iconBg: 'bg-emerald-100/90',
      value: t('statsJobs'),
      title: t('statsJobsTitle'),
      subtitle: t('statsJobsSub'),
    },
    {
      icon: <Star className="w-6 h-6 text-amber-500 fill-amber-400" />,
      iconBg: 'bg-amber-100/80',
      value: t('statsRating'),
      title: t('statsRatingTitle'),
      subtitle: t('statsRatingSub'),
    },
    {
      icon: <ShieldCheck className="w-6 h-6 text-sky-700" />,
      iconBg: 'bg-sky-100/90',
      value: t('statsVerified'),
      title: t('statsVerifiedTitle'),
      subtitle: t('statsVerifiedSub'),
    },
  ];

  return (
    <section className="py-6 sm:py-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="rounded-[28px] bg-white border border-slate-200/90 shadow-card p-6 sm:p-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-0 lg:divide-x lg:divide-slate-100">
          {stats.map((stat, idx) => (
            <div
              key={idx}
              className={`flex items-center gap-4 ${
                idx === 0
                  ? 'lg:pr-6'
                  : idx === stats.length - 1
                  ? 'lg:pl-6'
                  : 'lg:px-6'
              }`}
            >
              {/* Circular Icon Container */}
              <div
                className={`w-14 h-14 rounded-full ${stat.iconBg} flex items-center justify-center shrink-0 shadow-2xs`}
              >
                {stat.icon}
              </div>

              {/* Stat Typography */}
              <div className="flex flex-col text-left">
                <span className="text-2xl sm:text-3xl font-extrabold text-[#0B132B] font-sans tracking-tight leading-none">
                  {stat.value}
                </span>
                <span className="text-sm font-bold text-slate-800 mt-1 leading-tight">
                  {stat.title}
                </span>
                <span className="text-[12px] text-slate-500 font-normal mt-0.5 leading-snug">
                  {stat.subtitle}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
