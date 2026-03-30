# Design Token Studio
## PRD #1 of 2 — Local Web App
### Flow Testing & Audit

| | |
|---|---|
| **Version** | v0.1 MVP |
| **Status** | Draft — Internal Review |

---

## 1. Purpose & Scope

Dokumen ini mendefinisikan requirements untuk versi local web app dari Design Token Studio. Versi ini dibuat murni untuk flow testing dan UX auditing sebelum development Figma plugin dimulai.

> **Kenapa local dulu?**
> Membangun di browser environment menghilangkan kompleksitas Figma API, memungkinkan iterasi cepat pada core UX flow. Setiap step, interaksi, dan decision point bisa diaudit tanpa overhead development plugin.

### 1.1 What this version IS

- Fully interactive wizard flow yang mirror exact UX dari Figma plugin final
- Testing ground untuk validasi step sequence, decision points, dan user mental model
- Tool untuk identifikasi drop-off points dan confusing moments sebelum investasi ke plugin build

### 1.2 What this version is NOT

- Bukan production tool — output tidak connect ke Figma
- Bukan token management system — tidak ada persistent state antar session
- Bukan design tool — UI functional, tidak perlu polished

---

## 2. User Flow — Entry A (From Scratch)

Entry A adalah MVP flow. User mulai dari nol dan dipandu step-by-step untuk membangun design token foundation yang lengkap.

| Step | Nama | Deskripsi | Complexity |
|------|------|-----------|------------|
| Step 1 | Project Setup | Collect minimal config: brand name, spacing base, dark mode intent | Low |
| Step 2 | Color Foundation | Input brand colors, auto-generate primitive scale + neutral | Medium |
| Step 3 | Semantic Mapping | Plugin suggests semantic tokens, user curates | High |
| Step 4 | Typography | Input font family + weights, auto-generate type scale | Medium |
| Step 5 | Spacing / Radius / Shadow | Auto-generate dari base unit yang didefinisikan di Step 1 | Low |
| Step 6 | Review & Generate | Summary view, preview, lalu export output | Medium |
| Step 6b | Dark Mode (Phase 2) | Unlocked setelah Step 6 — side-by-side light/dark mapping | High |
| Step 7 | Component Tokens (Advanced) | Button, Input, Badge dengan visual preview | High |

---

### 2.1 Step Detail Specifications

---

#### Step 1 — Project Setup

First screen. Harus terasa lightweight dan inviting. Maksimal 3 input.

| Field | Type | Default | Notes |
|-------|------|---------|-------|
| Brand Name | Text input | — | Digunakan untuk penamaan collections dan docs |
| Base Spacing Unit | Visual toggle | 8px (Comfortable) | Tampilkan sebagai "Compact 4px" vs "Comfortable 8px" dengan visual preview — jangan tampilkan angka mentah di awal |
| Dark Mode | Toggle (yes/no) | No | Jika yes: struktur di-generate dark-mode-ready. Konten diisi di Phase 2 |

> **⚡ Audit checkpoint**
> Apakah Step 1 terasa cepat? Bisakah user menyelesaikannya dalam 30 detik tanpa berpikir keras? Jika tidak — kurangi atau reframe input-nya.

---

#### Step 2 — Color Foundation

User input brand colors. Plugin auto-generate complete primitive scale.

- Input: 1–5 brand colors (minimal 1 required)
- Neutral scale: selalu auto-generated, slightly warm/cool berdasarkan primary hue
- Scale yang di-generate: 50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950
- Warning trigger: jika dua input color memiliki delta hue < 30°, tampilkan warning *"These colors are very similar — consider using just one"*

> **⚡ Audit checkpoint**
> Apakah auto-generated scale terlihat benar untuk input color yang diberikan? Apakah neutral terasa harmonis? Apakah warning jelas tanpa terasa alarming?

---

#### Step 3 — Semantic Mapping

Step paling krusial. Plugin menyarankan semantic token assignments berdasarkan lightness logic. User curates, bukan creates dari nol.

**Essential tokens (selalu tampil — 9 tokens)**

| Token Name | Default Assignment | Logic |
|---|---|---|
| `color/text/primary` | Brand-900 | Darkest shade — highest contrast |
| `color/text/secondary` | Brand-600 | Mid-dark — supporting text |
| `color/text/disabled` | Neutral-400 | Desaturated — inactive state |
| `color/text/inverse` | White | Untuk digunakan di dark background |
| `color/bg/default` | White | Page background |
| `color/bg/subtle` | Neutral-50 | Alternate section background |
| `color/bg/inverse` | Brand-900 | Dark surface untuk inverse text |
| `color/border/default` | Neutral-200 | Standard divider/border |
| `color/interactive` | Brand-500 | CTA dan elemen interaktif |

