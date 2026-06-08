const IMPOSSIBLE = new Set([159, 162, 163, 165, 166, 168, 169])

const DOUBLES = [...Array.from({length: 20}, (_, i) => (i + 1) * 2), 50]
const SINGLES = [...Array.from({length: 20}, (_, i) => i + 1), 25]
const ALL_DARTS = new Set([
  ...SINGLES,
  ...DOUBLES,
  ...Array.from({length: 20}, (_, i) => (i + 1) * 3),
])

export interface Checkout {
  darts: number[]        // valeurs brutes (ex: [60, 60, 12])
  labels: string[]       // labels lisibles (ex: ['T20', 'T20', 'D6'])
  count: 1 | 2 | 3
}

function dartLabel(v: number, isFinish = false): string {
  if (v === 50) return isFinish ? 'D-Bull' : 'Bull'
  if (v === 25) return 'Bull'
  if (isFinish && v % 2 === 0) return `D${v / 2}`
  if (v % 3 === 0 && v / 3 <= 20) return `T${v / 3}`
  if (v % 2 === 0 && v / 2 <= 20) return `D${v / 2}`
  return `${v}`
}

export function useDartsCheckout() {
  function getCheckouts(score: number, limit = 5): Checkout[] | null {
    if (score < 2 || score > 170 || IMPOSSIBLE.has(score)) return null

    const results: number[][] = []

    // 1 fléchette
    if (DOUBLES.includes(score)) results.push([score])

    // 2 fléchettes
    for (const d2 of DOUBLES) {
      const r = score - d2
      if (r > 0 && ALL_DARTS.has(r)) results.push([r, d2])
    }

    // 3 fléchettes
    for (const d3 of DOUBLES) {
      const r2 = score - d3
      if (r2 <= 1) continue
      for (const d2 of ALL_DARTS) {
        const r1 = r2 - d2
        if (r1 > 0 && ALL_DARTS.has(r1)) results.push([r1, d2, d3])
      }
    }

    const seen = new Set<string>()
    return results
      .filter(r => { const k = r.join('-'); return seen.has(k) ? false : (seen.add(k), true) })
      .sort((a, b) => a.length - b.length)
      .slice(0, limit)
      .map(darts => ({
        darts,
        labels: darts.map((v, i) => dartLabel(v, i === darts.length - 1)),
        count: darts.length as 1 | 2 | 3,
      }))
  }

  function isImpossible(score: number) {
    return IMPOSSIBLE.has(score) || score < 2 || score > 170
  }

  return { getCheckouts, isImpossible }
}