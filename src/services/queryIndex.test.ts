import { describe, expect, it } from 'vitest'
import { buildContentQueryIndex, indexedTopicsForAge } from './queryIndex'
import type { ContentBank } from '@/types'

const bank: ContentBank = {
  words: [
    {
      id: 'w1',
      word: 'SOL',
      distractors: ['LUN'],
      minAge: 3,
      maxAge: 6,
      createdAt: '2026-01-01',
    },
  ],
  passages: [],
  topics: [
    {
      id: 't1',
      subjectId: 'reading',
      title: 'Vocales',
      description: 'A E I',
      minAge: 3,
      maxAge: 7,
      reinforce: true,
      createdAt: '2026-01-01',
    },
    {
      id: 't2',
      subjectId: 'math',
      title: 'Sumas',
      description: '1+1',
      minAge: 8,
      maxAge: 12,
      reinforce: false,
      createdAt: '2026-01-01',
    },
  ],
  avatarLibrary: [],
}

describe('queryIndex', () => {
  it('indexa topics por edad y materia', () => {
    const index = buildContentQueryIndex(bank)
    expect(index.topicIdsByAge.get(5)).toContain('t1')
    expect(index.topicIdsByAge.get(5)).not.toContain('t2')
    expect(indexedTopicsForAge(bank, index, 5, 'reading')).toHaveLength(1)
    expect(indexedTopicsForAge(bank, index, 9, 'math')[0]?.title).toBe('Sumas')
  })
})
