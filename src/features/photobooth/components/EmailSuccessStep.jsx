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

      <div className="flex flex-col gap-3 w-full">
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
