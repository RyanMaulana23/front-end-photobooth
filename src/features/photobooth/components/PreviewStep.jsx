export default function PreviewStep({
  photos,
  template,
  getMaxPhotos,
  getSlotAspectClass,
  handleRetakeSelect,
  setStep,
  STEPS,
}) {
  const max = getMaxPhotos(template);

  return (
    <div className="w-full max-w-5xl text-center flex flex-col items-center animate-fade-in">
      <h2 className="text-3xl font-bold text-maroon mb-2 font-display">
        Review Hasil Foto 🎞️
      </h2>
      <p className="text-sm text-[#7a7266] mb-8">
        Lihat semua frame fotomu sebelum kita lanjut ke proses pengiriman.
      </p>

      <div
        className={`grid gap-6 w-full mb-8 justify-center ${
          max === 2
            ? 'grid-cols-1 sm:grid-cols-2 max-w-xl'
            : max === 3
              ? 'grid-cols-1 sm:grid-cols-3 max-w-3xl'
              : 'grid-cols-2 md:grid-cols-4 max-w-4xl'
        }`}
      >
        {photos.slice(0, max).map((src, idx) => (
          <div key={idx} className="flex flex-col items-center gap-3">
            <div className="relative group overflow-hidden rounded-2xl border-4 border-white shadow-md hover:shadow-lg transition-all">
              {src ? (
                <img
                  src={src}
                  alt={`captured ${idx}`}
                  className={getSlotAspectClass(template)}
                />
              ) : (
                <div
                  className={`bg-slate-200 flex items-center justify-center text-slate-400 font-semibold ${getSlotAspectClass(template)}`}
                >
                  Empty
                </div>
              )}
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                <button
                  onClick={() => handleRetakeSelect(idx)}
                  className="bg-white hover:bg-slate-100 text-maroon px-4 py-2 rounded-full font-bold text-xs shadow-md transition-all transform translate-y-2 group-hover:translate-y-0"
                >
                  Ulangi Foto #{idx + 1} 🔄
                </button>
              </div>
            </div>
            <div className="flex justify-between items-center w-full px-2">
              <span className="text-xs font-semibold text-[#8a7f71]">
                Foto #{idx + 1}
              </span>
              <button
                onClick={() => handleRetakeSelect(idx)}
                className="text-xs font-bold text-terracotta hover:underline"
              >
                Retake
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <button
          onClick={() => setStep(STEPS.EDIT_DECISION)}
          className="rounded-pill bg-terracotta hover:bg-terracotta-dark px-12 py-4 text-md font-bold text-white shadow-md transition-all"
        >
          Lanjutkan 🚀
        </button>
        <button
          onClick={() => setStep(STEPS.TEMPLATE)}
          className="rounded-pill border-2 border-maroon text-maroon hover:bg-[#e9e0d2] px-8 py-3.5 text-md font-bold transition-all"
        >
          Ganti Template
        </button>
      </div>
    </div>
  );
}
