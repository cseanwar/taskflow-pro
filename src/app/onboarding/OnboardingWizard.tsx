"use client";

import { useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Kanban,
  Building2,
  UserPlus,
  ToggleRight,
  PartyPopper,
  ArrowLeft,
  ArrowRight,
  Loader2,
  Plus,
  X,
  Link2,
  Copy,
  Check,
  FolderKanban,
  Timer,
  MessagesSquare,
  BarChart3,
  FileText,
  CheckCircle2,
  Users,
  AlertTriangle,
} from "lucide-react";
import {
  createWorkspaceAction,
  inviteWorkspaceMemberAction,
  updateWorkspaceFeaturesAction,
} from "@/actions/workspace.actions";

type Step = 0 | 1 | 2 | 3;

const STEPS = [
  { label: "Workspace Setup", icon: Building2 },
  { label: "Team Invites", icon: UserPlus },
  { label: "Feature Selection", icon: ToggleRight },
  { label: "Final Review", icon: PartyPopper },
] as const;

const INDUSTRIES = [
  "Software & Technology",
  "Marketing & Media",
  "Design & Creative",
  "Finance & Consulting",
  "Education",
  "Healthcare",
  "Retail & E-commerce",
  "Other",
];

const INVITE_ROLES = ["Project Manager", "Team Member", "Guest User"];

const FEATURES = [
  {
    key: "kanban",
    label: "Kanban Boards",
    hint: "Visualize work, limit work-in-progress, and maximize efficiency (or flow). Ideal for agile teams.",
    icon: FolderKanban,
    default: true,
  },
  {
    key: "timeTracking",
    label: "Time Tracking",
    hint: "Log hours against specific tasks and projects. Generate accurate timesheets for billing and analysis.",
    icon: Timer,
  },
  {
    key: "teamChat",
    label: "Team Chat",
    hint: "Real-time contextual communication channels integrated directly into your workspace projects.",
    icon: MessagesSquare,
  },
  {
    key: "analytics",
    label: "Advanced Analytics",
    hint: "Track velocity, resource allocation, and custom KPIs with interactive dashboards tailored for management.",
    icon: BarChart3,
  },
  {
    key: "documents",
    label: "Document Storage",
    hint: "Secure, centralized repository for all project files, assets, and documentation with version control.",
    icon: FileText,
  },
];

const inputCls =
  "w-full rounded-xl border border-slate-800 bg-slate-950/70 px-3.5 py-2.5 text-xs text-slate-200 placeholder-slate-500 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500";
const labelCls = "block text-xs font-semibold text-slate-300 mb-1.5";

