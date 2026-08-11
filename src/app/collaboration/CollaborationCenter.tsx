"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  Radio,
  Users,
  FolderKanban,
  ArrowRight,
  UserPlus,
  RefreshCw,
  Sparkles,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { IUser, IWorkspace, IActivityLog, IProject } from "@/types";
import { getWorkspaceActivityAction } from "@/actions/workspace.actions";
import { timeAgo } from "@/lib/time";

interface CollaborationCenterProps {
  user: IUser;
  workspace: IWorkspace;
  initialActivity: IActivityLog[];
  projects: IProject[];
}

const ACTIVE_WINDOW_MS = 15 * 60 * 1000;

export default function CollaborationCenter({
  user,
  workspace,
  initialActivity,
  projects,
}: CollaborationCenterProps) {
  const [activity, setActivity] = useState<IActivityLog[]>(initialActivity);
  const [activeIds, setActiveIds] = useState<Set<string>>(new Set());
  const [syncing, setSyncing] = useState(false);
  const [syncedAt, setSyncedAt] = useState<Date>(new Date());
  const knownIds = useRef(new Set(initialActivity.map(a => a._id)));

  const refresh = useCallback(async () => {
    setSyncing(true);
    const next = (await getWorkspaceActivityAction(workspace._id)) as IActivityLog[];
    const fresh = next.filter(a => !knownIds.current.has(a._id));
    fresh.forEach(a => knownIds.current.add(a._id));
    if (fresh.length > 0) {
      setActivity(prev => [...fresh, ...prev].slice(0, 40));
    }
    const cutoff = Date.now() - ACTIVE_WINDOW_MS;
    setActiveIds(
      new Set(
        next
          .filter(a => new Date(a.createdAt).getTime() >= cutoff)
          .map(a => a.actorId)
      )
    );
    setSyncedAt(new Date());
    setSyncing(false);
  }, [workspace._id]);

  // Lightweight "real-time" sync: poll the workspace activity feed.
  useEffect(() => {
    const initial = setTimeout(refresh, 0);
    const id = setInterval(refresh, 12000);
    return () => {
      clearTimeout(initial);
      clearInterval(id);
    };
  }, [refresh]);

  const members = workspace.members || [];

  return (
    <div className="space-y-5">
      {/* Sync status strip */}
      <div className="rise flex flex-wrap items-center justify-between gap-3">
        <p className="flex items-center gap-2 text-[11px] text-slate-500">
          <span className="relative flex h-2.5 w-2.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60" />
            <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-500" />
          </span>
          Real-time sync
          <span className="hidden sm:inline text-slate-600">· updated {timeAgo(syncedAt)}</span>
        </p>
        <button
          onClick={refresh}
          className="flex items-center gap-1.5 rounded-lg border border-slate-800 bg-slate-900/60 px-3 py-1.5 text-[11px] font-semibold text-slate-300 transition hover:border-indigo-500/40 hover:text-indigo-300"
        >
          <RefreshCw className={`h-3 w-3 ${syncing ? "animate-spin" : ""}`} />
          Refresh feed
        </button>
      </div>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
        {/* Shared Projects */}
        <div className="rise rounded-2xl border border-slate-800 bg-slate-900/50 p-5 lg:col-span-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-indigo-600/15 text-indigo-400">
                <FolderKanban className="h-4 w-4" />
              </span>
              <h3 className="font-display text-sm font-bold text-white">Shared Projects</h3>
            </div>
            <Link
              href={`/workspaces/${workspace._id}`}
              className="flex items-center gap-1 text-[11px] font-bold text-indigo-400 transition hover:text-indigo-300"
            >
              View All <ArrowRight className="h-3 w-3" />
            </Link>
          </div>

          <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
            {projects.slice(0, 4).map(p => (
              <Link
                key={p._id}
                href={`/projects/${p._id}`}
                className="group rounded-xl border border-slate-800 bg-slate-950/40 p-4 transition hover:border-indigo-500/30 hover:bg-slate-950/70"
              >
                <div className="flex items-center justify-between">
                  <span className="rounded-lg bg-indigo-600/20 px-2 py-0.5 font-mono text-[10px] font-bold text-indigo-400">
                    {p.code}
                  </span>
                  <span className="rounded-full bg-emerald-500/15 px-2 py-0.5 text-[9px] font-bold text-emerald-400">
                    Active
                  </span>
                </div>
                <p className="mt-2.5 text-xs font-bold text-slate-100 group-hover:text-indigo-300">
                  {p.name}
                </p>
                <p className="mt-0.5 line-clamp-2 text-[11px] text-slate-500">
                  {p.description || "No project summary."}
                </p>
              </Link>
            ))}
          </div>
        </div>

        {/* Team Presence */}
        <div className="rise rounded-2xl border border-slate-800 bg-slate-900/50 p-5" style={{ animationDelay: "70ms" }}>
          <div className="flex items-center gap-2.5">
            <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-slate-800/80 text-slate-300">
              <Users className="h-4 w-4" />
            </span>
            <h3 className="font-display text-sm font-bold text-white">Team Presence</h3>
            <span className="ml-auto rounded-full bg-emerald-500/15 px-2 py-0.5 text-[9px] font-bold text-emerald-400">
              {activeIds.size} active
            </span>
          </div>

          <div className="mt-4 space-y-2.5">
            {members.map(m => {
              const isActive = activeIds.has(m.userId) || m.userId === user.id;
              return (
                <div
                  key={m.userId}
                  className="flex items-center gap-3 rounded-xl border border-slate-800 bg-slate-950/40 p-2.5"
                >
                  <div className="relative">
                    <Image
                      width={32}
                      height={32}
                      src={
                        m.avatar ||
                        `https://api.dicebear.com/7.x/avataaars/svg?seed=${m.name || m.userId}`
                      }
                      alt={m.name || "Member"}
                      className="h-8 w-8 rounded-full border border-slate-700 bg-slate-800 object-cover"
                    />
                    <span
                      className={`absolute -right-0.5 -bottom-0.5 h-3 w-3 rounded-full border-2 border-slate-900 ${
                        isActive ? "bg-emerald-500" : "bg-slate-600"
                      }`}
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-xs font-bold text-slate-100">
                      {m.name || "Invited member"}
                      {m.userId === user.id && (
                        <span className="ml-1.5 rounded bg-indigo-500/15 px-1.5 py-0.5 text-[9px] font-bold text-indigo-300">
                          You
                        </span>
                      )}
                    </p>
                    <p className="truncate text-[10px] text-slate-500">
                      {isActive ? "Active in workspace" : "Last seen recently"} · {m.role}
                    </p>
                  </div>
                </div>
              );
            })}
            {members.length === 0 && (
              <p className="px-2 py-6 text-center text-xs text-slate-500">
                No teammates yet. Invite someone to collaborate.
              </p>
            )}
          </div>

          <Link
            href="/team"
            className="mt-3 flex items-center justify-center gap-2 rounded-xl border border-indigo-500/30 bg-indigo-600/10 px-3 py-2.5 text-xs font-bold text-indigo-300 transition hover:bg-indigo-600/20"
          >
            <UserPlus className="h-4 w-4" />
            Invite Team
          </Link>
        </div>
      </div>

      {/* Live Activity Stream */}
      <div className="rise rounded-2xl border border-slate-800 bg-slate-900/50 p-5" style={{ animationDelay: "120ms" }}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-slate-800/80 text-slate-300">
              <Radio className="h-4 w-4" />
            </span>
            <h3 className="font-display text-sm font-bold text-white">Live Activity Stream</h3>
            {syncing && (
              <span className="flex items-center gap-1 text-[10px] font-semibold text-indigo-400">
                <Sparkles className="h-3 w-3" /> syncing…
              </span>
            )}
          </div>
        </div>

        <div className="mt-4 space-y-1">
          {activity.length === 0 && (
            <p className="py-8 text-center text-xs text-slate-500">
              No activity yet. Create a task or invite a teammate to get things moving.
            </p>
          )}
          {activity.map(a => {
            const isNew = !initialActivity.some(i => i._id === a._id);
            return (
              <div
                key={a._id}
                className={`rise flex items-start gap-3 rounded-xl px-3 py-3 transition ${
                  isNew ? "bg-indigo-600/10" : "hover:bg-slate-950/40"
                }`}
              >
                <Image
                  width={30}
                  height={30}
                  src={
                    a.actor?.avatar ||
                    `https://api.dicebear.com/7.x/avataaars/svg?seed=${a.actor?.name || a.actorId}`
                  }
                  alt={a.actor?.name || "Member"}
                  className="h-8 w-8 shrink-0 rounded-full border border-slate-700 object-cover"
                />
                <div className="min-w-0 flex-1">
                  <p className="text-xs leading-relaxed text-slate-300">
                    <span className="font-bold text-slate-100">{a.actor?.name || "Member"}</span>{" "}
                    {a.action}
                    {a.details && (
                      <span className="ml-1 text-[11px] text-slate-500">· {a.details}</span>
                    )}
                  </p>
                </div>
                <span className="shrink-0 text-[10px] font-medium text-slate-500">
                  {timeAgo(a.createdAt)}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
