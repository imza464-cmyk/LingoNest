# LingoNest — Bilimsel, 5 Yaşından Yetişkine Doğal Dil Edinimi Platformu

## 1. Mimari Özet
- **Temel İlke:** 5 bağımsız bilimsel kaynaktan doğrulanmış (Krashen Comprehensible Input & Affective Filter, Paivio Dual Coding, Asher TPR, Baddeley Phonological Loop & Cowan Age-5 WM ≤ 3, Kuhl Social Gating, Roediger & Karpicke Testing Effect, Ye et al. FSRS-5 DSR) **sıfır-ceza, sıfır-kalp, ses-öncelikli** dil edinim motoru.
- **Matematiksel Çekirdek (`src/engine/fsrs5.ts`):** Resmi 19 ağırlıklı FSRS-5 DSR modeli (`R(t,S) = (1 + 19/81 * t/S)^(-0.5)`), `kmath` ile doğrulanmış Pareto diz-noktası (`R* = 0.90` Mini/Kaşif, `R* = 0.85` Usta) ve 5 yaş çocuklar için tepki süresi/tekrar sayısından örtük puanlama (`inferImplicitGrade`).
- **Ses & Telaffuz Motoru (`src/engine/audioEngine.ts`):** 1.969 stüdyo nöral ses paketi (`.vpak`, IDM-korumalı) + Web Speech API (`0.78x` çocuk temposu), Web Audio pentatonik marimba geri bildirimi (sert hata zili yasaktır) ve Türkçe anadil fonetiğine uyarlı çocuk-dostu ASR eşleyici (`matchSpokenAttempt`).
- **Müfredat (`src/data/curriculum.ts`):** 6 tematik dünya × 10 somut kavram = 60 kavram (İngilizce, Almanca, İspanyolca), 6 etkileşimli sesli mini hikaye ve 3-dilli 14 kontrastif fonetik tuzak laboratuvarı.
- **Hibrit Gizlilik & Bulut Çoklu-Kiracı Senkronizasyon (`src/engine/storage.ts`, `src/engine/cloudSync.ts`, `src/components/CloudAccountModal.tsx`):**
  - Çevrimdışı %100 yerel çoklu profil (`KVKK/COPPA` uyumlu, Ebeveyn Matematik Kapısı).
  - Canlı Bulut Arka Ucu: **Neon Lakebase Postgres 18** (`project_id: square-credit-05168902`, `branch_id: br-icy-grass-bhsdqu67`, `aws-eu-central-1`) + **Neon Managed Better Auth (`@neon/auth`)** + **Node.js 24 Neon Function (`lingonestapi`)**.
  - İstemci paketinde veritabanı parolası veya gizli anahtar bulunması **KESİNLİKLE YASAKTIR**; tüm `/vault`, `/plans`, `/checkout` ve HMAC-imzalı `/webhooks/payment` işlemleri EdDSA JWKS Bearer doğrulamasıyla sunucu tarafında yürütülür.

## 2. Kanonik Derleme & Zorunlu 7-Kapılı Web Zırhı (ATLANAMAZ)
Yeni derleme betiği yazmak veya `kweb_gate.py` kapısını devre dışı bırakmak **KESİNLİKLE YASAKTIR**:
- **Birim Testleri:** `npm test` (Vitest)
- **Tam Derleme + SSG Ön-Render + 7-Kapılı Denetim:** `npm run build`
  1. `tsc -b` (Katı TypeScript)
  2. `vite build` (İstemci paketi)
  3. `vite build --ssr src/entry-ssg.tsx --outDir .ssg-temp && node scripts/prerender_ssg.mjs` (Boş `<div id="root"></div>` yasağı; `dist/index.html` içine tam semantik HTML + SEO enjekte eder)
  4. `python "C:/Users/serit/projelerim/KALEOS/scripts/kweb_gate.py" .` (7 Kapı: SSG DOM, Teknik SEO/JSON-LD/Sitemap, a11y + Aydınlık Kurumsal Tema, Sıfır Hayalet UI, Sır Sızıntısı Zırhı, Gerçek Headless Chromium Mobil 390px + Masaüstü 1440px 0 Hata / 0 Taşma, JS Bütçesi)
- **Git Pre-Push Kilidi:** `.git/hooks/pre-push` otomatik olarak `kweb_gate.py` çalıştırır; 7/7 geçmeden `git push` reddedilir.
