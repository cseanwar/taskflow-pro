'use server';

import { fetchWithAuth } from '../lib/api';

export async function getNotificationsAction(tab: 'all' | 'unread' | 'archived' = 'all') {
  const result = await fetchWithAuth(`/notifications${tab !== 'all' ? `?tab=${tab}` : ''}`);
  return result.notifications || [];
}

export async function getUnreadNotificationCountAction() {
  const result = await fetchWithAuth('/notifications/unread-count');
  return result.count || 0;
}

export async function markNotificationReadAction(notificationId: string) {
  const result = await fetchWithAuth(`/notifications/${notificationId}/read`, {
    method: 'PATCH',
  });
  return result;
}

export async function markAllNotificationsReadAction() {
  const result = await fetchWithAuth('/notifications/read-all', {
    method: 'PATCH',
  });
  return result;
}

export async function archiveNotificationAction(notificationId: string) {
  const result = await fetchWithAuth(`/notifications/${notificationId}/archive`, {
    method: 'PATCH',
  });
  return result;
}

export async function unarchiveNotificationAction(notificationId: string) {
  const result = await fetchWithAuth(`/notifications/${notificationId}/unarchive`, {
    method: 'PATCH',
  });
  return result;
}

export async function deleteNotificationAction(notificationId: string) {
  const result = await fetchWithAuth(`/notifications/${notificationId}`, {
    method: 'DELETE',
  });
  return result;
}