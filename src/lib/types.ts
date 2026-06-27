export interface Locatie {
  id: string
  naam: string
  lat: number
  lng: number
  type: 'kust' | 'estuarium' | 'waddenzee'
  regio: 'nl-kust' | 'be-kust' | 'zeeland' | 'waddenzee'
}

export interface VoorspelParams {
  watertemperatuur: number
  windsnelheid: number
  golfhoogte: number
  maanfase: number
  seizoenScore: number
  bewolking: number
  saliniteit?: number
}

export interface DagVoorspelling {
  datum: string
  kans: number
  windsnelheid: number
  golfhoogte: number
  bewolking: number
  watertemperatuur: number
}

export interface LocatieMetKans extends Locatie {
  kans: number
  voorspelling?: DagVoorspelling[]
}
