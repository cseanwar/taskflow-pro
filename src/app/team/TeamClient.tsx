"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Users,
  UserPlus,
  Search,
  Link2,
  Copy,
  Check,
  Trash2,
  Shield,
  ShieldCheck,
  History,
  Globe,
  Loader2,
  Plus,
} from "lucide-react";
import { IUser, IWorkspace, IWorkspaceMember, IActivityLog } from "@/types";
import {
  getWorkspaceByIdAction,
  getWorkspaceActivityAction,
  inviteWorkspaceMemberAction,
  removeWorkspaceMemberAction,
  changeWorkspaceMemberRoleAction,
} from "@/actions/workspace.actions";
import { LEVEL, effectiveWorkspaceLevel } from "@/lib/permissions";
import { timeAgo, dayLabel } from "@/lib/time";
import Image from "next/image";

const INVITABLE_ROLES = ["Guest User", "Team Member", "Project Manager"] as const;

const ROLE_STYLE: Record<string, string> = {
  "Workspace Owner": "bg-amber-500/15 text-amber-300 border-amber-500/30",
  Admin: "bg-violet-500/15 text-violet-300 border-violet-500/30",
  Administrator: "bg-violet-500/15 text-violet-300 border-violet-500/30",
  "Project Manager": "bg-indigo-500/15 text-indigo-300 border-indigo-500/30",
  "Team Member": "bg-sky-500/15 text-sky-300 border-sky-500/30",
  "Guest User": "bg-slate-500/15 text-slate-300 border-slate-500/30",
};

