import crypto from 'node:crypto';
import { describe, expect, it } from 'vitest';
import {
  BadJsonBodyError,
  buildSecurityHeaders,
  PayloadTooLargeError,
  readBoundedJsonBody,
  resolveCorsOrigin,
  validateVaultStructure,
  verifyWebhookHmacSignature,
} from '../functions/lingonestapi/src/core.mjs';

describe('LingoNest API v3.0 — Security, CORS, Bounds & Webhook HMAC', () => {
  it('verifies payment webhook HMAC-SHA256 in constant time and blocks tampering', () => {
    const secret = 'ln_whsec_test_32_bytes_secret_key';
    const raw = Buffer.from(JSON.stringify({ eventId: 'evt_1', userId: 'u_9', planCode: 'PRO_PLUS' }));
    const sig = crypto.createHmac('sha256', secret).update(raw).digest('hex');

    expect(verifyWebhookHmacSignature(secret, raw, `sha256=${sig}`)).toBe(true);
    expect(verifyWebhookHmacSignature('wrong', raw, `sha256=${sig}`)).toBe(false);
  });

  it('enforces strict CORS origin allowlist and defensive HTTP headers', () => {
    expect(resolveCorsOrigin('http://localhost:5175')).toBe('http://localhost:5175');
    expect(resolveCorsOrigin('https://evil.example.org')).not.toBe('https://evil.example.org');
    const hdrs = buildSecurityHeaders('http://localhost:5175', 'ln_req_1');
    expect(hdrs['X-Frame-Options']).toBe('DENY');
    expect(hdrs['X-Content-Type-Options']).toBe('nosniff');
  });

  it('rejects oversized bodies and invalid vault payloads', async () => {
    const bigReq = new Request('https://lingonest.dev/vault', {
      method: 'PUT',
      body: 'a'.repeat(300 * 1024),
    });
    await expect(readBoundedJsonBody(bigReq, 256 * 1024)).rejects.toThrow(PayloadTooLargeError);

    const badReq = new Request('https://lingonest.dev/vault', {
      method: 'PUT',
      body: '{not_json',
    });
    await expect(readBoundedJsonBody(badReq, 256 * 1024)).rejects.toThrow(BadJsonBodyError);

    expect(validateVaultStructure({ profiles: [] }, 6).ok).toBe(false);
    expect(validateVaultStructure({ profiles: [{ id: 'p1', name: 'Ada' }] }, 6).ok).toBe(true);
  });
});
