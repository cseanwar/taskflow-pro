'use server';

import { fetchWithAuth } from '../lib/api';
import { IDashboardStats, IUserDashboard, IProjectOverview, IReportProject } from '../types';

export async function getDashboardStatsAction(): Promise<IDashboardStats | null> {
  const result = await fetchWithAuth('/analytics/dashboard-stats');
  return result.stats || null;
}

export async function getUserDashboardAction(): Promise<IUserDashboard | null> {
  const result = await fetchWithAuth('/analytics/user-dashboard');
  return result.dashboard || null;
}

export async function getReportProjectsAction(): Promise<IReportProject[]> {
  const result = await fetchWithAuth('/analytics/projects');
  return result.projects || [];
}

export async function getProjectOverviewAction(projectId: string): Promise<IProjectOverview | null> {
  const result = await fetchWithAuth(`/analytics/project/${projectId}`);
  return result.overview || null;
}
