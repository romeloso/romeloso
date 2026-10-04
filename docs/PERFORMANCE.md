# Rendimiento, caché y límites — Mis Juegos

## 1. Rate limiting

Cliente (`src/lib/rateLimit.ts`), sliding window:

| Acción | Límite | Ventana | Lockout |
|--------|--------|---------|---------|
| PIN admin | 5 | 60s | 60s |
| Subida avatar | 10 | 60s | 30s |
| Alta de niño | 20 | 60s | — |
| Contenido/temas | 30 | 60s | — |
| Persistencia local | 120 | 60s | reintento |

Cuando se active Supabase, complementar con rate limits de API Gateway / Edge Functions.

## 2. Queries e índices

- SQL: `src/supabase/schema.sql` — índices por `parent_id`, `(child_id, game_id)`, rangos `min_age/max_age`, topics por materia.
- Cliente: `src/services/queryIndex.ts` — mapas por id y buckets por edad para evitar scans O(n) repetidos.
- Meta HTML: description, Open Graph, `theme-color`, `robots`.

## 3. Estrategia de caché

Capas:

1. **Memoria (TTL 120s)** — lecciones admin y topics filtrados por edad (`contentCache`).
2. **Persistencia diferida** — `localStorage` con debounce 250ms + `requestIdleCallback`.
3. **Estáticos** — avatares y assets servidos por Vite/CDN; fonts con `preconnect`.
4. **Invalidación** — al crear/borrar palabras, pasajes, topics o avatares.

## 4. Procesamiento asíncrono

- Compresión de avatares en **Web Worker** (`src/workers/imageWorker.ts`).
- Guardado de estado fuera del hilo crítico (idle + microtasks).
- Fallback a main thread con `requestIdleCallback` si el worker no está disponible.

## 5. Load testing

Ejecutar:

```bash
npm run load-test
```

Informe: `docs/load-test-report.json`.

Hallazgos (simulación cliente en este entorno):

| Escenario | Umbral de lentitud | Resultado |
|-----------|--------------------|-----------|
| CPU: filtrar + stringify | p95 > 100ms | Estable hasta **≥400** usuarios concurrentes simulados |
| Persistencia con avatares base64 | soft-limit ~4.5MB | Se degrada ~**20 perfiles** con fotos ~120KB c/u |

Mitigaciones ya aplicadas: debounce + idle save, worker de imágenes, caché de lecciones/topics.
Próximo paso cloud: Supabase Storage (URLs) + índices SQL + rate limit en Edge Functions.
