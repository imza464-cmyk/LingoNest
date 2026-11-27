#!/usr/bin/env python3
"""
LingoNest — Pure Monolingual Studio Neural Voice Pack Generator
1. Uses 100% pure monolingual native voices (NEVER *MultilingualNeural language-guessing!):
   - en: en-US-JennyNeural (warm) / en-US-AriaNeural (adult) / en-US-GuyNeural (partner)
   - de: de-DE-TanjaNeural (warm/adult) / de-DE-ChristophNeural (partner)
   - es: es-ES-ElviraNeural (warm/adult) / es-ES-AlvaroNeural (partner)
   - tr: tr-TR-EmelNeural (warm/adult) / tr-TR-AhmetNeural (partner)
2. Extracts EVERY playable word, chunk, example sentence, story paragraph, grammar sentence,
   and dialogue line from TypeScript SSOT modules so browser robotic fallback is NEVER hit.
3. Purges stale .vpak files from older voice maps when voices change.
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
    """Bundle and evaluate all TS data modules using local esbuild."""
    extractor = r"""
import { buildSync } from 'esbuild';

const root = process.argv[2];
const out = buildSync({
  stdin: {
    contents: `
      import { WORLDS, STORIES, PHONETIC_TRAPS } from './src/data/curriculum.ts';
      import { ADULT_MODULES, ADULT_DIALOGUES } from './src/data/adultCurriculum.ts';
      import { GRAMMAR_HANDBOOK_CHAPTERS } from './src/data/grammarHandbook.ts';
      import { VOCAB_CATEGORIES } from './src/data/vocabBank.ts';
      import { GRADED_STORIES } from './src/data/gradedStories.ts';
      import { TR_VOICE, TR_WORLD_INTROS, TR_PRAISE_POOL, TR_NUDGE_POOL } from './src/data/voiceScripts.ts';
      console.log(JSON.stringify({
        WORLDS, STORIES, PHONETIC_TRAPS,
        ADULT_MODULES, ADULT_DIALOGUES,
        GRAMMAR_HANDBOOK_CHAPTERS, VOCAB_CATEGORIES, GRADED_STORIES,
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
eval(out.outputFiles[0].text);
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
        # Strictly prefer non-Multilingual monolingual voices first!
        for v in all_v:
            sn = v["ShortName"]
            if (
                v["Locale"].startswith(locale_prefix)
                and "Multilingual" not in sn
                and (gender is None or v["Gender"] == gender)
            ):
                return sn
        raise RuntimeError(f"None of voices available for {locale_prefix}: {candidates}")

    return {
        ("en", "warm"): first_avail(["en-US-JennyNeural", "en-US-AriaNeural"], "en-US", "Female"),
        ("en", "adult"): first_avail(["en-US-AriaNeural", "en-US-JennyNeural"], "en-US", "Female"),
        ("en", "partner"): first_avail(["en-US-GuyNeural", "en-US-ChristopherNeural"], "en-US", "Male"),
        ("de", "warm"): first_avail(["de-DE-TanjaNeural", "de-AT-IngridNeural"], "de-DE", "Female"),
        ("de", "adult"): first_avail(["de-DE-TanjaNeural", "de-AT-IngridNeural"], "de-DE", "Female"),
        ("de", "partner"): first_avail(["de-DE-ChristophNeural", "de-AT-JonasNeural"], "de-DE", "Male"),
        ("es", "warm"): first_avail(["es-ES-ElviraNeural"], "es-ES", "Female"),
        ("es", "adult"): first_avail(["es-ES-ElviraNeural"], "es-ES", "Female"),
        ("es", "partner"): first_avail(["es-ES-AlvaroNeural"], "es-ES", "Male"),
        ("tr", "warm"): first_avail(["tr-TR-EmelNeural"], "tr-TR", "Female"),
        ("tr", "adult"): first_avail(["tr-TR-EmelNeural"], "tr-TR", "Female"),
        ("tr", "partner"): first_avail(["tr-TR-AhmetNeural"], "tr-TR", "Male"),
    }


def collect_jobs(data: dict) -> list:
    """Return deduplicated list of (key, lang, role, text) covering 100% of app audio."""
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

    # 2. Child & Explorer 6 Worlds x 10 items + SVO chunks
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
                for chunk in loc.get("svoChunks", []):
                    add(lang, "warm", chunk)

    # 3. 6 Illustrated Beginner Stories
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

    # 4. 8 CEFR A1-B2 Graded Short Stories (paragraphs + key vocab)
    for gs in data.get("GRADED_STORIES", []):
        for lang in ("en", "de", "es"):
            add(lang, "adult", gs["titleTarget"][lang])
            for p in gs["paragraphs"]:
                add(lang, "adult", p["text"][lang])
            for vn in gs.get("vocabNotes", []):
                add(lang, "adult", vn["term"][lang])

    # 5. 240-Concept Structured Vocabulary Bank (word + example sentence across EN/DE/ES)
    for cat in data.get("VOCAB_CATEGORIES", []):
        for entry in cat["entries"]:
            for lang in ("en", "de", "es"):
                loc = entry["langs"][lang]
                add(lang, "adult", loc["word"])
                add(lang, "adult", loc["example"])

    # 6. 18-Chapter Grammar Course (natural examples across EN/DE/ES)
    for ch in data.get("GRAMMAR_HANDBOOK_CHAPTERS", []):
        for lang in ("en", "de", "es"):
            comp = ch["langComparisons"][lang]
            add(lang, "adult", comp["naturalForm"])

    # 7. Phonetic Traps & Minimal Pairs
    for trap in data["PHONETIC_TRAPS"]:
        tlang = trap.get("lang") or "en"
        add("tr", "warm", trap["mouthCueTr"])
        add(tlang, "warm", trap["practiceSentence"])
        for pair in trap["minimalPairs"]:
            add(tlang, "warm", pair["targetWord"])
            add(tlang, "warm", pair["contrastWord"])

    # 8. Adult 10 Modules (phrases, exampleDialogues, clozeAnswer, wordOrderChunks)
    for mod in data["ADULT_MODULES"]:
        for item in mod["items"]:
            for lang in ("en", "de", "es"):
                loc = item["langs"][lang]
                add(lang, "adult", loc["phrase"])
                add(lang, "partner", loc["exampleDialogue"])
                add(lang, "adult", loc["clozeAnswer"])

    # 9. Adult Roleplay Dialogues
    for dlg in data["ADULT_DIALOGUES"]:
        for turn in dlg["turns"]:
            role = "partner" if turn["speaker"] == "partner" else "adult"
            for lang in ("en", "de", "es"):
                add(lang, role, turn["text"][lang])
                for opt in turn.get("options") or []:
                    add(lang, "adult", opt["text"][lang])

    return list(jobs.values())


async def synth_one(sem: asyncio.Semaphore, key: str, voice: str, text: str, out_path: str, stats: dict):
    if os.path.exists(out_path) and os.path.getsize(out_path) > 384:
        stats["cached"] += 1
        return True

    async with sem:
        for attempt in range(5):
            try:
                comm = edge_tts.Communicate(text=text, voice=voice, rate="+0%")
                tmp_path = out_path + ".tmp"
                await comm.save(tmp_path)
                if os.path.exists(tmp_path) and os.path.getsize(tmp_path) > 256:
                    os.replace(tmp_path, out_path)
                    stats["generated"] += 1
                    done = stats["generated"] + stats["cached"]
                    if done % 250 == 0 or done == stats["total"]:
                        print(
                            f"  [TTS] {done}/{stats['total']} (yeni={stats['generated']}, önbellek={stats['cached']}, hata={stats['failed']})",
                            flush=True,
                        )
                    return True
            except Exception:
                await asyncio.sleep(0.6 * (attempt + 1))
        stats["failed"] += 1
        return False


async def main_async():
    t0 = time.time()
    os.makedirs(AUDIO_DIR, exist_ok=True)

    old_manifest = {}
    if os.path.exists(MANIFEST_PATH):
        try:
            old_manifest = json.load(open(MANIFEST_PATH, encoding="utf-8"))
        except Exception:
            old_manifest = {}

    print("[1/3] Müfredat, kelime hazinesi, dilbilgisi ve hikaye ses metinleri çıkarılıyor...", flush=True)
    data = extract_curriculum_json()
    voices = await pick_studio_voices()
    new_voice_map = {f"{k[0]}:{k[1]}": v for k, v in voices.items()}
    print("  Saf Ana Dili Nöral Sesler:", new_voice_map, flush=True)

    # Purge clips whose language/role voice changed (e.g., removing MultilingualNeural & es-MX clips!)
    old_voices = old_manifest.get("voices") or {}
    old_clips = old_manifest.get("clips") or {}
    jobs = collect_jobs(data)

    changed_pairs = {
        (lang, role)
        for (lang, role), vname in voices.items()
        if old_voices.get(f"{lang}:{role}") != vname
    }
    if changed_pairs:
        purged = 0
        for key, lang, role, _text in jobs:
            if (lang, role) in changed_pairs:
                old_fn = old_clips.get(key) or f"{key}.vpak"
                p = os.path.join(AUDIO_DIR, old_fn)
                if os.path.exists(p):
                    os.remove(p)
                    purged += 1
        print(f"  [TEMİZLİK] Ses modeli yenilenen diller için {purged} eski ses dosyası silindi: {changed_pairs}", flush=True)

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

    print(
        f"[2/3] {len(unique_synths)} benzersiz ana dili ses kaydı doğrulanıyor/üretiliyor ({len(manifest_clips)} anahtar)...",
        flush=True,
    )
    stats = {"total": len(unique_synths), "generated": 0, "cached": 0, "failed": 0}
    sem = asyncio.Semaphore(24)
    await asyncio.gather(*[synth_one(sem, k, v, t, p, stats) for k, v, t, p in unique_synths])

    valid_clips = {
        k: fname
        for k, fname in manifest_clips.items()
        if os.path.exists(os.path.join(AUDIO_DIR, fname))
        and os.path.getsize(os.path.join(AUDIO_DIR, fname)) > 256
    }

    # Remove unreferenced .vpak files on disk so dist stays clean
    referenced_files = set(valid_clips.values())
    removed_orphans = 0
    for fn in os.listdir(AUDIO_DIR):
        if fn.endswith(".vpak") and fn not in referenced_files:
            try:
                os.remove(os.path.join(AUDIO_DIR, fn))
                removed_orphans += 1
            except OSError:
                pass

    manifest = {
        "version": 2,
        "count": len(valid_clips),
        "uniqueFiles": len(referenced_files),
        "voices": new_voice_map,
        "clips": valid_clips,
    }
    with open(MANIFEST_PATH, "w", encoding="utf-8") as f:
        json.dump(manifest, f, separators=(",", ":"))

    total_bytes = sum(os.path.getsize(os.path.join(AUDIO_DIR, fn)) for fn in referenced_files)
    elapsed = time.time() - t0
    print(
        f"[3/3] TAMAMLANDI! {len(referenced_files)} benzersiz ses ({total_bytes / 1048576:.2f} MB), "
        f"{len(valid_clips)} anahtar, yetim_silinen={removed_orphans}, hata={stats['failed']}, süre={elapsed:.1f}s",
        flush=True,
    )
    if stats["failed"] > 0:
        sys.exit(1)


if __name__ == "__main__":
    asyncio.run(main_async())
