import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, '..');
const ssrEntryPath = path.join(rootDir, 'dist-ssr', 'entry-ssg.js');
const distIndexPath = path.join(rootDir, 'dist', 'index.html');

const { renderAppHTML } = await import(pathToFileURL(ssrEntryPath).href);
const renderedHtml = renderAppHTML();

const rawIndex = fs.readFileSync(distIndexPath, 'utf-8');
if (!rawIndex.includes('<!--SSG_OUTLET-->')) {
  throw new Error('<!--SSG_OUTLET--> marker missing in dist/index.html');
}

const finalHtml = rawIndex.replace('<!--SSG_OUTLET-->', renderedHtml);
fs.writeFileSync(distIndexPath, finalHtml, 'utf-8');
fs.rmSync(path.join(rootDir, 'dist-ssr'), { recursive: true, force: true });
console.log(`[SSG] Prerendered ${renderedHtml.length} bytes of semantic HTML into dist/index.html`);
