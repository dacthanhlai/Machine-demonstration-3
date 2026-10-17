import React from 'react';
import { FabricRoutingConfig, MaterialFeedConfig, MachineComponent, FabricPathStep } from '../types/machine';
import { calculateMaterialFeedRate } from '../utils/physicsEngine';
import { useLanguage } from '../i18n/LanguageContext';
import { getLocalizedComponentName } from '../utils/presets';
import {
  Route,
  ArrowRightLeft,
  MoveUp,
  MoveDown,
  Check,
  Sparkles,
  Layers,
  Palette,
  Eye,
  RotateCcw,
  Scale,
  Gauge,
  Zap,
} from 'lucide-react';

interface FabricRoutingPanelProps {
  fabricRouting: FabricRoutingConfig;
  onChangeFabricRouting: (updated: FabricRoutingConfig) => void;
  materialConfig: MaterialFeedConfig;
  onChangeMaterialConfig: (updated: MaterialFeedConfig) => void;
  components: MachineComponent[];
  isRunning: boolean;
}

export const FabricRoutingPanel: React.FC<FabricRoutingPanelProps> = ({
  fabricRouting,
  onChangeFabricRouting,
  materialConfig,
  onChangeMaterialConfig,
  components,
  isRunning,
}) => {
  const { language, t } = useLanguage();

  // Lấy danh sách các trục và dao tham gia hành trình dải vải dệt (loại trừ miệng hút và trống ngưng kết)
  const routableComponents = components.filter((c) => c.type !== 'suction_hood' && c.type !== 'condenser_drum');

  const layers = materialConfig.fabricLayers || 2;
  const widthMm = fabricRouting.clothWidthMm || materialConfig.feedWidthMm || 850;
  const gsm = materialConfig.basisWeightGsm || 350;
  const speed = materialConfig.feedSpeedMPerMin || 12;

  const { kgPerHour, kgPerShift, linearMeterPerHour } = calculateMaterialFeedRate(
    speed,
    widthMm,
    gsm,
    layers
  );

  const existingStepMap = new Map((fabricRouting.steps || []).map((s) => [s.rollerId, s]));
  const steps: FabricPathStep[] = [];

  (fabricRouting.steps || []).forEach((step) => {
    if (routableComponents.some((c) => c.id === step.rollerId)) {
      steps.push(step);
    }
  });

  routableComponents.forEach((c) => {
    if (!existingStepMap.has(c.id)) {
      steps.push({
        rollerId: c.id,
        wrapMode:
          c.type === 'worker_roller' || c.type === 'stripper_roller'
            ? 'carding_gap'
            : c.type === 'cutter_knife'
            ? 'tangent'
            : 'under',
        enabled: true,
      });
    }
  });

  if (steps.length === 0) {
    routableComponents
      .sort((a, b) =>
        materialConfig.feedDirection === 'left_to_right' ? a.x - b.x : b.x - a.x
      )
      .forEach((c) => {
        const isFeedBottom = c.id === 'feed_bottom' || c.id === 'feed_bottom_2';
        steps.push({
          rollerId: c.id,
          wrapMode:
            c.type === 'feed_roller'
              ? 'under'
              : c.type === 'cutter_knife'
              ? 'tangent'
              : c.type === 'worker_roller' || c.type === 'stripper_roller'
              ? 'carding_gap'
              : 'under',
          enabled: !isFeedBottom,
        });
      });
  }

  const handleToggleStep = (rollerId: string) => {
    const existing = steps.find((s) => s.rollerId === rollerId);
    let newSteps: FabricPathStep[];
    if (existing) {
      newSteps = steps.map((s) => (s.rollerId === rollerId ? { ...s, enabled: !s.enabled } : s));
    } else {
      const comp = components.find((c) => c.id === rollerId);
      const defaultMode =
        comp?.type === 'worker_roller' || comp?.type === 'stripper_roller'
          ? 'carding_gap'
          : comp?.type === 'cutter_knife'
          ? 'tangent'
          : 'under';
      newSteps = [...steps, { rollerId, wrapMode: defaultMode, enabled: true }];
    }
    onChangeFabricRouting({ ...fabricRouting, steps: newSteps, autoRoute: false });
  };

  const handleChangeWrapMode = (rollerId: string, wrapMode: FabricPathStep['wrapMode']) => {
    const newSteps = steps.map((s) => (s.rollerId === rollerId ? { ...s, wrapMode } : s));
    onChangeFabricRouting({ ...fabricRouting, steps: newSteps, autoRoute: false });
  };

  const handleMoveStep = (index: number, direction: 'up' | 'down') => {
    const targetIdx = direction === 'up' ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= steps.length) return;
    const newSteps = [...steps];
    const temp = newSteps[index];
    newSteps[index] = newSteps[targetIdx];
    newSteps[targetIdx] = temp;
    onChangeFabricRouting({ ...fabricRouting, steps: newSteps, autoRoute: false });
  };

  const handleResetAutoRoute = () => {
    const autoSteps: FabricPathStep[] = routableComponents
      .sort((a, b) =>
        materialConfig.feedDirection === 'left_to_right' ? a.x - b.x : b.x - a.x
      )
      .map((c) => {
        const isFeedBottom = c.id === 'feed_bottom' || c.id === 'feed_bottom_2';
        return {
          rollerId: c.id,
          wrapMode:
            c.type === 'feed_roller'
              ? 'under'
              : c.type === 'cutter_knife'
              ? 'tangent'
              : c.type === 'worker_roller' || c.type === 'stripper_roller'
              ? 'carding_gap'
              : 'under',
          enabled: !isFeedBottom,
        };
      });
    onChangeFabricRouting({ ...fabricRouting, steps: autoSteps, autoRoute: false });
  };

  const colorPresets = [
    { label: t.colorDenim, hex: '#2563eb' },
    { label: t.colorCotton, hex: '#f8fafc' },
    { label: t.colorBleached, hex: '#64748b' },
    { label: t.colorRed, hex: '#e11d48' },
    { label: t.colorGreen, hex: '#16a34a' },
  ];

  return (
    <div className="p-4 space-y-4 text-xs text-slate-200">
      {/* 0. BỘ ĐIỀU KHIỂN KHỔ RỘNG VẢI & ĐỘ DÀY */}
      <div className="bg-gradient-to-br from-indigo-950/70 via-slate-900 to-slate-900 p-4 rounded-xl border border-indigo-500/50 shadow-xl space-y-3.5">
        <div className="flex items-center justify-between border-b border-indigo-900/60 pb-2">
          <span className="font-bold text-indigo-200 flex items-center gap-2 text-sm">
            <Layers className="w-4 h-4 text-indigo-400" /> {t.fabricControllerTitle}
          </span>
          <span className="font-mono text-indigo-300 font-bold bg-indigo-950/90 border border-indigo-500/50 px-2.5 py-0.5 rounded-lg text-xs shadow-sm">
            {fabricRouting.clothWidthMm || 850} mm
          </span>
        </div>

        {/* Khổ rộng dải vải mm */}
        <div className="space-y-1.5">
          <div className="flex justify-between items-center text-[11px] text-slate-300">
            <span>{t.feedWidth}</span>
            <span className="font-mono text-indigo-300 font-bold text-xs">{fabricRouting.clothWidthMm || 850} mm</span>
          </div>
          <input
            type="range"
            min="400"
            max="2000"
            step="50"
            value={fabricRouting.clothWidthMm || 850}
            onChange={(e) => {
              const val = Number(e.target.value);
              onChangeFabricRouting({ ...fabricRouting, clothWidthMm: val });
              onChangeMaterialConfig({ ...materialConfig, feedWidthMm: val });
            }}
            className="w-full accent-indigo-400 cursor-pointer h-2 bg-slate-950 rounded-lg"
          />
          <div className="grid grid-cols-5 gap-1.5 pt-0.5">
            {[600, 850, 1200, 1600, 2000].map((w) => (
              <button
                key={w}
                type="button"
                onClick={() => {
                  onChangeFabricRouting({ ...fabricRouting, clothWidthMm: w });
                  onChangeMaterialConfig({ ...materialConfig, feedWidthMm: w });
                }}
                className={`py-1 rounded text-[11px] font-mono border transition-all cursor-pointer ${
                  (fabricRouting.clothWidthMm || 850) === w
                    ? 'bg-indigo-600 text-white border-indigo-400 font-bold shadow-sm'
                    : 'bg-slate-950 text-slate-400 hover:text-slate-200 border-slate-800'
                }`}
              >
                {w}mm
              </button>
            ))}
          </div>
          <div className="flex items-center justify-between text-[10px] text-slate-400 bg-slate-950/70 p-2 rounded border border-slate-800">
            <span>{language === 'vi' ? 'Khổ vải hỗ trợ: 400 - 2000 mm' : 'Supported width: 400 - 2000 mm'}</span>
            <span className="text-emerald-400 font-medium">✓ {language === 'vi' ? 'Tang trống tự động co giãn' : 'Cylinders auto-expand'}</span>
          </div>
        </div>

        {/* Số lớp vải & Độ dày tương đương */}
        <div className="space-y-1.5 pt-1 border-t border-slate-800/80">
          <div className="flex justify-between items-center text-[11px] text-slate-300">
            <span>{t.fabricLayers}</span>
            <span className="font-mono text-sky-300 font-bold">{layers} {t.layersUnit} (~{(layers * 0.9).toFixed(1)} mm)</span>
          </div>
          <div className="flex items-center gap-1">
            {[1, 2, 3, 4, 6, 8].map((l) => (
              <button
                key={l}
                type="button"
                onClick={() => {
                  const updated = { ...materialConfig, fabricLayers: l };
                  const newRate = calculateMaterialFeedRate(speed, widthMm, gsm, l).kgPerHour;
                  updated.feedRateKgPerHour = newRate;
                  onChangeMaterialConfig(updated);
                }}
                className={`flex-1 py-1 rounded text-xs font-mono font-semibold border transition-all cursor-pointer ${
                  layers === l
                    ? 'bg-sky-600 text-white border-sky-400 font-bold shadow-sm'
                    : 'bg-slate-950 text-slate-400 hover:text-slate-200 border-slate-800'
                }`}
              >
                {l}L
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 1. Hướng nạp nguyên liệu chính */}
      <div className="bg-slate-900 p-3.5 rounded-lg border border-slate-800 space-y-2.5">
        <div className="flex items-center justify-between">
          <span className="font-semibold text-slate-200 flex items-center gap-1.5">
            <ArrowRightLeft className="w-4 h-4 text-sky-400" /> {t.feedDirectionLabel}
          </span>
          <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/60 border border-emerald-800/70 px-2 py-0.5 rounded">
            {materialConfig.feedSpeedMPerMin} {t.speedUnitMPerMin}
          </span>
        </div>

        <div className="grid grid-cols-2 gap-2 pt-1">
          <button
            type="button"
            onClick={() =>
              onChangeMaterialConfig({ ...materialConfig, feedDirection: 'left_to_right' })
            }
            className={`py-2 px-3 rounded-lg border text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
              materialConfig.feedDirection === 'left_to_right'
                ? 'bg-sky-600 border-sky-400 text-white shadow-md shadow-sky-950 font-bold'
                : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700'
            }`}
          >
            <span>{t.leftToRight}</span>
          </button>

          <button
            type="button"
            onClick={() =>
              onChangeMaterialConfig({ ...materialConfig, feedDirection: 'right_to_left' })
            }
            className={`py-2 px-3 rounded-lg border text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
              materialConfig.feedDirection === 'right_to_left'
                ? 'bg-sky-600 border-sky-400 text-white shadow-md shadow-sky-950 font-bold'
                : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700'
            }`}
          >
            <span>{t.rightToLeft}</span>
          </button>
        </div>
      </div>

      {/* 2. CẤP LIỆU: Số lượng vải / xơ cấp vào */}
      <div className="bg-slate-900 p-3.5 rounded-lg border border-slate-800 space-y-3">
        <div className="flex items-center justify-between">
          <span className="font-semibold text-slate-200 flex items-center gap-1.5">
            <Scale className="w-4 h-4 text-emerald-400" /> {t.outputSummaryTitle}
          </span>
          <span className="font-mono text-emerald-400 font-bold text-xs bg-emerald-950/70 px-2 py-0.5 rounded border border-emerald-800/80">
            {kgPerHour} {t.kgPerHour}
          </span>
        </div>

        {/* Định lượng vải GSM */}
        <div className="space-y-1">
          <div className="flex justify-between text-[11px] text-slate-400">
            <span>{t.basisWeightLabel}</span>
            <span className="font-mono text-slate-200 font-semibold">{gsm} g/m²</span>
          </div>
          <input
            type="range"
            min="150"
            max="750"
            step="25"
            value={gsm}
            onChange={(e) => {
              const val = Number(e.target.value);
              const updated = { ...materialConfig, basisWeightGsm: val };
              updated.feedRateKgPerHour = calculateMaterialFeedRate(speed, widthMm, val, layers).kgPerHour;
              onChangeMaterialConfig(updated);
            }}
            className="w-full accent-emerald-400 cursor-pointer h-1.5 bg-slate-800 rounded-lg"
          />
        </div>

        {/* Tốc độ cấp liệu m/phút */}
        <div className="space-y-1">
          <div className="flex justify-between text-[11px] text-slate-400">
            <span>{t.feedSpeed}</span>
            <span className="font-mono text-emerald-300 font-semibold">{speed} {t.speedUnitMPerMin}</span>
          </div>
          <input
            type="range"
            min="2"
            max="25"
            step="0.5"
            value={speed}
            onChange={(e) => {
              const val = Number(e.target.value);
              const updated = { ...materialConfig, feedSpeedMPerMin: val };
              updated.feedRateKgPerHour = calculateMaterialFeedRate(val, widthMm, gsm, layers).kgPerHour;
              onChangeMaterialConfig(updated);
            }}
            className="w-full accent-emerald-400 cursor-pointer h-1.5 bg-slate-800 rounded-lg"
          />
        </div>

        {/* Bảng tính sản lượng nạp liệu tức thời */}
        <div className="grid grid-cols-2 gap-2 pt-1 border-t border-slate-800 text-[11px]">
          <div className="p-2 bg-slate-950 rounded border border-slate-800">
            <span className="text-slate-400 text-[10px] block">{language === 'vi' ? 'Sản lượng theo giờ:' : 'Hourly Production:'}</span>
            <span className="font-mono text-emerald-400 font-bold text-xs">{kgPerHour} kg/h</span>
          </div>
          <div className="p-2 bg-slate-950 rounded border border-slate-800">
            <span className="text-slate-400 text-[10px] block">{language === 'vi' ? 'Năng suất ca 8 tiếng:' : '8-Hour Shift Yield:'}</span>
            <span className="font-mono text-sky-400 font-bold text-xs">~{kgPerShift} kg/shift</span>
          </div>
        </div>
      </div>

      {/* 2. Danh sách các trục trong tuyến đường đi của vải */}
      <div className="bg-slate-900 p-3.5 rounded-lg border border-slate-800 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <Route className="w-4 h-4 text-sky-400" />
            <span className="font-semibold text-slate-100">{t.contactSequenceTitle}</span>
          </div>

          <button
            type="button"
            onClick={handleResetAutoRoute}
            className="flex items-center gap-1 px-2 py-1 bg-slate-800 hover:bg-slate-700 text-sky-300 rounded text-[10px] font-medium border border-slate-700 transition-colors cursor-pointer"
            title={language === 'vi' ? 'Tự động xếp theo thứ tự tọa độ các trục' : 'Auto sort sequence by coordinates'}
          >
            <RotateCcw className="w-3 h-3" />
            <span>{language === 'vi' ? 'Tự động sắp xếp' : 'Auto Sequence'}</span>
          </button>
        </div>

        <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
          {steps.map((step, idx) => {
            const comp = components.find((c) => c.id === step.rollerId);
            if (!comp) return null;
            const compName = getLocalizedComponentName(comp.name, language);

            return (
              <div
                key={step.rollerId}
                className={`p-2.5 rounded-lg border transition-all ${
                  step.enabled
                    ? 'bg-slate-950 border-slate-700 shadow-sm'
                    : 'bg-slate-950/40 border-slate-800 opacity-50'
                }`}
              >
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2 min-w-0">
                    <input
                      type="checkbox"
                      checked={step.enabled}
                      onChange={() => handleToggleStep(step.rollerId)}
                      className="accent-sky-500 rounded cursor-pointer w-4 h-4 shrink-0"
                    />
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className="font-mono text-[10px] text-sky-400 font-bold">
                          #{idx + 1}
                        </span>
                        <span className="font-semibold text-slate-100 truncate block">
                          {compName}
                        </span>
                      </div>
                      <span className="font-mono text-[9px] text-slate-400">
                        Ø{comp.diameter}mm · X:{comp.x} Y:{comp.y}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-0.5 shrink-0">
                    <button
                      type="button"
                      disabled={idx === 0}
                      onClick={() => handleMoveStep(idx, 'up')}
                      className="p-1 hover:bg-slate-800 disabled:opacity-30 text-slate-400 hover:text-slate-200 rounded cursor-pointer"
                      title={language === 'vi' ? 'Di chuyển lên trước' : 'Move up'}
                    >
                      <MoveUp className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      disabled={idx === steps.length - 1}
                      onClick={() => handleMoveStep(idx, 'down')}
                      className="p-1 hover:bg-slate-800 disabled:opacity-30 text-slate-400 hover:text-slate-200 rounded cursor-pointer"
                      title={language === 'vi' ? 'Di chuyển xuống sau' : 'Move down'}
                    >
                      <MoveDown className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {step.enabled && (
                  <div className="space-y-1.5 mt-2 pt-2 border-t border-slate-800/80">
                    {comp.type === 'worker_roller' || comp.type === 'stripper_roller' ? (
                      <div className="grid grid-cols-2 gap-1.5">
                        <button
                          type="button"
                          onClick={() => handleChangeWrapMode(step.rollerId, 'carding_gap')}
                          className={`py-1.5 px-2 rounded text-[10px] font-bold transition-all text-center col-span-2 flex items-center justify-center gap-1.5 cursor-pointer ${
                            step.wrapMode === 'carding_gap'
                              ? 'bg-emerald-600 text-white shadow-md ring-1 ring-emerald-400'
                              : 'bg-slate-900 text-slate-300 hover:text-white border border-slate-700'
                          }`}
                        >
                          <Sparkles className="w-3.5 h-3.5 text-emerald-300" />
                          <span>{t.cardingGapContact}</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => handleChangeWrapMode(step.rollerId, 'under')}
                          className={`py-1 px-1.5 rounded text-[10px] font-medium transition-colors text-center cursor-pointer ${
                            step.wrapMode === 'under'
                              ? 'bg-indigo-600 text-white font-bold shadow-sm'
                              : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
                          }`}
                        >
                          {t.wrapUnder}
                        </button>
                        <button
                          type="button"
                          onClick={() => handleChangeWrapMode(step.rollerId, 'over')}
                          className={`py-1 px-1.5 rounded text-[10px] font-medium transition-colors text-center cursor-pointer ${
                            step.wrapMode === 'over'
                              ? 'bg-sky-600 text-white font-bold shadow-sm'
                              : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
                          }`}
                        >
                          {t.wrapOver}
                        </button>
                      </div>
                    ) : (
                      <div className="grid grid-cols-3 gap-1.5">
                        <button
                          type="button"
                          onClick={() => handleChangeWrapMode(step.rollerId, 'over')}
                          className={`py-1 px-1.5 rounded text-[10px] font-medium transition-colors text-center cursor-pointer ${
                            step.wrapMode === 'over'
                              ? 'bg-sky-600 text-white font-bold shadow-sm'
                              : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
                          }`}
                        >
                          {t.wrapOver}
                        </button>
                        <button
                          type="button"
                          onClick={() => handleChangeWrapMode(step.rollerId, 'under')}
                          className={`py-1 px-1.5 rounded text-[10px] font-medium transition-colors text-center cursor-pointer ${
                            step.wrapMode === 'under'
                              ? 'bg-indigo-600 text-white font-bold shadow-sm'
                              : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
                          }`}
                        >
                          {t.wrapUnder}
                        </button>
                        <button
                          type="button"
                          onClick={() => handleChangeWrapMode(step.rollerId, 'tangent')}
                          className={`py-1 px-1.5 rounded text-[10px] font-medium transition-colors text-center cursor-pointer ${
                            step.wrapMode === 'tangent'
                              ? 'bg-emerald-600 text-white font-bold shadow-sm'
                              : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
                          }`}
                        >
                          {t.tangentContact}
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* 3. Tùy chỉnh mô hình 3D: Khổ vải & Màu sắc & Bông xơ */}
      <div className="bg-slate-900 p-3.5 rounded-lg border border-slate-800 space-y-3">
        <span className="font-semibold text-slate-200 flex items-center gap-1.5">
          <Palette className="w-4 h-4 text-sky-400" /> {language === 'vi' ? 'Tùy Chỉnh Mô Hình Vải & Bông 3D' : '3D Fabric Web & Fiber Tuning'}
        </span>

        {/* Màu sắc mô hình vải */}
        <div className="space-y-1.5 pt-1">
          <label className="text-[11px] text-slate-400 block">{t.fabricColor3D}</label>
          <div className="grid grid-cols-3 gap-1.5">
            {colorPresets.map((p) => (
              <button
                key={p.hex}
                type="button"
                onClick={() => onChangeFabricRouting({ ...fabricRouting, clothColor: p.hex })}
                className={`flex items-center gap-1.5 px-2 py-1.5 rounded border text-[10px] font-medium transition-all cursor-pointer ${
                  fabricRouting.clothColor === p.hex
                    ? 'border-sky-400 bg-slate-800 text-white font-bold'
                    : 'border-slate-800 bg-slate-950 text-slate-300 hover:border-slate-700'
                }`}
              >
                <span
                  className="w-2.5 h-2.5 rounded-full border border-slate-600 shrink-0"
                  style={{ backgroundColor: p.hex }}
                />
                <span className="truncate">{p.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Bật hạt bông xơ 3D */}
        <label className="flex items-center gap-2 pt-2 border-t border-slate-800 text-[11px] text-slate-300 cursor-pointer select-none">
          <input
            type="checkbox"
            checked={fabricRouting.fiberTuftParticles !== false}
            onChange={(e) =>
              onChangeFabricRouting({ ...fabricRouting, fiberTuftParticles: e.target.checked })
            }
            className="accent-sky-500 rounded cursor-pointer w-4 h-4"
          />
          <Sparkles className="w-3.5 h-3.5 text-amber-400 shrink-0" />
          <span>{language === 'vi' ? 'Hiển thị cụm bông xơ 3D tơi xốp & luồng khí hút khi máy xé vải' : 'Show 3D lofty fiber tufts & pneumatic suction particles'}</span>
        </label>

        {/* Tùy chọn Ẩn / Hiện Cây cuộn vải cấp liệu 3D phía trước */}
        <label className="flex items-center gap-2 pt-2 border-t border-slate-800 text-[11px] text-slate-300 cursor-pointer select-none">
          <input
            type="checkbox"
            checked={fabricRouting.showSupplyRoll !== false}
            onChange={(e) =>
              onChangeFabricRouting({ ...fabricRouting, showSupplyRoll: e.target.checked })
            }
            className="accent-indigo-500 rounded cursor-pointer w-4 h-4"
          />
          <Layers className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
          <span>{language === 'vi' ? 'Hiển thị cây cuộn vải cấp liệu 3D phía trước (Fabric Supply Roll Stand)' : 'Display front 3D fabric supply roll stand'}</span>
        </label>
      </div>

      {/* 4. Trạng thái chạy mô phỏng & Nguyên lý công nghệ chuẩn */}
      <div className="p-3 bg-slate-950 rounded-lg border border-emerald-950/60 text-[11px] text-slate-400 space-y-1.5">
        <div className="flex items-center gap-1.5 text-emerald-400 font-semibold">
          <Eye className="w-3.5 h-3.5 text-emerald-400" />
          <span>{language === 'vi' ? 'Nguyên lý công nghệ máy xé tái chế vải vụn:' : 'Textile Rag Tearing Principles:'}</span>
        </div>
        <p className="leading-relaxed">
          {language === 'vi'
            ? `Khi nhấn ${isRunning ? 'Tạm dừng' : 'Chạy thử'}: Tấm vải vụn dệt (Denim, Knit, Cotton) được nạp vào qua cặp trục ép và dao cắt. Khi tiếp xúc với răng kim trống xé chính và các cặp trục chải/trục bóc (Worker & Stripper), cấu trúc dệt bị đánh tơi hoàn toàn thành 100% xơ bông tơi xốp.`
            : `When running: Raw scrap textile webs (Denim, Knit, Cotton) are gripped by feed nip rollers and ledger knives. Upon contact with the high-speed pinned cylinder and worker/stripper carding pairs, fabric weaves are disintegrated into 100% opened cotton fibers.`}
        </p>
      </div>
    </div>
  );
};
