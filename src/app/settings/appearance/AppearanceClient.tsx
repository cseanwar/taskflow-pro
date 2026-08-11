"use client";

import { Sun, Moon, Monitor, Palette, MonitorSmartphone, Check } from "lucide-react";
import { useTheme, Theme } from "@/lib/theme";

const OPTIONS: { value: Theme; label: string; hint: string; icon: typeof Sun; swatch: string }[] = [
  {
    value: "light",
    label: "Light",
    hint: "Bright, airy surfaces for daylight work",
    icon: Sun,
    swatch: "bg-slate-100 border-slate-300",
  },
  {
    value: "dark",
    label: "Dark",
    hint: "Deep slate surfaces, low eye strain",
    icon: Moon,
    swatch: "bg-slate-900 border-slate-700",
  },
  {
    value: "system",
    label: "System",
    hint: "Automatically match your device theme",
    icon: Monitor,
    swatch: "bg-linear-to-br from-slate-100 via-slate-500 to-slate-950 border-slate-400",
  },
];

export default function AppearanceClient() {
  const { theme, setTheme, resolvedTheme } = useTheme();

  return (
    <div className="max-w-5xl space-y-5">
      <p className="text-xs leading-relaxed text-slate-500">
        Appearance preferences are stored on this device and follow you across sessions.
      </p>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
        {/* Theme segmented control */}
        <div className="rise rounded-2xl border border-slate-800 bg-slate-900/50 p-5 lg:col-span-2">
          <div className="flex items-center gap-2.5">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-600/15 text-indigo-400">
              <Palette className="h-4 w-4" />
            </span>
            <div>
              <h3 className="font-display text-sm font-bold text-white">Theme</h3>
              <p className="text-[11px] text-slate-500">Choose how TaskFlow Pro looks.</p>
            </div>
          </div>

          <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-3">
            {OPTIONS.map(opt => {
              const Icon = opt.icon;
              const active = theme === opt.value;
              return (
                <button
                  key={opt.value}
                  onClick={() => setTheme(opt.value)}
                  className={`group relative rounded-2xl border p-4 text-left transition ${
                    active
                      ? "border-indigo-500/50 bg-indigo-600/10 shadow-lg shadow-indigo-950/40"
                      : "border-slate-800 bg-slate-950/40 hover:border-slate-700 hover:bg-slate-950/70"
                  }`}
                >
                  {active && (
                    <span className="absolute top-3 right-3 flex h-5 w-5 items-center justify-center rounded-full bg-indigo-600 text-white">
                      <Check className="h-3 w-3" />
                    </span>
                  )}
                  <span
                    className={`block h-8 w-8 rounded-lg border ${opt.swatch} shadow-inner`}
                  />
                  <span className="mt-3 flex items-center gap-2 text-xs font-bold text-slate-100">
                    <Icon className={`h-4 w-4 ${active ? "text-indigo-400" : "text-slate-400"}`} />
                    {opt.label}
                  </span>
                  <span className="mt-1 block text-[10px] leading-relaxed text-slate-500">
                    {opt.hint}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Live preview */}
        <div className="rise rounded-2xl border border-slate-800 bg-slate-900/50 p-5" style={{ animationDelay: "80ms" }}>
          <div className="flex items-center gap-2.5">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-800/80 text-slate-300">
              <MonitorSmartphone className="h-4 w-4" />
            </span>
            <div>
              <h3 className="font-display text-sm font-bold text-white">Preview</h3>
              <p className="text-[11px] text-slate-500">
                {resolvedTheme === "light" ? "Light theme" : "Dark theme"}
              </p>
            </div>
          </div>

          <div className="mt-5 overflow-hidden rounded-xl border border-slate-800 shadow-2xl shadow-black/30">
            <div className="h-3 w-full bg-linear-to-r from-indigo-600 via-violet-500 to-indigo-500" />
            <div className="flex h-36">
              <div className="w-1/4 border-r border-slate-800 bg-slate-950/60 p-2">
                <div className="h-2.5 w-3/4 rounded bg-slate-800" />
                <div className="mt-2 h-2 w-full rounded bg-slate-800/60" />
                <div className="mt-1 h-2 w-5/6 rounded bg-slate-800/60" />
                <div className="mt-3 h-6 w-full rounded-lg bg-indigo-600/70" />
                <div className="mt-2 h-2 w-4/6 rounded bg-slate-800/60" />
              </div>
              <div className="flex-1 bg-slate-900 p-2.5">
                <div className="flex items-center justify-between">
                  <div className="h-2.5 w-1/3 rounded bg-slate-800" />
                  <div className="flex gap-1">
                    <div className="h-2 w-2 rounded-full bg-slate-700" />
                    <div className="h-2 w-2 rounded-full bg-slate-700" />
                    <div className="h-2 w-2 rounded-full bg-indigo-500" />
                  </div>
                </div>
                <div className="mt-3 grid grid-cols-3 gap-2">
                  <div className="h-10 rounded-lg border border-slate-800 bg-slate-950/50 p-1.5">
                    <div className="h-2 w-2/3 rounded bg-slate-800" />
                    <div className="mt-1.5 h-1.5 w-3/4 rounded bg-slate-800/60" />
                  </div>
                  <div className="h-10 rounded-lg border border-indigo-500/40 bg-indigo-600/10 p-1.5">
                    <div className="h-2 w-1/2 rounded bg-indigo-400/60" />
                    <div className="mt-1.5 h-1.5 w-3/4 rounded bg-slate-800/60" />
                  </div>
                  <div className="h-10 rounded-lg border border-slate-800 bg-slate-950/50 p-1.5">
                    <div className="h-2 w-2/3 rounded bg-slate-800" />
                    <div className="mt-1.5 h-1.5 w-3/4 rounded bg-slate-800/60" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
