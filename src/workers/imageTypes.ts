export interface ImageWorkerRequest {
  id: string
  buffer: ArrayBuffer
  mimeType: string
  maxSize: number
  quality: number
}

export interface ImageWorkerResponse {
  id: string
  ok: boolean
  dataUrl?: string
  error?: string
}
