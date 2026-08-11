"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState, type MouseEvent as ReactMouseEvent } from "react";
import {
  LayoutDashboard,
  FolderKanban,
  CheckSquare,
  Users,
  BarChart3,
  Settings,
  UserPlus,
  Radio,
  ChevronRight,
  Plus,
  House,
  Command,
  X,
} from "lucide-react";
import { IUser, IWorkspace } from "@/types";
import Image from "next/image";
import { LEVEL, maxEffectiveLevel } from "@/lib/permissions";

interface SidebarProps {
  workspaces?: IWorkspace[];
  activeWorkspace?: IWorkspace | null;
  user?: IUser | null;
  onSelectWorkspace?: (workspace: IWorkspace) => void;
  onOpenCreateWorkspace?: () => void;
}

export default function Sidebar({
  workspaces = [],
  activeWorkspace,
  user,
  onSelectWorkspace,
  onOpenCreateWorkspace,
}: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();

  // Mobile drawer state, toggled from the Navbar's hamburger via a custom event.
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onToggle = () => setOpen(o => !o);
    const onClose = () => setOpen(false);
    window.addEventListener("tfp:toggle-sidebar", onToggle);
    window.addEventListener("tfp:close-sidebar", onClose);
    return () => {
      window.removeEventListener("tfp:toggle-sidebar", onToggle);
      window.removeEventListener("tfp:close-sidebar", onClose);
    };
  }, []);

  // Lock body scroll while the mobile drawer is open.
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  // Any link/button tapped inside the drawer closes it (desktop is a no-op).
  const handleInsideClick = (e: ReactMouseEvent<HTMLElement>) => {
    if ((e.target as HTMLElement).closest("a, button")) setOpen(false);
  };

  // Reports & analytics are reserved for Project Managers, Workspace Owners, and Administrators.
  const canViewReports = maxEffectiveLevel(user ?? null, workspaces) >= LEVEL.manage;

  const navItems = [
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    {
      name: "Projects",
      href: activeWorkspace ? `/workspaces/${activeWorkspace._id}` : "/workspaces",
      icon: FolderKanban,
    },
    { name: "Tasks", href: "/calendar", icon: CheckSquare },
    { name: "Team", href: "/team", icon: Users },
    ...(canViewReports
      ? [{ name: "Analytics", href: "/reports", icon: BarChart3 }]
      : []),
    { name: "Settings", href: "/settings/appearance", icon: Settings },
  ] as const;

  const secondary = [
    {
      name: "Activity Feed",
      href: "/collaboration",
      icon: Radio,
      hint: "Live team activity",
    },
  ] as const;

  const isActive = (href: string) =>
    pathname === href ||
    (href !== "/dashboard" && pathname.startsWith(href));

  return (
    <>
      {/* Mobile backdrop */}
      {open && (
        <div
          className="fixed inset-0 z-40 bg-slate-950/70 backdrop-blur-sm lg:hidden"
          onClick={() => setOpen(false)}
          aria-hidden="true"
        />
      )}

      <aside
        onClick={handleInsideClick}
        className={`fixed inset-y-0 left-0 z-50 flex w-72 max-w-[85vw] flex-col border-r border-slate-800 bg-slate-900/95 p-4 backdrop-blur-md transition-transform duration-300 ease-out lg:sticky lg:top-16 lg:z-auto lg:h-[calc(100vh-4rem)] lg:w-64 lg:max-w-none lg:translate-x-0 lg:bg-slate-900/60 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
      {/* Mobile drawer header */}
      <div className="mb-5 flex items-center justify-between lg:hidden">
        <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
          Menu
        </p>
      <button
        onClick={() => setOpen(false)}
        aria-label="Close menu"
        className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-800 bg-slate-950/60 text-slate-400 transition hover:text-white"
      >
        <X className="h-4 w-4" />
      </button>
      </div>

      {/* Workspace Switcher */}
      <div className="mb-6">
        <label className="mb-2 block text-[11px] font-semibold tracking-wider text-slate-400 uppercase">
          Workspace
        </label>
        {activeWorkspace ? (
          <div className="flex items-center justify-between rounded-xl border border-slate-800 bg-slate-950/70 p-2.5">
            <div className="flex items-center gap-3">
              <Image
                src={
                  activeWorkspace.logo ||
                  `https://api.dicebear.com/7.x/identicon/svg?seed=${activeWorkspace.name}`
                }
                alt={activeWorkspace.name}
                className="h-8 w-8 rounded-lg bg-indigo-600/20 object-cover"
              />
              <div className="overflow-hidden">
                <h3 className="truncate text-xs font-bold text-slate-200">
                  {activeWorkspace.name}
                </h3>
                <p className="text-[10px] text-slate-400">
                  {activeWorkspace.members?.length || 1} Members
                </p>
              </div>
            </div>
            {onOpenCreateWorkspace && (
              <button
                onClick={onOpenCreateWorkspace}
                className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-800 hover:text-white"
                title="Create Workspace"
              >
                <Plus className="h-4 w-4" />
              </button>
            )}
          </div>
        ) : (
          <button
            onClick={onOpenCreateWorkspace}
            className="flex w-full items-center justify-between rounded-xl border border-dashed border-slate-700 bg-slate-950/40 p-2.5 text-xs font-semibold text-slate-300 transition hover:border-indigo-500 hover:text-indigo-400"
          >
            <div className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              <span>Create Workspace</span>
            </div>
            <ChevronRight className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Primary Navigation */}
      <nav className="flex-1 space-y-1.5">
        <label className="mb-2 block text-[11px] font-semibold tracking-wider text-slate-400 uppercase">
          Menu
        </label>
        {navItems.map(item => {
          const Icon = item.icon;
          const active = isActive(item.href);
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-xs font-semibold transition ${
                active
                  ? "bg-indigo-600/15 text-indigo-300 border border-indigo-500/20"
                  : "text-slate-400 hover:bg-slate-800/60 hover:text-slate-200"
              }`}
            >
              <Icon className={`h-4 w-4 ${active ? "text-indigo-400" : "text-slate-400"}`} />
              <span>{item.name}</span>
            </Link>
          );
        })}

        <div className="pt-3 mt-3 border-t border-slate-800/80">
          {secondary.map(item => {
            const Icon = item.icon;
            const active = isActive(item.href);
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-xs font-semibold transition ${
                  active
                    ? "bg-indigo-600/15 text-indigo-300 border border-indigo-500/20"
                    : "text-slate-400 hover:bg-slate-800/60 hover:text-slate-200"
                }`}
              >
                <Icon className={`h-4 w-4 ${active ? "text-indigo-400" : "text-slate-400"}`} />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </div>
      </nav>

      {/* Quick Settings / Bottom Links */}
      <div className="mt-auto space-y-3 border-t border-slate-800/80 pt-4">
        <button
          onClick={() => window.dispatchEvent(new CustomEvent("tfp:open-command"))}
          className="flex w-full items-center gap-2.5 rounded-xl border border-slate-700 bg-slate-950/40 px-3.5 py-2.5 text-xs font-semibold text-slate-300 transition hover:border-indigo-500 hover:text-indigo-300"
        >
          <Command className="h-4 w-4 text-slate-400" />
          <span>Quick Search</span>
          <kbd className="ml-auto rounded border border-slate-700 bg-slate-800 px-1.5 py-0.5 font-mono text-[9px] text-slate-400">
            ⌘K
          </kbd>
        </button>

        <button
          onClick={() => router.push("/team")}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 px-3.5 py-2.5 text-xs font-bold text-white transition hover:bg-indigo-500 shadow-md shadow-indigo-600/20"
        >
          <UserPlus className="h-4 w-4" />
          Invite Team
        </button>

        <div className="rounded-xl border border-indigo-500/20 bg-linear-to-br from-indigo-950/40 to-slate-900 p-3">
          <Link href="/">
            <div className="flex items-center gap-2 text-xs font-semibold text-indigo-300">
              <House className="h-4 w-4 text-indigo-400 animate-pulse" />
              <span className="text-[11px] text-slate-400">Back To Home</span>
            </div>
          </Link>
        </div>
      </div>
    </aside>
    </>
  );
}
