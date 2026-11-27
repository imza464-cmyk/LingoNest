// ============================================================================
// LingoNest — Studio Neural Voice Pack + Offline Web Audio Marimba + Child ASR
// Architecture:
//   1. PRIMARY: Pre-synthesized Gen-4 HD Neural MP3 voices (public/audio/*.mp3)
//      - en: AvaMultilingualNeural (warm/child) + AndrewMultilingualNeural (partner/adult)
//      - de: AmalaNeural/KatjaNeural + ConradNeural
//      - es: ElviraNeural + AlvaroNeural
//      - tr: EmelNeural (warm affectionate guide for 5yo pre-literate learners!)
//      Zero robotic SAPI voice, pitch-preserved speed control (0.80x / 1.0x / 1.12x),
//      instant in-memory Blob caching, works 100% offline once loaded!
//   2. FALLBACK: Ranked browser Web Speech API only for ad-hoc uncached phrases.
//   3. PROCEDURAL FX: Web Audio pentatonic marimba chimes (ZERO harsh buzzers!).
//   4. CHILD-FORGIVING ASR: Levenshtein + Turkish-L1 Phonetic Skeleton Matcher.
// ============================================================================

import type { LanguageCode } from '../types';

export type VoiceRole = 'warm' | 'adult' | 'partner';
export type VoiceLang = LanguageCode | 'tr';

const LANG_BCP47: Record<VoiceLang, string[]> = {
  en: ['en-US', 'en-GB', 'en-AU', 'en'],
  de: ['de-DE', 'de-AT', 'de'],
  es: ['es-ES', 'es-MX', 'es-US', 'es'],
  tr: ['tr-TR', 'tr'],
};

interface AudioManifest {
  version: number;
  count: number;
  voices: Record<string, string>;
  clips: Record<string, string>; // keyHash -> relative filename e.g. "a1b2c3d4e5f6.mp3"
}

/**
 * Canonical text normalization shared bit-for-bit with scripts/build_neural_voices.py
 */
export function canonicalVoiceText(text: string): string {
  return text.trim().replace(/\s+/g, ' ');
}

/**
 * Deterministic 64-bit dual-FNV1a hex hash (16 hex chars) matching Python generator 100% bit-for-bit.
 */
export function hashAudioKey(lang: VoiceLang, role: VoiceRole, text: string): string {
  const payload = `${lang}|${role}|${canonicalVoiceText(text)}`;
  const bytes = new TextEncoder().encode(payload);

  let h1 = 0x811c9dc5;
  let h2 = 0x050c5d1f;
  for (let i = 0; i < bytes.length; i++) {
    const b = bytes[i];
    h1 ^= b;
    h1 = Math.imul(h1, 0x01000193) >>> 0;
    h2 ^= b ^ ((i * 31) & 0xff);
    h2 = Math.imul(h2, 0x01000193) >>> 0;
  }
  return h1.toString(16).padStart(8, '0') + h2.toString(16).padStart(8, '0');
}

export interface SpeakOptions {
  slow?: boolean;
  fast?: boolean;
  childPitch?: boolean;
  role?: VoiceRole;
  onStart?: () => void;
  onEnd?: () => void;
}

class LingoAudioEngine {
  private ctx: AudioContext | null = null;
  private voices: SpeechSynthesisVoice[] = [];
  private activeRecognition: SpeechRecognitionLike | null = null;

  private manifest: AudioManifest | null = null;
  private manifestPromise: Promise<AudioManifest | null> | null = null;
  private activeAudio: HTMLAudioElement | null = null;
  private activeAudioResolve: ((ok: boolean) => void) | null = null;
  private blobCache = new Map<string, string>();
  private sequenceToken = 0;
  private userCancelledMic = false;

  constructor() {
    if (typeof window !== 'undefined') {
      if ('speechSynthesis' in window) {
        const load = () => {
          this.voices = window.speechSynthesis.getVoices();
        };
        load();
        window.speechSynthesis.onvoiceschanged = load;
      }
      // Allow Android onPause() to cleanly halt audio & mic when app enters background
      (window as unknown as { __lingonestPauseAudio?: () => void }).__lingonestPauseAudio = () => {
        this.stopSpeaking();
        this.stopListening();
      };
      void this.ensureManifest();
    }
  }

