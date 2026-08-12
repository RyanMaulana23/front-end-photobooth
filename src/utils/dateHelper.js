import { useState, useEffect } from 'react';

/**
 * Formats a timestamp into Indonesian relative time string
 * - < 1 minute -> "Baru saja"
 * - 1-59 minutes -> "X menit lalu"
 * - 1-23 hours -> "X jam lalu"
 * - 1-6 days -> "X hari lalu"
 * - > 7 days -> "11 Agu 2026, 00.58"
 */
export function formatRelativeTime(dateInput) {
  if (!dateInput) return 'Baru saja';
  const date = new Date(dateInput);
  if (isNaN(date.getTime())) return String(dateInput);

  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  // Future timestamp fallback
  if (diffInSeconds < 0) return 'Baru saja';

  // < 1 minute (60 seconds)
  if (diffInSeconds < 60) {
    return 'Baru saja';
  }

  // 1–59 minutes
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) {
    return `${diffInMinutes} menit lalu`;
  }

  // 1–23 hours
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) {
    return `${diffInHours} jam lalu`;
  }

  // 1–6 days
  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 7) {
    return `${diffInDays} hari lalu`;
  }

  // > 7 days -> Full date format, e.g. "11 Agu 2026, 00.58"
  return new Intl.DateTimeFormat('id-ID', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
}

/**
 * Formats exact timestamp for hover tooltips (e.g. "11 Agustus 2026, 00:58:32")
 */
export function formatExactTime(dateInput) {
  if (!dateInput) return 'Waktu tidak diketahui';
  const date = new Date(dateInput);
  if (isNaN(date.getTime())) return String(dateInput);

  return new Intl.DateTimeFormat('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  }).format(date);
}

/**
 * Shared hook to trigger periodic tick every intervalMs (default 30 seconds)
 * Ensures a single lightweight timer updates all list timestamps concurrently.
 */
export function useRelativeTimeTicker(intervalMs = 30000) {
  const [, setTick] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setTick((t) => t + 1);
    }, intervalMs);
    return () => clearInterval(timer);
  }, [intervalMs]);
}
