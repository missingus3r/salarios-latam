# Disclaimer legal

## Scraping de fuentes públicas

Los scripts en `scripts/scrape_*.py` extraen información salarial publicada de forma pública en sitios como Glassdoor, LinkedIn y Levels.fyi.

**Contexto legal (no es asesoramiento legal):**

- En *hiQ Labs vs LinkedIn* (9th Circuit, 2022), tribunales de EE.UU. establecieron que el acceso a datos públicos sin autenticación no constituye una violación del CFAA (Computer Fraud and Abuse Act).
- Sin embargo, la violación de Términos de Servicio (ToS) puede dar lugar a **acciones civiles** (cease-and-desist, demandas por incumplimiento contractual o tort).
- LinkedIn explícitamente prohíbe scraping en sus ToS. Glassdoor también.

**Mitigaciones aplicadas en este repo:**

- Solo se extraen **datos agregados** (mediana, percentiles, N), nunca registros individuales identificables.
- Rate limiting agresivo (≤1 req/segundo).
- Rotación de user-agents.
- Respeto de `robots.txt` cuando exista.
- Ejecución en background diario, no scraping masivo en bursts.
- Datos publicados solo a nivel de bucket agregado (rol+país+seniority), nunca con detalle a nivel persona.

**Si sos titular de derechos** y querés que removamos data derivada de tu sitio, abrí un issue o mandá un mail al maintainer y lo bajamos.

## Privacidad de aportantes

Los aportes vía formulario son **100% anónimos**:
- No pedimos email, nombre, ni IP.
- No hay cookies de tracking.
- La data se publica solo en agregados (mínimo 5 reportes por bucket).

## Datos de Sysarmy / OpenQube

Sysarmy publica su data bajo CC BY-SA 4.0. Este proyecto cita la fuente en el footer y mantiene la misma licencia para los derivados de esa fuente.
