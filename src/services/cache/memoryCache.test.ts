import { describe, expect, it } from 'vitest'
import { MemoryCache, contentBankFingerprint } from './memoryCache'

describe('MemoryCache', () => {
  it('guarda y recupera valores', () => {
    const cache = new MemoryCache<string>({ ttlMs: 1000 })
    cache.set('a', 'hola')
    expect(cache.get('a')).toBe('hola')
  })

  it('expira por TTL', () => {
    const cache = new MemoryCache<number>({ ttlMs: 10 })
    const now = 1000
    cache.set('x', 1, 10, now)
    expect(cache.get('x', now + 5)).toBe(1)
    expect(cache.get('x', now + 20)).toBeUndefined()
  })

  it('respeta maxEntries (LRU)', () => {
    const cache = new MemoryCache<number>({ maxEntries: 2, ttlMs: 1000 })
    cache.set('a', 1)
    cache.set('b', 2)
    cache.set('c', 3)
    expect(cache.get('a')).toBeUndefined()
    expect(cache.get('b')).toBe(2)
    expect(cache.get('c')).toBe(3)
  })

  it('firma content bank', () => {
    const fp = contentBankFingerprint({
      words: [{ id: 'w1' }],
      passages: [],
      topics: [{ id: 't1' }],
      avatarLibrary: [],
    })
    expect(fp).toContain('w1')
    expect(fp).toContain('t1')
  })
})
