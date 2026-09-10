import { useState, useEffect } from 'react';

export const WIB_TIMEZONE = 'Asia/Jakarta';

/**
 * Formats time in WIB "HH:mm" (e.g. "14:30")
 */
function formatWibTime(date) {
  return new Intl.DateTimeFormat('id-ID', {
    timeZone: WIB_TIMEZONE,
    hour: '2-digit',
    minute: '2-digit',
    hourCycle: 'h23',
  })
    .format(date)
    .replace(/\./g, ':');
}

/**
 * Formats full date in WIB "d MMMM yyyy, HH:mm" (e.g. "6 September 2026, 14:30")
 */
function formatWibFull(date) {
  const dateStr = new Intl.DateTimeFormat('id-ID', {
    timeZone: WIB_TIMEZONE,
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(date);

  const timeStr = formatWibTime(date);
  return `${dateStr}, ${timeStr}`;
}

/**
 * Returns midnight UTC timestamp for this calendar date in WIB (Asia/Jakarta)
 */
function getWibYMD(date) {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone: WIB_TIMEZONE,
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
  }).formatToParts(date);

  const y = parseInt(parts.find((p) => p.type === 'year')?.value || '1970', 10);
  const m = parseInt(parts.find((p) => p.type === 'month')?.value || '1', 10);
  const d = parseInt(parts.find((p) => p.type === 'day')?.value || '1', 10);

  return Date.UTC(y, m - 1, d);
}

/**
 * Formats a timestamp into Indonesian relative time string
 * - < 10 seconds -> "Baru saja"
 * - 10 seconds to < 1 minute -> "Baru saja"
 * - 1 minute -> "1 menit yang lalu"
 * - > 1 minute -> "X menit yang lalu"
 * - 1 hour or more -> "1 jam yang lalu" / "X jam yang lalu"
 * - Yesterday (in WIB calendar) -> "Kemarin, HH:mm"
 * - > 1 day (< 7 days) -> "X hari yang lalu"
 * - Very old (>= 7 days) -> "d MMMM yyyy, HH:mm" (e.g. "6 September 2026, 14:30")
 *
 * @param {string|number|Date} dateInput - Timestamp from API
 * @param {number|Date} [nowInput=Date.now()] - Current time reference (for synchronous ticker)
 * @returns {string} - Formatted relative time in Indonesian (WIB)
 */
export function formatRelativeTime(dateInput, nowInput = Date.now()) {
  if (!dateInput) return 'Baru saja';
  const date = new Date(dateInput);
  if (isNaN(date.getTime())) return String(dateInput);

  const now = new Date(nowInput);
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  // Future timestamp or clock skew fallback
  if (diffInSeconds < 0) return 'Baru saja';

  // < 1 minute (< 60 seconds)
  if (diffInSeconds < 60) {
    return 'Baru saja';
  }

  // 1–59 minutes
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes === 1) {
    return '1 menit yang lalu';
  }
  if (diffInMinutes < 60) {
    return `${diffInMinutes} menit yang lalu`;
  }

  // Calculate calendar day difference in WIB
  const targetMidnight = getWibYMD(date);
  const nowMidnight = getWibYMD(now);
  const dayDiff = Math.round(
    (nowMidnight - targetMidnight) / (24 * 60 * 60 * 1000),
  );

  // Today (same day in WIB)
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (dayDiff === 0 && diffInHours < 24) {
    if (diffInHours === 1) {
      return '1 jam yang lalu';
    }
    return `${diffInHours} jam yang lalu`;
  }

  // Yesterday in WIB
  if (dayDiff === 1) {
    return `Kemarin, ${formatWibTime(date)}`;
  }

  // 2–6 days ago
  if (dayDiff > 1 && dayDiff < 7) {
    return `${dayDiff} hari yang lalu`;
  }

  // >= 7 days ago -> Full date and time in WIB
  return formatWibFull(date);
}

/**
 * Formats exact timestamp with WIB timezone label
 * e.g. "7 September 2026, 13:30:15 WIB"
 * Never returns 'Waktu tidak diketahui' by falling back to current frontend time.
 */
export function formatExactTime(dateInput) {
  const date = dateInput ? new Date(dateInput) : new Date();
  const validDate = isNaN(date.getTime()) ? new Date() : date;

  const dateStr = new Intl.DateTimeFormat('id-ID', {
    timeZone: WIB_TIMEZONE,
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(validDate);

  const timeStr = new Intl.DateTimeFormat('id-ID', {
    timeZone: WIB_TIMEZONE,
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hourCycle: 'h23',
  })
    .format(validDate)
    .replace(/\./g, ':');

  return `${dateStr}, ${timeStr} WIB`;
}

/**
 * Formats full real-time date and time (tahun, bulan, tanggal, jam, menit, detik)
 */
export function formatFullDateTime(dateInput) {
  return formatExactTime(dateInput);
}

const SESSION_STORAGE_KEY = 'dsc_session_timestamps';

/**
 * Saves a real-time timestamp when email sending is triggered in photobooth
 * @param {string} sessionId
 * @param {string} [timestamp=new Date().toISOString()]
 * @returns {string}
 */
export function saveSessionTriggerTime(
  sessionId,
  timestamp = new Date().toISOString(),
) {
  if (!sessionId) return timestamp;
  try {
    const raw = localStorage.getItem(SESSION_STORAGE_KEY);
    const map = raw ? JSON.parse(raw) : {};
    if (!map[sessionId]) {
      map[sessionId] = timestamp;
      localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(map));
      window.dispatchEvent(
        new CustomEvent('dsc_session_timestamp_updated', {
          detail: { sessionId, timestamp },
        }),
      );
    }
    return map[sessionId];
  } catch {
    return timestamp;
  }
}

/**
 * Gets the trigger timestamp for a session
 * @param {string} sessionId
 * @returns {string|null}
 */
export function getSessionTriggerTime(sessionId) {
  if (!sessionId) return null;
  try {
    const raw = localStorage.getItem(SESSION_STORAGE_KEY);
    const map = raw ? JSON.parse(raw) : {};
    return map[sessionId] || null;
  } catch {
    return null;
  }
}

/**
 * Resolves the accurate session timestamp with frontend fallback
 * @param {string} sessionId
 * @param {string|number|Date} [rawDate]
 * @returns {string} ISO Date string
 */
export function resolveSessionTimestamp(sessionId, rawDate) {
  if (rawDate) {
    const d = new Date(rawDate);
    if (!isNaN(d.getTime())) return d.toISOString();
  }
  const saved = getSessionTriggerTime(sessionId);
  if (saved) return saved;

  const fallback = new Date().toISOString();
  if (sessionId) {
    saveSessionTriggerTime(sessionId, fallback);
  }
  return fallback;
}

/**
 * Shared hook to trigger periodic relative time updates every 1 second in real time.
 * @param {Array<string|number|Date>} [_timestamps=[]] - Optional list of timestamps
 * @returns {number} - current timestamp in ms for triggering re-renders
 */
export function useRelativeTimeTicker() {
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    const timer = setInterval(() => {
      setNow(Date.now());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return now;
}

/**
 * Reusable hook for a single timestamp
 *
 * @param {string|number|Date} dateInput
 * @returns {string} - Formatted relative waktu Indonesian (WIB)
 */
export function useRelativeTime(dateInput) {
  const now = useRelativeTimeTicker(dateInput ? [dateInput] : []);
  return formatRelativeTime(dateInput, now);
}
