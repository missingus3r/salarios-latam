#!/usr/bin/env python3
"""
Ingest crowdsource form responses (Google Sheets / Cloudflare Worker).

Reads from FORM_SHEET_URL env var (CSV export) and produces normalized records
in data/raw/form_<date>.json.

Schema expected from form:
- timestamp, rol, rubro, seniority, pais, modalidad, salary_usd, tags (csv)

Falls back gracefully if the sheet is empty or unreachable.
"""

from __future__ import annotations
import csv
import io
import json
import os
import sys
import urllib.request
from datetime import date
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
RAW_DIR = ROOT / "data" / "raw"
RAW_DIR.mkdir(parents=True, exist_ok=True)

SHEET_URL = os.environ.get("FORM_SHEET_URL", "")


def main() -> int:
    if not SHEET_URL:
        print("[form] FORM_SHEET_URL not set, skipping (use Google Sheets CSV publish-to-web URL)", file=sys.stderr)
        return 0
    try:
        req = urllib.request.Request(SHEET_URL, headers={"User-Agent": "salarios-latam/0.1"})
        with urllib.request.urlopen(req, timeout=30) as r:
            body = r.read().decode("utf-8", errors="replace")
    except Exception as exc:
        print(f"[form] fetch failed: {exc}", file=sys.stderr)
        return 1

    rows: list[dict] = []
    for r in csv.DictReader(io.StringIO(body)):
        try:
            salary = float(r.get("salary_usd") or r.get("Salario USD") or 0)
        except ValueError:
            continue
        if salary <= 0:
            continue
        rows.append({
            "rol": (r.get("rol") or r.get("Rol") or "").strip() or None,
            "rubro": (r.get("rubro") or r.get("Rubro") or "Software").strip(),
            "seniority": (r.get("seniority") or r.get("Seniority") or "Senior").strip(),
            "pais": (r.get("pais") or r.get("País") or "Argentina").strip(),
            "modalidad": (r.get("modalidad") or r.get("Modalidad") or "Remoto").strip(),
            "salary_usd": salary,
            "tags": [t.strip() for t in (r.get("tags") or "").split(",") if t.strip()],
            "source": "form",
        })

    out = RAW_DIR / f"form_{date.today().isoformat()}.json"
    out.write_text(json.dumps(rows, ensure_ascii=False, indent=2))
    print(f"[form] wrote {len(rows)} records to {out}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
