'use client'

import { useEffect, useRef, useCallback } from 'react'
import mapboxgl from 'mapbox-gl'
import 'mapbox-gl/dist/mapbox-gl.css'
import { LocatieMetKans } from '@/lib/types'
import { kansKleur } from '@/lib/voorspelling'

interface Props {
  locaties: LocatieMetKans[]
  geselecteerdeLocatie: LocatieMetKans | null
  onLocatieKlik: (locatie: LocatieMetKans) => void
}

const MAPBOX_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_TOKEN ?? ''

export default function MapContainer({ locaties, geselecteerdeLocatie, onLocatieKlik }: Props) {
  const containerRef = useRef<HTMLDivElement>(null)
  const mapRef = useRef<mapboxgl.Map | null>(null)
  const markersRef = useRef<Map<string, mapboxgl.Marker>>(new Map())

  const initMap = useCallback(() => {
    if (!containerRef.current || mapRef.current) return

    mapboxgl.accessToken = MAPBOX_TOKEN

    const map = new mapboxgl.Map({
      container: containerRef.current,
      style: 'mapbox://styles/mapbox/dark-v11',
      center: [4.5, 52.4],
      zoom: 7,
      minZoom: 6,
      maxZoom: 14,
    })

    map.addControl(new mapboxgl.NavigationControl({ showCompass: false }), 'top-right')

    map.on('load', () => {
      // Heatmap source + layer
      map.addSource('zeevonk-heat', {
        type: 'geojson',
        data: { type: 'FeatureCollection', features: [] },
      })

      map.addLayer({
        id: 'zeevonk-heatmap',
        type: 'heatmap',
        source: 'zeevonk-heat',
        paint: {
          'heatmap-weight': ['interpolate', ['linear'], ['get', 'kans'], 0, 0, 100, 1],
          'heatmap-intensity': ['interpolate', ['linear'], ['zoom'], 6, 1, 10, 2],
          'heatmap-color': [
            'interpolate', ['linear'], ['heatmap-density'],
            0, 'rgba(0,0,0,0)',
            0.15, 'rgba(0,82,204,0.2)',
            0.4, 'rgba(0,229,255,0.45)',
            0.7, 'rgba(126,255,245,0.65)',
            1, 'rgba(57,255,20,0.85)',
          ],
          'heatmap-radius': ['interpolate', ['linear'], ['zoom'], 6, 30, 10, 60],
          'heatmap-opacity': 0.75,
        },
      })

      mapRef.current = map
      updateMarkers(map, locaties, onLocatieKlik)
      updateHeatmap(map, locaties)
    })

    mapRef.current = map
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    initMap()
    return () => {
      markersRef.current.forEach((m) => m.remove())
      markersRef.current.clear()
      mapRef.current?.remove()
      mapRef.current = null
    }
  }, [initMap])

  useEffect(() => {
    const map = mapRef.current
    if (!map || !map.isStyleLoaded()) return
    updateMarkers(map, locaties, onLocatieKlik)
    updateHeatmap(map, locaties)
  }, [locaties]) // eslint-disable-line react-hooks/exhaustive-deps

  // Fly to geselecteerde locatie
  useEffect(() => {
    if (!geselecteerdeLocatie || !mapRef.current) return
    mapRef.current.flyTo({
      center: [geselecteerdeLocatie.lng, geselecteerdeLocatie.lat],
      zoom: 10,
      duration: 1200,
      essential: true,
    })
  }, [geselecteerdeLocatie])

  function updateMarkers(
    map: mapboxgl.Map,
    locs: LocatieMetKans[],
    onClick: (l: LocatieMetKans) => void
  ) {
    // Verwijder oude markers
    markersRef.current.forEach((m) => m.remove())
    markersRef.current.clear()

    locs.forEach((loc) => {
      const kleur = kansKleur(loc.kans)
      const el = document.createElement('div')
      el.className = 'zeevonk-marker'
      el.setAttribute('data-kans', String(loc.kans))
      el.style.setProperty('--glow-color', kleur)
      el.innerHTML = `
        <div class="zeevonk-core" style="background:${kleur};box-shadow:0 0 8px 4px ${kleur}66"></div>
        <div class="zeevonk-ring ring-1" style="border-color:${kleur}55"></div>
        <div class="zeevonk-ring ring-2" style="border-color:${kleur}44"></div>
        <div class="zeevonk-ring ring-3" style="border-color:${kleur}33"></div>
      `
      el.addEventListener('click', () => onClick(loc))

      const marker = new mapboxgl.Marker({ element: el, anchor: 'center' })
        .setLngLat([loc.lng, loc.lat])
        .addTo(map)

      markersRef.current.set(loc.id, marker)
    })
  }

  function updateHeatmap(map: mapboxgl.Map, locs: LocatieMetKans[]) {
    const source = map.getSource('zeevonk-heat') as mapboxgl.GeoJSONSource | undefined
    if (!source) return

    source.setData({
      type: 'FeatureCollection',
      features: locs.map((loc) => ({
        type: 'Feature',
        properties: { kans: loc.kans },
        geometry: { type: 'Point', coordinates: [loc.lng, loc.lat] },
      })),
    })
  }

  return (
    <div ref={containerRef} className="w-full h-full" aria-label="Zeevonk voorspellingskaart" />
  )
}
