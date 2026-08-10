'use server';

import { fetchWithAuth } from '../lib/api';
import { ISearchResults } from '../types';

export async function searchAction(q: string): Promise<ISearchResults> {
  if (!q.trim()) {
    return { tasks: [], projects: [], members: [] };
  }
  const result = await fetchWithAuth(`/search?q=${encodeURIComponent(q.trim())}`);
  return result.results || { tasks: [], projects: [], members: [] };
}
