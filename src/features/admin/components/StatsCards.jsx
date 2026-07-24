export default function StatsCards({
  totalSessions = 0,
  totalCustomers = 0,
  totalPhotos = 0,
  isLoading = false,
}) {
  const stats = [
    {
      id: 'sessions',
      title: 'Total Sesi Foto',
      value: totalSessions,
      unit: 'Sesi',
      color:
        'from-terracotta/15 to-coral/10 text-terracotta border-terracotta/20',
      icon: (
        <svg
          className="w-6 h-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={1.8}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
          />
        </svg>
      ),
    },
    {
      id: 'customers',
      title: 'Pelanggan Terdaftar',
      value: totalCustomers,
      unit: 'Orang',
      color: 'from-sage/20 to-emerald-500/10 text-emerald-800 border-sage/30',
      icon: (
        <svg
          className="w-6 h-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={1.8}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
          />
        </svg>
      ),
    },
    {
      id: 'photos',
      title: 'Foto Tersimpan',
      value: totalPhotos,
      unit: 'File PNG',
      color:
        'from-amber-500/15 to-orange-500/10 text-amber-800 border-amber-500/20',
      icon: (
        <svg
          className="w-6 h-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={1.8}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
          />
        </svg>
      ),
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      {stats.map((stat) => (
        <div
          key={stat.id}
          className={`relative p-5 rounded-2xl bg-linear-to-br border backdrop-blur-md shadow-sm transition-all duration-300 hover:shadow-md hover:-translate-y-0.5 ${stat.color}`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider opacity-80 font-mono">
              {stat.title}
            </span>
            <div className="p-2 rounded-xl bg-white/60 shadow-xs">
              {stat.icon}
            </div>
          </div>

          <div className="mt-4 flex items-baseline gap-2">
            {isLoading ? (
              <div className="h-8 w-20 bg-black/10 rounded-lg animate-pulse" />
            ) : (
              <span className="text-3xl font-extrabold font-display leading-none tracking-tight">
                {stat.value}
              </span>
            )}
            <span className="text-xs font-semibold opacity-75">
              {stat.unit}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}
