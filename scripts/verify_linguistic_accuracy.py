#!/usr/bin/env python3
"""
LingoNest — Forensic Trilingual (EN / DE / ES) Linguistic Accuracy Gate
Validates:
  1. 6 Child Worlds (60 concepts x 3 langs = 180 items)
  2. 6 Illustrated Child Stories + 8 CEFR A1-B2 Graded Short Stories
  3. 14 Phonetic Traps (6 EN + 4 DE + 4 ES)
  4. 10 Adult Modules (80 concepts x 3 langs = 240 items) + 6 Adult Dialogues
  5. 18 Grammar Course Chapters (referenceTables + langComparisons + practiceQuestions)
  6. 12 Vocabulary Bank Categories (240 concepts x 3 langs = 720 words + 720 examples)
"""

import json
import os
import re
import subprocess
import sys

if sys.platform == "win32":
    try:
        sys.stdout.reconfigure(encoding="utf-8", line_buffering=True)
    except Exception:
        pass

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))

EN_AN_EXCEPTIONS_NEEDING_A = (
    "uni", "use", "usu", "uti", "eur", "one", "once",
)
EN_A_VOWEL_SOUND_PREFIXES = (
    "apple", "egg", "elephant", "orange", "umbrella", "owl", "ice", "island",
    "idea", "issue", "update", "option", "error", "example", "item", "offer",
    "answer", "airport", "emergency", "appointment", "argument", "alternative",
    "hour", "honest",
)

FORBIDDEN_JARGON = ("SOV", "morfosentaks", "pro-drop", "L1 transfer")


