const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message: string;
  requestId: string;
  timestamp: string;
}

export interface District {
  id: number;
  type: string;
  code: string;
  slug: string;
  name: { en: string; hi: string };
  parentId: number | null;
  division: string | null;
  headquarters: { en: string; hi: string } | null;
  centroid: { lat: number; lng: number } | null;
  officialIds: { lgd: string | null; census2011: string | null };
  counts: { tehsils: number; villages: number };
  hasBoundary: boolean;
}

export interface DistrictDetail extends District {
  tehsils: Array<any>;
  boundary: any | null;
}

export async function fetchDistricts(): Promise<District[]> {
  try {
    const response = await fetch(`${API_BASE}/areas/districts`);
    if (!response.ok) throw new Error('Failed to fetch districts');
    const json: ApiResponse<District[]> = await response.json();
    return json.data || [];
  } catch (error) {
    console.error('Error fetching districts:', error);
    return [];
  }
}

export async function fetchDistrictDetail(slug: string): Promise<DistrictDetail | null> {
  try {
    const response = await fetch(`${API_BASE}/areas/districts/${slug}`);
    if (!response.ok) throw new Error('Failed to fetch district detail');
    const json: ApiResponse<{ district: District; tehsils: Array<any>; boundary: any }> = await response.json();
    return json.data as unknown as DistrictDetail;
  } catch (error) {
    console.error('Error fetching district detail:', error);
    return null;
  }
}

export async function fetchIndicators(slug: string): Promise<any[]> {
  try {
    const response = await fetch(`${API_BASE}/areas/${slug}/indicators`);
    if (!response.ok) throw new Error('Failed to fetch indicators');
    const json: ApiResponse<any[]> = await response.json();
    return json.data || [];
  } catch (error) {
    console.error('Error fetching indicators:', error);
    return [];
  }
}

export async function fetchAlerts(slug?: string): Promise<any[]> {
  try {
    const url = slug ? `${API_BASE}/alerts?area_slug=${slug}` : `${API_BASE}/alerts`;
    const response = await fetch(url);
    if (!response.ok) throw new Error('Failed to fetch alerts');
    const json: ApiResponse<any[]> = await response.json();
    return json.data || [];
  } catch (error) {
    console.error('Error fetching alerts:', error);
    return [];
  }
}
