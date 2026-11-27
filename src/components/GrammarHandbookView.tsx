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
    return GRAMMAR_HANDBOOK_CHAPTERS[0].id;
  });
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [showAllLangs, setShowAllLangs] = useState<boolean>(false);
  const [coachQuestion, setCoachQuestion] = useState<string>('');
  const [coachReply, setCoachReply] = useState<string>('');
  const [coachBusy, setCoachBusy] = useState<boolean>(false);

  const filteredChapters = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return GRAMMAR_HANDBOOK_CHAPTERS;
    return GRAMMAR_HANDBOOK_CHAPTERS.filter(
      (c) =>
        c.titleTr.toLowerCase().includes(q) ||
        c.subtitleTr.toLowerCase().includes(q) ||
        c.cefr.toLowerCase().includes(q),
    );
  }, [searchQuery]);

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
    if (coachBusy) return;
    const comp = chapter.langComparisons[profile.targetLang];
    setCoachBusy(true);
    try {
      const reply = await askContrastiveCoach({
        targetLang: profile.targetLang,
        phrase: comp.naturalForm,
        question:
          coachQuestion.trim() ||
          `${chapter.titleTr} konusunda Türkçe düşünürken yapılan hatayı örnekleyerek açıklar mısın?`,
        turkishTrapTr: comp.structuralWhyTr,
      });
      setCoachReply(reply);
    } finally {
      setCoachBusy(false);
    }
  };

  return (
    <section className="ln-handbook-shell" aria-labelledby="ln-hb-heading">
      <div className="ln-handbook-topbar">
        <button type="button" className="ln-hb-back-btn" onClick={onBack}>
          <ArrowLeft size={16} strokeWidth={1.75} aria-hidden="true" />
          <span>Çalışma Masasına Dön</span>
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
        <aside className="ln-handbook-rail" aria-label="Dilbilgisi rehberi bölümleri">
          <div className="ln-hb-rail-head">
            <strong>Dilbilgisi ve Kalıp Rehberi</strong>
            <span>{GRAMMAR_HANDBOOK_CHAPTERS.length} Karşılaştırmalı Bölüm</span>
          </div>

          <div className="ln-hb-search-box">
            <Search size={14} strokeWidth={1.75} aria-hidden="true" />
            <label htmlFor="ln-hb-search-input" className="ln-sr-only">
              Rehber bölümlerinde ara
            </label>
            <input
              id="ln-hb-search-input"
              type="search"
              placeholder="Konu veya seviye ara..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
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
                    <span>{ch.cefr}</span>
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
                Bölüm {String(chapter.order).padStart(2, '0')} /{' '}
                {GRAMMAR_HANDBOOK_CHAPTERS.length} · Seviye {chapter.cefr} ·{' '}
                {chapter.readingMinutes} dk okuma
              </span>
            </div>
            <h1 id="ln-hb-heading">{chapter.titleTr}</h1>
            <p className="ln-hb-lead">{chapter.subtitleTr}</p>
            <div className="ln-hb-mental-box">
              <strong>Temel Mantık:</strong> {chapter.mentalModelTr}
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

          <section className="ln-hb-section" aria-label="Yanlış çeviri ve doğal kullanım karşılaştırması">
            <h2>Türkçe Düşünüp Yanlış Kurulan Cümle vs Doğal Kullanım</h2>
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
                        <span>Doğal Cümleyi Dinle</span>
                      </button>
                    </div>

                    <div className="ln-hb-comp-cols">
                      <div className="ln-hb-bad-box">
                        <span className="ln-hb-box-tag">Kaçınılacak Birebir Çeviri</span>
                        <p>{comp.wrongCalque}</p>
                      </div>
                      <div className="ln-hb-good-box">
                        <span className="ln-hb-box-tag">Doğal Ana Dili Kullanımı</span>
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
              <h3>Unutulmaması Gereken Kurallar</h3>
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
              <h3>Sık Düşülen Türkçe Tuzakları</h3>
              <ul className="ln-hb-trap-list">
                {chapter.turkishTraps.map((t, i) => (
                  <li key={i}>{t}</li>
                ))}
              </ul>
            </div>
          </section>

          <section className="ln-hb-coach-box" aria-labelledby="ln-hb-coach-title">
            <div className="ln-hb-coach-head">
              <MessageSquare size={16} strokeWidth={1.75} aria-hidden="true" />
              <h3 id="ln-hb-coach-title">Dil Eğitmenine Sor ({languageNameTr})</h3>
            </div>
            <form className="ln-hb-coach-form" onSubmit={handleAskCoach}>
              <label htmlFor="ln-hb-coach-input" className="ln-sr-only">
                Bu konu hakkında eğitmene sorunuzu yazın
              </label>
              <input
                id="ln-hb-coach-input"
                type="text"
                placeholder="Örn: Kendi kurduğum şu cümle doğal mı: ..."
                value={coachQuestion}
                onChange={(e) => setCoachQuestion(e.target.value)}
              />
              <button type="submit" disabled={coachBusy}>
                {coachBusy ? 'Yanıtlanıyor...' : 'Sor'}
              </button>
            </form>
            {coachReply && <div className="ln-hb-coach-reply">{coachReply}</div>}
          </section>

          <nav className="ln-hb-pager" aria-label="Bölüm geçişi">
            {prevChapter ? (
              <button
                type="button"
                className="ln-hb-back-btn"
                onClick={() => handleSelectChapter(prevChapter.id)}
              >
                <ArrowLeft size={14} strokeWidth={1.75} aria-hidden="true" />
                <span>Önceki Bölüm</span>
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
                <span>Sonraki Bölüm</span>
                <ArrowRight size={14} strokeWidth={1.75} aria-hidden="true" />
              </button>
            )}
          </nav>
        </article>
      </div>
    </section>
  );
}
