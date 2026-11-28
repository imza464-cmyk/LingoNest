const TELEMETRY_URL =
  'https://br-quiet-mouse-bhiv2cwm-citadelacademyapi.compute.c-10.eu-central-1.aws.neon.tech/telemetry/pulse';
const VID_STORAGE_KEY = 'kale_vid_v1';
let lastRoute = '';
let lastTs = 0;

function getStableVid(): string {
  if (typeof window === 'undefined') return '';
  try {
    const cur = window.localStorage.getItem(VID_STORAGE_KEY);
    if (cur && cur.length >= 16 && cur.length <= 72) return cur;
    const next =
      typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function'
        ? crypto.randomUUID()
        : `kv-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 14)}`;
    window.localStorage.setItem(VID_STORAGE_KEY, next);
    return next;
  } catch {
    return `kv-eph-${Math.floor(Date.now() / 86400000)}`;
  }
}

export function sendLingoVisitorPulse(routePath: string): void {
  if (typeof window === 'undefined' || typeof navigator === 'undefined') return;
  const vid = getStableVid();
  if (!vid) return;
  const cleanPath = (routePath || '/').slice(0, 140);
  const now = Date.now();
  if (cleanPath === lastRoute && now - lastTs < 30_000) return;
  lastRoute = cleanPath;
  lastTs = now;

  const payload = JSON.stringify({
    siteId: 'lingonest',
    vid,
    path: cleanPath,
    ref: typeof document !== 'undefined' ? document.referrer || '' : '',
    vpW: window.innerWidth || 1280,
    uaBot: Boolean(navigator.webdriver),
  });

  try {
    if (typeof navigator.sendBeacon === 'function') {
      const ok = navigator.sendBeacon(
        TELEMETRY_URL,
        new Blob([payload], { type: 'text/plain;charset=UTF-8' }),
      );
      if (ok) return;
    }
  } catch {
    // fallback to fetch
  }

  fetch(TELEMETRY_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'text/plain;charset=UTF-8' },
    body: payload,
    keepalive: true,
  }).catch(() => {});
}
