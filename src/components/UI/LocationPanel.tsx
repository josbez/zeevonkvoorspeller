'use client'

import { LocatieMetKans, DagVoorspelling } from '@/lib/types'
import { kansKleur, kansLabel } from '@/lib/voorspelling'
import KansIndicator from './KansIndicator'
import MoonPhase from './MoonPhase'
import { getMaanfase } from '@/lib/maanfase'

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
  const vandaag = new Date()
  const maanfase = getMaanfase(vandaag)

  return (
    <div className="flex flex-col gap-4 h-full">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs uppercase tracking-widest text-[#8bb8cc]">{typeLabel[locatie.type]}</p>
          <h2 className="text-lg font-semibold text-[#e8f4f8] leading-tight mt-0.5">{locatie.naam}</h2>
        </div>
        <button
          onClick={onSluiten}
          className="text-[#8bb8cc] hover:text-[#e8f4f8] text-xl leading-none mt-0.5"
          aria-label="Paneel sluiten"
        >
          ×
        </button>
      </div>

      {/* Kans indicator */}
      <div className="flex justify-center py-2">
        <KansIndicator kans={kans} naam="vanavond" />
      </div>

      {/* Omstandigheden */}
      {dagVoorspelling && (
        <div className="grid grid-cols-2 gap-2">
          <Stat label="Wind" waarde={`${dagVoorspelling.windsnelheid} m/s`} goed={dagVoorspelling.windsnelheid <= 3} />
          <Stat label="Golven" waarde={`${dagVoorspelling.golfhoogte} m`} goed={dagVoorspelling.golfhoogte <= 0.4} />
          <Stat label="Bewolking" waarde={`${dagVoorspelling.bewolking}%`} goed={dagVoorspelling.bewolking < 30} />
          <Stat label="Watertemp." waarde={`${dagVoorspelling.watertemperatuur}°C`} goed={dagVoorspelling.watertemperatuur >= 17} />
        </div>
      )}

      {/* Maanfase */}
      <div className="border-t border-[#1e3a52] pt-3">
        <MoonPhase fase={maanfase} />
      </div>

      {/* Uitleg */}
      <div className="mt-auto border-t border-[#1e3a52] pt-3">
        <p className="text-xs text-[#8bb8cc] leading-relaxed">
          {locatie.type === 'estuarium'
            ? 'Zeevonk is ook waargenomen in zoutwater binnenzeeën met voldoende saliniteit (≥17 psu).'
            : 'Zeevonk is het meest zichtbaar op windstille nachten met lage golven, warm water en rond nieuwe maan.'}
        </p>
      </div>
    </div>
  )
}

function Stat({ label, waarde, goed }: { label: string; waarde: string; goed: boolean }) {
  return (
    <div className="bg-[#0d1f35] rounded-lg p-2.5">
      <p className="text-[10px] uppercase tracking-wider text-[#8bb8cc]">{label}</p>
      <p className="text-sm font-mono font-semibold mt-0.5" style={{ color: goed ? '#39ff14' : '#e8f4f8' }}>
        {waarde}
      </p>
    </div>
  )
}