  public ensureManifest(): Promise<AudioManifest | null> {
    if (this.manifest) return Promise.resolve(this.manifest);
    if (this.manifestPromise) return this.manifestPromise;
    if (typeof window === 'undefined' || typeof fetch === 'undefined') {
      return Promise.resolve(null);
    }
    const base = (import.meta as unknown as { env?: { BASE_URL?: string } }).env?.BASE_URL ?? './';
    const manifestUrl = `${base.endsWith('/') ? base : `${base}/`}audio/manifest.json`;
    this.manifestPromise = fetch(manifestUrl)
      .then((res) => (res.ok ? (res.json() as Promise<AudioManifest>) : null))
      .then((data) => {
        if (data && data.clips) {
          this.manifest = data;
        }
        return this.manifest;
      })
      .catch(() => null);
    return this.manifestPromise;
  }

  public getNeuralClipCount(): number {
    return this.manifest?.count ?? 0;
  }

  private getAudioCtx(): AudioContext | null {
    if (typeof window === 'undefined') return null;
    if (!this.ctx) {
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      void this.ctx.resume().catch(() => {});
    }
    return this.ctx;
  }

  public pickBestVoice(lang: VoiceLang): SpeechSynthesisVoice | null {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return null;
    if (this.voices.length === 0) {
      this.voices = window.speechSynthesis.getVoices();
    }
    const prefs = LANG_BCP47[lang];
    const matches = this.voices.filter((v) =>
      prefs.some((p) => v.lang.toLowerCase().startsWith(p.toLowerCase())),
    );
    if (matches.length === 0) return null;

    const score = (v: SpeechSynthesisVoice): number => {
      let s = 0;
      const n = v.name.toLowerCase();
      if (n.includes('natural') || n.includes('neural') || n.includes('online')) s += 45;
      if (n.includes('ava') || n.includes('emma') || n.includes('emel') || n.includes('google') || n.includes('samantha')) s += 30;
      if (n.includes('microsoft') || n.includes('apple')) s += 12;
      if (v.lang.toLowerCase() === prefs[0].toLowerCase()) s += 20;
      if (v.localService) s += 6;
      if (v.default) s += 4;
      return s;
    };

    return [...matches].sort((a, b) => score(b) - score(a))[0] ?? null;
  }

  private lookupNeuralUrl(lang: VoiceLang, role: VoiceRole, text: string): string | null {
    const m = this.manifest;
    if (!m) return null;
    const rolesToTry: VoiceRole[] =
      role === 'warm'
        ? ['warm', 'adult', 'partner']
        : role === 'partner'
          ? ['partner', 'adult', 'warm']
          : ['adult', 'warm', 'partner'];

    const base = (import.meta as unknown as { env?: { BASE_URL?: string } }).env?.BASE_URL ?? './';
    const audioPrefix = `${base.endsWith('/') ? base : `${base}/`}audio/`;
    for (const r of rolesToTry) {
      const k = hashAudioKey(lang, r, text);
      const file = m.clips[k];
      if (file) return `${audioPrefix}${file}`;
    }
    return null;
  }

