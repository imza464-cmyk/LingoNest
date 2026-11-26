import { useEffect, useState } from 'react';
import { Lock, ShieldCheck, X } from 'lucide-react';
import type { AgeMode } from '../types';
import { audioEngine } from '../engine/audioEngine';

export interface AgeModeSwitcherProps {
  currentMode: AgeMode;
  onSelectMode: (mode: AgeMode) => void;
  onRequestParentGate: (targetMode: AgeMode) => void;
  onRegisterSubBack?: (fn: (() => boolean) | null) => void;
}

interface ModePillMeta {
  mode: AgeMode;
  emoji: string;
  title: string;
  subtitle: string;
}

interface MiniGateChallenge {
  prompt: string;
  answer: number;
  options: [number, number, number];
}

const MODE_PILLS: readonly ModePillMeta[] = [
  {
    mode: 'mini',
    emoji: '🐣',
    title: '4–7 Yaş · Mini',
    subtitle: 'Sıfır Yazı • Oyun & Hareket (TPR)',
  },
  {
    mode: 'explorer',
    emoji: '🧭',
    title: '8–14 Yaş · Kaşif',
    subtitle: 'Ses-Önce • 4 Seçenek • SVO Blokları',
  },
  {
    mode: 'master',
    emoji: '🎓',
    title: '15+ Yetişkin · Usta',
    subtitle: 'Koyu Stüdyo • Cloze Yazma • FSRS-5',
  },
] as const;

const GATE_CHALLENGES: readonly MiniGateChallenge[] = [
  { prompt: 'Üç + Dört = ?', answer: 7, options: [5, 7, 9] },
  { prompt: 'İki + Beş = ?', answer: 7, options: [4, 7, 10] },
  { prompt: 'Dört + İki = ?', answer: 6, options: [3, 6, 8] },
  { prompt: 'Beş + Dört = ?', answer: 9, options: [6, 9, 11] },
  { prompt: 'Üç + Beş = ?', answer: 8, options: [5, 8, 12] },
  { prompt: 'İki + Altı = ?', answer: 8, options: [4, 8, 9] },
] as const;

export function AgeModeSwitcher({
  currentMode,
  onSelectMode,
  onRequestParentGate,
  onRegisterSubBack,
}: AgeModeSwitcherProps) {
  const [pendingTarget, setPendingTarget] = useState<AgeMode | null>(null);
  const [challengeIdx, setChallengeIdx] = useState(0);
  const [gateNudged, setGateNudged] = useState(false);

  useEffect(() => {
    if (!onRegisterSubBack) return undefined;
    if (currentMode === 'mini' && pendingTarget !== null) {
      onRegisterSubBack(() => {
        setPendingTarget(null);
        setGateNudged(false);
        return true;
      });
    } else {
      onRegisterSubBack(null);
    }
    return () => {
      onRegisterSubBack(null);
    };
  }, [currentMode, onRegisterSubBack, pendingTarget]);

  const activeChallenge = GATE_CHALLENGES[challengeIdx % GATE_CHALLENGES.length];

  const handlePillClick = (targetMode: AgeMode) => {
    if (targetMode === currentMode) {
      setPendingTarget(null);
      setGateNudged(false);
      return;
    }

    // Leaving Mini Mode requires 1-tap Turkish literacy micro-gate so 5-year-olds don't wander out
    if (currentMode === 'mini') {
      audioEngine.playChime('tap', true);
      setPendingTarget(targetMode);
      setGateNudged(false);
      return;
    }

    // Switching from Explorer or Master to ANY mode happens instantaneously in 1 click
    audioEngine.playChime('tap', true);
    setPendingTarget(null);
    setGateNudged(false);
    onSelectMode(targetMode);
  };

  const handleAnswerOption = (picked: number) => {
    if (!pendingTarget) return;

    if (picked === activeChallenge.answer) {
      audioEngine.playChime('unlock', true);
      const target = pendingTarget;
      setPendingTarget(null);
      setGateNudged(false);
      onSelectMode(target);
    } else {
      audioEngine.playChime('gentle-nudge', true);
      setGateNudged(true);
      setChallengeIdx((i) => (i + 1) % GATE_CHALLENGES.length);
    }
  };

  const pendingMeta = MODE_PILLS.find((p) => p.mode === pendingTarget) ?? null;

  return (
    <section className="ln-age-switcher" aria-label="Yaş ve Öğrenme Yöntemi Dönüştürücü">
      <div className="ln-age-switcher-header">
        <span className="ln-age-switcher-kicker">Yaş &amp; Öğrenme Yöntemi Dönüştürücü</span>
        {currentMode === 'mini' && (
          <span className="ln-age-switcher-shield">
            <Lock size={12} aria-hidden="true" />
            <span>Çocuk Kilidi Aktif</span>
          </span>
        )}
      </div>

      <div className="ln-age-switcher-pills" role="tablist" aria-label="Bilişsel Yaş Modu">
        {MODE_PILLS.map((pill) => {
          const isActive = currentMode === pill.mode;
          const isPending = pendingTarget === pill.mode;

          return (
            <button
              key={pill.mode}
              type="button"
              role="tab"
              aria-selected={isActive}
              className={`ln-age-pill ln-age-pill--${pill.mode} ${isActive ? 'active' : ''} ${isPending ? 'is-pending' : ''}`}
              onClick={() => handlePillClick(pill.mode)}
            >
              <span className="ln-age-pill-emoji" aria-hidden="true">
                {pill.emoji}
              </span>
              <span className="ln-age-pill-meta">
                <strong className="ln-age-pill-title">{pill.title}</strong>
                <small className="ln-age-pill-sub">{pill.subtitle}</small>
              </span>
            </button>
          );
        })}
      </div>

      {/* Inline 0.8s Turkish Word-Math Confirmation Pill when leaving Mini Mode */}
      {currentMode === 'mini' && pendingTarget && pendingMeta && (
        <div
          className={`ln-age-gate-inline ${gateNudged ? 'animate-gentle-wiggle' : ''}`}
          role="dialog"
          aria-label="Yetişkin Geçiş Doğrulaması"
        >
          <div className="ln-age-gate-prompt">
            <Lock size={15} aria-hidden="true" />
            <span>
              <strong>{pendingMeta.title}</strong> geçişi — Yetişkin doğrulaması:{' '}
              <em>{activeChallenge.prompt}</em>
            </span>
          </div>

          <div className="ln-age-gate-opts">
            {activeChallenge.options.map((num) => (
              <button
                key={num}
                type="button"
                className="ln-age-gate-btn"
                onClick={() => handleAnswerOption(num)}
              >
                {num}
              </button>
            ))}

            <button
              type="button"
              className="ln-age-gate-panel-link"
              onClick={() => {
                const target = pendingTarget;
                setPendingTarget(null);
                onRequestParentGate(target);
              }}
              title="Tam Ebeveyn Panelini Aç"
            >
              <ShieldCheck size={14} aria-hidden="true" />
              <span>Ebeveyn Paneli</span>
            </button>

            <button
              type="button"
              className="ln-age-gate-cancel"
              onClick={() => {
                setPendingTarget(null);
                setGateNudged(false);
              }}
              aria-label="Geçişi iptal et"
              title="Vazgeç"
            >
              <X size={15} aria-hidden="true" />
            </button>
          </div>
        </div>
      )}
    </section>
  );
}

export default AgeModeSwitcher;
