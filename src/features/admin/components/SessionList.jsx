import { useState } from 'react';
import {
  formatRelativeTime,
  formatExactTime,
  useRelativeTimeTicker,
} from '../../../utils/dateHelper';

export default function SessionList({
  sessions = [],
  customers = [],
  isLoading = false,
}) {
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Build set of existing session IDs
  const existingIds = new Set();
  sessions.forEach((item) => {
    const s = item.photoSession || item.photo_session || item.session || item || {};
    const sid = String(s.id || item.id || item.sessionId || item.session_id || '').trim().toLowerCase();
    if (sid) existingIds.add(sid);
  });

  // Synthesize any missing sessions referenced in customers list
  const missingSessions = [];
  customers.forEach((c) => {
    const cSid = String(c.sessionId || c.session_id || c.photoSessionId || c.photo_session_id || '').trim();
    if (cSid && !existingIds.has(cSid.toLowerCase())) {
      existingIds.add(cSid.toLowerCase());
      missingSessions.push({
        photoSession: {
          id: cSid,
          zipUrl: c.zipUrl || c.zip_url || null,
          createdAt: c.createdAt || c.created_at || new Date().toISOString(),
        },
        customer: c,
        photos: [],
      });
    }
  });

  const allSessionsCombined = [...sessions, ...missingSessions];

  // Sort sessions newest first
  const sortedSessions = [...allSessionsCombined].sort((a, b) => {
    const aSession = a.photoSession || a.photo_session || a.session || a;
    const bSession = b.photoSession || b.photo_session || b.session || b;
    const aDate = new Date(
      aSession.createdAt ||
        aSession.created_at ||
        a.createdAt ||
        a.created_at ||
        a.customer?.createdAt ||
        a.customer?.created_at ||
        0,
    );
    const bDate = new Date(
      bSession.createdAt ||
        bSession.created_at ||
        b.createdAt ||
        b.created_at ||
        b.customer?.createdAt ||
        b.customer?.created_at ||
        0,
    );
    return bDate.getTime() - aDate.getTime();
  });

  const filteredSessions = sortedSessions.filter((item) => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    const sessionId =
      item.photoSession?.id?.toLowerCase() ||
      item.id?.toLowerCase() ||
      '';
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

  // Single lightweight 30-second ticker for live relative time on all cards
  useRelativeTimeTicker(30000);

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
            const session =
              sessionItem.photoSession ||
              sessionItem.photo_session ||
              sessionItem.session ||
              sessionItem ||
              {};

            const sessionId =
              session.id ||
              sessionItem.id ||
              sessionItem.sessionId ||
              sessionItem.session_id ||
              `DSCP_#${idx + 1}`;

            const customer =
              sessionItem.customer ||
              sessionItem.customerData ||
              session.customer ||
              customers.find((c) => {
                if (!c) return false;
                const cSid = String(
                  c.sessionId ||
                    c.session_id ||
                    c.photoSessionId ||
                    c.photo_session_id ||
                    '',
                )
                  .trim()
                  .toLowerCase();
                const sId = String(sessionId).trim().toLowerCase();
                if (cSid && sId && cSid === sId) return true;

                const cId = String(
                  c.id || c.customer_id || c.customerId || '',
                ).trim();
                const sCid = String(
                  session.customer_id ||
                    session.customerId ||
                    sessionItem.customer_id ||
                    sessionItem.customerId ||
                    '',
                ).trim();
                if (cId && sCid && cId === sCid) return true;

                return false;
              }) ||
              {};
            // Strict 1-to-1 photo matching for each session folder based on Supabase photos table
            const targetId = String(sessionId).trim().toLowerCase();
            let directPhotos =
              sessionItem.photos ||
              sessionItem.photoSession?.photos ||
              session.photos ||
              [];

            // Filter direct photos by session_id/folder_name if present
            let resolvedPhotos = directPhotos.filter((p) => {
              if (!p) return false;
              const pSid = String(
                p.session_id || p.sessionId || p.folder_name || p.folderName || '',
              )
                .trim()
                .toLowerCase();
              return !pSid || pSid === targetId;
            });

            // If empty, search across all session items for photos matching this session_id/folder_name exactly
            if (resolvedPhotos.length === 0) {
              const matched = [];
              for (const item of sessions) {
                const list =
                  item.photos ||
                  item.photoSession?.photos ||
                  item.session?.photos ||
                  [];
                for (const p of list) {
                  if (!p) continue;
                  const pSid = String(
                    p.session_id ||
                      p.sessionId ||
                      p.folder_name ||
                      p.folderName ||
                      '',
                  )
                    .trim()
                    .toLowerCase();
                  if (pSid === targetId) {
                    matched.push(p);
                  }
                }
              }
              if (matched.length > 0) {
                resolvedPhotos = matched;
              }
            }

            const rawDate =
              session.createdAt ||
              session.created_at ||
              session.created_time ||
              session.timestamp ||
              sessionItem.createdAt ||
              sessionItem.created_at ||
              sessionItem.created_time ||
              sessionItem.timestamp ||
              customer.createdAt ||
              customer.created_at ||
              customer.created_time ||
              resolvedPhotos[0]?.createdAt ||
              resolvedPhotos[0]?.created_at ||
              resolvedPhotos[0]?.timestamp ||
              resolvedPhotos[resolvedPhotos.length - 1]?.createdAt ||
              resolvedPhotos[resolvedPhotos.length - 1]?.created_at;

            const zipUrl =
              session.zipUrl ||
              session.zip_url ||
              sessionItem.zipUrl ||
              sessionItem.zip_url;

            const customerName =
              customer.name ||
              customer.nama ||
              customer.customer_name ||
              customer.fullName;
            const customerEmail = customer.email;
            const customerNpm = customer.npm;
            const customerMajor = customer.major || customer.jurusan;
            const customerInsta =
              customer.instagramUsername ||
              customer.instagram_username ||
              customer.instagram;
            const customerPhone =
              customer.phoneNumber ||
              customer.phone_number ||
              customer.phone ||
              customer.hp;

            const hasCustomerData = Boolean(
              customerName || customerEmail || customerNpm,
            );

            return (
              <div
                key={sessionId}
                className="p-5 sm:p-6 rounded-2xl bg-white/80 border border-line/80 backdrop-blur-md shadow-xs hover:shadow-md transition-all space-y-4"
              >
                {/* Session Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-line/50">
                  <div className="flex items-center gap-3">
                    <span className="px-3 py-1 rounded-pill bg-maroon/10 text-maroon font-mono text-xs font-bold border border-maroon/20">
                      ID: {sessionId}
                    </span>
                    <span
                      className="text-xs text-[#7a7266] flex items-center gap-1.5 font-mono relative group/time cursor-default"
                      title={formatExactTime(rawDate)}
                    >
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
                      {formatRelativeTime(rawDate)}
                      {/* Tooltip with exact time on hover */}
                      <span className="absolute left-0 -bottom-8 z-50 hidden group-hover/time:block px-2.5 py-1 rounded-lg bg-ink text-white text-[10px] font-sans whitespace-nowrap shadow-lg pointer-events-none">
                        {formatExactTime(rawDate)}
                      </span>
                    </span>
                  </div>

                  {zipUrl ? (
                    <a
                      href={zipUrl}
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
                {hasCustomerData ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 p-3.5 rounded-xl bg-sidebar/50 text-xs">
                    <div>
                      <span className="text-[10px] uppercase font-bold text-[#a79c8c] block">
                        Nama Pelanggan
                      </span>
                      <span className="font-semibold text-ink">
                        {customerName || '-'}
                      </span>
                    </div>
                    <div>
                      <span className="text-[10px] uppercase font-bold text-[#a79c8c] block">
                        Email
                      </span>
                      <span className="font-medium text-terracotta">
                        {customerEmail || '-'}
                      </span>
                    </div>
                    <div>
                      <span className="text-[10px] uppercase font-bold text-[#a79c8c] block">
                        NPM & Jurusan
                      </span>
                      <span className="text-ink">
                        {customerNpm || '-'}{' '}
                        {customerMajor ? `• ${customerMajor}` : ''}
                      </span>
                    </div>
                    <div>
                      <span className="text-[10px] uppercase font-bold text-[#a79c8c] block">
                        Instagram / HP
                      </span>
                      <span className="text-ink">
                        {customerInsta
                          ? `@${customerInsta.replace(/^@/, '')}`
                          : customerPhone || '-'}
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
                    Foto Terambil ({resolvedPhotos.length})
                  </span>
                  {resolvedPhotos.length === 0 ? (
                    <p className="text-xs text-[#a79c8c] italic">
                      Tidak ada file foto.
                    </p>
                  ) : (
                    <div className="flex flex-wrap gap-3">
                      {resolvedPhotos.map((photo, pIdx) => {
                        const rawUrl =
                          typeof photo === 'string'
                            ? photo
                            : photo.fileUrl ||
                              photo.file_url ||
                              photo.url ||
                              photo.src ||
                              photo.path ||
                              '';

                        const pUrl =
                          !rawUrl
                            ? ''
                            : rawUrl.startsWith('http://') ||
                              rawUrl.startsWith('https://') ||
                              rawUrl.startsWith('data:')
                            ? rawUrl
                            : `https://qwbybpyffkrucmzvwls.supabase.co/storage/v1/object/public/dsc-photobox-storage/${rawUrl.replace(/^\//, '')}`;

                        const pName =
                          typeof photo === 'string'
                            ? `Foto ${pIdx + 1}`
                            : photo.fileName ||
                              photo.file_name ||
                              photo.name ||
                              `Foto ${pIdx + 1}`;

                        return (
                          <div
                            key={photo.id || pIdx}
                            onClick={() => setSelectedPhoto(pUrl)}
                            className="relative group w-20 h-24 sm:w-24 sm:h-28 rounded-xl overflow-hidden border border-line bg-cream shadow-xs cursor-pointer hover:border-terracotta transition-all"
                          >
                            <img
                              src={pUrl}
                              alt={pName}
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
                        );
                      })}
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
