'use server';

import { revalidatePath } from 'next/cache';
import { fetchWithAuth } from '../lib/api';

export async function createProjectAction(formData: FormData) {
  const workspaceId = formData.get('workspaceId') as string;
  const name = formData.get('name') as string;
  const code = formData.get('code') as string;
  const description = formData.get('description') as string;
  const category = formData.get('category') as string;

  if (!workspaceId || !name) {
    return { success: false, message: 'Workspace and project name are required.' };
  }

  const result = await fetchWithAuth('/projects', {
    method: 'POST',
    body: JSON.stringify({ workspaceId, name, code, description, category }),
  });

  if (result.success) {
    revalidatePath(`/workspaces/${workspaceId}`);
    revalidatePath('/dashboard');
  }

  return result;
}

export async function getProjectsByWorkspaceAction(workspaceId: string) {
  const result = await fetchWithAuth(`/projects/workspace/${workspaceId}`);
  return result.projects || [];
}

export async function getProjectByIdAction(id: string) {
  const result = await fetchWithAuth(`/projects/${id}`);
  return result.project || null;
}

export async function updateProjectAction(id: string, payload: any) {
  const result = await fetchWithAuth(`/projects/${id}`, {
    method: 'PUT',
    body: JSON.stringify(payload),
  });

  if (result.success) {
    revalidatePath(`/projects/${id}`);
  }

  return result;
}

export async function deleteProjectAction(id: string, workspaceId: string) {
  const result = await fetchWithAuth(`/projects/${id}`, {
    method: 'DELETE',
  });

  if (result.success) {
    revalidatePath(`/workspaces/${workspaceId}`);
    revalidatePath('/dashboard');
  }

  return result;
}

export async function duplicateProjectAction(id: string, workspaceId: string) {
  const result = await fetchWithAuth(`/projects/${id}/duplicate`, {
    method: 'POST',
  });

  if (result.success) {
    revalidatePath(`/workspaces/${workspaceId}`);
  }

  return result;
}
