'use server';

import { fetchWithAuth } from '../lib/api';
import { IDashboardStats, IUserDashboard } from '../types';

export async function getDashboardStatsAction(): Promise<IDashboardStats | null> {
  const result = await fetchWithAuth('/analytics/dashboard-stats');
  return result.stats || null;
}

export async function getUserDashboardAction(): Promise<IUserDashboard | null> {
  const result = await fetchWithAuth('/analytics/user-dashboard');
  return result.dashboard || null;
}
