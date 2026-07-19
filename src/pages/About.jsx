import { Link } from 'react-router-dom';

export default function About() {
  return (
    <section className="flex-1 bg-cream px-4 py-8 sm:px-6 md:px-12 md:py-16 animate-fade-in flex items-start justify-center">
      <div className="w-full max-w-2xl bg-white border border-line p-6 sm:p-8 md:p-10 rounded-3xl shadow-sm mx-auto">
        <h1
          style={{ color: '#b54a33' }}
          className="text-3xl font-bold mb-4 mt-0 font-display"
        >
          Tentang DSCBooth 📸
        </h1>
        <p className="text-sm text-[#6b6255] leading-relaxed mb-4">
          DSCBooth adalah aplikasi photobooth digital modern yang didesain
          khusus untuk mahasiswa dan generasi muda. Kami menggabungkan estetika
          retro klasik dengan filter modern serta layout yang lucu dan
          ekspresif.
        </p>
        <p className="text-sm text-[#6b6255] leading-relaxed mb-6">
          Dilengkapi dengan template <strong>"Centil"</strong> (yang manis dan
          estetik) dan template <strong>"Absurd"</strong> (yang nyeleneh dan
          penuh meme), Anda bisa mengabadikan momen bersama teman-teman kampus
          dalam hitungan detik.
        </p>
        <Link
          to="/"
          className="inline-flex rounded-pill bg-terracotta hover:bg-terracotta-dark px-6 py-2.5 text-xs font-bold text-white transition-colors cursor-pointer decoration-none"
        >
          Kembali ke Beranda
        </Link>
      </div>
    </section>
  );
}
