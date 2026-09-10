function FloatingCard({ src, name }) {
  return (
    <div className="hidden sm:block w-44 sm:w-52 transform rounded-2xl bg-white/80 p-3 shadow-xl backdrop-blur-sm border border-stone-200/60 transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:rotate-0">
      <div className="overflow-hidden rounded-xl">
        <img
          className="h-44 sm:h-52 w-full rounded-xl object-cover transition-transform duration-500 hover:scale-110"
          src={src}
          alt={name}
          loading="lazy"
          width="400"
          height="500"
        />
      </div>
      <p className="mt-2.5 text-center font-hand text-sm text-stone-500">
        {name}
      </p>
    </div>
  );
}

export default function HeroImages() {
  return (
    <div className="hero-entrance-5 relative mt-10 flex w-full max-w-4xl items-center justify-center gap-4 px-4 sm:gap-6">
      {/* Floating Card Kiri */}
      <FloatingCard
        src={'https://picsum.photos/seed/friends1/400/500'}
        name={'Golden Memories ✨'}
      />

      {/* Card Utama Tengah — premium dark frame */}
      <div className="w-56 sm:w-64 z-10 transform rounded-2xl bg-stone-900 p-3.5 shadow-2xl shadow-stone-900/30 border border-stone-700/50 transition-all duration-500 hover:scale-105 hover:shadow-3xl">
        <div className="overflow-hidden rounded-xl bg-stone-800 p-1.5">
          <img
            className="h-56 sm:h-64 w-full rounded-lg object-cover transition-transform duration-500 hover:scale-105"
            src="https://picsum.photos/seed/camera2/400/500"
            alt="Photobooth preview"
            loading="lazy"
            width="400"
            height="500"
          />
          <div className="mt-2.5 flex items-center justify-between px-1.5 pb-1 text-xs">
            <span className="font-medium text-stone-400">Photobooth DSC</span>
            <span className="font-semibold text-terracotta">2026 Edition</span>
          </div>
        </div>
      </div>

      {/* Floating Card Kanan */}
      <FloatingCard
        src={'https://picsum.photos/seed/sunset3/400/500'}
        name={'Preserved Forever 📸'}
      />
    </div>
  );
}
