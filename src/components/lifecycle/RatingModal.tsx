import React, { useState } from 'react';
import { Star, X, CheckCircle2, ArrowRight } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { useJobs } from '../../context/JobContext';
import { useAuth } from '../../context/AuthContext';

interface RatingModalProps {
  jobId: string;
  targetUserName: string;
  targetUserId: string;
  isWorkerRatingHirer: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const RatingModal: React.FC<RatingModalProps> = ({
  jobId,
  targetUserName,
  targetUserId,
  isWorkerRatingHirer,
  onClose,
  onSuccess,
}) => {
  const { t } = useLanguage();
  const { submitRating } = useJobs();
  const { auth } = useAuth();

  const [score, setScore] = useState(5);
  const [hoverScore, setHoverScore] = useState(0);
  const [comment, setComment] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const reviewerId = auth.userId || (isWorkerRatingHirer ? 'w-101' : 'h-201');
    const res = submitRating(jobId, reviewerId, targetUserId, score, comment);
    if (res.success) {
      alert(res.message);
      onSuccess();
      onClose();
    } else {
      alert(res.message);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150">
      <div className="relative w-full max-w-md bg-white rounded-[32px] border border-slate-200 p-6 shadow-2xl space-y-5 text-center">
        
        <div className="flex items-center justify-between pb-2 border-b border-slate-100">
          <h3 className="text-base font-black text-[#0B132B]">
            {isWorkerRatingHirer ? t('rateHirerTitle') : t('rateWorkerTitle')}
          </h3>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full bg-slate-100 text-slate-500"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div>
          <p className="text-xs text-slate-500">
            {isWorkerRatingHirer
              ? `${targetUserName} के साथ कार्य करने का आपका अनुभव कैसा रहा?`
              : `${targetUserName} के कार्य की गुणवत्ता और व्यवहार कैसा रहा?`}
          </p>
        </div>

        {/* Interactive 5-Star Row */}
        <div className="flex items-center justify-center gap-2 py-2">
          {[1, 2, 3, 4, 5].map((star) => {
            const isFilled = (hoverScore || score) >= star;
            return (
              <button
                key={star}
                type="button"
                onMouseEnter={() => setHoverScore(star)}
                onMouseLeave={() => setHoverScore(0)}
                onClick={() => setScore(star)}
                className="p-1 transition-transform hover:scale-125 focus:outline-none"
              >
                <Star
                  className={`w-9 h-9 transition-colors ${
                    isFilled
                      ? 'text-amber-400 fill-amber-400 stroke-amber-500'
                      : 'text-slate-200 stroke-slate-300'
                  }`}
                />
              </button>
            );
          })}
        </div>

        <div className="text-xs font-black text-amber-800">
          {score === 5 && 'शानदार कार्य (5.0 Excellent)'}
          {score === 4 && 'बहुत अच्छा (4.0 Very Good)'}
          {score === 3 && 'संतोषजनक (3.0 Good)'}
          {score === 2 && 'औसत (2.0 Average)'}
          {score === 1 && 'असंतोषजनक (1.0 Poor)'}
        </div>

        {/* Comment Box */}
        <form onSubmit={handleSubmit} className="space-y-4 text-left">
          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">
              अनुभव व टिप्पणी (Optional Comment)
            </label>
            <textarea
              rows={3}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="समय पर भुगतान, अच्छा व्यवहार, गुणवत्ता कार्य..."
              className="w-full p-3 rounded-2xl bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
          </div>

          <div className="flex items-center gap-3 pt-1">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3.5 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs"
            >
              बाद में दें (Skip)
            </button>
            <button
              type="submit"
              className="flex-1 py-3.5 rounded-2xl bg-[#0B132B] hover:bg-slate-800 text-amber-400 font-black text-xs shadow-md transition-all flex items-center justify-center gap-1.5"
            >
              <span>रेटिंग सबमिट करें</span>
              <CheckCircle2 className="w-4 h-4" />
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};
