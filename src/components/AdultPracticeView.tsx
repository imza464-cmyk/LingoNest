import { useCallback, useEffect, useMemo, useRef, useState, type FormEvent } from 'react';
import {
  AlertTriangle,
  ArrowLeft,
  ArrowRight,
  Award,
  Check,
  CheckCircle2,
  Clock,
  Lightbulb,
  Mic,
  MicOff,
  RefreshCw,
  RotateCcw,
  SkipForward,
  Sparkles,
  TrendingUp,
  Volume2,
} from 'lucide-react';
import type {
  AdultModule,
  AdultPhraseItem,
  FSRSGrade,
  LearnerProfile,
} from '../types';
import { audioEngine, matchSpokenAttempt, type VoiceRole } from '../engine/audioEngine';
import {
  MS_PER_DAY,
  buildSessionQueue,
  cardKey,
  computeRetrievability,
  previewNextIntervals,
} from '../engine/fsrs5';

export interface AdultPracticeViewProps {
  module: AdultModule;
  profile: LearnerProfile;
  onRecordReview: (
    itemId: string,
    grade: FSRSGrade,
    speakingDone: boolean,
    elapsedSec: number,
  ) => void;
  onExit: () => void;
}

type PracticeStep = 'context' | 'cloze' | 'produce' | 'rate';
type ClozeStatus = 'idle' | 'correct' | 'wrong' | 'revealed';
type SpeakStatus = 'idle' | 'listening' | 'matched' | 'retry' | 'unsupported';

interface IndexedChunk {
  idx: number;
  text: string;
}

interface DiffToken {
  char: string;
  state: 'match' | 'wrong' | 'missing' | 'extra';
}

interface ReviewedSummaryItem {
  itemId: string;
  grade: FSRSGrade;
  newStability: number;
  speakingDone: boolean;
  cleanAccuracy: boolean;
}

