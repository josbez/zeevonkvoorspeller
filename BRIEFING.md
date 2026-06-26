# Projectbriefing: Zeevonkvoorspeller

## Een interactieve kaartapplicatie voor bioluminescentie langs de Nederlandse en Belgische kust

---

**Document versie:** 1.0  
**Datum:** 26 juni 2026  
**Status:** Concept — ter bespreking met het team  
**Opgesteld door:** Projectinitiator

---

## 1. Projectoverzicht

### Wat is zeevonk?

Zeevonk is een natuurverschijnsel waarbij zeewater 's nachts oplicht met een blauwig-groen glinstering. Dit licht wordt veroorzaakt door microscopische organismen — voornamelijk *Noctiluca scintillans*, een bioluminescentie-producerende dinoflagellaat — die reageren op mechanische verstoring van het water. Golven, zwemmende dieren en zelfs menselijke beweging in het water zorgen voor een korte lichtflits die het water letterlijk doet vonken.

Het verschijnsel treedt met name op langs de Noordzeekust van Nederland en België, voornamelijk in de zomermaanden (juni tot en met september), wanneer de omstandigheden optimaal zijn: warm oppervlaktewater, weinig wind, een donkere nacht en een hoge concentratie plankton.

### Waarom is dit nuttig?

Zeevonk is prachtig, zeldzaam en moeilijk te voorspellen. Mensen rijden uren naar de kust om het te zien, alleen om teleurgesteld te worden. Er bestaat momenteel geen Nederlandse of Belgische tool die op basis van weersomstandigheden, watertemperatuur, getijden en historische meldingen een betrouwbare voorspelling geeft van wanneer en waar je de meeste kans hebt op zeevonk.

De zeevonkvoorspeller vult dit gat: het is een gratis, toegankelijke webapplicatie die burgers en professionals helpt om dit bijzondere natuurverschijnsel op het juiste moment op de juiste plek te ervaren — en tegelijkertijd bijdraagt aan wetenschappelijk begrip via crowdsourcing van meldingen.

---

## 2. Doelgroep

| Doelgroep | Behoefte | Gebruiksmoment |
|---|---|---|
| **Surfers en kitesurfers** | Weten wanneer het water oplicht tijdens sessies | Avond voor of dag van een sessie |
| **Zwemmers en strandbezoekers** | Een bijzondere nachtelijke ervaring plannen | 1–3 dagen van tevoren |
| **Fotografen (nacht/natuur)** | Optimale omstandigheden voor langbelichtingsfotografie | Meerdere dagen van tevoren, maanfase belangrijk |
| **Wetenschappers en studenten** | Monitoring van *Noctiluca scintillans* populaties | Doorlopend, data-export gewenst |
| **Toeristen en dagjesmenzen** | Bijzondere activiteit combineren met kustbezoek | Spontaan of gepland |
| **Ouders met kinderen** | Educatieve ervaring aanbieden | Weekend, schoolvakanties |
| **Natuurliefhebbers en birdwatchers** | Nachtelijke kustbeleving uitbreiden | Seizoensgebonden |

### Primaire persona (voor MVP-beslissingen)

**Naam:** Lena, 31 jaar, hobbynatuurliefhebber en iPhone-fotograaf uit Utrecht  
**Gedrag:** Controleert buienradar dagelijks, plant weekenduitjes op basis van weer, volgt natuuraccounts op Instagram  
**Pijnpunt:** "Ik heb al drie keer tevergeefs naar de kust gereden voor zeevonk. Ik wist gewoon niet wanneer de kans het grootst was."  
**Wat ze nodig heeft:** Een betrouwbare "go / no-go" indicatie per avond, met uitleg waarom.

---

## 3. Kernfunctionaliteit

### 3.1 Kaartweergave met voorspellingslagen

- Interactieve kaart van de Nederlandse en Belgische Noordzeekust, van Den Helder tot Knokke-Heist
- Kleurgecodeerde heatmap-laag met kanswaarden per kustsegment (groen = hoge kans, grijs = lage kans)
- Klikbare locatiepunten voor bekende zeevonk-hotspots
- Pop-up per locatie met samenvatting van huidige omstandigheden en kanspercentage
- Schakelen tussen kaartlagen: voorspellingsheatmap, historische meldingen, watertemperatuur, windkaart
- GPS-locatiebepaling ("toon mij de dichtstbijzijnde hotspot")

### 3.2 Omgevingsvariabelen als invoer

