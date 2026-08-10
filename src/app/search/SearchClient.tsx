'use client';

import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import {
  Calendar as CalendarIcon,
  CheckSquare,
  Folder,
  Layers,
  Loader2,
  Search,
  Users,
} from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import Sidebar from '@/components/layout/Sidebar';
import { getCurrentUserAction } from '@/actions/auth.actions';
import { getWorkspacesAction } from '@/actions/workspace.actions';
import { searchAction } from '@/actions/search.actions';
import { IUser, IWorkspace, ISearchResults } from '@/types';

const PRIORITY_STYLES: Record<string, string> = {
  Urgent: 'bg-rose-500/15 text-rose-400',
  High: 'bg-orange-500/15 text-orange-400',
  Medium: 'bg-blue-500/15 text-blue-400',
  Low: 'bg-slate-500/15 text-slate-400',
};

const COLUMN_LABELS: Record<string, string> = {
  backlog: 'Backlog',
  todo: 'To Do',
  in_progress: 'In Progress',
  review: 'Review',
  testing: 'Testing',
  done: 'Done',
};

interface TaskFilters {
  columnId: string;
  priority: string;
}

export default function SearchPageContent() {
  const params = useSearchParams();
  const [user, setUser] = useState<IUser | null>(null);
  const [workspaces, setWorkspaces] = useState<IWorkspace[]>([]);
  const [query, setQuery] = useState(params.get('q') || '');
  const [results, setResults] = useState<ISearchResults>({ tasks: [], projects: [], members: [] });
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState<TaskFilters>({ columnId: 'all', priority: 'all' });
  const [debouncedQuery, setDebouncedQuery] = useState(query);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    getCurrentUserAction().then(setUser);
    getWorkspacesAction().then(setWorkspaces);
  }, []);

  // Debounce the query before searching
  useEffect(() => {
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => setDebouncedQuery(query), 350);
    return () => {
      if (timer.current) clearTimeout(timer.current);
    };
  }, [query]);

  useEffect(() => {
    if (!debouncedQuery.trim()) return;
    let cancelled = false;
    setLoading(true);
    searchAction(debouncedQuery)
      .then(res => {
        if (!cancelled) setResults(res);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [debouncedQuery]);

  const filteredTasks = results.tasks.filter(t => {
    if (filters.columnId !== 'all' && t.columnId !== filters.columnId) return false;
    if (filters.priority !== 'all' && t.priority !== filters.priority) return false;
    return true;
  });

  const totalMatches = results.tasks.length + results.projects.length + results.members.length;
  const showFilters = results.tasks.length > 0;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      <Navbar user={user} />

      <div className="flex flex-1">
        <Sidebar workspaces={workspaces} activeWorkspace={null} />

        <main className="flex-1 p-6 lg:p-8 overflow-y-auto max-w-4xl">
          <div className="border-b border-slate-800 pb-5">
            <h1 className="text-xl font-bold text-white flex items-center gap-2">
              <Search className="h-5 w-5 text-indigo-400" />
              <span>Global Search</span>
            </h1>
            <p className="text-xs text-slate-400">Search across your tasks, projects, and team members</p>
          </div>

          <div className="mt-5 flex items-center gap-2 rounded-2xl border border-slate-800 bg-slate-900 px-4 py-3">
            <Search className="h-4 w-4 shrink-0 text-slate-500" />
            <input
              autoFocus
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="Search tasks, projects, members..."
              className="w-full bg-transparent text-sm text-slate-200 placeholder-slate-500 focus:outline-none"
            />
            {loading && <Loader2 className="h-4 w-4 shrink-0 animate-spin text-indigo-400" />}
          </div>

          {showFilters && (
            <div className="mt-3 flex flex-wrap items-center gap-2">
              <select
                value={filters.columnId}
                onChange={e => setFilters(f => ({ ...f, columnId: e.target.value }))}
                className="rounded-lg border border-slate-800 bg-slate-900 px-3 py-1.5 text-[11px] font-semibold text-slate-300 focus:border-indigo-500 focus:outline-none"
              >
                <option value="all">All statuses</option>
                {Object.entries(COLUMN_LABELS).map(([k, v]) => (
                  <option key={k} value={k}>
                    {v}
                  </option>
                ))}
              </select>
              <select
                value={filters.priority}
                onChange={e => setFilters(f => ({ ...f, priority: e.target.value }))}
                className="rounded-lg border border-slate-800 bg-slate-900 px-3 py-1.5 text-[11px] font-semibold text-slate-300 focus:border-indigo-500 focus:outline-none"
              >
                <option value="all">All priorities</option>
                {['Urgent', 'High', 'Medium', 'Low'].map(p => (
                  <option key={p} value={p}>
                    {p}
                  </option>
                ))}
              </select>
            </div>
          )}

          <div className="mt-5">
            {!debouncedQuery.trim() && (
              <p className="py-16 text-center text-sm text-slate-500">
                Type a query above to search tasks, projects, and members.
              </p>
            )}

            {debouncedQuery.trim() && totalMatches === 0 && !loading && (
              <p className="py-16 text-center text-sm text-slate-500">
                No results for &ldquo;{debouncedQuery}&rdquo;.
              </p>
            )}

            {/* Members */}
            {results.members.length > 0 && (
              <section className="mb-6">
                <h3 className="mb-2 flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-400">
                  <Users className="h-3.5 w-3.5 text-indigo-400" /> Members ({results.members.length})
                </h3>
                <div className="grid gap-2 sm:grid-cols-2">
                  {results.members.map(m => (
                    <div key={m.id} className="flex items-center gap-3 rounded-xl border border-slate-800 bg-slate-900/60 p-3">
                      {m.avatar ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={m.avatar} alt={m.name} className="h-9 w-9 rounded-full bg-slate-800 object-cover" />
                      ) : (
                        <span className="grid h-9 w-9 place-items-center rounded-full bg-indigo-600/20 text-xs font-bold text-indigo-300">
                          {m.name.slice(0, 2).toUpperCase()}
                        </span>
                      )}
                      <div className="min-w-0">
                        <p className="truncate text-sm font-semibold text-slate-200">{m.name}</p>
                        <p className="truncate text-[11px] text-slate-500">{m.email}</p>
                      </div>
                      <span className="ml-auto rounded-md border border-slate-700 bg-slate-800/80 px-2 py-0.5 text-[10px] font-semibold text-slate-300">
                        {m.role}
                      </span>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Projects */}
            {results.projects.length > 0 && (
              <section className="mb-6">
                <h3 className="mb-2 flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-400">
                  <Folder className="h-3.5 w-3.5 text-indigo-400" /> Projects ({results.projects.length})
                </h3>
                <div className="grid gap-2 sm:grid-cols-2">
                  {results.projects.map(p => (
                    <Link
                      key={p._id}
                      href={`/projects/${p._id}`}
                      className="flex items-center gap-3 rounded-xl border border-slate-800 bg-slate-900/60 p-3 transition-colors hover:border-indigo-500/40 hover:bg-slate-800/60"
                    >
                      <span className="grid h-9 w-9 place-items-center rounded-xl bg-indigo-600/20 text-indigo-300">
                        <Layers className="h-4 w-4" />
                      </span>
                      <div className="min-w-0">
                        <p className="truncate text-sm font-semibold text-slate-200">{p.name}</p>
                        <p className="text-[11px] text-slate-500">
                          {p.code} · {p.status}
                        </p>
                      </div>
                    </Link>
                  ))}
                </div>
              </section>
            )}

            {/* Tasks */}
            {filteredTasks.length > 0 && (
              <section>
                <h3 className="mb-2 flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-400">
                  <CheckSquare className="h-3.5 w-3.5 text-indigo-400" /> Tasks ({filteredTasks.length})
                </h3>
                <div className="space-y-2">
                  {filteredTasks.map(t => (
                    <Link
                      key={t._id}
                      href={`/projects/${t.projectId}`}
                      className="flex items-center gap-3 rounded-xl border border-slate-800 bg-slate-900/60 p-3 transition-colors hover:border-indigo-500/40 hover:bg-slate-800/60"
                    >
                      <span className={`rounded px-2 py-1 text-[10px] font-bold ${PRIORITY_STYLES[t.priority]}`}>
                        {t.priority}
                      </span>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-semibold text-slate-200">{t.title}</p>
                        <p className="text-[11px] text-slate-500">
                          {t.key || '—'} · {t.projectName || t.projectCode}
                        </p>
                      </div>
                      <span className="hidden shrink-0 items-center gap-1 text-[11px] text-slate-500 sm:flex">
                        {COLUMN_LABELS[t.columnId] || t.columnId}
                      </span>
                      {t.dueDate && (
                        <span className="hidden shrink-0 items-center gap-1 text-[11px] text-slate-500 sm:flex">
                          <CalendarIcon className="h-3 w-3" />
                          {String(t.dueDate).slice(0, 10)}
                        </span>
                      )}
                    </Link>
                  ))}
                </div>
              </section>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}