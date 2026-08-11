"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Settings2,
  Users,
  LayoutGrid,
  AlertTriangle,
  Save,
  Loader2,
  CheckCircle2,
  AlertCircle,
  UserPlus,
  Trash2,
  Archive,
  Timer,
  BookOpen,
  MessagesSquare,
  Crown,
} from "lucide-react";
import { IUser, IProject, IWorkspace } from "@/types";
import {
  updateProjectAction,
  deleteProjectAction,
  setProjectMemberAction,
  setProjectMemberRoleAction,
  removeProjectMemberAction,
  getProjectByIdAction,
} from "@/actions/project.actions";
import { timeAgo } from "@/lib/time";
import Image from "next/image";

type Section = "general" | "access" | "features" | "danger";

const NAV: { id: Section; label: string; icon: typeof Settings2 }[] = [
  { id: "general", label: "General", icon: Settings2 },
  { id: "access", label: "Access & Permissions", icon: Users },
  { id: "features", label: "Feature Toggles", icon: LayoutGrid },
  { id: "danger", label: "Danger Zone", icon: AlertTriangle },
];

const PROJECT_ROLES = ["Guest User", "Team Member", "Project Manager", "Workspace Owner"] as const;

const ROLE_STYLE: Record<string, string> = {
  Owner: "bg-amber-500/15 text-amber-300 border-amber-500/30",
  "Workspace Owner": "bg-amber-500/15 text-amber-300 border-amber-500/30",
  "Project Manager": "bg-indigo-500/15 text-indigo-300 border-indigo-500/30",
  "Team Member": "bg-sky-500/15 text-sky-300 border-sky-500/30",
  "Guest User": "bg-slate-500/15 text-slate-300 border-slate-500/30",
};

const FEATURES: { key: string; label: string; hint: string; icon: typeof Timer }[] = [
  { key: "timeTracking", label: "Time Tracking", hint: "Allow team members to log time spent on individual tasks.", icon: Timer },
  { key: "projectWiki", label: "Project Wiki", hint: "Maintain an internal knowledge base and documentation for this project.", icon: BookOpen },
  { key: "integratedChat", label: "Integrated Chat", hint: "Real-time messaging channels linked directly to project tasks.", icon: MessagesSquare },
];

const inputCls =
  "w-full rounded-xl border border-slate-800 bg-slate-950/70 px-3.5 py-2.5 text-xs text-slate-200 placeholder-slate-500 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500";
const labelCls = "block text-[11px] font-semibold text-slate-400 mb-1.5";

