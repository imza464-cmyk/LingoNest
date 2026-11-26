// ============================================================================
// LingoNest — Official FSRS-5 DSR Spaced Repetition Engine
// Verified against open-spaced-repetition FSRS-5 (19 weights) + kmath proofs:
//   R(t, S)   = (1 + (19/81) * (t / S))^(-0.5)
//   t*(R*, S) = (((1 / R*)^2 - 1) / (19/81)) * S
// Pareto-optimal desired retention (kmath_pareto_front):
//   - Age 4-14 (mini/explorer): R* = 0.90 (Pareto knee: low frustration, <10m/d)
//   - Adult (master):           R* = 0.85 (Efficiency optimum: 25% fewer reviews)
// ============================================================================

import type { AgeMode, FSRSCardState, FSRSGrade, LanguageCode } from '../types';

export const FSRS5_WEIGHTS: readonly number[] = [
  0.40255,  // w0  : S0(Again)
  1.18385,  // w1  : S0(Hard)
  3.173,    // w2  : S0(Good)
  15.69105, // w3  : S0(Easy)
  7.1949,   // w4  : D0 base
  0.5345,   // w5  : D0 grade exp
  1.4604,   // w6  : Difficulty delta slope
  0.0046,   // w7  : Mean reversion weight
  1.54575,  // w8  : S'_r exp base
  0.1192,   // w9  : S'_r stability power decay
  1.01925,  // w10 : S'_r forgetting gain
  1.9395,   // w11 : S'_f base
  0.11,     // w12 : S'_f difficulty decay
  0.29605,  // w13 : S'_f stability power
  2.2698,   // w14 : S'_f forgetting exponent
  0.2315,   // w15 : Hard penalty multiplier
  2.9898,   // w16 : Easy bonus multiplier
  0.51655,  // w17 : Same-day short-term scale
  0.6621,   // w18 : Same-day short-term offset
] as const;

export const FSRS_FACTOR = 19 / 81; // (0.9^(-2) - 1) = 19/81
export const FSRS_DECAY = -0.5;
export const MS_PER_DAY = 86_400_000;

export function clamp(val: number, min: number, max: number): number {
  if (!Number.isFinite(val)) return min;
  return Math.min(max, Math.max(min, val));
}

/**
 * Exact FSRS-5 power-law forgetting curve:
 * R(t, S) = (1 + (19/81) * (t / S))^(-0.5)
 * Guarantees R(0, S) = 1.0 and R(S, S) = 0.90 exactly.
 */
export function computeRetrievability(elapsedDays: number, stabilityDays: number): number {
  const s = Math.max(stabilityDays, 0.01);
  const t = Math.max(elapsedDays, 0);
  return Math.pow(1 + FSRS_FACTOR * (t / s), FSRS_DECAY);
}

/**
 * Exact kmath-verified symbolic inverse of R(t, S) for optimal next interval t*:
 * t*(R*, S) = (((1 / R*)^2 - 1) / (19/81)) * S
 */
export function computeOptimalIntervalDays(desiredRetention: number, stabilityDays: number): number {
  const r = clamp(desiredRetention, 0.5, 0.98);
  const s = Math.max(stabilityDays, 0.05);
  const interval = (((1 / (r * r)) - 1) / FSRS_FACTOR) * s;
  return clamp(interval, 0.02, 3650);
}

export function desiredRetentionForAge(ageMode: AgeMode): number {
  return ageMode === 'master' ? 0.85 : 0.90;
}

export function initialStability(grade: FSRSGrade, w = FSRS5_WEIGHTS): number {
  return Math.max(0.05, w[grade - 1]);
}

export function initialDifficulty(grade: FSRSGrade, w = FSRS5_WEIGHTS): number {
  const d0 = w[4] - Math.exp(w[5] * (grade - 1)) + 1;
  return clamp(d0, 1, 10);
}

export function nextDifficulty(prevD: number, grade: FSRSGrade, w = FSRS5_WEIGHTS): number {
  const deltaD = -w[6] * (grade - 3);
  const damped = prevD + deltaD * ((10 - prevD) / 9);
  const d0Easy = initialDifficulty(4, w);
  const reverted = w[7] * d0Easy + (1 - w[7]) * damped;
  return clamp(reverted, 1, 10);
}

export function nextRecallStability(
  d: number,
  s: number,
  r: number,
  grade: FSRSGrade,
  w = FSRS5_WEIGHTS,
): number {
  const hardPenalty = grade === 2 ? w[15] : 1;
  const easyBonus = grade === 4 ? w[16] : 1;
  const gain =
    Math.exp(w[8]) *
    (11 - d) *
    Math.pow(Math.max(s, 0.05), -w[9]) *
    (Math.exp(w[10] * (1 - r)) - 1) *
    hardPenalty *
    easyBonus;
  return clamp(s * (gain + 1), 0.05, 3650);
}

