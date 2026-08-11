'use server';

import { cookies } from 'next/headers';
import { fetchWithAuth } from '../lib/api';
import { INotificationPrefs } from '../types';

export async function loginAction(formData: FormData) {
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;

  if (!email || !password) {
    return { success: false, message: 'Email and password are required.' };
  }

  const result = await fetchWithAuth('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });

  if (result.success && result.token) {
    const cookieStore = await cookies();
    cookieStore.set('tfp_token', result.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      path: '/',
      maxAge: 7 * 24 * 60 * 60, // 7 days
    });
  }

  return result;
}

export async function registerAction(formData: FormData) {
  const name = formData.get('name') as string;
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;
  const role = (formData.get('role') as string) || 'Team Member';
  const avatar = (formData.get('avatar') as string) || '';

  if (!name || !email || !password) {
    return { success: false, message: 'All fields are required.' };
  }

  const result = await fetchWithAuth('/auth/register', {
    method: 'POST',
    body: JSON.stringify({ name, email, password, role, avatar }),
  });

  if (result.success && result.token) {
    const cookieStore = await cookies();
    cookieStore.set('tfp_token', result.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      path: '/',
      maxAge: 7 * 24 * 60 * 60,
    });
  }

  return result;
}

export async function googleSignInAction(credential: string) {
  if (!credential) {
    return { success: false, message: 'Google authentication failed.' };
  }

  const result = await fetchWithAuth('/auth/google', {
    method: 'POST',
    body: JSON.stringify({ credential }),
  });

  if (result.success && result.token) {
    const cookieStore = await cookies();
    cookieStore.set('tfp_token', result.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      path: '/',
      maxAge: 7 * 24 * 60 * 60,
    });
  }

  return result;
}

export async function logoutAction() {
  const cookieStore = await cookies();
  cookieStore.delete('tfp_token');
  return { success: true };
}

export async function getCurrentUserAction() {
  try {
    const result = await fetchWithAuth('/auth/me');
    return result.user || null;
  } catch (error) {
    return null;
  }
}

export async function getAllUsersAction() {
  const result = await fetchWithAuth('/auth/users');
  return result.users || [];
}

export async function updateProfileAction(payload: {
  name?: string;
  avatar?: string;
  jobTitle?: string;
  department?: string;
  notificationPrefs?: INotificationPrefs;
}) {
  const result = await fetchWithAuth('/auth/me', {
    method: 'PUT',
    body: JSON.stringify(payload),
  });
  return result;
}

export async function changePasswordAction(currentPassword: string, newPassword: string) {
  const result = await fetchWithAuth('/auth/change-password', {
    method: 'POST',
    body: JSON.stringify({ currentPassword, newPassword }),
  });
  return result;
}
