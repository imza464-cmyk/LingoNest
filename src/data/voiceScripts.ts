// ============================================================================
// LingoNest — Single Source of Truth (SSOT) Turkish Voice-Over Scripts
// Every string here is pre-synthesized with tr-TR-EmelNeural studio neural voice
// so 5-year-old pre-literate learners NEVER need to read a single word AND
// NEVER hear a robotic browser SAPI voice.
// ============================================================================

export const TR_VOICE = {
  welcomeMini: 'Hoş geldin minik kaşif! Oynamak için renkli bir dünyaya dokun!',
  welcomeExplorer: 'Hoş geldin kaşif! Yeni görevini seçip maceraya başlayalım!',
  livingWorldIntro: 'İşte senin yaşayan bahçen! Uyanan arkadaşlarına dokun, seninle konuşsunlar!',
  storiesIntro: 'Masal tiyatrosuna hoş geldin! Dinlemek istediğin masala dokun!',
  phoneticsIntro: 'Ses laboratuvarına hoş geldin! Dilini ve dudaklarını izleyerek harika sesler çıkaralım!',
  stageDiscover: 'Dinle ve birlikte hareket edelim!',
  stagePick: 'Büyük resimlerden duyduğunu seç!',
  stageSpeak: 'Şimdi sıra sende! Büyük mikrofona bas ve söyle!',
  stageSvo: 'Süper! Şimdi bloklara dokunup cümleyi sıraya diz!',
  sessionComplete: 'Tebrikler! Bugünkü macerayı harika tamamladın! Şimdi bahçene gidip yeni arkadaşlarınla oynayabilirsin!',
  storyQuizIntro: 'Masalı çok güzel dinledin! Şimdi duyduğun resmi seç bakalım!',
  storyComplete: 'Harika! Bu masalı başarıyla tamamladın!',
} as const;

export const TR_WORLD_INTROS: Record<string, string> = {
  animals: 'Dost Hayvanlar dünyasına hoş geldin! Haydi hayvan dostlarımızla tanışalım!',
  colors_shapes: 'Renkler ve Şekiller dünyasına hoş geldin! Parlak renkleri birlikte keşfedelim!',
  yummy_food: 'Lezzetli Yiyecekler mutfağına hoş geldin! En sevdiğin yiyecekleri öğrenelim!',
  family_tpr: 'Ailem ve Hareketler dünyasına hoş geldin! Haydi zıplayıp oynayalım!',
  home_toys: 'Evim ve Oyuncaklar odasına hoş geldin! Oyuncaklarla birlikte oynayalım!',
  nature_magic: 'Doğa ve Sihirli Dünyaya hoş geldin! Yıldızlara ve gökkuşağına gidelim!',
};

export const TR_PRAISE_POOL: readonly string[] = [
  'Harikasın! Çok güzel bildin!',
  'Aferin sana! Süpersin!',
  'Bravo! Bir yıldız daha kazandın!',
  'Müthişsin! Yeni arkadaşın uyandı!',
  'Vay canına! Harika söyledin!',
];

export const TR_NUDGE_POOL: readonly string[] = [
  'Çok yaklaştın! Haydi bir daha dinleyelim.',
  'Sorun değil, birlikte tekrar dinleyelim!',
  'Neredeyse oldu! Şimdi yavaşça dinle.',
];

export function pickRandomPraise(): string {
  return TR_PRAISE_POOL[Math.floor(Math.random() * TR_PRAISE_POOL.length)];
}

export function pickRandomNudge(): string {
  return TR_NUDGE_POOL[Math.floor(Math.random() * TR_NUDGE_POOL.length)];
}
