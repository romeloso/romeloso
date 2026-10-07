import { createServer } from 'node:http'
import { readFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import pg from 'pg'

const PORT = Number(process.env.PORT || 8787)
const DATABASE_URL = process.env.DATABASE_URL
const rootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const distDir = path.join(rootDir, 'dist')
const schemaPath = path.join(rootDir, 'server', 'schema.sql')
const MAX_BODY = 20_000_000

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.gif': 'image/gif',
  '.ico': 'image/x-icon',
  '.woff2': 'font/woff2',
  '.txt': 'text/plain; charset=utf-8',
}

function poolConfig(url) {
  const internal = url.includes('.railway.internal') || url.includes('railway.internal')
  return {
    connectionString: url,
    max: 5,
    ssl: internal ? false : { rejectUnauthorized: false },
  }
}

const pool = DATABASE_URL ? new pg.Pool(poolConfig(DATABASE_URL)) : null

function sendJson(res, status, body) {
  const payload = JSON.stringify(body)
  res.writeHead(status, {
    'content-type': 'application/json; charset=utf-8',
    'cache-control': 'no-store',
  })
  res.end(payload)
}

function asDate(value) {
  if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return null
  return value
}

function asTimestamp(value) {
  if (typeof value !== 'string') return null
  const time = Date.parse(value)
  if (Number.isNaN(time)) return null
  return new Date(time).toISOString()
}

function asInt(value, fallback) {
  return Number.isInteger(value) ? value : fallback
}

function shortSrc(value) {
  if (typeof value !== 'string' || value.length === 0) return null
  if (value.startsWith('data:') || value.length > 2000) return null
  return value
}

async function ensureSchema() {
  if (!pool) return
  const sql = await readFile(schemaPath, 'utf8')
  await pool.query(sql)
}

async function readState() {
  const result = await pool.query('select payload from public.app_state where id = $1', ['default'])
  return result.rows[0]?.payload ?? null
}

