import { Link } from 'react-router-dom';
import { CameraIcon } from '../icons.jsx';
import HeroImages from './HeroImages.jsx';

export default function Hero() {
  return (
    <section className="relative grid flex-1 grid-cols-1 gap-10 px-6 pb-10 pt-16 md:px-12 lg:grid-cols-[1.15fr_0.85fr]">
      <div>
        <h1 className="mb-5 text-[40px] font-bold leading-[1.05] tracking-tight md:text-[56px]">
          Capture the moment,
          <br />
          <span className="text-terracotta">Photobooth DSC 2026</span>
        </h1>

        <p className="mb-9 max-w-[480px] font-hand text-[28px] leading-snug text-sage">
          Preserving your digital memories with a soul.
        </p>

        <div className="mb-11 flex flex-wrap items-center gap-6">
          <Link
            to="/photobooth"
            className="inline-flex items-center gap-3 rounded-pill bg-terracotta-dark hover:bg-terracotta transition-colors px-10 py-5 text-xl font-bold tracking-wide text-white shadow-start cursor-pointer decoration-none"
          >
            <CameraIcon className="h-5 w-5" />
            START
          </Link>
          <p className="max-w-[220px] text-[15px] italic leading-snug text-[#8a7f71]">
            "The best way to experience your photos since 2026."
          </p>
        </div>
      </div>

      <HeroImages />
    </section>
  );
}