| Parameter | Bron | Gewicht | Toelichting |
|---|---|---|---|
| **Watertemperatuur** | Copernicus Marine / RWS | Hoog | *Noctiluca* bloeit bij >15°C, optimum ~18–22°C |
| **Windsnelheid** | KNMI / Open-Meteo | Hoog | Minder dan 3 Beaufort is ideaal |
| **Windrichting** | KNMI / Open-Meteo | Middel | Landwaartse wind concentreert plankton aan het oppervlak |
| **Golfhoogte** | Rijkswaterstaat / Copernicus | Hoog | Lage golven (< 0.5 m) zijn ideaal |
| **Getij** | Rijkswaterstaat Getijdienst | Middel | Vlak voor/na hoogwater is zichtbaarheid vaak beter |
| **Maanfase** | Berekend | Hoog | Nieuwe maan = donkerste nachten = indrukwekkendste zeevonk |
| **Seizoen / datum** | Systeem | Hoog | Juli–augustus is het hoogseizoen |
| **Bewolking** | KNMI / Open-Meteo | Middel | Beïnvloedt duisternis en context |
| **Historische meldingen** | Eigen database (crowdsourcing) | Hoog | Recente bevestigde meldingen zijn de sterkste indicator |
| **Chlorofylconcentratie** | Copernicus Marine (satelliet) | Middel | Proxy voor planktonbloei |

### 3.3 Tijdlijn en dagslider

- Horizontale tijdslider: "nu" tot 5 dagen vooruit
- Granulariteit: per 3 uur (weer/wind) en per dag (algehele kans)
- Nacht-venster visueel gemarkeerd (zonsondergang tot zonsopgang)
- Animatiemodus: kaart animeert door de komende 48 uur
- "Beste avond"-knop: systeem berekent optimale avond per geselecteerde locatie

### 3.4 Meldingsfunctie (crowdsourcing)

**Meldingsformulier:**
- Locatie (GPS of kies op kaart)
- Tijdstip (automatisch of handmatig)
- Intensiteit (schaal 1–5: "flauw glinsteren" tot "helder oplichtende golven")
- Optionele foto (v2)
- Vrij tekstveld

**Weergave van meldingen:**
- Geverifieerde meldingen van afgelopen 24 uur als pulserende iconen op de kaart
- Meldingen ouder dan 72 uur worden automatisch gearchiveerd

---

## 4. Data & API's

### 4.1 Databronnen

**Weer:**
- **Open-Meteo** — windsnelheid, windrichting, bewolking (gratis, geen API-sleutel, 1 km resolutie, 7 dagen vooruit) — *primaire weersbron MVP*
- **KNMI Data Platform** — historische data voor modelcalibratie

**Golven en getijden:**
- **Rijkswaterstaat Waterwebservices** — getijdenvoorspelling en golfhoogte per meetpunt
- **Copernicus Marine (NWSHELF_ANALYSISFORECAST_WAV)** — golfhoogte Noordzee, ~1.5 km resolutie

**Watertemperatuur:**
- **Copernicus Marine (NORTHWESTSHELF_ANALYSIS_FORECAST_PHY)** — SST Noordzee, dagelijkse updates — *primaire bron*
- **Rijkswaterstaat meetstations** — backup/validatie op vaste punten

**Biologisch:**
- **Copernicus Marine — chlorofyl** — weekgemiddelde als achtergrondlaag
- **GBIF** — historische *Noctiluca scintillans* waarnemingen
- **Waarneming.nl / iNaturalist** — NL/BE zeevonkmeldingen als historische dataset

**Maanfase:** berekend via `suncalc` (JavaScript), geen externe API nodig

### 4.2 Cache-strategie

| Databron | Cache TTL |
|---|---|
| Weerdata (Open-Meteo) | 1 uur |
| Getijden (RWS) | 6 uur |
| Golfdata (Copernicus) | 3 uur |
| Watertemperatuur (Copernicus) | 12 uur |
| Crowdsource-meldingen | 5 minuten |

---

## 5. Technische Stack

### 5.1 Aanbevolen stack

