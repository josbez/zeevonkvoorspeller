'use client'

import { LocatieMetKans, DagVoorspelling } from '@/lib/types'
import { kansKleur, kansLabel, berekenFactorScores, berekenSeizoenScore } from '@/lib/voorspelling'
import { getMaanfase, getMaanfaseNaam, getMaanfaseEmoji } from '@/lib/maanfase'
import KansIndicator from './KansIndicator'

interface Props {
  locatie: LocatieMetKans
  dagVoorspelling?: DagVoorspelling
  onSluiten: () => void
}

const typeLabel: Record<string, string> = {
  kust: 'Noordzeekust',
  estuarium: 'Estuarium / Binnenzee',
  waddenzee: 'Waddenzee',
}

export default function LocationPanel({ locatie, dagVoorspelling, onSluiten }: Props) {
  const kans = dagVoorspelling?.kans ?? locatie.kans
  const kleur = kansKleur(kans)

  const datum = dagVoorspelling ? new Date(dagVoorspelling.datum) : new Date()
  const maanfase = getMaanfase(datum)
  const seizoenScore = berekenSeizoenScore(datum)

  const scores = dagVoorspelling
    ? berekenFactorScores({
        watertemperatuur: dagVoorspelling.watertemperatuur,
        windsnelheid: dagVoorspelling.windsnelheid,
        golfhoogte: dagVoorspelling.golfhoogte,
        maanfase,
        seizoenScore,
        bewolking: dagVoorspelling.bewolking,
      })
    : null

  return (
    <div className="flex flex-col gap-4 h-full">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <p className="text-[10px] uppercase tracking-widest text-[#8bb8cc]">{typeLabel[locatie.type]}</p>
          <h2 className="text-base font-semibold text-[#e8f4f8] leading-tight mt-0.5">{locatie.naam}</h2>
        </div>
        <button
          onClick={onSluiten}
          className="text-[#8bb8cc] hover:text-[#e8f4f8] text-xl leading-none mt-0.5 ml-2"
          aria-label="Paneel sluiten"
        >
          ×
        </button>
      </div>

      {/* Totaalscore */}
      <div className="flex justify-center py-1">
        <KansIndicator kans={kans} naam={kansLabel(kans)} />
      </div>

      {/* Factor scores */}
      {scores && dagVoorspelling && (
        <div className="flex flex-col gap-1.5">
          <p className="text-[9px] uppercase tracking-widest text-[#8bb8cc] mb-0.5">Scoremodel</p>
          <FactorBar
            label="Watertemp."
            waarde={`${dagVoorspelling.watertemperatuur}°C`}
            score={scores.watertemperatuur}
            max={30}
            ideaal="18–22°C"
          />
          <FactorBar
            label="Wind"
            waarde={`${dagVoorspelling.windsnelheid} m/s`}
            score={scores.wind}
            max={20}
            ideaal="< 3 m/s"
          />
          <FactorBar
            label="Golven"
            waarde={`${dagVoorspelling.golfhoogte} m`}
            score={scores.golven}
            max={15}
            ideaal="< 0.3 m"
          />
          <FactorBar
            label={`Maan ${getMaanfaseEmoji(maanfase)}`}
            waarde={getMaanfaseNaam(maanfase)}
            score={scores.maan}
            max={20}
            ideaal="Nieuwe maan"
          />
          <FactorBar
            label="Bewolking"
            waarde={`${dagVoorspelling.bewolking}%`}
            score={scores.bewolking}
            max={5}
            ideaal="< 20%"
          />
          <FactorBar
            label="Seizoen"
            waarde={datum.toLocaleDateString('nl-NL', { month: 'short' })}
            score={scores.seizoen}
            max={10}
            ideaal="jul–aug"
          />
          {/* Totaalbalk */}
          <div className="mt-1 pt-2 border-t border-[#1e3a52]">
            <div className="flex justify-between items-center mb-1">
              <span className="text-[10px] text-[#8bb8cc] uppercase tracking-wider">Totaal</span>
              <span className="text-sm font-mono font-bold" style={{ color: kleur }}>{kans}/100</span>
            </div>
            <div className="h-1.5 rounded-full bg-[#1e3a52] overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-700"
                style={{ width: `${kans}%`, background: `linear-gradient(90deg, #0052cc, ${kleur})` }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function FactorBar({
  label, waarde, score, max, ideaal
}: {
  label: string; waarde: string; score: number; max: number; ideaal: string
}) {
  const pct = Math.round((score / max) * 100)
  const kleur = pct >= 80 ? '#39ff14' : pct >= 50 ? '#00e5ff' : pct >= 20 ? '#ffb703' : '#8bb8cc'
  return (
    <div className="bg-[#0d1f35] rounded-lg px-3 py-2">
      <div className="flex items-center justify-between mb-1">
        <span className="text-[10px] uppercase tracking-wider text-[#8bb8cc]">{label}</span>
        <div className="flex items-center gap-2">
          <span className="text-[10px] text-[#8bb8cc]">{waarde}</span>
          <span className="text-[10px] font-mono font-semibold" style={{ color: kleur }}>
            {Math.round(score)}/{max}
          </span>
        </div>
      </div>
      <div className="h-1 rounded-full bg-[#162b47] overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-500"
          style={{ width: `${pct}%`, background: kleur }}
        />
      </div>
      <p className="text-[9px] text-[#8bb8cc55] mt-0.5">ideaal: {ideaal}</p>
    </div>
  )
}
