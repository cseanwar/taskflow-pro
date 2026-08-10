'use client';

import { motion } from 'framer-motion';
import { CheckCircle2, TrendingUp } from 'lucide-react';
import type { ReactNode } from 'react';
import MiniAvatar from './MiniAvatar';
import { EASE, tilt1, tilt2 } from './motion';

function col(title: string, count: number, cards: ReactNode, accent?: string) {
  return (
    <div className="rounded-xl bg-[#f7f6fb] p-2">
      <div className="mb-2 flex items-center justify-between px-0.5">
        <span className="text-[9px] font-bold uppercase tracking-[0.08em] text-[#8b87a1]">{title}</span>
        <span className={`lp-mono rounded-md px-1.5 py-px text-[9px] font-bold ${accent || 'bg-white text-[#8b87a1]'}`}>
          {count}
        </span>
      </div>
      {cards}
    </div>
  );
}

function miniCard(id: string, title: string, chip: string, chipClass: string, done?: boolean) {
  return (
    <div
      className={`mb-2 rounded-lg border bg-white p-2 shadow-[0_1px_3px_rgba(25,28,30,0.06)] ${
        done ? 'opacity-70' : ''
      }`}
    >
      <div className="flex items-center justify-between">
        <span className={`rounded px-1.5 py-0.5 text-[8px] font-bold uppercase tracking-wide ${chipClass}`}>
          {chip}
        </span>
        <span className="lp-mono text-[8px] text-[#b3aebe]">{id}</span>
      </div>
      <p className={`mt-1.5 text-[10px] font-semibold leading-tight text-[#191c1e] ${done ? 'line-through' : ''}`}>
        {title}
      </p>
      <div className="mt-2 flex items-center justify-between">
        <div className="flex -space-x-1.5">
          <MiniAvatar bg="bg-[#3525cd]" initials="AM" />
          <MiniAvatar bg="bg-[#2f9e70]" initials="SK" />
          <MiniAvatar bg="bg-[#ff9f1c]" initials="JL" />
        </div>
        <span className="lp-mono text-[8px] font-bold text-[#2f9e70]">{done ? '✓ 4/4' : '3/4'}</span>
      </div>
    </div>
  );
}

export default function KanbanMockup() {
  return (
    <div className="relative">
      <div className="absolute -inset-10 rounded-[3rem] bg-linear-to-tr from-[#3525cd]/18 via-[#6cf8bb]/30 to-[#a855f7]/12 blur-2xl" />

      <div className="lp-float relative" style={tilt1}>
        <div className="relative overflow-hidden rounded-2xl border border-white/70 bg-white/95 p-3 shadow-[0_48px_100px_-32px_rgba(53,37,205,0.4)]">
          <div className="flex items-center gap-2 px-1.5 pb-3">
            <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]" />
            <span className="h-2.5 w-2.5 rounded-full bg-[#febc2e]" />
            <span className="h-2.5 w-2.5 rounded-full bg-[#28c840]" />
            <span className="lp-mono ml-3 flex-1 truncate rounded-md bg-[#f4f2fa] px-2 py-1 text-[9px] font-medium text-[#777587]">
              taskflow.pro / acme-web-redesign
            </span>
          </div>

          <div className="grid grid-cols-3 gap-2.5">
            {col(
              'To Do',
              3,
              <>
                {miniCard('TF-140', 'Revamp landing hero', 'High', 'bg-[#fff3ee] text-[#ff7a45]')}
                {miniCard('TF-141', 'Fix signup validation', 'Med', 'bg-[#fff8e0] text-[#e09b00]')}
              </>
            )}
            {col(
              'In Progress',
              2,
              <>
                {miniCard('TF-142', 'Design onboarding flow', 'High', 'bg-[#fff3ee] text-[#ff7a45]')}
                {miniCard('TF-139', 'API rate limiting', 'Urg', 'bg-[#ffeceb] text-[#e14b46]')}
              </>
            )}
            {col(
              'Done',
              2,
              <>
                {miniCard('TF-137', 'Set up CI/CD', 'Done', 'bg-[#e6faf0] text-[#2f9e70]', true)}
                {miniCard('TF-135', 'Migrate auth tokens', 'Done', 'bg-[#e6faf0] text-[#2f9e70]', true)}
              </>
            )}
          </div>

          <div className="mt-3 rounded-xl bg-[#f4f2fa] p-2.5">
            <div className="flex items-center justify-between">
              <span className="text-[9px] font-bold uppercase tracking-wide text-[#8b87a1]">Sprint 4 · Velocity</span>
              <span className="lp-mono text-[9px] font-bold text-[#3525cd]">62%</span>
            </div>
            <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-white">
              <div className="h-full w-[62%] rounded-full bg-linear-to-r from-[#3525cd] to-[#6cf8bb]" />
            </div>
          </div>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, x: -24 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 1.05, duration: 0.7, ease: EASE }}
        className="lp-float-slow absolute -left-6 top-16 z-10 hidden sm:block lg:-left-14"
        style={tilt2}
      >
        <div className="flex items-center gap-2.5 rounded-xl border border-[#e9e6f4] bg-white/95 p-3 pr-5 shadow-[0_24px_50px_-20px_rgba(47,158,112,0.45)]">
          <span className="grid h-8 w-8 place-items-center rounded-lg bg-[#e6faf0] text-[#2f9e70]">
            <CheckCircle2 className="h-4 w-4" strokeWidth={2.6} />
          </span>
          <div>
            <p className="text-[11px] font-bold text-[#191c1e]">Sprint 4 shipped</p>
            <p className="lp-mono text-[9px] text-[#8b87a1]">just now</p>
          </div>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, x: 24 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 1.25, duration: 0.7, ease: EASE }}
        className="lp-float-slow absolute -right-4 bottom-24 z-10 hidden sm:block lg:-right-12"
        style={tilt2}
      >
        <div className="flex items-center gap-2.5 rounded-xl border border-[#e9e6f4] bg-white/95 px-3.5 py-3 shadow-[0_24px_50px_-20px_rgba(53,37,205,0.4)]">
          <span className="grid h-8 w-8 place-items-center rounded-lg bg-[#3525cd]/10 text-[#3525cd]">
            <TrendingUp className="h-4 w-4" strokeWidth={2.4} />
          </span>
          <div>
            <p className="text-[11px] font-bold text-[#191c1e]">+12 tasks</p>
            <p className="lp-mono text-[9px] text-[#8b87a1]">this week</p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
