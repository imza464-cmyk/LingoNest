import type {
  AdultDialogue,
  AdultModule,
  AdultPhraseItem,
} from '../types';

export const ADULT_MODULES: AdultModule[] = [
  {
    id: 'daily_fluency',
    order: 1,
    titleTr: 'Günlük Akıcı İletişim & Doğal Tepkiler',
    subtitleTr: 'Sohbette robotik çeviriden kurtulup akıcı, doğal ve hızlı tepkiler ver',
    icon: '💬',
    cefrRange: 'A2–B1',
    accentHex: '#10b981',
    items: [
      {
        id: 'daily_agree',
        moduleId: 'daily_fluency',
        cefr: 'A2',
        turkishMeaning: 'Sana tamamen katılıyorum.',
        turkishTrapTr:
          'Türkçedeki "katılıyorum" durum gibi hissedildiği için "I am agree" deme tuzağına düşülür; "agree" fiildir -> "I completely agree". Almancada ayrılabilen fiil "zustimmen" cümlenin sonuna ("...zu") gider; İspanyolcada geçici fikir birliği "estar de acuerdo" ile kurulur ("ser" değil).',
        contextTagTr: 'Günlük Sohbet',
        langs: {
          en: {
            phrase: 'I completely agree with you.',
            clozeSentence: 'I completely ___ with your point.',
            clozeAnswer: 'agree',
            ipa: '/aɪ kəmˈpliːtli əˈɡriː wɪð juː/',
            exampleDialogue: 'Right? I knew you would see it the same way.',
            wordOrderChunks: ['I', 'completely agree', 'with', 'you.'],
          },
          de: {
            phrase: 'Ich stimme dir völlig zu.',
            clozeSentence: 'Ich stimme dir in diesem Punkt völlig ___.',
            clozeAnswer: 'zu',
            ipa: '/ɪç ˈʃtɪmə diːɐ̯ ˈfœlɪç tsuː/',
            exampleDialogue: 'Schön, dass wir das genauso sehen.',
            wordOrderChunks: ['Ich', 'stimme dir', 'völlig', 'zu.'],
          },
          es: {
            phrase: 'Estoy totalmente de acuerdo contigo.',
            clozeSentence: '___ totalmente de acuerdo contigo.',
            clozeAnswer: 'Estoy',
            ipa: '/esˈtoi totalˈmente de aˈkweɾðo konˈtiɣo/',
            exampleDialogue: '¡Qué bien que pensemos igual sobre esto!',
            wordOrderChunks: ['Estoy', 'totalmente', 'de acuerdo', 'contigo.'],
          },
        },
      },
      {
        id: 'daily_used_to',
        moduleId: 'daily_fluency',
        cefr: 'B1',
        turkishMeaning: 'Erken kalkmaya alışığım.',
        turkishTrapTr:
          'Türkçedeki "-meye" eki yüzünden "I am used to wake up" hatası yapılır. "be used to" kalıbında "to" edattır ve ardından isim veya "-ing" fiil gelir ("waking up"). Almancada "daran gewöhnt sein" + "zu", İspanyolcada "estar acostumbrado a" + mastar kullanılır.',
        contextTagTr: 'Rutin & Alışkanlık',
        langs: {
          en: {
            phrase: "I'm used to waking up early.",
            clozeSentence: "I'm used to ___ up early for work now.",
            clozeAnswer: 'waking',
            ipa: '/aɪm ˈjuːst tə ˈweɪkɪŋ ʌp ˈɜːrli/',
            exampleDialogue: 'Lucky you! I still need two coffees before nine.',
            wordOrderChunks: ["I'm", 'used to', 'waking up', 'early.'],
          },
          de: {
            phrase: 'Ich bin daran gewöhnt, früh aufzustehen.',
            clozeSentence: 'Ich bin ___ gewöhnt, jeden Tag früh aufzustehen.',
            clozeAnswer: 'daran',
            ipa: '/ɪç bɪn daˈʁan ɡəˈvøːnt fʁyː ˈaʊ̯ftsuʃteːən/',
            exampleDialogue: 'Das ist im Berufsleben wirklich ein großer Vorteil.',
            wordOrderChunks: ['Ich bin', 'daran gewöhnt,', 'früh', 'aufzustehen.'],
          },
          es: {
            phrase: 'Estoy acostumbrado a levantarme temprano.',
            clozeSentence: 'Ya estoy acostumbrado ___ levantarme temprano.',
            clozeAnswer: 'a',
            ipa: '/esˈtoi akostumˈbɾaðo a leβanˈtaɾme temˈpɾano/',
            exampleDialogue: 'Pues qué suerte, yo sigo peleando con el despertador.',
            wordOrderChunks: ['Estoy', 'acostumbrado a', 'levantarme', 'temprano.'],
          },
        },
      },
      {
        id: 'daily_since_for',
        moduleId: 'daily_fluency',
        cefr: 'B1',
        turkishMeaning: 'Üç yıldır burada yaşıyorum.',
        turkishTrapTr:
          'Türkçede "3 yıldır" için geniş/şimdiki zaman kullanılır ama İngilizcede "I live here for 3 years" yanlıştır: başlangıç noktası "since", süre "for" ile ve Present Perfect ("have lived") kurulur. Almanca ise devam eden sürede şimdiki zaman + "seit" kullanır; İspanyolcada "desde hace" kalıbı tercih edilir.',
        contextTagTr: 'Zaman & Süre',
        langs: {
          en: {
            phrase: "I've lived here for three years.",
            clozeSentence: "I've lived in this neighborhood ___ three years.",
            clozeAnswer: 'for',
            ipa: '/aɪv lɪvd hɪr fɔːr θriː jɪrz/',
            exampleDialogue: 'Oh nice, then you must know all the best cafés around here!',
            wordOrderChunks: ["I've lived", 'here', 'for', 'three years.'],
          },
          de: {
            phrase: 'Ich wohne seit drei Jahren hier.',
            clozeSentence: 'Ich wohne ___ drei Jahren in diesem Viertel.',
            clozeAnswer: 'seit',
            ipa: '/ɪç ˈvoːnə zaɪ̯t dʁaɪ̯ ˈjaːʁən hiːɐ̯/',
            exampleDialogue: 'Dann kennst du hier bestimmt schon jede Ecke.',
            wordOrderChunks: ['Ich', 'wohne', 'seit drei Jahren', 'hier.'],
          },
          es: {
            phrase: 'Vivo aquí desde hace tres años.',
            clozeSentence: 'Vivo en este barrio ___ hace tres años.',
            clozeAnswer: 'desde',
            ipa: '/ˈbiβo aˈki ˈdezðe ˈaθe tɾes ˈaɲos/',
            exampleDialogue: 'Entonces ya conoces los mejores sitios del barrio.',
            wordOrderChunks: ['Vivo', 'aquí', 'desde hace', 'tres años.'],
          },
        },
      },
      {
        id: 'daily_actually',
        moduleId: 'daily_fluency',
        cefr: 'A2',
        turkishMeaning: 'Aslında beklediğimden daha kolay.',
        turkishTrapTr:
          '"Actually" sahte arkadaştır (false friend): Türkçedeki "aktüel = şu anki" değil, "aslında / işin doğrusu" demektir ("şu anda" için "currently"). Almancada "eigentlich" ("aslında") ile "aktuell" ("güncel"), İspanyolcada "en realidad" ile "actualmente" birbirine karıştırılmamalıdır.',
        contextTagTr: 'Düzeltme & Vurgu',
        langs: {
          en: {
            phrase: "Actually, it's easier than I expected.",
            clozeSentence: '___, the new workflow is easier than I expected.',
            clozeAnswer: 'Actually',
            ipa: '/ˈæktʃuəli ɪts ˈiːziər ðən aɪ ɪkˈspektɪd/',
            exampleDialogue: 'Really? That takes a huge weight off my shoulders.',
            wordOrderChunks: ['Actually,', "it's easier", 'than', 'I expected.'],
          },
          de: {
            phrase: 'Eigentlich ist es einfacher, als ich dachte.',
            clozeSentence: '___ ist die neue Aufgabe viel einfacher, als ich dachte.',
            clozeAnswer: 'Eigentlich',
            ipa: '/ˈaɪ̯ɡn̩tlɪç ɪst ɛs ˈaɪ̯nfaxɐ als ɪç ˈdaxtə/',
            exampleDialogue: 'Das beruhigt mich wirklich sehr.',
            wordOrderChunks: ['Eigentlich', 'ist es', 'einfacher,', 'als ich dachte.'],
          },
          es: {
            phrase: 'En realidad, es más fácil de lo que esperaba.',
            clozeSentence: '___, este proceso es más fácil de lo que esperaba.',
            clozeAnswer: 'En realidad',
            ipa: '/en realiˈðað es mas ˈfaθil de lo ke espeˈɾaβa/',
            exampleDialogue: 'Me alegra oír eso, pensaba que llevaría horas.',
            wordOrderChunks: ['En realidad,', 'es más fácil', 'de lo que', 'esperaba.'],
          },
        },
      },
      {
        id: 'daily_depend_on',
        moduleId: 'daily_fluency',
        cefr: 'B1',
        turkishMeaning: 'Bu gerçekten programıma bağlı.',
        turkishTrapTr:
          'Türkçede "programıma bağlı" (-e yönelme) olduğu için "depend to" deme tuzağı çok yaygındır! İngilizcede daima "depend on", Almancada "abhängen von" (+ Dativ), İspanyolcada ise "depender de" kullanılır.',
        contextTagTr: 'Planlama',
        langs: {
          en: {
            phrase: 'It really depends on my schedule.',
            clozeSentence: 'Whether I can join really depends ___ my schedule.',
            clozeAnswer: 'on',
            ipa: '/ɪt ˈrɪəli dɪˈpendz ɑːn maɪ ˈskedʒuːl/',
            exampleDialogue: 'No worries at all, just text me once you know.',
            wordOrderChunks: ['It really', 'depends on', 'my', 'schedule.'],
          },
          de: {
            phrase: 'Das hängt ganz von meinem Zeitplan ab.',
            clozeSentence: 'Ob ich mitkomme, hängt ganz ___ meinem Zeitplan ab.',
            clozeAnswer: 'von',
            ipa: '/das hɛŋt ɡants fɔn ˈmaɪ̯nəm ˈtsaɪ̯tplaːn ap/',
            exampleDialogue: 'Kein Problem, sag mir einfach morgen Bescheid.',
            wordOrderChunks: ['Das hängt', 'ganz von', 'meinem Zeitplan', 'ab.'],
          },
          es: {
            phrase: 'Eso depende totalmente de mi horario.',
            clozeSentence: 'Ir el viernes depende totalmente ___ mi horario.',
            clozeAnswer: 'de',
            ipa: '/ˈeso deˈpende totalˈmente de mi oˈɾaɾjo/',
            exampleDialogue: 'Sin problema, avísame en cuanto te organices.',
            wordOrderChunks: ['Eso', 'depende', 'totalmente de', 'mi horario.'],
          },
        },
      },
      {
        id: 'daily_running_late',
        moduleId: 'daily_fluency',
        cefr: 'A2',
        turkishMeaning: 'Kusura bakma, biraz gecikiyorum.',
        turkishTrapTr:
          'Türkçedeki "geç kalıyorum" birebir "I am staying late" diye çevrilirse "mesaiye/gece geçe kalıyorum" anlamı çıkar! Doğal deyimler: EN "running a bit late", DE "etwas spät dran sein", ES "llegar un poco tarde".',
        contextTagTr: 'Zamanlama',
        langs: {
          en: {
            phrase: "Sorry, I'm running a bit late.",
            clozeSentence: "Sorry to keep you waiting, I'm ___ a bit late.",
            clozeAnswer: 'running',
            ipa: '/ˈsɑːri aɪm ˈrʌnɪŋ ə bɪt leɪt/',
            exampleDialogue: "All good! I just grabbed a table by the door.",
            wordOrderChunks: ['Sorry,', "I'm", 'running', 'a bit late.'],
          },
          de: {
            phrase: 'Tut mir leid, ich bin etwas spät dran.',
            clozeSentence: 'Tut mir leid, wegen des Verkehrs bin ich etwas spät ___.',
            clozeAnswer: 'dran',
            ipa: '/tuːt miːɐ̯ laɪ̯t ɪç bɪn ˈɛtvas ʃpɛːt dʁan/',
            exampleDialogue: 'Kein Stress, ich warte schon gemütlich drinnen.',
            wordOrderChunks: ['Tut mir leid,', 'ich bin', 'etwas spät', 'dran.'],
          },
          es: {
            phrase: 'Perdona, llego un poco tarde.',
            clozeSentence: 'Perdona por el retraso, ___ un poco tarde.',
            clozeAnswer: 'llego',
            ipa: '/peɾˈðona ˈʎeɣo um ˈpoko ˈtaɾðe/',
            exampleDialogue: 'No te preocupes, acabo de pedir un agua.',
            wordOrderChunks: ['Perdona,', 'llego', 'un poco', 'tarde.'],
          },
        },
      },
      {
        id: 'daily_makes_sense',
        moduleId: 'daily_fluency',
        cefr: 'A2',
        turkishMeaning: 'Bu çok mantıklı geliyor.',
        turkishTrapTr:
          'Türkçedeki "mantıklı geliyor" kalıbı "it comes logical" olarak çevrilmez. İngilizcede "make sense", Almancada "Sinn ergeben" (veya günlük dilde "Sinn machen"), İspanyolcada ise "tener sentido" ("tener" fiiliyle, "ser" ile değil) kullanılır.',
        contextTagTr: 'Onaylama',
        langs: {
          en: {
            phrase: 'That makes a lot of sense.',
            clozeSentence: 'Now that you explain it, that ___ a lot of sense.',
            clozeAnswer: 'makes',
            ipa: '/ðæt meɪks ə lɑːt əv sens/',
            exampleDialogue: 'Glad to hear it — it took me a while to see it too.',
            wordOrderChunks: ['That', 'makes', 'a lot of', 'sense.'],
          },
          de: {
            phrase: 'Das ergibt absolut Sinn.',
            clozeSentence: 'Wenn man es so betrachtet, ___ das absolut Sinn.',
            clozeAnswer: 'ergibt',
            ipa: '/das ɛɐ̯ˈɡiːpt abzoˈluːt zɪn/',
            exampleDialogue: 'Genau, plötzlich passt alles zusammen.',
            wordOrderChunks: ['Das', 'ergibt', 'absolut', 'Sinn.'],
          },
          es: {
            phrase: 'Eso tiene mucho sentido.',
            clozeSentence: 'Tal como lo planteas, eso ___ mucho sentido.',
            clozeAnswer: 'tiene',
            ipa: '/ˈeso ˈtjene ˈmutʃo senˈtiðo/',
            exampleDialogue: 'Claro, así evitamos perder tiempo luego.',
            wordOrderChunks: ['Eso', 'tiene', 'mucho', 'sentido.'],
          },
        },
      },
      {
        id: 'daily_looking_forward',
        moduleId: 'daily_fluency',
        cefr: 'B1',
        turkishMeaning: 'Seni görmeyi dört gözle bekliyorum.',
        turkishTrapTr:
          '"Look forward to" içindeki "to" bir edattır, mastar eki değildir; bu yüzden arkasından gelen fiil mutlaka "-ing" alır ("to seeing you", "to see" değil!). Almancada "sich freuen auf" (+ Akkusativ), İspanyolcada "tener ganas de" + mastar kullanılır.',
        contextTagTr: 'Buluşma',
        langs: {
          en: {
            phrase: "I'm looking forward to seeing you.",
            clozeSentence: "I'm really looking forward to ___ you this weekend.",
            clozeAnswer: 'seeing',
            ipa: '/aɪm ˈlʊkɪŋ ˈfɔːrwərd tə ˈsiːɪŋ juː/',
            exampleDialogue: 'Same here! Let me know when you land.',
            wordOrderChunks: ["I'm", 'looking forward', 'to seeing', 'you.'],
          },
          de: {
            phrase: 'Ich freue mich darauf, dich zu sehen.',
            clozeSentence: 'Ich freue mich sehr ___, dich bald wiederzusehen.',
            clozeAnswer: 'darauf',
            ipa: '/ɪç ˈfʁɔɪ̯ə mɪç daˈʁaʊ̯f dɪç tsuː ˈzeːən/',
            exampleDialogue: 'Ich mich auch, wir haben so viel zu bereden.',
            wordOrderChunks: ['Ich', 'freue mich', 'darauf,', 'dich zu sehen.'],
          },
          es: {
            phrase: 'Tengo muchas ganas de verte.',
            clozeSentence: 'Tengo muchas ___ de verte este fin de semana.',
            clozeAnswer: 'ganas',
            ipa: '/ˈteŋɡo ˈmutʃas ˈɣanas de ˈβeɾte/',
            exampleDialogue: '¡Y yo a ti! Hace demasiado que no charlamos.',
            wordOrderChunks: ['Tengo', 'muchas ganas', 'de', 'verte.'],
          },
        },
      },
      {
        id: 'daily_explain_to_me',
        moduleId: 'daily_fluency',
        cefr: 'A2',
        turkishMeaning: 'Bunu bana kısaca açıklayabilir misin?',
        turkishTrapTr:
          'Türkçedeki "bana açıkla" yüzünden İngilizcede "explain me" demek klasik bir hatadır; "explain" doğrudan kişi almaz, "explain [something] to [someone]" ister. Almanca Dativ zamiri fiilden hemen sonra ("mir das") koyar; İspanyolcada "me lo" fiilin önünde birleşir.',
        contextTagTr: 'Netleştirme',
        langs: {
          en: {
            phrase: 'Could you explain that to me briefly?',
            clozeSentence: 'Could you explain this part ___ me one more time?',
            clozeAnswer: 'to',
            ipa: '/kʊd juː ɪkˈspleɪn ðæt tə miː ˈbriːfli/',
            exampleDialogue: 'Sure, let me walk you through the main idea.',
            wordOrderChunks: ['Could you', 'explain that', 'to me', 'briefly?'],
          },
          de: {
            phrase: 'Kannst du mir das kurz erklären?',
            clozeSentence: 'Kannst du ___ das bitte noch einmal kurz erklären?',
            clozeAnswer: 'mir',
            ipa: '/kanst duː miːɐ̯ das kʊʁts ɛɐ̯ˈklɛːʁən/',
            exampleDialogue: 'Klar, pass auf, es geht im Grunde darum...',
            wordOrderChunks: ['Kannst du', 'mir das', 'kurz', 'erklären?'],
          },
          es: {
            phrase: '¿Me lo puedes explicar brevemente?',
            clozeSentence: '¿___ lo puedes explicar con un ejemplo sencillo?',
            clozeAnswer: 'Me',
            ipa: '/me lo ˈpweðes ekspliˈkaɾ bɾeβeˈmente/',
            exampleDialogue: 'Por supuesto, te lo resumo en dos minutos.',
            wordOrderChunks: ['¿Me lo', 'puedes', 'explicar', 'brevemente?'],
          },
        },
      },
      {
        id: 'daily_sounds_good',
        moduleId: 'daily_fluency',
        cefr: 'A2',
        turkishMeaning: 'Kulağa harika geliyor, öyle yapalım.',
        turkishTrapTr:
          'Türkçedeki "kulağa ... geliyor" için "comes to my ear" çevirisi yapılmaz! İngilizcede duyu fiili "sound" ardından zarf değil sıfat alır ("sounds great", "sounds well" değil). Almancada "klingt", İspanyolcada "suena" aynı işlevi görür.',
        contextTagTr: 'Karar & Uyum',
        langs: {
          en: {
            phrase: "That sounds great, let's do it.",
            clozeSentence: "Friday at six ___ great, let's book it.",
            clozeAnswer: 'sounds',
            ipa: '/ðæt saʊndz ɡreɪt lets duː ɪt/',
            exampleDialogue: 'Awesome, I will send you the calendar invite now.',
            wordOrderChunks: ['That', 'sounds great,', "let's", 'do it.'],
          },
          de: {
            phrase: 'Das klingt super, machen wir so.',
            clozeSentence: 'Das ___ nach einem guten Plan, machen wir so.',
            clozeAnswer: 'klingt',
            ipa: '/das klɪŋt ˈzuːpɐ ˈmaxn̩ viːɐ̯ zoː/',
            exampleDialogue: 'Perfekt, dann sehen wir uns um sechs.',
            wordOrderChunks: ['Das', 'klingt super,', 'machen wir', 'so.'],
          },
          es: {
            phrase: 'Suena genial, hagámoslo así.',
            clozeSentence: 'El plan del viernes ___ genial, hagámoslo así.',
            clozeAnswer: 'suena',
            ipa: '/ˈswena xeˈnjal aˈɣamoslo aˈsi/',
            exampleDialogue: 'Estupendo, entonces quedamos a esa hora.',
            wordOrderChunks: ['Suena', 'genial,', 'hagámoslo', 'así.'],
          },
        },
      },
    ],
  },
  {
    id: 'work_interview',
    order: 2,
    titleTr: 'İş Dünyası, Toplantı & Mülakat',
    subtitleTr: 'Profesyonel sunumlarda, mülakatlarda ve e-postalarda ikna edici ol',
    icon: '💼',
    cefrRange: 'B1–B2',
    accentHex: '#38bdf8',
    items: [
      {
        id: 'work_make_decision',
        moduleId: 'work_interview',
        cefr: 'B1',
        turkishMeaning: 'Yakında bir karar vermemiz gerekiyor.',
        turkishTrapTr:
          'Türkçede "karar vermek" dendiği için İngilizcede "give a decision" deme tuzağı çok sıktır! Doğal eşdizimlilik: EN "make a decision", DE "eine Entscheidung treffen" ("dar/geben" değil), ES "tomar una decisión" ("tomar", "dar" değil).',
        contextTagTr: 'Toplantı',
        langs: {
          en: {
            phrase: 'We need to make a decision soon.',
            clozeSentence: 'We need to ___ a final decision before Friday.',
            clozeAnswer: 'make',
            ipa: '/wiː niːd tə meɪk ə dɪˈsɪʒən suːn/',
            exampleDialogue: 'Agreed. Let us review the final figures at noon.',
            wordOrderChunks: ['We need', 'to make', 'a decision', 'soon.'],
          },
          de: {
            phrase: 'Wir müssen bald eine Entscheidung treffen.',
            clozeSentence: 'Wir müssen bis morgen eine klare Entscheidung ___.',
            clozeAnswer: 'treffen',
            ipa: '/viːɐ̯ ˈmʏsn̩ balt ˈaɪ̯nə ɛntˈʃaɪ̯dʊŋ ˈtʁɛfn̩/',
            exampleDialogue: 'Einverstanden, ich bereite die Daten bis Mittag vor.',
            wordOrderChunks: ['Wir müssen', 'bald', 'eine Entscheidung', 'treffen.'],
          },
          es: {
            phrase: 'Tenemos que tomar una decisión pronto.',
            clozeSentence: 'Tenemos que ___ una decisión antes del cierre.',
            clozeAnswer: 'tomar',
            ipa: '/teˈnemos ke toˈmaɾ ˈuna deθiˈsjon ˈpɾonto/',
            exampleDialogue: 'De acuerdo, revisemos las cifras esta misma tarde.',
            wordOrderChunks: ['Tenemos que', 'tomar', 'una decisión', 'pronto.'],
          },
        },
      },
      {
        id: 'work_career_article',
        moduleId: 'work_interview',
        cefr: 'B1',
        turkishMeaning: 'Kıdemli proje yöneticisiyim.',
        turkishTrapTr:
          'Türkçe meslek adlarında "bir" artikeli kullanmaz ("Mühendisim"). Ancak İngilizce tekil mesleklerin önüne MUTLAKA "a/an" koyar ("I am a senior project manager"). Buna karşın Almanca ("Ich bin Projektmanager") ve İspanyolca ("Soy jefe de proyectos") sıfatsız meslekte artikel düşürür!',
        contextTagTr: 'Mülakat Tanıtım',
        langs: {
          en: {
            phrase: "I'm a senior project manager.",
            clozeSentence: 'I currently work as ___ senior project manager.',
            clozeAnswer: 'a',
            ipa: '/aɪm ə ˈsiːnjər ˈprɑːdʒekt ˈmænɪdʒər/',
            exampleDialogue: 'Great, tell me about the largest team you have led.',
            wordOrderChunks: ["I'm", 'a senior', 'project', 'manager.'],
          },
          de: {
            phrase: 'Ich bin leitender Projektmanager.',
            clozeSentence: 'Seit vier Jahren ___ ich als Projektmanager tätig.',
            clozeAnswer: 'bin',
            ipa: '/ɪç bɪn ˈlaɪ̯tn̩dɐ pʁoˈjɛktˌmɛnədʒɐ/',
            exampleDialogue: 'Sehr interessant, wie groß war Ihr letztes Team?',
            wordOrderChunks: ['Ich', 'bin', 'leitender', 'Projektmanager.'],
          },
          es: {
            phrase: 'Soy jefe de proyectos sénior.',
            clozeSentence: '___ jefe de proyectos desde hace cinco años.',
            clozeAnswer: 'Soy',
            ipa: '/soi ˈxefe de pɾoˈjektos ˈsenjoɾ/',
            exampleDialogue: 'Estupendo, cuénteme cuál fue su mayor reto.',
            wordOrderChunks: ['Soy', 'jefe de', 'proyectos', 'sénior.'],
          },
        },
      },
      {
        id: 'work_get_back',
        moduleId: 'work_interview',
        cefr: 'B1',
        turkishMeaning: 'Kontrol edip size dönüş yapacağım.',
        turkishTrapTr:
          'Türkçedeki "size döneceğim" kelimesi kelimesine "I will return to you" diye çevrilirse fiziksel olarak geri dönmek gibi algılanır! İş dilinde EN "get back to you", DE resmi "mich bei Ihnen melden", ES "volver a ponerme en contacto con usted" kullanılır.',
        contextTagTr: 'Müşteri & Ekip',
        langs: {
          en: {
            phrase: "I'll check and get back to you.",
            clozeSentence: 'Let me check with finance and ___ back to you.',
            clozeAnswer: 'get',
            ipa: '/aɪl tʃek ænd ɡet bæk tə juː/',
            exampleDialogue: 'Thanks, tomorrow afternoon works fine for me.',
            wordOrderChunks: ["I'll check", 'and', 'get back', 'to you.'],
          },
          de: {
            phrase: 'Ich prüfe das und melde mich bei Ihnen.',
            clozeSentence: 'Ich kläre die Frage und ___ mich heute Nachmittag bei Ihnen.',
            clozeAnswer: 'melde',
            ipa: '/ɪç ˈpʁyːfə das ʊnt ˈmɛldə mɪç baɪ̯ ˈiːnən/',
            exampleDialogue: 'Vielen Dank, das reicht mir völlig aus.',
            wordOrderChunks: ['Ich prüfe das', 'und', 'melde mich', 'bei Ihnen.'],
          },
          es: {
            phrase: 'Lo confirmo y me pongo en contacto con usted.',
            clozeSentence: 'Lo reviso ahora y me pongo en ___ con usted.',
            clozeAnswer: 'contacto',
            ipa: '/lo konˈfiɾmo i me ˈpoŋɡo en konˈtakto kon usˈteð/',
            exampleDialogue: 'Perfecto, quedo a la espera de su correo.',
            wordOrderChunks: ['Lo confirmo', 'y me pongo', 'en contacto', 'con usted.'],
          },
        },
      },
      {
        id: 'work_discuss_no_about',
        moduleId: 'work_interview',
        cefr: 'B1',
        turkishMeaning: 'Önce bütçeyi görüşelim.',
        turkishTrapTr:
          'Türkçede "bütçe hakkında konuşalım" etkisiyle İngilizcede "discuss about the budget" hatası çok sık yapılır! "discuss" doğrudan nesne alır, asla "about" almaz. Almanca ("über ... sprechen") ve İspanyolca ("hablar de...") ise edat ister.',
        contextTagTr: 'Toplantı Gündemi',
        langs: {
          en: {
            phrase: "Let's discuss the budget first.",
            clozeSentence: 'We should ___ the quarterly budget before hiring.',
            clozeAnswer: 'discuss',
            ipa: '/lets dɪˈskʌs ðə ˈbʌdʒɪt fɜːrst/',
            exampleDialogue: 'Sounds smart — I have the spreadsheet open right here.',
            wordOrderChunks: ["Let's", 'discuss', 'the budget', 'first.'],
          },
          de: {
            phrase: 'Lassen Sie uns zuerst über das Budget sprechen.',
            clozeSentence: 'Wir sollten vor der Freigabe ___ das Budget sprechen.',
            clozeAnswer: 'über',
            ipa: '/ˈlasn̩ ziː ʊns tsuˈeːɐ̯st ˈyːbɐ das byˈdʒeː ˈʃpʁɛçn̩/',
            exampleDialogue: 'Gute Idee, ich teile gleich meine Übersicht.',
            wordOrderChunks: ['Lassen Sie uns', 'zuerst', 'über das Budget', 'sprechen.'],
          },
          es: {
            phrase: 'Hablemos primero del presupuesto.',
            clozeSentence: 'Deberíamos hablar primero ___ presupuesto anual.',
            clozeAnswer: 'del',
            ipa: '/aˈβlemos pɾiˈmeɾo del pɾesuˈpwesto/',
            exampleDialogue: 'Buena idea, así sabremos nuestro margen real.',
            wordOrderChunks: ['Hablemos', 'primero', 'del', 'presupuesto.'],
          },
        },
      },
      {
        id: 'work_reschedule',
        moduleId: 'work_interview',
        cefr: 'B1',
        turkishMeaning: 'Toplantıyı yarına erteleyebilir miyiz?',
        turkishTrapTr:
          'Türkçedeki "yarına almak" için "take to tomorrow" veya "delay the meeting" doğal değildir. Doğru iş kalıbı: EN "reschedule ... for tomorrow", DE "verschieben auf morgen", ES "reprogramar ... para mañana".',
        contextTagTr: 'Takvim Yönetimi',
        langs: {
          en: {
            phrase: 'Could we reschedule the meeting for tomorrow?',
            clozeSentence: 'Would it be possible to ___ our call for tomorrow?',
            clozeAnswer: 'reschedule',
            ipa: '/kʊd wiː ˌriːˈskedʒuːl ðə ˈmiːtɪŋ fɔːr təˈmɑːroʊ/',
            exampleDialogue: 'Sure, does 10 a.m. work on your calendar?',
            wordOrderChunks: ['Could we', 'reschedule', 'the meeting', 'for tomorrow?'],
          },
          de: {
            phrase: 'Könnten wir das Treffen auf morgen verschieben?',
            clozeSentence: 'Könnten wir unseren Termin ___ morgen Vormittag verschieben?',
            clozeAnswer: 'auf',
            ipa: '/ˈkœntn̩ viːɐ̯ das ˈtʁɛfn̩ aʊ̯f ˈmɔʁɡn̩ fɛɐ̯ˈʃiːbn̩/',
            exampleDialogue: 'Ja, morgen um zehn Uhr passt es mir sogar besser.',
            wordOrderChunks: ['Könnten wir', 'das Treffen', 'auf morgen', 'verschieben?'],
          },
          es: {
            phrase: '¿Podríamos reprogramar la reunión para mañana?',
            clozeSentence: '¿Podríamos reprogramar la reunión ___ mañana a las diez?',
            clozeAnswer: 'para',
            ipa: '/poˈðɾiamos repɾoɣɾaˈmaɾ la reuˈnjon ˈpaɾa maˈɲana/',
            exampleDialogue: 'Sin problema, te mando la nueva invitación ahora.',
            wordOrderChunks: ['¿Podríamos', 'reprogramar', 'la reunión', 'para mañana?'],
          },
        },
      },
      {
        id: 'work_strengths',
        moduleId: 'work_interview',
        cefr: 'B2',
        turkishMeaning: 'En güçlü yanım baskı altında sakin kalmaktır.',
        turkishTrapTr:
          'Türkçedeki "-maktır" isim-fiili İngilizcede "is stay" diye yalın yazılamaz; özne/yüklem konumunda gerund ("staying calm") ister. Almancada mastar yan cümlesi ", ... zu bleiben", İspanyolcada doğrudan mastar ("es mantener") kullanılır.',
        contextTagTr: 'Mülakat Sorusu',
        langs: {
          en: {
            phrase: 'My biggest strength is staying calm under pressure.',
            clozeSentence: 'My biggest strength is ___ calm when deadlines shift.',
            clozeAnswer: 'staying',
            ipa: '/maɪ ˈbɪɡəst streŋθ ɪz ˈsteɪɪŋ kɑːm ˈʌndər ˈpreʃər/',
            exampleDialogue: 'That is crucial here, especially around product launches.',
            wordOrderChunks: ['My biggest strength', 'is', 'staying calm', 'under pressure.'],
          },
          de: {
            phrase: 'Meine größte Stärke ist es, ruhig zu bleiben.',
            clozeSentence: 'Meine Stärke ist es, auch unter Zeitdruck ruhig ___ bleiben.',
            clozeAnswer: 'zu',
            ipa: '/ˈmaɪ̯nə ˈɡʁøːstə ˈʃtɛʁkə ɪst ɛs ˈʁuːɪç tsuː ˈblaɪ̯bn̩/',
            exampleDialogue: 'Genau diese Gelassenheit brauchen wir im Projektalltag.',
            wordOrderChunks: ['Meine größte Stärke', 'ist es,', 'ruhig', 'zu bleiben.'],
          },
          es: {
            phrase: 'Mi mayor fortaleza es mantener la calma bajo presión.',
            clozeSentence: 'Mi mayor fortaleza es ___ la calma en momentos críticos.',
            clozeAnswer: 'mantener',
            ipa: '/mi maˈjoɾ foɾtaˈleθa es manteˈneɾ la ˈkalma ˈbaxo pɾeˈsjon/',
            exampleDialogue: 'Eso se valora muchísimo cuando hay entregas urgentes.',
            wordOrderChunks: ['Mi mayor fortaleza', 'es mantener', 'la calma', 'bajo presión.'],
          },
        },
      },
      {
        id: 'work_salary_range',
        moduleId: 'work_interview',
        cefr: 'B2',
        turkishMeaning: 'Bu pozisyon için maaş aralığı nedir?',
        turkishTrapTr:
          'Mülakatta "How much money do you give?" Türkçeden çevrilmiş gibi sert ve amatör durur. Profesyonel kalıplar: EN "salary range for this role", DE "Gehaltsspanne für diese Stelle", ES "banda salarial para este puesto".',
        contextTagTr: 'Ücret Görüşmesi',
        langs: {
          en: {
            phrase: 'What is the salary range for this role?',
            clozeSentence: 'Could you share the budgeted salary ___ for this role?',
            clozeAnswer: 'range',
            ipa: '/wʌt ɪz ðə ˈsæləri reɪndʒ fɔːr ðɪs roʊl/',
            exampleDialogue: 'Of course, the range is between seventy and eighty-five.',
            wordOrderChunks: ['What is', 'the salary range', 'for', 'this role?'],
          },
          de: {
            phrase: 'Wie hoch ist die Gehaltsspanne für diese Stelle?',
            clozeSentence: 'Wie hoch ist die vorgesehene ___ für diese Position?',
            clozeAnswer: 'Gehaltsspanne',
            ipa: '/viː hoːx ɪst diː ɡəˈhaltsˌʃpanə fyːɐ̯ ˈdiːzə ˈʃtɛlə/',
            exampleDialogue: 'Für diese Rolle liegt das Budget bei rund achtzigtausend.',
            wordOrderChunks: ['Wie hoch', 'ist die', 'Gehaltsspanne', 'für diese Stelle?'],
          },
          es: {
            phrase: '¿Cuál es la banda salarial para este puesto?',
            clozeSentence: '¿Cuál es la banda ___ prevista para este puesto?',
            clozeAnswer: 'salarial',
            ipa: '/kwal es la ˈbanda salaˈɾjal ˈpaɾa ˈeste ˈpwesto/',
            exampleDialogue: 'El rango aprobado está entre cuarenta y cincuenta mil.',
            wordOrderChunks: ['¿Cuál es', 'la banda salarial', 'para', 'este puesto?'],
          },
        },
      },
      {
        id: 'work_on_same_page',
        moduleId: 'work_interview',
        cefr: 'B2',
        turkishMeaning: 'Aynı sayfada olduğumuzdan emin olalım.',
        turkishTrapTr:
          'Türkçedeki "aynı sayfadayız" için İngilizcede "in the same page" değil, yüzey/mecaz olarak "on the same page" kullanılır. Almancada "auf demselben Stand sein", İspanyolcada "estar en la misma sintonía" (aynı frekansta olmak) doğaldır.',
        contextTagTr: 'Hizalanma',
        langs: {
          en: {
            phrase: "Let's make sure we're on the same page.",
            clozeSentence: "Before we wrap up, let's make sure we're ___ the same page.",
            clozeAnswer: 'on',
            ipa: '/lets meɪk ʃʊr wɪr ɑːn ðə seɪm peɪdʒ/',
            exampleDialogue: 'Yes, let me quickly summarize the three action items.',
            wordOrderChunks: ["Let's make sure", "we're", 'on the', 'same page.'],
          },
          de: {
            phrase: 'Stellen wir sicher, dass wir auf demselben Stand sind.',
            clozeSentence: 'Prüfen wir kurz, ob wir alle auf demselben ___ sind.',
            clozeAnswer: 'Stand',
            ipa: '/ˈʃtɛlən viːɐ̯ ˈzɪçɐ das viːɐ̯ aʊ̯f deːmˈzɛlbn̩ ʃtant zɪnt/',
            exampleDialogue: 'Ja, ich fasse die nächsten Schritte kurz zusammen.',
            wordOrderChunks: ['Stellen wir sicher,', 'dass wir', 'auf demselben Stand', 'sind.'],
          },
          es: {
            phrase: 'Asegurémonos de que estamos en la misma sintonía.',
            clozeSentence: 'Antes de seguir, asegurémonos de que ___ en la misma sintonía.',
            clozeAnswer: 'estamos',
            ipa: '/aseɣuˈɾemonos de ke esˈtamos en la ˈmisma sintoˈnia/',
            exampleDialogue: 'Perfecto, repasemos los objetivos clave ahora.',
            wordOrderChunks: ['Asegurémonos', 'de que estamos', 'en la misma', 'sintonía.'],
          },
        },
      },
      {
        id: 'work_advice_uncountable',
        moduleId: 'work_interview',
        cefr: 'B1',
        turkishMeaning: 'Yapıcı geri bildiriminiz için teşekkürler.',
        turkishTrapTr:
          'Türkçede "geri bildirimleriniz / tavsiyeleriniz" çoğul yapılır; ancak İngilizcede "feedback", "advice" ve "information" SAYILAMAZ isimlerdir ("feedbacks" veya "a feedback" kesinlikle yanlıştır!). Almanca da "Feedback" kelimesini tekil tutar; İspanyolca ise "comentarios" ile çoğul yapabilir.',
        contextTagTr: 'Geribildirim',
        langs: {
          en: {
            phrase: 'Thank you for your constructive feedback.',
            clozeSentence: 'I really appreciate ___ constructive feedback on my draft.',
            clozeAnswer: 'your',
            ipa: '/θæŋk juː fɔːr jʊr kənˈstrʌktɪv ˈfiːdbæk/',
            exampleDialogue: 'You are welcome! The second version is already much sharper.',
            wordOrderChunks: ['Thank you', 'for your', 'constructive', 'feedback.'],
          },
          de: {
            phrase: 'Vielen Dank für Ihr konstruktives Feedback.',
            clozeSentence: 'Vielen Dank ___ Ihr offenes und konstruktives Feedback.',
            clozeAnswer: 'für',
            ipa: '/ˈfiːlən daŋk fyːɐ̯ iːɐ̯ kɔnstʁʊkˈtiːvəs ˈfiːtbɛk/',
            exampleDialogue: 'Sehr gerne, Ihre Überarbeitung gefällt mir schon gut.',
            wordOrderChunks: ['Vielen Dank', 'für Ihr', 'konstruktives', 'Feedback.'],
          },
          es: {
            phrase: 'Muchas gracias por sus comentarios constructivos.',
            clozeSentence: 'Muchas gracias por ___ valiosos comentarios sobre el informe.',
            clozeAnswer: 'sus',
            ipa: '/ˈmutʃas ˈɡɾaθjas poɾ sus komenˈtaɾjos konstɾukˈtiβos/',
            exampleDialogue: 'De nada, el documento ha mejorado mucho.',
            wordOrderChunks: ['Muchas gracias', 'por sus', 'comentarios', 'constructivos.'],
          },
        },
      },
      {
        id: 'work_follow_up',
        moduleId: 'work_interview',
        cefr: 'B2',
        turkishMeaning: 'Dünkü toplantımızın ardından takip ediyorum.',
        turkishTrapTr:
          'İş e-postalarında "After our meeting I write" yerine doğal takip fiili kullanılır: EN "follow up on", DE "anknüpfen an" (ayrılan "an" sona gider!), ES "en seguimiento a".',
        contextTagTr: 'İş E-postası',
        langs: {
          en: {
            phrase: "I'm following up on our meeting yesterday.",
            clozeSentence: "I'm following ___ on the timeline we discussed yesterday.",
            clozeAnswer: 'up',
            ipa: '/aɪm ˈfɑːloʊɪŋ ʌp ɑːn ˈaʊər ˈmiːtɪŋ ˈjestərdeɪ/',
            exampleDialogue: 'Thanks for the nudge! I just sent over the signed PDF.',
            wordOrderChunks: ["I'm", 'following up', 'on our meeting', 'yesterday.'],
          },
          de: {
            phrase: 'Ich knüpfe an unser gestriges Gespräch an.',
            clozeSentence: 'Hiermit knüpfe ich an unser gestriges Gespräch ___.',
            clozeAnswer: 'an',
            ipa: '/ɪç ˈknʏpfə an ˈʊnzɐ ˈɡɛstʁɪɡəs ɡəˈʃpʁɛːç an/',
            exampleDialogue: 'Danke für die Erinnerung, die Unterlagen kommen gleich.',
            wordOrderChunks: ['Ich knüpfe', 'an unser', 'gestriges Gespräch', 'an.'],
          },
          es: {
            phrase: 'Le escribo en seguimiento a nuestra reunión de ayer.',
            clozeSentence: 'Le escribo en ___ a la propuesta de ayer.',
            clozeAnswer: 'seguimiento',
            ipa: '/le esˈkɾiβo en seɣiˈmjento a ˈnwestɾa reuˈnjon de aˈjeɾ/',
            exampleDialogue: 'Gracias por escribir, justo estaba revisando el borrador.',
            wordOrderChunks: ['Le escribo', 'en seguimiento a', 'nuestra reunión', 'de ayer.'],
          },
        },
      },
    ],
  },
  {
    id: 'travel_world',
    order: 3,
    titleTr: 'Seyahat, Havalimanı & Konaklama',
    subtitleTr: 'Pasaporttan otele, rötar krizinden yol tarifine kadar güvenle hareket et',
    icon: '✈️',
    cefrRange: 'A2–B1',
    accentHex: '#f59e0b',
    items: [
      {
        id: 'travel_missed_flight',
        moduleId: 'travel_world',
        cefr: 'A2',
        turkishMeaning: 'Ne yazık ki aktarmalı uçuşumu kaçırdım.',
        turkishTrapTr:
          'Türkçede "uçağı kaçırdım" derken "escaped the flight" veya "lost the flight" çevirisi yanlıştır! Taşıt/randevu kaçırmak EN "miss", DE "verpassen" ("verlieren" değil), İspanyolcada ise "perder el vuelo"dur.',
        contextTagTr: 'Havalimanı Krizi',
        langs: {
          en: {
            phrase: 'Unfortunately, I missed my connecting flight.',
            clozeSentence: 'Because of the delay, I ___ my connecting flight.',
            clozeAnswer: 'missed',
            ipa: '/ʌnˈfɔːrtʃənətli aɪ mɪst maɪ kəˈnektɪŋ flaɪt/',
            exampleDialogue: 'Let me check the next available seat to Munich for you.',
            wordOrderChunks: ['Unfortunately,', 'I missed', 'my connecting', 'flight.'],
          },
          de: {
            phrase: 'Leider habe ich meinen Anschlussflug verpasst.',
            clozeSentence: 'Wegen der Verspätung habe ich meinen Anschlussflug ___.',
            clozeAnswer: 'verpasst',
            ipa: '/ˈlaɪ̯dɐ ˈhaːbə ɪç ˈmaɪ̯nən ˈanʃlʊsfluːk fɛɐ̯ˈpast/',
            exampleDialogue: 'Kein Problem, wir buchen Sie kostenlos auf die nächste Maschine um.',
            wordOrderChunks: ['Leider', 'habe ich', 'meinen Anschlussflug', 'verpasst.'],
          },
          es: {
            phrase: 'Por desgracia, perdí mi vuelo de conexión.',
            clozeSentence: 'Por el retraso, ___ mi vuelo de conexión a Madrid.',
            clozeAnswer: 'perdí',
            ipa: '/poɾ dezˈɣɾaθja peɾˈði mi ˈbwelo de konekˈsjon/',
            exampleDialogue: 'Pase por este mostrador para asignarle el siguiente vuelo.',
            wordOrderChunks: ['Por desgracia,', 'perdí', 'mi vuelo', 'de conexión.'],
          },
        },
      },
      {
        id: 'travel_embedded_question',
        moduleId: 'travel_world',
        cefr: 'B1',
        turkishMeaning: 'Biniş kapısının nerede olduğunu biliyor musunuz?',
        turkishTrapTr:
          'Dolaylı sorularda Türkçedeki soru dizilimi etkisiyle "Do you know where is the gate?" hatası çok yapılır! Doğrusu özne-fiil düz sıradadır: "where the boarding gate is". Almancada "wo ... ist" fiili en sona atar; İspanyolcada "está" konum bildirir.',
        contextTagTr: 'Terminal Yön',
        langs: {
          en: {
            phrase: 'Do you know where the boarding gate is?',
            clozeSentence: 'Excuse me, do you know where the boarding gate ___?',
            clozeAnswer: 'is',
            ipa: '/duː juː noʊ wer ðə ˈbɔːrdɪŋ ɡeɪt ɪz/',
            exampleDialogue: 'Yes, go straight past duty-free and turn left at B12.',
            wordOrderChunks: ['Do you know', 'where', 'the boarding gate', 'is?'],
          },
          de: {
            phrase: 'Wissen Sie, wo das Abfluggate ist?',
            clozeSentence: 'Entschuldigung, wissen Sie, wo das richtige Gate ___?',
            clozeAnswer: 'ist',
            ipa: '/ˈvɪsn̩ ziː voː das ˈapfluːkˌɡeɪ̯t ɪst/',
            exampleDialogue: 'Ja, gehen Sie nach der Sicherheitskontrolle direkt rechts.',
            wordOrderChunks: ['Wissen Sie,', 'wo', 'das Abfluggate', 'ist?'],
          },
          es: {
            phrase: '¿Sabe dónde está la puerta de embarque?',
            clozeSentence: 'Disculpe, ¿sabe dónde ___ la puerta de embarque?',
            clozeAnswer: 'está',
            ipa: '/ˈsaβe ˈdonde esˈta la ˈpweɾta de emˈbaɾke/',
            exampleDialogue: 'Sí, siga todo recto por el pasillo hasta la zona B.',
            wordOrderChunks: ['¿Sabe', 'dónde está', 'la puerta', 'de embarque?'],
          },
        },
      },
      {
        id: 'travel_luggage_uncountable',
        moduleId: 'travel_world',
        cefr: 'A2',
        turkishMeaning: 'Bagajım henüz gelmedi.',
        turkishTrapTr:
          'Türkçede "bavullarım" çoğul yapıldığı için İngilizcede "my luggages haven\'t arrived" demek yaygındır. "luggage" ve "baggage" sayılamaz, çoğul "-s" almaz ve tekil fiille ("hasn\'t") çekilir! Almanca "mein Gepäck" ve İspanyolca "mi equipaje" de aynı şekilde tekildir.',
        contextTagTr: 'Bagaj Teslim',
        langs: {
          en: {
            phrase: "My luggage hasn't arrived yet.",
            clozeSentence: "I waited by the belt, but my ___ hasn't arrived.",
            clozeAnswer: 'luggage',
            ipa: '/maɪ ˈlʌɡɪdʒ ˈhæznt əˈraɪvd jet/',
            exampleDialogue: 'Please show me your baggage claim tag so I can trace it.',
            wordOrderChunks: ['My luggage', "hasn't", 'arrived', 'yet.'],
          },
          de: {
            phrase: 'Mein Gepäck ist noch nicht angekommen.',
            clozeSentence: 'Mein ___ ist leider noch nicht auf dem Gepäckband.',
            clozeAnswer: 'Gepäck',
            ipa: '/maɪ̯n ɡəˈpɛk ɪst nɔx nɪçt ˈanɡəkɔmən/',
            exampleDialogue: 'Zeigen Sie mir bitte Ihren Gepäckabschnitt am Schalter.',
            wordOrderChunks: ['Mein Gepäck', 'ist', 'noch nicht', 'angekommen.'],
          },
          es: {
            phrase: 'Mi equipaje todavía no ha llegado.',
            clozeSentence: 'Mi ___ todavía no ha salido por la cinta cinco.',
            clozeAnswer: 'equipaje',
            ipa: '/mi ekiˈpaxe toðaˈβia no a ʎeˈɣaðo/',
            exampleDialogue: 'Rellene este parte de equipaje perdido, por favor.',
            wordOrderChunks: ['Mi equipaje', 'todavía', 'no ha', 'llegado.'],
          },
        },
      },
      {
        id: 'travel_check_in',
        moduleId: 'travel_world',
        cefr: 'A2',
        turkishMeaning: 'İki gecelik giriş yapmak istiyorum.',
        turkishTrapTr:
          'Türkçedeki "giriş yapmak" için "do entrance" denmez; otelde EN "check in", DE "einchecken", ES "hacer el registro" kullanılır. Ayrıca "iki geceliğine" derken "since two nights" değil "for two nights" ("für zwei Nächte" / "para dos noches") kullanılır.',
        contextTagTr: 'Otel Resepsiyon',
        langs: {
          en: {
            phrase: "I'd like to check in for two nights.",
            clozeSentence: "Hello, I have a booking and I'd like to ___ in.",
            clozeAnswer: 'check',
            ipa: '/aɪd laɪk tə tʃek ɪn fɔːr tuː naɪts/',
            exampleDialogue: 'Welcome! May I see your passport and a credit card, please?',
            wordOrderChunks: ["I'd like", 'to check in', 'for', 'two nights.'],
          },
          de: {
            phrase: 'Ich möchte für zwei Nächte einchecken.',
            clozeSentence: 'Guten Abend, ich möchte für zwei Nächte ___.',
            clozeAnswer: 'einchecken',
            ipa: '/ɪç ˈmœçtə fyːɐ̯ tsvaɪ̯ ˈnɛçtə ˈaɪ̯ntʃɛkn̩/',
            exampleDialogue: 'Herzlich willkommen! Darf ich kurz Ihren Ausweis sehen?',
            wordOrderChunks: ['Ich möchte', 'für', 'zwei Nächte', 'einchecken.'],
          },
          es: {
            phrase: 'Quisiera hacer el registro para dos noches.',
            clozeSentence: 'Hola, tengo reserva y quiero hacer el ___.',
            clozeAnswer: 'registro',
            ipa: '/kiˈsjeɾa aˈθeɾ el reˈxistɾo ˈpaɾa dos ˈnotʃes/',
            exampleDialogue: '¡Bienvenido! ¿Me facilita su pasaporte, por favor?',
            wordOrderChunks: ['Quisiera', 'hacer el registro', 'para', 'dos noches.'],
          },
        },
      },
      {
        id: 'travel_stay_purpose',
        moduleId: 'travel_world',
        cefr: 'B1',
        turkishMeaning: 'Beş günlüğüne iş için buradayım.',
        turkishTrapTr:
          'Pasaport kontrolünde "iş için" derken EN "for business" yerine kalıplaşmış "on business" kullanılır! Süre için de "since five days" değil "for five days". Almancada tek kelime zarf "geschäftlich", İspanyolcada neden bildiren "por trabajo" kullanılır.',
        contextTagTr: 'Pasaport Kontrolü',
        langs: {
          en: {
            phrase: "I'm here on business for five days.",
            clozeSentence: "I'm visiting London ___ business until Friday.",
            clozeAnswer: 'on',
            ipa: '/aɪm hɪr ɑːn ˈbɪznəs fɔːr faɪv deɪz/',
            exampleDialogue: 'Enjoy your stay, and here is your passport back.',
            wordOrderChunks: ["I'm here", 'on business', 'for', 'five days.'],
          },
          de: {
            phrase: 'Ich bin für fünf Tage geschäftlich hier.',
            clozeSentence: 'Ich bin diese Woche ___ in Frankfurt.',
            clozeAnswer: 'geschäftlich',
            ipa: '/ɪç bɪn fyːɐ̯ fʏnf ˈtaːɡə ɡəˈʃɛftlɪç hiːɐ̯/',
            exampleDialogue: 'Alles klar, guten Aufenthalt in Deutschland!',
            wordOrderChunks: ['Ich bin', 'für fünf Tage', 'geschäftlich', 'hier.'],
          },
          es: {
            phrase: 'Estoy aquí por trabajo durante cinco días.',
            clozeSentence: 'Estoy en Barcelona ___ trabajo hasta el viernes.',
            clozeAnswer: 'por',
            ipa: '/esˈtoi aˈki poɾ tɾaˈβaxo duˈɾante ˈθiŋko ˈðias/',
            exampleDialogue: 'Muy bien, que tenga una buena estancia.',
            wordOrderChunks: ['Estoy aquí', 'por trabajo', 'durante', 'cinco días.'],
          },
        },
      },
      {
        id: 'travel_arrive_at_in',
        moduleId: 'travel_world',
        cefr: 'A2',
        turkishMeaning: 'Havaalanına iki saat erken vardık.',
        turkishTrapTr:
          'Türkçedeki "-e varmak" yüzünden "arrive to the airport" deme tuzağı çok güçlüdür! İngilizcede ASLA "arrive to" olmaz: bina/durak için "arrive at", şehir/ülke için "arrive in" kullanılır. Almancada "am Flughafen" (Dativ), İspanyolcada ise "llegar al" ("a + el") kullanılır.',
        contextTagTr: 'Ulaşım Zamanı',
        langs: {
          en: {
            phrase: 'We arrived at the airport two hours early.',
            clozeSentence: 'Try to arrive ___ the airport at least two hours early.',
            clozeAnswer: 'at',
            ipa: '/wiː əˈraɪvd æt ði ˈerpɔːrt tuː ˈaʊərz ˈɜːrli/',
            exampleDialogue: 'Smart choice — security lines are huge today.',
            wordOrderChunks: ['We arrived', 'at the airport', 'two hours', 'early.'],
          },
          de: {
            phrase: 'Wir sind zwei Stunden vorher am Flughafen angekommen.',
            clozeSentence: 'Wir sind pünktlich ___ Flughafen angekommen.',
            clozeAnswer: 'am',
            ipa: '/viːɐ̯ zɪnt tsvaɪ̯ ˈʃtʊndn̩ ˈfoːɐ̯heːɐ̯ am ˈfluːkhaːfn̩ ˈanɡəkɔmən/',
            exampleDialogue: 'Perfekt, dann bleibt genug Zeit für einen Kaffee.',
            wordOrderChunks: ['Wir sind', 'zwei Stunden vorher', 'am Flughafen', 'angekommen.'],
          },
          es: {
            phrase: 'Llegamos al aeropuerto con dos horas de antelación.',
            clozeSentence: 'Siempre llegamos ___ aeropuerto dos horas antes.',
            clozeAnswer: 'al',
            ipa: '/ʎeˈɣamos al aeɾoˈpweɾto kon dos ˈoɾas de antelaˈθjon/',
            exampleDialogue: 'Hicisteis bien, hoy hay bastante cola en el control.',
            wordOrderChunks: ['Llegamos', 'al aeropuerto', 'con dos horas', 'de antelación.'],
          },
        },
      },
      {
        id: 'travel_quiet_room',
        moduleId: 'travel_world',
        cefr: 'B1',
        turkishMeaning: 'Üst katta sessiz bir oda alabilir miyim lütfen?',
        turkishTrapTr:
          'Türkçedeki "istiyorum / rica edebilir miyim" için İngilizcede "I want a quiet room" çok kaba duyulur; bunun yerine "Could I have..." kullanılır. Almancada sıfat çekimi nötr artikelde "-es" alır ("ein ruhiges Zimmer"). İspanyolcada sıfat çoğunlukla isimden sonra ("habitación tranquila") gelir.',
        contextTagTr: 'Otel Tercihi',
        langs: {
          en: {
            phrase: 'Could I have a quiet room upstairs, please?',
            clozeSentence: 'Could I ___ a quiet room away from the elevator?',
            clozeAnswer: 'have',
            ipa: '/kʊd aɪ hæv ə ˈkwaɪət ruːm ˌʌpˈsterz pliːz/',
            exampleDialogue: 'Certainly, room 508 overlooks the courtyard.',
            wordOrderChunks: ['Could I have', 'a quiet room', 'upstairs,', 'please?'],
          },
          de: {
            phrase: 'Könnte ich bitte ein ruhiges Zimmer oben haben?',
            clozeSentence: 'Könnte ich bitte ein ___ Zimmer zum Innenhof bekommen?',
            clozeAnswer: 'ruhiges',
            ipa: '/ˈkœntə ɪç ˈbɪtə aɪ̯n ˈʁuːɪɡəs ˈtsɪmɐ ˈoːbn̩ ˈhaːbn̩/',
            exampleDialogue: 'Sehr gerne, ich gebe Ihnen Zimmer 412 im vierten Stock.',
            wordOrderChunks: ['Könnte ich bitte', 'ein ruhiges Zimmer', 'oben', 'haben?'],
          },
          es: {
            phrase: '¿Podría darme una habitación tranquila arriba, por favor?',
            clozeSentence: '¿Podría darme una ___ tranquila en una planta alta?',
            clozeAnswer: 'habitación',
            ipa: '/poˈðɾia ˈðaɾme ˈuna aβitaˈθjon tɾaŋˈkila aˈriβa/',
            exampleDialogue: 'Claro, le asigno una que da al jardín interior.',
            wordOrderChunks: ['¿Podría darme', 'una habitación tranquila', 'arriba,', 'por favor?'],
          },
        },
      },
      {
        id: 'travel_public_transit',
        moduleId: 'travel_world',
        cefr: 'A2',
        turkishMeaning: 'Bu tren şehir merkezine gidiyor mu?',
        turkishTrapTr:
          'Türkçede "gidiyor mu" şimdiki zamanla sorulur; oysa tarifeli tren/otobüs hatlarında İngilizce geniş zaman ("Does this train go...") ister. Almancada araçlar "gehen" değil "fahren" fiilini kullanır ("Fährt dieser Zug..."). İspanyolcada "ir al" yönelme edatını korur.',
        contextTagTr: 'Toplu Taşıma',
        langs: {
          en: {
            phrase: 'Does this train go to the city center?',
            clozeSentence: 'Excuse me, ___ this train go straight to the city center?',
            clozeAnswer: 'does',
            ipa: '/dʌz ðɪs treɪn ɡoʊ tə ðə ˈsɪti ˈsentər/',
            exampleDialogue: 'Yes, get off at Central Station — three stops from here.',
            wordOrderChunks: ['Does', 'this train', 'go to', 'the city center?'],
          },
          de: {
            phrase: 'Fährt dieser Zug direkt ins Stadtzentrum?',
            clozeSentence: 'Entschuldigung, ___ diese S-Bahn direkt ins Zentrum?',
            clozeAnswer: 'fährt',
            ipa: '/fɛːɐ̯t ˈdiːzɐ tsuːk diˈʁɛkt ɪns ˈʃtatˌtsɛntʁʊm/',
            exampleDialogue: 'Ja, in vier Stationen sind Sie direkt am Hauptbahnhof.',
            wordOrderChunks: ['Fährt', 'dieser Zug', 'direkt', 'ins Stadtzentrum?'],
          },
          es: {
            phrase: '¿Este tren va directo al centro de la ciudad?',
            clozeSentence: 'Perdone, ¿esta línea ___ directo al centro?',
            clozeAnswer: 'va',
            ipa: '/ˈeste tɾem ba diˈɾekto al ˈθentɾo de la θjuˈðað/',
            exampleDialogue: 'Sí, bájese en la tercera parada, en Sol.',
            wordOrderChunks: ['¿Este tren', 'va directo', 'al centro', 'de la ciudad?'],
          },
        },
      },
      {
        id: 'travel_passport_validity',
        moduleId: 'travel_world',
        cefr: 'B1',
        turkishMeaning: 'Pasaportum gelecek yıl Aralık ayına kadar geçerli.',
        turkishTrapTr:
          'Türkçedeki "-e kadar" için İngilizcede "by" ile "until" sık karıştırılır: tek seferlik teslim tarihi "by", kesintisiz süren geçerlilik/durum ise "until" ister! Almancada "bis" + sıfat sonda ("gültig"), İspanyolcada "válido hasta" kullanılır.',
        contextTagTr: 'Evrak & Vize',
        langs: {
          en: {
            phrase: 'My passport is valid until next December.',
            clozeSentence: 'Make sure your passport is valid ___ your return flight.',
            clozeAnswer: 'until',
            ipa: '/maɪ ˈpæspɔːrt ɪz ˈvælɪd ənˈtɪl nekst dɪˈsembər/',
            exampleDialogue: 'That meets the six-month rule, so you are good to fly.',
            wordOrderChunks: ['My passport', 'is valid', 'until', 'next December.'],
          },
          de: {
            phrase: 'Mein Reisepass ist bis nächsten Dezember gültig.',
            clozeSentence: 'Mein Reisepass ist noch bis Ende des Jahres ___.',
            clozeAnswer: 'gültig',
            ipa: '/maɪ̯n ˈʁaɪ̯zəpas ɪst bɪs ˈnɛːçstn̩ deˈtsɛmbɐ ˈɡʏltɪç/',
            exampleDialogue: 'Das reicht für die Einreise problemlos aus.',
            wordOrderChunks: ['Mein Reisepass', 'ist bis', 'nächsten Dezember', 'gültig.'],
          },
          es: {
            phrase: 'Mi pasaporte es válido hasta diciembre del próximo año.',
            clozeSentence: 'Mi pasaporte es ___ hasta finales del próximo año.',
            clozeAnswer: 'válido',
            ipa: '/mi pasaˈpoɾte es ˈbaliðo ˈasta diˈθjembɾe/',
            exampleDialogue: 'Perfecto, cumple sin problemas los requisitos de entrada.',
            wordOrderChunks: ['Mi pasaporte', 'es válido', 'hasta diciembre', 'del próximo año.'],
          },
        },
      },
      {
        id: 'travel_included_breakfast',
        moduleId: 'travel_world',
        cefr: 'A2',
        turkishMeaning: 'Kahvaltı oda fiyatına dahil mi?',
        turkishTrapTr:
          'Türkçedeki "dahil mi" için "Is breakfast include?" (yalın fiil!) deme tuzağına dikkat: pasif sıfat olarak "included" gerekir. Almancada "im Preis inbegriffen", İspanyolcada ise "está incluido en el precio" kalıbı yerleşiktir.',
        contextTagTr: 'Otel Ücreti',
        langs: {
          en: {
            phrase: 'Is breakfast included in the room rate?',
            clozeSentence: 'Could you confirm if breakfast is ___ in the rate?',
            clozeAnswer: 'included',
            ipa: '/ɪz ˈbrekfəst ɪnˈkluːdɪd ɪn ðə ruːm reɪt/',
            exampleDialogue: 'Yes, it is served from seven to ten on the terrace.',
            wordOrderChunks: ['Is breakfast', 'included', 'in the', 'room rate?'],
          },
          de: {
            phrase: 'Ist das Frühstück im Zimmerpreis inbegriffen?',
            clozeSentence: 'Ist das Frühstück bereits im Preis ___?',
            clozeAnswer: 'inbegriffen',
            ipa: '/ɪst das ˈfʁyːʃtʏk ɪm ˈtsɪmɐpʁaɪ̯s ˈɪnbəɡʁɪfn̩/',
            exampleDialogue: 'Ja, unser Frühstücksbuffet ist ab sieben Uhr geöffnet.',
            wordOrderChunks: ['Ist', 'das Frühstück', 'im Zimmerpreis', 'inbegriffen?'],
          },
          es: {
            phrase: '¿El desayuno está incluido en el precio?',
            clozeSentence: '¿El desayuno está ___ en la tarifa de la habitación?',
            clozeAnswer: 'incluido',
            ipa: '/el desaˈjuno esˈta iŋkluˈiðo en el ˈpɾeθjo/',
            exampleDialogue: 'Sí, se sirve en el comedor de siete a diez y media.',
            wordOrderChunks: ['¿El desayuno', 'está incluido', 'en el', 'precio?'],
          },
        },
      },
    ],
  },
  {
    id: 'tech_career',
    order: 4,
    titleTr: 'Teknoloji, Yazılım & Modern Kariyer',
    subtitleTr: 'Sprint, mimari karar, code review ve uzaktan ekip toplantılarında netleş',
    icon: '💻',
    cefrRange: 'B1–B2',
    accentHex: '#a855f7',
    items: [
      {
        id: 'tech_reproduce_bug',
        moduleId: 'tech_career',
        cefr: 'B1',
        turkishMeaning: 'Bu hatayı kendi bilgisayarımda yeniden üretebiliyorum.',
        turkishTrapTr:
          'Türkçedeki "hata üretmek" yerine teknik bağlamda "produce a bug" derseniz "hata yazdım" anlamına gelir! Mevcut hatayı tekrarlamak "reproduce"tur. Ayrıca "in local" değil "locally" ("lokal" / "en local") kullanılır.',
        contextTagTr: 'Hata Ayıklama',
        langs: {
          en: {
            phrase: 'I can reproduce this bug locally.',
            clozeSentence: 'Let me check if I can ___ this bug on my machine.',
            clozeAnswer: 'reproduce',
            ipa: '/aɪ kæn ˌriːprəˈduːs ðɪs bʌɡ ˈloʊkəli/',
            exampleDialogue: 'Awesome, share the steps in the ticket so we can patch it.',
            wordOrderChunks: ['I can', 'reproduce', 'this bug', 'locally.'],
          },
          de: {
            phrase: 'Ich kann diesen Fehler lokal reproduzieren.',
            clozeSentence: 'Leider lässt sich der Fehler bisher nicht lokal ___.',
            clozeAnswer: 'reproduzieren',
            ipa: '/ɪç kan ˈdiːzn̩ ˈfeːlɐ loˈkaːl ʁepʁoduˈtsiːʁən/',
            exampleDialogue: 'Super, häng bitte die Logdatei direkt ans Ticket an.',
            wordOrderChunks: ['Ich kann', 'diesen Fehler', 'lokal', 'reproduzieren.'],
          },
          es: {
            phrase: 'Puedo reproducir este error en local.',
            clozeSentence: 'Acabo de ___ este error en mi entorno local.',
            clozeAnswer: 'reproducir',
            ipa: '/ˈpweðo repɾoðuˈθiɾ ˈeste eˈroɾ en loˈkal/',
            exampleDialogue: 'Genial, súbeme los pasos de prueba al repositorio.',
            wordOrderChunks: ['Puedo', 'reproducir', 'este error', 'en local.'],
          },
        },
      },
      {
        id: 'tech_bottleneck',
        moduleId: 'tech_career',
        cefr: 'B2',
        turkishMeaning: 'Veritabanı sorgusu şu an temel darboğazımız.',
        turkishTrapTr:
          '"Şu an / güncel olarak" derken İngilizcede "actually" kullanmak büyük bir false friend hatasıdır; doğrusu "currently"! İlginç şekilde Almancadaki "aktuell" ve İspanyolcadaki "actualmente" tam da "şu an" anlamına gelir ("aslında" değil!).',
        contextTagTr: 'Performans',
        langs: {
          en: {
            phrase: 'The database query is currently our main bottleneck.',
            clozeSentence: 'That slow query is ___ our biggest bottleneck.',
            clozeAnswer: 'currently',
            ipa: '/ðə ˈdeɪtəbeɪs ˈkwɪri ɪz ˈkɜːrəntli ˈaʊər meɪn ˈbɑːtlnek/',
            exampleDialogue: 'Adding a composite index should cut latency in half.',
            wordOrderChunks: ['The database query', 'is currently', 'our main', 'bottleneck.'],
          },
          de: {
            phrase: 'Die Datenbankabfrage ist aktuell unser größter Engpass.',
            clozeSentence: 'Diese Abfrage ist ___ unser größter Engpass im System.',
            clozeAnswer: 'aktuell',
            ipa: '/diː ˈdaːtn̩baŋkˌapfʁaːɡə ɪst aktuˈɛl ˈʊnzɐ ˈɡʁøːstɐ ˈɛŋpas/',
            exampleDialogue: 'Mit einem passenden Index drücken wir die Ladezeit deutlich.',
            wordOrderChunks: ['Die Datenbankabfrage', 'ist aktuell', 'unser größter', 'Engpass.'],
          },
          es: {
            phrase: 'La consulta es actualmente nuestro principal cuello de botella.',
            clozeSentence: 'Esa consulta es ___ nuestro principal cuello de botella.',
            clozeAnswer: 'actualmente',
            ipa: '/la konˈsulta es aktualˈmente ˈnwestɾo ˈkweʎo de boˈteʎa/',
            exampleDialogue: 'Si añadimos caché en Redis, bajaremos la latencia enseguida.',
            wordOrderChunks: ['La consulta', 'es actualmente', 'nuestro principal', 'cuello de botella.'],
          },
        },
      },
      {
        id: 'tech_deploy_friday',
        moduleId: 'tech_career',
        cefr: 'B1',
        turkishMeaning: 'Cuma günü canlıya çıkmaktan kaçınalım.',
        turkishTrapTr:
          'Türkçedeki "-mekten kaçınmak" yüzünden "avoid to deploy" hatası yapılır! "avoid" fiili ardından daima "-ing" (gerund) ister: "avoid deploying". Almancada "vermeiden, ... zu gehen", İspanyolcada doğrudan mastar ("evitar desplegar") kullanılır.',
        contextTagTr: 'Sürüm Yönetimi',
        langs: {
          en: {
            phrase: "Let's avoid deploying to production on Friday.",
            clozeSentence: 'We should avoid ___ risky changes right before the weekend.',
            clozeAnswer: 'deploying',
            ipa: '/lets əˈvɔɪd dɪˈplɔɪɪŋ tə prəˈdʌkʃən ɑːn ˈfraɪdeɪ/',
            exampleDialogue: 'Totally agree — Monday morning is way safer.',
            wordOrderChunks: ["Let's avoid", 'deploying', 'to production', 'on Friday.'],
          },
          de: {
            phrase: 'Vermeiden wir es, am Freitag produktiv zu gehen.',
            clozeSentence: 'Wir sollten es vermeiden, freitags Änderungen live ___ schalten.',
            clozeAnswer: 'zu',
            ipa: '/fɛɐ̯ˈmaɪ̯dn̩ viːɐ̯ ɛs am ˈfʁaɪ̯taːk pʁodʊkˈtiːf tsuː ˈɡeːən/',
            exampleDialogue: 'Stimmt, am Montagmorgen sind alle ausgeruht und bereit.',
            wordOrderChunks: ['Vermeiden wir es,', 'am Freitag', 'produktiv', 'zu gehen.'],
          },
          es: {
            phrase: 'Evitemos desplegar a producción los viernes.',
            clozeSentence: 'Siempre intentamos evitar ___ cambios críticos los viernes.',
            clozeAnswer: 'desplegar',
            ipa: '/eβiˈtemos despleˈɣaɾ a pɾoðukˈθjon los ˈbjeɾnes/',
            exampleDialogue: 'Totalmente, mejor lo lanzamos el lunes a primera hora.',
            wordOrderChunks: ['Evitemos', 'desplegar', 'a producción', 'los viernes.'],
          },
        },
      },
      {
        id: 'tech_tradeoff',
        moduleId: 'tech_career',
        cefr: 'B2',
        turkishMeaning: 'Hız ile bellek arasında net bir denge seçimi var.',
        turkishTrapTr:
          'Türkçede "hızla bellek arasında" derken "between speed to memory" yazmak sık yapılan hatadır! "between" daima "and" bağlacıyla eşleşir ("between X and Y"). Almancada "zwischen ... und", İspanyolcada "entre ... y" aynı yapıyı korur.',
        contextTagTr: 'Sistem Tasarımı',
        langs: {
          en: {
            phrase: 'There is a clear trade-off between speed and memory.',
            clozeSentence: 'We must balance the trade-off between speed ___ memory.',
            clozeAnswer: 'and',
            ipa: '/ðer ɪz ə klɪr ˈtreɪdɔːf bɪˈtwiːn spiːd ænd ˈmeməri/',
            exampleDialogue: 'Given our RAM budget, caching only hot keys makes sense.',
            wordOrderChunks: ['There is', 'a clear trade-off', 'between speed', 'and memory.'],
          },
          de: {
            phrase: 'Es gibt einen klaren Kompromiss zwischen Tempo und Speicher.',
            clozeSentence: 'Das ist ein klassischer Kompromiss ___ Tempo und Speicherbedarf.',
            clozeAnswer: 'zwischen',
            ipa: '/ɛs ɡiːpt ˈaɪ̯nən ˈklaːʁən kɔmpʁoˈmɪs ˈtsvɪʃn̩ ˈtɛmpo ʊnt ˈʃpaɪ̯çɐ/',
            exampleDialogue: 'Da unser Arbeitsspeicher knapp ist, sparen wir lieber dort.',
            wordOrderChunks: ['Es gibt', 'einen klaren Kompromiss', 'zwischen Tempo', 'und Speicher.'],
          },
          es: {
            phrase: 'Hay un compromiso claro entre velocidad y memoria.',
            clozeSentence: 'Existe un equilibrio claro ___ velocidad y memoria.',
            clozeAnswer: 'entre',
            ipa: '/ai uŋ kompɾoˈmiso ˈklaɾo ˈentɾe beloθiˈðað i meˈmoɾja/',
            exampleDialogue: 'En dispositivos móviles conviene priorizar poca memoria.',
            wordOrderChunks: ['Hay un', 'compromiso claro', 'entre velocidad', 'y memoria.'],
          },
        },
      },
      {
        id: 'tech_backward_compatible',
        moduleId: 'tech_career',
        cefr: 'B2',
        turkishMeaning: 'Bu API değişikliği eski istemcilerle geriye uyumlu mu?',
        turkishTrapTr:
          'Türkçedeki "ile uyumlu" ifadesinde İngilizceye geçerken "compatible to" değil "compatible with" kullanılmalıdır! Almancada "kompatibel mit" (+ Dativ), İspanyolcada "retrocompatible con" edatıyla eşleşir.',
        contextTagTr: 'API Tasarımı',
        langs: {
          en: {
            phrase: 'Is this API change backward-compatible with older clients?',
            clozeSentence: 'Ensure the new endpoint is backward-compatible ___ v1.',
            clozeAnswer: 'with',
            ipa: '/ɪz ðɪs ˌeɪpiːˈaɪ tʃeɪndʒ ˈbækwərd kəmˈpætəbl wɪð ˈoʊldər ˈklaɪənts/',
            exampleDialogue: 'Yes, the old fields remain optional until next quarter.',
            wordOrderChunks: ['Is this API change', 'backward-compatible', 'with', 'older clients?'],
          },
          de: {
            phrase: 'Ist diese API-Änderung mit älteren Clients abwärtskompatibel?',
            clozeSentence: 'Ist das neue Schema ___ älteren Versionen kompatibel?',
            clozeAnswer: 'mit',
            ipa: '/ɪst ˈdiːzə aːpeːˈiː ˈɛndəʁʊŋ mɪt ˈɛltəʁən ˈklaɪ̯ənts ˈapvɛʁtsˌkɔmpatiːbl̩/',
            exampleDialogue: 'Ja, bestehende Mobil-Apps laufen ohne Update weiter.',
            wordOrderChunks: ['Ist', 'diese API-Änderung', 'mit älteren Clients', 'abwärtskompatibel?'],
          },
          es: {
            phrase: '¿Este cambio es retrocompatible con clientes antiguos?',
            clozeSentence: '¿El nuevo servicio es retrocompatible ___ la versión anterior?',
            clozeAnswer: 'con',
            ipa: '/ˈeste ˈkambjo es retrokompaˈtiβle koŋ kliˈentes anˈtiɣwos/',
            exampleDialogue: 'Sí, mantendremos los campos anteriores durante seis meses.',
            wordOrderChunks: ['¿Este cambio', 'es retrocompatible', 'con clientes', 'antiguos?'],
          },
        },
      },
      {
        id: 'tech_scope_creep',
        moduleId: 'tech_career',
        cefr: 'B2',
        turkishMeaning: 'Bu özelliği mevcut kapsamın dışında tutmalıyız.',
        turkishTrapTr:
          'Türkçedeki "kapsam dışı" kalıbı "out scope" diye kısaltılmaz; "out of scope" gerekir. Ayrıca "should" modalından sonra "to" konmaz ("should to keep" yanlıştır). Almancada Genitiv isteyen "außerhalb des...", İspanyolcada "fuera del alcance" kullanılır.',
        contextTagTr: 'Sprint Planlama',
        langs: {
          en: {
            phrase: 'We should keep this feature out of scope.',
            clozeSentence: "It's a nice idea, but it's ___ of scope for this sprint.",
            clozeAnswer: 'out',
            ipa: '/wiː ʃʊd kiːp ðɪs ˈfiːtʃər aʊt əv skoʊp/',
            exampleDialogue: 'Fair enough — let us log it in the backlog for v2.',
            wordOrderChunks: ['We should', 'keep this feature', 'out of', 'scope.'],
          },
          de: {
            phrase: 'Wir sollten diese Funktion außerhalb des Sprints lassen.',
            clozeSentence: 'Dieses Thema liegt leider ___ unseres aktuellen Sprints.',
            clozeAnswer: 'außerhalb',
            ipa: '/viːɐ̯ ˈzɔltn̩ ˈdiːzə fʊŋkˈtsjoːn ˈaʊ̯sɐhalp dɛs ʃpʁɪnts ˈlasn̩/',
            exampleDialogue: 'Einverstanden, ich lege dafür ein Ticket im Backlog an.',
            wordOrderChunks: ['Wir sollten', 'diese Funktion', 'außerhalb des Sprints', 'lassen.'],
          },
          es: {
            phrase: 'Deberíamos dejar esta función fuera del alcance.',
            clozeSentence: 'Esa mejora queda ___ del alcance de esta iteración.',
            clozeAnswer: 'fuera',
            ipa: '/deβeˈɾiamos deˈxaɾ ˈesta funˈθjon ˈfweɾa del alˈkanθe/',
            exampleDialogue: 'Bien pensado, la guardamos para el próximo ciclo.',
            wordOrderChunks: ['Deberíamos', 'dejar esta función', 'fuera del', 'alcance.'],
          },
        },
      },
      {
        id: 'tech_pair_programming',
        moduleId: 'tech_career',
        cefr: 'B1',
        turkishMeaning: 'Hızlı bir arama yapıp ekran paylaşalım.',
        turkishTrapTr:
          'Türkçedeki "ekran açalım" yüzünden "open screen" demek yanlıştır; doğal terim EN "share screens", DE "den Bildschirm teilen", ES "compartir pantalla"dır. Ayrıca "Let\'s" ardından gelen ikinci fiil de yalın kalır.',
        contextTagTr: 'Uzaktan İş Birliği',
        langs: {
          en: {
            phrase: "Let's hop on a call and share screens.",
            clozeSentence: "If you're stuck, let's jump on a call and ___ screens.",
            clozeAnswer: 'share',
            ipa: '/lets hɑːp ɑːn ə kɔːl ænd ʃer skriːnz/',
            exampleDialogue: 'Great, sending you a quick huddle link right now.',
            wordOrderChunks: ["Let's hop", 'on a call', 'and share', 'screens.'],
          },
          de: {
            phrase: 'Lass uns kurz telefonieren und den Bildschirm teilen.',
            clozeSentence: 'Kannst du bitte kurz deinen Bildschirm im Call ___?',
            clozeAnswer: 'teilen',
            ipa: '/las ʊns kʊʁts telefoˈniːʁən ʊnt deːn ˈbɪltʃɪʁm ˈtaɪ̯lən/',
            exampleDialogue: 'Klar, ich schicke dir direkt den Link.',
            wordOrderChunks: ['Lass uns', 'kurz telefonieren', 'und den Bildschirm', 'teilen.'],
          },
          es: {
            phrase: 'Hagamos una llamada rápida y compartamos pantalla.',
            clozeSentence: '¿Puedes ___ tu pantalla para ver el registro juntos?',
            clozeAnswer: 'compartir',
            ipa: '/aˈɣamos ˈuna ʎaˈmaða ˈrapiða i kompaɾˈtamos panˈtaʎa/',
            exampleDialogue: 'Claro, me conecto ahora mismo y lo miramos.',
            wordOrderChunks: ['Hagamos', 'una llamada rápida', 'y compartamos', 'pantalla.'],
          },
        },
      },
      {
        id: 'tech_root_cause',
        moduleId: 'tech_career',
        cefr: 'B2',
        turkishMeaning: 'Belirtileri yamamak yerine kök nedeni bulalım.',
        turkishTrapTr:
          'Türkçedeki "-mek yerine" İngilizcede "instead to patch" olarak kurulmaz! "instead of" bir edattır ve fiile "-ing" getirir ("instead of patching"). Almancada "(an)statt ... zu + mastar", İspanyolcada "en lugar de + mastar" kullanılır.',
        contextTagTr: 'Mimari Kalite',
        langs: {
          en: {
            phrase: "Let's find the root cause instead of patching symptoms.",
            clozeSentence: 'We need a clean fix instead of ___ the symptoms.',
            clozeAnswer: 'patching',
            ipa: '/lets faɪnd ðə ruːt kɔːz ɪnˈsted əv ˈpætʃɪŋ ˈsɪmptəmz/',
            exampleDialogue: 'Agreed, a quick workaround would only bite us later.',
            wordOrderChunks: ["Let's find", 'the root cause', 'instead of', 'patching symptoms.'],
          },
          de: {
            phrase: 'Finden wir die Ursache, statt nur Symptome zu flicken.',
            clozeSentence: 'Suchen wir die echte Ursache, ___ nur Symptome zu überdecken.',
            clozeAnswer: 'statt',
            ipa: '/ˈfɪndn̩ viːɐ̯ diː ˈuːɐ̯zaxə ʃtat nuːɐ̯ zʏmpˈtoːmə tsuː ˈflɪkn̩/',
            exampleDialogue: 'Richtig, sonst taucht das Problem nächste Woche wieder auf.',
            wordOrderChunks: ['Finden wir', 'die Ursache,', 'statt nur Symptome', 'zu flicken.'],
          },
          es: {
            phrase: 'Busquemos la causa raíz en lugar de poner parches.',
            clozeSentence: 'Hay que resolver la causa raíz ___ lugar de improvisar.',
            clozeAnswer: 'en',
            ipa: '/busˈkemos la ˈkawsa raˈiθ en luˈɣaɾ de poˈneɾ ˈpaɾtʃes/',
            exampleDialogue: 'Totalmente de acuerdo, los parches solo crean deuda técnica.',
            wordOrderChunks: ['Busquemos', 'la causa raíz', 'en lugar de', 'poner parches.'],
          },
        },
      },
      {
        id: 'tech_code_review',
        moduleId: 'tech_career',
        cefr: 'B1',
        turkishMeaning: 'Pull request’im için geri bildiriminizi bekliyorum.',
        turkishTrapTr:
          'Türkçede "beklemek" geçişli olduğu için ("yorumunu bekliyorum") İngilizcede "waiting your feedback" hatası yapılır! "wait" nesne alırken daima "for" ister ("waiting for"). Almanca "warten auf" (+ Akk), İspanyolca ise Türkçeye benzer şekilde doğrudan nesne alır ("esperando tu revisión").',
        contextTagTr: 'Kod İnceleme',
        langs: {
          en: {
            phrase: "I'm waiting for your feedback on my pull request.",
            clozeSentence: "I'm waiting ___ one more approval before merging.",
            clozeAnswer: 'for',
            ipa: '/aɪm ˈweɪtɪŋ fɔːr jʊr ˈfiːdbæk ɑːn maɪ pʊl rɪˈkwest/',
            exampleDialogue: 'I will review your diff right after lunch!',
            wordOrderChunks: ["I'm waiting", 'for your feedback', 'on my', 'pull request.'],
          },
          de: {
            phrase: 'Ich warte noch auf deine Rückmeldung zum Code.',
            clozeSentence: 'Ich warte gerade ___ deine Freigabe für den Pull Request.',
            clozeAnswer: 'auf',
            ipa: '/ɪç ˈvaʁtə nɔx aʊ̯f ˈdaɪ̯nə ˈʁʏkmɛldʊŋ tsʊm koːt/',
            exampleDialogue: 'Ich schaue mir deine Änderungen gleich in zehn Minuten an.',
            wordOrderChunks: ['Ich warte', 'noch auf', 'deine Rückmeldung', 'zum Code.'],
          },
          es: {
            phrase: 'Estoy esperando tu revisión del código.',
            clozeSentence: 'Todavía estoy ___ tu revisión para poder fusionar la rama.',
            clozeAnswer: 'esperando',
            ipa: '/esˈtoi espeˈɾando tu reβiˈsjon del ˈkoðiɣo/',
            exampleDialogue: 'Ahora mismo reviso los cambios y te dejo comentarios.',
            wordOrderChunks: ['Estoy', 'esperando', 'tu revisión', 'del código.'],
          },
        },
      },
      {
        id: 'tech_scalable',
        moduleId: 'tech_career',
        cefr: 'B1',
        turkishMeaning: 'Bu tasarım trafiğimiz arttıkça hızlı kalıyor.',
        turkishTrapTr:
          'Türkçedeki "-dıkça" zaman yan cümlesinde gelecek kastedilse bile İngilizcede "as our traffic will grow" denmez! Zaman/koşul yan cümlesinde geniş zaman ("as traffic grows") kullanılır. Almancada "wenn" fiili sona ("wächst") gönderir.',
        contextTagTr: 'Ölçeklenebilirlik',
        langs: {
          en: {
            phrase: 'This design stays fast as our traffic grows.',
            clozeSentence: 'We need a setup that stays reliable as traffic ___.',
            clozeAnswer: 'grows',
            ipa: '/ðɪs dɪˈzaɪn steɪz fæst æz ˈaʊər ˈtræfɪk ɡroʊz/',
            exampleDialogue: 'Great, let us run a load test to confirm those numbers.',
            wordOrderChunks: ['This design', 'stays fast', 'as our traffic', 'grows.'],
          },
          de: {
            phrase: 'Diese Architektur skaliert mit, wenn der Traffic wächst.',
            clozeSentence: 'Das System bleibt stabil, ___ die Nutzerzahl weiter wächst.',
            clozeAnswer: 'wenn',
            ipa: '/ˈdiːzə aʁçitɛkˈtuːɐ̯ skaˈliːɐ̯t mɪt vɛn deːɐ̯ ˈtʁɛfɪk vɛkst/',
            exampleDialogue: 'Sehr gut, starten wir direkt einen Lasttest zur Prüfung.',
            wordOrderChunks: ['Diese Architektur', 'skaliert mit,', 'wenn der Traffic', 'wächst.'],
          },
          es: {
            phrase: 'Esta arquitectura escala bien a medida que crece el tráfico.',
            clozeSentence: 'El sistema escala sin problemas a medida que ___ el tráfico.',
            clozeAnswer: 'crece',
            ipa: '/ˈesta aɾkitekˈtuɾa esˈkala bjen a meˈðiða ke ˈkɾeθe el ˈtɾafiko/',
            exampleDialogue: 'Excelente, hagamos una prueba de carga esta tarde.',
            wordOrderChunks: ['Esta arquitectura', 'escala bien', 'a medida que', 'crece el tráfico.'],
          },
        },
      },
    ],
  },
  {
    id: 'social_dining',
    order: 5,
    titleTr: 'Restoran, Kafe & Sosyal Hayat',
    subtitleTr: 'Sipariş ver, özel tercih belirt, hesap iste ve arkadaş buluşmalarında parılda',
    icon: '☕',
    cefrRange: 'A2–B1',
    accentHex: '#fb7185',
    items: [
      {
        id: 'social_bill_please',
        moduleId: 'social_dining',
        cefr: 'A2',
        turkishMeaning: 'Müsait olduğunuzda hesabı alabilir miyiz?',
        turkishTrapTr:
          'Türkçedeki "hesap" yüzünden "Can we take the account?" denirse banka hesabı anlaşılır! Restoran hesabı EN "the bill / the check", DE "die Rechnung", ES "la cuenta"dır; ayrıca "take" yerine "get" veya "have" kullanılır.',
        contextTagTr: 'Hesap İsteme',
        langs: {
          en: {
            phrase: 'Could we get the bill when you have a moment?',
            clozeSentence: "Excuse me, could we get the ___ when you're free?",
            clozeAnswer: 'bill',
            ipa: '/kʊd wiː ɡet ðə bɪl wen juː hæv ə ˈmoʊmənt/',
            exampleDialogue: 'Right away! Would you like to pay by card or cash?',
            wordOrderChunks: ['Could we', 'get the bill', 'when you have', 'a moment?'],
          },
          de: {
            phrase: 'Könnten wir bitte die Rechnung bekommen?',
            clozeSentence: 'Entschuldigung, wir würden gerne ___.',
            clozeAnswer: 'bezahlen',
            ipa: '/ˈkœntn̩ viːɐ̯ ˈbɪtə diː ˈʁɛçnʊŋ bəˈkɔmən/',
            exampleDialogue: 'Sehr gerne, zahlen Sie zusammen oder getrennt?',
            wordOrderChunks: ['Könnten wir', 'bitte', 'die Rechnung', 'bekommen?'],
          },
          es: {
            phrase: '¿Nos puede traer la cuenta cuando pueda?',
            clozeSentence: 'Disculpe, ¿nos puede traer la ___, por favor?',
            clozeAnswer: 'cuenta',
            ipa: '/nos ˈpweðe tɾaˈeɾ la ˈkwenta ˈkwando ˈpweða/',
            exampleDialogue: 'Ahora mismo se la traigo, ¿pagan con tarjeta?',
            wordOrderChunks: ['¿Nos puede', 'traer la cuenta', 'cuando', 'pueda?'],
          },
        },
      },
      {
        id: 'social_have_coffee',
        moduleId: 'social_dining',
        cefr: 'A2',
        turkishMeaning: 'Bu öğleden sonra bir kahve içmeye ne dersin?',
        turkishTrapTr:
          '"Kahve içmek" davetinde İngilizcede "drink a coffee" resmi ve mekanik kalır; doğal ifade "grabbing a coffee" veya "having a coffee"dir ("How about" sonrasında fiil "-ing" alır!). İspanyolcada kafe/içecek için "beber" yerine daima "tomar un café" denir.',
        contextTagTr: 'Davet',
        langs: {
          en: {
            phrase: 'How about grabbing a coffee this afternoon?',
            clozeSentence: 'How about ___ a quick coffee after the meeting?',
            clozeAnswer: 'grabbing',
            ipa: '/haʊ əˈbaʊt ˈɡræbɪŋ ə ˈkɔːfi ðɪs ˌæftərˈnuːn/',
            exampleDialogue: 'Love that idea! Meet at the corner bakery at four?',
            wordOrderChunks: ['How about', 'grabbing', 'a coffee', 'this afternoon?'],
          },
          de: {
            phrase: 'Wie wäre es, heute Nachmittag einen Kaffee zu trinken?',
            clozeSentence: 'Hast du Lust, heute Nachmittag einen Kaffee ___ zu gehen?',
            clozeAnswer: 'trinken',
            ipa: '/viː ˈvɛːʁə ɛs ˈhɔɪ̯tə ˈnaːxmɪtaːk ˈaɪ̯nən ˈkafe tsuː ˈtʁɪŋkn̩/',
            exampleDialogue: 'Sehr gern! Wollen wir uns um vier am Café treffen?',
            wordOrderChunks: ['Wie wäre es,', 'heute Nachmittag', 'einen Kaffee', 'zu trinken?'],
          },
          es: {
            phrase: '¿Qué tal si tomamos un café esta tarde?',
            clozeSentence: '¿Te apetece ___ un café después del trabajo?',
            clozeAnswer: 'tomar',
            ipa: '/ke tal si toˈmamos uŋ kaˈfe ˈesta ˈtaɾðe/',
            exampleDialogue: '¡Genial! Nos vemos a las cinco en la plaza.',
            wordOrderChunks: ['¿Qué tal si', 'tomamos', 'un café', 'esta tarde?'],
          },
        },
      },
      {
        id: 'social_recommend',
        moduleId: 'social_dining',
        cefr: 'B1',
        turkishMeaning: 'Menüden ne önerirsiniz?',
        turkishTrapTr:
          'Türkçedeki "bana ne önerirsiniz" yüzünden "What do you suggest me?" veya "recommend me?" demek hatadır! "recommend" nesnesiz kişi zamiri almaz ("What would you recommend?"). Almanca Dativ ("uns empfehlen") ve İspanyolca ("nos recomienda") ise zamiri rahatça alır.',
        contextTagTr: 'Sipariş',
        langs: {
          en: {
            phrase: 'What would you recommend from the menu?',
            clozeSentence: "It's our first visit; what would you ___?",
            clozeAnswer: 'recommend',
            ipa: '/wʌt wʊd juː ˌrekəˈmend frəm ðə ˈmenjuː/',
            exampleDialogue: 'The grilled sea bass and homemade pasta are both fantastic.',
            wordOrderChunks: ['What', 'would you', 'recommend', 'from the menu?'],
          },
          de: {
            phrase: 'Was können Sie uns von der Karte empfehlen?',
            clozeSentence: 'Wir sind zum ersten Mal hier; was können Sie ___?',
            clozeAnswer: 'empfehlen',
            ipa: '/vas ˈkœnən ziː ʊns fɔn deːɐ̯ ˈkaʁtə ɛmpˈfeːlən/',
            exampleDialogue: 'Heute empfehle ich Ihnen besonders den frischen Lachs.',
            wordOrderChunks: ['Was können', 'Sie uns', 'von der Karte', 'empfehlen?'],
          },
          es: {
            phrase: '¿Qué nos recomienda de la carta?',
            clozeSentence: 'Es nuestra primera vez aquí; ¿qué nos ___?',
            clozeAnswer: 'recomienda',
            ipa: '/ke nos rekoˈmjenda de la ˈkaɾta/',
            exampleDialogue: 'El arroz meloso del día está espectacular.',
            wordOrderChunks: ['¿Qué', 'nos recomienda', 'de la', 'carta?'],
          },
        },
      },
      {
        id: 'social_allergy',
        moduleId: 'social_dining',
        cefr: 'A2',
        turkishMeaning: 'Kuruyemişe alerjim var; bu yemekte var mı?',
        turkishTrapTr:
          'Türkçedeki "-e alerjim var" için "I have allergy to" (eksik artikel!) veya "allergic with" denmez! Doğru edatlar: EN "allergic to", DE "allergisch gegen" ("karşı" edatı!), ES "alérgico a".',
        contextTagTr: 'Sağlık & Diyet',
        langs: {
          en: {
            phrase: "I'm allergic to nuts; does this dish contain any?",
            clozeSentence: "Please check with the chef because I'm allergic ___ nuts.",
            clozeAnswer: 'to',
            ipa: '/aɪm əˈlɜːrdʒɪk tə nʌts dʌz ðɪs dɪʃ kənˈteɪn ˈeni/',
            exampleDialogue: 'Thanks for telling me! I will ask the kitchen to leave them out.',
            wordOrderChunks: ["I'm allergic", 'to nuts;', 'does this dish', 'contain any?'],
          },
          de: {
            phrase: 'Ich bin allergisch gegen Nüsse; ist da etwas drin?',
            clozeSentence: 'Entschuldigung, ich bin leider allergisch ___ Erdnüsse.',
            clozeAnswer: 'gegen',
            ipa: '/ɪç bɪn aˈlɛʁɡɪʃ ˈɡeːɡn̩ ˈnʏsə ɪst daː ˈɛtvas dʁɪn/',
            exampleDialogue: 'Danke für den Hinweis, dieses Gericht ist komplett nussfrei.',
            wordOrderChunks: ['Ich bin', 'allergisch', 'gegen Nüsse;', 'ist da etwas drin?'],
          },
          es: {
            phrase: 'Soy alérgico a los frutos secos; ¿lleva este plato?',
            clozeSentence: 'Tenga en cuenta que soy alérgico ___ los frutos secos.',
            clozeAnswer: 'a',
            ipa: '/soi aˈleɾxiko a los ˈfɾutos ˈsekos ˈʎeβa ˈeste ˈplato/',
            exampleDialogue: 'No se preocupe, este plato se prepara sin frutos secos.',
            wordOrderChunks: ['Soy alérgico', 'a los frutos secos;', '¿lleva', 'este plato?'],
          },
        },
      },
      {
        id: 'social_my_treat',
        moduleId: 'social_dining',
        cefr: 'B1',
        turkishMeaning: 'Bu tur benden olsun, ısrar ediyorum.',
        turkishTrapTr:
          'Türkçedeki "benden olsun" kelimesi kelimesine "from me" olarak çevrilemez! Doğal ısmarlama kalıpları: EN "on me", DE "geht auf mich", ES "corre por mi cuenta" / "invito yo".',
        contextTagTr: 'Sosyal Nezaket',
        langs: {
          en: {
            phrase: 'This round is on me, I insist.',
            clozeSentence: 'Put your card away — dinner is ___ me tonight.',
            clozeAnswer: 'on',
            ipa: '/ðɪs raʊnd ɪz ɑːn miː aɪ ɪnˈsɪst/',
            exampleDialogue: 'That is so kind of you! Then dessert is on me next time.',
            wordOrderChunks: ['This round', 'is', 'on me,', 'I insist.'],
          },
          de: {
            phrase: 'Das geht heute auf mich, bitte keine Umstände.',
            clozeSentence: 'Lass das Portemonnaie stecken, der Kaffee geht ___ mich.',
            clozeAnswer: 'auf',
            ipa: '/das ɡeːt ˈhɔɪ̯tə aʊ̯f mɪç ˈbɪtə ˈkaɪ̯nə ˈʊmʃtɛndə/',
            exampleDialogue: 'Wie lieb von dir! Beim nächsten Mal revanchiere ich mich.',
            wordOrderChunks: ['Das geht', 'heute', 'auf mich,', 'bitte keine Umstände.'],
          },
          es: {
            phrase: 'Esta ronda corre por mi cuenta, insisto.',
            clozeSentence: 'Guarda la cartera, hoy invito ___.',
            clozeAnswer: 'yo',
            ipa: '/ˈesta ˈronda ˈkore poɾ mi ˈkwenta inˈsisto/',
            exampleDialogue: '¡Muchas gracias! La próxima vez me toca a mí.',
            wordOrderChunks: ['Esta ronda', 'corre', 'por mi cuenta,', 'insisto.'],
          },
        },
      },
      {
        id: 'social_split_bill',
        moduleId: 'social_dining',
        cefr: 'A2',
        turkishMeaning: 'Hesabı bölüşebilir miyiz lütfen?',
        turkishTrapTr:
          'Türkçedeki "ayrı ödeyelim" için "pay different" hatalıdır! İngilizcede "split the bill" (veya "pay separately"), Almancada tek kelime "getrennt zahlen", İspanyolcada "pagar por separado" kullanılır.',
        contextTagTr: 'Ödeme',
        langs: {
          en: {
            phrase: 'Could we split the bill, please?',
            clozeSentence: "We're ready to pay — could we ___ the bill equally?",
            clozeAnswer: 'split',
            ipa: '/kʊd wiː splɪt ðə bɪl pliːz/',
            exampleDialogue: 'Of course, I will bring the card reader right over.',
            wordOrderChunks: ['Could we', 'split', 'the bill,', 'please?'],
          },
          de: {
            phrase: 'Wir möchten bitte getrennt zahlen.',
            clozeSentence: 'Entschuldigung, wir möchten gerne ___ zahlen.',
            clozeAnswer: 'getrennt',
            ipa: '/viːɐ̯ ˈmœçtn̩ ˈbɪtə ɡəˈtʁɛnt ˈtsaːlən/',
            exampleDialogue: 'Kein Problem, wer hatte die Pasta und den Espresso?',
            wordOrderChunks: ['Wir möchten', 'bitte', 'getrennt', 'zahlen.'],
          },
          es: {
            phrase: '¿Podemos pagar por separado, por favor?',
            clozeSentence: '¿Podríamos dividir la cuenta o pagar por ___?',
            clozeAnswer: 'separado',
            ipa: '/poˈðemos paˈɣaɾ poɾ sepaˈɾaðo poɾ faˈβoɾ/',
            exampleDialogue: 'Por supuesto, ¿qué ha pedido cada uno?',
            wordOrderChunks: ['¿Podemos', 'pagar', 'por separado,', 'por favor?'],
          },
        },
      },
      {
        id: 'social_table_for_two',
        moduleId: 'social_dining',
        cefr: 'A2',
        turkishMeaning: 'Cam kenarında iki kişilik bir masanız var mı?',
        turkishTrapTr:
          'Türkçede "iki kişilik masa" sıfat tamlamasıdır ama "two-person table" yapay durur; doğal kalıp "a table for two"dur ("für zwei" / "para dos"). Pencere kenarı için "by the window" ("am Fenster") kullanılır.',
        contextTagTr: 'Masa Rezervasyon',
        langs: {
          en: {
            phrase: 'Do you have a table for two by the window?',
            clozeSentence: "Good evening, we'd love a table ___ two by the window.",
            clozeAnswer: 'for',
            ipa: '/duː juː hæv ə ˈteɪbl fɔːr tuː baɪ ðə ˈwɪndoʊ/',
            exampleDialogue: 'Right this way, we have a lovely spot ready for you.',
            wordOrderChunks: ['Do you have', 'a table for two', 'by the', 'window?'],
          },
          de: {
            phrase: 'Haben Sie einen Tisch für zwei am Fenster?',
            clozeSentence: 'Haben Sie noch einen Tisch für zwei ___ Fenster frei?',
            clozeAnswer: 'am',
            ipa: '/ˈhaːbn̩ ziː ˈaɪ̯nən tɪʃ fyːɐ̯ tsvaɪ̯ am ˈfɛnstɐ/',
            exampleDialogue: 'Ja, folgen Sie mir bitte dorthin in die Ecke.',
            wordOrderChunks: ['Haben Sie', 'einen Tisch', 'für zwei', 'am Fenster?'],
          },
          es: {
            phrase: '¿Tienen una mesa para dos junto a la ventana?',
            clozeSentence: 'Buenas noches, ¿tienen una mesa ___ dos junto a la ventana?',
            clozeAnswer: 'para',
            ipa: '/ˈtjenen ˈuna ˈmesa ˈpaɾa dos ˈxunto a la benˈtana/',
            exampleDialogue: 'Sí, pasen por aquí, esa mesa está libre.',
            wordOrderChunks: ['¿Tienen', 'una mesa', 'para dos', 'junto a la ventana?'],
          },
        },
      },
      {
        id: 'social_catch_up',
        moduleId: 'social_dining',
        cefr: 'B1',
        turkishMeaning: 'Görüşüp hasret gidermeyeli yıllar oldu.',
        turkishTrapTr:
          'Türkçedeki "-meyeli ... oldu" yapısı için "It became long time we didn\'t see" kurmak yanlıştır! Doğrusu "It\'s been ages since we last caught up" ("since" ardındaki olay Past Simple alır!). Almanca "ewig nicht mehr gesehen", İspanyolca "hace muchísimo tiempo que no nos vemos" kullanır.',
        contextTagTr: 'Sıcak Karşılama',
        langs: {
          en: {
            phrase: "It's been ages since we last caught up.",
            clozeSentence: "It's been ages ___ we properly caught up over coffee.",
            clozeAnswer: 'since',
            ipa: '/ɪts bɪn ˈeɪdʒɪz sɪns wiː læst kɔːt ʌp/',
            exampleDialogue: 'Way too long! Tell me everything that has happened this year.',
            wordOrderChunks: ["It's been", 'ages', 'since we last', 'caught up.'],
          },
          de: {
            phrase: 'Wir haben uns ja ewig nicht mehr gesehen.',
            clozeSentence: 'Mensch, wir haben uns ___ lange nicht mehr gesehen!',
            clozeAnswer: 'so',
            ipa: '/viːɐ̯ ˈhaːbn̩ ʊns jaː ˈeːvɪç nɪçt meːɐ̯ ɡəˈzeːən/',
            exampleDialogue: 'Echt wahr! Komm, erzähl, wie es dir inzwischen ergangen ist.',
            wordOrderChunks: ['Wir haben uns', 'ja ewig', 'nicht mehr', 'gesehen.'],
          },
          es: {
            phrase: 'Hace muchísimo tiempo que no nos vemos.',
            clozeSentence: '¡Qué alegría! Hace ___ tiempo que no nos vemos.',
            clozeAnswer: 'mucho',
            ipa: '/ˈaθe muˈtʃisimo ˈtjempo ke no nos ˈbemos/',
            exampleDialogue: '¡Ya lo creo! Tenemos que ponernos al día hoy mismo.',
            wordOrderChunks: ['Hace', 'muchísimo tiempo', 'que no', 'nos vemos.'],
          },
        },
      },
      {
        id: 'social_delicious',
        moduleId: 'social_dining',
        cefr: 'A2',
        turkishMeaning: 'Her şey çok lezzetliydi, çok teşekkürler.',
        turkishTrapTr:
          'Türkçedeki "ellerinize sağlık" kelimesi kelimesine "health to your hands" diye çevrilmez! Doğal takdir: EN "Everything was delicious", DE "Es hat hervorragend geschmeckt", ES "Estaba todo buenísimo" (İspanyolcada yemek tadı için "ser" değil mutlaka "estar" kullanılır!).',
        contextTagTr: 'Teşekkür & Övgü',
        langs: {
          en: {
            phrase: 'Everything was delicious, thank you so much.',
            clozeSentence: 'Compliments to the chef — everything was ___.',
            clozeAnswer: 'delicious',
            ipa: '/ˈevriθɪŋ wʌz dɪˈlɪʃəs θæŋk juː soʊ mʌtʃ/',
            exampleDialogue: 'I am so glad you enjoyed it! Hope to see you again soon.',
            wordOrderChunks: ['Everything', 'was delicious,', 'thank you', 'so much.'],
          },
          de: {
            phrase: 'Es hat wirklich hervorragend geschmeckt.',
            clozeSentence: 'Vielen Dank, das ganze Essen hat ___ geschmeckt.',
            clozeAnswer: 'hervorragend',
            ipa: '/ɛs hat ˈvɪʁklɪç hɛɐ̯ˈfoːɐ̯ʁaːɡn̩t ɡəˈʃmɛkt/',
            exampleDialogue: 'Das gebe ich sehr gerne an unsere Küche weiter!',
            wordOrderChunks: ['Es hat', 'wirklich', 'hervorragend', 'geschmeckt.'],
          },
          es: {
            phrase: 'Estaba todo buenísimo, muchas gracias.',
            clozeSentence: 'De verdad, el plato principal ___ buenísimo.',
            clozeAnswer: 'estaba',
            ipa: '/esˈtaβa ˈtoðo bweˈnisimo ˈmutʃas ˈɡɾaθjas/',
            exampleDialogue: '¡Cuánto me alegro! Se lo diré enseguida al cocinero.',
            wordOrderChunks: ['Estaba', 'todo buenísimo,', 'muchas', 'gracias.'],
          },
        },
      },
      {
        id: 'social_free_weekend',
        moduleId: 'social_dining',
        cefr: 'B1',
        turkishMeaning: 'Bu cumartesi akşamı müsait misin?',
        turkishTrapTr:
          'Türkçedeki "boş musun" sorusunda insan için "Are you empty?" demek hatalı ve komik olur ("empty" nesne içindir)! İnsan için EN "free / available", ES "estar libre" ("ser libre" özgür olmak demektir, müsaitlik için "estar"!), DE "etwas vorhaben" kalıbı kullanılır.',
        contextTagTr: 'Buluşma Planı',
        langs: {
          en: {
            phrase: 'Are you free this Saturday evening?',
            clozeSentence: "Let me know if you're ___ to grab dinner on Saturday.",
            clozeAnswer: 'free',
            ipa: '/ɑːr juː friː ðɪs ˈsætərdeɪ ˈiːvnɪŋ/',
            exampleDialogue: 'I am! Should we try that new place near the river?',
            wordOrderChunks: ['Are you', 'free', 'this Saturday', 'evening?'],
          },
          de: {
            phrase: 'Hast du am Samstagabend schon etwas vor?',
            clozeSentence: 'Hast du am Samstag Zeit oder ___ du schon etwas vor?',
            clozeAnswer: 'hast',
            ipa: '/hast duː am ˈzamstaːkˌaːbn̩t ʃoːn ˈɛtvas foːɐ̯/',
            exampleDialogue: 'Noch nichts Konkretes — wollen wir etwas unternehmen?',
            wordOrderChunks: ['Hast du', 'am Samstagabend', 'schon etwas', 'vor?'],
          },
          es: {
            phrase: '¿Estás libre este sábado por la tarde?',
            clozeSentence: '¿___ libre este sábado para cenar por el centro?',
            clozeAnswer: 'Estás',
            ipa: '/esˈtas ˈliβɾe ˈeste ˈsaβaðo poɾ la ˈtaɾðe/',
            exampleDialogue: 'Sí, a partir de las siete estoy completamente libre.',
            wordOrderChunks: ['¿Estás', 'libre', 'este sábado', 'por la tarde?'],
          },
        },
      },
    ],
  },
  {
    id: 'idioms_debate',
    order: 6,
    titleTr: 'Fikir Belirtme, Deyimler & Phrasal Verbs',
    subtitleTr: 'Fikrini incelikle savun, yapıcı itiraz et ve gerçek deyimleri ustaca kullan',
    icon: '🎯',
    cefrRange: 'B1–B2',
    accentHex: '#14b8a6',
    items: [
      {
        id: 'idioms_polite_disagree',
        moduleId: 'idioms_debate',
        cefr: 'B2',
        turkishMeaning: 'Bakış açını anlıyorum ama biraz farklı görüyorum.',
        turkishTrapTr:
          'Tartışmada doğrudan "I am not agree" demek hem gramer hatasıdır ("agree" fiildir) hem de fazla sert tınlar. Önce karşı tarafı onaylayıp yumuşak geçiş yapın: EN "I see your point, though...", DE "Ich verstehe deinen Punkt, sehe es aber...", ES "Entiendo tu postura, aunque...".',
        contextTagTr: 'Yapıcı İtiraz',
        langs: {
          en: {
            phrase: 'I see your point, though I see it differently.',
            clozeSentence: 'I see your ___, though I have a slightly different view.',
            clozeAnswer: 'point',
            ipa: '/aɪ siː jʊr pɔɪnt ðoʊ aɪ siː ɪt ˈdɪfrəntli/',
            exampleDialogue: 'Fair enough — tell me how you would approach it.',
            wordOrderChunks: ['I see', 'your point,', 'though I see it', 'differently.'],
          },
          de: {
            phrase: 'Ich verstehe deinen Punkt, sehe es aber etwas anders.',
            clozeSentence: 'Ich verstehe deinen Standpunkt, ___ es aber etwas anders.',
            clozeAnswer: 'sehe',
            ipa: '/ɪç fɛɐ̯ˈʃteːə ˈdaɪ̯nən pʊŋkt ˈzeːə ɛs ˈaːbɐ ˈɛtvas ˈandɐs/',
            exampleDialogue: 'Spannend, wie würdest du das Ganze denn angehen?',
            wordOrderChunks: ['Ich verstehe', 'deinen Punkt,', 'sehe es aber', 'etwas anders.'],
          },
          es: {
            phrase: 'Entiendo tu postura, aunque lo veo distinto.',
            clozeSentence: 'Entiendo tu punto de vista, ___ lo veo distinto.',
            clozeAnswer: 'aunque',
            ipa: '/enˈtjendo tu posˈtuɾa ˈauŋke lo ˈbeo disˈtinto/',
            exampleDialogue: 'Interesante, me gustaría escuchar tu alternativa.',
            wordOrderChunks: ['Entiendo', 'tu postura,', 'aunque lo veo', 'distinto.'],
          },
        },
      },
      {
        id: 'idioms_figure_out',
        moduleId: 'idioms_debate',
        cefr: 'B1',
        turkishMeaning: 'Bunu birlikte çözeceğiz.',
        turkishTrapTr:
          'Phrasal verb "figure out" zamirle ("it") kullanıldığında zamir MUTLAKA ortaya girer: "figure it out" ("figure out it" yanlıştır!). Almancada ayrılabilen fiil "herausfinden" ön eki sona atar; İspanyolcada "lo" fiil önünde yer alır.',
        contextTagTr: 'Problem Çözme',
        langs: {
          en: {
            phrase: 'We will figure it out together.',
            clozeSentence: "Don't stress, we'll ___ it out before the deadline.",
            clozeAnswer: 'figure',
            ipa: '/wiː wɪl ˈfɪɡjər ɪt aʊt təˈɡeðər/',
            exampleDialogue: 'Thanks, having a second pair of eyes always helps.',
            wordOrderChunks: ['We will', 'figure', 'it out', 'together.'],
          },
          de: {
            phrase: 'Wir finden das gemeinsam heraus.',
            clozeSentence: 'Keine Sorge, wir finden die Lösung gemeinsam ___.',
            clozeAnswer: 'heraus',
            ipa: '/viːɐ̯ ˈfɪndn̩ das ɡəˈmaɪ̯nzaːm hɛˈʁaʊ̯s/',
            exampleDialogue: 'Danke, zu zweit lösen wir das bestimmt schneller.',
            wordOrderChunks: ['Wir finden', 'das', 'gemeinsam', 'heraus.'],
          },
          es: {
            phrase: 'Lo resolveremos juntos, no te preocupes.',
            clozeSentence: 'Estoy seguro de que lo ___ juntos hoy.',
            clozeAnswer: 'resolveremos',
            ipa: '/lo resolβeˈɾemos ˈxuntos no te pɾeoˈkupes/',
            exampleDialogue: 'Gracias por tu apoyo, así da gusto trabajar.',
            wordOrderChunks: ['Lo resolveremos', 'juntos,', 'no te', 'preocupes.'],
          },
        },
      },
      {
        id: 'idioms_in_my_opinion',
        moduleId: 'idioms_debate',
        cefr: 'B1',
        turkishMeaning: 'Bence bu uzun vadede daha iyi çalışır.',
        turkishTrapTr:
          'Türkçedeki "bana göre" yüzünden İngilizcede "According to me" deme tuzağına düşmeyin! "According to" yalnızca başkalarının görüşü/raporlar için kullanılır; kendi fikrinizde "In my opinion" gerekir. Almancada başa gelen "Meiner Meinung nach" ardından fiili hemen 2. sıraya çeker!',
        contextTagTr: 'Görüş Bildirme',
        langs: {
          en: {
            phrase: 'In my opinion, this works better long-term.',
            clozeSentence: 'In my ___, a simpler design scales better long-term.',
            clozeAnswer: 'opinion',
            ipa: '/ɪn maɪ əˈpɪnjən ðɪs wɜːrks ˈbetər ˈlɔːŋtɜːrm/',
            exampleDialogue: 'I see why you think that — maintenance costs drop too.',
            wordOrderChunks: ['In my opinion,', 'this works', 'better', 'long-term.'],
          },
          de: {
            phrase: 'Meiner Meinung nach funktioniert das langfristig besser.',
            clozeSentence: 'Meiner Meinung ___ ist dieser Ansatz deutlich nachhaltiger.',
            clozeAnswer: 'nach',
            ipa: '/ˈmaɪ̯nɐ ˈmaɪ̯nʊŋ naːx fʊŋktsjoˈniːɐ̯t das ˈlaŋfʁɪstɪç ˈbɛsɐ/',
            exampleDialogue: 'Das stimmt, auf lange Sicht sparen wir damit viel Aufwand.',
            wordOrderChunks: ['Meiner Meinung nach', 'funktioniert das', 'langfristig', 'besser.'],
          },
          es: {
            phrase: 'En mi opinión, esto funciona mejor a largo plazo.',
            clozeSentence: 'En mi ___, este enfoque es más sólido a largo plazo.',
            clozeAnswer: 'opinión',
            ipa: '/en mi opiˈnjon ˈesto funˈθjona meˈxoɾ a ˈlaɾɣo ˈplaθo/',
            exampleDialogue: 'Tiene sentido, sobre todo si pensamos en el próximo año.',
            wordOrderChunks: ['En mi opinión,', 'esto funciona', 'mejor', 'a largo plazo.'],
          },
        },
      },
      {
        id: 'idioms_silver_lining',
        moduleId: 'idioms_debate',
        cefr: 'B2',
        turkishMeaning: 'Her işte bir hayır / olumlu bir yön vardır.',
        turkishTrapTr:
          'Kültürel deyimler kelime kelimesine çevrilemez ("every job has a good" anlam vermez!). İngilizcede "silver lining", Almancada "auch sein Gutes haben", İspanyolcada ise "No hay mal que por bien no venga" kalıplaşmış deyimlerdir.',
        contextTagTr: 'Moral & Deyim',
        langs: {
          en: {
            phrase: 'Every setback has a silver lining.',
            clozeSentence: "It's frustrating now, but every cloud has a silver ___.",
            clozeAnswer: 'lining',
            ipa: '/ˈevri ˈsetbæk hæz ə ˈsɪlvər ˈlaɪnɪŋ/',
            exampleDialogue: 'True — at least we spotted the flaw before the big launch.',
            wordOrderChunks: ['Every setback', 'has', 'a silver', 'lining.'],
          },
          de: {
            phrase: 'Alles im Leben hat auch sein Gutes.',
            clozeSentence: 'Kopf hoch, am Ende hat fast alles ___ Gutes.',
            clozeAnswer: 'sein',
            ipa: '/ˈaləs ɪm ˈleːbn̩ hat aʊ̯x zaɪ̯n ˈɡuːtəs/',
            exampleDialogue: 'Stimmt, so konnten wir den Fehler wenigstens früh abfangen.',
            wordOrderChunks: ['Alles im Leben', 'hat auch', 'sein', 'Gutes.'],
          },
          es: {
            phrase: 'No hay mal que por bien no venga.',
            clozeSentence: 'Al final siempre dicen que no hay mal que por bien no ___.',
            clozeAnswer: 'venga',
            ipa: '/no ai mal ke poɾ bjen no ˈbeŋɡa/',
            exampleDialogue: 'Es verdad, gracias a ese retraso mejoramos la propuesta.',
            wordOrderChunks: ['No hay mal', 'que', 'por bien', 'no venga.'],
          },
        },
      },
      {
        id: 'idioms_call_it_a_day',
        moduleId: 'idioms_debate',
        cefr: 'B2',
        turkishMeaning: 'Bugünlük bu kadar yeter, yarına devam edelim.',
        turkishTrapTr:
          'Türkçedeki "bugünlük kapatalım" için "close the day" denmez! İngilizcede çalışma/işi bitirme deyimi "call it a day", Almancada "Feierabend machen", İspanyolcada "dejarlo por hoy" şeklindedir.',
        contextTagTr: 'Çalışma Temposu',
        langs: {
          en: {
            phrase: "Let's call it a day and continue tomorrow.",
            clozeSentence: "We've made solid progress; let's ___ it a day.",
            clozeAnswer: 'call',
            ipa: '/lets kɔːl ɪt ə deɪ ænd kənˈtɪnjuː təˈmɑːroʊ/',
            exampleDialogue: 'Sounds good to me — fresh eyes tomorrow morning!',
            wordOrderChunks: ["Let's call", 'it a day', 'and continue', 'tomorrow.'],
          },
          de: {
            phrase: 'Machen wir für heute Feierabend.',
            clozeSentence: 'Es ist schon spät geworden, machen wir für heute ___.',
            clozeAnswer: 'Feierabend',
            ipa: '/ˈmaxn̩ viːɐ̯ fyːɐ̯ ˈhɔɪ̯tə ˈfaɪ̯ɐˌaːbn̩t/',
            exampleDialogue: 'Gute Idee, morgen früh arbeiten wir ausgeruht weiter.',
            wordOrderChunks: ['Machen wir', 'für', 'heute', 'Feierabend.'],
          },
          es: {
            phrase: 'Dejémoslo por hoy y seguimos mañana.',
            clozeSentence: 'Hemos avanzado bastante, mejor lo ___ por hoy.',
            clozeAnswer: 'dejamos',
            ipa: '/deˈxemoslo poɾ oi i seˈɣimos maˈɲana/',
            exampleDialogue: 'Sí, mañana con la mente fresca lo terminamos rápido.',
            wordOrderChunks: ['Dejémoslo', 'por hoy', 'y seguimos', 'mañana.'],
          },
        },
      },
      {
        id: 'idioms_bring_up',
        moduleId: 'idioms_debate',
        cefr: 'B2',
        turkishMeaning: 'Bu konuyu gündeme getirdiğine sevindim.',
        turkishTrapTr:
          'Türkçedeki "konuyu açmak" deyince "open this topic" kurulur; ancak doğal phrasal verb "bring up"tır! Ayrıca "glad for you brought" değil, "for" olmadan "glad you brought that up" denir. Almancada "ansprechen", İspanyolcada "sacar el tema" (+ Subjuntivo "hayas sacado") kullanılır.',
        contextTagTr: 'Tartışma Yönetimi',
        langs: {
          en: {
            phrase: "I'm glad you brought that up.",
            clozeSentence: "That's an important point — I'm glad you ___ it up.",
            clozeAnswer: 'brought',
            ipa: '/aɪm ɡlæd juː brɔːt ðæt ʌp/',
            exampleDialogue: 'I felt we should clarify it before signing the contract.',
            wordOrderChunks: ["I'm glad", 'you', 'brought that', 'up.'],
          },
          de: {
            phrase: 'Gut, dass du das angesprochen hast.',
            clozeSentence: 'Danke, dass du diesen wichtigen Punkt ___ hast.',
            clozeAnswer: 'angesprochen',
            ipa: '/ɡuːt das duː das ˈanɡəʃpʁɔxn̩ hast/',
            exampleDialogue: 'Ich dachte, wir sollten das vorab sauber klären.',
            wordOrderChunks: ['Gut,', 'dass du das', 'angesprochen', 'hast.'],
          },
          es: {
            phrase: 'Me alegro de que hayas sacado este tema.',
            clozeSentence: 'Es un detalle clave; me alegro de que ___ este tema.',
            clozeAnswer: 'saques',
            ipa: '/me aˈleɣɾo de ke ˈaʝas saˈkaðo ˈeste ˈtema/',
            exampleDialogue: 'Prefería comentarlo ahora antes de cerrar el acuerdo.',
            wordOrderChunks: ['Me alegro', 'de que hayas', 'sacado', 'este tema.'],
          },
        },
      },
      {
        id: 'idioms_pros_and_cons',
        moduleId: 'idioms_debate',
        cefr: 'B1',
        turkishMeaning: 'Artıları ve eksileri dikkatlice tartalım.',
        turkishTrapTr:
          'Türkçedeki "artılar ve eksiler" ifadesi "pluses and minuses" diye çevrilmez! Doğal kalıplar: EN "pros and cons", DE "Vor- und Nachteile", ES eril artikelle "los pros y los contras".',
        contextTagTr: 'Analiz & Değerlendirme',
        langs: {
          en: {
            phrase: 'Let us weigh the pros and cons carefully.',
            clozeSentence: 'Before deciding, let us list all the ___ and cons.',
            clozeAnswer: 'pros',
            ipa: '/lets weɪ ðə proʊz ænd kɑːnz ˈkerfəli/',
            exampleDialogue: 'Agreed — let us draw two columns on the whiteboard.',
            wordOrderChunks: ['Let us weigh', 'the pros', 'and cons', 'carefully.'],
          },
          de: {
            phrase: 'Wägen wir die Vor- und Nachteile genau ab.',
            clozeSentence: 'Wir müssen alle Vor- und ___ sorgfältig abwägen.',
            clozeAnswer: 'Nachteile',
            ipa: '/ˈvɛːɡn̩ viːɐ̯ diː foːɐ̯ ʊnt ˈnaːxtaɪ̯lə ɡəˈnaʊ̯ ap/',
            exampleDialogue: 'Gute Idee, schreiben wir beides direkt nebeneinander.',
            wordOrderChunks: ['Wägen wir', 'die Vor-', 'und Nachteile', 'genau ab.'],
          },
          es: {
            phrase: 'Sopesemos con calma los pros y los contras.',
            clozeSentence: 'Antes de elegir, hay que analizar los pros y los ___.',
            clozeAnswer: 'contras',
            ipa: '/sopeˈsemos koŋ ˈkalma los pɾos i los ˈkontɾas/',
            exampleDialogue: 'Sí, hagamos una lista rápida antes de votar.',
            wordOrderChunks: ['Sopesemos', 'con calma', 'los pros', 'y los contras.'],
          },
        },
      },
      {
        id: 'idioms_put_off',
        moduleId: 'idioms_debate',
        cefr: 'B1',
        turkishMeaning: 'Zor kararları ertelememeliyiz.',
        turkishTrapTr:
          '"Put off" (ertelemek) ile "put out" (söndürmek) çok sık karışır! Görev veya konuşma ertelemek için "put off" çok doğaldır; Almancada "aufschieben", İspanyolcada "posponer" karşılık gelir.',
        contextTagTr: 'Önceliklendirme',
        langs: {
          en: {
            phrase: "We shouldn't put off tough decisions.",
            clozeSentence: "Don't ___ off difficult talks until the last minute.",
            clozeAnswer: 'put',
            ipa: '/wiː ˈʃʊdnt pʊt ɔːf tʌf dɪˈsɪʒənz/',
            exampleDialogue: 'You are right, tackling it early saves everyone stress.',
            wordOrderChunks: ["We shouldn't", 'put off', 'tough', 'decisions.'],
          },
          de: {
            phrase: 'Wir sollten schwierige Entscheidungen nicht aufschieben.',
            clozeSentence: 'Man sollte unangenehme Gespräche nicht ewig ___.',
            clozeAnswer: 'aufschieben',
            ipa: '/viːɐ̯ ˈzɔltn̩ ˈʃviːʁɪɡə ɛntˈʃaɪ̯dʊŋən nɪçt ˈaʊ̯fʃiːbn̩/',
            exampleDialogue: 'Genau, je früher wir das klären, desto ruhiger wird es.',
            wordOrderChunks: ['Wir sollten', 'schwierige Entscheidungen', 'nicht', 'aufschieben.'],
          },
          es: {
            phrase: 'No deberíamos posponer las decisiones difíciles.',
            clozeSentence: 'No conviene ___ las conversaciones complicadas para luego.',
            clozeAnswer: 'posponer',
            ipa: '/no deβeˈɾiamos pospoˈneɾ las deθiˈsjones diˈfiθiles/',
            exampleDialogue: 'Tienes razón, es mejor resolverlo cuanto antes.',
            wordOrderChunks: ['No deberíamos', 'posponer', 'las decisiones', 'difíciles.'],
          },
        },
      },
      {
        id: 'idioms_would_rather',
        moduleId: 'idioms_debate',
        cefr: 'B2',
        turkishMeaning: 'Toplantıyı kısa tutmayı tercih ederim.',
        turkishTrapTr:
          'Türkçedeki "-meyi tercih ederim" yüzünden İngilizcede "I\'d rather to keep" hatası çok sık görülür! "would rather" arkasından ASLA "to" almaz, yalın fiil ("keep") gelir. Almancada "lieber", İspanyolcada "preferiría" + mastar ("mantener") kullanılır.',
        contextTagTr: 'Tercih Belirtme',
        langs: {
          en: {
            phrase: "I'd rather keep the meeting short.",
            clozeSentence: "Honestly, I'd rather ___ the meeting under twenty minutes.",
            clozeAnswer: 'keep',
            ipa: '/aɪd ˈræðər kiːp ðə ˈmiːtɪŋ ʃɔːrt/',
            exampleDialogue: 'Same here, let us jump straight to the main blocker.',
            wordOrderChunks: ["I'd rather", 'keep', 'the meeting', 'short.'],
          },
          de: {
            phrase: 'Ich würde das Treffen lieber kurz halten.',
            clozeSentence: 'Ich würde das Gespräch ___ auf zwanzig Minuten begrenzen.',
            clozeAnswer: 'lieber',
            ipa: '/ɪç ˈvʏʁdə das ˈtʁɛfn̩ ˈliːbɐ kʊʁts ˈhaltn̩/',
            exampleDialogue: 'Einverstanden, kommen wir direkt zum wichtigsten Punkt.',
            wordOrderChunks: ['Ich würde', 'das Treffen', 'lieber kurz', 'halten.'],
          },
          es: {
            phrase: 'Preferiría mantener la reunión breve.',
            clozeSentence: 'Si os parece bien, ___ ir directo al grano hoy.',
            clozeAnswer: 'preferiría',
            ipa: '/pɾefeɾiˈɾia manteˈneɾ la reuˈnjon ˈbɾeβe/',
            exampleDialogue: 'Por mí perfecto, así volvemos pronto al trabajo.',
            wordOrderChunks: ['Preferiría', 'mantener', 'la reunión', 'breve.'],
          },
        },
      },
      {
        id: 'idioms_hit_the_nail',
        moduleId: 'idioms_debate',
        cefr: 'B2',
        turkishMeaning: 'Tam isabet ettin, asıl mesele bu.',
        turkishTrapTr:
          'Türkçedeki "on ikiden vurdun" deyimi başka dillere kelimesi kelimesine çevrilemez. Üç dilde de marangozluk metaforu ortaktır: EN "hit the nail on the head", DE "den Nagel auf den Kopf treffen", ES "dar en el clavo"!',
        contextTagTr: 'Tam İsabet',
        langs: {
          en: {
            phrase: 'You hit the nail on the head.',
            clozeSentence: 'Exactly — you hit the ___ on the head with that point.',
            clozeAnswer: 'nail',
            ipa: '/juː hɪt ðə neɪl ɑːn ðə hed/',
            exampleDialogue: 'Glad we finally named the real issue out loud.',
            wordOrderChunks: ['You hit', 'the nail', 'on the', 'head.'],
          },
          de: {
            phrase: 'Damit hast du den Nagel auf den Kopf getroffen.',
            clozeSentence: 'Genau das ist es — du hast den Nagel auf den ___ getroffen.',
            clozeAnswer: 'Kopf',
            ipa: '/daˈmɪt hast duː deːn ˈnaːɡl̩ aʊ̯f deːn kɔpf ɡəˈtʁɔfn̩/',
            exampleDialogue: 'Gut, dass wir das endlich offen ausgesprochen haben.',
            wordOrderChunks: ['Damit hast du', 'den Nagel', 'auf den Kopf', 'getroffen.'],
          },
          es: {
            phrase: 'Has dado justo en el clavo.',
            clozeSentence: 'Totalmente de acuerdo, has dado justo en el ___.',
            clozeAnswer: 'clavo',
            ipa: '/as ˈdaðo ˈxusto en el ˈklaβo/',
            exampleDialogue: 'Me alegra que por fin pongamos el problema sobre la mesa.',
            wordOrderChunks: ['Has dado', 'justo', 'en el', 'clavo.'],
          },
        },
      },
    ],
  },
{
  "id": "academic_reasoning",
  "order": 7,
  "titleTr": "Akademik Sunum, Veri Yorumlama ve Kanıt Gösterme",
  "subtitleTr": "Toplantı ve makalelerde veriye dayanarak neden-sonuç ve çıkarım kur",
  "icon": "07",
  "cefrRange": "B1–B2",
  "accentHex": "#2563eb",
  "items": [
    {
      "id": "acad_data_suggests",
      "moduleId": "academic_reasoning",
      "cefr": "B2",
      "turkishMeaning": "Veriler bu hipotezi güçlü biçimde destekliyor.",
      "turkishTrapTr": "\"Data\" akademik İngilizcede sıklıkla çoğul veya tekil kütle olarak kullanılır ama \"prove\" yerine temkinli akademik fiil \"suggest / support\" tercih edilir.",
      "contextTagTr": "Veri Analizi",
      "langs": {
        "en": {
          "phrase": "The data strongly supports this hypothesis.",
          "clozeSentence": "The data strongly ___ this hypothesis.",
          "clozeAnswer": "supports",
          "ipa": "/ðə ˈdeɪtə ˈstrɒŋli səˈpɔːrts ðɪs haɪˈpɒθəsɪs/",
          "exampleDialogue": "Agreed, the sample size is large enough now.",
          "wordOrderChunks": [
            "The data",
            "strongly supports",
            "this",
            "hypothesis."
          ]
        },
        "de": {
          "phrase": "Die Daten stützen diese Hypothese eindeutig.",
          "clozeSentence": "Die Daten ___ diese Hypothese eindeutig.",
          "clozeAnswer": "stützen",
          "ipa": "/diː ˈdaːtn̩ ˈʃtʏtsn̩ ˈdiːzə hypoˈteːzə ˈaɪ̯ndɔʏ̯tɪç/",
          "exampleDialogue": "Ja, die Stichprobe ist endlich groß genug.",
          "wordOrderChunks": [
            "Die Daten",
            "stützen",
            "diese Hypothese",
            "eindeutig."
          ]
        },
        "es": {
          "phrase": "Los datos respaldan claramente esta hipótesis.",
          "clozeSentence": "Los datos ___ claramente esta hipótesis.",
          "clozeAnswer": "respaldan",
          "ipa": "/los ˈðatos resˈpaldan klaɾaˈmente ˈesta iˈpotesis/",
          "exampleDialogue": "Exacto, la muestra ya es bastante amplia.",
          "wordOrderChunks": [
            "Los datos",
            "respaldan",
            "claramente",
            "esta hipótesis."
          ]
        }
      }
    },
    {
      "id": "acad_take_into_account",
      "moduleId": "academic_reasoning",
      "cefr": "B2",
      "turkishMeaning": "Mevsimsel etkileri de hesaba katmalıyız.",
      "turkishTrapTr": "\"Hesaba katmak\" için \"*count into account\" değil, \"take into account\" veya Almanca \"berücksichtigen\", İspanyolca \"tener en cuenta\" kullanılır.",
      "contextTagTr": "Metodoloji",
      "langs": {
        "en": {
          "phrase": "We must also take seasonal effects into account.",
          "clozeSentence": "We must also ___ seasonal effects into account.",
          "clozeAnswer": "take",
          "ipa": "/wi mʌst ˈɔːlsoʊ teɪk ˈsiːzənəl ɪˈfekts ˈɪntu əˈkaʊnt/",
          "exampleDialogue": "Good catch, summer traffic always skews the baseline.",
          "wordOrderChunks": [
            "We must also",
            "take",
            "seasonal effects",
            "into account."
          ]
        },
        "de": {
          "phrase": "Wir müssen auch saisonale Effekte berücksichtigen.",
          "clozeSentence": "Wir müssen auch saisonale Effekte ___.",
          "clozeAnswer": "berücksichtigen",
          "ipa": "/viːɐ̯ ˈmʏsn̩ aʊ̯x zɛzoˈnaːlə ɛˈfɛktə bəˈʁʏkzɪçtɪɡn̩/",
          "exampleDialogue": "Stimmt, der Sommer verzerrt sonst den Vergleich.",
          "wordOrderChunks": [
            "Wir müssen",
            "auch",
            "saisonale Effekte",
            "berücksichtigen."
          ]
        },
        "es": {
          "phrase": "También debemos tener en cuenta los efectos estacionales.",
          "clozeSentence": "También debemos tener en ___ los efectos estacionales.",
          "clozeAnswer": "cuenta",
          "ipa": "/tamˈbjen deˈβemos teˈneɾ en ˈkwenta los eˈfektos estaθjoˈnales/",
          "exampleDialogue": "Tienes razón, el verano siempre altera la media.",
          "wordOrderChunks": [
            "También debemos",
            "tener en cuenta",
            "los efectos",
            "estacionales."
          ]
        }
      }
    },
    {
      "id": "acad_contrary_to",
      "moduleId": "academic_reasoning",
      "cefr": "B2",
      "turkishMeaning": "Yaygın inanışın aksine sonuçlar oldukça tutarlı.",
      "turkishTrapTr": "\"Aksine\" derken \"*Opposite to\" yerine sabit kalıp \"Contrary to popular belief\" / DE \"Entgegen\" (+ Dativ) / ES \"En contra de lo que se cree\" kullanılır.",
      "contextTagTr": "Argüman",
      "langs": {
        "en": {
          "phrase": "Contrary to popular belief, the results are consistent.",
          "clozeSentence": "___ to popular belief, the results are consistent.",
          "clozeAnswer": "Contrary",
          "ipa": "/ˈkɒntrəri tə ˈpɒpjələr bɪˈliːf ðə rɪˈzʌlts ɑːr kənˈsɪstənt/",
          "exampleDialogue": "That really challenges our earlier assumptions.",
          "wordOrderChunks": [
            "Contrary to",
            "popular belief,",
            "the results",
            "are consistent."
          ]
        },
        "de": {
          "phrase": "Entgegen der gängigen Meinung sind die Ergebnisse stabil.",
          "clozeSentence": "___ der gängigen Meinung sind die Ergebnisse stabil.",
          "clozeAnswer": "Entgegen",
          "ipa": "/ɛntˈɡeːɡn̩ deːɐ̯ ˈɡɛŋɪɡn̩ ˈmaɪ̯nʊŋ zɪnt diː ɛɐ̯ˈɡeːpnɪsə ʃtaˈbiːl/",
          "exampleDialogue": "Das widerlegt unsere frühere Annahme deutlich.",
          "wordOrderChunks": [
            "Entgegen der",
            "gängigen Meinung",
            "sind die Ergebnisse",
            "stabil."
          ]
        },
        "es": {
          "phrase": "En contra de lo que se cree, los resultados son sólidos.",
          "clozeSentence": "En ___ de lo que se cree, los resultados son sólidos.",
          "clozeAnswer": "contra",
          "ipa": "/en ˈkontɾa ðe lo ke se ˈkɾee los resulˈtaðos son ˈsoliðos/",
          "exampleDialogue": "Eso cambia por completo nuestra suposición inicial.",
          "wordOrderChunks": [
            "En contra de",
            "lo que se cree,",
            "los resultados",
            "son sólidos."
          ]
        }
      }
    },
    {
      "id": "acad_draw_conclusion",
      "moduleId": "academic_reasoning",
      "cefr": "B2",
      "turkishMeaning": "Kesin bir sonuca varmak için henüz çok erken.",
      "turkishTrapTr": "Türkçede \"sonuca varmak\" fiili İngilizcede \"*arrive a conclusion\" değil, eşdizimli \"draw a conclusion\" veya \"jump to conclusions\" ile kurulur.",
      "contextTagTr": "Çıkarım",
      "langs": {
        "en": {
          "phrase": "It is still too early to draw a firm conclusion.",
          "clozeSentence": "It is still too early to ___ a firm conclusion.",
          "clozeAnswer": "draw",
          "ipa": "/ɪt ɪz stɪl tuː ˈɜːrli tə drɔː ə fɜːrm kənˈkluːʒən/",
          "exampleDialogue": "Let us run one more controlled trial first.",
          "wordOrderChunks": [
            "It is still",
            "too early",
            "to draw",
            "a firm conclusion."
          ]
        },
        "de": {
          "phrase": "Es ist noch zu früh, um ein festes Fazit zu ziehen.",
          "clozeSentence": "Es ist noch zu früh, um ein festes Fazit zu ___.",
          "clozeAnswer": "ziehen",
          "ipa": "/ɛs ɪst nɔx tsuː fʁyː ʊm aɪ̯n ˈfɛstəs ˈfaːtsɪt tsuː ˈtsiːən/",
          "exampleDialogue": "Führen wir lieber noch einen weiteren Testlauf durch.",
          "wordOrderChunks": [
            "Es ist noch",
            "zu früh,",
            "um ein festes Fazit",
            "zu ziehen."
          ]
        },
        "es": {
          "phrase": "Todavía es demasiado pronto para sacar una conclusión firme.",
          "clozeSentence": "Todavía es demasiado pronto para ___ una conclusión firme.",
          "clozeAnswer": "sacar",
          "ipa": "/toðaˈβia es demaˈsjaðo ˈpɾonto ˈpaɾa saˈkaɾ ˈuna konkluˈsjon ˈfiɾme/",
          "exampleDialogue": "Hagamos primero una prueba controlada más.",
          "wordOrderChunks": [
            "Todavía es",
            "demasiado pronto",
            "para sacar",
            "una conclusión firme."
          ]
        }
      }
    },
    {
      "id": "acad_correlation_causation",
      "moduleId": "academic_reasoning",
      "cefr": "B2",
      "turkishMeaning": "İlişki olması nedensellik anlamına gelmez.",
      "turkishTrapTr": "\"Anlamına gelmek\" için \"*does not mean to causation\" değil, doğrudan nesne alan \"imply / equate to\" kullanılır.",
      "contextTagTr": "İstatistik",
      "langs": {
        "en": {
          "phrase": "Correlation does not necessarily imply causation.",
          "clozeSentence": "Correlation does not necessarily ___ causation.",
          "clozeAnswer": "imply",
          "ipa": "/ˌkɒrəˈleɪʃən dʌz nɒt ˌnesəˈserəli ɪmˈplaɪ kɔːˈzeɪʃən/",
          "exampleDialogue": "Exactly, a third variable could explain both trends.",
          "wordOrderChunks": [
            "Correlation",
            "does not",
            "necessarily imply",
            "causation."
          ]
        },
        "de": {
          "phrase": "Korrelation bedeutet nicht zwangsläufig Kausalität.",
          "clozeSentence": "Korrelation ___ nicht zwangsläufig Kausalität.",
          "clozeAnswer": "bedeutet",
          "ipa": "/kɔʁelaˈtsjoːn bəˈdɔʏ̯tət nɪçt ˈtsvaŋslɔʏ̯fɪç kaʊ̯zaliˈtɛːt/",
          "exampleDialogue": "Genau, ein dritter Faktor könnte beides erklären.",
          "wordOrderChunks": [
            "Korrelation",
            "bedeutet",
            "nicht zwangsläufig",
            "Kausalität."
          ]
        },
        "es": {
          "phrase": "La correlación no implica necesariamente causalidad.",
          "clozeSentence": "La correlación no ___ necesariamente causalidad.",
          "clozeAnswer": "implica",
          "ipa": "/la korelaˈθjon no imˈplika neθesaɾjaˈmente kawsaliˈðað/",
          "exampleDialogue": "Claro, un tercer factor podría explicar ambas curvas.",
          "wordOrderChunks": [
            "La correlación",
            "no implica",
            "necesariamente",
            "causalidad."
          ]
        }
      }
    }
  ]
},
{
  "id": "health_emergencies",
  "order": 8,
  "titleTr": "Sağlık, Eczane, Acil Durum ve Resmi Kurum İşlemleri",
  "subtitleTr": "Yurt dışında doktor muayenesinde, eczanede ve resmi dairede derdini eksiksiz anlat",
  "icon": "08",
  "cefrRange": "A2–B1",
  "accentHex": "#dc2626",
  "items": [
    {
      "id": "hlth_sore_throat",
      "moduleId": "health_emergencies",
      "cefr": "A2",
      "turkishMeaning": "Dünden beri boğazım ağrıyor ve ateşim var.",
      "turkishTrapTr": "Belirtiler geçmişten bugüne sürdüğü için İngilizcede \"have had\", Almancada \"habe seit gestern\", İspanyolcada \"tengo ... desde ayer\" kullanılır.",
      "contextTagTr": "Muayene",
      "langs": {
        "en": {
          "phrase": "I have had a sore throat and a fever since yesterday.",
          "clozeSentence": "I have had a ___ throat and a fever since yesterday.",
          "clozeAnswer": "sore",
          "ipa": "/aɪ həv hæd ə sɔːr θroʊt ənd ə ˈfiːvər sɪns ˈjestərdeɪ/",
          "exampleDialogue": "Let me check your temperature and lungs right away.",
          "wordOrderChunks": [
            "I have had",
            "a sore throat",
            "and a fever",
            "since yesterday."
          ]
        },
        "de": {
          "phrase": "Ich habe seit gestern Halsschmerzen und Fieber.",
          "clozeSentence": "Ich habe ___ gestern Halsschmerzen und Fieber.",
          "clozeAnswer": "seit",
          "ipa": "/ɪç ˈhaːbə zaɪ̯t ˈɡɛstɐn ˈhalsʃmɛʁtsn̩ ʊnt ˈfiːbɐ/",
          "exampleDialogue": "Ich messe sofort Fieber und höre Ihre Lunge ab.",
          "wordOrderChunks": [
            "Ich habe",
            "seit gestern",
            "Halsschmerzen",
            "und Fieber."
          ]
        },
        "es": {
          "phrase": "Tengo dolor de garganta y fiebre desde ayer.",
          "clozeSentence": "Tengo dolor de ___ y fiebre desde ayer.",
          "clozeAnswer": "garganta",
          "ipa": "/ˈteŋɡo ðoˈloɾ ðe ɣaɾˈɣanta i ˈfjeβɾe ˈdezðe aˈʝeɾ/",
          "exampleDialogue": "Voy a tomarle la temperatura ahora mismo.",
          "wordOrderChunks": [
            "Tengo",
            "dolor de garganta",
            "y fiebre",
            "desde ayer."
          ]
        }
      }
    },
    {
      "id": "hlth_prescription_meals",
      "moduleId": "health_emergencies",
      "cefr": "B1",
      "turkishMeaning": "Bu ilacı günde iki kez tok karnına almalısınız.",
      "turkishTrapTr": "\"Tok karnına\" birebir \"*on full stomach\" diye çevrilmez; doğal tıbbi ifade \"after meals / with food\", Almanca \"nach dem Essen\", İspanyolca \"después de las comidas\" şeklindedir.",
      "contextTagTr": "Eczane",
      "langs": {
        "en": {
          "phrase": "You should take this medication twice a day after meals.",
          "clozeSentence": "You should ___ this medication twice a day after meals.",
          "clozeAnswer": "take",
          "ipa": "/ju ʃʊd teɪk ðɪs ˌmedɪˈkeɪʃən twaɪs ə deɪ ˈæftər miːlz/",
          "exampleDialogue": "Got it, morning and evening after eating.",
          "wordOrderChunks": [
            "You should take",
            "this medication",
            "twice a day",
            "after meals."
          ]
        },
        "de": {
          "phrase": "Nehmen Sie dieses Medikament zweimal täglich nach dem Essen ein.",
          "clozeSentence": "Nehmen Sie dieses Medikament zweimal täglich ___ dem Essen ein.",
          "clozeAnswer": "nach",
          "ipa": "/ˈneːmən ziː ˈdiːzəs medikaˈmɛnt ˈtsvaɪ̯maːl ˈtɛːklɪç naːx deːm ˈɛsn̩ aɪ̯n/",
          "exampleDialogue": "Verstanden, also morgens und abends nach der Mahlzeit.",
          "wordOrderChunks": [
            "Nehmen Sie",
            "dieses Medikament",
            "zweimal täglich",
            "nach dem Essen ein."
          ]
        },
        "es": {
          "phrase": "Debe tomar este medicamento dos veces al día después de comer.",
          "clozeSentence": "Debe ___ este medicamento dos veces al día después de comer.",
          "clozeAnswer": "tomar",
          "ipa": "/ˈdeβe toˈmaɾ ˈeste meðikaˈmento dos ˈβeθes al ˈdia desˈpwes ðe koˈmeɾ/",
          "exampleDialogue": "Entendido, por la mañana y por la noche tras comer.",
          "wordOrderChunks": [
            "Debe tomar",
            "este medicamento",
            "dos veces al día",
            "después de comer."
          ]
        }
      }
    },
    {
      "id": "hlth_lost_passport",
      "moduleId": "health_emergencies",
      "cefr": "B1",
      "turkishMeaning": "Pasaportumu kaybettim; en yakın konsolosluğa nasıl ulaşabilirim?",
      "turkishTrapTr": "Resmi kayıp bildiriminde İngilizce sonucu bugünü etkilediği için \"I have lost my passport\", yol sormada ise dolaylı soru sırası (\"how I can\", \"*how can I\" değil!) dikkat çeker.",
      "contextTagTr": "Acil & Konsolosluk",
      "langs": {
        "en": {
          "phrase": "I have lost my passport; how can I reach the nearest consulate?",
          "clozeSentence": "I have ___ my passport; how can I reach the nearest consulate?",
          "clozeAnswer": "lost",
          "ipa": "/aɪ həv lɒst maɪ ˈpæspɔːrt haʊ kən aɪ riːtʃ ðə ˈnɪrɪst ˈkɒnsjələt/",
          "exampleDialogue": "First file a police report here, then take line two.",
          "wordOrderChunks": [
            "I have lost",
            "my passport;",
            "how can I reach",
            "the nearest consulate?"
          ]
        },
        "de": {
          "phrase": "Ich habe meinen Reisepass verloren; wie erreiche ich das Konsulat?",
          "clozeSentence": "Ich habe meinen Reisepass ___; wie erreiche ich das Konsulat?",
          "clozeAnswer": "verloren",
          "ipa": "/ɪç ˈhaːbə ˈmaɪ̯nən ˈʁaɪ̯zəpas fɛɐ̯ˈloːʁən viː ɛɐ̯ˈʁaɪ̯çə ɪç das kɔnzuˈlaːt/",
          "exampleDialogue": "Melden Sie den Verlust zuerst hier bei der Polizei.",
          "wordOrderChunks": [
            "Ich habe",
            "meinen Reisepass verloren;",
            "wie erreiche ich",
            "das Konsulat?"
          ]
        },
        "es": {
          "phrase": "He perdido mi pasaporte; ¿cómo llego al consulado más cercano?",
          "clozeSentence": "He ___ mi pasaporte; ¿cómo llego al consulado más cercano?",
          "clozeAnswer": "perdido",
          "ipa": "/e peɾˈðiðo mi pasaˈpoɾte ˈkomo ˈʎeɣo al konsuˈlaðo mas θeɾˈkano/",
          "exampleDialogue": "Primero presente una denuncia aquí en comisaría.",
          "wordOrderChunks": [
            "He perdido",
            "mi pasaporte;",
            "¿cómo llego",
            "al consulado más cercano?"
          ]
        }
      }
    },
    {
      "id": "hlth_appointment_reschedule",
      "moduleId": "health_emergencies",
      "cefr": "B1",
      "turkishMeaning": "Yarınki randevumu haftaya ertelemem mümkün mü?",
      "turkishTrapTr": "Randevu tarihini ileri almak için İngilizcede \"move / reschedule\", Almancada \"verschieben auf (+ Akk)\", İspanyolcada \"cambiar / aplazar para\" kullanılır.",
      "contextTagTr": "Resmi Randevu",
      "langs": {
        "en": {
          "phrase": "Would it be possible to reschedule tomorrow's appointment for next week?",
          "clozeSentence": "Would it be possible to ___ tomorrow's appointment for next week?",
          "clozeAnswer": "reschedule",
          "ipa": "/wʊd ɪt bi ˈpɒsəbəl tə ˌriːˈʃedjuːl təˈmɒroʊz əˈpɔɪntmənt fər nekst wiːk/",
          "exampleDialogue": "Tuesday at ten o'clock is open if that works for you.",
          "wordOrderChunks": [
            "Would it be possible",
            "to reschedule",
            "tomorrow's appointment",
            "for next week?"
          ]
        },
        "de": {
          "phrase": "Wäre es möglich, meinen Termin von morgen auf nächste Woche zu verschieben?",
          "clozeSentence": "Wäre es möglich, meinen Termin von morgen ___ nächste Woche zu verschieben?",
          "clozeAnswer": "auf",
          "ipa": "/ˈvɛːʁə ɛs ˈmøːklɪç ˈmaɪ̯nən tɛʁˈmiːn fɔn ˈmɔʁɡn̩ aʊ̯f ˈnɛːçstə ˈvɔxə tsuː fɛɐ̯ˈʃiːbn̩/",
          "exampleDialogue": "Am Dienstag um zehn Uhr hätten wir noch etwas frei.",
          "wordOrderChunks": [
            "Wäre es möglich,",
            "meinen Termin von morgen",
            "auf nächste Woche",
            "zu verschieben?"
          ]
        },
        "es": {
          "phrase": "¿Sería posible cambiar mi cita de mañana para la próxima semana?",
          "clozeSentence": "¿Sería posible ___ mi cita de mañana para la próxima semana?",
          "clozeAnswer": "cambiar",
          "ipa": "/seˈɾia poˈsiβle kamˈbjaɾ mi ˈθita ðe maˈɲana ˈpaɾa la ˈpɾoksima seˈmana/",
          "exampleDialogue": "El martes a las diez tenemos un hueco libre.",
          "wordOrderChunks": [
            "¿Sería posible",
            "cambiar mi cita",
            "de mañana",
            "para la próxima semana?"
          ]
        }
      }
    },
    {
      "id": "hlth_insurance_coverage",
      "moduleId": "health_emergencies",
      "cefr": "B2",
      "turkishMeaning": "Seyahat sigortam bu tetkikleri karşılıyor mu?",
      "turkishTrapTr": "\"Karşılamak\" için \"*meet the tests\" değil, sigorta terminolojisinde \"cover\" / DE \"übernehmen\" / ES \"cubrir\" fiilleri kullanılır.",
      "contextTagTr": "Sigorta & Hastane",
      "langs": {
        "en": {
          "phrase": "Does my travel insurance cover these diagnostic tests?",
          "clozeSentence": "Does my travel insurance ___ these diagnostic tests?",
          "clozeAnswer": "cover",
          "ipa": "/dʌz maɪ ˈtrævəl ɪnˈʃʊrəns ˈkʌvər ðiːz ˌdaɪəɡˈnɒstɪk tests/",
          "exampleDialogue": "Yes, as long as you keep the itemized hospital receipt.",
          "wordOrderChunks": [
            "Does my",
            "travel insurance",
            "cover",
            "these diagnostic tests?"
          ]
        },
        "de": {
          "phrase": "Übernimmt meine Reiseversicherung diese Untersuchungen?",
          "clozeSentence": "___ meine Reiseversicherung diese Untersuchungen?",
          "clozeAnswer": "Übernimmt",
          "ipa": "/yːbɐˈnɪmt ˈmaɪ̯nə ˈʁaɪ̯zəfɛɐ̯ˌzɪçəʁʊŋ ˈdiːzə ʊntɐˈzuːxʊŋən/",
          "exampleDialogue": "Ja, bewahren Sie bitte die detaillierte Quittung auf.",
          "wordOrderChunks": [
            "Übernimmt",
            "meine Reiseversicherung",
            "diese",
            "Untersuchungen?"
          ]
        },
        "es": {
          "phrase": "¿Mi seguro de viaje cubre estas pruebas médicas?",
          "clozeSentence": "¿Mi seguro de viaje ___ estas pruebas médicas?",
          "clozeAnswer": "cubre",
          "ipa": "/mi seˈɣuɾo ðe ˈβjaxe ˈkuβɾe ˈestas ˈpɾweβas ˈmeðikas/",
          "exampleDialogue": "Sí, siempre que conserve la factura detallada del centro.",
          "wordOrderChunks": [
            "¿Mi seguro",
            "de viaje",
            "cubre",
            "estas pruebas médicas?"
          ]
        }
      }
    }
  ]
},
{
  "id": "negotiation_boundaries",
  "order": 9,
  "titleTr": "Sözleşme Müzakeresi, İkna ve Profesyonel Sınır Koyma",
  "subtitleTr": "Fiyat, kapsam ve teslim takvimi görüşmelerinde kırmadan net sınır çiz",
  "icon": "09",
  "cefrRange": "B2",
  "accentHex": "#0f766e",
  "items": [
    {
      "id": "neg_meet_halfway",
      "moduleId": "negotiation_boundaries",
      "cefr": "B2",
      "turkishMeaning": "İki taraf için de adil bir orta noktada buluşabiliriz.",
      "turkishTrapTr": "\"Orta noktada buluşmak\" İngilizcede \"meet halfway\", Almancada \"uns in der Mitte treffen\", İspanyolcada \"llegar a un punto intermedio\" ile ifade edilir.",
      "contextTagTr": "Pazarlık",
      "langs": {
        "en": {
          "phrase": "We can meet halfway on a timeline that works for both sides.",
          "clozeSentence": "We can meet ___ on a timeline that works for both sides.",
          "clozeAnswer": "halfway",
          "ipa": "/wi kən miːt ˌhæfˈweɪ ɒn ə ˈtaɪmlaɪn ðət wɜːrks fər boʊθ saɪdz/",
          "exampleDialogue": "That sounds reasonable; let us review the milestones.",
          "wordOrderChunks": [
            "We can",
            "meet halfway",
            "on a timeline",
            "that works for both sides."
          ]
        },
        "de": {
          "phrase": "Wir können uns beim Zeitplan fair in der Mitte treffen.",
          "clozeSentence": "Wir können uns beim Zeitplan fair in der ___ treffen.",
          "clozeAnswer": "Mitte",
          "ipa": "/viːɐ̯ ˈkœnən ʊns baɪ̯m ˈtsaɪ̯tplaːn fɛːɐ̯ ɪn deːɐ̯ ˈmɪtə ˈtʁɛfn̩/",
          "exampleDialogue": "Das klingt fair; gehen wir die Meilensteine kurz durch.",
          "wordOrderChunks": [
            "Wir können uns",
            "beim Zeitplan",
            "fair in der Mitte",
            "treffen."
          ]
        },
        "es": {
          "phrase": "Podemos llegar a un punto intermedio justo para ambas partes.",
          "clozeSentence": "Podemos ___ a un punto intermedio justo para ambas partes.",
          "clozeAnswer": "llegar",
          "ipa": "/poˈðemos ʎeˈɣaɾ a un ˈpunto inteɾˈmeðjo ˈxusto ˈpaɾa ˈambas ˈpaɾtes/",
          "exampleDialogue": "Me parece razonable; revisemos las entregas clave.",
          "wordOrderChunks": [
            "Podemos llegar",
            "a un punto intermedio",
            "justo para",
            "ambas partes."
          ]
        }
      }
    },
    {
      "id": "neg_out_of_scope",
      "moduleId": "negotiation_boundaries",
      "cefr": "B2",
      "turkishMeaning": "Bu talep mevcut sözleşme kapsamımızın dışında kalıyor.",
      "turkishTrapTr": "Sınır koyarken suçlayıcı dil yerine nesnel \"falls outside the current scope\" / DE \"liegt außerhalb des vereinbarten Umfangs\" kullanılır.",
      "contextTagTr": "Kapsam Koruma",
      "langs": {
        "en": {
          "phrase": "That request falls outside the scope of our current agreement.",
          "clozeSentence": "That request falls ___ the scope of our current agreement.",
          "clozeAnswer": "outside",
          "ipa": "/ðæt rɪˈkwest fɔːlz ˌaʊtˈsaɪd ðə skoʊp əv ˈaʊər ˈkʌrənt əˈɡriːmənt/",
          "exampleDialogue": "Understood, let us scope it as a separate phase-two item.",
          "wordOrderChunks": [
            "That request",
            "falls outside",
            "the scope of",
            "our current agreement."
          ]
        },
        "de": {
          "phrase": "Dieser Wunsch liegt außerhalb unseres vereinbarten Projektumfangs.",
          "clozeSentence": "Dieser Wunsch liegt ___ unseres vereinbarten Projektumfangs.",
          "clozeAnswer": "außerhalb",
          "ipa": "/ˈdiːzɐ vʊnʃ liːkt ˈaʊ̯sɐhalp ˈʊnzəʁəs fɛɐ̯ˈaɪ̯nbaːɐ̯tn̩ pʁoˈjɛktʊmfaŋs/",
          "exampleDialogue": "Verstanden, planen wir das als eigene zweite Phase ein.",
          "wordOrderChunks": [
            "Dieser Wunsch",
            "liegt außerhalb",
            "unseres vereinbarten",
            "Projektumfangs."
          ]
        },
        "es": {
          "phrase": "Esa solicitud queda fuera del alcance de nuestro acuerdo actual.",
          "clozeSentence": "Esa solicitud queda ___ del alcance de nuestro acuerdo actual.",
          "clozeAnswer": "fuera",
          "ipa": "/ˈesa soliθiˈtuð ˈkeða ˈfweɾa ðel alˈkanθe ðe ˈnwestɾo aˈkweɾðo akˈtwal/",
          "exampleDialogue": "Comprendido, lo presupuestamos aparte para la segunda fase.",
          "wordOrderChunks": [
            "Esa solicitud",
            "queda fuera",
            "del alcance de",
            "nuestro acuerdo actual."
          ]
        }
      }
    },
    {
      "id": "neg_bandwidth_capacity",
      "moduleId": "negotiation_boundaries",
      "cefr": "B2",
      "turkishMeaning": "Bu hafta yeni bir proje üstlenecek kapasitem maalesef yok.",
      "turkishTrapTr": "\"Üstlenmek\" fiili İngilizcede \"take on\", Almancada \"übernehmen\", İspanyolcada \"asumir\" ile kurulur.",
      "contextTagTr": "İş Yükü Sınırı",
      "langs": {
        "en": {
          "phrase": "Unfortunately, I do not have the capacity to take on another project this week.",
          "clozeSentence": "Unfortunately, I do not have the capacity to take ___ another project this week.",
          "clozeAnswer": "on",
          "ipa": "/ʌnˈfɔːrtʃənətli aɪ du nɒt hæv ðə kəˈpæsəti tə teɪk ɒn əˈnʌðər ˈprɒdʒekt ðɪs wiːk/",
          "exampleDialogue": "Thanks for flagging that early so we can rebalance.",
          "wordOrderChunks": [
            "Unfortunately, I do not",
            "have the capacity",
            "to take on",
            "another project this week."
          ]
        },
        "de": {
          "phrase": "Leider habe ich diese Woche keine Kapazität, ein weiteres Projekt zu übernehmen.",
          "clozeSentence": "Leider habe ich diese Woche keine Kapazität, ein weiteres Projekt zu ___.",
          "clozeAnswer": "übernehmen",
          "ipa": "/ˈlaɪ̯dɐ ˈhaːbə ɪç ˈdiːzə ˈvɔxə ˈkaɪ̯nə kapatsiˈtɛːt aɪ̯n ˈvaɪ̯təʁəs pʁoˈjɛkt tsuː yːbɐˈneːmən/",
          "exampleDialogue": "Danke für den frühen Hinweis, dann verteilen wir um.",
          "wordOrderChunks": [
            "Leider habe ich",
            "diese Woche keine Kapazität,",
            "ein weiteres Projekt",
            "zu übernehmen."
          ]
        },
        "es": {
          "phrase": "Lamentablemente, esta semana no tengo margen para asumir otro proyecto.",
          "clozeSentence": "Lamentablemente, esta semana no tengo margen para ___ otro proyecto.",
          "clozeAnswer": "asumir",
          "ipa": "/lamentaβleˈmente ˈesta seˈmana no ˈteŋɡo ˈmaɾxen ˈpaɾa asuˈmiɾ ˈotɾo pɾoˈʝekto/",
          "exampleDialogue": "Gracias por avisar con tiempo para reorganizar al equipo.",
          "wordOrderChunks": [
            "Lamentablemente,",
            "esta semana no tengo margen",
            "para asumir",
            "otro proyecto."
          ]
        }
      }
    },
    {
      "id": "neg_contingent_upon",
      "moduleId": "negotiation_boundaries",
      "cefr": "B2",
      "turkishMeaning": "Bu indirim yıllık ödeme taahhüdüne bağlıdır.",
      "turkishTrapTr": "\"Bir şeye bağlı olmak (koşullu)\" resmi sözleşmelerde \"is contingent on / subject to\" kalıbıyla ifade edilir.",
      "contextTagTr": "Fiyatlandırma",
      "langs": {
        "en": {
          "phrase": "This discount is contingent on an annual billing commitment.",
          "clozeSentence": "This discount is ___ on an annual billing commitment.",
          "clozeAnswer": "contingent",
          "ipa": "/ðɪs ˈdɪskaʊnt ɪz kənˈtɪndʒənt ɒn ən ˈænjuəl ˈbɪlɪŋ kəˈmɪtmənt/",
          "exampleDialogue": "Fair enough, annual billing works well for our finance team.",
          "wordOrderChunks": [
            "This discount",
            "is contingent on",
            "an annual",
            "billing commitment."
          ]
        },
        "de": {
          "phrase": "Dieser Rabatt setzt eine jährliche Zahlungsbindung voraus.",
          "clozeSentence": "Dieser Rabatt ___ eine jährliche Zahlungsbindung voraus.",
          "clozeAnswer": "setzt",
          "ipa": "/ˈdiːzɐ ʁaˈbat zɛtst ˈaɪ̯nə ˈjɛːɐ̯lɪçə ˈtsaːlʊŋsbɪndʊŋ foˈʁaʊ̯s/",
          "exampleDialogue": "Einverstanden, die Jahresabrechnung passt unserer Buchhaltung.",
          "wordOrderChunks": [
            "Dieser Rabatt",
            "setzt",
            "eine jährliche Zahlungsbindung",
            "voraus."
          ]
        },
        "es": {
          "phrase": "Este descuento está sujeto a un compromiso de pago anual.",
          "clozeSentence": "Este descuento está ___ a un compromiso de pago anual.",
          "clozeAnswer": "sujeto",
          "ipa": "/ˈeste ðesˈkwento esˈta suˈxeto a un kompɾoˈmiso ðe ˈpaɣo aˈnwal/",
          "exampleDialogue": "De acuerdo, la facturación anual encaja con finanzas.",
          "wordOrderChunks": [
            "Este descuento",
            "está sujeto a",
            "un compromiso",
            "de pago anual."
          ]
        }
      }
    },
    {
      "id": "neg_put_in_writing",
      "moduleId": "negotiation_boundaries",
      "cefr": "B1",
      "turkishMeaning": "Yanlış anlaşılmaları önlemek için konuştuğumuz maddeleri yazılı hale getirelim.",
      "turkishTrapTr": "\"Yazılı hale getirmek\" İngilizcede \"*make written\" değil, deyimsel \"put it in writing\" / DE \"schriftlich festhalten\" / ES \"dejar por escrito\" şeklindedir.",
      "contextTagTr": "Mutabakat",
      "langs": {
        "en": {
          "phrase": "Let us put these agreed terms in writing to avoid any misunderstanding.",
          "clozeSentence": "Let us put these agreed terms in ___ to avoid any misunderstanding.",
          "clozeAnswer": "writing",
          "ipa": "/let əs pʊt ðiːz əˈɡriːd tɜːrmz ɪn ˈraɪtɪŋ tə əˈvɔɪd ˈeni ˌmɪsʌndərˈstændɪŋ/",
          "exampleDialogue": "Great idea, I will send a summary email right after this call.",
          "wordOrderChunks": [
            "Let us put",
            "these agreed terms",
            "in writing",
            "to avoid any misunderstanding."
          ]
        },
        "de": {
          "phrase": "Halten wir diese Punkte schriftlich fest, um Missverständnisse zu vermeiden.",
          "clozeSentence": "Halten wir diese Punkte ___ fest, um Missverständnisse zu vermeiden.",
          "clozeAnswer": "schriftlich",
          "ipa": "/ˈhaltn̩ viːɐ̯ ˈdiːzə ˈpʊŋktə ˈʃʁɪftlɪç fɛst ʊm ˈmɪsfɛɐ̯ˌʃtɛndnɪsə tsuː fɛɐ̯ˈmaɪ̯dn̩/",
          "exampleDialogue": "Sehr gut, ich schicke gleich nach dem Gespräch eine Zusammenfassung.",
          "wordOrderChunks": [
            "Halten wir",
            "diese Punkte",
            "schriftlich fest,",
            "um Missverständnisse zu vermeiden."
          ]
        },
        "es": {
          "phrase": "Dejemos estos puntos por escrito para evitar cualquier malentendido.",
          "clozeSentence": "Dejemos estos puntos por ___ para evitar cualquier malentendido.",
          "clozeAnswer": "escrito",
          "ipa": "/deˈxemos ˈestos ˈpuntos poɾ esˈkɾito ˈpaɾa eβiˈtaɾ kwalˈkjeɾ malentenˈdiðo/",
          "exampleDialogue": "Perfecto, te mando un correo de resumen nada más colgar.",
          "wordOrderChunks": [
            "Dejemos",
            "estos puntos",
            "por escrito",
            "para evitar cualquier malentendido."
          ]
        }
      }
    }
  ]
},
{
  "id": "connectors_nuance",
  "order": 10,
  "titleTr": "İleri Bağlaçlar, Nüans ve Akıcı Söylem Geçişleri",
  "subtitleTr": "Kısa ve kopuk cümleleri doğal zıtlık, koşul ve özet bağlaçlarıyla birbirine ör",
  "icon": "10",
  "cefrRange": "B2",
  "accentHex": "#7c3aed",
  "items": [
    {
      "id": "conn_despite_fact",
      "moduleId": "connectors_nuance",
      "cefr": "B2",
      "turkishMeaning": "Sürenin dar olmasına rağmen ekip kusursuz bir sürüm çıkardı.",
      "turkishTrapTr": "\"Despite / In spite of\" edattır ve doğrudan cümle ALMAZ (\"*Despite time was short\" YANLIŞTIR!); isim grubu (\"Despite the tight deadline\") veya \"despite the fact that...\" alır! Almanca \"Trotz\" Genitiv, \"Obwohl\" yan cümle alır.",
      "contextTagTr": "Zıtlık Bağlacı",
      "langs": {
        "en": {
          "phrase": "Despite the tight deadline, the team delivered a flawless release.",
          "clozeSentence": "___ the tight deadline, the team delivered a flawless release.",
          "clozeAnswer": "Despite",
          "ipa": "/dɪˈspaɪt ðə taɪt ˈdedlaɪn ðə tiːm dɪˈlɪvərd ə ˈflɔːləs rɪˈliːs/",
          "exampleDialogue": "Everyone stayed focused on the critical path.",
          "wordOrderChunks": [
            "Despite",
            "the tight deadline,",
            "the team delivered",
            "a flawless release."
          ]
        },
        "de": {
          "phrase": "Trotz der knappen Frist hat das Team eine fehlerfreie Version geliefert.",
          "clozeSentence": "___ der knappen Frist hat das Team eine fehlerfreie Version geliefert.",
          "clozeAnswer": "Trotz",
          "ipa": "/tʁɔts deːɐ̯ ˈknapn̩ fʁɪst hat das tiːm ˈaɪ̯nə ˈfeːlɐfʁaɪ̯ə vɛʁˈzjoːn ɡəˈliːfɐt/",
          "exampleDialogue": "Alle haben sich auf das Wesentliche konzentriert.",
          "wordOrderChunks": [
            "Trotz der",
            "knappen Frist",
            "hat das Team",
            "eine fehlerfreie Version geliefert."
          ]
        },
        "es": {
          "phrase": "A pesar del plazo ajustado, el equipo entregó una versión impecable.",
          "clozeSentence": "A ___ del plazo ajustado, el equipo entregó una versión impecable.",
          "clozeAnswer": "pesar",
          "ipa": "/a peˈsaɾ ðel ˈplaθo axusˈtaðo el eˈkipo entɾeˈɣo ˈuna βeɾˈsjon impeˈkaβle/",
          "exampleDialogue": "Todo el mundo mantuvo el foco en lo esencial.",
          "wordOrderChunks": [
            "A pesar del",
            "plazo ajustado,",
            "el equipo entregó",
            "una versión impecable."
          ]
        }
      }
    },
    {
      "id": "conn_as_long_as",
      "moduleId": "connectors_nuance",
      "cefr": "B2",
      "turkishMeaning": "Testler geçtiği sürece bu değişikliği yayına alabiliriz.",
      "turkishTrapTr": "\"-diği sürece\" koşul bağlacı İngilizcede gelecek için bile geniş zamanla (\"as long as the tests pass\"), İspanyolcada ise Subjuntivo (\"siempre que ... pasen\") ile kurulur!",
      "contextTagTr": "Koşul Bağlacı",
      "langs": {
        "en": {
          "phrase": "We can deploy this change as long as all automated tests pass.",
          "clozeSentence": "We can deploy this change as ___ as all automated tests pass.",
          "clozeAnswer": "long",
          "ipa": "/wi kən dɪˈplɔɪ ðɪs tʃeɪndʒ əz lɒŋ əz ɔːl ˈɔːtəmeɪtɪd tests pæs/",
          "exampleDialogue": "All green on staging, so we are ready.",
          "wordOrderChunks": [
            "We can deploy",
            "this change",
            "as long as",
            "all automated tests pass."
          ]
        },
        "de": {
          "phrase": "Wir können die Änderung ausrollen, solange alle Tests erfolgreich durchlaufen.",
          "clozeSentence": "Wir können die Änderung ausrollen, ___ alle Tests erfolgreich durchlaufen.",
          "clozeAnswer": "solange",
          "ipa": "/viːɐ̯ ˈkœnən diː ˈɛndəʁʊŋ ˈaʊ̯sʁɔlən zoˈlaŋə ˈalə tɛsts ɛɐ̯ˈfɔlkʁaɪ̯ç ˈdʊʁçlaʊ̯fn̩/",
          "exampleDialogue": "Auf der Testumgebung ist bereits alles grün.",
          "wordOrderChunks": [
            "Wir können",
            "die Änderung ausrollen,",
            "solange alle Tests",
            "erfolgreich durchlaufen."
          ]
        },
        "es": {
          "phrase": "Podemos desplegar este cambio siempre que pasen todas las pruebas.",
          "clozeSentence": "Podemos desplegar este cambio ___ que pasen todas las pruebas.",
          "clozeAnswer": "siempre",
          "ipa": "/poˈðemos despleˈɣaɾ ˈeste ˈkambjo ˈsjempɾe ke ˈpasen ˈtoðas las ˈpɾweβas/",
          "exampleDialogue": "Ya están todas en verde en preproducción.",
          "wordOrderChunks": [
            "Podemos desplegar",
            "este cambio",
            "siempre que",
            "pasen todas las pruebas."
          ]
        }
      }
    },
    {
      "id": "conn_otherwise",
      "moduleId": "connectors_nuance",
      "cefr": "B1",
      "turkishMeaning": "Yedeği şimdi alalım; aksi takdirde bütün ayarları kaybedebiliriz.",
      "turkishTrapTr": "Almancada \"sonst / andernfalls\" zarftır ve cümlenin başına geldiğinde 1. öge sayıldığı için hemen ardından çekimli fiil (\"verlieren wir\") gelir!",
      "contextTagTr": "Uyarı & Sonuç",
      "langs": {
        "en": {
          "phrase": "Let us back up the config now; otherwise, we might lose our settings.",
          "clozeSentence": "Let us back up the config now; ___, we might lose our settings.",
          "clozeAnswer": "otherwise",
          "ipa": "/let əs bæk ʌp ðə kənˈfɪɡ naʊ ˈʌðərwaɪz wi maɪt luːz ˈaʊər ˈsetɪŋz/",
          "exampleDialogue": "Good call, exporting a snapshot right now.",
          "wordOrderChunks": [
            "Let us back up",
            "the config now;",
            "otherwise, we might",
            "lose our settings."
          ]
        },
        "de": {
          "phrase": "Sichern wir die Konfiguration jetzt, sonst verlieren wir unsere Einstellungen.",
          "clozeSentence": "Sichern wir die Konfiguration jetzt, ___ verlieren wir unsere Einstellungen.",
          "clozeAnswer": "sonst",
          "ipa": "/ˈzɪçɐn viːɐ̯ diː kɔnfiɡuʁaˈtsjoːn jɛtst zɔnst fɛɐ̯ˈliːʁən viːɐ̯ ˈʊnzəʁə ˈaɪ̯nʃtɛlʊŋən/",
          "exampleDialogue": "Gute Idee, ich erstelle sofort ein Backup.",
          "wordOrderChunks": [
            "Sichern wir",
            "die Konfiguration jetzt,",
            "sonst verlieren wir",
            "unsere Einstellungen."
          ]
        },
        "es": {
          "phrase": "Guardemos una copia ahora; de lo contrario, podríamos perder los ajustes.",
          "clozeSentence": "Guardemos una copia ahora; de lo ___, podríamos perder los ajustes.",
          "clozeAnswer": "contrario",
          "ipa": "/ɡwaɾˈðemos ˈuna ˈkopja aˈoɾa de lo konˈtɾaɾjo poˈðɾiamos peɾˈðeɾ los aˈxustes/",
          "exampleDialogue": "Bien pensado, voy a exportarla enseguida.",
          "wordOrderChunks": [
            "Guardemos",
            "una copia ahora;",
            "de lo contrario,",
            "podríamos perder los ajustes."
          ]
        }
      }
    },
    {
      "id": "conn_in_a_nutshell",
      "moduleId": "connectors_nuance",
      "cefr": "B2",
      "turkishMeaning": "Özetle, kaliteyi düşürmeden süreci hızlandırmamız gerekiyor.",
      "turkishTrapTr": "\"Özetle / tek cümleyle\" için konuşma dilinde \"In a nutshell / Long story short\", Almanca \"Kurz gesagt\", İspanyolca \"En pocas palabras\" çok doğal bir geçiş sağlar.",
      "contextTagTr": "Özetleme",
      "langs": {
        "en": {
          "phrase": "In a nutshell, we need to speed up delivery without cutting corners.",
          "clozeSentence": "In a ___, we need to speed up delivery without cutting corners.",
          "clozeAnswer": "nutshell",
          "ipa": "/ɪn ə ˈnʌtʃel wi niːd tə spiːd ʌp dɪˈlɪvəri wɪˈðaʊt ˈkʌtɪŋ ˈkɔːrnərz/",
          "exampleDialogue": "Clear and concise; automating the build will get us there.",
          "wordOrderChunks": [
            "In a nutshell,",
            "we need to",
            "speed up delivery",
            "without cutting corners."
          ]
        },
        "de": {
          "phrase": "Kurz gesagt müssen wir schneller liefern, ohne an Qualität zu sparen.",
          "clozeSentence": "___ gesagt müssen wir schneller liefern, ohne an Qualität zu sparen.",
          "clozeAnswer": "Kurz",
          "ipa": "/kʊʁts ɡəˈzaːkt ˈmʏsn̩ viːɐ̯ ˈʃnɛlɐ ˈliːfɐn ˈoːnə an kvaliˈtɛːt tsuː ˈʃpaːʁən/",
          "exampleDialogue": "Klare Ansage; mit besserer Automatisierung schaffen wir das.",
          "wordOrderChunks": [
            "Kurz gesagt",
            "müssen wir",
            "schneller liefern,",
            "ohne an Qualität zu sparen."
          ]
        },
        "es": {
          "phrase": "En pocas palabras, debemos agilizar la entrega sin bajar la calidad.",
          "clozeSentence": "En ___ palabras, debemos agilizar la entrega sin bajar la calidad.",
          "clozeAnswer": "pocas",
          "ipa": "/en ˈpokas paˈlaβɾas deˈβemos axiliˈθaɾ la enˈtɾeɣa sin baˈxaɾ la kaliˈðað/",
          "exampleDialogue": "Totalmente claro; automatizar las pruebas nos dará ese margen.",
          "wordOrderChunks": [
            "En pocas palabras,",
            "debemos agilizar",
            "la entrega",
            "sin bajar la calidad."
          ]
        }
      }
    },
    {
      "id": "conn_that_being_said",
      "moduleId": "connectors_nuance",
      "cefr": "B2",
      "turkishMeaning": "Bununla birlikte, uzun vadeli bakım maliyetini de göz ardı edemeyiz.",
      "turkishTrapTr": "Karşı argümanı kabul ettikten sonra kendi çekincenizi eklemek için \"That being said / Having said that\", DE \"Allerdings\", ES \"Dicho esto\" üst düzey bir geçiş kurar.",
      "contextTagTr": "Dengeli Geçiş",
      "langs": {
        "en": {
          "phrase": "That being said, we cannot ignore the long-term maintenance cost.",
          "clozeSentence": "That ___ said, we cannot ignore the long-term maintenance cost.",
          "clozeAnswer": "being",
          "ipa": "/ðæt ˈbiːɪŋ sed wi ˈkænɒt ɪɡˈnɔːr ðə ˈlɒŋ tɜːrm ˈmeɪntənəns kɒst/",
          "exampleDialogue": "True, cheap shortcuts today always cost double next year.",
          "wordOrderChunks": [
            "That being said,",
            "we cannot ignore",
            "the long-term",
            "maintenance cost."
          ]
        },
        "de": {
          "phrase": "Allerdings dürfen wir die langfristigen Wartungskosten nicht übersehen.",
          "clozeSentence": "___ dürfen wir die langfristigen Wartungskosten nicht übersehen.",
          "clozeAnswer": "Allerdings",
          "ipa": "/ˈalɐdɪŋs ˈdʏʁfn̩ viːɐ̯ diː ˈlaŋfʁɪstɪɡn̩ ˈvaʁtʊŋskɔstn̩ nɪçt yːbɐˈzeːən/",
          "exampleDialogue": "Stimmt, schnelle Notlösungen rächen sich später immer.",
          "wordOrderChunks": [
            "Allerdings",
            "dürfen wir",
            "die langfristigen Wartungskosten",
            "nicht übersehen."
          ]
        },
        "es": {
          "phrase": "Dicho esto, no podemos pasar por alto el coste de mantenimiento.",
          "clozeSentence": "___ esto, no podemos pasar por alto el coste de mantenimiento.",
          "clozeAnswer": "Dicho",
          "ipa": "/ˈditʃo ˈesto no poˈðemos paˈsaɾ poɾ ˈalto el ˈkoste ðe manteniˈmjento/",
          "exampleDialogue": "Cierto, los atajos baratos salen caros el año que viene.",
          "wordOrderChunks": [
            "Dicho esto,",
            "no podemos",
            "pasar por alto",
            "el coste de mantenimiento."
          ]
        }
      }
    }
  ]
}
];

