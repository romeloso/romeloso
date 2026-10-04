import '@testing-library/jest-dom/vitest'
import { afterEach } from 'vitest'
import { cleanup } from '@testing-library/react'
import { resetRateLimits } from '@/lib/rateLimit'
import { invalidateContentCaches } from '@/services/cache/contentCache'

afterEach(() => {
  cleanup()
  resetRateLimits()
  invalidateContentCaches()
  localStorage.clear()
})