export default function ProjectSettingsClient({
  user,
  project,
  workspaces,
  allUsers,
}: {
  user: IUser;
  project: IProject;
  workspaces: IWorkspace[];
  allUsers: { id: string; name: string; email: string; avatar?: string; role: string }[];
}) {
  const router = useRouter();
  const [section, setSection] = useState<Section>("general");
  const [p, setP] = useState<IProject>(project);

  // General form
  const [name, setName] = useState(project.name);
  const [code, setCode] = useState(project.code);
  const [description, setDescription] = useState(project.description || "");
  const [category, setCategory] = useState(project.category || "Software");
  const [saving, setSaving] = useState(false);
  const [generalMsg, setGeneralMsg] = useState<{ ok: boolean; text: string } | null>(null);

  // Add member
  const [addUserId, setAddUserId] = useState("");
  const [addRole, setAddRole] = useState<string>("Team Member");
  const [adding, setAdding] = useState(false);
  const [accessMsg, setAccessMsg] = useState<{ ok: boolean; text: string } | null>(null);

  // Danger
  const [archiving, setArchiving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const userMap = new Map(allUsers.map(u => [u.id, u]));
  const lead = userMap.get(p.managerId);

  const reload = async () => {
    const fresh = await getProjectByIdAction(p._id);
    if (fresh) setP(fresh);
  };

  const saveGeneral = async () => {
    setGeneralMsg(null);
    if (!name.trim() || !code.trim()) {
      setGeneralMsg({ ok: false, text: "Project name and key are required." });
      return;
    }
    setSaving(true);
    const res = await updateProjectAction(p._id, { name, code, description, category });
    setSaving(false);
    setGeneralMsg({ ok: res.success, text: res.message });
    if (res.success) await reload();
  };

  const changeRole = async (userId: string, newRole: string) => {
    const res = await setProjectMemberRoleAction(p._id, userId, newRole);
    if (res.success) await reload();
  };

  const addMember = async () => {
    setAccessMsg(null);
    if (!addUserId) {
      setAccessMsg({ ok: false, text: "Choose a member to add." });
      return;
    }
    setAdding(true);
    const res = await setProjectMemberAction(p._id, addUserId, addRole);
    setAdding(false);
    setAccessMsg({ ok: res.success, text: res.message });
    if (res.success) {
      setAddUserId("");
      await reload();
    }
  };

  const removeMember = async (userId: string, memberName: string) => {
    if (!window.confirm(`Remove ${memberName} from this project?`)) return;
    const res = await removeProjectMemberAction(p._id, userId);
    if (res.success) await reload();
  };

  const toggleFeature = async (key: string, enabled: boolean) => {
    const features = { ...(p.features || {}), [key]: enabled };
    setP(prev => ({ ...prev, features }));
    await updateProjectAction(p._id, { features });
  };

  const archiveProject = async () => {
    if (!window.confirm("Archive this project? It will be hidden from active views but all data is retained.")) return;
    setArchiving(true);
    const res = await updateProjectAction(p._id, { status: "archived" });
    setArchiving(false);
    if (res.success) await reload();
  };

  const deleteProject = async () => {
    if (!window.confirm("Permanently delete this project and ALL associated data? This cannot be undone.")) return;
    setDeleting(true);
    const res = await deleteProjectAction(p._id, p.workspaceId);
    setDeleting(false);
    if (res.success) router.push(`/workspaces/${p.workspaceId}`);
  };

  const memberRoles = new Map((p.memberRoles || []).map(mr => [mr.userId, mr.role as string]));
  // Lead always appears as the owner of the project.
  const membersWithLead = p.members
    .filter(mid => mid !== p.managerId)
    .map(mid => ({
      userId: mid,
      user: userMap.get(mid),
      role: memberRoles.get(mid) || ("Team Member" as string),
      isLead: false,
    }));

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-[16rem_1fr]">
      {/* Section nav */}
      <nav className="rise flex flex-row gap-1.5 overflow-x-auto rounded-2xl border border-slate-800 bg-slate-900/50 p-2 lg:flex-col lg:overflow-visible">
        {NAV.map(n => {
          const active = section === n.id;
          const Icon = n.icon;
          return (
            <button
              key={n.id}
              onClick={() => setSection(n.id)}
              className={`flex shrink-0 items-center gap-3 rounded-xl px-3.5 py-2.5 text-xs font-semibold transition ${
                active
                  ? "bg-indigo-600/15 text-indigo-300 border border-indigo-500/25"
                  : "border border-transparent text-slate-400 hover:bg-slate-800/60 hover:text-slate-200"
              }`}
            >
              <Icon className={`h-4 w-4 ${active ? "text-indigo-400" : ""}`} />
              {n.label}
            </button>
          );
        })}
        <div className="mt-2 hidden rounded-xl border border-slate-800 bg-slate-950/50 p-3 lg:block">
          <p className="font-mono text-[10px] text-slate-500">{p.code} · {p._id.slice(-6)}</p>
          <p className="mt-1 text-[10px] text-slate-500">
            Status: <span className={p.status === "archived" ? "text-amber-400" : "text-emerald-400"}>{p.status}</span>
          </p>
        </div>
      </nav>

      {/* Panels */}
      <div className="min-w-0 space-y-4">
        {generalMsg && (
          <FlashMsg ok={generalMsg.ok} text={generalMsg.text} />
        )}

        {section === "general" && (
          <div className="rise rounded-2xl border border-slate-800 bg-slate-900/50 p-5">
            <h3 className="font-display text-sm font-bold text-white">General Settings</h3>
            <p className="mt-0.5 text-[11px] text-slate-500">
              Basic information and identification for this project.
            </p>

            <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <label className={labelCls}>Project Name</label>
                <input className={inputCls} value={name} onChange={e => setName(e.target.value)} />
              </div>
              <div>
                <label className={labelCls}>Project Key</label>
                <input className={`${inputCls} font-mono uppercase`} value={code} onChange={e => setCode(e.target.value)} />
              </div>
              <div>
                <label className={labelCls}>Category</label>
                <select className={inputCls} value={category} onChange={e => setCategory(e.target.value)}>
                  {["Software", "Marketing", "Design", "Research", "Operations", "Other"].map(c => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>
              <div className="sm:col-span-2">
                <label className={labelCls}>Description</label>
                <textarea
                  className={`${inputCls} min-h-24 resize-y`}
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                />
              </div>
              <div className="sm:col-span-2">
                <label className={labelCls}>Project Lead</label>
                <div className="flex items-center gap-3 rounded-xl border border-slate-800 bg-slate-950/50 px-3.5 py-2.5">
                  {lead && (
                    <Image
                      width={28}
                      height={28}
                      src={lead.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${lead.name}`}
                      alt={lead.name}
                      className="h-7 w-7 rounded-full border border-slate-700 object-cover"
                    />
                  )}
                  <div className="min-w-0">
                    <p className="text-xs font-semibold text-slate-200">{lead?.name || "Unknown"}</p>
                    <p className="truncate font-mono text-[10px] text-slate-500">{lead?.email}</p>
                  </div>
                  <span className="ml-auto rounded-lg border border-amber-500/30 bg-amber-500/10 px-2 py-1 text-[10px] font-bold text-amber-300">
                    Owner
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-5 flex items-center gap-3">
              <button
                onClick={saveGeneral}
                disabled={saving}
                className="flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2 text-xs font-bold text-white transition hover:bg-indigo-500 disabled:opacity-50"
              >
                {saving ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Save className="h-3.5 w-3.5" />}
                Save Changes
              </button>
              <button
                onClick={() => { setName(p.name); setCode(p.code); setDescription(p.description || ""); setCategory(p.category || "Software"); }}
                className="rounded-xl border border-slate-800 px-4 py-2 text-xs font-semibold text-slate-400 transition hover:text-slate-200"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {section === "access" && (
          <div className="rise rounded-2xl border border-slate-800 bg-slate-900/50 p-5">
            <h3 className="font-display text-sm font-bold text-white">Access &amp; Permissions</h3>
            <p className="mt-0.5 text-[11px] text-slate-500">
              Manage who has access to this project and their roles. Workspace members can always
              view the board; add members here to grant explicit project access.
            </p>

            {accessMsg && <FlashMsg ok={accessMsg.ok} text={accessMsg.text} />}

            {/* Add member */}
            <div className="mt-5 flex flex-col gap-2 rounded-xl border border-slate-800 bg-slate-950/40 p-3 sm:flex-row sm:items-center">
              <select
                value={addUserId}
                onChange={e => setAddUserId(e.target.value)}
                className={`${inputCls} flex-1`}
              >
                <option value="">Select a teammate…</option>
                {allUsers
                  .filter(u => !p.members.includes(u.id))
                  .map(u => (
                    <option key={u.id} value={u.id}>
                      {u.name} · {u.email}
                    </option>
                  ))}
              </select>
              <select value={addRole} onChange={e => setAddRole(e.target.value)} className={`${inputCls} sm:w-44`}>
                {PROJECT_ROLES.map(r => (
                  <option key={r} value={r}>{r}</option>
                ))}
              </select>
              <button
                onClick={addMember}
                disabled={adding}
                className="flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-xs font-bold text-white transition hover:bg-indigo-500 disabled:opacity-50"
              >
                {adding ? <Loader2 className="h-4 w-4 animate-spin" /> : <UserPlus className="h-4 w-4" />}
                Add Member
              </button>
            </div>

            {/* Members table */}
            <div className="mt-5 overflow-x-auto">
              <div className="min-w-[30rem] divide-y divide-slate-800/60 rounded-2xl border border-slate-800 bg-slate-950/30">
                <div className="grid grid-cols-[1fr_10rem_7rem] gap-3 px-4 py-2.5 text-[10px] font-bold tracking-wider text-slate-500 uppercase">
                  <span>User</span><span>Role</span><span>Actions</span>
                </div>

                {/* Lead row */}
                {lead && (
                  <div className="grid grid-cols-[1fr_10rem_7rem] items-center gap-3 px-4 py-3">
                    <MemberCell user={lead} tag="Lead" />
                    <span className="justify-self-start rounded-lg border border-amber-500/30 bg-amber-500/10 px-2 py-1 text-[10px] font-bold text-amber-300">
                      Owner
                    </span>
                    <span className="text-[10px] text-slate-600">—</span>
                  </div>
                )}

                {membersWithLead.map(mr => (
                  <div key={mr.userId} className="grid grid-cols-[1fr_10rem_7rem] items-center gap-3 px-4 py-3">
                    <MemberCell user={mr.user} />
                    {mr.user && mr.user.id === user.id ? (
                      <span className="justify-self-start rounded-lg border border-indigo-500/30 bg-indigo-500/10 px-2 py-1 text-[10px] font-bold text-indigo-300">
                        {mr.role}
                      </span>
                    ) : (
                      <select
                        value={mr.role}
                        onChange={e => changeRole(mr.userId, e.target.value)}
                        className="rounded-lg border border-slate-800 bg-slate-900/70 px-2 py-1 text-[11px] font-semibold text-slate-300 focus:border-indigo-500 focus:outline-none"
                      >
                        {PROJECT_ROLES.map(r => (
                          <option key={r} value={r}>{r}</option>
                        ))}
                      </select>
                    )}
                    <button
                      onClick={() => mr.user && removeMember(mr.userId, mr.user.name)}
                      className="justify-self-start rounded-lg p-1.5 text-slate-500 transition hover:bg-rose-500/10 hover:text-rose-400"
                      title="Remove member"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                ))}

                {membersWithLead.length === 0 && (
                  <p className="px-4 py-8 text-center text-xs text-slate-500">
                    No project members yet. Add your first teammate above.
                  </p>
                )}
              </div>
            </div>
          </div>
        )}

        {section === "features" && (
          <div className="rise rounded-2xl border border-slate-800 bg-slate-900/50 p-5">
            <h3 className="font-display text-sm font-bold text-white">Feature Modules</h3>
            <p className="mt-0.5 text-[11px] text-slate-500">
              Enable or disable specific capabilities for this project.
            </p>

            <div className="mt-5 divide-y divide-slate-800/70">
              {FEATURES.map(feat => {
                const Icon = feat.icon;
                const enabled = !!p.features?.[feat.key];
                return (
                  <div key={feat.key} className="flex items-center justify-between gap-4 py-4">
                    <div className="flex items-start gap-3">
                      <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${enabled ? "bg-emerald-500/15 text-emerald-300" : "bg-slate-800/70 text-slate-500"}`}>
                        <Icon className="h-4 w-4" />
                      </span>
                      <div>
                        <p className="text-xs font-semibold text-slate-200">{feat.label}</p>
                        <p className="mt-0.5 max-w-sm text-[11px] leading-relaxed text-slate-500">{feat.hint}</p>
                      </div>
                    </div>
                    <Toggle on={enabled} onChange={() => toggleFeature(feat.key, !enabled)} />
                  </div>
                );
              })}
            </div>

            <p className="mt-4 rounded-xl border border-amber-500/20 bg-amber-500/5 px-3.5 py-2.5 text-[11px] text-amber-300/80">
              Toggles apply immediately. Disabled modules stay hidden from the project&apos;s interface.
            </p>
          </div>
        )}

        {section === "danger" && (
          <div className="rise space-y-4">
            <div className="rounded-2xl border border-rose-500/20 bg-rose-950/10 p-5">
              <h3 className="flex items-center gap-2 font-display text-sm font-bold text-rose-300">
                <AlertTriangle className="h-4 w-4" />
                Danger Zone
              </h3>
              <p className="mt-1 text-[11px] text-slate-500">
                Irreversible actions that affect the entire project and its data.
              </p>

              <div className="mt-5 space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-slate-800 bg-slate-950/40 p-4">
                  <div>
                    <p className="flex items-center gap-2 text-xs font-semibold text-slate-200">
                      <Archive className="h-4 w-4 text-amber-400" />
                      {p.status === "archived" ? "Unarchive Project" : "Archive Project"}
                    </p>
                    <p className="mt-0.5 text-[11px] text-slate-500">
                      Mark project as read-only. Hidden from active views but all data is retained.
                    </p>
                  </div>
                  <button
                    onClick={archiveProject}
                    disabled={archiving}
                    className="rounded-xl border border-amber-500/40 bg-amber-500/10 px-3.5 py-2 text-xs font-bold text-amber-300 transition hover:bg-amber-500/20 disabled:opacity-50"
                  >
                    {archiving ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : p.status === "archived" ? "Restore" : "Archive"}
                  </button>
                </div>

                <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-rose-500/30 bg-rose-950/20 p-4">
                  <div>
                    <p className="flex items-center gap-2 text-xs font-semibold text-rose-300">
                      <Trash2 className="h-4 w-4" />
                      Delete Project
                    </p>
                    <p className="mt-0.5 text-[11px] text-slate-500">
                      Permanently remove this project and all associated data. This action cannot be undone.
                    </p>
                  </div>
                  <button
                    onClick={deleteProject}
                    disabled={deleting}
                    className="rounded-xl bg-rose-600 px-3.5 py-2 text-xs font-bold text-white transition hover:bg-rose-500 disabled:opacity-50"
                  >
                    {deleting ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : "Delete Project"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function MemberCell({ user, tag }: { user?: { id: string; name: string; email: string; avatar?: string } | null; tag?: string }) {
  return (
    <div className="flex min-w-0 items-center gap-3">
      <Image
        width={28}
        height={28}
        src={user?.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.name || user?.email || "u"}`}
        alt={user?.name || "Member"}
        className="h-7 w-7 shrink-0 rounded-full border border-slate-700 object-cover"
      />
      <div className="min-w-0">
        <p className="flex items-center gap-1.5 truncate text-xs font-semibold text-slate-100">
          {user?.name || "Invited user"}
          {tag && <Crown className="h-3 w-3 text-amber-400" />}
        </p>
        <p className="truncate font-mono text-[10px] text-slate-500">{user?.email}</p>
      </div>
    </div>
  );
}

function FlashMsg({ ok, text }: { ok: boolean; text: string }) {
  return (
    <div className={`rise flex items-center gap-2 rounded-xl border px-4 py-2.5 text-xs font-semibold ${
      ok ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-300" : "border-rose-500/30 bg-rose-500/10 text-rose-300"
    }`}>
      {ok ? <CheckCircle2 className="h-4 w-4" /> : <AlertCircle className="h-4 w-4" />}
      {text}
    </div>
  );
}

function Toggle({ on, onChange }: { on: boolean; onChange: () => void }) {
  return (
    <button
      onClick={onChange}
      role="switch"
      aria-checked={on}
      className={`relative h-5 w-9 shrink-0 rounded-full border transition ${
        on ? "border-emerald-400 bg-emerald-500" : "border-slate-700 bg-slate-800"
      }`}
    >
      <span
        className={`absolute top-1/2 h-3.5 w-3.5 -translate-y-1/2 rounded-full bg-white shadow transition-all ${
          on ? "left-[18px]" : "left-[2px]"
        }`}
      />
    </button>
  );
}