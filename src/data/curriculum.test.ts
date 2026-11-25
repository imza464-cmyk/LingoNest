import { describe, expect, it } from 'vitest';
import { ALL_VOCAB, LANGUAGE_META, PHONETIC_TRAPS, STORIES, VOCAB_BY_ID, WORLDS } from './curriculum';
import { ADULT_DIALOGUES, ADULT_ITEM_BY_ID, ADULT_MODULES, ALL_ADULT_ITEMS } from './adultCurriculum';

describe('LingoNest Curriculum Data Integrity', () => {
  it('contains 6 worlds x 10 items = 60 unique trilingual vocab concepts', () => {
    expect(WORLDS).toHaveLength(6);
    expect(ALL_VOCAB).toHaveLength(60);
    expect(Object.keys(VOCAB_BY_ID)).toHaveLength(60);
    expect(Object.keys(LANGUAGE_META).sort()).toEqual(['de', 'en', 'es']);

    for (const w of WORLDS) {
      expect(w.items).toHaveLength(10);
      for (const item of w.items) {
        expect(item.worldId).toBe(w.id);
        expect(item.livingPos.x).toBeGreaterThanOrEqual(10);
        expect(item.livingPos.x).toBeLessThanOrEqual(90);
        expect(item.livingPos.y).toBeGreaterThanOrEqual(20);
        expect(item.livingPos.y).toBeLessThanOrEqual(88);
        for (const lang of ['en', 'de', 'es'] as const) {
          const phrase = item.langs[lang];
          expect(phrase.word.length).toBeGreaterThan(0);
          expect(phrase.bareWord.length).toBeGreaterThan(0);
          expect(phrase.microSentence.length).toBeGreaterThan(3);
          expect(phrase.svoChunks).toHaveLength(3);
        }
        // Guard against broken article errors in English
        expect(item.langs.en.word.toLowerCase()).not.toMatch(/\ba (apple|egg|elephant|orange)\b/);
      }
    }
  });

  it('has 6 valid interactive stories with StoryQuiz IDs present in VOCAB_BY_ID', () => {
    expect(STORIES).toHaveLength(6);
    expect(STORIES[0].requiredMasteredCount).toBe(0);
    for (const story of STORIES) {
      expect(story.lines.length).toBeGreaterThanOrEqual(5);
      expect(VOCAB_BY_ID[story.quiz.correctVocabId]).toBeDefined();
      expect(story.quiz.distractorVocabIds).toHaveLength(2);
      for (const d of story.quiz.distractorVocabIds) {
        expect(VOCAB_BY_ID[d]).toBeDefined();
        expect(d).not.toBe(story.quiz.correctVocabId);
      }
    }
  });

  it('covers all 6 Turkish L1 phonetic traps with 3 minimal pairs each', () => {
    expect(PHONETIC_TRAPS).toHaveLength(6);
    for (const trap of PHONETIC_TRAPS) {
      expect(trap.minimalPairs).toHaveLength(3);
      expect(trap.mouthCueTr.length).toBeGreaterThan(5);
    }
  });

  it('contains 6 adult modules x 10 trilingual phrases + 6 roleplay dialogues with valid cloze & traps', () => {
    expect(ADULT_MODULES).toHaveLength(6);
    expect(ALL_ADULT_ITEMS).toHaveLength(60);
    expect(Object.keys(ADULT_ITEM_BY_ID)).toHaveLength(60);
    for (const item of ALL_ADULT_ITEMS) {
      expect(item.turkishTrapTr.length).toBeGreaterThan(10);
      for (const lang of ['en', 'de', 'es'] as const) {
        const loc = item.langs[lang];
        expect(loc.clozeSentence).toContain('___');
        expect(loc.clozeAnswer.length).toBeGreaterThan(0);
        expect(loc.wordOrderChunks.length).toBeGreaterThanOrEqual(4);
      }
    }
    expect(ADULT_DIALOGUES).toHaveLength(6);
    for (const dlg of ADULT_DIALOGUES) {
      expect(dlg.turns).toHaveLength(6);
      const learnerTurns = dlg.turns.filter((t) => t.speaker === 'learner');
      expect(learnerTurns).toHaveLength(3);
      for (const lt of learnerTurns) {
        expect(lt.options).toHaveLength(3);
        expect(lt.options?.filter((o) => o.isBest)).toHaveLength(1);
      }
    }
  });
});
