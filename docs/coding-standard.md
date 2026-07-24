# Coding Standard — DSC Photobox

Dokumen ini mendefinisikan aturan penulisan kode yang harus diikuti oleh semua kontributor proyek DSC Photobox. Tujuannya adalah menjaga konsistensi, keterbacaan, dan maintainability kode di seluruh codebase.

---

## 1. Prinsip Umum

- **Satu file, satu tanggung jawab** — Setiap file hanya mengerjakan satu hal. Fungsi/komponen yang tidak berkaitan harus dipisahkan.
- **Nama yang jelas lebih baik dari komentar** — Nama variabel, fungsi, dan komponen harus cukup deskriptif sehingga kode bisa dibaca sendiri (_self-documenting_).
- **Hindari nested yang dalam** — Maksimal 3 level indentasi. Gunakan _early return_ untuk mengurangi nesting.
- **Jangan ulangi kode (DRY)** — Ekstrak logika yang sama ke fungsi/utilitas terpisah.

---

## 2. Standar Frontend (React + JavaScript)

### 2.1 Penamaan

| Konteks          | Konvensi                 | ✅ Contoh                                |
| ---------------- | ------------------------ | ---------------------------------------- |
| Komponen React   | `PascalCase`             | `CaptureStep.jsx`, `Navbar.jsx`          |
| Custom Hook      | `camelCase` prefix `use` | `usePhotobooth.js`, `useCamera.js`       |
| Fungsi utility   | `camelCase` deskriptif   | `takeSnapshot.js`, `handleFormSubmit.js` |
| Variabel & state | `camelCase`              | `isShuffling`, `capturingIndex`          |
| Konstanta global | `UPPER_SNAKE_CASE`       | `LAYOUT_CONFIGS`, `FILTERS`, `STEPS`     |
| File CSS class   | `kebab-case`             | `animate-fade-in`, `orb-float-1`         |

### 2.2 Struktur Komponen React

Urutan penulisan di dalam komponen harus konsisten:

```jsx
// 1. Imports
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

// 2. Konstanta / konfigurasi di luar komponen
const MOCK_DATA = [...];

// 3. Sub-komponen kecil (jika ada)
function SubComponent({ prop }) {
  return <div>{prop}</div>;
}

// 4. Komponen utama
export default function MyComponent({ prop1, prop2 }) {
  // 4a. State declarations
  const [value, setValue] = useState(null);

  // 4b. Refs
  const ref = useRef(null);

  // 4c. Derived values / memos
  const computed = useMemo(() => ..., []);

  // 4d. Effects
  useEffect(() => { ... }, []);

  // 4e. Event handlers
  const handleClick = () => { ... };

  // 4f. Return JSX
  return (
    <div>
      ...
    </div>
  );
}
```

### 2.3 Custom Hooks

- Satu custom hook berisi state, refs, dan effects yang **saling berkaitan**.
- Handler functions (aksi/event) **dipisahkan ke file `utils/`** tersendiri (prinsip 1 file 1 fungsi).
- Hook hanya bertindak sebagai _orchestrator_ yang membungkus handler dengan state yang dibutuhkan.

```js
// ✅ BENAR — hooks/usePhotobooth.js berisi state + effects
// ✅ BENAR — hooks/utils/takeSnapshot.js berisi satu fungsi
// ❌ SALAH — mendefinisikan banyak fungsi besar di dalam usePhotobooth.js
```

### 2.4 Props & Destructuring

Selalu gunakan destructuring untuk props:

```jsx
// ✅ BENAR
function Card({ title, subtitle, onClick }) {
  return <div onClick={onClick}>{title}</div>;
}

// ❌ SALAH
function Card(props) {
  return <div onClick={props.onClick}>{props.title}</div>;
}
```

### 2.5 Conditional Rendering

Gunakan short-circuit (`&&`) untuk kondisi tunggal, ternary untuk dua kondisi:

```jsx
// ✅ Kondisi tunggal
{
  isLoading && <Spinner />;
}

// ✅ Dua pilihan
{
  hasData ? <DataView data={data} /> : <EmptyState />;
}

// ❌ Hindari nested ternary
{
  a ? b ? <X /> : <Y /> : <Z />;
}
```

### 2.6 Styling dengan Tailwind CSS

