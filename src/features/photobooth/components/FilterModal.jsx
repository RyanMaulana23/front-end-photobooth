import { useState } from 'react';
import { FILTERS, AR_FILTERS } from '../../../constants/photobooth';

export default function FilterModal({
  activeFilter,
  setActiveFilter,
  activeARFilter,
  setActiveARFilter,
  setIsFilterModalOpen,
}) {
  const [activeTab, setActiveTab] = useState('color'); // 'color' | 'ar'

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 animate-fade-in">
      <div className="bg-white rounded-3xl p-6 w-full max-w-[480px] shadow-2xl relative animate-scale-up flex flex-col max-h-[85vh]">
        {/* Close button */}
        <button
          onClick={() => setIsFilterModalOpen(false)}
          className="absolute top-4 right-4 w-8 h-8 rounded-full bg-pink-50 hover:bg-pink-100 flex items-center justify-center text-pink-500 font-extrabold transition-colors cursor-pointer"
        >
          ✕
        </button>

        <h3 className="text-2xl font-bold text-[#ec4899] font-display text-center mb-4">
          Choose a Filter
        </h3>

        {/* Tab Navigation (Color vs AR Filters) */}
        <div className="flex bg-stone-100 p-1 rounded-2xl mb-5">
          <button
            onClick={() => setActiveTab('color')}
            className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
              activeTab === 'color'
                ? 'bg-white text-maroon shadow-xs'
                : 'text-stone-500 hover:text-stone-800'
            }`}
          >
            <span>🎨 Color Filters</span>
          </button>
          <button
            onClick={() => setActiveTab('ar')}
            className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 relative ${
              activeTab === 'ar'
                ? 'bg-white text-pink-600 shadow-xs'
                : 'text-stone-500 hover:text-stone-800'
            }`}
          >
            <span>✨ AR Face Filters</span>
          </button>
        </div>

        {/* TAB 1: COLOR / IMAGE FILTERS */}
        {activeTab === 'color' && (
          <div className="grid grid-cols-4 gap-x-3 gap-y-5 overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-stone-200">
            {FILTERS.map((f) => {
              const isActive = activeFilter === f.id;
              return (
                <button
                  key={f.id}
                  onClick={() => {
                    setActiveFilter(f.id);
                  }}
                  className="flex flex-col items-center group cursor-pointer focus:outline-none"
                >
                  <div
                    className={`w-full aspect-square rounded-2xl overflow-hidden border-2 transition-all group-hover:scale-[1.04] ${
                      isActive
                        ? 'border-[#ec4899] ring-3 ring-pink-100 scale-[1.02]'
                        : 'border-stone-200'
                    }`}
                  >
                    {f.previewType === 'color' ? (
                      <div
                        style={{ background: f.previewBg }}
                        className="w-full h-full"
                      />
                    ) : (
                      <img
                        src="https://picsum.photos/id/1060/80/80"
                        style={{ filter: f.css }}
                        className="w-full h-full object-cover"
                        alt={f.label}
                        loading="lazy"
                      />
                    )}
                  </div>
                  <span
                    className={`text-[10px] font-bold text-center mt-1.5 tracking-wide leading-tight ${
                      isActive
                        ? 'text-[#ec4899] font-extrabold'
                        : 'text-[#5c5449]'
                    }`}
                  >
                    {f.label}
                  </span>
                </button>
              );
            })}
          </div>
        )}

        {/* TAB 2: AR FACE FILTERS */}
        {activeTab === 'ar' && (
          <div className="grid grid-cols-2 gap-3 overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-stone-200">
            {AR_FILTERS.map((ar) => {
              const isActive = (activeARFilter || 'none') === ar.id;
              return (
                <button
                  key={ar.id}
                  onClick={() => {
                    setActiveARFilter(ar.id);
                  }}
                  className={`flex flex-col items-start p-3 rounded-2xl border-2 text-left transition-all cursor-pointer relative ${
                    isActive
                      ? 'border-pink-500 bg-pink-50/50 ring-2 ring-pink-200 scale-[1.01]'
                      : 'border-stone-200 hover:border-pink-300 bg-stone-50/40'
                  }`}
                >
                  <div
                    style={{ background: ar.previewBg }}
                    className="w-10 h-10 rounded-xl flex items-center justify-center text-xl mb-2 shadow-xs"
                  >
                    {ar.icon}
                  </div>
                  <span
                    className={`text-xs font-bold ${
                      isActive ? 'text-pink-600' : 'text-maroon'
                    }`}
                  >
                    {ar.label}
                  </span>
                  <p className="text-[10px] text-stone-500 leading-snug mt-1">
                    {ar.description}
                  </p>
                </button>
              );
            })}
          </div>
        )}

        {/* Footer Done Button */}
        <button
          onClick={() => setIsFilterModalOpen(false)}
          className="mt-6 w-full py-3 bg-[#ec4899] hover:bg-pink-600 text-white font-bold rounded-2xl transition-colors shadow-md cursor-pointer text-sm"
        >
          Selesai (Pakai Filter) ✨
        </button>
      </div>
    </div>
  );
}