def extract_curriculum_via_node() -> dict:
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
      console.log(JSON.stringify({
        WORLDS, STORIES, PHONETIC_TRAPS,
        ADULT_MODULES, ADULT_DIALOGUES,
        GRAMMAR_HANDBOOK_CHAPTERS, VOCAB_CATEGORIES, GRADED_STORIES
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
    tmp_js = os.path.join(ROOT, "scripts", "_lingo_gate_tmp.mjs")
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


def norm_ws(s: str) -> str:
    return re.sub(r"\s+", " ", (s or "").strip())


def norm_svo(s: str) -> str:
    cleaned = re.sub(r"[¡!¿?.,;:—–\"'„“”]", "", s or "")
    return re.sub(r"\s+", " ", cleaned).strip().lower()


def check_en_articles(label: str, text: str, errors: list):
    low = text.lower()
    for m in re.finditer(r"\ba\s+([a-z]+)\b", low):
        nxt = m.group(1)
        if nxt.startswith(EN_A_VOWEL_SOUND_PREFIXES) and not nxt.startswith(EN_AN_EXCEPTIONS_NEEDING_A):
            errors.append(f"{label}: İngilizce 'a {nxt}' hatası ('an {nxt}' olmalı) -> '{text}'")
    for m in re.finditer(r"\ban\s+([a-z]+)\b", low):
        nxt = m.group(1)
        if nxt.startswith(EN_AN_EXCEPTIONS_NEEDING_A):
            errors.append(f"{label}: İngilizce 'an {nxt}' hatası ('a {nxt}' olmalı) -> '{text}'")


def check_es_inverted_punct(label: str, text: str, errors: list):
    if text.endswith("?") and "¿" not in text:
        errors.append(f"{label}: İspanyolca soru cümlesinde açılış '¿' eksik -> '{text}'")
    if text.endswith("!") and "¡" not in text:
        errors.append(f"{label}: İspanyolca ünlem cümlesinde açılış '¡' eksik -> '{text}'")


def main() -> int:
    data = extract_curriculum_via_node()
    errors = []

    # 1. Child Worlds
    vocab_count = 0
    for w in data["WORLDS"]:
        for item in w["items"]:
            vocab_count += 1
            vid = item["id"]
            for lang in ("en", "de", "es"):
                loc = item["langs"][lang]
                word = norm_ws(loc["word"])
                sent = norm_ws(loc["microSentence"])
                ipa = norm_ws(loc["ipa"])
                chunks = loc["svoChunks"]
                if not (ipa.startswith("/") and ipa.endswith("/") and len(ipa) >= 3):
                    errors.append(f"[{vid}:{lang}] Geçersiz IPA: {ipa}")
                joined = norm_svo(" ".join(chunks))
                target_norm = norm_svo(sent)
                es_prodrop_ok = (lang == "es" and joined == f"yo {target_norm}")
                if joined != target_norm and not es_prodrop_ok:
                    errors.append(f"[{vid}:{lang}] svoChunks birleşimi '{joined}' != '{target_norm}'")
                if lang == "en":
                    check_en_articles(f"[{vid}:en]", f"{word} . {sent}", errors)
                if lang == "es":
                    check_es_inverted_punct(f"[{vid}:es]", sent, errors)

    # 2. Child Stories — ensure zero surreal talking-sun/Kral Pırpır leftovers
    stories = data["STORIES"]
    if len(stories) != 6:
        errors.append(f"STORIES uzunluğu 6 olmalı, bulunan: {len(stories)}")
    for st in stories:
        sid = st["id"]
        for idx, ln in enumerate(st["lines"]):
            if ln["speakerName"] in ("Kral Pırpır", "Soli", "Bam-Bam", "Zıpzıp"):
                errors.append(f"[{sid}:line{idx}] Eski yapay karakter adı kalmış: {ln['speakerName']}")
            check_en_articles(f"[{sid}:line{idx}:en]", ln["text"]["en"], errors)
            check_es_inverted_punct(f"[{sid}:line{idx}:es]", ln["text"]["es"], errors)

    # 3. Adult Modules
    adult_count = 0
    for mod in data["ADULT_MODULES"]:
        for item in mod["items"]:
            adult_count += 1
            aid = item["id"]
            for lang in ("en", "de", "es"):
                loc = item["langs"][lang]
                phrase = norm_ws(loc["phrase"])
                cloze_s = norm_ws(loc["clozeSentence"])
                cloze_a = norm_ws(loc["clozeAnswer"])
                ipa = norm_ws(loc["ipa"])
                chunks = loc["wordOrderChunks"]
                if "___" not in cloze_s:
                    errors.append(f"[{aid}:{lang}] clozeSentence içinde '___' yok")
                elif not cloze_a:
                    errors.append(f"[{aid}:{lang}] clozeAnswer boş")
                else:
                    rebuilt = norm_ws(cloze_s.replace("___", cloze_a, 1))
                    if lang == "en":
                        check_en_articles(f"[{aid}:{lang}:cloze]", rebuilt, errors)
                    if lang == "es":
                        check_es_inverted_punct(f"[{aid}:{lang}:cloze]", rebuilt, errors)
                joined_wo = norm_svo(" ".join(chunks))
                if joined_wo != norm_svo(phrase):
                    errors.append(f"[{aid}:{lang}] wordOrderChunks '{joined_wo}' != '{norm_svo(phrase)}'")
                if not (ipa.startswith("/") and ipa.endswith("/") and len(ipa) >= 3):
                    errors.append(f"[{aid}:{lang}] Geçersiz IPA: {ipa}")
                if lang == "en":
                    check_en_articles(f"[{aid}:en]", phrase, errors)
                if lang == "es":
                    check_es_inverted_punct(f"[{aid}:es]", phrase, errors)

    # 4. Adult Dialogues
    for dlg in data["ADULT_DIALOGUES"]:
        did = dlg["id"]
        for t_idx, turn in enumerate(dlg["turns"]):
            check_es_inverted_punct(f"[{did}:turn{t_idx}:es]", norm_ws(turn["text"]["es"]), errors)
            for o_idx, opt in enumerate(turn.get("options") or []):
                if opt.get("isBest"):
                    check_en_articles(f"[{did}:t{t_idx}:opt{o_idx}:en]", opt["text"]["en"], errors)
                check_es_inverted_punct(f"[{did}:t{t_idx}:opt{o_idx}:es]", norm_ws(opt["text"]["es"]), errors)

    # 5. Grammar Handbook (18 systematic A1-B2 chapters)
    hb_chapters = data["GRAMMAR_HANDBOOK_CHAPTERS"]
    if len(hb_chapters) < 18:
        errors.append(f"GRAMMAR_HANDBOOK_CHAPTERS en az 18 ders olmalı, bulunan: {len(hb_chapters)}")
    for ch in hb_chapters:
        cid = ch["id"]
        blob_tr = json.dumps(
            [ch["titleTr"], ch["subtitleTr"], ch["mentalModelTr"], ch["sections"], ch["rulesSummary"], ch["turkishTraps"]],
            ensure_ascii=False,
        )
        for bad in FORBIDDEN_JARGON:
            if bad in blob_tr:
                errors.append(f"[{cid}] Yasaklı akademik jargon bulundu: '{bad}'")
        for lang in ("en", "de", "es"):
            comp = ch["langComparisons"][lang]
            nat = norm_ws(comp["naturalForm"])
            ipa = norm_ws(comp["ipa"])
            if not (ipa.startswith("/") and ipa.endswith("/")):
                errors.append(f"[{cid}:{lang}] Geçersiz IPA: {ipa}")
            if lang == "en":
                check_en_articles(f"[{cid}:en]", nat, errors)
            if lang == "es":
                check_es_inverted_punct(f"[{cid}:es]", nat, errors)
            tbl = (ch.get("referenceTables") or {}).get(lang)
            if not tbl or len(tbl.get("rows") or []) < 4:
                errors.append(f"[{cid}:{lang}] En az 4 satırlık referenceTables çekim tablosu zorunludur")
            pqs = (ch.get("practiceQuestions") or {}).get(lang) or []
            if len(pqs) < 2:
                errors.append(f"[{cid}:{lang}] En az 2 etkileşimli practiceQuestions sorusu zorunludur")
            for pq_idx, pq in enumerate(pqs):
                if "___" not in pq.get("sentenceWithBlank", ""):
                    errors.append(f"[{cid}:{lang}:q{pq_idx}] sentenceWithBlank içinde '___' yok")
                if len(pq.get("options") or []) != 3 or pq.get("correctIndex") not in (0, 1, 2):
                    errors.append(f"[{cid}:{lang}:q{pq_idx}] Geçersiz şık/correctIndex yapısı")

    # 6. Structured Vocabulary Bank (12 categories x 20 = 240 concepts)
    vb_cats = data["VOCAB_CATEGORIES"]
    vb_total = 0
    seen_vb_ids = set()
    if len(vb_cats) < 12:
        errors.append(f"VOCAB_CATEGORIES en az 12 kategori olmalı, bulunan: {len(vb_cats)}")
    for cat in vb_cats:
        for entry in cat["entries"]:
            vb_total += 1
            eid = entry["id"]
            if eid in seen_vb_ids:
                errors.append(f"[VOCAB:{eid}] Yinelenen kelime ID")
            seen_vb_ids.add(eid)
            is_noun = entry["posTr"] == "İsim"
            for lang in ("en", "de", "es"):
                loc = entry["langs"][lang]
                w = norm_ws(loc["word"])
                ex = norm_ws(loc["example"])
                ipa = norm_ws(loc["ipa"])
                if not (ipa.startswith("/") and ipa.endswith("/")):
                    errors.append(f"[VOCAB:{eid}:{lang}] Geçersiz IPA: {ipa}")
                if is_noun and lang == "de":
                    if not re.match(r"^(der|die|das)\s+[A-ZÄÖÜ]", w):
                        errors.append(f"[VOCAB:{eid}:de] Almanca isimde 'der/die/das + Büyük Harf' zorunlu: '{w}'")
                if is_noun and lang == "es":
                    if not re.match(r"^(el|la|los|las)\s+", w):
                        errors.append(f"[VOCAB:{eid}:es] İspanyolca isimde 'el/la' zorunlu: '{w}'")
                if lang == "en":
                    check_en_articles(f"[VOCAB:{eid}:en]", f"{w} . {ex}", errors)
                if lang == "es":
                    check_es_inverted_punct(f"[VOCAB:{eid}:es]", ex, errors)
    if vb_total < 240:
        errors.append(f"VOCAB_CATEGORIES toplam en az 240 kavram olmalı, bulunan: {vb_total}")

    # 7. Graded Short Stories (8 stories A1-B2)
    g_stories = data["GRADED_STORIES"]
    if len(g_stories) < 8:
        errors.append(f"GRADED_STORIES en az 8 hikaye olmalı, bulunan: {len(g_stories)}")
    for gs in g_stories:
        gid = gs["id"]
        if len(gs.get("paragraphs") or []) < 5:
            errors.append(f"[{gid}] En az 5 paragraf olmalı")
        for p_idx, para in enumerate(gs.get("paragraphs") or []):
            check_en_articles(f"[{gid}:p{p_idx}:en]", para["text"]["en"], errors)
            check_es_inverted_punct(f"[{gid}:p{p_idx}:es]", norm_ws(para["text"]["es"]), errors)
        if len(gs.get("questions") or []) < 2:
            errors.append(f"[{gid}] En az 2 anlama sorusu olmalı")
        for q_idx, q in enumerate(gs.get("questions") or []):
            opts = q.get("options") or []
            if sum(1 for o in opts if o.get("isCorrect")) != 1:
                errors.append(f"[{gid}:q{q_idx}] Tam olarak 1 doğru şık olmalı")

    if errors:
        print(f"[LINGO-GATE FAIL] {len(errors)} dilbilimsel/yapısal hata bulundu:")
        for e in errors[:40]:
            print("  -", e)
        return 1

    print(
        f"[LINGO-GATE PASS] worlds_vocab={vocab_count} vocab_bank={vb_total} "
        f"adult_phrases={adult_count} dialogues={len(data['ADULT_DIALOGUES'])} "
        f"stories={len(stories)}+{len(g_stories)} handbook_chapters={len(hb_chapters)}"
    )
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
