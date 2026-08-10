'use server';

import { revalidatePath } from 'next/cache';
import { fetchWithAuth } from '../lib/api';

export async function getTasksByProjectAction(
  projectId: string,
  filters?: { sprintId?: string; priority?: string; columnId?: string; assigneeId?: string }
) {
  let query = `/tasks/project/${projectId}?`;
  if (filters?.sprintId) query += `sprintId=${filters.sprintId}&`;
  if (filters?.priority) query += `priority=${filters.priority}&`;
  if (filters?.columnId) query += `columnId=${filters.columnId}&`;
  if (filters?.assigneeId) query += `assigneeId=${filters.assigneeId}&`;

  const result = await fetchWithAuth(query);
  return result.tasks || [];
}

export async function createTaskAction(payload: {
  projectId: string;
  columnId?: string;
  sprintId?: string | null;
  title: string;
  description?: string;
  priority?: string;
  dueDate?: string | null;
  assigneeIds?: string[];
  labels?: string[];
  attachments?: any[];
  checklist?: any[];
}) {
  const result = await fetchWithAuth('/tasks', {
    method: 'POST',
    body: JSON.stringify(payload),
  });

  if (result.success) {
    revalidatePath(`/projects/${payload.projectId}`);
  }

  return result;
}

export async function moveTaskAction(taskId: string, projectId: string, columnId: string, order: number) {
  const result = await fetchWithAuth(`/tasks/${taskId}/move`, {
    method: 'PATCH',
    body: JSON.stringify({ columnId, order }),
  });

  if (result.success) {
    revalidatePath(`/projects/${projectId}`);
  }

  return result;
}

export async function updateTaskAction(taskId: string, projectId: string, payload: any) {
  const result = await fetchWithAuth(`/tasks/${taskId}`, {
    method: 'PUT',
    body: JSON.stringify(payload),
  });

  if (result.success) {
    revalidatePath(`/projects/${projectId}`);
  }

  return result;
}

export async function deleteTaskAction(taskId: string, projectId: string) {
  const result = await fetchWithAuth(`/tasks/${taskId}`, {
    method: 'DELETE',
  });

  if (result.success) {
    revalidatePath(`/projects/${projectId}`);
  }

  return result;
}

export async function getTaskCommentsAction(taskId: string) {
  const result = await fetchWithAuth(`/tasks/${taskId}/comments`);
  return result.comments || [];
}

export async function addCommentAction(taskId: string, projectId: string, text: string, attachments?: string[]) {
  const result = await fetchWithAuth(`/tasks/${taskId}/comments`, {
    method: 'POST',
    body: JSON.stringify({ text, attachments }),
  });

  if (result.success) {
    revalidatePath(`/projects/${projectId}`);
  }

  return result;
}
