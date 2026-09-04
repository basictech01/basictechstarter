import { registerConnector } from './connector.js';
import { dataGovInConnector } from './connectors/data-gov-in.connector.js';
import { imdCapConnector } from './connectors/imd-cap.connector.js';
import { nwdpConnectors } from './connectors/nwdp.connector.js';
import { openStreetMapConnector } from './connectors/openstreetmap.connector.js';

/**
 * The one place connectors are registered.
 *
 * Importing this module has the side effect of populating the registry, so it is imported
 * once by `app.ts` and once by the ingest CLI. Adding a source means adding a line here and
 * a row in migration 005 or later — nothing else changes.
 */
registerConnector(dataGovInConnector);
registerConnector(imdCapConnector);
registerConnector(openStreetMapConnector);

// NWDP provides seven weather datasets, each with its own connector.
for (const connector of nwdpConnectors) {
  registerConnector(connector);
}

export { getConnector, listConnectors, type SourceConnector } from './connector.js';
export { runSource, type RunReport } from './runner.js';
