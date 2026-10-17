import React, { useState } from 'react';
import { SavedConfiguration, MachineComponent, SuctionSystemConfig, MaterialFeedConfig } from '../types/machine';
import { useLanguage } from '../i18n/LanguageContext';
import { getLocalizedComponentName } from '../utils/presets';
import { X, Save, FolderOpen, Trash2, Download, Upload, ExternalLink, Copy, Check, Clock, Calendar, CheckCircle2 } from 'lucide-react';

interface SavedConfigsModalProps {
  isOpen: boolean;
  onClose: () => void;
  savedConfigs: SavedConfiguration[];
  onSaveCurrent: (name: string, notes?: string) => void;
  onLoadConfig: (config: SavedConfiguration) => void;
  onDeleteConfig: (id: string) => void;
  onImportConfig: (config: SavedConfiguration) => void;
  currentComponents: MachineComponent[];
  currentSuction: SuctionSystemConfig;
  currentMaterial: MaterialFeedConfig;
}

export const SavedConfigsModal: React.FC<SavedConfigsModalProps> = ({
  isOpen,
  onClose,
  savedConfigs,
  onSaveCurrent,
  onLoadConfig,
  onDeleteConfig,
  onImportConfig,
  currentComponents,
  currentSuction,
  currentMaterial,
}) => {
  const { language, t } = useLanguage();
  const [configName, setConfigName] = useState('');
  const [notes, setNotes] = useState('');
  const [saveSuccessNotice, setSaveSuccessNotice] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  if (!isOpen) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!configName.trim()) return;
    onSaveCurrent(configName.trim(), notes.trim());
    setConfigName('');
    setNotes('');
    setSaveSuccessNotice(true);
    setTimeout(() => setSaveSuccessNotice(false), 2500);
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const json = JSON.parse(event.target?.result as string);
        if (json.components && Array.isArray(json.components)) {
          const imported: SavedConfiguration = {
            id: `imported_${Date.now()}`,
            name: json.name || file.name.replace('.json', ''),
            savedAt: new Date().toISOString(),
            components: json.components,
            suctionConfig: json.suctionConfig || currentSuction,
            materialConfig: json.materialConfig || currentMaterial,
            notes: json.notes || (language === 'vi' ? 'Đã nhập từ tập tin máy tính' : 'Imported from JSON file'),
          };
          onImportConfig(imported);
          setSaveSuccessNotice(true);
          setTimeout(() => setSaveSuccessNotice(false), 2500);
        }
      } catch (err) {
        // ignore
      }
    };
    reader.readAsText(file);
  };

  const handleExportConfigToJson = (cfg: SavedConfiguration) => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(cfg, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `${cfg.name.replace(/\s+/g, '_')}_textile_machine.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const handleExportCurrentStateToJson = () => {
    const currentConfig: SavedConfiguration = {
      id: `config_${Date.now()}`,
      name: configName.trim() || 'textile_machine_config',
      savedAt: new Date().toISOString(),
      components: currentComponents,
      suctionConfig: currentSuction,
      materialConfig: currentMaterial,
      notes: notes.trim() || (language === 'vi' ? 'Xuất trực tiếp từ phần mềm mô phỏng' : 'Exported from TexTear 3D'),
    };
    handleExportConfigToJson(currentConfig);
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4 select-none">
      <div className="bg-slate-900 border border-slate-700 w-full max-w-2xl rounded-xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-900/60">
          <div className="flex items-center gap-2.5">
            <FolderOpen className="w-5 h-5 text-sky-400" />
            <div>
              <h2 className="text-base font-semibold text-slate-100">{t.savedModalTitle}</h2>
              <p className="text-xs text-slate-400">{t.savedModalSubtitle}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-slate-200 rounded cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6 text-xs text-slate-300">
          {/* 1. Mở qua tab mới */}
          <div className="p-4 bg-sky-950/40 rounded-xl border border-sky-800/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <ExternalLink className="w-4 h-4 text-sky-400" />
                <h3 className="font-semibold text-sm text-sky-200">
                  {language === 'vi' ? 'Mở Phần Mềm Sang Tab Mới' : 'Open in Dedicated Browser Tab'}
                </h3>
              </div>
              <p className="text-[11px] text-sky-300/80 mt-1">
                {t.openTabDesc}
              </p>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={handleCopyLink}
                className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-medium border border-slate-700 flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedLink ? t.copiedSuccess : t.copyLinkBtn}</span>
              </button>
              <a
                href={window.location.href}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3.5 py-1.5 bg-sky-600 hover:bg-sky-500 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 shadow-sm transition-colors"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span>{t.openNewTab}</span>
              </a>
            </div>
          </div>

          {/* 2. Form lưu cấu hình hiện tại */}
          <form onSubmit={handleSave} className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-slate-200 flex items-center gap-1.5">
                <Save className="w-4 h-4 text-emerald-400" /> {t.saveNewConfigTitle}
              </h3>
              <span className="text-[11px] font-mono text-slate-500">
                {currentComponents.length} {t.itemsCount}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-[11px] text-slate-400 mb-1 block">
                  {language === 'vi' ? 'Tên cấu hình thiết lập:' : 'Configuration Name:'}
                </label>
                <input
                  type="text"
                  required
                  placeholder={t.configNamePlaceholder}
                  value={configName}
                  onChange={(e) => setConfigName(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-100 outline-none focus:border-sky-500"
                />
              </div>

              <div>
                <label className="text-[11px] text-slate-400 mb-1 block">
                  {language === 'vi' ? 'Ghi chú kỹ thuật (tùy chọn):' : 'Technical Notes (Optional):'}
                </label>
                <input
                  type="text"
                  placeholder={t.notesPlaceholder}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-100 outline-none focus:border-sky-500"
                />
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 pt-1">
              <span className="text-[11px] text-slate-500">
                {language === 'vi' ? 'Tự động lưu vào trình duyệt của bạn (F5 không mất) hoặc tải file .json về máy.' : 'Persists locally in browser storage or export as downloadable JSON.'}
              </span>
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <button
                  type="button"
                  onClick={handleExportCurrentStateToJson}
                  className="flex-1 sm:flex-none px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold rounded-lg text-xs flex items-center justify-center gap-1.5 transition-colors border border-slate-700 cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5 text-sky-400" />
                  <span>{t.downloadJsonBtn}</span>
                </button>
                <button
                  type="submit"
                  className="flex-1 sm:flex-none px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold rounded-lg text-xs flex items-center justify-center gap-1.5 shadow-sm transition-colors cursor-pointer"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>{t.saveCurrentBtn}</span>
                </button>
              </div>
            </div>

            {saveSuccessNotice && (
              <div className="p-2.5 bg-emerald-950/80 border border-emerald-700 rounded-lg flex items-center gap-2 text-emerald-300 text-xs">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>{language === 'vi' ? 'Đã lưu cấu hình thành công!' : 'Configuration saved successfully!'}</span>
              </div>
            )}
          </form>

          {/* 3. Danh sách cấu hình đã lưu */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-slate-200 flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-sky-400" /> {t.savedListTitle} ({savedConfigs.length})
              </h3>

              <label className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-medium border border-slate-700 flex items-center gap-1.5 cursor-pointer transition-colors">
                <Upload className="w-3.5 h-3.5 text-sky-400" />
                <span>{t.importJsonBtn}</span>
                <input type="file" accept=".json" onChange={handleFileInput} className="hidden" />
              </label>
            </div>

            {savedConfigs.length === 0 ? (
              <div className="p-6 text-center bg-slate-950/60 rounded-xl border border-slate-800 text-slate-500">
                <p>{t.noSavedModels}</p>
              </div>
            ) : (
              <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                {savedConfigs.map((cfg) => {
                  const dateStr = new Date(cfg.savedAt).toLocaleString(language === 'vi' ? 'vi-VN' : 'en-US');
                  const cfgDisplayName = getLocalizedComponentName(cfg.name, language);

                  return (
                    <div
                      key={cfg.id}
                      className="p-3 bg-slate-950 rounded-xl border border-slate-800 hover:border-slate-700 transition-colors flex items-center justify-between gap-3"
                    >
                      <div className="space-y-0.5 overflow-hidden">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-slate-200 text-xs truncate">{cfgDisplayName}</span>
                          <span className="text-[10px] text-sky-400 font-mono bg-sky-950/60 px-1.5 py-0.5 rounded border border-sky-800/60 shrink-0">
                            {cfg.components.length} {t.itemsCount}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-[11px] text-slate-500">
                          <span>{dateStr}</span>
                          {cfg.notes && <span>· {cfg.notes}</span>}
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5 shrink-0">
                        <button
                          onClick={() => {
                            onLoadConfig(cfg);
                            onClose();
                          }}
                          className="px-3 py-1.5 bg-sky-600 hover:bg-sky-500 text-white rounded-lg text-xs font-medium transition-colors cursor-pointer"
                        >
                          {t.loadConfigBtn}
                        </button>
                        <button
                          onClick={() => handleExportConfigToJson(cfg)}
                          className="p-1.5 text-slate-400 hover:text-sky-300 hover:bg-slate-800 rounded border border-transparent hover:border-slate-700 transition-colors cursor-pointer"
                          title="JSON"
                        >
                          <Download className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => {
                            if (window.confirm(t.confirmDeleteConfig)) {
                              onDeleteConfig(cfg.id);
                            }
                          }}
                          className="p-1.5 text-slate-500 hover:text-rose-400 hover:bg-slate-900 rounded transition-colors cursor-pointer"
                          title={t.delete}
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Modal Footer */}
        <div className="flex items-center justify-between px-6 py-3.5 border-t border-slate-800 bg-slate-900">
          <span className="text-xs text-slate-500">
            {language === 'vi' ? 'Dữ liệu được tự động đồng bộ hóa trên trình duyệt của bạn' : 'Configurations are stored persistently in your local browser'}
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-medium transition-colors cursor-pointer"
          >
            {language === 'vi' ? 'Đóng' : 'Close'}
          </button>
        </div>
      </div>
    </div>
  );
};
