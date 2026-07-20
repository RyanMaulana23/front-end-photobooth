import { FILTERS } from '../../../constants/photobooth';
import FilterModal from './FilterModal';

export default function CaptureStep({
  photos,
  template,
  retakeTarget,
  capturingIndex,
  devices,
  selectedDevice,
  setSelectedDevice,
  countdownTime,
  setCountdownTime,
  videoRef,
  mirror,
  setMirror,
  flashEnabled,
  setFlashEnabled,
  activeFilter,
  setActiveFilter,
  isFilterModalOpen,
  setIsFilterModalOpen,
  hasCamera,
  countdown,
  flash,
  simulatedAvatarSeed,
  triggerCaptureSequence,
  getMaxPhotos,
  getCameraAspectStyle,
}) {
  const capturedCount = photos.filter((p) => p !== null).length;

  return (
    <div className="w-full max-w-xl text-center flex flex-col items-center relative animate-fade-in">
      {/* Header counter */}
      <div className="text-4xl md:text-5xl font-extrabold text-maroon mb-2 font-mono select-none">
        {capturedCount}/{getMaxPhotos(template)}
      </div>

      <h2 className="text-xl md:text-2xl font-bold text-maroon mb-1 font-display">
        {retakeTarget !== null
          ? `Retake Foto #${retakeTarget + 1} 📸`
          : `Sesi Foto #${capturingIndex + 1}`}
      </h2>
      <p className="text-xs text-[#7a7266] mb-4">
        Posisikan dirimu di depan kamera. Klik **START** untuk memulai
        hitung mundur!
      </p>

      {/* Top Controls Row */}
      <div className="mb-5 flex flex-wrap items-center justify-center gap-3">
        {/* Camera Selector Dropdown */}
        {devices.length > 0 && (
          <select
            value={selectedDevice}
            onChange={(e) => setSelectedDevice(e.target.value)}
            className="px-3 py-2 border border-line bg-white rounded-lg text-xs font-semibold text-maroon focus:outline-none focus:border-terracotta cursor-pointer shadow-xs"
          >
            {devices.map((d) => (
              <option key={d.deviceId} value={d.deviceId}>
                {d.label || `Camera ${d.deviceId.slice(0, 5)}`}
              </option>
            ))}
          </select>
        )}

        {/* Countdown Time Dropdown */}
        <select
          value={countdownTime}
          onChange={(e) => setCountdownTime(parseInt(e.target.value))}
          className="px-3 py-2 border border-line bg-white rounded-lg text-xs font-semibold text-maroon focus:outline-none focus:border-terracotta cursor-pointer shadow-xs"
        >
          <option value={3}>3s Delay</option>
          <option value={5}>5s Delay</option>
          <option value={10}>10s Delay</option>
        </select>
      </div>

      {/* Camera Viewport Frame */}
      <div
        style={getCameraAspectStyle(template)}
        className="relative w-full bg-slate-900 rounded-3xl overflow-hidden border-6 border-maroon shadow-2xl transition-all duration-300"
      >
        {/* Live Camera Feed */}
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className={`w-full h-full object-cover ${mirror ? 'transform scale-x-[-1]' : ''} ${hasCamera ? 'block' : 'hidden'}`}
          style={{
            filter:
              FILTERS.find((f) => f.id === activeFilter)?.css || 'none',
          }}
        />

        {/* Simulated Camera View */}
        {!hasCamera && (
          <div
            className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-tr from-slate-950 to-slate-800 text-white absolute inset-0"
            style={{
              filter:
                FILTERS.find((f) => f.id === activeFilter)?.css ||
                'none',
            }}
          >
            {/* Animated Simulated User Lens */}
            <div className="w-44 h-44 rounded-full border-4 border-dashed border-sage flex items-center justify-center relative animate-spin [animation-duration:15s]">
              <div className="w-36 h-36 rounded-full bg-slate-700 flex items-center justify-center">
                <span className="text-4xl">📸</span>
              </div>
            </div>

            <div className="absolute top-4 left-4 bg-red-600 px-3 py-1 text-xs rounded-full font-mono font-bold tracking-widest animate-pulse flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full bg-white" /> REC
              (SIMULATOR)
            </div>

            <p className="mt-5 text-sm text-[#c9c1b4] font-medium tracking-wide">
              Menggunakan fallback kamera virtual
            </p>
          </div>
        )}

        {/* Countdown Overlay */}
        {countdown >= 0 && (
          <div className="absolute inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center animate-fade-in">
            <div
              className={`text-white text-8xl md:text-9xl font-bold font-display animate-ping [animation-duration:1s] ${
                countdown === 0 ? 'hidden' : ''
              }`}
            >
              {countdown === 0 ? '📸' : countdown}
            </div>
            {countdown === 0 && (
              <div className="text-white text-5xl md:text-7xl font-bold font-display animate-ping [animation-duration:1s]">
                CHEESE!
              </div>
            )}
          </div>
        )}

        {/* Camera flash overlay */}
        {flash && (
          <div className="absolute inset-0 bg-white transition-opacity duration-75 opacity-100" />
        )}
      </div>

      {/* Controls Row */}
      <div className="mt-6 flex gap-4 justify-center items-center w-full">
        {/* Mirror Toggle Button */}
        <button
          onClick={() => setMirror(!mirror)}
          className={`rounded-full px-5 py-2.5 text-xs font-bold transition-all border-2 cursor-pointer ${
            mirror
              ? 'bg-white text-maroon border-maroon hover:bg-[#faf5ec]'
              : 'bg-stone-300 text-stone-600 border-stone-400'
          }`}
        >
          Mirror: {mirror ? 'On' : 'Off'}
        </button>

        {/* Main Trigger Button */}
        {countdown === -1 ? (
          <button
            onClick={() => triggerCaptureSequence(capturingIndex)}
            className="rounded-full bg-[#f43f5e] hover:bg-[#e11d48] px-10 py-3 text-sm font-bold text-white shadow-md transition-all cursor-pointer transform hover:scale-[1.05]"
          >
            START
          </button>
        ) : (
          <div className="px-10 py-3 text-sm font-bold text-maroon bg-white/50 rounded-full animate-pulse border border-line">
            {countdown === 0 ? 'CHEESE! 📸' : `WAIT ${countdown}s`}
          </div>
        )}

        {/* Flash Toggle Button */}
        <button
          onClick={() => setFlashEnabled(!flashEnabled)}
          className={`rounded-full px-5 py-2.5 text-xs font-bold transition-all border-2 cursor-pointer ${
            flashEnabled
              ? 'bg-white text-maroon border-maroon hover:bg-[#faf5ec]'
              : 'bg-stone-300 text-stone-600 border-stone-400'
          }`}
        >
          Flash: {flashEnabled ? 'On' : 'Off'}
        </button>
      </div>

      {/* Filter Selector & Modal Trigger */}
      <div className="mt-8 w-full max-w-md bg-stone-50 border border-line rounded-2xl p-4 shadow-sm">
        <div className="flex items-center justify-between mb-3">
          <div className="text-left">
            <span className="text-[10px] font-bold text-[#8a7f71] uppercase tracking-wider block">
              Filter Aktif
            </span>
            <span className="text-sm font-extrabold text-maroon font-display">
              {FILTERS.find((f) => f.id === activeFilter)?.label ||
                'Normal'}
            </span>
          </div>
          <button
            onClick={() => setIsFilterModalOpen(true)}
            className="rounded-full bg-pink-100 hover:bg-pink-200 text-pink-700 px-4 py-1.5 text-xs font-bold transition-all cursor-pointer flex items-center gap-1 shadow-xs"
          >
            <span>Pilih Filter</span> 🎨
          </button>
        </div>

        {/* Fast-access mini row */}
        <div className="flex gap-2.5 justify-center items-center">
          {FILTERS.slice(0, 5).map((f) => {
            const isActive = activeFilter === f.id;
            return (
              <button
                key={f.id}
                onClick={() => setActiveFilter(f.id)}
                className={`w-9 h-9 rounded-xl overflow-hidden border-2 cursor-pointer transition-all hover:scale-[1.05] relative flex-shrink-0 ${
                  isActive
                    ? 'border-pink-500 scale-[1.08] shadow-xs'
                    : 'border-stone-200'
                }`}
                title={f.label}
              >
                {f.previewType === 'color' ? (
                  <div
                    style={{ background: f.previewBg }}
                    className="w-full h-full"
                  />
                ) : (
                  <img
                    src="https://picsum.photos/id/1060/40/40"
                    style={{ filter: f.css }}
                    className="w-full h-full object-cover"
                    alt={f.label}
                  />
                )}
              </button>
            );
          })}

          {/* More / Ellipsis Button to open full Modal */}
          <button
            onClick={() => setIsFilterModalOpen(true)}
            className="w-9 h-9 rounded-xl border-2 border-dashed border-stone-400 text-stone-600 hover:border-pink-500 hover:text-pink-600 flex items-center justify-center font-bold text-lg cursor-pointer transition-colors flex-shrink-0"
            title="Lihat Semua Filter"
          >
            •••
          </button>
        </div>
      </div>

      {/* CHOOSE A FILTER MODAL */}
      {isFilterModalOpen && (
        <FilterModal
          activeFilter={activeFilter}
          setActiveFilter={setActiveFilter}
          setIsFilterModalOpen={setIsFilterModalOpen}
        />
      )}
    </div>
  );
}
