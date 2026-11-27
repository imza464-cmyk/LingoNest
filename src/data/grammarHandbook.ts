import type { CEFRLevel, LanguageCode } from '../types';

export interface HandbookLangComparison {
  wrongCalque: string;
  naturalForm: string;
  ipa: string;
  turkishMeaning: string;
  structuralWhyTr: string;
}

export interface HandbookSection {
  heading: string;
  paragraphs: string[];
  formulaAscii?: string;
}

export interface GrammarHandbookChapter {
  id: string;
  order: number;
  cefr: CEFRLevel;
  titleTr: string;
  subtitleTr: string;
  readingMinutes: number;
  mentalModelTr: string;
  sections: HandbookSection[];
  langComparisons: Record<LanguageCode, HandbookLangComparison>;
  rulesSummary: string[];
  turkishTraps: string[];
}

export const GRAMMAR_HANDBOOK_CHAPTERS: GrammarHandbookChapter[] = [
  {
    id: 'gh-01-word-order-svo-v2',
    order: 1,
    cefr: 'A2',
    titleTr: 'Bölüm 01 — Türkçe SOV Zihninden İngilizce SVO ve Almanca V2 Sözdizimine Geçiş',
    subtitleTr: 'Fiili cümlenin sonunda arama alışkanlığını kırıp yüklemi erken kurma mekaniği',
    readingMinutes: 9,
    mentalModelTr:
      'Türkçede özne-nesne-yüklem (SOV) sırası yüzünden eylem cümlenin en sonunda açıklanır; İngilizce, Almanca ve İspanyolcada ise dinleyici eylemi cümlenin hemen başında (2. konumda) duymak zorundadır.',
    sections: [
      {
        heading: '1. Yüklemi Erken Kurma Kuralı ve Boş Özne (Pro-Drop) Farkı',
        paragraphs: [
          'Türkçe sondan eklemeli bir dil olduğu için "Yarın sabah raporu ekibe göndereceğim" cümlesinde kimin ne yapacağı en sondaki "-eceğim" ekinde saklıdır. İngilizce ve Almancada fiil çekimi tek başına özneyi taşımaya yetmez; bu yüzden "I" / "ich" veya hava durumu cümlelerinde biçimsel "It" / "Es" ("It is raining" / "Es regnet") kesinlikle düşürülemez.',
          'İspanyolca ise zengin fiil çekimi sayesinde tıpkı Türkçe gibi özne zamirini düşürebilir ("Mañana enviaré el informe"); ancak yüklem yine de nesneden önce gelir.',
        ],
        formulaAscii:
          'TÜRKÇE (SOV)   : [Zaman] + [Nesne] + [Yönelme] + [FİİL]\nİNGİLİZCE (SVO): [Özne]  + [FİİL]  + [Nesne]   + [Yönelme] + [Zaman]\nALMANCA (V2)   : [1. Öge (Zaman/Özne)] + [ÇEKİMLİ FİİL (Kesin 2. Sıra!)] + [Özne] + ... + [Mastar/Partizip]',
      },
      {
        heading: '2. Almancanın Değişmez V2 (Fiil İkinci Sırada) Yasası',
        paragraphs: [
          'İngilizce bilen Türk öğrenenlerin Almancada yaptığı bir numaralı hata "Heute ich gehe ins Büro" dizilimidir. Almanca düz cümlelerde çekimli fiil kelime olarak değil, **öge olarak kesinlikle 2. sırada** durur: cümleye "Heute" zarfıyla başladığınız anda 1. yuva dolduğu için 2. yuvaya fiil ("gehe"), 3. yuvaya özne ("ich") geçer.',
          'Yardımcı fiil ("kann", "habe", "werde") varsa çekimli yardımcı 2. sırada durur, asıl eylem ise cümle çerçevesini kapatmak üzere en sona gider ("Heute muss ich den Bericht abschicken").',
        ],
      },
    ],
    langComparisons: {
      en: {
        wrongCalque: 'Tomorrow morning the report to the team send I will.',
        naturalForm: 'I will send the report to the team tomorrow morning.',
        ipa: '/aɪ wɪl send ðə rɪˈpɔːrt tə ðə tiːm təˈmɒroʊ ˈmɔːrnɪŋ/',
        turkishMeaning: 'Yarın sabah raporu ekibe göndereceğim.',
        structuralWhyTr: 'İngilizcede Özne + Yardımcı/Fiil + Nesne çekirdeği asla bölünmez; zaman zarfı en sona veya en başa gelir.',
      },
      de: {
        wrongCalque: 'Morgen früh ich schicke den Bericht an das Team.',
        naturalForm: 'Morgen früh schicke ich den Bericht an das Team.',
        ipa: '/ˈmɔʁɡn̩ fʁyː ˈʃɪkə ɪç deːn bəˈʁɪçt an das tiːm/',
        turkishMeaning: 'Yarın sabah raporu ekibe gönderiyorum.',
        structuralWhyTr: '"Morgen früh" 1. öge olduğu için V2 kuralı gereği "schicke" 2. sıraya, "ich" 3. sıraya geçer.',
      },
      es: {
        wrongCalque: 'Mañana por la mañana el informe al equipo enviaré.',
        naturalForm: 'Mañana por la mañana enviaré el informe al equipo.',
        ipa: '/maˈɲana poɾ la maˈɲana embjaˈɾe el imˈfoɾme al eˈkipo/',
        turkishMeaning: 'Yarın sabah raporu ekibe göndereceğim.',
        structuralWhyTr: 'İspanyolcada özne ("yo") düşebilir ama çekimli fiil ("enviaré") nesneden önce gelir.',
      },
    },
    rulesSummary: [
      'İngilizce ve Almancada öznesiz cümle kurulmaz; hava ve saat ifadelerinde "It / Es" zorunludur.',
      'Almanca ana cümlede çekimli fiil daima 2. ögedir; başta zaman/yer varsa özne fiilin sağına geçer.',
      'İngilizcede fiil ile doğrudan nesne arasına zaman zarfı ("*I read yesterday the book") sokulmaz.',
    ],
    turkishTraps: [
      '"Yağmur yağıyor" derken "*Is raining" veya "*Regnet" demek.',
      'Almancada İngilizce alışkanlığıyla "*Heute, ich arbeite von zu Hause" deyip virgül koyarak V2 kuralını bozmak.',
    ],
  },

  {
    id: 'gh-02-articles-gender-definiteness',
    order: 2,
    cefr: 'A2',
    titleTr: 'Bölüm 02 — Tanımlıklar (`the / a-an`, `der-die-das`, `el-la`) ve Belirlilik Mantığı',
    subtitleTr: 'Türkçede bulunmayan tanımlık sistemini ezberlemeden dinleyici perspektifiyle çözmek',
    readingMinutes: 9,
    mentalModelTr:
      'Tanımlık seçimi kelimenin kendisine değil, konuşmacı ile dinleyicinin o nesneyi ortak zihinlerinde tekilleştirip tekilleştiremediğine bağlıdır.',
    sections: [
      {
        heading: '1. Belirli (`the/der/el`), Belirsiz (`a/ein/un`) ve Genel Çoğul Sıfır Tanımlık',
        paragraphs: [
          'Dinleyici hangi tekil nesneden bahsettiğinizi ilk kez duyuyorsa belirsiz tanımlık ("I bought a laptop"), daha önce bahsedilen veya ortamda tek olan nesneyi kastediyorsanız belirli tanımlık ("The laptop is fast" / "Close the door") kullanılır.',
          'Genel bir kavramdan bahsedilirken İngilizce çoğul ve sayılamayan isimlerde tanımlık kullanmaz ("Life is short", "Engineers solve problems"); oysa İspanyolca genel öznelerde belirli tanımlığı korur ("La vida es corta", "Los ingenieros resuelven problemas")!',
        ],
        formulaAscii:
          'Genel Kavram:\n  EN: Ø Music connects people.       (Tanımlıksız!)\n  DE: Ø Musik verbindet Menschen.    (Tanımlıksız!)\n  ES: La música conecta a la gente.  (Genel öznede "La" zorunlu!)',
      },
      {
        heading: '2. Harfe Değil Sese Göre `a / an` ve Almanca-İspanyolca Cinsiyet İpuçları',
        paragraphs: [
          'İngilizcede "a" ve "an" seçimi ilk harfe göre değil, **ilk sese (foneme)** göre yapılır: "university" `/juː/` ünsüz sesiyle başladığı için "a university", "hour" `/aʊər/` ünlü sesiyle başladığı için "an hour" denir.',
          'Almancada isimler her zaman büyük harfle başlar ve "-ung, -heit, -keit, -schaft, -tion" ekleri %100 dişil ("die"), "-chen, -lein" küçültme ekleri %100 nötr ("das") cinsiyet taşır. İspanyolcada ise vurgulu `/ˈa/` ile başlayan dişil tekil kelimeler ses çakışmasını önlemek için tekilde "el" alır ama dişil kalır: "el agua fría"!',
        ],
      },
    ],
    langComparisons: {
      en: {
        wrongCalque: 'We waited for a hour at airport to meet an European colleague.',
        naturalForm: 'We waited for an hour at the airport to meet a European colleague.',
        ipa: '/wi ˈweɪtɪd fər ən ˈaʊər ət ði ˈeərpɔːrt tə miːt ə ˌjʊrəˈpiːən ˈkɒliːɡ/',
        turkishMeaning: 'Avrupalı bir meslektaşla buluşmak için havalimanında bir saat bekledik.',
        structuralWhyTr: '"hour" sessiz h nedeniyle ünlü sesle (/aʊ/) başlar -> "an hour"; "European" ise /j/ yarı-ünsüzüyle başlar -> "a European".',
      },
      de: {
        wrongCalque: 'Ich brauche Information über nächste Verbindung.',
        naturalForm: 'Ich brauche eine Information über die nächste Verbindung.',
        ipa: '/ɪç ˈbʁaʊ̯xə ˈaɪ̯nə ɪnfɔʁmaˈtsjoːn ˈyːbɐ diː ˈnɛːçstə fɛɐ̯ˈbɪndʊŋ/',
        turkishMeaning: 'Bir sonraki bağlantı hakkında bilgiye ihtiyacım var.',
        structuralWhyTr: '"-tion" ve "-ung" ile biten tüm Almanca isimler dişildir ("eine Information", "die Verbindung").',
      },
      es: {
        wrongCalque: 'Agua de esta fuente está muy frío.',
        naturalForm: 'El agua de esta fuente está muy fría.',
        ipa: '/el ˈaɣwa ðe ˈesta ˈfwente esˈta mui ˈfɾia/',
        turkishMeaning: 'Bu çeşmenin suyu çok soğuk.',
        structuralWhyTr: '"agua" dişildir (bu yüzden "fría"), ancak vurgulu /ˈa/ ile başladığı için tekilde "la agua" yerine "el agua" alır.',
      },
    },
    rulesSummary: [
      'İngilizcede sayılabilir tekil hiçbir isim ("*I am engineer") tanımlıksız tek başına duramaz ("I am an engineer").',
      '`a` / `an` kuralı yazılışa değil IPA okunuşunun ilk sesine bakar (`an MBA`, `a user`).',
      'Almancada her yeni isim mutlaka tanımlığıyla birlikte tek kelime gibi (`der Tisch`, `die Lösung`, `das Ergebnis`) öğrenilir.',
    ],
    turkishTraps: [
      'Meslek söylerken İngilizcede "*She is doctor" demek (Almanca ve İspanyolcada "Sie ist Ärztin" / "Ella es médica" tanımlıksızdır ama İngilizcede "a doctor" zorunludur!).',
      'Genel anlamda "*The music is my hobby" diyerek fazladan "the" koymak.',
    ],
  },

  {
    id: 'gh-03-present-perfect-duration',
    order: 3,
    cefr: 'B1',
    titleTr: 'Bölüm 03 — Geçmişte Başlayıp Süren Eylemler: `have + V3` vs `seit` vs `desde hace`',
    subtitleTr: '"Üç yıldır burada çalışıyorum" cümlesinin üç dilde birbirinden tamamen ayrılan zaman mantığı',
    readingMinutes: 10,
    mentalModelTr:
      'Türkçe, Almanca ve İspanyolca geçmişte başlayıp hâlâ süren eylemi şimdiki zamanla anlatırken; İngilizce bu köprü için özel bir zaman kipi (Present Perfect) zorunlu tutar.',
    sections: [
      {
        heading: '1. İngilizcenin Kırmızı Çizgisi: Süre Varsa Şimdiki Zaman Yasaktır!',
        paragraphs: [
          'Türkçede "Şu an çalışıyorum" ile "5 yıldır burada çalışıyorum" aynı şimdiki zaman ekiyle ("-ıyorum") kurulur. Bu alışkanlıkla İngilizcede "*I am working here for five years" veya "*I know her since 2020" demek en yaygın B1 hatasıdır.',
          'İngilizcede geçmişten bugüne uzanan her süre ("for + uzunluk") ve başlangıç noktası ("since + tarih/olay") cümleyi zorunlu olarak **Present Perfect (`have/has worked` veya `have/has been working`)** kipine taşır.',
        ],
        formulaAscii:
          'Geçmiş (2022) ══════════════════════════► Şimdi (Hâlâ devam ediyor)\n  EN: I have worked here since 2022 / for four years.  (*I work here since... YASAK!)\n  DE: Ich arbeite seit 2022 / seit vier Jahren hier.   (Şimdiki zaman + seit!)\n  ES: Trabajo aquí desde 2022 / desde hace cuatro años. (Şimdiki zaman + desde / desde hace!)',
      },
      {
        heading: '2. Almanca `seit` (+ Dativ) ve İspanyolca `desde` vs `desde hace` Ayrımı',
        paragraphs: [
          'Almanca bu konuda Türkçeye çok yakındır: eylem hâlâ sürüyorsa Perfekt değil, doğrudan **Präsens (şimdiki zaman) + `seit`** kullanılır ("Ich lerne seit sechs Monaten Deutsch"). Dikkat: `seit` her zaman Dativ hal ister ("seit einem Monat", "seit drei Jahren").',
          'İspanyolcada ise başlangıç noktası için `desde` ("desde enero"), süre uzunluğu için `desde hace` ("desde hace tres meses") veya çok doğal konuşma kalıbı olan **`llevar + süre + gerundio`** ("Llevo tres meses estudiando español") kullanılır.',
        ],
      },
    ],
    langComparisons: {
      en: {
        wrongCalque: 'I am living in this city since four years.',
        naturalForm: 'I have lived in this city for four years.',
        ipa: '/aɪ həv lɪvd ɪn ðɪs ˈsɪti fər fɔːr jɪrz/',
        turkishMeaning: 'Dört yıldır bu şehirde yaşıyorum.',
        structuralWhyTr: 'Süre uzunluğu ("four years") "since" değil "for" alır ve fiil Present Perfect ("have lived" / "have been living") olur.',
      },
      de: {
        wrongCalque: 'Ich habe in dieser Stadt für vier Jahre gewohnt (hâlâ yaşıyorsam).',
        naturalForm: 'Ich wohne seit vier Jahren in dieser Stadt.',
        ipa: '/ɪç ˈvoːnə zaɪ̯t fiːɐ̯ ˈjaːʁən ɪn ˈdiːzɐ ʃtat/',
        turkishMeaning: 'Dört yıldır bu şehirde yaşıyorum.',
        structuralWhyTr: 'Almancada "Ich habe gewohnt" artık orada yaşamadığınız anlamına gelir; devam eden süreçte Präsens + "seit" (Dativ "-n") kullanılır.',
      },
      es: {
        wrongCalque: 'Vivo en esta ciudad por cuatro años.',
        naturalForm: 'Llevo cuatro años viviendo en esta ciudad.',
        ipa: '/ˈʎeβo ˈkwatɾo ˈaɲos biˈβjendo en ˈesta θjuˈðað/',
        turkishMeaning: 'Dört yıldır bu şehirde yaşıyorum.',
        structuralWhyTr: '"llevar + süre + -ando/-iendo" veya "Vivo aquí desde hace cuatro años" devam eden süreyi en doğal anlatan kalıptır.',
      },
    },
    rulesSummary: [
      'İngilizcede `since` başlangıç noktasını (`since Monday`), `for` ise toplam süreyi (`for three days`) gösterir.',
      'Durum bildiren fiiller (`know`, `belong`, `own`, `understand`) İngilizcede `-ing` almaz (`I have known him for years`).',
      'Almancada hem nokta hem süre için tek edat `seit` kullanılır ve her zaman Dativ alır.',
    ],
    turkishTraps: [
      '"Onu çocukluğumdan beri tanıyorum" derken "*I have been knowing him" veya "*I know him since childhood" demek.',
      'Almancada İngilizceden etkilenip devam eden durum için "*für drei Jahre" yazmak.',
    ],
  },

  {
    id: 'gh-04-past-aspect-contrast',
    order: 4,
    cefr: 'B1',
    titleTr: 'Bölüm 04 — Geçmiş Zamanın Görünüş (`Aspect`) Farkı: Biten Olay vs Arka Plan',
    subtitleTr: 'İngilizcede zaman zarfı kilidi, konuşma Almancasında Perfekt ve İspanyolca Indefinido/Imperfecto ayrımı',
    readingMinutes: 10,
    mentalModelTr:
      'Türkçedeki "-di" (gördü) ve "-iyordu / -irdi" (görüyordu / görürdü) ayrımı, İspanyolca ve İngilizcedeki geçmiş zaman çiftlerinin en doğrudan zihinsel anahtarıdır.',
    sections: [
      {
        heading: '1. İngilizcede Biten Zaman Zarfı Varsa (`yesterday`, `in 2021`, `ago`) Kuralı',
        paragraphs: [
          'Cümlede geçmişte tamamlanıp kapanmış bir zaman dilimi ("yesterday", "last week", "two hours ago") açıkça geçiyorsa İngilizcede Present Perfect (`*I have sent it yesterday`) **kesinlikle kullanılamaz**; yalnızca Simple Past (`I sent it yesterday`) geçerlidir.',
          'Buna karşılık Almanca günlük konuşma dilinde dün yaşanan olaylar için bile `Perfekt` (`Ich habe es gestern geschickt`) tercih edilir; `Präteritum` (`schickte`) romanlarda, haberlerde ve `sein / haben / Modal` fiillerinde (`Ich war`, `Ich hatte`, `Ich konnte`) kullanılır!',
        ],
        formulaAscii:
          'Dün Gerçekleşen Tekil Olay:\n  EN: I sent the contract yesterday.            (*I have sent... yesterday YASAK!)\n  DE: Ich habe den Vertrag gestern geschickt.   (Konuşma dilinde Perfekt doğal!)\n  ES: Ayer envié el contrato.                   (Pretérito Indefinido)',
      },
      {
        heading: '2. İspanyolcada `Indefinido` (`-dı`) ve `Imperfecto` (`-ıyordu / -ırdı`) Keskinliği',
        paragraphs: [
          'İspanyolca geçmişi kamera merceği gibi ikiye ayırır: hikâyeyi ilerleten tekil, sınırları belli olaylar `Pretérito Indefinido` ("De repente sonó el teléfono" — Aniden telefon çaldı), sahnenin arka planını ve geçmiş alışkanlıkları anlatan ifadeler ise `Pretérito Imperfecto` ("Llovía y hacía frío" — Yağmur yağıyordu ve hava soğuktu) ile kurulur.',
          'Türkçedeki "-ıyordu" ve "eskiden -ırdı" eklerini düşündüğünüz her yerde İspanyolcada `Imperfecto`, İngilizcede ise sırasıyla `was/were -ing` ve `used to + V1` karşınıza çıkar.',
        ],
      },
    ],
    langComparisons: {
      en: {
        wrongCalque: 'When I was a child, I was playing outside every evening and yesterday I have seen my old friend.',
        naturalForm: 'When I was a child, I used to play outside every evening, and yesterday I saw my old friend.',
        ipa: '/wen aɪ wəz ə tʃaɪld aɪ ˈjuːst tə pleɪ ˌaʊtˈsaɪd ˈevri ˈiːvnɪŋ ənd ˈjestərdeɪ aɪ sɔː maɪ oʊld frend/',
        turkishMeaning: 'Çocukken her akşam dışarıda oynardım ve dün eski arkadaşımı gördüm.',
        structuralWhyTr: 'Geçmiş alışkanlık "used to play" ile, "yesterday" içeren bitmiş olay ise Simple Past ("saw") ile kurulur.',
      },
      de: {
        wrongCalque: 'Gestern ich ging ins Kino, weil ich hatte Zeit.',
        naturalForm: 'Gestern bin ich ins Kino gegangen, weil ich Zeit hatte.',
        ipa: '/ˈɡɛstɐn bɪn ɪç ɪns ˈkiːno ɡəˈɡaŋən vaɪ̯l ɪç tsaɪ̯t ˈhatə/',
        turkishMeaning: 'Dün vaktim olduğu için sinemaya gittim.',
        structuralWhyTr: 'Hareket bildiren "gehen" Perfekt kipinde "sein" ("bin gegangen") alır; "haben" ise konuşmada Präteritum ("hatte") ile kullanılır ve "weil" fiili sona atar.',
      },
      es: {
        wrongCalque: 'Mientras dormí anoche, sonaba la alarma.',
        naturalForm: 'Mientras dormía anoche, sonó la alarma.',
        ipa: '/ˈmjentɾas doɾˈmia aˈnotʃe soˈno la aˈlaɾma/',
        turkishMeaning: 'Dün gece ben uyurken alarm çaldı.',
        structuralWhyTr: 'Süren arka plan ("uyuyordum" -> dormía, Imperfecto) içerisine giren ani olay ("çaldı" -> sonó, Indefinido) kalıbı.',
      },
    },
    rulesSummary: [
      'İngilizcede `yesterday`, `last night`, `in 1999`, `when I graduated` gibi kapanmış zaman zarfları yalnızca Simple Past alır.',
      'Almanca Perfekt kipinde konum/durum değişimi bildiren fiiller (`gehen`, `fahren`, `kommen`, `aufwachen`, `bleiben`, `sein`) `haben` değil **`sein`** yardımcı fiili alır!',
      'İspanyolcada arka plan + alışkanlık = `Imperfecto`; başı-sonu belli olay = `Indefinido`.',
    ],
    turkishTraps: [
      'İngilizcede "*Did you went?" diyerek `did` yardımcı fiilinden sonra tekrar V2 kullanmak (`Did you go?`).',
      'Almancada "*Ich habe nach Berlin gefahren" diyerek hareket fiilini `haben` ile çekimlemek (`Ich bin gefahren`).',
    ],
  },

  {
    id: 'gh-05-be-states-ser-estar',
    order: 5,
    cefr: 'A2',
    titleTr: 'Bölüm 05 — Durum İfadeleri, Yaş/Açlık Kalıpları ve İspanyolca `Ser` vs `Estar`',
    subtitleTr: '"I am agree" ve "I have 20 years" tuzaklarından kurtulup durum fiillerini doğru sınıflandırmak',
    readingMinutes: 8,
    mentalModelTr:
      'Her dil "özellik olmak" ile "bir durumda bulunmak / sahip olmak" sınırını farklı yerden çizer: İngilizce yaş ve açlığı "be" ile, Almanca yaşı "sein" ama açlığı "haben" ile, İspanyolca ise ikisini de "tener" ile kurar.',
    sections: [
      {
        heading: '1. İngilizcede Sıfat Sanılan Fiiller (`agree`, `depend`, `happen`, `rain`)',
        paragraphs: [
          'Türkçede "katılıyorum", "bağlıdır", "yağmur var" ifadeleri isim/durum cümlesi gibi tınladığı için öğrenenler araya `am/is/are` ekleme eğilimindedir ("*I am agree", "*It is depend on you"). Oysa İngilizcede `agree`, `depend`, `belong`, `matter` tam geçişli/geçişsiz eylem fiilleridir ve geniş zamanda yalın çekimlenir ("I agree", "It depends").',
          'Buna karşılık "korkmak", "geç kalmak", "haklı olmak" İngilizcede sıfattır ve `be` ister: "be afraid of", "be late", "be right" ("*I afraid" denmez!).',
        ],
        formulaAscii:
          'YAŞ VE FİZİKSEL DURUM TABLOSU:\n  Kavram         | İngilizce         | Almanca                | İspanyolca\n  ---------------+-------------------+------------------------+---------------------\n  28 yaşındayım  | I am 28 (years).  | Ich bin 28 (Jahre).    | Tengo 28 años.\n  Açım / Susadım | I am hungry.      | Ich habe Hunger.       | Tengo hambre.\n  Haklısın       | You are right.    | Du hast recht.         | Tienes razón.',
      },
      {
        heading: '2. İspanyolcanın Çift "Olmak" Motoru: Öz Nitelik (`Ser`) vs Konum ve Durum (`Estar`)',
        paragraphs: [
          'İspanyolcada `ser` kimlik, meslek, köken, saat ve **doğal öz nitelik** ("El hielo es frío" — Buz soğuktur) bildirir; `estar` ise fiziksel **konum** (kalıcı binalar dahil: "Madrid está en España"!) ve bir süreç sonucu oluşan **geçici/değişken durum** ("El café está frío" — Kahve soğumuş) bildirir.',
          'Birçok sıfat seçilen fiile göre tamamen anlam değiştirir: `ser listo` ("zeki olmak") vs `estar listo` ("hazır olmak"); `ser rico` ("zengin olmak") vs `estar rico` ("lezzetli olmak").',
        ],
      },
    ],
    langComparisons: {
      en: {
        wrongCalque: 'You have right, it is depend on the budget.',
        naturalForm: 'You are right; it depends on the budget.',
        ipa: '/ju ɑːr raɪt ɪt dɪˈpendz ɒn ðə ˈbʌdʒɪt/',
        turkishMeaning: 'Haklısın; bu bütçeye bağlı.',
        structuralWhyTr: '"right" sıfattır ("are right"), "depend" ise fiildir ve 3. tekil şahısta "-s" alır ("it depends on").',
      },
      de: {
        wrongCalque: 'Ich bin kalt und ich bin Hunger.',
        naturalForm: 'Mir ist kalt und ich habe Hunger.',
        ipa: '/miːɐ̯ ɪst kalt ʊnt ɪç ˈhaːbə ˈhʊŋɐ/',
        turkishMeaning: 'Üşüdüm ve açım.',
        structuralWhyTr: 'Almancada "Ich bin kalt" duygusuz/soğuk karakterli biriyim demektir! Üşümek Dativ ile "Mir ist kalt", açlık ise "Hunger haben" ile söylenir.',
      },
      es: {
        wrongCalque: 'Soy listo para salir porque soy hambre.',
        naturalForm: 'Estoy listo para salir, aunque tengo hambre.',
        ipa: '/esˈtoi ˈlisto ˈpaɾa saˈliɾ ˈaʊŋke ˈteŋɡo ˈambɾe/',
        turkishMeaning: 'Çıkmaya hazırım, gerçi karnım aç.',
        structuralWhyTr: '"hazır" durumu "estar listo" ile ("soy listo" = zekiyim!), açlık ise "tener hambre" ile kurulur.',
      },
    },
    rulesSummary: [
      'Almancada kişisel sıcaklık/üşüme hissi özneyle (`*Ich bin heiß/kalt`) ASLA söylenmez; Dativ zamirle `Mir ist warm / kalt` denir.',
      'İspanyolcada fiziksel konum (bina ve şehirler dahil!) her zaman `estar` alır (`El museo está en el centro`), ama etkinliğin yeri `ser` alır (`La reunión es en la sala B`)!',
      'İngilizcede `agree`, `disagree`, `happen`, `cost`, `mean` önüne geniş zamanda `am/is/are` gelmez.',
    ],
    turkishTraps: [
      'Almancada utanç verici anlam kayması yaratan "*Ich bin heiß / kalt" cümlesini kurmak.',
      'İspanyolcada toplantı/konser yeri için "*La fiesta está en mi casa" demek (etkinlik yeri `es` alır!).',
    ],
  },

  {
    id: 'gh-06-prepositions-space-time',
    order: 6,
    cefr: 'B1',
    titleTr: 'Bölüm 06 — Hal Eklerinden (`-de, -e, -den`) Edat Geometrisine (`in/on/at`, `Wo/Wohin`, `por/para`)',
    subtitleTr: 'Mekan, zaman ve amaç edatlarını ezber listesi yerine 3 boyutlu uzay modeliyle kavramak',
    readingMinutes: 10,
    mentalModelTr:
      'Türkçede tek bir "-de/-da" eki hem yılı, hem günü, hem saati, hem yüzeyi kapsar; Hint-Avrupa dilleri ise bunu hacim (3B), yüzey (2B) ve nokta (0B) olarak üçe böler.',
    sections: [
      {
        heading: '1. İngilizce `in` (Hacim/Geniş) -> `on` (Yüzey/Çizgi/Gün) -> `at` (Nokta/İşlev)',
        paragraphs: [
          'Zaman ve mekanda piramit daralır: Yıllar, aylar ve sınırları kapalı alanlar `in` ("in May", "in London", "in a car"); günler, tarihler, ekranlar ve üzerinde yürünebilen toplu taşıma yüzeyleri `on` ("on Friday", "on the bus/plane/phone", "on the second floor"); tam saatler ve işlevsel buluşma noktaları ise `at` ("at 7:30", "at the station", "at work") alır.',
          'Yönelme ("-e/-a") hareket fiilleriyle her zaman **`to`** ister ("go to work", "listen to me", "explain to us") — yalnız tek istisna zarf olan **`home`** kelimesidir ("go home", asla "*go to home" değil!).',
        ],
        formulaAscii:
          'ALMANCA ÇİFT YÖNLÜ EDATLAR (in, auf, an, über, unter, vor, hinter, neben, zwischen):\n  Wohin? (Nereye? -> Hareket / Sınır Geçişi) ──► AKKUSATIV: Ich lege das Buch auf den Tisch.\n  Wo?    (Nerede? -> Sabit Konum)            ──► DATIV    : Das Buch liegt auf dem Tisch.',
      },
      {
        heading: '2. İspanyolcanın Meşhur İkilisi: Neden/Araç (`por`) vs Hedef/Alıcı/Son Tarih (`para`)',
        paragraphs: [
          '`por` geriye (nedene, takasa, araca ve içinden geçilen yola) bakar: "Gracias por tu ayuda" (neden), "Te envío el archivo por correo" (araç), "Caminamos por el parque" (içinden).',
          '`para` ise ileriye (okun ucundaki hedefe, alıcıya, amaca ve son teslim tarihine) bakar: "Este regalo es para ti" (alıcı), "Estudio para aprender" (amaç), "El informe es para el lunes" (son tarih).',
        ],
      },
    ],
    langComparisons: {
      en: {
        wrongCalque: 'Let us meet in Friday on 6 p.m. and then go to home.',
        naturalForm: 'Let us meet on Friday at 6 p.m. and then go home.',
        ipa: '/let əs miːt ɒn ˈfraɪdeɪ ət sɪks piː em ənd ðen ɡoʊ hoʊm/',
        turkishMeaning: 'Cuma günü saat 18.00’de buluşalım ve sonra eve gidelim.',
        structuralWhyTr: 'Günler "on", saatler "at" alır; "home" yön zarfı olduğu için "to" almaz ("at home" ise evde bulunmadır).',
      },
      de: {
        wrongCalque: 'Ich gehe heute Abend in dem Restaurant und sitze an den Fenster.',
        naturalForm: 'Ich gehe heute Abend ins Restaurant und sitze am Fenster.',
        ipa: '/ɪç ˈɡeːə ˈhɔʏ̯tə ˈaːbn̩t ɪns ʁɛstoˈʁɑ̃ː ʊnt ˈzɪtsə am ˈfɛnstɐ/',
        turkishMeaning: 'Bu akşam restorana gidiyorum ve pencere kenarında oturuyorum.',
        structuralWhyTr: '"gehen" yönelme (Wohin? -> in das = ins), "sitzen" sabit konum (Wo? -> an dem = am) gerektirir.',
      },
      es: {
        wrongCalque: 'Necesito este documento por el viernes y gracias para tu tiempo.',
        naturalForm: 'Necesito este documento para el viernes y gracias por tu tiempo.',
        ipa: '/neθeˈsito ˈeste ðokuˈmento ˈpaɾa el ˈβjeɾnes i ˈɣɾaθjas poɾ tu ˈtjempo/',
        turkishMeaning: 'Bu belgeye cuma gününe kadar ihtiyacım var; zaman ayırdığın için teşekkürler.',
        structuralWhyTr: 'Son teslim tarihi ileriye dönük hedeftir ("para el viernes"), teşekkür ise geriye dönük nedendir ("gracias por").',
      },
    },
    rulesSummary: [
      'İngilizcede `discuss`, `enter` (odaya girmek), `marry`, `reach`, `answer` (fiil) nesne önüne edat ALMAZ (`discuss the plan`, asla `*discuss about`).',
      'Almancada zaman günleri `am` (`am Montag`), aylar/mevsimler `im` (`im Juli`), saatler `um` (`um 8 Uhr`) alır.',
      'İspanyolcada hareket yönü `ir` fiiliyle `en` değil **`a`** edatı alır (`Voy a Madrid`, ama `Estoy en Madrid`).',
    ],
    turkishTraps: [
      '"Konuyu tartıştık" derken "*We discussed about the topic" veya "*entered to the room" demek.',
      'İngilizcede uçak/otobüs/tren için Türkçedeki "-de" yüzünden "*in the bus/plane" demek (`on the bus/plane`).',
    ],
  },

  {
    id: 'gh-07-modal-politeness-register',
    order: 7,
    cefr: 'B1',
    titleTr: 'Bölüm 07 — Diplomatik Üslup (`Register`) ve Kibar İstek Kipleri',
    subtitleTr: 'İş ve günlük hayatta kaba tınlayan emir kalıplarını doğal yumuşatıcılarla değiştirmek',
    readingMinutes: 8,
    mentalModelTr:
      'Türkçede "-ebilir misin?" veya "lütfen + emir kipi" gayet naziktir; ancak Kuzey Avrupa ve Anglosakson iş kültüründe doğrudan istekler geçmiş/koşul kipiyle ("Could / Würden / Podría") bir adım yumuşatılır.',
    sections: [
      {
        heading: '1. Dolaylılık Basamakları ve `Would you mind + V-ing` Tuzağı',
        paragraphs: [
          'İngilizcede "Send me the link, please" bir iş arkadaşınıza bile üstten bakan bir talimat gibi duyulabilir. Bunun yerine "Could you share the link when you get a chance?" veya "Would you mind sending me the link?" kullanılır.',
          'Çok kritik kural: `"Would you mind ...?"` ("Sakıncası var mı?") sorusuna "Tabii, sorun değil (yapabilirim)" anlamında yanıt verirken **"Yes"** değil, **"Not at all! / Of course not!"** ("Hiç sakıncası yok!") denir!',
        ],
        formulaAscii:
          'KİBAR İSTEK DÖNÜŞÜMÜ:\n  Sert Çeviri : Send me the file! / Schick mir die Datei! / ¡Envíame el archivo!\n  Doğal Kibar : Could you send...? / Könnten Sie mir ... schicken? / ¿Podrías enviarme...?',
      },
      {
        heading: '2. Almanca `Konjunktiv II` (`könnten / würden / hätten`) ve İspanyolca `Condicional`',
        paragraphs: [
          'Almancada restoranda veya ofiste `"Ich will..."` ("İstiyorum") demek çocuksu ve kaba bulunur; her zaman `"Ich hätte gern..."` veya `"Ich möchte..."`, rica ederken ise `"Könnten Sie bitte...?"` tercih edilir.',
          'İspanyolcada da `"Quiero un café"` yerine `"Quería / Me pones un café, por favor"` ve iş yazışmalarında `"¿Podría confirmarme la hora?"` çok daha zarif karşılanır.',
        ],
      },
    ],
    langComparisons: {
      en: {
        wrongCalque: 'I want you to check this slide now, please.',
        naturalForm: 'Would you mind taking a quick look at this slide when you have a minute?',
        ipa: '/wʊd ju maɪnd ˈteɪkɪŋ ə kwɪk lʊk ət ðɪs slaɪd wen ju hæv ə ˈmɪnɪt/',
        turkishMeaning: 'Bir dakikan olduğunda bu slayta hızlıca göz atabilir misin?',
        structuralWhyTr: '"Would you mind" sonrasında fiil "-ing" alır ve zaman baskısını azaltan bir yan cümle eklenir.',
      },
      de: {
        wrongCalque: 'Sagen Sie mir Bescheid bis heute Abend!',
        naturalForm: 'Könnten Sie mir bitte bis heute Abend kurz Bescheid geben?',
        ipa: '/ˈkœntn̩ ziː miːɐ̯ ˈbɪtə bɪs ˈhɔʏ̯tə ˈaːbn̩t kʊʁts bəˈʃaɪ̯t ˈɡeːbn̩/',
        turkishMeaning: 'Bu akşama kadar bana kısaca haber verebilir misiniz?',
        structuralWhyTr: '"Könnten Sie ... kurz ..." (Konjunktiv II + yumuşatıcı "kurz" parçacığı) Almancanın altın nezaket kalıbıdır.',
      },
      es: {
        wrongCalque: '¡Dime si puedes venir a la reunión!',
        naturalForm: '¿Te importaría confirmarme si podrás asistir a la reunión?',
        ipa: '/te impoɾtaˈɾia komfiɾˈmaɾme si poˈðɾas asisˈtiɾ a la reuˈnjon/',
        turkishMeaning: 'Toplantıya katılıp katılamayacağını teyit edebilir misin?',
        structuralWhyTr: '"¿Te importaría + mastar?" İngilizcedeki "Would you mind" kalıbının tam karşılığıdır.',
      },
    },
    rulesSummary: [
      '`Would you mind + V-ing` kalıbında olumlu kabul yanıtı `"No, not at all"` veya `"Sure, happy to"` şeklindedir.',
      'Almancada `kurz` ve `mal` modal parçacıkları (`Kannst du mal kurz schauen?`) cümlenin sertliğini doğal biçimde alır.',
      '`suggest` ve `recommend` fiilleri İngilizcede `*suggest me to do` ALMAZ (`suggest doing` veya `suggest that we do`).',
    ],
    turkishTraps: [
      '"Bana bir otel önerir misin?" derken "*Can you recommend me a hotel?" yerine doğru kalıpları bilmemek (`recommend a hotel to me`).',
      'Kendi görüşünü söylerken "*According to me" kullanmak (doğrusu: `In my opinion` / `From my perspective`).',
    ],
  },

  {
    id: 'gh-08-phrasal-separable-reflexive',
    order: 8,
    cefr: 'B1',
    titleTr: 'Bölüm 08 — Deyimsel, Ayrılabilen ve Dönüşlü Fiiller (`Phrasal`, `Trennbar`, `Pronominal`)',
    subtitleTr: 'Zamir yerleşimi, cümle sonuna giden Almanca önekler ve İspanyolca dönüşlü ekler',
    readingMinutes: 9,
    mentalModelTr:
      'Üç dilin akıcılık kapısı parçalı fiillerdir: İngilizcede zamir fiilin ortasına girer, Almancada önek ana cümlede en sona uçar ama yan cümlede tekrar birleşir, İspanyolcada ise zamir çekimli fiilin önüne veya mastarın sonuna yapışır.',
    sections: [
      {
        heading: '1. İngilizce `Phrasal Verbs` Zamir Bölme Yasası (`turn it off`)',
        paragraphs: [
          'Ayrılabilir deyimsel fiillerde (`turn off`, `pick up`, `put off`, `figure out`, `fill out`) nesne bir **isim** ise ortaya da sona da gelebilir ("Turn off the light" = "Turn the light off").',
          'Ancak nesne bir **zamir (`it, them, me, him`)** ise zamir **zorunlu olarak fiil ile edatın tam ortasına girer**: `"Turn it off"`, `"We will figure it out"`! `"*Turn off it"` veya `"*Figure out it"` İngilizcede kesin dilbilgisi hatasıdır.',
        ],
        formulaAscii:
          'ZAMİR YERLEŞİMİ:\n  EN: figure [the problem] out  ✓   |  figure [it] out  ✓   (*figure out it ✗)\n  DE: Ich rufe dich an. (Ana cümle) |  ...weil ich dich anrufe. (Yan cümlede birleşir!)\n  ES: Me voy a levantar.            =  Voy a levantarme. (İkisi de doğru!)',
      },
      {
        heading: '2. Almanca `Trennbare Verben` ve İspanyolca Dönüşlü (`-se`) Fiiller',
        paragraphs: [
          'Almancada vurguyu öneğinde taşıyan fiiller (`anrufen`, `aufstehen`, `mitkommen`, `vorbereiten`) şimdiki zamanda ikiye bölünür ("Wann fängt das Meeting an?"), Perfekt kipinde ise `ge-` eki önekle kökün arasına girer: `angerufen`, `aufgestanden`!',
          'İspanyolcada ise günlük rutin ve durum değişimi fiillerinin çoğu dönüşlüdür (`acostarse`, `darse cuenta`, `quedarse`): zamir özneye göre çekimlenir (`me, te, se, nos`).',
        ],
      },
    ],
    langComparisons: {
      en: {
        wrongCalque: 'The meeting was postponed, please look at the form and fill out it.',
        naturalForm: 'The meeting was put off; please look over the form and fill it out.',
        ipa: '/ðə ˈmiːtɪŋ wəz pʊt ɒf pliːz lʊk ˈoʊvər ðə fɔːrm ənd fɪl ɪt aʊt/',
        turkishMeaning: 'Toplantı ertelendi; lütfen formu inceleyip doldurun.',
        structuralWhyTr: '"it" zamiri ayrılabilir "fill out" fiilinin tam ortasına ("fill it out") yerleşmek zorundadır.',
      },
      de: {
        wrongCalque: 'Ich anrufe dich, wenn der Zug ankommt.',
        naturalForm: 'Ich rufe dich an, sobald der Zug ankommt.',
        ipa: '/ɪç ˈʁuːfə dɪç an zoˈbalt deːɐ̯ tsuːk ˈankɔmt/',
        turkishMeaning: 'Tren varır varmaz seni arayacağım.',
        structuralWhyTr: 'Ana cümlede "anrufen" bölünür ("rufe ... an"), "sobald" yan cümlesinde ise "ankommen" birleşik olarak en sonda kalır.',
      },
      es: {
        wrongCalque: 'Hoy di cuenta que necesito quedar en casa.',
        naturalForm: 'Hoy me di cuenta de que necesito quedarme en casa.',
        ipa: '/oi me ði ˈkwenta ðe ke neθeˈsito keˈðaɾme en ˈkasa/',
        turkishMeaning: 'Bugün evde kalmam gerektiğini fark ettim.',
        structuralWhyTr: 'Fark etmek "darse cuenta de que", bir yerde kalmak ise dönüşlü "quedarse" ile kurulur ("quedar" tek başına randevulaşmak demektir!).',
      },
    },
    rulesSummary: [
      'İngilizcede `look after`, `depend on`, `run into` gibi edatlı (ayrılmaz) fiillerde zamir edattan sonra gelir (`look after it`).',
      'Almancada `be-, emp-, ent-, er-, ge-, ver-, zer-` önekleri vurgusuzdur, **asla ayrılmaz** ve Perfekt kipinde `ge-` almaz (`verstehen -> verstanden`).',
      'İspanyolcada olumlu emir kipinde zamir fiilin sonuna bitişir (`¡Dime!`, `¡Siéntate!`), olumsuz emirde ise önüne geçer (`¡No me digas!`).',
    ],
    turkishTraps: [
      '"*Pick up me from the station" demek (`Pick me up`).',
      'Almancada "*Ich habe das Dokument geunterschrieben / geverstanden" diyerek ayrılmaz fiile `ge-` eklemek.',
    ],
  },

  {
    id: 'gh-09-relative-subordinate-clauses',
    order: 9,
    cefr: 'B2',
    titleTr: 'Bölüm 09 — Türkçe Ortaçları (`-diğim, -en`) Yan Cümleciklere Açma Tekniği',
    subtitleTr: 'Sola dallanan uzun Türkçe sıfat-fiilleri sağa dallanan akıcı cümlelere dönüştürmek',
    readingMinutes: 10,
    mentalModelTr:
      'Türkçe niteleyiciyi ismin soluna yığar ("[Dün konuştuğumuz] mühendis"); İngilizce, Almanca ve İspanyolca ise önce ismi söyler, açıklamayı sağ tarafa yan cümlecik olarak takar ("the engineer [we spoke to yesterday]").',
    sections: [
      {
        heading: '1. Ayna Dönüşümü: Önce Çekirdek İsim, Sonra İlgi Cümleciği',
        paragraphs: [
          'Uzun bir Türkçe cümleyi çevirirken takılmanın ana nedeni cümleye Türkçedeki sırayla başlamaktır. "Geçen hafta imzaladığımız sözleşmenin maddeleri..." cümlesinde çekirdek **"sözleşmenin maddeleri"dir (`the terms of the contract`)**; "geçen hafta imzaladığımız" kısmı ise arkadan gelen `(that) we signed last week` yan cümlesidir.',
          'İngilizcede ilgi zamiri nesne konumundaysa (`the book [that] I read`) tamamen düşürülebilir; Almancada (`das Buch, das ich gelesen habe`) ve İspanyolcada (`el libro que leí`) ilgi zamiri **asla düşürülemez**!',
        ],
        formulaAscii:
          'AYNA ÇEVİRİ YÖNTEMİ:\n  TR: [Dün gönderdiğin] [raporu]   [okudum].\n       (3. Yan Cümle)   (2. Nesne) (1. Ana Yüklem)\n  EN: [I read] [the report] [(that) you sent yesterday].\n  DE: [Ich habe] [den Bericht] [gelesen], [den du gestern geschickt hast].\n  ES: [Leí] [el informe] [que enviaste ayer].',
      },
      {
        heading: '2. Almanca Yan Cümle Bağlaçları (`weil, dass, obwohl, wenn, als`) ve Virgülden Sonra Fiil-Sonda',
        paragraphs: [
          'Almancada `weil` (çünkü), `dass` (-diği), `ob` (-ip -mediği), `obwohl` (-e rağmen) ve ilgi zamirleri (`der/die/das`) başladığı anda V2 kuralı kapanır ve **çekimli fiil yan cümlenin en sonuna gider**.',
          'Türkçedeki "-ip -mediğini bilmiyorum" kalıbı için İngilizce ve Almancada `that/dass` değil, **`whether/if`** ve **`ob`** kullanılır ("Ich weiß nicht, ob er heute kommt").',
        ],
      },
    ],
    langComparisons: {
      en: {
        wrongCalque: 'I do not know that will she join the call we planned.',
        naturalForm: 'I do not know whether she will join the call we planned.',
        ipa: '/aɪ du nɒt noʊ ˈweðər ʃi wɪl dʒɔɪn ðə kɔːl wi plænd/',
        turkishMeaning: 'Planladığımız görüşmeye katılıp katılmayacağını bilmiyorum.',
        structuralWhyTr: 'Dolaylı sorularda ("whether/if") soru devrikliği ("*will she") yapılmaz; düz cümle sırası ("she will") korunur!',
      },
      de: {
        wrongCalque: 'Das ist der Kollege, der hat uns gestern geholfen.',
        naturalForm: 'Das ist der Kollege, der uns gestern geholfen hat.',
        ipa: '/das ɪst deːɐ̯ kɔˈleːɡə deːɐ̯ ʊns ˈɡɛstɐn ɡəˈhɔlfn̩ hat/',
        turkishMeaning: 'Dün bize yardım eden iş arkadaşı bu.',
        structuralWhyTr: 'İlgi cümleciğinde ("der...") çekimli yardımcı fiil "hat" en sona gitmek zorundadır.',
      },
      es: {
        wrongCalque: 'El proyecto revisamos ayer necesita más pruebas.',
        naturalForm: 'El proyecto que revisamos ayer necesita más pruebas.',
        ipa: '/el pɾoˈʝekto ke reβiˈsamos aˈʝeɾ neθeˈsita mas ˈpɾweβas/',
        turkishMeaning: 'Dün incelediğimiz proje daha fazla teste ihtiyaç duyuyor.',
        structuralWhyTr: 'İngilizcenin aksine İspanyolcada ilgi zamiri "que" nesne konumunda olsa dahi asla atlanamaz!',
      },
    },
    rulesSummary: [
      'Dolaylı sorularda (`Could you tell me where the station is?`) soru sırası (`*where is the station`) kullanılmaz!',
      'Almancada geçmişteki tekil "dığında" olayı için `wenn` değil **`als`** kullanılır (`Als ich in Berlin war...`).',
      'İspanyolcada ve Almancada nesne konumundaki ilgi zamiri (`que` / `den, die, das`) hiçbir zaman düşürülmez.',
    ],
    turkishTraps: [
      '"Saat kaç biliyor musun?" derken "*Do you know what time is it?" demek (`...what time it is?`).',
      'Almancada geçmişte tek kez olmuş olaya "*Wenn ich ein Kind war" demek (`Als ich ein Kind war`).',
    ],
  },

  {
    id: 'gh-10-conditionals-counterfactuals',
    order: 10,
    cefr: 'B2',
    titleTr: 'Bölüm 10 — Gerçek ve Karşı-Olgu (`Counterfactual`) Koşul Cümleleri (`If / Wenn / Si`)',
    subtitleTr: 'Koşul yan cümlesinde will/would yasağı ve pişmanlık/varsayım kipleri',
    readingMinutes: 10,
    mentalModelTr:
      'İngilizce, Almanca ve İspanyolcanın üçünde de gerçek dışı ("olsaydı, bilseydim") bir varsayım kurarken zaman bir basamak geriye çekilir; koşul cümleciğinin kendi içinde "would / würde / -ría" kullanmaktan kaçınılır.',
    sections: [
      {
        heading: '1. Gerçek Gelecek Koşulu (`Type 1`): `If` İçinde `will` Yasağı!',
        paragraphs: [
          'Türkçede "Yarın vakit bulursam arayacağım" cümlesini duyanlar "*If I will find time tomorrow, I will call you" hatasına düşer. İngilizcede `if`, `when`, `as soon as`, `unless`, `until` zaman/koşul yan cümlelerinde gelecek anlatılsa bile **Simple Present** kullanılır (`If I find time, I will call you`).',
          'Aynı kural İspanyolcada da geçerlidir: `si` (eğer) cümleciğinden sonra gelecek zaman (`*Si tendré`) asla gelmez; `Si tengo tiempo, te llamaré` denir!',
        ],
        formulaAscii:
          'ŞİMDİKİ GERÇEK DIŞI VARSAYIM (Type 2 — "Şu an yerinde olsaydım..."):\n  EN: If I were in your shoes, I would negotiate the deadline.   (*If I would be... YASAK!)\n  DE: Wenn ich an deiner Stelle wäre, würde ich die Frist verhandeln.\n  ES: Si estuviera en tu lugar, negociaría el plazo.             (*Si estaría... YASAK!)',
      },
      {
        heading: '2. Geçmiş Karşı-Olgu (`Type 3`): Değiştirilemeyen Geçmiş Analizi',
        paragraphs: [
          '"Daha erken haber verseydin yardım edebilirdim" gibi geçmişte kapanmış senaryolarda İngilizce `If + had V3 -> would have V3`, Almanca `Wenn + hätte/wäre + Partizip II`, İspanyolca ise `Si + hubiera/hubiese V-ado -> habría V-ado` yapısını kullanır.',
          'Bu yapı mühendislik olay sonrası değerlendirmelerinde (post-mortem), finansal analizlerde ve diplomatik geri bildirimlerde B2–C1 seviyesinin temel göstergesidir.',
        ],
      },
    ],
    langComparisons: {
      en: {
        wrongCalque: 'If we would have tested the backup earlier, we did not lose data.',
        naturalForm: 'If we had tested the backup earlier, we would not have lost any data.',
        ipa: '/ɪf wi həd ˈtestɪd ðə ˈbækʌp ˈɜːrliər wi wʊd nɒt həv lɒst ˈeni ˈdeɪtə/',
        turkishMeaning: 'Yedeği daha erken test etmiş olsaydık hiç veri kaybetmezdik.',
        structuralWhyTr: '"If" yan cümlesi Past Perfect ("had tested"), ana cümle ise "would have + V3" alır.',
      },
      de: {
        wrongCalque: 'Wenn ich das gewusst würde haben, ich kam früher.',
        naturalForm: 'Wenn ich das früher gewusst hätte, wäre ich rechtzeitig gekommen.',
        ipa: '/vɛn ɪç das ˈfʁyːɐ ɡəˈvʊst ˈhɛtə ˈvɛːʁə ɪç ˈʁɛçttsaɪ̯tɪç ɡəˈkɔmən/',
        turkishMeaning: 'Bunu daha erken bilseydim zamanında gelirdim.',
        structuralWhyTr: 'Konjunktiv II geçmiş kipinde "hätte / wäre" kullanılır; yan cümle bittiğinde ana cümle doğrudan çekimli fiille ("wäre ich...") başlar!',
      },
      es: {
        wrongCalque: 'Si sabría la respuesta, te la diría ahora.',
        naturalForm: 'Si supiera la respuesta, te la diría ahora.',
        ipa: '/si suˈpjeɾa la resˈpwesta te la ðiˈɾia aˈoɾa/',
        turkishMeaning: 'Yanıtı bilseydim sana şimdi söylerdim.',
        structuralWhyTr: 'İspanyolcada "si" yan cümlesinde Condicional ("*sabría") kesinlikle yasaktır; Imperfecto de Subjuntivo ("supiera") kullanılır.',
      },
    },
    rulesSummary: [
      'İngilizcede `if` ve `when/as soon as/unless` yan cümlelerinde gelecek anlam için `will` kullanılmaz.',
      'İngilizce `If` ve İspanyolca `Si` koşul yan cümlelerinde `would` / `-ría` kullanılmaz.',
      'Almancada koşul yan cümlesi başa geldiğinde tüm yan cümle "1. öge" sayılır; virgülden hemen sonra ana cümlenin çekimli fiili gelir (`Wenn du Zeit hast, gehen wir`).',
    ],
    turkishTraps: [
      '"Eve varınca sana yazarım" derken "*When I will arrive home, I will text you" demek.',
      'İspanyolcada "*Si tendría dinero" diyerek `si` sonrasında koşul kipi kullanmak.',
    ],
  },

  {
    id: 'gh-11-false-friends-cognates',
    order: 11,
    cefr: 'B2',
    titleTr: 'Bölüm 11 — Tehlikeli Sahte Dostlar (`False Friends / Falsche Freunde / Falsos Amigos`)',
    subtitleTr: 'Türkçedeki Fransızca/Batı kökenli kelimeler yüzünden yanlış anlamda kullanılan 15 kritik tuzak',
    readingMinutes: 8,
    mentalModelTr:
      'Türkçeye Fransızcadan geçen "aktüel, sempatik, şef, sensibl, kontrol" gibi kelimeler İngilizce, Almanca ve İspanyolcada birbirinden çok farklı anlamlara kaymıştır; görünüş benzerliğine güvenmek toplantılarda ciddi yanlış anlaşılmalar doğurur.',
    sections: [
      {
        heading: '1. En Çok Yanıltan Dörtlü: `actually`, `sympathetic`, `sensible`, `control`',
        paragraphs: [
          'İngilizce `actually` "şu anda, güncel" değil, **"aslında, işin doğrusu"** demektir; "şu anda" için `currently` kullanılır! İlginç biçimde Almanca `aktuell` ve İspanyolca `actualmente` ise Türkçedeki gibi **"güncel / şu anda"** anlamına gelir; onlarda "aslında" demek için `eigentlich` ve `en realidad` kullanılır!',
          'Benzer şekilde İngilizce `sympathetic` "sevimli, cana yakın" değil, **"acısını paylaşan, halden anlayan"** demektir! `sensible` "duygusal/hassas" değil **"mantıklı, aklı başında"** demektir ("hassas" = `sensitive`; İspanyolca `sensible` ve Almanca `sensibel` ise "hassas" demektir!).',
        ],
        formulaAscii:
          'ÜÇ DİLDE KARŞILAŞTIRMALI SAHTE DOST MATRİSİ:\n  Anlam         | İngilizce   | Almanca       | İspanyolca\n  --------------+-------------+---------------+----------------\n  Aslında       | actually    | eigentlich    | en realidad\n  Şu anda       | currently   | aktuell       | actualmente\n  Mantıklı      | sensible    | vernünftig    | sensato\n  Hassas        | sensitive   | sensibel      | sensible\n  Patron / Şef  | boss / lead | der Chef      | el jefe (chef = aşçı!)',
      },
      {
        heading: '2. `embarrassed` (İspanyolca Tuzağı!), `eventually` ve `fabric`',
        paragraphs: [
          'İspanyolca öğrenen İngilizce konuşurlarının en ünlü tuzağı **`embarazada`** kelimesidir: "utanmış" değil, **"hamile"** demektir! "Utanmış" demek için `avergonzado/a` veya `Me da vergüenza` kullanılır.',
          'İngilizce `eventually` "belki, ihtimal dahilinde" değil (Almanca `eventuell` = belki!), **"eninde sonunda, nihayetinde"** demektir. `gift` ise İngilizcede "hediye" iken Almancada (`das Gift`) **"zehir"** anlamına gelir!',
        ],
      },
    ],
    langComparisons: {
      en: {
        wrongCalque: 'Actually we live in Ankara, and our new chef in the engineering team is very sympathetic.',
        naturalForm: 'Currently we live in Ankara, and our new team lead in engineering is very friendly.',
        ipa: '/ˈkʌrəntli wi lɪv ɪn ˈæŋkərə ənd ˈaʊər njuː tiːm liːd ɪn ˌendʒɪˈnɪrɪŋ ɪz ˈveri ˈfrendli/',
        turkishMeaning: 'Şu anda Ankara’da yaşıyoruz ve mühendislik ekibindeki yeni yöneticimiz çok cana yakın.',
        structuralWhyTr: 'İngilizcede "chef" yalnızca mutfak aşçısıdır; "actually" aslında, "sympathetic" ise başsağlığı/üzüntü paylaşan demektir!',
      },
      de: {
        wrongCalque: 'Ich habe ein schönes Gift für meinen Chef gekauft; eventuell gewöhnt er sich endlich.',
        naturalForm: 'Ich habe ein schönes Geschenk für meinen Chef gekauft; schließlich freut er sich bestimmt.',
        ipa: '/ɪç ˈhaːbə aɪ̯n ˈʃøːnəs ɡəˈʃɛŋk fyːɐ̯ ˈmaɪ̯nən ʃɛf ɡəˈkaʊ̯ft ˈʃliːslɪç fʁɔʏ̯t eːɐ̯ zɪç bəˈʃtɪmt/',
        turkishMeaning: 'Yöneticim için güzel bir hediye aldım; nihayetinde kesin sevinecektir.',
        structuralWhyTr: 'Almancada "das Gift" zehir demektir! Hediye "das Geschenk", nihayetinde ise "schließlich" ("eventuell" = belki) ile söylenir.',
      },
      es: {
        wrongCalque: 'Estoy muy embarazada porque olvidé su nombre actualmente.',
        naturalForm: 'Me da mucha vergüenza haber olvidado su nombre en realidad.',
        ipa: '/me ða ˈmutʃa βeɾˈɣwenθa aˈβeɾ olβiˈðaðo su ˈnombɾe en realiˈðað/',
        turkishMeaning: 'Aslında adını unuttuğum için çok utandım.',
        structuralWhyTr: '"embarazada" hamile demektir; utanmak "dar vergüenza", "aslında" ise "en realidad" ("actualmente" = şu anda) ile ifade edilir.',
      },
    },
    rulesSummary: [
      '`check / verify` ("kontrol etmek, doğrulamak") ile `control` ("yönetmek, tahakküm altına almak") İngilizcede birbirine karıştırılmamalıdır (`Check my ticket`, `*Control my ticket` değil!).',
      'Almancada `bekommen` "olmak" (`become`) değil, **"almak, temin etmek" (`get/receive`)** demektir (`werden` = olmak)!',
      'İspanyolcada `asistir a` "yardım etmek" değil, **"katılmak (`attend`)"** demektir (`atender / ayudar` = ilgilenmek/yardım etmek)!',
    ],
    turkishTraps: [
      'Havalimanında veya ofiste "Faturayı kontrol eder misiniz?" derken "*Could you control the invoice?" demek (`check / review`).',
      'Almanca restoranda "*Ich werde ein Steak" (Ben bir bifteğe dönüşeceğim!) veya İngilizce düşünerek `bekommen` kelimesini yanlış çevirmek (`Ich bekomme ein Steak` = Bir biftek alayım).',
    ],
  },

  {
    id: 'gh-12-prosody-connected-speech',
    order: 12,
    cefr: 'B2',
    titleTr: 'Bölüm 12 — Ritim, Cümle Vurgusu, `Schwa /ə/` İndirgemesi ve Ses Bağlama (`Connected Speech`)',
    subtitleTr: 'Kelimeleri tek tek biliyor olduğu halde ana dili konuşurlarını hızlı konuşmada kaçırmanın akustik çözümü',
    readingMinutes: 9,
    mentalModelTr:
      'Türkçe ve İspanyolca hece-zamanlıdır (her hece yaklaşık eşit sürede ve net okunur); İngilizce ve Almanca ise vurgu-zamanlıdır: içerik kelimeleri uzatılırken aradaki gramer kelimeleri yutularak /ə/ (schwa) sesine indirgenir!',
    sections: [
      {
        heading: '1. Ana Dili Konuşurları Neden "Kelimeleri Yutuyor" Gibi Duyulur?',
        paragraphs: [
          'Türkçe konuşan biri `"What do you want to do for lunch?"` cümlesindeki 8 kelimenin hepsini tam ünlülerle tek tek okuduğunda hem robotik duyulur hem de doğal hızda gelen `/wɒdəjə ˈwɒnə ˈduː fə ˈlʌntʃ/` akışını tanıyamaz!',
          'İngilizcede anlam yükünü taşıyan **içerik kelimeleri (`want, do, lunch`)** net ve vurgulu okunur; aradaki edat, bağlaç ve yardımcı fiiller (`to -> /tə/`, `for -> /fə/`, `of -> /əv/`, `can -> /kən/`, `and -> /ən/`) gevşek merkez ünlü **Schwa `/ə/`** sesine indirgenir.',
        ],
        formulaAscii:
          'RİTİM KARŞILAŞTIRMASI:\n  Hece-Zamanlı (TR / ES) : ta - ta - ta - ta - ta - ta  (Her hece eşit netlikte)\n  Vurgu-Zamanlı (EN / DE): ta - TA - tə - tə - TA - tə  (Vurgusuz heceler /ə/ ve [ɐ] olur!)',
      },
      {
        heading: '2. Almanca Son Ek İndirgemesi (`-er -> [ɐ]`) ve İspanyolca Ünlü Kaynaşması (`Sinalefa`)',
        paragraphs: [
          'Almancada kelime sonundaki `-er` (`besser`, `immer`, `Vater`, `oder`) Türkçedeki gibi sert bir "e + r" ile okunmaz; açık ve yumuşak bir **`[ɐ]`** ("a"ya yakın gevşek ünlü: `/ˈbɛsɐ/`, `/ˈɪmɐ/`) sesine dönüşür; `-en` bitişleri ise çoğu zaman hecesel `/n̩/` olur.',
          'İspanyolcada ise ünlüler hiç yutulmaz (`5` saf ünlü her zaman nettir!), fakat bir kelimenin sonundaki ünlü ile sonraki kelimenin başındaki ünlü **tek nefeste kaynaşır (`sinalefa`)**: `"va a hablar"` ayrı ayrı değil, kesintisiz `/ˈbaːˈβlaɾ/` gibi akar!',
        ],
      },
    ],
    langComparisons: {
      en: {
        wrongCalque: '/aɪ hæv tuː ɡoʊ tuː ə ˈmiːtɪŋ fɔːr ən ˈaʊər/ (Her edatı tam vurgulayarak okuma)',
        naturalForm: 'I have to go to a meeting for an hour.',
        ipa: '/aɪ ˈhæftə ˈɡoʊ tə ə ˈmiːtɪŋ fər ən ˈaʊər/',
        turkishMeaning: 'Bir saatliğine bir toplantıya gitmem gerekiyor.',
        structuralWhyTr: '"have to" -> /ˈhæftə/, "to" -> /tə/, "for" -> /fər/: işlev kelimeleri indirgenir, "meeting" ve "hour" parlar.',
      },
      de: {
        wrongCalque: 'Es wird im-mer bes-ser (Sert r ve eşit hece baskısı)',
        naturalForm: 'Es wird immer besser, wenn wir zusammenarbeiten.',
        ipa: '/ɛs vɪʁt ˈɪmɐ ˈbɛsɐ vɛn viːɐ̯ tsuˈzamənˌʔaʁbaɪ̯tn̩/',
        turkishMeaning: 'Birlikte çalıştığımızda her şey hep daha iyi oluyor.',
        structuralWhyTr: 'Son "-er" heceleri [ɐ] olarak yumuşar; birleşik fiilde ünlü başlangıcı önünde hafif gırtlak duruşu [ʔ] korunur.',
      },
      es: {
        wrongCalque: 'Va | a | hablar | con | el | equipo (Kelimeler arası kesik duraksama)',
        naturalForm: 'Va a hablar con el equipo esta tarde.',
        ipa: '/ˈbaːˈβlaɾ kon el eˈkipo ˈesta ˈtaɾðe/',
        turkishMeaning: 'Bu öğleden sonra ekiple konuşacak.',
        structuralWhyTr: '"va + a + (h)ablar" üçlüsü sessiz "h" üzerinden tek akıcı ünlü köprüsünde birleşir ve ünlüler arası "b" sürtünmeli [β] olur.',
      },
    },
    rulesSummary: [
      'İngilizcede olumsuz `can’t` (`/kænt/` veya `/kɑːnt/`) her zaman vurguludur; olumlu `can` ise cümle içinde `/kən/` olarak kısalır — ana dili konuşurları olumlu/olumsuzu son `t` harfinden çok bu ritim farkından anlar!',
      'Türkçede kelime sonundaki `b, d, g` ünsüzleri sertleşir (`kitap`); İngilizcede ise `bad` `/bæd/` ve `bat` `/bæt/` farkı önceki ünlünün uzunluğundan anlaşılır.',
      'İspanyolcada `h` harfi (`hola`, `hablar`, `ahora`) %100 sessizdir; `b` ve `v` harfleri ise birebir aynı sesbirimi (`/b/` -> ünlüler arasında `[β]`) temsil eder.',
    ],
    turkishTraps: [
      'İngilizce kelimelerin sonundaki `-ed` geçmiş zaman ekini her zaman "/ıd/" diye okumak (`worked` `/wɜːrkt/`, `played` `/pleɪd/` tek hecedir; yalnızca `t/d` bitişlerinde `wanted` `/ˈwɒntɪd/` ek hece alır!).',
      'İspanyolcada `v` harfini Türkçe/İngilizce diş-dudak `/v/` sesiyle bastırarak okumak.',
    ],
  },
];
