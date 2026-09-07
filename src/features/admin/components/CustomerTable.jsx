import { useState } from 'react';
import {
  formatRelativeTime,
  formatExactTime,
  useRelativeTimeTicker,
  resolveSessionTimestamp,
} from '../../../utils/dateHelper';

export default function CustomerTable({ customers = [], isLoading = false, onSearchChange, searchEmail = '' }) {
  const [localSearch, setLocalSearch] = useState(searchEmail);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (onSearchChange) {
      onSearchChange(localSearch);
    }
  };

  const handleClear = () => {
    setLocalSearch('');
    if (onSearchChange) {
      onSearchChange('');
    }
  };

  // Single adaptive ticker for live relative time on all table rows
  const now = useRelativeTimeTicker();

  if (isLoading) {
    return (
      <div className="p-6 rounded-2xl bg-white/70 border border-line space-y-3 animate-pulse">
        <div className="h-8 bg-gray-200 rounded w-1/3 mb-4" />
        {[1, 2, 3, 4].map((n) => (
          <div key={n} className="h-10 bg-gray-200 rounded w-full" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Search Filter Header */}
      <form onSubmit={handleSearchSubmit} className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
        <div className="relative flex-1 max-w-md">
          <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#a79c8c] pointer-events-none">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </span>
          <input
            type="text"
            value={localSearch}
            onChange={(e) => setLocalSearch(e.target.value)}
            placeholder="Filter berdasarkan email pelanggan..."
            className="w-full pl-10 pr-8 py-2.5 text-xs sm:text-sm rounded-xl border border-line bg-white/80 text-ink placeholder-[#a79c8c] focus:outline-none focus:border-terracotta focus:ring-2 focus:ring-terracotta/20 transition-all"
          />
          {localSearch && (
            <button
              type="button"
              onClick={handleClear}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-ink/50 hover:text-ink cursor-pointer"
            >
              ✕
            </button>
          )}
        </div>
        <button
          type="submit"
          className="px-4 py-2.5 rounded-xl bg-terracotta hover:bg-terracotta-dark text-white font-bold text-xs shadow-xs transition-colors cursor-pointer"
        >
          Cari Pelanggan
        </button>
      </form>

      {/* Customer Data Table */}
      <div className="overflow-x-auto rounded-2xl border border-line/80 bg-white/80 backdrop-blur-md shadow-xs">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-line/80 bg-sidebar/60 text-[11px] font-mono uppercase tracking-wider text-ink/70">
              <th className="py-3.5 px-4 font-bold">No</th>
              <th className="py-3.5 px-4 font-bold">Nama Lengkap</th>
              <th className="py-3.5 px-4 font-bold">Email</th>
              <th className="py-3.5 px-4 font-bold">NPM</th>
              <th className="py-3.5 px-4 font-bold">Jurusan</th>
              <th className="py-3.5 px-4 font-bold">Instagram</th>
              <th className="py-3.5 px-4 font-bold">No HP</th>
              <th className="py-3.5 px-4 font-bold">Waktu Daftar</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line/40 text-xs text-ink">
            {customers.length === 0 ? (
              <tr>
                <td colSpan={8} className="py-10 text-center text-[#7a7266]">
                  <p className="font-semibold">Tidak ada data pelanggan ditemukan.</p>
                </td>
              </tr>
            ) : (
              customers.map((c, index) => {
                const name = c.name || c.nama || '-';
                const major = c.major || c.jurusan || '-';
                const customerDate = resolveSessionTimestamp(
                  c.sessionId || c.session_id || c.photoSessionId || c.id,
                  c.createdAt || c.created_at,
                );
                return (
                  <tr key={c.id || index} className="hover:bg-cream/50 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-bold text-[#a79c8c]">{index + 1}</td>
                    <td className="py-3.5 px-4 font-semibold text-maroon">{name}</td>
                    <td className="py-3.5 px-4 font-medium text-terracotta">{c.email || '-'}</td>
                    <td className="py-3.5 px-4 font-mono">{c.npm || '-'}</td>
                    <td className="py-3.5 px-4">{major}</td>
                    <td className="py-3.5 px-4 text-[#7a7266]">
                      {c.instagramUsername ? `@${c.instagramUsername.replace(/^@/, '')}` : '-'}
                    </td>
                    <td className="py-3.5 px-4 font-mono text-[#7a7266]">{c.phoneNumber || '-'}</td>
                    <td className="py-3.5 px-4 text-[#7a7266]">
                      <div
                        className="relative group/ctime cursor-default flex flex-col font-mono text-[11px]"
                        title={formatExactTime(customerDate)}
                      >
                        <span className="font-semibold text-terracotta flex items-center gap-1">
                          <svg
                            className="w-3 h-3 text-terracotta shrink-0 animate-pulse"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth={2}
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                          </svg>
                          {formatRelativeTime(customerDate, now)}
                        </span>
                        <span className="text-[10px] text-[#a79c8c] whitespace-nowrap">
                          {formatExactTime(customerDate)}
                        </span>
                        <span className="absolute left-0 -bottom-7 z-50 hidden group-hover/ctime:block px-2.5 py-1 rounded-lg bg-ink text-white text-[10px] font-sans whitespace-nowrap shadow-lg pointer-events-none">
                          {formatExactTime(customerDate)}
                        </span>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
