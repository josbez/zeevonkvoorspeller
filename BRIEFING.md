# Projectbriefing: Zeevonkvoorspeller

## Een interactieve kaartapplicatie die voorspelt waar en wanneer zeevonk zichtbaar is

---

**Document versie:** 2.0  
**Datum:** 26 juni 2026  
**Status:** Bijgewerkt na feedbackronde opdrachtgever  
**Opgesteld door:** Projectinitiator

---

## 1. Projectoverzicht

### Wat is zeevonk?

Zeevonk is een natuurverschijnsel waarbij zeewater 's nachts oplicht met een blauwig-groen glinstering. Dit licht wordt veroorzaakt door microscopische organismen — voornamelijk *Noctiluca scintillans*, een bioluminescentie-producerende dinoflagellaat — die reageren op mechanische verstoring van het water. Golven, zwemmende dieren en zelfs menselijke beweging in het water zorgen voor een korte lichtflits.

Het verschijnsel treedt op langs de Noordzeekust van Nederland en België, maar ook in zoutwater-estuaria en binnenzeeën zoals de Oosterschelde, Waddenzee en vermoedelijk de Grevelingen.

### Kernidee van de app

De zeevonkvoorspeller is een **weervoorspellingstool voor zeevonk** — vergelijkbaar met Buienradar, maar dan voor bioluminescentie. De app combineert meteorologische en oceanografische data tot een dagelijkse kansvoorspelling per locatie, weergegeven op een visueel indrukwekkende interactieve kaart.

Het is **geen community-platform**. Er zijn geen meldingen, geen gebruikersaccounts, geen feeds. De app vertelt je op basis van data: vanavond, op deze plek, is de kans X%.

### Waarom is dit nuttig?

Er bestaan al twee Nederlandse tools (`zeevonkmelding.nl`, `zeevonkvoorspelling.nl`) die rudimentaire voorspellingen bieden. De zeevonkvoorspeller onderscheidt zich door:
- Een wetenschappelijk onderbouwd voorspelmodel (in samenwerking met een meteoroloog)
- Dekking van estuaria en binnenzeeën, niet alleen de Noordzeekust
- Visueel superieure kaartervaring met bioluminescentie-animaties
- Mobiel-first ontwerp voor gebruik op het strand

---

## 2. Doelgroep

| Doelgroep | Behoefte | Gebruiksmoment |
|---|---|---|
| **Surfers en kitesurfers** | Weten wanneer het water oplicht tijdens sessies | Avond voor of dag van een sessie |
| **Zwemmers en strandbezoekers** | Een bijzondere nachtelijke ervaring plannen | 1–3 dagen van tevoren |
| **Fotografen (nacht/natuur)** | Optimale omstandigheden voor langbelichtingsfotografie | Meerdere dagen van tevoren, maanfase belangrijk |
| **Wetenschappers en studenten** | Monitoring van *Noctiluca scintillans* populaties | Doorlopend |
| **Toeristen en dagjesmenzen** | Bijzondere activiteit combineren met kustbezoek | Spontaan of gepland |
| **Ouders met kinderen** | Educatieve ervaring aanbieden | Weekend, schoolvakanties |
| **Zeilers en watersporters (estuaria)** | Zeevonk op de Grevelingen, Oosterschelde, Waddenzee | Seizoensgebonden |

### Primaire persona

**Naam:** Lena, 31 jaar, hobbynatuurliefhebber en iPhone-fotograaf uit Utrecht  
**Pijnpunt:** "Ik heb al drie keer tevergeefs naar de kust gereden voor zeevonk. Ik wist gewoon niet wanneer de kans het grootst was."  
**Wat ze nodig heeft:** Een betrouwbare go/no-go indicatie per avond, met uitleg waarom.

---

## 3. Locaties: kust én estuaria

### Wetenschappelijke basis voor uitbreiding

*Noctiluca scintillans* is niet beperkt tot de open Noordzee. De soort gedijt bij saliniteit 17–45 psu en kan voorkomen in alle zoutwatermilieus die voldoende verbonden zijn met de zee. Uit analyse van waarneming.nl, iNaturalist, NDFF en Oosterscheldeboer.nl:

