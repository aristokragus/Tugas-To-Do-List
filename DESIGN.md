# Design Direction: Catatan Tugas • Dual-Pane Productivity Desk

A developer-grade, grounded productivity workspace inspired by modern tools like Linear and Routine. It absorbs the powerful functional concept of Microsoft To Do (smart views, checklist sub-tasks, deadline scheduling, interactive calendar, and Google Calendar export) while abandoning Microsoft To Do's visual cloning and 3-column Fluent UI layout in favor of an original 2-pane desk architecture.

## Design Dials
- **ENERGY: 2 (Focused & Calm)**: Obsidian slate workspace (`#090B10`) with sharp micro-accents and zero distraction.
- **RHYTHM: 3 (Dual-Pane Productivity Desk)**:
  - **Left Pane (60%)**: Stream agenda tugas dengan Fast Inline Composer dan segmented filter strip.
  - **Right Pane (40%)**: Persistent Interactive Calendar Desk & Task Inspector Hub yang selalu aktif berdampingan.
- **MOTION: 1 (Minimal & Functional)**: 150ms transitions, snappy outline focus states, zero bouncy fluff.

## Color System & Functional Accents
- **Workspace Surfaces**:
  - App Canvas Base: `#090B10` (Obsidian Charcoal)
  - Card & Container Surface: `#121620` (Dark Slate)
  - Card Hover: `#171D2B`
  - Inner Inset Surface: `#0E121A`
  - Elevated Popups / Modals: `#1E2536`
  - Hairline Borders: `rgba(255, 255, 255, 0.07)` to `rgba(255, 255, 255, 0.12)`
- **Functional Semantics**:
  - Focus Brand Blue: `#3B82F6` / `#2563EB`
  - High Priority / Important: `#F43F5E` (Warm Coral)
  - Due Today / Urgent: `#F59E0B` (Amber Gold)
  - Completed / Progress: `#10B981` (Emerald)
- **Text & Contrast**:
  - Primary Text: `#F1F5F9` (High contrast, AAA compliant)
  - Secondary Text: `#94A3B8` (Crisp legible slate)
  - Tertiary / Muted: `#64748B` / `#475569`

## Antislop Compliance & Original Identity
1. **Bebas dari Kloning Visual Microsoft To Do**: Tidak menggunakan tata letak 3-kolom Fluent UI, header gambar besar, atau sidebar daftar vertikal klise. Menggunakan *Dual-Pane Desk* dengan bilah filter horizontal di atas.
2. **Bebas dari Trop AI Klise**: Tidak ada kartu soliter melayang di tengah layar kosong, tidak ada gradien ungu neon, tidak ada glow blur berlebihan.
3. **Persistensi Kalender Interaktif**: Kalender bulanan tampil persisten di panel kanan meja kerja dengan indikator titik agenda dan filter klik tanggal langsung.
4. **Task Inspector Terpadu**: Rincian tugas, checklist sub-tugas berprogres persentase, tanggal & jam tenggat, dan catatan deskripsi dapat diakses instan tanpa popup mengambang yang menutupi agenda.
5. **Google Calendar Web Intent (Opsi A)**: Tombol aksi 1-klik yang mengekspor agenda ke Google Calendar via skema URL intent resmi (`https://calendar.google.com/calendar/render?action=TEMPLATE...`), membawa tanggal, waktu, catatan, dan rincian checklist tanpa repot otentikasi OAuth.
