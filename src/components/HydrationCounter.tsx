import React, { useState } from 'react';
import { 
  Droplets, 
  Plus, 
  Minus, 
  HelpCircle,
  Activity,
  CheckCircle2
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface HydrationCounterProps {
  waterGlasses: number;
  oralitGlasses: number;
  onUpdateWater: (count: number) => void;
  onUpdateOralit: (count: number) => void;
}

export const HydrationCounter: React.FC<HydrationCounterProps> = ({
  waterGlasses,
  oralitGlasses,
  onUpdateWater,
  onUpdateOralit,
}) => {
  const [showOralitRecipe, setShowOralitRecipe] = useState(false);

  const waterMl = waterGlasses * 250;
  const oralitMl = oralitGlasses * 250;
  const totalMl = waterMl + oralitMl;
  const targetMl = 2500;
  const targetGlasses = 10;
  const percent = Math.min(Math.round((totalMl / targetMl) * 100), 100);

  const handleAddWater = () => {
    const next = waterGlasses + 1;
    onUpdateWater(next);
    if ((next + oralitGlasses) === targetGlasses) {
      triggerConfetti();
    }
  };

  const handleAddOralit = () => {
    const next = oralitGlasses + 1;
    onUpdateOralit(next);
    if ((waterGlasses + next) === targetGlasses) {
      triggerConfetti();
    }
  };

  const triggerConfetti = () => {
    confetti({
      particleCount: 40,
      spread: 60,
      origin: { y: 0.7 },
      colors: ['#0077D7', '#0284C7', '#10B981'],
    });
  };

  const getHydrationClinicalStatus = () => {
    if (percent < 35) {
      return {
        label: 'Defisit Cairan (Waspada)',
        badgeBg: 'bg-rose-50 text-rose-700 border-rose-200',
        clinicalAdvice: 'Minum 1–2 teguk per 10–15 menit untuk meminimalisasi stimulasi lambung.',
      };
    }
    if (percent < 75) {
      return {
        label: 'Rehidrasi Parsial (Cukup)',
        badgeBg: 'bg-amber-50 text-amber-800 border-amber-200',
        clinicalAdvice: 'Lanjutkan asupan cairan hangat dan berikan Oralit pasca-defekasi.',
      };
    }
    if (percent < 100) {
      return {
        label: 'Status Hidrasi Adekuat',
        badgeBg: 'bg-blue-50 text-[#0077D7] border-blue-200',
        clinicalAdvice: 'Keseimbangan cairan dan perfusi jaringan terjaga secara adekuat.',
      };
    }
    return {
      label: 'Target Terpenuhi (Optimal) 🎉',
      badgeBg: 'bg-emerald-100 text-emerald-800 border-emerald-300',
      clinicalAdvice: 'Target asupan cairan 2.500 ml terpenuhi secara sempurna.',
    };
  };

  const status = getHydrationClinicalStatus();

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-5 shadow-sm space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3.5 border-b border-slate-100">
        <div>
          <span className="text-[10px] font-bold text-[#0077D7] uppercase tracking-wider block">
            Protokol Terapi Rehidrasi Oral (ORT)
          </span>
          <h2 className="text-sm sm:text-base font-bold text-slate-900 tracking-tight flex items-center gap-1.5 mt-0.5">
            <Droplets size={18} strokeWidth={2.4} color="#0077D7" style={{ color: '#0077D7' }} />
            <span>Pemantauan Cairan & Elektrolit Karin</span>
          </h2>
        </div>

        <div className={`px-2.5 py-1 rounded-lg border text-xs font-bold self-start sm:self-auto ${status.badgeBg}`}>
          {status.label}
        </div>
      </div>

      {/* Clinical Progress Bar */}
      <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 space-y-1.5">
        <div className="flex items-center justify-between text-xs">
          <span className="text-slate-600 font-semibold flex items-center gap-1">
            <Activity size={16} strokeWidth={2.2} color="#0077D7" style={{ color: '#0077D7' }} />
            Total Cairan Masuk (Intake):
          </span>
          <div>
            <strong className="text-slate-900 text-sm">{totalMl} ml</strong>
            <span className="text-slate-400 font-normal"> / {targetMl} ml</span>
            <span className="text-[#0077D7] font-bold ml-2">({percent}%)</span>
          </div>
        </div>

        <div className="w-full h-3 bg-slate-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-[#0077D7] rounded-full transition-all duration-500"
            style={{ width: `${percent}%` }}
          />
        </div>

        <p className="text-[11px] text-slate-500 text-right">
          💡 Catatan Klinis: {status.clinicalAdvice}
        </p>
      </div>

      {/* 2 Symmetrical Counter Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {/* Air Mineral */}
        <div className="p-3.5 rounded-xl border border-slate-200 bg-white flex flex-col justify-between shadow-xs">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-bold text-sm text-slate-900">Air Mineral Hangat</h4>
              <p className="text-[11px] text-slate-500">1 Gelas = ±250 ml (Hidrasi Basal)</p>
            </div>
            <span className="text-xs font-mono font-bold text-slate-800 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
              {waterMl} ml
            </span>
          </div>

          <div className="mt-4 flex items-center justify-between pt-3 border-t border-slate-100">
            <span className="text-xs font-semibold text-slate-500">Jumlah Gelas:</span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => onUpdateWater(Math.max(0, waterGlasses - 1))}
                disabled={waterGlasses <= 0}
                className="w-8 h-8 rounded-lg bg-slate-100 hover:bg-slate-200 disabled:opacity-40 border border-slate-200 flex items-center justify-center text-slate-700 transition-colors shadow-xs"
                title="Kurang 1"
              >
                <Minus size={16} strokeWidth={2.4} color="#334155" style={{ color: '#334155' }} />
              </button>
              <span className="w-7 text-center font-bold text-base text-slate-900">
                {waterGlasses}
              </span>
              <button
                type="button"
                onClick={handleAddWater}
                className="w-8 h-8 rounded-lg bg-[#0077D7] hover:bg-[#005FB0] text-white flex items-center justify-center transition-colors shadow-xs"
                title="Tambah 1"
              >
                <Plus size={16} strokeWidth={2.4} color="#FFFFFF" style={{ color: '#FFFFFF' }} />
              </button>
            </div>
          </div>
        </div>

        {/* Oralit */}
        <div className="p-3.5 rounded-xl border border-blue-200 bg-blue-50/40 flex flex-col justify-between shadow-xs">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-1.5">
                <h4 className="font-bold text-sm text-slate-900">Larutan Oralit (Elektrolit)</h4>
                <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-amber-100 text-amber-800">
                  Wajib WHO
                </span>
              </div>
              <p className="text-[11px] text-slate-500">1 Gelas = ±250 ml (Cegah Dehidrasi)</p>
            </div>
            <span className="text-xs font-mono font-bold text-[#0077D7] bg-white px-2 py-0.5 rounded border border-blue-200">
              {oralitMl} ml
            </span>
          </div>

          <div className="mt-4 flex items-center justify-between pt-3 border-t border-blue-100">
            <span className="text-xs font-semibold text-slate-500">Jumlah Gelas:</span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => onUpdateOralit(Math.max(0, oralitGlasses - 1))}
                disabled={oralitGlasses <= 0}
                className="w-8 h-8 rounded-lg bg-white hover:bg-slate-100 disabled:opacity-40 border border-slate-200 flex items-center justify-center text-slate-700 transition-colors shadow-xs"
                title="Kurang 1"
              >
                <Minus size={16} strokeWidth={2.4} color="#334155" style={{ color: '#334155' }} />
              </button>
              <span className="w-7 text-center font-bold text-base text-slate-900">
                {oralitGlasses}
              </span>
              <button
                type="button"
                onClick={handleAddOralit}
                className="w-8 h-8 rounded-lg bg-[#0077D7] hover:bg-[#005FB0] text-white flex items-center justify-center transition-colors shadow-xs"
                title="Tambah 1"
              >
                <Plus size={16} strokeWidth={2.4} color="#FFFFFF" style={{ color: '#FFFFFF' }} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Oralit Homemade Recipe Accordion */}
      <div className="border border-slate-200 rounded-xl p-3 bg-slate-50">
        <button
          type="button"
          onClick={() => setShowOralitRecipe(!showOralitRecipe)}
          className="w-full flex items-center justify-between text-left text-xs font-bold text-[#0077D7] hover:text-[#005FB0]"
        >
          <div className="flex items-center gap-1.5">
            <HelpCircle size={16} strokeWidth={2.2} color="#0077D7" style={{ color: '#0077D7' }} />
            <span>Cara Bikin Oralit Mandiri di Rumah (Jika Sachet Habis)</span>
          </div>
          <span className="text-[11px] underline">
            {showOralitRecipe ? 'Tutup' : 'Lihat Resep'}
          </span>
        </button>

        {showOralitRecipe && (
          <div className="mt-2.5 pt-2 border-t border-slate-200 space-y-2 text-xs text-slate-700">
            <p className="font-semibold text-slate-900">
              Formulasi Standar Kemenkes / WHO (Gula Garam):
            </p>
            <ul className="list-disc pl-5 space-y-1 text-[11px] text-slate-600">
              <li><strong>200 ml Air Matang</strong> (hangat atau suhu ruang)</li>
              <li><strong>1/2 sendok teh Garam Dapur</strong> halus</li>
              <li><strong>2 sendok teh Gula Pasir</strong> murni</li>
              <li>Aduk hingga larut sempurna sebelum diminum bertahap.</li>
            </ul>
            <div className="flex items-center gap-1.5 text-[11px] text-emerald-800 bg-emerald-50 p-2 rounded-lg border border-emerald-200">
              <CheckCircle2 size={14} strokeWidth={2.4} color="#059669" style={{ color: '#059669' }} />
              <span>Dapat diganti dengan <strong>Air Kelapa Murni (tanpa gula)</strong> karena kaya elektrolit kalium alami.</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};