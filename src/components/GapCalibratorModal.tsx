import React, { useState } from 'react';
import { MachineComponent } from '../types/machine';
import { calculateGap } from '../utils/physicsEngine';
import { NumericInput } from './RollerInspector';
import { useLanguage } from '../i18n/LanguageContext';
import { getLocalizedComponentName } from '../utils/presets';
import { X, Check, Target, ArrowRight, ShieldAlert, Sparkles } from 'lucide-react';

interface GapCalibratorModalProps {
  isOpen: boolean;
  onClose: () => void;
  components: MachineComponent[];
  initialIdA?: string | null;
  initialIdB?: string | null;
  onApplyGap: (movingCompId: string, newX: number, newY: number) => void;
}

export const GapCalibratorModal: React.FC<GapCalibratorModalProps> = ({
  isOpen,
  onClose,
  components,
  initialIdA,
  initialIdB,
  onApplyGap,
}) => {
  const { language, t } = useLanguage();

  if (!isOpen) return null;

  const defaultA = initialIdA || (components.length > 0 ? components[0].id : '');
  const defaultB = initialIdB || (components.length > 1 ? components[1].id : '');

  const [idA, setIdA] = useState<string>(defaultA);
  const [idB, setIdB] = useState<string>(defaultB === defaultA && components.length > 1 ? components[1].id : defaultB);

  const compA = components.find((c) => c.id === idA);
  const compB = components.find((c) => c.id === idB);

  const [targetGapMm, setTargetGapMm] = useState<number>(2.0);
  const [movingChoice, setMovingChoice] = useState<'B' | 'A'>('B');

  const currentCalc = compA && compB ? calculateGap(compA, compB) : { centerDist: 0, gapMm: 0 };

  const quickPresets = language === 'vi'
    ? [
        { label: '0.8 mm (Cấp ép mỏng)', val: 0.8 },
        { label: '1.5 mm (Dao cắt - Trống)', val: 1.5 },
        { label: '2.0 mm (Trục Chải Worker)', val: 2.0 },
        { label: '2.5 mm (Trục Bóc Stripper)', val: 2.5 },
        { label: '3.5 mm (Mở xơ thô)', val: 3.5 },
      ]
    : [
        { label: '0.8 mm (Feed Nip)', val: 0.8 },
        { label: '1.5 mm (Knife - Cylinder)', val: 1.5 },
        { label: '2.0 mm (Worker Roller)', val: 2.0 },
        { label: '2.5 mm (Stripper Roller)', val: 2.5 },
        { label: '3.5 mm (Coarse Opening)', val: 3.5 },
      ];

  const handleApply = () => {
    if (!compA || !compB) return;

    const stationary = movingChoice === 'B' ? compA : compB;
    const moving = movingChoice === 'B' ? compB : compA;

    const dx = moving.x - stationary.x;
    const dy = moving.y - stationary.y;
    const currentDist = Math.hypot(dx, dy);

    const sumRadius = compA.diameter / 2 + compB.diameter / 2;
    const newTargetDist = sumRadius + targetGapMm;

    let newX: number;
    let newY: number;

    if (currentDist === 0) {
      newX = Number((stationary.x + newTargetDist).toFixed(2));
      newY = Number(stationary.y.toFixed(2));
    } else {
      const ux = dx / currentDist;
      const uy = dy / currentDist;
      newX = Number((stationary.x + ux * newTargetDist).toFixed(2));
      newY = Number((stationary.y + uy * newTargetDist).toFixed(2));
    }

    onApplyGap(moving.id, newX, newY);
    onClose();
  };

  const nameA = compA ? getLocalizedComponentName(compA.name, language) : '';
  const nameB = compB ? getLocalizedComponentName(compB.name, language) : '';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4">
      <div className="bg-slate-900 border border-slate-700 w-full max-w-lg rounded-xl shadow-2xl overflow-hidden flex flex-col">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-900/50">
          <div className="flex items-center gap-2.5">
            <Target className="w-5 h-5 text-sky-400" />
            <div>
              <h2 className="text-base font-semibold text-slate-100">{t.gapCalibratorTitle}</h2>
              <p className="text-xs text-slate-400">{t.gapCalibratorSubtitle}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-4 text-xs text-slate-300">
          {/* Chọn 2 quả lô */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-slate-400 mb-1.5 block font-semibold">{t.stationaryRoller}</label>
              <select
                value={idA}
                onChange={(e) => setIdA(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-slate-100 font-semibold outline-none focus:border-sky-500"
              >
                {components.map((c) => (
                  <option key={c.id} value={c.id}>
                    {getLocalizedComponentName(c.name, language)}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-slate-400 mb-1.5 block font-semibold">{t.movingRoller}</label>
              <select
                value={idB}
                onChange={(e) => setIdB(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-slate-100 font-semibold outline-none focus:border-sky-500"
              >
                {components.map((c) => (
                  <option key={c.id} value={c.id}>
                    {getLocalizedComponentName(c.name, language)}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Trạng thái hiện tại */}
          <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 flex items-center justify-between">
            <div>
              <span className="text-slate-400 block">{t.currentCalculatedGap}</span>
              <span
                className={`text-lg font-bold font-mono ${
                  currentCalc.gapMm < 0 ? 'text-rose-400' : currentCalc.gapMm < 1 ? 'text-amber-400' : 'text-emerald-400'
                }`}
              >
                {currentCalc.gapMm} mm
              </span>
            </div>
            <div className="text-right">
              <span className="text-slate-400 block">{t.centerDistance}</span>
              <span className="text-sm font-semibold text-slate-300 font-mono">{currentCalc.centerDist} mm</span>
            </div>
          </div>

          {/* Nhập khe hở mục tiêu */}
          <div className="space-y-1.5">
            <label className="font-semibold text-slate-200 block">{t.targetGapMm}</label>
            <div className="flex items-center gap-2">
              <NumericInput
                step={0.1}
                min={0.1}
                max={50}
                value={targetGapMm}
                onChangeValue={(val) => setTargetGapMm(val)}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-base font-bold font-mono text-sky-400 outline-none focus:border-sky-500"
              />
              <span className="font-mono text-slate-400 font-semibold text-sm">mm</span>
            </div>
          </div>

          {/* Presets nhanh */}
          <div className="space-y-1.5">
            <span className="text-[11px] text-slate-400 block">{t.recommendedGaps}</span>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5">
              {quickPresets.map((p) => (
                <button
                  key={p.val}
                  type="button"
                  onClick={() => setTargetGapMm(p.val)}
                  className={`p-2 rounded-lg border text-[11px] font-medium text-left transition-colors cursor-pointer ${
                    Math.abs(targetGapMm - p.val) < 0.05
                      ? 'bg-sky-600 text-white border-sky-400 font-bold'
                      : 'bg-slate-950 hover:bg-slate-800 text-slate-300 border-slate-800'
                  }`}
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="flex items-center justify-end gap-2.5 px-6 py-4 border-t border-slate-800 bg-slate-900/50">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors cursor-pointer"
          >
            {t.cancel}
          </button>
          <button
            type="button"
            onClick={handleApply}
            className="px-5 py-2 bg-sky-600 hover:bg-sky-500 text-white font-semibold rounded-lg shadow-md transition-colors flex items-center gap-2 cursor-pointer"
          >
            <Check className="w-4 h-4" />
            <span>{t.applyGapBtn}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