- Gunakan **utility classes Tailwind v4** langsung di JSX.
- Hindari inline style kecuali untuk nilai dinamis yang tidak bisa di-handle Tailwind (misalnya nilai dari variabel JavaScript).
- Untuk animasi yang tidak ada di Tailwind, tambahkan `@keyframes` di `index.css` atau via `<style>` tag inline.

```jsx
// ✅ Tailwind class untuk styling statis
<div className="flex items-center gap-4 rounded-2xl bg-white/60 p-4">

// ✅ Inline style untuk nilai dinamis
<div style={{ width: cardWidth, transform: `rotate(${rotation}deg)` }}>

// ❌ Jangan campur keduanya untuk hal yang sama
<div className="w-[140px]" style={{ width: 140 }}>
```

### 2.7 Imports

Urutan import di setiap file:

```js
// 1. React & React ecosystem
import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

// 2. Third-party libraries
import axios from 'axios';

// 3. Internal — constants & config
import { LAYOUT_CONFIGS, STEPS } from '../constants/photobooth';

// 4. Internal — hooks
import useCamera from '../hooks/useCamera';

// 5. Internal — components
import Navbar from '../components/Navbar';

// 6. Internal — utilities & types
import { validateForm } from '../utils/validation';
```

---

## 3. Standar Penggunaan Library Wajib (Frontend)

> [!IMPORTANT]
> **TanStack Query, React Hook Form, dan Zod wajib digunakan** untuk semua fitur baru di frontend yang menyangkut data fetching dari API dan form input. Jangan gunakan `useState` manual atau `useEffect` untuk fetching data ketika TanStack Query sudah tersedia.

---

### 3.1 TanStack Query — Server State Management

**Kapan digunakan:**

- Semua operasi **HTTP GET** yang mengambil data dari backend API
- Semua operasi **mutasi** (POST, PUT, DELETE) yang mengubah data di server
- **Jangan** gunakan `useEffect + axios` secara manual untuk fetching — gunakan `useQuery` / `useMutation`

**Setup Global (wajib di `main.jsx`):**

```jsx
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 1000 * 60 * 5, // 5 menit
    },
  },
});

root.render(
  <QueryClientProvider client={queryClient}>
    <App />
  </QueryClientProvider>,
);
```

**Fetching Data (`useQuery`):**

```js
import { useQuery } from '@tanstack/react-query';
import api from '../config/axios';

// ✅ BENAR — useQuery untuk GET request
function usePhotos(sessionId) {
  return useQuery({
    queryKey: ['photos', sessionId], // ← key unik untuk cache
    queryFn: () => api.get(`/photos/${sessionId}`).then((r) => r.data),
    enabled: !!sessionId, // ← hanya fetch jika sessionId ada
  });
}

// Penggunaan di komponen
const { data, isLoading, isError, error } = usePhotos(sessionId);
```

**Mutasi Data (`useMutation`):**

```js
import { useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../config/axios';

// ✅ BENAR — useMutation untuk POST/PUT/DELETE
function useCreateCustomer() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ sessionId, data }) =>
      api.post(`/customers/${sessionId}`, data).then((r) => r.data),
    onSuccess: (data, variables) => {
      // Invalidate cache yang berhubungan setelah mutasi berhasil
      queryClient.invalidateQueries({ queryKey: ['sessions'] });
    },
    onError: (error) => {
      console.error('Gagal membuat customer:', error);
    },
  });
}

// Penggunaan di komponen
const { mutate, isPending, isError } = useCreateCustomer();
mutate({ sessionId, data: formData });
```

**Query Key Convention:**

```js
// Gunakan array dengan domain pertama, lalu identifier
['photos', sessionId]       ← semua foto untuk sessionId tertentu
['sessions']                ← semua sesi
['admin', 'me']             ← profil admin login
['customers']               ← semua pelanggan
```

---

### 3.2 React Hook Form — Form State Management

**Kapan digunakan:**

- Semua **form input** di frontend — wajib menggunakan React Hook Form
- **Jangan** gunakan `useState` manual untuk setiap field form
- Selalu integrasikan dengan Zod via `@hookform/resolvers/zod`
- Schema validasi di frontend **wajib sesuai persis dengan schema di backend** (nama field, tipe data, serta aturan validasinya)

**Contoh Form dengan Validasi Zod (Sesuai Backend):**

