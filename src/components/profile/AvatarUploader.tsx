import { useRef, useState } from 'react'
import { Avatar } from '@/components/profile/Avatar'
import { Button } from '@/components/ui/Button'
import { PROFILE_SEEDS } from '@/config/profiles'
import { fileToAvatarDataUrl } from '@/lib/image'
import type { ChildProfile } from '@/types'

export function AvatarUploader({
  profile,
  onSave,
  compact = false,
}: {
  profile: ChildProfile
  onSave: (dataUrl: string) => void
  compact?: boolean
}) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)

  const defaultSrc =
    PROFILE_SEEDS.find((seed) => seed.id === profile.id)?.avatarImage ?? profile.avatarImage
  const currentSrc = preview ?? profile.avatarImage
  const canReset = Boolean(preview) || profile.avatarImage !== defaultSrc

  const handleFile = async (file: File | undefined) => {
    if (!file) return
    setBusy(true)
    setError(null)
    try {
      const dataUrl = await fileToAvatarDataUrl(file)
      setPreview(dataUrl)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No se pudo cargar la imagen')
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className={compact ? 'flex flex-col items-start gap-3' : 'flex flex-col items-center gap-4'}>
      <Avatar
        name={profile.name}
        src={currentSrc}
        accent={profile.accent}
        size={compact ? 'lg' : 'xl'}
        focus="center"
      />

      <input
        ref={inputRef}
        type="file"
        accept="image/png,image/jpeg,image/webp,image/gif"
        className="sr-only"
        onChange={(event) => {
          const file = event.target.files?.[0]
          void handleFile(file)
          event.target.value = ''
        }}
      />

      <div className="flex flex-wrap gap-2">
        <Button
          size="md"
          variant="secondary"
          disabled={busy}
          onClick={() => inputRef.current?.click()}
        >
          {busy ? 'Cargando…' : 'Cambiar foto'}
        </Button>
        {preview ? (
          <Button
            size="md"
            onClick={() => {
              onSave(preview)
              setPreview(null)
            }}
          >
            Guardar foto
          </Button>
        ) : null}
        {canReset ? (
          <Button
            size="md"
            variant="ghost"
            className="bg-white/80 ring-1 ring-ink/10"
            onClick={() => {
              setPreview(null)
              onSave(defaultSrc)
            }}
          >
            Usar original
          </Button>
        ) : null}
      </div>

      {error ? <p className="text-sm font-bold text-coral">{error}</p> : null}
      <p className="text-xs font-semibold text-ink-soft">
        PNG, JPG o WEBP. Se centra automáticamente el rostro.
      </p>
    </div>
  )
}
