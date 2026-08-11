"use client";

import { useState } from "react";
import {
  UserCircle2,
  ShieldCheck,
  Bell,
  Save,
  KeyRound,
  Loader2,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import { IUser, INotificationPrefs } from "@/types";
import { updateProfileAction, changePasswordAction } from "@/actions/auth.actions";
import Image from "next/image";

type Section = "personal" | "security" | "notifications";

const DEFAULT_PREFS: INotificationPrefs = {
  taskAssigned: { email: true, push: true },
  comments: { email: true, push: true },
  projectUpdates: { email: true, push: false },
};

const NAV: { id: Section; label: string; icon: typeof UserCircle2; hint: string }[] = [
  { id: "personal", label: "Personal Information", icon: UserCircle2, hint: "Name, title, department" },
  { id: "security", label: "Account Security", icon: ShieldCheck, hint: "Password & authentication" },
  { id: "notifications", label: "Notifications", icon: Bell, hint: "Preferred channels per event" },
];

const PREFS_ROWS: { key: keyof INotificationPrefs; label: string; hint: string }[] = [
  { key: "taskAssigned", label: "New task assigned", hint: "When someone assigns a new task to you." },
  { key: "comments", label: "Comments on my tasks", hint: "When a team member comments on a task you own." },
  { key: "projectUpdates", label: "Project updates", hint: "Weekly summaries and major milestone alerts." },
];

export default function ProfileClient({ user }: { user: IUser }) {
  const [section, setSection] = useState<Section>("personal");

  // Personal info form
  const [name, setName] = useState(user.name);
  const [jobTitle, setJobTitle] = useState(user.jobTitle || "");
  const [department, setDepartment] = useState(user.department || "");
  const [avatar, setAvatar] = useState(user.avatar || "");
  const [savingInfo, setSavingInfo] = useState(false);
  const [infoMsg, setInfoMsg] = useState<{ ok: boolean; text: string } | null>(null);

  // Password form
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [savingPassword, setSavingPassword] = useState(false);
  const [passwordMsg, setPasswordMsg] = useState<{ ok: boolean; text: string } | null>(null);

  // Notification prefs
  const [prefs, setPrefs] = useState<INotificationPrefs>(user.notificationPrefs || DEFAULT_PREFS);
  const [savingPrefs, setSavingPrefs] = useState(false);

  const saveInfo = async () => {
    if (!name.trim()) {
      setInfoMsg({ ok: false, text: "Name cannot be empty." });
      return;
    }
    setSavingInfo(true);
    const res = await updateProfileAction({ name, jobTitle, department, avatar });
    setSavingInfo(false);
    setInfoMsg({ ok: res.success, text: res.message });
  };

  const savePassword = async () => {
    setPasswordMsg(null);
    if (!currentPassword || !newPassword) {
      setPasswordMsg({ ok: false, text: "Fill in the current and new password." });
      return;
    }
    if (newPassword.length < 8) {
      setPasswordMsg({ ok: false, text: "New password must be at least 8 characters." });
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordMsg({ ok: false, text: "New passwords do not match." });
      return;
    }
    setSavingPassword(true);
    const res = await changePasswordAction(currentPassword, newPassword);
    setSavingPassword(false);
    setPasswordMsg({ ok: res.success, text: res.message });
    if (res.success) {
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    }
  };

  const togglePref = (row: keyof INotificationPrefs, channel: "email" | "push") => {
    setPrefs(prev => ({
      ...prev,
      [row]: { ...prev[row], [channel]: !prev[row][channel] },
    }));
  };

  const savePrefs = async () => {
    setSavingPrefs(true);
    const res = await updateProfileAction({ notificationPrefs: prefs });
    setSavingPrefs(false);
    setInfoMsg({ ok: res.success, text: res.message });
  };

  const inputCls =
    "w-full rounded-xl border border-slate-800 bg-slate-950/70 px-3.5 py-2.5 text-xs text-slate-200 placeholder-slate-500 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500";
  const labelCls = "block text-[11px] font-semibold text-slate-400 mb-1.5";
  const subCard = "rounded-2xl border border-slate-800 bg-slate-900/50 p-5";

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-[18rem_1fr]">
      {/* Left rail: identity + section nav */}
      <div className="space-y-5">
        <div className="rise rounded-2xl border border-slate-800 bg-slate-900/60 p-5 text-center">
          <div className="relative mx-auto h-20 w-20">
            <Image
              width={80}
              height={80}
              src={user.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.name}`}
              alt={user.name}
              className="h-20 w-20 rounded-2xl border border-slate-700 object-cover shadow-xl shadow-indigo-950/40"
            />
            <span className="absolute -right-1 -bottom-1 flex h-7 w-7 items-center justify-center rounded-lg border border-emerald-500/40 bg-slate-900 text-emerald-400">
              <CheckCircle2 className="h-4 w-4" />
            </span>
          </div>
          <h2 className="font-display mt-4 text-lg font-bold text-white">{user.name}</h2>
          <p className="mt-0.5 text-[11px] text-slate-400">{user.jobTitle || "Team Member"}</p>
          <span className="mt-2 inline-flex rounded-full border border-indigo-500/30 bg-indigo-500/10 px-2.5 py-0.5 text-[10px] font-bold text-indigo-300">
            {user.role}
          </span>
          <p className="mt-3 truncate text-[11px] text-slate-500">{user.email}</p>
        </div>

        <nav className="rise flex flex-row gap-1.5 overflow-x-auto rounded-2xl border border-slate-800 bg-slate-900/50 p-2 lg:flex-col lg:overflow-visible">
          {NAV.map(n => {
            const active = section === n.id;
            const Icon = n.icon;
            return (
              <button
                key={n.id}
                onClick={() => setSection(n.id)}
                className={`flex shrink-0 items-center gap-3 rounded-xl px-3.5 py-2.5 text-left transition ${
                  active
                    ? "bg-indigo-600/15 text-indigo-300 border border-indigo-500/25"
                    : "text-slate-400 border border-transparent hover:bg-slate-800/60 hover:text-slate-200"
                }`}
              >
                <Icon className={`h-4 w-4 ${active ? "text-indigo-400" : ""}`} />
                <span className="hidden lg:block">
                  <span className="block text-xs font-semibold">{n.label}</span>
                  <span className="block text-[10px] text-slate-500">{n.hint}</span>
                </span>
                <span className="lg:hidden text-[11px] font-semibold">{n.label.split(" ")[0]}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Right: active panel */}
      <div className="space-y-5">
        {infoMsg && (
          <div
            className={`flex items-center gap-2 rounded-xl border px-4 py-2.5 text-xs font-semibold ${
              infoMsg.ok
                ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-300"
                : "border-rose-500/30 bg-rose-500/10 text-rose-300"
            }`}
          >
            {infoMsg.ok ? <CheckCircle2 className="h-4 w-4" /> : <AlertCircle className="h-4 w-4" />}
            {infoMsg.text}
          </div>
        )}

        {section === "personal" && (
          <div className="rise space-y-5">
            <div className={subCard}>
              <h3 className="font-display text-sm font-bold text-white">Personal Information</h3>
              <p className="mt-0.5 text-[11px] text-slate-500">
                Basic information and identification for this account.
              </p>
              <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className={labelCls}>Full Name</label>
                  <input className={inputCls} value={name} onChange={e => setName(e.target.value)} />
                </div>
                <div>
                  <label className={labelCls}>Email Address</label>
                  <input className={`${inputCls} opacity-60`} value={user.email} disabled readOnly />
                </div>
                <div>
                  <label className={labelCls}>Job Title</label>
                  <input
                    className={inputCls}
                    placeholder="e.g. Lead Designer"
                    value={jobTitle}
                    onChange={e => setJobTitle(e.target.value)}
                  />
                </div>
                <div>
                  <label className={labelCls}>Department</label>
                  <input
                    className={inputCls}
                    placeholder="e.g. Design"
                    value={department}
                    onChange={e => setDepartment(e.target.value)}
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className={labelCls}>Avatar URL</label>
                  <input
                    className={inputCls}
                    placeholder="https://..."
                    value={avatar}
                    onChange={e => setAvatar(e.target.value)}
                  />
                </div>
              </div>
              <div className="mt-5 flex justify-end">
                <button
                  onClick={saveInfo}
                  disabled={savingInfo}
                  className="flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2 text-xs font-bold text-white transition hover:bg-indigo-500 disabled:opacity-50"
                >
                  {savingInfo ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Save className="h-3.5 w-3.5" />}
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        )}

        {section === "security" && (
          <div className="rise space-y-5">
            <div className={subCard}>
              <h3 className="font-display text-sm font-bold text-white">Account Security</h3>
              <p className="mt-0.5 text-[11px] text-slate-500">
                Manage your password and keep your account protected.
              </p>

              {passwordMsg && (
                <div
                  className={`mt-4 flex items-center gap-2 rounded-xl border px-4 py-2.5 text-xs font-semibold ${
                    passwordMsg.ok
                      ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-300"
                      : "border-rose-500/30 bg-rose-500/10 text-rose-300"
                  }`}
                >
                  {passwordMsg.ok ? <CheckCircle2 className="h-4 w-4" /> : <AlertCircle className="h-4 w-4" />}
                  {passwordMsg.text}
                </div>
              )}

              <div className="mt-5 grid grid-cols-1 gap-4">
                <div>
                  <label className={labelCls}>Current Password</label>
                  <input
                    type="password"
                    className={inputCls}
                    placeholder="••••••••"
                    value={currentPassword}
                    onChange={e => setCurrentPassword(e.target.value)}
                  />
                </div>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label className={labelCls}>New Password</label>
                    <input
                      type="password"
                      className={inputCls}
                      placeholder="At least 8 characters"
                      value={newPassword}
                      onChange={e => setNewPassword(e.target.value)}
                    />
                  </div>
                  <div>
                    <label className={labelCls}>Confirm New Password</label>
                    <input
                      type="password"
                      className={inputCls}
                      placeholder="Repeat new password"
                      value={confirmPassword}
                      onChange={e => setConfirmPassword(e.target.value)}
                    />
                  </div>
                </div>
              </div>
              <div className="mt-5 flex justify-end">
                <button
                  onClick={savePassword}
                  disabled={savingPassword}
                  className="flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2 text-xs font-bold text-white transition hover:bg-indigo-500 disabled:opacity-50"
                >
                  {savingPassword ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <KeyRound className="h-3.5 w-3.5" />}
                  Update Password
                </button>
              </div>
            </div>
          </div>
        )}

        {section === "notifications" && (
          <div className="rise space-y-5">
            <div className={subCard}>
              <h3 className="font-display text-sm font-bold text-white">Notification Preferences</h3>
              <p className="mt-0.5 text-[11px] text-slate-500">
                Control how and when you want to be notified.
              </p>

              <div className="mt-5 divide-y divide-slate-800/70">
                {PREFS_ROWS.map(row => (
                  <div key={row.key} className="flex items-center justify-between gap-4 py-4">
                    <div>
                      <p className="text-xs font-semibold text-slate-200">{row.label}</p>
                      <p className="mt-0.5 text-[11px] text-slate-500">{row.hint}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-[10px] font-bold text-slate-500">Email</span>
                      <Toggle
                        on={prefs[row.key].email}
                        onChange={() => togglePref(row.key, "email")}
                      />
                      <span className="text-[10px] font-bold text-slate-500">Push</span>
                      <Toggle
                        on={prefs[row.key].push}
                        onChange={() => togglePref(row.key, "push")}
                      />
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-5 flex justify-end">
                <button
                  onClick={savePrefs}
                  disabled={savingPrefs}
                  className="flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2 text-xs font-bold text-white transition hover:bg-indigo-500 disabled:opacity-50"
                >
                  {savingPrefs ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Save className="h-3.5 w-3.5" />}
                  Save Preferences
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function Toggle({ on, onChange }: { on: boolean; onChange: () => void }) {
  return (
    <button
      onClick={onChange}
      role="switch"
      aria-checked={on}
      className={`relative h-5 w-9 rounded-full border transition ${
        on ? "border-indigo-400 bg-indigo-500" : "border-slate-700 bg-slate-800"
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