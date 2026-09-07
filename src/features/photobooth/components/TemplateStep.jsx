import { LAYOUT_CONFIGS } from '../../../constants/photobooth';

export default function TemplateStep({
  template,
  setTemplate,
  getMaxPhotos,
  handleStartCapture,
  isCreatingSession,
  sessionStartError,
}) {
  return (
    <div className="w-full max-w-5xl pt-4 md:pt-6 text-center flex flex-col items-center animate-fade-in">
      <h2 className="text-3xl md:text-4xl font-bold text-maroon mb-2 font-display">
        Pilih Templatemu ✨
      </h2>
      <p className="text-md text-[#7a7266] mb-8 max-w-md">
        Pilih gaya strip foto yang sesuai dengan vibe-mu hari ini! Info: 1
        sesi = 3 menit.
      </p>

      {/* Scrollable layout cards container */}
      <div className="flex w-full max-w-5xl gap-6 mt-5 mb-10 overflow-x-auto px-6 pt-5 pb-6 md:mt-6 md:px-8 md:pt-6 scroll-smooth justify-start select-none">
        {Object.keys(LAYOUT_CONFIGS).map((key) => {
          const config = LAYOUT_CONFIGS[key];
          const isSelected = template === key;
          const maxPhotos = getMaxPhotos(key);

          return (
            <div
              key={key}
              onClick={() => !isCreatingSession && setTemplate(key)}
              className={`w-[260px] shrink-0 cursor-pointer rounded-3xl border-3 p-5 flex flex-col items-center justify-between transition-all transform hover:scale-[1.03] ${
                isSelected
                  ? 'border-[#f43f5e] bg-pink-50/50 shadow-lg scale-[1.02]'
                  : 'border-line bg-white hover:border-[#a79c8c]'
              }`}
            >
              {/* Miniature Image Preview */}
              <div className="w-full bg-stone-100 rounded-2xl overflow-hidden border border-stone-200/60 shadow-inner flex items-center justify-center p-2.5 h-64 select-none">
                <img
                  src={config.image}
                  alt={config.name}
                  className="max-h-full max-w-full object-contain rounded shadow-xs"
                  loading="lazy" 
                />
              </div>

              <div className="mt-4 text-center">
                <h3 className="font-bold text-md text-maroon font-display leading-tight">
                  {config.name}
                </h3>
                <p className="text-xs text-[#8a7f71] mt-1.5 leading-snug min-h-[48px] flex items-center justify-center">
                  {config.description}
                </p>
                <span className="inline-block mt-3 text-[10px] font-extrabold uppercase tracking-wider bg-terracotta/10 text-terracotta px-2.5 py-1 rounded-full">
                  {maxPhotos} Foto
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {sessionStartError && (
        <p className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
          {sessionStartError}
        </p>
      )}

      <button
        onClick={handleStartCapture}
        disabled={isCreatingSession}
        className="rounded-pill bg-terracotta hover:bg-terracotta-dark px-12 py-4.5 text-lg font-bold tracking-wide text-white shadow-start transition-all disabled:cursor-not-allowed disabled:opacity-50"
      >
        {isCreatingSession ? 'Membuat Sesi Foto...' : 'Mulai Sesi Foto 🚀'}
      </button>
    </div>
  );
}
