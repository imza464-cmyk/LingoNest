import { useEffect, useMemo, useRef, useState } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  CheckCircle2,
  Eye,
  EyeOff,
  Lock,
  Play,
  RotateCcw,
  Sparkles,
  Volume2,
} from 'lucide-react';
import type { LearnerProfile, StoryData, VocabItem } from '../types';
import { audioEngine } from '../engine/audioEngine';
import { TR_VOICE } from '../data/voiceScripts';
import { isItemAwakeInLivingWorld } from '../engine/fsrs5';

export interface StoryTheaterViewProps {
  stories: StoryData[];
  vocabById: Record<string, VocabItem>;
  profile: LearnerProfile;
  onCompleteStory: (storyId: string) => void;
  onBack: () => void;
}

type StoryPhase = 'reading' | 'quiz' | 'done';

function shuffleItems<T>(arr: T[]): T[] {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

export function StoryTheaterView({
  stories,
  vocabById,
  profile,
  onCompleteStory,
  onBack,
}: StoryTheaterViewProps) {
  const isMini = profile.ageMode === 'mini';
  const [activeStoryId, setActiveStoryId] = useState<string | null>(null);
  const [lineIndex, setLineIndex] = useState(0);
  const [phase, setPhase] = useState<StoryPhase>('reading');
  const [showTurkishGloss, setShowTurkishGloss] = useState(true);
  const [isSpeaking, setIsSpeaking] = useState(false);

  const [quizChoices, setQuizChoices] = useState<VocabItem[]>([]);
  const [wigglingId, setWigglingId] = useState<string | null>(null);
  const [nudgedIds, setNudgedIds] = useState<string[]>([]);
  const [quizSolved, setQuizSolved] = useState(false);

  const timerRef = useRef<number | null>(null);

  const clearPendingTimer = () => {
    if (timerRef.current !== null) {
      window.clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  };

  useEffect(() => {
    return () => {
      clearPendingTimer();
      audioEngine.stopSpeaking();
    };
  }, []);

  const awakeCount = useMemo(() => {
    const prefix = `${profile.targetLang}:`;
    return Object.entries(profile.cards).filter(
      ([k, c]) => k.startsWith(prefix) && isItemAwakeInLivingWorld(c),
    ).length;
  }, [profile.cards, profile.targetLang]);

  const activeStory = useMemo(
    () => stories.find((s) => s.id === activeStoryId) ?? null,
    [stories, activeStoryId],
  );

  const currentLine = activeStory?.lines[lineIndex] ?? null;

  const speakStoryText = (text: string, slowOverride?: boolean) => {
    audioEngine.speak(text, profile.targetLang, {
      slow: slowOverride ?? profile.speechSlowMode,
      childPitch: isMini,
      role: 'warm',
      onStart: () => setIsSpeaking(true),
      onEnd: () => setIsSpeaking(false),
    });
  };

  useEffect(() => {
    if (!activeStory || phase !== 'reading' || !currentLine) return;
    const text = currentLine.text[profile.targetLang];
    if (text) {
      if (showTurkishGloss && currentLine.turkishGloss) {
        audioEngine.speakSequence(
          [
            { text, lang: profile.targetLang, slow: profile.speechSlowMode, role: 'warm' },
            { text: currentLine.turkishGloss, lang: 'tr' },
          ],
          {
            onStart: () => setIsSpeaking(true),
            onEnd: () => setIsSpeaking(false),
          },
        );
      } else {
        speakStoryText(text);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeStory?.id, lineIndex, phase, profile.targetLang]);

  useEffect(() => {
    if (!activeStory || phase !== 'quiz') return;
    const prompt = activeStory.quiz.promptAudio[profile.targetLang];
    audioEngine.speakSequence(
      [
        { text: TR_VOICE.storyQuizIntro, lang: 'tr' },
        ...(prompt
          ? [
              {
                text: prompt,
                lang: profile.targetLang,
                slow: profile.speechSlowMode,
                role: 'warm' as const,
              },
            ]
          : []),
      ],
      {
        onStart: () => setIsSpeaking(true),
        onEnd: () => setIsSpeaking(false),
      },
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeStory?.id, phase, profile.targetLang]);

  const prepareQuiz = (story: StoryData) => {
    const ids = [story.quiz.correctVocabId, ...story.quiz.distractorVocabIds];
    const resolved = ids
      .map((id) => vocabById[id])
      .filter((item): item is VocabItem => Boolean(item))
      .slice(0, 3);
    setQuizChoices(shuffleItems(resolved));
    setWigglingId(null);
    setNudgedIds([]);
    setQuizSolved(false);
  };

  const openStory = (story: StoryData) => {
    clearPendingTimer();
    audioEngine.stopSpeaking();
    audioEngine.playChime('tap', profile.soundFxEnabled);
    setActiveStoryId(story.id);
    setLineIndex(0);
    setPhase(story.lines.length > 0 ? 'reading' : 'quiz');
    setShowTurkishGloss(true);
    setWigglingId(null);
    setNudgedIds([]);
    setQuizSolved(false);

    if (story.lines.length === 0) {
      prepareQuiz(story);
    }
  };

  const handleCloseStory = () => {
    clearPendingTimer();
    audioEngine.stopSpeaking();
    setIsSpeaking(false);
    setActiveStoryId(null);
  };

  const handleNextLine = () => {
    if (!activeStory) return;
    audioEngine.playChime('tap', profile.soundFxEnabled);
    if (lineIndex + 1 < activeStory.lines.length) {
      setLineIndex((idx) => idx + 1);
    } else {
      prepareQuiz(activeStory);
      setPhase('quiz');
    }
  };

  const handlePrevLine = () => {
    if (lineIndex > 0) {
      audioEngine.playChime('tap', profile.soundFxEnabled);
      setLineIndex((idx) => idx - 1);
    }
  };

  const handleQuizPick = (choice: VocabItem) => {
    if (!activeStory || quizSolved) return;

    if (choice.id === activeStory.quiz.correctVocabId) {
      audioEngine.playChime('celebrate', profile.soundFxEnabled);
      setQuizSolved(true);
      onCompleteStory(activeStory.id);
      clearPendingTimer();
      timerRef.current = window.setTimeout(() => {
        setPhase('done');
        audioEngine.speakTurkish(TR_VOICE.storyComplete, {
          onStart: () => setIsSpeaking(true),
          onEnd: () => setIsSpeaking(false),
        });
      }, 950);
    } else {
      audioEngine.playChime('gentle-nudge', profile.soundFxEnabled);
      setWigglingId(choice.id);
      setNudgedIds((prev) => (prev.includes(choice.id) ? prev : [...prev, choice.id]));
      clearPendingTimer();
      timerRef.current = window.setTimeout(() => {
        setWigglingId(null);
      }, 600);
      speakStoryText(activeStory.quiz.promptAudio[profile.targetLang], true);
    }
  };

  // =========================================================================
  // 6-Story Library Grid
  // =========================================================================
  if (!activeStory) {
    return (
      <section className="ln-story-theater">
        <div className="ln-hero-banner">
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px', flexWrap: 'wrap' }}>
            <button
              type="button"
              className="ln-clay-btn ln-clay-btn--soft"
              onClick={() => {
                audioEngine.stopSpeaking();
                audioEngine.playChime('tap', profile.soundFxEnabled);
                onBack();
              }}
            >
              <ArrowLeft size={18} />
              <span>{isMini ? 'Geri' : 'Dünyalar'}</span>
            </button>

            <div>
              <h1 style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '1.6rem' }}>
                <BookOpen size={24} />
                <span>{isMini ? 'Sesli Masallar' : 'Hikaye Tiyatrosu'}</span>
              </h1>
              {!isMini && (
                <p style={{ margin: '4px 0 0', color: 'var(--ln-ink-soft)', fontWeight: 700 }}>
                  Öğrendiğin kelimelerle canlanan etkileşimli sesli mini hikayeler.
                </p>
              )}
            </div>
          </div>

          <div className="ln-chip-group" style={{ alignItems: 'center' }}>
            <button
              type="button"
              className="ln-clay-btn ln-clay-btn--soft"
              style={{ minHeight: '46px', padding: '8px 16px', fontSize: '0.95rem' }}
              onClick={() => {
                audioEngine.playChime('tap', profile.soundFxEnabled);
                audioEngine.speakTurkish(TR_VOICE.storiesIntro);
              }}
              aria-label="Masal tiyatrosu sesli rehberini dinle"
            >
              <Volume2 size={18} />
              <span>Sesli Rehber</span>
            </button>
            <span className="ln-chip-btn" style={{ background: '#ffffff' }}>
              ✨ Uyanan Kelime: <strong>{awakeCount}</strong>
            </span>
          </div>
        </div>

        <div className="ln-story-grid">
          {stories.map((story, idx) => {
            const unlocked =
              idx === 0 ||
              story.requiredMasteredCount <= 0 ||
              awakeCount >= story.requiredMasteredCount;
            const completed = profile.completedStories.includes(story.id);
            const gradientBg = `linear-gradient(135deg, ${story.gradient[0]}, ${story.gradient[1]})`;

            return (
              <article
                key={story.id}
                className="ln-story-card"
                style={{
                  background: gradientBg,
                  opacity: unlocked ? 1 : 0.86,
                  textShadow: '0 1px 2px rgba(15, 23, 42, 0.25)',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    justifyContent: 'space-between',
                    gap: '10px',
                  }}
                >
                  <span className="ln-world-emoji" aria-hidden="true">
                    {story.coverEmoji}
                  </span>

                  {completed ? (
                    <span
                      className="ln-world-badge"
                      style={{ background: '#ecfdf5', color: '#065f46', textShadow: 'none' }}
                    >
                      <CheckCircle2 size={15} />
                      <span>Tamamlandı</span>
                    </span>
                  ) : !unlocked ? (
                    <span className="ln-world-badge">
                      <Lock size={14} />
                      <span>
                        {awakeCount}/{story.requiredMasteredCount}
                      </span>
                    </span>
                  ) : (
                    <span className="ln-world-badge">
                      <Sparkles size={14} />
                      <span>Açık</span>
                    </span>
                  )}
                </div>

                <div>
                  <h2 style={{ fontSize: '1.35rem' }}>{story.titleTr}</h2>
                  {!isMini && (
                    <p style={{ margin: '4px 0 0', opacity: 0.94, fontWeight: 700 }}>
                      {story.titleTarget[profile.targetLang]}
                    </p>
                  )}
                </div>

                {unlocked ? (
                  <button
                    type="button"
                    className={`ln-clay-btn ln-clay-btn--soft ${isMini ? 'ln-touch-xl' : ''}`}
                    style={{ width: '100%', textShadow: 'none' }}
                    onClick={() => openStory(story)}
                  >
                    <Play size={18} fill="currentColor" />
                    <span>{completed ? 'Tekrar Dinle' : 'Dinle & İzle'}</span>
                  </button>
                ) : (
                  <div
                    className="ln-world-badge"
                    style={{ width: '100%', justifyContent: 'center', padding: '12px' }}
                  >
                    <Lock size={15} />
                    <span>
                      {Math.max(0, story.requiredMasteredCount - awakeCount)} kelime daha uyandır
                    </span>
                  </div>
                )}
              </article>
            );
          })}
        </div>
      </section>
    );
  }

  // =========================================================================
  // Interactive Story Player
  // =========================================================================
  const storyGradient = `linear-gradient(135deg, ${activeStory.gradient[0]}, ${activeStory.gradient[1]})`;
  const highlightVocab =
    currentLine?.highlightVocabId ? vocabById[currentLine.highlightVocabId] : undefined;

  return (
    <section className="ln-story-theater">
      <div
        className="ln-card"
        style={{
          padding: '16px 20px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '12px',
          flexWrap: 'wrap',
        }}
      >
        <button type="button" className="ln-clay-btn ln-clay-btn--soft" onClick={handleCloseStory}>
          <ArrowLeft size={18} />
          <span>{isMini ? 'Masallar' : 'Hikayelere Dön'}</span>
        </button>

        <div style={{ textAlign: 'center' }}>
          <strong style={{ fontSize: '1.15rem', fontFamily: 'var(--ln-font-display)' }}>
            {activeStory.coverEmoji} {activeStory.titleTr}
          </strong>
          {phase === 'reading' && (
            <div style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--ln-ink-muted)' }}>
              Sahne {lineIndex + 1} / {activeStory.lines.length}
            </div>
          )}
        </div>

        <button
          type="button"
          className={`ln-chip-btn ${showTurkishGloss ? 'is-selected' : ''}`}
          onClick={() => setShowTurkishGloss((v) => !v)}
        >
          {showTurkishGloss ? (
            <EyeOff size={16} style={{ verticalAlign: 'text-bottom', marginRight: '6px' }} />
          ) : (
            <Eye size={16} style={{ verticalAlign: 'text-bottom', marginRight: '6px' }} />
          )}
          <span>{showTurkishGloss ? 'Türkçeyi Gizle' : 'Ebeveyn Türkçesi'}</span>
        </button>
      </div>

      {/* Phase 1: Line-by-Line Audio Stage */}
      {phase === 'reading' && currentLine && (
        <div className="ln-story-stage">
          <div
            style={{
              background: storyGradient,
              borderRadius: '26px',
              padding: '32px 24px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '14px',
              position: 'relative',
              minHeight: '220px',
            }}
          >
            <div
              style={{
                fontSize: isMini ? '5.5rem' : '4.8rem',
                lineHeight: 1,
                transform: isSpeaking ? 'scale(1.08)' : 'scale(1)',
                transition: 'transform 0.3s var(--ln-ease-spring)',
              }}
              aria-hidden="true"
            >
              {currentLine.sceneEmoji}
            </div>

            {highlightVocab && (
              <div
                className="ln-chip-btn"
                style={{
                  backgroundColor: highlightVocab.bgColor,
                  borderColor: highlightVocab.accentColor,
                  color: 'var(--ln-ink)',
                }}
              >
                <span style={{ fontSize: '1.35rem', marginRight: '6px' }}>
                  {highlightVocab.emoji}
                </span>
                {!isMini && (
                  <span>{highlightVocab.langs[profile.targetLang].word}</span>
                )}
              </div>
            )}
          </div>

          <div className="ln-story-dialogue">
            <span style={{ fontSize: '2.5rem', lineHeight: 1 }} aria-hidden="true">
              {currentLine.speakerEmoji}
            </span>

            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '10px',
                  flexWrap: 'wrap',
                }}
              >
                <strong style={{ fontSize: '1.08rem', fontFamily: 'var(--ln-font-display)' }}>
                  {currentLine.speakerName}
                </strong>
                <div className="ln-chip-group">
                  <button
                    type="button"
                    className="ln-clay-btn"
                    style={{ minHeight: '44px', padding: '8px 16px', fontSize: '0.95rem' }}
                    onClick={() => speakStoryText(currentLine.text[profile.targetLang], false)}
                  >
                    <Volume2 size={18} />
                    <span>Dinle</span>
                  </button>
                  <button
                    type="button"
                    className="ln-clay-btn ln-clay-btn--gold"
                    style={{ minHeight: '44px', padding: '8px 14px', fontSize: '0.95rem' }}
                    onClick={() => speakStoryText(currentLine.text[profile.targetLang], true)}
                    title="0.78x Yavaş Dinle"
                  >
                    🐢
                  </button>
                </div>
              </div>

              {isMini ? (
                <button
                  type="button"
                  className="ln-clay-btn ln-clay-btn--soft ln-touch-xl"
                  onClick={() => speakStoryText(currentLine.text[profile.targetLang])}
                >
                  <Volume2 size={24} />
                  <span>Tekrar Dinle!</span>
                </button>
              ) : (
                <p
                  style={{
                    margin: 0,
                    fontSize: '1.3rem',
                    fontWeight: 800,
                    color: 'var(--ln-ink)',
                    lineHeight: 1.4,
                  }}
                >
                  {currentLine.text[profile.targetLang]}
                </p>
              )}

              {showTurkishGloss && (
                <button
                  type="button"
                  onClick={() => {
                    audioEngine.playChime('tap', profile.soundFxEnabled);
                    audioEngine.speakTurkish(currentLine.turkishGloss, {
                      onStart: () => setIsSpeaking(true),
                      onEnd: () => setIsSpeaking(false),
                    });
                  }}
                  style={{
                    margin: 0,
                    padding: '10px 14px',
                    borderRadius: '14px',
                    background: '#ffffff',
                    border: '2px solid #e2e8f0',
                    color: 'var(--ln-ink-soft)',
                    fontWeight: 700,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '10px',
                    width: '100%',
                    textAlign: 'left',
                  }}
                  aria-label="Türkçe anlamını sesli dinle"
                  title="Türkçesini sesli dinle"
                >
                  <span>🇹🇷 {currentLine.turkishGloss}</span>
                  <Volume2 size={16} style={{ flexShrink: 0, color: '#0284c7' }} />
                </button>
              )}
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', gap: '12px', flexWrap: 'wrap' }}>
            <button
              type="button"
              className="ln-clay-btn ln-clay-btn--soft"
              onClick={handlePrevLine}
              disabled={lineIndex === 0}
            >
              <ArrowLeft size={18} />
              <span>Önceki</span>
            </button>

            <button
              type="button"
              className="ln-clay-btn ln-clay-btn--mint ln-touch-xl"
              onClick={handleNextLine}
            >
              <span>
                {lineIndex + 1 < activeStory.lines.length
                  ? 'Sonraki Sahne'
                  : 'Mini Soruya Geç!'}
              </span>
              <ArrowRight size={20} />
            </button>
          </div>
        </div>
      )}

      {/* Phase 2: 3-Choice Audio Comprehension Quiz */}
      {phase === 'quiz' && (
        <div className="ln-story-stage ln-story-quiz">
          <div className="ln-story-dialogue" style={{ alignItems: 'center', flexWrap: 'wrap' }}>
            <span style={{ fontSize: '2.8rem' }} aria-hidden="true">
              🦉
            </span>
            <div style={{ flex: '1 1 220px' }}>
              <h2 style={{ fontSize: '1.4rem' }}>
                {isMini ? 'Dinle ve Doğru Resmi Seç!' : 'Hikaye Anlama Sorusu'}
              </h2>
              {(showTurkishGloss || !isMini) && (
                <p style={{ margin: '4px 0 0', fontWeight: 700, color: 'var(--ln-ink-soft)' }}>
                  {activeStory.quiz.promptTr}
                </p>
              )}
            </div>
            <div className="ln-chip-group">
              <button
                type="button"
                className="ln-clay-btn"
                onClick={() =>
                  speakStoryText(activeStory.quiz.promptAudio[profile.targetLang], false)
                }
              >
                <Volume2 size={20} />
                <span>Soruyu Dinle</span>
              </button>
              <button
                type="button"
                className="ln-clay-btn ln-clay-btn--gold"
                onClick={() =>
                  speakStoryText(activeStory.quiz.promptAudio[profile.targetLang], true)
                }
                title="Yavaş Dinle"
              >
                🐢
              </button>
            </div>
          </div>

          <div className="ln-choices-grid">
            {quizChoices.map((choice) => {
              const isWiggling = wigglingId === choice.id;
              const isNudged = nudgedIds.includes(choice.id);
              const isWinner = quizSolved && choice.id === activeStory.quiz.correctVocabId;

              return (
                <button
                  key={choice.id}
                  type="button"
                  disabled={quizSolved}
                  className={`ln-choice-tile ${isWiggling ? 'is-nudge animate-gentle-wiggle' : ''} ${isNudged && !isWiggling ? 'is-nudge' : ''} ${isWinner ? 'is-correct' : ''}`}
                  style={{
                    backgroundColor: isWinner || isNudged ? undefined : choice.bgColor,
                    borderColor: isWinner
                      ? '#10b981'
                      : isNudged
                        ? '#fdba74'
                        : choice.accentColor,
                    minHeight: isMini ? '170px' : '150px',
                  }}
                  onClick={() => handleQuizPick(choice)}
                >
                  <span style={{ fontSize: isMini ? '4.8rem' : '4rem', lineHeight: 1 }}>
                    {choice.emoji}
                  </span>
                  {!isMini && (
                    <span style={{ fontWeight: 800, color: 'var(--ln-ink)' }}>
                      {choice.turkishMeaning}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {nudgedIds.length > 0 && !quizSolved && (
            <div
              className="ln-tpr-banner"
              style={{ alignSelf: 'center', background: '#fff7ed', borderColor: '#fdba74' }}
            >
              💛 Yaklaştın! Sesi yavaşça tekrar dinleyip başka bir resim seçebilirsin.
            </div>
          )}
        </div>
      )}

      {/* Phase 3: Story Completed Celebration */}
      {phase === 'done' && (
        <div className="ln-story-stage" style={{ alignItems: 'center', textAlign: 'center' }}>
          <div style={{ fontSize: '4rem' }} aria-hidden="true">
            🌟 {activeStory.coverEmoji} 🎉
          </div>
          <h2 style={{ fontSize: '1.8rem' }}>Tebrikler! Hikayeyi Bitirdin!</h2>
          <p style={{ margin: 0, fontWeight: 700, color: 'var(--ln-ink-soft)' }}>
            <strong>{activeStory.titleTr}</strong> başarıyla tamamlandı!
          </p>
          <div className="ln-chip-group" style={{ justifyContent: 'center', marginTop: '8px' }}>
            <button
              type="button"
              className="ln-clay-btn ln-clay-btn--soft"
              onClick={() => openStory(activeStory)}
            >
              <RotateCcw size={18} />
              <span>Tekrar İzle</span>
            </button>
            <button
              type="button"
              className="ln-clay-btn ln-clay-btn--mint"
              onClick={handleCloseStory}
            >
              <Sparkles size={18} />
              <span>Diğer Hikayeler</span>
            </button>
            <button type="button" className="ln-clay-btn" onClick={onBack}>
              <span>Dünyalara Dön</span>
            </button>
          </div>
        </div>
      )}
    </section>
  );
}

export default StoryTheaterView;
