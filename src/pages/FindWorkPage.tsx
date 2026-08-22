import React, { useState } from 'react';
import {
  HardHat,
  Search,
  MapPin,
  Filter,
  ArrowUpDown,
  Sparkles,
  AlertCircle,
  CheckCircle2,
  X,
  SlidersHorizontal,
  ChevronDown,
} from 'lucide-react';
import type { Job, SkillCategory } from '../types';
import { useLanguage } from '../context/LanguageContext';
import { useJobs } from '../context/JobContext';
import { useAuth } from '../context/AuthContext';
import { JobCard } from '../components/marketplace/JobCard';
import { JobDetailsModal } from '../components/marketplace/JobDetailsModal';
import { ApplicationConfirmModal } from '../components/marketplace/ApplicationConfirmModal';
import { ApplicationSuccessModal } from '../components/marketplace/ApplicationSuccessModal';
import { WorkerBottomNav } from '../components/navigation/WorkerBottomNav';

export const FindWorkPage: React.FC = () => {
  const { t, language } = useLanguage();
  const { jobs, applyToJob, calculateMatchScore, selectedLocation, setSelectedLocation } = useJobs();
  const { auth } = useAuth();

  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSkillFilter, setSelectedSkillFilter] = useState('All');
  const [minWageFilter, setMinWageFilter] = useState<number>(0);
  const [sortBy, setSortBy] = useState<'best' | 'nearest' | 'wage' | 'newest'>('best');
  const [locationModalOpen, setLocationModalOpen] = useState(false);

  // Modals state
  const [selectedJobForDetails, setSelectedJobForDetails] = useState<Job | null>(null);
  const [jobToApply, setJobToApply] = useState<Job | null>(null);
  const [successJob, setSuccessJob] = useState<Job | null>(null);
  const [showBeyondModal, setShowBeyondModal] = useState(false);

  // Worker availability check (from profile or demo state)
  const isWorkerAvailable = true; // Can be linked to auth or state

  const availableCities = ['Ghaziabad', 'Indirapuram', 'Noida', 'Greater Noida', 'Delhi', 'Gurugram'];

  const skillFilters: { id: string; label: string }[] = [
    { id: 'All', label: t('filterAll') },
    { id: 'Mason', label: t('skillMason') },
    { id: 'Helper', label: t('skillHelper') },
    { id: 'Painter', label: t('skillPainter') },
    { id: 'Plumber', label: t('skillPlumber') },
    { id: 'Carpenter', label: t('skillCarpenter') },
    { id: 'Tile', label: t('skillTile') },
  ];

  // Filtering Logic
  const filteredJobs = jobs.filter((job) => {
    // Search query
    const matchesSearch =
      !searchQuery.trim() ||
      job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.titleHi.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.location.locality.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.location.city.toLowerCase().includes(searchQuery.toLowerCase());

    // Skill filter
    const matchesSkill =
      selectedSkillFilter === 'All' ||
      job.category.toLowerCase().includes(selectedSkillFilter.toLowerCase());

    // Wage filter
    const matchesWage = job.wagePerDay >= minWageFilter;

    // Location filter (broad or specific)
    const matchesLocation =
      !selectedLocation ||
      selectedLocation === 'All' ||
      job.location.city.toLowerCase().includes(selectedLocation.toLowerCase()) ||
      selectedLocation.toLowerCase().includes(job.location.city.toLowerCase());

    return matchesSearch && matchesSkill && matchesWage && matchesLocation;
  });

  // Sorting Logic
  const sortedJobs = [...filteredJobs].sort((a, b) => {
    if (sortBy === 'best') {
      return calculateMatchScore(b).score - calculateMatchScore(a).score;
    } else if (sortBy === 'wage') {
      return b.wagePerDay - a.wagePerDay;
    } else if (sortBy === 'nearest') {
      const isANear = a.location.city.toLowerCase() === selectedLocation.toLowerCase() ? 1 : 0;
      const isBNear = b.location.city.toLowerCase() === selectedLocation.toLowerCase() ? 1 : 0;
      return isBNear - isANear;
    }
    return 0; // newest
  });

  // Handle Application Submit
  const handleConfirmApplication = () => {
    if (!jobToApply) return;
    const res = applyToJob(jobToApply);
    if (res.success) {
      const applied = jobToApply;
      setJobToApply(null);
      setSelectedJobForDetails(null);
      setSuccessJob(applied);
    } else {
      alert(res.message);
      setJobToApply(null);
    }
  };

  return (
    <div className="min-h-screen pb-24 md:pb-12 bg-[#FAF9F6]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-5">
        
        {/* ========================================================================= */}
        {/* 1. TOP HEADER & WORKER MATCHING BANNER */}
        {/* ========================================================================= */}
        <div className="rounded-[28px] bg-[#0B132B] text-white p-6 sm:p-8 shadow-xl relative overflow-hidden">
          <div className="relative z-10 space-y-2">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-bold">
                <HardHat className="w-3.5 h-3.5" />
                Chowk Direct Marketplace
              </span>

              {/* Location Badge with Change Button */}
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
              {t('marketTitle')}
            </h1>
            <p className="text-xs sm:text-sm text-slate-300">
              {t('marketSubtitle')} • <strong className="text-amber-400">{auth.workerProfile?.skills?.[0] || 'राजमिस्त्री (Mason)'}</strong>
            </p>
          </div>

          <div className="absolute right-0 bottom-0 w-28 h-7 hazard-stripe-pattern transform rotate-6 translate-x-3 translate-y-2 opacity-70" />
        </div>

        {/* ========================================================================= */}
        {/* 2. SEARCH BAR */}
        {/* ========================================================================= */}
        <div className="relative">
          <Search className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={t('searchPlaceholder')}
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

        {/* ========================================================================= */}
        {/* 3. HORIZONTAL FILTERS & SORT ROW */}
        {/* ========================================================================= */}
        <div className="space-y-2.5">
          {/* Skill Filter Chips + Beyond Construction Selector */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
            {skillFilters.map((chip) => (
              <button
                key={chip.id}
                type="button"
                onClick={() => setSelectedSkillFilter(chip.id)}
                className={`px-3.5 py-2 rounded-2xl text-xs font-bold whitespace-nowrap transition-all ${
                  selectedSkillFilter === chip.id
                    ? 'bg-amber-500 text-slate-950 shadow-sm ring-1 ring-amber-600'
                    : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
                }`}
              >
                {chip.label}
              </button>
            ))}

            <button
              type="button"
              onClick={() => setShowBeyondModal(true)}
              className="px-3.5 py-2 rounded-2xl text-xs font-bold whitespace-nowrap bg-emerald-50 text-emerald-900 border border-emerald-300 hover:bg-emerald-100 transition-colors flex items-center gap-1 shrink-0"
            >
              <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
              <span>+ अन्य श्रेणियां (More)</span>
            </button>
          </div>

          {/* Wage Pills & Sort Selector Row */}
          <div className="flex items-center justify-between gap-2 overflow-x-auto pt-1 text-xs">
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-slate-400 text-[11px] uppercase mr-1">वेतन:</span>
              {[
                { label: 'सभी', min: 0 },
                { label: '₹750+', min: 750 },
                { label: '₹1000+', min: 1000 },
              ].map((w) => (
                <button
                  key={w.label}
                  type="button"
                  onClick={() => setMinWageFilter(w.min)}
                  className={`px-2.5 py-1 rounded-xl font-bold transition-colors ${
                    minWageFilter === w.min
                      ? 'bg-slate-900 text-white'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {w.label}
                </button>
              ))}
            </div>

            {/* Sort Dropdown */}
            <div className="flex items-center gap-1 shrink-0">
              <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="bg-transparent font-bold text-slate-700 focus:outline-none cursor-pointer"
              >
                <option value="best">{t('sortBestMatch')}</option>
                <option value="nearest">{t('sortNearest')}</option>
                <option value="wage">{t('sortHighestPay')}</option>
                <option value="newest">{t('sortNewest')}</option>
              </select>
            </div>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* 4. JOBS LIST SECTION */}
        {/* ========================================================================= */}
        <div className="space-y-4 pt-2">
          <div className="flex items-center justify-between px-1">
            <h2 className="text-base font-extrabold text-[#0B132B] font-sans flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-500" />
              <span>{t('jobsForYouHeading')} ({sortedJobs.length})</span>
            </h2>
            {selectedSkillFilter !== 'All' || minWageFilter > 0 || searchQuery ? (
              <button
                type="button"
                onClick={() => {
                  setSelectedSkillFilter('All');
                  setMinWageFilter(0);
                  setSearchQuery('');
                }}
                className="text-xs text-amber-700 font-bold hover:underline"
              >
                {t('btnClearFilters')}
              </button>
            ) : null}
          </div>

          {/* Render Job Cards */}
          {sortedJobs.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {sortedJobs.map((job) => (
                <JobCard
                  key={job.id}
                  job={job}
                  onViewDetails={(j) => setSelectedJobForDetails(j)}
                />
              ))}
            </div>
          ) : (
            /* Empty State */
            <div className="text-center py-12 px-4 rounded-[28px] bg-white border border-slate-200 p-8 space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto shadow-inner">
                <Search className="w-7 h-7" />
              </div>
              <div>
                <h3 className="text-lg font-black text-slate-900">
                  {searchQuery ? `${t('searchNoResults')} "${searchQuery}"` : t('noMatchJobsTitle')}
                </h3>
                <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                  {searchQuery ? t('searchTryAnother') : t('noMatchJobsSub')}
                </p>
              </div>

              <button
                type="button"
                onClick={() => {
                  setSearchQuery('');
                  setSelectedSkillFilter('All');
                  setMinWageFilter(0);
                  setSelectedLocation('All');
                }}
                className="px-6 py-2.5 rounded-xl bg-[#0B132B] text-amber-400 text-xs font-bold hover:bg-slate-800 transition-colors inline-block"
              >
                {t('btnBrowseAllJobs')}
              </button>
            </div>
          )}
        </div>

      </div>

      {/* ========================================================================= */}
      {/* 5. LOCATION CHANGE MODAL */}
      {/* ========================================================================= */}
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

      {/* ========================================================================= */}
      {/* 6. JOB DETAILS MODAL */}
      {/* ========================================================================= */}
      {selectedJobForDetails && (
        <JobDetailsModal
          job={selectedJobForDetails}
          onClose={() => setSelectedJobForDetails(null)}
          onApplyClick={(j) => {
            setSelectedJobForDetails(null);
            setJobToApply(j);
          }}
        />
      )}

      {/* ========================================================================= */}
      {/* 7. APPLICATION CONFIRMATION MODAL */}
      {/* ========================================================================= */}
      {jobToApply && (
        <ApplicationConfirmModal
          job={jobToApply}
          onClose={() => setJobToApply(null)}
          onConfirm={handleConfirmApplication}
        />
      )}

      {/* ========================================================================= */}
      {/* 9. BEYOND CONSTRUCTION EXPANSION MODAL */}
      {/* ========================================================================= */}
      {showBeyondModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="relative w-full max-w-md bg-white rounded-[32px] border border-slate-200 p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-amber-500" />
                <h3 className="text-base font-black text-[#0B132B]">
                  SHRAMIKK Beyond Construction
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowBeyondModal(false)}
                className="p-1.5 rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-slate-600">
              भविष्य के चरणों में SHRAMIKK निर्माण क्षेत्र से आगे बढ़कर अन्य सभी असंगठित ट्रेडों में डिजिटल पहचान व सुरक्षा का विस्तार करेगा:
            </p>

            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="p-3 rounded-2xl bg-emerald-50 border border-emerald-200 font-bold text-emerald-950 flex items-center gap-2">
                <HardHat className="w-4 h-4 text-emerald-700" />
                <span>निर्माण कार्य (Active ✓)</span>
              </div>
              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 text-slate-600 flex items-center gap-2">
                <span>🧹 घरेलू सेवाएं (Coming Soon)</span>
              </div>
              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 text-slate-600 flex items-center gap-2">
                <span>📦 डिलीवरी व लॉजिस्टिक्स</span>
              </div>
              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 text-slate-600 flex items-center gap-2">
                <span>🔧 रिपेयर व मेंटेनेंस</span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setShowBeyondModal(false)}
              className="w-full py-2.5 rounded-2xl bg-[#0B132B] text-white text-xs font-bold hover:bg-slate-800"
            >
              समझ आ गया (Understood)
            </button>
          </div>
        </div>
      )}

      {/* Mobile Bottom Navigation */}
      <WorkerBottomNav />
    </div>
  );
};
