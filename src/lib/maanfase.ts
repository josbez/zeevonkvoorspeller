import * as SunCalc from 'suncalc'

export function getMaanfase(datum: Date): number {
  const illumination = SunCalc.getMoonIllumination(datum)
  return illumination.phase // 0 = nieuwe maan, 0.5 = volle maan
}

export function getMaanfaseNaam(fase: number): string {
  if (fase < 0.05 || fase > 0.95) return 'Nieuwe maan'
  if (fase < 0.20) return 'Wassende sikkel'
  if (fase < 0.30) return 'Eerste kwartier'
  if (fase < 0.45) return 'Wassende maan'
  if (fase < 0.55) return 'Volle maan'
  if (fase < 0.70) return 'Afnemende maan'
  if (fase < 0.80) return 'Laatste kwartier'
  return 'Afnemende sikkel'
}

export function getMaanfaseEmoji(fase: number): string {
  const index = Math.round(fase * 8) % 8
  return ['🌑', '🌒', '🌓', '🌔', '🌕', '🌖', '🌗', '🌘'][index]
}
