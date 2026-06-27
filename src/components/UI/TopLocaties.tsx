'use client'

import { LocatieMetKans } from '@/lib/types'
import { kansKleur } from '@/lib/voorspelling'

interface Props {
  locaties: LocatieMetKans[]
  geselecteerdeLocatie: LocatieMetKans | null
  onLocatieKlik: (locatie: LocatieMetKans) => void
}

export default function TopLocaties({ locaties, geselecteerdeLocatie, onLocatieKlik }: Props) {
  const top = [...locaties]
    .sort((a, b) => b.kans - a.kans)
    .slice(0, 8)

  return (
    <div className="flex flex-col gap-1">
      {/* Header met toekomstige dropdown */}
      <div className="flex items-center justify-between mb-1 px-0.5">
        <p className="text-[9px] uppercase tracking-widest text-[#8bb8cc]">Beste spots vandaag</p>
        <button
          className="flex items-center gap-1 text-[9px] text-[#8bb8cc] bg-[#162b47] rounded px-1.5 py-0.5 border border-[#1e3a52] cursor-default opacity-60"
          title="Meer fenomenen volgen in fase 2"
        >
          Zeevonk
          <svg width="8" height="8" viewBox="0 0 8 8" fill="none">
            <path d="M1.5 3L4 5.5L6.5 3" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
          </svg>
        </button>
      </div>

      {top.map((loc, i) => {
        const kleur = kansKleur(loc.kans)
        const isActief = geselecteerdeLocatie?.id === loc.id
        return (
          <button
            key={loc.id}
            onClick={() => onLocatieKlik(loc)}
            className={`w-full text-left rounded-xl px-3 py-2 border transition-all duration-150 ${
              isActief
                ? 'bg-[#162b47] border-[#00e5ff33]'
                : 'bg-[#0d1f3566] border-[#1e3a52] hover:bg-[#162b47] hover:border-[#1e3a5288]'
            }`}
          >
            <div className="flex items-center gap-2">
              {/* Rang */}
              <span className="text-[9px] text-[#8bb8cc] w-3 shrink-0 font-mono">{i + 1}</span>

              {/* Kleur dot */}
              <div className="w-2 h-2 rounded-full shrink-0" style={{ background: kleur, boxShadow: `0 0 4px ${kleur}` }} />

              {/* Naam */}
              <span className="text-xs text-[#e8f4f8] flex-1 truncate">{loc.naam}</span>

              {/* Kans */}
              <span className="text-xs font-mono font-semibold shrink-0" style={{ color: kleur }}>
                {loc.kans}%
              </span>
            </div>

            {/* Kansbar */}
            <div className="mt-1.5 ml-5 h-0.5 rounded-full bg-[#1e3a52] overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{ width: `${loc.kans}%`, background: kleur, opacity: 0.7 }}
              />
            </div>
          </button>
        )
      })}
    </div>
  )
}