```
Frontend:
  Next.js 14+ (App Router) — SSR voor SEO, API Routes als BFF
  Tailwind CSS + shadcn/ui — nachtthema, responsive
  Mapbox GL JS — nachtkaartthema's, heatmap (fallback: Leaflet + MapLibre)
  Recharts of Nivo — tijdlijn-grafieken

Backend / Data:
  Supabase — PostgreSQL + PostGIS, Realtime, Auth, Storage
  Vercel Edge Functions — API-aggregatie en caching
  Vercel KV (Redis) — caching van externe API-responses

Predictiemodel (MVP):
  Gewogen scoremodel in TypeScript — transparant, uitlegbaar, geen ML-overhead

Monitoring:
  Sentry — foutmonitoring
  Vercel Analytics — performance
  Plausible — privacy-vriendelijk gebruikersgedrag
```

### 5.2 Architectuuroverzicht

```
Gebruiker (browser/mobiel)
      │
      ▼
  Next.js App (Vercel Edge)
      │
      ├── /kaart          → statische pagina + client-side Mapbox
      ├── /api/voorspelling → aggregeert weer, golf, getijden, temp
      ├── /api/meldingen   → CRUD naar Supabase
      └── /api/locaties    → kustsegmenten en hotspots
            │
            ├── Open-Meteo API
            ├── Rijkswaterstaat Waterinfo API
            ├── Copernicus Marine REST API
            └── Supabase (meldingen, locaties, gebruikers)
```

---

## 6. Design Vereisten

### 6.1 Kleurenpalet

| Token | Hex | Gebruik |
|---|---|---|
| `color-background` | `#050d1a` | Nacht-achtergrond |
| `color-surface` | `#0d1f35` | Panelen, kaarten |
| `color-zeevonk-primary` | `#00e5ff` | Primaire accentkleur |
| `color-zeevonk-glow` | `#7efff5` | Hover, bioluminescentie-glow |
| `color-zeevonk-deep` | `#0052cc` | Lage kanswaarden heatmap |
| `color-success` | `#39ff14` | Bevestigde meldingen |
| `color-warning` | `#ffb703` | Matige kans |
| `color-text-primary` | `#e8f4f8` | Primaire tekst |
| `color-text-secondary` | `#8bb8cc` | Labels |

**Typografie:**
- Koppen: `Space Grotesk` of `Outfit`
- Body: `Inter`
- Data/cijfers: `JetBrains Mono`

**Sfeer:** glasmorfisme voor UI-elementen, zachte gloed-effecten, rustige animaties.

### 6.2 Mobiel-first

- Ontwerp eerst voor 375px (iPhone SE), schaal daarna op
- Kaart neemt 60–70% van het scherm in op mobiel
- Bottom sheet-patroon voor detailinformatie
- Aanraakdoelen minimaal 48×48px (gebruik met natte vingers)
- Streef naar < 2 seconden LCP op 4G

### 6.3 Toegankelijkheid

- WCAG 2.1 niveau AA minimum
- Kleurcontrast: minimaal 4.5:1 voor kleine tekst
- Heatmap niet alleen op kleur: ook patronen/iconen (kleurenblindheid)
- Volledig toetsenbord-bedienbaar
- ARIA-labels op alle kaartcomponenten
- Altijd handmatig locatie kunnen kiezen (naast GPS)

**Thema:** MVP uitsluitend donker (bewuste keuze — het is een nacht-app). Licht thema in v2.

---

## 7. MVP Scope

### In de MVP (v1.0)

- Interactieve kaart NL + BE kust met Mapbox
- Heatmap met dagelijkse kansvoorspelling per locatie
- ~20 klikbare kustsegmenten met detailpaneel
- Tijdslider: 5 dagen vooruit, dagresolutie
- Meldingsformulier: locatie, tijdstip, intensiteit, tekst
- Meldingen zichtbaar op kaart (afgelopen 24 uur)
- Maanfase-indicator
- Responsive design (mobiel + desktop)
- "Wat is zeevonk?"-uitlegpagina
- Nederlandstalige interface

### Niet in de MVP

- Gebruikersaccounts en profielen
- Foto-uploads
- Push- of e-mailnotificaties
- ML-model
- Franstalige interface
- Uur-voor-uur-voorspelling
- Data-export voor wetenschappers
- API voor derden
- Offline-modus / PWA

---

## 8. Uitbreidingen voor V2

- **Notificaties:** pushberichten en e-maildigest per locatie en drempelwaarde
- **Gebruikersprofielen:** favoriete locaties, meldingsgeschiedenis, badges
- **Fotogallerij:** uploads bij meldingen, publieke gallerij per locatie
- **ML-voorspelmodel:** Random Forest getraind op historische data, maandelijkse hercalibratie
- **Wetenschappelijke module:** CSV/JSON-export, GBIF-integratie
- **Widget + publieke API:** embedbaar voor strandwebsites, freemium API
- **Meertaligheid:** Frans (BE kust), Engels
- **PWA / Offline:** installeerbaar, meldingen sturen bij herverbinding