**Extended tokens (collapsed by default — 12 additional tokens)**

- `color/interactive/hover` → Brand-600
- `color/interactive/pressed` → Brand-700
- `color/interactive/disabled` → Neutral-300
- `color/feedback/success` → Green-500
- `color/feedback/warning` → Yellow-500
- `color/feedback/error` → Red-500
- `color/feedback/info` → Blue-500
- `color/icon/default` → Neutral-700
- `color/icon/subtle` → Neutral-400
- `color/icon/inverse` → White
- `color/overlay` → Brand-900 @ 60% opacity
- `color/focus` → Brand-500 @ 40% opacity

> **UX Rule**
> Setiap suggestion harus memiliki satu baris reasoning yang ditampilkan inline. Contoh: *"Assigned as primary text — darkest shade in your scale."* Ini membangun trust dan mengajarkan user sambil mereka bekerja.

> **⚡ Audit checkpoint**
> Apakah suggestions terasa logical dan trustworthy pada pandangan pertama? Apakah split essential/extended ada di threshold yang tepat? Bisakah user menemukan dan meng-override token manapun dengan mudah?

---

#### Step 4 — Typography

User input info font. Plugin generate complete type scale.

| Field | Type | Default |
|-------|------|---------|
| Font Family | Text input | — |
| Available Weights | Multi-checkbox | Regular, SemiBold, Bold |
| Base Size | Number input | 16px |
| Scale Ratio | Dropdown (named) | Major Third (1.25×) |

Scale categories yang di-generate:

- **Display**: 4 ukuran (D1–D4) — untuk hero/marketing use
- **Heading**: 4 ukuran (H1–H4)
- **Body**: 4 ukuran (B1–B4) — default, small, large, XS
- **Caption**: 2 ukuran (C1–C2)

> **⚡ Audit checkpoint**
> Apakah weight selector intuitif? Apakah generated scale terasa balanced? Apakah pilihan ratio terasa meaningful atau membingungkan untuk non-technical user?

---

#### Step 5 — Spacing, Radius, Shadow

Semua auto-generated dari base unit yang didefinisikan di Step 1. User bisa adjust nilai manapun.

**Spacing scale (T-shirt sizing, default)**

| Token | Base 4px | Base 8px |
|-------|----------|----------|
| `spacing/2xs` | 2px | 4px |
| `spacing/xs` | 4px | 8px |
| `spacing/sm` | 8px | 12px |
| `spacing/md` | 12px | 16px |
| `spacing/lg` | 16px | 24px |
| `spacing/xl` | 24px | 32px |
| `spacing/2xl` | 32px | 48px |
| `spacing/3xl` | 48px | 64px |

**Border radius scale**

| Token | Value |
|-------|-------|
| `radius/none` | 0px |
| `radius/sm` | 4px |
| `radius/md` | 8px |
| `radius/lg` | 16px |
| `radius/full` | 9999px |

**Shadow scale**

| Token | Value |
|-------|-------|
| `shadow/sm` | 0 1px 2px rgba(0,0,0,0.05) |
| `shadow/md` | 0 4px 6px rgba(0,0,0,0.07) |
| `shadow/lg` | 0 10px 15px rgba(0,0,0,0.10) |
| `shadow/xl` | 0 20px 25px rgba(0,0,0,0.15) |

> **⚡ Audit checkpoint**
> Apakah auto-generated spacing terasa benar untuk base unit yang dipilih? Apakah scale terasa terlalu sparse atau terlalu dense? Apakah T-shirt sizing intuitif?

---

#### Step 6 — Review & Generate

Summary screen sebelum output di-generate. Harus terasa seperti final confirmation, bukan wall of data.

**Display format — summary by category:**

```
🎨 Colors      → X primitives, Y semantic tokens
📝 Typography  → X font styles
📐 Spacing     → X tokens
⭕ Radius      → X tokens
🌑 Shadow      → X tokens

Total: N tokens akan di-generate
```

**Actions yang tersedia:**

- ← Back ke step manapun (breadcrumb navigation)
- Preview — tampilkan simulated canvas output
- Export JSON — download token JSON (W3C DTCG format)
- Copy JSON — copy ke clipboard

> **Local app note**
> Di versi lokal, "Generate" menghasilkan JSON file dan canvas-preview panel. Tidak ada koneksi ke Figma. Ini disengaja — tujuannya adalah mengaudit flow, bukan format output.

