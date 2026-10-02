# Mis Juegos

Plataforma educativa infantil para Isabella, Sophia y Valentina.

**Aprender es una aventura.**

## Qué incluye (MVP)

- Selección de perfiles infantiles (extensible)
- Dashboard con XP, monedas, racha y progreso
- Juego **Aprende a leer** (niveles 1–5)
- Juego **Teclea como una experta** (niveles 1–5)
- Recompensas, logros, mapa de aventura y resultados celebratorios
- Arquitectura modular lista para más juegos (mate, inglés, ciencias…)
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
```

## Cómo agregar un juego nuevo

1. Añade la definición en `src/data/games/registry.ts`
2. Crea `src/data/games/<juego>/` con niveles y contenido
3. Implementa el módulo UI en `src/games/<juego>/`
4. Conecta el módulo en `LessonPage` / registro de juegos
5. Reutiliza XP, logros, progreso y `LessonRunner`

No hace falta reescribir el dashboard ni el sistema de recompensas.

## Arquitectura

```
src/
  config/          # nombre de app, perfiles semilla, reglas de recompensa
  types/           # modelo de dominio
  data/            # contenido educativo y catálogo de juegos
  domain/          # progreso, XP, dificultad adaptativa
  services/        # storage, sonidos, factories
  context/         # estado global de perfiles/progreso
  components/      # UI reutilizable y shell de juego
  games/           # módulos por juego
  pages/           # pantallas de navegación
  supabase/        # cliente + SQL/RLS preparado
```

## Perfiles

Semilla inicial en `src/config/profiles.ts`:

- Isabella
- Sophia
- Valentina

El progreso de cada niña está aislado.
