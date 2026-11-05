import React, { useState, useMemo } from 'react';
import { 
  Search, 
  Check, 
  X, 
  ChevronDown, 
  ChevronUp, 
  Apple 
} from 'lucide-react';
import { FOOD_DATABASE } from '../data/foodDatabase';

export const FoodChecker: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [safetyFilter, setSafetyFilter] = useState<'all' | 'safe' | 'avoid'>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const categories = [
    { label: 'Semua Kategori Nutrisi', value: 'all' },
    { label: 'Diet BRAT (Protokol Utama)', value: 'BRAT' },
    { label: 'Larutan & Minuman', value: 'Minuman' },
    { label: 'Karbohidrat / Makanan Pokok', value: 'Makanan Pokok' },
    { label: 'Sumber Protein Halus', value: 'Protein' },
    { label: 'Sayuran & Buah Rendah Serat', value: 'Sayur & Buah' },
    { label: 'Camilan & Bumbu Restriksi', value: 'Camilan & Bumbu' },
  ];

  const filteredFoods = useMemo(() => {
    return FOOD_DATABASE.filter((food) => {
      if (safetyFilter === 'safe' && !food.isSafe) return false;
      if (safetyFilter === 'avoid' && food.isSafe) return false;
      if (selectedCategory !== 'all' && food.category !== selectedCategory) return false;

      if (searchQuery.trim() !== '') {
        const query = searchQuery.toLowerCase();
        const matchesName = food.name.toLowerCase().includes(query);
        const matchesDesc = food.shortReason.toLowerCase().includes(query);
        const matchesBadge = food.badge.toLowerCase().includes(query);
        return matchesName || matchesDesc || matchesBadge;
      }

      return true;
    });
  }, [searchQuery, safetyFilter, selectedCategory]);

  const toggleExpand = (id: string) => {
    setExpandedId((prev) => (prev === id ? null : id));
  };

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-5 shadow-sm space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3.5 border-b border-slate-100">
        <div>
          <span className="text-[10px] font-bold text-[#0077D7] uppercase tracking-wider block">
            Pedoman Dietetik Klinis
          </span>
          <h2 className="text-sm sm:text-base font-bold text-slate-900 tracking-tight flex items-center gap-1.5 mt-0.5">
            <Apple size={18} strokeWidth={2.4} color="#0077D7" style={{ color: '#0077D7' }} />
            <span>Indikasi & Kontraindikasi Makanan</span>
          </h2>
        </div>

        <div className="text-[10px] sm:text-xs font-bold text-[#0077D7] bg-blue-50 border border-blue-200 px-2.5 py-1 rounded-lg self-start sm:self-auto">
          Protokol BRAT: Pisang • Nasi/Bubur • Saus Apel • Roti
        </div>
      </div>

      {/* Search Input */}
      <div className="relative">
        <Search size={16} strokeWidth={2.2} color="#94A3B8" className="absolute left-3.5 top-3 pointer-events-none" style={{ color: '#94A3B8' }} />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Cari makanan (misal: pisang, bubur, kopi, santan, pedas, susu)..."
          className="w-full bg-slate-50 border border-slate-200 focus:border-[#0077D7] pl-10 pr-9 py-2.5 rounded-xl text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-none transition-colors"
        />
        {searchQuery && (
          <button
            type="button"
            onClick={() => setSearchQuery('')}
            className="absolute right-3 top-2.5 text-xs text-slate-400 hover:text-slate-600 font-bold"
          >
            Hapus
          </button>
        )}
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5">
        <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-xl">
          <button
            type="button"
            onClick={() => setSafetyFilter('all')}
            className={`flex-1 sm:flex-none px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
              safetyFilter === 'all'
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Semua ({FOOD_DATABASE.length})
          </button>

          <button
            type="button"
            onClick={() => setSafetyFilter('safe')}
            className={`flex-1 sm:flex-none px-3 py-1.5 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-colors ${
              safetyFilter === 'safe'
                ? 'bg-white text-emerald-800 shadow-sm border border-emerald-200'
                : 'text-slate-600 hover:text-emerald-700'
            }`}
          >
            <Check size={14} strokeWidth={2.6} color="#059669" style={{ color: '#059669' }} />
            <span>Indikasi (Aman)</span>
          </button>

          <button
            type="button"
            onClick={() => setSafetyFilter('avoid')}
            className={`flex-1 sm:flex-none px-3 py-1.5 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-colors ${
              safetyFilter === 'avoid'
                ? 'bg-white text-rose-800 shadow-sm border border-rose-200'
                : 'text-slate-600 hover:text-rose-700'
            }`}
          >
            <X size={14} strokeWidth={2.6} color="#DC2626" style={{ color: '#DC2626' }} />
            <span>Kontraindikasi</span>
          </button>
        </div>

        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="bg-slate-50 text-xs font-semibold text-slate-700 border border-slate-200 rounded-xl px-2.5 py-1.5 focus:outline-none focus:border-[#0077D7]"
        >
          {categories.map((cat) => (
            <option key={cat.value} value={cat.value}>
              {cat.label}
            </option>
          ))}
        </select>
      </div>

      {/* Grid of Clean Food Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5 pt-1">
        {filteredFoods.length === 0 ? (
          <div className="col-span-full py-10 text-center bg-slate-50 rounded-xl border border-slate-200">
            <p className="text-xs text-slate-500">
              Tidak ada data nutrisi untuk "{searchQuery}".
            </p>
            <button
              type="button"
              onClick={() => {
                setSearchQuery('');
                setSafetyFilter('all');
                setSelectedCategory('all');
              }}
              className="mt-2 text-xs text-[#0077D7] font-bold underline"
            >
              Reset filter
            </button>
          </div>
        ) : (
          filteredFoods.map((item) => {
            const isExpanded = expandedId === item.id;
            return (
              <div
                key={item.id}
                className="rounded-xl border border-slate-200 bg-white p-3.5 transition-all hover:border-slate-300 shadow-xs"
              >
                <div className="flex items-start justify-between gap-2.5">
                  <div className="flex items-start gap-2">
                    <div
                      className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 mt-0.5 shadow-xs ${
                        item.isSafe
                          ? 'bg-emerald-100 border border-emerald-200'
                          : 'bg-rose-100 border border-rose-200'
                      }`}
                    >
                      {item.isSafe ? (
                        <Check size={16} strokeWidth={2.6} color="#059669" style={{ color: '#059669' }} />
                      ) : (
                        <X size={16} strokeWidth={2.6} color="#DC2626" style={{ color: '#DC2626' }} />
                      )}
                    </div>

                    <div>
                      <h4 className="font-bold text-xs sm:text-sm text-slate-900">
                        {item.name}
                      </h4>
                      <span
                        className={`inline-block text-[9px] font-bold px-1.5 py-0.2 rounded mt-0.5 ${
                          item.isSafe
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : 'bg-rose-50 text-rose-700 border border-rose-200'
                        }`}
                      >
                        {item.badge}
                      </span>
                    </div>
                  </div>

                  <span className="text-[9px] font-medium text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded shrink-0">
                    {item.category}
                  </span>
                </div>

                <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                  {item.shortReason}
                </p>

                <button
                  type="button"
                  onClick={() => toggleExpand(item.id)}
                  className="mt-2 flex items-center gap-1 text-[11px] font-semibold text-[#0077D7] hover:text-[#005FB0] transition-colors"
                >
                  <span>{isExpanded ? 'Tutup Rincian' : 'Kajian Fisiologis'}</span>
                  {isExpanded ? (
                    <ChevronUp size={14} strokeWidth={2.2} color="#0077D7" style={{ color: '#0077D7' }} />
                  ) : (
                    <ChevronDown size={14} strokeWidth={2.2} color="#0077D7" style={{ color: '#0077D7' }} />
                  )}
                </button>

                {isExpanded && (
                  <div className="mt-2 pt-2 border-t border-slate-100 space-y-1.5 text-xs">
                    <p className="text-slate-700 leading-relaxed bg-slate-50 p-2.5 rounded-lg border border-slate-200">
                      <span className="text-slate-500 block text-[10px] uppercase font-bold mb-0.5">
                        Mekanisme Saluran Cerna:
                      </span>
                      {item.details}
                    </p>

                    {item.consumptionTips && (
                      <p className="text-slate-600 text-[11px] bg-slate-50/70 p-2 rounded-lg border border-slate-200">
                        💡 <strong>Anjuran Penyajian:</strong> {item.consumptionTips}
                      </p>
                    )}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};