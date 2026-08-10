'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import KanbanMockup from './KanbanMockup';
import { EASE, fadeUp } from './motion';

function TrustRow() {
  return (
    <div className="flex items-center gap-4">
      <div className="flex -space-x-2.5">
        <span className="grid h-9 w-9 place-items-center rounded-full border-2 border-[#fcf8ff] bg-[#3525cd] text-[10px] font-extrabold text-white">
          AM
        </span>
        <span className="grid h-9 w-9 place-items-center rounded-full border-2 border-[#fcf8ff] bg-[#2f9e70] text-[10px] font-extrabold text-white">
          SK
        </span>
        <span className="grid h-9 w-9 place-items-center rounded-full border-2 border-[#fcf8ff] bg-[#ff9f1c] text-[10px] font-extrabold text-white">
          JL
        </span>
        <span className="grid h-9 w-9 place-items-center rounded-full border-2 border-[#fcf8ff] bg-[#e14b46] text-[10px] font-extrabold text-white">
          DR
        </span>
      </div>
      <div>
        <div className="flex items-center gap-0.5 text-[#ff9f1c]">
          {[0, 1, 2, 3, 4].map((s) => (
            <svg key={s} viewBox="0 0 24 24" fill="currentColor" className="h-3.5 w-3.5">
              <path d="M12 2l2.9 6.26L21.5 9.3l-4.75 4.63L18 20.8 12 17.55 6 20.8l1.25-6.87L2.5 9.3l6.6-1.04z" />
            </svg>
          ))}
        </div>
        <p className="mt-0.5 text-[12px] text-[#8b87a1]">
          Loved by <span className="font-bold text-[#464555]">5,000+ teams</span> worldwide
        </p>
      </div>
    </div>
  );
}

export default function Hero({ user }: { user: boolean }) {
  return (
    <section className="lp-glow relative overflow-hidden pt-[132px] pb-16 sm:pt-[150px] sm:pb-24">
      <div className="mx-auto grid max-w-7xl items-center gap-14 px-6 lg:grid-cols-[1.05fr_0.95fr] lg:gap-10">
        <div>
          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="show"
            custom={1}
            className="inline-flex items-center gap-2.5 rounded-full border border-[#3525cd]/15 bg-white/80 py-1.5 pl-2 pr-4 shadow-sm backdrop-blur"
          >
            <span className="lp-pulse h-2 w-2 rounded-full bg-[#06965a]" />
            <span className="lp-mono text-[11px] font-semibold uppercase tracking-[0.08em] text-[#464555]">
              TaskFlow Pro 2.0 is live
            </span>
          </motion.div>

          <motion.h1
            variants={fadeUp}
            initial="hidden"
            animate="show"
            custom={2}
            className="mt-6 text-5xl font-black leading-[1.04] tracking-tight text-[#191c1e] sm:text-6xl lg:text-[64px]"
          >
            Project Management{' '}
            <span className="relative whitespace-nowrap">
              <span className="bg-linear-to-r from-[#3525cd] via-[#4f46e5] to-[#2f9e70] bg-clip-text text-transparent">
                Simplified.
              </span>
              <svg
                viewBox="0 0 300 12"
                className="absolute -bottom-2 left-0 w-full"
                fill="none"
                aria-hidden="true"
              >
                <path
                  d="M2 9C60 3 140 2 298 8"
                  stroke="#6cf8bb"
                  strokeWidth="5"
                  strokeLinecap="round"
                  opacity="0.9"
                />
              </svg>
            </span>
          </motion.h1>

          <motion.p
            variants={fadeUp}
            initial="hidden"
            animate="show"
            custom={3}
            className="mt-7 max-w-lg text-[16px] leading-relaxed text-[#464555]"
          >
            TaskFlow Pro brings unprecedented clarity to complex workflows — plan sprints, drag-and-drop tasks, and
            ship with total confidence.
          </motion.p>

          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="show"
            custom={4}
            className="mt-9 flex flex-wrap items-center gap-4"
          >
            <Link
              href={user ? '/dashboard' : '/register'}
              className="group flex items-center gap-2.5 rounded-xl bg-[#3525cd] px-7 py-3.5 text-sm font-extrabold text-white shadow-[0_18px_40px_-12px_rgba(53,37,205,0.6)] transition-all hover:-translate-y-0.5 hover:bg-[#2d1fb8] hover:shadow-[0_24px_50px_-12px_rgba(53,37,205,0.7)]"
            >
              {user ? 'Open Dashboard' : 'Get Started for Free'}
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
            <a
              href="#features"
              className="rounded-xl border border-[#dcd8ea] bg-white px-7 py-3.5 text-sm font-bold text-[#3525cd] transition-all hover:-translate-y-0.5 hover:border-[#3525cd]/40 hover:bg-[#f4f2fa]"
            >
              Explore Live Demo
            </a>
          </motion.div>

          <motion.div variants={fadeUp} initial="hidden" animate="show" custom={5} className="mt-12">
            <TrustRow />
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 44, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ delay: 0.35, duration: 0.9, ease: EASE }}
        >
          <KanbanMockup />
        </motion.div>
      </div>
    </section>
  );
}
