"use client";

import { useEffect, useRef, useState } from "react";
import { Sun, Moon, Monitor, Check } from "lucide-react";
import { useTheme, Theme } from "@/lib/theme";

const OPTIONS: { value: Theme; label: string; hint: string; icon: typeof Sun }[] = [
  { value: "light", label: "Light", hint: "Bright & crisp", icon: Sun },
  { value: "dark", label: "Dark", hint: "Easy on the eyes", icon: Moon },
  { value: "system", label: "System", hint: "Follow device", icon: Monitor },
];

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  const ActiveIcon = theme === "light" ? Sun : theme === "dark" ? Moon : Monitor;

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen(o => !o)}
        aria-label="Change theme"
        className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-800 bg-slate-950/60 text-slate-400 transition hover:border-slate-700 hover:text-slate-200"
      >
        <ActiveIcon className="h-4 w-4" />
      </button>

      {open && (
        <div className="absolute right-0 z-50 mt-2 w-44 overflow-hidden rounded-xl border border-slate-800 bg-slate-900 p-1 shadow-2xl">
          <p className="px-3 pt-2 pb-1 text-[10px] font-bold tracking-wider text-slate-500 uppercase">
            Appearance
          </p>
          {OPTIONS.map(opt => {
            const Icon = opt.icon;
            const active = theme === opt.value;
            return (
              <button
                key={opt.value}
                onClick={() => {
                  setTheme(opt.value);
                  setOpen(false);
                }}
                className={`flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-left text-xs font-semibold transition ${
                  active
                    ? "bg-indigo-600/15 text-indigo-300"
                    : "text-slate-300 hover:bg-slate-800 hover:text-white"
                }`}
              >
                <Icon className={`h-4 w-4 ${active ? "text-indigo-400" : "text-slate-400"}`} />
                <span className="flex-1">
                  {opt.label}
                  <span className="block text-[9px] font-medium text-slate-500">{opt.hint}</span>
                </span>
                {active && <Check className="h-3.5 w-3.5 text-indigo-400" />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
