import { useMemo } from 'react';
import {
  ArrowRight,
  Award,
  BookOpen,
  CheckCircle2,
  Clock,
  Ear,
  Layers,
  MessageSquare,
  Play,
  Target,
  TrendingUp,
  Zap,
} from 'lucide-react';
import type { AdultDialogue, AdultModule, LanguageCode, LearnerProfile } from '../types';
import { LANGUAGE_META } from '../data/curriculum';
import { audioEngine } from '../engine/audioEngine';
import {
  MS_PER_DAY,
  cardKey,
  computeRetrievability,
  desiredRetentionForAge,
  isItemAwakeInLivingWorld,
} from '../engine/fsrs5';

export interface AdultStudioViewProps {
  modules: AdultModule[];
  dialogues: AdultDialogue[];
  profile: LearnerProfile;
  languageNameTr: string;
  onSelectLang?: (lang: LanguageCode) => void;
  onStartModule: (moduleId: string) => void;
  onStartDueQueue?: () => void;
  onOpenDialogues: () => void;
  onOpenHandbook: () => void;
  onOpenVocab: () => void;
  onOpenStories: () => void;
  onOpenPhonetics: () => void;
  onOpenParentStats: () => void;
}

interface ModuleMetrics {
  masteredCount: number;
  reviewedCount: number;
  dueCount: number;
  avgRetrievabilityPct: number | null;
  avgStabilityDays: number | null;
}

