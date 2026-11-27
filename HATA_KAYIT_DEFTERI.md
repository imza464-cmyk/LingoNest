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

## [#LN-04] 2026-11-27 — İspanyolca Ters Ünlem (`¡`) Spoiler Sızıntısı, 12 Bölümlü Kontrastif Dilbilgisi Rehberi, OCC Bulut Kasa Birleştirme & `lingonestapi v3.0.0` + Canlı HTTPS Yayını
- **Belirti:**
  1. `src/data/adultCurriculum.ts` içindeki `ADULT_DIALOGUES` senaryolarında 5 İspanyolca çeldirici şıkta açılış ters ünlem işareti (`¡`) eksikti (`Sin problema!`, `Tranquilo!`, `Estoy de acuerdo que sí!`, `Todo era bueno!`, `Estoy de acuerdo!`); bu durum hem İspanyolca yazım kuralını ihlal ediyor hem de doğru şıkkı noktalama işaretinden ele veriyordu.
  2. Yetişkin ve genç öğrenenler için Türkçe L1 düşünme alışkanlıklarını İngilizce/Almanca/İspanyolca sözdizimiyle karşılaştıran kapsamlı bir başvuru rehberi yoktu; ayrıca yetişkin çalışma ekranında mühendislik jargonu (`"FSRS-5 Aktif Üretim Kokpiti"`, `"R* = 85% Pareto"`) yer alıyordu.
  3. İki farklı cihazdan eşzamanlı bulut senkronizasyonu yapıldığında son yazanın önceki FSRS kartlarını ezme riski (OCC eksikliği) bulunuyordu.
- **Kök Neden (Adli Kanıt):**
  1. Çok-dilli diyalog ve cümle kalıplarını derleme öncesi otomatik denetleyen adli dilbilim kapısı bulunmuyordu.
  2. `PUT /vault` uç noktasında `expectedRevision` iyimser eşzamanlılık kilidi (`409 Conflict`) ve istemci tarafında tahribatsız `mergeLingoVaults` birleştiricisi yoktu.