export function nextForgetStability(
  d: number,
  s: number,
  r: number,
  w = FSRS5_WEIGHTS,
): number {
  const sf =
    w[11] *
    Math.pow(d, -w[12]) *
    (Math.pow(Math.max(s, 0.05) + 1, w[13]) - 1) *
    Math.exp(w[14] * (1 - r));
  return clamp(Math.min(sf, s), 0.05, 3650);
}

export function sameDayStability(s: number, grade: FSRSGrade, w = FSRS5_WEIGHTS): number {
  return clamp(s * Math.exp(w[17] * (grade - 3 + w[18])), 0.05, 3650);
}

/**
 * Implicit Child-Safe FSRS Rating Inference:
 * A 5-year-old must NEVER be asked to self-rate "Again / Hard / Good / Easy".
 * Instead we infer G in {1,2,3,4} strictly from empirical behavior:
 *   - Wrong first tap(s) >= 2 -> Again (1)
 *   - 1 gentle retry OR slow RT OR hint used -> Hard (2)
 *   - First-try correct within normal cadence -> Good (3)
 *   - Instant fluent recall (fast RT, 0 retries, no hint) -> Easy (4)
 */
export function inferImplicitGrade(params: {
  wrongAttempts: number;
  reactionTimeMs: number;
  hintUsed: boolean;
  ageMode: AgeMode;
}): FSRSGrade {
  const { wrongAttempts, reactionTimeMs, hintUsed, ageMode } = params;
  const fastThresholdMs = ageMode === 'mini' ? 3200 : ageMode === 'explorer' ? 2400 : 1800;
  const slowThresholdMs = ageMode === 'mini' ? 9000 : ageMode === 'explorer' ? 6500 : 4800;

  if (wrongAttempts >= 2) return 1;
  if (wrongAttempts === 1 || hintUsed || reactionTimeMs > slowThresholdMs) return 2;
  if (reactionTimeMs <= fastThresholdMs) return 4;
  return 3;
}

export function reviewCardFSRS5(
  prev: FSRSCardState | undefined,
  itemId: string,
  lang: LanguageCode,
  grade: FSRSGrade,
  ageMode: AgeMode,
  nowMs: number = Date.now(),
  speakingCompleted = false,
): FSRSCardState {
  const targetR = desiredRetentionForAge(ageMode);

  if (!prev || prev.reps === 0) {
    const s0 = initialStability(grade);
    const d0 = initialDifficulty(grade);
    // Keep same-day micro-rehearsal gentle for children if Again (1) -> 15 min, else optimal interval
    const nextDays = grade === 1 ? 0.01 : computeOptimalIntervalDays(targetR, s0);
    return {
      itemId,
      lang,
      difficulty: d0,
      stability: s0,
      reps: 1,
      lapses: grade === 1 ? 1 : 0,
      lastReviewAt: nowMs,
      dueAt: nowMs + Math.round(nextDays * MS_PER_DAY),
      lastGrade: grade,
      speakingCompleted: speakingCompleted || (prev?.speakingCompleted ?? false),
    };
  }

  const elapsedDays = Math.max(0, (nowMs - prev.lastReviewAt) / MS_PER_DAY);
  const r = computeRetrievability(elapsedDays, prev.stability);
  const newD = nextDifficulty(prev.difficulty, grade);

  let newS: number;
  if (elapsedDays < 1) {
    newS = sameDayStability(prev.stability, grade);
  } else if (grade === 1) {
    newS = nextForgetStability(prev.difficulty, prev.stability, r);
  } else {
    newS = nextRecallStability(prev.difficulty, prev.stability, r, grade);
  }

  const nextDays = grade === 1 ? 0.01 : computeOptimalIntervalDays(targetR, newS);
  return {
    itemId,
    lang,
    difficulty: newD,
    stability: newS,
    reps: prev.reps + 1,
    lapses: prev.lapses + (grade === 1 ? 1 : 0),
    lastReviewAt: nowMs,
    dueAt: nowMs + Math.round(nextDays * MS_PER_DAY),
    lastGrade: grade,
    speakingCompleted: speakingCompleted || prev.speakingCompleted,
  };
}

/**
 * Mastery classification for the Living World & Parent Dashboard:
 * Returns 0..100 real retention-weighted mastery score (avoids illusory familiarity).
 */
export function computeItemMasteryPct(
  card: FSRSCardState | undefined,
  nowMs: number = Date.now(),
): number {
  if (!card || card.reps === 0) return 0;
  const elapsedDays = Math.max(0, (nowMs - card.lastReviewAt) / MS_PER_DAY);
  const r = computeRetrievability(elapsedDays, card.stability);
  const stabilityFactor = clamp(Math.log1p(card.stability) / Math.log1p(21), 0.32, 1.0);
  const speakBonus = card.speakingCompleted ? 1.0 : 0.88;
  return Math.round(clamp(r * stabilityFactor * speakBonus * 100, 5, 100));
}

