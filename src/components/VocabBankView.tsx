import { useMemo, useRef, useState } from 'react';
import {
  ArrowLeft,
  BookOpen,
  Check,
  Layers,
  RotateCcw,
  Search,
  Volume2,
} from 'lucide-react';
import type { FSRSGrade, LanguageCode, LearnerProfile } from '../types';
import {
  ALL_VOCAB_BANK,
  VOCAB_CATEGORIES,
  type VocabBankEntry,
  type VocabCefr,
} from '../data/vocabBank';
import { audioEngine } from '../engine/audioEngine';
import { cardKey, isItemAwakeInLivingWorld } from '../engine/fsrs5';

export interface VocabBankViewProps {
  profile: LearnerProfile;
  languageNameTr: string;
  onRecordReview: (
    itemId: string,
    grade: FSRSGrade,
    speakingDone: boolean,
    elapsedSec: number,
  ) => void;
  onBack: () => void;
}

const LANG_NAMES: Record<LanguageCode, string> = {
  en: 'İngilizce',
  de: 'Almanca',
  es: 'İspanyolca',
};

function deterministicChoices(
  target: VocabBankEntry,
  pool: VocabBankEntry[],
  seed: number,
): VocabBankEntry[] {
  const samePos = pool.filter((e) => e.id !== target.id && e.posTr === target.posTr);
  const source = samePos.length >= 3 ? samePos : pool.filter((e) => e.id !== target.id);
  const picked: VocabBankEntry[] = [];
  let cursor = Math.abs(seed);
  while (picked.length < 3 && source.length > picked.length) {
    const candidate = source[cursor % source.length];
    if (!picked.some((p) => p.id === candidate.id)) {
      picked.push(candidate);
    }
    cursor += 7;
  }
  const all = [target, ...picked];
  // Deterministic rotation based on seed + id length
  const shift = (seed + target.id.length) % all.length;
  return [...all.slice(shift), ...all.slice(0, shift)];
}

