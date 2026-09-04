# Module: `hydromet`

| | |
|---|---|
| **Owner** | `<TBD>` |
| **Status** | in progress — weather (NWDP) built; river levels, reservoirs, and thresholds still planned |
| **Backend** | `src/controllers/weather.controller.ts`, `src/repositories/weather.repository.ts`, `src/models/weather.model.ts`, `src/services/ingestion/connectors/nwdp.connector.ts` |
| **Web** | `src/features/weather/` |
| **Mobile** | not in this repo |

> **2026-09-04 — schema and API superseded the original plan below.** The originally planned
> `stations` / `observations` tables (migrations 008/009, the `Metric` enum in
> `src/types/hydromet.ts`) were never built. What shipped instead is NWDP weather telemetry
> only: `weather_stations` / `weather_observations` (migrations 010/011), seven separate
> sources (one per measurement type — rainfall, temperature, humidity, wind speed, wind
> direction, pressure, solar radiation), each upserting only its own column per row. River
> levels, reservoirs, and thresholds (HYD-3, HYD-4, HYD-7) remain unbuilt; the design below for
> those is retained as the plan. `src/types/hydromet.ts` (`StationType`, `Metric`,
> `ThresholdLevel`) is dead code from the superseded plan — not wired to anything — and should
> either be deleted or repurposed when river/reservoir work starts.

---

## 1. Purpose

Owns measurements of water and weather: temperature, rainfall, river levels, and reservoir
levels. Everything here is a time series from a monitoring station, with a value, a timestamp
and a unit.

The distinction that defines this module: an **observation** is measured continuously and is
only meaningful next to its own history, while an **indicator** is a published statistic
compared across districts. Rainfall is an observation; average annual rainfall is an indicator.

## 2. Boundaries

**Owns**
- Monitoring stations: identity, location, the area they sit in, what they measure
- Observations: the time series
- Danger and warning thresholds per river station, as published by the authority
- Forecasts, where a source provides them

**Does not own**
- Warnings derived from measurements — see `alerts.md`. This module records that the Ganga is at
  294.1m; it never decides that constitutes a flood warning. Only an authority does that.
- Long-run climate statistics used for comparison — those are indicators

**Used by other modules via**
- `WeatherRepository.latestReadings(districtId?)` — district dashboard panels (implemented;
  the originally planned `ObservationRepository.latestForAreas(areaIds, metrics)` signature was
  never built — the actual repository returns flat per-field readings, merged by the caller)

**Depends on**

| Module | For | How |
|---|---|---|
| `geography` | placing stations in areas | `AreaRepository.findByCode` |
| `datasets` | provenance, source chain, freshness | connector interface |

## 3. Domain

### Entities — as implemented (NWDP weather)

| Entity | Key fields | Notes |
|---|---|---|
| `weather_stations` row | `id, name, district_id, latitude, longitude, agency, source_id` | one row per physical station; `source_id` is whichever NWDP dataset first registered it |
| `weather_observations` row | `station_id, district_id, source_id, observation_date, <7 nullable measurement columns>, quality_flag, vintage, fetched_at` | one row per `(source_id, station_id, observation_date)`; **only the one column that source measures is non-null** — see the note at the top of this file |
| `WeatherReading` (domain) | `stationId, field, value, sourceId, vintage, fetchedAt, ...` | one row mapped to its single populated field; matches `HasProvenance` directly |
| `WeatherSnapshot` (domain) | one nullable field per measurement type + `observedAt` | built by merging several `WeatherReading`s — never read directly off one DB row |

`WeatherField` (`src/models/weather.model.ts`): `rainfallMm \| temperatureCelsius \| humidityPercent \|
windSpeedKmh \| windDirectionDegrees \| pressureMb \| solarRadiationWM2`.

### Entities — planned, not yet built (river, reservoir, thresholds, forecasts)

| Entity | Key fields | Notes |
|---|---|---|
| Station (river/reservoir) | `id, source_station_code, type, name_en, name_hi, area_id, lat, lng, river_name, source_id` | |
| Observation (generic) | `station_id, metric, observed_at, value, unit, source_id, fetched_at` | the time series |
| Threshold | `station_id, level, value, unit, source_id` | warning / danger levels, published by CWC |
| Forecast | `area_id, metric, valid_from, valid_to, value, source_id, fetched_at` | only where a source provides it |

