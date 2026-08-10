'use server';

import { fetchWithAuth } from '../lib/api';
import { IDashboardStats } from '../types';

export async function getDashboardStatsAction(): Promise<IDashboardStats | null> {
  const result = await fetchWithAuth('/analytics/dashboard-stats');
  return result.stats || null;
}
