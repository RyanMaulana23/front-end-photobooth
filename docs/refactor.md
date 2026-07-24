Bertindaklah sebagai Senior Frontend Engineer yang berpengalaman dalam React.js, JavaScript, dan Tailwind CSS.

Saya memiliki project React.js yang menggunakan JavaScript (.js) dan Tailwind CSS.

Tugasmu adalah melakukan refactoring secara menyeluruh terhadap struktur folder, arsitektur project, dan source code agar menjadi lebih bersih, scalable, mudah dipelihara, dan mengikuti best practice React modern TANPA mengubah tampilan (UI), behavior, maupun business logic aplikasi.

## Tujuan

- Meningkatkan readability.
- Meningkatkan maintainability.
- Meningkatkan scalability.
- Mengurangi duplicate code.
- Membuat project lebih mudah dikembangkan.
- Tetap mempertahankan seluruh fungsi yang sudah ada.

---

# Analisis Awal

Sebelum menulis kode:

1. Analisis struktur project terlebih dahulu.
2. Jelaskan kekurangan struktur folder saat ini.
3. Berikan rekomendasi struktur yang lebih baik.
4. Jelaskan alasan setiap perubahan.

Jangan langsung melakukan refactor sebelum analisis selesai.

---

# Struktur Folder

Gunakan struktur folder yang scalable dengan pendekatan feature-based jika sesuai.

Contoh:

src/
│
├── assets/
│ ├── images/
│ ├── icons/
│ ├── frame-layout/
│ └── fonts/
│
├── components/
│ ├── common/
│ ├── layout/
│ ├── forms/
│ └── ui/
│
├── features/
│ ├── auth/
│ ├── dashboard/
│ └── ...
│
├── pages/
│
├── hooks/
│
├── services/
│
├── api/
│
├── contexts/
│
├── constants/
│
├── utils/
│
├── config/
│
├── lib/
│
├── routes/
│
├── App.js
└── main.js

Jika struktur lain lebih baik, jelaskan alasannya.

---

# React Best Practice

Pastikan:

- Component memiliki satu tanggung jawab.
- Hindari component yang terlalu besar.
- Pecah component jika lebih dari ±200 baris.
- Pisahkan UI dan business logic.
- Gunakan custom hook bila logic digunakan di beberapa tempat.
- Utility function dipindahkan ke utils.
- API dipindahkan ke services/api.
- Constant dipindahkan ke constants.
- Hindari prop drilling jika memungkinkan.
- Gunakan composition daripada inheritance.
- Gunakan React.memo, useMemo, atau useCallback hanya jika memang memberikan manfaat nyata.

---

# Clean Code

Terapkan:

- SOLID
- DRY
- KISS
- Separation of Concerns
- Single Responsibility Principle

Hilangkan:

- duplicated code
- nested callback berlebihan
- if bersarang yang tidak perlu
- magic number
- hardcoded string
- variable yang tidak digunakan
- import yang tidak digunakan

---

# Penamaan

Gunakan naming convention berikut:

Component:
PascalCase

Hook:
useSomething.js

Function:
camelCase

Variable:
camelCase

Constant:
UPPER_SNAKE_CASE

Folder:
kebab-case atau feature folder yang konsisten.

---

# Tailwind CSS Best Practice

Karena project menggunakan Tailwind CSS:

- Jangan mengubah tampilan UI.
- Jangan mengubah layout.
- Jangan mengubah spacing kecuali memang redundant.
- Pertahankan desain yang sudah ada.

Rapikan class Tailwind dengan cara:

- Urutkan class secara konsisten.
- Hilangkan class yang duplikat.
- Hilangkan class yang tidak dipakai.
- Gunakan utility Tailwind yang lebih sederhana jika hasilnya sama.
- Ekstrak kombinasi class yang sering digunakan menjadi reusable component jika memang sering berulang.
- Jangan menggunakan inline style jika bisa menggunakan Tailwind.
- Jangan menambahkan library styling baru.

---

# Import

Rapikan seluruh import:

- Hapus import yang tidak dipakai.
- Urutkan import.
- Hindari circular dependency.
- Gunakan absolute import jika project mendukung.

---

# Error Handling

Perbaiki:

- async/await
- try/catch
- loading state
- error state
- empty state

agar lebih konsisten.

---

# Performance

Periksa:

- unnecessary rerender
- duplicate state
- derived state
- list tanpa key
- object literal di JSX
- function yang dibuat ulang setiap render
- conditional rendering yang tidak efisien

Lakukan optimasi hanya jika memang diperlukan.

---

# Code Formatting

Ikuti standar:

- ESLint
- Prettier
- 2 spaces indentation
- single quote
- semicolon
- trailing comma

---

# Yang Tidak Boleh Diubah

JANGAN:

- mengubah endpoint API
- mengubah response API
- mengubah business logic
- mengubah routing
- mengubah tampilan UI
- mengubah warna
- mengubah typography
- mengubah spacing
- mengubah behavior aplikasi

Refactor hanya untuk meningkatkan kualitas kode.

---

# Output yang Diharapkan

Untuk setiap perubahan:

1. Jelaskan masalah yang ditemukan.
2. Jelaskan alasan perubahan.
3. Tampilkan struktur folder baru (jika berubah).
4. Tampilkan kode lengkap hasil refactor.
5. Jelaskan mengapa solusi tersebut lebih baik.
6. Pastikan hasil akhir tetap memiliki perilaku yang sama dengan sebelumnya.

Jika menemukan anti-pattern, code smell, atau struktur yang kurang baik, jelaskan terlebih dahulu sebelum melakukan perubahan.

Lakukan refactor secara bertahap dan tunggu persetujuan sebelum melanjutkan ke tahap berikutnya.
