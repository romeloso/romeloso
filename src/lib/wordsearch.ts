export type WordDirection =
  | 'horizontal'
  | 'vertical'
  | 'diag-down'
  | 'diag-up'

export interface PlacedWord {
  word: string
  row: number
  col: number
  direction: WordDirection
  cells: Array<{ row: number; col: number }>
}

export interface WordSearchPuzzle {
  id: string
  title: string
  size: number
  words: string[]
  grid: string[][]
  placements: PlacedWord[]
}

const DIRECTIONS: Record<WordDirection, { dr: number; dc: number }> = {
  horizontal: { dr: 0, dc: 1 },
  vertical: { dr: 1, dc: 0 },
  'diag-down': { dr: 1, dc: 1 },
  'diag-up': { dr: -1, dc: 1 },
}

const LETTERS = 'ABCDEFGHIJKLMNÑOPQRSTUVWXYZ'

function normalizeWord(word: string) {
  return word
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toUpperCase()
    .replace(/[^A-ZÑ]/g, '')
}

function canPlace(
  grid: (string | null)[][],
  word: string,
  row: number,
  col: number,
  direction: WordDirection,
): boolean {
  const { dr, dc } = DIRECTIONS[direction]
  const size = grid.length
  for (let i = 0; i < word.length; i += 1) {
    const r = row + dr * i
    const c = col + dc * i
    if (r < 0 || c < 0 || r >= size || c >= size) return false
    const cell = grid[r]?.[c]
    if (cell != null && cell !== word[i]) return false
  }
  return true
}

function placeWord(
  grid: (string | null)[][],
  word: string,
  row: number,
  col: number,
  direction: WordDirection,
): Array<{ row: number; col: number }> {
  const { dr, dc } = DIRECTIONS[direction]
  const cells: Array<{ row: number; col: number }> = []
  for (let i = 0; i < word.length; i += 1) {
    const r = row + dr * i
    const c = col + dc * i
    grid[r]![c] = word[i]!
    cells.push({ row: r, col: c })
  }
  return cells
}

function randomInt(max: number) {
  return Math.floor(Math.random() * max)
}

/** Genera una sopa de letras con palabras en horizontal, vertical y diagonal. */
export function generateWordSearch(
  id: string,
  title: string,
  rawWords: string[],
  size = 10,
  seedAttempt = 40,
): WordSearchPuzzle {
  const words = rawWords.map(normalizeWord).filter((word) => word.length >= 2 && word.length <= size)
  const unique = [...new Set(words)]
  const directions = Object.keys(DIRECTIONS) as WordDirection[]

  for (let attempt = 0; attempt < seedAttempt; attempt += 1) {
    const grid: (string | null)[][] = Array.from({ length: size }, () =>
      Array.from({ length: size }, () => null),
    )
    const placements: PlacedWord[] = []
    let ok = true

    for (const word of unique) {
      let placed = false
      for (let tryN = 0; tryN < 80; tryN += 1) {
        const direction = directions[randomInt(directions.length)]!
        const row = randomInt(size)
        const col = randomInt(size)
        if (!canPlace(grid, word, row, col, direction)) continue
        const cells = placeWord(grid, word, row, col, direction)
        placements.push({ word, row, col, direction, cells })
        placed = true
        break
      }
      if (!placed) {
        ok = false
        break
      }
    }

    if (!ok) continue

    const filled = grid.map((row) =>
      row.map((cell) => cell ?? LETTERS[randomInt(LETTERS.length)]!),
    )

    return {
      id,
      title,
      size,
      words: unique,
      grid: filled,
      placements,
    }
  }

  // Fallback deterministic horizontal layout
  const grid: string[][] = Array.from({ length: size }, () =>
    Array.from({ length: size }, () => LETTERS[randomInt(LETTERS.length)]!),
  )
  const placements: PlacedWord[] = []
  unique.forEach((word, index) => {
    const row = Math.min(index, size - 1)
    const cells = word.split('').map((letter, col) => {
      if (col < size) grid[row]![col] = letter
      return { row, col }
    })
    placements.push({ word, row, col: 0, direction: 'horizontal', cells })
  })

  return { id, title, size, words: unique, grid, placements }
}

export function cellsMatchPath(
  selected: Array<{ row: number; col: number }>,
  target: Array<{ row: number; col: number }>,
) {
  if (selected.length !== target.length) return false
  const forward = selected.every(
    (cell, index) => cell.row === target[index]?.row && cell.col === target[index]?.col,
  )
  if (forward) return true
  const reversed = [...target].reverse()
  return selected.every(
    (cell, index) => cell.row === reversed[index]?.row && cell.col === reversed[index]?.col,
  )
}

export function lineBetween(
  start: { row: number; col: number },
  end: { row: number; col: number },
): Array<{ row: number; col: number }> {
  const dr = Math.sign(end.row - start.row)
  const dc = Math.sign(end.col - start.col)
  const steps = Math.max(Math.abs(end.row - start.row), Math.abs(end.col - start.col))
  if (steps === 0) return [start]
  // Only allow straight lines (horizontal/vertical/diagonal)
  if (
    !(
      (dr === 0 && dc !== 0) ||
      (dc === 0 && dr !== 0) ||
      (Math.abs(end.row - start.row) === Math.abs(end.col - start.col))
    )
  ) {
    return [start]
  }
  const cells: Array<{ row: number; col: number }> = []
  for (let i = 0; i <= steps; i += 1) {
    cells.push({ row: start.row + dr * i, col: start.col + dc * i })
  }
  return cells
}
