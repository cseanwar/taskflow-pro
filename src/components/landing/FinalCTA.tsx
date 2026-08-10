'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { fadeUp } from './motion';

export default function FinalCTA({ user }: { user: boolean }) {
  return (
    <section id="cta" className="relative overflow-hidden px-6 py-24">
      <div className="absolute inset-0 bg-linear-to-br from-[#4f46e5] via-[#3525cd] to-[#2d1fb8]" />
      <div className="lp-sheen pointer-events-none absolute inset-0" />
      <div
        className="pointer-events-none absolute -left-24 top-1/2 h-96 w-96 -translate-y-1/2 rounded-full blur-3xl"
        style={{ background: 'rgba(108,248,187,0.35)' }}
      />
      <div
        className="pointer-events-none absolute -right-24 top-0 h-96 w-96 translate-y-1/4 rounded-full blur-3xl"
        style={{ background: 'rgba(255,255,255,0.12)' }}
      />

      <motion.div
        variants={fadeUp}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: '-80px' }}
        custom={0}
        className="relative mx-auto max-w-3xl text-center"
      >
        <p className="lp-mono text-[11px] font-medium uppercase tracking-[0.2em] text-[#b9f7d6]">
          No credit card required
        </p>
        <h2 className="mt-4 text-4xl font-black tracking-tight text-white sm:text-5xl">
          Ready to elevate your workflow?
        </h2>
        <p className="mx-auto mt-5 max-w-xl text-[15px] leading-relaxed text-[#dad7ff]">
          Join thousands of professional teams who trust TaskFlow Pro to plan, track, and ship their most important
          work.
        </p>

        <div className="mt-9 flex flex-wrap items-center justify-center gap-4">
          <Link
            href={user ? '/dashboard' : '/register'}
            className="group flex items-center gap-2 rounded-xl bg-white px-7 py-3.5 text-sm font-extrabold text-[#3525cd] shadow-[0_20px_45px_-12px_rgba(0,0,0,0.35)] transition-all hover:-translate-y-0.5 hover:shadow-[0_26px_55px_-12px_rgba(0,0,0,0.45)]"
          >
            {user ? 'Open Dashboard' : 'Get Started for Free'}
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
          <a
            href="#features"
            className="rounded-xl border border-white/35 px-7 py-3.5 text-sm font-bold text-white transition-colors hover:border-white hover:bg-white/10"
          >
            Contact Sales
          </a>
        </div>
      </motion.div>
    </section>
  );
}
