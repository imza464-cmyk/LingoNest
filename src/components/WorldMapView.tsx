import { useMemo } from 'react';
import { BookOpen, Clock, Ear, Layers, Play, Sparkles, Star, Trees, Volume2 } from 'lucide-react';
import type { LanguageCode, LearnerProfile, WorldData } from '../types';
import { LANGUAGE_META } from '../data/curriculum';
import { audioEngine } from '../engine/audioEngine';
import { TR_VOICE, TR_WORLD_INTROS } from '../data/voiceScripts';
import {
  MS_PER_DAY,
  cardKey,
  computeRetrievability,
  isItemAwakeInLivingWorld,
} from '../engine/fsrs5';

export interface WorldMapViewProps {
  worlds: WorldData[];
  profile: LearnerProfile;
  languageNameTr: string;
  onSelectLang?: (lang: LanguageCode) => void;
  onStartWorld: (worldId: string) => void;
  onOpenLivingWorld: () => void;
  onOpenStories: () => void;
  onOpenPhonetics: () => void;
  onOpenVocab?: () => void;
  onOpenHandbook?: () => void;
}

interface WorldStats {
  awakeCount: number;
  dueCount: number;
  avgRetrievabilityPct: number | null;
}

export function WorldMapView({
  worlds,
  profile,
  languageNameTr,
  onSelectLang,
  onStartWorld,
  onOpenLivingWorld,
  onOpenStories,
  onOpenPhonetics,
  onOpenVocab,
  onOpenHandbook,
}: WorldMapViewProps) {
  const isMini = profile.ageMode === 'mini';

  const { statsByWorld, totalAwake, totalItems, totalDue, overallRetrievabilityPct } =
    useMemo(() => {
      const nowMs = Date.now();
      const map: Record<string, WorldStats> = {};
      let awakeSum = 0;
      let itemSum = 0;
      let dueSum = 0;
      let rSumAll = 0;
      let rCountAll = 0;

      for (const world of worlds) {
        let awake = 0;
        let due = 0;
        let rSum = 0;
        let rCount = 0;

        for (const item of world.items) {
          itemSum++;
          const card = profile.cards[cardKey(profile.targetLang, item.id)];
          if (isItemAwakeInLivingWorld(card)) {
            awake++;
            awakeSum++;
          }
          if (card && card.reps > 0) {
            if (card.dueAt <= nowMs) {
              due++;
              dueSum++;
            }
            const elapsedDays = Math.max(0, (nowMs - card.lastReviewAt) / MS_PER_DAY);
            const r = computeRetrievability(elapsedDays, card.stability);
            rSum += r;
            rCount++;
            rSumAll += r;
            rCountAll++;
          }
        }

        map[world.id] = {
          awakeCount: awake,
          dueCount: due,
          avgRetrievabilityPct: rCount > 0 ? Math.round((rSum / rCount) * 100) : null,
        };
      }

      return {
        statsByWorld: map,
        totalAwake: awakeSum,
        totalItems: itemSum,
        totalDue: dueSum,
        overallRetrievabilityPct:
          rCountAll > 0 ? Math.round((rSumAll / rCountAll) * 100) : null,
      };
    }, [worlds, profile.cards, profile.targetLang]);

  const handleAudioWelcome = () => {
    audioEngine.playChime('tap', profile.soundFxEnabled);
    audioEngine.speakTurkish(isMini ? TR_VOICE.welcomeMini : TR_VOICE.welcomeExplorer);
  };

  return (
    <section className="ln-world-map">
      {/* Hero Banner */}
      {isMini ? (
        <div className="ln-hero-banner">
          <div style={{ flex: '1 1 100%', marginBottom: '6px' }}>
            <h1 style={{ fontSize: 'clamp(1.25rem, 2.2vw, 1.65rem)' }}>
              LingoNest — {languageNameTr} Öğrenme Adaları
            </h1>
            <p style={{ margin: '4px 0 8px', color: 'var(--ln-ink-soft)', fontWeight: 700 }}>
              İngilizce, Almanca ve İspanyolca: 3.891 stüdyo nöral ses, FSRS-5 aralıklı tekrar ve
              yanlış cevabın puan kaybettirmediği oyunlarla keşfedin.
            </p>
            {onSelectLang && (
              <div className="ln-chip-group" role="group" aria-label="Hedef Dil Seçimi" style={{ marginBottom: '6px' }}>
                {(['en', 'de', 'es'] as const).map((code) => {
                  const meta = LANGUAGE_META[code];
                  const active = profile.targetLang === code;
                  return (
                    <button
                      key={code}
                      type="button"
                      className="ln-chip-btn"
                      aria-pressed={active}
                      onClick={() => onSelectLang(code)}
                      style={
                        active
                          ? { background: '#e0e7ff', borderColor: '#4f46e5', color: '#1e1b4b', fontWeight: 800 }
                          : undefined
                      }
                    >
                      <span>{meta.flag}</span>
                      <span>{meta.nameTr}</span>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
          {worlds[0] && (
            <button
              type="button"
              className="ln-clay-btn ln-clay-btn--mint ln-touch-xl"
              onClick={() => onStartWorld(worlds[0].id)}
            >
              <Play size={24} fill="currentColor" />
              <span>Kayıt Olmadan Hemen Dene</span>
            </button>
          )}
          <button
            type="button"
            className="ln-clay-btn ln-clay-btn--gold ln-touch-xl"
            onClick={handleAudioWelcome}
            aria-label="Sesli karşılama dinle"
          >
            <span style={{ fontSize: '2rem', lineHeight: 1 }} aria-hidden="true">
              🦉
            </span>
            <Volume2 size={28} />
            <span>Dinle &amp; Ada Seç!</span>
          </button>

          <button
            type="button"
            className="ln-clay-btn ln-clay-btn--soft ln-touch-xl"
            onClick={() => {
              audioEngine.playChime('tap', profile.soundFxEnabled);
              onOpenLivingWorld();
            }}
          >
            <Trees size={26} />
            <span>
              Bahçem ({totalAwake}/{totalItems})
            </span>
          </button>
        </div>
      ) : (
        <div className="ln-hero-banner">
          <div style={{ flex: '1 1 320px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <h1 style={{ fontSize: 'clamp(1.45rem, 2.5vw, 2rem)' }}>
              {languageNameTr} Çalışma ve Keşif Alanı
            </h1>
            <p style={{ margin: 0, color: 'var(--ln-ink-soft)', fontWeight: 700 }}>
              İngilizce, Almanca ve İspanyolca için 3.891 stüdyo nöral ses, FSRS-5 aralıklı tekrar,
              240 kelimelik sözlük ve 18 derslik dilbilgisi. Yanlış cevap puan veya can kaybettirmez.
            </p>
            {onSelectLang && (
              <div className="ln-chip-group" role="group" aria-label="Hedef Dil Seçimi">
                {(['en', 'de', 'es'] as const).map((code) => {
                  const meta = LANGUAGE_META[code];
                  const active = profile.targetLang === code;
                  return (
                    <button
                      key={code}
                      type="button"
                      className="ln-chip-btn"
                      aria-pressed={active}
                      onClick={() => onSelectLang(code)}
                      style={
                        active
                          ? { background: '#e0e7ff', borderColor: '#4f46e5', color: '#1e1b4b', fontWeight: 800 }
                          : undefined
                      }
                    >
                      <span>{meta.flag}</span>
                      <span>{meta.nameTr}</span>
                    </button>
                  );
                })}
                {worlds[0] && (
                  <button
                    type="button"
                    className="ln-clay-btn ln-clay-btn--mint"
                    onClick={() => onStartWorld(worlds[0].id)}
                  >
                    <Play size={16} fill="currentColor" />
                    <span>Kayıt Olmadan Hemen Dene</span>
                  </button>
                )}
              </div>
            )}
            <div className="ln-chip-group" style={{ marginTop: '4px' }}>
              <span className="ln-chip-btn">
                ⭐ Uyanan: <strong>{totalAwake} / {totalItems}</strong>
              </span>
              <span
                className="ln-chip-btn"
                style={
                  totalDue > 0
                    ? { background: '#fef3c7', borderColor: '#f59e0b', color: '#92400e' }
                    : undefined
                }
              >
                <Clock size={15} style={{ verticalAlign: 'text-bottom', marginRight: '5px' }} />
                Tekrar Bekleyen: <strong>{totalDue}</strong>
              </span>
              <span className="ln-chip-btn">
                🧠 Hatırlama:{' '}
                <strong>
                  {overallRetrievabilityPct !== null ? `%${overallRetrievabilityPct}` : 'Yeni'}
                </strong>
              </span>
            </div>
          </div>

          <div className="ln-chip-group">
            {onOpenVocab && (
              <button
                type="button"
                className="ln-clay-btn ln-clay-btn--mint"
                onClick={() => {
                  audioEngine.playChime('tap', profile.soundFxEnabled);
                  onOpenVocab();
                }}
              >
                <Layers size={18} />
                <span>Kelimeler (240)</span>
              </button>
            )}
            {onOpenHandbook && (
              <button
                type="button"
                className="ln-clay-btn ln-clay-btn--soft"
                onClick={() => {
                  audioEngine.playChime('tap', profile.soundFxEnabled);
                  onOpenHandbook();
                }}
              >
                <BookOpen size={18} />
                <span>Dilbilgisi (18 Ders)</span>
              </button>
            )}
            <button
              type="button"
              className="ln-clay-btn ln-clay-btn--lavender"
              onClick={() => {
                audioEngine.playChime('tap', profile.soundFxEnabled);
                onOpenStories();
              }}
            >
              <BookOpen size={18} />
              <span>Hikayeler</span>
            </button>
            <button
              type="button"
              className="ln-clay-btn ln-clay-btn--gold"
              onClick={() => {
                audioEngine.playChime('tap', profile.soundFxEnabled);
                onOpenPhonetics();
              }}
            >
              <Ear size={18} />
              <span>Telaffuz</span>
            </button>
          </div>
        </div>
      )}

      {/* 6-World Island Grid */}
      <div className="ln-world-grid">
        {worlds.map((world) => {
          const stat = statsByWorld[world.id] ?? {
            awakeCount: 0,
            dueCount: 0,
            avgRetrievabilityPct: null,
          };
          const total = world.items.length || 10;
          const pct = Math.round((stat.awakeCount / total) * 100);
          const gradientBg = `linear-gradient(135deg, ${world.gradient[0]}, ${world.gradient[1]})`;

          return (
            <article
              key={world.id}
              className="ln-world-card"
              style={{
                background: gradientBg,
                textShadow: '0 1px 2px rgba(15, 23, 42, 0.25)',
                cursor: 'pointer',
              }}
              onClick={() => onStartWorld(world.id)}
            >
              {/* Top Row: Emoji + Mastery & FSRS Due Badges */}
              <div
                style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'flex-start',
                  justifyContent: 'space-between',
                  gap: '12px',
                }}
              >
                <span className="ln-world-emoji" aria-hidden="true">
                  {world.emoji}
                </span>

                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'flex-end',
                    gap: '6px',
                  }}
                >
                  <button
                    type="button"
                    className="ln-world-badge"
                    style={{
                      background: 'rgba(255, 255, 255, 0.92)',
                      color: '#0f172a',
                      textShadow: 'none',
                      minHeight: isMini ? '42px' : '34px',
                      padding: isMini ? '7px 14px' : '5px 12px',
                      boxShadow: '0 3px 0 rgba(15, 23, 42, 0.14)',
                    }}
                    onClick={(e) => {
                      e.stopPropagation();
                      audioEngine.playChime('tap', profile.soundFxEnabled);
                      audioEngine.speakTurkish(TR_WORLD_INTROS[world.id] ?? world.titleTr);
                    }}
                    aria-label={`${world.titleTr} tanıtımını sesli dinle`}
                    title="Dünyayı Sesli Dinle"
                  >
                    <Volume2 size={isMini ? 17 : 14} />
                    <span>{isMini ? 'Dinle' : 'Tanıtım'}</span>
                  </button>

                  <span className="ln-world-badge">
                    <Star size={15} fill="currentColor" />
                    <span>
                      {stat.awakeCount} / {total}
                    </span>
                  </span>

                  {stat.dueCount > 0 && (
                    <span
                      className="ln-world-badge"
                      style={{
                        background: 'rgba(254, 243, 199, 0.96)',
                        color: '#92400e',
                        textShadow: 'none',
                      }}
                    >
                      <Clock size={14} />
                      <span>{isMini ? `${stat.dueCount}` : `${stat.dueCount} Tekrar`}</span>
                    </span>
                  )}
                </div>
              </div>

              {/* Title + Optional Explorer/Master Telemetry */}
              <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <h2 style={{ fontSize: isMini ? '1.45rem' : '1.35rem' }}>{world.titleTr}</h2>
                {!isMini && (
                  <p style={{ margin: 0, opacity: 0.94, fontWeight: 700, fontSize: '0.94rem' }}>
                    {world.subtitleTr}
                  </p>
                )}
              </div>

              {/* Progress Bar */}
              <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <div className="ln-progress-track" aria-hidden="true">
                  <div className="ln-progress-fill" style={{ width: `${pct}%` }} />
                </div>

                {!isMini && (
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      fontSize: '0.86rem',
                      fontWeight: 800,
                      opacity: 0.95,
                    }}
                  >
                    <span>
                      Hatırlama:{' '}
                      {stat.avgRetrievabilityPct !== null
                        ? `%${stat.avgRetrievabilityPct}`
                        : 'Yeni'}
                    </span>
                    <span>%{pct} Keşfedildi</span>
                  </div>
                )}
              </div>

              {/* Big Tactile Play Button */}
              <button
                type="button"
                className={`ln-clay-btn ln-clay-btn--soft ${isMini ? 'ln-touch-xl' : ''}`}
                style={{ width: '100%', textShadow: 'none' }}
                onClick={(e) => {
                  e.stopPropagation();
                  onStartWorld(world.id);
                }}
              >
                <Play size={isMini ? 24 : 18} fill="currentColor" />
                <span>
                  {isMini
                    ? 'Oyna!'
                    : stat.dueCount > 0
                      ? 'Tekrar Et & Oyna'
                      : 'Başla'}
                </span>
                {!isMini && <Sparkles size={16} />}
              </button>
            </article>
          );
        })}
      </div>
    </section>
  );
}

export default WorldMapView;
