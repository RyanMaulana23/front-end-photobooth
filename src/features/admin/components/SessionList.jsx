import { useState } from 'react';

export default function SessionList({ sessions = [], isLoading = false }) {
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  console.log({ sessions });

  const filteredSessions = sessions.filter((item) => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    const sessionId = item.photoSession?.id?.toLowerCase() || '';
    const customerName =
      item.customer?.name?.toLowerCase() ||
      item.customer?.nama?.toLowerCase() ||
      '';
    const customerEmail = item.customer?.email?.toLowerCase() || '';
    return (
      sessionId.includes(query) ||
      customerName.includes(query) ||
      customerEmail.includes(query)
    );
  });

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    try {
      const date = new Date(dateString);
      return new Intl.DateTimeFormat('id-ID', {
        dateStyle: 'medium',
        timeStyle: 'short',
      }).format(date);
    } catch {
      return dateString;
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((n) => (
          <div
            key={n}
            className="p-6 rounded-2xl bg-white/70 border border-line animate-pulse space-y-4"
          >
            <div className="h-6 bg-gray-200 rounded w-1/4" />
            <div className="h-4 bg-gray-200 rounded w-1/2" />
            <div className="flex gap-3 pt-2">
              <div className="w-20 h-20 bg-gray-200 rounded-lg" />
              <div className="w-20 h-20 bg-gray-200 rounded-lg" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Filter & Search Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#a79c8c] pointer-events-none">
            <svg
              className="w-4 h-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </span>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari berdasarkan ID Sesi, Nama, atau Email..."
            className="w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm rounded-xl border border-line bg-white/80 text-ink placeholder-[#a79c8c] focus:outline-none focus:border-terracotta focus:ring-2 focus:ring-terracotta/20 transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-ink/50 hover:text-ink cursor-pointer"
            >
              ✕
            </button>
          )}
        </div>
        <div className="text-xs font-mono text-[#7a7266]">
          Menampilkan{' '}
          <span className="font-bold text-maroon">
            {filteredSessions.length}
          </span>{' '}
          dari {sessions.length} Sesi Foto
        </div>
      </div>

      {/* Sessions Cards Container */}
      {filteredSessions.length === 0 ? (
        <div className="p-12 text-center rounded-2xl bg-white/50 border border-line/60 space-y-3">
          <div className="w-12 h-12 rounded-full bg-coral/15 text-terracotta flex items-center justify-center mx-auto">
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
          </div>
          <h3 className="text-sm font-bold text-maroon font-display">
            Tidak Ada Sesi Foto Ditemukan
          </h3>
          <p className="text-xs text-[#7a7266] max-w-sm mx-auto">
            {searchQuery
              ? 'Coba ubah kata kunci pencarian Anda.'
              : 'Belum ada sesi foto yang tersimpan di server.'}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredSessions.map((sessionItem, idx) => {
            const session = sessionItem.photoSession || {};
            const customer = sessionItem.customer || {};
            const photos = sessionItem.photos || [];

            return (
              <div
                key={session.id || idx}
                className="p-5 sm:p-6 rounded-2xl bg-white/80 border border-line/80 backdrop-blur-md shadow-xs hover:shadow-md transition-all space-y-4"
              >
                {/* Session Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-line/50">
                  <div className="flex items-center gap-3">
                    <span className="px-3 py-1 rounded-pill bg-maroon/10 text-maroon font-mono text-xs font-bold border border-maroon/20">
                      ID: {session.id || 'DSCP_N/A'}
                    </span>
                    <span className="text-xs text-[#7a7266] flex items-center gap-1.5 font-mono">
                      <svg
                        className="w-3.5 h-3.5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={1.8}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                      {formatDate(session.createdAt)}
                    </span>
                  </div>

                  {session.zipUrl ? (
                    <a
                      href={session.zipUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-terracotta/10 hover:bg-terracotta text-terracotta hover:text-white border border-terracotta/20 text-xs font-bold transition-all decoration-none w-fit cursor-pointer"
                    >
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                        />
                      </svg>
                      <span>Unduh Arsip ZIP</span>
                    </a>
                  ) : (
                    <span className="text-[11px] text-[#a79c8c] italic">
                      Arsip ZIP belum tersedia
                    </span>
                  )}
                </div>

                {/* Customer Details Row */}
                {customer &&
                (customer.name || customer.nama || customer.email) ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 p-3.5 rounded-xl bg-sidebar/50 text-xs">
                    <div>
                      <span className="text-[10px] uppercase font-bold text-[#a79c8c] block">
                        Nama Pelanggan
                      </span>
                      <span className="font-semibold text-ink">
                        {customer.name || customer.nama || '-'}
                      </span>
                    </div>
                    <div>
                      <span className="text-[10px] uppercase font-bold text-[#a79c8c] block">
                        Email
                      </span>
                      <span className="font-medium text-terracotta">
                        {customer.email || '-'}
                      </span>
                    </div>
                    <div>
                      <span className="text-[10px] uppercase font-bold text-[#a79c8c] block">
                        NPM & Jurusan
                      </span>
                      <span className="text-ink">
                        {customer.npm || '-'}{' '}
                        {customer.major || customer.jurusan
                          ? `• ${customer.major || customer.jurusan}`
                          : ''}
                      </span>
                    </div>
                    <div>
                      <span className="text-[10px] uppercase font-bold text-[#a79c8c] block">
                        Instagram / HP
                      </span>
                      <span className="text-ink">
                        {customer.instagramUsername
                          ? `@${customer.instagramUsername}`
                          : customer.phoneNumber || '-'}
                      </span>
                    </div>
                  </div>
                ) : (
                  <div className="text-xs text-[#a79c8c] italic">
                    Belum ada data pelanggan yang terikat ke sesi ini.
                  </div>
                )}

                {/* Photos Thumbnails */}
                <div>
                  <span className="text-xs font-bold text-ink/80 block mb-2 font-mono uppercase tracking-wider">
                    Foto Terambil ({photos.length})
                  </span>
                  {photos.length === 0 ? (
                    <p className="text-xs text-[#a79c8c] italic">
                      Tidak ada file foto.
                    </p>
                  ) : (
                    <div className="flex flex-wrap gap-3">
                      {photos.map((photo, pIdx) => (
                        <div
                          key={photo.id || pIdx}
                          onClick={() => setSelectedPhoto(photo.fileUrl)}
                          className="relative group w-20 h-24 sm:w-24 sm:h-28 rounded-xl overflow-hidden border border-line bg-cream shadow-xs cursor-pointer hover:border-terracotta transition-all"
                        >
                          <img
                            src={photo.fileUrl}
                            alt={photo.fileName || `Foto ${pIdx + 1}`}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                            loading="lazy"
                          />
                          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white">
                            <svg
                              className="w-5 h-5"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                              strokeWidth={2}
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7"
                              />
                            </svg>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Image Preview Modal */}
      {selectedPhoto && (
        <div
          onClick={() => setSelectedPhoto(null)}
          className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in"
        >
          <div className="relative max-w-3xl max-h-[85vh] bg-white rounded-2xl p-2 shadow-2xl overflow-hidden">
            <button
              onClick={() => setSelectedPhoto(null)}
              className="absolute top-4 right-4 z-10 w-8 h-8 rounded-full bg-black/60 text-white flex items-center justify-center text-sm font-bold hover:bg-black transition-colors cursor-pointer"
            >
              ✕
            </button>
            <img
              src={selectedPhoto}
              alt="Preview"
              className="w-auto h-auto max-h-[80vh] rounded-xl object-contain mx-auto"
            />
          </div>
        </div>
      )}
    </div>
  );
}