export default function TeamClient({
  user,
  workspaces = [],
  initialDetail,
  initialActivity = [],
}: {
  user: IUser;
  workspaces: IWorkspace[];
  initialDetail: IWorkspace | null;
  initialActivity: IActivityLog[];
}) {
  const [workspace, setWorkspace] = useState<IWorkspace | null>(initialDetail || (workspaces[0] ?? null));
  const [activity, setActivity] = useState<IActivityLog[]>(initialActivity);
  const [query, setQuery] = useState("");
  const [loadingWs, setLoadingWs] = useState(false);

  // Invite form
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<string>("Team Member");
  const [inviting, setInviting] = useState(false);
  const [inviteMsg, setInviteMsg] = useState<{ ok: boolean; text: string } | null>(null);

  // Public link
  const [copied, setCopied] = useState(false);

  const canAdmin = workspace
    ? effectiveWorkspaceLevel(user, workspace) >= LEVEL.admin
    : false;
  const workspaceId = workspace?._id;

  const switchWorkspace = async (id: string) => {
    if (!id) return;
    setLoadingWs(true);
    try {
      const [detail, act] = await Promise.all([
        getWorkspaceByIdAction(id),
        getWorkspaceActivityAction(id),
      ]);
      if (detail) {
        setWorkspace(detail);
      }
      setActivity(act || []);
    } catch (err) {
      console.error("Failed to switch workspace:", err);
    } finally {
      setLoadingWs(false);
    }
  };

  useEffect(() => {
    if (!workspace && workspaces.length > 0) {
      void switchWorkspace(workspaces[0]._id);
    }
  }, [workspaces, workspace]);

  const handleInvite = async () => {
    setInviteMsg(null);
    if (!email.trim()) {
      setInviteMsg({ ok: false, text: "Enter an email address." });
      return;
    }
    if (!workspaceId) return;
    setInviting(true);
    const res = await inviteWorkspaceMemberAction(workspaceId, email.trim(), role);
    setInviting(false);
    setInviteMsg({ ok: res.success, text: res.message });
    if (res.success) {
      setEmail("");
      const [detail, act] = await Promise.all([
        getWorkspaceByIdAction(workspaceId),
        getWorkspaceActivityAction(workspaceId),
      ]);
      if (detail) setWorkspace(detail);
      setActivity(act || []);
    }
  };

  const changeRole = async (userId: string, newRole: string) => {
    if (!workspaceId) return;
    const res = await changeWorkspaceMemberRoleAction(workspaceId, userId, newRole);
    if (res.success) {
      const [detail, act] = await Promise.all([
        getWorkspaceByIdAction(workspaceId),
        getWorkspaceActivityAction(workspaceId),
      ]);
      if (detail) setWorkspace(detail);
      setActivity(act || []);
    }
  };

  const removeMember = async (member: IWorkspaceMember) => {
    if (!workspaceId) return;
    if (!window.confirm(`Remove ${member.name || member.email || "this member"} from the workspace?`)) return;
    const res = await removeWorkspaceMemberAction(workspaceId, member.userId);
    if (res.success) {
      const [detail, act] = await Promise.all([
        getWorkspaceByIdAction(workspaceId),
        getWorkspaceActivityAction(workspaceId),
      ]);
      if (detail) setWorkspace(detail);
      setActivity(act || []);
    }
  };

  const copyLink = async () => {
    if (typeof window === "undefined" || !workspaceId) return;
    const url = `${window.location.origin}/workspaces/${workspaceId}`;
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      /* clipboard unavailable */
    }
  };

  if (workspaces.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-slate-800 bg-slate-900/30 p-12 text-center">
        <Users className="mx-auto h-10 w-10 text-slate-500" />
        <h3 className="mt-3 text-base font-bold text-slate-200">No workspaces found</h3>
        <p className="mt-1 text-xs text-slate-500 max-w-sm mx-auto">
          You need to be part of a workspace to view team members and manage collaborators.
        </p>
        <Link
          href="/workspaces"
          className="mt-5 inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-xs font-semibold text-white shadow-md shadow-indigo-600/20 hover:bg-indigo-500"
        >
          <Plus className="h-4 w-4" />
          <span>Create Workspace</span>
        </Link>
      </div>
    );
  }

  const filteredMembers = (workspace?.members || []).filter(m =>
    `${m.name || ""} ${m.email || ""}`.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {!workspace || loadingWs ? (
        <div className="flex items-center justify-center gap-2 rounded-2xl border border-slate-800 bg-slate-900/50 py-16 text-xs text-slate-500">
          <Loader2 className="h-4 w-4 animate-spin text-indigo-400" />
          Loading workspace details…
        </div>
      ) : (
        <>
          {/* Workspace switch + invite */}
          <div className="rise rounded-2xl border border-slate-800 bg-slate-900/60 p-5">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
              <div className="w-full lg:max-w-xs">
                <label className="mb-1.5 block text-[11px] font-semibold text-slate-400">Workspace</label>
                <select
                  value={workspaceId}
                  onChange={e => switchWorkspace(e.target.value)}
                  disabled={loadingWs}
                  className="w-full rounded-xl border border-slate-800 bg-slate-950/70 px-3.5 py-2.5 text-xs font-semibold text-slate-200 focus:border-indigo-500 focus:outline-none"
                >
                  {workspaces.map(w => (
                    <option key={w._id} value={w._id}>
                      {w.name} · {w.members?.length ?? 0} members
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex flex-1 flex-col gap-2">
                <label className="mb-1.5 block text-[11px] font-semibold text-slate-400">
                  Invite by Email
                </label>
                <div className="flex flex-col gap-2 sm:flex-row">
                  <div className="relative flex-1">
                    <input
                      type="email"
                      placeholder="name@company.com"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      disabled={!canAdmin}
                      className="w-full rounded-xl border border-slate-800 bg-slate-950/70 px-3.5 py-2.5 text-xs text-slate-200 placeholder-slate-500 focus:border-indigo-500 focus:outline-none disabled:opacity-50"
                    />
                  </div>
                  <select
                    value={role}
                    onChange={e => setRole(e.target.value)}
                    disabled={!canAdmin}
                    className="rounded-xl border border-slate-800 bg-slate-950/70 px-3.5 py-2.5 text-xs font-semibold text-slate-200 focus:border-indigo-500 focus:outline-none disabled:opacity-50"
                  >
                    {INVITABLE_ROLES.map(r => (
                      <option key={r} value={r}>
                        {r}
                      </option>
                    ))}
                  </select>
                  <button
                    onClick={handleInvite}
                    disabled={!canAdmin || inviting}
                    className="flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-xs font-bold text-white transition hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {inviting ? <Loader2 className="h-4 w-4 animate-spin" /> : <UserPlus className="h-4 w-4" />}
                    Send Invite
                  </button>
                </div>
                {inviteMsg && (
                  <p className={`text-[11px] font-semibold ${inviteMsg.ok ? "text-emerald-400" : "text-rose-400"}`}>
                    {inviteMsg.text}
                  </p>
                )}
                {!canAdmin && (
                  <p className="text-[11px] text-slate-500">
                    Only Workspace Owners and Administrators can invite members or change roles.
                  </p>
                )}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            {/* Members */}
            <div className="rise space-y-4 lg:col-span-2">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <h3 className="flex items-center gap-2 font-display text-sm font-bold text-white">
                  <Users className="h-4 w-4 text-indigo-400" />
                  Team Members
                  <span className="rounded-full bg-slate-800 px-2 py-0.5 font-mono text-[10px] text-slate-400">
                    {workspace.members?.length ?? 0}
                  </span>
                </h3>
                <div className="relative w-56">
                  <Search className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-500" />
                  <input
                    value={query}
                    onChange={e => setQuery(e.target.value)}
                    placeholder="Filter..."
                    className="w-full rounded-lg border border-slate-800 bg-slate-950/60 py-1.5 pl-8 pr-3 text-[11px] text-slate-200 placeholder-slate-500 focus:border-indigo-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="divide-y divide-slate-800/60 rounded-2xl border border-slate-800 bg-slate-900/50">
                {filteredMembers.map((m, i) => {
                  const isOwner = workspace.ownerId === m.userId;
                  const isYou = m.userId === user.id;
                  const displayRole = isOwner ? "Workspace Owner" : (m.role as string);
                  return (
                    <div
                      key={m.userId}
                      style={{ animationDelay: `${i * 40}ms` }}
                      className="rise flex flex-wrap items-center gap-3 px-4 py-3.5"
                    >
                      <Image
                        width={36}
                        height={36}
                        src={m.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${m.name || m.email || ""}`}
                        alt={m.name || m.email || "Member"}
                        className="h-9 w-9 rounded-full border border-slate-700 bg-slate-800 object-cover"
                      />
                      <div className="min-w-0 flex-1">
                        <p className="flex items-center gap-2 truncate text-xs font-semibold text-slate-100">
                          {m.name || "Invited user"}
                          {isYou && (
                            <span className="rounded bg-indigo-500/15 px-1.5 py-0.5 text-[9px] font-bold text-indigo-300">
                              You
                            </span>
                          )}
                        </p>
                        <p className="truncate font-mono text-[10px] text-slate-500">{m.email}</p>
                      </div>

                      {canAdmin && !isOwner ? (
                        <select
                          value={m.role as string}
                          onChange={e => changeRole(m.userId, e.target.value)}
                          className="rounded-lg border border-slate-800 bg-slate-950/70 px-2 py-1 text-[11px] font-semibold text-slate-300 focus:border-indigo-500 focus:outline-none"
                        >
                          {INVITABLE_ROLES.map(r => (
                            <option key={r} value={r}>
                              {r}
                            </option>
                          ))}
                        </select>
                      ) : (
                        <span
                          className={`inline-flex rounded-lg border px-2.5 py-1 text-[10px] font-bold ${
                            ROLE_STYLE[displayRole] || ROLE_STYLE["Team Member"]
                          }`}
                        >
                          {displayRole}
                        </span>
                      )}

                      {canAdmin && !isOwner && !isYou && (
                        <button
                          onClick={() => removeMember(m)}
                          title="Remove member"
                          className="rounded-lg p-1.5 text-slate-500 transition hover:bg-rose-500/10 hover:text-rose-400"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  );
                })}
                {filteredMembers.length === 0 && (
                  <p className="px-4 py-10 text-center text-xs text-slate-500">
                    No members match &quot;{query}&quot;
                  </p>
                )}
              </div>
            </div>

            {/* Public link + access log */}
            <div className="rise space-y-4">
              <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4">
                <div className="flex items-center gap-2">
                  <Globe className="h-4 w-4 text-indigo-400" />
                  <h4 className="font-display text-xs font-bold text-white">Public Link</h4>
                </div>
                <p className="mt-2 text-[11px] leading-relaxed text-slate-500">
                  Share the workspace dashboard with anyone in your company.
                </p>
                <div className="mt-3 flex items-center gap-2">
                  <div className="flex min-w-0 flex-1 items-center gap-2 rounded-lg border border-slate-800 bg-slate-950/70 px-2.5 py-1.5">
                    <Link2 className="h-3.5 w-3.5 shrink-0 text-slate-500" />
                    <span className="truncate font-mono text-[10px] text-slate-400">
                      {typeof window !== "undefined"
                        ? `${window.location.origin}/workspaces/${workspaceId}`
                        : "…"}
                    </span>
                  </div>
                  <button
                    onClick={copyLink}
                    className="flex items-center gap-1.5 rounded-lg border border-slate-800 px-2.5 py-1.5 text-[10px] font-bold text-slate-300 transition hover:border-indigo-500/40 hover:text-indigo-300"
                  >
                    {copied ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
                    {copied ? "Copied" : "Copy"}
                  </button>
                </div>
              </div>

              <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <History className="h-4 w-4 text-indigo-400" />
                    <h4 className="font-display text-xs font-bold text-white">Access Log</h4>
                  </div>
                  <ShieldCheck className="h-3.5 w-3.5 text-slate-500" />
                </div>
                <div className="mt-3 max-h-64 space-y-3 overflow-y-auto pr-1">
                  {activity.length === 0 && (
                    <p className="py-4 text-center text-[11px] text-slate-500">No activity yet.</p>
                  )}
                  {activity.map((log, i) => (
                    <div key={log._id || i} className="flex gap-2.5">
                      <Shield className="mt-0.5 h-3.5 w-3.5 shrink-0 text-slate-600" />
                      <div className="min-w-0">
                        <p className="text-[11px] leading-snug text-slate-400">
                          <span className="font-semibold text-slate-200">{log.actor?.name || "Someone"}</span> {log.action}
                        </p>
                        <p className="mt-0.5 font-mono text-[9px] text-slate-600">{dayLabel(log.createdAt)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}