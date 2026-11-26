// ============================================================================
// LingoNest — 100% Local-First Multi-Profile Storage (KVKK / COPPA Compliant)
// Sibling-isolated profile sandboxes, JSON export & validated import/restore.
// ============================================================================

import type { AgeMode, LanguageCode, LearnerProfile } from '../types';

const STORE_KEY = 'lingonest_vault_v1';

export interface VaultState {
  activeProfileId: string;
  profiles: LearnerProfile[];
  onboardingDone?: boolean;
}

export function todayDateKey(nowMs: number = Date.now()): string {
  const d = new Date(nowMs);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

export function defaultDailyGoalForAge(ageMode: AgeMode): number {
  return ageMode === 'mini' ? 5 : ageMode === 'explorer' ? 10 : 15;
}

export function defaultNameForAge(ageMode: AgeMode): string {
  return ageMode === 'mini'
    ? 'Minik Kaşif'
    : ageMode === 'explorer'
      ? 'Genç Kaşif'
      : 'Usta Öğrenen';
}

export function createProfile(
  name: string,
  avatarEmoji: string,
  ageMode: AgeMode,
  targetLang: LanguageCode = 'en',
): LearnerProfile {
  return {
    id: `prof_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 7)}`,
    name: name.trim() || defaultNameForAge(ageMode),
    avatarEmoji: avatarEmoji || (ageMode === 'mini' ? '🐣' : ageMode === 'explorer' ? '🧭' : '🎓'),
    ageMode,
    targetLang,
    speechSlowMode: ageMode === 'mini',
    soundFxEnabled: true,
    dailyGoalMinutes: defaultDailyGoalForAge(ageMode),
    cards: {},
    completedStories: [],
    phoneticScores: {},
    dailyLog: {},
    createdAt: Date.now(),
  };
}

export function createDefaultVault(onboardingDone = false): VaultState {
  const child = createProfile('Minik Kaşif', '🐣', 'mini', 'en');
  const adult = createProfile('Yetişkin Profil', '🎓', 'master', 'en');
  return {
    activeProfileId: child.id,
    profiles: [child, adult],
    onboardingDone,
  };
}

function hasAnyProgress(profiles: LearnerProfile[]): boolean {
  return profiles.some(
    (p) =>
      Object.keys(p.cards || {}).length > 0 ||
      (p.completedStories || []).length > 0 ||
      Object.keys(p.dailyLog || {}).length > 0,
  );
}

export function loadVault(): VaultState {
  if (typeof window === 'undefined') return createDefaultVault(true);
  try {
    const raw = window.localStorage.getItem(STORE_KEY);
    if (!raw) {
      const def = createDefaultVault(false);
      saveVault(def);
      return def;
    }
    const parsed = JSON.parse(raw) as Partial<VaultState>;
    if (!Array.isArray(parsed.profiles) || parsed.profiles.length === 0) {
      const def = createDefaultVault(false);
      saveVault(def);
      return def;
    }
    const normalizedProfiles = parsed.profiles.map((p) => ({
      ...p,
      dailyGoalMinutes: p.dailyGoalMinutes ?? defaultDailyGoalForAge(p.ageMode ?? 'mini'),
      cards: p.cards ?? {},
      completedStories: p.completedStories ?? [],
      phoneticScores: p.phoneticScores ?? {},
      dailyLog: p.dailyLog ?? {},
    }));
    const activeExists = normalizedProfiles.some((p) => p.id === parsed.activeProfileId);
    const inferredOnboarding =
      typeof parsed.onboardingDone === 'boolean'
        ? parsed.onboardingDone
        : hasAnyProgress(normalizedProfiles);
    return {
      activeProfileId:
        activeExists && parsed.activeProfileId ? parsed.activeProfileId : normalizedProfiles[0].id,
      profiles: normalizedProfiles,
      onboardingDone: inferredOnboarding,
    };
  } catch {
    return createDefaultVault(false);
  }
}

export function saveVault(vault: VaultState): void {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(STORE_KEY, JSON.stringify(vault));
  } catch {
    // quota fallback ignored
  }
}

export function exportVaultJson(vault: VaultState): string {
  return JSON.stringify(
    {
      exportedAt: new Date().toISOString(),
      app: 'LingoNest',
      version: 2,
      privacy: '100% Local-First KVKK/COPPA Vault',
      vault,
    },
    null,
    2,
  );
}

export function importVaultJson(
  rawText: string,
): { ok: true; vault: VaultState } | { ok: false; error: string } {
  try {
    const parsed = JSON.parse(rawText) as { vault?: Partial<VaultState>; profiles?: LearnerProfile[]; activeProfileId?: string };
    const candidate = parsed.vault ?? parsed;
    if (!Array.isArray(candidate.profiles) || candidate.profiles.length === 0) {
      return { ok: false, error: 'Geçerli LingoNest profil verisi bulunamadı.' };
    }
    const validModes = new Set<AgeMode>(['mini', 'explorer', 'master']);
    const validLangs = new Set<LanguageCode>(['en', 'de', 'es']);
    const cleanProfiles: LearnerProfile[] = candidate.profiles
      .filter((p): p is LearnerProfile => Boolean(p && typeof p.id === 'string' && typeof p.name === 'string'))
      .map((p) => {
        const ageMode: AgeMode = validModes.has(p.ageMode) ? p.ageMode : 'mini';
        const targetLang: LanguageCode = validLangs.has(p.targetLang) ? p.targetLang : 'en';
        return {
          id: p.id,
          name: p.name.slice(0, 40) || defaultNameForAge(ageMode),
          avatarEmoji: typeof p.avatarEmoji === 'string' && p.avatarEmoji ? p.avatarEmoji : '🦉',
          ageMode,
          targetLang,
          speechSlowMode: typeof p.speechSlowMode === 'boolean' ? p.speechSlowMode : ageMode === 'mini',
          soundFxEnabled: typeof p.soundFxEnabled === 'boolean' ? p.soundFxEnabled : true,
          dailyGoalMinutes:
            typeof p.dailyGoalMinutes === 'number' && p.dailyGoalMinutes >= 3 && p.dailyGoalMinutes <= 60
              ? Math.round(p.dailyGoalMinutes)
              : defaultDailyGoalForAge(ageMode),
          cards: p.cards && typeof p.cards === 'object' ? p.cards : {},
          completedStories: Array.isArray(p.completedStories) ? p.completedStories : [],
          phoneticScores: p.phoneticScores && typeof p.phoneticScores === 'object' ? p.phoneticScores : {},
          dailyLog: p.dailyLog && typeof p.dailyLog === 'object' ? p.dailyLog : {},
          createdAt: typeof p.createdAt === 'number' ? p.createdAt : Date.now(),
        };
      });

    if (cleanProfiles.length === 0) {
      return { ok: false, error: 'Yedek dosyasında geçerli profil kaydı yok.' };
    }

    const activeId =
      candidate.activeProfileId && cleanProfiles.some((p) => p.id === candidate.activeProfileId)
        ? candidate.activeProfileId
        : cleanProfiles[0].id;

    const restored: VaultState = {
      activeProfileId: activeId,
      profiles: cleanProfiles,
      onboardingDone: true,
    };
    saveVault(restored);
    return { ok: true, vault: restored };
  } catch {
    return { ok: false, error: 'JSON dosyası okunamadı — lütfen geçerli bir LingoNest yedeği seçin.' };
  }
}

export function eraseVaultCompletely(): VaultState {
  if (typeof window !== 'undefined') {
    window.localStorage.removeItem(STORE_KEY);
  }
  const fresh = createDefaultVault(false);
  saveVault(fresh);
  return fresh;
}
