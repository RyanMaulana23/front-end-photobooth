import Header from '../seo/Header';
import { Link } from 'react-router-dom';

export default function AuthLayout({ children, title }) {
  return (
    <>
      <Header title={`${title} | DSC Photobox Admin`} />
      <main className="relative min-h-dvh w-full flex items-center justify-center bg-cream px-4 overflow-hidden">
        {/* Background Decorative Ambient Orbs */}
        <div className="absolute -top-32 -left-32 w-96 h-96 bg-coral/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-terracotta/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-150 h-150 bg-sage/10 rounded-full blur-3xl pointer-events-none" />

        {/* Floating Auth Card Container */}
        <div className="relative z-10 w-full max-w-md bg-white/80 backdrop-blur-xl border border-line rounded-3xl p-6 shadow-toast animate-scale-up my-2">
          {/* Header Brand */}
          <div className="flex flex-col items-center text-center">
            <Link
              to="/"
              className="inline-flex flex-col items-center group decoration-none"
            >
              <span className="text-3xl font-bold font-display tracking-tight text-maroon group-hover:scale-105 transition-transform">
                DSC Photobox
              </span>
              <span className="font-mono text-[10px] uppercase tracking-[3px] text-terracotta font-semibold">
                Admin Portal
              </span>
            </Link>
          </div>

          {children}
        </div>
      </main>
    </>
  );
}
