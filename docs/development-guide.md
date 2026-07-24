# Development Guide — DSC Photobox

Panduan untuk menyiapkan lingkungan pengembangan lokal dan menjalankan proyek DSC Photobox dari awal.

---

## Prasyarat

Pastikan semua tools berikut sudah terinstal sebelum memulai:

| Tool                                                             | Versi Minimum | Keterangan                        |
| ---------------------------------------------------------------- | ------------- | --------------------------------- |
| [Bun](https://bun.sh/)                                           | `>= 1.0`      | Runtime & package manager backend |
| [Node.js](https://nodejs.org/)                                   | `>= 20 LTS`   | Untuk frontend (Vite)             |
| [Git](https://git-scm.com/)                                      | Latest        | Version control                   |
| [Docker Desktop](https://www.docker.com/products/docker-desktop) | Latest        | Untuk menjalankan Redis           |

> **Catatan**: PostgreSQL tidak perlu diinstal lokal karena menggunakan Supabase cloud.

---

## Setup Backend

### 1. Masuk ke direktori backend

```bash
cd api-backend-bun
```

### 2. Install dependencies

```bash
bun install
```

### 3. Konfigurasi environment variables

Salin file contoh dan isi nilainya:

```bash
cp .env.example .env
```

Edit `.env` dan isi semua variabel:

```env
# config server
PORT=3000
HOST=localhost
NODE_ENV=development
BASE_URL=http://localhost:3000

# Allow origin CORS (URL frontend)
ORIGIN_ALLOWED=http://localhost:5173

# Redis (gunakan Docker Redis di bawah)
REDIS_URL=redis://localhost:6379

# PostgreSQL (Supabase database URL)
DATABASE_URL=postgresql://postgres:[password]@db.[project-ref].supabase.co:5432/postgres

# Supabase Auth & Storage
SUPABASE_URL=https://[project-ref].supabase.co
SUPABASE_ANON_KEY=eyJhbGci...
SUPABASE_JWT_SECRET=your-jwt-secret
```

> Dapatkan nilai Supabase dari [dashboard Supabase](https://supabase.com/dashboard) → Project Settings → API

### 4. Jalankan Redis dengan Docker

```bash
docker compose up redis -d
```

### 5. Setup Database (Migrasi)

Jalankan migrasi Drizzle untuk membuat tabel di Supabase:

```bash
bun db:generate   # generate migration files
bun db:migrate    # apply migrations ke database
```

Atau jika skema sudah di-push langsung:

```bash
bun db:push
```

### 6. Jalankan Server Development

```bash
bun dev
```

Server berjalan di: `http://localhost:3000`  
Swagger API Docs: `http://localhost:3000/api-docs`

---

## Setup Frontend

### 1. Masuk ke direktori frontend

```bash
cd front-end-photobooth
```

### 2. Install dependencies

```bash
npm install
```

### 3. Konfigurasi Axios Base URL

Pastikan `src/config/axios.js` mengarah ke backend:

```js
// src/config/axios.js
const API_URL = 'http://localhost:3000';
```

> Tidak perlu file `.env` di frontend untuk development lokal, URL langsung dikonfigurasi di `src/config/axios.js`.

### 4. Jalankan Dev Server

```bash
npm run dev
```

Aplikasi berjalan di: `http://localhost:5173`

---

## Menjalankan Keduanya Bersamaan

Buka **dua terminal terpisah**:

**Terminal 1 — Backend:**

```bash
cd api-backend-bun
docker compose up redis -d   # pastikan Redis berjalan
bun dev
```

**Terminal 2 — Frontend:**

```bash
cd front-end-photobooth
npm run dev
```

---

## Scripts yang Tersedia

### Backend (`api-backend-bun`)

| Script       | Perintah          | Keterangan                                             |
| ------------ | ----------------- | ------------------------------------------------------ |
| Dev server   | `bun dev`         | Hot-reload dengan file `.env`                          |
| Build        | `bun run build`   | Bundle ke `dist/`                                      |
| Start (prod) | `bun start`       | Jalankan `dist/src/server.js` dengan `.env.production` |
| DB Generate  | `bun db:generate` | Generate migration file dari schema                    |
| DB Migrate   | `bun db:migrate`  | Jalankan migration ke database                         |
| DB Push      | `bun db:push`     | Push schema langsung (tanpa migration files)           |
| DB Studio    | `bun db:studio`   | Buka Drizzle Studio (GUI database)                     |

### Frontend (`front-end-photobooth`)

| Script     | Perintah          | Keterangan                  |
| ---------- | ----------------- | --------------------------- |
| Dev server | `npm run dev`     | Vite dev server dengan HMR  |
| Build      | `npm run build`   | Build production ke `dist/` |
| Preview    | `npm run preview` | Preview hasil build         |
| Lint       | `npm run lint`    | Jalankan ESLint             |

---

## Deployment dengan Docker

Untuk menjalankan backend dalam container (production-like):

```bash
cd api-backend-bun

# Buat file .env.production dari .env dengan nilai production
cp .env .env.production
# Edit .env.production dengan nilai yang sesuai

# Build dan jalankan
docker compose up --build -d
```

Container yang berjalan:

- `dsc-photobox-backend` → port 3000
- `dsc-photobox-redis` → port 6379

---

## Drizzle Studio (Database GUI)

Untuk melihat dan mengedit data database secara visual:

```bash
cd api-backend-bun
bun db:studio
```

Buka di browser: `https://local.drizzle.studio`

---

## Git Workflow

### Branch Strategy

```
main              ← Produksi (stable)
└── refactor/iib  ← Branch pengembangan per anggota tim
```

### Commit Message Convention

Gunakan format [Conventional Commits](https://www.conventionalcommits.org/):

```
<type>: <deskripsi singkat>
```

| Type       | Keterangan                                   |
| ---------- | -------------------------------------------- |
| `feat`     | Fitur baru                                   |
| `fix`      | Bug fix                                      |
| `refactor` | Restrukturisasi kode tanpa mengubah perilaku |
| `style`    | Perubahan style/formatting saja              |
| `docs`     | Perubahan dokumentasi                        |
| `chore`    | Maintenance (update deps, config, dll)       |
| `test`     | Menambah/mengubah test                       |

**Contoh:**

```bash
git commit -m "feat: tambah filter grayscale pada capture step"
git commit -m "fix: perbaiki CORS error pada endpoint photos"
git commit -m "refactor: pisahkan usePhotobooth menjadi handler utils"
git commit -m "docs: update api-reference dengan endpoint customers"
```

---

## Troubleshooting

### ❌ CORS Error di Browser

Pastikan `ORIGIN_ALLOWED` di backend sama persis dengan URL frontend:

```env
ORIGIN_ALLOWED=http://localhost:5173
```

### ❌ Redis Connection Refused

Pastikan Docker Redis sudah berjalan:

```bash
docker ps | grep redis
# Jika tidak ada, jalankan:
docker compose up redis -d
```

### ❌ Webcam Tidak Terdeteksi

Browser butuh HTTPS atau `localhost` untuk mengakses `navigator.mediaDevices`. Pastikan dev server berjalan di `localhost:5173` (bukan IP address atau `127.0.0.1`).

### ❌ Supabase Auth Error

- Pastikan `SUPABASE_ANON_KEY` dan `SUPABASE_JWT_SECRET` sudah benar
- Cek apakah email admin sudah terdaftar di Supabase Authentication dashboard
- Pastikan RLS (Row Level Security) di Supabase dikonfigurasi dengan benar

### ❌ Drizzle Migration Error

```bash
# Reset dan generate ulang
bun db:generate
bun db:migrate
```

Jika skema berubah, gunakan `bun db:push` untuk development cepat.
