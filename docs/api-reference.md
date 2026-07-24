# API Reference — DSC Photobox Backend

Base URL (Development): `http://localhost:3000`  
Base URL API: `http://localhost:3000/api`  
Dokumentasi Interaktif: `http://localhost:3000/api-docs` (Swagger UI)

---

## Response Format

Semua endpoint menggunakan format response yang terstandarisasi:

### Success Response

```json
{
  "success": true,
  "message": "Pesan sukses",
  "data": { ... },
  "fromCache": false
}
```

### Error Response

```json
{
  "success": false,
  "message": "Pesan error",
  "error": "Detail error (jika ada)"
}
```

> `fromCache: true` menandakan data diambil dari Redis cache, bukan database.

---

## Health Check

### `GET /`

Mengecek status server.

**Response** `200 OK`

```json
{ "status": "ok", "uptime": 123.45 }
```

---

## Photo Sessions

### `POST /api/photo-sessions`

Membuat sesi foto baru. Menghasilkan ID sesi unik dengan format `DSCP_xxxxxx`.

**Request Body**: Tidak diperlukan

**Response** `201 Created`

```json
{
  "success": true,
  "message": "Berhasil membuat photo session",
  "data": {
    "id": "DSCP_mqB4uE",
    "zipUrl": null,
    "createdAt": "2025-07-19T10:00:00.000Z"
  }
}
```

**Error**
| Code | Penyebab |
|------|----------|
| `400` | Gagal membuat sesi di database |

---

## Photos

### `POST /api/photos/:sessionId`

Upload foto ke Supabase Storage, membuat arsip ZIP, dan menyimpan URL ke database.

**Path Parameter**
| Parameter | Tipe | Keterangan |
|-----------|------|------------|
| `sessionId` | `string` | ID sesi (contoh: `DSCP_mqB4uE`) |

**Request Body**: `multipart/form-data`
| Field | Tipe | Keterangan |
|-------|------|------------|
| `files` | `File[]` | Array file foto (PNG/JPEG) |

**Response** `201 Created`

```json
{
  "success": true,
  "message": "Berhasil upload photos",
  "data": {
    "zipUrl": "https://supabase.co/storage/v1/object/public/.../DSCP_mqB4uE.zip",
    "photos": [
      {
        "id": 1,
        "sessionId": "DSCP_mqB4uE",
        "fileName": "photo-1.png",
        "fileUrl": "https://supabase.co/storage/v1/object/public/.../photo-1.png",
        "folderName": "DSCP_mqB4uE"
      }
    ]
  }
}
```

**Error**
| Code | Penyebab |
|------|----------|
| `404` | `sessionId` tidak ditemukan |
| `400` | Gagal upload ke storage |
| `500` | Server error, file di storage otomatis dihapus (rollback) |

---

### `GET /api/photos/:sessionId`

Mengambil semua foto milik satu sesi beserta data pelanggan.

**Path Parameter**
| Parameter | Tipe | Keterangan |
|-----------|------|------------|
| `sessionId` | `string` | ID sesi |

**Response** `200 OK`

```json
{
  "success": true,
  "message": "Berhasil mendapatkan photos",
  "fromCache": false,
  "data": {
    "customer": {
      "id": 1,
      "name": "Aditya Pratama",
      "npm": "5042130XX",
      "email": "aditya@email.com",
      "phoneNumber": "081234567890",
      "major": "Informatika",
      "instagramUsername": "aditya"
    },
    "photos": [
      {
        "id": 1,
        "fileName": "photo-1.png",
        "fileUrl": "https://..."
      }
    ]
  }
}
```

**Error**
| Code | Penyebab |
|------|----------|
| `404` | Session tidak ditemukan atau tidak ada foto |

---

## Customers

### `POST /api/customers/:sessionId`

Menyimpan data pelanggan yang terhubung ke sesi foto.

**Path Parameter**
| Parameter | Tipe | Keterangan |
|-----------|------|------------|
| `sessionId` | `string` | ID sesi |

**Request Body** `application/json`

```json
{
  "name": "Aditya Pratama",
  "email": "aditya@email.com",
  "npm": "5042130XX",
  "phoneNumber": "081234567890",
  "major": "Informatika",
  "instagramUsername": "aditya_ig"
}
```

| Field               | Tipe     | Wajib | Keterangan                            |
| ------------------- | -------- | ----- | ------------------------------------- |
| `name`              | `string` | ✅    | Nama lengkap (min 1, max 100)         |
| `email`             | `string` | ✅    | Email valid, bukan email disposable   |
| `npm`               | `string` | ✅    | Nomor Pokok Mahasiswa (min 1, max 15) |
| `phoneNumber`       | `string` | ❌    | Nomor handphone (8 - 15 angka/+)      |
| `major`             | `string` | ✅    | Jurusan/program studi                 |
| `instagramUsername` | `string` | ❌    | Username Instagram                    |