function normalizeClozeText(input: string): string {
  return input
    .replace(/ı/g, 'i')
    .replace(/İ/g, 'i')
    .replace(/ß/g, 'ss')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[’'`]/g, "'")
    .replace(/[^\p{L}\p{N}\s']/gu, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function buildCharDiff(expectedRaw: string, actualRaw: string): DiffToken[] {
  const expected = expectedRaw.trim();
  const actual = actualRaw.trim();
  const tokens: DiffToken[] = [];
  const maxLen = Math.max(expected.length, actual.length);

  for (let i = 0; i < maxLen; i++) {
    const expChar = expected[i];
    const actChar = actual[i];
    if (expChar !== undefined && actChar !== undefined) {
      const same = normalizeClozeText(expChar) === normalizeClozeText(actChar);
      tokens.push({
        char: actChar,
        state: same ? 'match' : 'wrong',
      });
    } else if (expChar !== undefined && actChar === undefined) {
      tokens.push({
        char: '·',
        state: 'missing',
      });
    } else if (actChar !== undefined) {
      tokens.push({
        char: actChar,
        state: 'extra',
      });
    }
  }
  return tokens;
}

function shuffleChunks(chunks: string[]): IndexedChunk[] {
  const indexed: IndexedChunk[] = chunks.map((text, idx) => ({ idx, text }));
  if (indexed.length <= 1) return indexed;

  for (let i = indexed.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const tmp = indexed[i];
    indexed[i] = indexed[j];
    indexed[j] = tmp;
  }

  // Avoid trivial pre-solved order when possible
  const stillSame = indexed.every((c, i) => c.idx === i);
  if (stillSame && indexed.length >= 2) {
    const tmp = indexed[0];
    indexed[0] = indexed[1];
    indexed[1] = tmp;
  }

  return indexed;
}

export function AdultPracticeView({
  module,
  profile,
  onRecordReview,
  onExit,
}: AdultPracticeViewProps) {
  const itemById = useMemo(() => {
    const map: Record<string, AdultPhraseItem> = {};
    for (const item of module.items) {
      map[item.id] = item;
    }
    return map;
  }, [module.items]);

  // Snapshot session queue on module/language mount so mid-session card updates don't reorder items
  const [queue, setQueue] = useState<string[]>(() =>
    buildSessionQueue(
      module.items.map((i) => i.id),
      profile.cards,
      profile.targetLang,
      'master',
    ),
  );

  useEffect(() => {
    setQueue(
      buildSessionQueue(
        module.items.map((i) => i.id),
        profile.cards,
        profile.targetLang,
        'master',
      ),
    );
    setCurrentIndex(0);
    setStep('context');
    setSessionDone(false);
    setReviewedSummary([]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [module.id, profile.targetLang]);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [step, setStep] = useState<PracticeStep>('context');
  const [sessionDone, setSessionDone] = useState(false);
  const [reviewedSummary, setReviewedSummary] = useState<ReviewedSummaryItem[]>([]);
  const [isSpeakingAudio, setIsSpeakingAudio] = useState(false);

  // Step 2: Cloze production state
  const [clozeInput, setClozeInput] = useState('');
  const [clozeStatus, setClozeStatus] = useState<ClozeStatus>('idle');
  const [clozeHintLen, setClozeHintLen] = useState(0);
  const [clozeAttempts, setClozeAttempts] = useState(0);
  const [clozePassed, setClozePassed] = useState(false);
  const clozeInputRef = useRef<HTMLInputElement | null>(null);

  // Step 3: Syntax word-order + Shadowing state
  const [bankChunks, setBankChunks] = useState<IndexedChunk[]>([]);
  const [placedChunks, setPlacedChunks] = useState<IndexedChunk[]>([]);
  const [syntaxStatus, setSyntaxStatus] = useState<'idle' | 'correct' | 'wrong'>('idle');
  const [syntaxPassed, setSyntaxPassed] = useState(false);

  const [speakStatus, setSpeakStatus] = useState<SpeakStatus>('idle');
  const [speakScorePct, setSpeakScorePct] = useState<number | null>(null);
  const [bestHeard, setBestHeard] = useState('');
  const [speakingDone, setSpeakingDone] = useState(false);

  const itemStartMsRef = useRef<number>(Date.now());

  const currentItemId = queue[currentIndex];
  const currentItem = currentItemId ? itemById[currentItemId] : undefined;
  const loc = currentItem?.langs[profile.targetLang];

  const locChunksRef = useRef<string[]>([]);
  locChunksRef.current = loc?.wordOrderChunks ?? [];

  // Reset per-item interactive state whenever advancing to a new item
  useEffect(() => {
    audioEngine.stopSpeaking();
    audioEngine.stopListening();
    setIsSpeakingAudio(false);

    setStep('context');
    setClozeInput('');
    setClozeStatus('idle');
    setClozeHintLen(0);
    setClozeAttempts(0);
    setClozePassed(false);

    setBankChunks(shuffleChunks(locChunksRef.current));
    setPlacedChunks([]);
    setSyntaxStatus('idle');
    setSyntaxPassed(false);

    setSpeakStatus('idle');
    setSpeakScorePct(null);
    setBestHeard('');
    setSpeakingDone(false);

    itemStartMsRef.current = Date.now();
  }, [currentIndex, currentItemId, profile.targetLang]);

  // Cleanup audio on unmount
  useEffect(() => {
    return () => {
      audioEngine.stopSpeaking();
      audioEngine.stopListening();
    };
  }, []);

  // Auto-focus cloze input when entering Step 2
  useEffect(() => {
    if (step === 'cloze') {
      const id = window.setTimeout(() => {
        clozeInputRef.current?.focus();
      }, 40);
      return () => window.clearTimeout(id);
    }
    return undefined;
  }, [step]);

  const speakAtSpeed = useCallback(
    (text: string, speed: 'normal' | 'slow' | 'fast', role: VoiceRole = 'adult') => {
      if (!text.trim()) return;
      audioEngine.speak(text, profile.targetLang, {
        slow: speed === 'slow',
        fast: speed === 'fast',
        role,
        onStart: () => setIsSpeakingAudio(true),
        onEnd: () => setIsSpeakingAudio(false),
      });
    },
    [profile.targetLang],
  );

  // Step 2: Cloze submission
  const handleClozeSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!loc) return;

    if (clozeStatus === 'correct' || clozeStatus === 'revealed') {
      setStep('produce');
      return;
    }

    const userNorm = normalizeClozeText(clozeInput);
    const targetNorm = normalizeClozeText(loc.clozeAnswer);
    if (!userNorm) return;

    setClozeAttempts((n) => n + 1);

    if (userNorm === targetNorm) {
      setClozeStatus('correct');
      setClozePassed(true);
      audioEngine.playChime('success', profile.soundFxEnabled);
    } else {
      setClozeStatus('wrong');
      audioEngine.playChime('gentle-nudge', profile.soundFxEnabled);
    }
  };

  const handleClozeHint = () => {
    if (!loc) return;
    const answer = loc.clozeAnswer.trim();
    const nextLen = Math.min(answer.length, Math.max(1, clozeHintLen + 1));
    setClozeHintLen(nextLen);
    setClozeInput(answer.slice(0, nextLen));
    setClozeStatus('idle');
    audioEngine.playChime('tap', profile.soundFxEnabled);
    clozeInputRef.current?.focus();
  };

  const handleClozeReveal = () => {
    if (!loc) return;
    setClozeInput(loc.clozeAnswer);
    setClozeStatus('revealed');
    setClozePassed(false);
    audioEngine.playChime('tap', profile.soundFxEnabled);
  };

  // Step 3: Word-Order Builder handlers
  const handlePickBankChunk = (chunk: IndexedChunk) => {
    if (syntaxStatus === 'correct') return;
    audioEngine.playChime('tap', profile.soundFxEnabled);
    const nextBank = bankChunks.filter((c) => c.idx !== chunk.idx);
    const nextPlaced = [...placedChunks, chunk];
    setBankChunks(nextBank);
    setPlacedChunks(nextPlaced);

    if (loc && nextPlaced.length === loc.wordOrderChunks.length) {
      const built = normalizeClozeText(nextPlaced.map((c) => c.text).join(' '));
      const expected = normalizeClozeText(loc.wordOrderChunks.join(' '));
      if (built === expected) {
        setSyntaxStatus('correct');
        setSyntaxPassed(true);
        audioEngine.playChime('success', profile.soundFxEnabled);
      } else {
        setSyntaxStatus('wrong');
        audioEngine.playChime('gentle-nudge', profile.soundFxEnabled);
      }
    } else {
      setSyntaxStatus('idle');
    }
  };

  const handleRemovePlacedChunk = (chunk: IndexedChunk) => {
    if (syntaxStatus === 'correct') return;
    audioEngine.playChime('tap', profile.soundFxEnabled);
    setPlacedChunks((prev) => prev.filter((c) => c.idx !== chunk.idx));
    setBankChunks((prev) => [...prev, chunk]);
    setSyntaxStatus('idle');
  };

  const handleResetSyntax = () => {
    if (!loc) return;
    audioEngine.playChime('tap', profile.soundFxEnabled);
    setBankChunks(shuffleChunks(loc.wordOrderChunks));
    setPlacedChunks([]);
    setSyntaxStatus('idle');
  };

  const handleRevealSyntax = () => {
    if (!loc) return;
    setPlacedChunks(loc.wordOrderChunks.map((text, idx) => ({ idx, text })));
    setBankChunks([]);
    setSyntaxStatus('correct');
    setSyntaxPassed(false);
    audioEngine.playChime('tap', profile.soundFxEnabled);
  };

  // Step 3: Shadowing speech recognition
  const handleStartShadowing = () => {
    if (!loc) return;
    if (!audioEngine.supportsSpeechRecognition()) {
      setSpeakStatus('unsupported');
      return;
    }

    if (speakStatus === 'listening') {
      audioEngine.stopListening();
      setSpeakStatus('idle');
      return;
    }

    audioEngine.stopSpeaking();
    setSpeakStatus('listening');
    setBestHeard('');
    setSpeakScorePct(null);

    audioEngine.startListening(
      profile.targetLang,
      (alts) => {
        const res = matchSpokenAttempt(loc.phrase, loc.clozeAnswer, alts, false);
        setSpeakScorePct(Math.round(res.score * 100));
        setBestHeard(res.bestHeard);
        if (res.matched) {
          setSpeakStatus('matched');
          setSpeakingDone(true);
          audioEngine.playChime('success', profile.soundFxEnabled);
        } else {
          setSpeakStatus('retry');
          audioEngine.playChime('gentle-nudge', profile.soundFxEnabled);
        }
      },
      (reason) => {
        if (reason === 'unsupported') {
          setSpeakStatus('unsupported');
        } else {
          setSpeakStatus('retry');
        }
      },
      () => {
        setSpeakStatus((prev) => (prev === 'listening' ? 'idle' : prev));
      },
    );
  };

  // Step 4: FSRS-5 card state and next interval previews
  const currentCard = currentItem
    ? profile.cards[cardKey(profile.targetLang, currentItem.id)]
    : undefined;

  const currentDsr = useMemo(() => {
    if (!currentCard || currentCard.reps === 0) {
      return {
        isNew: true,
        difficultyStr: 'Yeni',
        stabilityStr: '0.0 gün',
        retrievabilityStr: '—',
        reps: 0,
        lapses: 0,
      };
    }
    const elapsedDays = Math.max(0, (Date.now() - currentCard.lastReviewAt) / MS_PER_DAY);
    const r = computeRetrievability(elapsedDays, currentCard.stability);
    return {
      isNew: false,
      difficultyStr: `${currentCard.difficulty.toFixed(2)} / 10`,
      stabilityStr: `${currentCard.stability.toFixed(1)} gün`,
      retrievabilityStr: `${Math.round(r * 100)}%`,
      reps: currentCard.reps,
      lapses: currentCard.lapses,
    };
  }, [currentCard]);

  const intervalPreviews = useMemo(() => {
    if (!currentItem) return null;
    return previewNextIntervals(
      currentCard,
      currentItem.id,
      profile.targetLang,
      profile.ageMode,
    );
  }, [currentCard, currentItem, profile.ageMode, profile.targetLang]);

  const recommendGoodGrade = clozePassed && syntaxPassed;

  const handleRate = useCallback(
    (grade: FSRSGrade) => {
      if (!currentItem || !intervalPreviews) return;
      const elapsedSec = Math.max(1, Math.round((Date.now() - itemStartMsRef.current) / 1000));
      audioEngine.stopSpeaking();
      audioEngine.stopListening();
      audioEngine.playChime(grade >= 3 ? 'success' : 'tap', profile.soundFxEnabled);

      onRecordReview(currentItem.id, grade, speakingDone, elapsedSec);

      setReviewedSummary((prev) => [
        ...prev,
        {
          itemId: currentItem.id,
          grade,
          newStability: intervalPreviews[grade].nextStability,
          speakingDone,
          cleanAccuracy: clozePassed && syntaxPassed,
        },
      ]);

      if (currentIndex + 1 >= queue.length) {
        setSessionDone(true);
        audioEngine.playChime('celebrate', profile.soundFxEnabled);
      } else {
        setCurrentIndex((i) => i + 1);
      }
    },
    [
      clozePassed,
      currentIndex,
      currentItem,
      intervalPreviews,
      onRecordReview,
      profile.soundFxEnabled,
      queue.length,
      speakingDone,
      syntaxPassed,
    ],
  );

  // Keyboard shortcuts 1, 2, 3, 4 on Step 4 ('rate')
  useEffect(() => {
    if (step !== 'rate' || sessionDone) return undefined;
    const onKeyDown = (ev: KeyboardEvent) => {
      if (ev.ctrlKey || ev.metaKey || ev.altKey) return;
      const target = ev.target as HTMLElement | null;
      if (target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA')) return;

      if (ev.key === '1') handleRate(1);
      else if (ev.key === '2') handleRate(2);
      else if (ev.key === '3') handleRate(3);
      else if (ev.key === '4') handleRate(4);
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [step, sessionDone, handleRate]);

  // Empty guard
  if (queue.length === 0) {
    return (
      <section className="ln-adult-practice">
        <div className="ln-adult-empty-card">
          <h2>Bu modülde içerik bulunamadı</h2>
          <button type="button" className="ln-adult-btn ln-adult-btn--primary" onClick={onExit}>
            <ArrowLeft size={16} aria-hidden="true" />
            <span>Stüdyoya Dön</span>
          </button>
        </div>
      </section>
    );
  }

  // Session completion summary
  if (sessionDone) {
    const count = reviewedSummary.length;
    const avgNewS =
      count > 0
        ? reviewedSummary.reduce((sum, r) => sum + r.newStability, 0) / count
        : 0;
    const spokenCount = reviewedSummary.filter((r) => r.speakingDone).length;
    const cleanCount = reviewedSummary.filter((r) => r.cleanAccuracy).length;

    return (
      <section className="ln-adult-practice">
        <div className="ln-adult-summary-card">
          <div className="ln-adult-summary-icon">
            <Award size={32} aria-hidden="true" />
          </div>
          <span className="ln-adult-kicker">{module.titleTr}</span>
          <h2>FSRS-5 Oturumu Tamamlandı</h2>
          <p className="ln-adult-subtitle">
            Bellek stabiliteleri güncellendi ve optimal aralıklar yeniden hesaplandı.
          </p>

          <div className="ln-adult-summary-metrics">
            <div className="ln-adult-metric-card">
              <span className="ln-adult-metric-label">İncelenen Kart</span>
              <strong className="ln-adult-metric-value">{count}</strong>
            </div>
            <div className="ln-adult-metric-card">
              <span className="ln-adult-metric-label">Yeni Ort. Stabilite (S)</span>
              <strong className="ln-adult-metric-value">{avgNewS.toFixed(1)} gün</strong>
            </div>
            <div className="ln-adult-metric-card">
              <span className="ln-adult-metric-label">Gölgeleme Konuşması</span>
              <strong className="ln-adult-metric-value">
                {spokenCount} / {count}
              </strong>
            </div>
            <div className="ln-adult-metric-card">
              <span className="ln-adult-metric-label">Temiz Üretim</span>
              <strong className="ln-adult-metric-value">
                {cleanCount} / {count}
              </strong>
            </div>
          </div>

          <button
            type="button"
            className="ln-adult-btn ln-adult-btn--primary"
            onClick={() => {
              audioEngine.playChime('tap', profile.soundFxEnabled);
              onExit();
            }}
          >
            <ArrowLeft size={16} aria-hidden="true" />
            <span>Bilişsel Stüdyoya Dön</span>
          </button>
        </div>
      </section>
    );
  }

  if (!currentItem || !loc) return null;

  const clozeParts = loc.clozeSentence.split('___');
  const diffTokens =
    clozeStatus === 'wrong' ? buildCharDiff(loc.clozeAnswer, clozeInput) : [];
  const stepOrder: PracticeStep[] = ['context', 'cloze', 'produce', 'rate'];
  const stepLabels: Record<PracticeStep, string> = {
    context: '1 · Bağlam & Tuzak',
    cloze: '2 · Boşluk Yazımı',
    produce: '3 · Sözdizimi & Ses',
    rate: '4 · FSRS-5 Puanı',
  };

  return (
    <section
      className="ln-adult-practice"
      style={{ ['--ln-adult-accent' as string]: module.accentHex }}
    >
      {/* Top Bar */}
      <div className="ln-adult-practice-topbar">
        <button
          type="button"
          className="ln-adult-btn ln-adult-btn--ghost"
          onClick={() => {
            audioEngine.stopSpeaking();
            audioEngine.stopListening();
            onExit();
          }}
        >
          <ArrowLeft size={16} aria-hidden="true" />
          <span>Stüdyo</span>
        </button>

        <div className="ln-adult-practice-progress">
          <div className="ln-adult-practice-meta">
            <span>
              {module.icon} {module.titleTr}
            </span>
            <strong>
              {currentIndex + 1} / {queue.length}
            </strong>
          </div>
          <div className="ln-adult-progress-track">
            <div
              className="ln-adult-progress-fill"
              style={{ width: `${Math.round(((currentIndex + 1) / queue.length) * 100)}%` }}
            />
          </div>
        </div>

        <span className="ln-adult-cefr-badge">{currentItem.cefr}</span>
      </div>

      {/* Stepper Ribbon */}
      <nav className="ln-adult-stepper" aria-label="Bilişsel Üretim Aşamaları">
        {stepOrder.map((s) => {
          const active = s === step;
          const passed = stepOrder.indexOf(s) < stepOrder.indexOf(step);
          return (
            <button
              key={s}
              type="button"
              className={`ln-adult-step-pill ${active ? 'is-active' : ''} ${passed ? 'is-passed' : ''}`}
              onClick={() => setStep(s)}
            >
              {passed && <Check size={12} aria-hidden="true" />}
              <span>{stepLabels[s]}</span>
            </button>
          );
        })}
      </nav>

      {/* Main Production Card */}
      <div className="ln-adult-stage-card">
        <div className="ln-adult-item-tags">
          <span className="ln-adult-context-tag">{currentItem.contextTagTr}</span>
          <span className="ln-adult-cefr-badge">{currentItem.cefr}</span>
        </div>

        {/* STEP 1: Context & Turkish Contrastive Trap */}
        {step === 'context' && (
          <div className="ln-adult-step-body">
            <div className="ln-adult-phrase-header">
              <h2 className="ln-adult-target-phrase">{loc.phrase}</h2>
              <span className="ln-adult-ipa">{loc.ipa}</span>
            </div>

            <p className="ln-adult-tr-meaning">{currentItem.turkishMeaning}</p>

            {/* 3-Speed Playback Controls */}
            <div className="ln-adult-audio-bar">
              <button
                type="button"
                className={`ln-adult-btn ln-adult-btn--secondary ${isSpeakingAudio ? 'is-playing' : ''}`}
                onClick={() => speakAtSpeed(loc.phrase, 'normal')}
              >
                <Volume2 size={16} aria-hidden="true" />
                <span>Normal (1.0x)</span>
              </button>
              <button
                type="button"
                className="ln-adult-btn ln-adult-btn--secondary"
                onClick={() => speakAtSpeed(loc.phrase, 'slow')}
              >
                <Volume2 size={15} aria-hidden="true" />
                <span>Yavaş (0.78x)</span>
              </button>
              <button
                type="button"
                className="ln-adult-btn ln-adult-btn--secondary"
                onClick={() => speakAtSpeed(loc.phrase, 'fast')}
              >
                <Volume2 size={15} aria-hidden="true" />
                <span>Hızlı Doğal (1.12x)</span>
              </button>
            </div>

            {/* Native Example Dialogue */}
            <div className="ln-adult-example-box">
              <div className="ln-adult-example-head">
                <span>Doğal Konuşma Bağlamı</span>
                <button
                  type="button"
                  className="ln-adult-icon-link"
                  onClick={() => speakAtSpeed(loc.exampleDialogue, 'normal', 'partner')}
                >
                  <Volume2 size={14} aria-hidden="true" />
                  <span>Dinle</span>
                </button>
              </div>
              <p className="ln-adult-example-text">“{loc.exampleDialogue}”</p>
            </div>

            {/* Contrastive Turkish L1 Trap Callout */}
            <div className="ln-adult-trap-callout" role="note">
              <div className="ln-adult-trap-title">
                <AlertTriangle size={16} aria-hidden="true" />
                <span>Türkçe Düşünme Tuzağı (Kontrastif Analiz)</span>
              </div>
              <p>{currentItem.turkishTrapTr}</p>
            </div>

            <div className="ln-adult-step-actions">
              <button
                type="button"
                className="ln-adult-btn ln-adult-btn--primary"
                onClick={() => {
                  audioEngine.playChime('tap', profile.soundFxEnabled);
                  setStep('cloze');
                }}
              >
                <span>Aktif Boşluk Doldurmaya Geç</span>
                <ArrowRight size={16} aria-hidden="true" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 2: Active Cloze Typing Production */}
        {step === 'cloze' && (
          <div className="ln-adult-step-body">
            <div className="ln-adult-cloze-header">
              <div>
                <h3 className="ln-adult-step-title">Aktif Boşluk Doldurma</h3>
                <p className="ln-adult-tr-meaning">Anlam İpucu: {currentItem.turkishMeaning}</p>
              </div>
              <button
                type="button"
                className="ln-adult-btn ln-adult-btn--secondary"
                onClick={() => speakAtSpeed(loc.phrase, 'normal')}
              >
                <Volume2 size={15} aria-hidden="true" />
                <span>Sesli İpucu</span>
              </button>
            </div>

            <div className="ln-adult-cloze-sentence" aria-live="polite">
              {clozeParts.length > 1 ? (
                <>
                  <span>{clozeParts[0]}</span>
                  <span
                    className={`ln-adult-cloze-slot ${
                      clozeStatus === 'correct'
                        ? 'is-correct'
                        : clozeStatus === 'wrong'
                          ? 'is-wrong'
                          : clozeStatus === 'revealed'
                            ? 'is-revealed'
                            : ''
                    }`}
                  >
                    {clozeInput.trim() ? clozeInput : '________'}
                  </span>
                  <span>{clozeParts.slice(1).join('___')}</span>
                </>
              ) : (
                <span>{loc.clozeSentence}</span>
              )}
            </div>

            <form className="ln-adult-cloze-form" onSubmit={handleClozeSubmit}>
              <div className="ln-adult-input-row">
                <input
                  ref={clozeInputRef}
                  type="text"
                  className="ln-adult-text-input"
                  value={clozeInput}
                  onChange={(e) => {
                    setClozeInput(e.target.value);
                    if (clozeStatus === 'wrong') setClozeStatus('idle');
                  }}
                  placeholder="Eksik ifadeyi yazın ve Enter'a basın..."
                  autoComplete="off"
                  autoCapitalize="none"
                  spellCheck={false}
                  disabled={clozeStatus === 'correct' || clozeStatus === 'revealed'}
                />
                <button
                  type="submit"
                  className="ln-adult-btn ln-adult-btn--primary"
                  disabled={!clozeInput.trim() && clozeStatus === 'idle'}
                >
                  {clozeStatus === 'correct' || clozeStatus === 'revealed'
                    ? 'Sonraki Adım →'
                    : 'Kontrol Et'}
                </button>
              </div>

              <div className="ln-adult-cloze-helpers">
                <button
                  type="button"
                  className="ln-adult-btn ln-adult-btn--ghost"
                  onClick={handleClozeHint}
                  disabled={clozeStatus === 'correct' || clozeStatus === 'revealed'}
                >
                  <Lightbulb size={14} aria-hidden="true" />
                  <span>İlk Harf İpucu</span>
                </button>
                {clozeAttempts > 0 && clozeStatus !== 'correct' && clozeStatus !== 'revealed' && (
                  <button
                    type="button"
                    className="ln-adult-btn ln-adult-btn--ghost"
                    onClick={handleClozeReveal}
                  >
                    <span>Cevabı Göster</span>
                  </button>
                )}
              </div>
            </form>

            {/* Instant Visual Diff Feedback */}
            {clozeStatus === 'wrong' && (
              <div className="ln-adult-diff-feedback" role="status">
                <div className="ln-adult-diff-label">
                  Yazım karşılaştırması — tekrar deneyebilir veya cevabı görebilirsiniz:
                </div>
                <div className="ln-adult-diff-chars" aria-label="Karakter farkı">
                  {diffTokens.map((tok, i) => (
                    <span key={i} className={`ln-adult-diff-char is-${tok.state}`}>
                      {tok.char === ' ' ? '\u00A0' : tok.char}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {clozeStatus === 'correct' && (
              <div className="ln-adult-feedback-banner is-success" role="status">
                <CheckCircle2 size={16} aria-hidden="true" />
                <span>Kusursuz üretim: “{loc.clozeAnswer}”</span>
              </div>
            )}

            {clozeStatus === 'revealed' && (
              <div className="ln-adult-feedback-banner is-info" role="status">
                <Sparkles size={16} aria-hidden="true" />
                <span>Doğru hedef ifade: “{loc.clozeAnswer}”</span>
              </div>
            )}

            {(clozeStatus === 'correct' || clozeStatus === 'revealed') && (
              <div className="ln-adult-step-actions">
                <button
                  type="button"
                  className="ln-adult-btn ln-adult-btn--primary"
                  onClick={() => setStep('produce')}
                >
                  <span>Sözdizimi &amp; Gölgelemeye Geç</span>
                  <ArrowRight size={16} aria-hidden="true" />
                </button>
              </div>
            )}
          </div>
        )}

        {/* STEP 3: Word-Order Builder + Shadowing Speech Check */}
        {step === 'produce' && (
          <div className="ln-adult-step-body">
            {/* Part A: Word-Order Syntax Builder */}
            <div className="ln-adult-syntax-panel">
              <div className="ln-adult-syntax-head">
                <div>
                  <h3 className="ln-adult-step-title">Sözdizimi Sıralama (SOV → SVO)</h3>
                  <p className="ln-adult-tr-meaning">{currentItem.turkishMeaning}</p>
                </div>
                <div className="ln-adult-syntax-controls">
                  <button
                    type="button"
                    className="ln-adult-btn ln-adult-btn--ghost"
                    onClick={handleResetSyntax}
                  >
                    <RotateCcw size={14} aria-hidden="true" />
                    <span>Sıfırla</span>
                  </button>
                  {syntaxStatus === 'wrong' && (
                    <button
                      type="button"
                      className="ln-adult-btn ln-adult-btn--ghost"
                      onClick={handleRevealSyntax}
                    >
                      <span>Doğrusunu Diz</span>
                    </button>
                  )}
                </div>
              </div>

              <div
                className={`ln-adult-syntax-tray ${
                  syntaxStatus === 'correct'
                    ? 'is-correct'
                    : syntaxStatus === 'wrong'
                      ? 'is-wrong'
                      : ''
                }`}
              >
                {placedChunks.length === 0 ? (
                  <span className="ln-adult-tray-placeholder">
                    Aşağıdaki bloklara sırayla dokunarak cümleyi kurun…
                  </span>
                ) : (
                  placedChunks.map((chunk) => (
                    <button
                      key={chunk.idx}
                      type="button"
                      className="ln-adult-chunk-chip is-placed"
                      onClick={() => handleRemovePlacedChunk(chunk)}
                    >
                      {chunk.text}
                    </button>
                  ))
                )}
              </div>

              <div className="ln-adult-syntax-bank">
                {bankChunks.map((chunk) => (
                  <button
                    key={chunk.idx}
                    type="button"
                    className="ln-adult-chunk-chip"
                    onClick={() => handlePickBankChunk(chunk)}
                  >
                    {chunk.text}
                  </button>
                ))}
              </div>

              {syntaxStatus === 'correct' && (
                <div className="ln-adult-feedback-banner is-success">
                  <CheckCircle2 size={16} aria-hidden="true" />
                  <span>Doğru sözdizimi: “{loc.wordOrderChunks.join(' ')}”</span>
                </div>
              )}
              {syntaxStatus === 'wrong' && (
                <div className="ln-adult-feedback-banner is-warn">
                  <AlertTriangle size={16} aria-hidden="true" />
                  <span>Sıra hedef kalıpla uyuşmuyor — bloklara dokunup yeniden düzenleyin.</span>
                </div>
              )}
            </div>

            {/* Part B: Shadowing Speech Check */}
            <div className="ln-adult-shadowing-panel">
              <div className="ln-adult-shadowing-head">
                <div>
                  <h3 className="ln-adult-step-title">Gölgeleme (Shadowing) Ses Kontrolü</h3>
                  <p className="ln-adult-shadowing-target">
                    Hedef: <strong>{loc.phrase}</strong>
                  </p>
                </div>

                <div className="ln-adult-shadowing-btns">
                  <button
                    type="button"
                    className="ln-adult-btn ln-adult-btn--secondary"
                    onClick={() => speakAtSpeed(loc.phrase, 'normal')}
                  >
                    <Volume2 size={15} aria-hidden="true" />
                    <span>Modeli Dinle</span>
                  </button>

                  <button
                    type="button"
                    className={`ln-adult-btn ${
                      speakStatus === 'listening' ? 'ln-adult-btn--danger' : 'ln-adult-btn--primary'
                    }`}
                    onClick={handleStartShadowing}
                  >
                    {speakStatus === 'listening' ? (
                      <>
                        <MicOff size={15} aria-hidden="true" />
                        <span>Dinleniyor... (Durdur)</span>
                      </>
                    ) : (
                      <>
                        <Mic size={15} aria-hidden="true" />
                        <span>Mikrofonla Tekrar Et</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {speakStatus === 'matched' && speakScorePct !== null && (
                <div className="ln-adult-feedback-banner is-success">
                  <CheckCircle2 size={16} aria-hidden="true" />
                  <span>
                    Telaffuz Eşleşti: <strong>%{speakScorePct}</strong>
                    {bestHeard ? ` · Algılanan: “${bestHeard}”` : ''}
                  </span>
                </div>
              )}

              {speakStatus === 'retry' && (
                <div className="ln-adult-feedback-banner is-warn">
                  <RefreshCw size={15} aria-hidden="true" />
                  <span>
                    Skor: <strong>%{speakScorePct ?? 0}</strong> (Yetişkin eşiği %78)
                    {bestHeard ? ` · Algılanan: “${bestHeard}”` : ' · Ses algılanamadı, tekrar deneyin.'}
                  </span>
                </div>
              )}

              {speakStatus === 'unsupported' && (
                <div className="ln-adult-feedback-banner is-info">
                  <AlertTriangle size={15} aria-hidden="true" />
                  <span>
                    Bu tarayıcıda Web Speech mikrofon tanıma desteklenmiyor; sesli okuyup
                    derecelendirmeye geçebilirsiniz.
                  </span>
                </div>
              )}
            </div>

            <div className="ln-adult-step-actions">
              <button
                type="button"
                className="ln-adult-btn ln-adult-btn--ghost"
                onClick={() => {
                  audioEngine.stopListening();
                  setStep('rate');
                }}
              >
                <SkipForward size={15} aria-hidden="true" />
                <span>Atla ve Puanla</span>
              </button>
              <button
                type="button"
                className="ln-adult-btn ln-adult-btn--primary"
                onClick={() => {
                  audioEngine.stopListening();
                  setStep('rate');
                }}
              >
                <span>FSRS-5 Derecelendirmeye Geç</span>
                <ArrowRight size={16} aria-hidden="true" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 4: Transparent FSRS-5 DSR Rating */}
        {step === 'rate' && intervalPreviews && (
          <div className="ln-adult-step-body">
            <div className="ln-adult-dsr-header">
              <div>
                <h3 className="ln-adult-step-title">Şeffaf FSRS-5 Bellek Derecelendirmesi</h3>
                <p className="ln-adult-target-recap">
                  <strong>{loc.phrase}</strong> — {currentItem.turkishMeaning}
                </p>
              </div>
              <span className="ln-adult-kbd-hint">Kısayol: 1 · 2 · 3 · 4</span>
            </div>

            {/* Current DSR Telemetry */}
            <div className="ln-adult-dsr-grid">
              <div className="ln-adult-dsr-box">
                <span className="ln-adult-metric-label">Zorluk (D)</span>
                <strong>{currentDsr.difficultyStr}</strong>
              </div>
              <div className="ln-adult-dsr-box">
                <span className="ln-adult-metric-label">Stabilite (S)</span>
                <strong>{currentDsr.stabilityStr}</strong>
              </div>
              <div className="ln-adult-dsr-box">
                <span className="ln-adult-metric-label">
                  <TrendingUp size={13} aria-hidden="true" /> Hatırlama (R%)
                </span>
                <strong>{currentDsr.retrievabilityStr}</strong>
              </div>
              <div className="ln-adult-dsr-box">
                <span className="ln-adult-metric-label">
                  <Clock size={13} aria-hidden="true" /> Geçmiş
                </span>
                <strong>
                  {currentDsr.reps} tekrar · {currentDsr.lapses} unutma
                </strong>
              </div>
            </div>

            {/* 4 Explicit FSRS-5 Rating Buttons */}
            <div className="ln-adult-grade-grid">
              <button
                type="button"
                className="ln-adult-grade-btn is-again"
                onClick={() => handleRate(1)}
              >
                <span className="ln-adult-grade-title">1 · Tekrar</span>
                <strong className="ln-adult-grade-interval">{intervalPreviews[1].label}</strong>
                <small>S → {intervalPreviews[1].nextStability}g</small>
              </button>

              <button
                type="button"
                className="ln-adult-grade-btn is-hard"
                onClick={() => handleRate(2)}
              >
                <span className="ln-adult-grade-title">2 · Zor</span>
                <strong className="ln-adult-grade-interval">{intervalPreviews[2].label}</strong>
                <small>S → {intervalPreviews[2].nextStability}g</small>
              </button>

              <button
                type="button"
                className={`ln-adult-grade-btn is-good ${recommendGoodGrade ? 'is-recommended' : ''}`}
                onClick={() => handleRate(3)}
              >
                {recommendGoodGrade && (
                  <span className="ln-adult-rec-tag">Önerilen</span>
                )}
                <span className="ln-adult-grade-title">3 · İyi</span>
                <strong className="ln-adult-grade-interval">{intervalPreviews[3].label}</strong>
                <small>S → {intervalPreviews[3].nextStability}g</small>
              </button>

              <button
                type="button"
                className="ln-adult-grade-btn is-easy"
                onClick={() => handleRate(4)}
              >
                <span className="ln-adult-grade-title">4 · Kolay</span>
                <strong className="ln-adult-grade-interval">{intervalPreviews[4].label}</strong>
                <small>S → {intervalPreviews[4].nextStability}g</small>
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