| Locatietype | Status |
|---|---|
| Noordzeekust NL + BE | Geverifieerd — primaire locaties |
| Waddenzee | Geverifieerd — *Noctiluca* overwintert hier |
| Oosterschelde | Geverifieerd — expliciete meldingen |
| Westerschelde | Geverifieerd — tot in havengebied Antwerpen |
| Grevelingen | Waarschijnlijk — zoutwatermeer (~30 psu), geen harde bevestiging maar omstandigheden kloppen |
| Veerse Meer | Waarschijnlijk — vergelijkbaar profiel als Grevelingen |
| IJsselmeer | Niet geschikt — zoet water |
| Volkerak-Zoommeer | Niet geschikt — zoet water |

### Locatielijst MVP (~30 locaties)

**Noordzeekust Nederland (noord → zuid):**
Texel (De Koog), Den Helder, Bergen aan Zee, Egmond aan Zee, Castricum aan Zee, Zandvoort, Noordwijk, Katwijk aan Zee, Scheveningen, Kijkduin, Hoek van Holland, Rockanje, Ouddorp, Renesse, Domburg, Westkapelle, Vlissingen

**Zeeuwse Delta en estuaria:**
Grevelingen (Brouwersdam), Veerse Meer, Oosterschelde (Zeelandbrug, Yerseke), Westerschelde (Borsele, Terneuzen)

**Waddenzee:**
Den Helder (haven), Harlingen, Vlieland (haven), Terschelling (West-Terschelling)

**Belgische kust (west → oost):**
De Panne, Koksijde, Oostende, De Haan, Blankenberge, Knokke-Heist

---

## 4. Kernfunctionaliteit

### 4.1 Kaartweergave met voorspellingslagen

De kaart is het centrale element. Gebruiker ziet direct waar de kans het hoogst is.

- Interactieve Mapbox-kaart in nachtmodus, dekking NL + BE kust én estuaria
- Kleurgecodeerde heatmap per locatie (kanswaarde 0–100%)
- Klikbare locatiepunten met detailpaneel: kanspercentage + top-3 bepalende factoren
- Schakelbare kaartlagen: voorspelling, watertemperatuur, windkaart
- GPS: "toon mij de dichtstbijzijnde hotspot"
- "Beste avond"-knop: systeem berekent optimale avond komende week per locatie

### 4.2 Omgevingsvariabelen

| Parameter | Bron | Gewicht | Toelichting |
|---|---|---|---|
| **Watertemperatuur** | Copernicus Marine / RWS | Hoog | Optimum ~18–22°C |
| **Windsnelheid** | Open-Meteo | Hoog | < 3 Beaufort ideaal |
| **Windrichting** | Open-Meteo | Middel | Landwaartse wind concentreert plankton |
| **Golfhoogte** | RWS / Copernicus | Hoog | < 0.5 m ideaal |
| **Getij** | RWS Getijdienst | Middel | Vlak voor/na hoogwater |
| **Maanfase** | Berekend (suncalc) | Hoog | Nieuwe maan = donkerste nacht |
| **Seizoen / datum** | Systeem | Hoog | Piek juni–augustus |
| **Bewolking** | Open-Meteo | Middel | Beïnvloedt duisternis |
| **Chlorofylconcentratie** | Copernicus Marine (satelliet) | Middel | Proxy voor planktonbloei |
| **Saliniteit** | Copernicus Marine / RWS | Hoog | Kritisch voor estuaria (min. 17 psu) |

*Weging wordt wetenschappelijk vastgesteld door de meteoroloog op basis van literatuur en initiële validatie.*

### 4.3 Tijdlijn en dagslider

- Horizontale tijdslider: "nu" tot 5 dagen vooruit
- Granulariteit: per 3 uur (weer) en per dag (kans)
- Nachtvenster visueel gemarkeerd (zonsondergang–zonsopgang)
- Animatiemodus: kaart animeert vloeiend door de komende 48 uur
- Bij scrubben: vloeiende overgang van heatmap en zeevonk-animaties

---

## 5. Visuele Animaties: bioluminescentie op de kaart

