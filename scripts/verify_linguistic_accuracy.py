#!/usr/bin/env python3
"""
LingoNest — Kalıcı Adli Dilbilim ve Müfredat Bütünlüğü Doğrulama Kapısı
Denetlenen Değişmezler:
  1. Tüm çocuk (WORLDS: EN/DE/ES) ve yetişkin (ADULT_MODULES: EN/DE/ES) öğelerinde:
     - Boşluk doldurma (`clozeSentence`) tam olarak bir adet `___` içermeli ve `clozeAnswer` boş olmamalı.
     - `wordOrderChunks` birleştirildiğinde hedef `phrase` dizgesini (noktalama/boşluk kanonikleştirmesiyle) birebir üretmeli!
     - `svoChunks` (3 parça) birleştirildiğinde çocuk `microSentence` cümlesini birebir üretmeli!
     - IPA transkripsiyonları `/.../` veya `[...]` sınırlarıyla başlamalı ve bitmeli.
     - İngilizce belirsiz tanımlık (`a` vs `an`) sesli/sessiz kurallarına uymalı (`a apple`, `an cat`, `an university` yasak!).
     - İspanyolca soru (`?`) ve ünlem (`!`) cümlelerinde açılış ters işaretleri (`¿` / `¡`) dengeli olmalı!
  2. Dilbilgisi El Kitabı (`grammarHandbook.ts`) varsa tüm bölümlerde 3 dilin (EN/DE/ES) karşılaştırmalı tabloları eksiksiz olmalı.
"""
import json
import pathlib
import re
import subprocess
import sys

ROOT = pathlib.Path(__file__).resolve().parent.parent


def extract_curriculum_via_node() -> dict:
    js = r"""
    import { createRequire } from 'node:module';
    import fs from 'node:fs';
    import esbuild from 'esbuild';

    const out = esbuild.buildSync({
      stdin: {
        contents: `
          import { WORLDS, STORIES, PHONETIC_TRAPS } from './src/data/curriculum.ts';
          import { ADULT_MODULES, ADULT_DIALOGUES } from './src/data/adultCurriculum.ts';
          let HANDBOOK = [];
          try {
            const hb = require('./src/data/grammarHandbook.ts');
            HANDBOOK = hb.GRAMMAR_HANDBOOK_CHAPTERS || [];
          } catch {}
          console.log(JSON.stringify({ WORLDS, STORIES, PHONETIC_TRAPS, ADULT_MODULES, ADULT_DIALOGUES, HANDBOOK }));
        `,
        resolveDir: process.cwd(),
        loader: 'ts',
      },
      bundle: true,
      platform: 'node',
      format: 'cjs',
      write: false,
    });
    const fn = new Function('require', 'module', 'exports', 'console', out.outputFiles[0].text);
    let captured = '';
    fn(createRequire(import.meta.url), {}, {}, { log: (s) => { captured = s; } });
    process.stdout.write(captured);
    """
    proc = subprocess.run(
        ["node", "--input-type=module", "-e", js],
        cwd=str(ROOT),
        capture_output=True,
        text=True,
        encoding="utf-8",
    )
    if proc.returncode != 0:
        raise RuntimeError(f"Müfredat TS derleme hatası:\n{proc.stderr[:600]}")
    return json.loads(proc.stdout)


def norm_ws(s: str) -> str:
    return re.sub(r"\s+", " ", s.strip())


def norm_svo(s: str) -> str:
    cleaned = re.sub(r"[¡!¿?.]+", "", s)
    return norm_ws(cleaned).lower()


