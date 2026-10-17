import React from 'react';
import { MaterialFeedConfig, SuctionSystemConfig, TensionSegment, FabricRoutingConfig, MachineComponent, FabricPathStep } from '../types/machine';
import { useLanguage } from '../i18n/LanguageContext';
import { getLocalizedComponentName } from '../utils/presets';
import { ArrowLeftRight, Wind, Activity, Gauge, Flame, CheckCircle2, AlertTriangle, AlertCircle, Route, Sparkles, MoveUp, MoveDown, Check } from 'lucide-react';

interface MaterialTensionHUDProps {
  materialConfig: MaterialFeedConfig;
  onChangeMaterialConfig: (updated: MaterialFeedConfig) => void;
  suctionConfig: SuctionSystemConfig;
  onChangeSuctionConfig: (updated: SuctionSystemConfig) => void;
  tensions: TensionSegment[];
  fabricRouting: FabricRoutingConfig;
  onChangeFabricRouting: (updated: FabricRoutingConfig) => void;
  components: MachineComponent[];
  isRunning: boolean;
}

export const MaterialTensionHUD: React.FC<MaterialTensionHUDProps> = ({
  materialConfig,
  onChangeMaterialConfig,
  suctionConfig,
  onChangeSuctionConfig,
  tensions,
  fabricRouting,
  onChangeFabricRouting,
  components,
  isRunning,
}) => {
  const { language, t } = useLanguage();

  const availableRollers = components.filter((c) => c.type !== 'suction_hood');

  const steps = fabricRouting.steps.length > 0
    ? fabricRouting.steps
    : availableRollers.map((r, i) => ({
        rollerId: r.id,
        wrapMode: (i % 2 === 0 ? 'under' : 'over') as FabricPathStep['wrapMode'],
        enabled: true,
      }));

  const handleToggleStep = (rollerId: string) => {
    const existing = steps.find((s) => s.rollerId === rollerId);
    let newSteps: FabricPathStep[];
    if (existing) {
      newSteps = steps.map((s) => (s.rollerId === rollerId ? { ...s, enabled: !s.enabled } : s));
    } else {
      newSteps = [...steps, { rollerId, wrapMode: 'under', enabled: true }];
    }
    onChangeFabricRouting({ ...fabricRouting, steps: newSteps, autoRoute: false });
  };

  const handleChangeWrapMode = (rollerId: string, wrapMode: FabricPathStep['wrapMode']) => {
    const newSteps = steps.map((s) => (s.rollerId === rollerId ? { ...s, wrapMode } : s));
    onChangeFabricRouting({ ...fabricRouting, steps: newSteps, autoRoute: false });
  };

  return (
    <div className="p-4 space-y-4 text-xs text-slate-200">
      {/* 1. Hướng đi của nguyên liệu & Cấu hình cấp vải */}
      <div className="bg-slate-900 p-3.5 rounded-lg border border-slate-800 space-y-3">
        <div className="flex items-center justify-between">
          <span className="font-semibold text-slate-200 flex items-center gap-1.5">
            <ArrowLeftRight className="w-4 h-4 text-sky-400" /> {t.materialFlowTitle}
          </span>
          <span className="font-mono text-[11px] text-slate-400">{materialConfig.feedRateKgPerHour} kg/h</span>
        </div>

        <div>
          <label className="text-[11px] text-slate-400 mb-1.5 block">{t.feedDirectionLabel}</label>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => onChangeMaterialConfig({ ...materialConfig, feedDirection: 'left_to_right' })}
              className={`py-2 px-3 rounded border text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer ${
                materialConfig.feedDirection === 'left_to_right'
                  ? 'bg-sky-950/80 border-sky-500 text-sky-300'
                  : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              <span>{t.leftToRight}</span>
            </button>
            <button
              type="button"
              onClick={() => onChangeMaterialConfig({ ...materialConfig, feedDirection: 'right_to_left' })}
              className={`py-2 px-3 rounded border text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer ${
                materialConfig.feedDirection === 'right_to_left'
                  ? 'bg-sky-950/80 border-sky-500 text-sky-300'
                  : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              <span>{t.rightToLeft}</span>
            </button>
          </div>
        </div>

        {/* Loại nguyên liệu đầu vào */}
        <div className="grid grid-cols-2 gap-2.5 pt-1">
          <div>
            <label className="text-[11px] text-slate-400 mb-1 block">{t.materialTypeLabel}</label>
            <select
              value={materialConfig.materialType}
              onChange={(e) =>
                onChangeMaterialConfig({
                  ...materialConfig,
                  materialType: e.target.value as MaterialFeedConfig['materialType'],
                })
              }
              className="w-full bg-slate-950 border border-slate-700 rounded px-2.5 py-1.5 text-xs text-slate-200 outline-none focus:border-sky-500"
            >
              <option value="cotton_denim">{t.materialDenim}</option>
              <option value="knit_cotton">{t.materialCottonKnit}</option>
              <option value="synthetic_poly">{t.materialPoly}</option>
              <option value="blended_waste">{t.materialBlended}</option>
            </select>
          </div>

          <div>
            <label className="text-[11px] text-slate-400 mb-1 block">{t.feedSpeed} ({t.speedUnitMPerMin}):</label>
            <input
              type="number"
              min="2"
              max="60"
              value={materialConfig.feedSpeedMPerMin}
              onChange={(e) =>
                onChangeMaterialConfig({
                  ...materialConfig,
                  feedSpeedMPerMin: Number(e.target.value),
                })
              }
              className="w-full bg-slate-950 border border-slate-700 rounded px-2.5 py-1.5 font-mono text-xs text-slate-200 outline-none focus:border-sky-500"
            />
          </div>
        </div>
      </div>

      {/* 2. Tuyến Đường Luồn Vải & Hướng Đi Qua Các Trục */}
      <div className="bg-slate-900 p-3.5 rounded-lg border border-slate-800 space-y-3">
        <div className="flex items-center justify-between">
          <span className="font-semibold text-slate-200 flex items-center gap-1.5">
            <Route className="w-4 h-4 text-sky-400" /> {language === 'vi' ? 'Tuyến Đường Đi Của Vải / Bông (3D)' : '3D Fabric Wrapping Path'}
          </span>
          <button
            type="button"
            onClick={() => onChangeFabricRouting({ ...fabricRouting, autoRoute: !fabricRouting.autoRoute })}
            className={`px-2 py-0.5 rounded text-[10px] font-semibold border transition-colors cursor-pointer ${
              fabricRouting.autoRoute
                ? 'bg-sky-950/80 border-sky-600 text-sky-300'
                : 'bg-slate-950 border-slate-700 text-slate-400'
            }`}
          >
            {fabricRouting.autoRoute ? (language === 'vi' ? 'TỰ ĐỘNG' : 'AUTO') : (language === 'vi' ? 'TỰ CHỌN' : 'MANUAL')}
          </button>
        </div>

        <div className="space-y-1.5 max-h-56 overflow-y-auto pr-1">
          {availableRollers.map((r) => {
            const step = steps.find((s) => s.rollerId === r.id);
            const isEnabled = step ? step.enabled : false;
            const wrapMode = step ? step.wrapMode : 'under';
            const rollerName = getLocalizedComponentName(r.name, language);

            return (
              <div
                key={r.id}
                className={`p-2 rounded-lg border transition-all flex items-center justify-between gap-2 ${
                  isEnabled ? 'bg-slate-950 border-slate-700' : 'bg-slate-950/40 border-slate-800 opacity-60'
                }`}
              >
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={isEnabled}
                    onChange={() => handleToggleStep(r.id)}
                    className="accent-sky-500 rounded cursor-pointer w-3.5 h-3.5"
                  />
                  <div className="overflow-hidden">
                    <span className="font-semibold text-slate-200 truncate block max-w-[130px]">{rollerName}</span>
                    <span className="font-mono text-[9px] text-slate-500">Ø{r.diameter}mm</span>
                  </div>
                </div>

                {isEnabled && (
                  <div className="flex items-center gap-1">
                    {(r.type === 'worker_roller' || r.type === 'stripper_roller') && (
                      <button
                        type="button"
                        onClick={() => handleChangeWrapMode(r.id, 'carding_gap')}
                        className={`px-1.5 py-0.5 rounded text-[10px] font-bold transition-colors cursor-pointer ${
                          wrapMode === 'carding_gap' ? 'bg-emerald-600 text-white shadow-sm ring-1 ring-emerald-400' : 'bg-slate-800 text-slate-400 hover:text-slate-200'
                        }`}
                        title={t.cardingGapContact}
                      >
                        {language === 'vi' ? 'Khe chải' : 'Gap'}
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => handleChangeWrapMode(r.id, 'under')}
                      className={`px-1.5 py-0.5 rounded text-[10px] font-medium transition-colors cursor-pointer ${
                        wrapMode === 'under' ? 'bg-indigo-600 text-white font-bold' : 'bg-slate-800 text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      {language === 'vi' ? (r.type === 'main_drum' ? 'Ôm đầy đủ' : 'Dưới') : 'Under'}
                    </button>
                    <button
                      type="button"
                      onClick={() => handleChangeWrapMode(r.id, 'over')}
                      className={`px-1.5 py-0.5 rounded text-[10px] font-medium transition-colors cursor-pointer ${
                        wrapMode === 'over' ? 'bg-sky-600 text-white font-bold' : 'bg-slate-800 text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      {language === 'vi' ? 'Trên' : 'Over'}
                    </button>
                    <button
                      type="button"
                      onClick={() => handleChangeWrapMode(r.id, 'tangent')}
                      className={`px-1.5 py-0.5 rounded text-[10px] font-medium transition-colors cursor-pointer ${
                        wrapMode === 'tangent' ? 'bg-amber-600 text-white font-bold' : 'bg-slate-800 text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      {language === 'vi' ? 'Mép cắt' : 'Tangent'}
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* 3. Giả lập Lực căng vải theo thời gian thực */}
      <div className="bg-slate-900 p-3.5 rounded-lg border border-slate-800 space-y-3">
        <div className="flex items-center justify-between">
          <span className="font-semibold text-slate-200 flex items-center gap-1.5">
            <Activity className="w-4 h-4 text-emerald-400" /> {t.tensionMonitorTitle}
          </span>
          <span className="text-[10px] font-mono text-slate-400">Unit: Newton (N)</span>
        </div>

        {tensions.length === 0 ? (
          <p className="text-[11px] text-slate-500 text-center py-2">
            {language === 'vi' ? 'Chưa đủ trục chuyển tiếp để tính lực căng liên tục.' : 'Not enough active rollers to compute tension flow.'}
          </p>
        ) : (
          <div className="space-y-2.5">
            {tensions.map((tn) => {
              const isSnap = tn.status === 'critical_snap';
              const isSlack = tn.status === 'slack_wrap';
              const isHigh = tn.status === 'warning_high';

              let barColor = 'bg-emerald-500';
              let badgeText = t.statusOptimal;
              let badgeColor = 'text-emerald-400 bg-emerald-950/70 border-emerald-700';

              if (isSnap) {
                barColor = 'bg-rose-500 animate-pulse';
                badgeText = t.statusCriticalSnap;
                badgeColor = 'text-rose-400 bg-rose-950/70 border-rose-700';
              } else if (isSlack) {
                barColor = 'bg-sky-500';
                badgeText = t.statusSlackWrap;
                badgeColor = 'text-sky-400 bg-sky-950/70 border-sky-700';
              } else if (isHigh) {
                barColor = 'bg-amber-500';
                badgeText = t.statusWarningHigh;
                badgeColor = 'text-amber-400 bg-amber-950/70 border-amber-700';
              }

              const percent = Math.min(100, Math.max(5, (tn.tensionN / 600) * 100));
              const fromName = getLocalizedComponentName(tn.fromName, language);
              const toName = getLocalizedComponentName(tn.toName, language);

              return (
                <div key={`${tn.fromId}-${tn.toId}`} className="p-2.5 bg-slate-950 rounded border border-slate-800/80 space-y-1.5">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-slate-300 font-medium">
                      {fromName} ➔ {toName}
                    </span>
                    <span className={`px-2 py-0.5 rounded border text-[10px] font-semibold ${badgeColor}`}>
                      {badgeText}
                    </span>
                  </div>

                  <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                    <div className={`h-full rounded-full transition-all duration-300 ${barColor}`} style={{ width: `${percent}%` }} />
                  </div>

                  <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono">
                    <span>{t.tensionForce}: <strong className="text-slate-100">{tn.tensionN} N</strong></span>
                    <span>{t.tensionDraftRatio}: <strong className="text-slate-100">{tn.speedRatio}x</strong></span>
                    <span>V: {tn.v1} ➔ {tn.v2} m/min</span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* 4. Hệ thống Hút Bụi & Thu Gom Bông Khí Động Học */}
      <div className="bg-slate-900 p-3.5 rounded-lg border border-slate-800 space-y-3">
        <div className="flex items-center justify-between">
          <span className="font-semibold text-slate-200 flex items-center gap-1.5">
            <Wind className="w-4 h-4 text-emerald-400" /> {t.suctionSystemTitle}
          </span>
          <button
            type="button"
            onClick={() => onChangeSuctionConfig({ ...suctionConfig, active: !suctionConfig.active })}
            className={`px-2.5 py-1 rounded text-[11px] font-semibold transition-colors cursor-pointer ${
              suctionConfig.active ? 'bg-emerald-600 text-white' : 'bg-slate-800 text-slate-400 hover:text-slate-200'
            }`}
          >
            {suctionConfig.active ? (language === 'vi' ? 'ĐANG BẬT' : 'ONLINE') : (language === 'vi' ? 'ĐÃ TẮT' : 'OFFLINE')}
          </button>
        </div>

        {/* Tốc độ gió hút m/s */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-[11px]">
            <span className="text-slate-400">{t.airVelocityLabel}</span>
            <span className={`font-mono font-bold ${suctionConfig.airVelocity < 20 ? 'text-amber-400' : 'text-emerald-400'}`}>
              {suctionConfig.airVelocity} m/s
            </span>
          </div>
          <input
            type="range"
            min="12"
            max="34"
            step="0.5"
            value={suctionConfig.airVelocity}
            onChange={(e) =>
              onChangeSuctionConfig({
                ...suctionConfig,
                airVelocity: Number(e.target.value),
              })
            }
            className="w-full accent-emerald-500 cursor-pointer"
          />
          <div className="flex justify-between text-[9px] text-slate-500 font-mono">
            <span>{language === 'vi' ? 'Yếu (12 m/s)' : 'Low (12 m/s)'}</span>
            <span className="text-emerald-400 font-semibold">{language === 'vi' ? 'Chuẩn xé vải (22 - 26 m/s)' : 'Optimal (22 - 26 m/s)'}</span>
            <span>{language === 'vi' ? 'Rất mạnh (34 m/s)' : 'High (34 m/s)'}</span>
          </div>
        </div>

        {/* Lưu lượng khí m3/h */}
        <div className="grid grid-cols-2 gap-2 pt-1 text-[11px]">
          <div className="bg-slate-950 p-2 rounded border border-slate-800">
            <span className="text-slate-400 block text-[10px]">{t.airflowRateLabel}</span>
            <span className="font-mono font-semibold text-slate-100">{suctionConfig.airflowRate} m³/h</span>
          </div>
          <div className="bg-slate-950 p-2 rounded border border-slate-800">
            <span className="text-slate-400 block text-[10px]">{t.ductDiameterLabel}</span>
            <span className="font-mono font-semibold text-slate-100">Ø {suctionConfig.ductDiameter} mm</span>
          </div>
        </div>
      </div>
    </div>
  );
};
