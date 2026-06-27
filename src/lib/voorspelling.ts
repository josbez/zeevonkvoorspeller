import { VoorspelParams } from './types'

export interface FactorScores {
  watertemperatuur: number  // 0–30
  wind: number              // 0–20
  golven: number            // 0–15
  maan: number              // 0–20
  seizoen: number           // 0–10
  bewolking: number         // 0–5
}

export function berekenFactorScores(p: VoorspelParams): FactorScores {
  let watertemperatuur = 0
  const temp = p.watertemperatuur
  if (temp >= 18 && temp <= 22) watertemperatuur = 30
  else if (temp >= 15 && temp < 18) watertemperatuur = 30 * ((temp - 15) / 3)
  else if (temp > 22 && temp <= 26) watertemperatuur = 30 * ((26 - temp) / 4)

  let wind = 0
  const w = p.windsnelheid
  if (w <= 3) wind = 20
  else if (w < 8) wind = 20 * (1 - (w - 3) / 5)

  let golven = 0
  const g = p.golfhoogte
  if (g <= 0.3) golven = 15
  else if (g < 1) golven = 15 * (1 - (g - 0.3) / 0.7)

  const maanAfstand = Math.min(p.maanfase, 1 - p.maanfase)
  const maan = 20 * (1 - maanAfstand / 0.5)

  const seizoen = 10 * p.seizoenScore

  let bewolking = 0
  if (p.bewolking < 20) bewolking = 5
  else if (p.bewolking < 60) bewolking = 5 * (1 - (p.bewolking - 20) / 40)

  return { watertemperatuur, wind, golven, maan, seizoen, bewolking }
}

export function berekenKans(p: VoorspelParams): number {
  const s = berekenFactorScores(p)
  const score = s.watertemperatuur + s.wind + s.golven + s.maan + s.seizoen + s.bewolking
  return Math.min(100, Math.max(0, Math.round(score)))
}

export function berekenSeizoenScore(datum: Date): number {
  const dag = datum.getMonth() * 30 + datum.getDate()
  // Piek: ~dag 196 (15 juli), bereik: dag 120 (1 mei) t/m dag 274 (1 okt)
  const piek = 196
  const bereik = 77
  const afstand = Math.abs(dag - piek)
  if (afstand > bereik) return 0
  return Math.cos((afstand / bereik) * (Math.PI / 2))
}

export function kansKleur(kans: number): string {
  if (kans >= 70) return '#39ff14'
  if (kans >= 45) return '#00e5ff'
  if (kans >= 20) return '#0052cc'
  return '#1e3a52'
}

export function kansLabel(kans: number): string {
  if (kans >= 70) return 'Hoog'
  if (kans >= 45) return 'Matig'
  if (kans >= 20) return 'Laag'
  return 'Zeer laag'
}
