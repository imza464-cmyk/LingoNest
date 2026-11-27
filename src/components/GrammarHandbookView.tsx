import { useMemo, useState } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  Check,
  MessageSquare,
  Search,
  Volume2,
} from 'lucide-react';
import type { LanguageCode, LearnerProfile } from '../types';
import { GRAMMAR_HANDBOOK_CHAPTERS } from '../data/grammarHandbook';
import { audioEngine } from '../engine/audioEngine';
import { askContrastiveCoach } from '../engine/cloudSync';

export interface GrammarHandbookViewProps {
  profile: LearnerProfile;
  languageNameTr: string;
  initialChapterId?: string;
  onChapterSelect?: (chapterId: string) => void;
  onBack: () => void;
}

const LANG_LABELS: Record<LanguageCode, string> = {
  en: 'İngilizce',
  de: 'Almanca',
  es: 'İspanyolca',
};

export function GrammarHandbookView({
  profile,
  languageNameTr,
  initialChapterId,
  onChapterSelect,
  onBack,
}: GrammarHandbookViewProps) {
  const [selectedId, setSelectedId] = useState<string>(() => {
    if (
      initialChapterId &&
      GRAMMAR_HANDBOOK_CHAPTERS.some((c) => c.id === initialChapterId)
    ) {
      return initialChapterId;
    }
    return GRAMMAR_HANDBOOK_CHAPTERS[0]?.id ?? '';
  });
  const [selectedCefr, setSelectedCefr] = useState<'ALL' | 'A1' | 'A2' | 'B1' | 'B2'>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [showAllLangs, setShowAllLangs] = useState<boolean>(false);
  const [practicePicks, setPracticePicks] = useState<Record<string, number>>({});
  const [coachQuestion, setCoachQuestion] = useState<string>('');
  const [coachReply, setCoachReply] = useState<string>('');
  const [coachBusy, setCoachBusy] = useState<boolean>(false);

  const filteredChapters = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return GRAMMAR_HANDBOOK_CHAPTERS.filter((c) => {
      if (selectedCefr !== 'ALL' && c.cefr !== selectedCefr) return false;
      if (!q) return true;
      return (
        c.titleTr.toLowerCase().includes(q) ||
        c.subtitleTr.toLowerCase().includes(q) ||
        c.cefr.toLowerCase().includes(q)
      );
    });
  }, [searchQuery, selectedCefr]);

  const activeIdx = Math.max(
    0,
    GRAMMAR_HANDBOOK_CHAPTERS.findIndex((c) => c.id === selectedId),
  );
  const chapter = GRAMMAR_HANDBOOK_CHAPTERS[activeIdx] ?? GRAMMAR_HANDBOOK_CHAPTERS[0];
  const prevChapter = activeIdx > 0 ? GRAMMAR_HANDBOOK_CHAPTERS[activeIdx - 1] : null;
  const nextChapter =
    activeIdx + 1 < GRAMMAR_HANDBOOK_CHAPTERS.length
      ? GRAMMAR_HANDBOOK_CHAPTERS[activeIdx + 1]
      : null;

  const visibleLangs: LanguageCode[] = showAllLangs
    ? ['en', 'de', 'es']
    : [profile.targetLang];

  const handleSelectChapter = (id: string) => {
    setSelectedId(id);
    setCoachReply('');
    setPracticePicks({});
    onChapterSelect?.(id);
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleSpeakExample = (lang: LanguageCode, text: string) => {
    audioEngine.speak(text, lang, {
      slow: profile.speechSlowMode,
      role: 'adult',
    });
  };

  const handleAskCoach = async (e: React.FormEvent) => {
    e.preventDefault();
    if (coachBusy || !chapter) return;
    const comp = chapter.langComparisons[profile.targetLang];
    setCoachBusy(true);
    try {
      const reply = await askContrastiveCoach({
        targetLang: profile.targetLang,
        phrase: comp.naturalForm,
        question:
          coachQuestion.trim() ||
          `${chapter.titleTr} konusunda Türkçe düşünürken yapılan hatayı sade örneklerle açıklar mısın?`,
        turkishTrapTr: comp.structuralWhyTr,
      });
      setCoachReply(reply);
    } finally {
      setCoachBusy(false);
    }
  };

  if (!chapter) return null;

  const chapterQuestions = chapter.practiceQuestions?.[profile.targetLang] ?? [];

  return (
    <section className="ln-handbook-shell" aria-labelledby="ln-hb-heading">
      <div className="ln-handbook-topbar">
        <button type="button" className="ln-hb-back-btn" onClick={onBack}>
          <ArrowLeft size={16} strokeWidth={1.75} aria-hidden="true" />
          <span>Geri Dön</span>
        </button>

        <div className="ln-hb-lang-toggle">
          <button
            type="button"
            className={`ln-hb-pill ${!showAllLangs ? 'is-active' : ''}`}
            onClick={() => setShowAllLangs(false)}
          >
            <span>Yalnızca {languageNameTr}</span>
          </button>
          <button
            type="button"
            className={`ln-hb-pill ${showAllLangs ? 'is-active' : ''}`}
            onClick={() => setShowAllLangs(true)}
          >
            <span>3 Dili Karşılaştır (EN · DE · ES)</span>
          </button>
        </div>
      </div>

      <div className="ln-handbook-grid">
        <aside className="ln-handbook-rail" aria-label="Dilbilgisi dersleri">
          <div className="ln-hb-rail-head">
            <strong>Adım Adım Dilbilgisi (A1–B2)</strong>
            <span>{GRAMMAR_HANDBOOK_CHAPTERS.length} Konu Anlatımı ve Alıştırma</span>
          </div>

          <div className="ln-hb-search-box">
            <Search size={14} strokeWidth={1.75} aria-hidden="true" />
            <label htmlFor="ln-hb-search-input" className="ln-sr-only">
              Dilbilgisi konularında ara
            </label>
            <input
              id="ln-hb-search-input"
              type="search"
              placeholder="Konu veya seviye ara..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="ln-vb-cefr-bar" role="group" aria-label="Seviye filtresi">
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
            {filteredChapters.map((ch) => {
              const active = ch.id === chapter.id;
              return (
                <button
                  key={ch.id}
                  type="button"
                  className={`ln-hb-chapter-btn ${active ? 'is-active' : ''}`}
                  onClick={() => handleSelectChapter(ch.id)}
                >
                  <div className="ln-hb-chapter-meta">
                    <span>
                      Ders {String(ch.order).padStart(2, '0')} · {ch.cefr}
                    </span>
                    <span>{ch.readingMinutes} dk</span>
                  </div>
                  <strong>{ch.titleTr}</strong>
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
                Ders {String(chapter.order).padStart(2, '0')} /{' '}
                {GRAMMAR_HANDBOOK_CHAPTERS.length} · Seviye {chapter.cefr} ·{' '}
                {chapter.readingMinutes} dk okuma
              </span>
            </div>
            <h1 id="ln-hb-heading">{chapter.titleTr}</h1>
            <p className="ln-hb-lead">{chapter.subtitleTr}</p>
            <div className="ln-hb-mental-box">
              <strong>Konunun Özü:</strong> {chapter.mentalModelTr}
            </div>
          </header>

          {chapter.sections.map((sec, idx) => (
            <section key={idx} className="ln-hb-section">
              <h2>{sec.heading}</h2>
              {sec.paragraphs.map((p, pIdx) => (
                <p key={pIdx}>{p}</p>
              ))}
              {sec.formulaAscii && (
                <pre className="ln-hb-formula">
                  <code>{sec.formulaAscii}</code>
                </pre>
              )}
            </section>
          ))}

          {chapter.referenceTables && (
            <section className="ln-hb-section" aria-label="Çekim ve yapı tablosu">
              <h2>Çekim ve Yapı Tablosu</h2>
              <div className="ln-hb-comp-stack">
                {visibleLangs.map((lang) => {
                  const tbl = chapter.referenceTables?.[lang];
                  if (!tbl) return null;
                  return (
                    <div key={lang} className="ln-hb-table-wrap">
                      <div className="ln-hb-table-caption">
                        <strong>
                          {LANG_LABELS[lang]} — {tbl.captionTr}
                        </strong>
                      </div>
                      <table className="ln-hb-table">
                        <thead>
                          <tr>
                            {tbl.headers.map((h, hIdx) => (
                              <th key={hIdx}>{h}</th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {tbl.rows.map((row, rIdx) => (
                            <tr key={rIdx}>
                              {row.map((cell, cIdx) => (
                                <td key={cIdx}>{cell}</td>
                              ))}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  );
                })}
              </div>
            </section>
          )}

          <section
            className="ln-hb-section"
            aria-label="Yanlış çeviri ve doğal kullanım karşılaştırması"
          >
            <h2>Türkçeden Birebir Çeviri Hatası ve Doğal Kullanım</h2>
            <div className="ln-hb-comp-stack">
              {visibleLangs.map((lang) => {
                const comp = chapter.langComparisons[lang];
                return (
                  <div key={lang} className="ln-hb-comp-card">
                    <div className="ln-hb-comp-top">
                      <strong>{LANG_LABELS[lang]}</strong>
                      <button
                        type="button"
                        className="ln-hb-audio-btn"
                        onClick={() => handleSpeakExample(lang, comp.naturalForm)}
                      >
                        <Volume2 size={14} strokeWidth={1.75} aria-hidden="true" />
                        <span>Doğru Cümleyi Dinle</span>
                      </button>
                    </div>

                    <div className="ln-hb-comp-cols">
                      <div className="ln-hb-bad-box">
                        <span className="ln-hb-box-tag">Yapılmaması Gereken Çeviri</span>
                        <p>{comp.wrongCalque}</p>
                      </div>
                      <div className="ln-hb-good-box">
                        <span className="ln-hb-box-tag">Doğal Kullanım</span>
                        <p className="ln-hb-natural-line">{comp.naturalForm}</p>
                        <code className="ln-hb-ipa">{comp.ipa}</code>
                      </div>
                    </div>

                    <p className="ln-hb-why">
                      <strong>Anlamı:</strong> "{comp.turkishMeaning}" — {comp.structuralWhyTr}
                    </p>
                  </div>
                );
              })}
            </div>
          </section>

          <section className="ln-hb-cheatsheet">
            <div className="ln-hb-cs-col">
              <h3>Temel Kurallar Özeti</h3>
              <ul>
                {chapter.rulesSummary.map((r, i) => (
                  <li key={i}>
                    <Check size={14} strokeWidth={2} aria-hidden="true" />
                    <span>{r}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="ln-hb-cs-col">
              <h3>Sık Yapılan Hatalar</h3>
              <ul className="ln-hb-trap-list">
                {chapter.turkishTraps.map((t, i) => (
                  <li key={i}>{t}</li>
                ))}
              </ul>
            </div>
          </section>

          {chapterQuestions.length > 0 && (
            <section className="ln-hb-section" aria-label="Konu pekiştirme alıştırması">
              <h2>Kendini Dene ({languageNameTr})</h2>
              <div className="ln-hb-comp-stack">
                {chapterQuestions.map((q, qIdx) => {
                  const key = `${chapter.id}:${profile.targetLang}:${qIdx}`;
                  const picked = practicePicks[key];
                  return (
                    <div key={key} className="ln-hb-comp-card">
                      <span className="ln-vb-ex-tr">{q.promptTr}</span>
                      <strong className="ln-hb-blank-sentence">{q.sentenceWithBlank}</strong>
                      <div className="ln-gs-q-opts">
                        {q.options.map((opt, oIdx) => {
                          let cls = '';
                          if (picked !== undefined) {
                            if (oIdx === q.correctIndex) cls = 'is-correct';
                            else if (picked === oIdx) cls = 'is-wrong';
                          }
                          return (
                            <button
                              key={oIdx}
                              type="button"
                              className={`ln-vb-quiz-opt ${cls}`}
                              onClick={() =>
                                setPracticePicks((prev) => ({ ...prev, [key]: oIdx }))
                              }
                            >
                              <strong>{opt}</strong>
                            </button>
                          );
                        })}
                      </div>
                      {picked !== undefined && (
                        <p className="ln-hb-why">{q.explanationTr}</p>
                      )}
                    </div>
                  );
                })}
              </div>
            </section>
          )}

          <section className="ln-hb-coach-box" aria-labelledby="ln-hb-coach-title">
            <div className="ln-hb-coach-head">
              <MessageSquare size={16} strokeWidth={1.75} aria-hidden="true" />
              <h3 id="ln-hb-coach-title">Bu Konu Hakkında Eğitmene Sor ({languageNameTr})</h3>
            </div>
            <form className="ln-hb-coach-form" onSubmit={handleAskCoach}>
              <label htmlFor="ln-hb-coach-input" className="ln-sr-only">
                Sorunuzu yazın
              </label>
              <input
                id="ln-hb-coach-input"
                type="text"
                placeholder="Örn: Kurduğum şu cümle doğru mu: ..."
                value={coachQuestion}
                onChange={(e) => setCoachQuestion(e.target.value)}
              />
              <button type="submit" disabled={coachBusy}>
                {coachBusy ? 'Yanıtlanıyor...' : 'Sor'}
              </button>
            </form>
            {coachReply && <div className="ln-hb-coach-reply">{coachReply}</div>}
          </section>

          <nav className="ln-hb-pager" aria-label="Ders geçişi">
            {prevChapter ? (
              <button
                type="button"
                className="ln-hb-back-btn"
                onClick={() => handleSelectChapter(prevChapter.id)}
              >
                <ArrowLeft size={14} strokeWidth={1.75} aria-hidden="true" />
                <span>Önceki Ders</span>
              </button>
            ) : (
              <span />
            )}
            {nextChapter && (
              <button
                type="button"
                className="ln-hb-back-btn"
                onClick={() => handleSelectChapter(nextChapter.id)}
              >
                <span>Sonraki Ders</span>
                <ArrowRight size={14} strokeWidth={1.75} aria-hidden="true" />
              </button>
            )}
          </nav>
        </article>
      </div>
    </section>
  );
}
