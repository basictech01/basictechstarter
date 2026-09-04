/**
 * Ingestion CLI.
 *
 * `npm run ingest`            — run every source with an available connector (same as --all)
 * `npm run ingest -- <key>`   — run one source's connector
 * `npm run ingest -- --all`   — run every source with an available connector (explicit form)
 * `npm run ingest -- --status` — show every source's freshness and connector status without
 *                                 running anything
 *
 * This exists because the operator HTTP endpoints in datasets.md §5 need an authenticated
 * operator role, and `accounts` is not built yet. Rather than invent an interim auth
 * scheme for a privileged endpoint, ingestion is driven from the shell — where access is
 * already controlled by who can reach the server.
 *
 * The bare command runs connectors (not just reports on them) because this is an operator
 * tool invoked deliberately from a shell that already has database and network access —
 * the same access a run itself requires. A separate `--status` view exists for checking
 * registry health without side effects.
 */
import { closeDatabase } from '../src/database/db.js';
import * as sourceController from '../src/controllers/source.controller.js';
import { runSource } from '../src/services/ingestion/index.js';
import createLogger from '../src/utils/logger.js';

const logger = createLogger('@ingest');

async function showStatus(): Promise<void> {
  const sources = await sourceController.listSourcesForOperator();
  if (sources.isErr()) {
    logger.error('could not read the source registry', { code: sources.error.code });
    process.exitCode = 1;
    return;
  }

  console.log('\nSource registry\n');
  for (const source of sources.value) {
    const connector = !source.hasConnector
      ? 'no connector'
      : source.connectorAvailable
        ? 'ready'
        : `unavailable — ${source.connectorUnavailableReason ?? 'no reason given'}`;

    console.log(`  ${source.key}`);
    console.log(`    owner        ${source.ownerModule}`);
    console.log(`    cadence      ${source.cadence} (${source.accessMethod})`);
    console.log(`    freshness    ${source.freshness}`);
    console.log(`    last success ${source.lastSuccessAt ?? 'never'}`);
    console.log(`    vintage      ${source.lastVintage ?? 'none recorded'}`);
    console.log(`    redistribute ${source.mayRedistribute ? 'yes' : 'NO — ingest only'}`);
    console.log(`    metadata     ${source.metadataStatus}`);
    console.log(`    connector    ${connector}`);
    if (source.metadataNote !== null) console.log(`    note         ${source.metadataNote}`);
    console.log('');
  }
}

async function runOne(key: string): Promise<void> {
  const report = await runSource(key, 'cli');
  if (report.isErr()) {
    logger.error('run failed', { sourceKey: key, code: report.error.code });
    process.exitCode = 1;
    return;
  }
  const { status, rowsWritten, rowsRejected, notes } = report.value;
  logger.info('run finished', { sourceKey: key, status, rowsWritten, rowsRejected });
  if (notes !== null) console.log(`  ${notes}`);
}

async function runAll(): Promise<void> {
  const sources = await sourceController.listSourcesForOperator();
  if (sources.isErr()) {
    process.exitCode = 1;
    return;
  }
  for (const source of sources.value) {
    if (!source.connectorAvailable) {
      logger.info('skipping', { sourceKey: source.key, reason: source.connectorUnavailableReason });
      continue;
    }
    await runOne(source.key);
  }
}

function printHelp(): void {
  console.log(`
Usage:
  npm run ingest                  Run every source with an available connector
  npm run ingest -- <source-key>  Run one source's connector
  npm run ingest -- --all         Run every source with an available connector (explicit)
  npm run ingest -- --status      Show registry health without running anything
  npm run ingest -- --help        Show this message
`);
}

async function main(): Promise<void> {
  const arg = process.argv[2];
  try {
    if (arg === undefined || arg === '--all') await runAll();
    else if (arg === '--status') await showStatus();
    else if (arg === '--help') printHelp();
    else await runOne(arg);
  } finally {
    await closeDatabase();
  }
}

main().catch((error: unknown) => {
  logger.error('ingest failed', { error });
  process.exit(1);
});
