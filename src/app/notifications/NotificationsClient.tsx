"use client";

import { useCallback, useEffect, useState } from "react";
import {
  Inbox,
  MessageSquare,
  CheckCircle,
  CalendarClock,
  UserPlus,
  CheckCheck,
  Archive,
  ArchiveRestore,
  Trash2,
  ArrowUpRight,
  Loader2,
  BellOff,
  MailCheck,
} from "lucide-react";
import {
  getNotificationsAction,
  markNotificationReadAction,
  markAllNotificationsReadAction,
  archiveNotificationAction,
  unarchiveNotificationAction,
  deleteNotificationAction,
} from "@/actions/notification.actions";
import { INotification } from "@/types";
import { timeAgo } from "@/lib/time";

type Tab = "all" | "unread" | "archived";

const NOTIF_ICON = {
  assignment: { icon: Inbox, classes: "bg-indigo-500/15 text-indigo-300" },
  comment: { icon: MessageSquare, classes: "bg-sky-500/15 text-sky-300" },
  task_update: { icon: CheckCircle, classes: "bg-emerald-500/15 text-emerald-300" },
  due_date: { icon: CalendarClock, classes: "bg-amber-500/15 text-amber-300" },
  invitation: { icon: UserPlus, classes: "bg-violet-500/15 text-violet-300" },
} as const;

const TABS: { id: Tab; label: string }[] = [
  { id: "all", label: "All" },
  { id: "unread", label: "Unread" },
  { id: "archived", label: "Archived" },
];

