import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  BookOpen,
  Cloud,
  Ear,
  Globe,
  Home,
  Layers,
  MessageSquare,
  ShieldCheck,
  Sparkles,
  Volume2,
  VolumeX,
  Zap,
} from 'lucide-react';
import type { AdultModule, AgeMode, AppView, FSRSGrade, LanguageCode, LearnerProfile } from './types';
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
  ALL_ADULT_ITEMS,
  getAdultModuleById,
} from './data/adultCurriculum';
import { audioEngine } from './engine/audioEngine';
import {
  buildCrossModuleDueQueue,
  cardKey,
  isItemAwakeInLivingWorld,
  reviewCardFSRS5,
} from './engine/fsrs5';
import {
  createProfile,
  defaultDailyGoalForAge,
  defaultNameForAge,
  eraseVaultCompletely,
  loadVault,
  mergeLingoVaults,
  saveVault,
  todayDateKey,
  type VaultState,
} from './engine/storage';
import { getCloudSession, pullCloudVault, pushCloudVault } from './engine/cloudSync';
import { sendLingoVisitorPulse } from './engine/visitorPulse';
import { AgeModeSwitcher } from './components/AgeModeSwitcher';
import { WorldMapView } from './components/WorldMapView';
import { PlaySessionView } from './components/PlaySessionView';
import { LivingWorldScene } from './components/LivingWorldScene';
import { StoryTheaterView } from './components/StoryTheaterView';
import { PhoneticLabView } from './components/PhoneticLabView';
import { AdultStudioView } from './components/AdultStudioView';
import { AdultPracticeView } from './components/AdultPracticeView';
import { AdultDialogueView } from './components/AdultDialogueView';
import { GrammarHandbookView } from './components/GrammarHandbookView';
import { VocabBankView } from './components/VocabBankView';
import { GradedStoriesView } from './components/GradedStoriesView';
import { ParentDashboardModal } from './components/ParentDashboardModal';
import { OnboardingModal } from './components/OnboardingModal';
import { CloudAccountModal } from './components/CloudAccountModal';

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

const DEFAULT_PROFILE_NAMES = new Set([
  'Minik Kaşif',
  'Genç Kaşif',
  'Usta Öğrenen',
  'Yetişkin Profil',
]);

const DEFAULT_AVATAR_BY_MODE: Record<AgeMode, string> = {
  mini: '🐣',
  explorer: '🧭',
  master: '🎓',
};

