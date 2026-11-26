#!/usr/bin/env python3
"""
LingoNest — Studio Gen-4 Neural Voice Pack Generator (Zero Robotic SAPI!)
Extracts EVERY phrase, micro-sentence, story line, adult dialogue, phonetic minimal pair,
and Turkish child guide/TPR/praise prompt directly from TypeScript SSOT modules using esbuild,
then synthesizes ultra-natural Microsoft Neural MP3 clips in parallel via edge-tts.
"""

import asyncio
import json
import os
import re
import subprocess
import sys
import time
import edge_tts

if sys.platform == "win32":
    try:
        sys.stdout.reconfigure(encoding="utf-8", line_buffering=True)
    except Exception:
        pass

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
AUDIO_DIR = os.path.join(ROOT, "public", "audio")
MANIFEST_PATH = os.path.join(AUDIO_DIR, "manifest.json")


def canonical_text(text: str) -> str:
    return re.sub(r"\s+", " ", (text or "").strip())


def hash_audio_key(lang: str, role: str, text: str) -> str:
    """Bit-for-bit identical 64-bit dual-FNV1a hash matching src/engine/audioEngine.ts."""
    payload = f"{lang}|{role}|{canonical_text(text)}".encode("utf-8")
    h1 = 0x811C9DC5
    h2 = 0x050C5D1F
    for i, b in enumerate(payload):
        h1 ^= b
        h1 = (h1 * 0x01000193) & 0xFFFFFFFF
        h2 ^= b ^ ((i * 31) & 0xFF)
        h2 = (h2 * 0x01000193) & 0xFFFFFFFF
    return f"{h1:08x}{h2:08x}"


def extract_curriculum_json() -> dict:
    """Bundle and evaluate TS data files using local Vite esbuild to extract exact SSOT data."""
    extractor = r"""
import { buildSync } from 'esbuild';
import fs from 'fs';
import path from 'path';

const root = process.argv[2];
const out = buildSync({
  stdin: {
    contents: `
      import { WORLDS, STORIES, PHONETIC_TRAPS } from './src/data/curriculum.ts';
      import { ADULT_MODULES, ADULT_DIALOGUES } from './src/data/adultCurriculum.ts';
      import { TR_VOICE, TR_WORLD_INTROS, TR_PRAISE_POOL, TR_NUDGE_POOL } from './src/data/voiceScripts.ts';
      console.log(JSON.stringify({
        WORLDS, STORIES, PHONETIC_TRAPS,
        ADULT_MODULES, ADULT_DIALOGUES,
        TR_VOICE, TR_WORLD_INTROS, TR_PRAISE_POOL, TR_NUDGE_POOL
      }));
    `,
    resolveDir: root,
    loader: 'ts',
  },
  bundle: true,
  write: false,
  format: 'cjs',
  platform: 'node',
});
const code = out.outputFiles[0].text;
eval(code);
"""
    tmp_js = os.path.join(ROOT, "scripts", "_extract_tmp.mjs")
    with open(tmp_js, "w", encoding="utf-8") as f:
        f.write(extractor)
    try:
        proc = subprocess.run(
            ["node", tmp_js, ROOT],
            cwd=ROOT,
            capture_output=True,
            text=True,
            encoding="utf-8",
            check=True,
        )
        return json.loads(proc.stdout)
    finally:
        if os.path.exists(tmp_js):
            os.remove(tmp_js)