  private async playNeuralUrl(
    url: string,
    opts?: SpeakOptions,
    token?: number,
  ): Promise<boolean> {
    if (typeof window === 'undefined' || typeof Audio === 'undefined') return false;
    try {
      let src = this.blobCache.get(url);
      if (!src) {
        const res = await fetch(url);
        if (!res.ok) return false;
        const buf = await res.arrayBuffer();
        const blob = new Blob([buf], { type: 'audio/mpeg' });
        if (this.blobCache.size > 160) {
          const firstKey = this.blobCache.keys().next().value;
          if (firstKey) {
            const old = this.blobCache.get(firstKey);
            if (old) URL.revokeObjectURL(old);
            this.blobCache.delete(firstKey);
          }
        }
        src = URL.createObjectURL(blob);
        this.blobCache.set(url, src);
      }

      if (token !== undefined && token !== this.sequenceToken) {
        opts?.onEnd?.();
        return true;
      }

      return await new Promise<boolean>((resolve) => {
        const el = new Audio(src);
        el.preload = 'auto';
        const rate = opts?.slow ? 0.88 : opts?.fast ? 1.1 : 1.0;
        el.playbackRate = rate;
        // Preserve natural human pitch even when slowed to 0.80x for 5-year-olds!
        const audioWithPitch = el as HTMLAudioElement & {
          preservesPitch?: boolean;
          webkitPreservesPitch?: boolean;
          mozPreservesPitch?: boolean;
        };
        audioWithPitch.preservesPitch = true;
        audioWithPitch.webkitPreservesPitch = true;
        audioWithPitch.mozPreservesPitch = true;

        this.activeAudio = el;

        let finished = false;
        const finish = (ok: boolean) => {
          if (finished) return;
          finished = true;
          if (this.activeAudio === el) {
            this.activeAudio = null;
          }
          if (this.activeAudioResolve === finish) {
            this.activeAudioResolve = null;
          }
          opts?.onEnd?.();
          resolve(ok);
        };
        this.activeAudioResolve = finish;

        el.onplay = () => opts?.onStart?.();
        el.onended = () => finish(true);
        el.onerror = () => finish(false);

        void el.play().catch(() => finish(false));
      });
    } catch {
      return false;
    }
  }