export const ADULT_DIALOGUES: AdultDialogue[] = [
  {
    id: 'dlg_daily_fluency',
    moduleId: 'daily_fluency',
    titleTr: 'Kahvede Doğal Sohbet',
    scenarioTr: 'Eski bir arkadaşınla kafede karşılaştın; ne zamandır orada yaşadığını, programını ve hafta sonu buluşmayı konuşuyorsunuz.',
    cefr: 'A2',
    icon: '💬',
    turns: [
      {
        speaker: 'partner',
        roleTr: 'Arkadaşın (Selin / Lukas / Lucía)',
        avatar: '🧑🏻',
        text: {
          en: "Hey! Sorry I'm running a bit late — how long have you lived in this neighborhood?",
          de: 'Hey! Tut mir leid, ich bin etwas spät dran — wie lange wohnst du schon in diesem Viertel?',
          es: '¡Hola! Perdona, llego un poco tarde. ¿Cuánto tiempo llevas viviendo en este barrio?',
        },
        turkishGloss: 'Selam! Kusura bakma biraz geciktim — bu mahallede ne zamandır yaşıyorsun?',
      },
      {
        speaker: 'learner',
        roleTr: 'Sen',
        avatar: '🗣️',
        text: {
          en: "No worries! I've lived here for three years, and actually I'm used to the commute now.",
          de: 'Kein Problem! Ich wohne seit drei Jahren hier, und eigentlich habe ich mich an den Weg gewöhnt.',
          es: '¡No pasa nada! Vivo aquí desde hace tres años y, en realidad, ya estoy acostumbrado al trayecto.',
        },
        turkishGloss: 'Sorun değil! Üç yıldır burada yaşıyorum ve aslında gidip gelmeye alıştım bile.',
        options: [
          {
            text: {
              en: "No worries! I've lived here for three years, and actually I'm used to the commute now.",
              de: 'Kein Problem! Ich wohne seit drei Jahren hier, und eigentlich habe ich mich an den Weg gewöhnt.',
              es: '¡No pasa nada! Vivo aquí desde hace tres años y, en realidad, ya estoy acostumbrado al trayecto.',
            },
            turkishHint: 'Süre (for / seit / desde hace) + "aslında" (actually) doğal akış',
            isBest: true,
            feedbackTr:
              'Doğru kullanım: Devam eden sürede İngilizce Present Perfect + "for", Almanca şimdiki zaman + "seit", İspanyolca "desde hace" kalıbını tam isabetle kullandın.',
          },
          {
            text: {
              en: 'No problem! I live here since three years, and actually I am stay late today.',
              de: 'Kein Problem! Ich wohne hier für drei Jahre, und aktuell bin ich daran gewöhnt.',
              es: '¡Sin problema! Soy viviendo aquí por tres años, y actualmente es fácil.',
            },
            turkishHint: '"since 3 years" / "für 3 Jahre" / "soy viviendo" tuzakları',
            isBest: false,
            feedbackTr:
              'Dikkat! Süre miktarı ("üç yıl") "since" değil "for" ister. Ayrıca Almancada "seit", İspanyolcada ise geçici/devam eden durumlarda "ser" yerine "estar" veya geniş zaman kullanılır.',
          },
          {
            text: {
              en: 'No worries! I am lived here three years, and I am used to wake up early.',
              de: 'Kein Problem! Ich gewohnt seit drei Jahren hier, und ich freue mich.',
              es: '¡Tranquilo! Yo vivo aquí desde tres años y estoy acostumbrado levantarme.',
            },
            turkishHint: 'Eksik edatlar ve "be used to + V1" hatası',
            isBest: false,
            feedbackTr:
              '"I am lived" edilgen olur, doğrusu "I\'ve lived". Ayrıca "be used to" ardından mastar değil "-ing" ("waking up") veya isim ister!',
          },
        ],
      },
      {
        speaker: 'partner',
        roleTr: 'Arkadaşın',
        avatar: '🧑🏻',
        text: {
          en: "That makes a lot of sense! Should we meet again on Friday if your schedule allows it?",
          de: 'Das ergibt absolut Sinn! Sollen wir uns am Freitag treffen, wenn es dein Zeitplan zulässt?',
          es: '¡Eso tiene mucho sentido! ¿Quedamos el viernes si te lo permite tu horario?',
        },
        turkishGloss: 'Bu çok mantıklı! Programın elverirse cuma günü tekrar buluşalım mı?',
      },
      {
        speaker: 'learner',
        roleTr: 'Sen',
        avatar: '🗣️',
        text: {
          en: "It really depends on my schedule, so let me double-check and explain it to you tonight.",
          de: 'Das hängt ganz von meinem Zeitplan ab, ich prüfe es und erkläre es dir heute Abend.',
          es: 'Depende totalmente de mi horario, así que lo confirmo y te lo explico esta noche.',
        },
        turkishGloss: 'Gerçekten programıma bağlı; bu akşam kontrol edip sana durumumu anlatayım.',
        options: [
          {
            text: {
              en: 'It depends to my schedule, so let me check and explain you tonight.',
              de: 'Das hängt zu meinem Zeitplan, so ich erkläre dir das heute Abend.',
              es: 'Depende a mi horario, así que te explico eso esta noche.',
            },
            turkishHint: '"depend to" ve "explain you" Türkçeden birebir çeviri',
            isBest: false,
            feedbackTr:
              'Klasik iki Türkçe tuzağı: İngilizcede "depend on" ("to" değil) ve "explain ... to you" gerekir. Almancada "abhängen von", İspanyolcada "depender de" kullanılır.',
          },
          {
            text: {
              en: "It really depends on my schedule, so let me double-check and explain it to you tonight.",
              de: 'Das hängt ganz von meinem Zeitplan ab, ich prüfe es und erkläre es dir heute Abend.',
              es: 'Depende totalmente de mi horario, así que lo confirmo y te lo explico esta noche.',
            },
            turkishHint: 'Doğru edatlar: "depend on", "abhängen von", "depender de"',
            isBest: true,
            feedbackTr:
              'Doğru kullanım: Bağımlı edatları ("depend on", "von ... ab", "depender de") ve dolaylı nesne sırasını ("explain it to you") kusursuz kurdun.',
          },
          {
            text: {
              en: 'It is depending of my schedule, I will return to you tonight.',
              de: 'Das ist abhängig zu meinem Zeitplan, ich komme zurück zu dir.',
              es: 'Está dependiendo en mi horario, yo regreso a ti esta noche.',
            },
            turkishHint: '"depending of" ve "return to you" mekanik çeviri',
            isBest: false,
            feedbackTr:
              '"depend" durum fiili olduğundan genelde "-ing" almaz ve "of" değil "on" ister; "size dönerim" ise "get back to you"dur.',
          },
        ],
      },
      {
        speaker: 'partner',
        roleTr: 'Arkadaşın',
        avatar: '🧑🏻',
        text: {
          en: "Sure! Let's try that quiet café near the park around six.",
          de: 'Klar! Probieren wir gegen sechs das ruhige Café am Park.',
          es: '¡Claro! Probemos esa cafetería tranquila junto al parque sobre las seis.',
        },
        turkishGloss: 'Tabii! Saat altı gibi parkın yanındaki o sakin kafeyi deneyelim.',
      },
      {
        speaker: 'learner',
        roleTr: 'Sen',
        avatar: '🗣️',
        text: {
          en: "That sounds great, let's do it! I'm really looking forward to seeing you.",
          de: 'Das klingt super, machen wir so! Ich freue mich schon darauf, dich zu sehen.',
          es: '¡Suena genial, hagámoslo así! Tengo muchas ganas de verte.',
        },
        turkishGloss: 'Kulağa harika geliyor, öyle yapalım! Seni görmeyi dört gözle bekliyorum.',
        options: [
          {
            text: {
              en: "It comes to my ear good! I'm looking forward to see you.",
              de: 'Es klingt gutlich! Ich freue mich für dich zu sehen.',
              es: '¡Suena bien! Tengo muchas ganas para verte.',
            },
            turkishHint: '"comes to my ear" ve "to see" hatası',
            isBest: false,
            feedbackTr:
              '"Sounds" fiili sıfat alır ("sounds great"), "looking forward to" edat olduğu için arkasından "-ing" ("seeing") gelir! İspanyolcada "ganas de" edatı ister.',
          },
          {
            text: {
              en: 'I am agree, let us do! I wait you on Friday.',
              de: 'Ich bin einverstanden, machen wir! Ich warte dich am Freitag.',
              es: '¡Estoy de acuerdo que sí! Te espero para el viernes.',
            },
            turkishHint: '"I am agree" ve "wait you" hatası',
            isBest: false,
            feedbackTr:
              '"I am agree" yerine "I agree" veya "Sounds great"; "wait you" yerine "wait for you" / "looking forward to seeing you" çok daha doğal tınlar.',
          },
          {
            text: {
              en: "That sounds great, let's do it! I'm really looking forward to seeing you.",
              de: 'Das klingt super, machen wir so! Ich freue mich schon darauf, dich zu sehen.',
              es: '¡Suena genial, hagámoslo así! Tengo muchas ganas de verte.',
            },
            turkishHint: 'Doğal tepki + "look forward to + V-ing"',
            isBest: true,
            feedbackTr:
              'Tam bir ana dili konuşuru gibi! Sıfatla "sounds great" ve "-ing" ile "looking forward to seeing you" birleşimi kusursuz.',
          },
        ],
      },
    ],
  },
  {
    id: 'dlg_work_interview',
    moduleId: 'work_interview',
    titleTr: 'İş Mülakatı: Deneyim & Beklenti',
    scenarioTr: 'Uluslararası bir şirkette kıdemli pozisyon için işe alım yöneticisiyle mülakat yapıyorsun.',
    cefr: 'B2',
    icon: '💼',
    turns: [
      {
        speaker: 'partner',
        roleTr: 'İşe Alım Yöneticisi',
        avatar: '👩🏼‍💼',
        text: {
          en: "Thanks for joining today. Could you briefly introduce your current role and biggest strength?",
          de: 'Danke für Ihre Zeit heute. Könnten Sie Ihre aktuelle Rolle und Ihre größte Stärke kurz vorstellen?',
          es: 'Gracias por conectarse hoy. ¿Podría presentar brevemente su puesto actual y su mayor fortaleza?',
        },
        turkishGloss: 'Bugün katıldığınız için teşekkürler. Mevcut rolünüzü ve en güçlü yanınızı kısaca tanıtır mısınız?',
      },
      {
        speaker: 'learner',
        roleTr: 'Sen (Aday)',
        avatar: '💼',
        text: {
          en: "I'm a senior project manager, and my biggest strength is staying calm under pressure.",
          de: 'Ich bin leitender Projektmanager, und meine größte Stärke ist es, unter Druck ruhig zu bleiben.',
          es: 'Soy jefe de proyectos sénior y mi mayor fortaleza es mantener la calma bajo presión.',
        },
        turkishGloss: 'Kıdemli proje yöneticisiyim ve en güçlü yanım baskı altında sakin kalabilmektir.',
        options: [
          {
            text: {
              en: "I'm a senior project manager, and my biggest strength is staying calm under pressure.",
              de: 'Ich bin leitender Projektmanager, und meine größte Stärke ist es, unter Druck ruhig zu bleiben.',
              es: 'Soy jefe de proyectos sénior y mi mayor fortaleza es mantener la calma bajo presión.',
            },
            turkishHint: 'EN "a" artikeli + gerund; DE/ES artikelsiz meslek',
            isBest: true,
            feedbackTr:
              'Doğru kullanım: İngilizcede meslek önüne "a", DE ve ES dillerinde artikelsiz meslek kuralını doğru uyguladın; ayrıca "is staying calm" yüklemde tam isabet.',
          },
          {
            text: {
              en: 'I am senior project manager, and my strength is stay calm under pressure.',
              de: 'Ich bin ein Projektmanager, und meine Stärke ist ruhig bleiben.',
              es: 'Soy un jefe de proyectos, y mi fuerza es mantengo la calma.',
            },
            turkishHint: 'EN eksik "a" artikeli ve "is stay" hatası',
            isBest: false,
            feedbackTr:
              'Türkçede "bir" söylenmediği için İngilizcede "a" unutulmuş ("a senior project manager"), ayrıca yüklemde yalın fiil değil "staying" gerekir.',
          },
          {
            text: {
              en: 'Actually, I work project manager and I can to stay very calm.',
              de: 'Aktuell bin ich als Projektmanager und kann bleiben ruhig.',
              es: 'Actualmente trabajo un jefe de proyectos y puedo mantenerme.',
            },
            turkishHint: '"can to stay" modal hatası ve eksik bağlaç',
            isBest: false,
            feedbackTr:
              '"can" sonrasında "to" gelmez, ayrıca "work as a..." gerekir. Mülakatta net isim-fiil ("is staying calm") çok daha profesyonel durur.',
          },
        ],
      },
      {
        speaker: 'partner',
        roleTr: 'İşe Alım Yöneticisi',
        avatar: '👩🏼‍💼',
        text: {
          en: "Great. How does your team handle tight deadlines when stakeholders need an urgent change?",
          de: 'Sehr gut. Wie geht Ihr Team mit engen Fristen um, wenn eine dringende Entscheidung nötig ist?',
          es: 'Muy bien. ¿Cómo maneja su equipo los plazos ajustados cuando hace falta una decisión urgente?',
        },
        turkishGloss: 'Harika. Paydaşlar acil değişiklik istediğinde ekibiniz sıkı teslim tarihlerini nasıl yönetiyor?',
      },
      {
        speaker: 'learner',
        roleTr: 'Sen (Aday)',
        avatar: '💼',
        text: {
          en: "First, we discuss the scope together so we're on the same page before we make a decision.",
          de: 'Zuerst sprechen wir über den Umfang, damit wir auf demselben Stand sind, bevor wir eine Entscheidung treffen.',
          es: 'Primero hablamos del alcance para estar en la misma sintonía antes de tomar una decisión.',
        },
        turkishGloss: 'Önce kapsamı birlikte görüşüyoruz ki karar vermeden önce aynı sayfada olalım.',
        options: [
          {
            text: {
              en: 'First, we discuss about the scope in the same page before we give a decision.',
              de: 'Zuerst diskutieren wir das Umfang, bevor wir eine Entscheidung geben.',
              es: 'Primero discutimos sobre el alcance antes de dar una decisión.',
            },
            turkishHint: '"discuss about", "in the same page", "give a decision" üçlü hatası',
            isBest: false,
            feedbackTr:
              'Burada tam üç klasik L1 tuzağı var: "discuss" "about" almaz, "on the same page" ("in" değil) ve "make a decision" ("give" değil) kullanılır!',
          },
          {
            text: {
              en: "First, we discuss the scope together so we're on the same page before we make a decision.",
              de: 'Zuerst sprechen wir über den Umfang, damit wir auf demselben Stand sind, bevor wir eine Entscheidung treffen.',
              es: 'Primero hablamos del alcance para estar en la misma sintonía antes de tomar una decisión.',
            },
            turkishHint: '"discuss" (edatsız) + "on the same page" + "make a decision"',
            isBest: true,
            feedbackTr:
              'Doğru kullanım: Üç dilde de doğru eşdizimlilikler: "make a decision / Entscheidung treffen / tomar una decisión" ve net iş jargonu.',
          },
          {
            text: {
              en: 'We talk the scope and take a decision very fast, thank you for your feedbacks.',
              de: 'Wir sprechen das Thema und machen schnell Entscheidung, danke für Feedbacks.',
              es: 'Hablamos el alcance y tomamos decisión rápido, gracias por feedbacks.',
            },
            turkishHint: '"talk the scope" ve sayılmayan "feedbacks" hatası',
            isBest: false,
            feedbackTr:
              '"talk" nesne alacaksa "about" ister (edatsız olan "discuss"tır). Ayrıca "feedback" sayılamaz, asla "-s" almaz!',
          },
        ],
      },
      {
        speaker: 'partner',
        roleTr: 'İşe Alım Yöneticisi',
        avatar: '👩🏼‍💼',
        text: {
          en: "Clear process! Do you have any questions for me about the role before we wrap up?",
          de: 'Ein klarer Prozess! Haben Sie vor unserem Abschluss noch Fragen zur Position?',
          es: '¡Proceso muy claro! ¿Tiene alguna pregunta sobre el puesto antes de terminar?',
        },
        turkishGloss: 'Net bir süreç! Bitirmeden önce pozisyon hakkında bana sormak istediğiniz bir soru var mı?',
      },
      {
        speaker: 'learner',
        roleTr: 'Sen (Aday)',
        avatar: '💼',
        text: {
          en: "Yes, what is the salary range for this role, and thank you for your constructive feedback today.",
          de: 'Ja, wie hoch ist die Gehaltsspanne für diese Stelle, und vielen Dank für Ihr konstruktives Feedback.',
          es: 'Sí, ¿cuál es la banda salarial para este puesto? Y muchas gracias por sus comentarios de hoy.',
        },
        turkishGloss: 'Evet, bu pozisyon için maaş aralığı nedir ve bugünkü yapıcı geri bildiriminiz için teşekkürler.',
        options: [
          {
            text: {
              en: 'Yes, how much money you give for this job? Also thanks for your feedbacks.',
              de: 'Ja, wie viel Geld geben Sie? Danke auch für Ihre Feedbacks.',
              es: 'Sí, ¿cuánto dinero dan por este trabajo? Gracias por el feedbacks.',
            },
            turkishHint: 'Kaba doğrudan soru ve çoğul "feedbacks"',
            isBest: false,
            feedbackTr:
              'Mülakatta "how much money" fazla doğrudan ve kaba duyulur; "salary range" profesyonel standarttır. Ayrıca "feedback" daima tekildir.',
          },
          {
            text: {
              en: "Yes, what is the salary range for this role, and thank you for your constructive feedback today.",
              de: 'Ja, wie hoch ist die Gehaltsspanne für diese Stelle, und vielen Dank für Ihr konstruktives Feedback.',
              es: 'Sí, ¿cuál es la banda salarial para este puesto? Y muchas gracias por sus comentarios de hoy.',
            },
            turkishHint: 'Profesyonel "salary range" + doğru "feedback"',
            isBest: true,
            feedbackTr:
              'Çok zarif ve profesyonel bir kapanış! Ücret beklentisini nazik çerçevede sordun ve sayılmayan "feedback" kuralına sadık kaldın.',
          },
          {
            text: {
              en: 'I want to learn what is the salary, and I will return to you next week.',
              de: 'Ich möchte wissen was ist das Gehalt, ich komme nächste Woche zurück.',
              es: 'Quiero aprender cuál es el salario y regreso a usted pronto.',
            },
            turkishHint: 'Dolaylı soruda devrik yapı + yanlış "learn / return"',
            isBest: false,
            feedbackTr:
              'Bilgi almak için "learn" değil "ask/know" kullanılır, dolaylı soruda "what the salary is" düz sıralanır ve dönüş yapmak "get back to you"dur.',
          },
        ],
      },
    ],
  },
  {
    id: 'dlg_travel_world',
    moduleId: 'travel_world',
    titleTr: 'Havalimanı Pasaport & Aktarma',
    scenarioTr: 'Aktarmalı uçuşun rötar yaptığı için pasaport kontrolü ve transfer bankosunda durumu çözüyorsun.',
    cefr: 'A2',
    icon: '✈️',
    turns: [
      {
        speaker: 'partner',
        roleTr: 'Pasaport Memuru / Havayolu Görevlisi',
        avatar: '🛂',
        text: {
          en: "Good afternoon. What is the purpose of your visit, and how long are you staying?",
          de: 'Guten Tag. Was ist der Zweck Ihrer Reise und wie lange bleiben Sie?',
          es: 'Buenas tardes. ¿Cuál es el motivo de su viaje y cuánto tiempo se queda?',
        },
        turkishGloss: 'İyi günler. Ziyaret amacınız nedir ve ne kadar süre kalacaksınız?',
      },
      {
        speaker: 'learner',
        roleTr: 'Sen (Yolcu)',
        avatar: '🧳',
        text: {
          en: "I'm here on business for five days, and my passport is valid until next December.",
          de: 'Ich bin für fünf Tage geschäftlich hier, und mein Reisepass ist bis nächsten Dezember gültig.',
          es: 'Estoy aquí por trabajo cinco días y mi pasaporte es válido hasta diciembre del próximo año.',
        },
        turkishGloss: 'Beş günlüğüne iş için buradayım ve pasaportum gelecek Aralık ayına kadar geçerli.',
        options: [
          {
            text: {
              en: 'I am here for business since five days, my passport is valid by December.',
              de: 'Ich bin hier für Geschäft seit fünf Tage, mein Pass ist gültig bei Dezember.',
              es: 'Soy aquí para trabajo desde cinco días, mi pasaporte es válido hasta.',
            },
            turkishHint: '"for business / since 5 days / by December" üçlü hatası',
            isBest: false,
            feedbackTr:
              'Kalıp "on business"tır ("for business" değil). Gelecek süre için "for five days" ("since" değil) ve kesintisiz geçerlilik için "until" ("by" değil) kullanılmalıdır.',
          },
          {
            text: {
              en: "I'm here on business for five days, and my passport is valid until next December.",
              de: 'Ich bin für fünf Tage geschäftlich hier, und mein Reisepass ist bis nächsten Dezember gültig.',
              es: 'Estoy aquí por trabajo cinco días y mi pasaporte es válido hasta diciembre del próximo año.',
            },
            turkishHint: 'Doğru edatlar: "on business", "for five days", "until"',
            isBest: true,
            feedbackTr:
              'Doğru kullanım: Sınır kontrolünde net, özgüvenli ve gramer açısından tertemiz bir cevap verdin.',
          },
          {
            text: {
              en: 'I came to business in five days and I have an accommodation.',
              de: 'Ich bin zu Geschäft in fünf Tage gekommen.',
              es: 'Vengo a negocio en cinco días.',
            },
            turkishHint: '"in five days" (5 gün içinde) anlam kayması',
            isBest: false,
            feedbackTr:
              '"in five days" kalış süresini değil "5 gün sonra" anlamını verir; kalış süresi daima "for" ("für" / "durante") ile belirtilir.',
          },
        ],
      },
      {
        speaker: 'partner',
        roleTr: 'Havayolu Görevlisi',
        avatar: '🛂',
        text: {
          en: "Thank you, everything is in order. Is there anything else I can assist you with at the desk?",
          de: 'Danke, alles in Ordnung. Kann ich Ihnen am Schalter sonst noch behilflich sein?',
          es: 'Gracias, todo está en orden. ¿Puedo ayudarle con algo más en el mostrador?',
        },
        turkishGloss: 'Teşekkürler, her şey yolunda. Bankoda size yardımcı olabileceğim başka bir konu var mı?',
      },
      {
        speaker: 'learner',
        roleTr: 'Sen (Yolcu)',
        avatar: '🧳',
        text: {
          en: "Yes, unfortunately I missed my connecting flight, and my luggage hasn't arrived yet.",
          de: 'Ja, leider habe ich meinen Anschlussflug verpasst, und mein Gepäck ist noch nicht angekommen.',
          es: 'Sí, por desgracia perdí mi vuelo de conexión y mi equipaje todavía no ha llegado.',
        },
        turkishGloss: 'Evet, ne yazık ki aktarmalı uçuşumu kaçırdım ve bagajım henüz gelmedi.',
        options: [
          {
            text: {
              en: "Yes, unfortunately I missed my connecting flight, and my luggage hasn't arrived yet.",
              de: 'Ja, leider habe ich meinen Anschlussflug verpasst, und mein Gepäck ist noch nicht angekommen.',
              es: 'Sí, por desgracia perdí mi vuelo de conexión y mi equipaje todavía no ha llegado.',
            },
            turkishHint: '"missed the flight" + tekil "luggage hasn\'t"',
            isBest: true,
            feedbackTr:
              'Doğru kullanım: Uçuş kaçırmayı "missed", sayılamayan bagajı ise tekil fiille ("luggage hasn\'t") doğru ifade ettin.',
          },
          {
            text: {
              en: "Yes, I escaped my connecting flight and my luggages haven't arrived.",
              de: 'Ja, ich habe meinen Flug verloren und meine Gepäcke sind nicht angekommen.',
              es: 'Sí, escapé mi vuelo y mis equipajes no han llegado.',
            },
            turkishHint: '"escaped the flight" ve çoğul "luggages" hatası',
            isBest: false,
            feedbackTr:
              'Türkçeden birebir "uçağı kaçırdım -> escaped" yanlış olur (doğrusu "missed" / "verpasst"). Ayrıca "luggage / Gepäck / equipaje" asla çoğul yapılmaz!',
          },
          {
            text: {
              en: 'I lost my plane when we arrived to the airport, and bags are missing.',
              de: 'Ich verpasste als wir an Flughafen gingen.',
              es: 'Perdí el avión cuando llegamos en aeropuerto.',
            },
            turkishHint: '"arrived to the airport" edat hatası',
            isBest: false,
            feedbackTr:
              '"arrive to" hiçbir zaman kullanılmaz ("arrive at the airport"); ayrıca uçak kaçırmak "miss the flight"tır.',
          },
        ],
      },
      {
        speaker: 'partner',
        roleTr: 'Havayolu Görevlisi',
        avatar: '🛂',
        text: {
          en: "I've rebooked your seat and tagged your bag for delivery. Please head toward Terminal 2.",
          de: 'Ich habe Sie umgebucht und Ihr Gepäck zur Lieferung markiert. Bitte gehen Sie zu Terminal 2.',
          es: 'Le he reubicado el vuelo y he registrado su maleta. Por favor, diríjase a la Terminal 2.',
        },
        turkishGloss: 'Koltuğunuzu yeniden rezerve ettim ve bavulunuzu teslimat için işaretledim. Lütfen Terminal 2\'ye geçin.',
      },
      {
        speaker: 'learner',
        roleTr: 'Sen (Yolcu)',
        avatar: '🧳',
        text: {
          en: "Thank you! Do you know where the boarding gate is, and does the shuttle train go there?",
          de: 'Danke! Wissen Sie, wo das Abfluggate ist, und fährt der Shuttlezug direkt dorthin?',
          es: '¡Gracias! ¿Sabe dónde está la puerta de embarque y si este tren va directo allí?',
        },
        turkishGloss: 'Teşekkürler! Biniş kapısının nerede olduğunu biliyor musunuz ve servis treni oraya gidiyor mu?',
        options: [
          {
            text: {
              en: 'Thanks! Do you know where is the gate, and is the train going there?',
              de: 'Danke! Wissen Sie, wo ist das Gate, und geht der Zug dorthin?',
              es: '¡Gracias! ¿Sabe dónde es la puerta y el tren camina allí?',
            },
            turkishHint: 'Dolaylı soruda devrik yapı + "train goes" yerine "geht"',
            isBest: false,
            feedbackTr:
              'Dolaylı soruda fiil sona gelir ("where the gate is", Almancada "wo das Gate ist"); ayrıca Almanca araçlar "gehen" değil "fahren", İspanyolca konum için "está" ister!',
          },
          {
            text: {
              en: "Thank you! Do you know where the boarding gate is, and does the shuttle train go there?",
              de: 'Danke! Wissen Sie, wo das Abfluggate ist, und fährt der Shuttlezug direkt dorthin?',
              es: '¡Gracias! ¿Sabe dónde está la puerta de embarque y si este tren va directo allí?',
            },
            turkishHint: 'Düzgün dolaylı soru sırası + tarifeli tren için geniş zaman',
            isBest: true,
            feedbackTr:
              'Doğru kullanım: Dolaylı soru söz dizimini korudun ve tarifeli ulaşımı doğal geniş zamanla sordun.',
          },
          {
            text: {
              en: 'Thank you, I want know the gate and if train go.',
              de: 'Danke, ich möchte das Gate wissen und Zug fahren.',
              es: 'Gracias, quiero saber puerta y tren ir.',
            },
            turkishHint: 'Eksik mastar "to", yardımcı fiil ve artikel',
            isBest: false,
            feedbackTr:
              '"want to know" gerekir ve nazik soruda "Do you know where... is?" yapısı hem daha kibar hem daha nettir.',
          },
        ],
      },
    ],
  },
  {
    id: 'dlg_tech_career',
    moduleId: 'tech_career',
    titleTr: 'Yazılım Sprint & Code Review',
    scenarioTr: 'Günlük stand-up sonrasında kıdemli mühendisle veritabanı darboğazını ve açık pull request’i değerlendiriyorsun.',
    cefr: 'B1',
    icon: '💻',
    turns: [
      {
        speaker: 'partner',
        roleTr: 'Takım Lideri (Alex / Jonas / Sofía)',
        avatar: '🧑🏽‍💻',
        text: {
          en: "Morning! Users reported slow checkout loading again. Were you able to check the logs?",
          de: 'Morgen! Nutzer haben wieder langsame Ladezeiten beim Checkout gemeldet. Konntest du in die Logs schauen?',
          es: '¡Buenos días! Los usuarios han vuelto a reportar lentitud en el pago. ¿Pudiste revisar los registros?',
        },
        turkishGloss: 'Günaydın! Kullanıcılar ödeme ekranında yine yavaşlık bildirmiş. Loglara bakabildin mi?',
      },
      {
        speaker: 'learner',
        roleTr: 'Sen (Geliştirici)',
        avatar: '💻',
        text: {
          en: "Yes, I can reproduce this bug locally — the database query is currently our main bottleneck.",
          de: 'Ja, ich kann den Fehler lokal reproduzieren — die Datenbankabfrage ist aktuell unser größter Engpass.',
          es: 'Sí, puedo reproducir este error en local: la consulta es actualmente nuestro principal cuello de botella.',
        },
        turkishGloss: 'Evet, bu hatayı yerelde yeniden üretebiliyorum; veritabanı sorgusu şu an temel darboğazımız.',
        options: [
          {
            text: {
              en: "Yes, I can reproduce this bug locally — the database query is currently our main bottleneck.",
              de: 'Ja, ich kann den Fehler lokal reproduzieren — die Datenbankabfrage ist aktuell unser größter Engpass.',
              es: 'Sí, puedo reproducir este error en local: la consulta es actualmente nuestro principal cuello de botella.',
            },
            turkishHint: '"reproduce locally" + "currently" (actually değil!)',
            isBest: true,
            feedbackTr:
              'Doğru kullanım: "produce" yerine "reproduce" ve "actually" tuzağı yerine "currently" kullanman harika.',
          },
          {
            text: {
              en: 'Yes, I can produce this bug in local — the query is actually our bottleneck.',
              de: 'Ja, ich kann diesen Fehler produzieren — eigentlich ist die Datenbank langsam.',
              es: 'Sí, puedo producir este error — en realidad es nuestro cuello.',
            },
            turkishHint: '"produce" + "in local" + false friend "actually"',
            isBest: false,
            feedbackTr:
              '"produce a bug" hata yazmak demektir (doğrusu "reproduce"), "in local" yerine "locally" denir ve "actually" "şu an" değil "aslında" anlamındadır!',
          },
          {
            text: {
              en: 'Yes, I repeated the bug on my local and it stays slow when traffic will grow.',
              de: 'Ja, ich habe den Fehler wiederholt auf lokal.',
              es: 'Sí, repetí el error en local y queda lento.',
            },
            turkishHint: 'Yanlış eşdizimlilik ("repeated") + yan cümlede "will grow"',
            isBest: false,
            feedbackTr:
              'Yazılım dünyasında standart fiil "reproduce"tur; ayrıca "when/as" yan cümlesinde gelecek kipi "will grow" kullanılmaz.',
          },
        ],
      },
      {
        speaker: 'partner',
        roleTr: 'Takım Lideri',
        avatar: '🧑🏽‍💻',
        text: {
          en: "Good catch. Should we ship a quick hotfix today or also rebuild the legacy caching layer?",
          de: 'Guter Fund. Sollen wir heute einen schnellen Fix ausliefern oder auch das alte Caching umbauen?',
          es: 'Buen hallazgo. ¿Sacamos hoy un arreglo rápido o rehacemos también la capa de caché antigua?',
        },
        turkishGloss: 'İyi yakalamışsın. Bugün hızlı bir yama mı çıkalım yoksa eski önbellek katmanını da mı baştan yapalım?',
      },
      {
        speaker: 'learner',
        roleTr: 'Sen (Geliştirici)',
        avatar: '💻',
        text: {
          en: "Let's fix the root cause instead of patching symptoms, though the cache rewrite is out of scope this week.",
          de: 'Finden wir lieber die Ursache, statt nur Symptome zu flicken, aber der Umbau liegt außerhalb dieses Sprints.',
          es: 'Ataquemos la causa raíz en lugar de poner parches, aunque rehacer la caché queda fuera del alcance esta semana.',
        },
        turkishGloss: 'Belirtiyi yamamak yerine kök nedeni çözelim ama önbelleği yeniden yazmak bu hafta kapsam dışı kalmalı.',
        options: [
          {
            text: {
              en: 'Fix the root cause instead to patch symptoms, and the rewrite is out scope.',
              de: 'Lösen wir die Ursache statt Symptome flicken, es ist außer Sprint.',
              es: 'Arreglamos la causa en lugar de parches, y es fuera alcance.',
            },
            turkishHint: '"instead to patch" + eksik edatlı "out scope"',
            isBest: false,
            feedbackTr:
              '"instead of" arkasından "-ing" ("patching") ister; kapsam dışı ise daima "out of scope" şeklinde kurulur.',
          },
          {
            text: {
              en: "Let's fix the root cause instead of patching symptoms, though the cache rewrite is out of scope this week.",
              de: 'Finden wir lieber die Ursache, statt nur Symptome zu flicken, aber der Umbau liegt außerhalb dieses Sprints.',
              es: 'Ataquemos la causa raíz en lugar de poner parches, aunque rehacer la caché queda fuera del alcance esta semana.',
            },
            turkishHint: '"instead of + V-ing" + "out of scope"',
            isBest: true,
            feedbackTr:
              'Doğru yapı: Hem gerçekçi kapsam belirledin hem de "instead of patching" ve "out of scope" yapılarını pürüzsüz kullandın.',
          },
          {
            text: {
              en: 'We should to avoid deploying on Friday, and balance between speed to memory.',
              de: 'Wir sollen vermeiden am Freitag zu deployen.',
              es: 'Debemos evitar desplegar los viernes y equilibrar entre velocidad a memoria.',
            },
            turkishHint: '"should to avoid" + "between X to Y" hatası',
            isBest: false,
            feedbackTr:
              '"should" ardından "to" gelmez ve "between" sadece "and" ile eşleşir ("between speed and memory").',
          },
        ],
      },
      {
        speaker: 'partner',
        roleTr: 'Takım Lideri',
        avatar: '🧑🏽‍💻',
        text: {
          en: "Makes sense. Have you pushed the index migration yet, and is it safe for older mobile clients?",
          de: 'Klingt logisch. Hast du die Index-Migration schon gepusht, und ist sie sicher für ältere Mobile-Clients?',
          es: 'Tiene sentido. ¿Subiste ya la migración del índice y es segura para los clientes móviles antiguos?',
        },
        turkishGloss: 'Mantıklı. İndeks geçişini gönderdin mi ve eski mobil istemciler için güvenli mi?',
      },
      {
        speaker: 'learner',
        roleTr: 'Sen (Geliştirici)',
        avatar: '💻',
        text: {
          en: "Yes, it's backward-compatible with older clients, and I'm waiting for your feedback on my pull request.",
          de: 'Ja, sie ist mit älteren Clients abwärtskompatibel, und ich warte noch auf dein Feedback zum Pull Request.',
          es: 'Sí, es retrocompatible con clientes antiguos y estoy esperando tu revisión en la solicitud de cambio.',
        },
        turkishGloss: 'Evet, eski istemcilerle geriye uyumlu ve pull request’im için geri bildiriminizi bekliyorum.',
        options: [
          {
            text: {
              en: "Yes, it's backward-compatible to older clients, and I'm waiting your feedback.",
              de: 'Ja, es ist kompatibel zu alten Clients und ich warte dein Feedback.',
              es: 'Sí, es compatible a clientes antiguos y estoy esperando por tu revisión.',
            },
            turkishHint: '"compatible to" + eksik "waiting FOR"',
            isBest: false,
            feedbackTr:
              'İngilizcede "compatible with" ("to" değil) ve "waiting for" (Türkçede edatsız olsa da) zorunludur!',
          },
          {
            text: {
              en: 'Yes, it works to old apps; let us avoid to deploy on Friday.',
              de: 'Ja, es geht an alte Apps; vermeiden wir freitags live gehen.',
              es: 'Sí, funciona para viejas apps; evitamos de desplegar el viernes.',
            },
            turkishHint: '"avoid to deploy" ve "works to" hatası',
            isBest: false,
            feedbackTr:
              '"avoid" sonrasında "-ing" gelir ("avoid deploying"); ayrıca teknik uyumluluk için "backward-compatible with" en net terimdir.',
          },
          {
            text: {
              en: "Yes, it's backward-compatible with older clients, and I'm waiting for your feedback on my pull request.",
              de: 'Ja, sie ist mit älteren Clients abwärtskompatibel, und ich warte noch auf dein Feedback zum Pull Request.',
              es: 'Sí, es retrocompatible con clientes antiguos y estoy esperando tu revisión en la solicitud de cambio.',
            },
            turkishHint: '"compatible with" + "waiting for"',
            isBest: true,
            feedbackTr:
              'Doğru kullanım: "backward-compatible with" ve "waiting for your feedback" ile teknik bağlamda doğal ve net bir cümle kurdun.',
          },
        ],
      },
    ],
  },
  {
    id: 'dlg_social_dining',
    moduleId: 'social_dining',
    titleTr: 'Restoran Siparişi & Hesap',
    scenarioTr: 'Bir arkadaşınla dışarıda akşam yemeğindesin; masa istiyor, alerjini belirtiyor ve sonunda hesabı bölüşüyorsunuz.',
    cefr: 'A2',
    icon: '☕',
    turns: [
      {
        speaker: 'partner',
        roleTr: 'Garson (Sam / Mia / Carlos)',
        avatar: '🍽️',
        text: {
          en: "Good evening! Welcome to Bistro Verde. Do you have a reservation, or what kind of table do you need?",
          de: 'Guten Abend! Willkommen im Bistro Verde. Haben Sie reserviert oder was für einen Tisch wünschen Sie?',
          es: '¡Buenas noches! Bienvenidos a Bistro Verde. ¿Tienen reserva o qué mesa prefieren?',
        },
        turkishGloss: 'İyi akşamlar! Bistro Verde\'ye hoş geldiniz. Rezervasyonunuz var mı yoksa nasıl bir masa istersiniz?',
      },
      {
        speaker: 'learner',
        roleTr: 'Sen (Müşteri)',
        avatar: '☕',
        text: {
          en: "Good evening! Do you have a table for two by the window? Also, what would you recommend from the menu?",
          de: 'Guten Abend! Haben Sie einen Tisch für zwei am Fenster? Und was können Sie uns von der Karte empfehlen?',
          es: '¡Buenas noches! ¿Tienen una mesa para dos junto a la ventana? Además, ¿qué nos recomienda de la carta?',
        },
        turkishGloss: 'İyi akşamlar! Cam kenarında iki kişilik masanız var mı? Ayrıca menüden ne önerirsiniz?',
        options: [
          {
            text: {
              en: "Good evening! Do you have a table for two by the window? Also, what would you recommend from the menu?",
              de: 'Guten Abend! Haben Sie einen Tisch für zwei am Fenster? Und was können Sie uns von der Karte empfehlen?',
              es: '¡Buenas noches! ¿Tienen una mesa para dos junto a la ventana? Además, ¿qué nos recomienda de la carta?',
            },
            turkishHint: '"a table for two" + "what would you recommend"',
            isBest: true,
            feedbackTr:
              'Doğru kullanım: İki kişilik masayı doğal "table for two" kalıbıyla istedin ve "recommend me" tuzağına düşmeden kibarca öneri sordun.',
          },
          {
            text: {
              en: 'Hello! Give us a two-person table near to window, and what do you suggest me?',
              de: 'Hallo! Geben Sie uns einen Zwei-Person-Tisch und was empfehlen Sie mich?',
              es: '¡Hola! Danos una mesa de dos personas y ¿qué me sugieres a mí?',
            },
            turkishHint: '"two-person table" + "suggest me" (edatsız!) hatası',
            isBest: false,
            feedbackTr:
              '"Give us" emir kipi gibi kaba durur; ayrıca "suggest/recommend" sonrasında "me" doğrudan kullanılmaz ve masa "for two" şeklinde söylenir.',
          },
          {
            text: {
              en: 'Hi, we want an empty table and explain us the menu please.',
              de: 'Hallo, wir wollen einen leeren Tisch und erklären Sie uns das Menü.',
              es: 'Hola, queremos mesa vacía y explícanos la carta.',
            },
            turkishHint: '"empty" (insan/masa için uygunsuz) + "explain us"',
            isBest: false,
            feedbackTr:
              'Restoranda boş masa için "free / available" ("empty" değil) kullanılır ve "explain" kişi önüne "to" ("explain to us") ister.',
          },
        ],
      },
      {
        speaker: 'partner',
        roleTr: 'Garson',
        avatar: '🍽️',
        text: {
          en: "Right this way! Our seasonal risotto is very popular tonight. Any dietary preferences I should know about?",
          de: 'Hier entlang, bitte! Unser Saisonrisotto ist heute sehr beliebt. Gibt es Allergien oder besondere Wünsche?',
          es: '¡Por aquí, por favor! Nuestro risotto de temporada gusta mucho hoy. ¿Alguna alergia que deba tener en cuenta?',
        },
        turkishGloss: 'Şöyle buyurun! Bu akşam mevsim risottomuz çok beğeniliyor. Bilmem gereken bir alerji veya diyet tercihi var mı?',
      },
      {
        speaker: 'learner',
        roleTr: 'Sen (Müşteri)',
        avatar: '☕',
        text: {
          en: "Thanks! I'm allergic to nuts — does this dish contain any?",
          de: 'Danke! Ich bin allergisch gegen Nüsse — ist in diesem Gericht etwas davon drin?',
          es: '¡Gracias! Soy alérgico a los frutos secos; ¿lleva algo de eso este plato?',
        },
        turkishGloss: 'Teşekkürler! Kuruyemişe alerjim var; bu yemekte bunlardan var mı?',
        options: [
          {
            text: {
              en: 'Thanks! I have allergy with nuts — does this plate have any?',
              de: 'Danke! Ich bin allergisch mit Nüsse — hat dieser Teller Nüsse?',
              es: '¡Gracias! Tengo alergia con nueces — ¿tiene este plato?',
            },
            turkishHint: '"allergy with" + "plate" (tabak) vs "dish" (yemek)',
            isBest: false,
            feedbackTr:
              'Alerji edatları özeldir: EN "allergic to", DE "allergisch gegen", ES "alérgico a"! Ayrıca yemek içeriği sorulurken "plate" değil "dish" denir.',
          },
          {
            text: {
              en: "Thanks! I'm allergic to nuts — does this dish contain any?",
              de: 'Danke! Ich bin allergisch gegen Nüsse — ist in diesem Gericht etwas davon drin?',
              es: '¡Gracias! Soy alérgico a los frutos secos; ¿lleva algo de eso este plato?',
            },
            turkishHint: 'Doğru alerji edatları ("to / gegen / a")',
            isBest: true,
            feedbackTr:
              'Doğru kullanım: Üç dilde de doğru alerji edatlarını kullandın ve menüdeki yemeği doğru sözcükle sordun.',
          },
          {
            text: {
              en: 'I am allergic for nuts; actually, I eat soup instead.',
              de: 'Ich bin allergisch für Nüsse; aktuell esse ich Suppe.',
              es: 'Estoy alérgico de nueces; actualmente como sopa.',
            },
            turkishHint: '"allergic for" ve "estar alérgico" hatası',
            isBest: false,
            feedbackTr:
              'İngilizcede "allergic to" ("for" değil), İspanyolcada ise kalıcı yapı olarak "ser alérgico a" ("estar" değil) kullanılır.',
          },
        ],
      },
      {
        speaker: 'partner',
        roleTr: 'Garson',
        avatar: '🍽️',
        text: {
          en: "Completely nut-free, I just double-checked with the kitchen. How was everything for you both?",
          de: 'Komplett nussfrei, ich habe direkt in der Küche nachgefragt. Hat Ihnen alles geschmeckt?',
          es: 'Totalmente libre de frutos secos, acabo de confirmarlo en cocina. ¿Qué tal estuvo todo?',
        },
        turkishGloss: 'Tamamen kuruyemişsiz, mutfaktan az önce teyit ettim. İkiniz için de her şey nasıldı?',
      },
      {
        speaker: 'learner',
        roleTr: 'Sen (Müşteri)',
        avatar: '☕',
        text: {
          en: "Everything was delicious, thank you! Could we split the bill when you have a moment?",
          de: 'Es hat wirklich hervorragend geschmeckt, danke! Könnten wir bitte getrennt zahlen?',
          es: 'Estaba todo buenísimo, ¡gracias! ¿Podemos pagar por separado cuando pueda?',
        },
        turkishGloss: 'Her şey çok lezzetliydi, teşekkürler! Müsait olduğunuzda hesabı bölüşebilir miyiz?',
        options: [
          {
            text: {
              en: 'Health to your hands! Can we take the account and pay different?',
              de: 'Gesundheit zu Ihren Händen! Können wir das Konto unterschiedlich zahlen?',
              es: '¡Salud a sus manos! ¿Podemos coger la cuenta y pagar diferente?',
            },
            turkishHint: '"Health to your hands", "account" ve "pay different" tuzakları',
            isBest: false,
            feedbackTr:
              '"Ellerinize sağlık" ve "hesabı ayrı ödeyelim" birebir çevrilince anlaşılmaz! Doğrusu: "Everything was delicious / split the bill" veya DE "getrennt zahlen".',
          },
          {
            text: {
              en: 'Everything was goodly! Could we have the check and divide money?',
              de: 'Alles war lecker! Wir wollen die Konto teilen.',
              es: '¡Todo era bueno! ¿Nos trae la factura para dividir?',
            },
            turkishHint: 'Yanlış zarf ("goodly"), yanlış "ser/estar" ("era bueno")',
            isBest: false,
            feedbackTr:
              '"was" ardından sıfat gelir ("delicious", "goodly" diye bir kelime yoktur); İspanyolcada ise yemek tadı için "estaba buenísimo" kullanılır.',
          },
          {
            text: {
              en: "Everything was delicious, thank you! Could we split the bill when you have a moment?",
              de: 'Es hat wirklich hervorragend geschmeckt, danke! Könnten wir bitte getrennt zahlen?',
              es: 'Estaba todo buenísimo, ¡gracias! ¿Podemos pagar por separado cuando pueda?',
            },
            turkishHint: 'Doğal övgü + kibar hesap/bölüşme kalıbı',
            isBest: true,
            feedbackTr:
              'Doğru kullanım: Yerel bir akşam yemeği misafiri gibi nazik, akıcı ve hatasız bir kapanış yaptın.',
          },
        ],
      },
    ],
  },
  {
    id: 'dlg_idioms_debate',
    moduleId: 'idioms_debate',
    titleTr: 'Toplantıda Nazikçe İtiraz Etme',
    scenarioTr: 'Yöneticin yeni bir özelliği hemen yayına almak istiyor; sen riskleri yapıcı biçimde dile getiriyorsun.',
    cefr: 'B2',
    icon: '🎯',
    turns: [
      {
        speaker: 'partner',
        roleTr: 'Ürün Direktörü (Claire / Stefan / Javier)',
        avatar: '📊',
        text: {
          en: "I think we should launch the new dashboard on Friday even if the automated tests aren't finished yet.",
          de: 'Ich finde, wir sollten das neue Dashboard am Freitag starten, auch wenn die Tests noch nicht fertig sind.',
          es: 'Creo que deberíamos lanzar el nuevo panel el viernes aunque las pruebas aún no estén terminadas.',
        },
        turkishGloss: 'Otomatik testler henüz bitmemiş olsa bile yeni paneli cuma günü yayına almamız gerektiğini düşünüyorum.',
      },
      {
        speaker: 'learner',
        roleTr: 'Sen (Uzman)',
        avatar: '🎯',
        text: {
          en: "I see your point, though I see it differently. In my opinion, skipping tests hurts us long-term.",
          de: 'Ich verstehe deinen Punkt, sehe es aber etwas anders. Meiner Meinung nach schadet uns das langfristig.',
          es: 'Entiendo tu postura, aunque lo veo distinto. En mi opinión, saltarnos las pruebas nos perjudica a largo plazo.',
        },
        turkishGloss: 'Bakış açını anlıyorum ama biraz farklı görüyorum. Bence testleri atlamak uzun vadede bize zarar verir.',
        options: [
          {
            text: {
              en: "I see your point, though I see it differently. In my opinion, skipping tests hurts us long-term.",
              de: 'Ich verstehe deinen Punkt, sehe es aber etwas anders. Meiner Meinung nach schadet uns das langfristig.',
              es: 'Entiendo tu postura, aunque lo veo distinto. En mi opinión, saltarnos las pruebas nos perjudica a largo plazo.',
            },
            turkishHint: 'Diplomatik itiraz + "In my opinion" (According to me değil!)',
            isBest: true,
            feedbackTr:
              'Doğal ve yapıcı ifade: Önce karşı tarafı doğrulayıp sonra "In my opinion / Meiner Meinung nach" ile fikrini diplomatikçe savundun.',
          },
          {
            text: {
              en: 'I am not agree with you. According to me, launching on Friday is big mistake.',
              de: 'Ich bin nicht einverstanden. Nach mir ist der Start am Freitag ein Fehler.',
              es: 'No estoy de acuerdo que tú. Según mí, lanzar el viernes es mal.',
            },
            turkishHint: '"I am not agree" + "According to me" hatası',
            isBest: false,
            feedbackTr:
              '"I am not agree" yerine "I disagree" veya "I see your point, though..."; ayrıca kendi fikrinizde ASLA "According to me" kullanılmaz!',
          },
          {
            text: {
              en: 'You are wrong, I prefer to keep the launch late.',
              de: 'Du liegst falsch, wir sollten verschieben das.',
              es: 'Estás equivocado, prefiero que retrasemos.',
            },
            turkishHint: 'Aşırı sert ton + Almanca V2/yan cümle dizilim hatası',
            isBest: false,
            feedbackTr:
              'Profesyonel tartışmada "You are wrong" savunma tepkisi doğurur. Yumuşatıcı geçiş cümleleri ikna gücünü katlar.',
          },
        ],
      },
      {
        speaker: 'partner',
        roleTr: 'Ürün Direktörü',
        avatar: '📊',
        text: {
          en: "I'm glad you brought that up — marketing already announced the date, though. How should we evaluate our options?",
          de: 'Gut, dass du das angesprochen hast — das Marketing hat den Termin aber schon angekündigt. Wie wägen wir ab?',
          es: 'Me alegro de que hayas sacado este tema, pero marketing ya anunció la fecha. ¿Cómo valoramos las opciones?',
        },
        turkishGloss: 'Bunu gündeme getirdiğine sevindim ama pazarlama tarihi şimdiden duyurdu. Seçeneklerimizi nasıl değerlendirelim?',
      },
      {
        speaker: 'learner',
        roleTr: 'Sen (Uzman)',
        avatar: '🎯',
        text: {
          en: "Let us weigh the pros and cons carefully — I'd rather release a smaller beta than put off critical fixes.",
          de: 'Wägen wir die Vor- und Nachteile ab — ich würde lieber eine kleinere Beta zeigen, statt Risiken aufzuschieben.',
          es: 'Sopesemos los pros y los contras con calma: preferiría lanzar una beta reducida antes que posponer las correcciones.',
        },
        turkishGloss: 'Artıları ve eksileri dikkatlice tartalım; kritik düzeltmeleri ertelemektense daha küçük bir beta yayınlamayı tercih ederim.',
        options: [
          {
            text: {
              en: 'Let us list pluses and minuses — I would rather to release a beta.',
              de: 'Sehen wir Plus und Minus — ich würde lieber zeigen eine kleine Beta.',
              es: 'Veamos los más y los menos — preferiría a lanzar una beta.',
            },
            turkishHint: '"pluses and minuses" + "would rather to" hatası',
            isBest: false,
            feedbackTr:
              '"pros and cons" ("pluses and minuses" değil) ve "would rather" sonrasında "to"suz yalın fiil ("I\'d rather release") kullanılır!',
          },
          {
            text: {
              en: "Let us weigh the pros and cons carefully — I'd rather release a smaller beta than put off critical fixes.",
              de: 'Wägen wir die Vor- und Nachteile ab — ich würde lieber eine kleinere Beta zeigen, statt Risiken aufzuschieben.',
              es: 'Sopesemos los pros y los contras con calma: preferiría lanzar una beta reducida antes que posponer las correcciones.',
            },
            turkishHint: '"pros and cons" + "would rather + V1" + "put off"',
            isBest: true,
            feedbackTr:
              'Doğru kullanım: Hem yapıcı orta yol sundun hem de deyimleri ve sözdizimini kusursuz işledin.',
          },
          {
            text: {
              en: 'Every job has a good; let us close the day and decide tomorrow.',
              de: 'Alles hat ein Gutes; machen wir Schluss des Tages.',
              es: 'Todo tiene bueno; cerramos el día ahora.',
            },
            turkishHint: 'Birebir çevrilmiş deyim + konudan kaçış',
            isBest: false,
            feedbackTr:
              'Deyimler birebir çevrilmez ("silver lining" / "call it a day" kullanılır) ve acil karar bekleyen yöneticide sorumluluk almak daha etkilidir.',
          },
        ],
      },
      {
        speaker: 'partner',
        roleTr: 'Ürün Direktörü',
        avatar: '📊',
        text: {
          en: "You hit the nail on the head — a controlled beta protects our reputation and still honors the Friday date!",
          de: 'Damit hast du den Nagel auf den Kopf getroffen — eine kontrollierte Beta schützt unseren Ruf und hält den Termin!',
          es: 'Has dado justo en el clavo: una beta controlada protege nuestra reputación y mantiene la fecha del viernes.',
        },
        turkishGloss: 'Tam isabet ettin — kontrollü bir beta itibarımızı korur ve cuma tarihini de tutturmamızı sağlar!',
      },
      {
        speaker: 'learner',
        roleTr: 'Sen (Uzman)',
        avatar: '🎯',
        text: {
          en: "Exactly! We will figure it out together tomorrow morning — let's call it a day for tonight.",
          de: 'Genau! Wir finden den Rest morgen früh gemeinsam heraus — machen wir für heute Feierabend.',
          es: '¡Exacto! Lo resolveremos juntos mañana por la mañana; dejémoslo por hoy.',
        },
        turkishGloss: 'Kesinlikle! Yarın sabah bunu birlikte çözeriz — bugünlük bu kadar yeter diyelim.',
        options: [
          {
            text: {
              en: 'Yes! We will figure out it tomorrow — let us finish the day now.',
              de: 'Ja! Wir finden heraus das morgen — machen wir Tag Ende.',
              es: '¡Sí! Resolvemos eso mañana — terminamos el día.',
            },
            turkishHint: '"figure out it" zamir sırası hatası + yapay kapanış',
            isBest: false,
            feedbackTr:
              '"figure out" zamirle bölünür ("figure it out", "figure out it" YANLIŞTIR!) ve mesai bitirişi "call it a day" deyimiyle söylenir.',
          },
          {
            text: {
              en: 'I am agree! Let us put out the fixes until Monday.',
              de: 'Ich bin einverstanden! Schieben wir auf bis Montag.',
              es: '¡Estoy de acuerdo! Dejemos para lunes las pruebas.',
            },
            turkishHint: '"I am agree" + yanlış phrasal verb "put out" (söndürmek)',
            isBest: false,
            feedbackTr:
              '"put out" yangın söndürmek demektir, ertelemek "put off"tır! Ayrıca "I am agree" yerine "I agree" / "Exactly" kullanılmalıdır.',
          },
          {
            text: {
              en: "Exactly! We will figure it out together tomorrow morning — let's call it a day for tonight.",
              de: 'Genau! Wir finden den Rest morgen früh gemeinsam heraus — machen wir für heute Feierabend.',
              es: '¡Exacto! Lo resolveremos juntos mañana por la mañana; dejémoslo por hoy.',
            },
            turkishHint: 'Doğru zamir yeri ("figure it out") + "call it a day"',
            isBest: true,
            feedbackTr:
              'Doğru kullanım: Phrasal verb zamir sırası ("figure it out"), "Feierabend machen" ve "dejémoslo por hoy" tamamen ana dili düzeyinde.',
          },
        ],
      },
    ],
  },
];

export const ALL_ADULT_ITEMS: AdultPhraseItem[] = ADULT_MODULES.flatMap((m) => m.items);

export const ADULT_ITEM_BY_ID: Record<string, AdultPhraseItem> = Object.fromEntries(
  ALL_ADULT_ITEMS.map((item) => [item.id, item]),
);

export function getAdultModuleById(id: string): AdultModule | undefined {
  return ADULT_MODULES.find((m) => m.id === id);
}