### Enums (planned, not yet built)

```ts
enum StationType { Weather = 'weather', River = 'river', Reservoir = 'reservoir' }
enum Metric {
  TemperatureC = 'temperature_c', RainfallMm = 'rainfall_mm', HumidityPct = 'humidity_pct',
  RiverLevelM = 'river_level_m', ReservoirLevelM = 'reservoir_level_m', ReservoirStorageMcm = 'reservoir_storage_mcm',
}
enum ThresholdLevel { Warning = 'warning', Danger = 'danger', HighestFloodLevel = 'hfl' }
```

`src/types/hydromet.ts` still declares these three enums from the original plan, but nothing
imports it — it predates the NWDP schema and should be deleted or repurposed when river/reservoir
work starts, not treated as current.

### Rules

| # | Rule |
|---|---|
| HYD-1 | An observation is uniquely identified by `(source_id, station_id, observation_date)`. Re-ingestion updates in place. (Implemented as the NWDP unique key `uq_nwdp_record`; the original `(station_id, metric, observed_at)` design was never built.) |
| HYD-2 | Units are stored explicitly per row and never assumed from the metric. Upstream sources change units without notice. |
| HYD-3 | A river level is never displayed without its station's danger threshold, when one is known. The number alone means nothing to a reader. *(Planned — no river stations ingested yet.)* |
| HYD-4 | Crossing a threshold is displayed as a fact ("above danger level") and never as a warning or instruction. Warnings come from `alerts` and only from an authority (ALR-6). *(Planned.)* |
| HYD-5 | The source chain is ordered per metric and the source actually used is shown to the user. IMD and OpenWeatherMap must never be presented as interchangeable. *(Not yet applicable — NWDP is currently the only weather source; no fallback chain exists.)* |
| HYD-6 | Observations older than their source's cadence are shown with their timestamp and a staleness state, never hidden and never presented as current. Implemented via `attachProvenance`/`freshnessOf`, same as every other domain module. |
| HYD-7 | Reservoir figures ingested manually from a PDF carry the same provenance as any API row, with `AccessMethod.Manual`. *(Planned — no reservoir data ingested yet.)* |
| HYD-8 | A `weather_observations` row carries exactly one non-null measurement column — the one its `source_id`'s NWDP dataset measures. A "current conditions" snapshot is never read off a single row; it is built by taking the freshest reading **per measurement type**, independently, then merging (`mergeSnapshot` in `weather.model.ts`). |

### Permissions

Fully public, read-only. Manual reservoir entry is the one write path, restricted to operators
and recorded as an ingestion run.

## 4. Data

### Implemented

| Table | Purpose | Notes |
|---|---|---|
| `weather_stations` | station registry (NWDP) | `010-add-weather-observations.sql` |
| `weather_observations` | time series, one column per measurement type | `010-add-weather-observations.sql`; highest-growth table in the product |

### Indexes and why (implemented)

| Index | Serves |
|---|---|
| `uq_nwdp_record (source_id, station_id, observation_date)` | idempotent upsert (HYD-1/HYD-8); also the seek path for "latest reading for this station+source" |
| `idx_obs_station_date (station_id, observation_date DESC)` | "latest reading for this station" and the chart series |
| `idx_obs_district_date (district_id, observation_date DESC)` | "all readings for a district" — `GET /api/areas/:slug/weather` |
| `idx_obs_source_date (source_id, observation_date DESC)` | ingestion health / freshness checks |

`weather_observations` needs a retention or rollup policy before launch — see Open questions.

### Migrations (implemented)

| # | File | What |
|---|---|---|
| 010 | `010-add-weather-observations.sql` | `weather_stations` + `weather_observations` |
| 011 | `011-seed-nwdp-sources.sql` | registers the seven NWDP sources (`may_redistribute = TRUE`) |

### Planned, not yet built

