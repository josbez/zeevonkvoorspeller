'use client'

import { getMaanfaseEmoji, getMaanfaseNaam } from '@/lib/maanfase'

interface Props {
  fase: number
}

export default function MoonPhase({ fase }: Props) {
  return (
    <div className="flex items-center gap-2 text-[#8bb8cc]">
      <span className="text-xl">{getMaanfaseEmoji(fase)}</span>
      <div className="flex flex-col">
        <span className="text-xs uppercase tracking-widest text-[#8bb8cc]">Maanfase</span>
        <span className="text-sm text-[#e8f4f8]">{getMaanfaseNaam(fase)}</span>
      </div>
    </div>
  )
}