> **⚡ Audit checkpoint**
> Apakah summary screen terasa reassuring? Apakah user tahu apa yang akan di-generate? Apakah token count akurat dan meaningful?

---

## 3. Output Specification (Local Version)

Local app menghasilkan dua output untuk keperluan audit:

| Output | Format | Purpose |
|--------|--------|---------|
| Token JSON | W3C DTCG (.json) | Dev handoff reference + future Figma import |
| Canvas Preview | In-browser HTML panel | Visual audit dari color scales, type ramp, dan spacing system |

### 3.1 JSON Structure (W3C DTCG format)

```json
{
  "color": {
    "primitive": {
      "brand-500": { "$value": "#4F46E5", "$type": "color" },
      "brand-900": { "$value": "#1E1B4B", "$type": "color" }
    },
    "semantic": {
      "text": {
        "primary": { "$value": "{color.primitive.brand-900}", "$type": "color" },
        "secondary": { "$value": "{color.primitive.brand-600}", "$type": "color" }
      },
      "bg": {
        "default": { "$value": "#FFFFFF", "$type": "color" },
        "subtle": { "$value": "{color.primitive.neutral-50}", "$type": "color" }
      }
    }
  },
  "typography": {
    "size": {
      "display-01": { "$value": "57px", "$type": "dimension" },
      "body-01": { "$value": "16px", "$type": "dimension" }
    }
  },
  "spacing": {
    "md": { "$value": "16px", "$type": "dimension" }
  }
}
```

---

## 4. Audit Criteria

Setelah menggunakan local app, evaluasi setiap dimensi di bawah. Temuan ini langsung menginformasikan Figma plugin build.

| Dimensi | Pertanyaan | Pass Criteria |
|---------|------------|---------------|
| Flow Linearity | Apakah step-by-step terasa natural atau constraining? | User menyelesaikan semua step tanpa ingin go back lebih dari sekali |
| Step 1 Clarity | Apakah Project Setup benar-benar lightweight? | Diselesaikan dalam < 30 detik tanpa confusion |
| Color Generation | Apakah auto-generated scale terlihat benar? | User tidak perlu manually adjust lebih dari 2 nilai |
| Semantic Suggestions | Apakah suggestions trustworthy pada pandangan pertama? | User approve > 70% suggestions tanpa mengubahnya |
| Reasoning Labels | Apakah satu baris "why" membangun trust? | User memperhatikan dan membacanya; tidak merasa terganggu |
| Essential vs Extended | Apakah split token ada di threshold yang tepat? | Non-designer stay di Essential; lead explore Extended |
| Typography Weights | Apakah weight selector intuitif? | Tidak ada user yang bertanya "apa maksud ini?" |
| Spacing Feel | Apakah T-shirt naming terasa natural? | User merujuk ukuran dengan nama (md, lg), bukan angka |
| Review Summary | Apakah summary screen reassuring? | User klik Generate dengan confidence, bukan ketidakpastian |
| Output JSON | Apakah strukturnya benar untuk developer? | Developer langsung memahami struktur tanpa penjelasan |

---

## 5. Suggested Tech Stack (Local App)

| Layer | Recommendation | Reason |
|-------|---------------|--------|
| Framework | React + Vite | Setup cepat, component-friendly untuk wizard steps |
| Styling | Tailwind CSS | Rapid UI tanpa custom CSS overhead |
| State Management | Zustand atau useState | Wizard state cukup simple untuk local state |
| Color Generation | chroma.js | Reliable color scale generation dari single hex |
| JSON Export | Native browser download | Tidak butuh backend |
| Canvas Preview | Inline HTML/CSS render | Tidak butuh canvas library untuk audit purposes |

---

## 6. Out of Scope — Local Version

- Figma API connection dalam bentuk apapun
- User accounts atau persistent storage
- Dark mode generation (Phase 2)
- Component tokens / Step 7 (Phase 2)
- Entry B (scan canvas) dan Entry C (import JSON)
- Canvas documentation generation
- Multi-brand atau multi-theme support

---

## 7. Success Metrics — Audit Complete When

1. Semua 10 audit criteria di Section 4 telah dievaluasi dengan verdict pass/fail
2. Minimal satu full end-to-end flow telah diselesaikan dari Step 1 ke Step 6
3. Generated JSON telah direview oleh minimal satu developer untuk structural correctness
4. Setiap failing audit criteria telah didokumentasikan dengan proposed flow changes
5. Flow changes telah diincorporate sebelum Figma plugin PRD difinalisasi
