#!/usr/bin/env python3
"""apply_wage_steps.py — aplica los escalones YA PACTADOS de min_wage.json cuando llega su fecha.

El problema que resuelve (proposal #40): min_wage.json documentaba sendas de aumento
—Argentina tenía la escala completa hasta agosto/2026 escrita en `notes`— pero nada las
ejecutaba. Un `grep next_adjustment` sobre todos los .py/.js/.sh del repo daba cero hits,
así que el día del escalón el sitio seguía mostrando el monto viejo hasta que alguien lo
corrigiera a mano.

Qué hace:
  - aplica todo escalón de `schedule` cuya fecha ya llegó (varios si estuvo días sin correr);
  - si `next_adjustment` venció y NO hay escalón cargado, lo REPORTA y no toca nada.

Qué NO hace, a propósito: inventar montos. Un salario mínimo sale de un decreto publicado,
no de una extrapolación. Sin `schedule[fecha]` el script avisa y se queda quieto.

Formato de `schedule` (fechas ISO → escalón):

    "schedule": {
      "2026-08-01": {"amount_local": 376600, "hourly": 1883, "next": null,
                     "source_url": "https://...", "source_name": "Res. 9/2025 CNEPSMVM"}
    }

Uso:
    python3 scripts/apply_wage_steps.py            # aplica y escribe
    python3 scripts/apply_wage_steps.py --dry-run  # sólo reporta

Salida: JSON por stdout con {applied, pending_manual, unchanged}. Exit 0 siempre que la
corrida sea sana; exit 1 sólo ante un error de lectura/escritura.
"""

from __future__ import annotations

import argparse
import datetime
import json
import pathlib
import sys

REPO = pathlib.Path(__file__).resolve().parent.parent
WAGES = REPO / "data" / "min_wage.json"


def bump_patch(version: str) -> str:
    parts = version.split(".")
    if len(parts) != 3 or not parts[2].isdigit():
        return version
    parts[2] = str(int(parts[2]) + 1)
    return ".".join(parts)


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("--dry-run", action="store_true")
    ap.add_argument("--today", help="fecha ISO para testear (default: hoy)")
    args = ap.parse_args()

    today = args.today or datetime.date.today().isoformat()

    try:
        data = json.loads(WAGES.read_text(encoding="utf-8"))
    except Exception as e:
        print(json.dumps({"error": f"no se pudo leer {WAGES}: {e}"}, ensure_ascii=False))
        return 1

    applied: list[dict] = []
    pending_manual: list[dict] = []

    for w in data.get("wages", []):
        iso = w.get("iso", "??")
        schedule = w.get("schedule") or {}

        # Puede haber más de un escalón vencido si el script no corrió en días.
        # Se aplican en orden cronológico para que el último gane.
        due = sorted(d for d in schedule if d <= today)
        for date in due:
            step = schedule[date]
            amount = step.get("amount_local")
            if amount is None:
                pending_manual.append({
                    "iso": iso, "date": date,
                    "reason": "el escalón existe pero no trae amount_local",
                })
                continue
            w["amount_local"] = amount
            w["effective_date"] = date
            w["next_adjustment"] = step.get("next")
            for k in ("source_url", "source_name"):
                if step.get(k):
                    w[k] = step[k]
            applied.append({"iso": iso, "date": date, "amount_local": amount})
            del schedule[date]

        if schedule:
            w["schedule"] = schedule
        else:
            w.pop("schedule", None)

        # next_adjustment vencido sin escalón cargado: no se inventa el monto.
        nxt = w.get("next_adjustment")
        if nxt and nxt <= today and not any(a["iso"] == iso for a in applied):
            pending_manual.append({
                "iso": iso, "date": nxt,
                "reason": "next_adjustment vencido y sin schedule para esa fecha — "
                          "verificar el decreto/resolución y cargar el escalón a mano",
                "source_url": w.get("source_url", ""),
            })

    result = {
        "today": today,
        "applied": applied,
        "pending_manual": pending_manual,
        "unchanged": not applied,
    }

    if applied and not args.dry_run:
        data["last_updated"] = today
        if isinstance(data.get("version"), str):
            data["version"] = bump_patch(data["version"])
        WAGES.write_text(json.dumps(data, ensure_ascii=False, indent=2) + "\n",
                         encoding="utf-8")
        result["written"] = True
        result["version"] = data.get("version")
    else:
        result["written"] = False

    print(json.dumps(result, ensure_ascii=False, indent=2))
    return 0


if __name__ == "__main__":
    sys.exit(main())
