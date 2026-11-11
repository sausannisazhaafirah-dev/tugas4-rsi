# Lapak Kantin — Sistem Review Kantin Kampus

Tugas 4 Praktikum Rekayasa Sistem Informasi: frontend React yang terintegrasi dengan backend Express dari Tugas 2 dan Tugas 3.

| | |
|---|---|
| Nama | Sausan Nisa Zhaafirah |
| NIM | L0225049 |
| Kelas | A |
| Metode HTTP client | **Axios** |

Aplikasi ini menampilkan daftar dan detail warung kantin, mengelola data warung (tambah, ubah, hapus) sesuai role pengguna, serta menyediakan registrasi, login, informasi akun, dan logout berbasis JWT.

## Teknologi

| Bagian | Teknologi |
|---|---|
| Frontend | React 19, TypeScript, Vite, Tailwind CSS 4, React Router 7, Axios, lucide-react |
| Backend | Node.js, Express 5, TypeScript (tsx), Drizzle ORM, Zod, JSON Web Token, bcryptjs, Swagger UI |
| Database | Microsoft SQL Server |

## Struktur folder

```
tugas4-rsi/
├── backend/            REST API (lanjutan Tugas 2 dan Tugas 3)
│   ├── db/             skrip SQL: database, user, tabel, dan data awal
│   └── src/            routes → controllers → services → repositories
└── frontend/           aplikasi React
    └── src/
        ├── lib/        http.ts (instance Axios), api.ts (semua request ke backend)
        ├── context/    status login (AuthProvider)
        ├── components/ layout, penjaga halaman (ProtectedRoute), komponen UI
        └── pages/      halaman daftar, detail, kelola, form, login, register, akun
```

## Prasyarat

- Node.js 22.18 atau lebih baru, dan npm
- SQL Server yang sedang berjalan (lokal atau lewat Docker)
- Aplikasi untuk menjalankan skrip SQL, misalnya DBeaver, Azure Data Studio, atau `sqlcmd`

## Instalasi dan menjalankan aplikasi

### 1. Clone repository

```bash
git clone https://github.com/sausannisazhaafirah-dev/tugas4-rsi.git
cd tugas4-rsi
```

### 2. Siapkan database

Jalankan skrip di folder `backend/db` secara berurutan:

1. `01-create-database-and-user.sql` membuat database `review_kantin` dan user aplikasi
2. `02-schema.sql` membuat tabel
3. `03-seed.sql` dan `04-seed-baru.sql` mengisi data awal
4. `05-seed-password-hashes.sql` mengisi password akun uji (bcrypt)

`00-setup-mixed-mode.sql` hanya diperlukan pada SQL Server Windows yang belum mengaktifkan login SQL (mixed mode).

### 3. Konfigurasi dan jalankan backend

```bash
cd backend
npm install
cp .env.example .env
```

Isi file `backend/.env`:

| Variabel | Keterangan |
|---|---|
| `DB_SERVER`, `DB_PORT` | alamat dan port SQL Server (default `localhost`, `1433`) |
| `DB_USER`, `DB_PASSWORD`, `DB_NAME` | user, password, dan nama database dari langkah 2 |
| `DB_ENCRYPT`, `DB_TRUST_SERVER_CERTIFICATE` | pengaturan koneksi (`false` dan `true` untuk lokal) |
| `JWT_SECRET` | string acak minimal 32 karakter, misalnya hasil `openssl rand -hex 32` |
| `JWT_EXPIRES_IN` | masa berlaku token, misalnya `2h` |
| `BCRYPT_SALT_ROUNDS` | jumlah putaran hash password, misalnya `10` |

Jalankan:

```bash
npm run dev
```

Backend berjalan di `http://localhost:3000`. Dokumentasi API (Swagger) tersedia di `http://localhost:3000/docs`.

### 4. Konfigurasi dan jalankan frontend

Buka terminal baru:

```bash
cd frontend
npm install
cp .env.example .env
npm run dev
```

Isi file `frontend/.env`:

| Variabel | Keterangan |
|---|---|
| `VITE_API_BASE_URL` | alamat API backend, default `http://localhost:3000/api/v1` |

Frontend berjalan di `http://localhost:5173`. Backend hanya menerima request dari alamat ini (CORS), jadi jalankan frontend di port 5173.

File `.env` berisi data rahasia dan tidak ikut diunggah ke GitHub. Yang diunggah hanya `.env.example`.

## Akun uji

Semua akun data awal memakai password `rahasia123` (diatur oleh `05-seed-password-hashes.sql`). Beberapa contoh:

| Email | Password | Role |
|---|---|---|
| admin@kantin.test | rahasia123 | admin |
| tini@kantin.test | rahasia123 | owner (pemilik Warung Bu Tini) |
| slamet@kantin.test | rahasia123 | owner (pemilik Kedai Pak Slamet) |
| yoga@student.test | rahasia123 | customer |

Akun baru yang dibuat lewat halaman Daftar selalu menjadi customer.

## Fitur dan hak akses

| Fitur | Endpoint | Publik | Customer | Owner | Admin |
|---|---|:-:|:-:|:-:|:-:|
| Daftar warung (cari, lokasi, kategori, halaman) | `GET /stalls` | ✓ | ✓ | ✓ | ✓ |
| Detail warung dan menu | `GET /stalls/:id`, `GET /stalls/:id/menus` | ✓ | ✓ | ✓ | ✓ |
| Daftar dan masuk | `POST /auth/register`, `POST /auth/login` | ✓ | | | |
| Informasi akun | `GET /auth/me` | | ✓ | ✓ | ✓ |
| Tambah warung | `POST /stalls` | | | ✓ | ✓ |
| Ubah warung | `PUT /stalls/:id` | | | warung miliknya | semua |
| Hapus warung | `DELETE /stalls/:id` | | | | ✓ |

Cara frontend menangani akses:

- Token JWT disimpan setelah login dan dikirim di header `Authorization: Bearer <token>` lewat interceptor Axios.
- Belum login lalu membuka halaman yang dilindungi: diarahkan ke halaman Masuk.
- Respons 401 dari backend (token tidak valid atau kedaluwarsa): sesi diakhiri dan pengguna diminta masuk lagi.
- Role tidak sesuai, misalnya customer membuka halaman Kelola: halaman 403.
- Owner mengubah warung milik orang lain: backend membalas 403 dan pesannya ditampilkan di form.
- Logout menghapus token dari browser, karena backend memakai JWT tanpa sesi di server.

Setiap halaman data menampilkan loading state, empty state, dan error state. Pesan validasi dari backend (Zod) ditampilkan di bawah input yang bersangkutan.
