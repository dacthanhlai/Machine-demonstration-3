import React, { useState } from 'react';
import { useLanguage } from '../i18n/LanguageContext';
import { X, ExternalLink, Copy, Check, Info, Globe, Monitor } from 'lucide-react';

interface OpenTabModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const OpenTabModal: React.FC<OpenTabModalProps> = ({ isOpen, onClose }) => {
  const { language, t } = useLanguage();
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const currentHref = typeof window !== 'undefined' ? window.location.href : '';
  const appUrl =
    currentHref && !currentHref.includes('about:blank')
      ? currentHref
      : 'https://ais-pre-c5hedmtgzmimd24z2gxb7g-476277255723.asia-southeast1.run.app';

  const handleCopy = () => {
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(appUrl);
      } else {
        const textarea = document.createElement('textarea');
        textarea.value = appUrl;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
      }
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4 select-none">
      <div className="bg-slate-900 border border-slate-700 w-full max-w-lg rounded-xl shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-900/60">
          <div className="flex items-center gap-2.5">
            <ExternalLink className="w-5 h-5 text-sky-400" />
            <div>
              <h2 className="text-base font-semibold text-slate-100">{t.openTabModalTitle}</h2>
              <p className="text-xs text-slate-400">{t.openTabModalSubtitle}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-slate-200 rounded cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-5 text-xs text-slate-300">
          <div className="flex items-start gap-3 p-3 bg-sky-950/40 border border-sky-800/60 rounded-xl">
            <Monitor className="w-5 h-5 text-sky-400 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <span className="font-semibold text-sky-200 block text-sm">
                {language === 'vi' ? 'Toàn màn hình & Tối ưu hiệu năng' : 'Full Screen & Hardware Acceleration'}
              </span>
              <p className="text-slate-400 leading-relaxed text-[11px]">
                {t.openTabDesc}
              </p>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="font-semibold text-slate-300 block">{language === 'vi' ? 'Đường link trực tiếp của ứng dụng:' : 'Direct Application URL:'}</label>
            <div className="flex items-center gap-2 bg-slate-950 border border-slate-800 p-2 rounded-lg">
              <Globe className="w-4 h-4 text-slate-500 shrink-0" />
              <input
                type="text"
                readOnly
                value={appUrl}
                className="bg-transparent text-sky-300 font-mono text-xs w-full outline-none truncate select-all"
              />
              <button
                type="button"
                onClick={handleCopy}
                className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded text-xs font-medium shrink-0 flex items-center gap-1 transition-colors cursor-pointer"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? t.copiedSuccess : t.copyLinkBtn}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-slate-800 bg-slate-900/60">
          <button onClick={onClose} className="px-4 py-2 text-slate-400 hover:text-slate-200 rounded-lg cursor-pointer">
            {t.cancel}
          </button>
          <a
            href={appUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-4 py-2 bg-sky-600 hover:bg-sky-500 text-white font-semibold rounded-lg shadow-sm transition-colors text-xs"
          >
            <span>{t.openDirectTabBtn}</span>
          </a>
        </div>
      </div>
    </div>
  );
};
