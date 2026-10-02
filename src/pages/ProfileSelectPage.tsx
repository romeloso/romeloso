import { useNavigate } from 'react-router-dom'
import { TopBar } from '@/components/layout/TopBar'
import { ProfileCard } from '@/components/profile/ProfileCard'
import { Button } from '@/components/ui/Button'
import { PageShell } from '@/components/ui/PageShell'
import { APP_CONFIG } from '@/config/app'
import { useApp } from '@/context/AppContext'

export function ProfileSelectPage() {
  const navigate = useNavigate()
  const { state, selectProfile, ready } = useApp()
  const profiles = Object.values(state.profiles)

  if (!ready) {
    return (
      <PageShell>
        <p className="font-display text-2xl font-bold">Cargando {APP_CONFIG.name}...</p>
      </PageShell>
    )
  }

  return (
    <PageShell wide>
      <TopBar />
      <section className="mb-8 text-center">
        <h1 className="font-display text-4xl font-bold text-ink sm:text-5xl text-balance">
          ¿Quién va a jugar hoy?
        </h1>
        <p className="mx-auto mt-3 max-w-xl text-lg font-semibold text-ink-soft">
          Elige tu perfil para guardar tu aventura, tus estrellas y tus monedas.
        </p>
      </section>
      <div className="grid gap-5 sm:grid-cols-3">
        {profiles.map((profile) => (
          <ProfileCard
            key={profile.id}
            profile={profile}
            onSelect={() => {
              selectProfile(profile.id)
              navigate('/dashboard')
            }}
          />
        ))}
      </div>

      <div className="mt-10 flex justify-center">
        <Button variant="secondary" onClick={() => navigate('/admin')}>
          Acceso Administrador
        </Button>
      </div>
    </PageShell>
  )
}
