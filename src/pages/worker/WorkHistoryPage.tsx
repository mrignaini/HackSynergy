import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Star,
  MapPin,
  Calendar,
  CheckCircle2,
  FileText,
  ShieldCheck,
  TrendingUp,
  Briefcase,
} from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { useJobs } from '../../context/JobContext';
import { useAuth } from '../../context/AuthContext';
import { WorkerBottomNav } from '../../components/navigation/WorkerBottomNav';
import { PaymentRecordModal } from '../../components/lifecycle/PaymentRecordModal';
import type { PaymentRecordItem } from '../../context/JobContext';

export const WorkHistoryPage: React.FC = () => {
  const { t, language } = useLanguage();
  const { jobs, ratings, paymentRecords, totalIncomeRecorded } = useJobs();
  const { auth } = useAuth();

  const [selectedRecord, setSelectedRecord] = useState<PaymentRecordItem | null>(null);

  // Completed jobs from state + seeded completed job-7
  const completedJobs = jobs.filter((j) => j.status === 'completed');

  // Reviews received by worker
  const workerReviews = ratings.filter((r) => r.toUserId === 'w-101');
  const avgRating = workerReviews.length > 0
    ? parseFloat((workerReviews.reduce((sum, r) => sum + r.score, 0) / workerReviews.length).toFixed(1))
    : 4.8;

  // Total income from payment records
  const allIncome = 242000 + totalIncomeRecorded;

  return (
    <div className="min-h-screen pb-24 md:pb-12 bg-[#FAF9F6]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">

        {/* Header */}
        <div className="rounded-[28px] bg-[#0B132B] text-white p-6 sm:p-8 shadow-xl space-y-3">
          <span className="px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-bold inline-block">
            Work Identity Record
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-white font-sans">
            {language === 'hi' ? 'काम का इतिहास (Work History)' : 'Work History'}
          </h1>
          <p className="text-xs text-slate-300">
            प्रत्येक पूर्ण कार्य आपकी डिजिटल पहचान का हिस्सा है।
          </p>

          {/* 4 quick stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
            {[
              { label: 'औसत रेटिंग', value: `${avgRating} ★`, color: 'text-amber-300' },
              { label: 'पूर्ण काम', value: `${12 + completedJobs.length}`, color: 'text-emerald-300' },
              { label: 'कुल दर्ज आय', value: `₹${(allIncome / 1000).toFixed(0)}K`, color: 'text-amber-300' },
              { label: 'समीक्षाएं', value: `${86 + workerReviews.length}`, color: 'text-emerald-300' },
            ].map((stat) => (
              <div key={stat.label} className="p-3 rounded-2xl bg-white/10 border border-white/10 text-center">
                <div className={`text-lg font-black font-sans ${stat.color}`}>{stat.value}</div>
                <div className="text-[10px] text-slate-300">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Reviews Section */}
        <div className="rounded-[28px] bg-white border border-slate-200/90 shadow-card p-5 sm:p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-extrabold text-[#0B132B]">
              प्राप्त समीक्षाएं (Reviews Received)
            </h3>
            <span className="px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900 text-xs font-bold">
              {86 + workerReviews.length} समीक्षाएं
            </span>
          </div>

          <div className="space-y-3">
            {/* Seeded Reviews */}
            {[
              { hirer: 'अमित शर्मा (Amit Sharma)', score: 5, comment: 'उत्कृष्ट राजमिस्त्री कार्य, समय पर पूर्ण किया। / Great work and completed on time.', date: '16 Aug 2026' },
              { hirer: 'सुरेश गुप्ता (Suresh Gupta)', score: 5, comment: 'सटीक प्लास्टर, बहुत अनुभवी। / Very skilled mason, precise plastering.', date: '10 Aug 2026' },
              { hirer: 'प्रिया सिंह (Priya Singh)', score: 4, comment: 'अच्छा काम। थोड़ी देर से आए पर मेहनती। / Good work, hard-working professional.', date: '2 Aug 2026' },
            ].map((review, i) => (
              <div key={i} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1.5">
                <div className="flex items-center justify-between">
                  <div className="font-bold text-slate-900 text-sm">{review.hirer}</div>
                  <div className="flex items-center gap-0.5">
                    {[...Array(5)].map((_, si) => (
                      <Star
                        key={si}
                        className={`w-3.5 h-3.5 ${si < review.score ? 'text-amber-400 fill-amber-400' : 'text-slate-200'}`}
                      />
                    ))}
                  </div>
                </div>
                <p className="text-xs text-slate-600">{review.comment}</p>
                <div className="text-[11px] text-slate-400">{review.date}</div>
              </div>
            ))}

            {/* Dynamic ratings from context */}
            {workerReviews.map((r) => (
              <div key={r.id} className="p-4 rounded-2xl bg-amber-50 border border-amber-200 space-y-1.5">
                <div className="flex items-center justify-between">
                  <div className="font-bold text-slate-900 text-sm">ठेकेदार (Verified Hirer)</div>
                  <div className="flex items-center gap-0.5">
                    {[...Array(5)].map((_, si) => (
                      <Star
                        key={si}
                        className={`w-3.5 h-3.5 ${si < r.score ? 'text-amber-400 fill-amber-400' : 'text-slate-200'}`}
                      />
                    ))}
                  </div>
                </div>
                {r.comment && <p className="text-xs text-slate-600">{r.comment}</p>}
                <div className="text-[11px] text-slate-400">{r.createdAt}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Completed Work History Cards */}
        <div className="rounded-[28px] bg-white border border-slate-200/90 shadow-card p-5 sm:p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-extrabold text-[#0B132B]">
              कार्य इतिहास (Work History)
            </h3>
            <Link
              to="/worker/financial-hub"
              className="text-xs font-bold text-amber-800 hover:underline"
            >
              सभी पर्चियां →
            </Link>
          </div>

          {/* Seeded history */}
          <div className="space-y-3">
            {[
              {
                title: 'बाउंड्री वॉल चिनाई (Boundary Wall)',
                location: 'Lajpat Nagar, Delhi',
                date: '15–16 Aug 2026',
                amount: 1900,
                skill: 'Mason',
                rating: 5.0,
              },
              {
                title: 'विला प्लास्टर और फिनिशिंग (Villa Plastering)',
                location: 'Raj Nagar Extension, Ghaziabad',
                date: '10–12 Aug 2026',
                amount: 3000,
                skill: 'Mason',
                rating: 5.0,
              },
              {
                title: 'बाथरूम टाइलिंग (Bathroom Tiles)',
                location: 'Vaishali, Ghaziabad',
                date: '5 Aug 2026',
                amount: 1000,
                skill: 'Tile Work',
                rating: 4.8,
              },
            ].map((item, i) => (
              <div
                key={i}
                className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <div className="flex items-center gap-3.5">
                  <div className="w-11 h-11 rounded-2xl bg-amber-100 flex items-center justify-center text-lg shrink-0">🧱</div>
                  <div>
                    <div className="text-sm font-extrabold text-slate-900">{item.title}</div>
                    <div className="text-xs text-slate-500 flex items-center gap-1.5 mt-0.5">
                      <MapPin className="w-3 h-3 text-slate-400" />
                      {item.location} • {item.date}
                    </div>
                    <div className="flex items-center gap-1 text-[11px] text-amber-800 font-bold mt-0.5">
                      <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                      {item.rating} ★ • {item.skill}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <div className="text-right">
                    <div className="text-base font-black text-slate-900 font-sans">
                      ₹{item.amount.toLocaleString('en-IN')}
                    </div>
                    <span className="text-[10px] text-emerald-700 font-bold">✓ Completed</span>
                  </div>
                </div>
              </div>
            ))}

            {/* Dynamic completed jobs from context */}
            {completedJobs.map((job) => {
              const totalEarned = job.wagePerDay * (job.durationDays || 1);
              const matchingPayment = paymentRecords.find((p) => p.jobId === job.id);

              return (
                <div
                  key={job.id}
                  className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                >
                  <div className="flex items-center gap-3.5">
                    <div className="w-11 h-11 rounded-2xl bg-emerald-100 flex items-center justify-center text-lg shrink-0">
                      <CheckCircle2 className="w-6 h-6 text-emerald-600" />
                    </div>
                    <div>
                      <div className="text-sm font-extrabold text-slate-900">
                        {language === 'hi' ? job.titleHi : job.title}
                      </div>
                      <div className="text-xs text-slate-500 flex items-center gap-1.5 mt-0.5">
                        <MapPin className="w-3 h-3 text-slate-400" />
                        {job.location.locality}, {job.location.city} • {job.startDate}
                      </div>
                      <div className="text-[11px] text-emerald-700 font-bold mt-0.5">
                        ✓ Completed • {job.durationDays} दिन कार्य
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <div className="text-right">
                      <div className="text-base font-black text-slate-900 font-sans">
                        ₹{totalEarned.toLocaleString('en-IN')}
                      </div>
                      <span className="text-[10px] text-emerald-700 font-bold">✓ Recorded</span>
                    </div>
                    {matchingPayment && (
                      <button
                        type="button"
                        onClick={() => setSelectedRecord(matchingPayment)}
                        className="px-2.5 py-1.5 rounded-xl bg-white border border-emerald-300 text-emerald-900 text-xs font-bold"
                      >
                        <FileText className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {completedJobs.length === 0 && (
            <div className="text-center py-8 text-slate-500 text-xs">
              कोई नया पूर्ण कार्य नहीं मिला।
              <br />
              <Link to="/find-work" className="text-amber-700 font-bold hover:underline">
                काम खोजें →
              </Link>
            </div>
          )}
        </div>

        {/* Digital Identity Preview */}
        <div className="rounded-[28px] bg-gradient-to-r from-[#0B132B] to-[#1a2a50] text-white p-6 shadow-xl space-y-4">
          <span className="px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-bold">
            OFFICIAL WORKER ID • श्रमिक डिजिटल पहचान
          </span>
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <h3 className="text-xl font-black text-white font-sans">रमेश कुमार</h3>
              <p className="text-xs text-slate-300">राजमिस्त्री एवं सिविल कार्य • ग्रेड A</p>
            </div>
            <div className="text-right">
              <div className="text-2xl font-black text-amber-400 font-sans">{avgRating} ★</div>
              <div className="text-[11px] text-slate-400">{86 + workerReviews.length} रेटिंग</div>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
            {[
              { label: 'पूर्ण काम', value: `${12 + completedJobs.length}` },
              { label: 'अनुभव', value: '7 वर्ष' },
              { label: 'कौशल', value: '5 Skills' },
              { label: 'दर्ज आय', value: `₹${(allIncome / 1000).toFixed(0)}K` },
            ].map((item) => (
              <div key={item.label} className="p-2.5 rounded-xl bg-white/10 border border-white/10 text-center">
                <div className="text-base font-black text-white">{item.value}</div>
                <div className="text-[10px] text-slate-400">{item.label}</div>
              </div>
            ))}
          </div>

          <div className="flex items-center gap-2 pt-1">
            <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
            <span className="text-xs text-emerald-300 font-bold">
              Aadhaar ✓ • e-Shram ✓ • BOCW ✓ • Bank Account ✓
            </span>
          </div>
        </div>

      </div>

      {selectedRecord && (
        <PaymentRecordModal
          record={selectedRecord}
          onClose={() => setSelectedRecord(null)}
        />
      )}

      <WorkerBottomNav />
    </div>
  );
};
