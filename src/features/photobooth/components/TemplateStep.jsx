import { useRef, useState, useEffect, useCallback } from 'react';
import { LAYOUT_CONFIGS } from '../../../constants/photobooth';

export default function TemplateStep({
  template,
  setTemplate,
  getMaxPhotos,
  handleStartCapture,
  isCreatingSession,
  sessionStartError,
}) {
  const scrollContainerRef = useRef(null);
  const [canScrollUp, setCanScrollUp] = useState(false);
  const [canScrollDown, setCanScrollDown] = useState(true);

  const checkScroll = useCallback(() => {
    const el = scrollContainerRef.current;
    if (!el) return;
    const isAtTop = el.scrollTop <= 15;
    const isAtBottom = el.scrollTop + el.clientHeight >= el.scrollHeight - 15;
    setCanScrollUp(!isAtTop);
    setCanScrollDown(!isAtBottom);
  }, []);

  useEffect(() => {
    const el = scrollContainerRef.current;
    if (!el) return;
    checkScroll();
    el.addEventListener('scroll', checkScroll, { passive: true });
    window.addEventListener('resize', checkScroll);
    return () => {
      el.removeEventListener('scroll', checkScroll);
      window.removeEventListener('resize', checkScroll);
    };
  }, [checkScroll]);

  const handleScrollDown = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ top: 400, behavior: 'smooth' });
    }
  };

  const handleScrollUp = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ top: -400, behavior: 'smooth' });
    }
  };

  return (
    <div className="w-full max-w-6xl pt-2 md:pt-4 text-center flex flex-col items-center animate-fade-in">
      <h2 className="text-3xl md:text-4xl font-bold text-maroon mb-2 font-display">
        Pilih Templatemu ✨
      </h2>
      <p className="text-sm md:text-md text-[#7a7266] mb-3 max-w-md">
        Pilih gaya strip foto yang sesuai dengan vibe-mu hari ini! Info: 1 sesi = 3 menit.
      </p>

      {/* Relative wrapper for custom scroll container and fade masks */}
      <div className="relative w-full max-w-6xl my-2">
        {/* Soft top gradient fade mask when scrolled */}
        <div
          className={`pointer-events-none absolute top-0 left-0 right-0 h-6 bg-gradient-to-b from-cream via-cream/80 to-transparent z-10 transition-opacity duration-300 ${
            canScrollUp ? 'opacity-100' : 'opacity-0'
          }`}
        />

        {/* Scrollable layout cards container - 4 cards per row, vertical scroll */}
        <div
          ref={scrollContainerRef}
          className="w-full max-h-[520px] md:max-h-[540px] overflow-y-auto px-4 pt-3 pb-8 scroll-smooth select-none clean-scrollbar"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 md:gap-6">
            {Object.keys(LAYOUT_CONFIGS).map((key) => {
              const config = LAYOUT_CONFIGS[key];
              const isSelected = template === key;
              const maxPhotos = getMaxPhotos(key);

              return (
                <div
                  key={key}
                  onClick={() => !isCreatingSession && setTemplate(key)}
                  className={`w-full cursor-pointer rounded-3xl border-3 p-4 flex flex-col items-center justify-between transition-all duration-300 ease-out transform hover:-translate-y-2 hover:shadow-xl ${
                    isSelected
                      ? 'border-[#f43f5e] bg-pink-50/70 shadow-lg ring-4 ring-pink-500/20 scale-[1.01]'
                      : 'border-line bg-white hover:border-[#a79c8c] shadow-xs'
                  }`}
                >
                  {/* Miniature Image Preview */}
                  <div className="w-full bg-stone-100/80 rounded-2xl overflow-hidden border border-stone-200/60 shadow-inner flex items-center justify-center p-2.5 h-52 md:h-56 select-none">
                    <img
                      src={config.image}
                      alt={config.name}
                      className="max-h-full max-w-full object-contain rounded shadow-xs transition-transform duration-300 group-hover:scale-105"
                      loading="lazy"
                    />
                  </div>

                  <div className="mt-3.5 text-center w-full flex flex-col items-center">
                    <h3 className="font-bold text-sm md:text-base text-maroon font-display leading-tight">
                      {config.name}
                    </h3>
                    <p className="text-xs text-[#8a7f71] mt-1.5 leading-snug min-h-[38px] flex items-center justify-center">
                      {config.description}
                    </p>
                    <span
                      className={`inline-block mt-2.5 text-[10px] font-extrabold uppercase tracking-wider px-3 py-1 rounded-full transition-colors ${
                        isSelected
                          ? 'bg-[#f43f5e] text-white shadow-xs'
                          : 'bg-terracotta/10 text-terracotta'
                      }`}
                    >
                      {maxPhotos} Foto
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Soft bottom gradient fade mask */}
        <div
          className={`pointer-events-none absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-cream via-cream/80 to-transparent z-10 transition-opacity duration-300 ${
            canScrollDown ? 'opacity-100' : 'opacity-0'
          }`}
        />
      </div>

      {/* Floating smooth scroll helper pill indicator */}
      <div className="flex items-center justify-center gap-3 mb-5 min-h-[32px]">
        {canScrollUp && (
          <button
            type="button"
            onClick={handleScrollUp}
            className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-white/90 hover:bg-white text-xs font-bold text-maroon border border-line shadow-xs transition-all hover:scale-105 cursor-pointer"
          >
            <span>↑ Ke Atas</span>
          </button>
        )}
        {canScrollDown && (
          <button
            type="button"
            onClick={handleScrollDown}
            className="inline-flex items-center gap-1.5 px-4 py-1 rounded-full bg-white/90 hover:bg-white text-xs font-bold text-terracotta border border-terracotta/30 shadow-xs transition-all hover:scale-105 cursor-pointer animate-pulse"
          >
            <span>Scroll untuk template lainnya</span>
            <span className="font-mono text-sm">↓</span>
          </button>
        )}
      </div>

      {sessionStartError && (
        <p className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
          {sessionStartError}
        </p>
      )}

      <button
        onClick={handleStartCapture}
        disabled={isCreatingSession}
        className="rounded-pill bg-terracotta hover:bg-terracotta-dark px-12 py-4 text-lg font-bold tracking-wide text-white shadow-start transition-all disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer transform hover:scale-[1.02] active:scale-[0.98]"
      >
        {isCreatingSession ? 'Membuat Sesi Foto...' : 'Mulai Sesi Foto 🚀'}
      </button>
    </div>
  );
}
