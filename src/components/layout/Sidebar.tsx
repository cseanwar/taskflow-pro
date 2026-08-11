"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Building2,
  FolderKanban,
  Zap,
  Calendar as CalendarIcon,
  BarChart3,
  Settings,
  Users,
  ChevronRight,
  Plus,
  House,
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

  // Reports are reserved for Project Managers, Workspace Owners, and Administrators.
  const canViewReports = maxEffectiveLevel(user ?? null, workspaces) >= LEVEL.manage;

  const navItems = [
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { name: "Workspaces", href: "/workspaces", icon: Building2 },
    {
      name: "Projects & Boards",
      href: activeWorkspace
        ? `/workspaces/${activeWorkspace._id}`
        : "/workspaces",
      icon: FolderKanban,
    },
    { name: "Calendar View", href: "/calendar", icon: CalendarIcon },
    ...(canViewReports
      ? [{ name: "Analytics & Reports", href: "/reports", icon: BarChart3 }]
      : []),
  ] as const;

  return (
    <aside className="sticky top-16 flex h-[calc(100vh-4rem)] w-64 flex-col border-r border-slate-800 bg-slate-900/60 p-4 backdrop-blur-md">
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

      {/* Main Navigation Links */}
      <nav className="flex-1 space-y-1.5">
        <label className="mb-2 block text-[11px] font-semibold tracking-wider text-slate-400 uppercase">
          Menu
        </label>
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive =
            pathname === item.href ||
            (item.href !== "/dashboard" && pathname.startsWith(item.href));

          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-xs font-semibold transition ${
                isActive
                  ? "bg-indigo-600/15 text-indigo-400 border border-indigo-500/20"
                  : "text-slate-400 hover:bg-slate-800/60 hover:text-slate-200"
              }`}
            >
              <Icon
                className={`h-4 w-4 ${isActive ? "text-indigo-400" : "text-slate-400"}`}
              />
              <span>{item.name}</span>
            </Link>
          );
        })}
      </nav>

      {/* Quick Settings / Bottom Links */}
      <div className="mt-auto border-t border-slate-800/80 pt-4">
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
  );
}
