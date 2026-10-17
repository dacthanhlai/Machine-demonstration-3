import React, { useEffect, useRef, useState } from 'react';
import { MachineComponent } from '../types/machine';
import { useLanguage } from '../i18n/LanguageContext';
import { getLocalizedComponentName } from '../utils/presets';
import {
  Sparkles,
  X,
  Sliders,
  HelpCircle,
  Check,
  ZoomIn,
  Layers,
  Cpu,
  Info,
  Camera,
} from 'lucide-react';
import cardClothingMacroImg from '../assets/images/card_clothing_macro_1791863975392.jpg';

interface CardClothingModalProps {
  isOpen: boolean;
  onClose: () => void;
  components: MachineComponent[];
  selectedComponentId: string | null;
  onUpdateComponent: (updated: MachineComponent) => void;
}

export const CardClothingModal: React.FC<CardClothingModalProps> = ({
  isOpen,
  onClose,
  components,
  selectedComponentId,
  onUpdateComponent,
}) => {
  const { language, t } = useLanguage();

  const [activeId, setActiveId] = useState<string>(
    selectedComponentId || components.find((c) => c.type === 'main_drum')?.id || components[0]?.id || ''
  );
  const [visualMode, setVisualMode] = useState<'diagram' | 'real_photo'>('real_photo');

  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (selectedComponentId) {
      setActiveId(selectedComponentId);
    }
  }, [selectedComponentId]);

  const currentComp = components.find((c) => c.id === activeId) || components[0];

  const pitchMm = currentComp?.toothPitchMm || (currentComp?.type === 'main_drum' ? 3.2 : 2.8);
  const heightMm = currentComp?.toothHeightMm || (currentComp?.type === 'main_drum' ? 4.8 : 3.5);
  const angleDeg = currentComp?.toothAngleDeg || (currentComp?.type === 'main_drum' ? 70 : 65);
  const cardType = currentComp?.cardClothingType || 'metallic_sawtooth';

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !currentComp) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const w = canvas.width;
    const h = canvas.height;

    const bgGrad = ctx.createLinearGradient(0, 0, w, h);
    bgGrad.addColorStop(0, '#0f172a');
    bgGrad.addColorStop(0.5, '#1e293b');
    bgGrad.addColorStop(1, '#0f172a');
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, w, h);

    ctx.strokeStyle = '#334155';
    ctx.lineWidth = 0.5;
    const gridSize = 20;
    for (let x = 0; x < w; x += gridSize) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, h);
      ctx.stroke();
    }
    for (let y = 0; y < h; y += gridSize) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(w, y);
      ctx.stroke();
    }

    if (currentComp.type === 'cutter_knife') {
      ctx.fillStyle = '#e2e8f0';
      ctx.beginPath();
      ctx.moveTo(40, 180);
      ctx.lineTo(w - 40, 60);
      ctx.lineTo(w - 40, 100);
      ctx.lineTo(40, 220);
      ctx.closePath();
      ctx.fill();

      ctx.fillStyle = '#38bdf8';
      ctx.beginPath();
      ctx.moveTo(40, 180);
      ctx.lineTo(40, 195);
      ctx.lineTo(w - 40, 75);
      ctx.lineTo(w - 40, 60);
      ctx.closePath();
      ctx.fill();
      return;
    }

    const scale = 18;
    const baseY = 210;
    const pPix = pitchMm * scale;
    const hPix = heightMm * scale;
    const rad = (angleDeg * Math.PI) / 180;
    const dx = hPix / Math.tan(rad);

    ctx.fillStyle = '#475569';
    ctx.fillRect(16, baseY, w - 32, 28);

    ctx.fillStyle = '#0284c7';
    ctx.strokeStyle = '#38bdf8';
    ctx.lineWidth = 2.5;

    ctx.beginPath();
    ctx.moveTo(20, baseY);

    for (let x = 30; x < w - 40; x += pPix) {
      ctx.lineTo(x, baseY);
      ctx.lineTo(x + dx, baseY - hPix);
      ctx.lineTo(x + pPix, baseY);
    }
    ctx.lineTo(w - 20, baseY);
    ctx.lineTo(w - 20, baseY + 20);
    ctx.lineTo(20, baseY + 20);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = '#f8fafc';
    ctx.font = 'bold 12px monospace';
    ctx.fillText(`${language === 'vi' ? 'Mặt tang trống thép' : 'Steel Drum Surface'} Ø${currentComp.diameter}mm`, 30, baseY + 18);

    const surfaceTopY = baseY + 36;
    const surfaceH = 75;
    ctx.fillStyle = '#1e293b';
    ctx.fillRect(16, surfaceTopY, w - 32, surfaceH);

    const bandHeight = 12;
    for (let y = surfaceTopY; y < surfaceTopY + surfaceH; y += bandHeight) {
      ctx.fillStyle = (y / bandHeight) % 2 === 0 ? '#334155' : '#1e293b';
      ctx.fillRect(16, y, w - 32, bandHeight - 1);

      for (let x = 24; x < w - 32; x += 14) {
        const jitter = ((x * 13) % 5) - 2;
        ctx.fillStyle = '#e2e8f0';
        ctx.fillRect(x + jitter, y + 4, 2, 4);
        ctx.fillStyle = '#38bdf8';
        ctx.fillRect(x + jitter, y + 3, 2, 1.5);
      }
    }
  }, [currentComp, pitchMm, heightMm, angleDeg, cardType, language]);

  if (!isOpen) return null;

  const handleApplyPreset = (type: 'coarse_denim' | 'medium_knit' | 'fine_carding' | 'pinned_lag') => {
    if (!currentComp) return;
    let newPitch = 3.2;
    let newHeight = 4.8;
    let newAngle = 70;
    let newType: MachineComponent['cardClothingType'] = 'metallic_sawtooth';

    if (type === 'coarse_denim') {
      newPitch = 4.2;
      newHeight = 5.2;
      newAngle = 72;
      newType = 'metallic_sawtooth';
    } else if (type === 'medium_knit') {
      newPitch = 3.0;
      newHeight = 4.5;
      newAngle = 68;
      newType = 'metallic_sawtooth';
    } else if (type === 'fine_carding') {
      newPitch = 2.2;
      newHeight = 3.8;
      newAngle = 65;
      newType = 'metallic_sawtooth';
    } else if (type === 'pinned_lag') {
      newPitch = 8.0;
      newHeight = 9.5;
      newAngle = 80;
      newType = 'pinned_lag';
    }

    onUpdateComponent({
      ...currentComp,
      toothPitchMm: newPitch,
      toothHeightMm: newHeight,
      toothAngleDeg: newAngle,
      cardClothingType: newType,
    });
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 select-none">
      <div className="bg-slate-900 border border-slate-700/80 rounded-2xl w-full max-w-3xl overflow-hidden shadow-2xl flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/70">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-sky-950 border border-sky-800/80 text-sky-400">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-100 flex items-center gap-2">
                {t.cardClothingTitle}
              </h2>
              <p className="text-xs text-slate-400">
                {t.cardClothingSubtitle}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-5">
          {/* Chọn trục xem đồ kim */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300">
              {language === 'vi' ? 'Chọn chi tiết trục để xem và hiệu chỉnh bề mặt kim:' : 'Select roller to view and calibrate card clothing surface:'}
            </label>
            <div className="flex flex-wrap gap-2">
              {components.map((c) => (
                <button
                  key={c.id}
                  onClick={() => setActiveId(c.id)}
                  className={`px-3 py-1.5 rounded-lg border text-xs font-medium transition-all cursor-pointer ${
                    c.id === activeId
                      ? 'bg-sky-600 border-sky-400 text-white font-bold shadow-md shadow-sky-950'
                      : 'bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700'
                  }`}
                >
                  {getLocalizedComponentName(c.name, language)} (Ø{c.diameter}mm)
                </button>
              ))}
            </div>
          </div>

          {/* Visual Showcase: Ảnh thực tế & Bản vẽ vi mô Profile */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-lg border border-slate-800">
                <button
                  type="button"
                  onClick={() => setVisualMode('real_photo')}
                  className={`flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-semibold transition-all cursor-pointer ${
                    visualMode === 'real_photo'
                      ? 'bg-sky-600 text-white shadow-sm'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <Camera className="w-3.5 h-3.5" />
                  <span>{t.realMacroPhotoTab}</span>
                </button>
                <button
                  type="button"
                  onClick={() => setVisualMode('diagram')}
                  className={`flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-semibold transition-all cursor-pointer ${
                    visualMode === 'diagram'
                      ? 'bg-sky-600 text-white shadow-sm'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <ZoomIn className="w-3.5 h-3.5" />
                  <span>{t.diagram2DTab} (15x)</span>
                </button>
              </div>

              <span className="font-mono text-[11px] text-slate-400">
                {language === 'vi' ? 'Góc cào:' : 'Rake Angle:'} <strong className="text-sky-300">{angleDeg}°</strong> | {language === 'vi' ? 'Bước p:' : 'Pitch p:'} <strong className="text-emerald-300">{pitchMm}mm</strong> | {language === 'vi' ? 'Cao:' : 'Height:'} <strong className="text-amber-300">{heightMm}mm</strong>
              </span>
            </div>

            <div className="rounded-xl border border-slate-700 overflow-hidden bg-slate-950 p-1 shadow-inner relative">
              {visualMode === 'real_photo' ? (
                <div className="relative group overflow-hidden rounded-lg">
                  <img
                    src={cardClothingMacroImg}
                    alt="Metallic Card Clothing Wire"
                    className="w-full h-72 object-cover object-center rounded-lg"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/20 to-transparent flex flex-col justify-end p-4 pointer-events-none">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded bg-sky-600/90 text-white font-mono text-[10px] font-bold uppercase tracking-wider">
                        {language === 'vi' ? 'Trống Xé Công Nghiệp' : 'Main Cylinder Drum'}
                      </span>
                      <span className="text-slate-300 text-xs font-mono">
                        {language === 'vi' ? 'Dải thép dập răng cưa quấn xoắn ốc' : 'Helical Sawtooth Wire Winding'}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-300 mt-1 max-w-xl">
                      {language === 'vi'
                        ? 'Cận cảnh các vòng dải kim thép tôi cứng quấn sát nhau quanh thân tang trống. Răng kim nghiêng góc trước 70° cào xé nát xơ vải vụn và bông khi trống quay 700 - 950 RPM.'
                        : 'Macro view of hardened steel wire interlocking bands tightly wrapped around the cylinder body. Rake angle of 70° provides aggressive fiber opening at 700 - 950 RPM.'}
                    </p>
                  </div>
                </div>
              ) : (
                <canvas
                  ref={canvasRef}
                  width={700}
                  height={330}
                  className="w-full h-auto block rounded-lg"
                />
              )}
            </div>
          </div>

          {/* Preset công nghệ xé vải */}
          <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-xs text-slate-200 flex items-center gap-1.5">
                <Layers className="w-4 h-4 text-sky-400" /> {t.standardCatalogTitle}
              </span>
              <span className="text-[10px] text-slate-400 font-mono">Graf / Trützschler Standard</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              <button
                onClick={() => handleApplyPreset('coarse_denim')}
                className="p-2.5 rounded-lg border border-slate-800 hover:border-sky-500 bg-slate-900 text-left transition-all hover:bg-slate-850 cursor-pointer"
              >
                <div className="font-bold text-xs text-slate-200">{language === 'vi' ? 'Xé Vải Bò (Denim)' : 'Coarse Denim'}</div>
                <div className="text-[10px] text-slate-400 mt-0.5">{language === 'vi' ? 'Răng thưa cao, lực cào mạnh' : 'High teeth, aggressive bite'}</div>
                <div className="text-[10px] font-mono text-sky-400 mt-1">p: 4.2mm · H: 5.2mm · 72°</div>
              </button>

              <button
                onClick={() => handleApplyPreset('medium_knit')}
                className="p-2.5 rounded-lg border border-slate-800 hover:border-sky-500 bg-slate-900 text-left transition-all hover:bg-slate-850 cursor-pointer"
              >
                <div className="font-bold text-xs text-slate-200">{language === 'vi' ? 'Xé Vải Thun (Knit)' : 'Knit / Cotton Rags'}</div>
                <div className="text-[10px] text-slate-400 mt-0.5">{language === 'vi' ? 'Răng trung bình, giữ xơ dài' : 'Medium pitch, fiber preservation'}</div>
                <div className="text-[10px] font-mono text-emerald-400 mt-1">p: 3.0mm · H: 4.5mm · 68°</div>
              </button>

              <button
                onClick={() => handleApplyPreset('fine_carding')}
                className="p-2.5 rounded-lg border border-slate-800 hover:border-sky-500 bg-slate-900 text-left transition-all hover:bg-slate-850 cursor-pointer"
              >
                <div className="font-bold text-xs text-slate-200">{language === 'vi' ? 'Chải Tơi Mịn (Fine)' : 'Fine Carding'}</div>
                <div className="text-[10px] text-slate-400 mt-0.5">{language === 'vi' ? 'Kim nhuyễn, đánh tơi cụm bông' : 'Fine teeth, maximum lofting'}</div>
                <div className="text-[10px] font-mono text-amber-400 mt-1">p: 2.2mm · H: 3.8mm · 65°</div>
              </button>

              <button
                onClick={() => handleApplyPreset('pinned_lag')}
                className="p-2.5 rounded-lg border border-slate-800 hover:border-sky-500 bg-slate-900 text-left transition-all hover:bg-slate-850 cursor-pointer"
              >
                <div className="font-bold text-xs text-slate-200">{language === 'vi' ? 'Bản Đinh Nhọn (Lags)' : 'Pinned Wooden Lags'}</div>
                <div className="text-[10px] text-slate-400 mt-0.5">{language === 'vi' ? 'Đinh thép nhọn xé thô ban đầu' : 'Heavy pins for primary rag tearing'}</div>
                <div className="text-[10px] font-mono text-rose-400 mt-1">p: 8.0mm · H: 9.5mm · 80°</div>
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-slate-800 bg-slate-950/90 flex items-center justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-sky-600 hover:bg-sky-500 text-white font-semibold rounded-lg text-xs transition-colors shadow-md cursor-pointer"
          >
            {language === 'vi' ? 'Đóng & Quay Lại Mô Phỏng' : 'Close & Return to Simulation'}
          </button>
        </div>
      </div>
    </div>
  );
};
