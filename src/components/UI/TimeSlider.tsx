'use client'

import { DagVoorspelling } from '@/lib/types'
import { kansKleur } from '@/lib/voorspelling'
import { format, parseISO } from 'date-fns'
import { nl } from 'date-fns/locale'

interface Props {
  voorspelling: DagVoorspelling[]
  geselecteerdeDag: number
  onChange: (dag: number) => void
}

export default function TimeSlider({ voorspelling, geselecteerdeDag, onChange }: Props) {
  return (
    <div className="flex gap-1 w-full">
      {voorspelling.map((dag, i) => {
        const kleur = kansKleur(dag.kans)
        const actief = i === geselecteerdeDag
        const datum = parseISO(dag.datum)
        const dagNaam = i === 0 ? 'Vandaag' : format(datum, 'EEE', { locale: nl })

        return (
          <button
            key={dag.datum}
            onClick={() => onChange(i)}
            className="flex-1 flex flex-col items-center gap-1 py-2 px-1 rounded-lg transition-all duration-200"
            style={{
              background: actief ? `${kleur}18` : 'transparent',
              border: actief ? `1px solid ${kleur}66` : '1px solid transparent',
            }}
          >
            <span className="text-[10px] uppercase tracking-wider text-[#8bb8cc]">{dagNaam}</span>
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-mono font-bold transition-all duration-200"
              style={{
                background: actief ? kleur : `${kleur}33`,
                color: actief ? '#050d1a' : kleur,
                boxShadow: actief && dag.kans > 40 ? `0 0 12px 3px ${kleur}66` : 'none',
              }}
            >
              {dag.kans}
            </div>
            <span className="text-[10px] text-[#8bb8cc]">{format(datum, 'd MMM', { locale: nl })}</span>
          </button>
        )
      })}
    </div>
  )
}
