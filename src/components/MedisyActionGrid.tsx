import React from 'react';
import { 
  Stethoscope, 
  MessageSquare, 
  Droplets, 
  Apple,
  Lock 
} from 'lucide-react';
import type { ToiletSchedule } from './AdminScheduleControl';

interface MedisyActionGridProps {
  onSelectTab: (tab: 'tracker' | 'chat' | 'hydration' | 'food' | 'admin' | 'history') => void;
  isAdmin?: boolean;
  bathroomCount?: number;
  totalFluidMl?: number;
  latestPainLevel?: number;
  schedule?: ToiletSchedule;
  onQuickAddToilet?: () => void;
  onQuickAddWater?: () => void;
  onOpenRedFlags?: () => void;
}

export const MedisyActionGrid: React.FC<MedisyActionGridProps> = ({
  onSelectTab,
  isAdmin = false,
}) => {
  return (
    <div className="space-y-4 px-3 pt-2">
      {/* 2x2 Grid of Iconic Medisy Blue Action Tiles */}
      <div className="grid grid-cols-2 gap-3.5">
        {/* Tile 1: Catat Observasi BAB (Locked for Karin) */}
        <button
          type="button"
          onClick={() => onSelectTab('tracker')}
          className="medisy-tile rounded-[26px] p-4 sm:p-5 text-left text-white flex flex-col justify-between min-h-[150px] sm:min-h-[165px] relative overflow-hidden group shadow-md"
        >
          {!isAdmin && (
            <span className="absolute top-3 right-3 bg-black/25 backdrop-blur-xs px-2 py-0.5 rounded-full text-[10px] font-bold text-white flex items-center gap-1 border border-white/20 shadow-xs">
              <Lock size={10} strokeWidth={2.4} color="#FFFFFF" style={{ color: '#FFFFFF' }} />
              <span>Terkunci</span>
            </span>
          )}

          <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center shadow-md mb-2 shrink-0">
            <Stethoscope
              size={24}
              strokeWidth={2.4}
              color="#0077D7"
              className="text-[#0077D7]"
              style={{ color: '#0077D7', stroke: '#0077D7' }}
            />
          </div>

          <div>
            <h3 className="font-extrabold text-sm sm:text-base leading-tight text-white capitalize tracking-tight">
              catat observasi
            </h3>
            <p className="text-[11px] sm:text-xs text-white/85 mt-1 leading-snug line-clamp-2">
              pencatatan
            </p>
          </div>
        </button>

        {/* Tile 2: Live Chat (Unlocked for Karin) */}
        <button
          type="button"
          onClick={() => onSelectTab('chat')}
          className="medisy-tile rounded-[26px] p-4 sm:p-5 text-left text-white flex flex-col justify-between min-h-[150px] sm:min-h-[165px] relative overflow-hidden group shadow-md"
        >
          <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center shadow-md mb-2 relative shrink-0">
            <MessageSquare
              size={24}
              strokeWidth={2.4}
              color="#0077D7"
              className="text-[#0077D7]"
              style={{ color: '#0077D7', stroke: '#0077D7' }}
            />
            <span className="w-3 h-3 rounded-full bg-emerald-500 absolute top-0.5 right-0.5 border-2 border-white" />
          </div>

          <div>
            <h3 className="font-extrabold text-sm sm:text-base leading-tight text-white capitalize tracking-tight">
              chat
            </h3>
            <p className="text-[11px] sm:text-xs text-white/85 mt-1 leading-snug line-clamp-2">
              hubungi langsung
            </p>
          </div>
        </button>

        {/* Tile 3: Target Hidrasi (Locked for Karin) */}
        <button
          type="button"
          onClick={() => onSelectTab('hydration')}
          className="medisy-tile rounded-[26px] p-4 sm:p-5 text-left text-white flex flex-col justify-between min-h-[150px] sm:min-h-[165px] relative overflow-hidden group shadow-md"
        >
          {!isAdmin && (
            <span className="absolute top-3 right-3 bg-black/25 backdrop-blur-xs px-2 py-0.5 rounded-full text-[10px] font-bold text-white flex items-center gap-1 border border-white/20 shadow-xs">
              <Lock size={10} strokeWidth={2.4} color="#FFFFFF" style={{ color: '#FFFFFF' }} />
              <span>Terkunci</span>
            </span>
          )}

          <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center shadow-md mb-2 shrink-0">
            <Droplets
              size={24}
              strokeWidth={2.4}
              color="#0077D7"
              className="text-[#0077D7]"
              style={{ color: '#0077D7', stroke: '#0077D7' }}
            />
          </div>

          <div>
            <h3 className="font-extrabold text-sm sm:text-base leading-tight text-white capitalize tracking-tight">
              target hidrasi
            </h3>
            <p className="text-[11px] sm:text-xs text-white/85 mt-1 leading-snug line-clamp-2">
              pantau gelas air
            </p>
          </div>
        </button>

        {/* Tile 4: Diet Nutrisi (Locked for Karin) */}
        <button
          type="button"
          onClick={() => onSelectTab('food')}
          className="medisy-tile rounded-[26px] p-4 sm:p-5 text-left text-white flex flex-col justify-between min-h-[150px] sm:min-h-[165px] relative overflow-hidden group shadow-md"
        >
          {!isAdmin && (
            <span className="absolute top-3 right-3 bg-black/25 backdrop-blur-xs px-2 py-0.5 rounded-full text-[10px] font-bold text-white flex items-center gap-1 border border-white/20 shadow-xs">
              <Lock size={10} strokeWidth={2.4} color="#FFFFFF" style={{ color: '#FFFFFF' }} />
              <span>Terkunci</span>
            </span>
          )}

          <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center shadow-md mb-2 shrink-0">
            <Apple
              size={24}
              strokeWidth={2.4}
              color="#0077D7"
              className="text-[#0077D7]"
              style={{ color: '#0077D7', stroke: '#0077D7' }}
            />
          </div>

          <div>
            <h3 className="font-extrabold text-sm sm:text-base leading-tight text-white capitalize tracking-tight">
              diet nutrisi
            </h3>
            <p className="text-[11px] sm:text-xs text-white/85 mt-1 leading-snug line-clamp-2">
              panduan makanan
            </p>
          </div>
        </button>
      </div>
    </div>
  );
};