```jsx
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

// 1. Definisikan schema Zod (sesuai dengan backend: src/validations/customers.validation.ts)
const createCustomerValidation = z.object({
  name: z
    .string('Nama harus berupa string')
    .min(1, 'Nama wajib diisi')
    .max(100, 'Nama maksimal 100 karakter'),
  email: z
    .string()
    .trim()
    .email('Format email tidak valid'),
  npm: z
    .string('NPM harus berupa string')
    .min(1, 'NPM wajib diisi')
    .max(15, 'NPM maksimal 15 karakter'),
  phoneNumber: z
    .string()
    .trim()
    .min(8, 'Nomor telepon terlalu pendek! (minimal 8 angka)')
    .max(15, 'Nomor telepon terlalu panjang! (maksimal 15 angka)')
    .regex(/^[0-9+]+$/, 'Nomor telepon hanya boleh berisi angka dan awalan +')
    .optional()
    .or(z.literal('')),
  major: z
    .string('Jurusan wajib diisi')
    .min(1, 'Jurusan wajib diisi'),
  instagramUsername: z
    .string('Username Instagram harus berupa string')
    .trim()
    .transform((val) => val.replace(/^@/, ''))
    .refine((val) => !val || /^[a-zA-Z0-9._]+$/.test(val), {
      message: 'Username Instagram hanya boleh huruf, angka, titik, atau underscore!',
    }),
});

type CustomerFormData = z.infer<typeof createCustomerValidation>;

// 2. Gunakan di komponen
function CustomerForm({ onSubmit }) {
  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm({
    resolver: zodResolver(createCustomerValidation),
    defaultValues: {
      name: '',
      email: '',
      npm: '',
      phoneNumber: '',
      major: '',
      instagramUsername: '',
    },
  });

  const onValid = async (data) => {
    await onSubmit(data); // data sudah tervalidasi oleh Zod & sesuai dengan DTO BE
    reset();
  };

  return (
    <form onSubmit={handleSubmit(onValid)}>
      <div>
        <Controller
          name="name"
          control={control}
          render={({ field }) => (
            <input {...field} placeholder="Nama Lengkap" />
          )}
        />
        {errors.name && <span className="text-red-500">{errors.name.message}</span>}
      </div>

      <div>
        <Controller
          name="email"
          control={control}
          render={({ field }) => (
            <input {...field} type="email" placeholder="Email" />
          )}
        />
        {errors.email && <span className="text-red-500">{errors.email.message}</span>}
      </div>

      <div>
        <Controller
          name="npm"
          control={control}
          render={({ field }) => (
            <input {...field} placeholder="NPM" />
          )}
        />
        {errors.npm && <span className="text-red-500">{errors.npm.message}</span>}
      </div>

      <div>
        <Controller
          name="phoneNumber"
          control={control}
          render={({ field }) => (
            <input {...field} placeholder="Nomor Telepon (Opsional)" />
          )}
        />
        {errors.phoneNumber && <span className="text-red-500">{errors.phoneNumber.message}</span>}
      </div>

      <div>
        <Controller
          name="major"
          control={control}
          render={({ field }) => (
            <input {...field} placeholder="Jurusan" />
          )}
        />
        {errors.major && <span className="text-red-500">{errors.major.message}</span>}
      </div>

      <div>
        <Controller
          name="instagramUsername"
          control={control}
          render={({ field }) => (
            <input {...field} placeholder="Username Instagram" />
          )}
        />
        {errors.instagramUsername && <span className="text-red-500">{errors.instagramUsername.message}</span>}
      </div>

      <button type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Mengirim...' : 'Kirim'}
      </button>
    </form>
  );
}
```

**Aturan React Hook Form:**

- Selalu gunakan `resolver: zodResolver(schema)` — jangan validasi manual di `onSubmit`
- Gunakan `formState.errors` untuk menampilkan pesan error per field
- Gunakan `formState.isSubmitting` untuk disabled state tombol submit
- Simpan Zod schema di file terpisah: `src/features/<feature>/schemas/<name>.schema.js`
- **Field name pada form WAJIB persis dengan nama field di DTO / validation backend**

---

### 3.3 Zod — Client-Side Validation Schema

**Kapan digunakan:**

- Validasi semua **form input** (diintegrasikan dengan React Hook Form)
- Validasi **response API** jika diperlukan (parsing data dari backend)
- **Jangan** buat validasi manual dengan kondisi `if` yang panjang untuk form
- **Wajib menyesuaikan dengan aturan dan struktur schema backend (`src/validations/*`)**

