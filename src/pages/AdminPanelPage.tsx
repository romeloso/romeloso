import { useMemo, useState } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import { TopBar } from '@/components/layout/TopBar'
import { Avatar } from '@/components/profile/Avatar'
import { AvatarUploader } from '@/components/profile/AvatarUploader'
import { Button } from '@/components/ui/Button'
import { PageShell } from '@/components/ui/PageShell'
import { ProgressBar } from '@/components/ui/ProgressBar'
import { useApp } from '@/context/AppContext'
import { overallGameCompletion } from '@/domain/progress'
import { formatNumber, formatPercent } from '@/lib/format'
import type { ReadingStats, TypingStats } from '@/types'

type Tab = 'progress' | 'material'

export function AdminPanelPage() {
  const navigate = useNavigate()
  const {
    isAdmin,
    state,
    logoutAdmin,
    addWordMaterial,
    addPassageMaterial,
    removeWordMaterial,
    removePassageMaterial,
    getGameProgress,
    updateProfileAvatar,
  } = useApp()
  const [tab, setTab] = useState<Tab>('progress')
  const [editingAvatarId, setEditingAvatarId] = useState<string | null>(null)

  const [word, setWord] = useState('')
  const [clue, setClue] = useState('')
  const [image, setImage] = useState('📚')
  const [distractors, setDistractors] = useState('CASA, MESA')
  const [savedMessage, setSavedMessage] = useState<string | null>(null)

  const [title, setTitle] = useState('')
  const [text, setText] = useState('')
  const [question, setQuestion] = useState('')
  const [options, setOptions] = useState('Toby, Max, Leo')
  const [answer, setAnswer] = useState('Toby')

  const profiles = useMemo(() => Object.values(state.profiles), [state.profiles])

  if (!isAdmin) return <Navigate to="/" replace />

  return (
    <PageShell wide>
      <TopBar backTo="/" backLabel="Inicio" />
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-4xl font-bold">Panel Administrador</h1>
          <p className="font-semibold text-ink-soft">
            Progreso de las niñas y material para el juego de lectura
          </p>
        </div>
        <Button
          variant="secondary"
          onClick={() => {
            logoutAdmin()
            navigate('/')
          }}
        >
          Cerrar sesión admin
        </Button>
      </div>

      <div className="mb-6 flex flex-wrap gap-2">
        <Button variant={tab === 'progress' ? 'primary' : 'secondary'} onClick={() => setTab('progress')}>
          Progreso
        </Button>
        <Button variant={tab === 'material' ? 'primary' : 'secondary'} onClick={() => setTab('material')}>
          Material
        </Button>
      </div>

      {savedMessage ? (
        <p className="mb-4 rounded-2xl bg-mint/60 px-4 py-3 font-bold text-ink">{savedMessage}</p>
      ) : null}

      {tab === 'progress' ? (
        <div className="grid gap-4 lg:grid-cols-3">
          {profiles.map((profile) => {
            const reading = getGameProgress('reading', profile.id)
            const typing = getGameProgress('typing', profile.id)
            const readingStats = reading?.stats as ReadingStats | undefined
            const typingStats = typing?.stats as TypingStats | undefined

            return (
              <article key={profile.id} className="rounded-[1.75rem] bg-white/90 p-5 ring-1 ring-ink/5">
                {editingAvatarId === profile.id ? (
                  <div className="mb-4">
                    <div className="mb-3 flex items-center justify-between gap-2">
                      <h2 className="font-display text-2xl font-bold">Foto de {profile.name}</h2>
                      <Button size="md" variant="ghost" onClick={() => setEditingAvatarId(null)}>
                        Cerrar
                      </Button>
                    </div>
                    <AvatarUploader
                      profile={profile}
                      compact
                      onSave={(avatarImage) => {
                        updateProfileAvatar(profile.id, avatarImage)
                        setEditingAvatarId(null)
                      }}
                    />
                  </div>
                ) : (
                  <div className="flex items-center gap-3">
                    <Avatar
                      name={profile.name}
                      src={profile.avatarImage}
                      accent={profile.accent}
                      size="md"
                      focus="center"
                    />
                    <div>
                      <h2 className="font-display text-2xl font-bold">{profile.name}</h2>
                      <p className="font-semibold text-ink-soft">Nivel {profile.level}</p>
                      <Button
                        size="md"
                        variant="secondary"
                        className="mt-2 !min-h-10"
                        onClick={() => setEditingAvatarId(profile.id)}
                      >
                        Cambiar foto
                      </Button>
                    </div>
                  </div>
                )}

                <div className="mt-4 space-y-2 text-sm font-semibold text-ink-soft">
                  <p>⭐ XP: {formatNumber(profile.xp)}</p>
                  <p>🪙 Monedas: {formatNumber(profile.coins)}</p>
                  <p>🔥 Racha: {profile.streakDays} días</p>
                  <p>🏆 Logros: {profile.achievements.length}</p>
                </div>

                <div className="mt-4 space-y-3">
                  <div>
                    <p className="mb-1 font-bold">📚 Lectura</p>
                    <ProgressBar
                      value={reading ? overallGameCompletion(reading) : 0}
                      colorClassName="bg-coral"
                    />
                    <p className="mt-1 text-sm font-semibold text-ink-soft">
                      Palabras: {readingStats?.wordsLearned.length ?? 0} · Lecciones:{' '}
                      {readingStats?.lessonsCompleted ?? 0}
                    </p>
                  </div>
                  <div>
                    <p className="mb-1 font-bold">⌨️ Tecleo</p>
                    <ProgressBar
                      value={typing ? overallGameCompletion(typing) : 0}
                      colorClassName="bg-teal"
                    />
                    <p className="mt-1 text-sm font-semibold text-ink-soft">
                      Velocidad: {Math.round(typingStats?.bestWpm ?? 0)} PPM · Precisión:{' '}
                      {formatPercent(typingStats?.bestAccuracy ?? 0)}
                    </p>
                  </div>
                </div>
              </article>
            )
          })}
        </div>
      ) : (
        <div className="grid gap-6 lg:grid-cols-2">
          <section className="rounded-[1.75rem] bg-white/90 p-5 ring-1 ring-ink/5">
            <h2 className="font-display text-2xl font-bold">Agregar palabra / quiz</h2>
            <p className="mt-1 text-sm font-semibold text-ink-soft">
              Se integra automáticamente en Quiz y Práctica de lectura.
            </p>
            <div className="mt-4 space-y-3">
              <input
                className="w-full rounded-xl border-2 border-ink/10 px-3 py-2 font-bold"
                placeholder="Palabra (ej: MARIPOSA)"
                value={word}
                onChange={(e) => setWord(e.target.value)}
              />
              <input
                className="w-full rounded-xl border-2 border-ink/10 px-3 py-2 font-bold"
                placeholder="Pista / definición"
                value={clue}
                onChange={(e) => setClue(e.target.value)}
              />
              <input
                className="w-full rounded-xl border-2 border-ink/10 px-3 py-2 font-bold"
                placeholder="Emoji o imagen (ej: 🦋)"
                value={image}
                onChange={(e) => setImage(e.target.value)}
              />
              <input
                className="w-full rounded-xl border-2 border-ink/10 px-3 py-2 font-bold"
                placeholder="Distractores separados por coma"
                value={distractors}
                onChange={(e) => setDistractors(e.target.value)}
              />
              <Button
                onClick={() => {
                  if (!word.trim()) return
                  addWordMaterial({
                    word,
                    clue,
                    image,
                    distractors: distractors.split(',').map((item) => item.trim()),
                  })
                  setWord('')
                  setClue('')
                  setSavedMessage('Palabra agregada. Ya está disponible en el juego de lectura.')
                }}
              >
                Guardar palabra
              </Button>
            </div>

            <ul className="mt-5 space-y-2">
              {state.contentBank.words.map((item) => (
                <li
                  key={item.id}
                  className="flex items-center justify-between gap-2 rounded-xl bg-sand/70 px-3 py-2"
                >
                  <span className="font-bold">
                    {item.image} {item.word}
                  </span>
                  <Button variant="ghost" size="md" onClick={() => removeWordMaterial(item.id)}>
                    Quitar
                  </Button>
                </li>
              ))}
            </ul>
          </section>

          <section className="rounded-[1.75rem] bg-white/90 p-5 ring-1 ring-ink/5">
            <h2 className="font-display text-2xl font-bold">Agregar historia / pregunta</h2>
            <p className="mt-1 text-sm font-semibold text-ink-soft">
              Se integra en el nivel de Historias.
            </p>
            <div className="mt-4 space-y-3">
              <input
                className="w-full rounded-xl border-2 border-ink/10 px-3 py-2 font-bold"
                placeholder="Título"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
              <textarea
                className="min-h-28 w-full rounded-xl border-2 border-ink/10 px-3 py-2 font-bold"
                placeholder="Texto de la historia"
                value={text}
                onChange={(e) => setText(e.target.value)}
              />
              <input
                className="w-full rounded-xl border-2 border-ink/10 px-3 py-2 font-bold"
                placeholder="Pregunta"
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
              />
              <input
                className="w-full rounded-xl border-2 border-ink/10 px-3 py-2 font-bold"
                placeholder="Opciones separadas por coma"
                value={options}
                onChange={(e) => setOptions(e.target.value)}
              />
              <input
                className="w-full rounded-xl border-2 border-ink/10 px-3 py-2 font-bold"
                placeholder="Respuesta correcta"
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
              />
              <Button
                onClick={() => {
                  if (!title.trim() || !text.trim() || !question.trim() || !answer.trim()) return
                  addPassageMaterial({
                    title,
                    text,
                    question,
                    options: options.split(',').map((item) => item.trim()),
                    answer,
                  })
                  setTitle('')
                  setText('')
                  setQuestion('')
                  setSavedMessage('Historia agregada. Ya aparece en el módulo de Historias.')
                }}
              >
                Guardar historia
              </Button>
            </div>

            <ul className="mt-5 space-y-2">
              {state.contentBank.passages.map((item) => (
                <li
                  key={item.id}
                  className="flex items-center justify-between gap-2 rounded-xl bg-sand/70 px-3 py-2"
                >
                  <span className="font-bold">{item.title}</span>
                  <Button variant="ghost" size="md" onClick={() => removePassageMaterial(item.id)}>
                    Quitar
                  </Button>
                </li>
              ))}
            </ul>
          </section>
        </div>
      )}
    </PageShell>
  )
}
