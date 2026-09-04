-- 012 — mark alerts and hydromet map layers as available.
--
-- Migration 003 seeded every non-geography layer as is_available = FALSE because none of
-- their owning modules existed yet. Since then:
--   - `alerts` (IMD CAP) has been live and ingesting for several sessions.
--   - `rainfall` and `weather` are now backed by the NWDP telemetry connectors and the new
--     GET /areas/:slug/weather, /weather/stations, /weather/summary endpoints (migration 010,
--     011, and the weather.controller.ts / weather.route.ts pair).
--
-- `rivers`, `roads`, `traffic`, `tourism`, `health`, `education`, `connectivity`, and
-- `migration` stay FALSE — no connector or real-valued indicator backs any of them yet.
--
-- Note: as of this migration, the frontend's map layer switcher (interactive-map-section.tsx)
-- does not yet read GET /api/map/layers — it hardcodes its own availability flags locally.
-- This migration keeps the registry itself honest regardless; wiring the frontend to consume
-- it instead of duplicating the flags is a follow-up, not done here.

UPDATE map_layers
SET is_available = TRUE
WHERE layer_key IN ('alerts', 'rainfall', 'weather');

-- ROLLBACK
-- UPDATE map_layers SET is_available = FALSE WHERE layer_key IN ('alerts', 'rainfall', 'weather');
