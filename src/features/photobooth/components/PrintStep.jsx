export default function PrintStep({
  printingProgress,
  template,
  LAYOUT_CONFIGS,
}) {
  return (
    <div className="w-full max-w-md text-center flex flex-col items-center justify-center animate-fade-in py-8">
      {/* Animated Printer */}
      <div className="w-48 h-48 relative flex items-end justify-center mb-8 border-b-8 border-slate-700">
        {/* Printer Body */}
        <div className="w-40 h-24 bg-slate-800 rounded-t-xl relative border-t-4 border-slate-600 flex items-center justify-center">
          {/* Paper slit */}
          <div className="absolute top-2 w-28 h-1.5 bg-black rounded" />
          <div className="absolute bottom-4 w-3 h-3 rounded-full bg-green-500 animate-ping" />
          <div className="absolute bottom-4 w-3 h-3 rounded-full bg-green-600" />
        </div>

        {/* Printing Photo Strip sliding down */}
        <div
          className="absolute left-1/2 transform -translate-x-1/2 bg-white border border-slate-300 w-14 overflow-hidden rounded shadow-md transition-all duration-100"
          style={{
            top: `${40 - printingProgress * 0.4}%`, // adjust vertical position
            height: `${printingProgress * 0.8}px`, // grows as progress bar moves
            clipPath: 'inset(0px 0px 0px 0px)',
            aspectRatio:
              template === 'layout1'
                ? '788/1182'
                : template === 'layout2'
                  ? '473/1340'
                  : '394/1182',
          }}
        >
          <img
            src={LAYOUT_CONFIGS[template]?.image}
            className="w-full h-full object-cover"
            alt="printing mockup"
          />
        </div>
      </div>

      <h2 className="text-2xl font-bold text-maroon mb-2 font-display">
        Sedang Mencetak Strip Hardcopy...
      </h2>
      <p className="text-sm text-[#7a7266] mb-6 max-w-xs">
        Tinta sedang disemprotkan ke kertas glossy premium photobooth.
      </p>

      <div className="w-full bg-line h-4 rounded-full overflow-hidden">
        <div
          className="h-full bg-terracotta transition-all duration-100 rounded-full"
          style={{ width: `${printingProgress}%` }}
        />
      </div>
      <span className="text-xs font-semibold text-[#8a7f71] mt-2">
        Progress Cetak: {printingProgress}%
      </span>
    </div>
  );
}
