# Arsitektur Sistem — DSC Photobox

## Gambaran Umum

DSC Photobox menggunakan arsitektur **client-server terpisah** (decoupled frontend & backend). Frontend React berkomunikasi dengan backend melalui REST API. Backend mengimplementasikan arsitektur **layered (berlapis)** yang memisahkan tanggung jawab antara Controller → Service → Repository.

---

## Diagram Arsitektur

```
┌───────────────────────────────────────────────────────────┐
│                      BROWSER / CLIENT                     │
│                                                           │
│   ┌─────────────────────────────────────────────────┐    │
│   │           React App (Vite + Tailwind)           │    │
│   │                                                 │    │
│   │  Pages: Home | Photobooth | Gallery | About     │    │
│   │  Features: photobooth/ (components, hooks)      │    │
│   │  Routing: React Router DOM v7                   │    │
│   └─────────────────┬──────────────┬────────────────┘    │
│                     │ Axios HTTP   │ Webcam API           │
└─────────────────────┼──────────────┼────────────────────--┘
                      │              │ (Browser MediaDevices)
                      ▼              ▼
┌─────────────────────────────────────────────────────────┐
│                 BACKEND (Bun + Express)                  │
│                                                         │
│  ┌────────────────────────────────────────────────┐    │
│  │                 Middleware Stack                │    │
│  │  Helmet | CORS | Rate Limiter | Request ID     │    │
│  │  Auth (JWT+Supabase) | Upload | Validation     │    │
│  └──────────────────┬─────────────────────────────┘    │
│                     │                                   │
│  ┌──────────────────▼─────────────────────────────┐    │
│  │               Controllers Layer                 │    │
│  │  admins | customers | photos | photoSessions   │    │
│  └──────────────────┬─────────────────────────────┘    │
│                     │                                   │
│  ┌──────────────────▼─────────────────────────────┐    │
│  │                Services Layer                   │    │
│  │  Business logic, cache read/write, validation  │    │
│  └──────┬───────────────────────────┬─────────────┘    │
│         │                           │                   │
│  ┌──────▼──────┐           ┌────────▼────────┐         │
│  │ Repositories│           │ Infrastructure  │         │
│  │  (Drizzle)  │           │ Cache (Redis)   │         │
│  └──────┬──────┘           │ Logging (Pino)  │         │
│         │                  └────────┬────────┘         │
└─────────┼──────────────────────────┼───────────────────┘
          │                          │
          ▼                          ▼
┌──────────────────┐    ┌──────────────────────┐
│  PostgreSQL DB   │    │  Redis (Cache Layer)  │
│  (via Supabase)  │    │  TTL: 120s – 300s     │
└──────────────────┘    └──────────────────────┘
          │
          ▼
┌──────────────────────────────────────┐
│      Supabase Platform               │
│  ├── Auth (JWT-based admin login)    │
│  └── Storage (foto PNG, ZIP arsip)   │
└──────────────────────────────────────┘
```

---

## Arsitektur Backend — Layered Architecture

### 1. Routes Layer (`src/routes/`)

Mendefinisikan endpoint HTTP dan menghubungkan ke middleware + controller yang sesuai. Berfungsi sebagai titik masuk (entry point) per domain.

```
/api
├── /photo-sessions    → photoSessions.route.ts
├── /photos            → photos.route.ts
├── /customers         → customers.route.ts
└── /admins            → admins.route.ts
```

### 2. Controllers Layer (`src/controllers/`)

Bertugas menerima request HTTP, mengekstrak data dari `req.body` / `req.params` / `req.query`, memanggil service, dan mengembalikan response terstandarisasi lewat `responseSchema`.

Tidak mengandung business logic sama sekali.

### 3. Services Layer (`src/services/`)

Mengandung **semua business logic**:

- Validasi bisnis (misalnya: cek apakah session ada sebelum upload foto)
- Koordinasi antara multiple repository
- Read/write cache Redis
- Error handling dengan `AppError`
- Structured logging dengan Pino

### 4. Repositories Layer (`src/repositories/`)

Mengakses database secara langsung menggunakan Drizzle ORM. Hanya bertanggung jawab untuk CRUD operations, tidak mengandung business logic.

### 5. Infrastructure Layer (`src/infrastructure/`)

Inisialisasi dan konfigurasi koneksi ke layanan eksternal:

