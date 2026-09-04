import { z } from 'zod';
import { apiClient } from '@/lib/api';
import { AreaIndicatorsSchema, ComparisonResultSchema, IndicatorSchema } from './schemas';

export async function fetchAreaIndicators(slug: string) {
  return apiClient.get(`/areas/${slug}/indicators`, AreaIndicatorsSchema);
}

export async function fetchAllIndicators(category?: string) {
  const query = category ? `?category=${encodeURIComponent(category)}` : '';
  return apiClient.get(`/indicators${query}`, z.array(IndicatorSchema));
}

export async function fetchIndicatorComparison(slugA: string, slugB: string, categories?: string[]) {
  const params = new URLSearchParams();
  params.set('areas', `${slugA},${slugB}`);
  if (categories && categories.length > 0) params.set('categories', categories.join(','));

  return apiClient.get(`/indicators/compare?${params.toString()}`, ComparisonResultSchema);
}
