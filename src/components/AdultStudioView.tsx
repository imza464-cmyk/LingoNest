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
import type { AdultDialogue, AdultModule, LearnerProfile } from '../types';
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
  onStartModule: (moduleId: string) => void;
  onStartDueQueue?: () => void;
  onOpenDialogues: () => void;
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
  onStartModule,
  onStartDueQueue,
  onOpenDialogues,
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
    <section className="ln-adult-studio" aria-label="Yetişkin Bilişsel Dil Stüdyosu">
      {/* Top Studio Header & Executive Telemetry Strip */}
      <header className="ln-adult-hero">
        <div className="ln-adult-hero-top">
          <div className="ln-adult-title-block">
            <div className="ln-adult-kicker">
              <Zap size={14} aria-hidden="true" />
              <span>Bilişsel Dil Stüdyosu · {languageNameTr}</span>
            </div>
            <h1 className="ln-adult-h1">FSRS-5 Aktif Üretim Kokpiti</h1>
            <p className="ln-adult-subtitle">
              Türkçe L1 kontrastif tuzak analizi, aktif boşluk doldurma, sözdizimi kurulumu ve
              şeffaf DSR bellek planlaması.
            </p>
          </div>

          <div className="ln-adult-cta-wrap">
            <div className="ln-adult-pareto-badge" title="Pareto-optimal yetişkin hedef hatırlama oranı">
              <Target size={14} aria-hidden="true" />
              <span>R* = {telemetry.desiredRetentionPct}% Pareto</span>
            </div>
            <button
              type="button"
              className="ln-adult-btn ln-adult-btn--primary"
              onClick={handleLaunchDailyFsrs}
              disabled={!telemetry.recommendedModuleId && !(telemetry.totalDue > 0 && onStartDueQueue)}
            >
              <Play size={16} aria-hidden="true" />
              <span>FSRS Günlük Tekrarı Başlat</span>
              {telemetry.totalDue > 0 && (
                <span className="ln-adult-pill-count">{telemetry.totalDue}</span>
              )}
            </button>
          </div>
        </div>

        {/* Executive Telemetry Strip */}
        <div className="ln-adult-telemetry-strip" role="region" aria-label="Bellek Telemetrisi">
          <div className="ln-adult-metric-card">
            <span className="ln-adult-metric-label">
              <Layers size={14} aria-hidden="true" />
              Aktif Sözcük Dağarcığı
            </span>
            <strong className="ln-adult-metric-value">
              {telemetry.totalActive} <small>/ {telemetry.totalItems}</small>
            </strong>
          </div>

          <div className="ln-adult-metric-card">
            <span className="ln-adult-metric-label">
              <Clock size={14} aria-hidden="true" />
              Bekleyen FSRS-5 Tekrarı
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
              Ort. Hatırlama (R%)
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
              Ort. Bellek Stabilitesi (S)
            </span>
            <strong className="ln-adult-metric-value">
              {telemetry.avgStabilityDays !== null
                ? `${telemetry.avgStabilityDays.toFixed(1)} gün`
                : '—'}
            </strong>
          </div>
        </div>
      </header>

      {/* 6 Real-World Adult Module Cards */}
      <div className="ln-adult-section-head">
        <h2>Gerçek Hayat Yetkinlik Modülleri</h2>
        <span>{sortedModules.length} Modül · CEFR A2–B2</span>
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
                <span className="ln-adult-module-icon" aria-hidden="true">
                  {mod.icon}
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
                    {stats.masteredCount} / {mod.items.length} aktif
                  </span>
                  <span>
                    {stats.avgRetrievabilityPct !== null
                      ? `R ${stats.avgRetrievabilityPct}%`
                      : `${progressPct}%`}
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
                <span>Oturumu Aç</span>
                <ArrowRight size={14} aria-hidden="true" />
              </span>
            </button>
          );
        })}
      </div>

      {/* Quick-Access Studio Tools Row */}
      <div className="ln-adult-section-head">
        <h2>Hızlı Stüdyo Araçları</h2>
        <span>Ses · Diyalog · Bellek Analitiği</span>
      </div>

      <div className="ln-adult-tools-row">
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
            <strong>Rol-Yapma Diyalog Stüdyosu</strong>
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
            <strong>Türkçe → {languageNameTr} Kontrastif Ses Labı</strong>
            <small>/θ/ /ð/ /æ/ /w/ /ŋ/ /ə/ minimal çiftler &amp; telaffuz</small>
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
            <BookOpen size={20} aria-hidden="true" />
          </span>
          <div className="ln-adult-tool-text">
            <strong>FSRS-5 Bellek Eğrisi &amp; Analitik</strong>
            <small>D/S/R parametreleri, günlük aktivite ve profil kasası</small>
          </div>
          <ArrowRight size={16} className="ln-adult-tool-arrow" aria-hidden="true" />
        </button>
      </div>
    </section>
  );
}
