interface ActiveAlertsFilters {
  type?: string;
  minSeverity?: string;
  areaSlug?: string;
}

export const alertKeys = {
  all: ['alerts'] as const,
  summaries: () => [...alertKeys.all, 'summary'] as const,
  lists: () => [...alertKeys.all, 'list'] as const,
  active: (cursor: number | undefined, filters: ActiveAlertsFilters) =>
    [...alertKeys.lists(), 'active', cursor ?? null, filters] as const,
  byArea: (slug: string, cursor: number | undefined) =>
    [...alertKeys.lists(), 'area', slug, cursor ?? null] as const,
  details: () => [...alertKeys.all, 'detail'] as const,
  detail: (id: number) => [...alertKeys.details(), id] as const,
};
