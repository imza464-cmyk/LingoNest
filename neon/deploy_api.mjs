#!/usr/bin/env node
import { execFileSync, execSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

const ROOT = path.resolve(import.meta.dirname, '..');
const SRC_ENTRY = path.join(ROOT, 'neon/functions/lingonestapi/src/index.mjs');
const DIST_DIR = path.join(ROOT, 'neon/functions/lingonestapi/dist');
const DIST_ENTRY = path.join(DIST_DIR, 'index.mjs');

fs.mkdirSync(DIST_DIR, { recursive: true });

execSync(
  `npx esbuild "${SRC_ENTRY}" --bundle --minify --platform=node --target=node24 --format=esm --outfile="${DIST_ENTRY}" --banner:js="import { createRequire } from 'node:module'; const require = createRequire(import.meta.url);"`,
  { cwd: ROOT, stdio: 'inherit' },
);

const neonBin = process.platform === 'win32' ? 'neon.cmd' : 'neon';
const out = execFileSync(
  neonBin,
  [
    'functions',
    'deploy',
    'lingonestapi',
    '--project-id',
    'square-credit-05168902',
    '--branch',
    'br-icy-grass-bhsdqu67',
    '--src',
    DIST_ENTRY,
    '--runtime',
    'nodejs24',
  ],
  { cwd: ROOT, encoding: 'utf8', shell: true },
);
console.log(out.split('\n').slice(-10).join('\n'));