**Response** `201 Created`

```json
{
  "success": true,
  "message": "Berhasil menyimpan data customer",
  "data": {
    "id": 1,
    "sessionId": "DSCP_mqB4uE",
    "name": "Aditya Pratama",
    "email": "aditya@email.com"
  }
}
```

**Error**
| Code | Penyebab |
|------|----------|
| `404` | `sessionId` tidak ditemukan |
| `400` | Data tidak valid / customer gagal dibuat |
| `422` | Validasi Zod gagal (field tidak sesuai) |

---

## Admins 🔐

Semua endpoint admin yang butuh autentikasi harus menyertakan header:

```
Authorization: Bearer <access_token>
```

---

### `POST /api/admins/register`

Mendaftarkan akun admin baru.

> ⚠️ **Rate Limited**: Maksimal beberapa request per menit (dikonfigurasi via `adminAuthRateLimiter`).

**Request Body**

```json
{
  "email": "admin@dsc.com",
  "password": "password_aman",
  "confirmPassword": "password_aman"
}
```

**Response** `201 Created`

```json
{
  "success": true,
  "message": "Register admin berhasil",
  "data": { "id": "uuid", "email": "admin@dsc.com" }
}
```

**Error**
| Code | Penyebab |
|------|----------|
| `400` | Password tidak cocok atau email sudah terdaftar |
| `429` | Rate limit tercapai |

---

### `POST /api/admins/login`

Login admin, mengembalikan `accessToken` JWT dari Supabase Auth.

**Request Body**

```json
{
  "email": "admin@dsc.com",
  "password": "password_aman"
}
```

**Response** `200 OK`

```json
{
  "success": true,
  "message": "Admin berhasil login",
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "id": "uuid",
    "email": "admin@dsc.com",
    "lastLogin": "2025-07-19T10:00:00.000Z"
  }
}
```

---

### `GET /api/admins/me` 🔒

Mengambil data profil admin yang sedang login.

**Response** `200 OK`

```json
{
  "success": true,
  "message": "Admin berhasil login",
  "fromCache": true,
  "data": {
    "id": "uuid",
    "email": "admin@dsc.com",
    "lastLogin": "2025-07-19T10:00:00.000Z"
  }
}
```

---

### `DELETE /api/admins/logout` 🔒

Logout admin, menghapus token dari cache Redis.

**Response** `200 OK`

```json
{
  "success": true,
  "message": "Admin berhasil logout"
}
```

---

### `GET /api/admins/customers` 🔒

Mengambil semua data pelanggan. Mendukung filter by email.

**Query Parameter**
| Parameter | Tipe | Keterangan |
|-----------|------|------------|
| `email` | `string` | (Opsional) Filter pelanggan berdasarkan email |

**Response** `200 OK`

```json
{
  "success": true,
  "message": "Admin berhasil mendapatkan semua customers",
  "fromCache": false,
  "data": [
    {
      "id": 1,
      "nama": "Aditya Pratama",
      "npm": "5042130XX",
      "email": "aditya@email.com",
      "jurusan": "Informatika"
    }
  ]
}
```

---

### `GET /api/admins/sessions` 🔒

Mengambil semua sesi foto beserta foto dan data pelanggan (grouped by session).

**Response** `200 OK`

```json
{
  "success": true,
  "message": "Admin berhasil mendapatkan semua session",
  "fromCache": false,
  "data": [
    {
      "photoSession": {
        "id": "DSCP_mqB4uE",
        "zipUrl": "https://...",
        "createdAt": "2025-07-19T10:00:00.000Z"
      },
      "customer": {
        "nama": "Aditya Pratama",
        "email": "aditya@email.com"
      },
      "photos": [
        { "id": 1, "fileName": "photo-1.png", "fileUrl": "https://..." }
      ]
    }
  ]
}
```

---

## Error Code Summary

| HTTP Code | Arti                                                  |
| --------- | ----------------------------------------------------- |
| `200`     | OK — Request berhasil                                 |
| `201`     | Created — Data berhasil dibuat                        |
| `400`     | Bad Request — Input tidak valid / operasi gagal       |
| `401`     | Unauthorized — Token tidak ditemukan atau tidak valid |
| `403`     | Forbidden — Tidak punya izin                          |
| `404`     | Not Found — Data tidak ditemukan                      |
| `422`     | Unprocessable Entity — Validasi Zod gagal             |
| `429`     | Too Many Requests — Rate limit tercapai               |
| `500`     | Internal Server Error — Kesalahan server              |
