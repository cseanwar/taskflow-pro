"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Bell,
  Search,
  Plus,
  User,
  LogOut,
  CheckCircle,
  Kanban,
  Layers,
  ChevronDown,
} from "lucide-react";
import { logoutAction } from "@/actions/auth.actions";
import { IUser } from "@/types";
import Image from "next/image";

interface NavbarProps {
  user: IUser | null;
  onOpenCreateTask?: () => void;
  onOpenCreateProject?: () => void;
  onOpenCreateWorkspace?: () => void;
  /** Guests have read-only access and cannot use the quick-create menu. */
  isGuest?: boolean;
  /** Restrict "New Project" to users who can actually create projects (PM+). */
  canCreateProject?: boolean;
}

export default function Navbar({
  user,
  onOpenCreateTask,
  onOpenCreateProject,
  onOpenCreateWorkspace,
  isGuest = false,
  canCreateProject = true,
}: NavbarProps) {
  const router = useRouter();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showQuickCreate, setShowQuickCreate] = useState(false);

  const handleLogout = async () => {
    await logoutAction();
    router.push("/login");
  };

  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-slate-800 bg-slate-900/80 px-6 backdrop-blur-md">
      {/* Brand & Search */}
      <div className="flex items-center gap-6">
        <Link href="/dashboard" className="flex items-center gap-3.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-linear-to-tr from-indigo-600 to-violet-500 shadow-lg shadow-indigo-500/30">
            <Kanban className="h-5 w-5 text-white" />
          </div>
          <span className="bg-linear-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-xl font-bold tracking-tight text-transparent">
            TaskFlow <span className="text-indigo-400">Pro</span>
          </span>
        </Link>

        {/* Global Search Bar */}
        <div className="relative hidden md:block w-72">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search projects, tasks, members... (Enter)"
            onKeyDown={e => {
              if (e.key === 'Enter' && (e.target as HTMLInputElement).value.trim()) {
                router.push(`/search?q=${encodeURIComponent((e.target as HTMLInputElement).value.trim())}`);
              }
            }}
            className="w-full rounded-lg border border-slate-800 bg-slate-950/60 py-1.5 pl-9 pr-4 text-xs text-slate-200 placeholder-slate-500 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          />
        </div>
      </div>

      {/* Right Actions */}
      <div className="flex items-center gap-3">
        {/* Quick Action Button */}
        {user && !isGuest && (
          <div className="relative">
            <button
              onClick={() => setShowQuickCreate(!showQuickCreate)}
              className="flex items-center gap-1.5 rounded-lg bg-indigo-600 px-3.5 py-1.5 text-xs font-semibold text-white transition hover:bg-indigo-500 shadow-md shadow-indigo-600/20"
            >
              <Plus className="h-4 w-4" />
              <span>Create</span>
              <ChevronDown className="h-3 w-3 opacity-70" />
            </button>

            {showQuickCreate && (
              <div className="absolute right-0 mt-2 w-48 rounded-xl border border-slate-800 bg-slate-900 py-1.5 shadow-2xl z-50">
                {onOpenCreateTask && (
                  <button
                    onClick={() => {
                      setShowQuickCreate(false);
                      onOpenCreateTask();
                    }}
                    className="flex w-full items-center gap-2 px-4 py-2 text-xs font-medium text-slate-300 hover:bg-slate-800 hover:text-white"
                  >
                    <CheckCircle className="h-4 w-4 text-indigo-400" />
                    <span>New Task</span>
                  </button>
                )}
                {onOpenCreateProject && canCreateProject && (
                  <button
                    onClick={() => {
                      setShowQuickCreate(false);
                      onOpenCreateProject();
                    }}
                    className="flex w-full items-center gap-2 px-4 py-2 text-xs font-medium text-slate-300 hover:bg-slate-800 hover:text-white"
                  >
                    <Layers className="h-4 w-4 text-indigo-400" />
                    <span>New Project</span>
                  </button>
                )}
              </div>
            )}
          </div>
        )}

        {/* Notifications Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative flex h-9 w-9 items-center justify-center rounded-lg border border-slate-800 bg-slate-950/60 text-slate-400 transition hover:border-slate-700 hover:text-slate-200"
          >
            <Bell className="h-4 w-4" />
            <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-indigo-500 animate-pulse" />
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 rounded-xl border border-slate-800 bg-slate-900 p-4 shadow-2xl z-50">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
                <h4 className="text-xs font-semibold text-slate-200">
                  Notifications
                </h4>
                <span className="rounded bg-indigo-500/10 px-2 py-0.5 text-[10px] font-medium text-indigo-400">
                  3 New
                </span>
              </div>
              <div className="mt-3 space-y-2.5 max-h-64 overflow-y-auto">
                <div className="rounded-lg border border-slate-800/80 bg-slate-950/50 p-2.5 text-xs">
                  <p className="font-medium text-slate-200">Task Assigned</p>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    You were assigned to &quot;Setup Authentication System&quot;
                  </p>
                  <span className="text-[10px] text-slate-500 mt-1 block">
                    10 mins ago
                  </span>
                </div>
                <div className="rounded-lg border border-slate-800/80 bg-slate-950/50 p-2.5 text-xs">
                  <p className="font-medium text-slate-200">Sprint Started</p>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    Sprint 4 is now active
                  </p>
                  <span className="text-[10px] text-slate-500 mt-1 block">
                    1 hour ago
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* User Profile Menu */}
        {user ? (
          <div className="relative">
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center gap-2.5 rounded-lg border border-slate-800 bg-slate-950/60 p-1.5 pr-3 text-left transition hover:border-slate-700"
            >
              <Image
                width={20}
                height={20}
                src={
                  user.avatar ||
                  `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.name}`
                }
                alt={user.name}
                className="h-7 w-7 rounded-full bg-slate-800 object-cover"
              />
              <div className="hidden sm:block">
                <p className="text-xs font-semibold text-slate-200">
                  {user.name}
                </p>
                <p className="text-[10px] text-indigo-400 font-medium">
                  {user.role}
                </p>
              </div>
              <ChevronDown className="h-3 w-3 text-slate-400" />
            </button>

            {showUserMenu && (
              <div className="absolute right-0 mt-2 w-52 rounded-xl border border-slate-800 bg-slate-900 p-1.5 shadow-2xl z-50">
                <div className="border-b border-slate-800 px-3 py-2">
                  <p className="text-xs font-semibold text-slate-200">
                    {user.name}
                  </p>
                  <p className="text-[11px] text-slate-400 truncate">
                    {user.email}
                  </p>
                </div>
                <div className="py-1">
                  <Link
                    href="/dashboard"
                    className="flex items-center gap-2 rounded-lg px-3 py-1.5 text-xs font-medium text-slate-300 hover:bg-slate-800 hover:text-white"
                  >
                    <User className="h-4 w-4 text-indigo-400" />
                    <span>Dashboard</span>
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="flex w-full items-center gap-2 rounded-lg px-3 py-1.5 text-xs font-medium text-rose-400 hover:bg-rose-500/10 hover:text-rose-300"
                  >
                    <LogOut className="h-4 w-4" />
                    <span>Sign Out</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <Link
              href="/login"
              className="rounded-lg px-3.5 py-1.5 text-xs font-semibold text-slate-300 hover:text-white"
            >
              Sign In
            </Link>
            <Link
              href="/register"
              className="rounded-lg bg-indigo-600 px-3.5 py-1.5 text-xs font-semibold text-white hover:bg-indigo-500 shadow-md shadow-indigo-600/20"
            >
              Get Started
            </Link>
          </div>
        )}
      </div>
    </header>
  );
}
