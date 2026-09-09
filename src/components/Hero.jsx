import { Link } from 'react-router-dom';
import { CameraIcon, SparkleIcon } from '../icons.jsx';

export default function Hero() {
  return (
    <section className="relative flex flex-1 flex-col items-center justify-center overflow-hidden px-6 py-10 md:px-12 md:py-16">
      {/* Floating Orbs — ambient decorative background */}
      <div
        className="pointer-events-none absolute inset-0 overflow-hidden"
        aria-hidden="true"
      >
        <div className="hero-orb-1 absolute -top-20 -left-20 h-72 w-72 rounded-full bg-terracotta/8 blur-3xl" />
        <div className="hero-orb-2 absolute -bottom-24 -right-16 h-80 w-80 rounded-full bg-coral/10 blur-3xl" />
        <div className="hero-orb-3 absolute top-1/3 right-1/4 h-48 w-48 rounded-full bg-sage/10 blur-3xl" />
      </div>

      {/* Badge Event */}
      <div className="hero-entrance-1 relative inline-flex items-center gap-2 rounded-full border border-terracotta/20 bg-terracotta/10 px-5 py-2 text-xs font-semibold tracking-widest text-terracotta uppercase backdrop-blur-sm">
        <span className="h-2 w-2 rounded-full bg-terracotta animate-pulse" />
        DSC Photobooth 2026
      </div>

      {/* Judul Utama */}
      <h1 className="text-3xl text-center font-extrabold tracking-tight text-stone-900 sm:text-5xl md:text-6xl leading-[1.15]">
        Cerita perdanamu di kampus, <br />
        <span className="bg-linear-to-r from-terracotta to-terracotta-dark bg-clip-text text-transparent">
          diabadikan di sini.
        </span>
      </h1>

      {/* Subtitle */}
      <p className="hero-entrance-3 mt-4 max-w-lg text-center text-base text-stone-500 sm:text-lg leading-relaxed">
        Pengalaman photobooth digital. Pilih frame, jepret, dan dapatkan
        hasilnya.
      </p>

      {/* CTA — Tombol START di Tengah */}
      <div className="hero-entrance-4 mt-8 flex flex-col items-center justify-center gap-4">
        <Link
          to="/photobooth"
          id="hero-start-button"
          className="hero-btn-glow group relative inline-flex items-center justify-center gap-3 rounded-full bg-terracotta-dark px-12 py-5 text-xl font-bold text-white shadow-start transition-all duration-300 hover:bg-terracotta hover:shadow-xl hover:shadow-terracotta/40 hover:-translate-y-1 active:translate-y-0 cursor-pointer text-decoration-none"
        >
          {/* Sparkle icon accent */}
          <SparkleIcon className="absolute -top-2 -right-2 h-5 w-5 text-coral/70 hero-sparkle-spin" />
          <CameraIcon className="h-6 w-6 transition-transform duration-300 group-hover:scale-110" />
          <span className="tracking-wide">START</span>
        </Link>
      </div>

      {/* Display Galeri Preview */}
      {/* <HeroImages /> */}

      {/* Feature highlights */}
      <div className="hero-entrance-6 mt-10 grid grid-cols-3 gap-6 sm:gap-10 max-w-lg w-full">
        <div className="flex flex-col items-center gap-1.5 text-center">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-terracotta/10 text-terracotta">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className="h-5 w-5"
            >
              <rect x="3" y="3" width="18" height="18" rx="2" />
              <path d="M9 3v18M3 9h18" />
            </svg>
          </div>
          <span className="text-xs font-semibold text-stone-700">
            5 Template
          </span>
          <span className="text-[11px] text-stone-400 leading-tight hidden sm:block">
            Bingkai unik &amp; menarik
          </span>
        </div>

        <div className="flex flex-col items-center gap-1.5 text-center">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-coral/10 text-coral">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className="h-5 w-5"
            >
              <path d="M12 2l1.5 4.5L18 8l-4.5 1.5L12 14l-1.5-4.5L6 8l4.5-1.5z" />
              <path d="M18 14l1 3 3 1-3 1-1 3-1-3-3-1 3-1z" />
            </svg>
          </div>
          <span className="text-xs font-semibold text-stone-700">
            AR Filter
          </span>
          <span className="text-[11px] text-stone-400 leading-tight hidden sm:block">
            Real-time face filter
          </span>
        </div>

        <div className="flex flex-col items-center gap-1.5 text-center">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-sage/15 text-sage">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className="h-5 w-5"
            >
              <rect x="3" y="5" width="18" height="14" rx="2" />
              <path d="M3 7l9 6 9-6" />
            </svg>
          </div>
          <span className="text-xs font-semibold text-stone-700">
            Email &amp; Print
          </span>
          <span className="text-[11px] text-stone-400 leading-tight hidden sm:block">
            Kirim &amp; cetak langsung
          </span>
        </div>
      </div>
    </section>
  );
}
