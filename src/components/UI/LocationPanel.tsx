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
            uitleg={
              dagVoorspelling.watertemperatuur >= 18 && dagVoorspelling.watertemperatuur <= 22
                ? `${dagVoorspelling.watertemperatuur}°C is optimaal voor Noctiluca scintillans.`
                : dagVoorspelling.watertemperatuur < 15
                ? `Te koud — Noctiluca is nauwelijks actief onder 15°C.`
                : dagVoorspelling.watertemperatuur < 18
                ? `Iets koud — optimum is 18–22°C, activiteit neemt toe naarmate het warmer wordt.`
                : `Warm maar aan de hoge kant — boven 22°C neemt de activiteit geleidelijk af.`
            }
          />
          <FactorBar
            label="Wind"
            waarde={`${dagVoorspelling.windsnelheid} m/s`}
            score={scores.wind}
            max={20}
            uitleg={
              dagVoorspelling.windsnelheid <= 3
                ? `Windstil — perfect. Zeevonk is zichtbaar bij rustig water.`
                : dagVoorspelling.windsnelheid < 6
                ? `Lichte wind (${dagVoorspelling.windsnelheid} m/s). Zichtbaarheid verminderd maar mogelijk nog waarneembaar.`
                : `Te winderig (${dagVoorspelling.windsnelheid} m/s). Golvend water verstoort de bioluminescentie.`
            }
          />
          <FactorBar
            label="Golven"
            waarde={`${dagVoorspelling.golfhoogte} m`}
            score={scores.golven}
            max={15}
            uitleg={
              dagVoorspelling.golfhoogte <= 0.3
                ? `Spiegelgladde zee — ideaal. Zelfs kleine vonken worden zichtbaar.`
                : dagVoorspelling.golfhoogte < 0.7
                ? `Lichte deining (${dagVoorspelling.golfhoogte} m). Zeevonk is nog zichtbaar in de golven.`
                : `Ruwe zee (${dagVoorspelling.golfhoogte} m). Zeevonk wordt overspoeld door het geweld.`
            }
          />
          <FactorBar
            label={`Maan ${getMaanfaseEmoji(maanfase)}`}
            waarde={getMaanfaseNaam(maanfase)}
            score={scores.maan}
            max={20}
            uitleg={
              scores.maan >= 16
                ? `${getMaanfaseNaam(maanfase)} — donkere nacht, ideaal om zeevonk te spotten.`
                : scores.maan >= 8
                ? `${getMaanfaseNaam(maanfase)} — matig donker. Zeevonk is minder contrastrijk.`
                : `${getMaanfaseNaam(maanfase)} — te veel maanlicht. Zeevonk valt weg tegen de verlichte achtergrond.`
            }
          />
          <FactorBar
            label="Bewolking"
            waarde={`${dagVoorspelling.bewolking}%`}
            score={scores.bewolking}
            max={5}
            uitleg={
              dagVoorspelling.bewolking < 20
                ? `Heldere lucht — geen wolken die het zicht belemmeren.`
                : dagVoorspelling.bewolking < 60
                ? `Deels bewolkt. Weinig effect op zeevonk, maar ster-licht valt weg.`
                : `Zwaar bewolkt. Geen maanlicht of sterren, maar ook geen extra impact op zeevonk zelf.`
            }
          />
          <FactorBar
            label="Seizoen"
            waarde={datum.toLocaleDateString('nl-NL', { month: 'long' })}
            score={scores.seizoen}
            max={10}
            uitleg={
              scores.seizoen >= 8
                ? `Piekseizoen — Noctiluca bloeit maximaal in juli–augustus langs de Nederlandse kust.`
                : scores.seizoen >= 4
                ? `Randseizoen. Noctiluca is aanwezig maar in lagere concentraties dan in de zomer.`
                : `Buiten het seizoen. Noctiluca scintillans is nauwelijks aanwezig in koud water.`
            }
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
  label, waarde, score, max, uitleg
}: {
  label: string; waarde: string; score: number; max: number; uitleg: string
}) {
  const pct = Math.round((score / max) * 100)
  const kleur = pct >= 80 ? '#39ff14' : pct >= 50 ? '#00e5ff' : pct >= 25 ? '#ffb703' : '#ff4444'
  const icoon = pct >= 80 ? '✓' : pct >= 50 ? '~' : '✗'
  return (
    <div className="bg-[#0d1f35] rounded-lg px-3 py-2.5">
      <div className="flex items-center justify-between mb-1.5">
        <div className="flex items-center gap-1.5">
          <span className="text-[10px] font-bold leading-none" style={{ color: kleur }}>{icoon}</span>
          <span className="text-[10px] uppercase tracking-wider text-[#e8f4f8]">{label}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[11px] font-mono text-[#e8f4f8]">{waarde}</span>
          <span className="text-[10px] font-mono font-semibold tabular-nums" style={{ color: kleur }}>
            {Math.round(score)}<span className="text-[#8bb8cc]">/{max}</span>
          </span>
        </div>
      </div>
      <div className="h-1 rounded-full bg-[#162b47] overflow-hidden mb-1.5">
        <div
          className="h-full rounded-full transition-all duration-500"
          style={{ width: `${pct}%`, background: kleur }}
        />
      </div>
      <p className="text-[10px] text-[#8bb8cc] leading-snug">{uitleg}</p>
    </div>
  )
}
