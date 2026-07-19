export default function EmailSuccessStep({
  formData,
  handleDownloadStrip,
  handlePrintTrigger,
  setStep,
  STEPS,
}) {
  return (
    <div className="w-full max-w-md text-center flex flex-col items-center justify-center animate-fade-in py-10">
      <div className="w-20 h-20 rounded-full bg-green-100 text-green-600 flex items-center justify-center text-4xl mb-6 shadow-md border-2 border-green-200">
        ✓
      </div>

      <h2 className="text-3xl font-bold text-maroon mb-2 font-display">
        Sukses Terkirim! 📬
      </h2>
      <p className="text-sm text-[#7a7266] mb-4 max-w-xs">
        File ZIP berisi strip foto digital & foto-foto satuan berhasil dikirim
        ke:
        <br />
        <strong className="text-terracotta">{formData.email}</strong>
      </p>

      {/* Download CTA */}
      <div className="w-full bg-[#fcf8f2] border border-line rounded-2xl p-4 mb-8 text-left">
        <div className="text-xs font-bold text-maroon mb-2 flex items-center gap-1.5">
          <span>Unduh Langsung</span> 📥
        </div>
        <p className="text-xs text-[#8a7f71] mb-3">
          Kamu juga bisa mengunduh file strip foto langsung ke perangkat ini
          sekarang.
        </p>
        <button
          onClick={handleDownloadStrip}
          className="w-full text-xs font-bold rounded-lg border-2 border-terracotta text-terracotta hover:bg-terracotta hover:text-white py-2 text-center transition-all"
        >
          Unduh Frame PNG 📸
        </button>
      </div>

      <div className="flex flex-col gap-3 w-full">
        <button
          onClick={handlePrintTrigger}
          className="rounded-pill bg-terracotta hover:bg-terracotta-dark py-4 text-md font-bold text-white shadow-md transition-all flex items-center justify-center gap-2"
        >
          <span>Cetak Hardcopy Foto</span> 🖨️
        </button>

        <button
          onClick={() => setStep(STEPS.THANK_YOU)}
          className="text-sm text-[#8a7f71] hover:text-maroon font-semibold underline mt-2"
        >
          Lewati Cetak & Selesai
        </button>
      </div>
    </div>
  );
}
