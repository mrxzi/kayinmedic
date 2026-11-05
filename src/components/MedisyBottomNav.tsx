import React from 'react';
import { Home, MessageSquare, ClipboardList, Droplets, Shield, FileText, Lock } from 'lucide-react';

interface MedisyBottomNavProps {
  activeTab: 'home' | 'tracker' | 'chat' | 'hydration' | 'food' | 'admin' | 'history';
  onSelectTab: (tab: 'home' | 'tracker' | 'chat' | 'hydration' | 'food' | 'admin' | 'history') => void;
  logsCount: number;
  isAdmin?: boolean;
}

export const MedisyBottomNav: React.FC<MedisyBottomNavProps> = ({
  activeTab,
  onSelectTab,
  logsCount,
  isAdmin = false,
}) => {
  return (
    <div className="fixed bottom-0 inset-x-0 z-40 max-w-md mx-auto px-4 pb-3 pt-1 pointer-events-none">
      <nav className="bg-white/95 backdrop-blur-md border border-slate-200/90 rounded-[28px] px-3 py-2 shadow-xl flex items-center justify-around pointer-events-auto">
        {/* Tab 1: Beranda */}
        <button
          type="button"
          onClick={() => onSelectTab('home')}
          className={`flex flex-col items-center gap-0.5 py-1 px-2.5 rounded-xl transition-all ${
            activeTab === 'home'
              ? 'text-[#0077D7] font-extrabold'
              : 'text-slate-500 hover:text-slate-800 font-medium'
          }`}
        >
          <Home
            size={22}
            strokeWidth={activeTab === 'home' ? 2.5 : 2}
            color={activeTab === 'home' ? '#0077D7' : '#64748B'}
            style={{ color: activeTab === 'home' ? '#0077D7' : '#64748B', stroke: activeTab === 'home' ? '#0077D7' : '#64748B' }}
          />
          <span className="text-[10px] tracking-tight">beranda</span>
        </button>

        {/* Tab 2: Konsultasi / Live Chat */}
        <button
          type="button"
          onClick={() => onSelectTab('chat')}
          className={`flex flex-col items-center gap-0.5 py-1 px-2.5 rounded-xl relative transition-all ${
            activeTab === 'chat'
              ? 'text-[#0077D7] font-extrabold'
              : 'text-slate-500 hover:text-slate-800 font-medium'
          }`}
        >
          <MessageSquare
            size={22}
            strokeWidth={activeTab === 'chat' ? 2.5 : 2}
            color={activeTab === 'chat' ? '#0077D7' : '#64748B'}
            style={{ color: activeTab === 'chat' ? '#0077D7' : '#64748B', stroke: activeTab === 'chat' ? '#0077D7' : '#64748B' }}
          />
          <span className="text-[10px] tracking-tight">chat</span>
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 absolute top-0.5 right-2 border-2 border-white" />
        </button>

        {/* Tab 3: Observasi (Catat BAB) */}
        <button
          type="button"
          onClick={() => onSelectTab('tracker')}
          className={`flex flex-col items-center gap-0.5 py-1 px-2.5 rounded-xl relative transition-all ${
            activeTab === 'tracker'
              ? 'text-[#0077D7] font-extrabold'
              : 'text-slate-500 hover:text-slate-800 font-medium'
          }`}
          title={!isAdmin ? 'Fitur dikunci • Khusus Ode' : 'Catat Observasi'}
        >
          <ClipboardList
            size={22}
            strokeWidth={activeTab === 'tracker' ? 2.5 : 2}
            color={activeTab === 'tracker' ? '#0077D7' : '#64748B'}
            style={{ color: activeTab === 'tracker' ? '#0077D7' : '#64748B', stroke: activeTab === 'tracker' ? '#0077D7' : '#64748B' }}
          />
          <span className="text-[10px] tracking-tight">observasi</span>
          {!isAdmin ? (
            <Lock size={9} strokeWidth={2.4} className="absolute top-1 right-2 text-slate-400" />
          ) : logsCount > 0 ? (
            <span className="absolute top-0.5 right-2 w-4 h-4 bg-[#0077D7] text-white text-[9px] font-bold rounded-full flex items-center justify-center shadow-xs">
              {logsCount}
            </span>
          ) : null}
        </button>

        {/* Tab 4: Hidrasi */}
        <button
          type="button"
          onClick={() => onSelectTab('hydration')}
          className={`flex flex-col items-center gap-0.5 py-1 px-2.5 rounded-xl relative transition-all ${
            activeTab === 'hydration'
              ? 'text-[#0077D7] font-extrabold'
              : 'text-slate-500 hover:text-slate-800 font-medium'
          }`}
          title={!isAdmin ? 'Fitur dikunci • Khusus Ode' : 'Target Hidrasi'}
        >
          <Droplets
            size={22}
            strokeWidth={activeTab === 'hydration' ? 2.5 : 2}
            color={activeTab === 'hydration' ? '#0077D7' : '#64748B'}
            style={{ color: activeTab === 'hydration' ? '#0077D7' : '#64748B', stroke: activeTab === 'hydration' ? '#0077D7' : '#64748B' }}
          />
          <span className="text-[10px] tracking-tight">hidrasi</span>
          {!isAdmin && (
            <Lock size={9} strokeWidth={2.4} className="absolute top-1 right-2 text-slate-400" />
          )}
        </button>

        {/* Tab 5: Riwayat (when patient) OR Admin (when logged in as admin) */}
        {isAdmin ? (
          <button
            type="button"
            onClick={() => onSelectTab('admin')}
            className={`flex flex-col items-center gap-0.5 py-1 px-2.5 rounded-xl transition-all ${
              activeTab === 'admin'
                ? 'text-[#0077D7] font-extrabold'
                : 'text-slate-500 hover:text-slate-800 font-medium'
            }`}
          >
            <Shield
              size={22}
              strokeWidth={activeTab === 'admin' ? 2.5 : 2}
              color={activeTab === 'admin' ? '#0077D7' : '#64748B'}
              style={{ color: activeTab === 'admin' ? '#0077D7' : '#64748B', stroke: activeTab === 'admin' ? '#0077D7' : '#64748B' }}
            />
            <span className="text-[10px] tracking-tight">admin</span>
          </button>
        ) : (
          <button
            type="button"
            onClick={() => onSelectTab('history')}
            className={`flex flex-col items-center gap-0.5 py-1 px-2.5 rounded-xl relative transition-all ${
              activeTab === 'history'
                ? 'text-[#0077D7] font-extrabold'
                : 'text-slate-500 hover:text-slate-800 font-medium'
            }`}
            title="Fitur dikunci • Khusus Ode"
          >
            <FileText
              size={22}
              strokeWidth={activeTab === 'history' ? 2.5 : 2}
              color={activeTab === 'history' ? '#0077D7' : '#64748B'}
              style={{ color: activeTab === 'history' ? '#0077D7' : '#64748B', stroke: activeTab === 'history' ? '#0077D7' : '#64748B' }}
            />
            <span className="text-[10px] tracking-tight">riwayat</span>
            <Lock size={9} strokeWidth={2.4} className="absolute top-1 right-2 text-slate-400" />
          </button>
        )}
      </nav>
    </div>
  );
};