| Table | Purpose | Notes |
|---|---|---|
| `station_thresholds` | warning/danger levels | rarely changes |
| `forecasts` | forward-looking values | superseded on each run |
| river/reservoir stations and observations | HYD-3, HYD-4, HYD-7 | the original 008/009 migration numbers were never used and are free to reallocate |

## 5. API

### Implemented

| Method | Path | Auth | Cache | Paginated |
|---|---|---|---|---|
| GET | `/api/areas/:slug/weather` | none | 10m | no |
| GET | `/api/weather/stations` | none | 10m | no |
| GET | `/api/weather/summary` | none | 10m | no |

All three are implemented in `src/controllers/weather.controller.ts` /
`src/routes/weather.route.ts`. `GET /api/areas/:slug/weather` is mounted under `/areas` as a
separate `areaWeatherRouter`, the same pattern `alerts` and `indicators` use, so
`areas.route.ts` never has to know this module exists.

Every response's `latest`/per-station `latest` object carries a `provenance: Provenance[]` —
one entry per NWDP source that actually contributed one of its non-null fields (deduped by
`sourceKey`), since a single merged snapshot can draw on up to seven different sources at
once. This is an addition beyond a single-source `provenance` object (what `alerts` and
`indicators` return) — see `weather.model.ts`'s `mergeSnapshot`.

**Errors**

| Constant | Code | HTTP | When |
|---|---|---|---|
| `AREA_NOT_FOUND` | `40001` | 404 | `GET /api/areas/:slug/weather` with an unknown slug |

No weather-specific error code was needed: an unknown district reuses geography's
`AREA_NOT_FOUND`, and "no observation for a field" is represented as `null` in the response,
never a 404 — see HYD-8 and the endpoint spec.

### Planned, not yet built

| Method | Path | Auth | Cache | Paginated |
|---|---|---|---|---|
| GET | `/api/stations/:id/series` | none | 10m | no |
| GET | `/api/rivers/levels` | none | 10m | no |
| GET | `/api/reservoirs` | none | 1h | no |

### `GET /api/rivers/levels` (planned)

| | |
|---|---|
| Auth | none |
| Cache | `cacheMiddleware(CACHE_TTL.OBSERVATIONS)` — 10 minutes |

**Response 200** — every river station with its latest level, its thresholds, the delta since
the previous reading, and the source used.

**Errors**

| Constant | Code | HTTP | When |
|---|---|---|---|
| `OBSERVATION_NOT_AVAILABLE` | `70002` | 404 | no reading within the acceptable window for any station |

### Error code range

`70xxx` — allocated to this module. None of these are wired to any endpoint yet — the
implemented weather endpoints use `AREA_NOT_FOUND` (40001) and `DATABASE_ERROR` (10001) only.
Reserved for when river/reservoir endpoints are built:

| Constant | Code | HTTP |
|---|---|---|
| `STATION_NOT_FOUND` | `70001` | 404 |
| `OBSERVATION_NOT_AVAILABLE` | `70002` | 404 |
| `METRIC_NOT_SUPPORTED` | `70003` | 400 |
| `FORECAST_NOT_AVAILABLE` | `70004` | 404 |
| `THRESHOLD_NOT_DEFINED` | `70005` | 404 |

## 6. UI

| Surface | Route | Rendering | Notes |
|---|---|---|---|
| Web | `/[locale]/weather` | Client Component | state weather and rainfall map |
| Web | `/[locale]/rivers` | Client Component | river levels against thresholds — the module's most important screen |
| Web | `/[locale]/district/[slug]` | Server Component | current conditions panel |

A river level renders as a level against its thresholds, not as a bare number: the reader needs
to see the gap between now and danger at a glance, which is a gauge, not a statistic.

### Data hooks

| Hook | Query key | staleTime |
|---|---|---|
| `useAreaWeather(slug)` | `hydroKeys.weather(slug)` | 10m |
| `useRiverLevels()` | `hydroKeys.rivers()` | 10m |
| `useStationSeries(id, metric)` | `hydroKeys.series(id, metric)` | 10m |

## 7. Failure modes

