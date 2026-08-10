import { cookies } from 'next/headers';

const API_BASE_URL = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000') + '/api';

export async function fetchWithAuth(endpoint: string, options: RequestInit = {}) {
  let token = '';

  try {
    const cookieStore = await cookies();
    token = cookieStore.get('tfp_token')?.value || '';
  } catch (e) {
    // If called from client component
    if (typeof window !== 'undefined') {
      token = localStorage.getItem('tfp_token') || '';
    }
  }

  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(options.headers || {}),
  };

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
    cache: options.cache || 'no-store',
  });

  const data = await response.json();
  return data;
}