---

## 9. Tijdlijn Indicatie

*Team: 1 designer, 2 full-stack developers, 1 data-specialist (deeltijd)*

| Fase | Inhoud | Duur |
|---|---|---|
| **Fase 0 — Voorbereiding** | API-accounts, design system, DB schema, CI/CD | 2 weken |
| **Fase 1 — Fundament** | Kaartintegratie, datastroom, scoremodel, heatmap | 3 weken |
| **Fase 2 — Kernfunctionaliteit** | Detailpaneel, tijdslider, meldingen, maanfase | 4 weken |
| **Fase 3 — Afwerking** | Gebruikerstests, toegankelijkheid, performance, bugfixes | 2 weken |
| **Fase 4 — Zachte lancering** | Beta met besloten groep, feedback verwerken | 1 week |
| **Fase 5 — Publieke lancering** | PR, GBIF-aanmelding, V2-planning | — |

**Totale doorlooptijd MVP: ~12 weken**

---

## 10. Open Vragen voor het Team

### Technisch
1. **Mapbox vs. Leaflet:** Mapbox = mooier + eenvoudiger heatmap, maar betaald bij schaal. Leaflet + MapLibre = volledig open source. *Beslissing nodig vóór Fase 1.*
2. **Modelvalidatie:** Samenwerken met universiteit (Wageningen, NIOZ) voor wetenschappelijke validatie?
3. **Copernicus-pipeline:** Waar draait de zware NetCDF-verwerking? (Vercel heeft limieten — overweeg AWS Lambda of GitHub Actions cron-job)
4. **Realtime vs. periodiek:** Is Supabase Realtime nodig, of volstaat een refresh elke 5 minuten voor MVP?

### Product
5. **Moderatie meldingen:** Volautomatisch (risico op spam) vs. handmatige wachtrij (arbeidsintensief). *Voorstel: automatisch publiceren + community-flagging + wekelijkse handmatige review.*
6. **Drempel "hoge kans":** Wat is de grenswaarde voor groen op de heatmap? Te permissief = teleurgestelde gebruikers.
7. **Belgische kust in MVP:** Volledig toevoegen (andere datasources: RMI, andere getijdata) of beginnen puur Nederlands?
8. **Naam en domein:** "Zeevonkvoorspeller" is beschrijvend maar lang — kortere merknaam overwegen? *Actiepunt: domeincheck.*

### Juridisch / Privacy
9. **AVG/GDPR:** Meldingen bevatten locatiedata. Welke gegevens slaan we op? Cookiebanner nodig? *Privacy-specialist raadplegen vóór lancering.*
10. **Attributie open data:** Copernicus, KNMI en RWS vereisen naamsvermelding — correct verwerken in UI en docs.
11. **Aansprakelijkheid:** Disclaimer toevoegen: dit is een informatieve app, geen navigatiehulpmiddel.

---

## Bijlage A — Kustsegmenten MVP (~20 locaties)

**Nederland (noord → zuid):**
Texel (De Koog), Den Helder, Bergen aan Zee, Egmond aan Zee, Castricum aan Zee, Zandvoort, Noordwijk, Katwijk aan Zee, Scheveningen, Kijkduin, Hoek van Holland, Rockanje, Ouddorp, Renesse, Domburg, Vlissingen

**België (west → oost):**
De Panne, Koksijde, Oostende, De Haan, Blankenberge, Knokke-Heist

---

## Bijlage B — Inspiratiebronnen

- **Windy.com** — rijke kaartvisualisatie met tijdslider
- **Buienradar** — vertrouwde NL UX-patronen
- **iNaturalist** — crowdsourcing UX voor biologische meldingen
- **Surf-forecast.com** — meerlaagse surfcondities per locatie
- **NIOZ onderzoek Noctiluca scintillans Noordzee** — wetenschappelijke basis

---

*Vragen over dit document? Neem contact op met de projectinitiator. Dit is een startpunt voor discussie — geen vaste specificatie.*

**Volgende stap:** Plan een kickoff van 2 uur met het volledige team om de open vragen door te lopen, MVP-prioriteiten te stellen en een eerste sprintplanning te maken.