**Lokasi File Schema:**

```
src/features/<feature>/schemas/<name>.schema.js

// Contoh:
src/features/photobooth/schemas/customer.schema.js
src/features/auth/schemas/login.schema.js
```

**Contoh Schema (Sesuai Schema Backend):**

```js
// src/features/photobooth/schemas/customer.schema.js
import { z } from 'zod';

export const createCustomerValidation = z.object({
  name: z
    .string('Nama harus berupa string')
    .min(1, 'Nama wajib diisi')
    .max(100, 'Nama maksimal 100 karakter'),
  email: z
    .string()
    .trim()
    .email('Format email tidak valid'),
  npm: z
    .string('NPM harus berupa string')
    .min(1, 'NPM wajib diisi')
    .max(15, 'NPM maksimal 15 karakter'),
  phoneNumber: z
    .string()
    .trim()
    .min(8, 'Nomor telepon terlalu pendek! (minimal 8 angka)')
    .max(15, 'Nomor telepon terlalu panjang! (maksimal 15 angka)')
    .regex(/^[0-9+]+$/, 'Nomor telepon hanya boleh berisi angka dan awalan +')
    .optional()
    .or(z.literal('')),
  major: z
    .string('Jurusan wajib diisi')
    .min(1, 'Jurusan wajib diisi'),
  instagramUsername: z
    .string('Username Instagram harus berupa string')
    .trim()
    .transform((val) => val.replace(/^@/, ''))
    .refine((val) => !val || /^[a-zA-Z0-9._]+$/.test(val), {
      message: 'Username Instagram hanya boleh huruf, angka, titik, atau underscore!',
    }),
});

export type CustomerFormData = z.infer<typeof createCustomerValidation>;
```

**Aturan Zod:**

- Satu file schema = satu domain entity (jangan campur schema yang tidak berkaitan)
- Selalu sertakan **pesan error dalam Bahasa Indonesia** yang jelas
- Gunakan `z.infer<typeof schema>` untuk mendapatkan TypeScript type secara otomatis (jika pakai TS)
- **Nama field (key) dan constraint (min, max, regex, transform, refine) HARUS cocok 1:1 dengan validation schema backend.**

---

## 4. Standar Backend (TypeScript + Express)

### 4.1 Penamaan

| Konteks            | Konvensi                   | ✅ Contoh                                   |
| ------------------ | -------------------------- | ------------------------------------------- |
| File (semua)       | `camelCase.<layer>.ts`     | `admins.service.ts`, `photos.controller.ts` |
| Fungsi & variabel  | `camelCase`                | `registerAdmin`, `loginAdmin`               |
| Types & Interfaces | `PascalCase` suffix `Type` | `AdminType`, `CreatePhotosType`             |
| Konstanta          | `UPPER_SNAKE_CASE`         | `SERVICE_NAME`                              |
| Class              | `PascalCase`               | `AppError`                                  |

### 4.2 Layered Architecture Rules

Setiap layer **hanya boleh** berinteraksi dengan layer di bawahnya:

```
Controller → Service → Repository → Database
     ↑                      ↑
   Routes              Infrastructure
```

- **Controller** tidak boleh akses database atau repository langsung.
- **Service** tidak boleh return raw Response Express.
- **Repository** tidak boleh mengandung business logic.

### 4.3 Error Handling

Selalu gunakan `AppError` untuk error yang bisa diprediksi:

```typescript
// ✅ BENAR
if (!customer) {
  throw new AppError(404, 'Customer tidak ditemukan');
}

// ❌ SALAH — jangan throw Error biasa dari dalam service
if (!customer) {
  throw new Error('Customer tidak ditemukan');
}
```

Error akan ditangkap secara otomatis oleh `errorMiddleware` dan diformat ke response JSON terstandarisasi.

### 4.4 Logging

Gunakan Pino logger untuk semua event penting. Sertakan konteks yang relevan:

```typescript
// ✅ BENAR — dengan konteks
logger.info({ service, email: data.email, sessionId }, 'Proses login');
logger.warn({ service, error: err.message }, 'Login gagal');
logger.error({ service, error }, 'Server error');

// ❌ SALAH — log tanpa konteks
console.log('Login berhasil');
logger.info('Login berhasil');
```