async def pick_studio_voices() -> dict:
    all_v = await edge_tts.list_voices()
    names = {v["ShortName"] for v in all_v}

    def first_avail(candidates, locale_prefix, gender=None):
        for c in candidates:
            if c in names:
                return c
        for v in all_v:
            if v["Locale"].startswith(locale_prefix) and (gender is None or v["Gender"] == gender):
                return v["ShortName"]
        raise RuntimeError(f"None of voices available for {locale_prefix}: {candidates}")

    return {
        ("en", "warm"): first_avail(["en-US-AvaMultilingualNeural", "en-US-EmmaMultilingualNeural", "en-US-JennyNeural"], "en-US", "Female"),
        ("en", "adult"): first_avail(["en-US-EmmaMultilingualNeural", "en-US-AvaMultilingualNeural", "en-US-AriaNeural"], "en-US", "Female"),
        ("en", "partner"): first_avail(["en-US-AndrewMultilingualNeural", "en-US-BrianMultilingualNeural", "en-US-GuyNeural"], "en-US", "Male"),
        ("de", "warm"): first_avail(["de-DE-SeraphinaMultilingualNeural", "de-DE-TanjaNeural", "de-DE-AmalaNeural", "de-DE-KatjaNeural"], "de-DE", "Female"),
        ("de", "adult"): first_avail(["de-DE-TanjaNeural", "de-DE-AmalaNeural", "de-DE-KatjaNeural"], "de-DE", "Female"),
        ("de", "partner"): first_avail(["de-DE-FlorianMultilingualNeural", "de-DE-ChristophNeural", "de-DE-ConradNeural"], "de-DE", "Male"),
        ("es", "warm"): first_avail(["es-ES-ElviraNeural", "es-MX-DaliaNeural"], "es-", "Female"),
        ("es", "adult"): first_avail(["es-MX-DaliaNeural", "es-ES-ElviraNeural"], "es-", "Female"),
        ("es", "partner"): first_avail(["es-ES-AlvaroNeural", "es-MX-JorgeNeural"], "es-", "Male"),
        ("tr", "warm"): first_avail(["tr-TR-EmelNeural", "tr-TR-AhmetNeural"], "tr-TR", "Female"),
        ("tr", "adult"): first_avail(["tr-TR-EmelNeural", "tr-TR-AhmetNeural"], "tr-TR", "Female"),
        ("tr", "partner"): first_avail(["tr-TR-AhmetNeural", "tr-TR-EmelNeural"], "tr-TR", "Male"),
    }


def collect_jobs(data: dict) -> list:
    """Return deduplicated list of (key, lang, role, text)."""
    jobs = {}

    def add(lang: str, role: str, text: str):
        clean = canonical_text(text)
        if not clean:
            return
        k = hash_audio_key(lang, role, clean)
        if k not in jobs:
            jobs[k] = (k, lang, role, clean)

    # 1. Turkish child guide / UI / praise / nudges / world intros
    for v in data["TR_VOICE"].values():
        add("tr", "warm", v)
    for v in data["TR_WORLD_INTROS"].values():
        add("tr", "warm", v)
    for v in data["TR_PRAISE_POOL"]:
        add("tr", "warm", v)
    for v in data["TR_NUDGE_POOL"]:
        add("tr", "warm", v)

    # 2. Child & Explorer 6 Worlds x 10 items (EN, DE, ES + TR TPR & meanings)
    for world in data["WORLDS"]:
        add("tr", "warm", world["titleTr"])
        for item in world["items"]:
            add("tr", "warm", item["tprActionTr"])
            add("tr", "warm", item["turkishMeaning"])
            for lang in ("en", "de", "es"):
                loc = item["langs"][lang]
                add(lang, "warm", loc["word"])
                add(lang, "warm", loc["bareWord"])
                add(lang, "warm", loc["microSentence"])

    # 3. 6 Interactive Child Stories
    for story in data["STORIES"]:
        add("tr", "warm", story["titleTr"])
        add("tr", "warm", story["quiz"]["promptTr"])
        for lang in ("en", "de", "es"):
            add(lang, "warm", story["titleTarget"][lang])
            add(lang, "warm", story["quiz"]["promptAudio"][lang])
        for line in story["lines"]:
            add("tr", "warm", line["turkishGloss"])
            for lang in ("en", "de", "es"):
                add(lang, "warm", line["text"][lang])

    # 4. Turkish L1 -> EN/DE/ES Phonetic Traps & Minimal Pairs
    for trap in data["PHONETIC_TRAPS"]:
        tlang = trap.get("lang") or "en"
        add("tr", "warm", trap["mouthCueTr"])
        add(tlang, "warm", trap["practiceSentence"])
        for pair in trap["minimalPairs"]:
            add(tlang, "warm", pair["targetWord"])
            add(tlang, "warm", pair["contrastWord"])

    # 5. Adult 6 Modules x 10 phrases (EN, DE, ES)
    for mod in data["ADULT_MODULES"]:
        for item in mod["items"]:
            for lang in ("en", "de", "es"):
                loc = item["langs"][lang]
                add(lang, "adult", loc["phrase"])
                add(lang, "warm", loc["phrase"])  # ensure default warm lookup hits directly
                add(lang, "partner", loc["exampleDialogue"])
                add(lang, "warm", loc["exampleDialogue"])

    # 6. 6 Adult Roleplay Dialogues (Distinct Male Partner vs Female Learner Voices!)
    for dlg in data["ADULT_DIALOGUES"]:
        for turn in dlg["turns"]:
            role = "partner" if turn["speaker"] == "partner" else "adult"
            for lang in ("en", "de", "es"):
                add(lang, role, turn["text"][lang])
                add(lang, "warm", turn["text"][lang])
                for opt in turn.get("options") or []:
                    add(lang, "adult", opt["text"][lang])
                    add(lang, "warm", opt["text"][lang])

    return list(jobs.values())


