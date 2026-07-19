import { FILTERS } from '../../../constants/photobooth';

export default function FilterModal({
  activeFilter,
  setActiveFilter,
  setIsFilterModalOpen,
}) {
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

        <h3 className="text-2xl font-bold text-[#ec4899] font-display text-center mb-6">
          Choose a Filter
        </h3>

        {/* Filter grid scrollable */}
        <div className="grid grid-cols-4 gap-x-3 gap-y-5 overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-stone-200">
          {FILTERS.map((f) => {
            const isActive = activeFilter === f.id;
            return (
              <button
                key={f.id}
                onClick={() => {
                  setActiveFilter(f.id);
                  setIsFilterModalOpen(false);
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
      </div>
    </div>
  );
}