export function VocabBankView({
  profile,
  languageNameTr,
  onRecordReview,
  onBack,
}: VocabBankViewProps) {
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>('all');
  const [selectedCefr, setSelectedCefr] = useState<'ALL' | VocabCefr>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [compareAllLangs, setCompareAllLangs] = useState<boolean>(false);
  const [mode, setMode] = useState<'browse' | 'quiz'>('browse');

  // Quiz state
  const [quizIdx, setQuizIdx] = useState<number>(0);
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const questionStartRef = useRef<number>(Date.now());

  const filteredEntries = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return ALL_VOCAB_BANK.filter((entry) => {
      if (selectedCategoryId !== 'all' && entry.categoryId !== selectedCategoryId) {
        return false;
      }
      if (selectedCefr !== 'ALL' && entry.cefr !== selectedCefr) {
        return false;
      }
      if (!q) return true;
      return (
        entry.turkish.toLowerCase().includes(q) ||
        entry.langs.en.word.toLowerCase().includes(q) ||
        entry.langs.de.word.toLowerCase().includes(q) ||
        entry.langs.es.word.toLowerCase().includes(q) ||
        entry.exampleTr.toLowerCase().includes(q)
      );
    });
  }, [searchQuery, selectedCategoryId, selectedCefr]);

  const learnedCount = useMemo(() => {
    let n = 0;
    for (const entry of ALL_VOCAB_BANK) {
      const card = profile.cards[cardKey(profile.targetLang, entry.id)];
      if (isItemAwakeInLivingWorld(card)) n++;
    }
    return n;
  }, [profile.cards, profile.targetLang]);

  const speakPhrase = (lang: LanguageCode, text: string) => {
    audioEngine.speak(text, lang, {
      slow: profile.speechSlowMode,
      role: 'adult',
    });
  };

  const quizPool = filteredEntries.length >= 4 ? filteredEntries : ALL_VOCAB_BANK;
  const activeQuizEntry = quizPool[quizIdx % Math.max(1, quizPool.length)];
  const quizChoices = useMemo(() => {
    if (!activeQuizEntry) return [];
    return deterministicChoices(activeQuizEntry, quizPool, quizIdx + 3);
  }, [activeQuizEntry, quizIdx, quizPool]);

  const handleSelectQuizOption = (choice: VocabBankEntry) => {
    if (!activeQuizEntry || selectedOptionId !== null) return;
    setSelectedOptionId(choice.id);
    const isCorrect = choice.id === activeQuizEntry.id;
    const elapsedSec = Math.max(1, (Date.now() - questionStartRef.current) / 1000);
    onRecordReview(activeQuizEntry.id, isCorrect ? 3 : 1, false, elapsedSec);
    speakPhrase(profile.targetLang, activeQuizEntry.langs[profile.targetLang].word);
  };

  const handleNextQuiz = () => {
    setSelectedOptionId(null);
    setQuizIdx((prev) => prev + 1);
    questionStartRef.current = Date.now();
  };

  const visibleLangs: LanguageCode[] = compareAllLangs
    ? ['en', 'de', 'es']
    : [profile.targetLang];

  return (
    <section className="ln-handbook-shell" aria-labelledby="ln-vb-heading">
      <div className="ln-handbook-topbar">
        <button type="button" className="ln-hb-back-btn" onClick={onBack}>
          <ArrowLeft size={16} strokeWidth={1.75} aria-hidden="true" />
          <span>Geri Dön</span>
        </button>

        <div className="ln-hb-lang-toggle" role="tablist" aria-label="Çalışma modu">
          <button
            type="button"
            className={`ln-hb-pill ${mode === 'browse' ? 'is-active' : ''}`}
            onClick={() => setMode('browse')}
          >
            <span>Sözlük ve Örnek Cümleler ({ALL_VOCAB_BANK.length} Kelime)</span>
          </button>
          <button
            type="button"
            className={`ln-hb-pill ${mode === 'quiz' ? 'is-active' : ''}`}
            onClick={() => {
              setSelectedOptionId(null);
              questionStartRef.current = Date.now();
              setMode('quiz');
            }}
          >
            <span>Kelime Alıştırması</span>
          </button>
        </div>

        {mode === 'browse' && (
          <div className="ln-hb-lang-toggle">
            <button
              type="button"
              className={`ln-hb-pill ${!compareAllLangs ? 'is-active' : ''}`}
              onClick={() => setCompareAllLangs(false)}
            >
              <span>{languageNameTr}</span>
            </button>
            <button
              type="button"
              className={`ln-hb-pill ${compareAllLangs ? 'is-active' : ''}`}
              onClick={() => setCompareAllLangs(true)}
            >
              <span>3 Dili Karşılaştır</span>
            </button>
          </div>
        )}
      </div>

      <div className="ln-handbook-grid">
        <aside className="ln-handbook-rail" aria-label="Kelime kategorileri">
          <div className="ln-hb-rail-head">
            <strong>Kelime Hazinesi (A1–B2)</strong>
            <span>
              {learnedCount} / {ALL_VOCAB_BANK.length} öğrenildi
            </span>
          </div>

          <div className="ln-hb-search-box">
            <Search size={14} strokeWidth={1.75} aria-hidden="true" />
            <label htmlFor="ln-vb-search" className="ln-sr-only">
              Kelime veya anlam ara
            </label>
            <input
              id="ln-vb-search"
              type="search"
              placeholder="Türkçe veya yabancı kelime ara..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setQuizIdx(0);
              }}
            />
          </div>

          <div className="ln-vb-cefr-bar" role="group" aria-label="Seviye filtresi">
            {(['ALL', 'A1', 'A2', 'B1', 'B2'] as const).map((lvl) => (
              <button
                key={lvl}
                type="button"
                className={`ln-vb-cefr-chip ${selectedCefr === lvl ? 'is-active' : ''}`}
                onClick={() => {
                  setSelectedCefr(lvl);
                  setQuizIdx(0);
                }}
              >
                {lvl === 'ALL' ? 'Tümü' : lvl}
              </button>
            ))}
          </div>

          <div className="ln-hb-chapter-list">
            <button
              type="button"
              className={`ln-hb-chapter-btn ${selectedCategoryId === 'all' ? 'is-active' : ''}`}
              onClick={() => {
                setSelectedCategoryId('all');
                setQuizIdx(0);
              }}
            >
              <div className="ln-hb-chapter-meta">
                <span>A1–B2</span>
                <span>{ALL_VOCAB_BANK.length} kelime</span>
              </div>
              <strong>Tüm Konu Başlıkları</strong>
            </button>

            {VOCAB_CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                type="button"
                className={`ln-hb-chapter-btn ${selectedCategoryId === cat.id ? 'is-active' : ''}`}
                onClick={() => {
                  setSelectedCategoryId(cat.id);
                  setQuizIdx(0);
                }}
              >
                <div className="ln-hb-chapter-meta">
                  <span>Bölüm {String(cat.order).padStart(2, '0')}</span>
                  <span>{cat.entries.length} kelime</span>
                </div>
                <strong>{cat.titleTr}</strong>
              </button>
            ))}
          </div>
        </aside>

        <div className="ln-handbook-article">
          <header className="ln-hb-article-head">
            <div className="ln-hb-kicker">
              <Layers size={14} strokeWidth={1.75} aria-hidden="true" />
              <span>
                Günlük Hayatta En Sık Kullanılan Kelimeler · {filteredEntries.length} kayıt gösteriliyor
              </span>
            </div>
            <h1 id="ln-vb-heading">
              {selectedCategoryId === 'all'
                ? 'Temel ve Orta Seviye Kelime Hazinesi'
                : VOCAB_CATEGORIES.find((c) => c.id === selectedCategoryId)?.titleTr}
            </h1>
            <p className="ln-hb-lead">
              {selectedCategoryId === 'all'
                ? 'Her kelimenin doğru telaffuzunu, tanımlığını (der/die/das, el/la) ve gerçek hayatta kurulan doğal örnek cümlesini dinleyerek çalışın.'
                : VOCAB_CATEGORIES.find((c) => c.id === selectedCategoryId)?.subtitleTr}
            </p>
          </header>

          {mode === 'browse' ? (
            <div className="ln-vb-card-list">
              {filteredEntries.length === 0 ? (
                <p className="ln-hb-lead">Aramanızla eşleşen kelime bulunamadı.</p>
              ) : (
                filteredEntries.map((entry) => {
                  const isLearned = isItemAwakeInLivingWorld(
                    profile.cards[cardKey(profile.targetLang, entry.id)],
                  );
                  return (
                    <article key={entry.id} className="ln-vb-entry-card">
                      <div className="ln-vb-entry-top">
                        <div className="ln-vb-tr-block">
                          <strong>{entry.turkish}</strong>
                          <span className="ln-vb-meta-tag">{entry.posTr}</span>
                          <span className="ln-vb-meta-tag">{entry.cefr}</span>
                          {isLearned && (
                            <span className="ln-vb-learned-tag">
                              <Check size={12} strokeWidth={2.2} aria-hidden="true" />
                              Öğrenildi
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="ln-vb-lang-rows">
                        {visibleLangs.map((lang) => {
                          const loc = entry.langs[lang];
                          return (
                            <div key={lang} className="ln-vb-lang-box">
                              <div className="ln-vb-word-row">
                                <div className="ln-vb-word-main">
                                  {compareAllLangs && (
                                    <span className="ln-vb-lang-code">{LANG_NAMES[lang]}</span>
                                  )}
                                  <strong className="ln-vb-target-word">{loc.word}</strong>
                                  <code className="ln-hb-ipa">{loc.ipa}</code>
                                  {loc.formNote && (
                                    <span className="ln-vb-form-note">{loc.formNote}</span>
                                  )}
                                </div>
                                <button
                                  type="button"
                                  className="ln-hb-audio-btn"
                                  onClick={() => speakPhrase(lang, loc.word)}
                                >
                                  <Volume2 size={14} strokeWidth={1.75} aria-hidden="true" />
                                  <span>Kelimeyi Dinle</span>
                                </button>
                              </div>

                              <div className="ln-vb-example-row">
                                <div className="ln-vb-example-texts">
                                  <p className="ln-vb-ex-target">{loc.example}</p>
                                  <p className="ln-vb-ex-tr">{entry.exampleTr}</p>
                                </div>
                                <button
                                  type="button"
                                  className="ln-hb-back-btn"
                                  onClick={() => speakPhrase(lang, loc.example)}
                                >
                                  <Volume2 size={14} strokeWidth={1.75} aria-hidden="true" />
                                  <span>Cümleyi Dinle</span>
                                </button>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </article>
                  );
                })
              )}
            </div>
          ) : activeQuizEntry ? (
            <div className="ln-vb-quiz-card">
              <div className="ln-vb-quiz-head">
                <span>
                  Soru {(quizIdx % quizPool.length) + 1} / {quizPool.length} · Seviye{' '}
                  {activeQuizEntry.cefr} · {activeQuizEntry.posTr}
                </span>
                <button
                  type="button"
                  className="ln-hb-back-btn"
                  onClick={() => {
                    setSelectedOptionId(null);
                    setQuizIdx(0);
                  }}
                >
                  <RotateCcw size={14} strokeWidth={1.75} aria-hidden="true" />
                  <span>Baştan Başla</span>
                </button>
              </div>

              <div className="ln-vb-quiz-prompt">
                <span>Bu kavramın {languageNameTr} karşılığı hangisidir?</span>
                <h2>{activeQuizEntry.turkish}</h2>
                <p>Örnek bağlam: "{activeQuizEntry.exampleTr}"</p>
              </div>

              <div className="ln-vb-quiz-options">
                {quizChoices.map((ch) => {
                  const loc = ch.langs[profile.targetLang];
                  const isPicked = selectedOptionId === ch.id;
                  const isRight = ch.id === activeQuizEntry.id;
                  let stateClass = '';
                  if (selectedOptionId !== null) {
                    if (isRight) stateClass = 'is-correct';
                    else if (isPicked) stateClass = 'is-wrong';
                  }
                  return (
                    <button
                      key={ch.id}
                      type="button"
                      className={`ln-vb-quiz-opt ${stateClass}`}
                      onClick={() => handleSelectQuizOption(ch)}
                      disabled={selectedOptionId !== null}
                    >
                      <strong>{loc.word}</strong>
                      <code className="ln-hb-ipa">{loc.ipa}</code>
                    </button>
                  );
                })}
              </div>

              {selectedOptionId !== null && (
                <div className="ln-vb-quiz-feedback">
                  <div>
                    <strong>
                      Doğru İfade: {activeQuizEntry.langs[profile.targetLang].word}
                    </strong>
                    <p>{activeQuizEntry.langs[profile.targetLang].example}</p>
                    <small>{activeQuizEntry.exampleTr}</small>
                  </div>
                  <div className="ln-vb-quiz-actions">
                    <button
                      type="button"
                      className="ln-hb-audio-btn"
                      onClick={() =>
                        speakPhrase(
                          profile.targetLang,
                          activeQuizEntry.langs[profile.targetLang].example,
                        )
                      }
                    >
                      <Volume2 size={14} strokeWidth={1.75} aria-hidden="true" />
                      <span>Örnek Cümleyi Dinle</span>
                    </button>
                    <button
                      type="button"
                      className="ln-hb-back-btn"
                      onClick={handleNextQuiz}
                    >
                      <BookOpen size={14} strokeWidth={1.75} aria-hidden="true" />
                      <span>Sonraki Kelime</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
}
