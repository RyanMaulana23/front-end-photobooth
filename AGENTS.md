# Guidelines & Rules untuk AI Coding Assistant (AGENTS.md)

File ini berisi instruksi dan panduan wajib bagi AI Agent yang bekerja di repositori `front-end-photobooth`. Semua perubahan kode, refaktorisasi, dan penambahan fitur HARUS mematuhi pedoman ini.

---

## 🧠 1. Mindset & Cara Berpikir (Thinking Process)

- **Baca Dokumen Sebelum Bertindak**: Sebelum membuat atau mengubah kode, WAJIB membaca dokumentasi yang relevan di folder [`docs/`](./docs/):
  - [`project-overview.md`](./docs/project-overview.md) — Konteks proyek & tech stack.
  - [`architecture.md`](./docs/architecture.md) — Arsitektur sistem & aliran data.
  - [`folder-structure.md`](./docs/folder-structure.md) — Lokasi file & konvensi penamaan.
  - [`coding-standard.md`](./docs/coding-standard.md) — Standar penulisan & validasi.
  - [`api-reference.md`](./docs/api-reference.md) — Kontrak API backend.
- **First-Principles Thinking**: Pahami _kenapa_ suatu perubahan dilakukan, bukan hanya _apa_ yang diubah. Selesaikan akar masalah (_root cause_), bukan hanya gejalanya (_symptom_).
- **Integritas Batas (Backend Alignment)**: Jangan pernah mengasumsikan nama field DTO atau aturan validasi secara sepihak. Kontrak API dan schema Zod di frontend WAJIB 100% selaras dengan backend (`api-backend-bun/src/validations/*`).
- **Desain Premium & Visual Wowed**: Aplikasi photobooth ini mengutamakan estetika visual tinggi. Gunakan warna harmonis, micro-animation, glassmorphism, dan komponen UI modern (bukan tampilan MVP sederhana).

---

## 🔄 2. Workflow Pengembangan (Development Workflow)

1. **Perencanaan (Plan)**:
   - Pahami kebutuhan pengguna.
   - Periksa apakah ada komponen atau hook yang sudah ada yang bisa di-reuse.
   - Jika perubahan kompleks atau berdampak ke arsitektur, buat implementation plan terlebih dahulu.
2. **Implementasi Bertahap (Iterative Implementation)**:
   - Buat/edit file dengan memisahkan tanggung jawab (Feature-based: components, hooks, schemas, utils).
   - Jangan menulis file monolithic raksasa (>300 baris). Pecah menjadi sub-komponen atau helper functions.
3. **Validasi & Verifikasi (Verify)**:
   - Pastikan build tidak error dengan `npm run build`.
   - Pastikan tidak ada lint warning atau error TypeScript/ESLint.
   - Uji alur UI dan penanganan error state (`isLoading`, `isError`, `isPending`).
4. **Pembersihan (Cleanup)**:
   - Hapus `console.log`, `debugger`, atau kode eksperimental yang tidak terpakai.
   - Jaga agar komentar tetap bermakna (jelaskan _mengapa_, bukan _apa_).

---

## 💎 3. Standar Kualitas Kode (Code Quality)

- **Single Responsibility Principle (SRP)**:
  - 1 file custom hook = 1 kumpulan state/effect terkait.
  - 1 file utility handler = 1 fungsi (`1 file 1 function`).
  - 1 file Zod schema = 1 domain entity.
- **State Management & Data Fetching**:
  - **Server State**: Wajib menggunakan **TanStack Query** (`useQuery` / `useMutation`). _Dilarang_ menggunakan `useEffect + axios` manual untuk API fetching.
  - **Form State**: Wajib menggunakan **React Hook Form** + `zodResolver`. _Dilarang_ menggunakan `useState` individual per field form.
  - **UI/Client State**: Gunakan `useState` / `useReducer` hanya untuk state UI lokal (modal open/close, active tab, hover).
- **Type Safety & Alignments**:
  - Semua field name form (misal: `name`, `email`, `npm`, `phoneNumber`, `major`, `instagramUsername`) HARUS cocok persis dengan DTO backend.
  - Pesan error validasi Zod menggunakan Bahasa Indonesia yang ramah pengguna.
- **Performa & Animasi**:
  - Gunakan `requestAnimationFrame` atau CSS hardware-accelerated animations (`transform`, `opacity`) untuk animasi intensif seperti marquee atau floating Orbs.
  - Berikan `width` dan `height` eksplisit pada kontainer bermedia/canvas untuk mencegah layout collapse atau cumulative layout shift (CLS).

---

## 🎨 4. Gaya Implementasi & Arsitektur UI (Implementation Style)

### Structure & Naming

- Komponen React: `PascalCase.jsx` (contoh: `CaptureStep.jsx`, `Navbar.jsx`)
- Custom Hooks: `camelCase.js` berawalan `use` (contoh: `usePhotobooth.js`, `useCamera.js`)
- Handler & Utils: `camelCase.js` (contoh: `takeSnapshot.js`, `canvasHelper.js`)
- Schemas: `camelCase.schema.js` (contoh: `customer.schema.js`)

### CSS & Styling

- Menggunakan **Tailwind CSS v4** (`@tailwindcss/vite`).
- Ikuti standar kelas Tailwind v4:
  - `shrink-0` (bukan `flex-shrink-0`)
  - `bg-linear-to-r` / `bg-linear-to-b` (bukan `bg-gradient-to-r`)
- Visual Theme: Curated color palette (maroon, terracotta, coral, cream, sage) dengan font display dan sans yang selaras.

### Error Handling & Edge Cases

- Selalu sediakan fallback UI untuk:
  - Loading state (`isPending` / `isLoading`) → Skeleton / Spinner
  - Error state (`isError`) → Alert banner / Toast notification
  - Empty state → Illustration / Empty message
