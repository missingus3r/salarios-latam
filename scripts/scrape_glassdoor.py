#!/usr/bin/env python3
"""
Scrape Glassdoor public salary aggregates.

Notes:
- Glassdoor publishes some role+location pages with aggregate salary stats
  (median, range) accessible without authentication. We use those, never
  individual records, never per-employee detail.
- Rate limited to 1 req / 2s, rotating user-agents.
- See DISCLAIMER.md for the legal context.
- This is a stub: the real selectors break frequently as Glassdoor's HTML
  shifts. The cron job in `.github/workflows/daily.yml` runs with
  `continue-on-error: true` so a broken scraper never blocks the pipeline.
"""

from __future__ import annotations
import json
import random
import sys
import time
import urllib.request
from datetime import date
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
RAW_DIR = ROOT / "data" / "raw"
RAW_DIR.mkdir(parents=True, exist_ok=True)

USER_AGENTS = [
    "Mozilla/5.0 (X11; Linux x86_64; rv:128.0) Gecko/20100101 Firefox/128.0",
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 14_5) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.5 Safari/605.1.15",
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/127.0.0.0 Safari/537.36",
]

# (rol, rubro, seniority, pais, glassdoor_url)
TARGETS = [
    # ("Software Engineer", "Software", "Senior", "Argentina", "https://www.glassdoor.com/Salaries/argentina-software-engineer-salary-SRCH_IL.0,9_IN8_KO10,27.htm"),
    # ... actual targets configured per-deploy
]


def fetch(url: str) -> str:
    req = urllib.request.Request(url, headers={
        "User-Agent": random.choice(USER_AGENTS),
        "Accept-Language": "es-AR,es;q=0.9,en;q=0.5",
    })
    with urllib.request.urlopen(req, timeout=30) as r:
        return r.read().decode("utf-8", errors="replace")


def main() -> int:
    if not TARGETS:
        print("[glassdoor] no targets configured, skipping", file=sys.stderr)
        return 0
    out: list[dict] = []
    for rol, rubro, seniority, pais, url in TARGETS:
        try:
            html = fetch(url)
            # TODO: parse aggregate median/p25/p75 from page HTML.
            # Placeholder: emit nothing until selectors are stable.
            print(f"[glassdoor] fetched {url} ({len(html)} bytes) — parser not wired yet")
        except Exception as exc:
            print(f"[glassdoor] {url} failed: {exc}", file=sys.stderr)
        time.sleep(2)

    if out:
        f = RAW_DIR / f"glassdoor_{date.today().isoformat()}.json"
        f.write_text(json.dumps(out, ensure_ascii=False, indent=2))
        print(f"[glassdoor] wrote {len(out)} records")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
