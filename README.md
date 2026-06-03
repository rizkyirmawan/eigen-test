# Backend Test Case

Proyek ini berisi dua bagian: API Library Management dan solusi algoritma.

```
eigen-test/
├── test-1/             # Library Management API
├── test-2/             # Solusi ALGORITMA
```

---

## test-1 — Library Management API

API untuk mengelola peminjaman buku di perpustakaan.

### Teknologi

- ExpressJS + TypeScript
- Prisma ORM + MySQL
- Swagger (OpenAPI 3)
- Zod (validasi)
- Vitest (testing)
- Pola DDD (Domain-Driven Design)

### Menjalankan Aplikasi

```bash
cd test-1
cp .env.example .env
# Sesuaikan DATABASE_URL di .env
npm install
npx prisma migrate dev --name init
npx tsx prisma/seed.ts
npm run dev
```

Aplikasi berjalan di `http://localhost:3000`. Dokumentasi API dapat diakses di `http://localhost:3000/api-docs`.

### Endpoint API

| Method | Endpoint | Deskripsi |
|---|---|---|
| GET | `/books` | Menampilkan seluruh buku beserta stok tersedia |
| GET | `/members` | Menampilkan seluruh member dengan jumlah buku yang dipinjam |
| POST | `/borrow` | Meminjam buku |
| POST | `/borrow/return` | Mengembalikan buku |

### Aturan Bisnis

1. **Peminjaman Buku**
   - Member tidak boleh meminjam lebih dari 2 buku
   - Buku yang dipinjam harus tersedia (tidak sedang dipinjam member lain)
   - Member tidak sedang dalam masa penalti

2. **Pengembalian Buku**
   - Buku yang dikembalikan harus sesuai dengan buku yang dipinjam
   - Jika pengembalian melebihi 7 hari, member akan mendapatkan penalti selama 3 hari

3. **Cek Buku**
   - Menampilkan seluruh buku beserta jumlah stok tersedia
   - Buku yang sedang dipinjam tidak dihitung sebagai stok tersedia

4. **Cek Member**
   - Menampilkan seluruh member
   - Menampilkan jumlah buku yang sedang dipinjam oleh masing-masing member

---

## test-2 — ALGORITMA

Solusi untuk empat soal algoritma. Setiap solusi dapat dijalankan secara terpisah.

```bash
cd test-2
node soal-1.js
node soal-2.js
node soal-3.js
node soal-4.js
```

### Daftar Soal

1. **Membalik Huruf** — Membalik urutan huruf pada string `"NEGIE1"` menjadi `"EIGEN1"`. Angka tetap berada di akhir kata.
2. **Kata Terpanjang** — Menemukan kata terpanjang dari sebuah kalimat. Jika terdapat kata dengan panjang yang sama, cukup ambil salah satu.
3. **Menghitung Kemunculan** — Menghitung berapa kali setiap kata dalam QUERY muncul di dalam INPUT.
4. **Selisih Diagonal Matriks** — Menghitung selisih antara jumlah diagonal utama dan diagonal sekunder dari matriks NxN.
