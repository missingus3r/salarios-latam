#!/usr/bin/env python3
"""
Scrape LinkedIn public salary insights.

LinkedIn exposes aggregate salary stats on /salary/<role>/<location>/ pages
when accessed without authentication. We collect aggregate medians only.

See DISCLAIMER.md for the legal context.

Stub — the real parser breaks frequently. The cron pipeline tolerates failure
via `continue-on-error: true`.
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
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/127.0.0.0 Safari/537.36",
]

TARGETS: list[tuple[str, str, str, str, str]] = [
    # ("Software Engineer", "Software", "Senior", "Argentina", "https://www.linkedin.com/salary/software-engineer-salaries-buenos-aires"),
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
        print("[linkedin] no targets configured, skipping", file=sys.stderr)
        return 0
    out: list[dict] = []
    for rol, rubro, seniority, pais, url in TARGETS:
        try:
            html = fetch(url)
            print(f"[linkedin] fetched {url} ({len(html)} bytes) — parser not wired yet")
        except Exception as exc:
            print(f"[linkedin] {url} failed: {exc}", file=sys.stderr)
        time.sleep(2)

    if out:
        f = RAW_DIR / f"linkedin_{date.today().isoformat()}.json"
        f.write_text(json.dumps(out, ensure_ascii=False, indent=2))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
