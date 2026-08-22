import React, { useState } from 'react';
import {
  Users,
  Search,
  MapPin,
  Filter,
  ArrowUpDown,
  Sparkles,
  ShieldCheck,
  Star,
  X,
  CheckCircle2,
} from 'lucide-react';
import type { Worker } from '../types';
import { useLanguage } from '../context/LanguageContext';
import { useJobs } from '../context/JobContext';
import { WorkerCard } from '../components/marketplace/WorkerCard';
import { WorkerProfileModal } from '../components/marketplace/WorkerProfileModal';
import { HireConfirmModal } from '../components/marketplace/HireConfirmModal';
import { HireSuccessModal } from '../components/marketplace/HireSuccessModal';
import { HirerBottomNav } from '../components/navigation/HirerBottomNav';

export const HireWorkersPage: React.FC = () => {
  const { t } = useLanguage();
  const {
    workers,
    hireWorkerForJob,
    calculateWorkerMatchScore,
    selectedLocation,
    setSelectedLocation,
  } = useJobs();

  // Search & Filters State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTrade, setSelectedTrade] = useState('All');
  const [minRating, setMinRating] = useState<number>(0);
  const [sortBy, setSortBy] = useState<'best' | 'rating' | 'experience' | 'jobs'>('best');
  const [locationModalOpen, setLocationModalOpen] = useState(false);

  // Modals State
  const [selectedWorkerForProfile, setSelectedWorkerForProfile] = useState<Worker | null>(null);
  const [workerToHire, setWorkerToHire] = useState<Worker | null>(null);
  const [hiredSuccessWorker, setHiredSuccessWorker] = useState<Worker | null>(null);

  const availableCities = ['Ghaziabad', 'Indirapuram', 'Vaishali', 'Sahibabad', 'Noida', 'Greater Noida', 'Delhi'];

  const tradeFilters = [
    { id: 'All', label: t('filterAll') },
    { id: 'Mason', label: 'राजमिस्त्री (Mason)' },
    { id: 'Painter', label: 'पेंटर (Painter)' },
    { id: 'Plumber', label: 'प्लंबर (Plumber)' },
    { id: 'Carpenter', label: 'बढ़ई (Carpenter)' },
    { id: 'Tile', label: 'टाइल मिस्त्री (Tile)' },
    { id: 'Helper', label: 'हेल्पर (Helper)' },
  ];

  // Filter Workers
  const filteredWorkers = workers.filter((w) => {
    const matchesSearch =
      !searchQuery.trim() ||
      w.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      w.primarySkill.toLowerCase().includes(searchQuery.toLowerCase()) ||
      w.locality.toLowerCase().includes(searchQuery.toLowerCase()) ||
      w.city.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesTrade =
      selectedTrade === 'All' ||
      w.primarySkill.toLowerCase().includes(selectedTrade.toLowerCase());

    const matchesRating = w.rating >= minRating;

    const matchesLocation =
      !selectedLocation ||
      selectedLocation === 'All' ||
      w.city.toLowerCase().includes(selectedLocation.toLowerCase()) ||
      selectedLocation.toLowerCase().includes(w.city.toLowerCase());

    return matchesSearch && matchesTrade && matchesRating && matchesLocation;
  });

  // Sort Workers
  const sortedWorkers = [...filteredWorkers].sort((a, b) => {
    if (sortBy === 'best') {
      return (
        calculateWorkerMatchScore(b, selectedTrade !== 'All' ? selectedTrade : 'Mason', selectedLocation).score -
        calculateWorkerMatchScore(a, selectedTrade !== 'All' ? selectedTrade : 'Mason', selectedLocation).score
      );
    } else if (sortBy === 'rating') {
      return b.rating - a.rating;
    } else if (sortBy === 'experience') {
      return b.experienceYears - a.experienceYears;
    } else if (sortBy === 'jobs') {
      return b.completedJobsCount - a.completedJobsCount;
    }
    return 0;
  });

  // Handle Confirm Hire
  const handleConfirmHire = (jobId: string) => {
    if (!workerToHire) return;
    const res = hireWorkerForJob(jobId, workerToHire);
    if (res.success) {
      const hired = workerToHire;
      setWorkerToHire(null);
      setSelectedWorkerForProfile(null);
      setHiredSuccessWorker(hired);
    } else {
      alert(res.message);
      setWorkerToHire(null);
    }
  };

  return (
    <div className="min-h-screen pb-24 md:pb-12 bg-[#FAF9F6]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-5">
        
        {/* Header */}
        <div className="rounded-[28px] bg-[#0B132B] text-white p-6 sm:p-8 shadow-xl relative overflow-hidden">
          <div className="relative z-10 space-y-2">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-bold">
                <Users className="w-3.5 h-3.5" />
                Verified Craftsmen Directory
              </span>

              <button
                type="button"
                onClick={() => setLocationModalOpen(true)}
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 hover:bg-white/20 text-xs font-bold text-slate-200 border border-white/20 transition-colors"
              >
                <MapPin className="w-3.5 h-3.5 text-amber-400" />
                <span>📍 {selectedLocation || 'Ghaziabad'}</span>
                <span className="text-amber-400 ml-1 underline">{t('filterChangeLocation')}</span>
              </button>
            </div>

            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white font-sans">
              {t('findWorkersTitle')}
            </h1>
            <p className="text-xs sm:text-sm text-slate-300">
              {t('findWorkersSub')}
            </p>
          </div>

          <div className="absolute right-0 bottom-0 w-28 h-7 hazard-stripe-pattern transform rotate-6 translate-x-3 translate-y-2 opacity-70" />
        </div>

        {/* Search Bar */}
        <div className="relative">
          <Search className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={t('searchWorkersPlaceholder')}
            className="w-full pl-12 pr-10 py-3.5 rounded-2xl bg-white border border-slate-200 text-sm font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500 shadow-2xs placeholder:text-slate-400"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Horizontal Trade Filter Chips */}
        <div className="space-y-2.5">
          <div className="flex items-center gap-2 overflow-x-auto pb-1">
            {tradeFilters.map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setSelectedTrade(tab.id)}
                className={`px-3.5 py-2 rounded-2xl text-xs font-bold whitespace-nowrap transition-all ${
                  selectedTrade === tab.id
                    ? 'bg-amber-500 text-slate-950 shadow-sm ring-1 ring-amber-600'
                    : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Rating Pills & Sort By Row */}
          <div className="flex items-center justify-between gap-2 overflow-x-auto pt-1 text-xs">
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-slate-400 text-[11px] uppercase mr-1">रेटिंग:</span>
              {[
                { label: 'सभी', min: 0 },
                { label: '4.5+ ★', min: 4.5 },
                { label: '4.8+ ★', min: 4.8 },
              ].map((r) => (
                <button
                  key={r.label}
                  type="button"
                  onClick={() => setMinRating(r.min)}
                  className={`px-2.5 py-1 rounded-xl font-bold transition-colors ${
                    minRating === r.min
                      ? 'bg-slate-900 text-white'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {r.label}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-1 shrink-0">
              <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="bg-transparent font-bold text-slate-700 focus:outline-none cursor-pointer"
              >
                <option value="best">{t('sortBestMatch')}</option>
                <option value="rating">सर्वोत्तम रेटिंग (Highest Rated)</option>
                <option value="experience">अधिकतम अनुभव (Most Experienced)</option>
                <option value="jobs">काम पूरे किए (Most Jobs Completed)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Workers List Section */}
        <div className="space-y-4 pt-2">
          <div className="flex items-center justify-between px-1">
            <h2 className="text-base font-extrabold text-[#0B132B] flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-500" />
              <span>{t('recommendedWorkersHeading')} ({sortedWorkers.length})</span>
            </h2>
            {selectedTrade !== 'All' || minRating > 0 || searchQuery ? (
              <button
                type="button"
                onClick={() => {
                  setSelectedTrade('All');
                  setMinRating(0);
                  setSearchQuery('');
                }}
                className="text-xs text-amber-700 font-bold hover:underline"
              >
                फ़िल्टर हटाएं (Clear)
              </button>
            ) : null}
          </div>

          {sortedWorkers.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {sortedWorkers.map((worker) => (
                <WorkerCard
                  key={worker.id}
                  worker={worker}
                  onViewProfile={(w) => setSelectedWorkerForProfile(w)}
                  targetSkill={selectedTrade !== 'All' ? selectedTrade : 'Mason'}
                  targetCity={selectedLocation}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 px-4 rounded-[28px] bg-white border border-slate-200 p-8 space-y-3">
              <div className="w-14 h-14 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto shadow-inner">
                <Users className="w-7 h-7" />
              </div>
              <h3 className="text-lg font-black text-slate-900">
                {t('noMatchingWorkers')}
              </h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                {t('noMatchingWorkersSub')}
              </p>
              <button
                type="button"
                onClick={() => {
                  setSearchQuery('');
                  setSelectedTrade('All');
                  setMinRating(0);
                  setSelectedLocation('All');
                }}
                className="px-6 py-2.5 rounded-xl bg-[#0B132B] text-amber-400 text-xs font-bold hover:bg-slate-800 transition-colors inline-block"
              >
                सभी कामगार देखें (Browse All)
              </button>
            </div>
          )}
        </div>

      </div>

      {/* Location Modal */}
      {locationModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-sm bg-white rounded-[28px] p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-amber-500" />
                <span>स्थान चुनें (Select Location)</span>
              </h3>
              <button
                onClick={() => setLocationModalOpen(false)}
                className="p-1 rounded-full bg-slate-100"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-2">
              <button
                type="button"
                onClick={() => {
                  setSelectedLocation('All');
                  setLocationModalOpen(false);
                }}
                className={`w-full p-3 rounded-xl border text-left text-xs font-bold ${
                  selectedLocation === 'All'
                    ? 'bg-amber-100 border-amber-500 text-slate-950'
                    : 'bg-slate-50 border-slate-200 text-slate-700'
                }`}
              >
                सभी स्थान (All Locations in NCR)
              </button>

              {availableCities.map((city) => (
                <button
                  key={city}
                  type="button"
                  onClick={() => {
                    setSelectedLocation(city);
                    setLocationModalOpen(false);
                  }}
                  className={`w-full p-3 rounded-xl border text-left text-xs font-bold ${
                    selectedLocation === city
                      ? 'bg-amber-100 border-amber-500 text-slate-950'
                      : 'bg-slate-50 border-slate-200 text-slate-700'
                  }`}
                >
                  📍 {city}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Worker Profile Modal */}
      {selectedWorkerForProfile && (
        <WorkerProfileModal
          worker={selectedWorkerForProfile}
          onClose={() => setSelectedWorkerForProfile(null)}
          onHireClick={(w) => {
            setSelectedWorkerForProfile(null);
            setWorkerToHire(w);
          }}
        />
      )}

      {/* Hire Confirm Modal */}
      {workerToHire && (
        <HireConfirmModal
          worker={workerToHire}
          onClose={() => setWorkerToHire(null)}
          onConfirmHire={handleConfirmHire}
        />
      )}

      {/* Hire Success Modal */}
      {hiredSuccessWorker && (
        <HireSuccessModal
          worker={hiredSuccessWorker}
          onClose={() => setHiredSuccessWorker(null)}
        />
      )}

      {/* Mobile Bottom Nav */}
      <HirerBottomNav />
    </div>
  );
};