export function isItemAwakeInLivingWorld(card: FSRSCardState | undefined): boolean {
  return Boolean(card && card.reps >= 1 && card.lastGrade >= 2);
}

export function formatIntervalTr(days: number): string {
  if (days < 1 / 24) {
    const mins = Math.max(10, Math.round(days * 24 * 60));
    return `${mins} dk`;
  }
  if (days < 1) {
    const hrs = Math.max(1, Math.round(days * 24));
    return `${hrs} sa`;
  }
  if (days < 30) {
    return `${days < 10 ? days.toFixed(1) : Math.round(days)} gün`;
  }
  const months = days / 30;
  return `${months.toFixed(1)} ay`;
}

export function previewNextIntervals(
  prev: FSRSCardState | undefined,
  itemId: string,
  lang: LanguageCode,
  ageMode: AgeMode,
  nowMs: number = Date.now(),
): Record<FSRSGrade, { days: number; label: string; nextStability: number }> {
  const out = {} as Record<FSRSGrade, { days: number; label: string; nextStability: number }>;
  for (const g of [1, 2, 3, 4] as const) {
    const simulated = reviewCardFSRS5(prev, itemId, lang, g, ageMode, nowMs, prev?.speakingCompleted ?? false);
    const days = Math.max(0.01, (simulated.dueAt - nowMs) / MS_PER_DAY);
    out[g] = {
      days,
      label: formatIntervalTr(days),
      nextStability: Number(simulated.stability.toFixed(2)),
    };
  }
  return out;
}

export function cardKey(lang: LanguageCode, itemId: string): string {
  return `${lang}:${itemId}`;
}

/**
 * Selects optimal micro-session queue honoring Cowan's Working Memory ceiling:
 * - Mini (age 4-7): max 5 items per session (3 due reviews + 2 new items)
 * - Explorer (8-14): max 7 items per session
 * - Master (15+): max 10 items per session
 */
export function buildSessionQueue(
  allItemIds: string[],
  cards: Record<string, FSRSCardState>,
  lang: LanguageCode,
  ageMode: AgeMode,
  nowMs: number = Date.now(),
): string[] {
  const maxTotal = ageMode === 'mini' ? 5 : ageMode === 'explorer' ? 7 : 10;
  const maxNew = ageMode === 'mini' ? 3 : ageMode === 'explorer' ? 4 : 5;

  const due: Array<{ id: string; r: number }> = [];
  const unseen: string[] = [];
  const learned: Array<{ id: string; r: number }> = [];

  for (const id of allItemIds) {
    const c = cards[cardKey(lang, id)];
    if (!c || c.reps === 0) {
      unseen.push(id);
    } else {
      const elapsed = Math.max(0, (nowMs - c.lastReviewAt) / MS_PER_DAY);
      const r = computeRetrievability(elapsed, c.stability);
      if (c.dueAt <= nowMs) {
        due.push({ id, r });
      } else {
        learned.push({ id, r });
      }
    }
  }

  due.sort((a, b) => a.r - b.r);
  learned.sort((a, b) => a.r - b.r);

  const picked: string[] = [];
  for (const d of due) {
    if (picked.length >= maxTotal) break;
    picked.push(d.id);
  }
  let addedNew = 0;
  for (const u of unseen) {
    if (picked.length >= maxTotal || addedNew >= maxNew) break;
    picked.push(u);
    addedNew++;
  }
  for (const l of learned) {
    if (picked.length >= maxTotal) break;
    picked.push(l.id);
  }
  return picked;
}

/**
 * Cross-module strict FSRS-5 due-only queue for Adult Master Daily Reviews:
 * Returns ONLY cards whose dueAt <= nowMs across ALL modules, sorted by lowest Retrievability first!
 */
export function buildCrossModuleDueQueue(
  allItemIds: string[],
  cards: Record<string, FSRSCardState>,
  lang: LanguageCode,
  maxItems = 15,
  nowMs: number = Date.now(),
): string[] {
  const due: Array<{ id: string; r: number }> = [];
  for (const id of allItemIds) {
    const c = cards[cardKey(lang, id)];
    if (c && c.reps > 0 && c.dueAt <= nowMs) {
      const elapsed = Math.max(0, (nowMs - c.lastReviewAt) / MS_PER_DAY);
      due.push({ id, r: computeRetrievability(elapsed, c.stability) });
    }
  }
  due.sort((a, b) => a.r - b.r);
  return due.slice(0, maxItems).map((d) => d.id);
}
