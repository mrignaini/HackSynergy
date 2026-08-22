import React, { useMemo } from 'react';
import { getQRCodeSvgPath } from '../../utils/qrCode';
import { QrCode, Copy, Check, Download, Share2 } from 'lucide-react';

interface QRCodeViewProps {
  value: string;
  size?: number;
  label?: string;
  sublabel?: string;
  showActions?: boolean;
}

export const QRCodeView: React.FC<QRCodeViewProps> = ({
  value,
  size = 200,
  label,
  sublabel,
  showActions = true,
}) => {
  const [copied, setCopied] = React.useState(false);

  const { path, size: matrixSize } = useMemo(() => {
    return getQRCodeSvgPath(value, 6);
  }, [value]);

  const handleCopy = async () => {
    try {
      if (navigator.clipboard) {
        await navigator.clipboard.writeText(value);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }
    } catch {
      // Fallback
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: label || 'SHRAMIKK Digital Work Identity',
          text: sublabel || 'View verified SHRAMIKK Digital Work Identity',
          url: value,
        });
      } catch {
        // Ignored if cancelled
      }
    } else {
      handleCopy();
    }
  };

  return (
    <div className="flex flex-col items-center text-center p-4 bg-white rounded-3xl border border-slate-200/90 shadow-card">
      <div className="p-3.5 bg-slate-900 rounded-2xl shadow-inner mb-3">
        <svg
          viewBox={`0 0 ${matrixSize} ${matrixSize}`}
          width={size}
          height={size}
          className="text-amber-400 fill-amber-400 bg-slate-950 p-2 rounded-xl"
        >
          <path d={path} />
        </svg>
      </div>

      {label && (
        <h4 className="text-sm font-black text-[#0B132B]">{label}</h4>
      )}
      {sublabel && (
        <p className="text-[11px] text-slate-500 mt-0.5 max-w-xs">{sublabel}</p>
      )}

      {showActions && (
        <div className="flex items-center gap-2 mt-4 w-full">
          <button
            type="button"
            onClick={handleCopy}
            className="flex-1 py-2 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold flex items-center justify-center gap-1.5 transition-colors"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-600" />
                <span className="text-emerald-700">लिंक कॉपी हुआ ✓</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5 text-slate-600" />
                <span>कॉपी लिंक (Copy)</span>
              </>
            )}
          </button>

          <button
            type="button"
            onClick={handleShare}
            className="py-2 px-4 rounded-xl bg-[#0B132B] hover:bg-slate-800 text-amber-400 text-xs font-bold flex items-center justify-center gap-1.5 transition-colors shadow-2xs"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>शेयर (Share)</span>
          </button>
        </div>
      )}
    </div>
  );
};