async def synth_one(sem: asyncio.Semaphore, key: str, voice: str, text: str, out_path: str, stats: dict):
    if os.path.exists(out_path) and os.path.getsize(out_path) > 512:
        stats["cached"] += 1
        return True

    async with sem:
        for attempt in range(4):
            try:
                comm = edge_tts.Communicate(text=text, voice=voice, rate="+0%")
                tmp_path = out_path + ".tmp"
                await comm.save(tmp_path)
                if os.path.exists(tmp_path) and os.path.getsize(tmp_path) > 256:
                    os.replace(tmp_path, out_path)
                    stats["generated"] += 1
                    done = stats["generated"] + stats["cached"]
                    if done % 100 == 0 or done == stats["total"]:
                        print(f"  [TTS] {done}/{stats['total']} (yeni={stats['generated']}, cache={stats['cached']}, hata={stats['failed']})", flush=True)
                    return True
            except Exception:
                await asyncio.sleep(0.5 * (attempt + 1))
        stats["failed"] += 1
        return False


async def main_async():
    t0 = time.time()
    os.makedirs(AUDIO_DIR, exist_ok=True)
    print("[1/3] Müfredat ve tüm Türkçe/EN/DE/ES ses metinleri çıkarılıyor...", flush=True)
    data = extract_curriculum_json()
    voices = await pick_studio_voices()
    print("  Seçilen Stüdyo Nöral Sesler:", {f"{k[0]}:{k[1]}": v for k, v in voices.items()}, flush=True)

    jobs = collect_jobs(data)
    # Deduplicate by (voice, text) so identical voice+text reuses the same MP3 file!
    voice_text_to_file = {}
    unique_synths = []
    manifest_clips = {}

    for key, lang, role, text in jobs:
        voice = voices[(lang, role)]
        vt = (voice, text)
        if vt not in voice_text_to_file:
            fname = f"{key}.vpak"
            voice_text_to_file[vt] = fname
            unique_synths.append((key, voice, text, os.path.join(AUDIO_DIR, fname)))
        manifest_clips[key] = voice_text_to_file[vt]

    print(f"[2/3] {len(unique_synths)} benzersiz stüdyo nöral ses kaydı üretiliyor ({len(manifest_clips)} anahtar)...", flush=True)
    stats = {"total": len(unique_synths), "generated": 0, "cached": 0, "failed": 0}
    sem = asyncio.Semaphore(16)
    await asyncio.gather(*[synth_one(sem, k, v, t, p, stats) for k, v, t, p in unique_synths])

    # Only include clips whose files actually exist on disk
    valid_clips = {
        k: fname for k, fname in manifest_clips.items()
        if os.path.exists(os.path.join(AUDIO_DIR, fname)) and os.path.getsize(os.path.join(AUDIO_DIR, fname)) > 256
    }

    manifest = {
        "version": 1,
        "count": len(valid_clips),
        "uniqueFiles": len(set(valid_clips.values())),
        "voices": {f"{k[0]}:{k[1]}": v for k, v in voices.items()},
        "clips": valid_clips,
    }
    with open(MANIFEST_PATH, "w", encoding="utf-8") as f:
        json.dump(manifest, f, separators=(",", ":"))

    total_bytes = sum(os.path.getsize(os.path.join(AUDIO_DIR, fn)) for fn in set(valid_clips.values()))
    elapsed = time.time() - t0
    print(f"[3/3] TAMAMLANDI! {len(set(valid_clips.values()))} benzersiz MP3 ({total_bytes/1048576:.2f} MB), {len(valid_clips)} anahtar, hata={stats['failed']}, süre={elapsed:.1f}s", flush=True)


if __name__ == "__main__":
    asyncio.run(main_async())
