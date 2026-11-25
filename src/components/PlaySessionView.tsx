import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  HelpCircle,
  Home,
  Mic,
  MicOff,
  RefreshCw,
  Sparkles,
  Star,
  Trees,
  Volume2,
} from 'lucide-react';
import type {
  FSRSGrade,
  LearnerProfile,
  MascotMood,
  VocabItem,
  WorldData,
} from '../types';
import { audioEngine, matchSpokenAttempt } from '../engine/audioEngine';
import {
  TR_VOICE,
  pickRandomNudge,
  pickRandomPraise,
} from '../data/voiceScripts';
import {
  MS_PER_DAY,
  buildSessionQueue,
  cardKey,
  computeItemMasteryPct,
  computeRetrievability,
  inferImplicitGrade,
} from '../engine/fsrs5';
import { MascotPiko } from './MascotPiko';

export interface PlaySessionViewProps {
  world: WorldData;
  allVocab: VocabItem[];
  profile: LearnerProfile;
  onRecordReview: (
    itemId: string,
    grade: FSRSGrade,
    speakingDone: boolean,
    elapsedSec: number,
  ) => void;
  onExit: () => void;
  onGoLivingWorld: () => void;
}

type LoopStage = 'discover' | 'listen_pick' | 'echo_speak' | 'svo_build';
type SpeechStatus = 'idle' | 'listening' | 'matched' | 'retry' | 'unsupported';

interface SvoBlock {
  idx: number;
  text: string;
}

