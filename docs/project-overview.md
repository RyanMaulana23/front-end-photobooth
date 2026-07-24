# DSC Photobox — Project Overview

DSC Photobox adalah aplikasi **photobooth digital** yang dikembangkan oleh Developer Student Club (DSC). Sistem ini memungkinkan pengguna untuk melakukan sesi foto interaktif langsung di browser, memilih template bingkai, menerapkan filter warna, lalu menerima hasilnya melalui email maupun mencetak langsung.

---

## Tujuan Proyek

- Menyediakan pengalaman photobooth modern berbasis web yang dapat diakses dari laptop/PC tanpa aplikasi tambahan.
- Mengotomasi proses upload foto ke cloud storage, pengiriman email, dan pencetakan hardcopy.
- Menyediakan dashboard admin untuk memantau semua sesi foto dan data pelanggan.

---

## Tech Stack

### Frontend (`front-end-photobooth`)

| Teknologi        | Versi | Fungsi                                                         |
| ---------------- | ----- | -------------------------------------------------------------- |
| React            | 19    | UI Library                                                     |
| Vite             | 8     | Build tool & dev server                                        |
| Tailwind CSS     | 4     | Utility-first styling                                          |
| React Router DOM | 7     | Client-side routing                                            |
| Axios            | 1     | HTTP client ke backend API                                     |
| TanStack Query   | 5     | Server state management (data fetching, caching, sinkronisasi) |
| React Hook Form  | 7     | Form state management yang performant                          |
| Zod              | 3     | Validasi schema data di sisi client                            |

> [!IMPORTANT]
> **TanStack Query, React Hook Form, dan Zod adalah dependency wajib** untuk semua fitur baru di frontend. Lihat [coding-standard.md](./coding-standard.md#3-standar-penggunaan-library-wajib) untuk panduan penggunaannya.

### Backend (`api-backend-bun`)

| Teknologi                 | Versi  | Fungsi                               |
| ------------------------- | ------ | ------------------------------------ |
| Bun                       | latest | JavaScript runtime & package manager |
| Express                   | 5      | HTTP framework                       |
| TypeScript                | 5      | Type-safe development                |
| Drizzle ORM               | 1 RC   | Type-safe database queries           |
| PostgreSQL (via Supabase) | –      | Database utama                       |
| Supabase Auth             | –      | Autentikasi admin berbasis JWT       |
| Supabase Storage          | –      | Penyimpanan file foto & ZIP          |
| Redis (ioredis)           | –      | Cache layer (TTL-based)              |
| Zod                       | 4      | Validasi input request               |
| Pino                      | –      | Structured logging                   |
| Swagger UI                | –      | Dokumentasi API interaktif           |
| Docker + Compose          | –      | Containerisasi deployment            |

---

## Fitur Utama

### Alur Pelanggan (Frontend)

1. **Pilih Template** — 5 pilihan bingkai foto (Watercolor Owl, Cloud Kitty, Space Astronaut, Good Vibes, Moment Captured)
2. **Sesi Foto** — Ambil foto menggunakan webcam dengan countdown timer, flash, filter real-time, dan opsi mirror
3. **Preview & Retake** — Pratinjau semua foto; ulangi slot tertentu jika tidak puas
4. **Edit Decision** — Memilih antara mengirim ulang, menambahkan filter, atau melanjutkan
5. **Input Data** — Isi form (Nama, NPM, Email, No HP, Jurusan, Instagram)
6. **Processing** — Foto dikirim ke backend, strip dicompile dan dikirim via email
7. **Email Success** — Konfirmasi pengiriman email
8. **Print Hardcopy** — Opsi cetak fisik
9. **Thank You** — Countdown auto-reset ke halaman awal

### Fitur Admin (Backend)

- Login/logout dengan Supabase Auth + JWT
- Melihat semua data pelanggan (dengan filter by email)
- Melihat semua sesi foto beserta foto-foto dan data pelanggannya
- Cache Redis untuk performa tinggi pada query berulang

### Galeri (Frontend)

- Halaman showcase hasil foto pelanggan secara acak
- Dual infinite marquee display (dua baris berlawanan arah)
- Auto-pause saat hover

---

## API Base URL

| Environment | URL                                                |
| ----------- | -------------------------------------------------- |
| Development | `http://localhost:3000/api`                        |
| Production  | Sesuai konfigurasi `BASE_URL` di `.env.production` |

Dokumentasi API interaktif tersedia di `/api-docs` (Swagger UI).
