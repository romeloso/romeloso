export function formatNumber(value: number): string {
  return new Intl.NumberFormat('es-ES').format(value)
}

export function formatPercent(ratio: number): string {
  return `${Math.round(ratio * 100)}%`
}

export function formatWpm(wpm: number): string {
  return `${Math.round(wpm)} PPM`
}
