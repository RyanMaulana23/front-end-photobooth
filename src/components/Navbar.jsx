import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { AboutIcon, CameraIcon, GalleryIcon, HomeIcon } from '../icons.jsx';

export default function Navbar() {
  const location = useLocation();
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const navItems = [
    { path: '/', label: 'Home', icon: HomeIcon },
    { path: '/about', label: 'About', icon: AboutIcon },
    { path: '/gallery', label: 'Gallery', icon: GalleryIcon },
  ];

  const isActive = (path) => {
    if (path === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(path);
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-cream/85 backdrop-blur-md border-b border-line px-6 py-4 md:px-12 transition-all">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Left: Brand logo */}
        <div className="flex items-center gap-2">
          <Link to="/" className="flex flex-col decoration-none select-none">
            <span className="text-[24px] font-bold leading-none tracking-tight text-maroon font-display">
              DSCBooth
            </span>
            <span className="mt-0.5 font-mono text-[9px] uppercase tracking-[2px] text-[#a79c8c] leading-none">
              Vibe Check
            </span>
          </Link>
        </div>

        {/* Center: Desktop Menu */}
        <nav className="hidden md:flex items-center gap-8">
          {navItems.map((item) => {
            const active = isActive(item.path);
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`relative py-1.5 text-[15px] font-semibold transition-colors decoration-none flex items-center gap-1.5 ${
                  active
                    ? 'text-terracotta'
                    : 'text-[#7a7266] hover:text-maroon'
                }`}
              >
                <item.icon className="h-4 w-4 shrink-0" />
                <span>{item.label}</span>
                {active && (
                  <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-terracotta rounded-full animate-fade-in" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Right: Desktop Actions & CTA */}
        <div className="hidden md:flex items-center gap-6">
          <Link
            to="/photobooth"
            className="inline-flex items-center gap-2 rounded-pill bg-terracotta hover:bg-terracotta-dark text-white px-5 py-2.5 text-xs font-bold shadow-sm transition-colors decoration-none cursor-pointer"
          >
            <CameraIcon className="h-4 w-4" />
            <span>Mulai Foto</span>
          </Link>
        </div>

        {/* Mobile Hamburger Trigger & Quick Start Button */}
        <div className="flex md:hidden items-center gap-4">
          <Link
            to="/photobooth"
            className="inline-flex items-center justify-center p-2.5 rounded-full bg-terracotta hover:bg-terracotta-dark text-white shadow-sm transition-colors decoration-none cursor-pointer"
            aria-label="Start Photo Session"
          >
            <CameraIcon className="h-4 w-4" />
          </Link>
          <button
            onClick={() => setIsMobileOpen(!isMobileOpen)}
            className="flex flex-col justify-between w-6 h-[16px] text-maroon cursor-pointer focus:outline-none"
            aria-label="Toggle navigation menu"
          >
            <span
              className={`w-full h-[2px] bg-maroon rounded-full transition-transform duration-300 ${
                isMobileOpen ? 'transform rotate-45 translate-y-[7px]' : ''
              }`}
            />
            <span
              className={`w-full h-[2px] bg-maroon rounded-full transition-opacity duration-300 ${
                isMobileOpen ? 'opacity-0' : ''
              }`}
            />
            <span
              className={`w-full h-[2px] bg-maroon rounded-full transition-transform duration-300 ${
                isMobileOpen ? 'transform -rotate-45 translate-y-[-7px]' : ''
              }`}
            />
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {isMobileOpen && (
        <div className="md:hidden w-full bg-cream border-t border-line mt-4 py-4 flex flex-col gap-3 animate-fade-in">
          {navItems.map((item) => {
            const active = isActive(item.path);
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setIsMobileOpen(false)}
                className={`flex items-center gap-3 rounded-pill px-4 py-3 text-[15px] font-semibold transition-colors decoration-none ${
                  active
                    ? 'bg-coral text-white'
                    : 'text-maroon hover:bg-[#e9e0d2]'
                }`}
              >
                <item.icon className="h-[18px] w-[18px] shrink-0" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </div>
      )}
    </header>
  );
}
