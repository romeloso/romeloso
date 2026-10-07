import { useMemo } from 'react'
import { Button } from '@/components/ui/Button'
import type { Activity, ActivityAttemptResult, MathChoiceActivity } from '@/types'

type Resolve = (result: Omit<ActivityAttemptResult, 'activityId' | 'attempts'>) => void

function MathChoiceView({
  activity,
  onResolved,
}: {
  activity: MathChoiceActivity
  onResolved: Resolve
}) {
  const started = useMemo(() => Date.now(), [activity.id])

  return (
    <div className="space-y-6 text-center">
      <p className="text-lg font-bold text-ink-soft">{activity.prompt}</p>
      <div className="mx-auto grid min-h-32 place-items-center rounded-[2rem] bg-amber/15 px-6 py-8 font-display text-5xl font-bold text-amber sm:text-6xl">
        {activity.expression}
      </div>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        {activity.options.map((option) => (
          <Button
            key={option.id}
            variant="sunny"
            size="xl"
            className="w-full font-display text-3xl"
            onClick={() =>
              onResolved({
                correct: option.value === activity.answer,
                timeMs: Date.now() - started,
              })
            }
          >
            {option.label}
          </Button>
        ))}
      </div>
    </div>
  )
}

export function MathActivityView({
  activity,
  onResolved,
}: {
  activity: Activity
  onResolved: Resolve
}) {
  if (activity.kind === 'math_choice') {
    return <MathChoiceView key={activity.id} activity={activity} onResolved={onResolved} />
  }
  return <p>Esta actividad de matemáticas aún no está disponible.</p>
}
