import React, { useState } from 'react';
import { 
  Send, 
  X, 
  Pill, 
  Soup, 
  HeartHandshake, 
  Hospital, 
  ExternalLink,
  Edit3,
  Activity
} from 'lucide-react';
import type { UserSettings } from '../types';

interface EmergencyWhatsAppModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: UserSettings;
  bathroomCount: number;
  latestPainLevel: number;
  latestBristolType: number;
}

export const EmergencyWhatsAppModal: React.FC<EmergencyWhatsAppModalProps> = ({
  isOpen,
  onClose,
  settings,
  bathroomCount,
  latestPainLevel,
  latestBristolType,
}) => {
  const [selectedPreset, setSelectedPreset] = useState<string>('oralit_obat');
  const [customText, setCustomText] = useState<string>('');
  const [isEditingCustom, setIsEditingCustom] = useState<boolean>(false);

  if (!isOpen) return null;

  const presets = [
    {
      id: 'oralit_obat',
      icon: Pill,
      label: '💊 Beli Oralit & Obat Diare',
      requestText: 'Boleh tolong beliin Oralit sachet, obat diare (Attapulgite / Norit / Diapet), sama air kelapa murni ya sayang? Badanku lemas butuh cairan elektrolit.',
    },
    {
      id: 'bubur_kelapa',
      icon: Soup,
      label: '🥣 Bawain Bubur Polos & Kelapa',
      requestText: 'Boleh tolong beliin / buatin bubur putih hangat polos sama air kelapa hijau tanpa gula? Perutku belum bisa nerima makanan berlemak atau pedas.',
    },
    {
      id: 'kompres_hangat',
      icon: HeartHandshake,
      label: '🩹 Minyak Kayu Putih & Kompres',
      requestText: 'Perutku kram melilit banget, boleh tolong bawain minyak kayu putih / freshcare sama kompres air hangat buat ditempel di perut?',
    },
    {
      id: 'klinik_dokter',
      icon: Hospital,
      label: '🏥 Temani ke Klinik / Dokter',
      requestText: 'Sayang, rasa melilitnya tajam dan aku lemas banget. Boleh tolong temani aku periksa ke klinik dokter terdekat ya?',
    },
  ];

  const currentPresetObj = presets.find((p) => p.id === selectedPreset);

  const symptomSummary = `📋 [Laporan Observasi]\n• Frekuensi BAB: ${bathroomCount} kali\n• Morfologi Feses: Bristol Tipe ${latestBristolType}\n• Skor Nyeri Perut: VAS ${latestPainLevel}/10`;

  const finalMessage = isEditingCustom && customText.trim()
    ? customText
    : `Halo ${settings.caregiverName || 'Ode'}\n\n${symptomSummary}\n\n${currentPresetObj?.requestText || ''}\n\nMakasih banyak ya! 🙏`;

  const handleOpenWhatsApp = () => {
    let cleanedNumber = (settings.waNumber || '').replace(/[^0-9]/g, '');
    if (cleanedNumber.startsWith('0')) {
      cleanedNumber = '62' + cleanedNumber.slice(1);
    }
    if (!cleanedNumber) {
      cleanedNumber = '6281234567890';
    }

    const waUrl = `https://wa.me/${cleanedNumber}?text=${encodeURIComponent(finalMessage)}`;
    window.open(waUrl, '_blank', 'noopener,noreferrer');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3.5 bg-slate-900/50 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white w-full max-w-lg rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-xl relative max-h-[92vh] overflow-y-auto">
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
        >
          <X size={18} strokeWidth={2.4} color="#64748B" style={{ color: '#64748B' }} />
        </button>

        <div className="flex items-center gap-2.5 mb-3.5">
          <div className="w-9 h-9 rounded-xl bg-[#0077D7] text-white flex items-center justify-center shrink-0 shadow-xs">
            <Activity size={18} strokeWidth={2.4} color="#FFFFFF" style={{ color: '#FFFFFF' }} />
          </div>
          <div>
            <span className="text-[10px] font-bold text-[#0077D7] uppercase tracking-wider block">
              Panggilan Darurat Pendamping
            </span>
            <h3 className="font-bold text-sm sm:text-base text-slate-900">
              Kirim Status Klinis via WhatsApp
            </h3>
          </div>
        </div>

        {/* Clinical Triage Summary Box */}
        <div className="p-3 rounded-xl bg-blue-50/60 border border-blue-200 mb-3.5 text-xs text-slate-700">
          <span className="font-bold text-[#0077D7] block mb-0.5 text-[11px]">
            Data Observasi yang Terlampir:
          </span>
          <p className="text-slate-600 text-[11px]">
            Frekuensi BAB: <strong className="text-slate-900">{bathroomCount} kali</strong> • Feses: <strong className="text-slate-900">Bristol Tipe {latestBristolType}</strong> • Nyeri: <strong className="text-slate-900">VAS {latestPainLevel}/10</strong>
          </p>
        </div>

        {/* Preset choices */}
        <div className="space-y-1.5 mb-3.5">
          <label className="text-[11px] font-bold text-slate-600 uppercase tracking-wide block">
            Pilih Kebutuhan Penanganan:
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {presets.map((preset) => {
              const Icon = preset.icon;
              const isSelected = selectedPreset === preset.id && !isEditingCustom;
              return (
                <button
                  type="button"
                  key={preset.id}
                  onClick={() => {
                    setSelectedPreset(preset.id);
                    setIsEditingCustom(false);
                  }}
                  className={`p-2.5 rounded-xl border text-left flex items-start gap-2 transition-all ${
                    isSelected
                      ? 'bg-[#0077D7] text-white border-[#0077D7] shadow-sm'
                      : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300 hover:bg-slate-50'
                  }`}
                >
                  <Icon
                    size={16}
                    strokeWidth={2.4}
                    color={isSelected ? '#FFFFFF' : '#0077D7'}
                    className="shrink-0 mt-0.5"
                    style={{ color: isSelected ? '#FFFFFF' : '#0077D7' }}
                  />
                  <span className="text-xs font-bold leading-snug">
                    {preset.label}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Preview Message */}
        <div className="space-y-1 mb-4">
          <div className="flex items-center justify-between">
            <label className="text-[11px] font-bold text-slate-600 uppercase tracking-wide">
              Pratinjau Pesan:
            </label>
            <button
              type="button"
              onClick={() => {
                if (!isEditingCustom) {
                  setCustomText(finalMessage);
                }
                setIsEditingCustom(!isEditingCustom);
              }}
              className="text-[11px] text-[#0077D7] hover:text-[#005FB0] font-bold underline flex items-center gap-1"
            >
              <Edit3 size={12} strokeWidth={2.2} color="#0077D7" style={{ color: '#0077D7' }} />
              <span>{isEditingCustom ? 'Pilih Preset' : 'Edit Teks'}</span>
            </button>
          </div>

          {isEditingCustom ? (
            <textarea
              rows={4}
              value={customText}
              onChange={(e) => setCustomText(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 text-xs text-slate-800 focus:outline-none focus:border-[#0077D7] font-sans leading-relaxed"
            />
          ) : (
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs text-slate-700 whitespace-pre-wrap font-sans leading-relaxed">
              {finalMessage}
            </div>
          )}
        </div>

        {/* Action Button */}
        <button
          type="button"
          onClick={handleOpenWhatsApp}
          className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:scale-98 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all shadow-md"
        >
          <Send size={16} strokeWidth={2.4} color="#FFFFFF" style={{ color: '#FFFFFF' }} />
          <span>Kirim Langsung ke WhatsApp Pendamping</span>
          <ExternalLink size={14} strokeWidth={2.2} color="#FFFFFF" style={{ color: '#FFFFFF' }} />
        </button>
      </div>
    </div>
  );
};