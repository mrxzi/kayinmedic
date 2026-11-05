# Care Dashboard & Diarrhea Tracker (Medic Care Portal)

Aplikasi web modern untuk pemantauan diare & perawatan mandiri pasien dengan antarmuka klinis bersih (Clinical White & Teal), Live Chat in-app, terintegrasi database PostgreSQL, serta manajemen jadwal oleh Admin/Pendamping.

---

## 🌟 Fitur Utama

1. **Live Chat Langsung di Website**:
   - Pasien dan Admin dapat langsung bertukar pesan di aplikasi tanpa perlu membuka WhatsApp.
   - Tersedia tombol pesan cepat:
     - 💊 *Minta beliin Oralit sachet*
     - 🥣 *Minta bawain bubur hangat*
     - 🩹 *Perut kram melilit, butuh kompres hangat*
     - 🥛 *Tolong ambilin segelas air hangat*
   - Auto-refresh real-time dengan pesan tersimpan di database.

2. **Manajemen Akun Multi-Role**:
   - **Mode Pasien (Karin)**:
     - Mencatat buang air besar (Skala Bristol BSFS 1–7) & intensitas kram VAS (1–10).
     - Memantau asupan rehidrasi cairan (Air & Oralit).
     - Mengetahui batas target kunjungan toilet yang ditentukan Admin.
     - Melakukan live chat dengan pendamping.
   - **Mode Admin (Pendamping)**:
     - Mengatur **Jadwal & Batas Toilet Hari Ini** (misal: target maks. 3 kali).
     - Mengatur **Target Hidrasi** (misal: 2.500 ml).
     - Mengatur **Batas Peringatan Kritis** (misal: jika >= 4 kali, muncul alert waspada dehidrasi/anjuran dokter).
     - Menulis instruksi khusus yang langsung muncul di layar pasien.
     - Membalas chat langsung dari panel admin.

3. **Integrasi Database PostgreSQL**:
   - Menggunakan PostgreSQL untuk menyimpan:
     - Pesan live chat (`chat_messages`)
     - Jadwal & batas toilet yang diatur admin (`toilet_schedule`)
     - Rekam observasi feses & skor kram (`toilet_logs`)
     - Data hidrasi & profil pasien
   - Dilengkapi fallback auto-sync lokal sehingga data tetap tersimpan aman saat konfigurasi koneksi database.

4. **Tampilan Mobile-First Gaya Medis (Halodoc/Apple Health)**:
   - Navigasi jempol bawah (*bottom navigation bar*): Observasi, Live Chat, Jadwal Admin, Rehidrasi, dan Rekam Medis.
   - Tampilan klinis bersih, putih, dan rapi tanpa warna neon yang menyilaukan.

---

## 🚀 Cara Menjalankan

### 1. Jalankan Backend Server (Port 3001)
Buka terminal PowerShell:
```powershell
npm run server
```

### 2. Jalankan Frontend Vite (Port 5173)
Buka terminal PowerShell kedua:
```powershell
npm run dev -- --host
```

Akses di browser laptop atau handphone:
- **`http://localhost:5173`** (Laptop)
- Atau URL IP lokal (contoh: **`http://192.168.x.x:5173`**) pada smartphone pacar Anda yang terhubung di WiFi yang sama.

---

## ⚙️ Konfigurasi PostgreSQL

Konfigurasi database terdapat di file `.env`:
```env
PORT=3001
DATABASE_URL=postgresql://postgres:PASSWORD_POSTGRES_ANDA@localhost:5432/karin_medic
```
*Ganti `PASSWORD_POSTGRES_ANDA` dengan password PostgreSQL yang Anda atur saat instalasi di laptop.*
