/**
 * LingoNest API v3.0.0 — Hermetik Üretim Kontrol Düzlemi & Canlı Kontrastif Dil Koçu
 * - EdDSA JWKS (@neon/auth) Bearer doğrulaması
 * - İyimser Eşzamanlılık Kilitli (OCC 409 Conflict) Çoklu-Profil FSRS Kasası (GET/PUT /vault)
 * - Çift Pencereli (Dakikalık + 24 Saatlik Günlük) Postgres Hız Sınırlayıcı
 * - Sabit-zamanlı HMAC imzalı ve idempotent ödeme webhook işleyicisi (POST /webhooks/payment)
 * - Canlı 120B Türkçe Kontrastif Dil ve Telaffuz Koçu (POST /coach)
 */
import crypto from 'node:crypto';
import { createRemoteJWKSet, jwtVerify } from 'jose';
import pg from 'pg';
import {
  BadJsonBodyError,
  buildSecurityHeaders,
  MAX_COACH_BODY_BYTES,
  MAX_VAULT_BODY_BYTES,
  PayloadTooLargeError,
  readBoundedJsonBody,
  readBoundedRawBody,
  validateVaultStructure,
  verifyWebhookHmacSignature,
} from './core.mjs';

const { Pool } = pg;

let pool = null;
function getPool() {
  if (!pool && process.env.DATABASE_URL) {
    pool = new Pool({
      connectionString: process.env.DATABASE_URL,
      max: 5,
      idleTimeoutMillis: 25000,
      connectionTimeoutMillis: 8000,
      ssl: { rejectUnauthorized: false },
    });
    pool.on('error', () => {});
  }
  return pool;
}

let jwks = null;
function getJwks() {
  const url =
    process.env.NEON_AUTH_JWKS_URL ||
    'https://ep-super-grass-bhia8pi1.neonauth.c-10.eu-central-1.aws.neon.tech/neondb/auth/.well-known/jwks.json';
  if (!jwks) {
    jwks = createRemoteJWKSet(new URL(url));
  }
  return jwks;
}

function jsonRes(body, status, originHeader, requestId, extraHeaders = {}) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      ...buildSecurityHeaders(originHeader, requestId, extraHeaders),
    },
  });
}

async function verifyBearerUser(request) {
  const authHeader = request.headers.get('authorization') || '';
  if (!authHeader.startsWith('Bearer ')) return null;
  const token = authHeader.slice(7).trim();
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, getJwks());
    if (!payload?.sub) return null;
    return {
      userId: String(payload.sub),
      email: payload.email ? String(payload.email) : null,
    };
  } catch {
    return null;
  }
}

function derivePrincipalKey(user, request, secret) {
  if (user?.userId) return `usr:${user.userId}`;
  const fwd = (request.headers.get('x-forwarded-for') || '').split(',')[0].trim();
  const ua = request.headers.get('user-agent') || 'unknown';
  const digest = crypto
    .createHmac('sha256', secret)
    .update(`${fwd}|${ua}`)
    .digest('hex')
    .slice(0, 16);
  return `anon:${digest}`;
}

async function enforcePrincipalQuota(
  db,
  principalKey,
  routeBucket,
  limitCount,
  originHeader,
  requestId,
  windowSeconds = 60,
) {
  if (!db) return null;
  const nowSec = Math.floor(Date.now() / 1000);
  const windowEpoch = Math.floor(nowSec / windowSeconds);
  const resetInSec = Math.max(1, (windowEpoch + 1) * windowSeconds - nowSec);

  try {
    const r = await db.query(
      `INSERT INTO lingonest_api_quotas (principal_key, route_bucket, window_epoch, hit_count)
       VALUES ($1, $2, $3, 1)
       ON CONFLICT (principal_key, route_bucket, window_epoch)
       DO UPDATE SET hit_count = lingonest_api_quotas.hit_count + 1
       RETURNING hit_count`,
      [principalKey, routeBucket, windowEpoch],
    );
    const hits = Number(r.rows[0]?.hit_count ?? 1);
    const remaining = Math.max(0, limitCount - hits);
    const rateHeaders = {
      'RateLimit-Limit': String(limitCount),
      'RateLimit-Remaining': String(remaining),
    };
    if (hits > limitCount) {
      const msg =
        windowSeconds >= 3600
          ? `Günlük kullanım sınırına (${limitCount}/gün) ulaştınız; yarın tekrar devam edebilirsiniz.`
          : `Çok hızlı istek gönderildi (${limitCount}/dk). Lütfen ${resetInSec} saniye bekleyin.`;
      return jsonRes({ error: msg }, 429, originHeader, requestId, {
        ...rateHeaders,
        'Retry-After': String(resetInSec),
      });
    }
    return { rateHeaders };
  } catch {
    return null;
  }
}

