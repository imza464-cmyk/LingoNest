import { useEffect, useMemo, useState } from 'react';
import {
  ArrowLeft,
  BookOpen,
  Check,
  Eye,
  EyeOff,
  Play,
  Square,
  Volume2,
} from 'lucide-react';
import type { LearnerProfile } from '../types';
import { GRADED_STORIES, type GradedStory } from '../data/gradedStories';
import { audioEngine } from '../engine/audioEngine';

export interface GradedStoriesViewProps {
  profile: LearnerProfile;
  languageNameTr: string;
  onCompleteStory: (storyId: string) => void;
  onOpenIllustratedStories?: () => void;
  onBack: () => void;
}

export function GradedStoriesView({
  profile,
  languageNameTr,
  onCompleteStory,
  onOpenIllustratedStories,
  onBack,
}: GradedStoriesViewProps) {
  const [selectedCefr, setSelectedCefr] = useState<'ALL' | 'A1' | 'A2' | 'B1' | 'B2'>('ALL');
  const [activeStoryId, setActiveStoryId] = useState<string>(GRADED_STORIES[0]?.id ?? '');
  const [showTurkish, setShowTurkish] = useState<boolean>(false);
  const [isPlayingAll, setIsPlayingAll] = useState<boolean>(false);
  const [answers, setAnswers] = useState<Record<number, number>>({});

  useEffect(() => {
    return () => {
      audioEngine.stopSpeaking();
    };
  }, []);

  const filteredStories = useMemo(() => {
    if (selectedCefr === 'ALL') return GRADED_STORIES;
    return GRADED_STORIES.filter((s) => s.cefr === selectedCefr);
  }, [selectedCefr]);

  const activeStory: GradedStory | undefined = useMemo(() => {
    return (
      GRADED_STORIES.find((s) => s.id === activeStoryId) ??
      filteredStories[0] ??
      GRADED_STORIES[0]
    );
  }, [activeStoryId, filteredStories]);

  const handleSelectStory = (id: string) => {
    audioEngine.stopSpeaking();
    setIsPlayingAll(false);
    setAnswers({});
    setActiveStoryId(id);
  };

  const handlePlayParagraph = (text: string) => {
    setIsPlayingAll(false);
    audioEngine.speak(text, profile.targetLang, {
      slow: profile.speechSlowMode,
      role: 'adult',
    });
  };

  const handlePlayEntireStory = () => {
    if (!activeStory) return;
    if (isPlayingAll) {
      audioEngine.stopSpeaking();
      setIsPlayingAll(false);
      return;
    }
    const items = activeStory.paragraphs.map((p) => ({
      text: p.text[profile.targetLang],
      lang: profile.targetLang,
      slow: profile.speechSlowMode,
      role: 'adult' as const,
    }));
    audioEngine.speakSequence(items, {
      onStart: () => setIsPlayingAll(true),
      onEnd: () => setIsPlayingAll(false),
    });
  };

  const handlePickAnswer = (qIdx: number, optIdx: number) => {
    if (!activeStory) return;
    const next = { ...answers, [qIdx]: optIdx };
    setAnswers(next);
    const allCorrect = activeStory.questions.every((q, idx) => {
      const chosen = next[idx];
      return chosen !== undefined && q.options[chosen]?.isCorrect;
    });
    if (allCorrect) {
      onCompleteStory(activeStory.id);
    }
  };

  if (!activeStory) return null;

  const isCompleted = profile.completedStories.includes(activeStory.id);

  return (
    <section className="ln-handbook-shell" aria-labelledby="ln-gs-heading">
      <div className="ln-handbook-topbar">
        <button type="button" className="ln-hb-back-btn" onClick={onBack}>
          <ArrowLeft size={16} strokeWidth={1.75} aria-hidden="true" />
          <span>Geri Dön</span>
        </button>

        <div className="ln-hb-lang-toggle">
          <button
            type="button"
            className="ln-hb-pill is-active"
            onClick={() => setShowTurkish((prev) => !prev)}
          >
            {showTurkish ? (
              <>
                <EyeOff size={14} strokeWidth={1.75} aria-hidden="true" />
                <span>Türkçe Çeviriyi Gizle</span>
              </>
            ) : (
              <>
                <Eye size={14} strokeWidth={1.75} aria-hidden="true" />
                <span>Türkçe Çeviriyi Göster</span>
              </>
            )}
          </button>

          {onOpenIllustratedStories && (
            <button
              type="button"
              className="ln-hb-pill"
              onClick={() => {
                audioEngine.stopSpeaking();
                onOpenIllustratedStories();
              }}
            >
              <span>Başlangıç Resimli Hikayeler</span>
            </button>
          )}
        </div>
      </div>

      <div className="ln-handbook-grid">
        <aside className="ln-handbook-rail" aria-label="Okuma hikayeleri listesi">
          <div className="ln-hb-rail-head">
            <strong>Kademeli Okuma Kitaplığı</strong>
            <span>{GRADED_STORIES.length} Özgün Kısa Hikaye (A1–B2)</span>
          </div>

          <div className="ln-vb-cefr-bar" role="group" aria-label="Hikaye seviyesi">
            {(['ALL', 'A1', 'A2', 'B1', 'B2'] as const).map((lvl) => (
              <button
                key={lvl}
                type="button"
                className={`ln-vb-cefr-chip ${selectedCefr === lvl ? 'is-active' : ''}`}
                onClick={() => setSelectedCefr(lvl)}
              >
                {lvl === 'ALL' ? 'Tümü' : lvl}
              </button>
            ))}
          </div>

          <div className="ln-hb-chapter-list">
            {filteredStories.map((st) => {
              const done = profile.completedStories.includes(st.id);
              return (
                <button
                  key={st.id}
                  type="button"
                  className={`ln-hb-chapter-btn ${st.id === activeStory.id ? 'is-active' : ''}`}
                  onClick={() => handleSelectStory(st.id)}
                >
                  <div className="ln-hb-chapter-meta">
                    <span>Seviye {st.cefr}</span>
                    <span>{done ? 'Tamamlandı' : `${st.readingMinutes} dk`}</span>
                  </div>
                  <strong>{st.titleTr}</strong>
                </button>
              );
            })}
          </div>
        </aside>

        <article className="ln-handbook-article">
          <header className="ln-hb-article-head">
            <div className="ln-hb-kicker">
              <BookOpen size={14} strokeWidth={1.75} aria-hidden="true" />
              <span>
                Seviye {activeStory.cefr} · {languageNameTr} Okuma ve Dinleme ·{' '}
                {activeStory.readingMinutes} dk
                {isCompleted ? ' · Tamamlandı' : ''}
              </span>
            </div>
            <h1 id="ln-gs-heading">{activeStory.titleTarget[profile.targetLang]}</h1>
            <p className="ln-hb-lead">
              <strong>{activeStory.titleTr}:</strong> {activeStory.summaryTr}
            </p>

            <div className="ln-gs-audio-bar">
              <button
                type="button"
                className="ln-hb-audio-btn"
                onClick={handlePlayEntireStory}
              >
                {isPlayingAll ? (
                  <>
                    <Square size={14} strokeWidth={1.75} aria-hidden="true" />
                    <span>Okumayı Durdur</span>
                  </>
                ) : (
                  <>
                    <Play size={14} strokeWidth={1.75} aria-hidden="true" />
                    <span>Tüm Hikayeyi Ana Dili Sesinden Dinle</span>
                  </>
                )}
              </button>
            </div>
          </header>

          <section className="ln-gs-paragraphs" aria-label="Hikaye metni">
            {activeStory.paragraphs.map((p, idx) => {
              const targetLine = p.text[profile.targetLang];
              return (
                <div key={idx} className="ln-gs-para-row">
                  <div className="ln-gs-para-text">
                    <p className="ln-gs-target-p">{targetLine}</p>
                    {showTurkish && <p className="ln-gs-tr-p">{p.turkish}</p>}
                  </div>
                  <button
                    type="button"
                    className="ln-hb-back-btn ln-gs-listen-btn"
                    onClick={() => handlePlayParagraph(targetLine)}
                    aria-label={`${idx + 1}. paragrafı dinle`}
                  >
                    <Volume2 size={15} strokeWidth={1.75} aria-hidden="true" />
                  </button>
                </div>
              );
            })}
          </section>

          <section className="ln-hb-section" aria-label="Hikayedeki önemli kelimeler">
            <h2>Hikayede Geçen Önemli Kelimeler ve Kalıplar</h2>
            <div className="ln-gs-vocab-grid">
              {activeStory.vocabNotes.map((vn, i) => {
                const term = vn.term[profile.targetLang];
                return (
                  <button
                    key={i}
                    type="button"
                    className="ln-gs-vocab-chip"
                    onClick={() => handlePlayParagraph(term)}
                  >
                    <div>
                      <strong>{term}</strong>
                      <span>{vn.meaningTr}</span>
                    </div>
                    <Volume2 size={14} strokeWidth={1.75} aria-hidden="true" />
                  </button>
                );
              })}
            </div>
          </section>

          <section className="ln-hb-section" aria-label="Okuduğunu anlama soruları">
            <h2>Okuduğunu Anlama Soruları</h2>
            <div className="ln-hb-comp-stack">
              {activeStory.questions.map((q, qIdx) => {
                const picked = answers[qIdx];
                return (
                  <div key={qIdx} className="ln-hb-comp-card">
                    <strong>
                      {qIdx + 1}. {q.questionTarget[profile.targetLang]}
                    </strong>
                    <span className="ln-vb-ex-tr">{q.questionTr}</span>

                    <div className="ln-gs-q-opts">
                      {q.options.map((opt, oIdx) => {
                        let cls = '';
                        if (picked !== undefined) {
                          if (opt.isCorrect) cls = 'is-correct';
                          else if (picked === oIdx) cls = 'is-wrong';
                        }
                        return (
                          <button
                            key={oIdx}
                            type="button"
                            className={`ln-vb-quiz-opt ${cls}`}
                            onClick={() => handlePickAnswer(qIdx, oIdx)}
                          >
                            <span>{opt.text[profile.targetLang]}</span>
                            {showTurkish && <small>{opt.turkish}</small>}
                            {picked !== undefined && opt.isCorrect && (
                              <Check size={15} strokeWidth={2.2} aria-hidden="true" />
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        </article>
      </div>
    </section>
  );
}
