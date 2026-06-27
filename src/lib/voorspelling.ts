import { VoorspelParams } from './types'

export function berekenKans(p: VoorspelParams): number {
  let score = 0

  // Watertemperatuur: optimum 18–22°C, range 15–26°C
  const temp = p.watertemperatuur
  if (temp >= 18 && temp <= 22) {
    score += 30
  } else if (temp >= 15 && temp < 18) {
    score += 30 * ((temp - 15) / 3)
  } else if (temp > 22 && temp <= 26) {
    score += 30 * ((26 - temp) / 4)
  }

  // Windsnelheid: < 3 m/s ideaal, 0 bij > 8 m/s
  const wind = p.windsnelheid
  if (wind <= 3) {
    score += 20
  } else if (wind < 8) {
    score += 20 * (1 - (wind - 3) / 5)
  }

  // Golfhoogte: < 0.3m ideaal, 0 bij > 1m
  const golf = p.golfhoogte
  if (golf <= 0.3) {
    score += 15
  } else if (golf < 1) {
    score += 15 * (1 - (golf - 0.3) / 0.7)
  }

  // Maanfase: 0 = nieuwe maan (max), 0.5 = volle maan (min)
  const maanAfstand = Math.min(p.maanfase, 1 - p.maanfase)
  score += 20 * (1 - maanAfstand / 0.5)

  // Seizoen: piek juli (dag 196), range mei–sept
  score += 10 * p.seizoenScore

  // Bewolking: minder bewolking = donkerder nacht
  if (p.bewolking < 20) {
    score += 5
  } else if (p.bewolking < 60) {
    score += 5 * (1 - (p.bewolking - 20) / 40)
  }

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
