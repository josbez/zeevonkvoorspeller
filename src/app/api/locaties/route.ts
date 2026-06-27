import { NextResponse } from 'next/server'
import { LOCATIES } from '@/lib/locaties'

export const runtime = 'edge'

export async function GET() {
  const features = LOCATIES.map((loc) => ({
    type: 'Feature' as const,
    properties: {
      id: loc.id,
      naam: loc.naam,
      type: loc.type,
      regio: loc.regio,
      kans: 0,
    },
    geometry: {
      type: 'Point' as const,
      coordinates: [loc.lng, loc.lat],
    },
  }))

  return NextResponse.json({
    type: 'FeatureCollection',
    features,
  })
}