export function App() {
  const [vault, setVault] = useState<VaultState>(() => loadVault());
  const [view, setView] = useState<AppView>('worlds');
  const [activeWorldId, setActiveWorldId] = useState<string>(WORLDS[0]?.id ?? 'animals');
  const [activeAdultModuleId, setActiveAdultModuleId] = useState<string>(
    ADULT_MODULES[0]?.id ?? 'daily_fluency',
  );
  const [adultDueQueueIds, setAdultDueQueueIds] = useState<string[] | null>(null);
  const [handbookChapterId, setHandbookChapterId] = useState<string | undefined>(undefined);
  const [showParentModal, setShowParentModal] = useState(false);
  const [showCloudModal, setShowCloudModal] = useState(false);
  const [showDisclaimerModal, setShowDisclaimerModal] = useState(false);

  const switcherBackRef = useRef<(() => boolean) | null>(null);
  const viewSubBackRef = useRef<(() => boolean) | null>(null);
  const cloudRevisionRef = useRef<number | undefined>(undefined);
  const cloudSyncReadyRef = useRef<boolean>(false);
  const suppressNextPushRef = useRef<boolean>(false);

  const handleRegisterSwitcherBack = useCallback((fn: (() => boolean) | null) => {
    switcherBackRef.current = fn;
  }, []);

  const handleRegisterViewSubBack = useCallback((fn: (() => boolean) | null) => {
    viewSubBackRef.current = fn;
  }, []);

  useEffect(() => {
    saveVault(vault);
  }, [vault]);

  // Initial Cloud Session Check & Non-Destructive Vault Pull
  useEffect(() => {
    if (typeof window === 'undefined') return undefined;
    let active = true;
    getCloudSession()
      .then(async (sess) => {
        if (!active || !sess) return;
        try {
          const snap = await pullCloudVault();
          if (!active) return;
          cloudRevisionRef.current = snap.revision;
          if (snap.vault) {
            suppressNextPushRef.current = true;
            setVault((prev) => mergeLingoVaults(prev, snap.vault!));
          }
          cloudSyncReadyRef.current = true;
        } catch {
          // Offline mode remains fully operational
        }
      })
      .catch(() => {});
    return () => {
      active = false;
    };
  }, []);

  // Debounced Optimistic-Concurrency Cloud Auto-Sync
  useEffect(() => {
    if (typeof window === 'undefined' || !cloudSyncReadyRef.current) return undefined;
    if (suppressNextPushRef.current) {
      suppressNextPushRef.current = false;
      return undefined;
    }
    const timer = window.setTimeout(() => {
      pushCloudVault(vault, cloudRevisionRef.current)
        .then((res) => {
          cloudRevisionRef.current = res.revision;
          if (res.mergedVault) {
            suppressNextPushRef.current = true;
            setVault(res.mergedVault);
          }
        })
        .catch(() => {
          // Silently retain local vault until next online review
        });
    }, 1400);
    return () => window.clearTimeout(timer);
  }, [vault]);

  // Bidirectional URL Hash Routing (#studyo, #rehber, #rehber/<id>, #diyalog, #fonetik, #hikayeler, #bahcem)
  useEffect(() => {
    if (typeof window === 'undefined') return undefined;
    const applyHash = () => {
      const raw = window.location.hash.replace(/^#\/?/, '').trim();
      if (!raw) return;
      if (raw === 'rehber' || raw.startsWith('rehber/')) {
        const ch = raw.split('/')[1];
        if (ch) setHandbookChapterId(ch);
        setView('handbook');
      } else if (raw === 'kelimeler') {
        setView('vocab');
      } else if (raw === 'okuma') {
        setView('graded-stories');
      } else if (raw === 'diyalog') {
        setView('adult-dialogues');
      } else if (raw === 'fonetik') {
        setView('phonetics');
      } else if (raw === 'hikayeler') {
        setView('stories');
      } else if (raw === 'bahcem') {
        setView('living-world');
      } else if (raw === 'studyo' || raw === 'dunyalar') {
        setView('worlds');
      }
    };
    applyHash();
    window.addEventListener('hashchange', applyHash);
    return () => window.removeEventListener('hashchange', applyHash);
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    let targetHash = '';
    if (view === 'handbook') {
      targetHash = handbookChapterId ? `#rehber/${handbookChapterId}` : '#rehber';
    } else if (view === 'vocab') {
      targetHash = '#kelimeler';
    } else if (view === 'graded-stories') {
      targetHash = '#okuma';
    } else if (view === 'adult-dialogues') {
      targetHash = '#diyalog';
    } else if (view === 'phonetics') {
      targetHash = '#fonetik';
    } else if (view === 'stories') {
      targetHash = '#hikayeler';
    } else if (view === 'living-world') {
      targetHash = '#bahcem';
    } else if (window.location.hash) {
      const currentMode = (
        vault.profiles.find((p) => p.id === vault.activeProfileId) ?? vault.profiles[0]
      )?.ageMode;
      targetHash = currentMode === 'master' ? '#studyo' : '#dunyalar';
    }
    if (targetHash && window.location.hash !== targetHash) {
      window.history.replaceState(null, '', targetHash);
    }
    sendLingoVisitorPulse(`/LingoNest/${targetHash || window.location.hash || '#dunyalar'}`);
  }, [view, handbookChapterId, vault.activeProfileId, vault.profiles]);

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

  // Register Android hardware/gesture back handler (Modal → Child-Lock → Sub-View → Root)
  useEffect(() => {
    if (typeof window === 'undefined') return undefined;
    const win = window as unknown as { __lingonestGoBack?: () => boolean };
    win.__lingonestGoBack = () => {
      if (!vault.onboardingDone) {
        return false;
      }
      if (showParentModal) {
        setShowParentModal(false);
        return true;
      }
      if (switcherBackRef.current?.()) {
        return true;
      }
      if (viewSubBackRef.current?.()) {
        return true;
      }
      if (view !== 'worlds') {
        audioEngine.stopSpeaking();
        audioEngine.stopListening();
        setAdultDueQueueIds(null);
        setView('worlds');
        return true;
      }
      return false;
    };
    return () => {
      delete win.__lingonestGoBack;
    };
  }, [showParentModal, vault.onboardingDone, view]);

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
    setAdultDueQueueIds(null);
    setView('worlds');
  }, []);

  const handleCreateProfile = useCallback(
    (name: string, avatar: string, ageMode: AgeMode, lang: LanguageCode) => {
      const created = createProfile(name, avatar, ageMode, lang);
      setVault((v) => ({
        ...v,
        onboardingDone: true,
        activeProfileId: created.id,
        profiles: [...v.profiles, created],
      }));
      setAdultDueQueueIds(null);
      setView('worlds');
    },
    [],
  );

  const handleDeleteProfile = useCallback((profileId: string) => {
    audioEngine.stopSpeaking();
    audioEngine.stopListening();
    setVault((v) => {
      if (v.profiles.length <= 1) return v;
      const remaining = v.profiles.filter((p) => p.id !== profileId);
      const nextActive =
        v.activeProfileId === profileId ? remaining[0].id : v.activeProfileId;
      return {
        ...v,
        activeProfileId: nextActive,
        profiles: remaining,
      };
    });
    setAdultDueQueueIds(null);
    setView('worlds');
  }, []);

  const handleImportVault = useCallback((restored: VaultState) => {
    audioEngine.stopSpeaking();
    audioEngine.stopListening();
    setVault({ ...restored, onboardingDone: true });
    setAdultDueQueueIds(null);
    setView('worlds');
  }, []);

  const handleCompleteOnboarding = useCallback(
    (name: string, ageMode: AgeMode, targetLang: LanguageCode) => {
      setVault((v) => {
        const active = v.profiles.find((p) => p.id === v.activeProfileId) ?? v.profiles[0];
        if (!active) return { ...v, onboardingDone: true };
        const updatedActive: LearnerProfile = {
          ...active,
          name: name.trim() || defaultNameForAge(ageMode),
          avatarEmoji: DEFAULT_AVATAR_BY_MODE[ageMode],
          ageMode,
          targetLang,
          speechSlowMode: ageMode === 'mini',
          dailyGoalMinutes: defaultDailyGoalForAge(ageMode),
        };
        return {
          ...v,
          onboardingDone: true,
          profiles: v.profiles.map((p) => (p.id === active.id ? updatedActive : p)),
        };
      });
      setAdultDueQueueIds(null);
      setView('worlds');
    },
    [],
  );

  const handleEraseAll = useCallback(() => {
    const fresh = eraseVaultCompletely();
    setVault(fresh);
    setAdultDueQueueIds(null);
    setView('worlds');
    setShowParentModal(false);
  }, []);

  const handleSelectAgeMode = useCallback(
    (nextMode: AgeMode) => {
      audioEngine.stopSpeaking();
      audioEngine.stopListening();
      audioEngine.playChime('tap', activeProfile.soundFxEnabled);
      updateActiveProfile((prev) => {
        const isDefaultName = DEFAULT_PROFILE_NAMES.has(prev.name.trim());
        const isDefaultAvatar = Object.values(DEFAULT_AVATAR_BY_MODE).includes(prev.avatarEmoji);
        const prevDefaultGoal = defaultDailyGoalForAge(prev.ageMode);
        return {
          ...prev,
          ageMode: nextMode,
          name: isDefaultName ? defaultNameForAge(nextMode) : prev.name,
          avatarEmoji: isDefaultAvatar ? DEFAULT_AVATAR_BY_MODE[nextMode] : prev.avatarEmoji,
          speechSlowMode: nextMode === 'mini',
          dailyGoalMinutes:
            !prev.dailyGoalMinutes || prev.dailyGoalMinutes === prevDefaultGoal
              ? defaultDailyGoalForAge(nextMode)
              : prev.dailyGoalMinutes,
        };
      });
      setAdultDueQueueIds(null);
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
      setAdultDueQueueIds(null);
      setActiveAdultModuleId(moduleId);
      setView('adult-practice');
    },
    [activeProfile.soundFxEnabled],
  );

  const handleStartAdultDueQueue = useCallback(() => {
    audioEngine.playChime('tap', activeProfile.soundFxEnabled);
    const dueIds = buildCrossModuleDueQueue(
      ALL_ADULT_ITEMS.map((item) => item.id),
      activeProfile.cards,
      activeProfile.targetLang,
      15,
    );
    if (dueIds.length === 0) {
      setAdultDueQueueIds(null);
      setActiveAdultModuleId(ADULT_MODULES[0]?.id ?? 'daily_fluency');
      setView('adult-practice');
      return;
    }
    setAdultDueQueueIds(dueIds);
    setView('adult-practice');
  }, [activeProfile.cards, activeProfile.soundFxEnabled, activeProfile.targetLang]);

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

  const handleSelectLanguage = useCallback(
    (nextLang: LanguageCode) => {
      if (nextLang === activeProfile.targetLang) return;
      audioEngine.playChime('tap', activeProfile.soundFxEnabled);
      updateActiveProfile((prev) => ({ ...prev, targetLang: nextLang }));
    },
    [activeProfile.soundFxEnabled, activeProfile.targetLang, updateActiveProfile],
  );

  const toggleSoundFx = useCallback(() => {
    updateActiveProfile((prev) => ({ ...prev, soundFxEnabled: !prev.soundFxEnabled }));
  }, [updateActiveProfile]);

  const toggleSlowSpeech = useCallback(() => {
    audioEngine.playChime('tap', activeProfile.soundFxEnabled);
    updateActiveProfile((prev) => ({ ...prev, speechSlowMode: !prev.speechSlowMode }));
  }, [activeProfile.soundFxEnabled, updateActiveProfile]);

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

  const adultPracticeModule: AdultModule = useMemo(() => {
    if (adultDueQueueIds && adultDueQueueIds.length > 0) {
      return {
        id: 'fsrs_daily_due',
        order: 0,
        titleTr: 'Günlük Tekrar Çalışması',
        subtitleTr: 'Tüm bölümlerden bugün tekrar zamanı gelen ifadeler',
        icon: '00',
        cefrRange: 'A2–B2',
        accentHex: '#38bdf8',
        items: ALL_ADULT_ITEMS,
      };
    }
    return activeAdultModule;
  }, [adultDueQueueIds, activeAdultModule]);

  const langMeta = LANGUAGE_META[activeProfile.targetLang];
  const ageBadge = AGE_BADGE[activeProfile.ageMode];
  const isMini = activeProfile.ageMode === 'mini';
  const isMaster = activeProfile.ageMode === 'master';
  const isInFocusedSession = view === 'play' || view === 'adult-practice';

  return (
    <div
      className={`ln-shell ln-mode-${activeProfile.ageMode}${!isInFocusedSession ? ' has-mobile-nav' : ''}`}
    >
      <a href="#mainContent" className="ln-skip-link">
        İçeriğe geç
      </a>
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
              <small>{isMaster ? 'Yetişkin Dil Çalışma Alanı' : 'Kaşif Dil Stüdyosu'}</small>
            )}
          </span>
        </button>

        {/* Morphing Navigation Pills per Developmental Stage */}
        {isMaster ? (
          <nav className="ln-nav-pills" aria-label="Yetişkin Çalışma Gezinme">
            <button
              type="button"
              className={`ln-nav-pill ${view === 'worlds' || view === 'adult-practice' ? 'active' : ''}`}
              onClick={() => {
                audioEngine.stopSpeaking();
                setView('worlds');
              }}
            >
              <Zap size={17} />
              <span>Çalışma Masası</span>
            </button>

            <button
              type="button"
              className={`ln-nav-pill ${view === 'vocab' ? 'active' : ''}`}
              onClick={() => {
                audioEngine.stopSpeaking();
                setView('vocab');
              }}
            >
              <Layers size={17} />
              <span>Kelimeler</span>
            </button>

            <button
              type="button"
              className={`ln-nav-pill ${view === 'handbook' ? 'active' : ''}`}
              onClick={() => {
                audioEngine.stopSpeaking();
                setView('handbook');
              }}
            >
              <BookOpen size={17} />
              <span>Dilbilgisi</span>
            </button>

            <button
              type="button"
              className={`ln-nav-pill ${view === 'graded-stories' ? 'active' : ''}`}
              onClick={() => {
                audioEngine.stopSpeaking();
                setView('graded-stories');
              }}
            >
              <BookOpen size={17} />
              <span>Hikayeler</span>
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
              <span>Telaffuz</span>
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

            {!isMini && (
              <>
                <button
                  type="button"
                  className={`ln-nav-pill ${view === 'vocab' ? 'active' : ''}`}
                  onClick={() => {
                    audioEngine.stopSpeaking();
                    audioEngine.playChime('tap', activeProfile.soundFxEnabled);
                    setView('vocab');
                  }}
                >
                  <Layers size={18} />
                  <span>Kelimeler</span>
                </button>

                <button
                  type="button"
                  className={`ln-nav-pill ${view === 'handbook' ? 'active' : ''}`}
                  onClick={() => {
                    audioEngine.stopSpeaking();
                    audioEngine.playChime('tap', activeProfile.soundFxEnabled);
                    setView('handbook');
                  }}
                >
                  <BookOpen size={18} />
                  <span>Dilbilgisi</span>
                </button>
              </>
            )}

            {isMini && (
              <button
                type="button"
                className={`ln-nav-pill ${view === 'living-world' ? 'active' : ''}`}
                onClick={() => {
                  audioEngine.stopSpeaking();
                  audioEngine.playChime('tap', activeProfile.soundFxEnabled);
                  setView('living-world');
                }}
              >
                <Sparkles size={24} />
                <span>Bahçem</span>
                {awakeCount > 0 && <em className="ln-pill-badge">{awakeCount}</em>}
              </button>
            )}

            <button
              type="button"
              className={`ln-nav-pill ${view === 'stories' || view === 'graded-stories' ? 'active' : ''}`}
              onClick={() => {
                audioEngine.stopSpeaking();
                audioEngine.playChime('tap', activeProfile.soundFxEnabled);
                setView(isMini ? 'stories' : 'graded-stories');
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
              <span>{isMini ? 'Sesler' : 'Telaffuz'}</span>
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
            className={`ln-icon-btn ${activeProfile.speechSlowMode ? 'is-active' : ''}`}
            onClick={toggleSlowSpeech}
            aria-pressed={activeProfile.speechSlowMode}
            title={
              activeProfile.speechSlowMode
                ? 'Yavaş konuşma açık (0.80x) — Normal hıza geç'
                : 'Normal konuşma (1.0x) — Yavaş moda geç (0.80x)'
            }
            aria-label="Konuşma hızı (0.80x yavaş / normal)"
            style={
              activeProfile.speechSlowMode
                ? {
                    borderColor: '#10b981',
                    background: isMaster ? 'rgba(16, 185, 129, 0.2)' : '#dcfce7',
                  }
                : undefined
            }
          >
            <span aria-hidden="true" style={{ fontSize: '1.05rem', lineHeight: 1 }}>
              🐢
            </span>
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
            className="ln-chip-btn"
            onClick={() => setShowCloudModal(true)}
            title="Bulut Senkronizasyon ve Aile Planları"
            aria-label="Bulut Hesabı ve Planlar"
          >
            <Cloud size={16} />
            <span className="ln-hide-mobile">Bulut</span>
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
            onRegisterSubBack={handleRegisterSwitcherBack}
          />
        </div>
      )}

      <main id="mainContent" className="ln-main">
        {!isInFocusedSession && (
          <div
            role="note"
            aria-label="Test sürümü ve sorumluluk reddi bildirimi"
            style={{
              marginBottom: '14px',
              padding: '10px 14px',
              borderRadius: '14px',
              background: isMaster ? 'rgba(30, 41, 59, 0.78)' : '#fffbeb',
              border: isMaster ? '1px solid rgba(251, 191, 36, 0.35)' : '1.5px solid #fde68a',
              color: isMaster ? '#fde68a' : '#78350f',
              fontSize: '0.82rem',
              lineHeight: 1.45,
              fontWeight: 600,
              display: 'flex',
              flexWrap: 'wrap',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '8px',
            }}
          >
            <span style={{ flex: '1 1 240px' }}>
              <strong>Test Sitesi ve Sorumluluk Reddi Beyanı:</strong> Bu uygulama şu anda geliştirme
              ve açık test aşamasında olan bir test sitesidir. İçerikler, seslendirmeler ve alıştırmalar
              yalnızca eğitim ve deneme amaçlıdır; resmi veya ticari garanti niteliği taşımaz.
            </span>
            <button
              type="button"
              onClick={() => setShowDisclaimerModal(true)}
              style={{
                background: 'none',
                border: 'none',
                padding: 0,
                color: 'inherit',
                textDecoration: 'underline',
                font: 'inherit',
                fontWeight: 800,
                cursor: 'pointer',
                flexShrink: 0,
              }}
            >
              Tam Beyanı Oku
            </button>
          </div>
        )}

        {/* MASTER (15+ ADULT) COGNITIVE STUDIO VIEWS */}
        {isMaster && view === 'worlds' && (
          <AdultStudioView
            modules={ADULT_MODULES}
            dialogues={ADULT_DIALOGUES}
            profile={activeProfile}
            languageNameTr={langMeta.nameTr}
            onSelectLang={handleSelectLanguage}
            onStartModule={handleStartAdultModule}
            onStartDueQueue={handleStartAdultDueQueue}
            onOpenDialogues={() => setView('adult-dialogues')}
            onOpenHandbook={() => setView('handbook')}
            onOpenVocab={() => setView('vocab')}
            onOpenStories={() => setView('graded-stories')}
            onOpenPhonetics={() => setView('phonetics')}
            onOpenParentStats={() => setShowParentModal(true)}
          />
        )}

        {view === 'handbook' && (
          <GrammarHandbookView
            profile={activeProfile}
            languageNameTr={langMeta.nameTr}
            initialChapterId={handbookChapterId}
            onChapterSelect={(id) => setHandbookChapterId(id)}
            onBack={() => setView('worlds')}
          />
        )}

        {view === 'vocab' && (
          <VocabBankView
            profile={activeProfile}
            languageNameTr={langMeta.nameTr}
            onRecordReview={handleRecordReview}
            onBack={() => setView('worlds')}
          />
        )}

        {view === 'graded-stories' && (
          <GradedStoriesView
            profile={activeProfile}
            languageNameTr={langMeta.nameTr}
            onCompleteStory={handleCompleteStory}
            onOpenIllustratedStories={!isMaster ? () => setView('stories') : undefined}
            onBack={() => setView('worlds')}
          />
        )}

        {isMaster && view === 'adult-practice' && adultPracticeModule && (
          <AdultPracticeView
            module={adultPracticeModule}
            profile={activeProfile}
            dueOnlyItemIds={adultDueQueueIds ?? undefined}
            onRecordReview={handleRecordReview}
            onExit={() => {
              setAdultDueQueueIds(null);
              setView('worlds');
            }}
          />
        )}

        {isMaster && view === 'adult-dialogues' && (
          <AdultDialogueView
            dialogues={ADULT_DIALOGUES}
            profile={activeProfile}
            onCompleteDialogue={handleCompleteStory}
            onBack={() => setView('worlds')}
            onRegisterSubBack={handleRegisterViewSubBack}
          />
        )}

        {/* MINI (4-7) & EXPLORER (8-14) VIEWS */}
        {!isMaster && view === 'worlds' && (
          <WorldMapView
            worlds={WORLDS}
            profile={activeProfile}
            languageNameTr={langMeta.nameTr}
            onSelectLang={handleSelectLanguage}
            onStartWorld={handleStartWorld}
            onOpenLivingWorld={() => setView('living-world')}
            onOpenStories={() => setView(isMini ? 'stories' : 'graded-stories')}
            onOpenPhonetics={() => setView('phonetics')}
            onOpenVocab={!isMini ? () => setView('vocab') : undefined}
            onOpenHandbook={!isMini ? () => setView('handbook') : undefined}
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
            onRegisterSubBack={handleRegisterViewSubBack}
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

        {!isInFocusedSession && (
          <footer
            style={{
              marginTop: '28px',
              paddingTop: '14px',
              borderTop: '1px solid rgba(148, 163, 184, 0.25)',
              display: 'flex',
              flexWrap: 'wrap',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '10px',
              fontSize: '0.82rem',
              color: 'var(--ln-ink-soft)',
              fontWeight: 600,
            }}
          >
            <span>
              Gizlilik ve Açık Test Sürümü: Bu site geliştirme aşamasında bir test sitesidir.
              İlerlemeniz varsayılan olarak yalnızca bu cihazda saklanır; çocuklara yönelik reklam
              veya takip içermez.
            </span>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '14px', alignItems: 'center' }}>
              <button
                type="button"
                onClick={() => setShowDisclaimerModal(true)}
                style={{
                  background: 'none',
                  border: 'none',
                  padding: 0,
                  color: 'inherit',
                  textDecoration: 'underline',
                  font: 'inherit',
                  fontWeight: 700,
                  cursor: 'pointer',
                }}
              >
                Sorumluluk Reddi Beyanı
              </button>
              <button
                type="button"
                onClick={() => setShowParentModal(true)}
                style={{
                  background: 'none',
                  border: 'none',
                  padding: 0,
                  color: 'inherit',
                  textDecoration: 'underline',
                  font: 'inherit',
                  fontWeight: 700,
                  cursor: 'pointer',
                }}
              >
                Ebeveyn Paneli ve Veri Yönetimi
              </button>
            </div>
          </footer>
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
                <span>Çalışma</span>
              </button>

              <button
                type="button"
                className={`ln-mobile-nav-item ${view === 'vocab' ? 'active' : ''}`}
                aria-current={view === 'vocab' ? 'page' : undefined}
                onClick={() => {
                  audioEngine.stopSpeaking();
                  setView('vocab');
                }}
              >
                <Layers size={20} aria-hidden="true" />
                <span>Kelime</span>
              </button>

              <button
                type="button"
                className={`ln-mobile-nav-item ${view === 'handbook' ? 'active' : ''}`}
                aria-current={view === 'handbook' ? 'page' : undefined}
                onClick={() => {
                  audioEngine.stopSpeaking();
                  setView('handbook');
                }}
              >
                <BookOpen size={20} aria-hidden="true" />
                <span>Dilbilgisi</span>
              </button>

              <button
                type="button"
                className={`ln-mobile-nav-item ${view === 'graded-stories' ? 'active' : ''}`}
                aria-current={view === 'graded-stories' ? 'page' : undefined}
                onClick={() => {
                  audioEngine.stopSpeaking();
                  setView('graded-stories');
                }}
              >
                <MessageSquare size={20} aria-hidden="true" />
                <span>Hikayeler</span>
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
          adultModules={ADULT_MODULES}
          onClose={() => setShowParentModal(false)}
          onUpdateProfile={handleUpdateProfileObject}
          onChangeAgeMode={handleSelectAgeMode}
          onSwitchProfile={handleSwitchProfile}
          onCreateProfile={handleCreateProfile}
          onDeleteProfile={handleDeleteProfile}
          onImportVault={handleImportVault}
          onEraseAll={handleEraseAll}
        />
      )}

      {showCloudModal && (
        <CloudAccountModal
          vault={vault}
          onRestoreCloudVault={(nextVault) => setVault(nextVault)}
          onClose={() => setShowCloudModal(false)}
        />
      )}

      {showDisclaimerModal && (
        <div
          className="ln-modal-backdrop"
          role="dialog"
          aria-modal="true"
          aria-labelledby="ln-disclaimer-heading"
          onClick={() => setShowDisclaimerModal(false)}
        >
          <div
            className="ln-parent-modal"
            style={{ maxWidth: '620px', gap: '14px' }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="ln-modal-header">
              <h2 id="ln-disclaimer-heading" style={{ margin: 0, fontSize: '1.25rem' }}>
                Test Sitesi Bildirimi ve Sorumluluk Reddi Beyanı
              </h2>
              <button
                type="button"
                className="ln-close-btn"
                onClick={() => setShowDisclaimerModal(false)}
                aria-label="Kapat"
              >
                ✕
              </button>
            </div>

            <p style={{ margin: 0, lineHeight: 1.55, fontSize: '0.92rem' }}>
              <strong>1. Açık Test Sürümü Bildirimi:</strong> LingoNest şu anda aktif geliştirme,
              içerik iyileştirme ve saha denemesi aşamasında olan bir <strong>test sitesidir</strong>.
            </p>
            <p style={{ margin: 0, lineHeight: 1.55, fontSize: '0.92rem' }}>
              <strong>2. Sorumluluk Reddi:</strong> Uygulamada yer alan kelime listeleri, dil bilgisi
              anlatımları, okuma metinleri, nöral ses kayıtları ve konuşma değerlendirmeleri yalnızca
              bireysel dil pratiği ve deneme amacıyla &quot;olduğu gibi&quot; sunulmaktadır; resmi bir
              dil yeterlilik belgesi, pedagojik/hukuki taahhüt veya kesintisiz hizmet garantisi
              oluşturmaz. Test süreci boyunca özellikler değiştirilebilir, veriler güncellenebilir
              veya sıfırlanabilir; kullanımdan doğabilecek doğrudan ya da dolaylı sonuçlardan site
              geliştiricisi sorumlu tutulamaz.
            </p>
            <p style={{ margin: 0, lineHeight: 1.55, fontSize: '0.92rem' }}>
              <strong>3. Veri Gizliliği ve İletişim:</strong> İlerleme verileriniz varsayılan olarak
              yalnızca kendi cihazınızda saklanır; çocuklara yönelik reklam veya üçüncü taraf takip
              bulunmaz. İletişim: <a href="mailto:imza464@gmail.com">imza464@gmail.com</a>
            </p>

            <button
              type="button"
              className="ln-clay-btn ln-clay-btn--mint"
              onClick={() => setShowDisclaimerModal(false)}
              style={{ alignSelf: 'flex-end' }}
            >
              <span>Anladım, Kapat</span>
            </button>
          </div>
        </div>
      )}

      {!vault.onboardingDone && <OnboardingModal onComplete={handleCompleteOnboarding} />}
    </div>
  );
}
