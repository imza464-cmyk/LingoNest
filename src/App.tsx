import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  BarChart3,
  BookOpen,
  Ear,
  Globe,
  Home,
  MessageSquare,
  ShieldCheck,
  Sparkles,
  Volume2,
  VolumeX,
  Zap,
} from 'lucide-react';
import type { AgeMode, AppView, FSRSGrade, LanguageCode, LearnerProfile } from './types';
import {
  ALL_VOCAB,
  getWorldById,
  LANGUAGE_META,
  PHONETIC_TRAPS,
  STORIES,
  VOCAB_BY_ID,
  WORLDS,
} from './data/curriculum';
import {
  ADULT_DIALOGUES,
  ADULT_MODULES,
  getAdultModuleById,
} from './data/adultCurriculum';
import { audioEngine } from './engine/audioEngine';
import { cardKey, isItemAwakeInLivingWorld, reviewCardFSRS5 } from './engine/fsrs5';
import {
  createProfile,
  eraseVaultCompletely,
  loadVault,
  saveVault,
  todayDateKey,
  type VaultState,
} from './engine/storage';
import { AgeModeSwitcher } from './components/AgeModeSwitcher';
import { WorldMapView } from './components/WorldMapView';
import { PlaySessionView } from './components/PlaySessionView';
import { LivingWorldScene } from './components/LivingWorldScene';
import { StoryTheaterView } from './components/StoryTheaterView';
import { PhoneticLabView } from './components/PhoneticLabView';
import { AdultStudioView } from './components/AdultStudioView';
import { AdultPracticeView } from './components/AdultPracticeView';
import { AdultDialogueView } from './components/AdultDialogueView';
import { ParentDashboardModal } from './components/ParentDashboardModal';

const AGE_BADGE: Record<AgeMode, { emoji: string; label: string }> = {
  mini: { emoji: '🐣', label: 'Mini (4–7)' },
  explorer: { emoji: '🧭', label: 'Kaşif (8–14)' },
  master: { emoji: '🎓', label: 'Usta (15+)' },
};

const THEME_COLOR_BY_MODE: Record<AgeMode, string> = {
  mini: '#EEF8FF',
  explorer: '#EEF2FF',
  master: '#090E1A',
};

