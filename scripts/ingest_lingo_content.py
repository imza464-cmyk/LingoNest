#!/usr/bin/env python3
"""
LingoNest — Gerçek Dil İçeriği Aktarım ve Adli Dilbilim Doğrulama Aracı
Yeni eklenen veya güncellenen tüm kelime, kalıp, diyalog ve dilbilgisi el kitabı bölümlerini
`verify_linguistic_accuracy.py` kapısından geçirir; tek bir IPA, tanımlık (a/an), İspanyolca (¿/¡)
veya sözdizimi parçası (`wordOrderChunks`) hatası varsa derlemeyi durdurur.
"""
import pathlib
import subprocess
import sys

ROOT = pathlib.Path(__file__).resolve().parent.parent
GATE = ROOT / "scripts" / "verify_linguistic_accuracy.py"


def main() -> None:
    res = subprocess.run([sys.executable, str(GATE)], cwd=str(ROOT))
    if res.returncode != 0:
        raise SystemExit(res.returncode)
    print("[LINGO-INGEST] Dilbilimsel doğruluk ve 3-dilli bütünlük mührü onaylandı.")


if __name__ == "__main__":
    main()
