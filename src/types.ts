// ============================================================================
// LingoNest — Single Source of Truth (SSOT) Domain Types
// ============================================================================

export type LanguageCode = 'en' | 'de' | 'es';

export type AgeMode = 'mini' | 'explorer' | 'master';
// mini     : 4-7 yrs (Zero-Text Pre-Literate, 100% Audio-Visual-TPR, max 3 choices, R*=0.90)
// explorer : 8-14 yrs (Audio-First + Post-Audio Text Reveal + SVO Block Builder + Stories, R*=0.90)
// master   : 15+ yrs (Full FSRS-5 Metrics + Turkish L1 Contrastive Lab + Production + Multi-Lang, R*=0.85)

export type AppView = 'worlds' | 'play' | 'living-world' | 'stories' | 'graded-stories' | 'vocab' | 'phonetics' | 'adult-practice' | 'adult-dialogues' | 'handbook';

export type CEFRLevel = 'A2' | 'B1' | 'B2';

export interface AdultLocalizedItem {
  phrase: string;
  clozeSentence: string;    // Contains "___" where clozeAnswer goes
  clozeAnswer: string;      // Exact missing target word/phrase for active production
  ipa: string;
  exampleDialogue: string;  // Realistic spoken response line
  wordOrderChunks: string[]; // 4-5 syntax chunks to drill SOV -> SVO / clause order
}

export interface AdultPhraseItem {
  id: string;
  moduleId: string;
  cefr: CEFRLevel;
  turkishMeaning: string;
  turkishTrapTr: string;    // Contrastive Turkish L1 pitfall explanation
  contextTagTr: string;     // e.g. "Toplantı", "Havalimanı", "Günlük"
  langs: Record<LanguageCode, AdultLocalizedItem>;
}

export interface AdultModule {
  id: string;
  order: number;
  titleTr: string;
  subtitleTr: string;
  icon: string;
  cefrRange: string;
  accentHex: string;
  items: AdultPhraseItem[];
}

export interface AdultDialogueOption {
  text: Record<LanguageCode, string>;
  turkishHint: string;
  isBest: boolean;
  feedbackTr: string;
}

export interface AdultDialogueTurn {
  speaker: 'partner' | 'learner';
  roleTr: string;
  avatar: string;
  text: Record<LanguageCode, string>;
  turkishGloss: string;
  options?: AdultDialogueOption[]; // Present when speaker === 'learner'
}

export interface AdultDialogue {
  id: string;
  moduleId: string;
  titleTr: string;
  scenarioTr: string;
  cefr: CEFRLevel;
  icon: string;
  turns: AdultDialogueTurn[];
}

export type FSRSGrade = 1 | 2 | 3 | 4; // 1=Again, 2=Hard, 3=Good, 4=Easy

export type MascotMood = 'idle' | 'speaking' | 'listening' | 'celebrating' | 'encouraging' | 'thinking';

export interface LocalizedPhrase {
  word: string;          // e.g. "a cat" / "eine Katze" / "un gato"
  bareWord: string;      // e.g. "cat" / "Katze" / "gato" (for ASR fuzzy match)
  ipa: string;           // e.g. "/kæt/"
  microSentence: string; // 100% natural native i+1 sentence e.g. "I see a happy cat!"
  svoChunks: [string, string, string]; // [Subject, Verb, Object] visual syntax blocks
  phoneticHintTr?: string; // Optional Turkish L1 pronunciation nudge
  trapPhoneme?: string;  // e.g. "/æ/" | "/θ/" | "/ð/" | "/w/" | "/ŋ/" | "/ə/"
}

export interface VocabItem {
  id: string;            // Stable globally unique ID e.g. "animals_cat"
  worldId: string;
  emoji: string;         // Large visual emblem
  bgColor: string;       // Soft warm pastel/jewel tile background
  accentColor: string;   // High-contrast tactile accent
  soundOnomatopoeia: string; // Playful sound cue e.g. "Meow!" / "Splash!"
  turkishMeaning: string;    // Shown ONLY in Parent Tooltip / Explorer post-reveal / Master mode
  tprActionTr: string;       // Concrete physical gesture in Turkish e.g. "Kedi gibi pati at!"
  tprEmoji: string;
  livingPos: { x: number; y: number }; // % position inside Living World SVG meadow/scene
  langs: Record<LanguageCode, LocalizedPhrase>;
}

export interface WorldData {
  id: string;
  order: number;
  titleTr: string;
  subtitleTr: string;
  emoji: string;
  gradient: [string, string];
  sceneTheme: 'meadow' | 'rainbow' | 'kitchen' | 'family' | 'playroom' | 'castle';
  items: VocabItem[];
}

export interface StoryLine {
  speakerEmoji: string;
  speakerName: string;
  sceneEmoji: string;
  highlightVocabId?: string;
  text: Record<LanguageCode, string>;
  turkishGloss: string;
}

export interface StoryQuiz {
  promptAudio: Record<LanguageCode, string>;
  promptTr: string;
  correctVocabId: string;
  distractorVocabIds: [string, string]; // Max 3 total choices (Age-5 Cowan WM invariant!)
}

export interface StoryData {
  id: string;
  worldId: string;
  titleTr: string;
  titleTarget: Record<LanguageCode, string>;
  coverEmoji: string;
  gradient: [string, string];
  requiredMasteredCount: number; // 0 for first story so child can immediately experience a story!
  lines: StoryLine[];
  quiz: StoryQuiz;
}

export interface PhoneticTrap {
  id: string;
  lang?: LanguageCode;   // Defaults to 'en' when omitted; supports 'en' | 'de' | 'es'
  symbol: string;        // "/θ/", "/ð/", "/æ/", "/w/", "/ŋ/", "/ə/", etc.
  titleTr: string;
  whyHardForTurkishTr: string;
  mouthCueTr: string;
  visemeType: 'dental_voiceless' | 'dental_voiced' | 'open_front' | 'rounded_glide' | 'velar_nasal' | 'schwa_relaxed';
  minimalPairs: Array<{
    targetWord: string;
    targetIpa: string;
    targetEmoji: string;
    targetTr: string;
    contrastWord: string;
    contrastIpa: string;
    contrastEmoji: string;
    contrastTr: string;
  }>;
  practiceSentence: string;
}

export interface FSRSCardState {
  itemId: string;
  lang: LanguageCode;
  difficulty: number;     // D in [1, 10]
  stability: number;      // S in days (>= 0.05)
  reps: number;
  lapses: number;
  lastReviewAt: number;   // epoch ms
  dueAt: number;          // epoch ms
  lastGrade: FSRSGrade;
  speakingCompleted: boolean;
}

export interface DailyActivity {
  dateKey: string;        // YYYY-MM-DD
  minutes: number;
  reviews: number;
  wordsMastered: number;
}

export interface LearnerProfile {
  id: string;
  name: string;
  avatarEmoji: string;
  ageMode: AgeMode;
  targetLang: LanguageCode;
  speechSlowMode: boolean; // true = 0.80x child-friendly clear cadence
  soundFxEnabled: boolean;
  dailyGoalMinutes?: number; // 5 (mini), 10 (explorer), 15 (master)
  cards: Record<string, FSRSCardState>; // key = `${lang}:${itemId}`
  completedStories: string[];
  phoneticScores: Record<string, number>; // trapId -> 0..100
  dailyLog: Record<string, DailyActivity>;
  createdAt: number;
}
