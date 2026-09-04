# IMD API Implementation Plan

**Status:** Ready to implement (waiting for API key)

## Official IMD Weather APIs

**Documentation:** https://api.imd.gov.in/public/api_reference.html

## Step 1: Obtain API Key

**Contact IMD for API access:**
- Website: https://api.imd.gov.in
- Documentation portal: https://mausam.imd.gov.in
- **Action:** Email IMD requesting API key for weather data

**Expected Response Format:** API key token (likely UUID or alphanumeric string)

## Step 2: Environment Configuration

```bash
# Add to backend/.env
IMD_API_KEY=<key-from-imd-registration>
IMD_API_BASE=https://api.imd.gov.in/api/v1
```

## Step 3: Implement Weather Connectors

### Priority 1: District Rainfall (Daily)
```typescript
// src/services/ingestion/connectors/imd-rainfall.connector.ts

URL: https://api.imd.gov.in/api/v1/districtrainfall?id={id}

Returns for each Uttarakhand district:
{
  "OBJ_ID": "164",
  "District": "DEHRADUN",
  "Date": "2026-09-04",
  "Daily Actual": "12.5",      // mm
  "Daily Normal": "15.3",      // mm
  "Daily Departure Per": "-18%",
  "Weekly Actual": "45.2",
  "Weekly Normal": "52.1",
  "Monthly Actual": "256.8",
  "Cumulative Actual": "1024.5"
}

Database Schema: Create hydromet_observations table:
- id (auto)
- district_id (FK to areas)
- source_id (FK to sources, 'imd-rainfall')
- observation_date
- rainfall_actual_mm
- rainfall_normal_mm
- rainfall_departure_pct
- weekly_rainfall_actual
- monthly_rainfall_actual
- cumulative_rainfall_actual
- fetched_at
- vintage
```

### Priority 2: Current Weather (Hourly/Real-time)
```typescript
// src/services/ingestion/connectors/imd-weather.connector.ts

URL: https://api.imd.gov.in/api/v1/currentweather

Returns:
{
  "temperature": 28.5,        // °C
  "humidity": 65,             // %
  "wind_speed": 12.3,        // km/h
  "wind_direction": "NW",
  "pressure": 1013.25,       // mb
  "visibility": 5000,        // meters
  "weather_condition": "Partly Cloudy"
}

Database Schema: hydromet_current table:
- id
- station_id / district_id
- source_id
- temperature_celsius
- humidity_percent
- wind_speed_kmh
- wind_direction
- pressure_mb
- visibility_meters
- weather_condition
- observed_at
- fetched_at
```

### Priority 3: Rainfall Forecast (5-7 days)
```typescript
// src/services/ingestion/connectors/imd-rainfall-forecast.connector.ts

URL: https://api.imd.gov.in/api/v1/subdivisionrainfallforecast

Returns forecast data by subdivision

Database Schema: hydromet_forecast table:
- id
- district_id
- source_id
- forecast_date
- forecast_type (subdivision/district)
- expected_rainfall_mm
- confidence_percent
- issued_at
- valid_from
- valid_until
- fetched_at
```

## Step 4: Uttarakhand District Mapping

Need to map IMD District IDs to our district_id:

```javascript
// Approximate district IDs (need to verify from API)
const uttarakhandDistricts = {
  'Uttarkashi': 164,      // Needs verification
  'Chamoli': 165,
  'Rudraprayag': 166,
  'Tehri Garhwal': 167,
  'Pauri Garhwal': 168,
  'Almora': 169,
  'Bageshwar': 170,
  'Pithoragarh': 171,
  'Champawat': 172,
  'Nainital': 173,
  'Udham Singh Nagar': 174,
  'Haridwar': 175,
  'Dehradun': 176,
};
```

## Step 5: Ingestion Schedule

```typescript
// In ingestion runner, set cadence for each source:

const ingestionSchedule = {
  'imd-rainfall': {
    cadence: 'daily',        // Daily at 0830 IST after IMD updates
    interval: 24 * 60 * 60,  // seconds
    retries: 3,
  },
  'imd-weather': {
    cadence: 'realtime',     // Every 15 minutes
    interval: 15 * 60,
    retries: 2,
  },
  'imd-forecast': {
    cadence: 'daily',        // Daily at 1000 IST
    interval: 24 * 60 * 60,
    retries: 2,
  },
};
```

## Step 6: Error Handling

```typescript
// Handle common IMD API failures:
- API Key missing: Should never happen if env set
- Rate limiting: Implement backoff
- Stale data: Mark with staleness badge
- Network timeout: Retry with exponential backoff (10s → 20s → 40s)
- Malformed response: Log and skip, keep previous good data
```

## Step 7: Frontend Integration

```typescript
// Update counters to show real weather:
- Temperature (from imd-weather)
- Rainfall (from imd-rainfall daily)
- Forecast (from imd-forecast)

// Update map layers:
- Layer: "Rainfall" → shows daily rainfall heatmap
- Layer: "Temperature" → shows current temp by district
- Layer: "Forecast" → shows 7-day rainfall forecast

// Add live indicators:
- Last rainfall observation: X minutes ago
- Last weather update: X minutes ago
- Forecast confidence: X%
```

## Step 8: Testing

```bash
# Once API key is configured:
npm run ingest -- imd-rainfall
npm run ingest -- imd-weather
npm run ingest -- imd-forecast

# Verify in database:
SELECT * FROM hydromet_observations ORDER BY fetched_at DESC LIMIT 1;
SELECT * FROM hydromet_current ORDER BY fetched_at DESC LIMIT 1;
SELECT * FROM hydromet_forecast WHERE forecast_date >= NOW();

# Verify API endpoints:
curl http://localhost:3000/api/weather/current
curl http://localhost:3000/api/weather/observations
curl http://localhost:3000/api/weather/forecast
```

## Implementation Order

1. **Week 1:**
   - [ ] Get IMD API key
   - [ ] Implement imd-rainfall connector
   - [ ] Create hydromet_observations table
   - [ ] Test with one Uttarakhand district

2. **Week 2:**
   - [ ] Implement imd-weather connector
   - [ ] Create hydromet_current table
   - [ ] Add weather layer to map

3. **Week 3:**
   - [ ] Implement imd-forecast connector
   - [ ] Create hydromet_forecast table
   - [ ] Add forecast layer to map

4. **Week 4:**
   - [ ] Integrate all three into frontend
   - [ ] Update counter cards
   - [ ] Deploy to production

## APIs Not Yet Needed

These can come later:
- Marine APIs (ship routes not applicable)
- Cyclone APIs (seasonal, reactive)
- Lightning APIs (nice-to-have)
- Agromet APIs (farmer-specific, lower priority)
- NHAI APIs (highway-specific, lower priority)

---

## Key Differences from IMD CAP

| Aspect | IMD CAP | IMD Weather APIs |
|--------|---------|------------------|
| Data Type | Alerts/Warnings | Observations & Forecasts |
| Update Frequency | On event | Every 15 min / daily |
| Geographic Scope | Nationwide, alerts only | District/station level |
| Redistribution | Needs confirmation | Likely OK (but verify) |
| Data Format | CAP XML | JSON (likely) |
| Connector Pattern | Two-stage fetch | Direct REST |

---

## Success Criteria

- ✅ Rainfall data ingests daily
- ✅ Weather data updates every 15 minutes
- ✅ Forecasts update daily
- ✅ Frontend displays current conditions with "last updated X minutes ago"
- ✅ Map shows rainfall heatmap
- ✅ No console errors
- ✅ Data properly attributed to IMD in API response
- ✅ Staleness badge appears if data > 1 day old
