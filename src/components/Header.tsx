import React from 'react';
import { Download, Globe } from 'lucide-react';
import { useLanguage } from '../i18n/LanguageContext';

interface HeaderProps {
  onExportConfig: () => void;
  onOpenReportModal?: () => void;
  onResetMachine?: () => void;
  onOpenNewTab?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  onExportConfig,
  onOpenNewTab,
}) => {
  const { language, setLanguage, toggleLanguage, t } = useLanguage();

  return (
    <header className="flex items-center justify-between gap-4 sm:gap-8 px-4 sm:px-6 py-3 bg-slate-900 border-b border-slate-800 text-slate-100 select-none">
      {/* Zone 1: Single text element wordmark */}
      <div className="flex items-center gap-2.5 whitespace-nowrap shrink-0">
        <div className="w-8 h-8 rounded-lg bg-sky-600 flex items-center justify-center font-bold text-white shadow-md shadow-sky-950 font-mono text-sm">
          TX
        </div>
        <div className="flex flex-col">
          <span className="text-base font-bold tracking-tight text-slate-100 whitespace-nowrap shrink-0 font-sans leading-none">
            TexTear 3D
          </span>
          <span className="text-[10px] text-slate-400 font-medium tracking-normal mt-0.5 hidden sm:inline">
            {t.brandSub}
          </span>
        </div>
      </div>

      {/* Zone 2: 4–5 clean single-line text navigation links */}
      <nav className="hidden lg:flex items-center gap-6 text-xs font-medium text-slate-400">
        <a href="#machine" className="hover:text-slate-100 transition-colors whitespace-nowrap shrink-0">
          {t.navMachine}
        </a>
        <a href="#kinematics" className="hover:text-slate-100 transition-colors whitespace-nowrap shrink-0">
          {t.navKinematics}
        </a>
        <a href="#clearance" className="hover:text-slate-100 transition-colors whitespace-nowrap shrink-0">
          {t.navClearance}
        </a>
        <a href="#diagnostics" className="hover:text-slate-100 transition-colors whitespace-nowrap shrink-0">
          {t.navDiagnostics}
        </a>
        <a href="#suction" className="hover:text-slate-100 transition-colors whitespace-nowrap shrink-0">
          {t.navSuction}
        </a>
      </nav>

      {/* Zone 3: Actions + Language Switcher */}
      <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">
        {/* Prominent Language Switcher Button */}
        <div className="flex items-center bg-slate-950 border border-slate-700/80 rounded-lg p-0.5 shadow-sm">
          <button
            type="button"
            onClick={() => setLanguage('vi')}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold transition-all cursor-pointer ${
              language === 'vi'
                ? 'bg-sky-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
            title="Chuyển sang Tiếng Việt"
          >
            <span className="text-sm leading-none">🇻🇳</span>
            <span className="hidden sm:inline">Tiếng Việt</span>
            <span className="sm:hidden">VI</span>
          </button>
          <button
            type="button"
            onClick={() => setLanguage('en')}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold transition-all cursor-pointer ${
              language === 'en'
                ? 'bg-sky-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
            title="Switch to English"
          >
            <span className="text-sm leading-none">🇬🇧</span>
            <span className="hidden sm:inline">English</span>
            <span className="sm:hidden">EN</span>
          </button>
        </div>

        {onOpenNewTab && (
          <button
            onClick={onOpenNewTab}
            className="hidden md:flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-sky-300 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg shadow-sm transition-colors whitespace-nowrap shrink-0"
            title={language === 'vi' ? 'Mở ứng dụng sang tab mới độc lập hoặc sao chép link' : 'Open in dedicated browser tab'}
          >
            <span>{t.openNewTab}</span>
          </button>
        )}

        <button
          onClick={onExportConfig}
          className="flex items-center gap-1.5 px-3 sm:px-3.5 py-1.5 text-xs font-semibold text-slate-100 bg-sky-600 hover:bg-sky-500 rounded-lg shadow-sm transition-colors whitespace-nowrap shrink-0"
        >
          <Download className="w-3.5 h-3.5" />
          <span>{t.exportConfig}</span>
        </button>
      </div>
    </header>
  );
};
