'use server';

import { revalidatePath } from 'next/cache';
import { fetchWithAuth } from '../lib/api';

export async function createWorkspaceAction(formData: FormData) {
  const name = formData.get('name') as string;
  const description = formData.get('description') as string;
  const logo = formData.get('logo') as string;

  if (!name) {
    return { success: false, message: 'Workspace name is required.' };
  }

  const result = await fetchWithAuth('/workspaces', {
    method: 'POST',
    body: JSON.stringify({ name, description, logo }),
  });

  if (result.success) {
    revalidatePath('/workspaces');
    revalidatePath('/dashboard');
  }

  return result;
}

export async function getWorkspacesAction() {
  const result = await fetchWithAuth('/workspaces');
  return result.workspaces || [];
}

export async function getWorkspaceByIdAction(id: string) {
  const result = await fetchWithAuth(`/workspaces/${id}`);
  return result.workspace || null;
}

export async function inviteWorkspaceMemberAction(workspaceId: string, email: string, role: string) {
  const result = await fetchWithAuth(`/workspaces/${workspaceId}/invite`, {
    method: 'POST',
    body: JSON.stringify({ email, role }),
  });

  if (result.success) {
    revalidatePath(`/workspaces/${workspaceId}`);
  }

  return result;
}

export async function removeWorkspaceMemberAction(workspaceId: string, userId: string) {
  const result = await fetchWithAuth(`/workspaces/${workspaceId}/members/${userId}`, {
    method: 'DELETE',
  });

  if (result.success) {
    revalidatePath(`/workspaces/${workspaceId}`);
  }

  return result;
}