async function syncProjection(client, state) {
  const profiles = Object.values(state.profiles ?? {})
  const profileIds = profiles.map((profile) => profile.id).filter(Boolean)

  for (const profile of profiles) {
    if (!profile?.id || typeof profile.name !== 'string') continue
    await client.query(
      `insert into public.children_profiles (
         id, name, birth_date, school_grade, level, xp, points, coins, streak_days,
         last_played_date, avatar, avatar_image, accent, achievements, updated_at
       ) values (
         $1, $2, $3, $4, $5, $6, $7, $8, $9,
         $10, $11, $12, $13, $14, now()
       )
       on conflict (id) do update set
         name = excluded.name,
         birth_date = excluded.birth_date,
         school_grade = excluded.school_grade,
         level = excluded.level,
         xp = excluded.xp,
         points = excluded.points,
         coins = excluded.coins,
         streak_days = excluded.streak_days,
         last_played_date = excluded.last_played_date,
         avatar = excluded.avatar,
         avatar_image = excluded.avatar_image,
         accent = excluded.accent,
         achievements = excluded.achievements,
         updated_at = now()`,
      [
        profile.id,
        profile.name,
        asDate(profile.birthDate),
        profile.grade == null ? null : asInt(profile.grade, null),
        asInt(profile.level, 1),
        asInt(profile.xp, 0),
        asInt(profile.points, 0),
        asInt(profile.coins, 0),
        asInt(profile.streakDays, 0),
        asDate(profile.lastPlayedDate),
        profile.avatar ?? null,
        shortSrc(profile.avatarImage),
        profile.accent ?? null,
        Array.isArray(profile.achievements) ? profile.achievements : [],
      ],
    )
    const progress = state.progress?.[profile.id] ?? {}
    await client.query(
      `insert into public.child_progress (child_id, progress, updated_at)
       values ($1, $2::jsonb, now())
       on conflict (child_id) do update set progress = excluded.progress, updated_at = now()`,
      [profile.id, JSON.stringify(progress)],
    )
  }

  await client.query(
    'delete from public.children_profiles where not (id = any($1::text[]))',
    [profileIds],
  )

  const topics = state.contentBank?.topics ?? []
  for (const topic of topics) {
    if (!topic?.id) continue
    await client.query(
      `insert into public.study_topics (
         id, subject_id, title, description, min_age, max_age, min_grade, max_grade, reinforce, created_at
       ) values ($1, $2, $3, $4, $5, $6, $7, $8, $9, coalesce($10::timestamptz, now()))
       on conflict (id) do update set
         subject_id = excluded.subject_id,
         title = excluded.title,
         description = excluded.description,
         min_age = excluded.min_age,
         max_age = excluded.max_age,
         min_grade = excluded.min_grade,
         max_grade = excluded.max_grade,
         reinforce = excluded.reinforce`,
      [
        topic.id,
        topic.subjectId ?? 'reading',
        topic.title ?? '',
        topic.description ?? '',
        asInt(topic.minAge, 3),
        asInt(topic.maxAge, 12),
        asInt(topic.minGrade, 0),
        asInt(topic.maxGrade, 6),
        Boolean(topic.reinforce),
        asTimestamp(topic.createdAt),
      ],
    )
  }
  await client.query('delete from public.study_topics where not (id = any($1::text[]))', [
    topics.map((topic) => topic.id).filter(Boolean),
  ])

  const words = state.contentBank?.words ?? []
  for (const word of words) {
    if (!word?.id) continue
    await client.query(
      `insert into public.admin_words (
         id, word, image, clue, distractors, min_age, max_age, min_grade, max_grade, created_at
       ) values ($1, $2, $3, $4, $5, $6, $7, $8, $9, coalesce($10::timestamptz, now()))
       on conflict (id) do update set
         word = excluded.word,
         image = excluded.image,
         clue = excluded.clue,
         distractors = excluded.distractors,
         min_age = excluded.min_age,
         max_age = excluded.max_age,
         min_grade = excluded.min_grade,
         max_grade = excluded.max_grade`,
      [
        word.id,
        word.word ?? '',
        shortSrc(word.image),
        word.clue ?? null,
        Array.isArray(word.distractors) ? word.distractors : [],
        asInt(word.minAge, 3),
        asInt(word.maxAge, 12),
        asInt(word.minGrade, 0),
        asInt(word.maxGrade, 6),
        asTimestamp(word.createdAt),
      ],
    )
  }
  await client.query('delete from public.admin_words where not (id = any($1::text[]))', [
    words.map((word) => word.id).filter(Boolean),
  ])

  const passages = state.contentBank?.passages ?? []
  for (const passage of passages) {
    if (!passage?.id) continue
    await client.query(
      `insert into public.admin_passages (
         id, title, body, question, options, answer, min_age, max_age, min_grade, max_grade, created_at
       ) values ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, coalesce($11::timestamptz, now()))
       on conflict (id) do update set
         title = excluded.title,
         body = excluded.body,
         question = excluded.question,
         options = excluded.options,
         answer = excluded.answer,
         min_age = excluded.min_age,
         max_age = excluded.max_age,
         min_grade = excluded.min_grade,
         max_grade = excluded.max_grade`,
      [
        passage.id,
        passage.title ?? '',
        passage.text ?? '',
        passage.question ?? '',
        Array.isArray(passage.options) ? passage.options : [],
        passage.answer ?? '',
        asInt(passage.minAge, 3),
        asInt(passage.maxAge, 12),
        asInt(passage.minGrade, 0),
        asInt(passage.maxGrade, 6),
        asTimestamp(passage.createdAt),
      ],
    )
  }
  await client.query('delete from public.admin_passages where not (id = any($1::text[]))', [
    passages.map((passage) => passage.id).filter(Boolean),
  ])

  const avatars = state.contentBank?.avatarLibrary ?? []
  for (const avatar of avatars) {
    if (!avatar?.id) continue
    const src = shortSrc(avatar.src)
    if (!src) continue
    await client.query(
      `insert into public.avatar_library (id, label, src, created_at)
       values ($1, $2, $3, coalesce($4::timestamptz, now()))
       on conflict (id) do update set label = excluded.label, src = excluded.src`,
      [avatar.id, avatar.label ?? 'Foto', src, asTimestamp(avatar.createdAt)],
    )
  }
  await client.query('delete from public.avatar_library where not (id = any($1::text[]))', [
    avatars.map((avatar) => avatar.id).filter(Boolean),
  ])
}