- **Çözüm & Kurallaştırma:**
  1. [`scripts/verify_linguistic_accuracy.py`](file:///C:/Users/serit/projelerim/LingoNest/scripts/verify_linguistic_accuracy.py) yazılarak `npm run build` boru hattına kilitlendi (`a/an` sesli uyumu, İspanyolca `¿...`/`¡...` simetrisi, Cloze `___`, SVO/kelime sırası tam yeniden inşa ve IPA doğrulaması); 5 İspanyolca noktalama hatası onarıldı.
  2. 12 bölümlü 3-dilli (`EN · DE · ES`) **Dilbilgisi ve Kalıp Rehberi** ([`src/data/grammarHandbook.ts`](file:///C:/Users/serit/projelerim/LingoNest/src/data/grammarHandbook.ts), [`src/components/GrammarHandbookView.tsx`](file:///C:/Users/serit/projelerim/LingoNest/src/components/GrammarHandbookView.tsx)), 4 yeni B1–B2 yetişkin modülü (`10` modül, `80` üç-dilli kavram = `240` doğrulanmış ifade) ve kanonik içerik ekleme aracı ([`scripts/ingest_lingo_content.py`](file:///C:/Users/serit/projelerim/LingoNest/scripts/ingest_lingo_content.py)) eklendi.
  3. Hermetik arka uç [`lingonestapi v3.0.0`](file:///C:/Users/serit/projelerim/LingoNest/neon/functions/lingonestapi/src/index.mjs) (`expectedRevision` OCC `409` + `mergeLingoVaults`, dakikalık ve 24 saatlik çift Postgres kotası `lingonest_api_quotas`, sabit zamanlı HMAC webhook idempotency ve `POST /coach` kontrastif eğitmen) ve canlı HTTPS ön yüz [`neon/deploy_web.mjs`](file:///C:/Users/serit/projelerim/LingoNest/neon/deploy_web.mjs) devreye alındı.
  4. Yetişkin arayüz metinleri doğal Türkçe ile sadeleştirildi, modül kartlarına sıfır-emojili monogram rozetler (`01`..`10`), URL hash yönlendirme (`#studyo`, `#rehber`, `#diyalog`, `#fonetik`), [`ErrorBoundary.tsx`](file:///C:/Users/serit/projelerim/LingoNest/src/components/ErrorBoundary.tsx) ve Vite `manualChunks` parçalama eklendi.
- **Ampirik Doğrulama:** `[LINGO-GATE PASS] worlds_vocab=60 adult_phrases=80 dialogues=6 phonetic_traps=14 handbook_chapters=12`, `npm test` (`20/20 PASS`), `npm run build` (`0` chunk uyarısı + `7/7 kweb_gate.py PASS`), canlı HTTPS API + Web doğrulandı.


## [#LN-05] 2026-11-27 — `MultilingualNeural` Telaffuz Sapması, Eksik `.vpak` Türkçe Robot Ses Düşüşü, Gerçek Dışı Hikayeler ve A1–B2 Kelime/Dilbilgisi Eksikliği (`v1.4.0`)
- **Belirti:**
  1. Kısa kelimelerde yanlış aksanlı telaffuzlar ve yeni eklenen cümle/bloklarda cihazdaki Türkçe robot sesin yabancı metni Türkçe okuması.
  2. Başlangıç hikayelerinde konuşan güneş/davul ve *"Kral Pırpır"* gibi yapay/kopuk metinler; genç ve yetişkinler için kademeli okuma öykülerinin yokluğu; geri bildirim metinlerinde abartılı yapay övgüler ve dilbilim jargonu.
  3. Yapılandırılmış A1–B2 kelime hazinesinin ve çekim tablolu sıfırdan dilbilgisi kursunun yetersiz kalması.
- **Kök Neden (Adli Kanıt):**
  1. `manifest.json` içinde İngilizce seslerin üçü de (`AvaMultilingualNeural`, `EmmaMultilingualNeural`, `AndrewMultilingualNeural`) çok-dilli otomatik dil algılayan modellerdi; kısa kelimelerde yanlış dil algılıyordu. İspanyolcada `es-MX-DaliaNeural` ve `es-ES-AlvaroNeural` karışmıştı; ayrıca yeni cümleler ve SVO blokları `.vpak` paketinde olmadığı için `window.speechSynthesis` Türkçe sistem sesine düşüyordu.
  2. `speechSlowMode` varsayılan `true` (`0.80x`) olduğu için ilk tıklamada zaman-esnetme bozulması oluşuyordu.
- **Çözüm & Kurallaştırma:**
  1. [`scripts/build_neural_voices.py`](file:///C:/Users/serit/projelerim/LingoNest/scripts/build_neural_voices.py) %100 saf tek-dilli ana dili seslere (`en-US-JennyNeural/AriaNeural/GuyNeural`, `de-DE-TanjaNeural/ChristophNeural`, `es-ES-ElviraNeural/AlvaroNeural`, `tr-TR-EmelNeural`) kilitlendi; eski `1.152` hatalı dosya silinip **3.887 benzersiz `.vpak` ses kaydı (`3.891` anahtar, `72.81 MB`, `0` hata)** üretildi; [`src/engine/audioEngine.ts`](file:///C:/Users/serit/projelerim/LingoNest/src/engine/audioEngine.ts) içinde Türkçe sistem sesinin yabancı cümle okuması engellendi.
  2. **240 kavramlık (`720` kelime + `720` örnek cümle)** A1–B2 Kelime Hazinesi ([`src/data/vocabBank.ts`](file:///C:/Users/serit/projelerim/LingoNest/src/data/vocabBank.ts), [`src/components/VocabBankView.tsx`](file:///C:/Users/serit/projelerim/LingoNest/src/components/VocabBankView.tsx)), **54 çekim tablolu ve 108 alıştırmalı 18 derslik A1–B2 Dilbilgisi Kursu** ([`src/data/grammarHandbook.ts`](file:///C:/Users/serit/projelerim/LingoNest/src/data/grammarHandbook.ts)) ve **6 doğal aile hikayesi + 8 A1–B2 kısa öykü** ([`src/data/gradedStories.ts`](file:///C:/Users/serit/projelerim/LingoNest/src/data/gradedStories.ts), [`src/components/GradedStoriesView.tsx`](file:///C:/Users/serit/projelerim/LingoNest/src/components/GradedStoriesView.tsx)) eklendi.
- **Ampirik Doğrulama:** `[LINGO-GATE PASS] worlds_vocab=60 vocab_bank=240 adult_phrases=80 dialogues=6 stories=6+8 handbook_chapters=18`, `21/21 Vitest PASS`, `3.887/3.887` nöral ses `0` hata, `7/7 kweb_gate.py PASS`, canlı `imza464-cmyk.github.io/LingoNest` + `LingoNest.apk v1.4.0` (`code=6`).