  private speakViaBrowserFallback(text: string, lang: VoiceLang, opts?: SpeakOptions): void {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      opts?.onEnd?.();
      return;
    }
    try {
      window.speechSynthesis.cancel();
      const voice = this.pickBestVoice(lang);
      // Never allow a Turkish system voice to read EN/DE/ES text with Turkish phonetics!
      if (!voice && lang !== 'tr' && this.voices.length > 0) {
        opts?.onEnd?.();
        return;
      }
      const u = new SpeechSynthesisUtterance(text);
      if (voice) {
        u.voice = voice;
        u.lang = voice.lang;
      } else {
        u.lang = LANG_BCP47[lang][0];
      }
      u.rate = opts?.slow ? 0.88 : opts?.fast ? 1.08 : 0.98;
      u.pitch = 1.0;
      u.volume = 1.0;
      u.onstart = () => opts?.onStart?.();
      u.onend = () => opts?.onEnd?.();
      u.onerror = () => opts?.onEnd?.();
      window.speechSynthesis.speak(u);
    } catch {
      opts?.onEnd?.();
    }
  }

  public speak(text: string, lang: LanguageCode, opts?: SpeakOptions): void {
    const clean = canonicalVoiceText(text);
    if (!clean) {
      opts?.onEnd?.();
      return;
    }
    this.stopSpeaking();
    const myToken = this.sequenceToken;
    const role: VoiceRole = opts?.role ?? (opts?.childPitch ? 'warm' : 'warm');

    void this.ensureManifest().then(async () => {
      if (myToken !== this.sequenceToken) return;
      const neuralUrl = this.lookupNeuralUrl(lang, role, clean);
      if (neuralUrl) {
        const ok = await this.playNeuralUrl(neuralUrl, opts, myToken);
        if (ok) return;
      }
      if (myToken === this.sequenceToken) {
        this.speakViaBrowserFallback(clean, lang, opts);
      }
    });
  }

  public speakTurkish(text: string, opts?: { slow?: boolean; onStart?: () => void; onEnd?: () => void }): void {
    const clean = canonicalVoiceText(text);
    if (!clean) {
      opts?.onEnd?.();
      return;
    }
    this.stopSpeaking();
    const myToken = this.sequenceToken;

    void this.ensureManifest().then(async () => {
      if (myToken !== this.sequenceToken) return;
      const neuralUrl = this.lookupNeuralUrl('tr', 'warm', clean);
      if (neuralUrl) {
        const ok = await this.playNeuralUrl(neuralUrl, { slow: opts?.slow, onStart: opts?.onStart, onEnd: opts?.onEnd }, myToken);
        if (ok) return;
      }
      if (myToken === this.sequenceToken) {
        this.speakViaBrowserFallback(clean, 'tr', { slow: opts?.slow, onStart: opts?.onStart, onEnd: opts?.onEnd });
      }
    });
  }

  /**
   * Plays a clean back-to-back sequence (e.g., warm Turkish praise -> native English target)
   * without overlapping or cutting off either clip!
   */
  public speakSequence(
    items: Array<{ text: string; lang: VoiceLang; slow?: boolean; fast?: boolean; role?: VoiceRole }>,
    callbacks?: { onStart?: () => void; onEnd?: () => void },
  ): void {
    this.stopSpeaking();
    const myToken = this.sequenceToken;
    callbacks?.onStart?.();

    const run = async () => {
      await this.ensureManifest();
      for (const item of items) {
        if (myToken !== this.sequenceToken) return;
        const clean = canonicalVoiceText(item.text);
        if (!clean) continue;
        const role: VoiceRole = item.role ?? 'warm';
        const neuralUrl = this.lookupNeuralUrl(item.lang, role, clean);
        if (neuralUrl) {
          const ok = await this.playNeuralUrl(
            neuralUrl,
            { slow: item.slow, fast: item.fast, role },
            myToken,
          );
          if (ok) continue;
        }
        if (myToken !== this.sequenceToken) return;
        await new Promise<void>((resolve) => {
          this.speakViaBrowserFallback(clean, item.lang, {
            slow: item.slow,
            fast: item.fast,
            onEnd: resolve,
          });
        });
      }
      if (myToken === this.sequenceToken) {
        callbacks?.onEnd?.();
      }
    };
    void run();
  }

  public stopSpeaking(): void {
    this.sequenceToken++;
    if (this.activeAudio) {
      try {
        this.activeAudio.pause();
        this.activeAudio.currentTime = 0;
        this.activeAudio.onended = null;
        this.activeAudio.onerror = null;
      } catch {
        // ignore
      }
      this.activeAudio = null;
    }
    if (this.activeAudioResolve) {
      const resolvePending = this.activeAudioResolve;
      this.activeAudioResolve = null;
      resolvePending(false);
    }
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
  }

  /**
   * Procedural Web Audio API Joyful Feedback Synthesizer (ZERO audio files, <3ms latency)
   */
  public playChime(kind: 'tap' | 'success' | 'celebrate' | 'gentle-nudge' | 'unlock', enabled = true): void {
    // Trigger native Android tactile haptic feedback if running inside LingoNest APK
    if (typeof window !== 'undefined') {
      const bridge = (window as unknown as { AndroidBridge?: AndroidBridgeLike }).AndroidBridge;
      try {
        bridge?.haptic?.(kind);
      } catch {
        // ignore
      }
    }
    if (!enabled) return;
    const ctx = this.getAudioCtx();
    if (!ctx) return;

    const now = ctx.currentTime;
    const sequences: Record<typeof kind, { notes: number[]; step: number; vol: number; wave: OscillatorType }> = {
      tap: { notes: [523.25], step: 0.05, vol: 0.12, wave: 'sine' },
      success: { notes: [523.25, 659.25, 783.99], step: 0.09, vol: 0.22, wave: 'triangle' },
      celebrate: { notes: [523.25, 587.33, 659.25, 783.99, 1046.5], step: 0.085, vol: 0.24, wave: 'triangle' },
      'gentle-nudge': { notes: [349.23, 329.63], step: 0.11, vol: 0.11, wave: 'sine' },
      unlock: { notes: [440, 554.37, 659.25, 880], step: 0.1, vol: 0.22, wave: 'sine' },
    };

    const seq = sequences[kind];
    seq.notes.forEach((freq, idx) => {
      const t0 = now + idx * seq.step;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const filter = ctx.createBiquadFilter();

      osc.type = seq.wave;
      osc.frequency.setValueAtTime(freq, t0);

      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(kind === 'gentle-nudge' ? 1200 : 2600, t0);

      gain.gain.setValueAtTime(0.0001, t0);
      gain.gain.linearRampToValueAtTime(seq.vol, t0 + 0.015);
      gain.gain.exponentialRampToValueAtTime(0.0001, t0 + 0.24);

      osc.connect(filter).connect(gain).connect(ctx.destination);
      osc.start(t0);
      osc.stop(t0 + 0.26);
    });
  }

  public supportsSpeechRecognition(): boolean {
    if (typeof window === 'undefined') return false;
    const w = window as unknown as {
      SpeechRecognition?: unknown;
      webkitSpeechRecognition?: unknown;
      AndroidBridge?: AndroidBridgeLike;
    };
    return Boolean(w.AndroidBridge?.startNativeSpeech || w.SpeechRecognition || w.webkitSpeechRecognition);
  }

  public startListening(
    lang: LanguageCode,
    onResult: (transcripts: string[]) => void,
    onError: (reason: string) => void,
    onEnd?: () => void,
  ): void {
    this.stopListening();
    this.userCancelledMic = false;
    if (typeof window === 'undefined') {
      onError('unsupported');
      return;
    }

    // Native Android SpeechRecognizer bridge (works inside LingoNest APK where WebView lacks webkitSpeechRecognition!)
    const wNative = window as unknown as {
      AndroidBridge?: AndroidBridgeLike;
      __onNativeSpeechResult?: (json: string) => void;
      __onNativeSpeechError?: (reason: string) => void;
    };
    if (wNative.AndroidBridge?.startNativeSpeech) {
      let settled = false;
      wNative.__onNativeSpeechResult = (json: string) => {
        if (settled) return;
        settled = true;
        if (this.userCancelledMic) {
          onEnd?.();
          return;
        }
        try {
          const parsed = JSON.parse(json) as string[];
          onResult(Array.isArray(parsed) ? parsed : []);
        } catch {
          onResult([]);
        }
        onEnd?.();
      };
      wNative.__onNativeSpeechError = (reason: string) => {
        if (settled) return;
        settled = true;
        if (this.userCancelledMic || reason === 'aborted') {
          onEnd?.();
          return;
        }
        onError(reason || 'mic-error');
        onEnd?.();
      };
      try {
        wNative.AndroidBridge.startNativeSpeech(LANG_BCP47[lang][0]);
        return;
      } catch {
        // fallback to Web Speech API
      }
    }

    const w = window as unknown as {
      SpeechRecognition?: new () => SpeechRecognitionLike;
      webkitSpeechRecognition?: new () => SpeechRecognitionLike;
    };
    const Ctor = w.SpeechRecognition || w.webkitSpeechRecognition;
    if (!Ctor) {
      onError('unsupported');
      return;
    }

    try {
      const rec = new Ctor();
      rec.lang = LANG_BCP47[lang][0];
      rec.interimResults = false;
      rec.maxAlternatives = 5;
      rec.continuous = false;

      let settled = false;
      rec.onresult = (ev: SpeechRecognitionEventLike) => {
        settled = true;
        const alts: string[] = [];
        const list = ev.results?.[0];
        if (list) {
          for (let i = 0; i < list.length; i++) {
            const t = list[i]?.transcript;
            if (t) alts.push(t);
          }
        }
        onResult(alts);
      };
      rec.onerror = (ev: { error?: string }) => {
        if (!settled) {
          settled = true;
          if (this.userCancelledMic || ev.error === 'aborted') {
            return;
          }
          onError(ev.error || 'mic-error');
        }
      };
      rec.onend = () => {
        this.activeRecognition = null;
        onEnd?.();
      };

      this.activeRecognition = rec;
      rec.start();
    } catch {
      onError('start-failed');
    }
  }

  public stopListening(): void {
    this.userCancelledMic = true;
    if (typeof window !== 'undefined') {
      const bridge = (window as unknown as { AndroidBridge?: AndroidBridgeLike }).AndroidBridge;
      try {
        bridge?.stopNativeSpeech?.();
      } catch {
        // ignore
      }
    }
    if (this.activeRecognition) {
      try {
        this.activeRecognition.abort();
      } catch {
        // ignore
      }
      this.activeRecognition = null;
    }
  }
}

