import { NextRequest, NextResponse } from 'next/server'
import { berekenKans, berekenSeizoenScore } from '@/lib/voorspelling'
import { getMaanfase } from '@/lib/maanfase'
import { DagVoorspelling } from '@/lib/types'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const lat = parseFloat(searchParams.get('lat') ?? '52.372')
  const lng = parseFloat(searchParams.get('lng') ?? '4.533')

  if (isNaN(lat) || isNaN(lng)) {
    return NextResponse.json({ error: 'Ongeldige coördinaten' }, { status: 400 })
  }

  try {
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lng}&hourly=windspeed_10m,cloudcover,wave_height&daily=windspeed_10m_max,cloudcover_mean&forecast_days=5&timezone=Europe%2FAmsterdam&wind_speed_unit=ms`
    const res = await fetch(url, { next: { revalidate: 3600 } })

    if (!res.ok) throw new Error('Open-Meteo niet bereikbaar')

    const data = await res.json()
    const dagelijks = data.daily

    const voorspelling: DagVoorspelling[] = dagelijks.time.map((datum: string, i: number) => {
      const d = new Date(datum)
      const maanfase = getMaanfase(d)
      const seizoenScore = berekenSeizoenScore(d)

      // Watertemperatuur: mock voor MVP (Copernicus pipeline in v2)
      const watertemperatuur = 19 + Math.sin(i * 0.5) * 1.5

      const windsnelheid = dagelijks.windspeed_10m_max?.[i] ?? 4
      const bewolking = dagelijks.cloudcover_mean?.[i] ?? 50
      // Golfhoogte niet beschikbaar in daily; gebruik uursgemiddelde voor de nacht (uur 21-23)
      const uurOffset = i * 24
      const golfwaarden = [21, 22, 23].map((u) => data.hourly.wave_height?.[uurOffset + u] ?? 0.5)
      const golfhoogte = golfwaarden.reduce((a: number, b: number) => a + b, 0) / golfwaarden.length

      const kans = berekenKans({
        watertemperatuur,
        windsnelheid,
        golfhoogte,
        maanfase,
        seizoenScore,
        bewolking,
      })

      return {
        datum,
        kans,
        windsnelheid: Math.round(windsnelheid * 10) / 10,
        golfhoogte: Math.round(golfhoogte * 100) / 100,
        bewolking: Math.round(bewolking),
        watertemperatuur: Math.round(watertemperatuur * 10) / 10,
      }
    })

    return NextResponse.json(voorspelling)
  } catch {
    // Fallback: gesimuleerde data bij API-fout
    const fallback: DagVoorspelling[] = Array.from({ length: 5 }, (_, i) => {
      const d = new Date()
      d.setDate(d.getDate() + i)
      const datum = d.toISOString().split('T')[0]
      const maanfase = getMaanfase(d)
      const seizoenScore = berekenSeizoenScore(d)
      const kans = berekenKans({
        watertemperatuur: 20,
        windsnelheid: 2 + i,
        golfhoogte: 0.3 + i * 0.1,
        maanfase,
        seizoenScore,
        bewolking: 30 + i * 10,
      })
      return { datum, kans, windsnelheid: 2 + i, golfhoogte: 0.3 + i * 0.1, bewolking: 30 + i * 10, watertemperatuur: 20 }
    })
    return NextResponse.json(fallback)
  }
}