async function resolveUserSubscription(db, userId) {
  const fallback = {
    plan_code: 'FREE_FAMILY',
    status: 'active',
    display_name: 'Ücretsiz Başlangıç (2 Profil)',
    max_profiles: 6,
    current_period_end: null,
  };
  if (!db || !userId) return fallback;
  try {
    const r = await db.query(
      `SELECT us.plan_code, us.status, us.current_period_end,
              pc.display_name, pc.max_profiles
       FROM lingonest_user_subscriptions us
       JOIN lingonest_plan_catalog pc ON pc.plan_code = us.plan_code
       WHERE us.user_id = $1`,
      [userId],
    );
    if (r.rows.length > 0) {
      const row = r.rows[0];
      return {
        plan_code: row.plan_code,
        status: row.status,
        display_name: row.display_name,
        max_profiles: Math.max(2, Number(row.max_profiles ?? 6)),
        current_period_end: row.current_period_end,
      };
    }
  } catch {
    // Varsayılan plan ile devam et
  }
  return fallback;
}

async function callContrastiveCoachLLM(systemPrompt, userPrompt) {
  const candidates = [];
  if (process.env.NEON_AI_GATEWAY_BASE_URL && process.env.NEON_AI_GATEWAY_TOKEN) {
    candidates.push({
      name: 'neon-ai-gateway',
      url: `${process.env.NEON_AI_GATEWAY_BASE_URL.replace(/\/+$/, '')}/v1/chat/completions`,
      key: process.env.NEON_AI_GATEWAY_TOKEN,
      model: 'gpt-4o-mini',
    });
  }
  if (process.env.GROQ_API_KEY) {
    candidates.push({
      name: 'groq-lpu',
      url: 'https://api.groq.com/openai/v1/chat/completions',
      key: process.env.GROQ_API_KEY,
      model: 'openai/gpt-oss-120b',
    });
  }
  if (process.env.OPENROUTER_API_KEY) {
    candidates.push({
      name: 'openrouter',
      url: 'https://openrouter.ai/api/v1/chat/completions',
      key: process.env.OPENROUTER_API_KEY,
      model: 'openai/gpt-oss-120b:free',
    });
  }

  for (const p of candidates) {
    const ctrl = new AbortController();
    const timer = setTimeout(() => ctrl.abort(), 8000);
    try {
      const resp = await fetch(p.url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'User-Agent': 'LingoNest/3.0',
          Authorization: `Bearer ${p.key}`,
        },
        body: JSON.stringify({
          model: p.model,
          temperature: 0.3,
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: userPrompt },
          ],
        }),
        signal: ctrl.signal,
      });
      if (resp.ok) {
        const data = await resp.json();
        const raw = String(data?.choices?.[0]?.message?.content ?? '')
          .replace(/<think>[\s\S]*?<\/think>/g, '')
          .trim();
        if (raw.length > 12) {
          return { reply: raw, provider: p.name };
        }
      }
    } catch {
      // Sonraki sağlayıcı
    } finally {
      clearTimeout(timer);
    }
  }
  return null;
}

