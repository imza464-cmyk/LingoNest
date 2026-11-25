# LingoNest — Bilimsel, 5 Yaşından Yetişkine Doğal Dil Edinimi Platformu

## 1. Mimari Özet
- **Temel İlke:** 5 bağımsız bilimsel kaynaktan doğrulanmış (Krashen Comprehensible Input & Affective Filter, Paivio Dual Coding, Asher TPR, Baddeley Phonological Loop & Cowan Age-5 WM ≤ 3, Kuhl Social Gating, Roediger & Karpicke Testing Effect, Ye et al. FSRS-5 DSR) **sıfır-ceza, sıfır-kalp, ses-öncelikli** dil edinim motoru.
- **Matematiksel Çekirdek (`src/engine/fsrs5.ts`):** Resmi 19 ağırlıklı FSRS-5 DSR modeli (`R(t,S) = (1 + 19/81 * t/S)^(-0.5)`), `kmath` ile doğrulanmış Pareto diz-noktası (`R* = 0.90` Mini/Kaşif, `R* = 0.85` Usta) ve 5 yaş çocuklar için tepki süresi/tekrar sayısından örtük puanlama (`inferImplicitGrade`).
- **Ses & Telaffuz Motoru (`src/engine/audioEngine.ts`):** Harici ücretli API'siz Web Speech API (`0.78x` çocuk temposu), Web Audio pentatonik marimba geri bildirimi (sert hata zili yasaktır) ve Türkçe anadil fonetiğine uyarlı çocuk-dostu ASR eşleyici (`matchSpokenAttempt`).
- **Müfredat (`src/data/curriculum.ts`):** 6 tematik dünya × 10 somut kavram = 60 kavram (İngilizce, Almanca, İspanyolca), 6 etkileşimli sesli mini hikaye ve 6 Türkçe→İngilizce fonetik tuzak laboratuvarı (`/θ/ /ð/ /æ/ /w/ /ŋ/ /ə/`).
- **Gizlilik (`src/engine/storage.ts`):** %100 yerel çoklu profil (`KVKK/COPPA` uyumlu, Ebeveyn Matematik Kapısı).

## 2. Kanonik Komutlar
- Test: `npm test`
- Derleme: `npm run build`
- Geliştirme: `npm run dev`
