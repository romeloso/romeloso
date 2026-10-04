import { describe, expect, it } from 'vitest'
import { cellsMatchPath, generateWordSearch, lineBetween } from './wordsearch'

describe('wordsearch generator', () => {
  it('incluye todas las palabras en el tablero', () => {
    const puzzle = generateWordSearch('t1', 'Test', ['SOL', 'MAR', 'CASA'], 8)
    expect(puzzle.words).toEqual(expect.arrayContaining(['SOL', 'MAR', 'CASA']))
    expect(puzzle.placements).toHaveLength(3)
    for (const placement of puzzle.placements) {
      const spelled = placement.cells.map((cell) => puzzle.grid[cell.row]?.[cell.col]).join('')
      expect(spelled).toBe(placement.word)
    }
  })

  it('valida líneas y coincidencias de celdas', () => {
    const line = lineBetween({ row: 0, col: 0 }, { row: 0, col: 3 })
    expect(line).toHaveLength(4)
    expect(
      cellsMatchPath(
        [
          { row: 0, col: 0 },
          { row: 0, col: 1 },
        ],
        [
          { row: 0, col: 1 },
          { row: 0, col: 0 },
        ],
      ),
    ).toBe(true)
  })
})
