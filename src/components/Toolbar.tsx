import React, { useState, useRef, useEffect } from 'react';
import { RollerType, SavedConfiguration } from '../types/machine';
import { getLocalizedPresets, getLocalizedComponentName } from '../utils/presets';
import { useLanguage } from '../i18n/LanguageContext';
import {
  Play,
  Pause,
  Plus,
  Box,
  Compass,
  Columns,
  Target,
  ChevronDown,
  Layers,
  Sparkles,
  Zap,
  FolderOpen,
  ExternalLink,
  Maximize,
  Minimize,
  PanelRightClose,
  PanelRightOpen,
  Eye,
  EyeOff,
  PlusCircle,
  Undo2,
  Redo2,
  Lock,
  Unlock,
  Save,
  Check,
  Edit2,
  Trash2,
  Copy,
  X,
  Grid,
  Globe,
} from 'lucide-react';

interface ToolbarProps {
  isRunning: boolean;
  onTogglePlay: () => void;
  simSpeedMultiplier: number;
  onChangeSpeedMultiplier: (speed: number) => void;
  viewMode: '3d' | '2d_cad' | 'split';
  onChangeViewMode: (mode: '3d' | '2d_cad' | 'split') => void;
  onAddComponent: (type: RollerType) => void;
  onSelectPreset: (presetId: string) => void;
  onCreateNewModel?: () => void;
  onOpenGapCalibrator: () => void;
  onOpenSaveModal: () => void;
  onOpenNewTabModal: () => void;
  savedCount: number;
  gridSnapMm: number;
  onChangeGridSnap: (snap: number) => void;
  activePresetId?: string;
  isSidebarOpen: boolean;
  onToggleSidebar: () => void;
  isFullscreen: boolean;
  onToggleFullscreen: () => void;
  onOpenCardClothingModal?: () => void;
  showHUD?: boolean;
  onToggleHUD?: () => void;
  speedUnitMode?: 'hz' | 'rpm';
  onToggleSpeedUnitMode?: () => void;
  // Undo & Redo
  canUndo?: boolean;
  canRedo?: boolean;
  onUndo?: () => void;
  onRedo?: () => void;
  // Khóa di chuyển (Lock position)
  isLocked?: boolean;
  onToggleLock?: () => void;
  // Quản lý mẫu đơn giản & 1-Click Save
  activeModelId?: string;
  activeModelName?: string;
  isDirty?: boolean;
  onQuickSave?: () => void;
  savedConfigs?: SavedConfiguration[];
  onLoadConfig?: (config: SavedConfiguration) => void;
  onRenameConfig?: (id: string, newName: string) => void;
  onDuplicateConfig?: (id: string) => void;
  onDeleteConfig?: (id: string) => void;
  // Điều khiển khổ vải & vật liệu cấp
  fabricRouting?: any;
  onChangeFabricRouting?: (cfg: any) => void;
  materialConfig?: any;
  onChangeMaterialConfig?: (cfg: any) => void;
}