Dit is een kernonderdeel van de visuele identiteit. De kaart voelt aan alsof je 's nachts naar zee kijkt — levend, glinstering, ingetogen maar indrukwekkend.

### Animatieconcept (motion designer + senior frontend)

**Particle-systeem op hotspots:**
- Op locaties met hoge kanswaarde: gloeiende lichtpartikels die zich gedragen als bioluminescentie in water
- Aantal en intensiteit van partikels schaalt lineair met kanspercentage (10% = sporadisch, 90% = dicht, helder glinstering)
- Implementatie: WebGL via Mapbox GL custom layer, of Three.js canvas over de kaart
- Partikels bewegen langzaam en onregelmatig (geen strakke patroon), reageren subtiel op wind-richting uit de data

**Glow-effect op locatiepunten:**
- Pulserende `box-shadow` / radial gradient glow in `#00e5ff` en `#7efff5`
- Pulsefrequentie: ~0.8–1.2 seconden, licht gerandomiseerd per locatie
- Bij hover: glow explodeert kort en kalmeert weer (GSAP `timeline`)

**Heatmap-animatie:**
- Heatmap is niet statisch — zachte "adem"-animatie: opacity pulseert tussen 0.7–1.0
- Bij tijdlijn-scrub: vloeiende morph van kanswaarden via interpolatie (geen harde cut)
- Gebruik Mapbox `setPaintProperty` met `requestAnimationFrame` voor smooth transitions

**Golf-effect op watergebieden:**
- Subtiele sinusgolf-animatie als overlay op de kaartlaag boven wateroppervlakken
- Geïmplementeerd als SVG-filter of canvas-shader
- Beweegt langzaam in de richting van de winddata

**Performance-richtlijnen:**
- Alles via `requestAnimationFrame`, nooit `setInterval` voor animaties
- Particle-count beperkt: max 200 actieve partikels per viewport
- Zware WebGL-effecten worden disabled op low-end devices (via `navigator.hardwareConcurrency < 4` check)
- Lazy load animatiebibliotheek na initiële kaartrender

**Tooling voor motion designer en frontend:**
- GSAP — microinteracties, glow-pulses, hover-animaties
- Three.js of Deck.gl — particle-systeem als WebGL-overlay op Mapbox
- Mapbox GL custom layers — directe WebGL-integratie in de kaartrenderpipeline
- Framer Motion — UI-transitities (paneel openen/sluiten, slider)

---

## 6. Team

| Rol | Verantwoordelijkheid |
|---|---|
| **Projectinitiator / PO** | Visie, prioriteiten, stakeholdercommunicatie |
| **UX designer** | Gebruikersstromen, wireframes, mobiel-first ontwerp, toegankelijkheid |
| **Motion designer** | Animatieconcept bioluminescentie, microinteracties, design van particle-systeem, samenwerking met frontend |
| **Senior frontend developer** | Next.js app, Mapbox-integratie, WebGL-animaties, performance |
| **Full-stack developer** | Data-pipeline, API-integraties, Supabase, GitHub Actions cron-jobs |
| **Meteoroloog** | Wetenschappelijke weging van voorspelmodel, beoordeling van omgevingsvariabelen, calibratie per locatietype (kust vs. estuarium) |

---

## 7. Data & API's

### 7.1 Databronnen

| Bron | Data | Cache TTL |
|---|---|---|
| **Open-Meteo** | Wind, bewolking, luchttemperatuur | 1 uur |
| **RWS Waterwebservices** | Getijden, golfhoogte, watertemperatuur meetpunten | 3–6 uur |
| **Copernicus Marine (PHY)** | SST Noordzee en estuaria, saliniteit | 12 uur |
| **Copernicus Marine (WAV)** | Golfhoogte en -periode | 3 uur |
| **Copernicus Marine (BGC)** | Chlorofylconcentratie (satelliet) | 24 uur |
| **suncalc (berekend)** | Maanfase, zonsondergang/opgang | Statisch |
| **KNMI Data Platform** | Historische calibratiedata | Eenmalig / maandelijks |

### 7.2 Data-pipeline

