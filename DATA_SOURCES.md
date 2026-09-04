# Pahad Pulse — Real Data Sources Status

**Last Updated:** 2026-09-04

## Verified & Connected ✅

### 1. IMD CAP Alerts (India Meteorological Department)
- **Endpoint:** `https://cap-sources.s3.amazonaws.com/in-imd-en/rss.xml`
- **Format:** CAP 1.2 (Common Alerting Protocol) via RSS feed
- **Verification Date:** 2026-09-03 (confirmed returning real data)
- **Access:** Public, no authentication required
- **Refresh Cadence:** Realtime (ingests on demand, max 30 items/run)
- **Data Included:**
  - Weather alerts (heavy rainfall, heat waves, cold waves, thunderstorms, etc.)
  - Wind warnings
  - Frost/fog warnings
  - Other meteorological alerts
- **Geographic Coverage:** All-India (filtered for Uttarakhand relevance)
- **Database Schema:** `alerts` table with areas through `alert_areas`
- **Provenance Tracking:** source_id, source_alert_id, fetched_at, issued_at, expires_at, language
- **Ingestion Status:** ✅ Live - runs successfully, currently no Uttarakhand alerts in feed
- **Public Display:** ❌ BLOCKED - `may_redistribute = FALSE`
  - **Reason:** Redistribution rights not yet confirmed by IMD in writing
  - **Blocking Issue:** DS-6 (alerts.md §9)
  - **Action Required:** Obtain written confirmation from IMD that alert redistribution is permitted
- **API Endpoint:** `GET /api/alerts` (returns empty until redistribution rights confirmed)
- **Connector Code:** `src/services/ingestion/connectors/imd-cap.connector.ts`
- **Parser:** `src/services/ingestion/connectors/imd-cap.parser.ts`
- **Tests:** `src/services/ingestion/connectors/imd-cap.connector.test.ts`

### 2. Geography Reference Data (Survey of India / OSM)
- **Current Status:** ⚠️ Using placeholder hexagon boundaries
- **Data Included:** District names, centroids, parent-child relationships (State → Districts → Tehsils → Villages)
- **Database:** Seeded in migration 002 (13 districts)
- **Verification Needed:** Official boundary data source (SoI or Bhuvan)
- **Blocker:** Boundary source and license not yet decided (geography.md §9)

---

## Pending - Not Yet Verified ⏳

### 3. NWIC/NWDP (Meteorological Observations)
- **Type:** Hourly weather observations
- **Planned Data:**
  - Rainfall (hourly)
  - Temperature
  - Wind speed & direction
  - Relative humidity
  - Atmospheric pressure
  - Solar radiation
  - Groundwater level (where applicable)
- **Status:** ⏳ NO VERIFIED ENDPOINT FOUND
- **Action Required:**
  1. Locate actual NWIC/NWDP machine-readable data source
  2. Verify endpoint works
  3. Document API contract
  4. Implement connector

### 4. CWC (Central Water Commission) - River Data
- **Planned Data:**
  - River water levels (real-time)
  - Warning level thresholds
  - Danger level thresholds
  - Highest flood level (HFL)
  - Flood forecasts
- **Status:** ⏳ NO VERIFIED ENDPOINT FOUND
- **Rivers in Uttarakhand:**
  - Ganga (Brahmaputra basin)
  - Yamuna
  - Sutlej
  - Alaknanda
  - Bhagirathi
- **Action Required:**
  1. Locate CWC AIBP (Accelerated Irrigation Benefit Programme) data
  2. Verify machine-readable access
  3. Check if API exists or if scraping is needed
  4. Implement connector

### 5. data.gov.in (Government Statistical Data)
- **Status:** ⏳ CONNECTOR EXISTS BUT UNAVAILABLE
- **Issue:** No DATA_GOV_IN_API_KEY environment variable set
- **Planned Data:**
  - Census 2011 (population, literacy, sex ratio, etc.)
  - Health indicators
  - Education statistics
  - NHAI data
- **Action Required:**
  1. Register at data.gov.in
  2. Request free API key
  3. Set DATA_GOV_IN_API_KEY environment variable
  4. Test connector

### 6. IMD Weather API (Forecasts & Observations)
- **Status:** ⏳ PENDING ACCOUNT ACCESS
- **Type:** Official IMD API (if available)
- **Data:** Weather forecasts, observations, warnings
- **Action Required:**
  1. Confirm IMD provides machine-readable API
  2. Request account access
  3. Document authentication method
  4. Implement connector

---

## Rejected - No Real Data Found ❌

### Demo Data (seed.ts)
- **Status:** ❌ DEMO ONLY - NOT REAL
- **Disabled:** is_enabled = FALSE
- **Usage:** Development and testing only
- **Data:** Fabricated population, literacy, income, school counts, etc.
- **Note:** Marked in database as synthetic with source="Pahad Pulse internal demo dataset"

---

## Architecture

```
SOURCE → FETCH → VALIDATE → NORMALIZE → DATABASE → API → FRONTEND

- Automatic: Ingestion runner checks on cadence
- Fault-tolerant: Retry logic, timeout handling
- Provenance: Every value tracks source_id, fetched_at, vintage
- Deduplication: Alert upsert by (source_id, source_alert_id)
- Staleness: Computed freshness badge (fresh/stale/expired)
- Degradation: Old data with staleness badge shown, never errors
```

---

## Environment Variables Required

```bash
# When available - currently all optional/not-yet-needed
DATA_GOV_IN_API_KEY=<free key from data.gov.in registration>
IMD_API_KEY=<when IMD account access granted>
CWC_API_KEY=<if required by CWC endpoint>
```

---

## Migration Path

1. ✅ **Phase 1 (Done):** IMD CAP ingestion working
   - Real alerts flowing into database
   - Waiting for redistribution rights confirmation to show publicly

2. ⏳ **Phase 2 (Current):** Find & verify NWIC/NWDP weather data
   - Hourly rainfall, temperature, wind, humidity
   - Critical for weather display on dashboard

3. ⏳ **Phase 3:** Connect CWC river data
   - River levels, flood forecasts
   - Critical for hazard assessment

4. ⏳ **Phase 4:** data.gov.in statistical data
   - Census and health statistics
   - Population, literacy, health facilities

---

## Next Steps

**Immediate (This Session):**
1. ~~Verify IMD CAP endpoint~~ ✅ Done
2. ~~Implement IMD CAP ingestion~~ ✅ Done  
3. **Find verifiable NWIC/NWDP endpoint** ← CURRENT
4. **Find verifiable CWC endpoint** ← CURRENT

**Before Public Launch:**
1. Obtain IMD redistribution rights confirmation (DS-6)
2. Confirm all data sources are properly credited
3. Verify all APIs are stable and documented
4. Set up monitoring for ingestion failures
5. Document data refresh schedules on public UI
