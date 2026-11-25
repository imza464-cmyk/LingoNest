#!/usr/bin/env python3
"""
LingoNest — Canonical GitHub + GitHub Pages Live Publisher
1. Runs npm test + npm run build (relative base './' + .nojekyll + 1,912 .vpak neural audio clips)
2. Commits & pushes source to github.com/imza464-cmyk/LingoNest (main)
3. Publishes clean static dist/ to gh-pages branch
4. Enables GitHub Pages and empirically verifies live HTTPS 200 + manifest.json + .vpak clip!
"""

import json
import os
import shutil
import subprocess
import sys
import tempfile
import time
import urllib.request

if sys.platform == "win32":
    try:
        sys.stdout.reconfigure(encoding="utf-8", line_buffering=True)
    except Exception:
        pass

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
DIST = os.path.join(ROOT, "dist")
OWNER = "imza464-cmyk"
REPO = "LingoNest"
REMOTE_URL = f"https://github.com/{OWNER}/{REPO}.git"
LIVE_URL = f"https://{OWNER}.github.io/{REPO}/"


def run(cmd, cwd=ROOT, check=True):
    use_shell = sys.platform == "win32" and cmd[0] in ("npm", "npx", "gh")
    proc = subprocess.run(
        cmd,
        cwd=cwd,
        shell=use_shell,
        capture_output=True,
        text=True,
        encoding="utf-8",
        errors="replace",
    )
    if check and proc.returncode != 0:
        print(f"[ERR] {' '.join(cmd)}\n{(proc.stdout or '')[-1200:]}\n{(proc.stderr or '')[-1200:]}", flush=True)
        raise SystemExit(proc.returncode)
    return proc


def main():
    print("[1/5] Running unit tests & production Vite build...", flush=True)
    run(["npm", "test"])
    run(["npm", "run", "build"])

    idx_html = open(os.path.join(DIST, "index.html"), encoding="utf-8").read()
    assert "./assets/" in idx_html, f"Expected relative ./assets/ in dist/index.html, got: {idx_html[:300]}"
    assert os.path.exists(os.path.join(DIST, ".nojekyll")), "Missing dist/.nojekyll!"
    assert os.path.exists(os.path.join(DIST, "audio", "manifest.json")), "Missing dist/audio/manifest.json!"
    print("[OK]  dist/ verified (relative ./assets/, .nojekyll, audio/manifest.json)", flush=True)

    print("[2/5] Initializing git repo & creating/syncing GitHub repo...", flush=True)
    if not os.path.exists(os.path.join(ROOT, ".git")):
        run(["git", "init", "-b", "main"])
    else:
        run(["git", "checkout", "-B", "main"], check=False)

    run(["git", "add", "-A"])
    st = run(["git", "status", "--porcelain"], check=False)
    if st.stdout.strip():
        run(["git", "commit", "-m", "feat: LingoNest v1.0 - 3-age chameleon SLA platform + 1912 Gen-4 neural voices"])
        print("[OK]  Committed main branch", flush=True)
    else:
        print("[=]   Working tree already clean", flush=True)

    view = run(["gh", "repo", "view", f"{OWNER}/{REPO}"], check=False)
    if view.returncode != 0:
        print(f"[*]   Creating public repo {OWNER}/{REPO}...", flush=True)
        run(["gh", "repo", "create", f"{OWNER}/{REPO}", "--public", "--description",
             "LingoNest - 5 yasindan yetiskine 3-yas bukalemun dogal dil edinimi platformu (FSRS-5 + 1912 Gen-4 noral ses)",
             "--homepage", LIVE_URL])
    else:
        print(f"[=]   Repo {OWNER}/{REPO} already exists", flush=True)

    rem = run(["git", "remote", "get-url", "origin"], check=False)
    if rem.returncode != 0:
        run(["git", "remote", "add", "origin", REMOTE_URL])
    else:
        run(["git", "remote", "set-url", "origin", REMOTE_URL])

    print("[3/5] Pushing main branch to GitHub...", flush=True)
    run(["git", "push", "-u", "origin", "main", "--force"])
    print("[OK]  main pushed!", flush=True)

    print("[4/5] Publishing dist/ to gh-pages branch...", flush=True)
    tmp_dir = tempfile.mkdtemp(prefix="lingonest_ghpages_")
    try:
        shutil.copytree(DIST, tmp_dir, dirs_exist_ok=True)
        run(["git", "init", "-b", "gh-pages"], cwd=tmp_dir)
        run(["git", "add", "-A"], cwd=tmp_dir)
        run(["git", "commit", "-m", "deploy: LingoNest live static build + 1912 neural .vpak voices"], cwd=tmp_dir)
        run(["git", "remote", "add", "origin", REMOTE_URL], cwd=tmp_dir)
        run(["git", "push", "-f", "origin", "gh-pages:gh-pages"], cwd=tmp_dir)
        print("[OK]  gh-pages pushed!", flush=True)
    finally:
        shutil.rmtree(tmp_dir, ignore_errors=True)

    print("[5/5] Enabling GitHub Pages & verifying live HTTPS...", flush=True)
    pg_check = run(["gh", "api", f"repos/{OWNER}/{REPO}/pages"], check=False)
    if pg_check.returncode != 0:
        run([
            "gh", "api", "-X", "POST", f"repos/{OWNER}/{REPO}/pages",
            "-f", "source[branch]=gh-pages",
            "-f", "source[path]=/",
        ])
        print("[OK]  GitHub Pages enabled on gh-pages /", flush=True)
    else:
        run([
            "gh", "api", "-X", "PUT", f"repos/{OWNER}/{REPO}/pages",
            "-f", "source[branch]=gh-pages",
            "-f", "source[path]=/",
        ], check=False)
        print("[OK]  GitHub Pages verified on gh-pages /", flush=True)

    for attempt in range(18):
        time.sleep(5)
        try:
            req = urllib.request.Request(LIVE_URL, headers={"User-Agent": "Mozilla/5.0", "Cache-Control": "no-cache"})
            with urllib.request.urlopen(req, timeout=8) as r:
                html = r.read().decode("utf-8", "replace")
                if r.status == 200 and "LingoNest" in html:
                    m_req = urllib.request.Request(LIVE_URL + "audio/manifest.json", headers={"User-Agent": "Mozilla/5.0"})
                    with urllib.request.urlopen(m_req, timeout=8) as mr:
                        mj = json.loads(mr.read().decode("utf-8"))
                    v_req = urllib.request.Request(LIVE_URL + "audio/3670799ccb587ac6.vpak", headers={"User-Agent": "Mozilla/5.0"})
                    with urllib.request.urlopen(v_req, timeout=8) as vr:
                        vlen = len(vr.read())
                    print(f"[LIVE!] {LIVE_URL} -> HTTP 200 | manifest={mj.get('count')} clips | sample .vpak={vlen}B", flush=True)
                    return
        except Exception as e:
            if attempt % 3 == 2:
                print(f"  [wait {(attempt+1)*5}s] GitHub Pages CDN propagating ({type(e).__name__})...", flush=True)

    print(f"[WARN] Repo & gh-pages pushed; Pages build may still be propagating at {LIVE_URL}", flush=True)


if __name__ == "__main__":
    main()
