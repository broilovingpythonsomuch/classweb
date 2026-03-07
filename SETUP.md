# Setup ClassHub

## Deploy ke Vercel (Production)

**Penting:** SQLite TIDAK bisa jalan di Vercel. Harus pakai PostgreSQL (Neon).

### 1. Buat Database Neon (gratis)

1. Daftar di https://neon.tech
2. Buat project baru
3. Di Dashboard → Connection details → **Copy connection string**
4. Pastikan pakai format: `postgresql://user:pass@host/db?sslmode=require`

### 2. Setup Database

```bash
# Set DATABASE_URL di .env dulu (connection string dari Neon)
npx prisma db push
```

Lalu seed data: buka `https://your-app.vercel.app/api/seed` (setelah deploy) atau jalankan local dulu dan curl `http://localhost:3000/api/seed`.

### 3. Deploy ke Vercel

1. Push ke GitHub, import ke Vercel
2. Di Vercel Project Settings → Environment Variables, tambahkan:

| Variable | Value |
|----------|-------|
| DATABASE_URL | Connection string dari Neon |
| NEXTAUTH_SECRET | Generate: `openssl rand -base64 32` |
| NEXTAUTH_URL | `https://nama-project-anda.vercel.app` |

3. Deploy

### 4. Seed Data Setelah Deploy

Setelah deploy sukses, buka:
```
https://nama-project-anda.vercel.app/api/seed
```
Ini akan membuat admin dan 28 siswa. Jika sudah pernah di-seed, API akan return "Database already seeded".

---

## Menjalankan Lokal

1. Buat `.env` dari `.env.example`, isi DATABASE_URL (Neon) atau untuk test pakai SQLite:
   - SQLite: ubah schema ke `provider = "sqlite"` dan `DATABASE_URL="file:./dev.db"`
   - PostgreSQL: pakai connection string Neon
2. `npm install`
3. `npx prisma db push`
4. `npm run dev`
5. Buka http://localhost:3000
6. Untuk seed: `curl http://localhost:3000/api/seed`

## Login Admin

- **Email:** hari.baik202@gmail.com
- **Password:** imthedeveloper
- **Role:** ADMIN

## Data Siswa

28 siswa Class 7.3 ada di seed.