Konvensi level log:
| Level | Kapan digunakan |
|-------|-----------------|
| `info` | Alur normal (proses dimulai, berhasil) |
| `warn` | Situasi tidak normal tapi tidak mematikan (data tidak ditemukan, validasi gagal) |
| `error` | Error fatal atau tidak terduga |
| `debug` | Informasi debug rinci (hanya development) |

### 4.5 Cache Pattern

Selalu ikuti pola **cache-aside** di layer service:

```typescript
// ✅ Pola yang benar
const cached = await cacheService.get({ key });
if (cached) return { data: cached, fromCache: true };

const fresh = await repository.getData();
await cacheService.set({ key, data: fresh, ttl: 300 });
return { data: fresh, fromCache: false };
```

### 4.6 Validasi

- Semua input request **wajib divalidasi** menggunakan Zod schema di `src/validations/`.
- Validasi dipasang di route layer via `validateBody()` atau `validateParams()` middleware.
- Jangan lakukan validasi input di service layer (kecuali business validation).

```typescript
// ✅ Di route
adminsRoute.post(
  '/login',
  validateBody(adminsValidation.loginAdminValidation),  ← validasi input
  adminsController.login,
);

// ✅ Di service — business validation
if (data.password !== data.confirmPassword) {
  throw new AppError(400, 'Password tidak cocok');  ← business rule
}
```

### 4.7 Response Format

Selalu gunakan `responseSchema.success()` atau `responseSchema.error()` — **jangan pernah** return JSON langsung:

```typescript
// ✅ BENAR
return responseSchema.success({
  res,
  code: 201,
  data: result,
  message: 'Berhasil',
});

// ❌ SALAH
res.status(201).json({ data: result });
```

### 4.8 Database Transactions

Gunakan `handleTransaction()` untuk operasi yang butuh atomicity (semua berhasil atau semua gagal):

```typescript
// ✅ Operasi multi-tabel dalam satu transaksi
const result = await handleTransaction(async (tx) => {
  const photo = await photosRepository.createPhotos(photoData, tx);
  const session = await photoSessionsRepository.updateZipUrl(sessionData, tx);
  return { photo, session };
});
```

---

## 5. Standar Git

### Branch Naming

```
main                    ← produksi
feat/<nama-fitur>       ← fitur baru
fix/<nama-bug>          ← bug fix
refactor/<nama/scope>   ← refaktorisasi
docs/<nama>             ← dokumentasi
```

### Commit Messages (Conventional Commits)

Format: `<type>(<scope>): <deskripsi>`

```bash
feat(gallery): tambah infinite marquee display dengan pause on hover
fix(auth): perbaiki token tidak expired setelah logout
refactor(photobooth): pisahkan handler functions ke utils/
docs: tambah api-reference endpoint customers
style(navbar): perbaiki alignment mobile hamburger menu
chore: update dependencies bun.lock
```

---

## 6. Code Review Checklist

Sebelum membuat Pull Request, pastikan:

**Umum:**

- [ ] Kode mengikuti konvensi penamaan yang benar
- [ ] Tidak ada `console.log` atau `debugger` yang tertinggal
- [ ] Build berhasil tanpa error: `npm run build` (frontend) / `bun run build` (backend)

**Frontend — Library Wajib:**

- [ ] Data fetching menggunakan `useQuery` (bukan `useEffect + axios` manual)
- [ ] Mutasi data menggunakan `useMutation` dengan `onSuccess` invalidate query
- [ ] Semua form menggunakan `react-hook-form` dengan `zodResolver`
- [ ] Validasi schema Zod disimpan di `src/features/<feature>/schemas/`
- [ ] Pesan error Zod ditulis dalam Bahasa Indonesia
- [ ] Query key mengikuti konvensi array `['domain', identifier]`

**Frontend — Umum:**

- [ ] Error ditangani dengan error state dari TanStack Query (`isError`, `error`)
- [ ] Komponen React tidak mengandung business logic yang seharusnya di hook/utils
- [ ] Tidak ada `useState` manual untuk data yang bisa di-handle TanStack Query

**Backend:**

- [ ] Error ditangani dengan `AppError`
- [ ] Logging sudah ditambahkan untuk flow penting
- [ ] Validasi input sudah ada di layer yang tepat (Zod + validateBody middleware)
- [ ] Cache layer digunakan untuk endpoint yang sering diakses