async function writeState(state) {
  if (!state || typeof state !== 'object' || typeof state.profiles !== 'object') {
    throw new Error('Estado inválido')
  }
  const client = await pool.connect()
  try {
    await client.query('begin')
    await client.query(
      `insert into public.app_state (id, payload, updated_at)
       values ('default', $1::jsonb, now())
       on conflict (id) do update set payload = excluded.payload, updated_at = now()`,
      [JSON.stringify(state)],
    )
    await syncProjection(client, state)
    await client.query('commit')
  } catch (error) {
    await client.query('rollback')
    throw error
  } finally {
    client.release()
  }
}

function readBody(req) {
  return new Promise((resolve, reject) => {
    const chunks = []
    let size = 0
    req.on('data', (chunk) => {
      size += chunk.length
      if (size > MAX_BODY) {
        reject(Object.assign(new Error('Cuerpo demasiado grande'), { status: 413 }))
        req.destroy()
        return
      }
      chunks.push(chunk)
    })
    req.on('end', () => resolve(Buffer.concat(chunks).toString('utf8')))
    req.on('error', reject)
  })
}

async function serveStatic(req, res) {
  const url = new URL(req.url ?? '/', 'http://localhost')
  const requested = decodeURIComponent(url.pathname)
  const relative = requested === '/' ? 'index.html' : requested.replace(/^\/+/, '')
  const filePath = path.normalize(path.join(distDir, relative))
  if (!filePath.startsWith(distDir)) {
    sendJson(res, 400, { error: 'Ruta inválida' })
    return
  }

  try {
    const body = await readFile(filePath)
    const ext = path.extname(filePath)
    res.writeHead(200, { 'content-type': MIME[ext] ?? 'application/octet-stream' })
    res.end(body)
  } catch {
    try {
      const html = await readFile(path.join(distDir, 'index.html'))
      res.writeHead(200, { 'content-type': MIME['.html'] })
      res.end(html)
    } catch {
      sendJson(res, 404, { error: 'La app todavía no está construida' })
    }
  }
}

async function handleApi(req, res, pathname) {
  if (!pool) {
    sendJson(res, 503, { error: 'DATABASE_URL no está configurada' })
    return
  }

  if (req.method === 'GET' && pathname === '/api/health') {
    await pool.query('select 1')
    sendJson(res, 200, { ok: true, database: 'up' })
    return
  }

  if (req.method === 'GET' && pathname === '/api/state') {
    sendJson(res, 200, { state: await readState() })
    return
  }

  if (req.method === 'PUT' && pathname === '/api/state') {
    const raw = await readBody(req)
    const state = JSON.parse(raw)
    await writeState(state)
    sendJson(res, 200, { ok: true })
    return
  }

  sendJson(res, 404, { error: 'No encontrado' })
}

const server = createServer((req, res) => {
  const url = new URL(req.url ?? '/', 'http://localhost')
  const pathname = url.pathname
  const task = pathname.startsWith('/api/')
    ? handleApi(req, res, pathname)
    : serveStatic(req, res)

  task.catch((error) => {
    if (res.headersSent) return
    const status = error.status ?? 500
    sendJson(res, status, { error: error.message || 'Error del servidor' })
  })
})

await ensureSchema().catch((error) => {
  console.error('No se pudo preparar la base de datos:', error)
})

server.listen(PORT, '0.0.0.0', () => {
  console.log(`Sorova Games escuchando en ${PORT}`)
})
