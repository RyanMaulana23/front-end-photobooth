# TASK: Revise Photobooth AR Filters & Frame Layout

## Context

Project ini adalah web Photobooth React + Vite yang menggunakan webcam, face detection, canvas rendering, dan sistem filter AR.

Lakukan revisi terhadap implementasi filter AR dan rendering frame sesuai requirement berikut.

---

# 1. BOOTHCOOL BIRD FILTER

## Requirement

Perbaiki filter "Boothcool Burung".

Saat ini posisi aksesoris burung tidak mengikuti kepala dengan baik.

Filter harus:

- mengikuti posisi kepala secara real-time
- mengikuti rotasi kepala
- mengikuti scale wajah
- tetap stabil ketika user bergerak
- tidak jitter
- anchor berada di atas kepala

Gunakan smoothing interpolation agar perpindahan tidak patah-patah.

Target:

- seperti Snapchat
- seperti TikTok
- seperti Instagram AR

---

# 2. Chirstmas Filter AR

Saat ini hidung santa masih salah posisi.

Requirement:

Topeng hidung harus:

- tepat berada di landmark hidung
- mengikuti:
  - x
  - y
  - rotation
  - scale

Jangan menggunakan offset statis.

Gunakan nose landmark sebagai anchor utama.

Jika menggunakan MediaPipe FaceMesh:

Gunakan landmark:

nose tip

atau landmark yang paling akurat.

---

# 3. ANGEL WINGS Filter AR  

Saat ini sayap berada di belakang atau tidak proporsional.

Requirement:

Sayap harus berada di samping badan.

Posisi:

left wing  -> kiri bahu
right wing -> kanan bahu

Jika hanya tersedia face tracking:

estimasi shoulder position berdasarkan:

- face width
- chin
- head rotation

Jika body tracking tersedia:

gunakan shoulder landmark.

Sayap harus:

- mengikuti scale badan
- mengikuti rotasi tubuh ringan
- animasi idle sedikit
- tidak menutupi wajah

---


# 4. FRAME PHOTOBOOTH

Saat ini frame hasil photobooth belum rata.

Periksa seluruh pipeline:

- frame rendering
- canvas rendering
- photo strip generation
- compilePhotoStrip()
- drawImage()
- scaling
- object-fit
- padding
- slot positioning

Pastikan:

✔ seluruh slot memiliki ukuran sama

✔ tidak ada slot bergeser

✔ tidak ada frame yang melenceng

✔ seluruh foto center

✔ aspect ratio konsisten

✔ pixel perfect alignment

---

# 5. RESPONSIVE

Pastikan seluruh filter bekerja di:

- Laptop
- Desktop
- Android
- iPhone
- Tablet
- iPad

Tidak boleh ada offset berbeda antar device.

---

# 6. PERFORMANCE

Optimasi rendering.

Kurangi:

- jitter
- frame drop
- canvas redraw berlebihan

Gunakan:

requestAnimationFrame

cache image

memoization

asset preload

transform matrix

---

# 7. CODE QUALITY

Refactor jika diperlukan.

Pisahkan logic menjadi:

/filters
/hooks
/utils
/renderer
/components

Hindari duplicated code.

---

# 8. DO NOT BREAK EXISTING FEATURES

Jangan merusak:

- Camera
- Capture
- Countdown
- Preview
- Email
- Print
- Download
- Template
- Strip rendering

Semua fitur existing harus tetap berjalan.

---

# 9. ACCEPTANCE CHECKLIST

Project dianggap selesai apabila:

✅ Bird filter mengikuti kepala dengan stabil

✅ Santa nose tepat di hidung

✅ Angel wings berada di samping badan

✅ Electric mengikuti mata

✅ Frame photobooth benar-benar rata

✅ Tidak ada jitter

✅ Responsif di semua device

✅ Tidak ada bug baru

---

Sebelum mengubah kode:

1. Analisis seluruh struktur project.
2. Temukan file yang berkaitan dengan:
   - Face Detection
   - Face Mesh
   - Filter Rendering
   - Canvas Renderer
   - compilePhotoStrip()
   - Frame Layout
3. Jelaskan penyebab setiap bug.
4. Baru lakukan implementasi.
5. Setelah selesai, tampilkan daftar file yang diubah beserta alasan perubahan pada masing-masing file.