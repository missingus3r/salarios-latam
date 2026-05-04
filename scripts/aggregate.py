#!/usr/bin/env python3
"""
Aggregate raw salary records (from data/raw/*.json) into bucketed medians
and percentiles, then write data/salaries.json + data/meta.json.

Bucket = (rol, rubro, seniority, pais, modalidad).
Output stats: median_usd, p25_usd, p75_usd, n.
Buckets with n < MIN_N are dropped to preserve anonymity.
"""

from __future__ import annotations
import json
import statistics
from collections import defaultdict
from datetime import date
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
RAW_DIR = ROOT / "data" / "raw"
OUT_FILE = ROOT / "data" / "salaries.json"
META_FILE = ROOT / "data" / "meta.json"

MIN_N = 5


def percentile(sorted_vals: list[float], p: float) -> int:
    if not sorted_vals:
        return 0
    k = (len(sorted_vals) - 1) * p
    f, c = int(k), min(int(k) + 1, len(sorted_vals) - 1)
    return round(sorted_vals[f] + (sorted_vals[c] - sorted_vals[f]) * (k - f))


def bucket_key(rec: dict) -> tuple[str, str, str, str, str]:
    return (
        rec.get("rol") or "—",
        rec.get("rubro") or "Software",
        rec.get("seniority") or "Senior",
        rec.get("pais") or "Argentina",
        rec.get("modalidad") or "Remoto",
    )


def main() -> int:
    raw_files = list(RAW_DIR.glob("*.json")) if RAW_DIR.exists() else []
    all_records: list[dict] = []
    for f in raw_files:
        try:
            all_records.extend(json.loads(f.read_text()))
        except Exception:
            continue

    buckets: dict[tuple, list[float]] = defaultdict(list)
    tags_per_bucket: dict[tuple, set[str]] = defaultdict(set)
    for r in all_records:
        salary = r.get("salary_usd")
        if not isinstance(salary, (int, float)) or salary <= 0:
            continue
        key = bucket_key(r)
        buckets[key].append(float(salary))
        for t in r.get("tags") or []:
            tags_per_bucket[key].add(t)

    rows = []
    for key, vals in buckets.items():
        if len(vals) < MIN_N:
            continue
        sorted_vals = sorted(vals)
        rows.append({
            "rol": key[0],
            "rubro": key[1],
            "seniority": key[2],
            "pais": key[3],
            "modalidad": key[4],
            "median_usd": round(statistics.median(sorted_vals)),
            "p25_usd": percentile(sorted_vals, 0.25),
            "p75_usd": percentile(sorted_vals, 0.75),
            "n": len(sorted_vals),
            "tags": sorted(tags_per_bucket[key])[:10],
        })

    rows.sort(key=lambda r: -r["median_usd"])

    if rows:
        OUT_FILE.write_text(json.dumps(rows, ensure_ascii=False, indent=2))

    paises = {r["pais"] for r in rows}
    rubros = {r["rubro"] for r in rows}
    meta = {
        "version": "0.1.0",
        "last_updated": date.today().isoformat(),
        "records": len(rows),
        "rubros": len(rubros),
        "paises": len(paises),
        "min_bucket_n": MIN_N,
        "sources": [
            {"name": "Sysarmy / OpenQube", "url": "https://sueldos.openqube.io/", "license": "CC BY-SA 4.0"},
            {"name": "Comunidad (formulario anónimo)", "license": "CC0"},
        ],
    }
    if rows:
        META_FILE.write_text(json.dumps(meta, ensure_ascii=False, indent=2))

    print(f"[aggregate] {len(rows)} buckets written. paises={len(paises)} rubros={len(rubros)}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
