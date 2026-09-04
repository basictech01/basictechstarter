export const weatherKeys = {
  all: ['weather'] as const,
  summary: () => [...weatherKeys.all, 'summary'] as const,
  stations: () => [...weatherKeys.all, 'stations'] as const,
  areas: () => [...weatherKeys.all, 'area'] as const,
  area: (slug: string) => [...weatherKeys.areas(), slug] as const,
};
