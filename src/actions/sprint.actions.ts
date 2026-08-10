'use server';

import { revalidatePath } from 'next/cache';
import { fetchWithAuth } from '../lib/api';

export async function createSprintAction(payload: {
  projectId: string;
  name: string;
  goal?: string;
  startDate?: string | null;
  endDate?: string | null;
}) {
  const result = await fetchWithAuth('/sprints', {
    method: 'POST',
    body: JSON.stringify(payload),
  });

  if (result.success) {
    revalidatePath(`/projects/${payload.projectId}`);
  }

  return result;
}

export async function getSprintsByProjectAction(projectId: string) {
  const result = await fetchWithAuth(`/sprints/project/${projectId}`);
  return result.sprints || [];
}

export async function updateSprintStatusAction(sprintId: string, projectId: string, status: 'Planned' | 'Active' | 'Completed') {
  const result = await fetchWithAuth(`/sprints/${sprintId}/status`, {
    method: 'PATCH',
    body: JSON.stringify({ status }),
  });

  if (result.success) {
    revalidatePath(`/projects/${projectId}`);
  }

  return result;
}
