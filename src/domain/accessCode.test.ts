import { describe, expect, it } from 'vitest'
import { childAccessCode, createTutorAccessCode, normalizeAccessCode, normalizeSessionRole } from './accessCode'

describe('código de acceso del niño', () => {
  it('une el nombre y la fecha como día, mes y año', () => {
    expect(childAccessCode('Sophia', '2017-12-04')).toBe('SOPHIA041217')
    expect(childAccessCode('María José', '2018-01-09')).toBe('MARIAJOSE090118')
    expect(childAccessCode('Elena', '2018-08-20')).toBe('ELENA200818')
  })

  it('no inventa un código sin fecha o sin letras', () => {
    expect(childAccessCode('Sophia', null)).toBeNull()
    expect(childAccessCode('123', '2017-12-04')).toBeNull()
  })

  it('acepta el código escrito con espacios o minúsculas', () => {
    expect(normalizeAccessCode(' sophia 041217 ')).toBe('SOPHIA041217')
  })

  it('trata el acceso administrador anterior como superadministrador', () => {
    expect(normalizeSessionRole('admin')).toBe('superadmin')
    expect(normalizeSessionRole('tutor')).toBe('tutor')
  })

  it('genera un código de tutor que no repite los que ya existen', () => {
    const taken = new Set(['CASA1000'])
    const code = createTutorAccessCode('Casa', taken)
    expect(code.startsWith('CASA')).toBe(true)
    expect(taken.has(code)).toBe(false)
  })
})