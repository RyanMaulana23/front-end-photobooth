import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import api from '../config/axios';
import { LAYOUT_CONFIGS, FILTERS, getMaxPhotos } from '../constants/photobooth';

const getTemplateByPhotosCount = (photosCount, sessionId = '') => {
  if (photosCount === 2) return 'layout5';
  if (photosCount === 3) {
    const code = sessionId ? (sessionId.charCodeAt(sessionId.length - 1) || 0) : 0;
    return code % 2 === 0 ? 'layout3' : 'layout4';
  }
  if (photosCount === 4) {
    const code = sessionId ? (sessionId.charCodeAt(sessionId.length - 1) || 0) : 0;
    return code % 2 === 0 ? 'layout1' : 'layout2';
  }
  return 'layout1';
};


/* =========================================================
    Mock Data
   ========================================================= */
const MOCK_PHOTOS = [
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
  'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=400&q=80',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
  'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=400&q=80',
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=400&q=80',
  'https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?auto=format&fit=crop&w=400&q=80',
  'https://images.unsplash.com/photo-1488161628813-04466f872be2?auto=format&fit=crop&w=400&q=80',
  'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=400&q=80',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80',
  'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=80',
  'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=400&q=80',
  'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=400&q=80',
];

const MOCK_NAMES = [
  'Aditya Pratama',
  'Siti Rahmawati',
  'Rian Hidayat',
  'Fatimah Zahra',
  'Budi Santoso',
  'Dewi Lestari',
  'Eko Prasetyo',
  'Novianti Putri',
  'Giri Wijaya',
  'Aisyah Bella',
  'Dimas Anggara',
  'Indah Permata',
];

/* =========================================================
   Generate Sessions
   ========================================================= */
function generateRandomSessions(count = 16) {
  const layouts = ['layout1', 'layout2', 'layout3', 'layout4', 'layout5'];
  const filtersList = FILTERS.map((f) => f.id);

  return Array.from({ length: count }, (_, i) => {
    const template = layouts[Math.floor(Math.random() * layouts.length)];
    const filter = filtersList[Math.floor(Math.random() * filtersList.length)];
    const maxPhotos = getMaxPhotos(template);
    const shuffledPhotos = [...MOCK_PHOTOS].sort(() => 0.5 - Math.random());

    return {
      id: i,
      name: MOCK_NAMES[Math.floor(Math.random() * MOCK_NAMES.length)],
      npm: `50421${Math.floor(100 + Math.random() * 900)}`,
      template,
      filter,
      filterLabel: FILTERS.find((f) => f.id === filter)?.label || 'Normal',
      layoutLabel: LAYOUT_CONFIGS[template]?.name || 'Template',
      photos: shuffledPhotos.slice(0, maxPhotos),
    };
  });
}

/* =========================================================
    Single Photo Strip (preview inside frame)
   ========================================================= */
