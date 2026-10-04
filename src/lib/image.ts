import type { ImageWorkerRequest, ImageWorkerResponse } from '@/workers/imageTypes'

let worker: Worker | null = null
let workerFailed = false

function getWorker(): Worker | null {
  if (workerFailed) return null
  if (worker) return worker
  try {
    worker = new Worker(new URL('../workers/imageWorker.ts', import.meta.url), {
      type: 'module',
    })
    return worker
  } catch {
    workerFailed = true
    return null
  }
}

function processOnMainThread(
  file: File,
  maxSize: number,
  quality: number,
): Promise<string> {
  return new Promise((resolve, reject) => {
    void (async () => {
      try {
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
        resolve(canvas.toDataURL('image/jpeg', quality))
      } catch (error) {
        reject(error instanceof Error ? error : new Error('No se pudo procesar la imagen'))
      }
    })()
  })
}

function processWithWorker(
  file: File,
  maxSize: number,
  quality: number,
  activeWorker: Worker,
): Promise<string> {
  return new Promise((resolve, reject) => {
    const id = crypto.randomUUID()
    const onMessage = (event: MessageEvent<ImageWorkerResponse>) => {
      if (event.data.id !== id) return
      activeWorker.removeEventListener('message', onMessage)
      activeWorker.removeEventListener('error', onError)
      if (event.data.ok && event.data.dataUrl) {
        resolve(event.data.dataUrl)
      } else {
        reject(new Error(event.data.error ?? 'No se pudo procesar la imagen'))
      }
    }
    const onError = () => {
      activeWorker.removeEventListener('message', onMessage)
      activeWorker.removeEventListener('error', onError)
      workerFailed = true
      worker = null
      void processOnMainThread(file, maxSize, quality).then(resolve, reject)
    }

    activeWorker.addEventListener('message', onMessage)
    activeWorker.addEventListener('error', onError)

    void file.arrayBuffer().then((buffer) => {
      const payload: ImageWorkerRequest = {
        id,
        buffer,
        mimeType: file.type,
        maxSize,
        quality,
      }
      activeWorker.postMessage(payload, [buffer])
    }, reject)
  })
}

/**
 * Redimensiona y comprime una imagen de forma asíncrona.
 * Usa Web Worker cuando está disponible para no bloquear la UI.
 */
export async function fileToAvatarDataUrl(
  file: File,
  maxSize = 512,
  quality = 0.85,
): Promise<string> {
  const activeWorker = getWorker()
  if (activeWorker) {
    return processWithWorker(file, maxSize, quality, activeWorker)
  }
  await new Promise<void>((resolve) => {
    if (typeof requestIdleCallback === 'function') {
      requestIdleCallback(() => resolve(), { timeout: 100 })
    } else {
      setTimeout(resolve, 0)
    }
  })
  return processOnMainThread(file, maxSize, quality)
}