De Copernicus NetCDF-bestanden zijn groot en kunnen niet realtime worden verwerkt. Pipeline:

```
GitHub Actions cron-job (2× per dag)
  → Download NetCDF van Copernicus Marine API
  → Verwerk naar GeoJSON-puntenset per locatie (Python: xarray, netCDF4)
  → Sla verwerkte JSON op in Supabase Storage
  → Trigger cache-invalidatie van Vercel Edge

Next.js Route Handler /api/voorspelling
  → Haal pre-processed data op uit Supabase Storage
  → Combineer met realtime Open-Meteo + RWS data
  → Bereken kansindex per locatie
  → Return als GeoJSON aan de client
```

---

## 8. Technische Stack

```
Frontend:
  Next.js 14+ (App Router) — SSR, API Routes als BFF
  Tailwind CSS + shadcn/ui
  Mapbox GL JS — kaart, heatmap, custom WebGL layers
  GSAP — microinteracties en glow-animaties
  Three.js of Deck.gl — particle-systeem bioluminescentie
  Framer Motion — UI-transities

Backend / Data:
  Supabase — PostgreSQL + PostGIS, Realtime, Storage
  Vercel Edge Functions — API-aggregatie, kansberekening
  Vercel KV (Redis) — caching van externe API-responses

Data-pipeline:
  GitHub Actions — cron-job voor Copernicus-verwerking (2× daags)
  Python (xarray, netCDF4, geopandas) — NetCDF → GeoJSON transformatie
  Supabase Storage — opslag van verwerkte geodata

Development workflow:
  GitHub + Claude — volledige stack wordt beheerd en gedeployed via GitHub
  Vercel — automatische deploys op push naar main

Monitoring:
  Sentry — foutmonitoring
  Vercel Analytics — performance
  Plausible — privacy-vriendelijk gebruikersgedrag
```

---

## 9. Design Vereisten

### 9.1 Kleurenpalet

| Token | Hex | Gebruik |
|---|---|---|
| `color-background` | `#050d1a` | Nacht-achtergrond |
| `color-surface` | `#0d1f35` | Panelen |
| `color-zeevonk-primary` | `#00e5ff` | Primaire accentkleur, glow |
| `color-zeevonk-glow` | `#7efff5` | Hover, particle-kern |
| `color-zeevonk-deep` | `#0052cc` | Lage kanswaarden |
| `color-success` | `#39ff14` | Hoge kans indicator |
| `color-warning` | `#ffb703` | Matige kans |
| `color-text-primary` | `#e8f4f8` | |
| `color-text-secondary` | `#8bb8cc` | Labels, metadata |

**Typografie:** `Space Grotesk` (koppen) · `Inter` (body) · `JetBrains Mono` (data/percentages)

### 9.2 Mobiel-first

- Ontwerp eerst voor 375px, schaal daarna op
- Kaart neemt 65% van het scherm in op mobiel; panelen zijn bottom sheets
- Aanraakdoelen minimaal 48×48px
- Animaties worden gereduceerd bij `prefers-reduced-motion`
- Doel: < 2 seconden LCP op 4G

### 9.3 Toegankelijkheid

- WCAG 2.1 niveau AA
- Heatmap niet alleen op kleur: ook intensiteitspatroon
- Volledig toetsenbord-bedienbaar
- Alle kaartcomponenten hebben ARIA-labels

**Thema:** uitsluitend donker in MVP (bewuste keuze — nacht-app).

---

## 10. MVP Scope

### In de MVP (v1.0)

- Interactieve Mapbox-kaart met nachtthema
- Heatmap dagelijkse kansvoorspelling per locatie (~30 locaties: kust + estuaria)
- Klikbaar detailpaneel per locatie met kanspercentage + bepalende factoren
- Tijdslider: 5 dagen vooruit, dagresolutie
- Bioluminescentie-animaties op de kaart (particles, glow, golf-effect)
- Maanfase-indicator
- "Beste avond"-berekening per locatie
- Responsive design (mobiel-first + desktop)
- "Wat is zeevonk?"-uitlegpagina
- Nederlandstalige interface
- GitHub Actions pipeline voor Copernicus-data

### Niet in de MVP