function PhotoStrip({ template, photos, filter, height = 260 }) {
  const config = LAYOUT_CONFIGS[template];
  if (!config) return null;

  const filterCss = FILTERS.find((f) => f.id === filter)?.css || 'none';
  // Derive explicit width from the given height so aspect ratio is always correct
  const computedWidth = Math.round(height * (config.width / config.height));

  return (
    <div
      className="relative bg-stone-100 overflow-hidden shrink-0"
      style={{ width: computedWidth, height }}
    >
      <img
        src={config.image}
        alt="frame layout"
        className="absolute inset-0 w-full h-full object-contain pointer-events-none z-10"
        draggable={false}
      />
      {config.slots.map((slot, idx) => {
        const left = (slot.x / config.width) * 100;
        const top = (slot.y / config.height) * 100;
        const w = (slot.w / config.width) * 100;
        const h = (slot.h / config.height) * 100;
        const photo = photos[idx % photos.length];

        return (
          <div
            key={idx}
            className="absolute overflow-hidden z-0"
            style={{
              left: `${left}%`,
              top: `${top}%`,
              width: `${w}%`,
              height: `${h}%`,
            }}
          >
            {photo && (
              <img
                src={photo}
                alt={`photo-${idx}`}
                className="w-full h-full object-cover"
                style={{ filter: filterCss }}
                draggable={false}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}

/* =========================================================
   Gallery Card (polaroid + info)
   ========================================================= */
function GalleryCard({ session, stripHeight = 280 }) {
  const [hovered, setHovered] = useState(false);
  const template = session.template || getTemplateByPhotosCount(session.photos.length, String(session.id));
  const config = LAYOUT_CONFIGS[template];
  // Calculate card width based on strip aspect ratio + polaroid padding
  const innerH = stripHeight - 36 - 16; // subtract caption(36) + top+bottom padding(8+8)
  const innerW = config
    ? Math.round(innerH * (config.width / config.height))
    : 140;
  const cardWidth = innerW + 16; // add left+right padding (8+8)

  return (
    <div
      className="relative shrink-0 cursor-pointer"
      style={{
        width: cardWidth,
        height: stripHeight,
        transform: hovered
          ? 'translateY(-8px) scale(1.04)'
          : 'translateY(0px) scale(1)',
        transition: 'transform 0.4s cubic-bezier(0.34,1.56,0.64,1)',
        zIndex: hovered ? 10 : 1,
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Polaroid wrapper */}
      <div
        className="bg-white rounded-sm w-full h-full relative overflow-hidden"
        style={{
          padding: '8px 8px 36px 8px',
          boxShadow: hovered
            ? '0 24px 64px rgba(122,51,39,0.28), 0 4px 16px rgba(0,0,0,0.1)'
            : '0 6px 24px rgba(122,51,39,0.14)',
          transition: 'box-shadow 0.4s ease',
          boxSizing: 'border-box',
        }}
      >
        {/* Photo strip — exact width/height so photos are always visible */}
        <PhotoStrip
          template={template}
          photos={session.photos}
          filter={session.filter || 'none'}
          height={innerH}
        />

        {/* Caption */}
        <div
          className="absolute bottom-0 left-0 right-0 flex flex-col items-center gap-0.5 py-1.5 px-2"
          style={{ height: 36 }}
        >
          <span className="text-[10px] font-bold text-maroon font-display leading-tight truncate w-full text-center">
            {session.name}
          </span>
          <span className="text-[8px] text-coral font-mono leading-none">
            {session.filterLabel}
          </span>
        </div>
      </div>

      {/* Hover glow */}
      {hovered && (
        <div
          aria-hidden="true"
          className="absolute inset-0 rounded-sm pointer-events-none"
          style={{
            background:
              'radial-gradient(ellipse at 50% 0%, rgba(181,74,51,0.12) 0%, transparent 70%)',
          }}
        />
      )}
    </div>
  );
}

/* =========================================================
   Marquee Row (infinite scroll left or right)
   ========================================================= */
function MarqueeRow({
  sessions,
  direction = 'left',
  speed = 40,
  stripHeight = 280,
}) {
  const trackRef = useRef(null);
  const pausedRef = useRef(false);
  const posRef = useRef(0);
  const animRef = useRef(null);
  const lastTimeRef = useRef(null);

  // Duplicate 3× for seamless loop
  const items = [...sessions, ...sessions, ...sessions];

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    const totalWidth = track.scrollWidth / 3; // width of one set
    const sign = direction === 'left' ? -1 : 1;
    // start at 0 for left, -totalWidth for right (so it also loops seamlessly)
    posRef.current = direction === 'right' ? -totalWidth : 0;

    const animate = (timestamp) => {
      if (!pausedRef.current) {
        if (lastTimeRef.current !== null) {
          const delta = timestamp - lastTimeRef.current;
          posRef.current += (sign * (speed * delta)) / 1000;

          // Loop reset
          if (direction === 'left' && posRef.current <= -totalWidth) {
            posRef.current += totalWidth;
          }
          if (direction === 'right' && posRef.current >= 0) {
            posRef.current -= totalWidth;
          }
        }
        lastTimeRef.current = timestamp;
        track.style.transform = `translateX(${posRef.current}px)`;
      } else {
        lastTimeRef.current = null;
      }
      animRef.current = requestAnimationFrame(animate);
    };

    animRef.current = requestAnimationFrame(animate);
    return () => {
      if (animRef.current) cancelAnimationFrame(animRef.current);
    };
  }, [direction, speed]);

  return (
    <div
      className="relative overflow-hidden w-full"
      style={{ height: stripHeight + 24 }}
      onMouseEnter={() => {
        pausedRef.current = true;
      }}
      onMouseLeave={() => {
        pausedRef.current = false;
      }}
    >
      {/* Left fade */}
      <div
        aria-hidden="true"
        className="absolute left-0 top-0 bottom-0 z-20 pointer-events-none"
        style={{
          width: 80,
          background: 'linear-gradient(to right, #faf5ec, transparent)',
        }}
      />
      {/* Right fade */}
      <div
        aria-hidden="true"
        className="absolute right-0 top-0 bottom-0 z-20 pointer-events-none"
        style={{
          width: 80,
          background: 'linear-gradient(to left, #faf5ec, transparent)',
        }}
      />

      <div
        ref={trackRef}
        className="flex items-center gap-5 will-change-transform"
        style={{ height: stripHeight, width: 'max-content', paddingInline: 12 }}
      >
        {items.map((session, i) => (
          <GalleryCard
            key={`${session.id}-${i}`}
            session={session}
            stripHeight={stripHeight}
          />
        ))}
      </div>
    </div>
  );
}

/* =========================================================
   Floating Orb
   ========================================================= */
function FloatingOrb({ className, style }) {
  return (
    <div
      aria-hidden="true"
      className={`absolute rounded-full blur-3xl pointer-events-none ${className}`}
      style={style}
    />
  );
}

/* =========================================================
     Main Gallery Page
   ========================================================= */
export default function Gallery() {
  const { data: serverSessions = [] } = useQuery({
    queryKey: ['gallery', 'sessions'],
    queryFn: async () => {
      const response = await api.get('/photo-sessions/gallery');
      return response.data?.data || [];
    },
    staleTime: 1000 * 30,
  });

  // Fallback to random mock sessions if no real database sessions exist yet
  const displaySessions = serverSessions.length > 0
    ? serverSessions
    : generateRandomSessions(16);

  const half = Math.ceil(displaySessions.length / 2);
  const row1 = displaySessions.slice(0, half);
  const row2 = displaySessions.slice(half);



  return (
    <section className="flex-1 relative overflow-hidden bg-cream">
      {/* ---- Global animations ---- */}
      <style>{`
        @keyframes fadeSlideUp {
          from { opacity: 0; transform: translateY(24px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes floatA {
          0%, 100% { transform: translateY(0) scale(1); }
          50% { transform: translateY(-22px) scale(1.06); }
        }
        @keyframes floatB {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          50% { transform: translateY(-14px) rotate(8deg); }
        }
        .fade-up { animation: fadeSlideUp 0.7s cubic-bezier(0.16,1,0.3,1) both; }
        .fade-up-d1 { animation: fadeSlideUp 0.7s cubic-bezier(0.16,1,0.3,1) 0.1s both; }
        .fade-up-d2 { animation: fadeSlideUp 0.7s cubic-bezier(0.16,1,0.3,1) 0.2s both; }
        .fade-up-d3 { animation: fadeSlideUp 0.7s cubic-bezier(0.16,1,0.3,1) 0.35s both; }
        .fade-up-d4 { animation: fadeSlideUp 0.7s cubic-bezier(0.16,1,0.3,1) 0.5s both; }
        .orb-a { animation: floatA 9s ease-in-out infinite; }
        .orb-b { animation: floatB 13s ease-in-out infinite; }
        .orb-c { animation: floatA 7s ease-in-out infinite reverse; }
      `}</style>

      {/* ---- Ambient background orbs ---- */}
      <FloatingOrb className="orb-a bg-coral w-80 h-80 -top-20 -right-20 opacity-[0.16]" />
      <FloatingOrb className="orb-b bg-terracotta w-96 h-96 top-1/3 -left-32 opacity-[0.11]" />
      <FloatingOrb className="orb-c bg-sage w-60 h-60 bottom-0 right-1/4 opacity-[0.12]" />

      {/* ---- Dot-grid texture ---- */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-0"
        style={{
          backgroundImage:
            'radial-gradient(circle, #b54a3318 1.5px, transparent 1.5px)',
          backgroundSize: '30px 30px',
        }}
      />

      {/* ================================================================
          HERO HEADER
          ================================================================ */}
      <div className="relative z-10 pt-14 pb-4 px-4 text-center flex flex-col items-center">
        {/* Eyebrow badge */}
        <div className="fade-up inline-flex items-center gap-2 bg-white/70 border border-line rounded-full px-4 py-1.5 mb-5 backdrop-blur-sm shadow-sm">
          <span className="inline-block w-1.5 h-1.5 rounded-full bg-terracotta animate-pulse" />
          <span className="text-[10px] font-bold text-terracotta tracking-[0.22em] uppercase font-display">
            Galeri Hasil Foto Pelanggan
          </span>
        </div>

        <h1
          className="fade-up-d1 font-display font-bold text-maroon leading-none mb-3"
          style={{
            fontSize: 'clamp(2rem,5vw,3.2rem)',
            margin: '0 0 14px',
            letterSpacing: '-1.5px',
          }}
        >
          Kenangan{' '}
          <span
            style={{
              background: 'linear-gradient(135deg,#b54a33,#e08a6e 55%,#7a3327)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            Abadi
          </span>{' '}
          DSCBooth 📸
        </h1>

        <p
          className="fade-up-d2 text-sm text-[#7a7266] max-w-sm leading-relaxed mx-auto"
          style={{ margin: '0 0 24px' }}
        >
          Momen-momen seru pelanggan kami yang diabadikan dalam berbagai
          template dan filter kreatif. Hover untuk berhenti, geser untuk lanjut!
        </p>

        {/* CTA buttons */}
        <div className="fade-up-d3 flex flex-col sm:flex-row gap-3 items-center justify-center">
          <Link
            to="/photobooth"
            id="go-photobooth-btn"
            className="inline-flex items-center gap-2 rounded-pill border-2 border-maroon/35 text-maroon hover:bg-maroon hover:text-white px-6 py-2.5 text-xs font-bold transition-all duration-300 no-underline"
          >
            <span>📷</span>
            Buat Fotomu Sendiri
          </Link>
        </div>
      </div>

      {/* ================================================================
          DIVIDER
          ================================================================ */}
      <div className="fade-up-d4 relative z-10 flex items-center gap-4 px-12 my-8">
        <div className="flex-1 h-px bg-linear-to-r from-transparent to-line" />
        <span className="text-[10px] font-bold uppercase tracking-[0.28em] text-[#a79c8c] font-display whitespace-nowrap">
          ✦ Geser untuk Jelajahi ✦
        </span>
        <div className="flex-1 h-px bg-linear-to-l from-transparent to-line" />
      </div>

      {/* ================================================================
          MARQUEE ROW 1 — scrolls LEFT (→ standard direction)
          ================================================================ */}
      <div className="relative z-10 mb-8">
        {row1.length > 0 && (
          <MarqueeRow
            sessions={row1}
            direction="left"
            speed={52}
            stripHeight={300}
          />
        )}
      </div>

      {/* ================================================================
          MARQUEE ROW 2 — scrolls RIGHT (← reverse direction)
          ================================================================ */}
      <div className="relative z-10 mb-10">
        {row2.length > 0 && (
          <MarqueeRow
            sessions={row2}
            direction="right"
            speed={38}
            stripHeight={260}
          />
        )}
      </div>

      {/* ================================================================
          BOTTOM CTA BANNER
          ================================================================ */}
      <div
        className="relative z-10 mx-5 sm:mx-14 mb-14 rounded-3xl overflow-hidden"
        style={{
          animation: 'fadeSlideUp 0.8s cubic-bezier(0.16,1,0.3,1) 0.6s both',
        }}
      >
        <div
          className="relative px-8 py-10 text-center"
          style={{
            background:
              'linear-gradient(135deg,#7a3327 0%,#b54a33 55%,#e08a6e 100%)',
          }}
        >
          {/* dot texture */}
          <div
            aria-hidden="true"
            className="absolute inset-0 pointer-events-none"
            style={{
              backgroundImage:
                'radial-gradient(circle,rgba(255,255,255,0.07) 1.5px,transparent 1.5px)',
              backgroundSize: '20px 20px',
            }}
          />

          <p className="relative text-white/60 text-[10px] uppercase tracking-[0.3em] font-bold font-display mb-2">
            ✦ Giliran Kamu ✦
          </p>
          <h2
            className="relative font-display font-bold text-white mb-3"
            style={{
              fontSize: 'clamp(1.4rem,3vw,2rem)',
              margin: '0 0 10px',
              letterSpacing: '-0.5px',
            }}
          >
            Siap Buat Kenangan Seru?
          </h2>
          <p
            className="relative text-white/75 text-sm mb-6 max-w-md mx-auto leading-relaxed"
            style={{ margin: '0 auto 22px' }}
          >
            Pilih template favoritmu, tambahkan filter kreatif, dan abadikan
            momen keseruanmu bersama teman-teman!
          </p>
          <Link
            to="/photobooth"
            id="cta-start-btn"
            className="relative inline-flex items-center gap-2 bg-white text-maroon rounded-pill px-8 py-3 text-xs font-bold transition-all duration-300 hover:bg-cream hover:shadow-xl no-underline active:scale-95"
          >
            🚀 Mulai Sesi Fotobooth Sekarang
          </Link>
        </div>
      </div>
    </section>
  );
}
