/** Redimensiona y comprime una imagen para guardarla en el perfil (localStorage). */
export async function fileToAvatarDataUrl(
  file: File,
  maxSize = 512,
  quality = 0.85,
): Promise<string> {
  if (!file.type.startsWith('image/')) {
    throw new Error('El archivo debe ser una imagen')
  }

  if (file.size > 8 * 1024 * 1024) {
    throw new Error('La imagen es demasiado grande (máx. 8 MB)')
  }

  const bitmap = await createImageBitmap(file)
  const side = Math.min(bitmap.width, bitmap.height)
  const sx = Math.floor((bitmap.width - side) / 2)
  const sy = Math.floor((bitmap.height - side) / 2)

  const canvas = document.createElement('canvas')
  canvas.width = maxSize
  canvas.height = maxSize
  const ctx = canvas.getContext('2d')
  if (!ctx) {
    bitmap.close()
    throw new Error('No se pudo procesar la imagen')
  }

  ctx.imageSmoothingEnabled = true
  ctx.imageSmoothingQuality = 'high'
  ctx.drawImage(bitmap, sx, sy, side, side, 0, 0, maxSize, maxSize)
  bitmap.close()

  return canvas.toDataURL('image/jpeg', quality)
}
