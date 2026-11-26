import { useEffect, useMemo, useRef, useState } from 'react';
import {
  AlertTriangle,
  ArrowLeft,
  ArrowRight,
  Award,
  CheckCircle2,
  Eye,
  EyeOff,
  MessageSquare,
  Mic,
  MicOff,
  RefreshCw,
  RotateCcw,
  Volume2,
} from 'lucide-react';
import type {
  AdultDialogue,
  AdultDialogueOption,
  LearnerProfile,
} from '../types';
import { audioEngine, matchSpokenAttempt } from '../engine/audioEngine';

export interface AdultDialogueViewProps {
  dialogues: AdultDialogue[];
  profile: LearnerProfile;
  onCompleteDialogue: (dialogueId: string) => void;
  onBack: () => void;
  onRegisterSubBack?: (fn: (() => boolean) | null) => void;
}

interface TurnSelectionRecord {
  optionIdx: number;
  option: AdultDialogueOption;
  firstAttemptBest: boolean;
  spokenMatched: boolean;
  spokenScorePct: number | null;
  spokenHeard: string;
}

type SpeakState = 'idle' | 'listening' | 'matched' | 'retry' | 'unsupported';

function shuffleOptions(opts: AdultDialogueOption[]): AdultDialogueOption[] {
  const copy = [...opts];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const tmp = copy[i];
    copy[i] = copy[j];
    copy[j] = tmp;
  }
  return copy;
}

