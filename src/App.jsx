import { useState } from 'react'
import Sidebar from './components/Sidebar.jsx'
import Topbar from './components/Topbar.jsx'
import Hero from './components/Hero.jsx'
import Footer from './components/Footer.jsx'
import Photobooth from './components/Photobooth.jsx'

export default function App() {
  const [view, setView] = useState('home') // 'home' | 'photobooth' | 'about' | 'privacy' | 'contact'
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const renderContent = () => {
    switch (view) {
      case 'photobooth':
        return <Photobooth onHome={() => setView('home')} />
      case 'about':
        return (
          <section className="flex-1 bg-cream px-4 py-8 sm:px-6 md:px-12 md:py-16 animate-fade-in flex items-start justify-center">
            <div className="w-full max-w-2xl bg-white border border-line p-6 sm:p-8 md:p-10 rounded-3xl shadow-sm mx-auto">
              <h1 style={{ color: '#b54a33' }} className="text-3xl font-bold mb-4 mt-0 font-display">Tentang DSCBooth 📸</h1>
              <p className="text-sm text-[#6b6255] leading-relaxed mb-4">
                DSCBooth adalah aplikasi photobooth digital modern yang didesain khusus untuk mahasiswa dan generasi muda. Kami menggabungkan estetika retro klasik dengan filter modern serta layout yang lucu dan ekspresif.
              </p>
              <p className="text-sm text-[#6b6255] leading-relaxed mb-6">
                Dilengkapi dengan template <strong>"Centil"</strong> (yang manis dan estetik) dan template <strong>"Absurd"</strong> (yang nyeleneh dan penuh meme), Anda bisa mengabadikan momen bersama teman-teman kampus dalam hitungan detik.
              </p>
              <button 
                onClick={() => setView('home')}
                className="rounded-pill bg-terracotta hover:bg-terracotta-dark px-6 py-2.5 text-xs font-bold text-white transition-colors cursor-pointer"
              >
                Kembali ke Beranda
              </button>
            </div>
          </section>
        )
      case 'privacy':
        return (
          <section className="flex-1 bg-cream px-4 py-8 sm:px-6 md:px-12 md:py-16 animate-fade-in flex items-start justify-center">
            <div className="w-full max-w-2xl bg-white border border-line p-6 sm:p-8 md:p-10 rounded-3xl shadow-sm mx-auto">
              <h1 style={{ color: '#b54a33' }} className="text-3xl font-bold mb-4 mt-0 font-display">Kebijakan Privasi 🔒</h1>
              <p className="text-sm text-[#6b6255] leading-relaxed mb-4">
                Kami sangat menghargai privasi data Anda. Semua foto yang Anda ambil di DSCBooth hanya diproses secara lokal di browser Anda untuk keperluan penggabungan template.
              </p>
              <p className="text-sm text-[#6b6255] leading-relaxed mb-6">
                Informasi NPM, Email, dan data lainnya dikirimkan secara langsung ke email tujuan Anda dan tidak disimpan secara permanen di server kami. DSCBooth aman, menyenangkan, dan transparan!
              </p>
              <button 
                onClick={() => setView('home')}
                className="rounded-pill bg-terracotta hover:bg-terracotta-dark px-6 py-2.5 text-xs font-bold text-white transition-colors cursor-pointer"
              >
                Saya Mengerti
              </button>
            </div>
          </section>
        )
      case 'contact':
        return (
          <section className="flex-1 bg-cream px-4 py-8 sm:px-6 md:px-12 md:py-16 animate-fade-in flex items-start justify-center">
            <div className="w-full max-w-2xl bg-white border border-line p-6 sm:p-8 md:p-10 rounded-3xl shadow-sm mx-auto">
              <h1 style={{ color: '#b54a33' }} className="text-3xl font-bold mb-4 mt-0 font-display">Hubungi Kami ✉️</h1>
              <p className="text-sm text-[#6b6255] leading-relaxed mb-4">
                Punya pertanyaan atau feedback tentang DSCBooth? Jangan ragu untuk menghubungi kami melalui email atau WhatsApp. Kami senang mendengar dari Anda!
              </p>
              <p className="text-sm text-[#6b6255] leading-relaxed mb-6">
                Tim kami akan berusaha merespons secepat mungkin. Terima kasih telah menggunakan DSCBooth!
              </p>
              <div className="flex flex-col gap-3 my-6 font-mono text-xs text-maroon">
                <div>📧 Email: support@dscbooth.com</div>
                <div>📱 WhatsApp: +62 85891089098 (Ryan)</div>
                <div>📱 WhatsApp: +62 87881550169 (IIB)</div>
                <div>📍 Lokasi: Gedung Lab Informatika, Kampus Bhayangkara Jakarta Raya</div>
              </div>
              <button 
                onClick={() => setView('home')}
                className="rounded-pill bg-terracotta hover:bg-terracotta-dark px-6 py-2.5 text-xs font-bold text-white transition-colors cursor-pointer"
              >
                Kembali
              </button>
            </div>
          </section>
        )
      case 'home':
      default:
        return <Hero onStart={() => setView('photobooth')} />
    }
  }

  return (
    <div className="grid min-h-screen grid-cols-1 lg:grid-cols-[260px_1fr]">
      <Sidebar 
        currentView={view} 
        onViewChange={setView} 
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
      />
      <div className="flex min-h-screen flex-col">
        <Topbar onMenuToggle={() => setIsMobileMenuOpen(true)} />
        {renderContent()}
        {view === 'home' && <Footer />}
      </div>
    </div>
  )
}
