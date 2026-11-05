import React from 'react';
import { Clock, Trash2, FileText } from 'lucide-react';
import { BRISTOL_SCALE_DATA } from '../data/bristolScale';
import type { StoolLogEntry } from '../types';

interface HistoryTimelineProps {
  logs: StoolLogEntry[];
  onDeleteLog: (id: string) => void;
  onClearLogs: () => void;
}

export const HistoryTimeline: React.FC<HistoryTimelineProps> = ({
  logs,
  onDeleteLog,
  onClearLogs,
}) => {
  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-5 shadow-sm space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between pb-3.5 border-b border-slate-100">
        <div>
          <span className="text-[10px] font-bold text-[#0077D7] uppercase tracking-wider block">
            Dokumentasi Observasi Karin
          </span>
          <h2 className="text-sm sm:text-base font-bold text-slate-900 tracking-tight flex items-center gap-1.5 mt-0.5">
            <FileText size={18} strokeWidth={2.4} color="#0077D7" style={{ color: '#0077D7' }} />
            <span>Rekam Medis Observasi ({logs.length} Entri)</span>
          </h2>
        </div>

        {logs.length > 0 && (
          <button
            type="button"
            onClick={onClearLogs}
            className="text-xs font-semibold text-rose-600 hover:text-rose-700 hover:bg-rose-50 px-2.5 py-1.5 rounded-lg border border-rose-200 transition-colors flex items-center gap-1.5"
          >
            <Trash2 size={14} strokeWidth={2.2} color="#E11D48" style={{ color: '#E11D48' }} />
            <span>Kosongkan</span>
          </button>
        )}
      </div>

      {/* Content */}
      {logs.length === 0 ? (
        <div className="py-12 text-center bg-slate-50 rounded-xl border border-slate-200">
          <Clock size={32} strokeWidth={1.8} color="#94A3B8" className="mx-auto mb-2 opacity-60" style={{ color: '#94A3B8' }} />
          <h4 className="font-bold text-sm text-slate-700">Belum Ada Rekam Observasi Hari Ini</h4>
          <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
            Gunakan tab <strong>"Observasi BAB"</strong> untuk mencatat parameter buang air besar dan skala kram perut pertama.
          </p>
        </div>
      ) : (
        <div className="divide-y divide-slate-100">
          {logs.map((log) => {
            const itemInfo = BRISTOL_SCALE_DATA.find((b) => b.type === log.type);
            const isLogDiarrhea = log.type >= 5;
            const logTime = new Date(log.timestamp).toLocaleTimeString('id-ID', {
              hour: '2-digit',
              minute: '2-digit',
            });

            return (
              <div
                key={log.id}
                className="py-3 flex items-center justify-between gap-3 hover:bg-slate-50/70 px-1 rounded-xl transition-colors"
              >
                <div className="flex items-center gap-2.5">
                  <span
                    className={`text-xs font-bold px-2 py-0.5 rounded shrink-0 ${
                      isLogDiarrhea
                        ? 'bg-rose-100 text-rose-800'
                        : 'bg-blue-50 text-[#0077D7] border border-blue-200'
                    }`}
                  >
                    Tipe {log.type}
                  </span>

                  <div>
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="font-bold text-xs sm:text-sm text-slate-900">
                        {itemInfo?.badgeLabel || `Tipe ${log.type}`}
                      </span>
                      <span className="text-[11px] font-medium text-slate-500">
                        • Nyeri VAS: <strong className="text-slate-800">{log.painLevel}/10</strong>
                      </span>
                    </div>

                    {log.notes ? (
                      <p className="text-xs text-slate-600 italic mt-0.5">
                        "{log.notes}"
                      </p>
                    ) : (
                      <p className="text-[11px] text-slate-400 mt-0.5">
                        {itemInfo?.shortDesc}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <span className="text-xs font-mono text-slate-400 bg-slate-100 px-2 py-0.5 rounded">
                    {logTime}
                  </span>
                  <button
                    type="button"
                    onClick={() => onDeleteLog(log.id)}
                    className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg transition-colors"
                    title="Hapus entri ini"
                  >
                    <Trash2 size={14} strokeWidth={2.2} color="#94A3B8" style={{ color: '#94A3B8' }} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};