# Mis Juegos

Plataforma educativa infantil para Isabella, Sophia y Valentina.

**Aprender es una aventura.**

## Qué incluye (MVP)

- Perfiles con avatares ilustrados (progreso aislado)
- Dashboard con XP, monedas, racha y progreso
- **Aprende a leer** niveles 1–8: letras, sílabas, palabras, **quiz**, **práctica con corrección instantánea** e historias
- **Teclea como una experta** niveles 1–5
- Panel **Administrador** (PIN `2468`): ver progreso de cada niña e ingresar material
- Recompensas, logros, mapa de aventura y resultados celebratorios
- Arquitectura modular lista para más juegos
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
```

## Administrador

1. En la pantalla de perfiles, toca **Acceso Administrador**
2. PIN: `2468`
3. Pestaña **Progreso**: Isabella / Sophia / Valentina
4. Pestaña **Material**: palabras/quizzes e historias que se integran al juego de lectura

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
