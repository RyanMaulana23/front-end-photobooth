# Struktur Folder — DSC Photobox

Dokumen ini menjelaskan struktur direktori lengkap dari seluruh monorepo proyek DSC Photobox.

---

## Backend: `api-backend-bun/`

```
api-backend-bun/
├── src/
│   ├── app.ts                    ← Konfigurasi Express app (middleware, routes)
│   ├── server.ts                 ← Entry point: start server & DB connection
│   │
│   ├── controllers/              ← HTTP request handlers (thin layer)
│   │   ├── admins.controller.ts
│   │   ├── customers.controller.ts
│   │   ├── photoSessions.controller.ts
│   │   └── photos.controller.ts
│   │
│   ├── services/                 ← Business logic layer
│   │   ├── admins.service.ts
│   │   ├── customers.service.ts
│   │   ├── photoSessions.service.ts
│   │   └── photos.service.ts
│   │
│   ├── repositories/             ← Database access layer (Drizzle ORM)
│   │   ├── admins.repository.ts
│   │   ├── customers.repository.ts
│   │   ├── photoSessions.repository.ts
│   │   └── photos.repository.ts
│   │
│   ├── routes/                   ← Route definitions
│   │   ├── route.ts              ← Aggregator semua route /api/*
│   │   ├── admins.route.ts
│   │   ├── customers.route.ts
│   │   ├── photoSessions.route.ts
│   │   ├── photos.route.ts
│   │   └── health.route.ts       ← Health check endpoint
│   │
│   ├── middlewares/              ← Express middleware
│   │   ├── auth.middleware.ts        ← JWT verification via Supabase + Redis cache
│   │   ├── error.middleware.ts       ← Global error handler
│   │   ├── notFound.middleware.ts    ← 404 handler
│   │   ├── rateLimit.middleware.ts   ← Rate limiter (global & admin)
│   │   ├── requestId.middleware.ts   ← Inject unique request ID ke setiap req
│   │   ├── upload.middleware.ts      ← Multer file upload handler
│   │   └── validation.middleware.ts  ← Zod schema validation wrapper
│   │
│   ├── infrastructure/           ← Koneksi ke layanan eksternal
│   │   ├── database/
│   │   │   ├── drizzle.ts        ← PostgreSQL connection via Drizzle
│   │   │   ├── supabase.ts       ← Supabase client initialization
│   │   │   └── schemas.ts        ← Drizzle table schema definitions
│   │   ├── cache/
│   │   │   └── cache.service.ts  ← Redis abstraction (get/set/del + cacheKey)
│   │   └── logging/
│   │       └── logger.ts         ← Pino logger instance
│   │
│   ├── storage/                  ← File storage abstraction
│   │   ├── storage.service.ts    ← Upload file ke Supabase Storage
│   │   └── zip.service.ts        ← Membuat ZIP arsip dari foto per sesi
│   │
│   ├── types/                    ← TypeScript type definitions
│   │   ├── admins.type.ts
│   │   ├── customers.type.ts
│   │   └── photos.type.ts
│   │
│   ├── validations/              ← Zod validation schemas
│   │   ├── admins.validation.ts
│   │   └── customers.validation.ts
│   │
│   ├── errors/
│   │   └── appError.ts           ← Custom AppError class (extends Error)
│   │
│   ├── utils/
│   │   ├── env.ts                ← Type-safe env variable loader
│   │   ├── responseServer.ts     ← Standar response helper (success/error)
│   │   └── handleTransaction.ts  ← Drizzle DB transaction wrapper
│   │
│   └── docs/
│       └── swagger.ts            ← Swagger/OpenAPI spec configuration
│
├── migrations/                   ← Drizzle migration files
├── supabase/                     ← Supabase config/seed (jika ada)
├── dist/                         ← Build output (git-ignored)
│
├── .env                          ← Environment variables (development)
├── .env.example                  ← Template environment variables
├── .env.production               ← Environment variables (production)
├── .dockerignore
├── .gitignore
├── Dockerfile                    ← Docker image definition
├── docker-compose.yml            ← Orkestrasi container (app + redis)
├── drizzle.config.ts             ← Drizzle Kit configuration
├── package.json
├── tsconfig.json
├── build.ts                      ← Custom build script (Bun bundler)
├── audit.md                      ← Catatan audit & security review
└── bun.lock
```

---

## Frontend: `front-end-photobooth/`

