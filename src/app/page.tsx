'use client'

import { useState, useEffect, useCallback } from 'react'
import dynamic from 'next/dynamic'
import { LOCATIES } from '@/lib/locaties'
import { berekenKans, berekenSeizoenScore } from '@/lib/voorspelling'
import { getMaanfase } from '@/lib/maanfase'
import { LocatieMetKans, DagVoorspelling } from '@/lib/types'
import TimeSlider from '@/components/UI/TimeSlider'
import LocationPanel from '@/components/UI/LocationPanel'
import MoonPhase from '@/components/UI/MoonPhase'
import TopLocaties from '@/components/UI/TopLocaties'

// Mapbox is client-only (no SSR)
const MapContainer = dynamic(() => import('@/components/Map/MapContainer'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center bg-[#050d1a]">
      <div className="flex flex-col items-center gap-3">
        <div className="w-8 h-8 rounded-full border-2 border-[#00e5ff] border-t-transparent animate-spin" />
        <p className="text-[#8bb8cc] text-sm">Kaart laden…</p>
      </div>
    </div>
  ),
})

export default function Home() {
  const [voorspelling, setVoorspelling] = useState<DagVoorspelling[]>([])
  const [locaties, setLocaties] = useState<LocatieMetKans[]>([])
  const [geselecteerdeDag, setGeselecteerdeDag] = useState(0)
  const [geselecteerdeLocatie, setGeselecteerdeLocatie] = useState<LocatieMetKans | null>(null)
  const [loading, setLoading] = useState(true)
  const maanfase = getMaanfase(new Date())

  // Bereken kansen voor alle locaties op basis van geselecteerde dag
  const updateLocatiesMetKansen = useCallback(
    (dagIndex: number, dagVoorspelling: DagVoorspelling[]) => {
      if (!dagVoorspelling.length) return

      const dag = dagVoorspelling[dagIndex]
      if (!dag) return

      const updated: LocatieMetKans[] = LOCATIES.map((loc) => {
        const d = new Date(dag.datum)
        const seizoenScore = berekenSeizoenScore(d)
        const fase = getMaanfase(d)

        // Estuaria krijgen lichte penaltyop golfhoogte (meer beschut)
        const golfCorrectie = loc.type === 'estuarium' ? 0.15 : 0
        const kans = berekenKans({
          watertemperatuur: dag.watertemperatuur,
          windsnelheid: dag.windsnelheid,
          golfhoogte: Math.max(0, dag.golfhoogte - golfCorrectie),
          maanfase: fase,
          seizoenScore,
          bewolking: dag.bewolking,
        })

        return { ...loc, kans, voorspelling: dagVoorspelling }
      })

      setLocaties(updated)
    },
    []
  )

  // Laad voorspelling voor centrum NL bij start
  useEffect(() => {
    async function laadVoorspelling() {
      try {
        const res = await fetch('/api/voorspelling?lat=52.372&lng=4.533')
        const data: DagVoorspelling[] = await res.json()
        setVoorspelling(data)
        updateLocatiesMetKansen(0, data)
      } catch {
        // Fallback: bereken met seizoensdata zonder weerAPI
        const fallback: DagVoorspelling[] = Array.from({ length: 5 }, (_, i) => {
          const d = new Date()
          d.setDate(d.getDate() + i)
          return {
            datum: d.toISOString().split('T')[0],
            kans: 0,
            windsnelheid: 4,
            golfhoogte: 0.5,
            bewolking: 40,
            watertemperatuur: 19,
          }
        })
        setVoorspelling(fallback)
        updateLocatiesMetKansen(0, fallback)
      } finally {
        setLoading(false)
      }
    }
    laadVoorspelling()
  }, [updateLocatiesMetKansen])

  // Update locatiekansen bij dagwissel
  useEffect(() => {
    updateLocatiesMetKansen(geselecteerdeDag, voorspelling)
  }, [geselecteerdeDag, voorspelling, updateLocatiesMetKansen])

  // Update geselecteerde locatie na kansupdate
  useEffect(() => {
    if (!geselecteerdeLocatie) return
    const updated = locaties.find((l) => l.id === geselecteerdeLocatie.id)
    if (updated) setGeselecteerdeLocatie(updated)
  }, [locaties]) // eslint-disable-line react-hooks/exhaustive-deps

  const besteDag = voorspelling.reduce(
    (best, dag, i) => (dag.kans > (voorspelling[best]?.kans ?? 0) ? i : best),
    0
  )

  return (
    <div className="relative w-full h-full overflow-hidden bg-[#050d1a]">
      {/* ── Kaart ── */}
      <div className="absolute inset-0">
        {!loading && (
          <MapContainer
            locaties={locaties}
            geselecteerdeLocatie={geselecteerdeLocatie}
            onLocatieKlik={setGeselecteerdeLocatie}
          />
        )}
      </div>

      {/* ── Header ── */}
      <header className="absolute top-0 left-0 right-0 z-10 flex items-center justify-between px-4 py-3 pointer-events-none">
        <div className="pointer-events-auto">
          <h1 className="text-base font-semibold text-[#e8f4f8] leading-none">
            Zeevonk
            <span className="text-[#00e5ff]">voorspeller</span>
          </h1>
          <p className="text-[10px] text-[#8bb8cc] mt-0.5">NL & BE kust · estuaria · Waddenzee</p>
        </div>
        <div className="pointer-events-auto bg-[#0d1f35cc] backdrop-blur-sm rounded-xl px-3 py-2 border border-[#1e3a52]">
          <MoonPhase fase={maanfase} />
        </div>
      </header>

      {/* ── Beste avond badge ── */}
      {voorspelling.length > 0 && !loading && (
        <div className="absolute top-16 left-4 z-10">
          <button
            onClick={() => setGeselecteerdeDag(besteDag)}
            className="flex items-center gap-2 bg-[#0d1f35cc] backdrop-blur-sm rounded-xl px-3 py-2 border border-[#00e5ff33] text-xs text-[#8bb8cc] hover:border-[#00e5ff66] transition-colors"
          >
            <span className="text-[#39ff14]">★</span>
            <span>
              Beste kans:{' '}
              <span className="text-[#e8f4f8] font-semibold">
                {besteDag === 0
                  ? 'vanavond'
                  : new Date(voorspelling[besteDag].datum).toLocaleDateString('nl-NL', { weekday: 'long' })}
              </span>{' '}
              ({voorspelling[besteDag].kans}%)
            </span>
          </button>
        </div>
      )}

      {/* ── Top locaties (desktop links) ── */}
      {locaties.length > 0 && (
        <aside className="hidden md:block absolute left-4 top-16 z-10 w-64 bg-[#0d1f35dd] backdrop-blur-md rounded-2xl border border-[#1e3a52] p-3">
          <TopLocaties
            locaties={locaties}
            geselecteerdeLocatie={geselecteerdeLocatie}
            onLocatieKlik={setGeselecteerdeLocatie}
          />
        </aside>
      )}

      {/* ── Locatiepaneel (desktop: rechts / mobiel: bottom sheet) ── */}
      {geselecteerdeLocatie && (
        <>
          {/* Desktop sidebar */}
          <aside className="hidden md:flex absolute right-4 top-4 bottom-20 w-72 z-20 flex-col bg-[#0d1f35ee] backdrop-blur-md rounded-2xl border border-[#1e3a52] p-4 animate-slide-up overflow-y-auto">
            <LocationPanel
              locatie={geselecteerdeLocatie}
              dagVoorspelling={voorspelling[geselecteerdeDag]}
              onSluiten={() => setGeselecteerdeLocatie(null)}
            />
          </aside>

          {/* Mobiel bottom sheet */}
          <div className="md:hidden absolute bottom-24 left-4 right-4 z-20 bg-[#0d1f35f0] backdrop-blur-md rounded-2xl border border-[#1e3a52] p-4 animate-slide-up max-h-[55vh] overflow-y-auto">
            <LocationPanel
              locatie={geselecteerdeLocatie}
              dagVoorspelling={voorspelling[geselecteerdeDag]}
              onSluiten={() => setGeselecteerdeLocatie(null)}
            />
          </div>
        </>
      )}

      {/* ── Tijdslider ── */}
      <div className="absolute bottom-0 left-0 right-0 z-10 px-4 pb-4 pt-3 bg-gradient-to-t from-[#050d1a] to-transparent">
        {voorspelling.length > 0 ? (
          <TimeSlider
            voorspelling={voorspelling}
            geselecteerdeDag={geselecteerdeDag}
            onChange={setGeselecteerdeDag}
          />
        ) : (
          <div className="flex gap-1">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex-1 h-16 rounded-lg bg-[#0d1f35] animate-pulse" />
            ))}
          </div>
        )}
      </div>

    </div>
  )
}
