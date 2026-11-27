import { useEffect, useMemo, useRef, useState } from 'react';
import {
  ArrowLeft,
  Award,
  CheckCircle2,
  Ear,
  Mic,
  MicOff,
  RefreshCw,
  Volume2,
} from 'lucide-react';
import type { LearnerProfile, PhoneticTrap } from '../types';
import { audioEngine, matchSpokenAttempt } from '../engine/audioEngine';
import { TR_VOICE } from '../data/voiceScripts';
import { MouthPhoneticGuide } from './MouthPhoneticGuide';

export interface PhoneticLabViewProps {
  traps: PhoneticTrap[];
  profile: LearnerProfile;
  onUpdateScore: (trapId: string, score: number) => void;
  onBack: () => void;
}

type EarSecret = 'target' | 'contrast';
type SpeakState = 'idle' | 'listening' | 'matched' | 'retry' | 'unsupported';

const TARGET_LANG_LABEL_TR: Record<LearnerProfile['targetLang'], string> = {
  en: 'İngilizce',
  de: 'Almanca',
  es: 'İspanyolca',
};

const pickRandomEarSecret = (): EarSecret => (Math.random() < 0.5 ? 'target' : 'contrast');

export function PhoneticLabView({
  traps,
  profile,
  onUpdateScore,
  onBack,
}: PhoneticLabViewProps) {
  const isMini = profile.ageMode === 'mini';
  const filteredTraps = useMemo(() => {
    const matches = traps.filter((t) => (t.lang ?? 'en') === profile.targetLang);
    return matches.length > 0 ? matches : traps;
  }, [traps, profile.targetLang]);

  const [selectedTrapId, setSelectedTrapId] = useState<string>(filteredTraps[0]?.id ?? '');
  const [isSpeaking, setIsSpeaking] = useState(false);

  // Ear-discrimination ("Hangisini Duydun?") state
  const [pairIdx, setPairIdx] = useState(0);
  const [earSecret, setEarSecret] = useState<EarSecret>(pickRandomEarSecret);
  const [earStatus, setEarStatus] = useState<'ready' | 'correct' | 'nudge'>('ready');
  const [wigglingSide, setWigglingSide] = useState<EarSecret | null>(null);
  const [earStreak, setEarStreak] = useState(0);

  // Speaking practice state
  const [speakState, setSpeakState] = useState<SpeakState>('idle');
  const [lastHeard, setLastHeard] = useState('');
  const [lastScorePct, setLastScorePct] = useState<number | null>(null);

  const timerRef = useRef<number | null>(null);

  const clearTimer = () => {
    if (timerRef.current !== null) {
      window.clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  };

  useEffect(() => {
    return () => {
      clearTimer();
      audioEngine.stopSpeaking();
      audioEngine.stopListening();
    };
  }, []);

  useEffect(() => {
    clearTimer();
    audioEngine.stopSpeaking();
    audioEngine.stopListening();
    setSelectedTrapId(filteredTraps[0]?.id ?? '');
    setPairIdx(0);
    setEarSecret(pickRandomEarSecret());
    setEarStatus('ready');
    setWigglingSide(null);
    setEarStreak(0);
    setSpeakState('idle');
    setLastHeard('');
    setLastScorePct(null);
  }, [profile.targetLang, filteredTraps]);

  const selectedTrap = useMemo(
    () => filteredTraps.find((t) => t.id === selectedTrapId) ?? filteredTraps[0] ?? null,
    [filteredTraps, selectedTrapId],
  );

  const currentPair = useMemo(() => {
    if (!selectedTrap || selectedTrap.minimalPairs.length === 0) return null;
    return selectedTrap.minimalPairs[pairIdx % selectedTrap.minimalPairs.length];
  }, [pairIdx, selectedTrap]);

  const speakTarget = (text: string, slow = false) => {
    const trapLang = selectedTrap?.lang ?? profile.targetLang;
    audioEngine.speak(text, trapLang, {
      slow: slow || profile.speechSlowMode,
      childPitch: isMini,
      onStart: () => setIsSpeaking(true),
      onEnd: () => setIsSpeaking(false),
    });
  };

  const startNextEarRound = (nextIdx: number) => {
    setPairIdx(nextIdx);
    const nextSecret = pickRandomEarSecret();
    setEarSecret(nextSecret);
    setEarStatus('ready');
    setWigglingSide(null);

    if (selectedTrap && selectedTrap.minimalPairs.length > 0) {
      const nextPair =
        selectedTrap.minimalPairs[nextIdx % selectedTrap.minimalPairs.length];
      const wordToPlay =
        nextSecret === 'target' ? nextPair.targetWord : nextPair.contrastWord;
      speakTarget(wordToPlay, false);
    }
  };

  const handleSelectTrap = (trap: PhoneticTrap) => {
    clearTimer();
    audioEngine.stopSpeaking();
    audioEngine.stopListening();
    audioEngine.playChime('tap', profile.soundFxEnabled);
    setSelectedTrapId(trap.id);
    setPairIdx(0);
    setEarSecret(pickRandomEarSecret());
    setEarStatus('ready');
    setWigglingSide(null);
    setEarStreak(0);
    setSpeakState('idle');
    setLastHeard('');
    setLastScorePct(null);
  };

  const handlePlayEarSecret = (slow = false) => {
    if (!currentPair) return;
    const word = earSecret === 'target' ? currentPair.targetWord : currentPair.contrastWord;
    speakTarget(word, slow);
  };

  const handlePickEarChoice = (picked: EarSecret) => {
    if (!selectedTrap || !currentPair || earStatus === 'correct') return;

    if (picked === earSecret) {
      audioEngine.playChime('success', profile.soundFxEnabled);
      setEarStatus('correct');
      const nextStreak = earStreak + 1;
      setEarStreak(nextStreak);

      const prevBest = profile.phoneticScores[selectedTrap.id] ?? 0;
      const earnedScore = Math.min(100, Math.max(prevBest + 20, nextStreak * 25));
      onUpdateScore(selectedTrap.id, earnedScore);

      clearTimer();
      timerRef.current = window.setTimeout(() => {
        startNextEarRound(pairIdx + 1);
      }, 1050);
    } else {
      audioEngine.playChime('gentle-nudge', profile.soundFxEnabled);
      setEarStatus('nudge');
      setEarStreak(0);
      setWigglingSide(picked);
      clearTimer();
      timerRef.current = window.setTimeout(() => {
        setWigglingSide(null);
      }, 600);
      handlePlayEarSecret(true);
    }
  };

  const handleToggleSpeakPractice = () => {
    if (!selectedTrap || !currentPair) return;

    if (speakState === 'listening') {
      audioEngine.stopListening();
      setSpeakState('idle');
      return;
    }

    audioEngine.stopSpeaking();
    audioEngine.playChime('tap', profile.soundFxEnabled);
    setSpeakState('listening');

    audioEngine.startListening(
      profile.targetLang,
      (transcripts) => {
        const res = matchSpokenAttempt(
          selectedTrap.practiceSentence,
          currentPair.targetWord,
          transcripts,
          profile.ageMode !== 'master',
        );
        const pct = Math.round(res.score * 100);
        setLastHeard(res.bestHeard);
        setLastScorePct(pct);

        if (res.matched) {
          audioEngine.playChime('celebrate', profile.soundFxEnabled);
          setSpeakState('matched');
          const boosted = Math.max(profile.phoneticScores[selectedTrap.id] ?? 0, pct);
          onUpdateScore(selectedTrap.id, boosted);
        } else {
          audioEngine.playChime('gentle-nudge', profile.soundFxEnabled);
          setSpeakState('retry');
          speakTarget(currentPair.targetWord, true);
        }
      },
      (reason) => {
        setSpeakState(
          reason === 'unsupported' || reason === 'not-allowed' ? 'unsupported' : 'retry',
        );
      },
      () => {
        setSpeakState((prev) => (prev === 'listening' ? 'idle' : prev));
      },
    );
  };

  if (!selectedTrap) {
    return (
      <section className="ln-phonetic-lab">
        <button type="button" className="ln-clay-btn ln-clay-btn--soft" onClick={onBack}>
          <ArrowLeft size={18} />
          <span>Geri Dön</span>
        </button>
      </section>
    );
  }

  const savedScore = profile.phoneticScores[selectedTrap.id] ?? 0;
  const targetLangLabel = TARGET_LANG_LABEL_TR[profile.targetLang] ?? 'İngilizce';

  return (
    <section className="ln-phonetic-lab">
      {/* Header */}
      <div className="ln-hero-banner">
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px', flexWrap: 'wrap' }}>
          <button
            type="button"
            className="ln-clay-btn ln-clay-btn--soft"
            onClick={() => {
              clearTimer();
              audioEngine.stopSpeaking();
              audioEngine.stopListening();
              audioEngine.playChime('tap', profile.soundFxEnabled);
              onBack();
            }}
          >
            <ArrowLeft size={18} />
            <span>{isMini ? 'Geri' : 'Dünyalar'}</span>
          </button>

          <div>
            <h1 style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '1.55rem' }}>
              <Ear size={24} />
              <span>Türkçe → {targetLangLabel} Ses Laboratuvarı</span>
            </h1>
            <p style={{ margin: '4px 0 0', color: 'var(--ln-ink-soft)', fontWeight: 700 }}>
              Türkçede zorlayıcı {filteredTraps.length} kritik sesi dudak-dil rehberi ve ikili kulak eğitimiyle keşfet.
            </p>
          </div>
        </div>

        <div className="ln-chip-group" style={{ alignItems: 'center' }}>
          <button
            type="button"
            className="ln-clay-btn ln-clay-btn--soft"
            style={{ minHeight: '46px', padding: '8px 16px', fontSize: '0.95rem' }}
            onClick={() => {
              audioEngine.playChime('tap', profile.soundFxEnabled);
              audioEngine.speakTurkish(TR_VOICE.phoneticsIntro, {
                onStart: () => setIsSpeaking(true),
                onEnd: () => setIsSpeaking(false),
              });
            }}
            aria-label="Ses laboratuvarı rehberini dinle"
          >
            <Volume2 size={18} />
            <span>Sesli Rehber</span>
          </button>

          <span className="ln-chip-btn" style={{ background: '#ffffff' }}>
            <Award size={16} style={{ verticalAlign: 'text-bottom', marginRight: '6px' }} />
            Bu Ses Skoru: <strong>%{savedScore}</strong>
          </span>
        </div>
      </div>

      {/* Phonetic Trap Selector Pills */}
      <div className="ln-trap-pills" role="tablist" aria-label="Fonetik Ses Tuzakları">
        {filteredTraps.map((trap) => {
          const active = trap.id === selectedTrap.id;
          const score = profile.phoneticScores[trap.id] ?? 0;

          return (
            <button
              key={trap.id}
              type="button"
              role="tab"
              aria-selected={active}
              className={`ln-chip-btn ${active ? 'is-selected' : ''}`}
              onClick={() => handleSelectTrap(trap)}
            >
              <strong style={{ fontSize: '1.1rem', marginRight: '6px' }}>{trap.symbol}</strong>
              <span>{trap.titleTr}</span>
              {score > 0 && (
                <span style={{ marginLeft: '6px', opacity: 0.9 }}>({score}%)</span>
              )}
            </button>
          );
        })}
      </div>

      {/* Articulation Guide + Minimal Pairs Studio */}
      <div className="ln-trap-card">
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <MouthPhoneticGuide
            viseme={selectedTrap.visemeType}
            symbol={selectedTrap.symbol}
            mouthCueTr={selectedTrap.mouthCueTr}
            animating={isSpeaking}
          />
          <button
            type="button"
            className="ln-clay-btn ln-clay-btn--lavender"
            style={{ width: '100%' }}
            onClick={() => {
              audioEngine.playChime('tap', profile.soundFxEnabled);
              audioEngine.speakTurkish(selectedTrap.mouthCueTr, {
                onStart: () => setIsSpeaking(true),
                onEnd: () => setIsSpeaking(false),
              });
            }}
            aria-label="Ağız ve dil ipucunu Türkçe sesli dinle"
          >
            <Volume2 size={18} />
            <span>Ağız &amp; Dil İpucunu Dinle</span>
          </button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
          <div className="ln-card">
            <h2 style={{ fontSize: '1.35rem', marginBottom: '8px' }}>
              {selectedTrap.symbol} — {selectedTrap.titleTr}
            </h2>
            <p style={{ margin: 0, color: 'var(--ln-ink-soft)', fontWeight: 700, lineHeight: 1.55 }}>
              {selectedTrap.whyHardForTurkishTr}
            </p>
          </div>

          {/* Minimal Pairs Side-by-Side Comparison */}
          <div className="ln-card">
            <h3 style={{ fontSize: '1.15rem', marginBottom: '12px' }}>
              🎧 İkili Karşılaştırma (Minimal Pairs)
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {selectedTrap.minimalPairs.map((pair, idx) => (
                <div key={`${pair.targetWord}-${pair.contrastWord}-${idx}`} className="ln-minimal-pairs">
                  {/* Target Sound Word */}
                  <div
                    className="ln-pair-card"
                    style={{ borderColor: '#38bdf8', background: '#f0f9ff' }}
                  >
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        gap: '8px',
                      }}
                    >
                      <span style={{ fontSize: '1.75rem' }}>{pair.targetEmoji}</span>
                      <span
                        className="ln-chip-btn"
                        style={{ minHeight: 'auto', padding: '4px 10px', fontSize: '0.78rem' }}
                      >
                        Hedef: {selectedTrap.symbol}
                      </span>
                    </div>
                    <div style={{ fontFamily: 'var(--ln-font-display)', fontSize: '1.35rem', fontWeight: 700 }}>
                      {pair.targetWord}
                    </div>
                    <div style={{ fontSize: '0.9rem', fontWeight: 800, color: 'var(--ln-ink-muted)' }}>
                      {pair.targetIpa} • 🇹🇷 {pair.targetTr}
                    </div>
                    <div className="ln-chip-group">
                      <button
                        type="button"
                        className="ln-clay-btn"
                        style={{ minHeight: '44px', padding: '8px 14px', fontSize: '0.92rem' }}
                        onClick={() => speakTarget(pair.targetWord, false)}
                      >
                        <Volume2 size={16} />
                        <span>Dinle</span>
                      </button>
                      <button
                        type="button"
                        className="ln-clay-btn ln-clay-btn--gold"
                        style={{ minHeight: '44px', padding: '8px 12px', fontSize: '0.92rem' }}
                        onClick={() => speakTarget(pair.targetWord, true)}
                        title="0.80x Yavaş Dinle"
                      >
                        🐢
                      </button>
                    </div>
                  </div>

                  {/* Turkish L1 Confusion Contrast Word */}
                  <div
                    className="ln-pair-card"
                    style={{ borderColor: '#fdba74', background: '#fff7ed' }}
                  >
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        gap: '8px',
                      }}
                    >
                      <span style={{ fontSize: '1.75rem' }}>{pair.contrastEmoji}</span>
                      <span
                        className="ln-chip-btn"
                        style={{ minHeight: 'auto', padding: '4px 10px', fontSize: '0.78rem' }}
                      >
                        Karışan Ses
                      </span>
                    </div>
                    <div style={{ fontFamily: 'var(--ln-font-display)', fontSize: '1.35rem', fontWeight: 700 }}>
                      {pair.contrastWord}
                    </div>
                    <div style={{ fontSize: '0.9rem', fontWeight: 800, color: 'var(--ln-ink-muted)' }}>
                      {pair.contrastIpa} • 🇹🇷 {pair.contrastTr}
                    </div>
                    <div className="ln-chip-group">
                      <button
                        type="button"
                        className="ln-clay-btn ln-clay-btn--soft"
                        style={{ minHeight: '44px', padding: '8px 14px', fontSize: '0.92rem' }}
                        onClick={() => speakTarget(pair.contrastWord, false)}
                      >
                        <Volume2 size={16} />
                        <span>Dinle</span>
                      </button>
                      <button
                        type="button"
                        className="ln-clay-btn ln-clay-btn--gold"
                        style={{ minHeight: '44px', padding: '8px 12px', fontSize: '0.92rem' }}
                        onClick={() => speakTarget(pair.contrastWord, true)}
                        title="0.80x Yavaş Dinle"
                      >
                        🐢
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* 2-Choice "Hangisini Duydun?" Ear-Discrimination Game */}
      {currentPair && (
        <div className="ln-card" style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '12px',
              flexWrap: 'wrap',
            }}
          >
            <div>
              <h2 style={{ fontSize: '1.35rem' }}>👂 Hangisini Duydun? (Kulak Eğitimi)</h2>
              <p style={{ margin: '4px 0 0', color: 'var(--ln-ink-soft)', fontWeight: 700 }}>
                Sesin algısal mıknatısını kırmak için sesi çal ve doğru kelimeyi seç!
              </p>
            </div>

            <div className="ln-chip-group">
              <button
                type="button"
                className="ln-clay-btn"
                onClick={() => handlePlayEarSecret(false)}
              >
                <Volume2 size={20} />
                <span>Sesi Çal</span>
              </button>
              <button
                type="button"
                className="ln-clay-btn ln-clay-btn--gold"
                onClick={() => handlePlayEarSecret(true)}
                title="0.80x Yavaş Dinle"
              >
                🐢 <span>Yavaş</span>
              </button>
              <button
                type="button"
                className="ln-clay-btn ln-clay-btn--soft"
                onClick={() => startNextEarRound(pairIdx + 1)}
              >
                <RefreshCw size={18} />
                <span>Yeni Çift</span>
              </button>
            </div>
          </div>

          <div className="ln-choices-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))' }}>
            <button
              type="button"
              disabled={earStatus === 'correct'}
              className={`ln-choice-tile ${wigglingSide === 'target' ? 'is-nudge animate-gentle-wiggle' : ''} ${earStatus === 'correct' && earSecret === 'target' ? 'is-correct' : ''}`}
              onClick={() => handlePickEarChoice('target')}
            >
              <span style={{ fontSize: '2.8rem', lineHeight: 1 }}>{currentPair.targetEmoji}</span>
              <strong style={{ fontSize: '1.35rem', fontFamily: 'var(--ln-font-display)' }}>
                {currentPair.targetWord}
              </strong>
              <span style={{ fontSize: '0.88rem', fontWeight: 800, color: 'var(--ln-ink-muted)' }}>
                {currentPair.targetIpa} • {currentPair.targetTr}
              </span>
            </button>

            <button
              type="button"
              disabled={earStatus === 'correct'}
              className={`ln-choice-tile ${wigglingSide === 'contrast' ? 'is-nudge animate-gentle-wiggle' : ''} ${earStatus === 'correct' && earSecret === 'contrast' ? 'is-correct' : ''}`}
              onClick={() => handlePickEarChoice('contrast')}
            >
              <span style={{ fontSize: '2.8rem', lineHeight: 1 }}>{currentPair.contrastEmoji}</span>
              <strong style={{ fontSize: '1.35rem', fontFamily: 'var(--ln-font-display)' }}>
                {currentPair.contrastWord}
              </strong>
              <span style={{ fontSize: '0.88rem', fontWeight: 800, color: 'var(--ln-ink-muted)' }}>
                {currentPair.contrastIpa} • {currentPair.contrastTr}
              </span>
            </button>
          </div>

          {earStatus === 'correct' && (
            <div
              className="ln-chip-btn"
              style={{
                alignSelf: 'center',
                background: '#ecfdf5',
                borderColor: '#10b981',
                color: '#065f46',
              }}
            >
              <CheckCircle2 size={18} style={{ verticalAlign: 'text-bottom', marginRight: '6px' }} />
              Mükemmel kulak! Seri: {earStreak} 🌟
            </div>
          )}

          {earStatus === 'nudge' && (
            <div
              className="ln-tpr-banner"
              style={{ alignSelf: 'center', background: '#fff7ed', borderColor: '#fdba74' }}
            >
              💛 Çok yaklaştın! Yavaş sesi dinle ve ağız rehberindeki dil/dudak konumunu fark et.
            </div>
          )}
        </div>
      )}

      {/* Speaking Practice Card */}
      <div className="ln-card" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px', textAlign: 'center' }}>
        <h2 style={{ fontSize: '1.3rem' }}>🎤 Konuşma Pratiği</h2>
        <div
          style={{
            padding: '14px 22px',
            borderRadius: '18px',
            background: '#f0f9ff',
            border: '2px solid #bae6fd',
            fontFamily: 'var(--ln-font-display)',
            fontSize: '1.25rem',
            fontWeight: 600,
          }}
        >
          &ldquo;{selectedTrap.practiceSentence}&rdquo;
        </div>

        <div className="ln-chip-group" style={{ justifyContent: 'center' }}>
          <button
            type="button"
            className="ln-clay-btn ln-clay-btn--soft"
            onClick={() => speakTarget(selectedTrap.practiceSentence, false)}
          >
            <Volume2 size={18} />
            <span>Cümleyi Dinle</span>
          </button>
          <button
            type="button"
            className="ln-clay-btn ln-clay-btn--gold"
            onClick={() => speakTarget(selectedTrap.practiceSentence, true)}
            title="0.80x Yavaş Dinle"
          >
            🐢 <span>Yavaş</span>
          </button>
          {currentPair && (
            <button
              type="button"
              className="ln-clay-btn"
              onClick={() => speakTarget(currentPair.targetWord, false)}
            >
              <Volume2 size={18} />
              <span>Hedef: {currentPair.targetWord}</span>
            </button>
          )}
        </div>

        <button
          type="button"
          className={`ln-mic-btn ${speakState === 'listening' ? 'is-listening' : ''}`}
          onClick={handleToggleSpeakPractice}
        >
          {speakState === 'listening' ? <MicOff size={26} /> : <Mic size={26} />}
          <span>
            {speakState === 'listening'
              ? 'Dinliyorum...'
              : 'Cümleyi veya Hedef Kelimeyi Söyle'}
          </span>
        </button>

        {speakState === 'matched' && (
          <div
            className="ln-chip-btn"
            style={{ background: '#ecfdf5', borderColor: '#10b981', color: '#065f46' }}
          >
            <CheckCircle2 size={18} style={{ verticalAlign: 'text-bottom', marginRight: '6px' }} />
            Harika telaffuz! {lastScorePct !== null ? `%${lastScorePct} uyum` : ''}{' '}
            {lastHeard ? `("${lastHeard}")` : ''}
          </div>
        )}

        {speakState === 'retry' && (
          <div
            className="ln-chip-btn"
            style={{ background: '#fff7ed', borderColor: '#fdba74', color: '#9a3412' }}
          >
            {lastHeard
              ? `Duyulan: "${lastHeard}" (%${lastScorePct ?? 0}) — ağız rehberine bakıp tekrar dene!`
              : 'Bir kez daha deneyelim!'}
          </div>
        )}

        {speakState === 'unsupported' && (
          <p style={{ margin: 0, color: 'var(--ln-ink-muted)', fontWeight: 700 }}>
            Bu cihazda tarayıcı mikrofonu devre dışı — dinle ve ayna karşısında sesli tekrar et!
          </p>
        )}
      </div>
    </section>
  );
}

export default PhoneticLabView;
