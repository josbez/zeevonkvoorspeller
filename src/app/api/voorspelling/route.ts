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
    const [weerRes, marineRes] = await Promise.all([
      fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lng}&hourly=windspeed_10m,cloudcover,wave_height&daily=windspeed_10m_max,cloudcover_mean&forecast_days=5&timezone=Europe%2FAmsterdam&wind_speed_unit=ms`,
        { next: { revalidate: 3600 } }
      ),
      fetch(
        `https://marine-api.open-meteo.com/v1/marine?latitude=${lat}&longitude=${lng}&hourly=sea_surface_temperature&forecast_days=5&timezone=Europe%2FAmsterdam`,
        { next: { revalidate: 3600 } }
      ),
    ])

    if (!weerRes.ok) throw new Error('Open-Meteo niet bereikbaar')

    const data = await weerRes.json()
    const marineData = marineRes.ok ? await marineRes.json() : null
    const dagelijks = data.daily

    const voorspelling: DagVoorspelling[] = dagelijks.time.map((datum: string, i: number) => {
      const d = new Date(datum)
      const maanfase = getMaanfase(d)
      const seizoenScore = berekenSeizoenScore(d)

      const uurOffset = i * 24
      // Gemiddelde SST overdag (uur 10-14)
      const sstWaarden = marineData
        ? [10, 11, 12, 13, 14].map((u) => marineData.hourly?.sea_surface_temperature?.[uurOffset + u] ?? null).filter((v) => v !== null)
        : []
      const watertemperatuur = sstWaarden.length > 0
        ? sstWaarden.reduce((a: number, b: number) => a + b, 0) / sstWaarden.length
        : 15 + Math.sin((d.getMonth() - 1) * (Math.PI / 6)) * 5 // seizoenscurve als fallback

      const windsnelheid = dagelijks.windspeed_10m_max?.[i] ?? 4
      const bewolking = dagelijks.cloudcover_mean?.[i] ?? 50
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
      const watertemperatuur = 15 + Math.sin((d.getMonth() - 1) * (Math.PI / 6)) * 5
      const kans = berekenKans({
        watertemperatuur,
        windsnelheid: 2 + i,
        golfhoogte: 0.3 + i * 0.1,
        maanfase,
        seizoenScore,
        bewolking: 30 + i * 10,
      })
      return { datum, kans, windsnelheid: 2 + i, golfhoogte: 0.3 + i * 0.1, bewolking: 30 + i * 10, watertemperatuur: Math.round(watertemperatuur * 10) / 10 }
    })
    return NextResponse.json(fallback)
  }
}