interface AndroidBridgeLike {
  setThemeMode?: (mode: string) => void;
  haptic?: (kind: string) => void;
  startNativeSpeech?: (bcp47: string) => void;
  stopNativeSpeech?: () => void;
  shareJsonBackup?: (filename: string, jsonContent: string) => void;
}

interface SpeechRecognitionEventLike {
  results?: ArrayLike<ArrayLike<{ transcript?: string }>>;
}

interface SpeechRecognitionLike {
  lang: string;
  interimResults: boolean;
  maxAlternatives: number;
  continuous: boolean;
  onresult: ((ev: SpeechRecognitionEventLike) => void) | null;
  onerror: ((ev: { error?: string }) => void) | null;
  onend: (() => void) | null;
  start(): void;
  abort(): void;
}

export const audioEngine = new LingoAudioEngine();

// ============================================================================
// Pure Child-Forgiving & Turkish-L1-Aware Phonetic Speech Matcher
// ============================================================================

export function normalizeSpeechText(input: string): string {
  return input
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s]/g, ' ')
    .replace(/\b(a|an|the|ein|eine|el|la|un|una)\b/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

export function phoneticSkeleton(word: string): string {
  return normalizeSpeechText(word)
    .replace(/th/g, 't')
    .replace(/ph/g, 'f')
    .replace(/sh/g, 's')
    .replace(/ch/g, 'c')
    .replace(/ck/g, 'k')
    .replace(/c(?![eiy])/g, 'k')
    .replace(/w/g, 'v')
    .replace(/q/g, 'k')
    .replace(/[aeiouy]+/g, 'a')
    .replace(/(.)\1+/g, '$1')
    .trim();
}

export function levenshteinDistance(a: string, b: string): number {
  const m = a.length;
  const n = b.length;
  if (m === 0) return n;
  if (n === 0) return m;
  const dp = new Array<number>(n + 1);
  for (let j = 0; j <= n; j++) dp[j] = j;
  for (let i = 1; i <= m; i++) {
    let prev = dp[0];
    dp[0] = i;
    for (let j = 1; j <= n; j++) {
      const temp = dp[j];
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      dp[j] = Math.min(dp[j] + 1, dp[j - 1] + 1, prev + cost);
      prev = temp;
    }
  }
  return dp[n];
}

export interface SpeechMatchResult {
  matched: boolean;
  score: number;
  bestHeard: string;
  exactPhonemeOk: boolean;
}

export function matchSpokenAttempt(
  targetPhrase: string,
  bareWord: string,
  transcripts: string[],
  childForgiving: boolean,
): SpeechMatchResult {
  const targets = [normalizeSpeechText(bareWord), normalizeSpeechText(targetPhrase)].filter(Boolean);
  if (targets.length === 0 || transcripts.length === 0) {
    return { matched: false, score: 0, bestHeard: transcripts[0] ?? '', exactPhonemeOk: false };
  }

  let bestScore = 0;
  let bestHeard = transcripts[0] ?? '';
  let exactPhonemeOk = false;

  for (const raw of transcripts) {
    const heardNorm = normalizeSpeechText(raw);
    if (!heardNorm) continue;
    const heardSkel = phoneticSkeleton(raw);

    for (const tgt of targets) {
      if (heardNorm === tgt || heardNorm.includes(tgt)) {
        return { matched: true, score: 1.0, bestHeard: raw, exactPhonemeOk: true };
      }
      const lev = levenshteinDistance(heardNorm, tgt);
      const maxLen = Math.max(heardNorm.length, tgt.length, 1);
      const lexSim = Math.max(0, 1 - lev / maxLen);

      const tgtSkel = phoneticSkeleton(tgt);
      const skelLev = levenshteinDistance(heardSkel, tgtSkel);
      const skelMax = Math.max(heardSkel.length, tgtSkel.length, 1);
      const phonSim = Math.max(0, 1 - skelLev / skelMax);

      const combined = childForgiving ? 0.45 * lexSim + 0.55 * phonSim : 0.7 * lexSim + 0.3 * phonSim;
      if (combined > bestScore) {
        bestScore = combined;
        bestHeard = raw;
        exactPhonemeOk = lexSim >= 0.85;
      }
    }
  }

  const threshold = childForgiving ? 0.62 : 0.78;
  return {
    matched: bestScore >= threshold,
    score: Number(bestScore.toFixed(3)),
    bestHeard,
    exactPhonemeOk,
  };
}
