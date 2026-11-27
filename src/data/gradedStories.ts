import type { LanguageCode } from '../types';

export interface GradedStoryParagraph {
  text: Record<LanguageCode, string>;
  turkish: string;
}

export interface GradedStoryVocabNote {
  term: Record<LanguageCode, string>;
  meaningTr: string;
}

export interface GradedStoryQuestion {
  questionTr: string;
  questionTarget: Record<LanguageCode, string>;
  options: Array<{
    text: Record<LanguageCode, string>;
    turkish: string;
    isCorrect: boolean;
  }>;
}

export interface GradedStory {
  id: string;
  order: number;
  cefr: 'A1' | 'A2' | 'B1' | 'B2';
  readingMinutes: number;
  titleTr: string;
  titleTarget: Record<LanguageCode, string>;
  summaryTr: string;
  paragraphs: GradedStoryParagraph[];
  vocabNotes: GradedStoryVocabNote[];
  questions: GradedStoryQuestion[];
}

export const GRADED_STORIES: GradedStory[] = [
  {
    id: 'gs_a1_coffee',
    order: 1,
    cefr: 'A1',
    readingMinutes: 2,
    titleTr: 'Köşedeki Kafede İlk Sabah',
    titleTarget: {
      en: 'First Morning at the Corner Cafe',
      de: 'Der erste Morgen im Eckcafé',
      es: 'La primera mañana en la cafetería de la esquina',
    },
    summaryTr: 'Yeni taşındığı mahallede sabah kahvesi almaya giden Selin, garsonla tanışır ve küçük bir sürprizle güne başlar.',
    paragraphs: [
      {
        text: {
          en: 'Selin moved to a new apartment on Sunday. Her boxes are still in the hallway.',
          de: 'Selin ist am Sonntag in eine neue Wohnung gezogen. Ihre Kartons stehen noch im Flur.',
          es: 'Selin se mudó a un piso nuevo el domingo. Sus cajas todavía están en el pasillo.',
        },
        turkish: 'Selin pazar günü yeni bir daireye taşındı. Kutuları hâlâ koridorda duruyor.',
      },
      {
        text: {
          en: 'On Monday morning, her kitchen is empty. She walks to a small cafe on the corner.',
          de: 'Am Montagmorgen ist ihre Küche noch leer. Sie geht in ein kleines Café an der Ecke.',
          es: 'El lunes por la mañana su cocina está vacía. Camina hasta una pequeña cafetería en la esquina.',
        },
        turkish: 'Pazartesi sabahı mutfağı boştur. Köşedeki küçük kafeye yürür.',
      },
      {
        text: {
          en: 'Inside, the place smells like fresh bread and coffee. Selin sits at a quiet table by the window.',
          de: 'Drinnen riecht es nach frischem Brot und Kaffee. Selin setzt sich an einen ruhigen Tisch am Fenster.',
          es: 'Dentro huele a pan recién hecho y a café. Selin se sienta en una mesa tranquila junto a la ventana.',
        },
        turkish: 'İçerisi taze ekmek ve kahve kokmaktadır. Selin pencere kenarındaki sessiz bir masaya oturur.',
      },
      {
        text: {
          en: 'A friendly waiter says hello and brings the menu. Selin asks for a cup of coffee with milk.',
          de: 'Ein freundlicher Kellner grüßt sie und bringt die Karte. Selin bestellt eine Tasse Kaffee mit Milch.',
          es: 'Un camarero amable la saluda y trae la carta. Selin pide una taza de café con leche.',
        },
        turkish: 'Güler yüzlü bir garson selam verir ve menüyü getirir. Selin bir fincan sütlü kahve ister.',
      },
      {
        text: {
          en: 'Two minutes later, he puts a warm cinnamon cookie next to her cup. "Wait, I did not order a cookie," Selin says.',
          de: 'Zwei Minuten später stellt er einen warmen Zimtkeks neben ihre Tasse. „Moment, ich habe keinen Keks bestellt“, sagt Selin.',
          es: 'Dos minutos después, él deja una galleta caliente de canela junto a su taza. —Espere, yo no pedí una galleta —dice Selin.',
        },
        turkish: 'İki dakika sonra garson fincanın yanına sıcak bir tarçınlı kurabiye bırakır. Selin, "Bir dakika, ben kurabiye istemedim," der.',
      },
      {
        text: {
          en: 'The waiter smiles and says, "I took the wrong plate, but please keep it. Welcome to our street!"',
          de: 'Der Kellner lächelt und sagt: „Ich habe den falschen Teller gegriffen, aber behalten Sie ihn gern. Willkommen in unserer Straße!“',
          es: 'El camarero sonríe y responde: «Tomé el plato equivocado, pero quédesela, por favor. ¡Bienvenida a nuestra calle!».',
        },
        turkish: 'Garson gülümser ve "Yanlış tabağı almışım ama lütfen sizde kalsın. Sokağımıza hoş geldiniz!" der.',
      },
    ],
    vocabNotes: [
      {
        term: { en: 'hallway', de: 'der Flur', es: 'el pasillo' },
        meaningTr: 'koridor, antre',
      },
      {
        term: { en: 'on the corner', de: 'an der Ecke', es: 'en la esquina' },
        meaningTr: 'köşede, sokağın başında',
      },
      {
        term: { en: 'by the window', de: 'am Fenster', es: 'junto a la ventana' },
        meaningTr: 'pencere kenarında',
      },
      {
        term: { en: 'cinnamon cookie', de: 'der Zimtkeks', es: 'la galleta de canela' },
        meaningTr: 'tarçınlı kurabiye',
      },
      {
        term: { en: 'wrong plate', de: 'der falsche Teller', es: 'el plato equivocado' },
        meaningTr: 'yanlış tabak',
      },
    ],
    questions: [
      {
        questionTr: 'Selin pazartesi sabahı neden kafeye gitti?',
        questionTarget: {
          en: 'Why did Selin go to the cafe on Monday morning?',
          de: 'Warum ist Selin am Montagmorgen ins Café gegangen?',
          es: '¿Por qué fue Selin a la cafetería el lunes por la mañana?',
        },
        options: [
          {
            text: {
              en: 'Because her kitchen at home was still empty.',
              de: 'Weil ihre Küche zu Hause noch leer war.',
              es: 'Porque su cocina en casa todavía estaba vacía.',
            },
            turkish: 'Çünkü evdeki mutfağı hâlâ boştu.',
            isCorrect: true,
          },
          {
            text: {
              en: 'Because she wanted to meet an old colleague.',
              de: 'Weil sie dort einen alten Kollegen treffen wollte.',
              es: 'Porque quería reunirse con un antiguo compañero.',
            },
            turkish: 'Çünkü eski bir iş arkadaşıyla buluşmak istiyordu.',
            isCorrect: false,
          },
          {
            text: {
              en: 'Because she worked at that cafe as a cook.',
              de: 'Weil sie in diesem Café als Köchin arbeitete.',
              es: 'Porque trabajaba como cocinera en esa cafetería.',
            },
            turkish: 'Çünkü o kafede aşçı olarak çalışıyordu.',
            isCorrect: false,
          },
        ],
      },
      {
        questionTr: 'Garson yanlışlıkla getirdiği tarçınlı kurabiye için ne yaptı?',
        questionTarget: {
          en: 'What did the waiter do about the cinnamon cookie?',
          de: 'Was hat der Kellner mit dem Zimtkeks gemacht?',
          es: '¿Qué hizo el camarero con la galleta de canela?',
        },
        options: [
          {
            text: {
              en: 'He took it back to the kitchen right away.',
              de: 'Er hat ihn sofort zurück in die Küche gebracht.',
              es: 'La llevó de vuelta a la cocina enseguida.',
            },
            turkish: 'Hemen mutfağa geri götürdü.',
            isCorrect: false,
          },
          {
            text: {
              en: 'He offered it to Selin as a welcome treat.',
              de: 'Er hat ihn Selin zur Begrüßung geschenkt.',
              es: 'Se la ofreció a Selin como detalle de bienvenida.',
            },
            turkish: 'Mahalleye hoş geldin ikramı olarak Selin\'e bıraktı.',
            isCorrect: true,
          },
          {
            text: {
              en: 'He added double the price to her check.',
              de: 'Er hat den doppelten Preis auf die Rechnung gesetzt.',
              es: 'Añadió el doble del precio en la cuenta.',
            },
            turkish: 'Hesaba iki katı fiyat ekledi.',
            isCorrect: false,
          },
        ],
      },
    ],
  },
  {
    id: 'gs_a1_umbrella',
    order: 2,
    cefr: 'A1',
    readingMinutes: 2,
    titleTr: 'Otobüste Unutulan Mavi Şemsiye',
    titleTarget: {
      en: 'The Blue Umbrella Left on the Bus',
      de: 'Der blaue Regenschirm im Bus',
      es: 'El paraguas azul olvidado en el autobús',
    },
    summaryTr: 'Yağmurlu bir salı akşamı otobüste şemsiyesini unutan Emre, ertesi sabah durakta güzel bir sürprizle karşılaşır.',
    paragraphs: [
      {
        text: {
          en: 'It rains hard on Tuesday evening. Emre finishes work at six and gets on the city bus.',
          de: 'Am Dienstagabend regnet es stark. Emre beendet um sechs Uhr die Arbeit und steigt in den Stadtbus.',
          es: 'El martes por la tarde llueve mucho. Emre termina de trabajar a las seis y sube al autobús.',
        },
        turkish: 'Salı akşamı şiddetli yağmur yağar. Emre saat altıda işten çıkar ve belediye otobüsüne biner.',
      },
      {
        text: {
          en: 'He puts his wet blue umbrella next to his seat. During the ride, he reads a short book.',
          de: 'Er stellt seinen nassen blauen Regenschirm neben den Sitz. Während der Fahrt liest er ein kurzes Buch.',
          es: 'Deja su paraguas azul mojado junto al asiento. Durante el trayecto lee un libro corto.',
        },
        turkish: 'Islak mavi şemsiyesini koltuğunun yanına koyar. Yolculuk boyunca kısa bir kitap okur.',
      },
      {
        text: {
          en: 'When the bus reaches his stop, the rain is over. Emre gets off quickly and walks home.',
          de: 'Als der Bus seine Haltestelle erreicht, hat der Regen aufgehört. Emre steigt schnell aus und geht nach Hause.',
          es: 'Cuando el autobús llega a su parada, ya no llueve. Emre baja rápido y camina hacia su casa.',
        },
        turkish: 'Otobüs durağına vardığında yağmur dinmiştir. Emre hızlıca iner ve eve yürür.',
      },
      {
        text: {
          en: 'At his apartment door, he looks at his empty hands. "Oh no, my umbrella is still on the bus!" he says.',
          de: 'An seiner Wohnungstür schaut er auf seine leeren Hände. „Ach nein, mein Schirm ist noch im Bus!“, sagt er.',
          es: 'Frente a la puerta de su piso mira sus manos vacías. —¡Vaya, mi paraguas sigue en el autobús! —dice.',
        },
        turkish: 'Daire kapısında boş ellerine bakar. "Eyvah, şemsiyem otobüste kaldı!" der.',
      },
      {
        text: {
          en: 'On Wednesday morning, Emre walks back to the same bus stop. Under the shelter roof, he sees a familiar blue handle.',
          de: 'Am Mittwochmorgen geht Emre wieder zur selben Haltestelle. Unter dem Wartehäuschen sieht er einen vertrauten blauen Griff.',
          es: 'El miércoles por la mañana Emre vuelve a la misma parada. Bajo la marquesina ve un mango azul muy familiar.',
        },
        turkish: 'Çarşamba sabahı Emre aynı otobüs durağına döner. Durak kulübesinin altında tanıdık mavi bir sap görür.',
      },
      {
        text: {
          en: 'His umbrella is hanging on the bench with a small paper note: "Found on line 14. Have a dry day!"',
          de: 'Sein Regenschirm hängt an der Bank mit einem kleinen Zettel: „In der Linie 14 gefunden. Einen trockenen Tag!“',
          es: 'Su paraguas cuelga del banco con una pequeña nota de papel: «Encontrado en la línea 14. ¡Buen día sin lluvia!».',
        },
        turkish: 'Şemsiyesi küçük bir kağıt notla banka asılmıştır: "14 numaralı hatta bulundu. Yağmursuz günler!"',
      },
    ],
    vocabNotes: [
      {
        term: { en: 'to get on', de: 'einsteigen', es: 'subir al autobús' },
        meaningTr: '(toplu taşımaya) binmek',
      },
      {
        term: { en: 'seat', de: 'der Sitz', es: 'el asiento' },
        meaningTr: 'koltuk, oturacak yer',
      },
      {
        term: { en: 'to get off', de: 'aussteigen', es: 'bajar' },
        meaningTr: '(araçtan) inmek',
      },
      {
        term: { en: 'bus shelter', de: 'das Wartehäuschen', es: 'la marquesina' },
        meaningTr: 'otobüs durak kulübesi',
      },
      {
        term: { en: 'paper note', de: 'der Zettel', es: 'la nota de papel' },
        meaningTr: 'küçük kağıt not, pusula',
      },
    ],
    questions: [
      {
        questionTr: 'Emre otobüsten inerken şemsiyesini neden unuttu?',
        questionTarget: {
          en: 'Why did Emre forget his umbrella when getting off the bus?',
          de: 'Warum hat Emre beim Aussteigen seinen Regenschirm vergessen?',
          es: '¿Por qué olvidó Emre su paraguas al bajar del autobús?',
        },
        options: [
          {
            text: {
              en: 'The rain had stopped and he got off quickly.',
              de: 'Der Regen hatte aufgehört und er stieg schnell aus.',
              es: 'Había dejado de llover y bajó con rapidez.',
            },
            turkish: 'Yağmur durmuştu ve otobüsten hızlıca indi.',
            isCorrect: true,
          },
          {
            text: {
              en: 'He gave the umbrella to a friend on the bus.',
              de: 'Er hatte den Schirm einem Freund im Bus geliehen.',
              es: 'Le prestó el paraguas a un amigo en el autobús.',
            },
            turkish: 'Şemsiyeyi otobüsteki bir arkadaşına ödünç verdi.',
            isCorrect: false,
          },
          {
            text: {
              en: 'His umbrella broke in the strong wind.',
              de: 'Sein Schirm war im starken Wind kaputtgegangen.',
              es: 'Su paraguas se rompió por el viento fuerte.',
            },
            turkish: 'Şemsiyesi sert rüzgarda kırıldı.',
            isCorrect: false,
          },
        ],
      },
      {
        questionTr: 'Emre çarşamba sabahı şemsiyesini nerede buldu?',
        questionTarget: {
          en: 'Where did Emre find his umbrella on Wednesday morning?',
          de: 'Wo hat Emre seinen Regenschirm am Mittwochmorgen gefunden?',
          es: '¿Dónde encontró Emre su paraguas el miércoles por la mañana?',
        },
        options: [
          {
            text: {
              en: 'At the police station downtown.',
              de: 'Auf der Polizeiwache im Stadtzentrum.',
              es: 'En la comisaría del centro de la ciudad.',
            },
            turkish: 'Şehir merkezindeki karakolda.',
            isCorrect: false,
          },
          {
            text: {
              en: 'Hanging on the bench inside the bus shelter.',
              de: 'An der Bank unter dem Wartehäuschen an der Haltestelle.',
              es: 'Colgado en el banco bajo la marquesina de la parada.',
            },
            turkish: 'Durak kulübesinin içindeki banka asılı halde.',
            isCorrect: true,
          },
          {
            text: {
              en: 'In front of his office building.',
              de: 'Direkt vor der Tür seines Bürogebäudes.',
              es: 'Delante de la puerta de su edificio de oficinas.',
            },
            turkish: 'Çalıştığı ofis binasının kapısının önünde.',
            isCorrect: false,
          },
        ],
      },
    ],
  },
  {
    id: 'gs_a2_neighbor',
    order: 3,
    cefr: 'A2',
    readingMinutes: 3,
    titleTr: 'Üst Kattaki Yeni Komşu',
    titleTarget: {
      en: 'The New Neighbor Upstairs',
      de: 'Der neue Nachbar im oberen Stockwerk',
      es: 'El nuevo vecino del piso de arriba',
    },
    summaryTr: 'Pazar sabahı üst kattan taşınma sesleri duyan Deniz, yeni komşusuna yardım teklif eder ve aralarında sıcak bir komşuluk başlar.',
    paragraphs: [
      {
        text: {
          en: 'On Sunday morning, Deniz was reading the newspaper in his living room. Around ten o\'clock, he heard heavy footsteps on the stairs.',
          de: 'Am Sonntagmorgen las Deniz in seinem Wohnzimmer die Zeitung. Gegen zehn Uhr hörte er schwere Schritte im Treppenhaus.',
          es: 'El domingo por la mañana Deniz leía el periódico en el salón. Hacia las diez oyó pasos pesados en la escalera.',
        },
        turkish: 'Pazar sabahı Deniz oturma odasında gazete okuyordu. Saat ona doğru merdivenlerde ağır ayak sesleri duydu.',
      },
      {
        text: {
          en: 'He opened his door and saw a young man carrying two large cardboard boxes. The elevator was out of order for repairs.',
          de: 'Er öffnete seine Tür und sah einen jungen Mann mit zwei großen Kartons. Der Aufzug war wegen einer Reparatur außer Betrieb.',
          es: 'Abrió la puerta y vio a un joven que subía dos cajas grandes de cartón. El ascensor estaba averiado por mantenimiento.',
        },
        turkish: 'Kapısını açtı ve iki büyük karton kutu taşıyan genç bir adam gördü. Asansör bakım nedeniyle çalışmıyordu.',
      },
      {
        text: {
          en: '"Hello, I am Deniz from the second floor," he said warmly. "Let me help you carry the rest upstairs."',
          de: '„Hallo, ich bin Deniz aus dem zweiten Stock“, sagte er freundlich. „Lass mich dir helfen, den Rest nach oben zu tragen.“',
          es: '—Hola, soy Deniz, del segundo piso —dijo con amabilidad—. Déjame ayudarte a subir el resto de las cosas.',
        },
        turkish: '"Merhaba, ben ikinci kattan Deniz," dedi sıcak bir sesle. "Kalanları yukarı taşımana yardım edeyim."',
      },
      {
        text: {
          en: 'The new neighbor introduced himself as Tarık, a music teacher. Together, they carried chairs, lamps, and a heavy bookcase to the third floor.',
          de: 'Der neue Nachbar stellte sich als Tarık vor, ein Musiklehrer. Gemeinsam trugen sie Stühle, Lampen und ein schweres Bücherregal in den dritten Stock.',
          es: 'El nuevo vecino se presentó como Tarık, profesor de música. Juntos subieron sillas, lámparas y una estantería pesada hasta el tercer piso.',
        },
        turkish: 'Yeni komşu kendini müzik öğretmeni Tarık olarak tanıttı. Birlikte sandalyeleri, lambaları ve ağır bir kitaplığı üçüncü kata taşıdılar.',
      },
      {
        text: {
          en: 'Half an hour later, the moving van outside was finally empty. Deniz went downstairs and brewed a pot of fresh black tea.',
          de: 'Eine halbe Stunde später war der Lieferwagen draußen endlich leer. Deniz ging kurz hinunter und kochte eine Kanne frischen schwarzen Tee.',
          es: 'Media hora más tarde la furgoneta de mudanzas quedó por fin vacía. Deniz bajó un momento y preparó una tetera de té negro recién hecho.',
        },
        turkish: 'Yarım saat sonra dışarıdaki nakliye aracı nihayet boşaldı. Deniz aşağı inip taze bir demlik siyah çay demledi.',
      },
      {
        text: {
          en: 'They sat on two folding chairs on Tarık\'s balcony and talked about the neighborhood. Tarık felt at home on his very first day.',
          de: 'Sie saßen auf zwei Klappstühlen auf Tarıks Balkon und sprachen über das Viertel. Tarık fühlte sich schon am ersten Tag wie zu Hause.',
          es: 'Se sentaron en dos sillas plegables en el balcón de Tarık y charlaron sobre el barrio. Tarık se sintió en casa desde el primer día.',
        },
        turkish: 'Tarık\'ın balkonunda iki katlanır sandalyeye oturup mahalle hakkında sohbet ettiler. Tarık daha ilk günden kendini evinde hissetti.',
      },
    ],
    vocabNotes: [
      {
        term: { en: 'footstep', de: 'der Schritt', es: 'el paso' },
        meaningTr: 'ayak sesi, adım',
      },
      {
        term: { en: 'out of order', de: 'außer Betrieb', es: 'averiado' },
        meaningTr: 'arızalı, kullanım dışı',
      },
      {
        term: { en: 'bookcase', de: 'das Bücherregal', es: 'la estantería' },
        meaningTr: 'kitaplık',
      },
      {
        term: { en: 'moving van', de: 'der Lieferwagen', es: 'la furgoneta de mudanzas' },
        meaningTr: 'nakliye kamyoneti',
      },
      {
        term: { en: 'folding chair', de: 'der Klappstuhl', es: 'la silla plegable' },
        meaningTr: 'katlanır sandalye',
      },
    ],
    questions: [
      {
        questionTr: 'Tarık eşyalarını neden merdivenden taşımak zorunda kaldı?',
        questionTarget: {
          en: 'Why did Tarık have to carry his things up the stairs?',
          de: 'Warum musste Tarık seine Sachen über die Treppe tragen?',
          es: '¿Por qué tuvo que subir Tarık sus cosas por la escalera?',
        },
        options: [
          {
            text: {
              en: 'Because the building had no elevator at all.',
              de: 'Weil es im ganzen Gebäude gar keinen Aufzug gab.',
              es: 'Porque el edificio no tenía ningún ascensor.',
            },
            turkish: 'Çünkü binada hiç asansör yoktu.',
            isCorrect: false,
          },
          {
            text: {
              en: 'Because the elevator was out of order for repairs.',
              de: 'Weil der Aufzug wegen einer Reparatur außer Betrieb war.',
              es: 'Porque el ascensor estaba averiado por mantenimiento.',
            },
            turkish: 'Çünkü asansör bakım nedeniyle arızalıydı.',
            isCorrect: true,
          },
          {
            text: {
              en: 'Because he wanted to exercise on Sunday morning.',
              de: 'Weil er am Sonntagmorgen Sport treiben wollte.',
              es: 'Porque quería hacer ejercicio el domingo por la mañana.',
            },
            turkish: 'Çünkü pazar sabahı spor yapmak istiyordu.',
            isCorrect: false,
          },
        ],
      },
      {
        questionTr: 'Taşınma bittikten sonra Deniz ve Tarık ne yaptılar?',
        questionTarget: {
          en: 'What did Deniz and Tarık do after unloading the van?',
          de: 'Was machten Deniz und Tarık nach dem Ausladen?',
          es: '¿Qué hicieron Deniz y Tarık después de vaciar la furgoneta?',
        },
        options: [
          {
            text: {
              en: 'They drank tea on the balcony and talked about the neighborhood.',
              de: 'Sie tranken auf dem Balkon Tee und sprachen über das Viertel.',
              es: 'Tomaron té en el balcón y hablaron sobre el barrio.',
            },
            turkish: 'Balkonda çay içip mahalle hakkında sohbet ettiler.',
            isCorrect: true,
          },
          {
            text: {
              en: 'They drove to a furniture shop outside the city.',
              de: 'Sie fuhren zusammen zu einem Möbelhaus außerhalb der Stadt.',
              es: 'Fueron en coche a una tienda de muebles fuera de la ciudad.',
            },
            turkish: 'Şehir dışındaki bir mobilya mağazasına gittiler.',
            isCorrect: false,
          },
          {
            text: {
              en: 'They painted all the walls of the third-floor apartment.',
              de: 'Sie strichen alle Wände der Wohnung im dritten Stock.',
              es: 'Pintaron todas las paredes del piso del tercer nivel.',
            },
            turkish: 'Üçüncü kattaki dairenin bütün duvarlarını boyadılar.',
            isCorrect: false,
          },
        ],
      },
    ],
  },
  {
    id: 'gs_a2_train_ticket',
    order: 4,
    cefr: 'A2',
    readingMinutes: 3,
    titleTr: 'Yanlış Perondaki Tren',
    titleTarget: {
      en: 'The Train on the Wrong Platform',
      de: 'Der Zug am falschen Bahnsteig',
      es: 'El tren en el andén equivocado',
    },
    summaryTr: 'Ailesini ziyarete giderken anonsu duymayan Murat, yaşlı bir yolcunun dikkati sayesinde son anda doğru trene yetişir.',
    paragraphs: [
      {
        text: {
          en: 'On Friday afternoon, Murat arrived at the central station with a small weekend bag. He was going to visit his parents in Eskişehir.',
          de: 'Am Freitagnachmittag kam Murat mit einer kleinen Reisetasche am Hauptbahnhof an. Er wollte am Wochenende seine Eltern besuchen.',
          es: 'El viernes por la tarde Murat llegó a la estación central con un bolso pequeño. Iba a visitar a sus padres durante el fin de semana.',
        },
        turkish: 'Cuma öğleden sonra Murat küçük bir hafta sonu çantasıyla merkez gara vardı. Hafta sonu ailesini ziyaret edecekti.',
      },
      {
        text: {
          en: 'His ticket showed platform four and a departure time of five fifteen. He put on his headphones and stood near the yellow line.',
          de: 'Auf seiner Fahrkarte standen Gleis vier und die Abfahrtszeit siebzehn Uhr fünfzehn. Er setzte seine Kopfhörer auf und wartete an der Linie.',
          es: 'Su billete indicaba el andén cuatro y las cinco y cuarto como hora de salida. Se puso los auriculares y esperó junto a la línea amarilla.',
        },
        turkish: 'Biletinde dördüncü peron ve kalkış saati olarak beş on beş yazıyordu. Kulaklığını taktı ve sarı çizginin yakınında bekledi.',
      },
      {
        text: {
          en: 'Ten minutes before departure, a loudspeaker announcement echoed through the hall. Because of his music, Murat did not hear a single word.',
          de: 'Zehn Minuten vor der Abfahrt hallte eine Durchsage durch die Bahnhofshalle. Wegen seiner Musik hörte Murat kein einziges Wort davon.',
          es: 'Diez minutos antes de la salida sonó un aviso por megafonía en el vestíbulo. Por culpa de la música, Murat no escuchó ni una palabra.',
        },
        turkish: 'Kalkıştan on dakika önce gar salonunda bir hoparlör anonsu yankılandı. Dinlediği müzik yüzünden Murat tek kelime bile duymadı.',
      },
      {
        text: {
          en: 'Most people around him picked up their suitcases and walked toward the stairs. An elderly passenger noticed the ticket in Murat\'s hand and tapped his shoulder.',
          de: 'Die meisten Leute um ihn herum nahmen ihre Koffer und gingen zur Treppe. Ein älterer Fahrgast sah Murats Fahrkarte und tippte ihm auf die Schulter.',
          es: 'Casi todos a su alrededor tomaron sus maletas y caminaron hacia la escalera. Un pasajero mayor vio el billete de Murat y le tocó el hombro.',
        },
        turkish: 'Çevresindeki çoğu kişi bavullarını alıp merdivenlere yöneldi. Yaşlı bir yolcu Murat\'ın elindeki bileti fark edip omzuna dokundu.',
      },
      {
        text: {
          en: '"Young man, our train moved to platform seven!" the gentleman said, pointing at the board. Murat thanked him and helped carry the man\'s heavy bag through the underpass.',
          de: '„Junger Mann, unser Zug fährt heute von Gleis sieben ab!“, sagte der Herr und zeigte auf die Tafel. Murat dankte ihm und trug seine schwere Tasche durch die Unterführung.',
          es: '—¡Joven, nuestro tren sale hoy desde el andén siete! —dijo el señor señalando la pantalla. Murat le dio las gracias y llevó la bolsa pesada del hombre por el paso subterráneo.',
        },
        turkish: 'Beyefendi panoyu göstererek, "Delikanlı, trenimiz yedinci perona alındı!" dedi. Murat teşekkür etti ve adamın ağır çantasını alt geçitten geçirmesine yardım etti.',
      },
      {
        text: {
          en: 'They stepped onto the train just two minutes before the doors closed. Sitting in the same coach, they shared roasted hazelnuts along the journey.',
          de: 'Sie stiegen nur zwei Minuten vor dem Schließen der Türen in den Zug ein. Im selben Wagen teilten sie sich unterwegs geröstete Haselnüsse.',
          es: 'Subieron al vagón apenas dos minutos antes de que se cerraran las puertas. Sentados cerca, compartieron avellanas tostadas durante el viaje.',
        },
        turkish: 'Kapılar kapanmadan sadece iki dakika önce trene bindiler. Aynı vagonda oturup yolculuk boyunca kavrulmuş fındık paylaştılar.',
      },
    ],
    vocabNotes: [
      {
        term: { en: 'departure time', de: 'die Abfahrtszeit', es: 'la hora de salida' },
        meaningTr: 'kalkış saati',
      },
      {
        term: { en: 'announcement', de: 'die Durchsage', es: 'el aviso por megafonía' },
        meaningTr: 'anons, sesli duyuru',
      },
      {
        term: { en: 'platform', de: 'das Gleis', es: 'el andén' },
        meaningTr: 'peron, hat',
      },
      {
        term: { en: 'underpass', de: 'die Unterführung', es: 'el paso subterráneo' },
        meaningTr: 'alt geçit',
      },
      {
        term: { en: 'train coach', de: 'der Wagen', es: 'el vagón' },
        meaningTr: 'tren vagonu',
      },
    ],
    questions: [
      {
        questionTr: 'Murat peron değişikliğini bildiren anonsu neden duymadı?',
        questionTarget: {
          en: 'Why did Murat miss the platform change announcement?',
          de: 'Warum hat Murat die Durchsage zum Gleiswechsel nicht gehört?',
          es: '¿Por qué no escuchó Murat el aviso del cambio de andén?',
        },
        options: [
          {
            text: {
              en: 'He was listening to music through his headphones.',
              de: 'Er hörte über seine Kopfhörer Musik.',
              es: 'Estaba escuchando música con sus auriculares.',
            },
            turkish: 'Kulaklığıyla müzik dinliyordu.',
            isCorrect: true,
          },
          {
            text: {
              en: 'He was buying a sandwich outside the station.',
              de: 'Er kaufte vor dem Bahnhof gerade ein Brötchen.',
              es: 'Estaba comprando un bocadillo fuera de la estación.',
            },
            turkish: 'İstasyonun dışında sandviç alıyordu.',
            isCorrect: false,
          },
          {
            text: {
              en: 'The station loudspeakers were completely broken.',
              de: 'Die Lautsprecher am Bahnhof waren komplett kaputt.',
              es: 'Los altavoces de la estación estaban rotos.',
            },
            turkish: 'İstasyonun hoparlörleri tamamen bozuktu.',
            isCorrect: false,
          },
        ],
      },
      {
        questionTr: 'Murat kendisini uyaran yaşlı yolcuya nasıl karşılık verdi?',
        questionTarget: {
          en: 'How did Murat thank the elderly passenger who warned him?',
          de: 'Wie bedankte sich Murat bei dem älteren Fahrgast?',
          es: '¿Cómo agradeció Murat la ayuda al pasajero mayor?',
        },
        options: [
          {
            text: {
              en: 'He bought the man a new first-class ticket.',
              de: 'Er kaufte dem Herrn eine Fahrkarte für die erste Klasse.',
              es: 'Le compró al señor un billete de primera clase.',
            },
            turkish: 'Adama yeni bir birinci mevki bilet aldı.',
            isCorrect: false,
          },
          {
            text: {
              en: 'He carried the man\'s heavy bag through the underpass.',
              de: 'Er trug die schwere Tasche des Mannes durch die Unterführung.',
              es: 'Llevó la bolsa pesada del señor por el paso subterráneo.',
            },
            turkish: 'Adamın ağır çantasını alt geçitten taşımasına yardım etti.',
            isCorrect: true,
          },
          {
            text: {
              en: 'He gave the man his headphones as a gift.',
              de: 'Er schenkte dem Mann zum Dank seine Kopfhörer.',
              es: 'Le regaló sus auriculares como agradecimiento.',
            },
            turkish: 'Kulaklığını adama hediye etti.',
            isCorrect: false,
          },
        ],
      },
    ],
  },
  {
    id: 'gs_b1_power_outage',
    order: 5,
    cefr: 'B1',
    readingMinutes: 4,
    titleTr: 'Elektriklerin Kesildiği Akşam',
    titleTarget: {
      en: 'The Evening the Power Went Out',
      de: 'Der Abend des Stromausfalls',
      es: 'La noche del apagón',
    },
    summaryTr: 'Sıradan bir kış akşamında yaşanan iki saatlik elektrik kesintisi, aynı apartmanda birbirini tanımadan yaşayan komşuları bir araya getirir.',
    paragraphs: [
      {
        text: {
          en: 'It was an ordinary January evening, and every window in our six-story building glowed with the blue light of televisions and phones. Although we had lived under the same roof for years, we rarely exchanged more than a quick nod by the mailboxes.',
          de: 'Es war ein gewöhnlicher Januarabend, und hinter jedem Fenster unseres Hauses schimmerte das bläuliche Licht von Fernsehern und Handys. Obwohl wir seit Jahren unter einem Dach wohnten, grüßten wir uns an den Briefkästen meist nur flüchtig.',
          es: 'Era una noche cualquiera de enero y cada ventana de nuestro edificio brillaba con la luz azulada de televisores y móviles. Aunque llevábamos años viviendo bajo el mismo techo, apenas nos saludábamos con un gesto junto a los buzones.',
        },
        turkish: 'Sıradan bir ocak akşamıydı ve altı katlı binamızın her penceresi televizyonlarla telefonların mavi ışığıyla parlıyordu. Yıllardır aynı çatının altında yaşamamıza rağmen posta kutularının önünde kısa bir baş selamından fazlasını nadiren paylaşırdık.',
      },
      {
        text: {
          en: 'At quarter past eight, the refrigerator stopped humming and the entire street suddenly went dark. Even the internet signal disappeared within a few minutes, leaving every apartment in unusual silence.',
          de: 'Um Viertel nach acht verstummte plötzlich das Summen des Kühlschranks, und die ganze Straße lag im Dunkeln. Nach wenigen Minuten fiel sogar das Mobilfunknetz aus, sodass in allen Wohnungen ungewohnte Stille herrschte.',
          es: 'A las ocho y cuarto el frigorífico dejó de zumbar y toda la calle quedó de pronto a oscuras. En pocos minutos también cayó la conexión móvil, dejando cada piso en un silencio poco habitual.',
        },
        turkish: 'Sekizi çeyrek geçe buzdolabının uğultusu kesildi ve bütün sokak bir anda karanlığa gömüldü. Birkaç dakika içinde internet bağlantısı da gidince her daireye alışılmadık bir sessizlik çöktü.',
      },
      {
        text: {
          en: 'I lit two candles, stepped onto the landing, and saw Mrs. Nermin across the hall looking for matches. Her flashlight batteries had run out, so I offered her one of my candles.',
          de: 'Ich zündete zwei Kerzen an, trat ins Treppenhaus und sah Frau Nermin von gegenüber, die nach Streichhölzern suchte. Die Batterien ihrer Taschenlampe waren leer, also gab ich ihr eine meiner Kerzen.',
          es: 'Encendí dos velas, salí al rellano y vi a la señora Nermin, de enfrente, buscando cerillas. Su linterna se había quedado sin pilas, así que le ofrecí una de mis velas.',
        },
        turkish: 'İki mum yakıp sahanlığa çıktım ve karşı dairedeki Nermin Hanım\'ın kibrit aradığını gördüm. El fenerinin pilleri bitmişti; bu yüzden mumlarımdan birini ona verdim.',
      },
      {
        text: {
          en: 'Soon, the couple from the first floor came up carrying a thermos of hot linden tea and a plate of tangerine slices. One by one, doors opened and neighbors gathered on the wide stairs wrapped in wool sweaters.',
          de: 'Kurz darauf kam das Paar aus dem Erdgeschoss mit einer Thermoskanne Lindenblütentee und einem Teller Mandarinen herauf. Nach und nach öffneten sich weitere Türen, und die Nachbarn versammelten sich in dicken Pullovern auf der Treppe.',
          es: 'Poco después subió la pareja de la planta baja con un termo de tila caliente y un plato de mandarinas. Una tras otra se abrieron las puertas y los vecinos se reunieron en la escalera con jerséis de lana.',
        },
        turkish: 'Çok geçmeden giriş katındaki çift ellerinde sıcak ıhlamur dolu bir termos ve bir tabak mandalina dilimiyle yukarı çıktı. Kapılar birer birer açıldı ve komşular yün kazaklarına sarınıp geniş merdivenlerde toplandı.',
      },
      {
        text: {
          en: 'In the warm candlelight, we learned that the quiet student on the top floor played classical guitar and that Mrs. Nermin used to work as a map archivist. Without notifications interrupting us, two hours passed like ten minutes.',
          de: 'Im warmen Kerzenschein erfuhren wir, dass der ruhige Student unterm Dach klassische Gitarre spielte und Frau Nermin früher Kartenarchivarin war. Ohne ständige Nachrichten auf dem Bildschirm vergingen zwei Stunden wie zehn Minuten.',
          es: 'A la cálida luz de las velas descubrimos que el estudiante tranquilo del ático tocaba la guitarra clásica y que la señora Nermin había sido archivera de mapas. Sin notificaciones que nos interrumpieran, dos horas pasaron como diez minutos.',
        },
        turkish: 'Sıcak mum ışığında çatı katındaki sessiz öğrencinin klasik gitar çaldığını ve Nermin Hanım\'ın eskiden harita arşivcisi olarak çalıştığını öğrendik. Bizi bölen bildirimler olmayınca iki saat on dakika gibi geçti.',
      },
      {
        text: {
          en: 'When the hallway lights blinked back on at ten thirty, nobody rushed inside right away. Before saying good night, we agreed to meet in the small garden once a month—even with the electricity on.',
          de: 'Als das Flurlicht um halb elf wieder anging, eilte niemand sofort in seine Wohnung zurück. Vor dem Abschied nahmen wir uns vor, uns einmal im Monat im kleinen Hof zu treffen – auch mit Strom.',
          es: 'Cuando la luz del pasillo volvió a encenderse a las diez y media, nadie tuvo prisa por entrar. Antes de dar las buenas noches, acordamos reunirnos una vez al mes en el patio, incluso con electricidad.',
        },
        turkish: 'Saat on buçukta koridor ışıkları yeniden yandığında kimse hemen içeri koşturmadı. İyi geceler dilemeden önce, elektrikler varken bile ayda bir kez küçük bahçede buluşmaya sözleştik.',
      },
    ],
    vocabNotes: [
      {
        term: { en: 'mailbox', de: 'der Briefkasten', es: 'el buzón' },
        meaningTr: 'posta kutusu',
      },
      {
        term: { en: 'landing / stairwell', de: 'das Treppenhaus', es: 'el rellano' },
        meaningTr: 'apartman sahanlığı, merdiven boşluğu',
      },
      {
        term: { en: 'flashlight', de: 'die Taschenlampe', es: 'la linterna' },
        meaningTr: 'el feneri',
      },
      {
        term: { en: 'thermos flask', de: 'die Thermoskanne', es: 'el termo' },
        meaningTr: 'termos',
      },
      {
        term: { en: 'candlelight', de: 'der Kerzenschein', es: 'la luz de las velas' },
        meaningTr: 'mum ışığı',
      },
    ],
    questions: [
      {
        questionTr: 'Elektrik kesintisi yaşanmadan önce apartman sakinlerinin ilişkisi nasıldı?',
        questionTarget: {
          en: 'What was the neighbors\' relationship like before the power outage?',
          de: 'Wie war das Verhältnis der Nachbarn vor dem Stromausfall?',
          es: '¿Cómo era la relación entre los vecinos antes del apagón?',
        },
        options: [
          {
            text: {
              en: 'They barely knew each other beyond brief greetings.',
              de: 'Sie kannten sich kaum und grüßten sich nur kurz.',
              es: 'Apenas se conocían más allá de un saludo breve.',
            },
            turkish: 'Kısa selamlaşmalar dışında birbirlerini pek tanımıyorlardı.',
            isCorrect: true,
          },
          {
            text: {
              en: 'They had dinner together every Friday evening.',
              de: 'Sie aßen jeden Freitagabend gemeinsam zu Abend.',
              es: 'Cenaban juntos todos los viernes por la noche.',
            },
            turkish: 'Her cuma akşamı birlikte yemek yiyorlardı.',
            isCorrect: false,
          },
          {
            text: {
              en: 'They argued constantly about garden repairs.',
              de: 'Sie stritten sich ständig über Reparaturen im Garten.',
              es: 'Discutían constantemente por las obras del jardín.',
            },
            turkish: 'Bahçe tadilatı yüzünden sürekli tartışıyorlardı.',
            isCorrect: false,
          },
        ],
      },
      {
        questionTr: 'Elektrikler geri geldiğinde komşular neye karar verdiler?',
        questionTarget: {
          en: 'What did the neighbors decide when the lights came back on?',
          de: 'Was beschlossen die Nachbarn, als das Licht wieder anging?',
          es: '¿Qué acordaron los vecinos cuando volvió la electricidad?',
        },
        options: [
          {
            text: {
              en: 'To buy a large backup generator for the basement.',
              de: 'Einen großen Notstromgenerator für den Keller zu kaufen.',
              es: 'Comprar un generador grande para el sótano.',
            },
            turkish: 'Bodrum katı için büyük bir jeneratör almaya.',
            isCorrect: false,
          },
          {
            text: {
              en: 'To meet once a month in the building\'s garden.',
              de: 'Sich einmal im Monat gemeinsam im Hof zu treffen.',
              es: 'Reunirse una vez al mes en el patio del edificio.',
            },
            turkish: 'Ayda bir kez binanın bahçesinde bir araya gelmeye.',
            isCorrect: true,
          },
          {
            text: {
              en: 'To cancel their home internet subscriptions permanently.',
              de: 'Ihre Internetverträge zu Hause dauerhaft zu kündigen.',
              es: 'Cancelar para siempre sus contratos de internet en casa.',
            },
            turkish: 'Evdeki internet aboneliklerini kalıcı olarak iptal etmeye.',
            isCorrect: false,
          },
        ],
      },
    ],
  },
  {
    id: 'gs_b1_bookshop',
    order: 6,
    cefr: 'B1',
    readingMinutes: 4,
    titleTr: 'İkinci El Kitapçıdaki Not',
    titleTarget: {
      en: 'The Postcard in the Secondhand Bookshop',
      de: 'Die Postkarte im Antiquariat',
      es: 'La postal en la librería de segunda mano',
    },
    summaryTr: 'Sahaftan aldığı eski bir romanın sayfaları arasında 1998 yılından kalma bir kartpostal bulan Elif, dükkan sahibiyle beklenmedik bir hatırayı paylaşır.',
    paragraphs: [
      {
        text: {
          en: 'Whenever Elif had a free Saturday afternoon, she visited a narrow secondhand bookshop behind the post office. Wooden shelves reached the ceiling, and every corner smelled faintly of aged paper.',
          de: 'Immer wenn Elif am Samstagnachmittag freihatte, besuchte sie ein schmales Antiquariat hinter der Post. Holzregale reichten bis zur Decke, und überall roch es leicht nach altem Papier.',
          es: 'Siempre que Elif tenía libre el sábado por la tarde, visitaba una estrecha librería de segunda mano detrás de correos. Las estanterías de madera llegaban al techo y todo olía suavemente a papel antiguo.',
        },
        turkish: 'Elif cumartesi öğleden sonraları boş vakti olduğunda postanenin arkasındaki dar sahafa uğrardı. Ahşap raflar tavana kadar uzanır, her köşe hafifçe eski kağıt kokardı.',
      },
      {
        text: {
          en: 'While browsing the travel section, she pulled out a worn clothbound novel printed in the nineties. As she flipped through the middle pages, a faded postcard slipped onto the rug.',
          de: 'Beim Stöbern in der Reiseecke zog sie einen abgegriffenen Leinenroman aus den neunziger Jahren heraus. Als sie durch die mittleren Seiten blätterte, fiel eine verblasste Postkarte auf den Teppich.',
          es: 'Mientras miraba la sección de viajes, sacó una novela encuadernada en tela de los años noventa. Al hojear las páginas centrales, una postal desteñida resbaló hasta la alfombra.',
        },
        turkish: 'Gezi bölümünü karıştırırken doksanlarda basılmış, bez ciltli yıpranmış bir roman çekti. Orta sayfaları çevirirken solmuş bir kartpostal halının üzerine düştü.',
      },
      {
        text: {
          en: 'The front showed a black-and-white ferry crossing the Bosphorus, and the back was dated October 1998. Someone had written in neat blue ink: "Read chapter four on the train; it reminded me of our autumn trip."',
          de: 'Auf der Vorderseite war eine schwarz-weiße Fähre auf dem Bosporus zu sehen, datiert auf Oktober 1998. Jemand hatte mit blauer Tinte geschrieben: „Lies im Zug das vierte Kapitel; es hat mich an unsere Herbstreise erinnert.“',
          es: 'En el anverso aparecía un barco en blanco y negro cruzando el Bósforo, con fecha de octubre de 1998. Alguien había escrito con tinta azul: «Lee el capítulo cuatro en el tren; me recordó nuestro viaje de otoño».',
        },
        turkish: 'Ön yüzünde Boğaz\'ı geçen siyah-beyaz bir vapur fotoğrafı, arkasında ise Ekim 1998 tarihi vardı. Biri özenli mavi mürekkeple şöyle yazmıştı: "Trende dördüncü bölümü oku; bana sonbahar yolculuğumuzu hatırlattı."',
      },
      {
        text: {
          en: 'Elif carried both the book and the postcard to the counter, not wanting to take someone\'s personal memory by mistake. Mr. Kemal, the elderly shopkeeper, adjusted his glasses and looked closely at the handwriting.',
          de: 'Elif brachte das Buch samt Postkarte zur Theke, weil sie keine fremde Erinnerung versehentlich mitnehmen wollte. Herr Kemal, der ältere Buchhändler, rückte seine Brille zurecht und betrachtete die Handschrift genau.',
          es: 'Elif llevó el libro y la postal al mostrador, pues no quería quedarse por descuido con un recuerdo ajeno. El señor Kemal, el librero mayor, se ajustó las gafas y observó la letra de cerca.',
        },
        turkish: 'Elif bir başkasının kişisel hatırasını yanlışlıkla almamak için hem kitabı hem kartpostalı tezgaha götürdü. Yaşlı sahaf Kemal Bey gözlüğünü düzeltti ve el yazısına dikkatle baktı.',
      },
      {
        text: {
          en: 'A quiet smile appeared on his face. "That belonged to a retired geography teacher who donated his library last spring," he explained. "He told me he hoped future readers would enjoy the little bookmarks he left behind."',
          de: 'Ein stilles Lächeln erschien auf seinem Gesicht. „Das gehörte einem pensionierten Geografielehrer, der uns im Frühling seine Bibliothek überlassen hat“, erklärte er. „Er hoffte, dass künftige Leser Freude an seinen Lesezeichen haben.“',
          es: 'Una sonrisa serena apareció en su rostro. «Pertenecía a un profesor jubilado de geografía que donó su biblioteca en primavera», explicó. «Me dijo que esperaba que los futuros lectores disfrutaran de los marcapáginas que dejó dentro».',
        },
        turkish: 'Yüzünde sakin bir tebessüm belirdi. "Bu kitap, geçen bahar kütüphanesini bağışlayan emekli bir coğrafya öğretmenine aitti," diye açıkladı. "İçlerinde bıraktığı küçük ayraçların gelecekteki okurları mutlu etmesini umduğunu söylemişti."',
      },
      {
        text: {
          en: 'Elif bought the novel, tucked the postcard carefully back beside chapter four, and headed toward the station. She decided to save that exact chapter for her next train ride.',
          de: 'Elif kaufte den Roman, legte die Postkarte behutsam zurück zum vierten Kapitel und machte sich auf den Weg. Sie beschloss, genau dieses Kapitel für ihre nächste Zugfahrt aufzuheben.',
          es: 'Elif compró la novela, guardó con cuidado la postal junto al capítulo cuatro y salió hacia la estación. Decidió reservar exactamente ese capítulo para su próximo viaje en tren.',
        },
        turkish: 'Elif romanı satın aldı, kartpostalı özenle dördüncü bölümün yanına yerleştirdi ve istasyona doğru yürüdü. Tam o bölümü bir sonraki tren yolculuğuna saklamaya karar verdi.',
      },
    ],
    vocabNotes: [
      {
        term: { en: 'secondhand bookshop', de: 'das Antiquariat', es: 'la librería de segunda mano' },
        meaningTr: 'sahaf, ikinci el kitapçı',
      },
      {
        term: { en: 'to flip through', de: 'durchblättern', es: 'hojear' },
        meaningTr: 'sayfaları karıştırmak, göz gezdirmek',
      },
      {
        term: { en: 'handwriting', de: 'die Handschrift', es: 'la letra' },
        meaningTr: 'el yazısı',
      },
      {
        term: { en: 'retired', de: 'pensioniert', es: 'jubilado' },
        meaningTr: 'emekli',
      },
      {
        term: { en: 'bookmark', de: 'das Lesezeichen', es: 'el marcapáginas' },
        meaningTr: 'kitap ayracı',
      },
    ],
    questions: [
      {
        questionTr: 'Elif kartpostalı bulduğunda neden dükkan sahibine götürdü?',
        questionTarget: {
          en: 'Why did Elif take the postcard to the shopkeeper?',
          de: 'Warum brachte Elif die Postkarte zum Buchhändler?',
          es: '¿Por qué llevó Elif la postal al mostrador del librero?',
        },
        options: [
          {
            text: {
              en: 'She did not want to take someone\'s personal memory by mistake.',
              de: 'Sie wollte keine persönliche Erinnerung versehentlich mitnehmen.',
              es: 'No quería llevarse por error el recuerdo personal de otra persona.',
            },
            turkish: 'Başkasının kişisel bir hatırasını yanlışlıkla almak istemedi.',
            isCorrect: true,
          },
          {
            text: {
              en: 'She wanted to ask for a discount because the page was torn.',
              de: 'Sie wollte wegen einer zerrissenen Seite um Rabatt bitten.',
              es: 'Quería pedir un descuento porque una página estaba rota.',
            },
            turkish: 'Sayfa yırtık olduğu için indirim istemeyi düşündü.',
            isCorrect: false,
          },
          {
            text: {
              en: 'She recognized her own grandfather\'s address on the card.',
              de: 'Sie erkannte darauf die Adresse ihres eigenen Großvaters.',
              es: 'Reconoció en la tarjeta la dirección de su propio abuelo.',
            },
            turkish: 'Kartın üzerinde kendi dedesinin adresini tanıdı.',
            isCorrect: false,
          },
        ],
      },
      {
        questionTr: 'Kemal Bey\'in anlattığına göre kitabın önceki sahibi kimdi?',
        questionTarget: {
          en: 'According to Mr. Kemal, who had owned the book previously?',
          de: 'Wem hatte das Buch laut Herrn Kemal zuvor gehört?',
          es: 'Según el señor Kemal, ¿a quién había pertenecido el libro antes?',
        },
        options: [
          {
            text: {
              en: 'A ferry captain who moved abroad in 1998.',
              de: 'Einem Fährkapitän, der 1998 ins Ausland gezogen war.',
              es: 'A un capitán de barco que se mudó al extranjero en 1998.',
            },
            turkish: '1998 yılında yurt dışına taşınan bir vapur kaptanına.',
            isCorrect: false,
          },
          {
            text: {
              en: 'A retired geography teacher who donated his books.',
              de: 'Einem pensionierten Geografielehrer, der seine Bücher gespendet hatte.',
              es: 'A un profesor jubilado de geografía que donó sus libros.',
            },
            turkish: 'Kitaplarını bağışlayan emekli bir coğrafya öğretmenine.',
            isCorrect: true,
          },
          {
            text: {
              en: 'A young journalist writing about train stations.',
              de: 'Einer jungen Journalistin, die über Bahnhöfe schrieb.',
              es: 'A una joven periodista que escribía sobre estaciones de tren.',
            },
            turkish: 'Tren istasyonları hakkında yazı yazan genç bir gazeteciye.',
            isCorrect: false,
          },
        ],
      },
    ],
  },
  {
    id: 'gs_b2_small_town',
    order: 7,
    cefr: 'B2',
    readingMinutes: 5,
    titleTr: 'Büyük Şehirden Kıyı Kasabasına',
    titleTarget: {
      en: 'From the Big City to a Coastal Town',
      de: 'Von der Großstadt in eine Küstenstadt',
      es: 'De la gran ciudad a un pueblo costero',
    },
    summaryTr: 'Yıllarca her gün iki saat trafikte kaldıktan sonra uzaktan çalışma kararıyla küçük bir sahil kasabasına yerleşen Kerem, ilk ayında yeni hayatının hem ferahlığını hem de gerçekçi zorluklarını deneyimler.',
    paragraphs: [
      {
        text: {
          en: 'For nearly seven years, Kerem spent two hours every weekday stuck in bumper-to-bumper bridge traffic. When his software company approved permanent remote work, he gave notice on his noisy apartment and rented a stone house in a quiet Aegean coastal town.',
          de: 'Fast sieben Jahre lang verbrachte Kerem jeden Werktag zwei Stunden im dichten Stau auf der Brücke. Als seine Softwarefirma dauerhaftes Arbeiten aus der Ferne erlaubte, kündigte er seine laute Stadtwohnung und mietete ein Steinhaus in einem ruhigen Küstenort.',
          es: 'Durante casi siete años, Kerem pasó dos horas cada día laborable atrapado en el tráfico denso del puente. Cuando su empresa de software aprobó el teletrabajo permanente, dejó su ruidoso piso y alquiló una casa de piedra en un tranquilo pueblo costero.',
        },
        turkish: 'Kerem yaklaşık yedi yıl boyunca hafta içi her gün iki saatini köprüdeki yoğun trafikte geçirdi. Çalıştığı yazılım şirketi kalıcı uzaktan çalışmayı onaylayınca gürültülü dairesinden çıkıp sakin bir Ege kıyı kasabasında taş bir ev kiraladı.',
      },
      {
        text: {
          en: 'During the first week, the contrast felt almost unreal: instead of ambulance sirens and car horns, he woke up to gulls and the smell of damp pine trees. By eight thirty, he had already swum in the cool bay and brewed his coffee before opening his laptop.',
          de: 'In der ersten Woche wirkte der Kontrast beinahe unwirklich: Statt Sirenen und Hupen weckten ihn Möwen und der Duft feuchter Kiefern. Um halb neun war er bereits in der kühlen Bucht geschwommen und saß mit frischem Kaffee vor seinem Laptop.',
          es: 'Durante la primera semana, el contraste parecía casi irreal: en lugar de sirenas y bocinas, lo despertaban las gaviotas y el aroma de los pinos húmedos. A las ocho y media ya había nadado en la bahía fresca antes de abrir el portátil con su café.',
        },
        turkish: 'İlk hafta aradaki fark neredeyse inanılmaz geliyordu; siren ve korna sesleri yerine martılarla ve nemli çam ağaçlarının kokusuyla uyanıyordu. Saat sekiz buçuk olduğunda serin koyda yüzmüş, bilgisayarını açmadan önce kahvesini demlemiş oluyordu.',
      },
      {
        text: {
          en: 'By the third week, however, daily life revealed a few practical drawbacks that vacationers rarely notice. A strong autumn storm knocked out the fiber connection for an entire Tuesday, forcing him to tether his phone from a bakery terrace to join a client meeting.',
          de: 'In der dritten Woche zeigten sich im Alltag jedoch einige praktische Nachteile, die Urlauber selten bemerken. Ein kräftiger Herbststurm legte am Dienstag die Glasfaserleitung lahm, sodass er auf der Terrasse einer Bäckerei über sein Handy an einer Kundenbesprechung teilnehmen musste.',
          es: 'En la tercera semana, sin embargo, la rutina dejó ver algunos inconvenientes prácticos que los turistas rara vez notan. Una fuerte tormenta de otoño cortó la fibra óptica todo un martes, obligándolo a conectarse con el móvil desde la terraza de una panadería para una reunión.',
        },
        turkish: 'Ne var ki üçüncü haftaya gelindiğinde günlük hayat, tatilcilerin nadiren fark ettiği bazı pratik zorlukları ortaya çıkardı. Sert bir sonbahar fırtınası salı günü boyunca fiber interneti kesince müşteri toplantısına bir fırının terasından telefon internetiyle bağlanmak zorunda kaldı.',
      },
      {
        text: {
          en: 'He also missed the convenience of late-night pharmacies, specialized hardware stores, and spontaneous dinners with old friends. In a town where most shutters closed by eight in the evening, silence occasionally turned into loneliness.',
          de: 'Außerdem vermisste er manchmal die Bequemlichkeit von Nachtapotheken, großen Fachgeschäften und spontanen Abendessen mit alten Freunden. In einem Ort, in dem die meisten Läden um acht Uhr schlossen, verwandelte sich die Ruhe mitunter in Einsamkeit.',
          es: 'También echaba de menos la comodidad de las farmacias nocturnas, las ferreterías grandes y las cenas improvisadas con viejos amigos. En un municipio donde casi todos los comercios cerraban a las ocho, la calma se convertía a veces en soledad.',
        },
        turkish: 'Ayrıca gece açık dükkanların, kapsamlı yapı marketlerin ve eski dostlarla son dakikada planlanan akşam yemeklerinin rahatlığını da özlüyordu. Kepenklerin akşam sekizde kapandığı bir kasabada sessizlik zaman zaman yalnızlığa dönüşüyordu.',
      },
      {
        text: {
          en: 'Rather than retreating indoors, Kerem began buying vegetables directly from the Thursday market and joined a local rowing group at the harbor. Sharing regular routines with fishermen, teachers, and shopkeepers gradually replaced his sense of being an outsider.',
          de: 'Statt sich zurückzuziehen, kaufte Kerem sein Gemüse fortan auf dem Donnerstagsmarkt und schloss sich einer örtlichen Rudergruppe am Hafen an. Gemeinsame Gewohnheiten mit Fischern, Lehrern und Ladenbesitzern ließen das Gefühl, fremd zu sein, langsam verschwinden.',
          es: 'En lugar de encerrarse en casa, Kerem empezó a comprar verdura en el mercado de los jueves y se apuntó a un grupo local de remo en el puerto. Compartir rutinas con pescadores, maestros y comerciantes disipó poco a poco la sensación de ser un extraño.',
        },
        turkish: 'Kerem eve kapanmak yerine perşembe pazarından alışveriş yapmaya başladı ve limandaki yerel kürek grubuna katıldı. Balıkçılar, öğretmenler ve esnafla düzenli alışkanlıklar paylaşmak, yabancılık hissini yavaş yavaş ortadan kaldırdı.',
      },
      {
        text: {
          en: 'At the end of his first month, he realized that moving away had not solved every problem, yet it had given him back ownership of his hours. Having two unhurried hours each evening felt worth every minor inconvenience.',
          de: 'Am Ende des ersten Monats wurde ihm klar, dass der Umzug nicht jedes Problem gelöst, ihm aber die Herrschaft über seine Zeit zurückgegeben hatte. Zwei unverplante Stunden an jedem Feierabend waren jede kleine Unannehmlichkeit wert.',
          es: 'Al terminar el primer mes comprendió que mudarse no había resuelto todos los problemas, pero le había devuelto el control de su tiempo. Disponer de dos horas sin prisas cada tarde compensaba cualquier pequeña incomodidad.',
        },
        turkish: 'İlk ayın sonunda taşınmanın her sorunu çözmediğini ama saatlerinin kontrolünü kendisine geri verdiğini anladı. Her akşam telaşsız iki saate sahip olmak, katlandığı her küçük aksaklığa değiyordu.',
      },
    ],
    vocabNotes: [
      {
        term: { en: 'remote work', de: 'das Arbeiten aus der Ferne', es: 'el teletrabajo' },
        meaningTr: 'uzaktan çalışma',
      },
      {
        term: { en: 'drawback', de: 'der Nachteil', es: 'el inconveniente' },
        meaningTr: 'dezavantaj, olumsuz yön',
      },
      {
        term: { en: 'fiber connection', de: 'die Glasfaserleitung', es: 'la fibra óptica' },
        meaningTr: 'fiber internet hattı',
      },
      {
        term: { en: 'loneliness', de: 'die Einsamkeit', es: 'la soledad' },
        meaningTr: 'yalnızlık hissi',
      },
      {
        term: { en: 'inconvenience', de: 'die Unannehmlichkeit', es: 'la incomodidad' },
        meaningTr: 'zahmet, küçük aksaklık',
      },
    ],
    questions: [
      {
        questionTr: 'Kerem kasabadaki üçüncü haftasında hangi somut aksaklıkla karşılaştı?',
        questionTarget: {
          en: 'What practical issue did Kerem face during his third week in town?',
          de: 'Welches praktische Problem erlebte Kerem in seiner dritten Woche?',
          es: '¿Qué problema práctico afrontó Kerem durante su tercera semana en el pueblo?',
        },
        options: [
          {
            text: {
              en: 'An autumn storm cut off the fiber internet during a workday.',
              de: 'Ein Herbststurm unterbrach an einem Arbeitstag die Glasfaserverbindung.',
              es: 'Una tormenta de otoño cortó la fibra óptica en pleno día laboral.',
            },
            turkish: 'Sonbahar fırtınası iş gününde fiber internet bağlantısını kesti.',
            isCorrect: true,
          },
          {
            text: {
              en: 'His company canceled remote work and called him back immediately.',
              de: 'Seine Firma schaffte die Fernarbeit ab und rief ihn sofort zurück.',
              es: 'Su empresa canceló el teletrabajo y le pidió volver de inmediato.',
            },
            turkish: 'Şirketi uzaktan çalışmayı iptal edip onu hemen geri çağırdı.',
            isCorrect: false,
          },
          {
            text: {
              en: 'The owner decided to sell the rented stone house within a week.',
              de: 'Der Eigentümer wollte das gemietete Steinhaus innerhalb einer Woche verkaufen.',
              es: 'El propietario decidió vender la casa de piedra en una semana.',
            },
            turkish: 'Ev sahibi kiralık taş evi bir hafta içinde satmaya karar verdi.',
            isCorrect: false,
          },
        ],
      },
      {
        questionTr: 'Kerem kasabadaki yabancılık ve yalnızlık hissini nasıl aştı?',
        questionTarget: {
          en: 'How did Kerem overcome the feeling of being an outsider?',
          de: 'Wie überwand Kerem das Gefühl, im Ort ein Fremder zu sein?',
          es: '¿Cómo superó Kerem la sensación de sentirse un extraño en el pueblo?',
        },
        options: [
          {
            text: {
              en: 'By driving back to the big city every single evening.',
              de: 'Indem er jeden Abend mit dem Auto zurück in die Großstadt fuhr.',
              es: 'Volviendo en coche a la gran ciudad todas las noches.',
            },
            turkish: 'Her akşam arabayla büyük şehre geri dönerek.',
            isCorrect: false,
          },
          {
            text: {
              en: 'By shopping at the local market and joining a harbor rowing group.',
              de: 'Durch Einkäufe auf dem Wochenmarkt und eine Rudergruppe am Hafen.',
              es: 'Comprando en el mercado local y uniéndose a un grupo de remo.',
            },
            turkish: 'Yerel pazardan alışveriş yaparak ve limandaki kürek grubuna katılarak.',
            isCorrect: true,
          },
          {
            text: {
              en: 'By opening his own late-night hardware shop in town.',
              de: 'Indem er im Ort sein eigenes großes Fachgeschäft eröffnete.',
              es: 'Abriendo su propia ferretería nocturna en el centro.',
            },
            turkish: 'Kasabada geceleri açık kendi yapı marketini açarak.',
            isCorrect: false,
          },
        ],
      },
    ],
  },
  {
    id: 'gs_b2_craftsman',
    order: 8,
    cefr: 'B2',
    readingMinutes: 5,
    titleTr: 'Saat Tamircisinin Sabrı',
    titleTarget: {
      en: 'The Watchmaker\'s Patience',
      de: 'Die Geduld des Uhrmachers',
      es: 'La paciencia del relojero',
    },
    summaryTr: 'Dedesinden kalan durmuş kol saatini dar bir pasajdaki yaşlı ustaya götüren Zeynep, ustanın acele etmeyen çalışma biçiminden kendi hayatına dair sakin bir ders çıkarır.',
    paragraphs: [
      {
        text: {
          en: 'Inside a dimly lit arcade near the old bazaar, a workshop no wider than two meters has stood for forty years. Zeynep went there on Tuesday lunch break holding her late grandfather\'s mechanical wristwatch, which had stopped ticking years ago.',
          de: 'In einer schmalen Passage nahe dem alten Basar gibt es seit vierzig Jahren eine kaum zwei Meter breite Werkstatt. Dorthin brachte Zeynep in ihrer Mittagspause die mechanische Armbanduhr ihres verstorbenen Großvaters, die seit Jahren stillstand.',
          es: 'En un pasaje estrecho cerca del antiguo bazar existe desde hace cuarenta años un taller de apenas dos metros de ancho. Allí llevó Zeynep al mediodía el reloj mecánico de su difunto abuelo, que llevaba años detenido.',
        },
        turkish: 'Eski çarşının yakınındaki loş bir pasajın içinde kırk yıldır iki metreden dar bir atölye durur. Zeynep salı günü öğle arasında, yıllar önce durmuş olan rahmetli dedesinin mekanik kol saatini oraya götürdü.',
      },
      {
        text: {
          en: 'Used to same-day deliveries and instant replies, she asked whether she could pick it up before five o\'clock. Master Agop, peering through a brass magnifying loupe, gently shook his head and invited her to sit on the wooden stool.',
          de: 'Gewohnt an Lieferungen am selben Tag und sofortige Antworten, fragte sie, ob die Uhr bis fünf Uhr fertig sei. Meister Agop blickte durch seine Messinglupe, schüttelte sanft den Kopf und bot ihr den Holzschemel an.',
          es: 'Acostumbrada a las entregas en el mismo día y a las respuestas inmediatas, preguntó si estaría listo antes de las cinco. El maestro Agop miró por su lupa de latón, negó suavemente con la cabeza y le ofreció el taburete de madera.',
        },
        turkish: 'Aynı gün teslimatlara ve anlık yanıtlara alışkın olduğu için saati akşam beşten önce alıp alamayacağını sordu. Agop Usta pirinç büyütecinin ardından bakarak başını yavaşça iki yana salladı ve onu ahşap tabureye davet etti.',
      },
      {
        text: {
          en: 'He opened the steel case back and showed her dozens of tiny brass gears resting side by side. "Dried oil has held this balance wheel captive for a decade," he said calmly. "If you force a delicate spring to hurry, it snaps."',
          de: 'Er öffnete das Stahlgehäuse und zeigte ihr Dutzende winziger Zahnräder aus Messing. „Eingetrocknetes Öl hält diese Unruh seit zehn Jahren fest“, sagte er ruhig. „Wenn man eine feine Feder zur Eile zwingt, bricht sie.“',
          es: 'Abrió la tapa de acero y le mostró docenas de diminutos engranajes de latón. «El aceite seco mantiene bloqueado este volante desde hace diez años», explicó con calma. «Si obligas a un muelle delicado a darse prisa, se rompe».',
        },
        turkish: 'Çelik arka kapağı açtı ve yan yana duran onlarca minik pirinç dişliyi ona gösterdi. "Kurumuş yağ bu denge çarkını on yıldır tutsak etmiş," dedi sakin bir sesle. "Hassas bir yayı aceleye zorlarsanız kırılır."',
      },
      {
        text: {
          en: 'He explained that each piece had to be cleaned separately, oiled with a needle tip, and observed for forty-eight hours to test its accuracy. Zeynep realized how rarely anyone in her own office took time to check whether hurried work would actually last.',
          de: 'Er erklärte, dass jedes Teil einzeln gereinigt, mit einer Nadelspitze geölt und achtundvierzig Stunden lang auf Ganggenauigkeit geprüft werden müsse. Zeynep fiel auf, wie selten man sich in ihrem Büro noch fragte, ob eilige Arbeit überhaupt Bestand hat.',
          es: 'Explicó que cada pieza debía limpiarse por separado, engrasarse con la punta de una aguja y observarse cuarenta y ocho horas para comprobar su precisión. Zeynep pensó en qué pocas veces en su oficina se comprobaba si el trabajo apresurado iba a durar.',
        },
        turkish: 'Her parçanın tek tek temizlenmesi, iğne ucuyla yağlanması ve dakikliğinin sınanması için kırk sekiz saat izlenmesi gerektiğini anlattı. Zeynep kendi ofisinde aceleye getirilen işlerin kalıcı olup olmadığını neredeyse kimsenin sorgulamadığını fark etti.',
      },
      {
        text: {
          en: 'When she returned on Friday evening, Master Agop handed her the polished watch without saying a word at first. Pressed lightly against her ear, the steady, rhythmic ticking sounded as clear as she remembered from childhood.',
          de: 'Als sie am Freitagabend wiederkam, reichte ihr Meister Agop zunächst wortlos die frisch polierte Uhr. Leicht ans Ohr gehalten, klang das gleichmäßige Ticken genauso klar, wie sie es aus ihrer Kindheit in Erinnerung hatte.',
          es: 'Cuando regresó el viernes por la tarde, el maestro Agop le entregó primero en silencio el reloj recién pulido. Al acercarlo suavemente al oído, el tictac constante y rítmico sonaba tan nítido como lo recordaba de niña.',
        },
        turkish: 'Cuma akşamı geri döndüğünde Agop Usta parlatılmış saati önce tek kelime etmeden ona uzattı. Kulağına hafifçe yaklaştırdığında, düzenli ve ritmik tiktak sesi çocukluğundan hatırladığı kadar berrak duyuluyordu.',
      },
      {
        text: {
          en: 'Walking back through the crowded street, Zeynep deliberately left her phone inside her coat pocket. Wearing a watch that measured time without flashing a single alert felt strangely liberating.',
          de: 'Auf dem Rückweg durch die belebte Straße ließ Zeynep ihr Handy bewusst in der Manteltasche. Eine Uhr am Handgelenk zu tragen, die die Zeit maß, ohne ein einziges Mal aufzuleuchten, fühlte sich ungewohnt befreiend an.',
          es: 'De vuelta por la calle concurrida, Zeynep dejó a propósito el móvil dentro del bolsillo del abrigo. Llevar en la muñeca un reloj que medía el tiempo sin emitir ni un solo aviso resultaba extrañamente liberador.',
        },
        turkish: 'Kalabalık caddede geri yürürken Zeynep telefonunu bilerek paltosunun cebinde bıraktı. Tek bir bildirim ışığı yakmadan zamanı ölçen bir saati bileğinde taşımak tuhaf biçimde özgürleştirici hissettiriyordu.',
      },
    ],
    vocabNotes: [
      {
        term: { en: 'wristwatch', de: 'die Armbanduhr', es: 'el reloj de pulsera' },
        meaningTr: 'kol saati',
      },
      {
        term: { en: 'magnifying loupe', de: 'die Lupe', es: 'la lupa' },
        meaningTr: 'büyüteç, saatçi merceği',
      },
      {
        term: { en: 'gear / cogwheel', de: 'das Zahnrad', es: 'el engranaje' },
        meaningTr: 'dişli çark',
      },
      {
        term: { en: 'spring', de: 'die Feder', es: 'el muelle' },
        meaningTr: 'zemberek, yay',
      },
      {
        term: { en: 'accuracy', de: 'die Genauigkeit', es: 'la precisión' },
        meaningTr: 'dakiklik, hassas doğruluk',
      },
    ],
    questions: [
      {
        questionTr: 'Agop Usta saati neden aynı gün içinde teslim etmeyi kabul etmedi?',
        questionTarget: {
          en: 'Why did Master Agop refuse to return the watch on the same day?',
          de: 'Warum lehnte Meister Agop eine Rückgabe am selben Tag ab?',
          es: '¿Por qué no aceptó el maestro Agop entregar el reloj el mismo día?',
        },
        options: [
          {
            text: {
              en: 'He had to order a digital battery from abroad first.',
              de: 'Er musste zuerst eine digitale Batterie aus dem Ausland bestellen.',
              es: 'Tenía que encargar primero una pila digital al extranjero.',
            },
            turkish: 'Önce yurt dışından dijital bir pil sipariş etmesi gerekiyordu.',
            isCorrect: false,
          },
          {
            text: {
              en: 'Each tiny part needed careful cleaning, oiling, and two days of testing.',
              de: 'Jedes Teil musste gereinigt, geölt und zwei Tage lang geprüft werden.',
              es: 'Cada pieza requería limpieza, engrase y dos días de prueba.',
            },
            turkish: 'Her parçanın özenle temizlenmesi, yağlanması ve iki gün izlenmesi gerekiyordu.',
            isCorrect: true,
          },
          {
            text: {
              en: 'His workshop was only open on Friday evenings.',
              de: 'Seine Werkstatt hatte nur am Freitagabend geöffnet.',
              es: 'Su taller solo abría los viernes por la tarde.',
            },
            turkish: 'Atölyesi yalnızca cuma akşamları açıktı.',
            isCorrect: false,
          },
        ],
      },
      {
        questionTr: 'Zeynep tamir edilen saati aldıktan sonra nasıl bir duyguyla yürüdü?',
        questionTarget: {
          en: 'How did Zeynep feel walking back with the repaired wristwatch?',
          de: 'Wie fühlte sich Zeynep auf dem Rückweg mit der reparierten Uhr?',
          es: '¿Cómo se sintió Zeynep al volver con el reloj reparado?',
        },
        options: [
          {
            text: {
              en: 'Relieved to wear a watch that measured time without constant alerts.',
              de: 'Befreit, eine Uhr ohne ständige Bildschirmwarnungen zu tragen.',
              es: 'Liberada al llevar un reloj que medía el tiempo sin avisos constantes.',
            },
            turkish: 'Sürekli bildirim göndermeden zamanı ölçen bir saat takmanın ferahlığını hissetti.',
            isCorrect: true,
          },
          {
            text: {
              en: 'Worried that the watch looked too old-fashioned for her office.',
              de: 'Besorgt, dass die Uhr für ihr Büro zu altmodisch aussah.',
              es: 'Preocupada porque el reloj parecía demasiado antiguo para la oficina.',
            },
            turkish: 'Saatin ofisi için fazla eski moda göründüğünden endişelendi.',
            isCorrect: false,
          },
          {
            text: {
              en: 'Upset because the ticking sound was much louder than before.',
              de: 'Verärgert, weil das Ticken viel lauter war als früher.',
              es: 'Molesta porque el tictac sonaba mucho más fuerte que antes.',
            },
            turkish: 'Tiktak sesi eskisinden çok daha gürültülü olduğu için canı sıkıldı.',
            isCorrect: false,
          },
        ],
      },
    ],
  },
];
