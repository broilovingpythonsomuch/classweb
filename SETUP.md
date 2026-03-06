# Setup ClassHub

## Menjalankan Aplikasi

1. `npm install`
2. `npx prisma db push` (jika belum)
3. `npm run dev`
4. Buka http://localhost:3000

## Login Admin

- **Email:** hari.baik202@gmail.com
- **Password:** imthedeveloper
- **Role:** ADMIN (bisa mengubah semua data)

## Database Online (Neon/Supabase)

Saat ini menggunakan SQLite (file:./dev.db) - tidak perlu install database.

Untuk database online:
1. Daftar gratis di https://neon.tech
2. Buat project, salin connection string
3. Ubah `prisma/schema.prisma`: provider = "postgresql"
4. Ubah `.env`: DATABASE_URL="postgresql://..."
5. Jalankan `npx prisma db push`
6. Panggil GET /api/seed untuk mengisi data awal

## Data Siswa

28 siswa Class 7.3 sudah di-seed dari daftar yang diberikan.
