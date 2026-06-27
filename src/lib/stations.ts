export interface Station {
  id: string
  lat: number
  lng: number
}

export const STATIONS: Station[] = [
  { id: 'waddenzee',     lat: 53.298, lng: 4.914 }, // Vlieland
  { id: 'nl-noord',      lat: 52.668, lng: 4.588 }, // Bergen aan Zee
  { id: 'nl-midden',     lat: 52.106, lng: 4.272 }, // Scheveningen
  { id: 'zeeland-kust',  lat: 51.441, lng: 3.571 }, // Vlissingen
  { id: 'zeeland-delta', lat: 51.626, lng: 3.898 }, // Oosterschelde
  { id: 'belgie',        lat: 51.229, lng: 2.916 }, // Oostende
]

// Vaste toewijzing per locatie-id
export const LOCATIE_STATION: Record<string, string> = {
  'texel-de-koog':             'waddenzee',
  'den-helder':                'waddenzee',
  'den-helder-haven':          'waddenzee',
  'vlieland':                  'waddenzee',
  'terschelling':              'waddenzee',
  'harlingen':                 'waddenzee',

  'bergen-aan-zee':            'nl-noord',
  'egmond-aan-zee':            'nl-noord',
  'castricum-aan-zee':         'nl-noord',

  'zandvoort':                 'nl-midden',
  'noordwijk':                 'nl-midden',
  'katwijk-aan-zee':           'nl-midden',
  'scheveningen':              'nl-midden',
  'kijkduin':                  'nl-midden',
  'hoek-van-holland':          'nl-midden',
  'rockanje':                  'nl-midden',

  'ouddorp':                   'zeeland-kust',
  'renesse':                   'zeeland-kust',
  'domburg':                   'zeeland-kust',
  'westkapelle':               'zeeland-kust',
  'vlissingen':                'zeeland-kust',

  'grevelingen-brouwersdam':   'zeeland-delta',
  'veerse-meer':               'zeeland-delta',
  'oosterschelde-zeelandbrug': 'zeeland-delta',
  'yerseke':                   'zeeland-delta',
  'westerschelde-borsele':     'zeeland-delta',

  'de-panne-be':               'belgie',
  'koksijde-be':               'belgie',
  'oostende-be':               'belgie',
  'de-haan-be':                'belgie',
  'blankenberge-be':           'belgie',
  'knokke-heist-be':           'belgie',
}
