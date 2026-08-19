"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Search, FolderKanban, CheckCircle2, User, CornerDownLeft, X } from "lucide-react";
import { searchAction } from "@/actions/search.actions";
import { ISearchResults } from "@/types";
import Image from "next/image";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { setCommandPaletteOpen } from "@/redux/slices/uiSlice";

interface FlatItem {
  id: string;
  kind: "project" | "task" | "member";
  title: string;
  subtitle: string;
  href: string;
  icon: typeof FolderKanban;
  avatar?: string;
}

export default function CommandPalette() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const open = useAppSelector((state) => state.ui.isCommandPaletteOpen);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<ISearchResults>({ tasks: [], projects: [], members: [] });
  const [loading, setLoading] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const openPalette = () => {
    dispatch(setCommandPaletteOpen(true));
    setQuery("");
    setResults({ tasks: [], projects: [], members: [] });
    setActiveIndex(0);
    setTimeout(() => inputRef.current?.focus(), 30);
  };

  const closePalette = () => {
    dispatch(setCommandPaletteOpen(false));
  };

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        if (open) closePalette();
        else openPalette();
      }
      if (e.key === "Escape") closePalette();
    };
    const onCustomOpen = () => openPalette();
    window.addEventListener("keydown", onKey);
    window.addEventListener("tfp:open-command", onCustomOpen);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("tfp:open-command", onCustomOpen);
    };
  }, [open, dispatch]);

  useEffect(() => {
    if (timer.current) clearTimeout(timer.current);
    const q = query.trim();
    if (!open) return;
    timer.current = setTimeout(async () => {
      if (!q) {
        setResults({ tasks: [], projects: [], members: [] });
        setLoading(false);
        setActiveIndex(0);
        return;
      }
      setLoading(true);
      const res = await searchAction(q);
      setResults(res);
      setActiveIndex(0);
      setLoading(false);
    }, q ? 250 : 0);
    return () => {
      if (timer.current) clearTimeout(timer.current);
    };
  }, [query, open]);

  const items = useCallback((): FlatItem[] => {
    const out: FlatItem[] = [];
    results.projects.forEach(p =>
      out.push({
        id: `p-${p._id}`,
        kind: "project",
        title: p.name,
        subtitle: `${p.code} · ${p.status}`,
        href: `/projects/${p._id}`,
        icon: FolderKanban,
      })
    );
    results.tasks.forEach(t =>
      out.push({
        id: `t-${t._id}`,
        kind: "task",
        title: t.title,
        subtitle: `${t.projectCode}-${t.key || ""} · ${t.columnId}`,
        href: `/projects/${t.projectId}`,
        icon: CheckCircle2,
      })
    );
    results.members.forEach(m =>
      out.push({
        id: `m-${m.id}`,
        kind: "member",
        title: m.name,
        subtitle: `${m.email} · ${m.role}`,
        href: "/team",
        icon: User,
        avatar: m.avatar,
      })
    );
    return out;
  }, [results]);

  const flat = items();

  const go = (item: FlatItem) => {
    closePalette();
    router.push(item.href);
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex(i => Math.min(i + 1, flat.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex(i => Math.max(i - 1, 0));
    } else if (e.key === "Enter" && flat[activeIndex]) {
      e.preventDefault();
      go(flat[activeIndex]);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[80] flex items-start justify-center bg-slate-950/60 p-4 pt-[12vh] backdrop-blur-sm">
      <div className="w-full max-w-xl overflow-hidden rounded-2xl border border-slate-800 bg-slate-900 shadow-2xl shadow-black/50">
        <div className="flex items-center gap-3 border-b border-slate-800 px-4 py-3">
          <Search className="h-4 w-4 text-slate-400" />
          <input
            ref={inputRef}
            value={query}
            onChange={e => setQuery(e.target.value)}
            onKeyDown={onKeyDown}
            placeholder="Search projects, tasks, members…"
            className="flex-1 bg-transparent text-sm text-slate-100 placeholder-slate-500 focus:outline-none"
          />
          <button
            onClick={closePalette}
            className="rounded-md p-1 text-slate-500 transition hover:bg-slate-800 hover:text-slate-300"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="max-h-96 overflow-y-auto py-2">
          {loading && (
            <p className="px-4 py-6 text-center text-xs text-slate-500">Searching…</p>
          )}
          {!loading && query.trim() && flat.length === 0 && (
            <p className="px-4 py-6 text-center text-xs text-slate-500">
              No results for &ldquo;{query}&rdquo;
            </p>
          )}
          {!loading && !query.trim() && (
            <p className="px-4 py-6 text-center text-[11px] text-slate-500">
              Type to search across your projects, tasks, and team.
            </p>
          )}
          {!loading &&
            flat.map((item, i) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => go(item)}
                  onMouseEnter={() => setActiveIndex(i)}
                  className={`flex w-full items-center gap-3 px-4 py-2.5 text-left transition ${
                    i === activeIndex ? "bg-indigo-600/15" : ""
                  }`}
                >
                  {item.avatar ? (
                    <Image
                      width={28}
                      height={28}
                      src={item.avatar}
                      alt=""
                      className="h-7 w-7 shrink-0 rounded-full border border-slate-700 object-cover"
                    />
                  ) : (
                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-slate-800 text-slate-400">
                      <Icon className="h-4 w-4" />
                    </span>
                  )}
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-xs font-semibold text-slate-100">
                      {item.title}
                    </span>
                    <span className="block truncate font-mono text-[10px] text-slate-500">
                      {item.subtitle}
                    </span>
                  </span>
                  {i === activeIndex && <CornerDownLeft className="h-3.5 w-3.5 text-indigo-400" />}
                </button>
              );
            })}
        </div>

        <div className="flex items-center gap-4 border-t border-slate-800 bg-slate-950/40 px-4 py-2 text-[10px] text-slate-500">
          <span className="flex items-center gap-1">
            <kbd className="rounded border border-slate-700 bg-slate-800 px-1.5 py-0.5 font-mono">↑</kbd>
            <kbd className="rounded border border-slate-700 bg-slate-800 px-1.5 py-0.5 font-mono">↓</kbd>
            navigate
          </span>
          <span className="flex items-center gap-1">
            <kbd className="rounded border border-slate-700 bg-slate-800 px-1.5 py-0.5 font-mono">↵</kbd>
            open
          </span>
          <span className="flex items-center gap-1">
            <kbd className="rounded border border-slate-700 bg-slate-800 px-1.5 py-0.5 font-mono">esc</kbd>
            close
          </span>
        </div>
      </div>
    </div>
  );
}
