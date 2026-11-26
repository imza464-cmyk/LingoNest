import { describe, expect, it } from 'vitest';
import {
  buildCrossModuleDueQueue,
  buildSessionQueue,
  cardKey,
  computeItemMasteryPct,
  computeOptimalIntervalDays,
  computeRetrievability,
  desiredRetentionForAge,
  inferImplicitGrade,
  MS_PER_DAY,
  previewNextIntervals,
  reviewCardFSRS5,
} from './fsrs5';
import { hashAudioKey, matchSpokenAttempt, phoneticSkeleton } from './audioEngine';
import { createDefaultVault, exportVaultJson, importVaultJson } from './storage';
import { TR_VOICE } from '../data/voiceScripts';

describe('FSRS-5 DSR Mathematical Invariants (kmath verified)', () => {
  it('satisfies R(0, S) = 1 and R(S, S) = 0.90 exactly', () => {
    expect(computeRetrievability(0, 5)).toBeCloseTo(1.0, 10);
    expect(computeRetrievability(5, 5)).toBeCloseTo(0.9, 10);
    expect(computeRetrievability(14.5, 14.5)).toBeCloseTo(0.9, 10);
  });

  it('inverts R(t, S) cleanly: R(t*(R*, S), S) === R*', () => {
    for (const targetR of [0.8, 0.85, 0.9, 0.92]) {
      for (const s of [0.5, 3.173, 15.69]) {
        const tOpt = computeOptimalIntervalDays(targetR, s);
        const rCheck = computeRetrievability(tOpt, s);
        expect(rCheck).toBeCloseTo(targetR, 6);
      }
    }
  });

  it('grows stability monotonically on recall and drops on lapse', () => {
    const t0 = 1_700_000_000_000;
    const c1 = reviewCardFSRS5(undefined, 'animals_cat', 'en', 3, 'mini', t0, true);
    expect(c1.stability).toBeCloseTo(3.173, 3);
    expect(desiredRetentionForAge('mini')).toBe(0.9);
    expect(desiredRetentionForAge('master')).toBe(0.85);

    const c2 = reviewCardFSRS5(c1, 'animals_cat', 'en', 3, 'mini', t0 + 3 * MS_PER_DAY, true);
    expect(c2.stability).toBeGreaterThan(c1.stability);

    const cLapse = reviewCardFSRS5(c2, 'animals_cat', 'en', 1, 'mini', t0 + 10 * MS_PER_DAY, true);
    expect(cLapse.stability).toBeLessThan(c2.stability);
    expect(cLapse.lapses).toBe(1);
  });

  it('infers implicit child grades without asking 5-year-olds to self-rate', () => {
    expect(inferImplicitGrade({ wrongAttempts: 0, reactionTimeMs: 1800, hintUsed: false, ageMode: 'mini' })).toBe(4);
    expect(inferImplicitGrade({ wrongAttempts: 0, reactionTimeMs: 5000, hintUsed: false, ageMode: 'mini' })).toBe(3);
    expect(inferImplicitGrade({ wrongAttempts: 1, reactionTimeMs: 3000, hintUsed: false, ageMode: 'mini' })).toBe(2);
    expect(inferImplicitGrade({ wrongAttempts: 2, reactionTimeMs: 4000, hintUsed: false, ageMode: 'mini' })).toBe(1);
  });

  it('respects Cowan Age-5 session working-memory ceiling (<= 5 items in mini mode)', () => {
    const ids = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
    const queue = buildSessionQueue(ids, {}, 'en', 'mini', Date.now());
    expect(queue.length).toBeLessThanOrEqual(5);
    expect(queue.length).toBe(3); // maxNew = 3 for mini mode when all unseen
  });

  it('awards higher mastery when spoken production is completed', () => {
    const now = Date.now();
    const silent = reviewCardFSRS5(undefined, 'animals_dog', 'en', 3, 'mini', now, false);
    const spoken = reviewCardFSRS5(undefined, 'animals_dog', 'en', 3, 'mini', now, true);
    expect(computeItemMasteryPct(spoken, now)).toBeGreaterThan(computeItemMasteryPct(silent, now));
  });

  it('previews strictly ordered FSRS-5 next intervals across grades 1 < 2 < 3 < 4', () => {
    const now = Date.now();
    const p = previewNextIntervals(undefined, 'daily_1', 'en', 'master', now);
    expect(p[1].days).toBeLessThan(p[2].days);
    expect(p[2].days).toBeLessThan(p[3].days);
    expect(p[3].days).toBeLessThan(p[4].days);
    expect(p[1].label).toContain('dk');
    expect(p[3].label).toContain('gün');
  });
});

describe('Child-Forgiving Turkish-L1 Phonetic Speech Matcher', () => {
  it('accepts exact and child-approximated Turkish L1 utterances', () => {
    expect(phoneticSkeleton('think')).toBe('tank');
    expect(phoneticSkeleton('tink')).toBe('tank');

    const childCat = matchSpokenAttempt('a cat', 'cat', ['ket'], true);
    expect(childCat.matched).toBe(true);

    const childWet = matchSpokenAttempt('water', 'water', ['vater'], true);
    expect(childWet.matched).toBe(true);

    const wrong = matchSpokenAttempt('an elephant', 'elephant', ['banana'], true);
    expect(wrong.matched).toBe(false);
  });

  it('matches Python neural audio pack hashes bit-for-bit including Turkish UTF-8', () => {
    expect(hashAudioKey('en', 'warm', 'a cat')).toBe('3670799ccb587ac6');
    expect(hashAudioKey('tr', 'warm', TR_VOICE.welcomeMini)).toBe('67158f8d1954222a');
  });
});

describe('Cross-Module Due Queue & Vault Import/Export Integrity', () => {
  it('returns ONLY due cards across modules ordered by lowest retrievability', () => {
    const t0 = 1_700_000_000_000;
    const dueCardEarly = reviewCardFSRS5(undefined, 'item_a', 'en', 2, 'master', t0, true);
    const dueCardLater = reviewCardFSRS5(undefined, 'item_b', 'en', 3, 'master', t0, true);
    const notDueCard = reviewCardFSRS5(undefined, 'item_c', 'en', 4, 'master', t0, true);

    const cards = {
      [cardKey('en', 'item_a')]: dueCardEarly,
      [cardKey('en', 'item_b')]: dueCardLater,
      [cardKey('en', 'item_c')]: notDueCard,
    };

    // 6 days later: for master (R*=0.85), item_a (Hard, interval ~2.1d) & item_b (Good, interval ~5.2d) are due; item_c (Easy, interval ~25.7d) is not due; item_d is unseen
    const now = t0 + 6 * MS_PER_DAY;
    const queue = buildCrossModuleDueQueue(['item_a', 'item_b', 'item_c', 'item_d'], cards, 'en', 15, now);
    expect(queue).toEqual(['item_a', 'item_b']);
    expect(queue).not.toContain('item_c');
    expect(queue).not.toContain('item_d');
  });

  it('validates exported vault backups cleanly and rejects malformed payloads', () => {
    const vault = createDefaultVault(true);
    const exported = exportVaultJson(vault);
    const restored = importVaultJson(exported);
    expect(restored.ok).toBe(true);
    if (restored.ok) {
      expect(restored.vault.profiles).toHaveLength(vault.profiles.length);
      expect(restored.vault.onboardingDone).toBe(true);
    }

    expect(importVaultJson('not-valid-json').ok).toBe(false);
    expect(importVaultJson(JSON.stringify({ profiles: [] })).ok).toBe(false);
  });
});
