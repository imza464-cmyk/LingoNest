import { createInternalNeonAuth } from '@neon/auth';
import { BetterAuthReactAdapter } from '@neon/auth/react/adapters';
import type { LanguageCode } from '../types';
import { mergeLingoVaults, type VaultState } from './storage';

const DEFAULT_AUTH_URL =
  'https://ep-super-grass-bhia8pi1.neonauth.c-10.eu-central-1.aws.neon.tech/neondb/auth';
const DEFAULT_CLOUD_API_URL =
  'https://br-icy-grass-bhsdqu67-lingonestapi.compute.c-10.eu-central-1.aws.neon.tech';

export const NEON_AUTH_URL: string =
  (typeof import.meta !== 'undefined' &&
    (import.meta as unknown as { env?: Record<string, string> }).env?.VITE_NEON_AUTH_URL) ||
  DEFAULT_AUTH_URL;

export const CLOUD_API_URL: string =
  (typeof import.meta !== 'undefined' &&
    (import.meta as unknown as { env?: Record<string, string> }).env?.VITE_LINGONEST_API_URL) ||
  DEFAULT_CLOUD_API_URL;

function buildAuthWrapper() {
  return createInternalNeonAuth(NEON_AUTH_URL, {
    adapter: BetterAuthReactAdapter(),
  });
}

type NeonAuthWrapper = ReturnType<typeof buildAuthWrapper>;
let cachedWrapper: NeonAuthWrapper | null = null;

function getAuthWrapper(): NeonAuthWrapper | null {
  if (typeof window === 'undefined') return null;
  if (!cachedWrapper) {
    cachedWrapper = buildAuthWrapper();
  }
  return cachedWrapper;
}

export interface CloudPlan {
  plan_code: string;
  display_name: string;
  price_cents: number;
  currency: string;
  billing_interval: string;
  max_profiles: number;
}

export interface CloudUserSession {
  id: string;
  email: string;
  name: string;
}

export interface CloudVaultSnapshot {
  userId: string;
  email: string | null;
  subscription: {
    plan_code: string;
    status: string;
    display_name: string;
    max_profiles: number;
    current_period_end?: string | null;
  };
  vault: VaultState | null;
  revision: number;
  updatedAt: string | null;
}

export async function getCloudSession(): Promise<CloudUserSession | null> {
  const wrapper = getAuthWrapper();
  if (!wrapper) return null;
  try {
    const res = await wrapper.adapter.getSession();
    const u = res?.data?.user;
    if (!u?.id) return null;
    return {
      id: String(u.id),
      email: String(u.email ?? ''),
      name: String(u.name ?? u.email ?? 'Öğrenen'),
    };
  } catch {
    return null;
  }
}

export async function signUpWithEmail(
  name: string,
  email: string,
  password: string,
): Promise<{ user: CloudUserSession | null; error: string | null }> {
  const wrapper = getAuthWrapper();
  if (!wrapper) return { user: null, error: 'Tarayıcı oturumu hazır değil.' };
  try {
    const res = await wrapper.adapter.signUp.email({
      name: name.trim() || email.split('@')[0] || 'Veli',
      email: email.trim(),
      password,
    });
    if (res.error) {
      return { user: null, error: res.error.message || 'Kayıt işlemi başarısız oldu.' };
    }
    const session = await getCloudSession();
    return { user: session, error: null };
  } catch (err) {
    return { user: null, error: err instanceof Error ? err.message : 'Bağlantı hatası' };
  }
}

export async function signInWithEmail(
  email: string,
  password: string,
): Promise<{ user: CloudUserSession | null; error: string | null }> {
  const wrapper = getAuthWrapper();
  if (!wrapper) return { user: null, error: 'Tarayıcı oturumu hazır değil.' };
  try {
    const res = await wrapper.adapter.signIn.email({
      email: email.trim(),
      password,
    });
    if (res.error) {
      return { user: null, error: 'E-posta veya parola hatalı.' };
    }
    const session = await getCloudSession();
    return { user: session, error: null };
  } catch (err) {
    return { user: null, error: err instanceof Error ? err.message : 'Bağlantı hatası' };
  }
}

export async function signOutCloud(): Promise<void> {
  const wrapper = getAuthWrapper();
  if (!wrapper) return;
  try {
    await wrapper.adapter.signOut();
  } catch {
    // ignore network error on signout
  }
}

async function getBearerJwt(): Promise<string | null> {
  const wrapper = getAuthWrapper();
  if (!wrapper) return null;
  try {
    return await wrapper.getJWTToken();
  } catch {
    return null;
  }
}

