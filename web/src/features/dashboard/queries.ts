export const dashboardKeys = {
  all: ['dashboard'] as const,
  districts: () => [...dashboardKeys.all, 'districts'] as const,
  liveCounters: () => [...dashboardKeys.all, 'live-counters'] as const,
  stateOverview: () => [...dashboardKeys.all, 'state-overview'] as const,
};
