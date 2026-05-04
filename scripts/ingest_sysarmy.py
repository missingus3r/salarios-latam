#!/usr/bin/env python3
"""
Ingest Sysarmy / OpenQube salary survey data.

Sysarmy publishes its dataset at sueldos.openqube.io. The site exposes the raw
CSV/JSON of the latest "Encuesta de Sueldos" (semestral, AR-focused).

Output: data/raw/sysarmy_<period>.json — array of normalized records.

Bootstrap mode: reads from the public CC BY-SA dump.
"""

from __future__ import annotations
import json
import sys
import urllib.request
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
RAW_DIR = ROOT / "data" / "raw"
RAW_DIR.mkdir(parents=True, exist_ok=True)

# OpenQube exposes /api/data — endpoint may vary by season; placeholder URL.
# The first run expects manual download until we wire the API.
SOURCE_URL = "https://sueldos.openqube.io/data/sysarmy-2024-h2.json"


def fetch(url: str) -> list[dict]:
    req = urllib.request.Request(url, headers={"User-Agent": "salarios-latam/0.1 (+https://github.com/missingus3r/salarios-latam)"})
    with urllib.request.urlopen(req, timeout=30) as r:
        return json.loads(r.read().decode())


def normalize(rec: dict) -> dict:
    """Normalize Sysarmy schema to internal canonical shape."""
    return {
        "rol": rec.get("rol") or rec.get("role") or rec.get("trabajo_de"),
        "rubro": rec.get("rubro") or "Software",
        "seniority": rec.get("seniority") or rec.get("nivel"),
        "pais": rec.get("pais") or "Argentina",
        "modalidad": rec.get("modalidad") or rec.get("trabajo_remoto") or "Remoto",
        "salary_usd": rec.get("salario_dolarizado") or rec.get("salary_usd"),
        "source": "sysarmy",
    }


def main() -> int:
    try:
        data = fetch(SOURCE_URL)
    except Exception as exc:
        print(f"[sysarmy] fetch failed: {exc}", file=sys.stderr)
        return 1
    norm = [normalize(r) for r in data if r]
    out = RAW_DIR / "sysarmy_latest.json"
    out.write_text(json.dumps(norm, ensure_ascii=False, indent=2))
    print(f"[sysarmy] wrote {len(norm)} records to {out}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
