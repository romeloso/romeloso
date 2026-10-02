import { useEffect, useMemo, useState } from 'react'
import { Button } from '@/components/ui/Button'
import type {
  Activity,
  ActivityAttemptResult,
  LetterChoiceActivity,
  LetterFromImageActivity,
  SyllableBuildActivity,
  WordBuildActivity,
  WordSelectActivity,
} from '@/types'

type Resolve = (result: Omit<ActivityAttemptResult, 'activityId' | 'attempts'>) => void

function ChoiceGrid({
  options,
  onPick,
}: {
  options: { id: string; label: string; value: string }[]
  onPick: (value: string) => void
}) {
  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
      {options.map((option) => (
        <Button
          key={option.id}
          variant="sunny"
          size="xl"
          className="w-full font-display text-3xl"
          onClick={() => onPick(option.value)}
        >
          {option.label}
        </Button>
      ))}
    </div>
  )
}

function LetterChoiceView({
  activity,
  onResolved,
}: {
  activity: LetterChoiceActivity
  onResolved: Resolve
}) {
  const started = useMemo(() => Date.now(), [activity.id])

  return (
    <div className="space-y-6 text-center">
      <p className="text-lg font-bold text-ink-soft">{activity.prompt}</p>
      <div className="mx-auto grid h-40 w-40 place-items-center rounded-[2rem] bg-coral/15 font-display text-8xl font-bold text-coral">
        {activity.letter}
      </div>
      <ChoiceGrid
        options={activity.options}
        onPick={(value) =>
          onResolved({
            correct: value === activity.answer,
            timeMs: Date.now() - started,
          })
        }
      />
    </div>
  )
}

function LetterFromImageView({
  activity,
  onResolved,
}: {
  activity: LetterFromImageActivity
  onResolved: Resolve
}) {
  const started = useMemo(() => Date.now(), [activity.id])

  return (
    <div className="space-y-6 text-center">
      <p className="text-lg font-bold text-ink-soft">{activity.prompt}</p>
      <div className="mx-auto grid h-36 w-36 place-items-center rounded-[2rem] bg-sky/20 text-7xl">
        <span aria-hidden="true">{activity.image}</span>
      </div>
      {activity.wordHint ? (
        <p className="text-sm font-semibold text-ink-soft">Pista: {activity.wordHint}</p>
      ) : null}
      <ChoiceGrid
        options={activity.options}
        onPick={(value) =>
          onResolved({
            correct: value === activity.answer,
            timeMs: Date.now() - started,
          })
        }
      />
    </div>
  )
}

function SyllableBuildView({
  activity,
  onResolved,
}: {
  activity: SyllableBuildActivity
  onResolved: Resolve
}) {
  const started = useMemo(() => Date.now(), [activity.id])

  return (
    <div className="space-y-6 text-center">
      <p className="text-lg font-bold text-ink-soft">{activity.prompt}</p>
      <div className="flex flex-wrap items-center justify-center gap-3 font-display text-4xl font-bold">
        {activity.parts.map((part, index) => (
          <span key={`${part}-${index}`} className="rounded-2xl bg-mint/50 px-4 py-2">
            {part}
          </span>
        ))}
        <span className="text-ink-soft">=</span>
        <span className="rounded-2xl bg-sun/60 px-4 py-2">?</span>
      </div>
      <ChoiceGrid
        options={activity.options}
        onPick={(value) =>
          onResolved({
            correct: value === activity.answer,
            timeMs: Date.now() - started,
          })
        }
      />
    </div>
  )
}

function WordSelectView({
  activity,
  onResolved,
}: {
  activity: WordSelectActivity
  onResolved: Resolve
}) {
  const started = useMemo(() => Date.now(), [activity.id])

  return (
    <div className="space-y-6 text-center">
      <p className="text-lg font-bold text-ink-soft">{activity.prompt}</p>
      {activity.image ? (
        <div className="mx-auto grid h-28 w-28 place-items-center rounded-[2rem] bg-sand text-6xl">
          <span aria-hidden="true">{activity.image}</span>
        </div>
      ) : null}
      <p className="font-display text-5xl font-bold tracking-wide text-teal">{activity.word}</p>
      <ChoiceGrid
        options={activity.options}
        onPick={(value) =>
          onResolved({
            correct: value === activity.answer,
            timeMs: Date.now() - started,
          })
        }
      />
    </div>
  )
}

