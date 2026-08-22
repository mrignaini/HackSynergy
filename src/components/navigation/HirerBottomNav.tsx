import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Users, Briefcase, CreditCard, User } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

export const HirerBottomNav: React.FC = () => {
  const { t } = useLanguage();
  const location = useLocation();

  const tabs = [
    {
      name: t('navTabHome'),
      path: '/hirer/dashboard',
      icon: <Home className="w-5 h-5" />,
    },
    {
      name: t('navTabFindWorkers'),
      path: '/hire-workers',
      icon: <Users className="w-5 h-5" />,
    },
    {
      name: t('navTabMyJobs'),
      path: '/hirer/my-jobs',
      icon: <Briefcase className="w-5 h-5" />,
    },
    {
      name: 'Payments',
      path: '/hirer/payments',
      icon: <CreditCard className="w-5 h-5" />,
    },
    {
      name: t('navTabProfile'),
      path: '/about',
      icon: <User className="w-5 h-5" />,
    },
  ];

  const isActive = (path: string) => {
    if (path === '/hirer/dashboard') {
      return location.pathname === '/hirer/dashboard';
    }
    return location.pathname.startsWith(path);
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-lg border-t border-slate-200/90 shadow-2xl md:hidden">
      <div className="max-w-md mx-auto px-3 py-1.5 flex items-center justify-around">
        {tabs.map((tab) => {
          const active = isActive(tab.path);
          return (
            <Link
              key={tab.path}
              to={tab.path}
              className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-xl transition-all ${
                active
                  ? 'text-[#0B132B] font-extrabold'
                  : 'text-slate-400 hover:text-slate-600 font-medium'
              }`}
            >
              <div
                className={`relative p-1 rounded-xl transition-all ${
                  active ? 'bg-amber-100/90 text-[#0B132B] shadow-2xs' : 'text-slate-500'
                }`}
              >
                {tab.icon}
                {active && (
                  <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-amber-500 ring-2 ring-white" />
                )}
              </div>
              <span className={`text-[10px] tracking-tight mt-0.5 ${active ? 'text-[#0B132B] font-bold' : 'text-slate-500'}`}>
                {tab.name}
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
};
