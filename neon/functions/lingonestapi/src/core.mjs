/**
 * LingoNest API v3.0 — Saf Güvenlik, Kasa Birleştirme ve Kriptografik Doğrulama Çekirdeği
 * Hem Neon Function çalışma zamanında hem de Vitest birim testlerinde kullanılır.
 */
import crypto from 'node:crypto';

export const ALLOWED_ORIGINS = new Set([
  'http://localhost:5175',
  'http://127.0.0.1:5175',
  'http://localhost:4173',
  'http://127.0.0.1:4173',
  'https://lingonest.dev',
  'https://www.lingonest.dev',
  'https://celikmrt324-crypto.github.io',
  'https://imza464-cmyk.github.io',
  'https://br-icy-grass-bhsdqu67-lingonest.compute.c-10.eu-central-1.aws.neon.tech',
]);

export const MAX_VAULT_BODY_BYTES = 256 * 1024; // Çoklu profil FSRS kasası için 256 KiB üst sınır
export const MAX_COACH_BODY_BYTES = 16 * 1024;  // Canlı AI Koç isteği için 16 KiB üst sınır

export class PayloadTooLargeError extends Error {
  constructor(limitBytes = MAX_VAULT_BODY_BYTES) {
    super(`İstek boyutu üst sınırı (${limitBytes} bayt) aşıldı.`);
    this.name = 'PayloadTooLargeError';
  }
}

export class BadJsonBodyError extends Error {
  constructor() {
    super('Geçersiz JSON istek gövdesi.');
    this.name = 'BadJsonBodyError';
  }
}

export function resolveCorsOrigin(originHeader) {
  if (!originHeader) return 'https://br-icy-grass-bhsdqu67-lingonest.compute.c-10.eu-central-1.aws.neon.tech';
  const clean = String(originHeader).trim().replace(/\/+$/, '');
  if (
    ALLOWED_ORIGINS.has(clean) ||
    /^https:\/\/[a-z0-9-]+-lingonest[a-z0-9-]*\.(vercel\.app|pages\.dev)$/.test(clean) ||
    /^https:\/\/[a-z0-9-]+-lingonest\.compute\.[a-z0-9.-]+\.neon\.tech$/.test(clean)
  ) {
    return clean;
  }
  return 'https://br-icy-grass-bhsdqu67-lingonest.compute.c-10.eu-central-1.aws.neon.tech';
}

export function buildSecurityHeaders(originHeader, requestId, extra = {}) {
  return {
    'Access-Control-Allow-Origin': resolveCorsOrigin(originHeader),
    'Access-Control-Allow-Methods': 'GET, POST, PUT, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Webhook-Signature',
    'Access-Control-Expose-Headers':
      'X-Request-Id, RateLimit-Limit, RateLimit-Remaining, Retry-After',
    Vary: 'Origin',
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': 'DENY',
    'Referrer-Policy': 'strict-origin-when-cross-origin',
    'Cache-Control': 'no-store',
    ...(requestId ? { 'X-Request-Id': requestId } : {}),
    ...extra,
  };
}

export async function readBoundedRawBody(request, maxBytes = MAX_VAULT_BODY_BYTES) {
  const declaredLen = Number(request.headers.get('content-length') || 0);
  if (declaredLen > maxBytes) {
    throw new PayloadTooLargeError(maxBytes);
  }
  const buf = Buffer.from(await request.arrayBuffer());
  if (buf.byteLength > maxBytes) {
    throw new PayloadTooLargeError(maxBytes);
  }
  return buf;
}

export async function readBoundedJsonBody(request, maxBytes = MAX_VAULT_BODY_BYTES) {
  const buf = await readBoundedRawBody(request, maxBytes);
  if (buf.byteLength === 0) return {};
  try {
    return JSON.parse(buf.toString('utf8'));
  } catch {
    throw new BadJsonBodyError();
  }
}

export function verifyWebhookHmacSignature(webhookSecret, rawBodyBuffer, signatureHeader) {
  if (!webhookSecret || !signatureHeader || !Buffer.isBuffer(rawBodyBuffer)) {
    return false;
  }
  const cleanHeader = String(signatureHeader).trim().replace(/^sha256=/i, '');
  if (!/^[0-9a-fA-F]{64}$/.test(cleanHeader)) {
    return false;
  }
  const expectedHex = crypto
    .createHmac('sha256', webhookSecret)
    .update(rawBodyBuffer)
    .digest('hex');
  const bufA = Buffer.from(cleanHeader.toLowerCase(), 'utf8');
  const bufB = Buffer.from(expectedHex.toLowerCase(), 'utf8');
  if (bufA.length !== bufB.length) return false;
  return crypto.timingSafeEqual(bufA, bufB);
}

export function validateVaultStructure(vault, maxProfilesAllowed = 6) {
  if (!vault || typeof vault !== 'object' || !Array.isArray(vault.profiles)) {
    return { ok: false, error: 'Geçersiz kasa yapısı: profiles dizisi zorunludur.' };
  }
  if (vault.profiles.length === 0) {
    return { ok: false, error: 'Kasada en az 1 profil bulunmalıdır.' };
  }
  if (vault.profiles.length > maxProfilesAllowed) {
    return {
      ok: false,
      error: `Mevcut planınız en fazla ${maxProfilesAllowed} profil desteklemektedir.`,
    };
  }
  return { ok: true, error: null };
}
