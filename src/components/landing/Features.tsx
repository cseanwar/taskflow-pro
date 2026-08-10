'use client';

import { motion } from 'framer-motion';
import { ArrowRight, BarChart3, Kanban, MessageSquare, MousePointer2, TrendingUp, Zap } from 'lucide-react';
import MiniAvatar from './MiniAvatar';
import { fadeUp } from './motion';

function SectionHeading() {
  return (
    <motion.div
      variants={fadeUp}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: '-80px' }}
      custom={0}
      className="mx-auto max-w-2xl text-center"
    >
      <p className="lp-mono text-[11px] font-medium uppercase tracking-[0.2em] text-[#3525cd]">Capabilities</p>
      <h2 className="mt-3 text-4xl font-black tracking-tight text-[#191c1e] sm:text-5xl">Tools for Power Users</h2>
      <p className="mt-4 text-[15px] leading-relaxed text-[#464555]">
        Everything you need to orchestrate complex projects without the chaos — engineered for clarity, speed, and
        relentless collaboration.
      </p>
    </motion.div>
  );
}

export default function Features() {
  return (
    <section id="features" className="relative mx-auto max-w-7xl px-6 py-24 sm:py-28">
      <SectionHeading />

      <div className="mt-14 grid gap-6 md:grid-cols-3">
        {/* Card 1 — Kanban */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '-80px' }}
          custom={1}
          className="lp-card p-7"
        >
          <div className="flex items-center gap-3">
            <span className="grid h-11 w-11 place-items-center rounded-xl bg-[#4f46e5] text-white shadow-[0_12px_24px_-8px_rgba(79,70,229,0.55)]">
              <Kanban className="h-5 w-5" strokeWidth={2.2} />
            </span>
            <h3 className="text-lg font-extrabold tracking-tight text-[#191c1e]">Fluid Kanban Boards</h3>
          </div>
          <p className="mt-4 text-[13px] leading-relaxed text-[#464555]">
            Organize tasks with drag-and-drop precision. Our boards scale from quick personal backlogs to company-wide
            delivery pipelines.
          </p>
          <div className="mt-6 grid grid-cols-4 gap-1.5">
            {['Backlog', 'To Do', 'In Progress', 'Done'].map((c, idx) => (
              <div key={c} className="rounded-lg bg-[#f7f6fb] p-1.5">
                <p className="lp-mono text-center text-[8px] font-bold uppercase tracking-wide text-[#8b87a1]">{c}</p>
                <div className="mt-1.5 space-y-1.5">
                  {[0, 1].map((d) => (
                    <div
                      key={d}
                      className={`h-4 rounded ${idx === 3 ? 'bg-[#6cf8bb]/70' : 'bg-white shadow-[0_1px_2px_rgba(25,28,30,0.08)]'} ${
                        idx === 2 && d === 0 ? 'ring-2 ring-[#3525cd]' : ''
                      }`}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Card 2 — Collab */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '-80px' }}
          custom={2}
          className="lp-card p-7"
        >
          <div className="flex items-center gap-3">
            <span className="grid h-11 w-11 place-items-center rounded-xl bg-[#6cf8bb] text-[#0d6b46] shadow-[0_12px_24px_-8px_rgba(20,184,116,0.5)]">
              <Zap className="h-5 w-5" strokeWidth={2.2} />
            </span>
            <h3 className="text-lg font-extrabold tracking-tight text-[#191c1e]">Real-time Collab</h3>
          </div>
          <p className="mt-4 text-[13px] leading-relaxed text-[#464555]">
            See updates instantly. Cursor tracking and live editing ensure everyone on the team is always in sync.
          </p>
          <div className="mt-6 space-y-2">
            <div className="flex items-center gap-2.5 rounded-xl border border-[#e9e6f4] bg-white p-2.5 shadow-sm">
              <div className="flex -space-x-2">
                <MiniAvatar bg="bg-[#3525cd]" initials="AM" />
                <MiniAvatar bg="bg-[#2f9e70]" initials="SK" />
                <MiniAvatar bg="bg-[#ff9f1c]" initials="JL" />
                <MiniAvatar bg="bg-[#e14b46]" initials="DR" />
              </div>
              <span className="text-[11px] font-semibold text-[#464555]">
                <span className="font-extrabold text-[#191c1e]">Sofia</span> is editing…
              </span>
              <MousePointer2 className="ml-auto h-4 w-4 text-[#3525cd]" />
            </div>
            <div className="flex items-start gap-2.5 rounded-xl border border-[#e9e6f4] bg-[#f4f2fa] p-3">
              <MessageSquare className="mt-0.5 h-4 w-4 shrink-0 text-[#3525cd]" />
              <p className="text-[11px] leading-relaxed text-[#464555]">
                <span className="font-extrabold text-[#191c1e]">Marc</span> moved TF-142 to In Progress 🚀
              </p>
            </div>
          </div>
        </motion.div>

        {/* Card 3 — Analytics */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '-80px' }}
          custom={3}
          className="lp-card p-7"
        >
          <div className="flex items-center gap-3">
            <span className="grid h-11 w-11 place-items-center rounded-xl bg-[#4b4dd8] text-white shadow-[0_12px_24px_-8px_rgba(75,77,216,0.55)]">
              <BarChart3 className="h-5 w-5" strokeWidth={2.2} />
            </span>
            <h3 className="text-lg font-extrabold tracking-tight text-[#191c1e]">Comprehensive Analytics</h3>
          </div>
          <p className="mt-4 text-[13px] leading-relaxed text-[#464555]">
            Dive deep into team velocity, resource allocation, and project health with charts that make decisions
            obvious.
          </p>
          <div className="mt-6 rounded-xl border border-[#e9e6f4] bg-white p-4 shadow-sm">
            <div className="flex items-end gap-2" style={{ height: 84 }}>
              {[42, 68, 50, 88, 58, 100, 74].map((h, i) => (
                <div key={i} className="flex-1">
                  <div
                    className={`lp-bar rounded-t-md ${i === 5 ? 'bg-linear-to-t from-[#3525cd] to-[#6cf8bb]' : 'bg-[#ddd9ec]'}`}
                    style={{ height: `${h}%`, animationDelay: `${0.15 + i * 0.08}s` }}
                  />
                </div>
              ))}
            </div>
            <div className="mt-2 flex items-center justify-between border-t border-[#eef0f4] pt-2">
              <span className="lp-mono text-[9px] text-[#8b87a1]">velocity / 7d</span>
              <span className="flex items-center gap-1 text-[10px] font-bold text-[#2f9e70]">
                <TrendingUp className="h-3 w-3" /> 18%
              </span>
            </div>
          </div>
          <a
            href="#cta"
            className="group mt-5 inline-flex items-center gap-1.5 text-[13px] font-bold text-[#3525cd] transition-colors hover:text-[#2d1fb8]"
          >
            Explore reports
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </a>
        </motion.div>
      </div>
    </section>
  );
}
