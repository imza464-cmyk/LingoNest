#!/usr/bin/env node
/**
 * LingoNest — Kanonik Ön Yüz Bulut Dağıtım Motoru (Neon Compute HTTPS Edge)
 * `dist/` içindeki üretim varlıklarını (SSG HTML, CSS, JS parçaları, ses manifestosu, SVG/SEO)
 * önceden sıkıştırılmış (gzip seviye 9) sıfır-bağımlılıklı bir Node.js 24 sunucusu olarak paketler,
 * `.vpak` nöral ses paketlerini ise CDN önbellekli olarak yönlendirip `lingonest` adıyla yayınlar.
 */
import crypto from 'node:crypto';
import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import zlib from 'node:zlib';

const ROOT = path.resolve(import.meta.dirname, '..');
const DIST_WEB = path.join(ROOT, 'dist');
const OUT_DIR = path.join(ROOT, 'neon/functions/lingonest/dist');
const OUT_ENTRY = path.join(OUT_DIR, 'index.mjs');
const AUDIO_CDN_BASE = 'https://imza464-cmyk.github.io/LingoNest';

if (!fs.existsSync(path.join(DIST_WEB, 'index.html'))) {
  throw new Error('Önce `npm run build` çalıştırılmalıdır (`dist/index.html` bulunamadı).');
}

const MIME_MAP = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.mjs': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.webmanifest': 'application/manifest+json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.woff2': 'font/woff2',
  '.png': 'image/png',
  '.txt': 'text/plain; charset=utf-8',
  '.xml': 'application/xml; charset=utf-8',
  '.ico': 'image/x-icon',
};

const COMPRESSIBLE_EXTS = new Set([
  '.html',
  '.css',
  '.js',
  '.mjs',
  '.json',
  '.webmanifest',
  '.svg',
  '.txt',
  '.xml',
]);

function collectFiles(dir, prefix = '') {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  const map = {};
  for (const ent of entries) {
    if (ent.name === '_headers' || ent.name === '.nojekyll') continue;
    const abs = path.join(dir, ent.name);
    const urlPath = `${prefix}/${ent.name}`;
    if (ent.isDirectory()) {
      Object.assign(map, collectFiles(abs, urlPath));
    } else if (ent.isFile()) {
      const ext = path.extname(ent.name).toLowerCase();
      // 1,969 neural .vpak audio blobs (~40 MB) are served via immutable GitHub Pages CDN
      if (ext === '.vpak') continue;
      const raw = fs.readFileSync(abs);
      const mime = MIME_MAP[ext] || 'application/octet-stream';
      const useGzip = COMPRESSIBLE_EXTS.has(ext) && raw.byteLength > 256;
      const payload = useGzip ? zlib.gzipSync(raw, { level: 9 }) : raw;
      const etag = `"${crypto.createHash('sha1').update(raw).digest('hex').slice(0, 16)}"`;
      map[urlPath] = {
        mime,
        gzip: useGzip,
        immutable: urlPath.startsWith('/assets/'),
        etag,
        b64: payload.toString('base64'),
      };
    }
  }
  return map;
}

const assetManifest = collectFiles(DIST_WEB);
fs.mkdirSync(OUT_DIR, { recursive: true });

const serverSource = `import zlib from 'node:zlib';

const ASSETS = ${JSON.stringify(assetManifest)};
const AUDIO_CDN = ${JSON.stringify(AUDIO_CDN_BASE)};

export default {
  async fetch(request) {
    if (request.method !== 'GET' && request.method !== 'HEAD') {
      return new Response('Method Not Allowed', { status: 405 });
    }
    const url = new URL(request.url);
    let pathname = decodeURIComponent(url.pathname);
    if (pathname === '' || pathname === '/') pathname = '/index.html';

    if (pathname.startsWith('/audio/') && pathname.endsWith('.vpak')) {
      return new Response(null, {
        status: 302,
        headers: {
          Location: AUDIO_CDN + pathname,
          'Cache-Control': 'public, max-age=31536000, immutable',
          'Access-Control-Allow-Origin': '*',
        },
      });
    }

    let entry = ASSETS[pathname];
    if (!entry && !pathname.includes('.')) {
      entry = ASSETS['/index.html'];
    }
    if (!entry) {
      return new Response('Not Found', {
        status: 404,
        headers: { 'Content-Type': 'text/plain; charset=utf-8' },
      });
    }

    if (request.headers.get('if-none-match') === entry.etag) {
      return new Response(null, { status: 304, headers: { ETag: entry.etag } });
    }

    const acceptEnc = request.headers.get('accept-encoding') || '';
    const clientSupportsGzip = acceptEnc.includes('gzip');
    const storedBuf = Buffer.from(entry.b64, 'base64');

    let bodyBuf = storedBuf;
    const headers = {
      'Content-Type': entry.mime,
      ETag: entry.etag,
      'X-Content-Type-Options': 'nosniff',
      'X-Frame-Options': 'DENY',
      'Referrer-Policy': 'strict-origin-when-cross-origin',
      'Cache-Control': entry.immutable
        ? 'public, max-age=31536000, immutable'
        : 'public, max-age=0, must-revalidate',
    };

    if (entry.gzip && clientSupportsGzip) {
      headers['Content-Encoding'] = 'gzip';
      headers['Vary'] = 'Accept-Encoding';
    } else if (entry.gzip && !clientSupportsGzip) {
      bodyBuf = zlib.gunzipSync(storedBuf);
    }

    return new Response(request.method === 'HEAD' ? null : bodyBuf, {
      status: 200,
      headers,
    });
  },
};
`;

fs.writeFileSync(OUT_ENTRY, serverSource, 'utf8');
console.log(
  `[DEPLOY-WEB] Bundled ${Object.keys(assetManifest).length} assets (${Math.round(
    fs.statSync(OUT_ENTRY).size / 1024,
  )} KB) -> deploying lingonest...`,
);

const neonBin = process.platform === 'win32' ? 'neon.cmd' : 'neon';
const out = execFileSync(
  neonBin,
  [
    'functions',
    'deploy',
    'lingonest',
    '--project-id',
    'square-credit-05168902',
    '--branch',
    'br-icy-grass-bhsdqu67',
    '--src',
    OUT_ENTRY,
    '--runtime',
    'nodejs24',
  ],
  { cwd: ROOT, encoding: 'utf8', shell: true },
);
console.log(out.split('\n').slice(-10).join('\n'));