export default function OnboardingWizard({ userName }: { userName: string }) {
  const router = useRouter();
  const [step, setStep] = useState<Step>(0);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  // Step 1 — workspace
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [industry, setIndustry] = useState("");
  const workspaceIdRef = useRef<string | null>(null);
  const [workspaceName, setWorkspaceName] = useState("");

  // Step 2 — invites
  const [invites, setInvites] = useState<{ email: string; role: string }[]>([{ email: "", role: "Team Member" }]);
  const [inviteLink, setInviteLink] = useState("");
  const [linkCopied, setLinkCopied] = useState(false);

  // Step 3 — features
  const [features, setFeatures] = useState<Record<string, boolean>>(
    () => Object.fromEntries(FEATURES.filter(f => f.default).map(f => [f.key, true]))
  );

  const sendableInvites = useMemo(
    () => invites.filter(i => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(i.email)),
    [invites]
  );

  const sendInvites = async () => {
    const wsId = workspaceIdRef.current;
    if (!wsId) return;
    await Promise.all(
      sendableInvites.map(inv => inviteWorkspaceMemberAction(wsId, inv.email, inv.role))
    );
  };

  const createWorkspace = async () => {
    if (!name.trim()) {
      setError("Please name your workspace to continue.");
      return;
    }
    setError("");
    setBusy(true);
    const fd = new FormData();
    fd.set("name", name.trim());
    fd.set("slug", slug.trim());
    fd.set("industry", industry);
    const res = await createWorkspaceAction(fd);
    setBusy(false);
    if (!res.success) {
      setError(res.message || "Failed to create workspace.");
      return;
    }
    workspaceIdRef.current = res.workspace?._id as string | null;
    setWorkspaceName(name.trim());
    setInviteLink(
      `https://taskflow.pro/join/t/${res.workspace?._id || Math.random().toString(36).slice(2, 12)}`
    );
    setStep(1);
  };

  const goToFeatures = async (skip = false) => {
    setBusy(true);
    if (!skip && sendableInvites.length > 0) {
      await sendInvites();
    }
    setBusy(false);
    setStep(2);
  };

  const saveFeatures = async () => {
    const wsId = workspaceIdRef.current;
    if (!wsId) return router.push("/dashboard");
    setBusy(true);
    await updateWorkspaceFeaturesAction(wsId, features);
    setBusy(false);
    setStep(3);
  };

  const toggleFeature = (key: string) =>
    setFeatures(prev => ({ ...prev, [key]: !prev[key] }));

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(inviteLink);
      setLinkCopied(true);
      setTimeout(() => setLinkCopied(false), 1500);
    } catch {
      setLinkCopied(false);
    }
  };

  return (
    <div className="static-light min-h-screen bg-slate-50 text-slate-900 [color-scheme:light]">
      {/* Top bar */}
      <header className="flex h-16 items-center justify-between border-b border-slate-200 bg-white px-6">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-linear-to-tr from-indigo-600 to-violet-500 shadow-md shadow-indigo-500/25">
            <Kanban className="h-4.5 w-4.5 text-white" />
          </div>
          <span className="text-lg font-extrabold tracking-tight">
            TaskFlow <span className="text-indigo-600">Pro</span>
          </span>
        </div>
        <button
          onClick={() => router.push("/dashboard")}
          className="rounded-lg px-3.5 py-2 text-xs font-semibold text-slate-500 transition hover:bg-slate-100 hover:text-slate-900"
        >
          Save &amp; Exit
        </button>
      </header>

      <div className="mx-auto max-w-6xl px-6 py-10">
        <div className="rise overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-xl shadow-slate-900/5">
          <div className="grid grid-cols-1 lg:grid-cols-[17rem_1fr]">
            {/* Step rail */}
            <aside className="border-b border-slate-200 bg-slate-50/70 p-6 lg:border-r lg:border-b-0">
              <p className="font-mono text-[10px] font-bold tracking-[0.28em] text-indigo-600 uppercase">
                Onboarding
              </p>
              <p className="mt-1 text-[11px] font-semibold text-slate-500">
                Step {step + 1} of 4 · {STEPS[step].label}
              </p>

              {/* Progress bar */}
              <div className="mt-3 flex gap-1.5">
                {STEPS.map((_, i) => (
                  <div
                    key={i}
                    className={`h-1 flex-1 rounded-full transition-colors ${
                      i <= step ? "bg-indigo-600" : "bg-slate-200"
                    }`}
                  />
                ))}
              </div>

              <nav className="mt-7 space-y-1.5">
                {STEPS.map((s, i) => {
                  const Icon = s.icon;
                  const active = i === step;
                  const done = i < step;
                  return (
                    <button
                      key={s.label}
                      onClick={() => (i < step || step === 0 ? setStep(i as Step) : null)}
                      disabled={i > step}
                      className={`flex w-full items-center gap-3 rounded-xl px-3.5 py-2.5 text-xs font-semibold transition ${
                        active
                          ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/25"
                          : done
                            ? "text-slate-700 hover:bg-slate-100"
                            : "text-slate-400"
                      }`}
                    >
                      <span
                        className={`flex h-6 w-6 items-center justify-center rounded-lg ${
                          active ? "bg-white/20" : done ? "bg-emerald-100 text-emerald-600" : "bg-slate-100 text-slate-400"
                        }`}
                      >
                        {done ? <Check className="h-3.5 w-3.5" /> : <Icon className="h-3.5 w-3.5" />}
                      </span>
                      {s.label}
                    </button>
                  );
                })}
              </nav>

              <div className="mt-8 hidden rounded-xl border border-slate-200 bg-white p-4 lg:block">
                <p className="text-xs font-bold text-slate-800">Need assistance?</p>
                <p className="mt-1 text-[11px] leading-relaxed text-slate-500">
                  Our support team is available 24/7 to help you get set up.
                </p>
              </div>
            </aside>

            {/* Content */}
            <div className="flex flex-col p-6 lg:p-9">
              <div className="flex-1">
                {error && (
                  <div className="mb-5 flex items-center gap-2 rounded-xl border border-rose-200 bg-rose-50 px-4 py-2.5 text-xs font-semibold text-rose-600">
                    <AlertTriangle className="h-4 w-4" />
                    {error}
                  </div>
                )}

                {/* Step 1 — Workspace Setup */}
                {step === 0 && (
                  <div className="max-w-lg">
                    <h1 className="text-2xl font-extrabold tracking-tight">Workspace Setup</h1>
                    <p className="mt-2 text-xs leading-relaxed text-slate-500">
                      Let&apos;s start by setting up your primary workspace. This will be the home
                      for your team&apos;s projects.
                    </p>

                    <div className="mt-7 space-y-5">
                      <div>
                        <label className={labelCls}>Workspace Name</label>
                        <input
                          className={inputCls}
                          value={name}
                          onChange={e => setName(e.target.value)}
                          placeholder="e.g., Acme Corp"
                          autoFocus
                        />
                        <p className="mt-1.5 text-[10px] text-slate-400">
                          This is the visible name of your workspace.
                        </p>
                      </div>

                      <div>
                        <label className={labelCls}>Workspace URL</label>
                        <div className="flex overflow-hidden rounded-xl border border-slate-800 bg-slate-950/70 focus-within:border-indigo-500 focus-within:ring-1 focus-within:ring-indigo-500">
                          <span className="flex items-center border-r border-slate-800 bg-slate-900 px-3.5 font-mono text-xs text-slate-400">
                            taskflow.pro/
                          </span>
                          <input
                            className="w-full bg-transparent px-3.5 py-2.5 font-mono text-xs text-slate-200 placeholder-slate-500 focus:outline-none"
                            value={slug}
                            onChange={e =>
                              setSlug(
                                e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, "").slice(0, 30)
                              )
                            }
                            placeholder={name.trim().toLowerCase().replace(/\s+/g, "-") || "acme-corp"}
                          />
                        </div>
                      </div>

                      <div>
                        <label className={labelCls}>Industry</label>
                        <select className={inputCls} value={industry} onChange={e => setIndustry(e.target.value)}>
                          <option value="">Select your industry</option>
                          {INDUSTRIES.map(i => (
                            <option key={i} value={i}>{i}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>
                )}

                {/* Step 2 — Team Invites */}
                {step === 1 && (
                  <div className="max-w-2xl">
                    <h1 className="text-2xl font-extrabold tracking-tight">Invite your team</h1>
                    <p className="mt-2 text-xs leading-relaxed text-slate-500">
                      Step 2 of 4: Collaborate with your colleagues from day one. We&apos;ll send
                      them an invitation email.
                    </p>

                    <div className="mt-6 rounded-2xl border border-slate-200 bg-slate-50/60 p-5">
                      <p className="mb-3 text-[11px] font-bold tracking-wider text-slate-500 uppercase">
                        Email Addresses
                      </p>
                      <div className="space-y-2.5">
                        {invites.map((inv, i) => (
                          <div key={i} className="flex items-center gap-2">
                            <input
                              type="email"
                              className={inputCls}
                              placeholder="colleague@company.com"
                              value={inv.email}
                              onChange={e => {
                                const next = [...invites];
                                next[i] = { ...next[i], email: e.target.value };
                                setInvites(next);
                              }}
                            />
                            <select
                              className={`${inputCls} w-40 shrink-0`}
                              value={inv.role}
                              onChange={e => {
                                const next = [...invites];
                                next[i] = { ...next[i], role: e.target.value };
                                setInvites(next);
                              }}
                            >
                              {INVITE_ROLES.map(r => (
                                <option key={r} value={r}>{r}</option>
                              ))}
                            </select>
                            <button
                              onClick={() => setInvites(invites.filter((_, idx) => idx !== i))}
                              disabled={invites.length === 1}
                              className="rounded-lg p-2 text-slate-400 transition hover:bg-rose-50 hover:text-rose-500 disabled:opacity-30"
                            >
                              <X className="h-4 w-4" />
                            </button>
                          </div>
                        ))}
                      </div>
                      <button
                        onClick={() => setInvites([...invites, { email: "", role: "Team Member" }])}
                        className="mt-3 flex items-center gap-1.5 text-xs font-semibold text-indigo-600 transition hover:text-indigo-500"
                      >
                        <Plus className="h-3.5 w-3.5" />
                        Add another team member
                      </button>
                    </div>

                    <div className="mt-5 flex items-center gap-4">
                      <div className="h-px flex-1 bg-slate-200" />
                      <span className="text-[10px] font-bold tracking-wider text-slate-400 uppercase">Or</span>
                      <div className="h-px flex-1 bg-slate-200" />
                    </div>

                    <div className="mt-5">
                      <p className="text-xs font-bold text-slate-700">Share Invite Link</p>
                      <div className="mt-2 flex items-center gap-2">
                        <div className="flex flex-1 items-center gap-2 overflow-hidden rounded-xl border border-slate-800 bg-slate-950/70 px-3.5 py-2.5">
                          <Link2 className="h-3.5 w-3.5 shrink-0 text-slate-400" />
                          <span className="truncate font-mono text-[11px] text-slate-300">{inviteLink}</span>
                        </div>
                        <button
                          onClick={copyLink}
                          className="flex shrink-0 items-center gap-1.5 rounded-xl bg-indigo-600 px-3.5 py-2.5 text-xs font-bold text-white transition hover:bg-indigo-500"
                        >
                          {linkCopied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                          {linkCopied ? "Copied" : "Copy Link"}
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* Step 3 — Feature Selection */}
                {step === 2 && (
                  <div>
                    <h1 className="text-2xl font-extrabold tracking-tight">Tailor your workspace.</h1>
                    <p className="mt-2 max-w-xl text-xs leading-relaxed text-slate-500">
                      Enable the modules that align with your team&apos;s workflow. You can always
                      adjust these settings later in your workspace preferences.
                    </p>

                    <div className="mt-7 grid grid-cols-1 gap-3.5 md:grid-cols-2">
                      {FEATURES.map((feat, i) => {
                        const Icon = feat.icon;
                        const on = !!features[feat.key];
                        return (
                          <button
                            key={feat.key}
                            onClick={() => toggleFeature(feat.key)}
                            style={{ animationDelay: `${i * 60}ms` }}
                            className={`rise group relative flex items-start gap-3.5 rounded-2xl border p-4 text-left transition ${
                              on
                                ? "border-indigo-500/40 bg-indigo-600/5 shadow-md shadow-indigo-500/10"
                                : "border-slate-200 bg-white hover:border-slate-300"
                            }`}
                          >
                            <span
                              className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl transition ${
                                on ? "bg-indigo-600 text-white" : "bg-slate-100 text-slate-500 group-hover:bg-slate-200"
                              }`}
                            >
                              <Icon className="h-5 w-5" />
                            </span>
                            <span className="min-w-0 flex-1">
                              <span className="block text-sm font-bold text-slate-800">{feat.label}</span>
                              <span className="mt-0.5 block text-[11px] leading-relaxed text-slate-500">
                                {feat.hint}
                              </span>
                            </span>
                            <span
                              className={`relative mt-1 h-5 w-9 shrink-0 rounded-full border transition ${
                                on ? "border-indigo-600 bg-indigo-600" : "border-slate-300 bg-slate-200"
                              }`}
                            >
                              <span
                                className={`absolute top-1/2 h-3.5 w-3.5 -translate-y-1/2 rounded-full bg-white shadow transition-all ${
                                  on ? "left-[18px]" : "left-[2px]"
                                }`}
                              />
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Step 4 — Welcome */}
                {step === 3 && (
                  <div className="flex flex-col items-center py-6 text-center">
                    <div className="relative">
                      <div className="absolute inset-0 animate-ping rounded-full bg-indigo-500/20" />
                      <div className="relative flex h-20 w-20 items-center justify-center rounded-3xl bg-linear-to-tr from-indigo-600 to-violet-500 shadow-xl shadow-indigo-500/30">
                        <CheckCircle2 className="h-10 w-10 text-white" />
                      </div>
                    </div>

                    <h1 className="mt-6 text-3xl font-extrabold tracking-tight">
                      You&apos;re All Set{userName ? `, ${userName.split(" ")[0]}` : ""}!
                    </h1>
                    <p className="mt-2 max-w-md text-xs leading-relaxed text-slate-500">
                      Welcome to TaskFlow Pro. Your workspace is ready for high-performance
                      collaboration.
                    </p>

                    <div className="mt-7 w-full max-w-md overflow-hidden rounded-2xl border border-slate-200">
                      <p className="border-b border-slate-200 bg-slate-50 px-5 py-3 text-left text-xs font-bold text-slate-700">
                        Workspace Summary
                      </p>
                      <div className="divide-y divide-slate-200">
                        <div className="flex items-center gap-3 px-5 py-3.5">
                          <Building2 className="h-4 w-4 text-indigo-500" />
                          <span className="text-xs font-semibold text-slate-500">Organization</span>
                          <span className="ml-auto text-xs font-bold text-slate-800">
                            {workspaceName || name}
                          </span>
                        </div>
                        <div className="flex items-center gap-3 px-5 py-3.5">
                          <Users className="h-4 w-4 text-indigo-500" />
                          <span className="text-xs font-semibold text-slate-500">Team Size</span>
                          <span className="ml-auto text-xs font-bold text-slate-800">
                            {1 + sendableInvites.length} {1 + sendableInvites.length === 1 ? "Member" : "Members"}
                          </span>
                        </div>
                        <div className="flex items-center gap-3 px-5 py-3.5">
                          <ToggleRight className="h-4 w-4 text-indigo-500" />
                          <span className="text-xs font-semibold text-slate-500">Modules Enabled</span>
                          <span className="ml-auto text-xs font-bold text-slate-800">
                            {FEATURES.filter(f => features[f.key]).length}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Footer actions */}
              <div className="mt-8 flex items-center justify-between border-t border-slate-200 pt-5">
                {step > 0 ? (
                  <button
                    onClick={() => setStep((step - 1) as Step)}
                    className="flex items-center gap-1.5 rounded-xl px-4 py-2.5 text-xs font-semibold text-slate-500 transition hover:bg-slate-100 hover:text-slate-800"
                  >
                    <ArrowLeft className="h-3.5 w-3.5" />
                    Back
                  </button>
                ) : (
                  <span />
                )}

                <div className="flex items-center gap-2.5">
                  {step === 1 && (
                    <button
                      onClick={() => goToFeatures(true)}
                      disabled={busy}
                      className="rounded-xl px-4 py-2.5 text-xs font-semibold text-slate-400 transition hover:text-slate-600 disabled:opacity-50"
                    >
                      Skip for now
                    </button>
                  )}
                  {step < 3 && (
                    <button
                      onClick={() =>
                        step === 0
                          ? createWorkspace()
                          : step === 1
                            ? goToFeatures(false)
                            : saveFeatures()
                      }
                      disabled={busy}
                      className="flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 text-xs font-bold text-white transition hover:bg-indigo-500 shadow-md shadow-indigo-600/25 disabled:opacity-50"
                    >
                      {busy ? (
                        <Loader2 className="h-3.5 w-3.5 animate-spin" />
                      ) : (
                        <>
                          {step === 0 && "Continue"}
                          {step === 1 && "Continue"}
                          {step === 2 && "Continue to Final Review"}
                          <ArrowRight className="h-3.5 w-3.5" />
                        </>
                      )}
                    </button>
                  )}
                  {step === 3 && (
                    <button
                      onClick={() => router.push("/dashboard")}
                      className="flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 text-xs font-bold text-white transition hover:bg-indigo-500 shadow-md shadow-indigo-600/25"
                    >
                      Go to Dashboard
                      <ArrowRight className="h-3.5 w-3.5" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
