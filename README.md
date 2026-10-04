# Sorova Games

Plataforma educativa infantil (**Sorova Games**).

**Aprender es una aventura.**

## Qué incluye (MVP)

- Identidad visual Sorova + intro animado en el lobby
- **Sopa de letras** con tablero navy y resaltados de marca
- Perfiles dinámicos con fecha de nacimiento y edad
- Avatares centralizados (galería + fotos subidas)
- Dashboard con XP, monedas, racha, temas adaptados por edad
- **Aprende a leer** niveles 1–8: letras, sílabas, palabras, quiz, práctica e historias
- **Teclea como una experta**
- Panel **Administrador** (PIN `4716`): niños, temas, avatares, progreso y material
- Recompensas, logros y mapa de aventura
- Persistencia local + esquema Supabase preparado (`src/supabase/schema.sql`)

El nombre de la app se cambia en `src/config/app.ts`.

## Stack

- React + TypeScript (Vite)
- Tailwind CSS
- React Router
- Supabase (preparado; el MVP usa `localStorage`)

## Desarrollo

```bash
npm install
npm run dev
```

```bash
npm run build
npm run preview
npm run smoke
npm test              # unit + componentes + integración
npm run test:e2e      # Playwright E2E
npm run load-test     # carga cliente + umbral de lentitud
```

Rendimiento, caché, índices y rate limiting: ver `docs/PERFORMANCE.md`.

## Administrador

1. En la pantalla de perfiles, toca **Acceso Administrador**
2. PIN: `4716`
3. Pestaña **Niños**: agregar perfiles, fechas de nacimiento y fotos
4. Pestaña **Temas**: temas por materia con rango de edad
5. Pestaña **Avatares**: galería central de fotos/avatares
6. Pestaña **Progreso**: avance de cada niño
7. Pestaña **Material**: palabras/quizzes e historias (también con edad)

## Cómo agregar un juego nuevo

1. Añade la definición en `src/data/games/registry.ts`
2. Crea `src/data/games/<juego>/` con niveles y contenido
3. Implementa el módulo UI en `src/games/<juego>/`
4. Conecta el módulo en `LessonPage` / registro de juegos
5. Reutiliza XP, logros, progreso y `LessonRunner`

## Arquitectura

```
src/
  config/          # nombre de app, perfiles, PIN admin
  types/           # modelo de dominio
  data/            # contenido educativo y catálogo de juegos
  domain/          # progreso, XP, dificultad adaptativa
  services/        # storage, sonidos, content bank
  context/         # estado global (perfiles, rol, material)
  components/      # UI reutilizable y shell de juego
  games/           # módulos por juego
  pages/           # pantallas (incluye /admin)
  supabase/        # cliente + SQL/RLS preparado
```