```
front-end-photobooth/
├── src/
│   ├── main.jsx                  ← Entry point React (mount ke DOM)
│   ├── App.jsx                   ← Root layout: Navbar + <Outlet />
│   ├── icons.jsx                 ← Library komponen ikon SVG
│   ├── index.css                 ← Global CSS + Tailwind imports + animasi
│   │
│   ├── routes/
│   │   └── index.jsx             ← Definisi semua route (BrowserRouter)
│   │
│   ├── pages/                    ← Halaman per route
│   │   ├── Home.jsx              ← Wrapper <Hero />
│   │   ├── Photobooth.jsx        ← Presenter photobooth (pakai usePhotobooth)
│   │   ├── Gallery.jsx           ← Infinite marquee gallery showcase
│   │   ├── About.jsx             ← Halaman tentang DSC
│   │   └── auth/
│   │       └── Login.jsx         ← Login page untuk admin
│   │
│   ├── features/
│   │   └── photobooth/           ← Feature-based photobooth module
│   │       ├── components/       ← Step-step UI flow (1 file per step)
│   │       │   ├── TemplateStep.jsx      ← Step 1: Pilih template
│   │       │   ├── CaptureStep.jsx       ← Step 2: Sesi foto (webcam)
│   │       │   ├── PreviewStep.jsx       ← Step 3: Preview hasil foto
│   │       │   ├── EditDecisionStep.jsx  ← Step 4: Putuskan edit/lanjut
│   │       │   ├── FilterModal.jsx       ← Modal filter warna
│   │       │   ├── InputDataStep.jsx     ← Step 5: Form data pelanggan
│   │       │   ├── ProcessingStep.jsx    ← Step 6: Progress simulasi
│   │       │   ├── EmailSuccessStep.jsx  ← Step 7: Konfirmasi email
│   │       │   ├── PrintStep.jsx         ← Step 8: Progress cetak
│   │       │   └── ThankYouStep.jsx      ← Step 9: Countdown & selesai
│   │       │
│   │       ├── hooks/
│   │       │   ├── usePhotobooth.js      ← Custom hook utama (state + effects)
│   │       │   └── utils/               ← Handler functions (1 file 1 fungsi)
│   │       │       ├── triggerCaptureSequence.js
│   │       │       ├── takeSnapshot.js
│   │       │       ├── handleStartCapture.js
│   │       │       ├── handleRetakeSelect.js
│   │       │       ├── handleFormSubmit.js
│   │       │       ├── handlePrintTrigger.js
│   │       │       ├── handleDownloadStrip.js
│   │       │       ├── resetAll.js
│   │       │       └── getProgressPercent.js
│   │       │
│   │       └── utils/
│   │           ├── canvasHelper.js       ← Compile foto strip ke canvas
│   │           └── mockAvatar.js         ← Gambar avatar simulasi (offline mode)
│   │
│   ├── components/               ← Shared / global UI components
│   │   ├── Navbar.jsx            ← Top navbar (glassmorphism, responsive)
│   │   ├── Hero.jsx              ← Landing page hero section
│   │   └── Dashboard.jsx         ← Admin dashboard component
│   │
│   ├── constants/
│   │   └── photobooth.js         ← LAYOUT_CONFIGS, FILTERS, STEPS, helpers
│   │
│   ├── hooks/
│   │   └── useCamera.js          ← Custom hook: akses webcam & device list
│   │
│   ├── config/
│   │   └── axios.js              ← Axios instance dengan baseURL & credentials
│   │
│   └── utils/
│       ├── validation.js         ← Validasi form pelanggan
│       └── audio.js              ← Fungsi playShutterSound()
│
├── docs/                         ← Dokumentasi proyek ← KAMU DI SINI
│   ├── project-overview.md
│   ├── architecture.md
│   ├── folder-structure.md
│   ├── api-reference.md
│   ├── development-guide.md
│   ├── coding-standard.md
│   └── refactor.md
│
├── public/                       ← Static assets
├── dist/                         ← Build output (git-ignored)
│
├── index.html                    ← HTML entry point
├── vite.config.js                ← Vite configuration
├── tailwindconfig.js             ← Tailwind CSS v4 configuration
├── eslint.config.js              ← ESLint configuration
└── package.json
```

---

## Konvensi Penamaan File

| Konteks              | Konvensi                           | Contoh                               |
| -------------------- | ---------------------------------- | ------------------------------------ |
| React Components     | `PascalCase.jsx`                   | `Navbar.jsx`, `CaptureStep.jsx`      |
| Custom Hooks         | `camelCase.js` dengan prefix `use` | `usePhotobooth.js`, `useCamera.js`   |
| Utility Functions    | `camelCase.js`                     | `canvasHelper.js`, `takeSnapshot.js` |
| Constants            | `camelCase.js`                     | `photobooth.js`                      |
| Backend Controllers  | `camelCase.controller.ts`          | `admins.controller.ts`               |
| Backend Services     | `camelCase.service.ts`             | `photos.service.ts`                  |
| Backend Repositories | `camelCase.repository.ts`          | `customers.repository.ts`            |
| Backend Routes       | `camelCase.route.ts`               | `admins.route.ts`                    |
| Backend Middlewares  | `camelCase.middleware.ts`          | `auth.middleware.ts`                 |
| Types (TS)           | `camelCase.type.ts`                | `admins.type.ts`                     |
| Validations (TS)     | `camelCase.validation.ts`          | `admins.validation.ts`               |
