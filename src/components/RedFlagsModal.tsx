import React from 'react';
import { X, AlertOctagon, HeartPulse } from 'lucide-react';

interface RedFlagsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenWhatsApp: () => void;
}

export const RedFlagsModal: React.FC<RedFlagsModalProps> = ({
  isOpen,
  onClose,
  onOpenWhatsApp,
}) => {
  if (!isOpen) return null;

  const redFlags = [
    {
      title: 'Tanda Dehidrasi Berat (Kritis)',
      desc: 'Mata cekung, bibir sangat kering/pecah-pecah, turgor kulit kembali sangat lambat saat dicubit, sangat pusing/sempoyongan saat berdiri, atau tidak buang air kecil (anuria/oliguria > 6 jam).',
    },
    {
      title: 'Melena / Hematochezia (Feses Berdarah)',
      desc: 'Terdapat bercak darah segar merah atau feses berwarna hitam pekat lengket seperti aspal (indikasi perdarahan saluran cerna).',
    },
    {
      title: 'Demam Tinggi Sistemik (> 38.5°C)',
      desc: 'Disertai menggigil/meriang hebat yang mengindikasikan infeksi bakteri invasif (misal: Shigellosis / Salmonellosis).',
    },
    {
      title: 'Diare Berlangsung > 48 Jam (2 Hari)',
      desc: 'Frekuensi defekasi cair tidak berkurang meski telah menjalani protokol rehidrasi oral (ORT) dan diet BRAT.',
    },
    {
      title: 'Intoleransi Oral / Muntah Persisten',
      desc: 'Muntah berulang sehingga tidak mampu menoleransi cairan sama sekali selama > 4 jam (memerlukan rehidrasi intravena / infus di IGD).',
    },
    {
      title: 'Nyeri Akut Abdomen Menetap',
      desc: 'Kram perut hebat yang menusuk konstan dan tidak mereda setelah defekasi (waspada apendisitis akut atau peritonitis).',
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3.5 bg-slate-900/50 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white w-full max-w-lg rounded-2xl border border-rose-200 p-5 sm:p-6 shadow-xl relative max-h-[92vh] overflow-y-auto">
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
        >
          <X size={18} strokeWidth={2.4} color="#64748B" style={{ color: '#64748B' }} />
        </button>

        <div className="flex items-center gap-2.5 mb-3.5">
          <div className="w-9 h-9 rounded-xl bg-rose-100 text-rose-700 border border-rose-200 flex items-center justify-center shrink-0">
            <AlertOctagon size={20} strokeWidth={2.4} color="#E11D48" style={{ color: '#E11D48' }} />
          </div>
          <div>
            <span className="text-[10px] font-bold text-rose-700 uppercase tracking-wider block">
              Triase Kegawatdaruratan Medis
            </span>
            <h3 className="font-bold text-sm sm:text-base text-slate-900">
              Red Flags: Kapan Harus Segera ke Faskes / IGD?
            </h3>
          </div>
        </div>

        <p className="text-xs text-slate-600 leading-relaxed mb-4">
          Jika pasien mengalami salah satu tanda klinis di bawah ini, <strong>segera hentikan rawat mandiri di rumah</strong> dan bawa ke Klinik Dokter / Instalasi Gawat Darurat (IGD) terdekat:
        </p>

        <div className="space-y-2.5 mb-5">
          {redFlags.map((flag, idx) => (
            <div
              key={idx}
              className="p-3 rounded-xl border border-rose-200 bg-rose-50/50 space-y-1"
            >
              <h4 className="text-xs font-bold text-rose-900 flex items-center gap-1.5">
                <span className="w-4 h-4 rounded-full bg-rose-200 text-rose-800 text-[10px] font-extrabold flex items-center justify-center shrink-0">
                  {idx + 1}
                </span>
                <span>{flag.title}</span>
              </h4>
              <p className="text-[11px] text-slate-700 leading-relaxed pl-5.5">
                {flag.desc}
              </p>
            </div>
          ))}
        </div>

        <div className="pt-2 flex flex-col sm:flex-row items-center gap-2">
          <button
            type="button"
            onClick={() => {
              onClose();
              onOpenWhatsApp();
            }}
            className="w-full sm:flex-1 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 active:scale-98 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-colors shadow-md"
          >
            <HeartPulse size={16} strokeWidth={2.4} color="#FFFFFF" style={{ color: '#FFFFFF' }} />
            <span>Minta Bantuan Medis Segera</span>
          </button>

          <button
            type="button"
            onClick={onClose}
            className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-colors"
          >
            Mengerti & Tutup
          </button>
        </div>
      </div>
    </div>
  );
};