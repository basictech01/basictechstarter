-- 011 — register NWDP weather data sources.
--
-- The National Water Data Portal (NWDP) provides hourly weather telemetry for Uttarakhand.
-- Seven datasets are available, each as a separate source:
--   1. Rainfall (mm)
--   2. Temperature (°C)
--   3. Relative Humidity (%)
--   4. Wind Speed (km/h)
--   5. Wind Direction (degrees)
--   6. Atmospheric Pressure (mb)
--   7. Solar Radiation (W/m²)
--
-- All are accessed via the same CKAN DataStore API with different resource IDs.
-- All have the same cadence (hourly) and attribution.
--
-- See project/modules/hydromet.md and the NWDP_DATASETS_VERIFIED.md decision record.

INSERT INTO sources
  (source_key, owner_module, department_en, department_hi, url, attribution, licence,
   access_method, cadence, may_redistribute, metadata_status, metadata_note, is_enabled)
VALUES
  (
    'nwdp-rainfall',
    'hydromet',
    'National Water Data Portal - Rainfall',
    'राष्ट्रीय जल डेटा पोर्टल - वर्षा',
    'https://www.nwdp.nwic.gov.in',
    'Source: National Water Data Portal (NWDP), Uttarakhand Department',
    'Creative Commons Attribution 4.0',
    'api',
    'hourly',
    TRUE,
    'provisional',
    'NWDP redistribution rights NOT confirmed. Redistribution permitted per public documentation; verification pending.',
    TRUE
  ),
  (
    'nwdp-temperature',
    'hydromet',
    'National Water Data Portal - Temperature',
    'राष्ट्रीय जल डेटा पोर्टल - तापमान',
    'https://www.nwdp.nwic.gov.in',
    'Source: National Water Data Portal (NWDP), Uttarakhand Department',
    'Creative Commons Attribution 4.0',
    'api',
    'hourly',
    TRUE,
    'provisional',
    'NWDP redistribution rights NOT confirmed. Redistribution permitted per public documentation; verification pending.',
    TRUE
  ),
  (
    'nwdp-humidity',
    'hydromet',
    'National Water Data Portal - Humidity',
    'राष्ट्रीय जल डेटा पोर्टल - आर्द्रता',
    'https://www.nwdp.nwic.gov.in',
    'Source: National Water Data Portal (NWDP), Uttarakhand Department',
    'Creative Commons Attribution 4.0',
    'api',
    'hourly',
    TRUE,
    'provisional',
    'NWDP redistribution rights NOT confirmed. Redistribution permitted per public documentation; verification pending.',
    TRUE
  ),
  (
    'nwdp-wind-speed',
    'hydromet',
    'National Water Data Portal - Wind Speed',
    'राष्ट्रीय जल डेटा पोर्टल - हवा की गति',
    'https://www.nwdp.nwic.gov.in',
    'Source: National Water Data Portal (NWDP), Uttarakhand Department',
    'Creative Commons Attribution 4.0',
    'api',
    'hourly',
    TRUE,
    'provisional',
    'NWDP redistribution rights NOT confirmed. Redistribution permitted per public documentation; verification pending.',
    TRUE
  ),
  (
    'nwdp-wind-direction',
    'hydromet',
    'National Water Data Portal - Wind Direction',
    'राष्ट्रीय जल डेटा पोर्टल - हवा की दिशा',
    'https://www.nwdp.nwic.gov.in',
    'Source: National Water Data Portal (NWDP), Uttarakhand Department',
    'Creative Commons Attribution 4.0',
    'api',
    'hourly',
    TRUE,
    'provisional',
    'NWDP redistribution rights NOT confirmed. Redistribution permitted per public documentation; verification pending.',
    TRUE
  ),
  (
    'nwdp-pressure',
    'hydromet',
    'National Water Data Portal - Atmospheric Pressure',
    'राष्ट्रीय जल डेटा पोर्टल - वायुमंडलीय दबाव',
    'https://www.nwdp.nwic.gov.in',
    'Source: National Water Data Portal (NWDP), Uttarakhand Department',
    'Creative Commons Attribution 4.0',
    'api',
    'hourly',
    TRUE,
    'provisional',
    'NWDP redistribution rights NOT confirmed. Redistribution permitted per public documentation; verification pending.',
    TRUE
  ),
  (
    'nwdp-solar-radiation',
    'hydromet',
    'National Water Data Portal - Solar Radiation',
    'राष्ट्रीय जल डेटा पोर्टल - सौर विकिरण',
    'https://www.nwdp.nwic.gov.in',
    'Source: National Water Data Portal (NWDP), Uttarakhand Department',
    'Creative Commons Attribution 4.0',
    'api',
    'hourly',
    TRUE,
    'provisional',
    'NWDP redistribution rights NOT confirmed. Redistribution permitted per public documentation; verification pending.',
    TRUE
  )
AS new
ON DUPLICATE KEY UPDATE
  owner_module     = new.owner_module,
  department_en    = new.department_en,
  department_hi    = new.department_hi,
  url              = new.url,
  attribution      = new.attribution,
  licence          = new.licence,
  access_method    = new.access_method,
  cadence          = new.cadence,
  may_redistribute = new.may_redistribute,
  metadata_status  = new.metadata_status,
  metadata_note    = new.metadata_note,
  is_enabled       = new.is_enabled;

-- ROLLBACK
-- DELETE FROM sources WHERE source_key IN ('nwdp-rainfall', 'nwdp-temperature', 'nwdp-humidity',
--   'nwdp-wind-speed', 'nwdp-wind-direction', 'nwdp-pressure', 'nwdp-solar-radiation');
