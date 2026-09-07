import { useEffect, useState } from 'react';
import { LAYOUT_CONFIGS } from '../../../constants/photobooth';
import { compilePhotoStrip } from '../utils/canvasHelper';

export default function TemplatePreviewPanel({
  template = 'layout1',
  capturedPhotos = [],
  activeSlotIndex = 0,
}) {
  const config = LAYOUT_CONFIGS[template] || LAYOUT_CONFIGS.layout1;
  const slots = config.slots || [];
  const totalSlots = slots.length;
  const filledCount = capturedPhotos.filter(Boolean).length;
  const [compiledUrl, setCompiledUrl] = useState(null);

  // Compile photo strip canvas when all photos are captured or changed
  useEffect(() => {
    let isMounted = true;

    if (filledCount === 0) return;

    compilePhotoStrip(template, capturedPhotos)
      .then((url) => {
        if (isMounted) {
          setCompiledUrl(url);
        }
      })
      .catch((err) => {
        console.warn('Failed to compile preview strip:', err);
      });

    return () => {
      isMounted = false;
    };
  }, [template, capturedPhotos, filledCount]);

  const activeCompiledUrl = filledCount > 0 ? compiledUrl : null;

  return (
    <div className="w-full lg:w-[320px] shrink-0 flex flex-col items-center animate-fade-in mt-6 lg:mt-0">
      {/* Top Header Card */}
      <div className="w-full bg-white/90 backdrop-blur-md border border-line rounded-2xl p-3.5 shadow-xs mb-4 text-center">
        <div className="flex items-center justify-between mb-1">
          <span className="text-[11px] font-extrabold uppercase tracking-wider text-[#8a7f71] font-mono">
            Preview Template
          </span>
          <span className="text-xs font-bold font-mono px-2.5 py-0.5 rounded-full bg-maroon/10 text-maroon border border-maroon/20">
            {filledCount}/{totalSlots} Terisi
          </span>
        </div>
        <h3 className="text-sm font-extrabold text-maroon font-display truncate">
          {config.name}
        </h3>
      </div>

      {/* Frame Container */}
      <div className="w-full max-w-[270px] lg:max-w-[290px] flex justify-center">
        <div
          className="relative w-full rounded-2xl overflow-hidden shadow-xl bg-white transition-all duration-300"
          style={{ aspectRatio: `${config.width} / ${config.height}` }}
        >
          {/* Layer 1: DOM Slots - Photos in the back (SEND TO BACK) */}
          {slots.map((slot, index) => {
            const leftPct = (slot.x / config.width) * 100;
            const topPct = (slot.y / config.height) * 100;
            const widthPct = (slot.w / config.width) * 100;
            const heightPct = (slot.h / config.height) * 100;
            const photoSrc = capturedPhotos[index];
            const isActive = index === activeSlotIndex && filledCount < totalSlots;
            const isFilled = Boolean(photoSrc);

            return (
              <div
                key={index}
                className="absolute transition-all duration-300 z-10"
                style={{
                  left: `${leftPct}%`,
                  top: `${topPct}%`,
                  width: `${widthPct}%`,
                  height: `${heightPct}%`,
                }}
              >
                {/* Captured Photo */}
                {isFilled ? (
                  <div className="relative w-full h-full group">
                    <img
                      src={photoSrc}
                      alt={`Slot ${index + 1}`}
                      className="w-full h-full object-cover rounded-xs"
                    />
                    <div className="absolute top-1 left-1 bg-emerald-600 text-white font-mono text-[9px] font-bold px-1.5 py-0.5 rounded shadow-xs z-30 flex items-center gap-0.5 pointer-events-none">
                      ✓ #{index + 1}
                    </div>
                  </div>
                ) : (
                  /* Placeholder when photo is not yet taken */
                  <div
                    className={`w-full h-full flex flex-col items-center justify-center transition-all duration-300 rounded-xs ${
                      isActive
                        ? 'bg-rose-500/20 border-2 border-dashed border-rose-400 animate-pulse shadow-md z-30'
                        : 'border border-dashed border-black/15 bg-stone-50'
                    }`}
                  >
                    {isActive ? (
                      <div className="flex flex-col items-center gap-0.5 text-rose-500">
                        <span className="text-sm animate-bounce">📸</span>
                        <span className="text-[9px] font-extrabold font-mono uppercase tracking-wider text-white bg-rose-600/90 px-1.5 py-0.5 rounded shadow-xs">
                          SLOT #{index + 1}
                        </span>
                      </div>
                    ) : (
                      <span className="text-[10px] font-bold font-mono text-[#8a7f71]/40">
                        #{index + 1}
                      </span>
                    )}
                  </div>
                )}

                {/* Active Indicator Pulse Ring */}
                {isActive && (
                  <div className="absolute -inset-1 border-2 border-rose-400 rounded-sm animate-ping opacity-75 pointer-events-none z-30" />
                )}
              </div>
            );
          })}

          {/* Layer 2: Full Template Frame Image - Front Overlay layer */}
          <img
            src={config.image}
            alt="Template Frame"
            className="absolute inset-0 w-full h-full object-cover pointer-events-none z-20 select-none"
          />

          {/* Layer 3: Final Compiled Strip Overlay (shows when all photos are taken) */}
          {activeCompiledUrl && filledCount === totalSlots && (
            <img
              src={activeCompiledUrl}
              alt="Compiled Frame Preview"
              className="absolute inset-0 w-full h-full object-cover pointer-events-none z-30 transition-opacity duration-200"
            />
          )}
        </div>
      </div>
    </div>
  );
}
