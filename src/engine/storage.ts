// ============================================================================
// LingoNest — 100% Local-First Multi-Profile Storage (KVKK / COPPA Compliant)
// Sibling-isolated profile sandboxes: zero cloud PII, instant JSON backup/erase.
// ============================================================================

import type { AgeMode, LanguageCode, LearnerProfile } from '../types';

const STORE_KEY = 'lingonest_vault_v1';

export interface VaultState {
  activeProfileId: string;
  profiles: LearnerProfile[];
}

export function todayDateKey(nowMs: number = Date.now()): string {
  const d = new Date(nowMs);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

export function createProfile(
  name: string,
  avatarEmoji: string,
  ageMode: AgeMode,
  targetLang: LanguageCode = 'en',
): LearnerProfile {
  return {
    id: `prof_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 7)}`,
    name: name.trim() || 'Minik Kaşif',
    avatarEmoji: avatarEmoji || '🦊',
    ageMode,
    targetLang,
    speechSlowMode: ageMode === 'mini',
    soundFxEnabled: true,
    cards: {},
    completedStories: [],
    phoneticScores: {},
    dailyLog: {},
    createdAt: Date.now(),
  };
}

export function createDefaultVault(): VaultState {
  const child = createProfile('Minik Kaşif (5 Yaş)', '🐣', 'mini', 'en');
  const adult = createProfile('Ebeveyn / Yetişkin', '🦉', 'master', 'en');
  return {
    activeProfileId: child.id,
    profiles: [child, adult],
  };
}

export function loadVault(): VaultState {
  if (typeof window === 'undefined') return createDefaultVault();
  try {
    const raw = window.localStorage.getItem(STORE_KEY);
    if (!raw) {
      const def = createDefaultVault();
      saveVault(def);
      return def;
    }
    const parsed = JSON.parse(raw) as Partial<VaultState>;
    if (!Array.isArray(parsed.profiles) || parsed.profiles.length === 0) {
      const def = createDefaultVault();
      saveVault(def);
      return def;
    }
    const activeExists = parsed.profiles.some((p) => p.id === parsed.activeProfileId);
    return {
      activeProfileId: activeExists && parsed.activeProfileId ? parsed.activeProfileId : parsed.profiles[0].id,
      profiles: parsed.profiles,
    };
  } catch {
    return createDefaultVault();
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
      privacy: '100% Local-First KVKK/COPPA Vault',
      vault,
    },
    null,
    2,
  );
}

export function eraseVaultCompletely(): VaultState {
  if (typeof window !== 'undefined') {
    window.localStorage.removeItem(STORE_KEY);
  }
  const fresh = createDefaultVault();
  saveVault(fresh);
  return fresh;
}
