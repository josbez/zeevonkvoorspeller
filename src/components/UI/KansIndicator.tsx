'use client'

import { kansKleur, kansLabel } from '@/lib/voorspelling'

interface Props {
  kans: number
  naam: string
}

export default function KansIndicator({ kans, naam }: Props) {
  const kleur = kansKleur(kans)
  const label = kansLabel(kans)

  return (
    <div className="flex flex-col items-center gap-1">
      <div
        className="relative flex items-center justify-center w-24 h-24 rounded-full"
        style={{
          background: `conic-gradient(${kleur} ${kans}%, #0d1f35 0%)`,
          boxShadow: kans > 40 ? `0 0 24px 6px ${kleur}44` : 'none',
        }}
      >
        <div className="absolute inset-2 rounded-full bg-[#050d1a] flex items-center justify-center">
          <span className="text-2xl font-mono font-bold" style={{ color: kleur }}>
            {kans}%
          </span>
        </div>
      </div>
      <span className="text-xs font-semibold uppercase tracking-widest" style={{ color: kleur }}>
        {label}
      </span>
      <span className="text-[#8bb8cc] text-xs text-center max-w-[160px] leading-tight">{naam}</span>
    </div>
  )
}