| Failure | User sees | Handling |
|---|---|---|
| IMD unreachable | OpenWeatherMap values, with the source badge changed accordingly | automatic fallback, visible in the UI (HYD-5) |
| Both weather sources down | last-good readings with timestamps and a staleness badge | never blank |
| CWC dashboard unparseable | last-good river levels, clearly stale | this is the module's most fragile connector |
| Station reports an implausible value | value stored, flagged, not displayed | validate against a plausible range per metric; a river at 9999m is a parse failure, not a flood |
| No threshold defined for a station | level shown with an explicit "no published threshold" note | never invent one |

## 8. Decisions

### `<TBD>` — Ordered source chain per metric, with the source shown

**Context:** IMD requires IP whitelisting with a multi-week lead time; OpenWeatherMap is
available immediately.
**Decision:** each metric has an ordered list of sources. Build against OpenWeatherMap, and
promote IMD above it when access lands, keeping OWM as fallback. The source actually used is
displayed with every value.
**Because:** it unblocks development immediately and turns the IMD approval into a
configuration change. Showing the source is required by the product's core promise anyway.
**Costs:** two connectors for the same metric, and values that differ slightly between sources
across a fallback boundary.
**Revisit if:** IMD access is denied outright, which would make OWM primary permanently.

### `<TBD>` — Record measurements, never derive warnings

**Decision:** this module never creates an alert. Crossing a danger threshold renders as a
factual state, and the corresponding warning appears only if an authority issues one.
**Because:** issuing flood warnings is a government function. A platform that infers them takes
on responsibility it cannot discharge and may contradict the authority.
**Costs:** a river may visibly sit above danger level with no alert shown, which will look like
a bug and needs explaining in the UI.
**Revisit if:** an authority formally asks us to derive them.

### 2026-09-04 — Merge per-field readings into a snapshot; provenance is an array here

**Context:** NWDP splits one physical measurement (rainfall, temperature, ...) per station into
seven independent sources, each upserting only its own column on a shared
`weather_observations` row (HYD-8). A "current conditions" card needs all seven together.
**Decision:** `WeatherRepository` returns flat per-field readings (one per `(station, source)`,
already latest-per-pair). The controller attaches provenance and drops non-redistributable
readings exactly as `alerts`/`indicators` do, then merges the survivors per measurement type
(freshest wins) into a `WeatherSnapshot`. The snapshot carries `provenance: Provenance[]` —
plural, one entry per contributing source — rather than the single `provenance: Provenance |
null` every other domain model uses, because up to seven distinct sources can back one snapshot.
**Because:** the alternative (a giant multi-source SQL join producing one row per station) makes
DS-6 filtering and freshness computation far harder to reason about and test; merging in
application code after the standard `attachProvenance`/`publiclyDisplayable` pipeline keeps the
DS-1/DS-6 guarantees identical to every other module.
**Costs:** an extra merge step per request (bounded — at most 7 readings per station); a
`provenance` shape that's plural here and singular everywhere else, which the frontend must
special-case.
**Revisit if:** NWDP starts publishing all seven measurements from a single source, or a second
domain module needs the same multi-source-merge pattern (promote it to a shared utility then).

## 9. Open questions

- [ ] Retention and rollup for `observations`. At 10-minute granularity across all stations this
      table outgrows everything else. Raw for 90 days then hourly rollups? Needs a decision
      before the first migration. — *owner:* `<TBD>`
- [ ] Does CWC or India-WRIS expose JSON behind the dashboard? An hour with the network tab
      decides between a connector and a scraper. — *owner:* `<TBD>`
- [ ] Which river stations matter for v1? The spec names Ganga and Alaknanda; the full CWC
      station list for Uttarakhand is unconfirmed. — *owner:* `<TBD>`
- [ ] Are published danger and warning levels available per station, or only for major sites?
      HYD-3 depends on this. — *owner:* `<TBD>`
- [ ] THDC and UJVNL publication format and frequency — confirms whether reservoir data is
      manual weekly entry. — *owner:* `<TBD>`
- [ ] Plausible-range bounds per metric for the validation in Failure modes. — *owner:* `<TBD>`
