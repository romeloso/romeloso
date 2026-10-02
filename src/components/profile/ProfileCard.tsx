import type { ChildProfile } from '@/types'
import { cn } from '@/lib/cn'

export function ProfileCard({
  profile,
  onSelect,
}: {
  profile: ChildProfile
  onSelect: () => void
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className={cn(
        'group flex w-full flex-col items-center gap-3 rounded-[2rem] bg-white/85 p-6 text-center shadow-[0_10px_30px_rgba(31,42,55,0.08)] ring-2 ring-transparent transition hover:-translate-y-1 hover:ring-teal/40',
      )}
      style={{ borderColor: profile.accent }}
    >
      <span
        className="grid h-28 w-28 place-items-center rounded-full text-6xl shadow-inner ring-4 ring-white"
        style={{ backgroundColor: `${profile.accent}33` }}
        aria-hidden="true"
      >
        {profile.avatar}
      </span>
      <span className="font-display text-3xl font-bold text-ink">{profile.name}</span>
      <span className="rounded-xl bg-sand px-3 py-1 text-sm font-bold text-ink-soft">
        Nivel {profile.level}
      </span>
    </button>
  )
}
