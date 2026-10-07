import { Avatar } from '@/components/profile/Avatar'
import { ageFromBirthDate, formatAge } from '@/lib/age'
import { formatGrade } from '@/lib/grade'
import type { ChildProfile } from '@/types'
import { cn } from '@/lib/cn'

export function ProfileCard({
  profile,
  onSelect,
}: {
  profile: ChildProfile
  onSelect: () => void
}) {
  const age = ageFromBirthDate(profile.birthDate)

  return (
    <button
      type="button"
      onClick={onSelect}
      className={cn(
        'group flex w-full flex-col items-center gap-3 rounded-[2rem] bg-white/92 p-6 text-center shadow-[0_8px_0_rgba(30,58,138,0.12),0_16px_32px_rgba(59,130,246,0.14)] ring-2 ring-transparent transition hover:-translate-y-1 hover:ring-sky/40',
      )}
    >
      <Avatar
        name={profile.name}
        src={profile.avatarImage}
        accent={profile.accent}
        size="xl"
      />
      <span className="font-display text-3xl font-bold text-ink">{profile.name}</span>
      <span className="rounded-xl bg-sand px-3 py-1 text-sm font-bold text-ink-soft">
        Nivel {profile.level} · {formatGrade(profile.grade)}
      </span>
      <span className="text-xs font-semibold text-ink-soft">{formatAge(age)}</span>
    </button>
  )
}