export const Toolbar: React.FC<ToolbarProps> = ({
  isRunning,
  onTogglePlay,
  simSpeedMultiplier,
  onChangeSpeedMultiplier,
  viewMode,
  onChangeViewMode,
  onAddComponent,
  onSelectPreset,
  onCreateNewModel,
  onOpenGapCalibrator,
  onOpenSaveModal,
  onOpenNewTabModal,
  savedCount,
  gridSnapMm,
  onChangeGridSnap,
  activePresetId,
  isSidebarOpen,
  onToggleSidebar,
  isFullscreen,
  onToggleFullscreen,
  onOpenCardClothingModal,
  showHUD = true,
  onToggleHUD,
  speedUnitMode = 'hz',
  onToggleSpeedUnitMode,
  canUndo = false,
  canRedo = false,
  onUndo,
  onRedo,
  isLocked = false,
  onToggleLock,
  activeModelId = 'preset_standard_1_drum',
  activeModelName = 'Dàn máy 1 trống tiêu chuẩn',
  isDirty = false,
  onQuickSave,
  savedConfigs = [],
  onLoadConfig,
  onRenameConfig,
  onDuplicateConfig,
  onDeleteConfig,
  fabricRouting,
  onChangeFabricRouting,
  materialConfig,
  onChangeMaterialConfig,
}) => {
  const { language, setLanguage, toggleLanguage, t } = useLanguage();
  const presets = getLocalizedPresets(language);

  const [showAddMenu, setShowAddMenu] = useState(false);
  const [showModelMenu, setShowModelMenu] = useState(false);
  const [showFabricMenu, setShowFabricMenu] = useState(false);

  // Trạng thái đổi tên inline trong modal menu
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState<string>('');

  const modelDropdownRef = useRef<HTMLDivElement>(null);
  const addDropdownRef = useRef<HTMLDivElement>(null);
  const fabricDropdownRef = useRef<HTMLDivElement>(null);

  // Đóng menu khi click ra ngoài vùng chứa
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      const target = e.target as Node;
      if (modelDropdownRef.current && !modelDropdownRef.current.contains(target)) {
        setShowModelMenu(false);
      }
      if (addDropdownRef.current && !addDropdownRef.current.contains(target)) {
        setShowAddMenu(false);
      }
      if (fabricDropdownRef.current && !fabricDropdownRef.current.contains(target)) {
        setShowFabricMenu(false);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  const handleStartRename = (e: React.MouseEvent, cfg: SavedConfiguration) => {
    e.stopPropagation();
    setEditingId(cfg.id);
    setEditingName(cfg.name);
  };

  const handleSaveRename = (e: React.MouseEvent | React.FormEvent, id: string) => {
    e.stopPropagation();
    e.preventDefault();
    if (editingName.trim() && onRenameConfig) {
      onRenameConfig(id, editingName.trim());
    }
    setEditingId(null);
  };

  const componentAddOptions: { type: RollerType; label: string; desc: string }[] = language === 'en'
    ? [
        { type: 'main_drum', label: 'Main Tearing Cylinder (Main Drum)', desc: 'Large Ø400-600mm cylinder with sawtooth wire clothing' },
        { type: 'feed_roller', label: 'Feed Roller (Fluted Nip)', desc: 'Pair of fluted grip rollers Ø140-180mm' },
        { type: 'worker_roller', label: 'Worker Carding Roller', desc: 'Satellite opening roller Ø150mm for fiber carding' },
        { type: 'stripper_roller', label: 'Stripper Roller', desc: 'Satellite stripping roller Ø130mm returning fiber to drum' },
        { type: 'cutter_knife', label: 'Fixed Bed Knife (Shear Blade)', desc: 'Alloy ledger bar for tearing rag shear separation' },
        { type: 'suction_hood', label: 'Exhaust Suction Hood', desc: 'Negative pressure hood for airborne lint & fiber collection' },
        { type: 'condenser_drum', label: 'Condenser Screen Drum', desc: 'Perforated cage drum delivering opened web output' },
      ]
    : [
        { type: 'main_drum', label: 'Trống Xé Chính (Main Cylinder)', desc: 'Tang trống lớn Ø400-600mm gắn gai xé' },
        { type: 'feed_roller', label: 'Trục Ép Cấp Liệu (Feed Roller)', desc: 'Cặp trục kẹp khía rãnh Ø140-180mm' },
        { type: 'worker_roller', label: 'Trục Chải (Worker Roller)', desc: 'Trục vệ tinh chải tơi xơ Ø150mm' },
        { type: 'stripper_roller', label: 'Trục Bóc (Stripper Roller)', desc: 'Trục bóc xơ từ worker về trống Ø130mm' },
        { type: 'cutter_knife', label: 'Dao Cắt Tĩnh (Fixed Knife)', desc: 'Thanh dao chém phân tách giẻ vụn' },
        { type: 'suction_hood', label: 'Miệng Hút Gom Bông (Suction)', desc: 'Họng hút chân không thu gom xơ bay' },
        { type: 'condenser_drum', label: 'Trống Ngưng Kết (Condenser)', desc: 'Lồng lưới thu gom bông ra ngoài' },
      ];

  const localizedModelName = getLocalizedComponentName(activeModelName, language);

  return (
    <div className="relative z-40 flex flex-wrap items-center justify-between gap-2.5 px-3 sm:px-6 py-2 bg-slate-900 border-b border-slate-800 text-xs text-slate-200 backdrop-blur-md shadow-md">
      {/* VÙNG TRÁI: Vận hành, Tốc độ, Undo/Redo & Khóa vị trí */}
      <div className="flex items-center gap-2 flex-wrap">
        {/* Nút Play/Pause */}
        <button
          type="button"
          onClick={onTogglePlay}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-semibold text-xs transition-colors shadow-sm cursor-pointer ${
            isRunning
              ? 'bg-amber-600 hover:bg-amber-500 text-white'
              : 'bg-emerald-600 hover:bg-emerald-500 text-white'
          }`}
          title={isRunning ? (language === 'vi' ? 'Tạm dừng mô phỏng động học' : 'Pause kinematic simulation') : (language === 'vi' ? 'Bắt đầu mô phỏng quay trục & dòng chảy vải' : 'Start rotation simulation & fabric flow')}
        >
          {isRunning ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
          <span>{isRunning ? t.pause : t.play}</span>
        </button>

        {/* Tốc độ giả lập (hỗ trợ chuyển động siêu chậm 0.1x, 0.2x để quan sát kỹ xơ bông) */}
        <div className="flex items-center bg-slate-950 rounded-lg p-0.5 border border-slate-800 text-[11px] font-mono">
          {[0.1, 0.2, 0.5, 1, 2].map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => onChangeSpeedMultiplier(s)}
              className={`px-2 py-1 rounded transition-colors cursor-pointer ${
                simSpeedMultiplier === s ? 'bg-slate-800 text-sky-400 font-bold' : 'text-slate-400 hover:text-slate-200'
              }`}
              title={language === 'vi' ? `Chạy mô phỏng ở tốc độ ${s}x` : `Run simulation at ${s}x speed`}
            >
              {s}x
            </button>
          ))}
        </div>

        {/* Toggle đơn vị tốc độ Hz / RPM */}
        {onToggleSpeedUnitMode && (
          <button
            type="button"
            onClick={onToggleSpeedUnitMode}
            className="hidden sm:flex items-center gap-1 px-2.5 py-1 bg-slate-950 hover:bg-slate-800 text-slate-300 rounded-lg border border-slate-800 text-[11px] font-mono transition-colors cursor-pointer"
            title={language === 'vi' ? 'Chuyển đổi hiển thị tốc độ theo tần số biến tần (Hz) hoặc vòng/phút (RPM)' : 'Toggle speed units between Inverter Frequency (Hz) or Rotational Speed (RPM)'}
          >
            <Zap className="w-3 h-3 text-amber-400" />
            <span><strong className="text-emerald-400 uppercase">{speedUnitMode}</strong></span>
          </button>
        )}

        <div className="w-px h-5 bg-slate-800 mx-0.5 hidden sm:block" />

        {/* NÚT UNDO / REDO (Hoàn tác / Làm lại) */}
        <div className="flex items-center bg-slate-950 p-0.5 rounded-lg border border-slate-800 shadow-inner">
          <button
            type="button"
            onClick={onUndo}
            disabled={!canUndo}
            className={`p-1.5 rounded transition-colors flex items-center gap-1 ${
              canUndo
                ? 'text-slate-200 hover:bg-slate-800 hover:text-white cursor-pointer'
                : 'text-slate-600 cursor-not-allowed opacity-50'
            }`}
            title={language === 'vi' ? 'Hoàn tác thao tác trước (Ctrl+Z)' : 'Undo previous action (Ctrl+Z)'}
          >
            <Undo2 className="w-3.5 h-3.5" />
            <span className="hidden xl:inline text-[11px]">{t.undo}</span>
          </button>
          <div className="w-px h-3.5 bg-slate-800" />
          <button
            type="button"
            onClick={onRedo}
            disabled={!canRedo}
            className={`p-1.5 rounded transition-colors flex items-center gap-1 ${
              canRedo
                ? 'text-slate-200 hover:bg-slate-800 hover:text-white cursor-pointer'
                : 'text-slate-600 cursor-not-allowed opacity-50'
            }`}
            title={language === 'vi' ? 'Làm lại thao tác vừa hoàn tác (Ctrl+Y)' : 'Redo action (Ctrl+Y)'}
          >
            <Redo2 className="w-3.5 h-3.5" />
            <span className="hidden xl:inline text-[11px]">{t.redo}</span>
          </button>
        </div>

        {/* NÚT KHÓA VỊ TRÍ (LOCK / UNLOCK) */}
        {onToggleLock && (
          <button
            type="button"
            onClick={onToggleLock}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold border transition-all cursor-pointer ${
              isLocked
                ? 'bg-amber-950/90 border-amber-500 text-amber-300 shadow-sm shadow-amber-950 ring-1 ring-amber-500/50'
                : 'bg-slate-950 hover:bg-slate-800 text-slate-300 border-slate-800 hover:border-slate-700'
            }`}
            title={isLocked ? t.lockedTip : t.unlockedTip}
          >
            {isLocked ? (
              <>
                <Lock className="w-3.5 h-3.5 text-amber-400" />
                <span>{t.locked}</span>
              </>
            ) : (
              <>
                <Unlock className="w-3.5 h-3.5 text-slate-400" />
                <span className="hidden md:inline">{t.lockPosition}</span>
              </>
            )}
          </button>
        )}
      </div>

      {/* VÙNG GIỮA: Chế độ khung nhìn, Snap lưới CAD & HUD */}
      <div className="flex items-center gap-1.5">
        <div className="flex items-center bg-slate-950 p-1 rounded-lg border border-slate-800">
          <button
            type="button"
            onClick={() => onChangeViewMode('3d')}
            className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-md text-xs font-medium transition-colors cursor-pointer ${
              viewMode === '3d' ? 'bg-sky-600 text-white font-semibold shadow-sm' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Box className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">{t.view3D}</span>
          </button>
          <button
            type="button"
            onClick={() => onChangeViewMode('2d_cad')}
            className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-md text-xs font-medium transition-colors cursor-pointer ${
              viewMode === '2d_cad' ? 'bg-sky-600 text-white font-semibold shadow-sm' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Compass className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">{t.view2D}</span>
          </button>
          <button
            type="button"
            onClick={() => onChangeViewMode('split')}
            className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-md text-xs font-medium transition-colors cursor-pointer ${
              viewMode === 'split' ? 'bg-sky-600 text-white font-semibold shadow-sm' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Columns className="w-3.5 h-3.5" />
            <span className="hidden md:inline">{t.viewSplit}</span>
          </button>
        </div>

        {/* BỘ ĐIỀU KHIỂN KHỔ VẢI & NGUYÊN LIỆU (FABRIC WIDTH & MATERIAL CONTROLLER) */}
        <div ref={fabricDropdownRef} className="relative">
          <button
            type="button"
            onClick={() => {
              setShowFabricMenu((prev) => !prev);
              setShowAddMenu(false);
              setShowModelMenu(false);
            }}
            className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg border text-xs font-semibold transition-all cursor-pointer ${
              showFabricMenu
                ? 'bg-indigo-600 text-white border-indigo-400 shadow-md ring-2 ring-indigo-400/40'
                : 'bg-indigo-950/80 hover:bg-indigo-900 text-indigo-300 border-indigo-700/80'
            }`}
            title={language === 'vi' ? 'Bộ điều khiển khổ vải (mm), độ dày và thông số dải vải cấp vào' : 'Fabric width (mm), thickness, and intake material parameters'}
          >
            <Layers className="w-3.5 h-3.5 text-indigo-400" />
            <span>{t.fabricWidthLabel} <strong className="font-mono text-white">{fabricRouting?.clothWidthMm || 850} mm</strong></span>
            <ChevronDown className="w-3 h-3 text-indigo-300" />
          </button>

          {showFabricMenu && (
            <div className="absolute left-0 sm:left-auto right-0 top-full mt-2 w-80 sm:w-88 bg-slate-900 border border-slate-700 rounded-xl shadow-2xl z-[120] p-3.5 space-y-3.5 text-xs text-slate-200">
              {/* Header */}
              <div className="flex items-center justify-between pb-2 border-b border-slate-800 font-semibold text-indigo-300">
                <span className="flex items-center gap-1.5">
                  <Layers className="w-4 h-4 text-indigo-400" />
                  <span>{t.fabricControllerTitle}</span>
                </span>
                <button
                  type="button"
                  onClick={() => setShowFabricMenu(false)}
                  className="p-1 text-slate-400 hover:text-slate-200 rounded cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Khổ rộng dải vải mm */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">{t.feedWidth}</span>
                  <span className="font-mono font-bold text-indigo-300 bg-slate-950 px-2 py-0.5 rounded border border-slate-800">
                    {fabricRouting?.clothWidthMm || 850} mm
                  </span>
                </div>
                <input
                  type="range"
                  min="400"
                  max="2000"
                  step="50"
                  value={fabricRouting?.clothWidthMm || 850}
                  onChange={(e) => {
                    const val = Number(e.target.value);
                    if (onChangeFabricRouting && fabricRouting) {
                      onChangeFabricRouting({ ...fabricRouting, clothWidthMm: val });
                    }
                    if (onChangeMaterialConfig && materialConfig) {
                      onChangeMaterialConfig({ ...materialConfig, feedWidthMm: val });
                    }
                  }}
                  className="w-full accent-indigo-500 cursor-pointer h-1.5 bg-slate-950 rounded-lg"
                />
                <div className="flex justify-between gap-1 pt-0.5">
                  {[600, 850, 1200, 1600, 2000].map((w) => (
                    <button
                      key={w}
                      type="button"
                      onClick={() => {
                        if (onChangeFabricRouting && fabricRouting) {
                          onChangeFabricRouting({ ...fabricRouting, clothWidthMm: w });
                        }
                        if (onChangeMaterialConfig && materialConfig) {
                          onChangeMaterialConfig({ ...materialConfig, feedWidthMm: w });
                        }
                      }}
                      className={`flex-1 py-1 rounded text-[10px] font-mono border transition-all cursor-pointer ${
                        (fabricRouting?.clothWidthMm || 850) === w
                          ? 'bg-indigo-600/30 border-indigo-400 text-indigo-200 font-bold'
                          : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      {w}mm
                    </button>
                  ))}
                </div>
                <p className="text-[10px] text-slate-400 italic">
                  {t.fabricWidthNotice}
                </p>
              </div>

              {/* Độ dày vải & Số lớp */}
              <div className="grid grid-cols-2 gap-2 pt-1 border-t border-slate-800/80">
                <div className="space-y-1">
                  <span className="text-[11px] text-slate-400 block">{t.fabricLayers}</span>
                  <select
                    value={materialConfig?.fabricLayers || 2}
                    onChange={(e) => {
                      if (onChangeMaterialConfig && materialConfig) {
                        onChangeMaterialConfig({ ...materialConfig, fabricLayers: Number(e.target.value) });
                      }
                    }}
                    className="w-full bg-slate-950 border border-slate-700 rounded px-2 py-1 text-slate-200 font-mono text-xs outline-none focus:border-indigo-500"
                  >
                    {[1, 2, 3, 4, 6, 8].map((l) => (
                      <option key={l} value={l} className="bg-slate-900">{l} {t.layersUnit} ({(l * 0.9).toFixed(1)}mm)</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-1">
                  <span className="text-[11px] text-slate-400 block">{t.feedSpeed}</span>
                  <div className="flex items-center gap-1 bg-slate-950 border border-slate-700 rounded px-2 py-1 text-slate-200 font-mono text-xs">
                    <span>{materialConfig?.feedSpeedMPerMin || 12}</span>
                    <span className="text-[10px] text-slate-500">{t.speedUnitMPerMin}</span>
                  </div>
                </div>
              </div>

              {/* Màu sắc dải vải */}
              {fabricRouting && onChangeFabricRouting && (
                <div className="space-y-1.5 pt-1 border-t border-slate-800/80">
                  <span className="text-[11px] text-slate-400 block">{t.fabricColor3D}</span>
                  <div className="flex items-center gap-1.5">
                    {[
                      { hex: '#2563eb', label: t.colorDenim },
                      { hex: '#f8fafc', label: t.colorCotton },
                      { hex: '#64748b', label: t.colorBleached },
                      { hex: '#dc2626', label: t.colorRed },
                      { hex: '#16a34a', label: t.colorGreen },
                    ].map((col) => (
                      <button
                        key={col.hex}
                        type="button"
                        onClick={() => onChangeFabricRouting({ ...fabricRouting, clothColor: col.hex })}
                        className={`flex-1 py-1 rounded border text-[10px] flex items-center justify-center gap-1 transition-all ${
                          fabricRouting.clothColor === col.hex
                            ? 'border-indigo-400 bg-indigo-950 text-white font-bold'
                            : 'border-slate-800 bg-slate-950 text-slate-400 hover:text-slate-200'
                        }`}
                        title={col.label}
                      >
                        <span className="w-2.5 h-2.5 rounded-full border border-slate-700 shrink-0" style={{ backgroundColor: col.hex }} />
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Tùy chọn Ẩn / Hiện Cây cuộn vải cấp liệu phía trước */}
              {fabricRouting && onChangeFabricRouting && (
                <div className="pt-2 border-t border-slate-800/80">
                  <div className="flex items-center justify-between text-[11px] text-slate-300 bg-slate-950/70 p-2 rounded-lg border border-slate-800">
                    <span className="flex items-center gap-1.5 font-medium">
                      <Layers className="w-4 h-4 text-indigo-400" />
                      <span>{t.supplyRollStand}</span>
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        onChangeFabricRouting({
                          ...fabricRouting,
                          showSupplyRoll: fabricRouting.showSupplyRoll === false ? true : false,
                        });
                      }}
                      className={`px-2.5 py-1 rounded text-[10px] font-bold border transition-all cursor-pointer ${
                        fabricRouting.showSupplyRoll !== false
                          ? 'bg-indigo-600 border-indigo-400 text-white shadow-sm'
                          : 'bg-slate-900 border-slate-700 text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      {fabricRouting.showSupplyRoll !== false ? t.showText : t.hideText}
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* BƯỚC LƯỚI SNAP CAD (Grid snap dropdown) */}
        <div className="hidden lg:flex items-center bg-slate-950 border border-slate-800 rounded-lg px-2 py-1 text-slate-300 gap-1.5">
          <Grid className="w-3.5 h-3.5 text-sky-400 shrink-0" />
          <span className="text-[11px] text-slate-400 shrink-0">{t.grid}</span>
          <select
            value={gridSnapMm}
            onChange={(e) => onChangeGridSnap(Number(e.target.value))}
            className="bg-transparent text-xs font-mono text-sky-300 font-bold outline-none cursor-pointer"
            title={language === 'vi' ? 'Độ bắt dính bước lưới khi rê kéo chi tiết trên CAD (Snap to grid)' : 'Snap to grid spacing when moving components'}
          >
            <option value={10} className="bg-slate-900 text-slate-100">{t.gridStandard}</option>
            <option value={5} className="bg-slate-900 text-slate-100">5 mm</option>
            <option value={1} className="bg-slate-900 text-slate-100">{t.gridFine}</option>
            <option value={0} className="bg-slate-900 text-slate-100">{t.gridOff}</option>
          </select>
        </div>

        {/* Nút Ẩn / Hiện Bảng Thông Số HUD */}
        {onToggleHUD && (
          <button
            type="button"
            onClick={onToggleHUD}
            className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium border transition-colors cursor-pointer ${
              showHUD
                ? 'bg-slate-950 hover:bg-slate-800 text-slate-300 border-slate-800'
                : 'bg-amber-950/80 text-amber-300 border-amber-600/80 font-bold shadow-md'
            }`}
            title={language === 'vi' ? 'Ẩn / Hiện các bảng thông số nổi (Phím tắt: H)' : 'Show / Hide floating HUD readouts (Key: H)'}
          >
            {showHUD ? <EyeOff className="w-3.5 h-3.5 text-slate-400" /> : <Eye className="w-3.5 h-3.5 text-amber-400" />}
            <span className="hidden xl:inline">{showHUD ? t.hud : t.hudShow}</span>
          </button>
        )}

        {/* Nút Soi Bề Mặt Kim */}
        {onOpenCardClothingModal && (
          <button
            type="button"
            onClick={onOpenCardClothingModal}
            className="hidden xl:flex items-center gap-1.5 px-2.5 py-1.5 bg-sky-950/70 hover:bg-sky-900 text-sky-300 rounded-lg text-xs font-semibold border border-sky-800/80 transition-colors cursor-pointer"
            title={language === 'vi' ? 'Xem chi tiết vi mô bề mặt kim, dải quấn xoắn và góc nghiêng răng cưa' : 'Inspect microscopic sawtooth wire, spiral windings and tooth rake angles'}
          >
            <Sparkles className="w-3.5 h-3.5 text-sky-400" />
            <span>{t.cardClothing}</span>
          </button>
        )}
      </div>

      {/* VÙNG PHẢI: QUẢN LÝ MẪU DÀN MÁY ĐƠN GIẢN, LƯU 1-CLICK & THÊM TRỤC */}
      <div className="flex items-center gap-2 flex-wrap">
        {/* 1. NÚT TẠO MẪU MỚI (1-CLICK NEW MACHINE) */}
        {onCreateNewModel && (
          <button
            type="button"
            onClick={onCreateNewModel}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-sky-600 hover:bg-sky-500 text-white rounded-lg text-xs font-semibold shadow-sm transition-colors cursor-pointer"
            title={t.newModelDesc}
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>{t.newModelBtn}</span>
          </button>
        )}

        {/* 2. NÚT LƯU MẪU NHANH (1-CLICK QUICK SAVE) */}
        {onQuickSave && (
          <button
            type="button"
            onClick={onQuickSave}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all shadow-sm cursor-pointer ${
              isDirty
                ? 'bg-emerald-600 hover:bg-emerald-500 text-white ring-2 ring-emerald-300/80 shadow-emerald-950'
                : 'bg-emerald-950/80 hover:bg-emerald-900 text-emerald-300 border border-emerald-800/80'
            }`}
            title={language === 'vi' ? 'Lưu ngay dàn máy hiện tại (Ctrl+S)' : 'Save current machine layout (Ctrl+S)'}
          >
            <Save className="w-3.5 h-3.5" />
            <span>{isDirty ? t.saveModel : t.saved}</span>
          </button>
        )}

        {/* 3. BỘ CHỌN & QUẢN LÝ DÀN MÁY (DROPDOWN LIST CHO CHỌN MẪU) */}
        <div ref={modelDropdownRef} className="relative flex items-center">
          <div className="flex items-center bg-slate-800 hover:bg-slate-750 border border-slate-700 focus-within:border-sky-500 rounded-lg px-2.5 py-1.5 transition-colors gap-1.5 shadow-sm">
            <Layers className="w-3.5 h-3.5 text-sky-400 shrink-0" />
            <select
              value={activeModelId}
              onChange={(e) => {
                const val = e.target.value;
                if (val === '__create_new__') {
                  onCreateNewModel?.();
                } else if (val === '__open_modal__') {
                  onOpenSaveModal();
                } else {
                  const preset = presets.find((p) => p.id === val);
                  if (preset) {
                    onSelectPreset(preset.id);
                  } else {
                    const saved = savedConfigs.find((s) => s.id === val);
                    if (saved && onLoadConfig) {
                      onLoadConfig(saved);
                    }
                  }
                }
              }}
              className="bg-transparent text-slate-100 font-semibold text-xs outline-none cursor-pointer max-w-[170px] sm:max-w-[210px] truncate"
              title={language === 'vi' ? 'Chọn mẫu dàn máy để xem hoặc tiếp tục chỉnh sửa' : 'Select machine configuration to load or edit'}
            >
              <optgroup label={`⭐ ${t.yourSavedModels}`}>
                {savedConfigs.map((cfg) => (
                  <option key={cfg.id} value={cfg.id} className="bg-slate-900 text-slate-100 py-1">
                    {getLocalizedComponentName(cfg.name, language)} ({cfg.components.length} {t.itemsCount})
                  </option>
                ))}
                {savedConfigs.length === 0 && (
                  <option value="__empty__" disabled className="bg-slate-900 text-slate-500">
                    ({t.noSavedModels})
                  </option>
                )}
              </optgroup>
              <optgroup label={`🏭 ${t.factoryPresets}`}>
                {presets.map((p) => (
                  <option key={p.id} value={p.id} className="bg-slate-900 text-slate-100 py-1">
                    {p.name} [{p.badge}]
                  </option>
                ))}
              </optgroup>
              <optgroup label={`⚙️ ${t.quickActions}`}>
                <option value="__create_new__" className="bg-slate-900 text-sky-400 font-bold">
                  {t.createNewModelOption}
                </option>
                <option value="__open_modal__" className="bg-slate-900 text-slate-300">
                  {t.fullManagementOption}
                </option>
              </optgroup>
            </select>

            {/* Nút mở menu chi tiết (đổi tên, nhân bản, xóa từng mẫu) */}
            <button
              type="button"
              onClick={() => {
                setShowModelMenu(!showModelMenu);
                setShowAddMenu(false);
              }}
              className="p-1 hover:bg-slate-700 text-slate-400 hover:text-slate-100 rounded transition-colors cursor-pointer"
              title={language === 'vi' ? 'Mở bảng danh sách chi tiết (Đổi tên, nhân bản, xóa mẫu)' : 'Open detailed model list (Rename, duplicate, delete)'}
            >
              <ChevronDown className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* POPUP CHI TIẾT QUẢN LÝ MẪU (z-[100] nổi trên mọi lớp canvas) */}
          {showModelMenu && (
            <div className="absolute right-0 top-full mt-2 w-80 sm:w-96 bg-slate-900 border border-slate-700 rounded-xl shadow-2xl z-[100] p-3 space-y-3 max-h-[75vh] overflow-y-auto">
              {/* Header popup */}
              <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                <div className="flex items-center gap-1.5 font-semibold text-xs text-sky-400">
                  <Layers className="w-4 h-4 text-sky-400" />
                  <span>{t.modelSelectorTitle}</span>
                </div>
                <button
                  type="button"
                  onClick={() => setShowModelMenu(false)}
                  className="p-1 text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Nút tạo mẫu mới nhanh */}
              {onCreateNewModel && (
                <button
                  type="button"
                  onClick={() => {
                    onCreateNewModel();
                    setShowModelMenu(false);
                  }}
                  className="w-full text-left p-2.5 rounded-lg border border-dashed border-sky-500/70 hover:border-sky-400 bg-sky-950/40 hover:bg-sky-900/50 transition-colors flex items-center gap-2 text-sky-300 font-semibold cursor-pointer"
                >
                  <PlusCircle className="w-4 h-4 text-sky-400 shrink-0" />
                  <div>
                    <div className="text-xs">{t.newModelTitle}</div>
                    <div className="text-[10px] text-slate-400 font-normal">{t.newModelDesc}</div>
                  </div>
                </button>
              )}

              {/* DANH SÁCH MẪU TỰ BUILD CỦA BẠN (CUSTOM SAVED MODELS) */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between px-1">
                  <span className="text-[10px] font-mono text-emerald-400 font-bold uppercase">
                    {t.yourSavedModels} ({savedConfigs.length})
                  </span>
                  <span className="text-[10px] text-slate-500">
                    {language === 'vi' ? '1-click để tải' : '1-click to load'}
                  </span>
                </div>

                {savedConfigs.length === 0 ? (
                  <div className="px-3 py-2 text-[11px] text-slate-500 italic bg-slate-950/60 rounded-lg border border-slate-800">
                    {t.noSavedModels}
                  </div>
                ) : (
                  savedConfigs.map((cfg) => {
                    const isSelected = activeModelId === cfg.id;
                    const isRenaming = editingId === cfg.id;

                    if (isRenaming) {
                      return (
                        <form
                          key={cfg.id}
                          onSubmit={(e) => handleSaveRename(e, cfg.id)}
                          className="flex items-center gap-1.5 p-1.5 bg-slate-950 rounded-lg border border-sky-500"
                        >
                          <input
                            type="text"
                            value={editingName}
                            onChange={(e) => setEditingName(e.target.value)}
                            autoFocus
                            className="w-full bg-transparent text-xs text-slate-100 outline-none px-1 font-semibold"
                          />
                          <button
                            type="button"
                            onClick={(e) => handleSaveRename(e, cfg.id)}
                            className="p-1 bg-emerald-600 hover:bg-emerald-500 text-white rounded cursor-pointer"
                            title={t.apply}
                          >
                            <Check className="w-3 h-3" />
                          </button>
                          <button
                            type="button"
                            onClick={() => setEditingId(null)}
                            className="p-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded cursor-pointer"
                            title={t.cancel}
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </form>
                      );
                    }

                    return (
                      <div
                        key={cfg.id}
                        onClick={() => {
                          if (onLoadConfig) onLoadConfig(cfg);
                          setShowModelMenu(false);
                        }}
                        className={`group w-full text-left p-2 rounded-lg transition-colors flex items-center justify-between gap-2 cursor-pointer ${
                          isSelected
                            ? 'bg-emerald-950/80 border border-emerald-500/80 text-emerald-200'
                            : 'bg-slate-950/50 hover:bg-slate-800 border border-slate-800/80 text-slate-300'
                        }`}
                      >
                        <div className="min-w-0 flex-1">
                          <div className="font-semibold text-xs truncate flex items-center gap-1.5">
                            <span>{getLocalizedComponentName(cfg.name, language)}</span>
                            {isSelected && (
                              <span className="text-[9px] bg-emerald-900/90 text-emerald-200 px-1 py-0.2 rounded font-mono">
                                {t.activeBadge}
                              </span>
                            )}
                          </div>
                          <div className="text-[10px] text-slate-500 font-mono">
                            {cfg.components.length} {t.itemsCount} • {new Date(cfg.savedAt).toLocaleDateString(language === 'vi' ? 'vi-VN' : 'en-US')}
                          </div>
                        </div>

                        {/* Các nút thao tác nhanh: Đổi tên, Nhân bản, Xóa */}
                        <div className="flex items-center gap-1 shrink-0 opacity-80 group-hover:opacity-100">
                          {onRenameConfig && (
                            <button
                              type="button"
                              onClick={(e) => handleStartRename(e, cfg)}
                              className="p-1 text-slate-400 hover:text-sky-300 hover:bg-slate-700/60 rounded transition-colors cursor-pointer"
                              title={language === 'vi' ? 'Đổi tên mẫu' : 'Rename model'}
                            >
                              <Edit2 className="w-3 h-3" />
                            </button>
                          )}
                          {onDuplicateConfig && (
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                onDuplicateConfig(cfg.id);
                              }}
                              className="p-1 text-slate-400 hover:text-sky-300 hover:bg-slate-700/60 rounded transition-colors cursor-pointer"
                              title={language === 'vi' ? 'Nhân bản mẫu này' : 'Duplicate this model'}
                            >
                              <Copy className="w-3 h-3" />
                            </button>
                          )}
                          {onDeleteConfig && (
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                if (window.confirm(language === 'vi' ? `Bạn có chắc muốn xóa mẫu "${cfg.name}"?` : `Are you sure you want to delete "${cfg.name}"?`)) {
                                  onDeleteConfig(cfg.id);
                                }
                              }}
                              className="p-1 text-slate-400 hover:text-rose-400 hover:bg-rose-950/60 rounded transition-colors cursor-pointer"
                              title={language === 'vi' ? 'Xóa mẫu này' : 'Delete this model'}
                            >
                              <Trash2 className="w-3 h-3" />
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })
                )}
              </div>

              {/* MẪU CÔNG NGHIỆP CÓ SẴN (FACTORY PRESETS) */}
              <div className="space-y-1.5 pt-2 border-t border-slate-800">
                <span className="text-[10px] font-mono text-sky-400 font-bold uppercase px-1 block">
                  {t.factoryPresets} ({presets.length})
                </span>
                {presets.map((p) => {
                  const isSelected = activeModelId === p.id;
                  return (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => {
                        onSelectPreset(p.id);
                        setShowModelMenu(false);
                      }}
                      className={`w-full text-left p-2 rounded-lg transition-colors flex flex-col gap-0.5 cursor-pointer ${
                        isSelected
                          ? 'bg-sky-950/80 border border-sky-500/80 text-sky-200'
                          : 'bg-slate-950/50 hover:bg-slate-800 border border-slate-800/80 text-slate-300'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-xs">{p.name}</span>
                        <span className="text-[10px] bg-slate-800 text-sky-400 px-1.5 py-0.5 rounded font-mono">
                          {p.badge}
                        </span>
                      </div>
                      <span className="text-[10px] text-slate-400 line-clamp-1">{p.description}</span>
                    </button>
                  );
                })}
              </div>

              {/* Nút mở rộng modal quản lý đầy đủ nếu cần */}
              <div className="pt-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => {
                    onOpenSaveModal();
                    setShowModelMenu(false);
                  }}
                  className="w-full py-2 text-center text-xs text-sky-400 hover:text-sky-300 hover:bg-slate-800 rounded-lg transition-colors font-medium border border-slate-800 cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <FolderOpen className="w-3.5 h-3.5" />
                  <span>{t.fullManagementOption}</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* 4. NÚT THÊM TRỤC / CHI TIẾT MỚI (DROPDOWN POPUP z-[100]) */}
        <div ref={addDropdownRef} className="relative">
          <button
            type="button"
            onClick={() => {
              setShowAddMenu(!showAddMenu);
              setShowModelMenu(false);
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-semibold border border-slate-700 shadow-sm transition-colors cursor-pointer"
            title={language === 'vi' ? 'Lắp thêm chi tiết mới vào dàn máy' : 'Add new component to machine layout'}
          >
            <Plus className="w-3.5 h-3.5 text-sky-400" />
            <span>{t.addRollerBtn}</span>
            <ChevronDown className="w-3 h-3 text-slate-400" />
          </button>

          {showAddMenu && (
            <div className="absolute right-0 top-full mt-2 w-72 bg-slate-900 border border-slate-700 rounded-xl shadow-2xl z-[100] p-2 space-y-1">
              <span className="text-[10px] font-mono uppercase text-slate-400 px-2 py-1 block font-semibold border-b border-slate-800 mb-1">
                {t.addRollerMenuTitle}
              </span>
              {componentAddOptions.map((opt) => (
                <button
                  key={opt.type}
                  type="button"
                  onClick={() => {
                    onAddComponent(opt.type);
                    setShowAddMenu(false);
                  }}
                  className="w-full text-left p-2 rounded-lg hover:bg-slate-800 transition-colors flex flex-col cursor-pointer"
                >
                  <span className="font-semibold text-slate-100 text-xs">{opt.label}</span>
                  <span className="text-[10px] text-slate-400">{opt.desc}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* 5. CĂN CHỈNH KHE HỞ MM */}
        <button
          type="button"
          onClick={onOpenGapCalibrator}
          className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-sky-300 rounded-lg text-xs font-medium border border-slate-700 transition-colors cursor-pointer"
          title={language === 'vi' ? 'Căn chỉnh chính xác khe hở milimet giữa các trục' : 'Precisely calibrate millimeter clearances between rollers'}
        >
          <Target className="w-3.5 h-3.5 text-sky-400" />
          <span>{t.gapsMm}</span>
        </button>

        {/* 6. MỞ TAB MỚI */}
        <button
          type="button"
          onClick={onOpenNewTabModal}
          className="hidden md:flex items-center gap-1 px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-sky-300 rounded-lg text-xs font-medium border border-slate-700 transition-colors cursor-pointer"
          title={language === 'vi' ? 'Mở toàn màn hình trong tab mới độc lập' : 'Open full screen in a dedicated browser tab'}
        >
          <ExternalLink className="w-3.5 h-3.5 text-sky-400" />
          <span>{t.newTab}</span>
        </button>

        {/* 7. FULLSCREEN */}
        <button
          type="button"
          onClick={onToggleFullscreen}
          className={`p-1.5 rounded-lg border transition-colors cursor-pointer ${
            isFullscreen
              ? 'bg-sky-600 border-sky-500 text-white font-semibold'
              : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700'
          }`}
          title={isFullscreen ? t.minimize : t.fullscreen}
        >
          {isFullscreen ? <Minimize className="w-3.5 h-3.5" /> : <Maximize className="w-3.5 h-3.5 text-sky-400" />}
        </button>

        {/* 8. SIDEBAR TOGGLE */}
        <button
          type="button"
          onClick={onToggleSidebar}
          className={`p-1.5 rounded-lg border transition-colors cursor-pointer ${
            isSidebarOpen
              ? 'bg-slate-800 hover:bg-slate-700 text-slate-300 border-slate-700'
              : 'bg-sky-950/70 border-sky-600 text-sky-300'
          }`}
          title={t.toggleSidebar}
        >
          {isSidebarOpen ? <PanelRightClose className="w-3.5 h-3.5" /> : <PanelRightOpen className="w-3.5 h-3.5" />}
        </button>
      </div>
    </div>
  );
};