function shuffleArray<T>(items: T[]): T[] {
  const arr = [...items];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function buildSvoShuffledBlocks(chunks: [string, string, string]): SvoBlock[] {
  const base: SvoBlock[] = chunks.map((text, idx) => ({ idx, text }));
  const shuffled = shuffleArray(base);
  const sameOrder = shuffled.every((b, pos) => b.text === chunks[pos]);
  if (sameOrder && shuffled.length === 3) {
    return [shuffled[1], shuffled[2], shuffled[0]];
  }
  return shuffled;
}

const CONFETTI_SPOTS = [
  { left: '12%', top: '76%', icon: '🌟', delay: '0s' },
  { left: '26%', top: '82%', icon: '✨', delay: '0.08s' },
  { left: '42%', top: '74%', icon: '🎉', delay: '0.14s' },
  { left: '58%', top: '80%', icon: '💛', delay: '0.06s' },
  { left: '74%', top: '75%', icon: '⭐', delay: '0.18s' },
  { left: '88%', top: '82%', icon: '🦋', delay: '0.1s' },
];

const GRADE_LABEL_TR: Record<FSRSGrade, string> = {
  1: 'Tekrar (1)',
  2: 'Zor (2)',
  3: 'İyi (3)',
  4: 'Kolay (4)',
};

export function PlaySessionView({
  world,
  allVocab,
  profile,
  onRecordReview,
  onExit,
  onGoLivingWorld,
}: PlaySessionViewProps) {
  const isMini = profile.ageMode === 'mini';
  const isExplorer = profile.ageMode === 'explorer';
  const isMaster = profile.ageMode === 'master';

  const sessionKey = `${world.id}:${profile.id}:${profile.targetLang}:${profile.ageMode}`;
  const prevSessionKeyRef = useRef<string>(sessionKey);

  // Freeze optimal micro-session queue once per session entry (Cowan WM ceiling)
  const [queueIds, setQueueIds] = useState<string[]>(() =>
    buildSessionQueue(
      world.items.map((item) => item.id),
      profile.cards,
      profile.targetLang,
      profile.ageMode,
    ),
  );

  const [currentIdx, setCurrentIdx] = useState(0);
  const [stage, setStage] = useState<LoopStage>('discover');
  const [sessionComplete, setSessionComplete] = useState(false);
  const [awakenedSessionCount, setAwakenedSessionCount] = useState(0);
  const [starsEarned, setStarsEarned] = useState(0);
  const [comboStreak, setComboStreak] = useState(0);
  const [xpEarned, setXpEarned] = useState(0);

  // Explorer Stage 1 Orthographic Delay state (Audio-First -> Text Reveal)
  const [explorerTextRevealed, setExplorerTextRevealed] = useState(false);
  const [explorerAudioPlayed, setExplorerAudioPlayed] = useState(false);
  const [tprSpoken, setTprSpoken] = useState(false);

  useEffect(() => {
    if (prevSessionKeyRef.current === sessionKey) return;
    prevSessionKeyRef.current = sessionKey;
    setQueueIds(
      buildSessionQueue(
        world.items.map((item) => item.id),
        profile.cards,
        profile.targetLang,
        profile.ageMode,
      ),
    );
    setCurrentIdx(0);
    setStage('discover');
    setSessionComplete(false);
    setAwakenedSessionCount(0);
    setStarsEarned(0);
    setComboStreak(0);
    setXpEarned(0);
    setExplorerTextRevealed(false);
    setExplorerAudioPlayed(false);
    setTprSpoken(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sessionKey]);

  const itemLookup = useMemo(() => {
    const record: Record<string, VocabItem> = {};
    for (const v of allVocab) record[v.id] = v;
    for (const v of world.items) record[v.id] = v;
    return record;
  }, [allVocab, world.items]);

  const sessionItems = useMemo(
    () =>
      queueIds
        .map((id) => itemLookup[id])
        .filter((item): item is VocabItem => Boolean(item)),
    [queueIds, itemLookup],
  );

  // Audio & Mascot state
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [mascotMood, setMascotMood] = useState<MascotMood>('idle');
  const [mascotBubble, setMascotBubble] = useState<string | undefined>(undefined);

  // Stage 2 (listen_pick) state
  const [choices, setChoices] = useState<VocabItem[]>([]);
  const [wrongAttempts, setWrongAttempts] = useState(0);
  const [hintUsed, setHintUsed] = useState(false);
  const [nudgedIds, setNudgedIds] = useState<string[]>([]);
  const [wigglingChoiceId, setWigglingChoiceId] = useState<string | null>(null);
  const [stage2Solved, setStage2Solved] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [computedGrade, setComputedGrade] = useState<FSRSGrade>(3);

  // Stage 3 (echo_speak) state
  const [speechStatus, setSpeechStatus] = useState<SpeechStatus>('idle');
  const [speakingDone, setSpeakingDone] = useState(false);
  const [lastHeard, setLastHeard] = useState('');
  const [matchScorePct, setMatchScorePct] = useState<number | null>(null);

  // Stage 4 (svo_build) state
  const [svoBank, setSvoBank] = useState<SvoBlock[]>([]);
  const [svoPlaced, setSvoPlaced] = useState<SvoBlock[]>([]);
  const [wigglingBlockIdx, setWigglingBlockIdx] = useState<number | null>(null);
  const [svoSolved, setSvoSolved] = useState(false);

  const itemStartMsRef = useRef<number>(Date.now());
  const stage2StartMsRef = useRef<number>(Date.now());
  const discoverStartMsRef = useRef<number>(Date.now());
  const timerRef = useRef<number | null>(null);
  const revealTimerRef = useRef<number | null>(null);

  const clearTimer = useCallback(() => {
    if (timerRef.current !== null) {
      window.clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    if (revealTimerRef.current !== null) {
      window.clearTimeout(revealTimerRef.current);
      revealTimerRef.current = null;
    }
  }, []);

  useEffect(() => {
    return () => {
      clearTimer();
      audioEngine.stopSpeaking();
      audioEngine.stopListening();
    };
  }, [clearTimer]);

  const currentItem = sessionItems[currentIdx] ?? null;
  const phrase = currentItem ? currentItem.langs[profile.targetLang] : null;
  const existingCard = currentItem
    ? profile.cards[cardKey(profile.targetLang, currentItem.id)]
    : undefined;

  const isMasteredCard = Boolean(
    existingCard && existingCard.reps >= 2 && existingCard.lastGrade >= 3,
  );

  const speakNative = useCallback(
    (text: string, slowOverride?: boolean, onAudioComplete?: () => void) => {
      let started = false;
      audioEngine.speak(text, profile.targetLang, {
        slow: slowOverride ?? profile.speechSlowMode,
        childPitch: isMini,
        onStart: () => {
          started = true;
          setIsSpeaking(true);
          setMascotMood('speaking');
        },
        onEnd: () => {
          setIsSpeaking(false);
          setMascotMood((prev) => (prev === 'speaking' ? 'idle' : prev));
          if (started) {
            onAudioComplete?.();
          }
        },
      });
    },
    [isMini, profile.speechSlowMode, profile.targetLang],
  );

  const triggerExplorerAudioAndReveal = useCallback(
    (word: string, slowOverride?: boolean) => {
      if (revealTimerRef.current !== null) {
        window.clearTimeout(revealTimerRef.current);
        revealTimerRef.current = null;
      }

      const completeReveal = () => {
        setExplorerAudioPlayed(true);
        setExplorerTextRevealed(true);
      };

      speakNative(word, slowOverride, completeReveal);

      // Guard against browsers where SpeechSynthesis.onend doesn't fire reliably
      if (explorerAudioPlayed) {
        completeReveal();
      } else {
        revealTimerRef.current = window.setTimeout(() => {
          completeReveal();
        }, 650);
      }
    },
    [explorerAudioPlayed, speakNative],
  );

  const buildChoices = useCallback(
    (target: VocabItem, count: number): VocabItem[] => {
      const worldPool = world.items.filter((v) => v.id !== target.id);
      const fallbackPool = allVocab.filter(
        (v) => v.id !== target.id && !worldPool.some((wp) => wp.id === v.id),
      );
      const distractors = [...shuffleArray(worldPool), ...shuffleArray(fallbackPool)].slice(
        0,
        Math.max(1, count - 1),
      );
      return shuffleArray([target, ...distractors]);
    },
    [allVocab, world.items],
  );

  // Initialize stage transitions & auto-play natural audio
  useEffect(() => {
    if (sessionComplete || !currentItem || !phrase) return;
    clearTimer();
    audioEngine.stopListening();

    if (stage === 'discover') {
      itemStartMsRef.current = Date.now();
      discoverStartMsRef.current = Date.now();
      setExplorerTextRevealed(false);
      setExplorerAudioPlayed(false);
      setTprSpoken(false);
      setMascotMood('idle');
      setMascotBubble(
        isMini
          ? 'Dinle ve hareketi yap! 🎧'
          : isExplorer
            ? 'Önce sadece dinle — ardından yazıyı aç! 🎧'
            : `"${phrase.microSentence}"`,
      );
      setWrongAttempts(0);
      setHintUsed(false);
      setNudgedIds([]);
      setWigglingChoiceId(null);
      setStage2Solved(false);
      setShowConfetti(false);
      setComputedGrade(3);
      setSpeechStatus('idle');
      setSpeakingDone(false);
      setLastHeard('');
      setMatchScorePct(null);
      setSvoPlaced([]);
      setSvoSolved(false);
      if (isMini) {
        audioEngine.speakSequence(
          [
            { text: currentItem.turkishMeaning, lang: 'tr' },
            {
              text: phrase.word,
              lang: profile.targetLang,
              slow: profile.speechSlowMode,
              role: 'warm',
            },
            { text: currentItem.tprActionTr, lang: 'tr' },
          ],
          {
            onStart: () => {
              setIsSpeaking(true);
              setMascotMood('speaking');
            },
            onEnd: () => {
              setIsSpeaking(false);
              setMascotMood((prev) => (prev === 'speaking' ? 'idle' : prev));
            },
          },
        );
      } else {
        audioEngine.speakSequence(
          [
            { text: currentItem.turkishMeaning, lang: 'tr' },
            {
              text: phrase.word,
              lang: profile.targetLang,
              slow: profile.speechSlowMode,
              role: 'warm',
            },
          ],
          {
            onStart: () => {
              setIsSpeaking(true);
              setMascotMood('speaking');
            },
            onEnd: () => {
              setIsSpeaking(false);
              setMascotMood((prev) => (prev === 'speaking' ? 'idle' : prev));
              if (profile.ageMode === 'explorer' && Date.now() - discoverStartMsRef.current >= 450) {
                setExplorerAudioPlayed(true);
                setExplorerTextRevealed(true);
              }
            },
          },
        );
      }
    } else if (stage === 'listen_pick') {
      const choiceCount = isMini ? 3 : 4;
      setChoices(buildChoices(currentItem, choiceCount));
      setWrongAttempts(0);
      setHintUsed(false);
      setNudgedIds([]);
      setWigglingChoiceId(null);
      setStage2Solved(false);
      setShowConfetti(false);
      stage2StartMsRef.current = Date.now();
      const promptText = isMasteredCard ? phrase.microSentence : phrase.word;
      setMascotMood('idle');
      setMascotBubble(
        isMini
          ? 'Hangisi? Dinle ve dokun! 👆'
          : isExplorer
            ? '4 seçenek arasından duyduğunu yakala! ⚡'
            : 'Duyduğun kelimeye karşılık gelen kartı seç!',
      );
      speakNative(promptText);
    } else if (stage === 'echo_speak') {
      setSpeechStatus('idle');
      setLastHeard('');
      setMatchScorePct(null);
      setMascotMood('idle');
      setMascotBubble(
        isMini ? 'Şimdi sen söyle! 🎤' : 'Mikrofona dokun ve kelimeyi sesli söyle!',
      );
      if (isMini) {
        audioEngine.speakSequence(
          [
            { text: TR_VOICE.stageSpeak, lang: 'tr' },
            {
              text: phrase.word,
              lang: profile.targetLang,
              slow: profile.speechSlowMode,
              role: 'warm',
            },
          ],
          {
            onStart: () => {
              setIsSpeaking(true);
              setMascotMood('speaking');
            },
            onEnd: () => {
              setIsSpeaking(false);
              setMascotMood((prev) => (prev === 'speaking' ? 'idle' : prev));
            },
          },
        );
      } else {
        speakNative(phrase.word);
      }
    } else if (stage === 'svo_build') {
      setSvoBank(buildSvoShuffledBlocks(phrase.svoChunks));
      setSvoPlaced([]);
      setWigglingBlockIdx(null);
      setSvoSolved(false);
      setMascotMood('thinking');
      setMascotBubble('Blokları Özne → Eylem → Nesne sırasıyla diz! 🧩');
    }
  }, [
    buildChoices,
    clearTimer,
    currentItem,
    isExplorer,
    isMasteredCard,
    isMini,
    phrase,
    profile.ageMode,
    profile.speechSlowMode,
    profile.targetLang,
    sessionComplete,
    speakNative,
    stage,
  ]);

  const commitItemAndAdvance = useCallback(
    (finalSpeakingDone: boolean) => {
      if (!currentItem) return;
      clearTimer();
      audioEngine.stopSpeaking();
      audioEngine.stopListening();

      const elapsedSec = Math.max(
        3,
        Math.round((Date.now() - itemStartMsRef.current) / 1000),
      );
      onRecordReview(currentItem.id, computedGrade, finalSpeakingDone, elapsedSec);

      if (computedGrade >= 2) {
        setAwakenedSessionCount((c) => c + 1);
      }
      setStarsEarned((s) => s + (finalSpeakingDone ? 2 : 1));

      if (currentIdx + 1 < sessionItems.length) {
        setCurrentIdx((idx) => idx + 1);
        setStage('discover');
      } else {
        audioEngine.playChime('celebrate', profile.soundFxEnabled);
        setSessionComplete(true);
        if (isMini) {
          audioEngine.speakTurkish(TR_VOICE.sessionComplete);
        }
      }
    },
    [
      clearTimer,
      computedGrade,
      currentIdx,
      currentItem,
      isMini,
      onRecordReview,
      profile.soundFxEnabled,
      sessionItems.length,
    ],
  );

  // Stage 2 handler
  const handleChoicePick = (choice: VocabItem) => {
    if (!currentItem || !phrase || stage2Solved) return;

    if (choice.id === currentItem.id) {
      const rtMs = Math.max(200, Date.now() - stage2StartMsRef.current);
      const grade = inferImplicitGrade({
        wrongAttempts,
        reactionTimeMs: rtMs,
        hintUsed,
        ageMode: profile.ageMode,
      });

      let nextCombo = comboStreak;
      if (isExplorer) {
        nextCombo = wrongAttempts === 0 ? comboStreak + 1 : 0;
        setComboStreak(nextCombo);
        setXpEarned((xp) => xp + (wrongAttempts === 0 ? 15 + nextCombo * 5 : 5));
      }

      audioEngine.playChime('success', profile.soundFxEnabled);
      setComputedGrade(grade);
      setStage2Solved(true);
      setShowConfetti(true);
      setMascotMood('celebrating');
      setMascotBubble(
        isExplorer && nextCombo >= 2
          ? `🔥 x${nextCombo} Kombo! Süper gidiyorsun! ⚡`
          : grade === 4
            ? 'Şimşek gibi bildin! 🌟⚡'
            : 'Harika! İşte bu! 🌟',
      );

      const solvedAt = Date.now();
      clearTimer();
      timerRef.current = window.setTimeout(() => {
        setStage('echo_speak');
      }, 6500);

      audioEngine.speakSequence(
        [
          { text: pickRandomPraise(), lang: 'tr' },
          {
            text: phrase.microSentence,
            lang: profile.targetLang,
            slow: profile.speechSlowMode,
            role: 'warm',
          },
        ],
        {
          onStart: () => setIsSpeaking(true),
          onEnd: () => {
            setIsSpeaking(false);
            const remaining = Math.max(350, 1150 - (Date.now() - solvedAt));
            clearTimer();
            timerRef.current = window.setTimeout(() => {
              setStage('echo_speak');
            }, remaining);
          },
        },
      );
    } else {
      // Zero-shame gentle nudge: warm peach wiggle + slow audio replay
      audioEngine.playChime('gentle-nudge', profile.soundFxEnabled);
      setWrongAttempts((w) => w + 1);
      if (isExplorer) {
        setComboStreak(0);
      }
      setWigglingChoiceId(choice.id);
      setNudgedIds((prev) => (prev.includes(choice.id) ? prev : [...prev, choice.id]));
      setMascotMood('encouraging');
      setMascotBubble('Yaklaştın! Haydi yavaşça tekrar dinleyelim 💛');
      audioEngine.speakSequence(
        [
          { text: pickRandomNudge(), lang: 'tr' },
          {
            text: phrase.word,
            lang: profile.targetLang,
            slow: true,
            role: 'warm',
          },
        ],
        {
          onStart: () => setIsSpeaking(true),
          onEnd: () => {
            setIsSpeaking(false);
            setMascotMood((prev) => (prev === 'speaking' ? 'idle' : prev));
          },
        },
      );

      clearTimer();
      timerRef.current = window.setTimeout(() => {
        setWigglingChoiceId(null);
      }, 600);
    }
  };

  // Stage 3 ASR handler
  const handleToggleListening = () => {
    if (!phrase) return;

    if (speechStatus === 'listening') {
      audioEngine.stopListening();
      setSpeechStatus('idle');
      setMascotMood('idle');
      return;
    }

    audioEngine.stopSpeaking();
    audioEngine.playChime('tap', profile.soundFxEnabled);
    setSpeechStatus('listening');
    setMascotMood('listening');
    setMascotBubble('Seni dinliyorum, söyle bakalım! 👂');

    audioEngine.startListening(
      profile.targetLang,
      (transcripts) => {
        const res = matchSpokenAttempt(
          phrase.word,
          phrase.bareWord,
          transcripts,
          profile.ageMode !== 'master',
        );
        setLastHeard(res.bestHeard);
        setMatchScorePct(Math.round(res.score * 100));

        if (res.matched) {
          audioEngine.playChime('celebrate', profile.soundFxEnabled);
          setSpeakingDone(true);
          setSpeechStatus('matched');
          setMascotMood('celebrating');
          setMascotBubble('Harika söyledin! Yıldız kazandın! ⭐');
        } else {
          audioEngine.playChime('gentle-nudge', profile.soundFxEnabled);
          setSpeechStatus('retry');
          setMascotMood('encouraging');
          setMascotBubble('Çok güzel deneme! İstersen bir kez daha söyle 💛');
          speakNative(phrase.word, true);
        }
      },
      (reason) => {
        setSpeechStatus(reason === 'unsupported' || reason === 'not-allowed' ? 'unsupported' : 'retry');
        setMascotMood('encouraging');
        setMascotBubble('Sorun değil! Dinleyip kendi sesinle tekrar edebilirsin 💛');
      },
      () => {
        setSpeechStatus((prev) => (prev === 'listening' ? 'idle' : prev));
        setMascotMood((prev) => (prev === 'listening' ? 'idle' : prev));
      },
    );
  };

  const handleFinishEchoStage = (heardByAsr: boolean) => {
    audioEngine.stopListening();
    audioEngine.playChime('success', profile.soundFxEnabled);
    const nextSpeakingDone = heardByAsr || speakingDone;
    if (isExplorer) {
      setXpEarned((xp) => xp + (nextSpeakingDone ? 15 : 8));
    }
    if (isMini) {
      commitItemAndAdvance(nextSpeakingDone);
    } else {
      setSpeakingDone(nextSpeakingDone);
      setStage('svo_build');
    }
  };

  // Stage 4 SVO Builder handler
  const handlePickSvoBlock = (block: SvoBlock) => {
    if (!phrase || svoSolved) return;
    if (svoPlaced.some((b) => b.idx === block.idx)) return;

    const expectedIdx = svoPlaced.length;
    const expectedText = phrase.svoChunks[expectedIdx];

    if (block.text === expectedText) {
      const nextPlaced = [...svoPlaced, block];
      setSvoPlaced(nextPlaced);
      audioEngine.playChime('tap', profile.soundFxEnabled);

      if (nextPlaced.length === 3) {
        setSvoSolved(true);
        if (isExplorer) {
          setXpEarned((xp) => xp + 20);
        }
        audioEngine.playChime('celebrate', profile.soundFxEnabled);
        setMascotMood('celebrating');
        setMascotBubble(`Mükemmel cümle! "${phrase.microSentence}" 🎉`);
        speakNative(phrase.microSentence);
      }
    } else {
      audioEngine.playChime('gentle-nudge', profile.soundFxEnabled);
      setWigglingBlockIdx(block.idx);
      setMascotMood('encouraging');
      const roleHints = ['Özne (Kim/Ne)', 'Eylem (Ne yapıyor)', 'Nesne (Neyi)'];
      setMascotBubble(`İpucu: Sıradaki parça "${roleHints[expectedIdx]}"! 💡`);
      clearTimer();
      timerRef.current = window.setTimeout(() => {
        setWigglingBlockIdx(null);
      }, 600);
    }
  };

  const handleMascotTap = () => {
    if (!phrase) return;
    audioEngine.playChime('tap', profile.soundFxEnabled);
    if (stage === 'svo_build') {
      speakNative(phrase.microSentence);
    } else {
      speakNative(phrase.word, isMini);
    }
  };

  // =========================================================================
  // Empty State Safeguard
  // =========================================================================
  if (!sessionComplete && (!currentItem || !phrase)) {
    return (
      <section className="ln-play-session">
        <div className="ln-card" style={{ textAlign: 'center' }}>
          <h2>{world.titleTr}</h2>
          <p>Bu dünyada henüz görüntülenecek kelime bulunamadı.</p>
          <button type="button" className="ln-clay-btn" onClick={onExit}>
            <ArrowLeft size={18} />
            <span>Haritaya Dön</span>
          </button>
        </div>
      </section>
    );
  }

  // =========================================================================
  // End-of-Session Celebration Screen
  // =========================================================================
  if (sessionComplete) {
    return (
      <section className="ln-play-session">
        <div className="ln-play-stage" style={{ textAlign: 'center', padding: '36px 24px' }}>
          <div className="ln-confetti-layer" aria-hidden="true">
            {CONFETTI_SPOTS.map((c, idx) => (
              <span
                key={idx}
                className="ln-confetti-piece"
                style={{ left: c.left, top: c.top, animationDelay: c.delay }}
              >
                {c.icon}
              </span>
            ))}
          </div>

          <MascotPiko
            mood="celebrating"
            size={isMini ? 168 : 148}
            bubbleText={`Harika iş ${profile.name}! ${world.emoji} Adası seninle parlıyor!`}
          />

          <h1 style={{ fontSize: 'clamp(1.6rem, 3vw, 2.3rem)' }}>
            🎉 Oturum Tamamlandı!
          </h1>

          <div className="ln-chip-group" style={{ justifyContent: 'center' }}>
            <span
              className="ln-chip-btn"
              style={{ background: '#fef3c7', borderColor: '#f59e0b', color: '#78350f' }}
            >
              <Star size={18} style={{ verticalAlign: 'text-bottom', marginRight: '6px' }} />
              Kazanılan Yıldız: <strong>{starsEarned}</strong>
            </span>
            <span
              className="ln-chip-btn"
              style={{ background: '#ecfdf5', borderColor: '#10b981', color: '#065f46' }}
            >
              <Sparkles size={18} style={{ verticalAlign: 'text-bottom', marginRight: '6px' }} />
              Uyanan Arkadaş: <strong>{awakenedSessionCount}</strong>
            </span>
          </div>

          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: '16px',
              justifyContent: 'center',
              marginTop: '8px',
            }}
          >
            <button
              type="button"
              className="ln-clay-btn ln-clay-btn--mint ln-touch-xl"
              onClick={() => {
                audioEngine.playChime('tap', profile.soundFxEnabled);
                onGoLivingWorld();
              }}
            >
              <Trees size={24} />
              <span>Yaşayan Dünyaya Git</span>
            </button>
            <button
              type="button"
              className="ln-clay-btn ln-clay-btn--soft ln-touch-xl"
              onClick={() => {
                audioEngine.playChime('tap', profile.soundFxEnabled);
                onExit();
              }}
            >
              <Home size={24} />
              <span>Haritaya Dön</span>
            </button>
          </div>
        </div>
      </section>
    );
  }

  if (!currentItem || !phrase) {
    return null;
  }

  const item = currentItem;
  const activePhrase = phrase;
  const progressPct = Math.round(((currentIdx + 1) / sessionItems.length) * 100);
  const existingMasteryPct = computeItemMasteryPct(existingCard);
  const existingRetrievabilityPct =
    existingCard && existingCard.reps > 0
      ? Math.round(
          computeRetrievability(
            Math.max(0, (Date.now() - existingCard.lastReviewAt) / MS_PER_DAY),
            existingCard.stability,
          ) * 100,
        )
      : null;

  return (
    <section className="ln-play-session">
      {/* Top Session Progress Bar */}
      <div
        className="ln-card"
        style={{
          padding: '14px 20px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '14px',
          flexWrap: 'wrap',
        }}
      >
        <button
          type="button"
          className="ln-clay-btn ln-clay-btn--soft"
          style={{ minHeight: '48px', padding: '10px 18px' }}
          onClick={() => {
            clearTimer();
            audioEngine.stopSpeaking();
            audioEngine.stopListening();
            onExit();
          }}
        >
          <ArrowLeft size={18} />
          <span>{isMini ? 'Çık' : 'Harita'}</span>
        </button>

        <div style={{ flex: '1 1 200px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              fontWeight: 800,
              fontSize: '0.92rem',
            }}
          >
            <span>
              {world.emoji} {world.titleTr}
            </span>
            <span>
              {currentIdx + 1} / {sessionItems.length}
            </span>
          </div>
          <div
            className="ln-progress-track"
            style={{ background: '#e2e8f0', height: '10px' }}
            aria-hidden="true"
          >
            <div
              className="ln-progress-fill"
              style={{
                width: `${progressPct}%`,
                background: `linear-gradient(90deg, ${world.gradient[0]}, ${world.gradient[1]})`,
              }}
            />
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
          {isExplorer && (
            <span className={`ln-combo-badge ${comboStreak >= 2 ? 'is-hot' : ''}`}>
              🔥 {comboStreak > 0 ? `x${comboStreak}` : 'Seri'} · ⚡ {xpEarned} XP
            </span>
          )}
          <span className="ln-chip-btn" style={{ background: '#fef3c7', borderColor: '#fbbf24', color: '#78350f' }}>
            ⭐ {starsEarned}
          </span>
        </div>
      </div>

      {/* Main Acquisition Stage */}
      <div className="ln-play-stage">
        {showConfetti && (
          <div className="ln-confetti-layer" aria-hidden="true">
            {CONFETTI_SPOTS.map((c, idx) => (
              <span
                key={idx}
                className="ln-confetti-piece"
                style={{ left: c.left, top: c.top, animationDelay: c.delay }}
              >
                {c.icon}
              </span>
            ))}
          </div>
        )}

        {/* Mascot Piko Companion */}
        <MascotPiko
          mood={mascotMood}
          size={isMini ? 142 : 122}
          bubbleText={mascotBubble}
          onTap={handleMascotTap}
          speakingWave={isSpeaking}
        />

        {/* ================================================================
            STAGE 1: DISCOVER (Dual Coding + TPR, Zero-Text in Mini, Orthographic Delay in Explorer)
           ================================================================ */}
        {stage === 'discover' && (
          <div
            style={{
              width: '100%',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '20px',
            }}
          >
            {isExplorer && (
              <div
                className={`ln-audio-wave ${isSpeaking ? 'is-active' : ''}`}
                aria-label="Ses dalgası"
              >
                <span className="ln-audio-wave-bar" />
                <span className="ln-audio-wave-bar" />
                <span className="ln-audio-wave-bar" />
                <span className="ln-audio-wave-bar" />
                <span className="ln-audio-wave-bar" />
              </div>
            )}

            <button
              type="button"
              onClick={() =>
                isExplorer
                  ? triggerExplorerAudioAndReveal(activePhrase.word)
                  : speakNative(activePhrase.word)
              }
              style={{
                width: isMini ? '220px' : '190px',
                height: isMini ? '220px' : '190px',
                borderRadius: '36px',
                backgroundColor: item.bgColor,
                border: `4px solid ${item.accentColor}`,
                boxShadow: `0 12px 0 ${item.accentColor}44, 0 22px 36px rgba(15, 23, 42, 0.14)`,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                transition: 'transform 0.2s var(--ln-ease-spring)',
              }}
              aria-label="Sesli kelimeyi dinle"
            >
              <span style={{ fontSize: isMini ? '6.2rem' : '5.2rem', lineHeight: 1 }}>
                {item.emoji}
              </span>
            </button>

            {/* Bilingual Concept Anchor: Turkish Meaning + Sound Onomatopoeia (Always visible & speakable!) */}
            <div className="ln-chip-group" style={{ justifyContent: 'center' }}>
              <button
                type="button"
                className="ln-chip-btn"
                style={{
                  background: '#ecfeff',
                  borderColor: '#38bdf8',
                  color: '#0c4a6e',
                  fontSize: isMini ? '1.15rem' : '1.05rem',
                  fontWeight: 900,
                }}
                onClick={() => {
                  audioEngine.playChime('tap', profile.soundFxEnabled);
                  audioEngine.speakSequence([
                    { text: item.turkishMeaning, lang: 'tr' },
                    {
                      text: activePhrase.word,
                      lang: profile.targetLang,
                      slow: profile.speechSlowMode,
                      role: 'warm',
                    },
                  ]);
                }}
                title="Türkçesini ve hedef dildeki karşılığını birlikte dinle"
              >
                🇹🇷 {item.turkishMeaning} <Volume2 size={16} style={{ verticalAlign: 'text-bottom', marginLeft: '4px' }} />
              </button>

              <button
                type="button"
                className="ln-chip-btn"
                style={{
                  background: '#fff7ed',
                  borderColor: '#fdba74',
                  color: '#9a3412',
                  fontSize: '1.05rem',
                }}
                onClick={() => {
                  audioEngine.playChime('tap', profile.soundFxEnabled);
                  if (isExplorer) {
                    triggerExplorerAudioAndReveal(activePhrase.word);
                  } else {
                    speakNative(activePhrase.word);
                  }
                }}
              >
                💬 {item.soundOnomatopoeia}
              </button>
            </div>

            {/* Explorer Orthographic Delay Gate: Audio-First, then Smooth Spelling + IPA + Phonetic Reveal */}
            {isExplorer && !explorerTextRevealed && (
              <div className="ln-orthographic-reveal">
                <span className="ln-orthographic-reveal-tag">
                  🎧 Ses-Önce Öğrenme (8–14 Yaş)
                </span>
                <p
                  style={{
                    margin: 0,
                    fontWeight: 700,
                    color: 'var(--ln-ink-soft)',
                    fontSize: '0.94rem',
                  }}
                >
                  Beyin önce sesi kodlar — ses dalgasını dinle, ardından yazımı ve IPA&apos;yı aç!
                </p>
                <button
                  type="button"
                  className="ln-clay-btn ln-clay-btn--lavender"
                  onClick={() => {
                    audioEngine.playChime('tap', profile.soundFxEnabled);
                    triggerExplorerAudioAndReveal(activePhrase.word);
                  }}
                >
                  <Volume2 size={20} />
                  <span>Önce Dinle, Sonra Yazıyı Aç</span>
                </button>
              </div>
            )}

            {/* Explorer (Post-Audio Revealed) & Master Text Reveal — Strictly omitted in Mini Mode! */}
            {!isMini && (!isExplorer || explorerTextRevealed) && (
              <div
                className={isExplorer ? 'ln-orthographic-revealed-card' : undefined}
                style={
                  isExplorer
                    ? undefined
                    : {
                        textAlign: 'center',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '6px',
                        maxWidth: '520px',
                      }
                }
              >
                <div
                  style={{
                    fontFamily: 'var(--ln-font-display)',
                    fontSize: '2rem',
                    fontWeight: 700,
                    color: 'var(--ln-ink)',
                  }}
                >
                  {activePhrase.word}
                </div>
                <div style={{ color: 'var(--ln-ink-muted)', fontWeight: 800 }}>
                  {activePhrase.ipa} • 🇹🇷 {item.turkishMeaning}
                </div>
                <button
                  type="button"
                  className="ln-chip-btn"
                  style={{
                    marginTop: '6px',
                    background: '#f0f9ff',
                    borderColor: '#bae6fd',
                    color: '#0369a1',
                  }}
                  onClick={() => speakNative(activePhrase.microSentence)}
                >
                  <Volume2 size={16} style={{ verticalAlign: 'text-bottom', marginRight: '6px' }} />
                  {activePhrase.microSentence}
                </button>
                <small style={{ color: '#6d28d9', fontWeight: 800 }}>
                  💡 {activePhrase.phoneticHintTr ?? `Sesletim & Yapı: ${activePhrase.svoChunks.join(' · ')}`}
                </small>
              </div>
            )}

            {/* TPR Physical Movement Badge (Auto-spoken aloud in Turkish on tap) */}
            <button
              type="button"
              className={`ln-tpr-banner ${tprSpoken ? 'is-spoken' : ''}`}
              onClick={() => {
                audioEngine.playChime('tap', profile.soundFxEnabled);
                setTprSpoken(true);
                audioEngine.speakTurkish(item.tprActionTr, {
                  onEnd: () => setTprSpoken(false),
                });
              }}
              title="Hareketi sesli dinle"
            >
              <span style={{ fontSize: '1.7rem' }} aria-hidden="true">
                {item.tprEmoji}
              </span>
              <span>{item.tprActionTr}</span>
              <Volume2 size={18} />
            </button>

            {/* Speaker Replay Row: Normal + Turtle 0.78x */}
            <div className="ln-chip-group" style={{ justifyContent: 'center' }}>
              <button
                type="button"
                className="ln-clay-btn ln-touch-xl"
                onClick={() =>
                  isExplorer
                    ? triggerExplorerAudioAndReveal(activePhrase.word, false)
                    : speakNative(activePhrase.word, false)
                }
              >
                <Volume2 size={24} />
                <span>{isMini ? 'Dinle' : 'Normal Dinle'}</span>
              </button>

              <button
                type="button"
                className="ln-clay-btn ln-clay-btn--gold ln-touch-xl"
                onClick={() =>
                  isExplorer
                    ? triggerExplorerAudioAndReveal(activePhrase.word, true)
                    : speakNative(activePhrase.word, true)
                }
                title="0.78x Kaplumbağa Hızı"
              >
                <span style={{ fontSize: '1.45rem' }} aria-hidden="true">
                  🐢
                </span>
                <span>Yavaş Dinle</span>
              </button>
            </div>

            <button
              type="button"
              className="ln-clay-btn ln-clay-btn--mint ln-touch-xl"
              onClick={() => {
                audioEngine.playChime('tap', profile.soundFxEnabled);
                setStage('listen_pick');
              }}
            >
              <span>Bulma Oyununa Geç!</span>
              <ArrowRight size={22} />
            </button>
          </div>
        )}

        {/* ================================================================
            STAGE 2: LISTEN & PICK (Mini: 3 Toy Cards | Explorer: 4 Cards + Combo XP)
           ================================================================ */}
        {stage === 'listen_pick' && (
          <div
            style={{
              width: '100%',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '20px',
            }}
          >
            {isExplorer && (
              <div className="ln-explorer-hud">
                <span className={`ln-combo-badge ${comboStreak >= 2 ? 'is-hot' : ''}`}>
                  🔥 {comboStreak > 0 ? `x${comboStreak} Seri` : 'Seri Hazır'}
                </span>
                <span className="ln-xp-badge">⚡ {xpEarned} XP</span>
              </div>
            )}

            <div className="ln-chip-group" style={{ justifyContent: 'center' }}>
              <button
                type="button"
                className="ln-clay-btn ln-touch-xl"
                onClick={() =>
                  speakNative(
                    isMasteredCard ? activePhrase.microSentence : activePhrase.word,
                    false,
                  )
                }
              >
                <Volume2 size={24} />
                <span>Tekrar Dinle</span>
              </button>

              <button
                type="button"
                className="ln-clay-btn ln-clay-btn--gold ln-touch-xl"
                onClick={() =>
                  speakNative(
                    isMasteredCard ? activePhrase.microSentence : activePhrase.word,
                    true,
                  )
                }
              >
                <span style={{ fontSize: '1.45rem' }} aria-hidden="true">
                  🐢
                </span>
                <span>Yavaş (0.78x)</span>
              </button>

              <button
                type="button"
                className="ln-clay-btn ln-clay-btn--soft"
                onClick={() => {
                  setHintUsed(true);
                  audioEngine.playChime('tap', profile.soundFxEnabled);
                  audioEngine.speakSequence([
                    { text: item.turkishMeaning, lang: 'tr' },
                    { text: item.tprActionTr, lang: 'tr' },
                    {
                      text: activePhrase.word,
                      lang: profile.targetLang,
                      slow: true,
                      role: 'warm',
                    },
                  ]);
                  setMascotMood('encouraging');
                  setMascotBubble(`🇹🇷 ${item.turkishMeaning} • ${item.tprEmoji} ${item.tprActionTr}`);
                }}
              >
                <HelpCircle size={20} />
                <span>🇹🇷 Türkçe İpucu</span>
              </button>
            </div>

            {/* Mini: Max 3 Giant Toy Cards | Explorer & Master: 4-Choice 2x2 Grid */}
            <div className={`ln-choices-grid ${!isMini ? 'ln-choices-grid--4' : ''}`}>
              {choices.slice(0, isMini ? 3 : 4).map((choice) => {
                const isWiggling = wigglingChoiceId === choice.id;
                const isNudged = nudgedIds.includes(choice.id);
                const isWinner = stage2Solved && choice.id === item.id;

                return (
                  <button
                    key={choice.id}
                    type="button"
                    disabled={stage2Solved}
                    className={`ln-choice-tile ${isWiggling ? 'is-nudge animate-gentle-wiggle' : ''} ${isNudged && !isWiggling ? 'is-nudge' : ''} ${isWinner ? 'is-correct' : ''}`}
                    style={{
                      backgroundColor: isWinner || isNudged ? undefined : choice.bgColor,
                      borderColor: isWinner
                        ? '#10b981'
                        : isNudged
                          ? '#fdba74'
                          : choice.accentColor,
                      minHeight: isMini ? '176px' : '148px',
                    }}
                    onClick={() => handleChoicePick(choice)}
                    aria-label={isMini ? `Seçenek ${choice.emoji}` : choice.turkishMeaning}
                  >
                    <span style={{ fontSize: isMini ? '4.8rem' : '4rem', lineHeight: 1 }}>
                      {choice.emoji}
                    </span>

                    {/* Reveal Turkish meaning + target word once solved so learner locks meaning <-> sound */}
                    {stage2Solved && (
                      <span style={{ fontWeight: 800, color: '#172554', textAlign: 'center', fontSize: isMini ? '0.95rem' : '0.9rem' }}>
                        {isMini
                          ? `🇹🇷 ${choice.turkishMeaning}`
                          : `${choice.langs[profile.targetLang].word} • 🇹🇷 ${choice.turkishMeaning}`}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Master Mode FSRS-5 Telemetry Badge */}
            {isMaster && (
              <div className="ln-chip-group" style={{ justifyContent: 'center' }}>
                <span className="ln-chip-btn">
                  📊 FSRS-5 Stability:{' '}
                  <strong>
                    {existingCard ? `${existingCard.stability.toFixed(2)} gün` : 'Yeni Kart'}
                  </strong>
                </span>
                <span className="ln-chip-btn">
                  🧠 Retrievability:{' '}
                  <strong>
                    {existingRetrievabilityPct !== null ? `%${existingRetrievabilityPct}` : '%100'}
                  </strong>
                </span>
                <span className="ln-chip-btn">
                  🎯 Hakimiyet: <strong>%{existingMasteryPct}</strong>
                </span>
                {stage2Solved && (
                  <span
                    className="ln-chip-btn"
                    style={{ background: '#ecfdf5', borderColor: '#10b981', color: '#065f46' }}
                  >
                    ⚡ Örtük Derece: <strong>{GRADE_LABEL_TR[computedGrade]}</strong>
                  </span>
                )}
              </div>
            )}

            {stage2Solved && (
              <button
                type="button"
                className="ln-clay-btn ln-clay-btn--mint ln-touch-xl"
                onClick={() => {
                  clearTimer();
                  setStage('echo_speak');
                }}
              >
                <span>Devam Et!</span>
                <ArrowRight size={22} />
              </button>
            )}
          </div>
        )}

        {/* ================================================================
            STAGE 3: ECHO & SPEAK (Child-Forgiving Voice Echo + Silent Period Fallback)
           ================================================================ */}
        {stage === 'echo_speak' && (
          <div
            style={{
              width: '100%',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '20px',
            }}
          >
            <div
              style={{
                width: isMini ? '170px' : '150px',
                height: isMini ? '170px' : '150px',
                borderRadius: '32px',
                backgroundColor: item.bgColor,
                border: `4px solid ${item.accentColor}`,
                display: 'grid',
                placeItems: 'center',
                fontSize: isMini ? '5rem' : '4.2rem',
              }}
            >
              {item.emoji}
            </div>

            <button
              type="button"
              className="ln-chip-btn"
              style={{
                background: '#ecfeff',
                borderColor: '#38bdf8',
                color: '#0c4a6e',
                fontWeight: 900,
              }}
              onClick={() => {
                audioEngine.playChime('tap', profile.soundFxEnabled);
                audioEngine.speakSequence([
                  { text: item.turkishMeaning, lang: 'tr' },
                  { text: activePhrase.word, lang: profile.targetLang, slow: profile.speechSlowMode, role: 'warm' },
                ]);
              }}
            >
              🇹🇷 {item.turkishMeaning} <Volume2 size={15} style={{ verticalAlign: 'text-bottom', marginLeft: '4px' }} />
            </button>

            {!isMini && (
              <div style={{ textAlign: 'center' }}>
                <div
                  style={{
                    fontFamily: 'var(--ln-font-display)',
                    fontSize: '1.85rem',
                    fontWeight: 700,
                  }}
                >
                  {activePhrase.word}
                </div>
                <div style={{ color: 'var(--ln-ink-muted)', fontWeight: 700 }}>
                  {activePhrase.ipa}
                  {activePhrase.phoneticHintTr ? ` • ${activePhrase.phoneticHintTr}` : ''}
                </div>
              </div>
            )}

            <div className="ln-chip-group" style={{ justifyContent: 'center' }}>
              <button
                type="button"
                className="ln-clay-btn ln-clay-btn--soft"
                onClick={() => speakNative(activePhrase.word, false)}
              >
                <Volume2 size={20} />
                <span>Dinle</span>
              </button>
              <button
                type="button"
                className="ln-clay-btn ln-clay-btn--gold"
                onClick={() => speakNative(activePhrase.word, true)}
              >
                🐢 <span>Yavaş</span>
              </button>
            </div>

            {/* Giant Pulsing Mic Button */}
            <button
              type="button"
              className={`ln-mic-btn ${speechStatus === 'listening' ? 'is-listening' : ''}`}
              onClick={handleToggleListening}
            >
              {speechStatus === 'listening' ? <MicOff size={28} /> : <Mic size={28} />}
              <span>
                {speechStatus === 'listening'
                  ? 'Dinliyorum... (Durdur)'
                  : speechStatus === 'matched'
                    ? 'Harika Söyledin! ⭐'
                    : 'Mikrofona Söyle!'}
              </span>
            </button>

            {speechStatus === 'matched' && (
              <div
                className="ln-chip-btn"
                style={{ background: '#ecfdf5', borderColor: '#10b981', color: '#065f46' }}
              >
                <CheckCircle2 size={18} style={{ verticalAlign: 'text-bottom', marginRight: '6px' }} />
                Harika telaffuz!
                {!isMini && matchScorePct !== null && ` (%${matchScorePct} eşleşme)`}
              </div>
            )}

            {speechStatus === 'retry' && lastHeard && !isMini && (
              <div
                className="ln-chip-btn"
                style={{ background: '#fff7ed', borderColor: '#fdba74', color: '#9a3412' }}
              >
                Duyulan: &ldquo;{lastHeard}&rdquo; — bir kez daha deneyebilirsin!
              </div>
            )}

            {speechStatus === 'unsupported' && (
              <p style={{ margin: 0, color: 'var(--ln-ink-muted)', fontWeight: 700, textAlign: 'center' }}>
                Bu tarayıcıda mikrofon tanıma kapalı — hiç sorun değil, sesli tekrar edip aşağıdaki düğmeyle devam edebilirsin!
              </p>
            )}

            <div className="ln-chip-group" style={{ justifyContent: 'center' }}>
              {speechStatus === 'matched' && (
                <button
                  type="button"
                  className="ln-clay-btn ln-clay-btn--mint ln-touch-xl"
                  onClick={() => handleFinishEchoStage(true)}
                >
                  <span>{isMini ? 'Sıradaki Arkadaş →' : 'Cümle Kurmaya Geç →'}</span>
                </button>
              )}

              {/* Warm Zero-Shame Silent Period / No-Mic Fallback Button */}
              <button
                type="button"
                className="ln-clay-btn ln-clay-btn--soft ln-touch-xl"
                onClick={() => handleFinishEchoStage(false)}
              >
                <span>Dinledim &amp; Söyledim ✓</span>
              </button>
            </div>
          </div>
        )}

        {/* ================================================================
            STAGE 4: SVO BUILD (ONLY in Explorer & Master modes!)
           ================================================================ */}
        {stage === 'svo_build' && !isMini && (
          <div
            style={{
              width: '100%',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '20px',
            }}
          >
            <div style={{ textAlign: 'center' }}>
              <h2 style={{ fontSize: '1.35rem' }}>
                {item.emoji} Doğal Cümle Kur (Özne → Eylem → Nesne)
              </h2>
              <p style={{ margin: '6px 0 10px', color: 'var(--ln-ink-muted)', fontWeight: 700 }}>
                🇹🇷 Kavram: <strong>{item.turkishMeaning}</strong> — bloklara doğru sırayla dokun:
              </p>
              <button
                type="button"
                className="ln-chip-btn"
                style={{ background: '#f0f9ff', borderColor: '#38bdf8', color: '#0369a1' }}
                onClick={() => speakNative(activePhrase.microSentence)}
              >
                <Volume2 size={15} style={{ verticalAlign: 'text-bottom', marginRight: '5px' }} />
                Hedef Cümleyi Dinle
              </button>
            </div>

            {/* 3 Target SVO Slots */}
            <div className="ln-svo-blocks">
              {(['1. Özne', '2. Eylem', '3. Nesne'] as const).map((slotLabel, idx) => {
                const placed = svoPlaced[idx];
                const slotColors = ['#dbeafe', '#dcfce7', '#fef3c7'];
                const slotBorders = ['#3b82f6', '#10b981', '#f59e0b'];

                return (
                  <div
                    key={slotLabel}
                    className="ln-svo-chip"
                    style={{
                      minWidth: '130px',
                      textAlign: 'center',
                      backgroundColor: placed ? slotColors[idx] : '#f8fafc',
                      borderColor: placed ? slotBorders[idx] : '#cbd5e1',
                      borderStyle: placed ? 'solid' : 'dashed',
                      color: placed ? '#172554' : '#64748b',
                    }}
                  >
                    {placed ? placed.text : slotLabel}
                  </div>
                );
              })}
            </div>

            {/* Shuffled 3 Tactile Blocks */}
            {!svoSolved && (
              <div className="ln-svo-blocks">
                {svoBank.map((block) => {
                  const used = svoPlaced.some((p) => p.idx === block.idx);
                  const isWiggling = wigglingBlockIdx === block.idx;

                  return (
                    <button
                      key={block.idx}
                      type="button"
                      disabled={used}
                      className={`ln-clay-btn ln-clay-btn--soft ${isWiggling ? 'animate-gentle-wiggle' : ''}`}
                      style={{
                        opacity: used ? 0.35 : 1,
                        minHeight: '64px',
                        borderColor: isWiggling ? '#fdba74' : '#38bdf8',
                      }}
                      onClick={() => handlePickSvoBlock(block)}
                    >
                      <span>{block.text}</span>
                    </button>
                  );
                })}
              </div>
            )}

            {svoPlaced.length > 0 && !svoSolved && (
              <button
                type="button"
                className="ln-clay-btn ln-clay-btn--soft"
                style={{ minHeight: '44px', padding: '8px 16px', fontSize: '0.95rem' }}
                onClick={() => {
                  setSvoPlaced([]);
                  audioEngine.playChime('tap', profile.soundFxEnabled);
                }}
              >
                <RefreshCw size={16} />
                <span>Sıfırla</span>
              </button>
            )}

            {svoSolved && (
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '14px',
                }}
              >
                <div
                  className="ln-card"
                  style={{
                    background: '#ecfdf5',
                    borderColor: '#10b981',
                    textAlign: 'center',
                    padding: '16px 24px',
                  }}
                >
                  <div
                    style={{
                      fontFamily: 'var(--ln-font-display)',
                      fontSize: '1.45rem',
                      fontWeight: 700,
                      color: '#065f46',
                    }}
                  >
                    {activePhrase.microSentence}
                  </div>
                  <div style={{ color: '#047857', fontWeight: 700, marginTop: '4px' }}>
                    🇹🇷 {item.turkishMeaning}
                  </div>
                </div>

                <div className="ln-chip-group" style={{ justifyContent: 'center' }}>
                  <button
                    type="button"
                    className="ln-clay-btn ln-clay-btn--soft"
                    onClick={() => speakNative(activePhrase.microSentence)}
                  >
                    <Volume2 size={20} />
                    <span>Cümleyi Dinle</span>
                  </button>
                  <button
                    type="button"
                    className="ln-clay-btn ln-clay-btn--mint ln-touch-xl"
                    onClick={() => commitItemAndAdvance(speakingDone)}
                  >
                    <span>
                      {currentIdx + 1 < sessionItems.length
                        ? 'Sıradaki Kelime'
                        : 'Oturumu Bitir 🎉'}
                    </span>
                    <ArrowRight size={22} />
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
}

export default PlaySessionView;
