import { useEffect, useId, useMemo, useState, type FormEvent } from 'react';
import {
  Check,
  Clock,
  Download,
  Lock,
  Mic,
  Plus,
  RotateCcw,
  ShieldCheck,
  Sparkles,
  Trash2,
  TrendingUp,
  Unlock,
  Users,
  Volume2,
  X,
} from 'lucide-react';
import type { AgeMode, LanguageCode, LearnerProfile, WorldData } from '../types';
import type { VaultState } from '../engine/storage';
import { exportVaultJson, todayDateKey } from '../engine/storage';
import {
  MS_PER_DAY,
  computeItemMasteryPct,
  computeOptimalIntervalDays,
  computeRetrievability,
  desiredRetentionForAge,
  isItemAwakeInLivingWorld,
} from '../engine/fsrs5';
import { audioEngine } from '../engine/audioEngine';

export interface ParentDashboardModalProps {
  vault: VaultState;
  activeProfile: LearnerProfile;
  worlds: WorldData[];
  onClose: () => void;
  onUpdateProfile: (updated: LearnerProfile) => void;
  onSwitchProfile: (profileId: string) => void;
  onCreateProfile: (name: string, avatar: string, ageMode: AgeMode, lang: LanguageCode) => void;
  onEraseAll: () => void;
}

const TURKISH_NUM_WORDS: Array<{ value: number; word: string }> = [
  { value: 2, word: 'iki' },
  { value: 3, word: 'üç' },
  { value: 4, word: 'dört' },
  { value: 5, word: 'beş' },
  { value: 6, word: 'altı' },
  { value: 7, word: 'yedi' },
  { value: 8, word: 'sekiz' },
  { value: 9, word: 'dokuz' },
  { value: 11, word: 'on bir' },
  { value: 12, word: 'on iki' },
];

const AVATAR_OPTIONS = ['🐣', '🦊', '🦁', '🐼', '🦄', '🦉', '🚀', '🐳'] as const;

const AGE_MODE_LABELS: Record<AgeMode, string> = {
  mini: 'Mini (4-7 Yaş)',
  explorer: 'Kaşif (8-14 Yaş)',
  master: 'Usta (15+ Yaş)',
};

const LANG_LABELS: Record<LanguageCode, string> = {
  en: '🇬🇧 İngilizce (EN)',
  de: '🇩🇪 Almanca (DE)',
  es: '🇪🇸 İspanyolca (ES)',
};

function createGateChallenge(): { prompt: string; answer: number } {
  const a = TURKISH_NUM_WORDS[Math.floor(Math.random() * TURKISH_NUM_WORDS.length)];
  const b = TURKISH_NUM_WORDS[Math.floor(Math.random() * TURKISH_NUM_WORDS.length)];
  const capitalized = a.word.charAt(0).toUpperCase() + a.word.slice(1);
  return {
    prompt: `${capitalized} artı ${b.word} kaç eder?`,
    answer: a.value + b.value,
  };
}

function getLast7DateKeys(): Array<{ dateKey: string; label: string }> {
  const days: Array<{ dateKey: string; label: string }> = [];
  const weekdayShort = ['Paz', 'Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt'];
  const now = Date.now();
  for (let offset = 6; offset >= 0; offset--) {
    const ms = now - offset * MS_PER_DAY;
    const d = new Date(ms);
    days.push({
      dateKey: todayDateKey(ms),
      label: offset === 0 ? 'Bugün' : weekdayShort[d.getDay()],
    });
  }
  return days;
}