- `database/drizzle.ts` — koneksi PostgreSQL via Drizzle ORM
- `database/supabase.ts` — koneksi Supabase client
- `database/schemas.ts` — definisi schema tabel
- `cache/cache.service.ts` — abstraksi Redis (get/set/del)
- `logging/logger.ts` — instansi Pino logger

---

## Arsitektur Frontend — Feature-Based Architecture

### Prinsip

Frontend menggunakan **Feature-Based Architecture** di mana setiap fitur besar diorganisir dalam folder `features/` yang berisi komponen, hooks, dan utilitas yang spesifik untuk fitur tersebut.

```
src/
├── App.jsx                    ← Root layout (Navbar + Outlet)
├── main.jsx                   ← React entry point
├── pages/                     ← Halaman per route
│   ├── Home.jsx
│   ├── Photobooth.jsx         ← Hanya presenter, delegate ke hook
│   ├── Gallery.jsx
│   └── About.jsx
├── features/
│   └── photobooth/            ← Feature: Photobooth
│       ├── components/        ← Step-step UI (CaptureStep, PreviewStep, dll)
│       ├── hooks/
│       │   ├── usePhotobooth.js       ← Custom hook utama (state & effects)
│       │   └── utils/                 ← Handler functions (1 file 1 function)
│       │       ├── takeSnapshot.js
│       │       ├── handleStartCapture.js
│       │       └── ...
│       └── utils/             ← Helpers (canvasHelper, mockAvatar)
├── components/                ← Shared UI components
│   ├── Navbar.jsx
│   ├── Hero.jsx
│   └── Dashboard.jsx
├── constants/                 ← Konfigurasi statis (LAYOUT_CONFIGS, FILTERS, STEPS)
├── hooks/                     ← Global custom hooks (useCamera.js)
├── routes/                    ← Definisi routing React Router DOM
├── utils/                     ← Fungsi utility global (validation, audio)
└── config/                    ← Konfigurasi Axios instance
```

---

## Alur Data Sesi Foto (End-to-End)

```
Browser (Webcam)
      │
      │ 1. User klik "Start Capture"
      ▼
usePhotobooth.js
  ├── handleStartCapture() → set state PHOTO_CAPTURE
  ├── countdown useEffect → trigger takeSnapshot() setiap detik
  └── takeSnapshot() → capture frame canvas dari video element
      │
      │ 2. Semua foto terkumpul → user isi form data
      ▼
handleFormSubmit()
  ├── validateForm(formData) → cek error
  └── POST /api/photo-sessions → buat session ID baru (DSCP_xxxxxx)
      │
      ▼
Backend: photoSessionsService.createNewPhotoSession()
  └── simpan ke DB → return { id: "DSCP_abc123" }
      │
      │ 3. Upload foto ke backend
      ▼
POST /api/photos/:sessionId
  ├── multer upload files
  ├── storageService.uploadFiles() → upload ke Supabase Storage
  ├── createZipSession() → buat ZIP arsip
  └── simpan URL foto & zipUrl ke DB (dalam transaction)
      │
      │ 4. Simpan data pelanggan
      ▼
POST /api/customers/:sessionId
  └── customersService.createCustomerBySessionId()
      └── simpan ke tabel customers
```

---

## Caching Strategy

Redis digunakan sebagai **cache-aside layer** dengan TTL (Time To Live):

| Cache Key            | Deskripsi                                              | TTL           |
| -------------------- | ------------------------------------------------------ | ------------- |
| `auth:token:{hash}`  | Validasi token JWT (hindari panggil Supabase berulang) | 120 detik     |
| `admin:{id}`         | Data profil admin login                                | Default Redis |
| `customers:all`      | Daftar semua customers                                 | 300 detik     |
| `session:all`        | Semua sesi beserta foto dan customer                   | 300 detik     |
| `photos:{sessionId}` | Foto per sesi tertentu                                 | Default Redis |

---

## Security

| Mekanisme        | Implementasi                                                           |
| ---------------- | ---------------------------------------------------------------------- |
| Autentikasi      | Supabase Auth JWT, diverifikasi di `authMiddleware`                    |
| Rate Limiting    | `express-rate-limit` — global & per-endpoint admin                     |
| Input Validation | Zod schema validation via `validateBody` / `validateParams` middleware |
| Security Headers | `helmet` (XSS, CSRF, HSTS, dll)                                        |
| CORS             | Dikonfigurasi via `ORIGIN_ALLOWED` env variable                        |
| File Upload      | `multer` — validasi tipe & ukuran file                                 |
| Request ID       | `nanoid` — setiap request punya ID unik untuk tracing log              |
