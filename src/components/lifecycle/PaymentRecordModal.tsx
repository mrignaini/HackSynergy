import React from 'react';
import { X, ShieldCheck, CheckCircle2, IndianRupee, Download, Share2, FileText, MapPin } from 'lucide-react';
import type { PaymentRecordItem } from '../../context/JobContext';
import { useLanguage } from '../../context/LanguageContext';

interface PaymentRecordModalProps {
  record: PaymentRecordItem | null;
  onClose: () => void;
}

export const PaymentRecordModal: React.FC<PaymentRecordModalProps> = ({
  record,
  onClose,
}) => {
  const { t } = useLanguage();

  if (!record) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150">
      <div className="relative w-full max-w-md bg-white rounded-[32px] border border-slate-200 p-6 sm:p-8 shadow-2xl space-y-5">
        
        {/* Top Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
              ₹
            </div>
            <div>
              <span className="text-[10px] font-black uppercase text-emerald-800 tracking-wider">
                Official Wage Record
              </span>
              <h3 className="text-base font-black text-[#0B132B]">
                डिजिटल वेतन रसीद (Wage Slip)
              </h3>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-full bg-slate-100 text-slate-500"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Certificate Style Slip Card */}
        <div className="p-5 rounded-[24px] bg-gradient-to-b from-[#FFFDF8] to-[#FAF6EE] border-2 border-amber-300 shadow-sm space-y-4 text-xs">
          <div className="flex items-start justify-between border-b border-amber-200/80 pb-3">
            <div>
              <div className="text-[11px] text-slate-500 font-semibold">पर्ची संख्या (Slip No.)</div>
              <strong className="text-slate-900 font-mono text-xs">{record.slipNumber}</strong>
            </div>
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-900 text-[10px] font-black border border-emerald-300">
              ✓ 100% प्रमाणित
            </span>
          </div>

          {/* Job & Parties Info */}
          <div className="space-y-2">
            <div>
              <span className="text-slate-500 text-[11px]">कार्य विवरण (Job Title):</span>
              <div className="font-extrabold text-slate-900 text-sm">{record.jobTitle}</div>
            </div>

            <div className="grid grid-cols-2 gap-2 pt-1">
              <div>
                <span className="text-slate-500 text-[11px]">कामगार (Worker):</span>
                <div className="font-bold text-slate-900">{record.workerName}</div>
              </div>
              <div>
                <span className="text-slate-500 text-[11px]">नियोक्ता (Hirer):</span>
                <div className="font-bold text-slate-900">{record.hirerName}</div>
              </div>
            </div>

            <div className="flex items-center gap-1 text-slate-600 pt-1">
              <MapPin className="w-3.5 h-3.5 text-slate-400" />
              <span>{record.location} • तारीख: {record.date}</span>
            </div>
          </div>

          {/* Amount Calculation Box */}
          <div className="p-3.5 rounded-2xl bg-white border border-amber-200 flex items-center justify-between">
            <div>
              <span className="text-[11px] text-slate-500 block">कुल दर्ज पारिश्रमिक</span>
              <div className="text-2xl font-black text-slate-900 font-sans mt-0.5">
                ₹{record.amount.toLocaleString('en-IN')}
              </div>
            </div>
            <div className="text-right text-[11px] text-slate-600">
              <div>दर: ₹{record.wagePerDay} / दिन</div>
              <div>अवधि: {record.durationDays} कार्य दिवस</div>
            </div>
          </div>

          {/* Two-Sided Verification Status */}
          <div className="p-3 rounded-2xl bg-white border border-slate-200 space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-slate-600">सत्यापन स्थिति (Status):</span>
              {record.status === 'verified' ? (
                <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-900 text-[10px] font-black flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3 text-emerald-700" />
                  ✓ Payment Verified
                </span>
              ) : record.status === 'under_review' ? (
                <span className="px-2 py-0.5 rounded-full bg-red-100 text-red-900 text-[10px] font-bold">
                  ⚠️ Under Review
                </span>
              ) : (
                <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 text-[10px] font-bold">
                  ⏳ Awaiting Confirmation
                </span>
              )}
            </div>
            <div className="grid grid-cols-2 gap-1.5 text-[10px] text-slate-500 pt-1 border-t border-slate-100">
              <div className="flex items-center gap-1">
                {record.workerConfirmed ? (
                  <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                ) : (
                  <div className="w-2.5 h-2.5 rounded-full bg-amber-400" />
                )}
                <span>कामगार पुष्टि: {record.workerConfirmed ? 'प्राप्त हुआ ✓' : 'लंबित'}</span>
              </div>
              <div className="flex items-center gap-1">
                {record.hirerConfirmed ? (
                  <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                ) : (
                  <div className="w-2.5 h-2.5 rounded-full bg-amber-400" />
                )}
                <span>नियोक्ता पुष्टि: {record.hirerConfirmed ? 'भुगतान किया ✓' : 'लंबित'}</span>
              </div>
            </div>
          </div>

          {/* Trust Seal */}
          <div className="flex items-center gap-2 text-[11px] text-emerald-800 bg-emerald-50/90 p-2.5 rounded-xl border border-emerald-200">
            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>यह पर्ची SHRAMIKK दो-तरफ़ा सत्यापन पर आधारित वैध कार्य व आय प्रमाण है।</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-3 pt-1">
          <button
            type="button"
            onClick={() => alert(`पर्ची डाउनलोड हुई: ${record.slipNumber}.pdf`)}
            className="flex-1 py-3.5 rounded-2xl bg-[#0B132B] hover:bg-slate-800 text-amber-400 font-black text-xs shadow-md transition-all flex items-center justify-center gap-2"
          >
            <Download className="w-4 h-4" />
            <span>PDF डाउनलोड करें</span>
          </button>
          <button
            type="button"
            onClick={() => alert('पर्ची का लिंक कॉपी किया गया।')}
            className="py-3.5 px-4 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs"
          >
            <Share2 className="w-4 h-4" />
          </button>
        </div>

      </div>
    </div>
  );
};