function WordBuildView({
  activity,
  onResolved,
}: {
  activity: WordBuildActivity
  onResolved: Resolve
}) {
  const started = useMemo(() => Date.now(), [activity.id])
  const [pool, setPool] = useState(() =>
    activity.scrambled.map((letter, index) => ({ id: `${letter}-${index}`, letter })),
  )
  const [built, setBuilt] = useState<{ id: string; letter: string }[]>([])

  const reset = () => {
    setPool(activity.scrambled.map((letter, index) => ({ id: `${letter}-${index}`, letter })))
    setBuilt([])
  }

  useEffect(() => {
    setPool(activity.scrambled.map((letter, index) => ({ id: `${letter}-${index}`, letter })))
    setBuilt([])
  }, [activity.id, activity.scrambled])

  const pushLetter = (item: { id: string; letter: string }) => {
    setPool((current) => current.filter((entry) => entry.id !== item.id))
    setBuilt((current) => [...current, item])
  }

  const popLetter = (item: { id: string; letter: string }) => {
    setBuilt((current) => current.filter((entry) => entry.id !== item.id))
    setPool((current) => [...current, item])
  }

  const submit = () => {
    const value = built.map((item) => item.letter).join('')
    const normalizedValue = value.normalize('NFC')
    const normalizedAnswer = activity.word.normalize('NFC')
    onResolved({
      correct: normalizedValue === normalizedAnswer,
      timeMs: Date.now() - started,
    })
    if (normalizedValue !== normalizedAnswer) {
      // keep letters for retry; optional reshuffle after wrong
    }
  }

  return (
    <div className="space-y-6 text-center">
      <p className="text-lg font-bold text-ink-soft">{activity.prompt}</p>
      {activity.image ? <p className="text-6xl">{activity.image}</p> : null}
      <div className="mx-auto flex min-h-20 flex-wrap items-center justify-center gap-2 rounded-3xl bg-cream p-4 ring-1 ring-ink/10">
        {built.length === 0 ? (
          <span className="font-semibold text-ink-soft">Toca las letras para armar la palabra</span>
        ) : (
          built.map((item) => (
            <button
              key={item.id}
              type="button"
              className="rounded-2xl bg-teal px-4 py-3 font-display text-3xl font-bold text-white"
              onClick={() => popLetter(item)}
            >
              {item.letter}
            </button>
          ))
        )}
      </div>
      <div className="flex flex-wrap justify-center gap-2">
        {pool.map((item) => (
          <button
            key={item.id}
            type="button"
            className="rounded-2xl bg-sun px-4 py-3 font-display text-3xl font-bold text-ink"
            onClick={() => pushLetter(item)}
          >
            {item.letter}
          </button>
        ))}
      </div>
      <div className="flex flex-wrap justify-center gap-3">
        <Button variant="secondary" onClick={reset}>
          Reiniciar
        </Button>
        <Button onClick={submit} disabled={built.length === 0}>
          Comprobar
        </Button>
      </div>
    </div>
  )
}

export function ReadingActivityView({
  activity,
  onResolved,
}: {
  activity: Activity
  onResolved: Resolve
}) {
  switch (activity.kind) {
    case 'letter_choice':
      return <LetterChoiceView activity={activity} onResolved={onResolved} />
    case 'letter_from_image':
      return <LetterFromImageView activity={activity} onResolved={onResolved} />
    case 'syllable_build':
      return <SyllableBuildView activity={activity} onResolved={onResolved} />
    case 'word_select':
      return <WordSelectView activity={activity} onResolved={onResolved} />
    case 'word_build':
      return <WordBuildView key={activity.id} activity={activity} onResolved={onResolved} />
    default:
      return <p>Esta actividad aún no está disponible.</p>
  }
}
