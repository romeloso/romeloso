import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { ProfileCard } from './ProfileCard'
import type { ChildProfile } from '@/types'

const profile: ChildProfile = {
  id: 'mateo',
  name: 'Mateo',
  avatar: '⭐',
  avatarImage: '/avatars/photo/isabella-1.jpg',
  accent: '#0f9b8e',
  birthDate: '2019-03-15',
  level: 2,
  xp: 10,
  points: 0,
  coins: 5,
  streakDays: 1,
  lastPlayedDate: null,
  achievements: [],
  createdAt: '2026-01-01',
  updatedAt: '2026-01-01',
}

describe('ProfileCard', () => {
  it('muestra nombre, nivel y edad', () => {
    render(<ProfileCard profile={profile} onSelect={() => undefined} />)
    expect(screen.getByText('Mateo')).toBeInTheDocument()
    expect(screen.getByText(/Nivel 2/i)).toBeInTheDocument()
    expect(screen.getByText(/años/i)).toBeInTheDocument()
  })

  it('dispara onSelect', async () => {
    const user = userEvent.setup()
    const onSelect = vi.fn()
    render(<ProfileCard profile={profile} onSelect={onSelect} />)
    await user.click(screen.getByRole('button'))
    expect(onSelect).toHaveBeenCalledOnce()
  })
})