export default {
  async fetch(request) {
    const requestId = `ln_${crypto.randomUUID().slice(0, 12)}`;
    const originHeader = request.headers.get('origin');

    if (request.method === 'OPTIONS') {
      return new Response(null, {
        status: 204,
        headers: buildSecurityHeaders(originHeader, requestId),
      });
    }

    const url = new URL(request.url);
    const path = url.pathname.replace(/\/+$/, '') || '/';
    const db = getPool();
    const hmacSecret = process.env.LINGONEST_HMAC_SECRET || 'lingonest-sovereign-hmac-v3';
    const webhookSecret = process.env.PAYMENT_WEBHOOK_SECRET || hmacSecret;

    try {
      // 1. SAĞLIK UÇ NOKTASI
      if (path === '/' || path === '/health') {
        let planCount = 0;
        if (db) {
          try {
            const r = await db.query('SELECT COUNT(*)::int AS c FROM lingonest_plan_catalog');
            planCount = Number(r.rows[0]?.c ?? 0);
          } catch {
            planCount = 0;
          }
        }
        return jsonRes(
          {
            ok: true,
            service: 'lingonestapi',
            version: '3.0.0',
            requestId,
            pgConnected: Boolean(db),
            coachConfigured: Boolean(
              process.env.GROQ_API_KEY ||
                process.env.NEON_AI_GATEWAY_TOKEN ||
                process.env.OPENROUTER_API_KEY,
            ),
            planCount,
          },
          200,
          originHeader,
          requestId,
        );
      }

      // 2. PLAN KATALOĞU (GET /plans)
      if (path === '/plans' && request.method === 'GET') {
        if (db) {
          try {
            const r = await db.query(
              `SELECT plan_code, display_name, price_cents, currency, billing_interval, max_profiles
               FROM lingonest_plan_catalog
               ORDER BY price_cents ASC`,
            );
            if (r.rows.length > 0) {
              return jsonRes({ plans: r.rows }, 200, originHeader, requestId);
            }
          } catch {
            // Sabit katalog yedeğine düş
          }
        }
        return jsonRes(
          {
            plans: [
              {
                plan_code: 'FREE_FAMILY',
                display_name: 'Ücretsiz Başlangıç',
                price_cents: 0,
                currency: 'TRY',
                billing_interval: 'month',
                max_profiles: 2,
              },
              {
                plan_code: 'PRO_PLUS',
                display_name: 'LingoNest Aile & Usta Planı',
                price_cents: 19000,
                currency: 'TRY',
                billing_interval: 'month',
                max_profiles: 6,
              },
            ],
          },
          200,
          originHeader,
          requestId,
        );
      }

      // 3. İYİMSER EŞZAMANLILIK KİLİTLİ (OCC) BULUT KASA (GET / PUT /vault)
      if (path === '/vault' && request.method === 'GET') {
        const user = await verifyBearerUser(request);
        if (!user) {
          return jsonRes(
            { error: 'Yetkisiz erişim (Bearer JWT gerekli).' },
            401,
            originHeader,
            requestId,
          );
        }
        const subscription = await resolveUserSubscription(db, user.userId);
        const r = await db.query(
          'SELECT vault_json, revision, updated_at FROM lingonest_user_vaults WHERE user_id = $1',
          [user.userId],
        );
        if (r.rows.length === 0) {
          return jsonRes(
            {
              userId: user.userId,
              email: user.email,
              subscription,
              vault: null,
              revision: 0,
              updatedAt: null,
            },
            200,
            originHeader,
            requestId,
          );
        }
        return jsonRes(
          {
            userId: user.userId,
            email: user.email,
            subscription,
            vault: r.rows[0].vault_json,
            revision: Number(r.rows[0].revision),
            updatedAt: r.rows[0].updated_at,
          },
          200,
          originHeader,
          requestId,
        );
      }

      if (path === '/vault' && request.method === 'PUT') {
        const user = await verifyBearerUser(request);
        if (!user) {
          return jsonRes(
            { error: 'Yetkisiz erişim (Bearer JWT gerekli).' },
            401,
            originHeader,
            requestId,
          );
        }
        const minQuota = await enforcePrincipalQuota(
          db,
          `usr:${user.userId}`,
          'vault_put',
          30,
          originHeader,
          requestId,
          60,
        );
        if (minQuota instanceof Response) return minQuota;

        const body = await readBoundedJsonBody(request, MAX_VAULT_BODY_BYTES);
        const subscription = await resolveUserSubscription(db, user.userId);
        const check = validateVaultStructure(body?.vault, Math.max(6, subscription.max_profiles));
        if (!check.ok) {
          return jsonRes({ error: check.error }, 400, originHeader, requestId);
        }

        const expectedRevision =
          typeof body?.expectedRevision === 'number' ? body.expectedRevision : null;
        if (expectedRevision !== null) {
          const cur = await db.query(
            'SELECT revision, vault_json, updated_at FROM lingonest_user_vaults WHERE user_id = $1',
            [user.userId],
          );
          if (cur.rows.length > 0 && Number(cur.rows[0].revision) > expectedRevision) {
            return jsonRes(
              {
                error: 'Başka bir cihazda yeni ilerleme kaydedilmiş; kasalar birleştiriliyor.',
                conflict: true,
                revision: Number(cur.rows[0].revision),
                vault: cur.rows[0].vault_json,
                updatedAt: cur.rows[0].updated_at,
              },
              409,
              originHeader,
              requestId,
            );
          }
        }

        const up = await db.query(
          `INSERT INTO lingonest_user_vaults (user_id, email, vault_json, revision, updated_at)
           VALUES ($1, $2, $3::jsonb, 1, NOW())
           ON CONFLICT (user_id) DO UPDATE
           SET vault_json = EXCLUDED.vault_json,
               email = COALESCE(EXCLUDED.email, lingonest_user_vaults.email),
               revision = lingonest_user_vaults.revision + 1,
               updated_at = NOW()
           RETURNING revision, updated_at`,
          [user.userId, user.email, JSON.stringify(body.vault)],
        );
        return jsonRes(
          {
            ok: true,
            revision: Number(up.rows[0].revision),
            updatedAt: up.rows[0].updated_at,
          },
          200,
          originHeader,
          requestId,
          minQuota?.rateHeaders,
        );
      }

      // 4. SUNUCU YETKİLİ ÖDEME NİYETİ (POST /checkout)
      if (path === '/checkout' && request.method === 'POST') {
        const user = await verifyBearerUser(request);
        if (!user) {
          return jsonRes(
            { error: 'Önce bulut hesabınıza giriş yapın.' },
            401,
            originHeader,
            requestId,
          );
        }
        const body = await readBoundedJsonBody(request, 8 * 1024);
        const planCode = String(body?.planCode ?? '').trim();
        const r = await db.query(
          'SELECT plan_code, display_name, price_cents, currency FROM lingonest_plan_catalog WHERE plan_code = $1',
          [planCode],
        );
        if (r.rows.length === 0) {
          return jsonRes({ error: 'Geçersiz plan kodu.' }, 400, originHeader, requestId);
        }
        const p = r.rows[0];
        return jsonRes(
          {
            ok: true,
            checkoutIntent: {
              planCode: p.plan_code,
              displayName: p.display_name,
              authoritativePriceCents: Number(p.price_cents),
              currency: p.currency,
            },
          },
          200,
          originHeader,
          requestId,
        );
      }

      // 5. İDEMPOTENT VE SABİT-ZAMANLI HMAC ÖDEME WEBHOOK İŞLEYİCİSİ (POST /webhooks/payment)
      if (path === '/webhooks/payment' && request.method === 'POST') {
        if (!db) return jsonRes({ error: 'Veritabanı bağlantısı yok.' }, 500, originHeader, requestId);
        const rawBuf = await readBoundedRawBody(request, 32 * 1024);
        const sig = request.headers.get('x-webhook-signature') || '';
        if (!verifyWebhookHmacSignature(webhookSecret, rawBuf, sig)) {
          return jsonRes({ error: 'Geçersiz webhook imzası.' }, 401, originHeader, requestId);
        }
        let payload;
        try {
          payload = JSON.parse(rawBuf.toString('utf8'));
        } catch {
          throw new BadJsonBodyError();
        }
        const eventId = String(payload?.eventId ?? '').trim();
        const userId = String(payload?.userId ?? '').trim();
        const planCode = String(payload?.planCode ?? 'PRO_PLUS').trim();
        if (!eventId || !userId) {
          return jsonRes({ error: 'eventId ve userId zorunludur.' }, 400, originHeader, requestId);
        }

        const client = await db.connect();
        try {
          await client.query('BEGIN');
          const ins = await client.query(
            `INSERT INTO lingonest_webhook_events (event_id, provider, event_type, payload)
             VALUES ($1, 'citadel_pay', 'subscription.activated', $2::jsonb)
             ON CONFLICT (event_id) DO NOTHING
             RETURNING event_id`,
            [eventId, JSON.stringify(payload)],
          );
          if (ins.rows.length === 0) {
            await client.query('COMMIT');
            return jsonRes({ ok: true, idempotentDuplicate: true, eventId }, 200, originHeader, requestId);
          }
          await client.query(
            `INSERT INTO lingonest_user_subscriptions (user_id, plan_code, status, current_period_end, updated_at)
             VALUES ($1, $2, 'active', NOW() + INTERVAL '31 days', NOW())
             ON CONFLICT (user_id) DO UPDATE
             SET plan_code = EXCLUDED.plan_code,
                 status = 'active',
                 current_period_end = NOW() + INTERVAL '31 days',
                 updated_at = NOW()`,
            [userId, planCode],
          );
          await client.query('COMMIT');
        } catch (err) {
          await client.query('ROLLBACK');
          throw err;
        } finally {
          client.release();
        }
        return jsonRes({ ok: true, idempotentDuplicate: false, eventId }, 200, originHeader, requestId);
      }

      // 6. ÇİFT KOTALI CANLI 120B KONTRASTİF DİL KOÇU (POST /coach)
      if (path === '/coach' && request.method === 'POST') {
        const user = await verifyBearerUser(request);
        const principalKey = derivePrincipalKey(user, request, hmacSecret);

        const minQ = await enforcePrincipalQuota(
          db,
          principalKey,
          'coach_min',
          15,
          originHeader,
          requestId,
          60,
        );
        if (minQ instanceof Response) return minQ;

        const dayQ = await enforcePrincipalQuota(
          db,
          principalKey,
          'coach_daily',
          60,
          originHeader,
          requestId,
          86400,
        );
        if (dayQ instanceof Response) return dayQ;

        const body = await readBoundedJsonBody(request, MAX_COACH_BODY_BYTES);
        const targetLang = ['en', 'de', 'es'].includes(body?.targetLang) ? body.targetLang : 'en';
        const langLabel =
          targetLang === 'de' ? 'Almanca' : targetLang === 'es' ? 'İspanyolca' : 'İngilizce';
        const phrase = String(body?.phrase ?? '').slice(0, 300);
        const learnerAttempt = String(body?.learnerAttempt ?? '').slice(0, 400);
        const question = String(body?.question ?? '').slice(0, 400);
        const trapNote = String(body?.turkishTrapTr ?? '').slice(0, 500);

        const systemPrompt = [
          `Sen LingoNest bünyesinde Türkçe anadilli öğrencilere ${langLabel} öğreten kıdemli bir karşılaştırmalı dilbilim eğitmenisin.`,
          'KURALLAR:',
          '1. Sakin, doğal, saygılı ve insancıl bir Türkçe kullan; emoji KULLANMA.',
          '2. Yanıtın 2 ile 4 kısa cümle arasında olsun: Türkçe düşünmekten kaynaklanan sözdizimi/edat/zaman farkını net bir mantıkla açıkla ve 1 doğal örnek cümle ver.',
          trapNote ? `Referans Dilbilim Notu: ${trapNote}` : '',
        ]
          .filter(Boolean)
          .join('\n');

        const userPrompt = [
          phrase ? `Hedef Kalıp (${langLabel}): ${phrase}` : '',
          learnerAttempt ? `Öğrencinin Yazdığı/Söylediği: ${learnerAttempt}` : '',
          question ? `Öğrencinin Sorusu: ${question}` : 'Bu kalıbın Türkçe ile temel yapı farkını ve doğal kullanımını kısaca açıklar mısın?',
        ]
          .filter(Boolean)
          .join('\n');

        const llm = await callContrastiveCoachLLM(systemPrompt, userPrompt);
        if (llm) {
          return jsonRes(
            { ok: true, reply: llm.reply, provider: llm.provider },
            200,
            originHeader,
            requestId,
            dayQ?.rateHeaders || minQ?.rateHeaders,
          );
        }

        const deterministicReply = trapNote
          ? `${trapNote} Doğal kullanım için hedef cümleyi yüksek sesle iki kez tekrar edip kelime bloklarının sırasına dikkat edin.`
          : `${langLabel} cümle kurarken yüklemi Türkçedeki gibi en sona bırakmak yerine özneden hemen sonra kurmaya ve edat-isim kalıbını bütün olarak hatırlamaya odaklanın.`;

        return jsonRes(
          { ok: true, reply: deterministicReply, provider: 'deterministic-linguist' },
          200,
          originHeader,
          requestId,
          dayQ?.rateHeaders || minQ?.rateHeaders,
        );
      }

      return jsonRes({ error: 'Uç nokta bulunamadı.' }, 404, originHeader, requestId);
    } catch (err) {
      if (err instanceof PayloadTooLargeError) {
        return jsonRes({ error: err.message }, 413, originHeader, requestId);
      }
      if (err instanceof BadJsonBodyError) {
        return jsonRes({ error: err.message }, 400, originHeader, requestId);
      }
      return jsonRes(
        { error: 'Sunucu işlemi sırasında beklenmeyen bir hata oluştu.' },
        500,
        originHeader,
        requestId,
      );
    }
  },
};
