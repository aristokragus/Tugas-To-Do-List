# Catatan Tugas • Dual-Pane Productivity Desk

Aplikasi pengelola agenda dan produktivitas (*Task Management*) modern berbasis web yang mengadopsi konsep kerja cerdas Microsoft To Do (kategori tugas, tenggat waktu, checklist sub-tugas, kalender bulanan, dan ekspor agenda) ke dalam arsitektur orisinal **Dual-Pane Desk** (terinspirasi alur kerja *Linear* & *Routine*).

Desain sepenuhnya menghindari kloning visual 3-kolom Microsoft To Do maupun estetika generik AI. Dibangun menggunakan **Vanilla JavaScript murni** (tanpa framework, zero-dependency), persistensi `localStorage`, proteksi sanitasi XSS, serta integrasi satu-klik **Google Calendar Web Intent (Opsi A)**.

---

## Fitur Utama

- **Dual-Pane Desk Architecture (Linear / Routine Style)**:
  - **Top Command Bar**: Header ringkas dengan search bar global (`/`), status indikator live, dan monogram brand.
  - **Filter Strip Horizontal**: Bilah filter segmented (*Semua*, *Hari Ini*, *Prioritas*, *Tenggat Dekat*, *Selesai*), dropdown kategori, urutan cerdas, dan pembuat kategori kustom.
  - **Panel Kiri (Agenda Stream)**: Fast Inline Task Composer (input teks, tanggal, kategori, prioritas) serta daftar kartu tugas terorganisir (*Terlewat Tenggat*, *Agenda Aktif*, *Accordion Selesai*).
  - **Panel Kanan (Productivity Desk)**:
    - **Kalender Bulanan Interaktif**: Selalu aktif berdampingan dengan feed agenda, dilengkapi penanda titik jadwal (*dots badge*) dan filter klik tanggal.
    - **Task Inspector Desk**: Panel inspeksi detail tugas yang tersinkronisasi instan saat kartu diklik (status penyelesaian, penyuntingan judul & catatan, pemilih tanggal & jam tenggat, checklist sub-tugas berprogres persentase, dan tombol hapus).
- **Integrasi Google Calendar (Opsi A - Web Intent)**:
  - Tombol **"Tambah ke GCal"** pada Task Inspector.
  - Menghasilkan tautan Google Calendar Template Intent (`https://calendar.google.com/calendar/render?action=TEMPLATE...`) secara instan membawa judul, rentang waktu ISO UTC, rincian catatan, dan daftar checklist tanpa perlu konfigurasi OAuth atau backend.
- **Checklist Sub-Tugas & Progress Tracker**:
  - Pecah tugas kompleks menjadi sub-langkah konkret dengan indikator rasio (misal `0/2`) dan *progress bar* dinamis.
- **Pencarian Cepat & Filter Multi-Kriteria**:
  - Filter pencarian *real-time* berbasis kata kunci pada judul, catatan, maupun sub-tugas.
  - Urutan fleksibel: Prioritas & Terbaru, Batas Waktu (*Due Date*), atau Abjad (A-Z).
- **Persistensi State Otomatis (LocalStorage)**:
  - Semua agenda, status, dan kategori tersimpan aman di peramban browser pengguna.
- **Keamanan & Standar Kode**:
  - Bersih dari celah XSS (semua input pengguna menggunakan rendering berbasis DOM nodes aman `textContent`).
- **Responsif di Seluruh Layar**:
  - Di desktop: tata letak 2 kolom seimbang (*60% Stream : 40% Desk Hub*).
  - Di perangkat seluler: tab switcher atas untuk beralih instan antara layar Agenda dan layar Kalender/Detail.

---

## Tech Stack

- **HTML5 Semantic**: Semantik bersih (`<header>`, `<main>`, `<section>`, Accessible Dialog Modals).
- **CSS3 Modern**: CSS Grid 2-kolom, hairline borders, palet Dark Slate Obsidian, micro-transitions 150ms.
- **Vanilla JavaScript (ES6+)**: Reaktif tanpa framework, LocalStorage API, zero-dependency.
- **Font Awesome 6**: Ikonografi fungsional.

---

## Struktur Berkas

```text
Tugas-To-Do-List/
├── index.html        # Struktur Dual-Pane Desk (Top Bar, Agenda Stream, Calendar & Inspector Hub)
├── style.css         # Desain bertema Obsidian Slate & Dual-Pane Desk (Linear/Routine aesthetic)
├── script.js         # Logika state, sinkronisasi inspector, kalender widget, & Google Calendar Intent
├── DESIGN.md         # Dokumentasi token visual, dials, & kepatuhan antislop
└── README.md         # Dokumentasi lengkap proyek
```

---

## Cara Menjalankan

1. Kloning repositori:
   ```bash
   git clone https://github.com/aristokragus/Tugas-To-Do-List.git
   cd Tugas-To-Do-List
   ```
2. Buka `index.html` langsung di peramban, atau jalankan web server lokal:
   ```bash
   python3 -m http.server 8000
   ```
3. Akses melalui browser di `http://localhost:8000`.

---

## Lisensi & Kontributor

© 2026 • Catatan Tugas • I Gst.N.Pt. Diana Putra Pratama (Agus) • [@aristokragus](https://github.com/aristokragus).
