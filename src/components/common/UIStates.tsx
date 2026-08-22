import React from 'react';
import { Loader2, AlertTriangle, FolderOpen, RefreshCw } from 'lucide-react';
import { Link } from 'react-router-dom';

export const LoadingState: React.FC<{ message?: string }> = ({ message = 'डेटा लोड हो रहा है... / Loading...' }) => (
  <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
    <div className="w-12 h-12 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-600 mb-3 shadow-inner">
      <Loader2 className="w-6 h-6 animate-spin" />
    </div>
    <p className="text-sm font-medium text-slate-600">{message}</p>
  </div>
);

export const EmptyState: React.FC<{
  title: string;
  description?: string;
  actionText?: string;
  actionHref?: string;
  onAction?: () => void;
}> = ({ title, description, actionText, actionHref, onAction }) => (
  <div className="flex flex-col items-center justify-center py-12 px-4 text-center rounded-2xl border-2 border-dashed border-slate-200 bg-white/50">
    <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 mb-3">
      <FolderOpen className="w-6 h-6" />
    </div>
    <h4 className="text-base font-semibold text-slate-800">{title}</h4>
    {description && <p className="text-xs text-slate-500 max-w-sm mt-1 mb-4">{description}</p>}
    {actionText && (
      actionHref ? (
        <Link
          to={actionHref}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#0B132B] text-white text-xs font-semibold hover:bg-slate-800 transition-colors"
        >
          {actionText}
        </Link>
      ) : (
        <button
          onClick={onAction}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#0B132B] text-white text-xs font-semibold hover:bg-slate-800 transition-colors"
        >
          {actionText}
        </button>
      )
    )}
  </div>
);

export const ErrorState: React.FC<{
  title?: string;
  message?: string;
  onRetry?: () => void;
}> = ({
  title = 'कोई समस्या आई / Something went wrong',
  message = 'कृपया पुनः प्रयास करें या पृष्ठ को रीलोड करें।',
  onRetry,
}) => (
  <div className="flex flex-col items-center justify-center py-12 px-4 text-center rounded-2xl border border-red-200 bg-red-50/50">
    <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center text-red-600 mb-3">
      <AlertTriangle className="w-6 h-6" />
    </div>
    <h4 className="text-base font-semibold text-red-900">{title}</h4>
    <p className="text-xs text-red-700 max-w-sm mt-1 mb-4">{message}</p>
    {onRetry && (
      <button
        onClick={onRetry}
        className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-red-600 text-white text-xs font-semibold hover:bg-red-700 transition-colors"
      >
        <RefreshCw className="w-3.5 h-3.5" />
        <span>पुनः प्रयास करें / Retry</span>
      </button>
    )}
  </div>
);
