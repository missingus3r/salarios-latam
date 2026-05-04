# Salarios LATAM

Comparador anónimo y abierto de salarios en Latinoamérica. Datos de Sysarmy + reportes anónimos de la comunidad. SPA estática (vanilla JS + three.js + Tailwind), publicada en GitHub Pages.

🌐 **Demo:** https://missingus3r.github.io/salarios-latam/

## Stack

- HTML + Vanilla JS (ES modules)
- [Tailwind CSS](https://tailwindcss.com/) vía CDN
- [three.js](https://threejs.org/) para visualización 3D del scatter de salarios en el hero
- Datos en JSON estático regenerado por GitHub Action diaria

## Estructura

```
.
├── index.html              # SPA principal
├── main.js                 # Lógica + three.js
├── data/
│   ├── salaries.json       # Datos agregados (mediana, P25, P75, N por rol/pais/seniority)
│   └── meta.json           # Metadata + last_updated
├── scripts/
│   ├── ingest_sysarmy.py   # Bootstrap desde Sysarmy/OpenQube
│   ├── ingest_form.py      # Pull de formulario crowdsource (Sheets)
│   ├── scrape_glassdoor.py # Scraper de Glassdoor (background, ver disclaimer)
│   ├── scrape_linkedin.py  # Scraper de LinkedIn (background, ver disclaimer)
│   └── aggregate.py        # Calcula mediana/P25/P75 por bucket → salaries.json
└── .github/workflows/
    └── daily.yml           # Cron diario que corre todos los scripts
```

## Fuentes de datos

1. **Sysarmy / OpenQube** ([sueldos.openqube.io](https://sueldos.openqube.io/), CC BY-SA 4.0). Encuesta semestral, ~10k respuestas, foco AR + LATAM tech.
2. **Reportes anónimos** vía formulario embebido (Google Forms / Cloudflare Worker). Sin email, sin tracking.
3. **Scraping de fuentes públicas** (Glassdoor, LinkedIn, Levels.fyi). Ver `DISCLAIMER.md` para contexto legal.

## Aportar tu sueldo

[Formulario anónimo](https://forms.gle/PLACEHOLDER) — toma 30 segundos, no pide email.

## Cómo correr local

```bash
python3 -m http.server 8000
# abrí http://localhost:8000
```

No hay build step.

## Licencia

- Código: MIT
- Datos derivados de Sysarmy: CC BY-SA 4.0 (mismo licenciamiento que la fuente)
- Datos crowdsource: CC0 (los donantes liberan al dominio público)

## Contribuir

PRs welcome. Para nuevos rubros / países, abrí un issue antes con el plan de scraping/ingesta.
