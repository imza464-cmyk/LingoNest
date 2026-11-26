# LingoNest Hata Kayıt Defteri

## [#LN-01] 2026-11-25 — IDM Tarayıcı Eklentisinin `.mp3` Nöral Sesleri Kaçırması
- **Belirti:** Windows'ta IDM kurulu tarayıcılarda `fetch('/audio/*.mp3')` çağrıları IDM tarafından yakalanıp indirme penceresi açıyordu.
- **Kök Neden:** IDM eklentisi `.mp3`, `.bin` uzantılarını veya `Content-Type: audio/mpeg` yanıtlarını yakalayıp tarayıcıdan koparır.
- **Çözüm & Doğrulama:** Tüm stüdyo nöral sesler `.vpak` uzantısına (`application/octet-stream`) taşındı ve tarayıcı içinde `fetch().arrayBuffer()` → `new Blob([buf], { type: 'audio/mpeg' })` ile bellekte çözüldü.

## [#LN-02] 2026-11-26 — v1.2.0 Şeytanın Avukatı Denetimi (17 P0/P1/P2 Kusuru)
- **Belirti:** Android 15 (`targetSdk 35`) edge-to-edge sistem çubuğu çakışması, WebView `blob:` JSON indirme arızası ve yedek geri yükleme eksikliği, SW çevrimdışı JSON→HTML fallback kirliliği, `stopSpeaking()` Promise sızıntısı, alt-görünüm geri tuşu atlaması, tek-dilli (sadece EN) Ses Labı, yetişkin FSRS istatistiklerinin çocuk dünyalarını sayması ve ilk-açılış sihirbazı eksikliği.
- **Kök Neden:** `MainActivity.kt`'de `WindowInsetsListener` / `LOAD_CACHE_ONLY` / `shareJsonBackup` eksikliği; `sw.js`'de navigasyon dışı isteklerin HTML'e düşmesi; `audioEngine.ts`'de çözümsüz ses Promise'i; `App.tsx` / bileşenlerde eksik alt-geri yığını ve tek-dilli fonetik veri modeli.
- **Çözüm & Ampirik Doğrulama:**
  - Android `v1.2.0` (Build 3): `ViewCompat.setOnApplyWindowInsetsListener`, `AndroidBridge.shareJsonBackup`, `LOAD_CACHE_ONLY` çevrimdışı kurtarma, `onPause()` ses/mikrofon temizliği.
  - Web/PWA (`sw.js v3` + 14 bileşen): `14` çok-dilli fonemik tuzak (`6 EN + 4 DE + 4 ES`), `1.969` `.vpak` (`2.083` anahtar, `39.81 MB`), Mini 5 yaş **"Eşini Bul! 🃏"**, `OnboardingModal`, çapraz-modül FSRS günlük tekrar kuyruğu, Step 3 Shadowing spoiler kilidi, DP Levenshtein Cloze fark motoru, profil düzenleme/silme/günlük hedef.
  - Doğrulama: `tsc --noEmit` (`0`), `vitest` (`15/15 PASS`), CSS denetimi (`0` eksik), GitHub Pages (`HTTP 200`, `index-CulMEVSt.js`, `sw.js v3`, `2.083` anahtar), Kale Store R2 CDN (`v1.2.0 Build 3`, `SHA256=1066e1f618fb...`, `HEAD HTTP 200`, `2.197.726 B`).
# LingoNest Hata Kayıt Defteri

## [#LN-03] 2026-11-26 — Boş SPA SEO Körlüğü, Neon Bulut Kimlik/Kasa Entegrasyonu & 7-Kapılı Zorunlu Derleme Zırhı
- **Belirti:** İstemci-tarafı Vite SPA çıktısı arama motorlarına boş `<div id="root"></div>` sunuyor ve çoklu cihaz senkronizasyonu için sunucu-yetkili kimlik/veritabanı katmanı bulunmuyordu.
- **Kök Neden:** SSG ön-render adımı, `canonical`/`JSON-LD`/`sitemap.xml` bildirimleri ve bulut arka ucu (`Auth + Postgres + Sunucu-Yetkili Plan/Ödeme`) eksikliği.
- **Çözüm:** `src/entry-ssg.tsx` + `scripts/prerender_ssg.mjs` ile derleme zamanı SSG ön-render eklendi; Neon Lakebase Postgres 18 (`square-credit-05168902`), Managed Better Auth (`@neon/auth`) ve `lingonestapi` Neon Function devreye alındı; `CloudAccountModal.tsx` ile aydınlık kurumsal bulut kasası ve aile planı arayüzü bağlandı; `npm run build` ve `.git/hooks/pre-push` içine `kweb_gate.py` (7 Kapı) kilitlendi.
- **Ampirik Doğrulama:** `npm test` (`15/15 PASS`), `npm run build` (`7/7 KAPI PASS`), canlı API `/health` (`200`), `/plans` (`200`), yetkisiz `/vault` (`401`).