export function App() {
  const [vault, setVault] = useState<VaultState>(() => loadVault());
  const [view, setView] = useState<AppView>('worlds');
  const [activeWorldId, setActiveWorldId] = useState<string>(WORLDS[0]?.id ?? 'animals');
  const [activeAdultModuleId, setActiveAdultModuleId] = useState<string>(
    ADULT_MODULES[0]?.id ?? 'daily_fluency',
  );
  const [showParentModal, setShowParentModal] = useState(false);

  useEffect(() => {
    saveVault(vault);
  }, [vault]);

  const activeProfile: LearnerProfile = useMemo(() => {
    return vault.profiles.find((p) => p.id === vault.activeProfileId) ?? vault.profiles[0];
  }, [vault]);

  // Synchronize document body theme, meta theme-color, and native Android bridge
  useEffect(() => {
    if (typeof document !== 'undefined') {
      document.body.dataset.ageMode = activeProfile.ageMode;
      const themeMeta = document.querySelector('meta[name="theme-color"]');
      if (themeMeta) {
        themeMeta.setAttribute('content', THEME_COLOR_BY_MODE[activeProfile.ageMode]);
      }
    }
    if (typeof window !== 'undefined') {
      (
        window as unknown as { AndroidBridge?: { setThemeMode?: (m: string) => void } }
      ).AndroidBridge?.setThemeMode?.(activeProfile.ageMode);
    }
  }, [activeProfile.ageMode]);

  // Register Android hardware/gesture back handler
  useEffect(() => {
    if (typeof window === 'undefined') return undefined;
    const win = window as unknown as { __lingonestGoBack?: () => boolean };
    win.__lingonestGoBack = () => {
      if (showParentModal) {
        setShowParentModal(false);
        return true;
      }
      if (view !== 'worlds') {
        audioEngine.stopSpeaking();
        audioEngine.stopListening();
        setView('worlds');
        return true;
      }
      return false;
    };
    return () => {
      delete win.__lingonestGoBack;
    };
  }, [showParentModal, view]);

  const updateActiveProfile = useCallback((updater: (prev: LearnerProfile) => LearnerProfile) => {
    setVault((v) => ({
      ...v,
      profiles: v.profiles.map((p) => (p.id === v.activeProfileId ? updater(p) : p)),
    }));
  }, []);

  const handleUpdateProfileObject = useCallback((updated: LearnerProfile) => {
    setVault((v) => ({
      ...v,
      profiles: v.profiles.map((p) => (p.id === updated.id ? updated : p)),
    }));
  }, []);

  const handleSwitchProfile = useCallback((profileId: string) => {
    audioEngine.stopSpeaking();
    audioEngine.stopListening();
    setVault((v) => ({ ...v, activeProfileId: profileId }));
    setView('worlds');
  }, []);

  const handleCreateProfile = useCallback(
    (name: string, avatar: string, ageMode: AgeMode, lang: LanguageCode) => {
      const created = createProfile(name, avatar, ageMode, lang);
      setVault((v) => ({
        activeProfileId: created.id,
        profiles: [...v.profiles, created],
      }));
      setView('worlds');
    },
    [],
  );

  const handleEraseAll = useCallback(() => {
    const fresh = eraseVaultCompletely();
    setVault(fresh);
    setView('worlds');
    setShowParentModal(false);
  }, []);

  const handleSelectAgeMode = useCallback(
    (nextMode: AgeMode) => {
      audioEngine.stopSpeaking();
      audioEngine.stopListening();
      audioEngine.playChime('tap', activeProfile.soundFxEnabled);
      updateActiveProfile((prev) => ({
        ...prev,
        ageMode: nextMode,
        speechSlowMode: nextMode === 'mini',
      }));
      setView('worlds');
    },
    [activeProfile.soundFxEnabled, updateActiveProfile],
  );

  const handleStartWorld = useCallback(
    (worldId: string) => {
      audioEngine.playChime('tap', activeProfile.soundFxEnabled);
      setActiveWorldId(worldId);
      setView('play');
    },
    [activeProfile.soundFxEnabled],
  );

  const handleStartAdultModule = useCallback(
    (moduleId: string) => {
      audioEngine.playChime('tap', activeProfile.soundFxEnabled);
      setActiveAdultModuleId(moduleId);
      setView('adult-practice');
    },
    [activeProfile.soundFxEnabled],
  );

  const handleRecordReview = useCallback(
    (itemId: string, grade: FSRSGrade, speakingDone: boolean, elapsedSec: number) => {
      const now = Date.now();
      const dateKey = todayDateKey(now);
      updateActiveProfile((prev) => {
        const key = cardKey(prev.targetLang, itemId);
        const oldCard = prev.cards[key];
        const wasAwake = isItemAwakeInLivingWorld(oldCard);
        const nextCard = reviewCardFSRS5(
          oldCard,
          itemId,
          prev.targetLang,
          grade,
          prev.ageMode,
          now,
          speakingDone,
        );
        const nowAwake = isItemAwakeInLivingWorld(nextCard);
        const prevDay = prev.dailyLog[dateKey] ?? {
          dateKey,
          minutes: 0,
          reviews: 0,
          wordsMastered: 0,
        };
        const addedMin = Math.max(0.15, Math.min(elapsedSec / 60, 5));
        return {
          ...prev,
          cards: { ...prev.cards, [key]: nextCard },
          dailyLog: {
            ...prev.dailyLog,
            [dateKey]: {
              ...prevDay,
              minutes: Number((prevDay.minutes + addedMin).toFixed(2)),
              reviews: prevDay.reviews + 1,
              wordsMastered: prevDay.wordsMastered + (!wasAwake && nowAwake ? 1 : 0),
            },
          },
        };
      });
    },
    [updateActiveProfile],
  );

  const handleCompleteStory = useCallback(
    (storyId: string) => {
      const dateKey = todayDateKey();
      updateActiveProfile((prev) => {
        const already = prev.completedStories.includes(storyId);
        const prevDay = prev.dailyLog[dateKey] ?? {
          dateKey,
          minutes: 0,
          reviews: 0,
          wordsMastered: 0,
        };
        return {
          ...prev,
          completedStories: already ? prev.completedStories : [...prev.completedStories, storyId],
          dailyLog: {
            ...prev.dailyLog,
            [dateKey]: { ...prevDay, minutes: Number((prevDay.minutes + 1.5).toFixed(2)) },
          },
        };
      });
    },
    [updateActiveProfile],
  );

  const handleUpdatePhoneticScore = useCallback(
    (trapId: string, score: number) => {
      updateActiveProfile((prev) => ({
        ...prev,
        phoneticScores: {
          ...prev.phoneticScores,
          [trapId]: Math.max(prev.phoneticScores[trapId] ?? 0, score),
        },
      }));
    },
    [updateActiveProfile],
  );

  const cycleLanguage = useCallback(() => {
    const order: LanguageCode[] = ['en', 'de', 'es'];
    const idx = order.indexOf(activeProfile.targetLang);
    const nextLang = order[(idx + 1) % order.length];
    audioEngine.playChime('tap', activeProfile.soundFxEnabled);
    updateActiveProfile((prev) => ({ ...prev, targetLang: nextLang }));
  }, [activeProfile.soundFxEnabled, activeProfile.targetLang, updateActiveProfile]);

  const toggleSoundFx = useCallback(() => {
    updateActiveProfile((prev) => ({ ...prev, soundFxEnabled: !prev.soundFxEnabled }));
  }, [updateActiveProfile]);

  const awakeCount = useMemo(() => {
    const prefix = `${activeProfile.targetLang}:`;
    return Object.entries(activeProfile.cards).filter(
      ([k, c]) => k.startsWith(prefix) && isItemAwakeInLivingWorld(c),
    ).length;
  }, [activeProfile.cards, activeProfile.targetLang]);

  const activeWorld = useMemo(() => getWorldById(activeWorldId) ?? WORLDS[0], [activeWorldId]);
  const activeAdultModule = useMemo(
    () => getAdultModuleById(activeAdultModuleId) ?? ADULT_MODULES[0],
    [activeAdultModuleId],
  );

  const langMeta = LANGUAGE_META[activeProfile.targetLang];
  const ageBadge = AGE_BADGE[activeProfile.ageMode];
  const isMini = activeProfile.ageMode === 'mini';
  const isMaster = activeProfile.ageMode === 'master';
  const isInFocusedSession = view === 'play' || view === 'adult-practice';

  return (
    <div
      className={`ln-shell ln-mode-${activeProfile.ageMode}${!isInFocusedSession ? ' has-mobile-nav' : ''}`}
    >
      {/* Age-Adaptive Top Navigation Bar */}
      <header className="ln-topbar">
        <button
          type="button"
          className="ln-brand-btn"
          onClick={() => {
            audioEngine.stopSpeaking();
            audioEngine.playChime('tap', activeProfile.soundFxEnabled);
            setView('worlds');
          }}
          aria-label="LingoNest Ana Sayfa"
        >
          <span className="ln-brand-orb">{isMaster ? '◆' : isMini ? '🦉' : '🧭'}</span>
          <span className="ln-brand-text">
            <strong>LingoNest</strong>
            {!isMini && (
              <small>{isMaster ? 'Cognitive SLA & FSRS-5 Studio' : 'Kaşif Dil Stüdyosu'}</small>
            )}
          </span>
        </button>

        {/* Morphing Navigation Pills per Developmental Stage */}
        {isMaster ? (
          <nav className="ln-nav-pills" aria-label="Yetişkin Stüdyo Gezinme">
            <button
              type="button"
              className={`ln-nav-pill ${view === 'worlds' || view === 'adult-practice' ? 'active' : ''}`}
              onClick={() => {
                audioEngine.stopSpeaking();
                setView('worlds');
              }}
            >
              <Zap size={17} />
              <span>Stüdyo</span>
            </button>

            <button
              type="button"
              className={`ln-nav-pill ${view === 'adult-dialogues' ? 'active' : ''}`}
              onClick={() => {
                audioEngine.stopSpeaking();
                setView('adult-dialogues');
              }}
            >
              <MessageSquare size={17} />
              <span>Diyaloglar</span>
            </button>

            <button
              type="button"
              className={`ln-nav-pill ${view === 'phonetics' ? 'active' : ''}`}
              onClick={() => {
                audioEngine.stopSpeaking();
                setView('phonetics');
              }}
            >
              <Ear size={17} />
              <span>Kontrastif Ses Lab</span>
            </button>

            <button
              type="button"
              className="ln-nav-pill"
              onClick={() => setShowParentModal(true)}
            >
              <BarChart3 size={17} />
              <span>FSRS Analitik</span>
            </button>
          </nav>
        ) : (
          <nav className="ln-nav-pills" aria-label="Ana Gezinme">
            <button
              type="button"
              className={`ln-nav-pill ${view === 'worlds' || view === 'play' ? 'active' : ''}`}
              onClick={() => {
                audioEngine.stopSpeaking();
                audioEngine.playChime('tap', activeProfile.soundFxEnabled);
                setView('worlds');
              }}
            >
              <Home size={isMini ? 24 : 18} />
              <span>{isMini ? 'Oyun' : 'Görevler'}</span>
            </button>

            <button
              type="button"
              className={`ln-nav-pill ${view === 'living-world' ? 'active' : ''}`}
              onClick={() => {
                audioEngine.stopSpeaking();
                audioEngine.playChime('tap', activeProfile.soundFxEnabled);
                setView('living-world');
              }}
            >
              <Sparkles size={isMini ? 24 : 18} />
              <span>{isMini ? 'Bahçem' : 'Yaşayan Dünya'}</span>
              {awakeCount > 0 && <em className="ln-pill-badge">{awakeCount}</em>}
            </button>

            <button
              type="button"
              className={`ln-nav-pill ${view === 'stories' ? 'active' : ''}`}
              onClick={() => {
                audioEngine.stopSpeaking();
                audioEngine.playChime('tap', activeProfile.soundFxEnabled);
                setView('stories');
              }}
            >
              <BookOpen size={isMini ? 24 : 18} />
              <span>{isMini ? 'Masal' : 'Hikayeler'}</span>
            </button>

            <button
              type="button"
              className={`ln-nav-pill ${view === 'phonetics' ? 'active' : ''}`}
              onClick={() => {
                audioEngine.stopSpeaking();
                audioEngine.playChime('tap', activeProfile.soundFxEnabled);
                setView('phonetics');
              }}
            >
              <Ear size={isMini ? 24 : 18} />
              <span>{isMini ? 'Sesler' : 'Ses Lab'}</span>
            </button>
          </nav>
        )}

        {/* Utility Controls */}
        <div className="ln-topbar-actions">
          <button
            type="button"
            className="ln-chip-btn"
            onClick={cycleLanguage}
            title="Hedef dili değiştir (İngilizce / Almanca / İspanyolca)"
          >
            <Globe size={16} />
            <span>{langMeta.flag}</span>
            {!isMini && <span className="ln-hide-mobile">{langMeta.nameTr}</span>}
          </button>

          <button
            type="button"
            className="ln-icon-btn"
            onClick={toggleSoundFx}
            title={activeProfile.soundFxEnabled ? 'Efekt seslerini kapat' : 'Efekt seslerini aç'}
            aria-label="Ses efektleri"
          >
            {activeProfile.soundFxEnabled ? <Volume2 size={18} /> : <VolumeX size={18} />}
          </button>

          <button
            type="button"
            className="ln-parent-btn"
            onClick={() => setShowParentModal(true)}
            title="Profil, Yaş Modu ve FSRS-5 İstatistikleri"
          >
            <ShieldCheck size={17} />
            <span>
              {activeProfile.avatarEmoji}
              {isMini ? (
                <> {ageBadge.emoji}</>
              ) : (
                <>
                  {' '}
                  {activeProfile.name}
                  <span className="ln-hide-mobile"> • {ageBadge.label}</span>
                </>
              )}
            </span>
          </button>
        </div>
      </header>

      {/* Instant 3-World Age & Pedagogy Switcher Strip (Protected by inline child-lock in Mini mode!) */}
      {!isInFocusedSession && (
        <div className="ln-age-switcher-wrap">
          <AgeModeSwitcher
            currentMode={activeProfile.ageMode}
            onSelectMode={handleSelectAgeMode}
            onRequestParentGate={() => setShowParentModal(true)}
          />
        </div>
      )}

      <main className="ln-main">
        {/* MASTER (15+ ADULT) COGNITIVE STUDIO VIEWS */}
        {isMaster && view === 'worlds' && (
          <AdultStudioView
            modules={ADULT_MODULES}
            dialogues={ADULT_DIALOGUES}
            profile={activeProfile}
            languageNameTr={langMeta.nameTr}
            onStartModule={handleStartAdultModule}
            onOpenDialogues={() => setView('adult-dialogues')}
            onOpenPhonetics={() => setView('phonetics')}
            onOpenParentStats={() => setShowParentModal(true)}
          />
        )}

        {isMaster && view === 'adult-practice' && activeAdultModule && (
          <AdultPracticeView
            module={activeAdultModule}
            profile={activeProfile}
            onRecordReview={handleRecordReview}
            onExit={() => setView('worlds')}
          />
        )}

        {isMaster && view === 'adult-dialogues' && (
          <AdultDialogueView
            dialogues={ADULT_DIALOGUES}
            profile={activeProfile}
            onCompleteDialogue={handleCompleteStory}
            onBack={() => setView('worlds')}
          />
        )}

        {/* MINI (4-7) & EXPLORER (8-14) VIEWS */}
        {!isMaster && view === 'worlds' && (
          <WorldMapView
            worlds={WORLDS}
            profile={activeProfile}
            languageNameTr={langMeta.nameTr}
            onStartWorld={handleStartWorld}
            onOpenLivingWorld={() => setView('living-world')}
            onOpenStories={() => setView('stories')}
            onOpenPhonetics={() => setView('phonetics')}
          />
        )}

        {!isMaster && view === 'play' && activeWorld && (
          <PlaySessionView
            world={activeWorld}
            allVocab={ALL_VOCAB}
            profile={activeProfile}
            onRecordReview={handleRecordReview}
            onExit={() => setView('worlds')}
            onGoLivingWorld={() => setView('living-world')}
          />
        )}

        {!isMaster && view === 'living-world' && (
          <LivingWorldScene
            worlds={WORLDS}
            profile={activeProfile}
            onSelectWorldToPlay={handleStartWorld}
          />
        )}

        {!isMaster && view === 'stories' && (
          <StoryTheaterView
            stories={STORIES}
            vocabById={VOCAB_BY_ID}
            profile={activeProfile}
            onCompleteStory={handleCompleteStory}
            onBack={() => setView('worlds')}
          />
        )}

        {/* SHARED PHONETIC LAB (Auto-themed Dark Obsidian in Master, Daylight/Indigo in Mini/Explorer!) */}
        {view === 'phonetics' && (
          <PhoneticLabView
            traps={PHONETIC_TRAPS}
            profile={activeProfile}
            onUpdateScore={handleUpdatePhoneticScore}
            onBack={() => setView('worlds')}
          />
        )}
      </main>

      {!isInFocusedSession && (
        <nav className="ln-mobile-bottom-nav" aria-label="Mobil Gezinme">
          {isMaster ? (
            <>
              <button
                type="button"
                className={`ln-mobile-nav-item ${view === 'worlds' ? 'active' : ''}`}
                aria-current={view === 'worlds' ? 'page' : undefined}
                onClick={() => {
                  audioEngine.stopSpeaking();
                  setView('worlds');
                }}
              >
                <Zap size={20} aria-hidden="true" />
                <span>Stüdyo</span>
              </button>

              <button
                type="button"
                className={`ln-mobile-nav-item ${view === 'adult-dialogues' ? 'active' : ''}`}
                aria-current={view === 'adult-dialogues' ? 'page' : undefined}
                onClick={() => {
                  audioEngine.stopSpeaking();
                  setView('adult-dialogues');
                }}
              >
                <MessageSquare size={20} aria-hidden="true" />
                <span>Diyalog</span>
              </button>

              <button
                type="button"
                className={`ln-mobile-nav-item ${view === 'phonetics' ? 'active' : ''}`}
                aria-current={view === 'phonetics' ? 'page' : undefined}
                onClick={() => {
                  audioEngine.stopSpeaking();
                  setView('phonetics');
                }}
              >
                <Ear size={20} aria-hidden="true" />
                <span>Ses Lab</span>
              </button>

              <button
                type="button"
                className={`ln-mobile-nav-item ${showParentModal ? 'active' : ''}`}
                onClick={() => setShowParentModal(true)}
              >
                <BarChart3 size={20} aria-hidden="true" />
                <span>Analitik</span>
              </button>
            </>
          ) : (
            <>
              <button
                type="button"
                className={`ln-mobile-nav-item ${view === 'worlds' ? 'active' : ''}`}
                aria-current={view === 'worlds' ? 'page' : undefined}
                onClick={() => {
                  audioEngine.stopSpeaking();
                  audioEngine.playChime('tap', activeProfile.soundFxEnabled);
                  setView('worlds');
                }}
              >
                <Home size={20} aria-hidden="true" />
                <span>{isMini ? 'Oyun' : 'Görevler'}</span>
              </button>

              <button
                type="button"
                className={`ln-mobile-nav-item ${view === 'living-world' ? 'active' : ''}`}
                aria-current={view === 'living-world' ? 'page' : undefined}
                onClick={() => {
                  audioEngine.stopSpeaking();
                  audioEngine.playChime('tap', activeProfile.soundFxEnabled);
                  setView('living-world');
                }}
              >
                <Sparkles size={20} aria-hidden="true" />
                <span>{isMini ? 'Bahçem' : 'Dünyam'}</span>
                {awakeCount > 0 && <em className="ln-mobile-nav-badge">{awakeCount}</em>}
              </button>

              <button
                type="button"
                className={`ln-mobile-nav-item ${view === 'stories' ? 'active' : ''}`}
                aria-current={view === 'stories' ? 'page' : undefined}
                onClick={() => {
                  audioEngine.stopSpeaking();
                  audioEngine.playChime('tap', activeProfile.soundFxEnabled);
                  setView('stories');
                }}
              >
                <BookOpen size={20} aria-hidden="true" />
                <span>{isMini ? 'Masal' : 'Hikaye'}</span>
              </button>

              <button
                type="button"
                className={`ln-mobile-nav-item ${view === 'phonetics' ? 'active' : ''}`}
                aria-current={view === 'phonetics' ? 'page' : undefined}
                onClick={() => {
                  audioEngine.stopSpeaking();
                  audioEngine.playChime('tap', activeProfile.soundFxEnabled);
                  setView('phonetics');
                }}
              >
                <Ear size={20} aria-hidden="true" />
                <span>{isMini ? 'Sesler' : 'Ses Lab'}</span>
              </button>
            </>
          )}
        </nav>
      )}

      {showParentModal && (
        <ParentDashboardModal
          vault={vault}
          activeProfile={activeProfile}
          worlds={WORLDS}
          onClose={() => setShowParentModal(false)}
          onUpdateProfile={handleUpdateProfileObject}
          onSwitchProfile={handleSwitchProfile}
          onCreateProfile={handleCreateProfile}
          onEraseAll={handleEraseAll}
        />
      )}
    </div>
  );
}
