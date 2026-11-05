import React from 'react';
import { ArrowLeft, CheckCircle2 } from 'lucide-react';

interface MedisyDetailLayoutProps {
  title: string;
  subtitle: string;
  onBack: () => void;
  children: React.ReactNode;
}

export const MedisyDetailLayout: React.FC<MedisyDetailLayoutProps> = ({
  title,
  subtitle,
  onBack,
  children,
}) => {
  return (
    <div className="space-y-4">
      {/* Curved Royal Blue Header for Detail Page (Like right phone in photo) */}
      <div className="bg-medisy-header rounded-b-[36px] px-5 pt-[max(1.5rem,env(safe-area-inset-top,1.5rem))] pb-8 text-white shadow-md relative">
        {/* Subtle decorative background rings */}
        <div className="absolute top-2 right-2 w-28 h-28 rounded-full border border-white/20 pointer-events-none" />

        <div className="flex items-center gap-3 mb-2 relative z-10">
          <button
            type="button"
            onClick={onBack}
            className="w-9 h-9 rounded-full bg-white/20 hover:bg-white/30 backdrop-blur-md flex items-center justify-center text-white transition-colors active:scale-95 border border-white/30 shadow-xs"
            title="Kembali ke Beranda"
          >
            <ArrowLeft size={18} strokeWidth={2.5} color="#FFFFFF" style={{ color: '#FFFFFF' }} />
          </button>
          <div>
            <div className="flex items-center gap-1.5">
              <h2 className="text-lg sm:text-xl font-extrabold text-white tracking-tight">
                {title}
              </h2>
              <CheckCircle2 size={16} strokeWidth={2.5} color="#67E8F9" style={{ color: '#67E8F9' }} />
            </div>
            <p className="text-xs text-white/85">
              {subtitle}
            </p>
          </div>
        </div>
      </div>

      {/* Main Detail Content Area */}
      <div className="px-3 sm:px-4">
        {children}
      </div>
    </div>
  );
};