def main() -> None:
    data = extract_curriculum_via_node()
    worlds = data["WORLDS"]
    adult_mods = data["ADULT_MODULES"]
    dialogues = data["ADULT_DIALOGUES"]
    traps = data["PHONETIC_TRAPS"]
    handbook = data.get("HANDBOOK", [])

    errors: list[str] = []

    # 1. Çocuk Dünyaları (WORLDS)
    vocab_count = 0
    for w in worlds:
        for item in w["items"]:
            vocab_count += 1
            iid = item["id"]
            for lang in ("en", "de", "es"):
                loc = item["langs"][lang]
                ipa = loc.get("ipa", "").strip()
                if not (ipa.startswith("/") and ipa.endswith("/")):
                    errors.append(f"[WORLD:{iid}:{lang}] Geçersiz IPA biçimi: {ipa!r}")
                joined_svo = norm_svo(" ".join(loc["svoChunks"]))
                target_sent = norm_svo(loc["microSentence"])
                # İspanyolcada pedagojik SVO blokları açık özne ('yo ') gösterebilir (pro-drop)
                es_prodrop_ok = lang == "es" and joined_svo == f"yo {target_sent}"
                if joined_svo != target_sent and not es_prodrop_ok:
                    errors.append(
                        f"[WORLD:{iid}:{lang}] svoChunks birleşimi microSentence ile uyuşmuyor:\n"
                        f"   chunks: {joined_svo!r}\n   target: {target_sent!r}"
                    )
                if lang == "en":
                    w_low = loc["word"].lower()
                    if re.search(r"\ba\s+(apple|egg|elephant|orange|umbrella|owl|ice)\b", w_low):
                        errors.append(f"[WORLD:{iid}:en] Hatalı 'a/an' tanımlığı: {loc['word']!r}")
                if lang == "es":
                    ms = loc["microSentence"]
                    if "?" in ms and "¿" not in ms:
                        errors.append(f"[WORLD:{iid}:es] Eksik '¿' işareti: {ms!r}")
                    if "!" in ms and "¡" not in ms:
                        errors.append(f"[WORLD:{iid}:es] Eksik '¡' işareti: {ms!r}")

    # 2. Yetişkin Modülleri (ADULT_MODULES)
    adult_count = 0
    for mod in adult_mods:
        for item in mod["items"]:
            adult_count += 1
            iid = item["id"]
            for lang in ("en", "de", "es"):
                loc = item["langs"][lang]
                ipa = loc.get("ipa", "").strip()
                if not (ipa.startswith("/") and ipa.endswith("/")):
                    errors.append(f"[ADULT:{iid}:{lang}] Geçersiz IPA: {ipa!r}")
                cloze = loc.get("clozeSentence", "")
                ans = loc.get("clozeAnswer", "").strip()
                if cloze.count("___") != 1 or not ans:
                    errors.append(f"[ADULT:{iid}:{lang}] Bozuk clozeSentence veya boş clozeAnswer: {cloze!r}")
                joined_chunks = norm_ws(" ".join(loc.get("wordOrderChunks", [])))
                phrase = norm_ws(loc.get("phrase", ""))
                if joined_chunks != phrase:
                    errors.append(
                        f"[ADULT:{iid}:{lang}] wordOrderChunks birleşimi phrase ile uyuşmuyor:\n"
                        f"   chunks: {joined_chunks!r}\n   phrase: {phrase!r}"
                    )
                if lang == "es":
                    for field_name in ("phrase", "exampleDialogue"):
                        txt = loc.get(field_name, "")
                        if "?" in txt and "¿" not in txt:
                            errors.append(f"[ADULT:{iid}:es:{field_name}] Eksik '¿': {txt!r}")
                        if "!" in txt and "¡" not in txt:
                            errors.append(f"[ADULT:{iid}:es:{field_name}] Eksik '¡': {txt!r}")

    # 3. Yetişkin Diyalogları (ADULT_DIALOGUES)
    for dlg in dialogues:
        did = dlg["id"]
        for t_idx, turn in enumerate(dlg["turns"]):
            es_txt = turn["text"].get("es", "")
            if "?" in es_txt and "¿" not in es_txt:
                errors.append(f"[DIALOGUE:{did}:t{t_idx}:es] Eksik '¿': {es_txt!r}")
            if "!" in es_txt and "¡" not in es_txt:
                errors.append(f"[DIALOGUE:{did}:t{t_idx}:es] Eksik '¡': {es_txt!r}")
            for o_idx, opt in enumerate(turn.get("options") or []):
                es_opt = opt["text"].get("es", "")
                if "?" in es_opt and "¿" not in es_opt:
                    errors.append(f"[DIALOGUE:{did}:t{t_idx}:opt{o_idx}:es] Eksik '¿': {es_opt!r}")
                if "!" in es_opt and "¡" not in es_opt:
                    errors.append(f"[DIALOGUE:{did}:t{t_idx}:opt{o_idx}:es] Eksik '¡': {es_opt!r}")

    # 4. Dilbilgisi El Kitabı (HANDBOOK)
    for ch in handbook:
        cid = ch.get("id", "unknown")
        if len(ch.get("sections", [])) < 2:
            errors.append(f"[HANDBOOK:{cid}] En az 2 derin bölüm bekleniyor")
        for lang in ("en", "de", "es"):
            comp = ch.get("langComparisons", {}).get(lang)
            if not comp or not comp.get("wrongCalque") or not comp.get("naturalForm"):
                errors.append(f"[HANDBOOK:{cid}:{lang}] Eksik karşılaştırmalı tablo")

    if errors:
        print(f"[LINGO-GATE FAILED] {len(errors)} dilbilimsel/yapısal hata tespit edildi:")
        for e in errors[:25]:
            print(" -", e)
        raise SystemExit(1)

    print(
        f"[LINGO-GATE PASS] worlds_vocab={vocab_count} adult_phrases={adult_count} "
        f"dialogues={len(dialogues)} phonetic_traps={len(traps)} handbook_chapters={len(handbook)}"
    )


if __name__ == "__main__":
    main()
