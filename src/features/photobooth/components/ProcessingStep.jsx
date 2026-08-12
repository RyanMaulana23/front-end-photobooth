export default function ProcessingStep({ submissionState }) {
  const { step, progress, message } = submissionState;

  return (
    <div className="w-full max-w-md text-center flex flex-col items-center justify-center animate-fade-in py-16">
      <div className="w-24 h-24 relative mb-8">
        <div className="absolute inset-0 rounded-full border-4 border-[#e9e0d2] border-t-terracotta animate-spin" />
        <div className="absolute inset-3 bg-white rounded-full flex items-center justify-center text-3xl shadow-inner">
          ⚙️
        </div>
      </div>

      <h2 className="text-2xl font-bold text-maroon mb-2 font-display">
        Sedang Memproses Foto...
      </h2>
      <p className="text-sm text-[#7a7266] mb-6 max-w-xs">
        {message || 'Menyiapkan pengiriman foto.'}
      </p>

      <div className="w-full bg-line h-4 rounded-full overflow-hidden">
        <div
          className="h-full bg-terracotta transition-all duration-150 rounded-full"
          style={{ width: `${progress}%` }}
        />
      </div>
      <span className="text-xs font-semibold text-[#8a7f71] mt-2">
        Langkah {step} dari 6 — {progress}%
      </span>
    </div>
  );
}