export function ParentDashboardModal({
  vault,
  activeProfile,
  worlds,
  onClose,
  onUpdateProfile,
  onSwitchProfile,
  onCreateProfile,
  onEraseAll,
}: ParentDashboardModalProps) {
  const uid = useId().replace(/:/g, '');
  const areaGradId = `${uid}-fsrs-area`;
  const [gate, setGate] = useState(() => createGateChallenge());
  const [gateInput, setGateInput] = useState('');
  const [gateError, setGateError] = useState(false);
  const [unlocked, setUnlocked] = useState(false);

  const [newName, setNewName] = useState('');
  const [newAvatar, setNewAvatar] = useState<string>('🦊');
  const [newAgeMode, setNewAgeMode] = useState<AgeMode>('mini');
  const [newLang, setNewLang] = useState<LanguageCode>('en');
  const [confirmErase, setConfirmErase] = useState(false);
  const [neuralClipCount, setNeuralClipCount] = useState<number>(() =>
    audioEngine.getNeuralClipCount(),
  );

  useEffect(() => {
    if (neuralClipCount > 0) return;
    let active = true;
    void audioEngine.ensureManifest().then(() => {
      if (active) {
        setNeuralClipCount(audioEngine.getNeuralClipCount());
      }
    });
    return () => {
      active = false;
    };
  }, [neuralClipCount]);

  const handleGateSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const numeric = Number.parseInt(gateInput.trim(), 10);
    if (numeric === gate.answer) {
      setUnlocked(true);
      setGateError(false);
      audioEngine.playChime('unlock', activeProfile.soundFxEnabled);
    } else {
      setGateError(true);
      audioEngine.playChime('gentle-nudge', activeProfile.soundFxEnabled);
    }
  };

  const metrics = useMemo(() => {
    const dedupCards = Array.from(
      new Map(
        Object.values(activeProfile.cards)
          .filter((c) => c.lang === activeProfile.targetLang)
          .map((c) => [c.itemId, c]),
      ).values(),
    );

    const totalItems = worlds.reduce((acc, w) => acc + w.items.length, 0);
    const masteredCount = dedupCards.filter((c) => isItemAwakeInLivingWorld(c)).length;
    const learnedCards = dedupCards.filter((c) => c.reps > 0);
    const speakingCount = learnedCards.filter((c) => c.speakingCompleted).length;
    const speakingRatioPct =
      learnedCards.length > 0 ? Math.round((speakingCount / learnedCards.length) * 100) : 0;

    const avgMasteryPct =
      learnedCards.length > 0
        ? Math.round(
            learnedCards.reduce((sum, c) => sum + computeItemMasteryPct(c), 0) / learnedCards.length,
          )
        : 0;

    const hasRealStability = learnedCards.length > 0;
    const avgStability = hasRealStability
      ? learnedCards.reduce((sum, c) => sum + c.stability, 0) / learnedCards.length
      : 3.173; // FSRS-5 S0(Good) baseline preview

    const last7 = getLast7DateKeys();
    const dailyBars = last7.map((d) => {
      const entry = activeProfile.dailyLog[d.dateKey];
      return {
        ...d,
        minutes: entry?.minutes ?? 0,
        reviews: entry?.reviews ?? 0,
      };
    });
    const weeklyMinutes = dailyBars.reduce((sum, d) => sum + d.minutes, 0);
    const maxBarMinutes = Math.max(15, ...dailyBars.map((d) => d.minutes));

    const dueNowCount = learnedCards.filter((c) => c.dueAt <= Date.now()).length;

    return {
      totalItems,
      masteredCount,
      learnedCount: learnedCards.length,
      speakingCount,
      speakingRatioPct,
      avgMasteryPct,
      hasRealStability,
      avgStability,
      dailyBars,
      weeklyMinutes,
      maxBarMinutes,
      dueNowCount,
    };
  }, [activeProfile, worlds]);

  const fsrsChart = useMemo(() => {
    const width = 640;
    const height = 224;
    const padL = 48;
    const padR = 24;
    const padT = 20;
    const padB = 34;
    const plotW = width - padL - padR;
    const plotH = height - padT - padB;
    const maxDays = 30;

    const toX = (day: number) => padL + (day / maxDays) * plotW;
    const toY = (r: number) => padT + (1 - r) * plotH;

    const pts: Array<{ day: number; r: number; x: number; y: number }> = [];
    for (let day = 0; day <= maxDays; day++) {
      const r = computeRetrievability(day, metrics.avgStability);
      pts.push({ day, r, x: toX(day), y: toY(r) });
    }

    const polylinePoints = pts.map((p) => `${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(' ');
    const areaPath = `M ${pts[0].x.toFixed(1)} ${(padT + plotH).toFixed(1)} L ${pts
      .map((p) => `${p.x.toFixed(1)} ${p.y.toFixed(1)}`)
      .join(' L ')} L ${pts[pts.length - 1].x.toFixed(1)} ${(padT + plotH).toFixed(1)} Z`;

    const targetR = desiredRetentionForAge(activeProfile.ageMode);
    const paretoY = toY(targetR);
    const tStarDays = computeOptimalIntervalDays(targetR, metrics.avgStability);
    const tStarClamped = Math.min(maxDays, tStarDays);
    const tStarX = toX(tStarClamped);

    return {
      width,
      height,
      padL,
      padR,
      padT,
      padB,
      plotW,
      plotH,
      toX,
      toY,
      polylinePoints,
      areaPath,
      targetR,
      paretoY,
      tStarDays,
      tStarClamped,
      tStarX,
    };
  }, [metrics.avgStability, activeProfile.ageMode]);

  const handleDownloadBackup = () => {
    const json = exportVaultJson(vault);
    const blob = new Blob([json], { type: 'application/json;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `lingonest-yedek-${todayDateKey()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    audioEngine.playChime('success', activeProfile.soundFxEnabled);
  };

  const handleCreateSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const trimmed = newName.trim();
    if (!trimmed) return;
    onCreateProfile(trimmed, newAvatar, newAgeMode, newLang);
    setNewName('');
    audioEngine.playChime('celebrate', activeProfile.soundFxEnabled);
  };

  const phoneticEntries = Object.entries(activeProfile.phoneticScores);

  return (
    <div
      className="ln-modal-backdrop"
      role="dialog"
      aria-modal="true"
      aria-label="Ebeveyn Kontrol ve FSRS-5 Bilim Paneli"
    >
      <div className="ln-parent-modal">
        <div className="ln-modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <span
              style={{
                width: 46,
                height: 46,
                borderRadius: 14,
                display: 'grid',
                placeItems: 'center',
                background: unlocked ? '#d1fae5' : '#e0f2fe',
                color: unlocked ? '#047857' : '#0369a1',
              }}
            >
              {unlocked ? <Unlock size={24} /> : <Lock size={24} />}
            </span>
            <div>
              <h2 style={{ fontSize: '1.45rem' }}>Ebeveyn & FSRS-5 Bellek Paneli</h2>
              <p style={{ margin: '2px 0 0', fontSize: '0.88rem', color: 'var(--ln-ink-muted)', fontWeight: 700 }}>
                %100 Cihaz İçi • KVKK & COPPA Uyumlu • Kardeş Profilleri
              </p>
              {neuralClipCount > 0 && (
                <span
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 6,
                    marginTop: 6,
                    padding: '4px 12px',
                    borderRadius: 999,
                    background: '#ecfdf5',
                    border: '1.5px solid #34d399',
                    color: '#065f46',
                    fontSize: '0.8rem',
                    fontWeight: 800,
                  }}
                >
                  🎙️ Stüdyo Nöral Ses Paketi: {neuralClipCount} kayıt aktif
                </span>
              )}
            </div>
          </div>

          <button
            type="button"
            className="ln-close-btn"
            onClick={onClose}
            aria-label="Ebeveyn panelini kapat"
          >
            <X size={24} />
          </button>
        </div>

        {!unlocked ? (
          <div className="ln-parent-gate">
            <div className="ln-gate-card">
              <div style={{ fontSize: '2.4rem' }}>🔐</div>
              <h3 style={{ fontSize: '1.3rem' }}>Yetişkin Doğrulama Kapısı</h3>
              <p style={{ margin: 0, color: 'var(--ln-ink-soft)', fontWeight: 700, fontSize: '0.95rem' }}>
                Çocukların ayarları yanlışlıkla değiştirmemesi için lütfen yazılı işlemi çözün:
              </p>

              <div className="ln-gate-question">{gate.prompt}</div>

              <form onSubmit={handleGateSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                <input
                  type="number"
                  inputMode="numeric"
                  className="ln-input"
                  placeholder="Rakamla cevabı yazın (örn. 14)"
                  value={gateInput}
                  onChange={(e) => {
                    setGateInput(e.target.value);
                    setGateError(false);
                  }}
                  autoFocus
                />

                {gateError && (
                  <div
                    style={{
                      padding: '10px 14px',
                      borderRadius: 12,
                      background: '#fff7ed',
                      border: '2px solid #fdba74',
                      color: '#9a3412',
                      fontWeight: 800,
                      fontSize: '0.9rem',
                    }}
                  >
                    Cevap tam eşleşmedi, lütfen tekrar kontrol edin.
                  </div>
                )}

                <div style={{ display: 'flex', gap: 10 }}>
                  <button type="submit" className="ln-clay-btn ln-clay-btn--mint" style={{ flex: 1 }}>
                    <Unlock size={19} />
                    <span>Paneli Aç</span>
                  </button>
                  <button
                    type="button"
                    className="ln-clay-btn ln-clay-btn--soft"
                    onClick={() => {
                      setGate(createGateChallenge());
                      setGateInput('');
                      setGateError(false);
                    }}
                    title="Yeni soru oluştur"
                    aria-label="Yeni soru oluştur"
                  >
                    <RotateCcw size={19} />
                  </button>
                </div>
              </form>
            </div>
          </div>
        ) : (
          <>
            {/* Top Real-Time Pedagogical Metrics */}
            <div className="ln-dashboard-grid">
              <div className="ln-stat-card">
                <div className="ln-stat-label">
                  <Sparkles size={15} style={{ verticalAlign: 'middle', marginRight: 6 }} />
                  Uyanık Kelimeler ({activeProfile.targetLang.toUpperCase()})
                </div>
                <div className="ln-stat-value">
                  {metrics.masteredCount}{' '}
                  <span style={{ fontSize: '1rem', color: 'var(--ln-ink-muted)' }}>
                    / {metrics.totalItems}
                  </span>
                </div>
                <div style={{ fontSize: '0.84rem', fontWeight: 700, color: '#059669' }}>
                  Ortalama Hakimiyet: %{metrics.avgMasteryPct}
                </div>
              </div>

              <div className="ln-stat-card">
                <div className="ln-stat-label">
                  <Mic size={15} style={{ verticalAlign: 'middle', marginRight: 6 }} />
                  Konuşma Üretim Oranı
                </div>
                <div className="ln-stat-value">%{metrics.speakingRatioPct}</div>
                <div style={{ fontSize: '0.84rem', fontWeight: 700, color: '#0284c7' }}>
                  {metrics.speakingCount} / {metrics.learnedCount} kelime seslendirildi
                </div>
              </div>

              <div className="ln-stat-card">
                <div className="ln-stat-label">
                  <Clock size={15} style={{ verticalAlign: 'middle', marginRight: 6 }} />
                  Haftalık Doğal Maruziyet
                </div>
                <div className="ln-stat-value">{metrics.weeklyMinutes} dk</div>
                <div style={{ fontSize: '0.84rem', fontWeight: 700, color: '#7c3aed' }}>
                  Tekrar bekleyen: {metrics.dueNowCount} kart
                </div>
              </div>

              <div className="ln-stat-card">
                <div className="ln-stat-label">
                  <TrendingUp size={15} style={{ verticalAlign: 'middle', marginRight: 6 }} />
                  Ortalama Bellek Kararlılığı (S̄)
                </div>
                <div className="ln-stat-value">{metrics.avgStability.toFixed(2)} gün</div>
                <div style={{ fontSize: '0.84rem', fontWeight: 700, color: '#d97706' }}>
                  Hedef Hatırlama R*: %{Math.round(fsrsChart.targetR * 100)}
                </div>
              </div>
            </div>

            {/* Live SVG FSRS-5 Memory Retention Curve */}
            <div className="ln-fsrs-chart-card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 10 }}>
                <div>
                  <h3 style={{ fontSize: '1.2rem' }}>📈 Canlı FSRS-5 Bellek Tutma Eğrisi R(t, S̄)</h3>
                  <p style={{ margin: '4px 0 0', fontSize: '0.86rem', fontWeight: 700, color: 'var(--ln-ink-muted)' }}>
                    {metrics.hasRealStability
                      ? `Gerçek öğrenilmiş kart ortalaması S̄ = ${metrics.avgStability.toFixed(2)} gün üzerinden 30 günlük unutma tahmini.`
                      : 'Henüz kart tamamlanmadığı için FSRS-5 bazal S₀ = 3.17 gün eğrisi örneklenmektedir.'}
                  </p>
                </div>
                <span
                  style={{
                    padding: '6px 14px',
                    borderRadius: 999,
                    background: '#fef3c7',
                    border: '2px solid #fcd34d',
                    fontSize: '0.84rem',
                    fontWeight: 800,
                    color: '#92400e',
                  }}
                >
                  Pareto Optimum Tekrar t* = {fsrsChart.tStarDays.toFixed(1)} gün
                </span>
              </div>

              <svg
                viewBox={`0 0 ${fsrsChart.width} ${fsrsChart.height}`}
                width="100%"
                height="auto"
                role="img"
                aria-label="FSRS-5 Bellek Tutma Eğrisi"
              >
                <defs>
                  <linearGradient id={areaGradId} x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#0ea5e9" stopOpacity="0.34" />
                    <stop offset="100%" stopColor="#0ea5e9" stopOpacity="0.02" />
                  </linearGradient>
                </defs>

                {/* Y-axis Gridlines */}
                {[0, 0.25, 0.5, 0.75, 1].map((tick) => {
                  const y = fsrsChart.toY(tick);
                  return (
                    <g key={tick}>
                      <line
                        x1={fsrsChart.padL}
                        y1={y}
                        x2={fsrsChart.width - fsrsChart.padR}
                        y2={y}
                        stroke="#e2e8f0"
                        strokeWidth="1.5"
                      />
                      <text
                        x={fsrsChart.padL - 8}
                        y={y + 4}
                        textAnchor="end"
                        fontSize="11"
                        fontWeight="700"
                        fill="#64748b"
                      >
                        %{Math.round(tick * 100)}
                      </text>
                    </g>
                  );
                })}

                {/* X-axis Day Labels */}
                {[0, 5, 10, 15, 20, 25, 30].map((day) => {
                  const x = fsrsChart.toX(day);
                  return (
                    <text
                      key={day}
                      x={x}
                      y={fsrsChart.height - 10}
                      textAnchor="middle"
                      fontSize="11"
                      fontWeight="700"
                      fill="#64748b"
                    >
                      {day}g
                    </text>
                  );
                })}

                {/* Retention Curve Area & Line */}
                <path d={fsrsChart.areaPath} fill={`url(#${areaGradId})`} />
                <polyline
                  fill="none"
                  stroke="#0284c7"
                  strokeWidth="4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  points={fsrsChart.polylinePoints}
                />

                {/* Pareto Knee Dashed Line (R* = 90% child / 85% adult) */}
                <line
                  x1={fsrsChart.padL}
                  y1={fsrsChart.paretoY}
                  x2={fsrsChart.width - fsrsChart.padR}
                  y2={fsrsChart.paretoY}
                  stroke="#f59e0b"
                  strokeWidth="2.5"
                  strokeDasharray="7 5"
                />
                <text
                  x={fsrsChart.width - fsrsChart.padR - 4}
                  y={fsrsChart.paretoY - 6}
                  textAnchor="end"
                  fontSize="11"
                  fontWeight="800"
                  fill="#b45309"
                >
                  Pareto Eşiği R* = %{Math.round(fsrsChart.targetR * 100)}
                </text>

                {/* Optimal Next Review Marker t* */}
                <line
                  x1={fsrsChart.tStarX}
                  y1={fsrsChart.paretoY}
                  x2={fsrsChart.tStarX}
                  y2={fsrsChart.padT + fsrsChart.plotH}
                  stroke="#10b981"
                  strokeWidth="2"
                  strokeDasharray="4 4"
                />
                <circle
                  cx={fsrsChart.tStarX}
                  cy={fsrsChart.paretoY}
                  r="6.5"
                  fill="#10b981"
                  stroke="#ffffff"
                  strokeWidth="2.5"
                />
              </svg>
            </div>

            {/* 7-Day Zero-Guilt Activity Chart + Phonetic Trap Scores */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(290px, 1fr))', gap: 18 }}>
              <div className="ln-card">
                <h3 style={{ fontSize: '1.15rem', marginBottom: 4 }}>☀️ 7 Günlük Sıfır-Suçluluk Aktivitesi</h3>
                <p style={{ margin: 0, fontSize: '0.84rem', fontWeight: 700, color: 'var(--ln-ink-muted)' }}>
                  Seri cezası yok — her dakika çocuk beyninde kalıcı iz bırakır.
                </p>

                <div className="ln-activity-bars">
                  {metrics.dailyBars.map((bar) => {
                    const pct = Math.round((bar.minutes / metrics.maxBarMinutes) * 100);
                    return (
                      <div key={bar.dateKey} className="ln-activity-col">
                        <span style={{ fontSize: '0.78rem', fontWeight: 800, color: 'var(--ln-ink-soft)' }}>
                          {bar.minutes > 0 ? `${bar.minutes}d` : '—'}
                        </span>
                        <div className="ln-activity-bar-track" title={`${bar.dateKey}: ${bar.minutes} dk, ${bar.reviews} tekrar`}>
                          <div
                            className="ln-activity-bar-fill"
                            style={{ height: `${Math.max(bar.minutes > 0 ? 14 : 6, pct)}%`, opacity: bar.minutes > 0 ? 1 : 0.3 }}
                          />
                        </div>
                        <span style={{ fontSize: '0.76rem', fontWeight: 800, color: 'var(--ln-ink-muted)' }}>
                          {bar.label}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="ln-card">
                <h3 style={{ fontSize: '1.15rem', marginBottom: 8 }}>👄 Fonetik Tuzak Skorları</h3>
                {phoneticEntries.length === 0 ? (
                  <p style={{ margin: 0, color: 'var(--ln-ink-muted)', fontWeight: 700, fontSize: '0.92rem' }}>
                    Fonetik Laboratuvar henüz çalışılmadı. Türkçede olmayan /θ/, /ð/, /æ/, /w/, /ŋ/, /ə/ sesleri çalışıldıkça skorlar burada görünür.
                  </p>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                    {phoneticEntries.map(([trapId, score]) => (
                      <div
                        key={trapId}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          padding: '10px 14px',
                          borderRadius: 14,
                          background: '#f8fafc',
                          border: '2px solid #e2e8f0',
                          fontWeight: 800,
                        }}
                      >
                        <span>{trapId}</span>
                        <span style={{ color: score >= 75 ? '#059669' : '#d97706' }}>%{Math.round(score)}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Active Profile Settings & Multi-Profile Sibling Switcher */}
            <div className="ln-card" style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <Users size={22} color="#0284c7" />
                <h3 style={{ fontSize: '1.2rem' }}>Kardeş & Aile Profilleri</h3>
              </div>

              <div className="ln-profile-grid">
                {vault.profiles.map((p) => {
                  const isActive = p.id === activeProfile.id;
                  return (
                    <button
                      key={p.id}
                      type="button"
                      className={`ln-profile-tile ${isActive ? 'is-active' : ''}`}
                      onClick={() => onSwitchProfile(p.id)}
                    >
                      <span style={{ fontSize: '2rem' }}>{p.avatarEmoji}</span>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontFamily: 'var(--ln-font-display)', fontWeight: 700, fontSize: '1.02rem' }}>
                          {p.name}
                        </div>
                        <div style={{ fontSize: '0.8rem', fontWeight: 800, color: 'var(--ln-ink-muted)' }}>
                          {AGE_MODE_LABELS[p.ageMode]} • {p.targetLang.toUpperCase()}
                        </div>
                      </div>
                      {isActive && <Check size={20} color="#0284c7" />}
                    </button>
                  );
                })}
              </div>

              {/* Active Profile Quick Controls */}
              <div
                style={{
                  padding: 18,
                  borderRadius: 20,
                  background: '#f8fafc',
                  border: '2px solid #e2e8f0',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 14,
                }}
              >
                <div style={{ fontWeight: 900, fontSize: '0.96rem' }}>
                  Aktif Profil Ayarları ({activeProfile.avatarEmoji} {activeProfile.name})
                </div>

                <div>
                  <div style={{ fontSize: '0.84rem', fontWeight: 800, color: 'var(--ln-ink-muted)', marginBottom: 6 }}>
                    Hedef Dil
                  </div>
                  <div className="ln-chip-group">
                    {(['en', 'de', 'es'] as const).map((lang) => (
                      <button
                        key={lang}
                        type="button"
                        className={`ln-chip-btn ${activeProfile.targetLang === lang ? 'is-selected' : ''}`}
                        onClick={() => onUpdateProfile({ ...activeProfile, targetLang: lang })}
                      >
                        {LANG_LABELS[lang]}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <div style={{ fontSize: '0.84rem', fontWeight: 800, color: 'var(--ln-ink-muted)', marginBottom: 6 }}>
                    Yaş ve Bilişsel Mod
                  </div>
                  <div className="ln-chip-group">
                    {(['mini', 'explorer', 'master'] as const).map((mode) => (
                      <button
                        key={mode}
                        type="button"
                        className={`ln-chip-btn ${activeProfile.ageMode === mode ? 'is-selected' : ''}`}
                        onClick={() => onUpdateProfile({ ...activeProfile, ageMode: mode })}
                      >
                        {AGE_MODE_LABELS[mode]}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="ln-chip-group">
                  <button
                    type="button"
                    className={`ln-chip-btn ${activeProfile.speechSlowMode ? 'is-selected' : ''}`}
                    onClick={() =>
                      onUpdateProfile({
                        ...activeProfile,
                        speechSlowMode: !activeProfile.speechSlowMode,
                      })
                    }
                  >
                    🐢 Yavaş & Net Telaffuz (0.78x): {activeProfile.speechSlowMode ? 'Açık' : 'Kapalı'}
                  </button>

                  <button
                    type="button"
                    className={`ln-chip-btn ${activeProfile.soundFxEnabled ? 'is-selected' : ''}`}
                    onClick={() =>
                      onUpdateProfile({
                        ...activeProfile,
                        soundFxEnabled: !activeProfile.soundFxEnabled,
                      })
                    }
                  >
                    <Volume2 size={15} style={{ verticalAlign: 'middle', marginRight: 6 }} />
                    Marimba Ses Efektleri: {activeProfile.soundFxEnabled ? 'Açık' : 'Kapalı'}
                  </button>
                </div>
              </div>

              {/* Create Sibling / New Profile Form */}
              <form
                onSubmit={handleCreateSubmit}
                style={{
                  padding: 18,
                  borderRadius: 20,
                  background: '#f0f9ff',
                  border: '2px solid #bae6fd',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 12,
                }}
              >
                <div style={{ fontWeight: 900, fontSize: '0.96rem' }}>➕ Yeni Kardeş / Öğrenen Profili Ekle</div>

                <div className="ln-chip-group">
                  {AVATAR_OPTIONS.map((emoji) => (
                    <button
                      key={emoji}
                      type="button"
                      className={`ln-chip-btn ${newAvatar === emoji ? 'is-selected' : ''}`}
                      onClick={() => setNewAvatar(emoji)}
                      aria-label={`Avatar ${emoji}`}
                    >
                      <span style={{ fontSize: '1.25rem' }}>{emoji}</span>
                    </button>
                  ))}
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 10 }}>
                  <input
                    type="text"
                    className="ln-input"
                    placeholder="İsim (örn. Zeynep 5 Yaş)"
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                  />
                  <select
                    className="ln-input"
                    value={newAgeMode}
                    onChange={(e) => setNewAgeMode(e.target.value as AgeMode)}
                    aria-label="Yaş modu seçimi"
                  >
                    <option value="mini">Mini (4-7 Yaş)</option>
                    <option value="explorer">Kaşif (8-14 Yaş)</option>
                    <option value="master">Usta (15+ Yaş)</option>
                  </select>
                  <select
                    className="ln-input"
                    value={newLang}
                    onChange={(e) => setNewLang(e.target.value as LanguageCode)}
                    aria-label="Hedef dil seçimi"
                  >
                    <option value="en">İngilizce (EN)</option>
                    <option value="de">Almanca (DE)</option>
                    <option value="es">İspanyolca (ES)</option>
                  </select>
                </div>

                <div>
                  <button
                    type="submit"
                    className="ln-clay-btn"
                    disabled={!newName.trim()}
                  >
                    <Plus size={19} />
                    <span>Yeni Profil Oluştur</span>
                  </button>
                </div>
              </form>
            </div>

            {/* KVKK / COPPA 100% Local-First Privacy Controls */}
            <div className="ln-privacy-zone">
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <ShieldCheck size={24} color="#059669" />
                <div>
                  <h3 style={{ fontSize: '1.12rem', color: '#065f46' }}>
                    KVKK & COPPA %100 Yerel Gizlilik Kasası
                  </h3>
                  <p style={{ margin: '2px 0 0', fontSize: '0.86rem', fontWeight: 700, color: '#047857' }}>
                    Ses kayıtları asla sunucuya gönderilmez; tüm ilerleme yalnızca bu cihazın yerel deposunda saklanır.
                  </p>
                </div>
              </div>

              <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'center' }}>
                <button type="button" className="ln-clay-btn ln-clay-btn--soft" onClick={handleDownloadBackup}>
                  <Download size={18} />
                  <span>JSON Yedeği İndir</span>
                </button>

                {!confirmErase ? (
                  <button
                    type="button"
                    className="ln-clay-btn ln-clay-btn--coral"
                    onClick={() => setConfirmErase(true)}
                  >
                    <Trash2 size={18} />
                    <span>Tüm Verileri Sil</span>
                  </button>
                ) : (
                  <div style={{ display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap' }}>
                    <span style={{ fontWeight: 800, color: '#9f1239', fontSize: '0.9rem' }}>
                      Emin misiniz?
                    </span>
                    <button
                      type="button"
                      className="ln-clay-btn ln-clay-btn--coral"
                      onClick={() => {
                        setConfirmErase(false);
                        onEraseAll();
                      }}
                    >
                      <span>Evet, Kalıcı Olarak Sil</span>
                    </button>
                    <button
                      type="button"
                      className="ln-clay-btn ln-clay-btn--soft"
                      onClick={() => setConfirmErase(false)}
                    >
                      <span>Vazgeç</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