export function AdultDialogueView({
  dialogues,
  profile,
  onCompleteDialogue,
  onBack,
  onRegisterSubBack,
}: AdultDialogueViewProps) {
  const [activeDialogueId, setActiveDialogueId] = useState<string | null>(null);
  const [turnIndex, setTurnIndex] = useState(0);
  const [showTurkishGloss, setShowTurkishGloss] = useState(true);
  const [shuffledOptionsByTurn, setShuffledOptionsByTurn] = useState<
    Record<number, AdultDialogueOption[]>
  >({});
  const [selections, setSelections] = useState<Record<number, TurnSelectionRecord>>({});
  const [speakState, setSpeakState] = useState<SpeakState>('idle');
  const [dialogueFinished, setDialogueFinished] = useState(false);

  const completedNotifiedRef = useRef(false);
  const micCancelledRef = useRef(false);

  const activeDialogue = useMemo(
    () => dialogues.find((d) => d.id === activeDialogueId) ?? null,
    [dialogues, activeDialogueId],
  );

  // Register Android hardware back sub-handler when inside an active scenario (P0-2)
  useEffect(() => {
    if (!onRegisterSubBack) return undefined;
    if (activeDialogueId !== null) {
      onRegisterSubBack(() => {
        micCancelledRef.current = true;
        audioEngine.stopSpeaking();
        audioEngine.stopListening();
        setSpeakState('idle');
        setActiveDialogueId(null);
        return true;
      });
    } else {
      onRegisterSubBack(null);
    }
    return () => {
      onRegisterSubBack(null);
    };
  }, [activeDialogueId, onRegisterSubBack]);

  // Cleanup audio when leaving view or switching scenarios
  useEffect(() => {
    return () => {
      micCancelledRef.current = true;
      audioEngine.stopSpeaking();
      audioEngine.stopListening();
    };
  }, []);

  const startScenario = (dialogue: AdultDialogue) => {
    micCancelledRef.current = true;
    audioEngine.stopSpeaking();
    audioEngine.stopListening();
    audioEngine.playChime('tap', profile.soundFxEnabled);
    const shuffledMap: Record<number, AdultDialogueOption[]> = {};
    dialogue.turns.forEach((turn, idx) => {
      if (turn.options && turn.options.length > 0) {
        shuffledMap[idx] = shuffleOptions(turn.options);
      }
    });
    setShuffledOptionsByTurn(shuffledMap);
    setActiveDialogueId(dialogue.id);
    setTurnIndex(0);
    setSelections({});
    setSpeakState('idle');
    setDialogueFinished(false);
    completedNotifiedRef.current = false;
  };

  const currentTurn =
    activeDialogue && !dialogueFinished
      ? activeDialogue.turns[turnIndex] ?? null
      : null;

  // Auto-play partner lines when arriving at a partner turn
  useEffect(() => {
    if (!activeDialogue || dialogueFinished || !currentTurn) return;
    if (currentTurn.speaker === 'partner') {
      const line = currentTurn.text[profile.targetLang];
      const timer = window.setTimeout(() => {
        audioEngine.speak(line, profile.targetLang, { slow: false, role: 'partner' });
      }, 150);
      return () => window.clearTimeout(timer);
    }
    return undefined;
  }, [activeDialogue, currentTurn, dialogueFinished, profile.targetLang, turnIndex]);

  const handleSelectOption = (
    tIdx: number,
    optIdx: number,
    option: AdultDialogueOption,
  ) => {
    const line = option.text[profile.targetLang];
    micCancelledRef.current = true;
    audioEngine.stopListening();
    setSpeakState('idle');
    audioEngine.playChime(
      option.isBest ? 'success' : 'gentle-nudge',
      profile.soundFxEnabled,
    );
    audioEngine.speak(line, profile.targetLang, { slow: false, role: 'adult' });

    setSelections((prev) => {
      const existing = prev[tIdx];
      return {
        ...prev,
        [tIdx]: {
          optionIdx: optIdx,
          option,
          firstAttemptBest: existing ? existing.firstAttemptBest : option.isBest,
          spokenMatched: existing?.optionIdx === optIdx ? existing.spokenMatched : false,
          spokenScorePct: existing?.optionIdx === optIdx ? existing.spokenScorePct : null,
          spokenHeard: existing?.optionIdx === optIdx ? existing.spokenHeard : '',
        },
      };
    });
  };

  const handlePracticeSpeakLine = (tIdx: number, lineToSpeak: string) => {
    if (!audioEngine.supportsSpeechRecognition()) {
      setSpeakState('unsupported');
      return;
    }

    if (speakState === 'listening') {
      micCancelledRef.current = true;
      audioEngine.stopListening();
      setSpeakState('idle');
      return;
    }

    micCancelledRef.current = false;
    audioEngine.stopSpeaking();
    setSpeakState('listening');

    audioEngine.startListening(
      profile.targetLang,
      (alts) => {
        if (micCancelledRef.current) return;
        const res = matchSpokenAttempt(lineToSpeak, lineToSpeak, alts, false);
        const pct = Math.round(res.score * 100);
        setSpeakState(res.matched ? 'matched' : 'retry');
        audioEngine.playChime(
          res.matched ? 'success' : 'gentle-nudge',
          profile.soundFxEnabled,
        );
        setSelections((prev) => {
          const existing = prev[tIdx];
          if (!existing) return prev;
          return {
            ...prev,
            [tIdx]: {
              ...existing,
              spokenMatched: existing.spokenMatched || res.matched,
              spokenScorePct: pct,
              spokenHeard: res.bestHeard,
            },
          };
        });
      },
      (reason) => {
        if (
          micCancelledRef.current ||
          reason === 'aborted' ||
          reason === 'canceled' ||
          reason === 'cancelled'
        ) {
          setSpeakState('idle');
          return;
        }
        setSpeakState(reason === 'unsupported' || reason === 'not-allowed' ? 'unsupported' : 'retry');
      },
      () => {
        setSpeakState((prev) => (prev === 'listening' ? 'idle' : prev));
      },
    );
  };

  const handleAdvanceTurn = () => {
    if (!activeDialogue) return;
    micCancelledRef.current = true;
    audioEngine.stopSpeaking();
    audioEngine.stopListening();
    setSpeakState('idle');

    if (turnIndex + 1 >= activeDialogue.turns.length) {
      setDialogueFinished(true);
      audioEngine.playChime('celebrate', profile.soundFxEnabled);
      if (!completedNotifiedRef.current) {
        completedNotifiedRef.current = true;
        onCompleteDialogue(activeDialogue.id);
      }
    } else {
      audioEngine.playChime('tap', profile.soundFxEnabled);
      setTurnIndex((i) => i + 1);
    }
  };

  // SCENARIO PICKER GRID
  if (!activeDialogue) {
    return (
      <section className="ln-adult-dialogue" aria-label="Rol-Yapma Diyalog Stüdyosu">
        <header className="ln-adult-dialogue-header">
          <button
            type="button"
            className="ln-adult-btn ln-adult-btn--ghost"
            onClick={() => {
              audioEngine.playChime('tap', profile.soundFxEnabled);
              onBack();
            }}
          >
            <ArrowLeft size={16} aria-hidden="true" />
            <span>Stüdyoya Dön</span>
          </button>

          <div className="ln-adult-dialogue-title">
            <div className="ln-adult-kicker">
              <MessageSquare size={14} aria-hidden="true" />
              <span>Sesli Rol-Yapma Stüdyosu</span>
            </div>
            <h1>Gerçek Senaryo Simülasyonları</h1>
          </div>

          <span className="ln-adult-pareto-badge">
            {dialogues.filter((d) => profile.completedStories.includes(d.id)).length} /{' '}
            {dialogues.length} Tamamlandı
          </span>
        </header>

        <div className="ln-adult-scenario-grid">
          {dialogues.map((dlg) => {
            const isDone = profile.completedStories.includes(dlg.id);
            return (
              <button
                key={dlg.id}
                type="button"
                className={`ln-adult-scenario-card ${isDone ? 'is-completed' : ''}`}
                onClick={() => startScenario(dlg)}
              >
                <div className="ln-adult-scenario-head">
                  <span className="ln-adult-module-icon" aria-hidden="true">
                    {dlg.icon}
                  </span>
                  <div className="ln-adult-module-badges">
                    <span className="ln-adult-cefr-badge">{dlg.cefr}</span>
                    {isDone && (
                      <span className="ln-adult-done-badge">
                        <CheckCircle2 size={12} aria-hidden="true" /> Tamamlandı
                      </span>
                    )}
                  </div>
                </div>

                <h3 className="ln-adult-module-title">{dlg.titleTr}</h3>
                <p className="ln-adult-module-sub">{dlg.scenarioTr}</p>

                <div className="ln-adult-scenario-footer">
                  <span>{dlg.turns.length} Etkileşim Turu</span>
                  <span className="ln-adult-module-launch">
                    <span>Simülasyonu Başlat</span>
                    <ArrowRight size={14} aria-hidden="true" />
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </section>
    );
  }

  // ACTIVE ROLEPLAY STAGE
  const visibleTurns = dialogueFinished
    ? activeDialogue.turns
    : activeDialogue.turns.slice(0, turnIndex + 1);

  const learnerTurnsCount = activeDialogue.turns.filter((t) => t.speaker === 'learner').length;
  const bestSelectedCount = Object.values(selections).filter((s) => s.firstAttemptBest).length;
  const spokenLinesCount = Object.values(selections).filter((s) => s.spokenMatched).length;

  const activeSelection = selections[turnIndex];
  const canAdvance =
    currentTurn?.speaker === 'partner' ||
    (currentTurn?.speaker === 'learner' &&
      (Boolean(activeSelection) || !currentTurn.options?.length));

  return (
    <section className="ln-adult-dialogue" aria-label={activeDialogue.titleTr}>
      <header className="ln-adult-practice-topbar">
        <button
          type="button"
          className="ln-adult-btn ln-adult-btn--ghost"
          onClick={() => {
            micCancelledRef.current = true;
            audioEngine.stopSpeaking();
            audioEngine.stopListening();
            setSpeakState('idle');
            setActiveDialogueId(null);
          }}
        >
          <ArrowLeft size={16} aria-hidden="true" />
          <span>Senaryolar</span>
        </button>

        <div className="ln-adult-practice-progress">
          <div className="ln-adult-practice-meta">
            <span>
              {activeDialogue.icon} {activeDialogue.titleTr}
            </span>
            <strong>
              {Math.min(turnIndex + 1, activeDialogue.turns.length)} /{' '}
              {activeDialogue.turns.length}
            </strong>
          </div>
          <div className="ln-adult-progress-track">
            <div
              className="ln-adult-progress-fill"
              style={{
                width: `${Math.round(
                  ((dialogueFinished ? activeDialogue.turns.length : turnIndex + 1) /
                    Math.max(activeDialogue.turns.length, 1)) *
                    100,
                )}%`,
              }}
            />
          </div>
        </div>

        <button
          type="button"
          className="ln-adult-btn ln-adult-btn--ghost"
          onClick={() => setShowTurkishGloss((v) => !v)}
          aria-pressed={showTurkishGloss}
        >
          {showTurkishGloss ? <Eye size={15} aria-hidden="true" /> : <EyeOff size={15} aria-hidden="true" />}
          <span>{showTurkishGloss ? 'TR Açık' : 'TR Gizli'}</span>
        </button>
      </header>

      <div className="ln-adult-dialogue-scenario-bar">
        <span className="ln-adult-cefr-badge">{activeDialogue.cefr}</span>
        <span>{activeDialogue.scenarioTr}</span>
      </div>

      {/* Chat Thread */}
      <div className="ln-adult-chat-thread">
        {visibleTurns.map((turn, idx) => {
          const isCurrent = !dialogueFinished && idx === turnIndex;
          const isPartner = turn.speaker === 'partner';
          const selectedRec = selections[idx];
          const displayLine = isPartner
            ? turn.text[profile.targetLang]
            : selectedRec
              ? selectedRec.option.text[profile.targetLang]
              : turn.text[profile.targetLang];

          return (
            <div
              key={idx}
              className={`ln-adult-chat-turn ${isPartner ? 'is-partner' : 'is-learner'} ${isCurrent ? 'is-current' : ''}`}
            >
              <div className="ln-adult-chat-avatar" aria-hidden="true">
                {turn.avatar}
              </div>

              <div className="ln-adult-chat-bubble">
                <div className="ln-adult-chat-meta">
                  <strong>{turn.roleTr}</strong>
                  {(isPartner || selectedRec || !turn.options?.length) && (
                    <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                      <button
                        type="button"
                        className="ln-adult-icon-link"
                        onClick={() =>
                          audioEngine.speak(displayLine, profile.targetLang, {
                            slow: false,
                            role: isPartner ? 'partner' : 'adult',
                          })
                        }
                        aria-label="Satırı sesli dinle"
                      >
                        <Volume2 size={14} aria-hidden="true" />
                        <span>Dinle</span>
                      </button>
                      {isPartner && (
                        <button
                          type="button"
                          className="ln-adult-icon-link"
                          onClick={() =>
                            audioEngine.speak(displayLine, profile.targetLang, {
                              slow: true,
                              role: 'partner',
                            })
                          }
                          aria-label="Satırı 0.80x yavaş hızda dinle"
                        >
                          <span>🐢 0.80x</span>
                        </button>
                      )}
                    </div>
                  )}
                </div>

                {/* Partner or resolved learner message */}
                {(isPartner || selectedRec || !turn.options?.length) && (
                  <>
                    <p className="ln-adult-chat-line">{displayLine}</p>
                    {showTurkishGloss && (
                      <p className="ln-adult-chat-gloss">
                        {selectedRec ? selectedRec.option.turkishHint : turn.turkishGloss}
                      </p>
                    )}
                  </>
                )}

                {/* Learner interactive options on current turn (or reviewable if selected) */}
                {!isPartner && isCurrent && turn.options && turn.options.length > 0 && (
                  <div className="ln-adult-options-panel">
                    <span className="ln-adult-options-prompt">
                      En doğal yanıtı seçin (Türkçe tuzaklara dikkat edin):
                    </span>
                    <div className="ln-adult-options-list">
                      {(shuffledOptionsByTurn[idx] ?? turn.options).map((opt, optIdx) => {
                        const isPicked = selectedRec?.optionIdx === optIdx;
                        const optLine = opt.text[profile.targetLang];
                        return (
                          <button
                            key={optIdx}
                            type="button"
                            className={`ln-adult-option-btn ${
                              isPicked ? (opt.isBest ? 'is-best' : 'is-trap') : ''
                            }`}
                            onClick={() => handleSelectOption(idx, optIdx, opt)}
                          >
                            <div className="ln-adult-option-main">
                              <strong>{optLine}</strong>
                              <small>{opt.turkishHint}</small>
                            </div>
                            {isPicked && (
                              <span className="ln-adult-option-badge">
                                {opt.isBest ? 'Doğal ✓' : 'Tuzak'}
                              </span>
                            )}
                          </button>
                        );
                      })}
                    </div>

                    {/* Contrastive feedback + Mic speaking practice after choosing */}
                    {selectedRec && (
                      <div className="ln-adult-turn-feedback-box">
                        <div
                          className={`ln-adult-feedback-banner ${
                            selectedRec.option.isBest ? 'is-success' : 'is-warn'
                          }`}
                        >
                          {selectedRec.option.isBest ? (
                            <CheckCircle2 size={16} aria-hidden="true" />
                          ) : (
                            <AlertTriangle size={16} aria-hidden="true" />
                          )}
                          <span>{selectedRec.option.feedbackTr}</span>
                        </div>

                        <div className="ln-adult-turn-speak-row">
                          <button
                            type="button"
                            className={`ln-adult-btn ${
                              speakState === 'listening'
                                ? 'ln-adult-btn--danger'
                                : 'ln-adult-btn--secondary'
                            }`}
                            onClick={() =>
                              handlePracticeSpeakLine(
                                idx,
                                selectedRec.option.text[profile.targetLang],
                              )
                            }
                          >
                            {speakState === 'listening' ? (
                              <>
                                <MicOff size={15} aria-hidden="true" />
                                <span>Dinleniyor... (Durdur)</span>
                              </>
                            ) : (
                              <>
                                <Mic size={15} aria-hidden="true" />
                                <span>Seçilen Satırı Sesli Söyle</span>
                              </>
                            )}
                          </button>

                          {selectedRec.spokenScorePct !== null && (
                            <span
                              className={`ln-adult-speak-pill ${
                                selectedRec.spokenMatched ? 'is-matched' : 'is-retry'
                              }`}
                            >
                              {selectedRec.spokenMatched ? (
                                <CheckCircle2 size={13} aria-hidden="true" />
                              ) : (
                                <RefreshCw size={13} aria-hidden="true" />
                              )}
                              %{selectedRec.spokenScorePct}
                              {selectedRec.spokenHeard ? ` · “${selectedRec.spokenHeard}”` : ''}
                            </span>
                          )}

                          {speakState === 'unsupported' && (
                            <span className="ln-adult-speak-pill">
                              Tarayıcı mikrofon tanımayı desteklemiyor
                            </span>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Turn Advance Footer or Completion Summary */}
      {!dialogueFinished ? (
        <div className="ln-adult-dialogue-footer">
          <button
            type="button"
            className="ln-adult-btn ln-adult-btn--primary"
            disabled={!canAdvance}
            onClick={handleAdvanceTurn}
          >
            <span>
              {turnIndex + 1 >= activeDialogue.turns.length
                ? 'Senaryoyu Tamamla'
                : 'Sonraki Tura Geç'}
            </span>
            <ArrowRight size={16} aria-hidden="true" />
          </button>
        </div>
      ) : (
        <div className="ln-adult-summary-card is-inline">
          <div className="ln-adult-summary-icon">
            <Award size={28} aria-hidden="true" />
          </div>
          <h3>Senaryo Tamamlandı: {activeDialogue.titleTr}</h3>
          <div className="ln-adult-summary-metrics">
            <div className="ln-adult-metric-card">
              <span className="ln-adult-metric-label">Doğal Yanıt İsabeti</span>
              <strong className="ln-adult-metric-value">
                {bestSelectedCount} / {learnerTurnsCount}
              </strong>
            </div>
            <div className="ln-adult-metric-card">
              <span className="ln-adult-metric-label">Sesli Pratik</span>
              <strong className="ln-adult-metric-value">
                {spokenLinesCount} / {learnerTurnsCount}
              </strong>
            </div>
          </div>
          <div className="ln-adult-step-actions">
            <button
              type="button"
              className="ln-adult-btn ln-adult-btn--secondary"
              onClick={() => startScenario(activeDialogue)}
            >
              <RotateCcw size={15} aria-hidden="true" />
              <span>Senaryoyu Tekrarla</span>
            </button>
            <button
              type="button"
              className="ln-adult-btn ln-adult-btn--primary"
              onClick={() => {
                micCancelledRef.current = true;
                audioEngine.stopSpeaking();
                audioEngine.stopListening();
                setSpeakState('idle');
                setActiveDialogueId(null);
              }}
            >
              <ArrowLeft size={15} aria-hidden="true" />
              <span>Diğer Senaryolara Dön</span>
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
