'use server';

import { fetchWithAuth } from '../lib/api';

export async function getNotificationsAction() {
  const result = await fetchWithAuth('/notifications');
  return result.notifications || [];
}

export async function markNotificationReadAction(notificationId: string) {
  const result = await fetchWithAuth(`/notifications/${notificationId}/read`, {
    method: 'PATCH',
  });
  return result;
}
