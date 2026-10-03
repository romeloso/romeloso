/** Opciones de avatar por niña: fotos reales + caricatura. */
export const AVATAR_OPTIONS: Record<
  string,
  { id: string; label: string; src: string }[]
> = {
  isabella: [
    { id: 'photo-1', label: 'Foto 1', src: '/avatars/photo/isabella-1.jpg' },
    { id: 'photo-2', label: 'Foto 2', src: '/avatars/photo/isabella-2.jpg' },
    { id: 'photo-3', label: 'Foto 3', src: '/avatars/photo/isabella-3.jpg' },
    { id: 'cartoon', label: 'Caricatura', src: '/avatars/cartoon/isabella.png' },
  ],
  sophia: [
    { id: 'photo-1', label: 'Foto 1', src: '/avatars/photo/sophia-1.jpg' },
    { id: 'photo-2', label: 'Foto 2', src: '/avatars/photo/sophia-2.jpg' },
    { id: 'photo-3', label: 'Foto 3', src: '/avatars/photo/sophia-3.jpg' },
    { id: 'cartoon', label: 'Caricatura', src: '/avatars/cartoon/sophia.png' },
  ],
  valentina: [
    { id: 'photo-1', label: 'Foto 1', src: '/avatars/photo/valentina-1.jpg' },
    { id: 'photo-2', label: 'Foto 2', src: '/avatars/photo/valentina-2.jpg' },
    { id: 'photo-3', label: 'Foto 3', src: '/avatars/photo/valentina-3.jpg' },
    { id: 'cartoon', label: 'Caricatura', src: '/avatars/cartoon/valentina.png' },
  ],
}

export function defaultAvatarFor(profileId: string): string {
  return AVATAR_OPTIONS[profileId]?.[0]?.src ?? `/avatars/photo/${profileId}-1.jpg`
}

/** Semilla inicial de la galería central (fotos + caricaturas). */
export function seedAvatarLibraryItems(): { label: string; src: string }[] {
  const items: { label: string; src: string }[] = []
  for (const [profileId, options] of Object.entries(AVATAR_OPTIONS)) {
    const name = profileId.charAt(0).toUpperCase() + profileId.slice(1)
    for (const option of options) {
      items.push({
        label: `${name} · ${option.label}`,
        src: option.src,
      })
    }
  }
  return items
}
