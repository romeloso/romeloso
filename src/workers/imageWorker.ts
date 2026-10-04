/// <reference lib="webworker" />
import type { ImageWorkerRequest, ImageWorkerResponse } from './imageTypes'

/** Web Worker: recorte centrado + compresión JPEG fuera del hilo principal. */

declare const self: DedicatedWorkerGlobalScope

self.onmessage = async (event: MessageEvent<ImageWorkerRequest>) => {
  const { id, buffer, mimeType, maxSize, quality } = event.data
  try {
    if (!mimeType.startsWith('image/')) {
      throw new Error('El archivo debe ser una imagen')
    }
    if (buffer.byteLength > 8 * 1024 * 1024) {
      throw new Error('La imagen es demasiado grande (máx. 8 MB)')
    }

    const blob = new Blob([buffer], { type: mimeType })
    const bitmap = await createImageBitmap(blob)
    const side = Math.min(bitmap.width, bitmap.height)
    const sx = Math.floor((bitmap.width - side) / 2)
    const sy = Math.floor((bitmap.height - side) / 2)

    const canvas = new OffscreenCanvas(maxSize, maxSize)
    const ctx = canvas.getContext('2d')
    if (!ctx) {
      bitmap.close()
      throw new Error('No se pudo procesar la imagen')
    }

    ctx.imageSmoothingEnabled = true
    ctx.imageSmoothingQuality = 'high'
    ctx.drawImage(bitmap, sx, sy, side, side, 0, 0, maxSize, maxSize)
    bitmap.close()

    const outBlob = await canvas.convertToBlob({ type: 'image/jpeg', quality })
    const dataUrl = await blobToDataUrl(outBlob)

    const response: ImageWorkerResponse = { id, ok: true, dataUrl }
    self.postMessage(response)
  } catch (error) {
    const response: ImageWorkerResponse = {
      id,
      ok: false,
      error: error instanceof Error ? error.message : 'Error al procesar imagen',
    }
    self.postMessage(response)
  }
}

function blobToDataUrl(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(String(reader.result))
    reader.onerror = () => reject(new Error('No se pudo leer la imagen'))
    reader.readAsDataURL(blob)
  })
}
