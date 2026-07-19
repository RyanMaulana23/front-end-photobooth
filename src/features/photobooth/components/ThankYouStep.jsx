export default function ThankYouStep({ thankYouCountdown, resetAll }) {
  return (
    <div className="w-full max-w-md text-center flex flex-col items-center justify-center animate-fade-in py-16">
      <div className="w-24 h-24 rounded-full bg-pink-100 text-pink-600 flex items-center justify-center text-5xl mb-8 shadow-inner animate-bounce">
        🎉
      </div>

      <h2 className="text-4xl font-bold text-maroon mb-3 font-display">
        Terima Kasih!
      </h2>
      <p className="text-md text-[#7a7266] mb-8">
        Sesi fotomu telah selesai. Nikmati momen kebersamaanmu dengan
        **DSCBooth**!
      </p>

      <div className="bg-[#fcf8f2] border border-line rounded-2xl px-6 py-4 mb-10 w-full">
        <p className="text-xs text-[#8a7f71]">
          Halaman ini akan otomatis mereset kembali ke dashboard dalam:
        </p>
        <div className="text-3xl font-bold text-terracotta mt-1.5 font-mono">
          {thankYouCountdown} detik
        </div>
      </div>

      <button
        onClick={resetAll}
        className="rounded-pill bg-terracotta hover:bg-terracotta-dark px-12 py-4.5 text-md font-bold text-white shadow-start transition-all"
      >
        Mulai Sesi Baru Sekarang 🔄
      </button>
    </div>
  );
}
