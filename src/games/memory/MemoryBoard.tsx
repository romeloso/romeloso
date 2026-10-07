import { useEffect, useMemo, useState } from 'react'
import { Button } from '@/components/ui/Button'
import { cn } from '@/lib/cn'
import type { MemoryRoundDef } from '@/data/games/memory/levels'

type Card = {
  id: string
  emoji: string
  matched: boolean
}

function shuffle<T>(items: T[]): T[] {
  const next = [...items]
  for (let i = next.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[next[i], next[j]] = [next[j]!, next[i]!]
  }
  return next
}

export function MemoryBoard({
  round,
  onComplete,
}: {
  round: MemoryRoundDef
  onComplete: (payload: { moves: number; pairs: number; durationMs: number }) => void
}) {
  const startedAt = useMemo(() => Date.now(), [round.id])
  const [cards, setCards] = useState<Card[]>(() =>
    shuffle(
      round.pairs.flatMap((emoji, index) => [
        { id: `${round.id}-${index}-a`, emoji, matched: false },
        { id: `${round.id}-${index}-b`, emoji, matched: false },
      ]),
    ),
  )
  const [flipped, setFlipped] = useState<string[]>([])
  const [moves, setMoves] = useState(0)
  const [locked, setLocked] = useState(false)
  const [done, setDone] = useState(false)

  useEffect(() => {
    setCards(
      shuffle(
        round.pairs.flatMap((emoji, index) => [
          { id: `${round.id}-${index}-a`, emoji, matched: false },
          { id: `${round.id}-${index}-b`, emoji, matched: false },
        ]),
      ),
    )
    setFlipped([])
    setMoves(0)
    setLocked(false)
    setDone(false)
  }, [round])

  useEffect(() => {
    if (flipped.length !== 2) return
    const [firstId, secondId] = flipped
    const first = cards.find((card) => card.id === firstId)
    const second = cards.find((card) => card.id === secondId)
    if (!first || !second) return

    setLocked(true)
    setMoves((value) => value + 1)

    const timer = window.setTimeout(() => {
      if (first.emoji === second.emoji) {
        setCards((prev) =>
          prev.map((card) =>
            card.id === first.id || card.id === second.id ? { ...card, matched: true } : card,
          ),
        )
      }
      setFlipped([])
      setLocked(false)
    }, 650)

    return () => window.clearTimeout(timer)
  }, [cards, flipped])

  useEffect(() => {
    if (done) return
    if (cards.length > 0 && cards.every((card) => card.matched)) {
      setDone(true)
      onComplete({
        moves,
        pairs: round.pairs.length,
        durationMs: Date.now() - startedAt,
      })
    }
  }, [cards, done, moves, onComplete, round.pairs.length, startedAt])

  const columns =
    cards.length <= 8 ? 'grid-cols-4' : cards.length <= 12 ? 'grid-cols-4 sm:grid-cols-6' : 'grid-cols-4 sm:grid-cols-8'

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-2 text-sm font-bold text-ink-soft">
        <span>Movimientos: {moves}</span>
        <span>
          Parejas: {cards.filter((card) => card.matched).length / 2}/{round.pairs.length}
        </span>
      </div>
      <div className={cn('grid gap-3', columns)}>
        {cards.map((card) => {
          const isOpen = card.matched || flipped.includes(card.id)
          return (
            <button
              key={card.id}
              type="button"
              disabled={locked || isOpen || done}
              onClick={() => {
                if (flipped.length >= 2 || flipped.includes(card.id)) return
                setFlipped((prev) => [...prev, card.id])
              }}
              className={cn(
                'aspect-square rounded-2xl text-3xl transition ring-2',
                isOpen
                  ? 'bg-white text-ink ring-violet/30'
                  : 'bg-violet text-white ring-transparent hover:brightness-110',
                card.matched && 'opacity-80',
              )}
              aria-label={isOpen ? card.emoji : 'Carta tapada'}
            >
              {isOpen ? card.emoji : '?'}
            </button>
          )
        })}
      </div>
      {done ? (
        <div className="rounded-2xl bg-mint/40 p-4 text-center font-bold text-teal-dark">
          ¡Completaste todas las parejas!
          <div className="mt-3">
            <Button disabled>Guardando resultado…</Button>
          </div>
        </div>
      ) : null}
    </div>
  )
}
