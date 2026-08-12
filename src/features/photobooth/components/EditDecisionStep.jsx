export default function EditDecisionStep({
  compiledStrip,
  getMaxPhotos,
  template,
  setStep,
  STEPS,
}) {
  return (
    <div className="w-full max-w-4xl flex flex-col md:flex-row items-center justify-center gap-10 md:gap-14 animate-fade-in py-6">
      {/* Left: Beautiful live compiled preview of the photo strip */}
      <div className="flex-shrink-0 flex flex-col items-center gap-2.5">
        <span className="text-xs font-bold text-maroon/70 tracking-wider uppercase font-display select-none">
          Preview Strip Fotonu ✨
        </span>
        <div className="relative bg-white p-3.5 rounded-3xl shadow-xl hover:shadow-2xl border border-stone-200/60 transition-all duration-300 max-w-[240px] md:max-w-[260px]">
          {compiledStrip ? (
            <img
              src={compiledStrip}
              alt="Hasil Foto Strip"
              className="rounded-2xl w-full h-auto object-contain select-none"
            />
          ) : (
            <div className="w-48 h-96 bg-stone-100 animate-pulse rounded-2xl flex items-center justify-center text-xs text-stone-400 font-semibold">
              Menyusun preview...
            </div>
          )}
        </div>
      </div>

      {/* Right: The decision box */}
      <div className="w-full max-w-md text-center md:text-left flex flex-col items-center md:items-start">
        <div className="w-16 h-16 rounded-full bg-coral/20 flex items-center justify-center text-3xl mb-5 mx-auto md:mx-0 select-none">
          🤔
        </div>
        <h2 className="text-3xl font-bold text-maroon mb-2 font-display">
          Mau Edit Foto?
        </h2>
        <p className="text-sm text-[#7a7266] mb-8 text-center md:text-left leading-relaxed">
          Apakah kamu ingin mengulang (retake) salah satu foto, atau hasil di
          atas sudah pas?
        </p>

        <div className="flex flex-col gap-4 w-full">
          <button
            onClick={() => {
              setStep(STEPS.PREVIEW);
            }}
            className="rounded-2xl border-2 border-dashed border-terracotta bg-terracotta/5 hover:bg-terracotta/10 p-5 text-left transition-all cursor-pointer transform hover:scale-[1.01]"
          >
            <div className="font-bold text-terracotta text-lg flex items-center gap-2">
              <span>Ya, Retake Foto</span> 🔄
            </div>
            <p className="text-xs text-[#8a7f71] mt-1 leading-snug">
              Pilih dan ulangi salah satu dari {getMaxPhotos(template)} frame
              yang sudah diambil.
            </p>
          </button>

          <button
            onClick={() => setStep(STEPS.INPUT_DATA)}
            disabled={!compiledStrip}
            className="rounded-2xl border-2 border-line bg-white hover:border-[#a79c8c] p-5 text-left transition-all cursor-pointer transform hover:scale-[1.01] disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:border-line disabled:hover:scale-100"
          >
            <div className="font-bold text-maroon text-lg flex items-center gap-2">
              <span>Tidak, Lanjut Pengisian Data</span> ➡️
            </div>
            <p className="text-xs text-[#8a7f71] mt-1 leading-snug">
              Simpan hasil jepretan ini dan lanjut ke form pengiriman email.
            </p>
          </button>
        </div>
      </div>
    </div>
  );
}