export async function fetchServerPlans(): Promise<CloudPlan[]> {
  const resp = await fetch(`${CLOUD_API_URL}/plans`, {
    method: 'GET',
    headers: { Accept: 'application/json' },
  });
  if (!resp.ok) throw new Error('Plan kataloğu alınamadı.');
  const data = (await resp.json()) as { plans?: CloudPlan[] };
  return data.plans ?? [];
}

export async function pullCloudVault(): Promise<CloudVaultSnapshot> {
  const jwt = await getBearerJwt();
  if (!jwt) throw new Error('Oturum anahtarı alınamadı; lütfen tekrar giriş yapın.');
  const resp = await fetch(`${CLOUD_API_URL}/vault`, {
    method: 'GET',
    headers: {
      Accept: 'application/json',
      Authorization: `Bearer ${jwt}`,
    },
  });
  const data = await resp.json();
  if (!resp.ok) {
    throw new Error(data?.error || 'Bulut kasası okunamadı.');
  }
  return data as CloudVaultSnapshot;
}

export async function pushCloudVault(
  vault: VaultState,
  expectedRevision?: number,
): Promise<{ revision: number; updatedAt: string; mergedVault?: VaultState }> {
  const jwt = await getBearerJwt();
  if (!jwt) throw new Error('Oturum anahtarı alınamadı; lütfen tekrar giriş yapın.');
  const payload: { vault: VaultState; expectedRevision?: number } = { vault };
  if (typeof expectedRevision === 'number') {
    payload.expectedRevision = expectedRevision;
  }
  const resp = await fetch(`${CLOUD_API_URL}/vault`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${jwt}`,
    },
    body: JSON.stringify(payload),
  });
  const data = await resp.json();

  // Optimistic Concurrency Control (409 Conflict): merge server + local without losing progress
  if (resp.status === 409 && data?.serverVault) {
    const merged = mergeLingoVaults(vault, data.serverVault as VaultState);
    const retryResp = await fetch(`${CLOUD_API_URL}/vault`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${jwt}`,
      },
      body: JSON.stringify({
        vault: merged,
        expectedRevision: Number(data.revision),
      }),
    });
    const retryData = await retryResp.json();
    if (!retryResp.ok) {
      throw new Error(retryData?.error || 'Bulut birleştirme senkronizasyonu başarısız oldu.');
    }
    return {
      revision: Number(retryData.revision),
      updatedAt: String(retryData.updatedAt),
      mergedVault: merged,
    };
  }

  if (!resp.ok) {
    throw new Error(data?.error || 'Bulut senkronizasyonu başarısız oldu.');
  }
  return { revision: Number(data.revision), updatedAt: String(data.updatedAt) };
}

export interface ContrastiveCoachRequest {
  targetLang: LanguageCode;
  phrase?: string;
  learnerAttempt?: string;
  question?: string;
  turkishTrapTr?: string;
}

export async function askContrastiveCoach(params: ContrastiveCoachRequest): Promise<string> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  };
  const jwt = await getBearerJwt();
  if (jwt) {
    headers.Authorization = `Bearer ${jwt}`;
  }
  try {
    const resp = await fetch(`${CLOUD_API_URL}/coach`, {
      method: 'POST',
      headers,
      body: JSON.stringify(params),
    });
    const data = (await resp.json()) as { reply?: string; error?: string };
    if (resp.ok && typeof data.reply === 'string' && data.reply.trim().length > 0) {
      return data.reply.trim();
    }
    if (resp.status === 429 && data?.error) {
      return data.error;
    }
  } catch {
    // Graceful offline contrastive fallback below
  }

  const trapNote = params.turkishTrapTr
    ? `Yapısal Neden: ${params.turkishTrapTr}`
    : 'Türkçe sondan eklemeli (SOV) yapıyı hedef dile birebir çevirmek yerine çekimli fiili öznenin hemen arkasına yerleştirin.';
  const targetNote = params.phrase ? `Doğal kalıp: "${params.phrase}". ` : '';
  return `${targetNote}${trapNote}`;
}

export async function createPlanCheckoutIntent(planCode: string): Promise<{
  displayName: string;
  authoritativePriceCents: number;
  currency: string;
}> {
  const jwt = await getBearerJwt();
  if (!jwt) throw new Error('Önce bulut hesabınıza giriş yapın.');
  const resp = await fetch(`${CLOUD_API_URL}/checkout`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${jwt}`,
    },
    body: JSON.stringify({ planCode }),
  });
  const data = await resp.json();
  if (!resp.ok) {
    throw new Error(data?.error || 'Ödeme oturumu başlatılamadı.');
  }
  return data.checkoutIntent;
}