- Gebruikersaccounts
- Meldingsfunctie / crowdsourcing
- Push- of e-mailnotificaties
- ML-model (gewogen scoremodel is MVP)
- Uur-voor-uur-voorspelling
- Data-export
- API voor derden
- Offline / PWA
- Franstalige interface

---

## 11. Roadmap na MVP

### Fase 2A — Crowdsourcing

- Meldingsfunctie: gebruikers kunnen zeevonk rapporteren (locatie, intensiteit, foto)
- Meldingen verrijken het voorspelmodel als realtime-signaal
- Moderatie en verificatie

### Fase 2B — Uitbreiding naar andere fenomenen

De voorspellingsinfrastructuur is herbruikbaar voor andere kust- en weerverschijnselen. Elk fenomeen krijgt een eigen kaartlaag met bijpassende animatie en kleurpalet.

**Kustnatuur:**
- **Kwallenstrand** — kans op kwallen per locatie op basis van stroming en temperatuur
- **Algenbloeien** — cyanobacteriën of andere bloeien op basis van nutriënten en temperatuur
- **Groene zee** — chlorofyl-bloei die het water groen kleurt

**Bijzondere wolkenformaties:**
- **Shelf cloud (boogwolk)** — voorspelling van arcus-wolken bij naderende buienlijn, op basis van CAPE, windshear en frontale activiteit
- **Supercell** — kans op rotaterende onweersbuien, gebaseerd op atmosferische instabiliteit (CAPE > 1500 J/kg), windshear en vochtigheid
- **Mammatus** — zakwolken onder aambeeldwolken, indicator van sterke convectie
- **Lenticularis** — linsvormige wolken boven reliëf, op basis van windprofiel en stabiliteitsgradient
- **Noctiluca-wolken (NLC)** — ijswolken op 80 km hoogte, zichtbaar in de schemering in zomer; op basis van seizoen, breedtegraad en atmosferische condities

**Licht en lucht:**
- **Nachtlicht / Melkweg** — luchtkwaliteitsvoorspelling voor sterrenkijken aan de kust (Bortle-schaal, luchtvochtigheid, bewolking)
- **Groene flits** — zeldzaam optisch verschijnsel bij zonsondergang boven zee
- **Stormvloed / hoogwater** — waarschuwingen per locatie op basis van RWS-getijdendata

### Fase 3 — Platform

- Notificaties (push, e-mail) per locatie en drempelwaarde
- Publieke API voor strandwebsites en VVV-portals
- Meertaligheid (Frans voor Belgische kust, Engels)
- PWA / offline-modus

---

## 12. Open Vragen voor het Team

### Product
1. **Drempel "hoge kans":** Wat is de grenswaarde voor groen op de heatmap? Beslissing in overleg met meteoroloog na eerste modelrun.
2. **Saliniteitsdata voor Grevelingen:** RWS heeft meetpunten op de Grevelingen (Brouwershaven). Controleren of deze realtime beschikbaar zijn via Waterwebservices.
3. **Fase 2B prioriteit:** Welk fenomeen na zeevonk als eerste? Kwallen lijken het meest voor de hand te liggen (brede doelgroep, vergelijkbare data).

### Technisch
4. **Particle-library:** Three.js (volledige controle, zware setup) vs. Deck.gl ScatterplotLayer (sneller te integreren met Mapbox, minder flexibel). Motion designer en frontend beslissen samen.
5. **GitHub Actions runner:** Python-pipeline draait op ubuntu-latest. Copernicus-bestanden kunnen 200–500 MB zijn. Controleer of artifact storage en runtime voldoende zijn, of Supabase Storage als tussenopslag nodig is.

### Juridisch / Privacy
6. **Aansprakelijkheid:** Disclaimer toevoegen — informatieve tool, geen navigatiehulpmiddel.
7. **Attributie:** Copernicus, KNMI en RWS vereisen naamsvermelding in UI en documentatie.

---

*Dit document is het startpunt voor de kickoff. Volgende stap: 2-uurs sessie met het volledige team (inclusief motion designer, UX designer en meteoroloog) voor sprintplanning en beslissingen op de open vragen.*
