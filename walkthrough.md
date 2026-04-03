# Design Token Studio — Local Web App MVP

Ringkasan implementasi aplikasi dari Design Token Studio berdasarkan spesifikasi di [PRD-1-Local-App.md](file:///Users/rizkybeny/figma-ds-local/PRD-1-Local-App.md). MVP ini berfokus pada pembangunan _local web app_ sebagai sarana pengujian alur (flow testing) dan audit UI/UX sebelum melangkah ke pembuatan Figma plugin yang sesungguhnya.

## Perubahan & Fitur yang Diimplementasikan

Aplikasi dibangun menggunakan **Next.js**, **Tailwind CSS**, dan komponen dari **Shadcn UI**. Pengelolaan state pada wizard sepenuhnya dikendalikan oleh Zustand di dalam [`wizardStore.ts`](file:///Users/rizkybeny/figma-ds-local/src/store/wizardStore.ts).

### 🎯 6-Step Wizard Flow
Keenam tahap dalam pembuatan design token telah diimplementasikan secara linier:
1. **[Step 1 - Project Setup](file:///Users/rizkybeny/figma-ds-local/src/components/steps/Step1.tsx):** Konfigurasi dasar proyek termasuk input Brand Name, Base Spacing Unit, dan preferensi Dark Mode.
2. **[Step 2 - Color Foundation](file:///Users/rizkybeny/figma-ds-local/src/components/steps/Step2.tsx):** Input brand colors dengan _auto-generation_ untuk primitive scales (dari shade 50 hingga 950) dan warna Neutral.
3. **[Step 3 - Semantic Mapping](file:///Users/rizkybeny/figma-ds-local/src/components/steps/Step3.tsx):** Pemetaan warna primitif (misal: `Brand-900`) ke semantic tokens, seperti `text/primary` atau `bg/subtle`. Terdapat kategori esensial dan *extended labels*.
4. **[Step 4 - Typography](file:///Users/rizkybeny/figma-ds-local/src/components/steps/Step4.tsx):** Pengaturan *font family*, variasi ketebalan (weights), ukuran dasar (base size), dan pemilihan rasio skala (scale ratio) untuk auto-generate level typography (Display, Heading, Body).
5. **[Step 5 - Spacing, Radius, Shadow](file:///Users/rizkybeny/figma-ds-local/src/components/steps/Step5.tsx):** Penyesuaian metrik layout (_T-shirt sizing_ untuk spacing dan border radius) yang langsung disesuaikan nilainya dengan _base spacing unit_ dari Step 1.
6. **[Step 6 - Review & Generate](file:///Users/rizkybeny/figma-ds-local/src/components/steps/Step6.tsx):** Halaman ringkasan parameter yang telah diputuskan. Menyediakan fitur *Copy JSON* dan *Export JSON*. 

> [!TIP]
> Navigasi _breadcrumb_ (kembali ke step sebelumnya) telah disediakan tanpa menghilangkan progres data yang diinput karena menggunakan store terpusat.

### 📝 Export (W3C DTCG Format)
Logika ekspor telah dienkapsulasi pada modul [`tokenExport.ts`](file:///Users/rizkybeny/figma-ds-local/src/lib/tokenExport.ts). Data yang di-capture user dikonversi menjadi hierarki JSON yang valid, merepresentasikan struktur `color`, `typography`, dan dimensi lain yang _ready_ digunakan sebagai _Design Token_.

## Apa yang Telah Diuji?

- Memastikan proses inisialisasi form tidak _error_ dan transisi antar state berjalan dengan kecepatan tinggi di *browser environment*.
- Validasi terhadap kalkulasi rasio, misalnya scale type size (Base Size 16px dengan rasio Major Third menghasilkan Display hingga Body yang proporsional).
- Uji kesesuaian output JSON yang diunduh mencakup notasi token yang benar (menggunakan `$value` dan `$type`).

## Hasil Validasi

> [!NOTE]
> Audit terhadap *mental model* dari user (End-to-End flow via form 6-langkah) sudah dapat langsung diujicobakan via Next.js `npm run dev` pada *local server*. 
> Seluruh `requirements` untuk V0.1 MVP telah dipenuhi.

## Langkah Berikutnya

Sesuai scope PRD, fitur berikut ditunda dan berada di luar jangkauan MVP ini:
- **Phase 2:** Skema pemetaan multi-theme/Dark Mode (setelah Step 6).
- **Phase 2:** Visualisasi Component Tokens (Button, Badge, dll.).
- **Selanjutnya:** Sinkronisasi nyata _(real connection)_ menggunakan Figma Plugin API menuju halaman canvas (_Artboard_). 