export default function NotificationsClient({
  initialNotifications,
  user,
}: {
  initialNotifications: INotification[];
  user: { id: string };
}) {
  const [tab, setTab] = useState<Tab>("all");
  const [notifications, setNotifications] = useState<INotification[]>(initialNotifications);
  const [loading, setLoading] = useState(false);

  const unreadCount = notifications.filter(n => !n.read).length;

  const load = useCallback(async (t: Tab) => {
    setLoading(true);
    const res = await getNotificationsAction(t);
    setNotifications(res);
    setLoading(false);
  }, []);

  const switchTab = (t: Tab) => {
    setTab(t);
    load(t);
  };

  useEffect(() => {
    if (tab !== "all" || initialNotifications.length === 0) return;
    getNotificationsAction("all").then(setNotifications);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const markRead = (id: string) => {
    setNotifications(prev => prev.map(n => (n._id === id ? { ...n, read: true } : n)));
    markNotificationReadAction(id);
  };

  const markAllRead = async () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    await markAllNotificationsReadAction();
  };

  const archive = (id: string) => {
    setNotifications(prev => prev.filter(n => n._id !== id));
    archiveNotificationAction(id);
  };

  const restore = (id: string) => {
    setNotifications(prev => prev.filter(n => n._id !== id));
    unarchiveNotificationAction(id);
  };

  const remove = (id: string) => {
    setNotifications(prev => prev.filter(n => n._id !== id));
    deleteNotificationAction(id);
  };

  return (
    <div>
      {/* Tabs + actions */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="inline-flex items-center gap-1 rounded-xl border border-slate-800 bg-slate-900/70 p-1">
          {TABS.map(t => {
            const active = tab === t.id;
            const badge =
              t.id === "unread" ? unreadCount : t.id === "archived" ? notifications.length : null;
            return (
              <button
                key={t.id}
                onClick={() => switchTab(t.id)}
                className={`flex items-center gap-1.5 rounded-lg px-3.5 py-1.5 text-xs font-semibold transition ${
                  active
                    ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/25"
                    : "text-slate-400 hover:text-slate-200"
                }`}
              >
                {t.label}
                {badge !== null && tab === t.id && (
                  <span
                    className={`rounded-full px-1.5 py-0.5 text-[9px] font-bold ${
                      active ? "bg-white/20 text-white" : "bg-slate-800 text-slate-400"
                    }`}
                  >
                    {badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {tab !== "archived" && unreadCount > 0 && (
          <button
            onClick={markAllRead}
            className="flex items-center gap-1.5 rounded-xl border border-slate-800 bg-slate-900/70 px-3.5 py-1.5 text-xs font-semibold text-indigo-300 transition hover:border-indigo-500/40 hover:text-indigo-200"
          >
            <CheckCheck className="h-3.5 w-3.5" />
            Mark all as read
          </button>
        )}
      </div>

      {/* List */}
      <div className="mt-5 space-y-2.5">
        {loading && (
          <div className="flex items-center justify-center gap-2 rounded-2xl border border-slate-800 bg-slate-900/50 py-14 text-xs text-slate-500">
            <Loader2 className="h-4 w-4 animate-spin text-indigo-400" />
            Loading notifications...
          </div>
        )}

        {!loading && notifications.length === 0 && (
          <EmptyState tab={tab} />
        )}

        {!loading &&
          notifications.map((n, i) => {
            const meta = NOTIF_ICON[n.type] || NOTIF_ICON.task_update;
            const Icon = meta.icon;
            return (
              <div
                key={n._id}
                style={{ animationDelay: `${i * 45}ms` }}
                className={`rise group flex items-start gap-4 rounded-2xl border p-4 transition ${
                  n.read
                    ? "border-slate-800/70 bg-slate-900/40 opacity-80"
                    : "border-indigo-500/25 bg-indigo-950/20 shadow-lg shadow-indigo-950/30"
                }`}
              >
                <span className={`mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${meta.classes}`}>
                  <Icon className="h-5 w-5" />
                </span>

                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-1">
                    <span className="font-display text-sm font-bold text-slate-100">{n.title}</span>
                    <span className="shrink-0 font-mono text-[10px] tracking-wide text-slate-500">
                      {timeAgo(n.createdAt)}
                    </span>
                  </div>
                  <p className="mt-1 text-xs leading-relaxed text-slate-400">{n.message}</p>

                  <div className="mt-2.5 flex flex-wrap items-center gap-2">
                    {n.link && (
                      <a
                        href={n.link}
                        onClick={() => markRead(n._id)}
                        className="inline-flex items-center gap-1 rounded-lg border border-indigo-500/30 bg-indigo-500/10 px-2.5 py-1 text-[10px] font-bold text-indigo-300 transition hover:bg-indigo-500/20"
                      >
                        View Task
                        <ArrowUpRight className="h-3 w-3" />
                      </a>
                    )}
                    {!n.read && (
                      <button
                        onClick={() => markRead(n._id)}
                        className="inline-flex items-center gap-1 rounded-lg border border-slate-800 px-2.5 py-1 text-[10px] font-semibold text-slate-400 transition hover:text-slate-200"
                      >
                        <CheckCheck className="h-3 w-3" />
                        Mark as read
                      </button>
                    )}
                    {tab !== "archived" ? (
                      <button
                        onClick={() => archive(n._id)}
                        className="inline-flex items-center gap-1 rounded-lg border border-slate-800 px-2.5 py-1 text-[10px] font-semibold text-slate-400 transition hover:text-slate-200"
                      >
                        <Archive className="h-3 w-3" />
                        Archive
                      </button>
                    ) : (
                      <button
                        onClick={() => restore(n._id)}
                        className="inline-flex items-center gap-1 rounded-lg border border-slate-800 px-2.5 py-1 text-[10px] font-semibold text-slate-400 transition hover:text-slate-200"
                      >
                        <ArchiveRestore className="h-3 w-3" />
                        Restore
                      </button>
                    )}
                    <button
                      onClick={() => remove(n._id)}
                      className="inline-flex items-center gap-1 rounded-lg px-2.5 py-1 text-[10px] font-semibold text-slate-500 transition hover:bg-rose-500/10 hover:text-rose-400"
                    >
                      <Trash2 className="h-3 w-3" />
                      Delete
                    </button>
                  </div>
                </div>

                {!n.read && <span className="glow-dot mt-2 h-2 w-2 shrink-0 rounded-full bg-indigo-400" />}
              </div>
            );
          })}
      </div>
    </div>
  );
}

function EmptyState({ tab }: { tab: Tab }) {
  const Icon = tab === "archived" ? ArchiveRestore : tab === "unread" ? BellOff : MailCheck;
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-800 bg-slate-900/30 py-16 text-center">
      <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-800/80">
        <Icon className="h-6 w-6 text-slate-500" />
      </span>
      <h3 className="font-display mt-4 text-sm font-bold text-slate-300">
        {tab === "all" && "No notifications yet"}
        {tab === "unread" && "You're all caught up"}
        {tab === "archived" && "No archived notifications"}
      </h3>
      <p className="mt-1 max-w-xs text-xs text-slate-500">
        {tab === "archived"
          ? "Archived notifications will gather here after you tidy your inbox."
          : "Assignments, comments, and deadline reminders will show up here."}
      </p>
    </div>
  );
}