export function AdultStudioView({
  modules,
  dialogues,
  profile,
  languageNameTr,
  onSelectLang,
  onStartModule,
  onStartDueQueue,
  onOpenDialogues,
  onOpenHandbook,
  onOpenVocab,
  onOpenStories,
  onOpenPhonetics,
  onOpenParentStats,
}: AdultStudioViewProps) {
  const sortedModules = useMemo(
    () => [...modules].sort((a, b) => a.order - b.order),
    [modules],
  );

  const telemetry = useMemo(() => {
    const nowMs = Date.now();
    const byModule: Record<string, ModuleMetrics> = {};

    let totalItems = 0;
    let totalActive = 0;
    let totalDue = 0;
    let rSumAll = 0;
    let sSumAll = 0;
    let reviewedAll = 0;

    for (const mod of sortedModules) {
      let masteredCount = 0;
      let reviewedCount = 0;
      let dueCount = 0;
      let rSum = 0;
      let sSum = 0;

      for (const item of mod.items) {
        totalItems++;
        const card = profile.cards[cardKey(profile.targetLang, item.id)];
        if (isItemAwakeInLivingWorld(card)) {
          masteredCount++;
          totalActive++;
        }
        if (card && card.reps > 0) {
          reviewedCount++;
          reviewedAll++;
          if (card.dueAt <= nowMs) {
            dueCount++;
            totalDue++;
          }
          const elapsedDays = Math.max(0, (nowMs - card.lastReviewAt) / MS_PER_DAY);
          const r = computeRetrievability(elapsedDays, card.stability);
          rSum += r;
          sSum += card.stability;
          rSumAll += r;
          sSumAll += card.stability;
        }
      }

      byModule[mod.id] = {
        masteredCount,
        reviewedCount,
        dueCount,
        avgRetrievabilityPct: reviewedCount > 0 ? Math.round((rSum / reviewedCount) * 100) : null,
        avgStabilityDays: reviewedCount > 0 ? sSum / reviewedCount : null,
      };
    }

    const recommendedModuleId =
      [...sortedModules].sort((a, b) => {
        const diffDue = (byModule[b.id]?.dueCount ?? 0) - (byModule[a.id]?.dueCount ?? 0);
        if (diffDue !== 0) return diffDue;
        const aRemaining = a.items.length - (byModule[a.id]?.masteredCount ?? 0);
        const bRemaining = b.items.length - (byModule[b.id]?.masteredCount ?? 0);
        return bRemaining - aRemaining;
      })[0]?.id ?? sortedModules[0]?.id ?? null;

    const completedDialoguesCount = dialogues.filter((d) =>
      profile.completedStories.includes(d.id),
    ).length;

    return {
      byModule,
      totalItems: totalItems || 60,
      totalActive,
      totalDue,
      avgRetrievabilityPct: reviewedAll > 0 ? Math.round((rSumAll / reviewedAll) * 100) : null,
      avgStabilityDays: reviewedAll > 0 ? sSumAll / reviewedAll : null,
      desiredRetentionPct: Math.round(desiredRetentionForAge('master') * 100),
      recommendedModuleId,
      completedDialoguesCount,
    };
  }, [sortedModules, dialogues, profile.cards, profile.completedStories, profile.targetLang]);

  const handleLaunchDailyFsrs = () => {
    if (telemetry.totalDue > 0 && onStartDueQueue) {
      audioEngine.playChime('tap', profile.soundFxEnabled);
      onStartDueQueue();
      return;
    }
    if (!telemetry.recommendedModuleId) return;
    audioEngine.playChime('tap', profile.soundFxEnabled);
    onStartModule(telemetry.recommendedModuleId);
  };

  return (
    <section className="ln-adult-studio" aria-label="Yetişkin Çalışma Masası">
      {/* Top Studio Header & Progress Summary */}
      <header className="ln-adult-hero">
        <div className="ln-adult-hero-top">
          <div className="ln-adult-title-block">
            <div className="ln-adult-kicker">
              <Zap size={14} aria-hidden="true" />
              <span>Yetişkin Çalışma Alanı · {languageNameTr}</span>
            </div>
            <h1 className="ln-adult-h1">Günlük Çalışma Masası</h1>
            <p className="ln-adult-subtitle">
              İngilizce, Almanca ve İspanyolca için 3.891 stüdyo nöral ses, FSRS-5 aralıklı tekrar
              planı ve Türkçe düşünürken sık yapılan çeviri hatalarına odaklı aktif cümle pratiği.
              Kayıt olmadan hemen başlayabilirsiniz.
            </p>
            {onSelectLang && (
              <div className="ln-chip-group" role="group" aria-label="Hedef Dil Seçimi" style={{ marginTop: '10px' }}>
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
                          ? { background: 'rgba(56, 189, 248, 0.2)', borderColor: '#38bdf8', color: '#f8fafc', fontWeight: 800 }
                          : { background: 'rgba(15, 23, 42, 0.45)', borderColor: 'rgba(148, 163, 184, 0.3)', color: '#cbd5e1' }
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

          <div className="ln-adult-cta-wrap">
            <div className="ln-adult-pareto-badge" title="Hedeflenen uzun süreli hatırlama oranı">
              <Target size={14} aria-hidden="true" />
              <span>Hedef Hatırlama: %{telemetry.desiredRetentionPct}</span>
            </div>
            <button
              type="button"
              className="ln-adult-btn ln-adult-btn--primary"
              onClick={handleLaunchDailyFsrs}
              disabled={!telemetry.recommendedModuleId && !(telemetry.totalDue > 0 && onStartDueQueue)}
            >
              <Play size={16} aria-hidden="true" />
              <span>Günlük Çalışmayı Başlat</span>
              {telemetry.totalDue > 0 && (
                <span className="ln-adult-pill-count">{telemetry.totalDue}</span>
              )}
            </button>
          </div>
        </div>

        {/* Progress Summary Strip */}
        <div className="ln-adult-telemetry-strip" role="region" aria-label="Çalışma Özeti">
          <div className="ln-adult-metric-card">
            <span className="ln-adult-metric-label">
              <Layers size={14} aria-hidden="true" />
              Öğrenilen Kalıplar
            </span>
            <strong className="ln-adult-metric-value">
              {telemetry.totalActive} <small>/ {telemetry.totalItems}</small>
            </strong>
          </div>

          <div className="ln-adult-metric-card">
            <span className="ln-adult-metric-label">
              <Clock size={14} aria-hidden="true" />
              Bugünkü Tekrarlar
            </span>
            <strong
              className={`ln-adult-metric-value ${telemetry.totalDue > 0 ? 'is-due' : ''}`}
            >
              {telemetry.totalDue}
            </strong>
          </div>

          <div className="ln-adult-metric-card">
            <span className="ln-adult-metric-label">
              <TrendingUp size={14} aria-hidden="true" />
              Hatırlama Oranı
            </span>
            <strong className="ln-adult-metric-value">
              {telemetry.avgRetrievabilityPct !== null
                ? `${telemetry.avgRetrievabilityPct}%`
                : '—'}
            </strong>
          </div>

          <div className="ln-adult-metric-card">
            <span className="ln-adult-metric-label">
              <Award size={14} aria-hidden="true" />
              Ortalama Kalıcılık
            </span>
            <strong className="ln-adult-metric-value">
              {telemetry.avgStabilityDays !== null
                ? `${telemetry.avgStabilityDays.toFixed(1)} gün`
                : '—'}
            </strong>
          </div>
        </div>
      </header>

      {/* Real-World Adult Module Cards */}
      <div className="ln-adult-section-head">
        <h2>Konu Başlıkları ve Kalıp Dersleri</h2>
        <span>{sortedModules.length} Bölüm · Seviye A2–B2</span>
      </div>

      <div className="ln-adult-module-grid">
        {sortedModules.map((mod) => {
          const stats = telemetry.byModule[mod.id] ?? {
            masteredCount: 0,
            reviewedCount: 0,
            dueCount: 0,
            avgRetrievabilityPct: null,
            avgStabilityDays: null,
          };
          const itemTotal = Math.max(mod.items.length, 1);
          const progressPct = Math.round((stats.masteredCount / itemTotal) * 100);
          const isAllMastered = mod.items.length > 0 && stats.masteredCount >= mod.items.length;

          return (
            <button
              key={mod.id}
              type="button"
              className={`ln-adult-module-card ${stats.dueCount > 0 ? 'has-due' : ''} ${isAllMastered ? 'is-mastered' : ''}`}
              style={{ ['--ln-adult-accent' as string]: mod.accentHex }}
              onClick={() => {
                audioEngine.playChime('tap', profile.soundFxEnabled);
                onStartModule(mod.id);
              }}
            >
              <div className="ln-adult-module-head">
                <span className="ln-adult-module-icon ln-adult-module-num" aria-hidden="true">
                  {String(mod.order).padStart(2, '0')}
                </span>
                <div className="ln-adult-module-badges">
                  <span className="ln-adult-cefr-badge">{mod.cefrRange}</span>
                  {stats.dueCount > 0 ? (
                    <span className="ln-adult-due-badge">{stats.dueCount} tekrar</span>
                  ) : isAllMastered ? (
                    <span className="ln-adult-done-badge">
                      <CheckCircle2 size={12} aria-hidden="true" /> Tamam
                    </span>
                  ) : null}
                </div>
              </div>

              <div className="ln-adult-module-body">
                <h3 className="ln-adult-module-title">{mod.titleTr}</h3>
                <p className="ln-adult-module-sub">{mod.subtitleTr}</p>
              </div>

              <div className="ln-adult-module-footer">
                <div className="ln-adult-progress-row">
                  <span>
                    {stats.masteredCount} / {mod.items.length} öğrenildi
                  </span>
                  <span>
                    {stats.avgRetrievabilityPct !== null
                      ? `%${stats.avgRetrievabilityPct}`
                      : `%${progressPct}`}
                  </span>
                </div>
                <div
                  className="ln-adult-progress-track"
                  role="progressbar"
                  aria-valuenow={progressPct}
                  aria-valuemin={0}
                  aria-valuemax={100}
                >
                  <div
                    className="ln-adult-progress-fill"
                    style={{ width: `${progressPct}%` }}
                  />
                </div>
              </div>

              <span className="ln-adult-module-launch">
                <span>Dersi Aç</span>
                <ArrowRight size={14} aria-hidden="true" />
              </span>
            </button>
          );
        })}
      </div>

      {/* Reference & Practice Tools Row */}
      <div className="ln-adult-section-head">
        <h2>Temel Kaynaklar: Kelime, Dilbilgisi ve Okuma</h2>
        <span>A1–B2 Sözlük · 18 Ders Dilbilgisi · Kısa Hikayeler · Diyalog</span>
      </div>

      <div className="ln-adult-tools-row">
        <button
          type="button"
          className="ln-adult-tool-card"
          onClick={() => {
            audioEngine.playChime('tap', profile.soundFxEnabled);
            onOpenVocab();
          }}
        >
          <span className="ln-adult-tool-icon">
            <Layers size={20} aria-hidden="true" />
          </span>
          <div className="ln-adult-tool-text">
            <strong>Kelime Hazinesi (240 Temel Kelime)</strong>
            <small>12 konu başlığı, sesli örnek cümleler ve kelime alıştırması</small>
          </div>
          <ArrowRight size={16} className="ln-adult-tool-arrow" aria-hidden="true" />
        </button>

        <button
          type="button"
          className="ln-adult-tool-card"
          onClick={() => {
            audioEngine.playChime('tap', profile.soundFxEnabled);
            onOpenHandbook();
          }}
        >
          <span className="ln-adult-tool-icon">
            <BookOpen size={20} aria-hidden="true" />
          </span>
          <div className="ln-adult-tool-text">
            <strong>Adım Adım Dilbilgisi (18 Ders)</strong>
            <small>A1–B2 çekim tabloları, sade konu anlatımı ve alıştırmalar</small>
          </div>
          <ArrowRight size={16} className="ln-adult-tool-arrow" aria-hidden="true" />
        </button>

        <button
          type="button"
          className="ln-adult-tool-card"
          onClick={() => {
            audioEngine.playChime('tap', profile.soundFxEnabled);
            onOpenStories();
          }}
        >
          <span className="ln-adult-tool-icon">
            <BookOpen size={20} aria-hidden="true" />
          </span>
          <div className="ln-adult-tool-text">
            <strong>Kademeli Okuma Hikayeleri (A1–B2)</strong>
            <small>8 gerçekçi kısa öykü, sesli dinleme ve okuduğunu anlama</small>
          </div>
          <ArrowRight size={16} className="ln-adult-tool-arrow" aria-hidden="true" />
        </button>

        <button
          type="button"
          className="ln-adult-tool-card"
          onClick={() => {
            audioEngine.playChime('tap', profile.soundFxEnabled);
            onOpenDialogues();
          }}
        >
          <span className="ln-adult-tool-icon">
            <MessageSquare size={20} aria-hidden="true" />
          </span>
          <div className="ln-adult-tool-text">
            <strong>Gerçek Hayat Diyalogları</strong>
            <small>
              {dialogues.length} Senaryo · {telemetry.completedDialoguesCount} tamamlandı
            </small>
          </div>
          <ArrowRight size={16} className="ln-adult-tool-arrow" aria-hidden="true" />
        </button>

        <button
          type="button"
          className="ln-adult-tool-card"
          onClick={() => {
            audioEngine.playChime('tap', profile.soundFxEnabled);
            onOpenPhonetics();
          }}
        >
          <span className="ln-adult-tool-icon">
            <Ear size={20} aria-hidden="true" />
          </span>
          <div className="ln-adult-tool-text">
            <strong>{languageNameTr} Telaffuz Çalışması</strong>
            <small>Karşılaştırmalı ses çiftleri ve ağız pozisyonu rehberi</small>
          </div>
          <ArrowRight size={16} className="ln-adult-tool-arrow" aria-hidden="true" />
        </button>

        <button
          type="button"
          className="ln-adult-tool-card"
          onClick={() => {
            audioEngine.playChime('tap', profile.soundFxEnabled);
            onOpenParentStats();
          }}
        >
          <span className="ln-adult-tool-icon">
            <TrendingUp size={20} aria-hidden="true" />
          </span>
          <div className="ln-adult-tool-text">
            <strong>Çalışma Geçmişi ve Yedekleme</strong>
            <small>Günlük süre, kalıcılık grafiği ve profil ayarları</small>
          </div>
          <ArrowRight size={16} className="ln-adult-tool-arrow" aria-hidden="true" />
        </button>
      </div>
    </section>
  );
}
