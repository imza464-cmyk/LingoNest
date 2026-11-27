import { describe, expect, it } from 'vitest';
import { ALL_VOCAB, LANGUAGE_META, PHONETIC_TRAPS, STORIES, VOCAB_BY_ID, WORLDS } from './curriculum';
import { ADULT_DIALOGUES, ADULT_ITEM_BY_ID, ADULT_MODULES, ALL_ADULT_ITEMS } from './adultCurriculum';
import { GRAMMAR_HANDBOOK_CHAPTERS } from './grammarHandbook';
import { ALL_VOCAB_BANK, VOCAB_CATEGORIES } from './vocabBank';
import { GRADED_STORIES } from './gradedStories';
import { createDefaultVault, mergeLingoVaults } from '../engine/storage';

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

  it('covers 14 multilingual Turkish-L1 phonetic traps (6 EN + 4 DE + 4 ES) with 3 minimal pairs each', () => {
    expect(PHONETIC_TRAPS).toHaveLength(14);
    const byLang = { en: 0, de: 0, es: 0 };
    for (const trap of PHONETIC_TRAPS) {
      const lang = trap.lang ?? 'en';
      byLang[lang] += 1;
      expect(trap.minimalPairs).toHaveLength(3);
      expect(trap.mouthCueTr.length).toBeGreaterThan(5);
    }
    expect(byLang).toEqual({ en: 6, de: 4, es: 4 });
  });

  it('contains 10 adult modules (80 trilingual phrases = 240 localized items) + 6 roleplay dialogues with valid cloze & traps', () => {
    expect(ADULT_MODULES).toHaveLength(10);
    expect(ALL_ADULT_ITEMS).toHaveLength(80);
    expect(Object.keys(ADULT_ITEM_BY_ID)).toHaveLength(80);
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

  it('provides 18 systematic A1-B2 trilingual grammar chapters with reference tables and practice questions', () => {
    expect(GRAMMAR_HANDBOOK_CHAPTERS).toHaveLength(18);
    const ids = new Set<string>();
    for (const ch of GRAMMAR_HANDBOOK_CHAPTERS) {
      expect(ids.has(ch.id)).toBe(false);
      ids.add(ch.id);
      expect(ch.sections.length).toBeGreaterThanOrEqual(2);
      expect(ch.rulesSummary.length).toBeGreaterThanOrEqual(3);
      expect(ch.turkishTraps.length).toBeGreaterThanOrEqual(2);
      for (const lang of ['en', 'de', 'es'] as const) {
        const comp = ch.langComparisons[lang];
        expect(comp.wrongCalque.length).toBeGreaterThan(3);
        expect(comp.naturalForm.length).toBeGreaterThan(3);
        expect(comp.ipa.startsWith('/')).toBe(true);
        expect(comp.structuralWhyTr.length).toBeGreaterThan(15);
        expect(ch.referenceTables[lang].rows.length).toBeGreaterThanOrEqual(4);
        expect(ch.practiceQuestions[lang].length).toBeGreaterThanOrEqual(2);
      }
    }
  });

  it('provides 240 structured A1-B2 vocabulary concepts across 12 categories and 8 graded short stories', () => {
    expect(VOCAB_CATEGORIES).toHaveLength(12);
    expect(ALL_VOCAB_BANK).toHaveLength(240);
    expect(GRADED_STORIES).toHaveLength(8);
    for (const st of GRADED_STORIES) {
      expect(st.paragraphs.length).toBeGreaterThanOrEqual(5);
      expect(st.questions.length).toBeGreaterThanOrEqual(2);
    }
  });

  it('merges concurrent local and cloud vaults non-destructively (OCC mergeLingoVaults)', () => {
    const base = createDefaultVault(true);
    const pId = base.profiles[0].id;
    const local = structuredClone(base);
    const remote = structuredClone(base);

    local.profiles[0].completedStories = ['story_animals'];
    local.profiles[0].cards['en:animals_cat'] = {
      itemId: 'animals_cat',
      lang: 'en',
      stability: 8.5,
      difficulty: 4.2,
      reps: 3,
      lapses: 0,
      lastReviewAt: 2000,
      dueAt: 9000,
      lastGrade: 3,
      speakingCompleted: true,
    };

    remote.profiles[0].completedStories = ['story_colors'];
    remote.profiles[0].cards['en:animals_dog'] = {
      itemId: 'animals_dog',
      lang: 'en',
      stability: 6.1,
      difficulty: 4.8,
      reps: 2,
      lapses: 0,
      lastReviewAt: 1800,
      dueAt: 8000,
      lastGrade: 3,
      speakingCompleted: false,
    };

    const merged = mergeLingoVaults(local, remote);
    const mergedProf = merged.profiles.find((p) => p.id === pId)!;
    expect(mergedProf.completedStories.sort()).toEqual(['story_animals', 'story_colors']);
    expect(mergedProf.cards['en:animals_cat']?.reps).toBe(3);
    expect(mergedProf.cards['en:animals_dog']?.reps).toBe(2);
  });
});
