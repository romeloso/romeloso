import { describe, expect, it } from 'vitest'
import { consumeRateLimit, peekRateLimit, resetRateLimits } from './rateLimit'

describe('rateLimit', () => {
  it('permite hasta el límite y luego bloquea', () => {
    resetRateLimits()
    for (let i = 0; i < 5; i += 1) {
      expect(consumeRateLimit('adminPin', 'test').allowed).toBe(true)
    }
    const blocked = consumeRateLimit('adminPin', 'test')
    expect(blocked.allowed).toBe(false)
    expect(blocked.retryAfterMs).toBeGreaterThan(0)
    expect(peekRateLimit('adminPin', 'test').allowed).toBe(false)
  })

  it('aísla subjects distintos', () => {
    resetRateLimits()
    expect(consumeRateLimit('addChild', 'a').allowed).toBe(true)
    expect(consumeRateLimit('addChild', 'b').allowed).toBe(true)
  })
})
