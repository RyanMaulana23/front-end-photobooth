import { Link } from 'react-router-dom';

export default function Footer() {
  const socialMedia = [
    {
      name: 'Instagram',
      url: 'https://www.instagram.com/dsc_ubhara',
    },
    {
      name: 'LinkedIn',
      url: 'https://www.linkedin.com/company/dsc-bhayangkara/home/',
    },
    {
      name: 'Tiktok',
      url: 'https://www.tiktok.com/@dsc_ubhara',
    },
  ];

  return (
    <footer className="w-full bg-ebony text-[#c9c1b4] border-t border-stone-800/80">
      <div className="mx-auto max-w-7xl px-6 py-10 md:px-12 lg:py-12">
        {/* Bagian Utama Footer */}
        <div className="grid grid-cols-1 gap-8 md:grid-cols-12 lg:gap-12">
          {/* Brand & Organisasi */}
          <div className="md:col-span-6 lg:col-span-6 space-y-3">
            <div className="flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-full bg-terracotta animate-pulse" />
              <span className="text-base font-bold tracking-tight text-white">
                DSC Photobooth
              </span>
            </div>

            <p className="font-mono text-xs tracking-wider text-[#8a8175] uppercase">
              Developer Student Club
            </p>

            <p className="text-xs text-[#a39b8e] leading-relaxed max-w-md">
              Universitas Bhayangkara Jakarta Raya. <br />
              Preserving your digital memories with a soul.
            </p>
          </div>

          {/* Link Navigasi & Media Sosial */}
          <div className="grid grid-cols-2 gap-8 md:col-span-6 lg:col-span-6 sm:grid-cols-2 justify-end">
            {/* Menu Navigasi */}
            <div className="space-y-3">
              <h4 className="text-xs font-semibold tracking-wider text-white uppercase">
                Navigation
              </h4>
              <ul className="space-y-2 text-xs">
                <li>
                  <Link
                    to="/"
                    className="hover:text-terracotta transition-colors text-decoration-none"
                  >
                    Home
                  </Link>
                </li>
                <li>
                  <Link
                    to="/photobooth"
                    className="hover:text-terracotta transition-colors text-decoration-none"
                  >
                    Photobooth
                  </Link>
                </li>
              </ul>
            </div>

            {/* Media Sosial & Kontak */}
            <div className="space-y-3">
              <h4 className="text-xs font-semibold tracking-wider text-white uppercase">
                Media Sosial
              </h4>
              <ul className="space-y-2 text-xs">
                {socialMedia.map((social, socialIndex) => (
                  <li key={socialIndex}>
                    <a
                      href={social.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:text-terracotta transition-colors text-decoration-none"
                    >
                      {social.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Garis Pemisah Bottom Bar */}
        <div className="mt-10 pt-6 border-t border-stone-800/60 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#8a8175]">
          <p>© 2026 DSC Photobox. All rights reserved.</p>
          <p className="font-mono text-[11px]">
            Crafted with passion by{' '}
            <span className="text-[#c9c1b4]">DSC Ubhara Jaya</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
