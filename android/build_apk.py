#!/usr/bin/env python3
"""
LingoNest — Canonical Android APK Build Engine (Rule 9 Compliant)
Flow: Sync Gradle wrapper -> Gradle assembleDebug -> ZipAlign 4 -> ApkSigner V1/V2/V3 -> Verify -> dist/LingoNest.apk
"""
import hashlib
import os
import shutil
import subprocess
import sys

if sys.platform == "win32":
    try:
        sys.stdout.reconfigure(encoding="utf-8", line_buffering=True)
    except Exception:
        pass

ANDROID_DIR = os.path.dirname(os.path.abspath(__file__))
WRAPPER_SRC = r"C:\Users\serit\projelerim\citadel_edge\android"
DIST_DIR = os.path.join(ANDROID_DIR, "dist")
KEYSTORE_PATH = os.path.join(ANDROID_DIR, "lingonest_debug.keystore")
KS_PASS = "android"
KS_ALIAS = "lingonest"

SDK_DIR = (
    os.environ.get("ANDROID_HOME")
    or os.environ.get("ANDROID_SDK_ROOT")
    or os.path.expandvars(r"%LOCALAPPDATA%\Android\Sdk")
)
_bt_root = os.path.join(SDK_DIR, "build-tools")
_bt_versions = sorted(os.listdir(_bt_root), reverse=True) if os.path.exists(_bt_root) else []
BUILD_TOOLS_DIR = os.path.join(_bt_root, _bt_versions[0]) if _bt_versions else ""

JAVA_HOME = next(
    (
        c
        for c in (
            r"C:\Program Files\Android\Android Studio1\jbr",
            r"C:\Program Files\Android\Android Studio\jbr",
            os.path.expandvars(r"%LOCALAPPDATA%\Programs\Android Studio\jbr"),
            os.environ.get("JAVA_HOME", ""),
        )
        if c and os.path.exists(os.path.join(c, "bin", "java.exe"))
    ),
    "",
)
if JAVA_HOME:
    os.environ["JAVA_HOME"] = JAVA_HOME
    os.environ["PATH"] = os.path.join(JAVA_HOME, "bin") + os.pathsep + os.environ.get("PATH", "")

ZIPALIGN = os.path.join(BUILD_TOOLS_DIR, "zipalign.exe")
APKSIGNER = os.path.join(BUILD_TOOLS_DIR, "apksigner.bat")
KEYTOOL = os.path.join(JAVA_HOME, "bin", "keytool.exe") if JAVA_HOME else "keytool"


def run_cmd(args, desc, cwd=ANDROID_DIR):
    print(f"[*] {desc}...", flush=True)
    cmd = list(args)
    if sys.platform == "win32" and cmd and cmd[0].lower().endswith(".bat"):
        cmd = ["cmd.exe", "/c"] + cmd
    proc = subprocess.run(cmd, cwd=cwd, capture_output=True, text=True, encoding="utf-8", errors="replace")
    out = (proc.stdout or "") + (proc.stderr or "")
    if proc.returncode != 0:
        print(out[-2500:], flush=True)
        raise RuntimeError(f"Failed: {desc} (rc={proc.returncode})")
    return out


def ensure_wrapper_and_sdk():
    for rel in (
        "gradlew.bat",
        "gradlew",
        os.path.join("gradle", "wrapper", "gradle-wrapper.jar"),
        os.path.join("gradle", "wrapper", "gradle-wrapper.properties"),
    ):
        dst = os.path.join(ANDROID_DIR, rel)
        src = os.path.join(WRAPPER_SRC, rel)
        if not os.path.exists(dst) and os.path.exists(src):
            os.makedirs(os.path.dirname(dst), exist_ok=True)
            shutil.copy2(src, dst)

    lp = os.path.join(ANDROID_DIR, "local.properties")
    if not os.path.exists(lp) and SDK_DIR:
        escaped = SDK_DIR.replace("\\", "\\\\").replace(":", "\\:")
        with open(lp, "w", encoding="utf-8") as f:
            f.write(f"sdk.dir={escaped}\n")


def ensure_keystore():
    if not os.path.exists(KEYSTORE_PATH):
        run_cmd(
            [
                KEYTOOL, "-genkeypair", "-keystore", KEYSTORE_PATH,
                "-storepass", KS_PASS, "-alias", KS_ALIAS, "-keypass", KS_PASS,
                "-keyalg", "RSA", "-keysize", "2048", "-validity", "10000",
                "-dname", "CN=LingoNest, OU=Language, O=Citadel, C=TR",
            ],
            "Generating persistent lingonest_debug.keystore",
        )


def build_apk():
    ensure_wrapper_and_sdk()
    ensure_keystore()
    os.makedirs(DIST_DIR, exist_ok=True)

    run_cmd([os.path.join(ANDROID_DIR, "gradlew.bat"), "assembleDebug", "--no-daemon"], "Gradle assembleDebug")

    raw_apk = os.path.join(ANDROID_DIR, "app", "build", "outputs", "apk", "debug", "app-debug.apk")
    aligned_apk = os.path.join(DIST_DIR, "LingoNest-aligned.apk")
    final_apk = os.path.join(DIST_DIR, "LingoNest.apk")
    for p in (aligned_apk, final_apk):
        if os.path.exists(p):
            os.remove(p)

    run_cmd([ZIPALIGN, "-v", "-p", "4", raw_apk, aligned_apk], "ZipAlign 4")
    run_cmd(
        [
            APKSIGNER, "sign",
            "--ks", KEYSTORE_PATH, "--ks-pass", f"pass:{KS_PASS}",
            "--ks-key-alias", KS_ALIAS, "--key-pass", f"pass:{KS_PASS}",
            "--v1-signing-enabled", "true", "--v2-signing-enabled", "true", "--v3-signing-enabled", "true",
            "--out", final_apk, aligned_apk,
        ],
        "ApkSigner V1/V2/V3",
    )
    os.remove(aligned_apk)
    run_cmd([APKSIGNER, "verify", "--verbose", final_apk], "ApkSigner verify")

    h = hashlib.sha256(open(final_apk, "rb").read()).hexdigest()
    size_mb = os.path.getsize(final_apk) / (1024 * 1024)
    print(f"[OK] Built signed LingoNest APK: {final_apk} ({size_mb:.2f} MB) SHA256={h[:16]}...", flush=True)
    return final_apk


if __name__ == "__main__":
    build_apk()
