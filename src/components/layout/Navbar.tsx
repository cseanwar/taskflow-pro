"use client";

import React, { useEffect, useRef, useState } from "react";
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
  Inbox,
  UserCircle2,
  CheckCheck,
  Mail,
  MessageSquare,
  CalendarClock,
  UserPlus,
  ArrowRight,
  Loader2,
} from "lucide-react";
import { logoutAction } from "@/actions/auth.actions";
import {
  getUnreadNotificationCountAction,
  getNotificationsAction,
  markNotificationReadAction,
  markAllNotificationsReadAction,
} from "@/actions/notification.actions";
import { IUser, INotification } from "@/types";
import { timeAgo } from "@/lib/time";
import Image from "next/image";
import ThemeToggle from "@/components/theme/ThemeToggle";
import CommandPalette from "@/components/command/CommandPalette";

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

const NOTIF_ICON = {
  assignment: { icon: Inbox, classes: "bg-indigo-500/15 text-indigo-300" },
  comment: { icon: MessageSquare, classes: "bg-sky-500/15 text-sky-300" },
  task_update: { icon: CheckCircle, classes: "bg-emerald-500/15 text-emerald-300" },
  due_date: { icon: CalendarClock, classes: "bg-amber-500/15 text-amber-300" },
  invitation: { icon: UserPlus, classes: "bg-violet-500/15 text-violet-300" },
} as const;

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

  const [unreadCount, setUnreadCount] = useState(0);
  const [notifications, setNotifications] = useState<INotification[]>([]);
  const [loadingNotifs, setLoadingNotifs] = useState(false);
  const bellRef = useRef<HTMLDivElement>(null);
  const loadedOnce = useRef(false);

  useEffect(() => {
    getUnreadNotificationCountAction().then(setUnreadCount);
  }, []);

  // Close menus on outside click
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (bellRef.current && !bellRef.current.contains(e.target as Node)) {
        setShowNotifications(false);
      }
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  const openNotifications = async () => {
    const next = !showNotifications;
    setShowNotifications(next);
    if (next && !loadedOnce.current) {
      loadedOnce.current = true;
      setLoadingNotifs(true);
      getNotificationsAction("all").then(res => {
        setNotifications(res.slice(0, 6));
        setLoadingNotifs(false);
        setUnreadCount(res.filter((n: INotification) => !n.read).length);
      });
    }
  };

  const handleNotificationClick = async (n: INotification) => {
    if (!n.read) {
      markNotificationReadAction(n._id);
      setNotifications(prev =>
        prev.map(p => (p._id === n._id ? { ...p, read: true } : p))
      );
      setUnreadCount(c => Math.max(0, c - 1));
    }
    setShowNotifications(false);
    if (n.link) router.push(n.link);
  };

  const handleMarkAllRead = async () => {
    setNotifications(prev => prev.map(p => ({ ...p, read: true })));
    setUnreadCount(0);
    await markAllNotificationsReadAction();
  };

  const handleLogout = async () => {
    await logoutAction();
    router.push("/login");
  };

  const unreadInList = notifications.filter(n => !n.read).length;

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
          <button
            onClick={() => window.dispatchEvent(new CustomEvent("tfp:open-command"))}
            className="w-full rounded-lg border border-slate-800 bg-slate-950/60 py-1.5 pl-9 pr-14 text-left text-xs text-slate-500 transition hover:border-slate-700 hover:text-slate-400"
          >
            Search projects, tasks, members…
          </button>
          <kbd className="absolute right-3 top-1/2 -translate-y-1/2 rounded border border-slate-700 bg-slate-800 px-1.5 py-0.5 font-mono text-[9px] text-slate-400">
            ⌘K
          </kbd>
        </div>
      </div>

      {/* Right Actions */}
      <div className="flex items-center gap-3">
        {/* Theme toggle */}
        <ThemeToggle />
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
        <div className="relative" ref={bellRef}>
          <button
            onClick={openNotifications}
            aria-label="Notifications"
            className="relative flex h-9 w-9 items-center justify-center rounded-lg border border-slate-800 bg-slate-950/60 text-slate-400 transition hover:border-slate-700 hover:text-slate-200"
          >
            <Bell className="h-4 w-4" />
            {unreadCount > 0 ? (
              <span className="absolute -top-1.5 -right-1.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-indigo-500 px-1 text-[9px] font-bold text-white shadow-md shadow-indigo-500/40">
                {unreadCount > 9 ? "9+" : unreadCount}
              </span>
            ) : (
              <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-slate-700" />
            )}
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-[22rem] overflow-hidden rounded-2xl border border-slate-800 bg-slate-900 shadow-2xl z-50">
              <div className="flex items-center justify-between border-b border-slate-800 bg-slate-950/40 px-4 py-3">
                <div className="flex items-center gap-2">
                  <h4 className="text-xs font-bold text-slate-100">
                    Notifications
                  </h4>
                  {unreadCount > 0 && (
                    <span className="rounded-full bg-indigo-500/15 px-2 py-0.5 text-[10px] font-semibold text-indigo-300">
                      {unreadCount} new
                    </span>
                  )}
                </div>
                {unreadInList > 0 && (
                  <button
                    onClick={handleMarkAllRead}
                    className="flex items-center gap-1 text-[10px] font-semibold text-indigo-400 hover:text-indigo-300"
                  >
                    <CheckCheck className="h-3 w-3" />
                    Mark all read
                  </button>
                )}
              </div>

              <div className="max-h-80 overflow-y-auto">
                {loadingNotifs && (
                  <div className="flex items-center justify-center gap-2 py-8 text-[11px] text-slate-500">
                    <Loader2 className="h-4 w-4 animate-spin text-indigo-400" />
                    Loading notifications...
                  </div>
                )}

                {!loadingNotifs && notifications.length === 0 && (
                  <div className="px-4 py-8 text-center">
                    <Mail className="mx-auto h-6 w-6 text-slate-600" />
                    <p className="mt-2 text-[11px] text-slate-500">
                      You&apos;re all caught up.
                    </p>
                  </div>
                )}

                {!loadingNotifs &&
                  notifications.map(n => {
                    const meta = NOTIF_ICON[n.type] || NOTIF_ICON.task_update;
                    const Icon = meta.icon;
                    return (
                      <button
                        key={n._id}
                        onClick={() => handleNotificationClick(n)}
                        className={`flex w-full items-start gap-3 border-b border-slate-800/60 px-4 py-3 text-left transition hover:bg-slate-800/50 ${
                          n.read ? "opacity-70" : "bg-indigo-500/[0.03]"
                        }`}
                      >
                        <span className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${meta.classes}`}>
                          <Icon className="h-4 w-4" />
                        </span>
                        <span className="min-w-0 flex-1">
                          <span className="flex items-center justify-between gap-2">
                            <span className="truncate text-[11px] font-bold text-slate-100">
                              {n.title}
                            </span>
                            <span className="shrink-0 text-[9px] font-medium text-slate-500">
                              {timeAgo(n.createdAt)}
                            </span>
                          </span>
                          <span className="mt-0.5 line-clamp-2 block text-[11px] leading-relaxed text-slate-400">
                            {n.message}
                          </span>
                        </span>
                        {!n.read && (
                          <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-indigo-400" />
                        )}
                      </button>
                    );
                  })}
              </div>

              <Link
                href="/notifications"
                onClick={() => setShowNotifications(false)}
                className="flex items-center justify-center gap-1.5 bg-slate-950/40 px-4 py-2.5 text-[11px] font-bold text-indigo-400 transition hover:text-indigo-300"
              >
                View all notifications
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
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
              <div className="absolute right-0 mt-2 w-56 rounded-xl border border-slate-800 bg-slate-900 p-1.5 shadow-2xl z-50">
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
                    href="/profile"
                    className="flex items-center gap-2 rounded-lg px-3 py-1.5 text-xs font-medium text-slate-300 hover:bg-slate-800 hover:text-white"
                  >
                    <UserCircle2 className="h-4 w-4 text-indigo-400" />
                    <span>Profile & Settings</span>
                  </Link>
                  <Link
                    href="/notifications"
                    className="flex items-center gap-2 rounded-lg px-3 py-1.5 text-xs font-medium text-slate-300 hover:bg-slate-800 hover:text-white"
                  >
                    <Bell className="h-4 w-4 text-indigo-400" />
                    <span>Notifications</span>
                  </Link>
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
      <CommandPalette />
    </header>
  );
}